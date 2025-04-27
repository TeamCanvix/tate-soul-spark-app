
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIChatMessage } from '@/types';
import { Send } from 'lucide-react';

// Sample responses for the mock AI chat
const sampleResponses = [
  "זהו נושא מעניין מאוד. בתורה אנו מוצאים שהקב\"ה מלווה אותנו בכל צעד ובכל שעל. כפי שכתוב בתהילים, 'שִׁוִּיתִי ה' לְנֶגְדִּי תָמִיד'. האם יש עוד דברים שתרצה לשאול על נושא זה?",
  "לפי המסורת היהודית, תפילה היא עבודת הלב שמחברת אותנו לקב\"ה. חז\"ל אומרים שתפילה עומדת ברומו של עולם. האם יש לך שאלות ספציפיות על כיצד להתפלל או על משמעות התפילה?",
  "האמונה בקב\"ה היא אחד מיסודות היהדות. הרמב\"ם מונה את האמונה במציאות ה' כמצווה הראשונה. האמונה מספקת לנו כוח ותקווה בזמנים קשים ומאפשרת לנו להבין שהכל לטובה, גם כשאיננו רואים זאת באופן מיידי.",
  "שאלה מצוינת! לפי המסורת היהודית, רצון ה' מתגלה דרך התורה והמצוות. כשאנו לומדים תורה ומקיימים מצוות אנו מתקרבים להבנת רצונו. תפילה, התבוננות והתייעצות עם רב או מורה רוחני יכולים לעזור לנו להבין טוב יותר את רצון ה' בחיינו.",
  "התשובה לשאלתך נמצאת במסורת העשירה של לימוד התורה. כשאנו מעמיקים בלימוד ומחברים את החכמה העתיקה לחיינו היום, אנו מוצאים הנחיה והשראה. יש לך שאלות נוספות על נושא זה?"
];

const Chat = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Function to generate a random chat message
  const getRandomResponse = () => {
    const randomIndex = Math.floor(Math.random() * sampleResponses.length);
    return sampleResponses[randomIndex];
  };
  
  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: AIChatMessage = {
      id: '0',
      message: "שלום! אני כאן כדי לעזור לך בשאלות על אמונה, תורה ויהדות. במה אוכל לסייע לך היום?",
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      message: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getRandomResponse(),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">צ'אט רוחני</h1>
        <p className="text-spiritual-dark mt-2">שאל שאלות על אמונה, תורה ויהדות</p>
      </div>

      <Card className="spiritual-card h-[60vh] flex flex-col">
        <CardHeader>
          <CardTitle>שיחה עם טאטע</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto flex flex-col space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-spiritual-secondary text-white'
                    : 'bg-spiritual-light'
                }`}
              >
                <p>{msg.message}</p>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-spiritual-light">
                <p className="flex gap-1">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse delay-100">.</span>
                  <span className="animate-pulse delay-200">.</span>
                </p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="הקלד את שאלתך כאן..."
              className="rtl"
            />
            <Button type="submit" disabled={!newMessage.trim() || isTyping} size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">שלח</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
