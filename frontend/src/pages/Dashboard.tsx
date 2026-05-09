/**
 * Dashboard Page — Experiment library with grid view.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { experimentsAPI } from '@/services/api';
import type { Experiment } from '@shared/types';

const Dashboard: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mine' | 'public'>('mine');
  const navigate = useNavigate();

  useEffect(() => {
    loadExperiments();
  }, [activeTab]);

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const res = activeTab === 'mine'
        ? await experimentsAPI.list()
        : await experimentsAPI.listPublic();
      setExperiments(res.data.experiments || []);
    } catch {
      // If not authenticated, show empty
      setExperiments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experiment?')) return;
    try {
      await experimentsAPI.delete(id);
      setExperiments((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="min-h-screen bg-lab-bg">
      {/* Top bar */}
      <nav className="bg-lab-surface border-b border-lab-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lab-accent to-lab-accent-light flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">VL</span>
            </div>
            <span className="text-lg font-bold text-lab-text tracking-tight">VIRTUAL-LAB</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/lab" className="btn-primary text-sm">
              + New Experiment
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lab-text mb-2">Experiments</h1>
          <p className="text-lab-muted">Your saved physics experiments and simulations</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-lab-border">
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'mine'
                ? 'border-lab-accent text-lab-accent'
                : 'border-transparent text-lab-muted hover:text-lab-text'
            }`}
          >
            My Experiments
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'public'
                ? 'border-lab-accent text-lab-accent'
                : 'border-transparent text-lab-muted hover:text-lab-text'
            }`}
          >
            Public Library
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-lab-accent" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : experiments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-lab-card border border-lab-border flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lab-dim">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <p className="text-lab-muted mb-2">No experiments yet</p>
            <p className="text-sm text-lab-dim mb-6">Start building your first physics simulation</p>
            <Link to="/lab" className="btn-primary">Create Experiment</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((exp) => (
              <div
                key={exp._id}
                className="glass-card overflow-hidden hover:border-lab-accent/30 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/lab?experiment=${exp._id}`)}
              >
                {/* Thumbnail */}
                <div className="h-40 bg-lab-card grid-bg flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-lab-accent/10 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lab-accent">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-lab-text group-hover:text-lab-accent transition-colors truncate flex-1">
                      {exp.title}
                    </h3>
                    {exp.isPublic && <span className="badge-success ml-2">Public</span>}
                  </div>
                  <p className="text-xs text-lab-dim line-clamp-2 mb-3">{exp.description || 'No description'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-lab-dim">
                      {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exp._id!);
                      }}
                      className="btn-icon w-7 h-7 text-lab-dim hover:text-lab-danger"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
