import { useEffect, useState, useCallback, useRef } from "react";
import { useChatStore } from "../stores/chatStore";
import { Message, User } from "../types/chat";
import { generateId } from "../utils/helpers";
import { socketService } from "../services/socketService";

export const useChat = () => {
  const {
    messages,
    users,
    currentUser,
    currentRoom,
    isConnected,
    addMessage,
    setUsers,
    setCurrentUser,
    setCurrentRoom,
    setConnectionStatus,
    clearChat,
  } = useChatStore();

  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectionAttemptRef = useRef<number>(0);
  const messageHandlerRef = useRef<(message: Message) => void>();
  const usersHandlerRef = useRef<(users: User[]) => void>();
  const userJoinedHandlerRef = useRef<(data: any) => void>();
  const userLeftHandlerRef = useRef<(data: any) => void>();

  if (!messageHandlerRef.current) {
    messageHandlerRef.current = (message: Message) => {
      console.log("📨 Received message:", message);
      addMessage(message);
    };
  }

  if (!usersHandlerRef.current) {
    usersHandlerRef.current = (updatedUsers: User[]) => {
      console.log("👥 Users updated:", updatedUsers);
      setUsers(updatedUsers);
    };
  }

  if (!userJoinedHandlerRef.current) {
    userJoinedHandlerRef.current = (data: any) => {
      console.log("👋 User joined:", data);
      const systemMessage: Message = {
        id: `system-${Date.now()}-${Math.random()}`,
        text: data.message,
        userId: "system",
        username: "System",
        timestamp: new Date(),
        roomId: currentRoom,
      };
      addMessage(systemMessage);
    };
  }

  if (!userLeftHandlerRef.current) {
    userLeftHandlerRef.current = (data: any) => {
      console.log("👋 User left:", data);
      const systemMessage: Message = {
        id: `system-${Date.now()}-${Math.random()}`,
        text: data.message,
        userId: "system",
        username: "System",
        timestamp: new Date(),
        roomId: currentRoom,
      };
      addMessage(systemMessage);
    };
  }

  const setupSocketListeners = useCallback(() => {
    if (!socketService.socket) return;

    if (messageHandlerRef.current) {
      socketService.offMessage(messageHandlerRef.current);
    }
    if (usersHandlerRef.current) {
      socketService.offUsersUpdate(usersHandlerRef.current);
    }
    if (userJoinedHandlerRef.current) {
      socketService.offEvent("userJoined", userJoinedHandlerRef.current);
    }
    if (userLeftHandlerRef.current) {
      socketService.offEvent("userLeft", userLeftHandlerRef.current);
    }

    if (messageHandlerRef.current) {
      socketService.onMessage(messageHandlerRef.current);
    }
    if (usersHandlerRef.current) {
      socketService.onUsersUpdate(usersHandlerRef.current);
    }
    if (userJoinedHandlerRef.current) {
      socketService.onEvent("userJoined", userJoinedHandlerRef.current);
    }
    if (userLeftHandlerRef.current) {
      socketService.onEvent("userLeft", userLeftHandlerRef.current);
    }

    socketService.onEvent("connect", () => {
      console.log("✅ Socket connected in useChat");
      setConnectionStatus(true);
      setConnectionError(null);
      connectionAttemptRef.current = 0;

      if (currentUser) {
        setTimeout(() => {
          socketService.joinRoom(currentRoom, currentUser);
        }, 500);
      }
    });

    socketService.onEvent("disconnect", () => {
      console.log("❌ Socket disconnected in useChat");
      setConnectionStatus(false);
    });

    socketService.onEvent("connect_error", (error) => {
      console.error("Connection error in useChat:", error);
      setConnectionStatus(false);
      connectionAttemptRef.current++;

      if (connectionAttemptRef.current >= 3) {
        setConnectionError(
          "Failed to connect to server after multiple attempts"
        );
      } else {
        setConnectionError("Connection failed, retrying...");
      }
    });
  }, [addMessage, setUsers, setConnectionStatus]);

  useEffect(() => {
    console.log("🔄 useChat useEffect running...");

    socketService.connect("http://localhost:3001");

    setupSocketListeners();

    return () => {
      console.log("🧹 useChat cleanup");
    };
  }, [setupSocketListeners]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!currentUser || !text.trim()) {
        console.log("Cannot send message: no user or empty text");
        return false;
      }

      if (!socketService.isConnected()) {
        console.log("Cannot send message: socket not connected");
        setConnectionError("Not connected to server");
        return false;
      }

      const message: Message = {
        id: generateId(),
        text: text.trim(),
        userId: currentUser.id,
        username: currentUser.username,
        timestamp: new Date(),
        roomId: currentRoom,
      };

      console.log("📤 Sending message:", message);
      const success = socketService.sendMessage(message);

      if (!success) {
        setConnectionError("Failed to send message");
      }

      return success;
    },
    [currentUser, currentRoom]
  );

  const login = useCallback(
    (username: string) => {
      const user: User = {
        id: generateId(),
        username: username.trim(),
        isOnline: true,
      };

      setCurrentUser(user);
      clearChat();
      setConnectionError(null);

      setTimeout(() => {
        if (socketService.isConnected()) {
          socketService.joinRoom(currentRoom, user);
        } else {
          console.log("Socket not connected, will join room when connected");
        }
      }, 100);

      return user;
    },
    [setCurrentUser, clearChat, currentRoom]
  );

  const logout = useCallback(() => {
    if (currentUser && socketService.isConnected()) {
      socketService.leaveRoom(currentRoom, currentUser);
    }
    //setCurrentUser(null);
    clearChat();
    setConnectionError(null);
  }, [currentUser, currentRoom, setCurrentUser, clearChat]);

  const switchRoom = useCallback(
    (roomId: string) => {
      if (currentUser && socketService.isConnected()) {
        socketService.leaveRoom(currentRoom, currentUser);

        clearChat();

        setCurrentRoom(roomId);

        setTimeout(() => {
          socketService.joinRoom(roomId, currentUser);
        }, 100);
      } else {
        setCurrentRoom(roomId);
        clearChat();
      }
    },
    [currentUser, currentRoom, setCurrentRoom, clearChat]
  );

  return {
    messages: messages.filter((msg) => msg.roomId === currentRoom),
    users,
    currentUser,
    currentRoom,
    isConnected,
    connectionError,
    sendMessage,
    login,
    logout,
    switchRoom,
  };
};
