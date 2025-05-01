
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { AIChatMessage } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';

const Chat = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  
  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: AIChatMessage = {
      id: '0',
      message: "שלום! אני טאטע, עוזר וירטואלי בנושאי יהדות, מסורת, הלכה ואמונה. במה אוכל לסייע לך היום?",
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, []);

  const askTatae = async (question: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ask-tatae', {
        body: { question }
      });

      if (error) {
        throw new Error(error.message || 'טעות בשרת: אנא נסה שוב מאוחר יותר');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.answer;
    } catch (error) {
      console.error('Error calling ask-tatae function:', error);
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: askTatae,
    onMutate: (question) => {
      // Optimistically add user message to chat
      const userMessage: AIChatMessage = {
        id: Date.now().toString(),
        message: question,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
    },
    onSuccess: (answer) => {
      // Add AI response when we get it
      const aiResponse: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        message: answer,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    },
    onError: (error) => {
      toast({
        title: "שגיאה",
        description: error instanceof Error ? error.message : 'טעות בשרת: אנא נסה שוב מאוחר יותר',
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (message: string) => {
    if (message.trim().length < 2) {
      toast({
        title: "שגיאה",
        description: "שאלה לא יכולה להיות ריקה או קצרה מדי",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(message);
  };

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">שאל את טאטע</h1>
        <p className="text-spiritual-dark mt-2">שאל שאלות על אמונה, תורה ויהדות</p>
      </div>

      <Card className="spiritual-card h-[60vh] flex flex-col">
        <CardHeader>
          <CardTitle>שיחה עם טאטע</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
          <MessageList 
            messages={messages} 
            isLoading={mutation.isPending} 
          />
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={mutation.isPending} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
