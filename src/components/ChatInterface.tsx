import React from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { RoomSelector } from './RoomSelector'; 

export const ChatInterface: React.FC = () => {
  const { currentUser, isConnected, logout } = useChat();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">

      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <div className="text-white font-bold text-lg">💬</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Real-time Chat</h1>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs">👤</span>
              </div>
              <span className="text-sm font-semibold">
                {currentUser?.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

 
      <RoomSelector />


      <div className="flex-1 flex overflow-hidden">

        <div className="flex-1 flex flex-col">
          <MessageList />
          <MessageInput />
        </div>
      </div>
    </div>
  );
};