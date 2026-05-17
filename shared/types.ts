// ─── Physics Body Types ─────────────────────────────────────────────

export type BodyType = 'rectangle' | 'circle' | 'trapezoid';

export interface Vec2 {
  x: number;
  y: number;
}

export interface BodyRenderOptions {
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
}

export interface SerializedBody {
  id: string;
  type: BodyType;
  label: string;
  position: Vec2;
  angle: number;
  velocity: Vec2;
  angularVelocity: number;
  isStatic: boolean;
  mass: number;
  friction: number;
  restitution: number;
  dimensions: {
    width?: number;
    height?: number;
    radius?: number;
    slope?: number;
  };
  render: BodyRenderOptions;
}

// ─── Constraint Types ───────────────────────────────────────────────

export type ConstraintType = 'spring' | 'rope' | 'pivot' | 'motor';

export interface SerializedConstraint {
  id: string;
  type: ConstraintType;
  bodyAId: string | null;
  bodyBId: string | null;
  pointA: Vec2;
  pointB: Vec2;
  stiffness: number;
  length: number;
  damping: number;
  render: {
    strokeStyle: string;
    lineWidth: number;
  };
}

// ─── World State ────────────────────────────────────────────────────

export interface WorldState {
  gravity: Vec2;
  bodies: SerializedBody[];
  constraints: SerializedConstraint[];
}

// ─── Room & User ────────────────────────────────────────────────────

export interface RoomUser {
  userId: string;
  displayName: string;
  color: string;
  cursor?: Vec2;
}

export interface RoomState {
  roomId: string;
  worldState: WorldState;
  users: RoomUser[];
  isPlaying: boolean;
}

// ─── Analytics Data ─────────────────────────────────────────────────

export interface AnalyticsFrame {
  timestamp: number;
  bodyId: string;
  position: Vec2;
  velocity: Vec2;
  acceleration: Vec2;
  speed: number;
  kineticEnergy: number;
  angularVelocity: number;
  mass: number;
}

// ─── Experiment ─────────────────────────────────────────────────────

export interface Experiment {
  _id?: string;
  title: string;
  description: string;
  owner: string;
  collaborators: string[];
  isPublic: boolean;
  worldState: WorldState;
  thumbnail?: string;
  tags: string[];
  version: number;
  createdAt?: string;
  updatedAt?: string;
}
