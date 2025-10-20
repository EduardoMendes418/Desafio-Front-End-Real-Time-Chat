import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, isConnected } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-200/60 p-6 bg-white/80 backdrop-blur-lg">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 shadow-sm pr-24"
            maxLength={500}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {message.length}/500
          </div>
        </div>
        <button
          type="submit"
          disabled={!message.trim() || !isConnected}
          className="px-6 py-3 bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-xl hover:from-primary-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg font-semibold flex items-center justify-center gap-2"
        >
          <span>Send</span>
          <span className="text-sm">↑</span>
        </button>
      </form>
    </div>
  );
};