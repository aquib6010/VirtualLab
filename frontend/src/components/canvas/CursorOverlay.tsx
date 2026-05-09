/**
 * CursorOverlay — Renders other users' cursors on the canvas.
 */
import React from 'react';
import type { RoomUser } from '@shared/types';

interface CursorOverlayProps {
  users: RoomUser[];
}

const CursorOverlay: React.FC<CursorOverlayProps> = ({ users }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {users
        .filter((u) => u.cursor)
        .map((user) => (
          <div
            key={user.userId}
            className="absolute transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${user.cursor!.x}px, ${user.cursor!.y}px)`,
            }}
          >
            {/* Cursor arrow */}
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill={user.color}
              className="drop-shadow-md"
            >
              <path d="M0 0l16 12-6.5 1.5L6 20z" />
            </svg>
            {/* Name label */}
            <div
              className="absolute left-4 top-4 px-2 py-0.5 rounded-md text-[10px] font-medium text-white whitespace-nowrap shadow-md"
              style={{ backgroundColor: user.color }}
            >
              {user.displayName}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CursorOverlay;
