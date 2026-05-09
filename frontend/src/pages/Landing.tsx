/**
 * Landing Page — Hero section with animated visuals and CTA.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-lab-bg overflow-y-auto">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-lab-bg/80 backdrop-blur-lg border-b border-lab-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lab-accent to-lab-accent-light flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">VL</span>
            </div>
            <span className="text-lg font-bold text-lab-text tracking-tight">VIRTUAL-LAB</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/lab" className="btn-primary text-sm">Launch Lab →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lab-accent/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lab-accent-light/10 rounded-full blur-[128px]" />
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lab-accent/10 border border-lab-accent/20 mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-lab-success animate-pulse" />
            <span className="text-xs font-medium text-lab-accent-light">Real-time Collaborative Physics</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 animate-slide-up">
            <span className="text-lab-text">Build. Simulate.</span>
            <br />
            <span className="text-gradient">Discover.</span>
          </h1>

          <p className="text-lg md:text-xl text-lab-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            A collaborative 2D physics sandbox for engineering and physics education.
            Create mechanical systems, run simulations, and analyze results — all in real-time with your team.
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up">
            <Link to="/lab" className="btn-primary text-base px-8 py-3.5 text-lg">
              Open Laboratory
            </Link>
            <Link to="/dashboard" className="btn-secondary text-base px-8 py-3.5">
              View Experiments
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lab-accent">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            }
            title="Real-time Physics"
            description="Matter.js powered simulation with realistic gravity, collisions, springs, ropes, and motors. Drag, drop, and experiment."
          />
          <FeatureCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lab-success">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
            title="Multiplayer Collaboration"
            description="Work together in real-time. See teammates' cursors, share experiment state, and collaborate on complex systems."
          />
          <FeatureCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lab-warning">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
            }
            title="Live Analytics"
            description="Track velocity, acceleration, kinetic energy, and forces in real-time charts. Understand the physics behind your experiments."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-lab-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm text-lab-dim">© 2026 VIRTUAL-LAB. Built for physics education.</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-lab-success animate-pulse" />
            <span className="text-xs text-lab-dim">All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="glass-card p-6 hover:border-lab-accent/30 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-lab-card border border-lab-border flex items-center justify-center mb-4 group-hover:border-lab-accent/30 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-lab-text mb-2">{title}</h3>
    <p className="text-sm text-lab-muted leading-relaxed">{description}</p>
  </div>
);

export default Landing;
