/**
 * Socket.IO Lab Handlers — Room-based physics synchronization.
 * Manages room state, body sync, cursor broadcast, and sim controls.
 */

// In-memory room state store
// Map<roomId, { worldState, users[], isPlaying }>
const rooms = new Map();

// User color palette for cursors
const COLORS = [
  '#6c5ce7', '#00cec9', '#fdcb6e', '#ff6b6b', '#fd79a8',
  '#a29bfe', '#55efc4', '#fab1a0', '#74b9ff', '#e17055',
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      worldState: {
        gravity: { x: 0, y: 1 },
        bodies: [],
        constraints: [],
      },
      users: [],
      isPlaying: false,
    });
  }
  return rooms.get(roomId);
}

function registerLabHandlers(io, socket) {
  // ─── Room Join ───────────────────────────────────────────────
  socket.on('room:join', ({ roomId, userId, displayName }) => {
    if (!roomId || !userId) return;

    // Leave any previous rooms
    const previousRooms = [...socket.rooms].filter((r) => r !== socket.id);
    previousRooms.forEach((r) => socket.leave(r));

    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.userId = userId;
    socket.data.displayName = displayName || 'Anonymous';

    const room = getOrCreateRoom(roomId);
    const color = getRandomColor();

    // Add user to room state
    const existingIdx = room.users.findIndex((u) => u.userId === userId);
    if (existingIdx >= 0) {
      room.users[existingIdx].color = color;
    } else {
      room.users.push({ userId, displayName: displayName || 'Anonymous', color });
    }

    // Send current room state to joining user
    socket.emit('room:state', {
      worldState: room.worldState,
      users: room.users,
    });

    // Notify others
    socket.to(roomId).emit('room:user-joined', {
      userId,
      displayName: displayName || 'Anonymous',
      color,
    });

    console.log(`[Socket] ${displayName} joined room: ${roomId}`);
  });

  // ─── Room Leave ──────────────────────────────────────────────
  socket.on('room:leave', ({ roomId }) => {
    handleLeave(io, socket, roomId);
  });

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    if (roomId) {
      handleLeave(io, socket, roomId);
    }
  });

  // ─── Body Sync ───────────────────────────────────────────────
  socket.on('body:add', ({ body }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) {
      room.worldState.bodies.push(body);
    }

    socket.to(roomId).emit('body:added', {
      body,
      userId: socket.data.userId,
    });
  });

  socket.on('body:update', ({ bodyId, position, angle }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    // Update in room state
    const room = rooms.get(roomId);
    if (room) {
      const body = room.worldState.bodies.find((b) => b.id === bodyId);
      if (body) {
        body.position = position;
        body.angle = angle;
      }
    }

    socket.to(roomId).emit('body:updated', { bodyId, position, angle });
  });

  socket.on('body:remove', ({ bodyId }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) {
      room.worldState.bodies = room.worldState.bodies.filter((b) => b.id !== bodyId);
    }

    socket.to(roomId).emit('body:removed', { bodyId });
  });

  // ─── Constraint Sync ────────────────────────────────────────
  socket.on('constraint:add', ({ constraint }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) {
      room.worldState.constraints.push(constraint);
    }

    socket.to(roomId).emit('constraint:added', {
      constraint,
      userId: socket.data.userId,
    });
  });

  socket.on('constraint:remove', ({ constraintId }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) {
      room.worldState.constraints = room.worldState.constraints.filter(
        (c) => c.id !== constraintId
      );
    }

    socket.to(roomId).emit('constraint:removed', { constraintId });
  });

  // ─── Cursor Sync ─────────────────────────────────────────────
  socket.on('cursor:move', ({ x, y }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    socket.to(roomId).emit('cursor:moved', {
      userId: socket.data.userId,
      x,
      y,
    });
  });

  // ─── Simulation Controls ─────────────────────────────────────
  socket.on('sim:play', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) room.isPlaying = true;

    socket.to(roomId).emit('sim:played', {
      userId: socket.data.userId,
    });
  });

  socket.on('sim:pause', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) room.isPlaying = false;

    socket.to(roomId).emit('sim:paused', {
      userId: socket.data.userId,
    });
  });

  socket.on('sim:reset', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (room) {
      room.isPlaying = false;
      // Keep the bodies but reset velocities
      room.worldState.bodies.forEach((b) => {
        b.velocity = { x: 0, y: 0 };
        b.angularVelocity = 0;
      });
    }

    socket.to(roomId).emit('sim:reseted', {
      worldState: room?.worldState,
    });
  });
}

function handleLeave(io, socket, roomId) {
  const userId = socket.data.userId;
  const displayName = socket.data.displayName;

  socket.leave(roomId);

  const room = rooms.get(roomId);
  if (room) {
    room.users = room.users.filter((u) => u.userId !== userId);

    // Clean up empty rooms
    if (room.users.length === 0) {
      rooms.delete(roomId);
      console.log(`[Socket] Room ${roomId} deleted (empty)`);
    } else {
      io.to(roomId).emit('room:user-left', { userId });
    }
  }

  console.log(`[Socket] ${displayName || userId} left room: ${roomId}`);
}

module.exports = { registerLabHandlers };
