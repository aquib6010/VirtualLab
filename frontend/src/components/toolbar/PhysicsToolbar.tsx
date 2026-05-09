/**
 * PhysicsToolbar — Left sidebar with draggable physics object tools.
 * Figma-like tool panel with grouped categories.
 */
import React from 'react';
import { useLabStore, type ToolMode } from '@/stores/useLabStore';

interface ToolDef {
  id: ToolMode;
  label: string;
  icon: React.ReactNode;
  category: 'tools' | 'bodies' | 'constraints';
}

const TOOLS: ToolDef[] = [
  {
    id: 'select',
    label: 'Select',
    category: 'tools',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
        <path d="M13 13l6 6"/>
      </svg>
    ),
  },
  {
    id: 'rectangle',
    label: 'Box',
    category: 'bodies',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    ),
  },
  {
    id: 'circle',
    label: 'Circle',
    category: 'bodies',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
  },
  {
    id: 'trapezoid',
    label: 'Ramp',
    category: 'bodies',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3,20 10,4 21,20"/>
      </svg>
    ),
  },
  {
    id: 'spring',
    label: 'Spring',
    category: 'constraints',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v2M12 20v2M12 4c3 0 3 2 0 4s-3 4 0 4 3 4 0 4"/>
      </svg>
    ),
  },
  {
    id: 'rope',
    label: 'Rope',
    category: 'constraints',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20"/>
        <circle cx="12" cy="2" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="22" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'pivot',
    label: 'Pivot',
    category: 'constraints',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <circle cx="12" cy="12" r="8"/>
        <line x1="12" y1="4" x2="12" y2="1"/>
      </svg>
    ),
  },
  {
    id: 'delete',
    label: 'Delete',
    category: 'tools',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    ),
  },
];

const PhysicsToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useLabStore();

  const categories = {
    tools: TOOLS.filter((t) => t.category === 'tools'),
    bodies: TOOLS.filter((t) => t.category === 'bodies'),
    constraints: TOOLS.filter((t) => t.category === 'constraints'),
  };

  return (
    <div className="w-[72px] h-full bg-lab-surface border-r border-lab-border flex flex-col items-center py-4 gap-1 overflow-y-auto">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lab-accent to-lab-accent-light flex items-center justify-center mb-4 shadow-glow">
        <span className="text-white font-bold text-sm">VL</span>
      </div>

      {/* Tool categories */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        <span className="text-[9px] uppercase tracking-widest text-lab-dim mb-1 font-semibold">Tools</span>
        {categories.tools.map((tool) => (
          <ToolButton key={tool.id} tool={tool} active={activeTool === tool.id} onClick={() => setActiveTool(tool.id)} />
        ))}
      </div>

      <div className="w-8 h-px bg-lab-border my-2" />

      <div className="flex flex-col items-center gap-1 w-full px-2">
        <span className="text-[9px] uppercase tracking-widest text-lab-dim mb-1 font-semibold">Bodies</span>
        {categories.bodies.map((tool) => (
          <ToolButton key={tool.id} tool={tool} active={activeTool === tool.id} onClick={() => setActiveTool(tool.id)} />
        ))}
      </div>

      <div className="w-8 h-px bg-lab-border my-2" />

      <div className="flex flex-col items-center gap-1 w-full px-2">
        <span className="text-[9px] uppercase tracking-widest text-lab-dim mb-1 font-semibold">Links</span>
        {categories.constraints.map((tool) => (
          <ToolButton key={tool.id} tool={tool} active={activeTool === tool.id} onClick={() => setActiveTool(tool.id)} />
        ))}
      </div>
    </div>
  );
};

const ToolButton: React.FC<{ tool: ToolDef; active: boolean; onClick: () => void }> = ({
  tool,
  active,
  onClick,
}) => (
  <button
    id={`tool-${tool.id}`}
    onClick={onClick}
    className={`
      w-12 h-12 flex flex-col items-center justify-center gap-0.5 rounded-xl
      transition-all duration-200 cursor-pointer group relative
      ${active
        ? 'bg-lab-accent/15 text-lab-accent border border-lab-accent/30 shadow-glow'
        : 'text-lab-muted hover:text-lab-text hover:bg-lab-hover border border-transparent'
      }
      ${tool.id === 'delete' ? (active ? 'text-lab-danger bg-lab-danger/15 border-lab-danger/30' : '') : ''}
    `}
    title={tool.label}
  >
    {tool.icon}
    <span className="text-[8px] font-medium leading-none">{tool.label}</span>
  </button>
);

export default PhysicsToolbar;
