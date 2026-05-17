/**
 * CanvasControls — Simulation controls bar (play/pause/reset/step/timestep/gravity)
 * Positioned at the bottom of the canvas area.
 */
import React, { useState } from 'react';
import { useLabStore } from '@/stores/useLabStore';

interface CanvasControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onTimestepChange: (delta: number) => void;
  onGravityChange?: (x: number, y: number) => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  onPlay,
  onPause,
  onReset,
  onStep,
  onTimestepChange,
  onGravityChange,
}) => {
  const { isPlaying, setIsPlaying } = useLabStore();
  const [gravityMode, setGravityMode] = useState<'earth' | 'zero' | 'moon'>('earth');

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
      setIsPlaying(false);
    } else {
      onPlay();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    onReset();
    setIsPlaying(false);
  };

  const handleGravityChange = (mode: typeof gravityMode) => {
    setGravityMode(mode);
    const gravityMap = {
      earth: { x: 0, y: 1 },
      zero: { x: 0, y: 0 },
      moon: { x: 0, y: 0.16 },
    };
    const g = gravityMap[mode];
    onGravityChange?.(g.x, g.y);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="glass-card flex items-center gap-2 px-4 py-2 shadow-lg">
        {/* Reset */}
        <button onClick={handleReset} className="btn-icon" title="Reset (R)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,4 1,10 7,10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>

        {/* Step forward */}
        <button onClick={onStep} className="btn-icon" title="Step Forward">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5,4 15,12 5,20"/>
            <line x1="19" y1="5" x2="19" y2="19"/>
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          className={`
            w-11 h-11 rounded-full flex items-center justify-center
            transition-all duration-200 active:scale-95
            ${isPlaying
              ? 'bg-lab-warning/20 text-lab-warning border border-lab-warning/30'
              : 'bg-lab-accent text-white shadow-glow hover:shadow-glow-lg'
            }
          `}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,3 20,12 6,21"/>
            </svg>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-lab-border mx-1" />

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-lab-muted uppercase tracking-wider font-semibold">Speed</span>
          <select
            onChange={(e) => {
              const multiplier = parseFloat(e.target.value);
              onTimestepChange((1000 / 60) * multiplier);
            }}
            defaultValue="1"
            className="bg-lab-card border border-lab-border rounded-md px-2 py-1 text-xs text-lab-text focus:outline-none focus:border-lab-accent cursor-pointer"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="4">4x</option>
          </select>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-lab-border mx-1" />

        {/* Gravity toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-lab-muted uppercase tracking-wider font-semibold">Gravity</span>
          {([
            { mode: 'zero' as const, label: '0g', title: 'Zero gravity — horizontal motion only' },
            { mode: 'moon' as const, label: '🌙', title: 'Moon gravity (0.16g)' },
            { mode: 'earth' as const, label: '🌍', title: 'Earth gravity (1g)' },
          ]).map(({ mode, label, title }) => (
            <button
              key={mode}
              onClick={() => handleGravityChange(mode)}
              title={title}
              className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                gravityMode === mode
                  ? 'bg-lab-accent/20 text-lab-accent border border-lab-accent/30'
                  : 'bg-lab-surface text-lab-muted border border-lab-border hover:text-lab-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanvasControls;
