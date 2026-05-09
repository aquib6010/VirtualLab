/**
 * useSocket — Hook for Socket.IO room lifecycle and event management.
 * Connects on mount, joins room, syncs bodies/cursors, cleans up on unmount.
 */
import { useEffect, useRef, useCallback } from 'react';
import { socketService } from '@/services/socket';
import { useLabStore } from '@/stores/useLabStore';
import { EVENTS } from '@shared/events';
import type { RoomUser, SerializedBody, WorldState, Vec2 } from '@shared/types';

interface UseSocketOptions {
  roomId: string;
  userId: string;
  displayName: string;
  onBodyAdded?: (body: SerializedBody, userId: string) => void;
  onBodyUpdated?: (bodyId: string, position: Vec2, angle: number) => void;
  onBodyRemoved?: (bodyId: string) => void;
  onWorldState?: (state: WorldState) => void;
  onSimPlay?: () => void;
  onSimPause?: () => void;
  onSimReset?: (state: WorldState) => void;
}

export function useSocket(options: UseSocketOptions) {
  const { roomId, userId, displayName } = options;
  const callbacksRef = useRef(options);
  callbacksRef.current = options;

  const {
    setIsConnected,
    setRoomUsers,
    addRoomUser,
    removeRoomUser,
    updateUserCursor,
  } = useLabStore();

  // Throttled cursor emit
  const lastCursorEmit = useRef(0);
  const emitCursor = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastCursorEmit.current < 50) return; // 50ms throttle
      lastCursorEmit.current = now;
      socketService.emit(EVENTS.CURSOR_MOVE, { x, y });
    },
    []
  );

  // Connect & join room
  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit(EVENTS.ROOM_JOIN, { roomId, userId, displayName });
    });

    socket.on('disconnect', () => setIsConnected(false));

    // Room events
    socket.on(EVENTS.ROOM_STATE, (data: { worldState: WorldState; users: RoomUser[] }) => {
      setRoomUsers(data.users);
      callbacksRef.current.onWorldState?.(data.worldState);
    });

    socket.on(EVENTS.ROOM_USER_JOINED, (user: RoomUser) => {
      addRoomUser(user);
    });

    socket.on(EVENTS.ROOM_USER_LEFT, (data: { userId: string }) => {
      removeRoomUser(data.userId);
    });

    // Body sync events
    socket.on(EVENTS.BODY_ADDED, (data: { body: SerializedBody; userId: string }) => {
      callbacksRef.current.onBodyAdded?.(data.body, data.userId);
    });

    socket.on(EVENTS.BODY_UPDATED, (data: { bodyId: string; position: Vec2; angle: number }) => {
      callbacksRef.current.onBodyUpdated?.(data.bodyId, data.position, data.angle);
    });

    socket.on(EVENTS.BODY_REMOVED, (data: { bodyId: string }) => {
      callbacksRef.current.onBodyRemoved?.(data.bodyId);
    });

    // Cursor sync
    socket.on(EVENTS.CURSOR_MOVED, (data: { userId: string; x: number; y: number }) => {
      updateUserCursor(data.userId, { x: data.x, y: data.y });
    });

    // Simulation sync
    socket.on(EVENTS.SIM_PLAYED, () => callbacksRef.current.onSimPlay?.());
    socket.on(EVENTS.SIM_PAUSED, () => callbacksRef.current.onSimPause?.());
    socket.on(EVENTS.SIM_RESETED, (data: { worldState: WorldState }) => {
      callbacksRef.current.onSimReset?.(data.worldState);
    });

    // If already connected, join immediately
    if (socket.connected) {
      setIsConnected(true);
      socket.emit(EVENTS.ROOM_JOIN, { roomId, userId, displayName });
    }

    return () => {
      socketService.emit(EVENTS.ROOM_LEAVE, { roomId });
      socketService.disconnect();
      setIsConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId]);

  // Emit helpers
  const emitBodyAdd = useCallback((body: SerializedBody) => {
    socketService.emit(EVENTS.BODY_ADD, { body });
  }, []);

  const emitBodyUpdate = useCallback((bodyId: string, position: Vec2, angle: number) => {
    socketService.emit(EVENTS.BODY_UPDATE, { bodyId, position, angle });
  }, []);

  const emitBodyRemove = useCallback((bodyId: string) => {
    socketService.emit(EVENTS.BODY_REMOVE, { bodyId });
  }, []);

  const emitSimPlay = useCallback(() => {
    socketService.emit(EVENTS.SIM_PLAY, {});
  }, []);

  const emitSimPause = useCallback(() => {
    socketService.emit(EVENTS.SIM_PAUSE, {});
  }, []);

  const emitSimReset = useCallback(() => {
    socketService.emit(EVENTS.SIM_RESET, {});
  }, []);

  return {
    emitCursor,
    emitBodyAdd,
    emitBodyUpdate,
    emitBodyRemove,
    emitSimPlay,
    emitSimPause,
    emitSimReset,
  };
}
