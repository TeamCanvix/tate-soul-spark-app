
import React from 'react';
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, timestamp }) => {
  return (
    <div
      className={cn(
        "flex max-w-[80%] mb-3",
        isUser ? "mr-auto" : "ml-auto"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2",
          isUser ? "bg-spiritual-light text-spiritual-dark" : "bg-spiritual-secondary text-white"
        )}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        <div
          className={cn(
            "text-xs mt-1",
            isUser ? "text-gray-500" : "text-white/70"
          )}
        >
          {timestamp.toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
