import React from 'react';
import { Message as MessageType } from '../types/chat';
import { useChat } from '../hooks/useChat';
import { formatTime } from '../utils/helpers';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { currentUser } = useChat();
  const isOwnMessage = message.userId === currentUser?.id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}>
      {!isOwnMessage && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
          {message.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
        }`}
      >
        {!isOwnMessage && (
          <div className="text-xs font-semibold text-primary-600 mb-1">
            {message.username}
          </div>
        )}
        <div className="text-sm break-words leading-relaxed">{message.text}</div>
        <div
          className={`text-xs mt-2 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
      {isOwnMessage && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2">
          {currentUser?.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};