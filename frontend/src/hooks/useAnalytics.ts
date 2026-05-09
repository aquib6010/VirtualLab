/**
 * useAnalytics — Subscribes to physics engine frame updates and
 * maintains a rolling buffer of analytics data for charting.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import type { PhysicsEngine, FrameCallback } from '@/services/physics';
import type { AnalyticsFrame, Vec2 } from '@shared/types';

const MAX_BUFFER_SIZE = 200;
const THROTTLE_MS = 100; // Update charts at ~10fps, not 60fps

export interface AnalyticsData {
  frames: AnalyticsFrame[];
  latestFrame: AnalyticsFrame | null;
}

export function useAnalytics(
  engineRef: React.MutableRefObject<PhysicsEngine | null>,
  trackedBodyId: string | null
): AnalyticsData {
  const [frames, setFrames] = useState<AnalyticsFrame[]>([]);
  const [latestFrame, setLatestFrame] = useState<AnalyticsFrame | null>(null);
  const bufferRef = useRef<AnalyticsFrame[]>([]);
  const prevVelocityRef = useRef<Vec2>({ x: 0, y: 0 });
  const lastUpdateRef = useRef(0);

  // Clear buffer when tracked body changes
  useEffect(() => {
    bufferRef.current = [];
    setFrames([]);
    setLatestFrame(null);
    prevVelocityRef.current = { x: 0, y: 0 };
  }, [trackedBodyId]);

  // Subscribe to engine frame updates
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !trackedBodyId) return;

    const callback: FrameCallback = (bodyData) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < THROTTLE_MS) return;
      lastUpdateRef.current = now;

      const data = bodyData.get(trackedBodyId);
      if (!data) return;

      const prevVel = prevVelocityRef.current;
      const dt = THROTTLE_MS / 1000;
      const acceleration: Vec2 = {
        x: (data.velocity.x - prevVel.x) / dt,
        y: (data.velocity.y - prevVel.y) / dt,
      };
      prevVelocityRef.current = { ...data.velocity };

      const kineticEnergy = 0.5 * data.mass * (data.speed * data.speed);

      const frame: AnalyticsFrame = {
        timestamp: now,
        bodyId: trackedBodyId,
        position: data.position,
        velocity: data.velocity,
        acceleration,
        speed: data.speed,
        kineticEnergy,
        angularVelocity: data.angularVelocity,
      };

      bufferRef.current.push(frame);
      if (bufferRef.current.length > MAX_BUFFER_SIZE) {
        bufferRef.current = bufferRef.current.slice(-MAX_BUFFER_SIZE);
      }

      setFrames([...bufferRef.current]);
      setLatestFrame(frame);
    };

    const unsubscribe = engine.onFrame(callback);
    return unsubscribe;
  }, [engineRef, trackedBodyId]);

  return { frames, latestFrame };
}
