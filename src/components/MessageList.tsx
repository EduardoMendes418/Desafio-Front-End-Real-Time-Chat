import React, { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { Message } from './Message';

export const MessageList: React.FC = () => {
  const { messages, currentRoom } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const currentRoomMessages = messages.filter(message => message.roomId === currentRoom);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100 scrollbar-thin">
      {currentRoomMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
            <div className="text-3xl">💬</div>
          </div>
          <p className="text-lg font-medium text-gray-500">No messages yet</p>
          <p className="text-sm text-gray-400">Start the conversation!</p>
        </div>
      ) : (
        currentRoomMessages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
