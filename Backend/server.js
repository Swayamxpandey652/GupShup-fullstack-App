import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import pool from './db/mysql.js';

dotenv.config();
const FRONTEND_ORIGIN = "http://localhost:5173";

const app = express();
const server = http.createServer(app); // instead of app.listen()

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    credentials: true,// ✅ Allow cookies/header// frontend Vite server
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Gupshup 2.0 backend is running');
});

// Socket.IO logic
// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // When a user starts typing
   // Handle "typing" event
  socket.on("typing", ({ senderId, receiverId }) => {
    console.log(`🟡 Typing from ${senderId} to ${receiverId}`);  // ← Add this line
    io.to(receiverId).emit("typing", { senderId });
  });

  // Handle "stop-typing" event
  socket.on("stop-typing", ({ senderId, receiverId }) => {
    console.log(`✋ Stop typing from ${senderId} to ${receiverId}`);
    io.to(receiverId).emit("stop-typing", { senderId });
  });

  // ✅ Join room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // ✅ On message send
  socket.on("send-message", ({ senderId, receiverId, message }) => {
    console.log(`🚀 Message from ${senderId} to ${receiverId} => ${message}`); // 👈 this must show!

    // Send to receiver
    io.to(receiverId).emit("receive-message", {
      senderId,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
