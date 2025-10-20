import { create } from "zustand";
import { ChatState, Message, User } from "../types/chat";

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  users: [],
  currentUser: null,
  currentRoom: "general",
  isConnected: false,

  setCurrentUser: (user: User) => set({ currentUser: user }),

  addMessage: (message: Message) =>
    set((state) => {
      const messageExists = state.messages.some((m) => m.id === message.id);
      if (messageExists) {
        return state;
      }
      return {
        messages: [...state.messages, message],
      };
    }),

  setUsers: (users: User[]) => set({ users }),

  setConnectionStatus: (status: boolean) => set({ isConnected: status }),

  setCurrentRoom: (roomId: string) => set({ currentRoom: roomId }),

  clearChat: () => set({ messages: [] }),
}));
