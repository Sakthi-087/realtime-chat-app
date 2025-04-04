import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true, // Optional if using cookies
  },
});

// Used to store online users
const userSocketMap = {}; // {userId: [socketId, socketId]}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Now returns array of socketIds
}

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.auth.userId; // Safer: use auth object

  // Track socket connections per user
  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
  }

  // Emit updated online users to all
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    // Remove disconnected socket
    for (const [user, sockets] of Object.entries(userSocketMap)) {
      userSocketMap[user] = sockets.filter((id) => id !== socket.id);
      if (userSocketMap[user].length === 0) {
        delete userSocketMap[user]; // No active sockets left
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server, userSocketMap };
