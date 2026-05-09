/**
 * Socket.IO Server Setup
 * Attaches Socket.IO to the HTTP server and registers event handlers.
 */
const { Server } = require('socket.io');
const { registerLabHandlers } = require('./labHandlers');

function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Register all lab event handlers
    registerLabHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('[Socket] Socket.IO server initialized');
  return io;
}

module.exports = { setupSocket };
