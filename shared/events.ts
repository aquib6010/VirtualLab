// Socket.IO Event Constants — shared between client and server

export const EVENTS = {
  // Room lifecycle
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_STATE: 'room:state',
  ROOM_USER_JOINED: 'room:user-joined',
  ROOM_USER_LEFT: 'room:user-left',

  // Body operations
  BODY_ADD: 'body:add',
  BODY_ADDED: 'body:added',
  BODY_UPDATE: 'body:update',
  BODY_UPDATED: 'body:updated',
  BODY_REMOVE: 'body:remove',
  BODY_REMOVED: 'body:removed',

  // Constraint operations
  CONSTRAINT_ADD: 'constraint:add',
  CONSTRAINT_ADDED: 'constraint:added',
  CONSTRAINT_REMOVE: 'constraint:remove',
  CONSTRAINT_REMOVED: 'constraint:removed',

  // Cursor sync
  CURSOR_MOVE: 'cursor:move',
  CURSOR_MOVED: 'cursor:moved',

  // Simulation controls
  SIM_PLAY: 'sim:play',
  SIM_PAUSE: 'sim:pause',
  SIM_RESET: 'sim:reset',
  SIM_PLAYED: 'sim:played',
  SIM_PAUSED: 'sim:paused',
  SIM_RESETED: 'sim:reseted',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
