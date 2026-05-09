/**
 * Lab Page — Main workspace with 3-panel layout:
 * [Toolbar | Physics Canvas | Analytics Panel]
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import PhysicsToolbar from '@/components/toolbar/PhysicsToolbar';
import PhysicsCanvas from '@/components/canvas/PhysicsCanvas';
import { useLabStore } from '@/stores/useLabStore';

const Lab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setRoomId } = useLabStore();

  // Derive canvas dimensions from window size
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth - 72 - 300, // minus toolbar and analytics panel
    height: window.innerHeight,
  });

  // Room setup
  useEffect(() => {
    const roomId = searchParams.get('room') || `lab-${uuidv4().slice(0, 8)}`;
    setRoomId(roomId);

    // Update URL with room ID if not present
    if (!searchParams.get('room')) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomId);
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, setRoomId]);

  // Responsive resize
  useEffect(() => {
    const handleResize = () => {
      const showAnalytics = useLabStore.getState().showAnalytics;
      setCanvasSize({
        width: window.innerWidth - 72 - (showAnalytics ? 300 : 0),
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    // Also subscribe to analytics toggle
    let prevShowAnalytics = useLabStore.getState().showAnalytics;
    const unsub = useLabStore.subscribe((state) => {
      if (state.showAnalytics !== prevShowAnalytics) {
        prevShowAnalytics = state.showAnalytics;
        setCanvasSize({
          width: window.innerWidth - 72 - (state.showAnalytics ? 300 : 0),
          height: window.innerHeight,
        });
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsub();
    };
  }, []);

  const handleBodyAdded = useCallback((id: string, type: string, position: { x: number; y: number }) => {
    // Socket emit will be handled here when multiplayer is active
    console.log(`[Lab] Body added: ${type} at (${position.x}, ${position.y}) id=${id}`);
  }, []);

  const handleBodyRemoved = useCallback((id: string) => {
    console.log(`[Lab] Body removed: id=${id}`);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-lab-bg">
      {/* Left Toolbar */}
      <PhysicsToolbar />

      {/* Center Canvas + Right Analytics */}
      <PhysicsCanvas
        width={canvasSize.width}
        height={canvasSize.height}
        onBodyAdded={handleBodyAdded}
        onBodyRemoved={handleBodyRemoved}
      />
    </div>
  );
};

export default Lab;
