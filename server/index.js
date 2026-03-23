import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import videoHandler from './socket/videoHandler.js';

const app = express();
const server = http.createServer(app);

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Initialize Socket.io with CORS for the React frontend
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://your-ip-address:3000"], // Adjust for production
    methods: ["GET", "POST"]
  }
});

// 3. Main Socket Connection Logic
io.on('connection', (socket) => {
  console.log('⚡ New Connection:', socket.id);

  // User-specific room for global notifications/chat
  socket.on('join_chat', (userId) => {
    socket.join(userId);
    console.log(`[Chat] User ${userId} joined their private notification channel`);
  });

  // Load the Video Signaling module
  videoHandler(io, socket);
});

// 4. Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 SkillSphere Server running on port ${PORT}`);
});