
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { AIChatMessage } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageListProps {
  messages: AIChatMessage[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-grow overflow-y-auto flex flex-col p-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg.message}
          isUser={msg.sender === 'user'}
          timestamp={msg.timestamp}
        />
      ))}
      
      {isLoading && (
        <div className="flex max-w-[80%] mb-3">
          <div className="rounded-lg px-4 py-2 bg-spiritual-light">
            <p className="text-spiritual-dark">טאטע חושב...</p>
            <div className="flex gap-1 mt-1">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse delay-100">.</span>
              <span className="animate-pulse delay-200">.</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
