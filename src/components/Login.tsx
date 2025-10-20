import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-white text-2xl">💬</div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Chat
          </h1>
          <p className="text-white/80">
            Enter your username to start chatting
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm"
              placeholder="Enter your username"
              maxLength={20}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-white text-primary-600 py-3 px-4 rounded-xl hover:bg-gray-100 focus:ring-2 focus:ring-white focus:ring-offset-2 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <span>Join Chat</span>
            <span>→</span>
          </button>
        </form>
      </div>
    </div>
  );
};