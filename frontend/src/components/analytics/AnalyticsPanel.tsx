/**
 * AnalyticsPanel — Right sidebar with real-time physics data charts.
 * Uses Recharts for velocity, acceleration, kinetic energy, and speed.
 */
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import type { AnalyticsFrame } from '@shared/types';

interface AnalyticsPanelProps {
  frames: AnalyticsFrame[];
  latestFrame: AnalyticsFrame | null;
  trackedBodyId: string | null;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  frames,
  latestFrame,
  trackedBodyId,
}) => {
  if (!trackedBodyId) {
    return (
      <div className="w-[300px] bg-lab-surface border-l border-lab-border flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-lab-card border border-lab-border flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lab-dim">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-lab-muted">No body selected</p>
            <p className="text-xs text-lab-dim mt-1">Click a body on the canvas to track its physics data</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = frames.slice(-100).map((f, i) => ({
    t: i,
    vx: parseFloat(f.velocity.x.toFixed(2)),
    vy: parseFloat(f.velocity.y.toFixed(2)),
    speed: parseFloat(f.speed.toFixed(2)),
    ax: parseFloat(f.acceleration.x.toFixed(2)),
    ay: parseFloat(f.acceleration.y.toFixed(2)),
    ke: parseFloat(f.kineticEnergy.toFixed(2)),
    px: parseFloat(f.position.x.toFixed(1)),
    py: parseFloat(f.position.y.toFixed(1)),
  }));

  return (
    <div className="w-[300px] bg-lab-surface border-l border-lab-border flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-lab-border">
        <h3 className="text-sm font-semibold text-lab-text flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lab-accent">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          Analytics
        </h3>
        <p className="text-[10px] text-lab-dim mt-1 font-mono">
          Tracking: {trackedBodyId.slice(0, 8)}...
        </p>
      </div>

      {/* Live Values */}
      {latestFrame && (
        <div className="grid grid-cols-2 gap-2 p-4 border-b border-lab-border">
          <MetricCard label="Speed" value={latestFrame.speed.toFixed(2)} unit="px/s" color="text-lab-accent" />
          <MetricCard label="KE" value={latestFrame.kineticEnergy.toFixed(1)} unit="J" color="text-lab-success" />
          <MetricCard label="Vel X" value={latestFrame.velocity.x.toFixed(2)} unit="px/s" color="text-lab-accent-light" />
          <MetricCard label="Vel Y" value={latestFrame.velocity.y.toFixed(2)} unit="px/s" color="text-lab-warning" />
        </div>
      )}

      {/* Velocity Chart */}
      <ChartSection title="Velocity" color="#6c5ce7">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
            <XAxis dataKey="t" tick={false} stroke="#2a2a3d" />
            <YAxis tick={{ fontSize: 9, fill: '#5a5a72' }} stroke="#2a2a3d" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a28',
                border: '1px solid #2a2a3d',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Line type="monotone" dataKey="vx" stroke="#6c5ce7" strokeWidth={1.5} dot={false} name="Vx" />
            <Line type="monotone" dataKey="vy" stroke="#a29bfe" strokeWidth={1.5} dot={false} name="Vy" />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Speed Chart */}
      <ChartSection title="Speed" color="#00cec9">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
            <XAxis dataKey="t" tick={false} stroke="#2a2a3d" />
            <YAxis tick={{ fontSize: 9, fill: '#5a5a72' }} stroke="#2a2a3d" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a28',
                border: '1px solid #2a2a3d',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Area type="monotone" dataKey="speed" stroke="#00cec9" fill="#00cec920" strokeWidth={1.5} name="Speed" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Kinetic Energy Chart */}
      <ChartSection title="Kinetic Energy" color="#fdcb6e">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
            <XAxis dataKey="t" tick={false} stroke="#2a2a3d" />
            <YAxis tick={{ fontSize: 9, fill: '#5a5a72' }} stroke="#2a2a3d" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a28',
                border: '1px solid #2a2a3d',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Area type="monotone" dataKey="ke" stroke="#fdcb6e" fill="#fdcb6e20" strokeWidth={1.5} name="KE" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Acceleration Chart */}
      <ChartSection title="Acceleration" color="#ff6b6b">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />
            <XAxis dataKey="t" tick={false} stroke="#2a2a3d" />
            <YAxis tick={{ fontSize: 9, fill: '#5a5a72' }} stroke="#2a2a3d" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a28',
                border: '1px solid #2a2a3d',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Line type="monotone" dataKey="ax" stroke="#ff6b6b" strokeWidth={1.5} dot={false} name="Ax" />
            <Line type="monotone" dataKey="ay" stroke="#fd79a8" strokeWidth={1.5} dot={false} name="Ay" />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────

const MetricCard: React.FC<{
  label: string;
  value: string;
  unit: string;
  color: string;
}> = ({ label, value, unit, color }) => (
  <div className="bg-lab-card rounded-lg p-2.5 border border-lab-border/50">
    <p className="text-[9px] text-lab-dim uppercase tracking-wider font-semibold">{label}</p>
    <p className={`text-lg font-bold font-mono ${color} mt-0.5 leading-tight`}>{value}</p>
    <p className="text-[9px] text-lab-dim">{unit}</p>
  </div>
);

const ChartSection: React.FC<{
  title: string;
  color: string;
  children: React.ReactNode;
}> = ({ title, color, children }) => (
  <div className="p-4 border-b border-lab-border">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <h4 className="text-xs font-semibold text-lab-muted uppercase tracking-wider">{title}</h4>
    </div>
    {children}
  </div>
);

export default AnalyticsPanel;
