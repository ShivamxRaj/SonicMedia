import React from 'react';
import { Music, Sparkles, Layers, Code, Zap } from 'lucide-react';

export default function Navbar({ onOpenBatchModal, onOpenProModal, onOpenApiModal, isPro }) {
  return (
    <header className="header-nav">
      <div className="header-brand" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        {/* Clean Minimalist Music Note Badge */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(168, 85, 247, 0.35)',
          flexShrink: 0
        }}>
          <Music size={20} color="#ffffff" />
        </div>

        <div className="brand-text-container">
          <h1 className="brand-title">
            Sonic<span className="text-gradient">Media</span>
          </h1>
          <p className="brand-subtitle">
            Universal Downloader & Converter
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-actions">
        <button
          onClick={onOpenApiModal}
          className="btn-secondary nav-btn"
        >
          <Code size={14} color="#38bdf8" />
          <span className="nav-btn-text">API Portal</span>
        </button>

        <button
          onClick={onOpenBatchModal}
          className="btn-secondary nav-btn"
        >
          <Layers size={14} color="#06b6d4" />
          <span className="nav-btn-text">Batch Queue</span>
        </button>

        {isPro ? (
          <div className="platform-badge nav-btn" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981', fontWeight: 800 }}>
            <Zap size={14} />
            <span>PRO ACTIVE</span>
          </div>
        ) : (
          <button
            onClick={onOpenProModal}
            className="btn-primary nav-btn"
          >
            <Sparkles size={14} />
            <span>Get PRO</span>
          </button>
        )}
      </div>
    </header>
  );
}
