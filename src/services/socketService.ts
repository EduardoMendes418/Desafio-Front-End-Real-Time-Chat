import io, { Socket } from "socket.io-client";
import { Message, User } from "../types/chat";

class SocketService {
  public socket: Socket | null = null;
  private isConnecting: boolean = false;

  connect(serverUrl: string) {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    console.log("🔄 Connecting to server...");

    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Connected to server with ID:", this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error);
      this.isConnecting = false;
    });

    this.socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}`);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("🔴 Reconnection failed");
      this.isConnecting = false;
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  onMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on("message", callback);
    }
  }

  offMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.off("message", callback);
    }
  }

  onUsersUpdate(callback: (users: User[]) => void) {
    if (this.socket) {
      this.socket.on("users", callback);
    }
  }

  offUsersUpdate(callback: (users: User[]) => void) {
    if (this.socket) {
      this.socket.off("users", callback);
    }
  }

  onEvent(eventName: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  offEvent(eventName: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  sendMessage(message: Message) {
    if (this.socket?.connected) {
      console.log("📤 Emitting message to server:", message);
      this.socket.emit("sendMessage", message);
      return true;
    } else {
      console.error("Cannot send message: socket not connected");
      return false;
    }
  }

  joinRoom(roomId: string, user: User) {
    if (this.socket?.connected) {
      console.log(`🚪 Joining room: ${roomId} as ${user.username}`);
      this.socket.emit("joinRoom", { roomId, user });
      return true;
    } else {
      console.error("Cannot join room: socket not connected");
      return false;
    }
  }

  leaveRoom(roomId: string, user: User) {
    if (this.socket?.connected) {
      console.log(`🚪 Leaving room: ${roomId} as ${user.username}`);
      this.socket.emit("leaveRoom", { roomId, user });
      return true;
    } else {
      console.error("Cannot leave room: socket not connected");
      return false;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
