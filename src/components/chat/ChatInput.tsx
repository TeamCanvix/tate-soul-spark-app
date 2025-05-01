
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim().length >= 2) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t flex gap-2"
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="מה תרצה לשאול את טאטע היום?"
        className="rtl"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        disabled={message.trim().length < 2 || isLoading} 
        size="icon"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">שאל</span>
      </Button>
    </form>
  );
};

export default ChatInput;
