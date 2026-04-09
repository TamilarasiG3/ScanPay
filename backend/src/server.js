import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { setIo } from './services/socket.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL }
  });

  io.on('connection', (socket) => {
    socket.on('admin:join', (adminId) => {
      socket.join(`admin:${adminId}`);
    });
  });

  setIo(io);

  server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

start();
