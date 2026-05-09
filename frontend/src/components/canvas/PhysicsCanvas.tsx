/**
 * PhysicsCanvas — Main canvas component integrating Matter.js engine.
 * Handles click-to-add bodies based on active tool, mouse tracking,
 * and renders the cursor overlay for multiplayer.
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { usePhysicsEngine } from '@/hooks/usePhysicsEngine';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLabStore } from '@/stores/useLabStore';
import CanvasControls from './CanvasControls';
import AnalyticsPanel from '@/components/analytics/AnalyticsPanel';
import CursorOverlay from './CursorOverlay';
import type { BodyType, ConstraintType } from '@shared/types';

interface PhysicsCanvasProps {
  width: number;
  height: number;
  onBodyAdded?: (id: string, type: BodyType, position: { x: number; y: number }) => void;
  onBodyRemoved?: (id: string) => void;
}

const PhysicsCanvas: React.FC<PhysicsCanvasProps> = ({
  width,
  height,
  onBodyAdded,
  onBodyRemoved,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    engineRef,
    addBody,
    removeBody,
    play,
    pause,
    reset,
    step,
    setTimestep,
    serializeWorld,
    onFrame,
  } = usePhysicsEngine(containerRef, {
    width,
    height,
    gravity: { x: 0, y: 1 },
    wireframes: false,
    background: '#0a0a0f',
  });

  const {
    activeTool,
    setActiveTool,
    selectedBodyId,
    setSelectedBodyId,
    showAnalytics,
    trackedBodyId,
    setTrackedBodyId,
    isPlaying,
    roomUsers,
  } = useLabStore();

  const { frames, latestFrame } = useAnalytics(engineRef, trackedBodyId);

  // Handle canvas click to add bodies
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const bodyTools: BodyType[] = ['rectangle', 'circle', 'trapezoid'];
      const constraintTools: ConstraintType[] = ['spring', 'rope', 'pivot', 'motor'];

      if (bodyTools.includes(activeTool as BodyType)) {
        const id = addBody(activeTool as BodyType, { x, y });
        if (id) {
          setSelectedBodyId(id);
          setTrackedBodyId(id);
          onBodyAdded?.(id, activeTool as BodyType, { x, y });
        }
      } else if (activeTool === 'delete') {
        // Delete is handled via Matter.js mouse events
      } else if (activeTool === 'select') {
        // Selection handled by Matter.js mouse constraint
      }
    },
    [activeTool, addBody, setSelectedBodyId, setTrackedBodyId, onBodyAdded]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (isPlaying) {
            pause();
            useLabStore.getState().setIsPlaying(false);
          } else {
            play();
            useLabStore.getState().setIsPlaying(true);
          }
          break;
        case 'r':
        case 'R':
          reset();
          useLabStore.getState().setIsPlaying(false);
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedBodyId) {
            removeBody(selectedBodyId);
            onBodyRemoved?.(selectedBodyId);
            setSelectedBodyId(null);
          }
          break;
        case 'Escape':
          setActiveTool('select');
          setSelectedBodyId(null);
          break;
        case '1':
          setActiveTool('select');
          break;
        case '2':
          setActiveTool('rectangle');
          break;
        case '3':
          setActiveTool('circle');
          break;
        case '4':
          setActiveTool('trapezoid');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, selectedBodyId, play, pause, reset, removeBody, setActiveTool, setSelectedBodyId, onBodyRemoved]);

  return (
    <div className="flex-1 flex relative overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

        {/* Matter.js canvas container */}
        <div
          ref={containerRef}
          className="absolute inset-0 cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ width, height }}
        />

        {/* Multiplayer cursor overlay */}
        <CursorOverlay users={roomUsers} />

        {/* Connection & room info bar */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className="glass-card px-3 py-1.5 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${useLabStore.getState().isConnected ? 'bg-lab-success' : 'bg-lab-danger'} animate-pulse`} />
            <span className="text-[10px] text-lab-muted font-medium uppercase tracking-wider">
              {useLabStore.getState().isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          {roomUsers.length > 0 && (
            <div className="glass-card px-3 py-1.5 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lab-muted">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span className="text-[10px] text-lab-muted font-medium">{roomUsers.length}</span>
            </div>
          )}
        </div>

        {/* Active tool indicator */}
        <div className="absolute top-3 right-3 z-20">
          <div className="glass-card px-3 py-1.5">
            <span className="text-[10px] text-lab-accent font-semibold uppercase tracking-wider">
              {activeTool}
            </span>
          </div>
        </div>

        {/* Simulation controls */}
        <CanvasControls
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onStep={step}
          onTimestepChange={setTimestep}
        />
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <AnalyticsPanel
          frames={frames}
          latestFrame={latestFrame}
          trackedBodyId={trackedBodyId}
        />
      )}
    </div>
  );
};

export default PhysicsCanvas;
