const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const rooms = new Map();
const users = new Map();

const getRoomUsers = (roomId) => {
  if (!rooms.has(roomId)) return [];
  return Array.from(rooms.get(roomId))
    .map((userId) => users.get(userId))
    .filter(Boolean);
};

io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, user }) => {
    try {
      // Sai de todas as outras salas
      const roomsToLeave = Array.from(socket.rooms).filter(
        (room) => room !== socket.id
      );
      roomsToLeave.forEach((room) => socket.leave(room));

      socket.join(roomId);

      // Cria a sala se não existir
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      // Remove usuário de outras salas
      for (const [existingRoomId, userSet] of rooms.entries()) {
        if (existingRoomId !== roomId) {
          userSet.delete(user.id);
        }
      }

      // Adiciona usuário à sala atual
      rooms.get(roomId).add(user.id);
      users.set(user.id, {
        ...user,
        socketId: socket.id,
        joinedAt: new Date(),
        currentRoom: roomId,
      });

      console.log(`✅ ${user.username} joined room: ${roomId}`);

      // Envia lista atualizada de usuários
      const roomUsers = getRoomUsers(roomId);
      io.to(roomId).emit("users", roomUsers);

      // Notifica todos os outros usuários da entrada (evita duplicação)
      socket.to(roomId).emit("systemMessage", {
        message: `${user.username} joined the room`,
        type: "join",
        user: user,
      });

      // Mensagem de boas-vindas apenas para o usuário que entrou
      socket.emit("systemMessage", {
        message: `Welcome to ${roomId} room!`,
        type: "welcome",
      });
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "Failed to join room");
    }
  });

  socket.on("sendMessage", (messageData) => {
    try {
      const message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        ...messageData,
        timestamp: new Date(),
      };

      console.log(
        `💬 ${message.username} in ${message.roomId}: ${message.text}`
      );
      io.to(messageData.roomId).emit("message", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("leaveRoom", ({ roomId, user }) => {
    try {
      socket.leave(roomId);

      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(user.id);
      }

      users.delete(user.id);

      console.log(`👋 ${user.username} left room: ${roomId}`);

      const roomUsers = getRoomUsers(roomId);
      io.to(roomId).emit("users", roomUsers);

      socket.to(roomId).emit("systemMessage", {
        message: `${user.username} left the room`,
        type: "leave",
        user: user,
      });
    } catch (error) {
      console.error("Error leaving room:", error);
      socket.emit("error", "Failed to leave room");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ User disconnected:", socket.id, reason);

    for (const [roomId, userSet] of rooms.entries()) {
      let foundUser = null;

      for (const userId of userSet) {
        const user = users.get(userId);
        if (user && user.socketId === socket.id) {
          foundUser = user;
          userSet.delete(userId);
          break;
        }
      }

      if (foundUser) {
        users.delete(foundUser.id);

        const roomUsers = getRoomUsers(roomId);
        io.to(roomId).emit("users", roomUsers);

        socket.to(roomId).emit("systemMessage", {
          message: `${foundUser.username} disconnected`,
          type: "leave",
          user: foundUser,
        });
      }
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount,
    rooms: Array.from(rooms.keys()),
    users: users.size,
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
