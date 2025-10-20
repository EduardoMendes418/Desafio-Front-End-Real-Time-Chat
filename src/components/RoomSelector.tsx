import React from 'react';
import { useChat } from '../hooks/useChat';

export const RoomSelector: React.FC = () => {
  const { currentRoom, switchRoom, isConnected } = useChat();
  
  const rooms = [
    { id: 'general', name: '💬 General' },
    { id: 'random', name: '🎲 Random' },
    { id: 'help', name: '❓ Help' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 p-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Rooms:</span>
        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => switchRoom(room.id)}
            disabled={!isConnected}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentRoom === room.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {room.name}
          </button>
        ))}
      </div>
    </div>
  );
};