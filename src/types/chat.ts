export interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: Date;
  roomId: string;
}

export interface User {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ChatState {
  messages: Message[];
  users: User[];
  currentUser: User | null;
  currentRoom: string;
  isConnected: boolean;
  
  setCurrentUser: (user: User) => void;
  addMessage: (message: Message) => void;
  setUsers: (users: User[]) => void;
  setConnectionStatus: (status: boolean) => void;
  setCurrentRoom: (roomId: string) => void;
  clearChat: () => void;
}