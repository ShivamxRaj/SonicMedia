import React from 'react';
import { Music, Sparkles, Layers, Code, Zap } from 'lucide-react';

export default function Navbar({ onOpenBatchModal, onOpenProModal, onOpenApiModal, isPro }) {
  return (
    <header className="header-nav">
      <div className="header-brand" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        {/* Clean Minimalist Music Note Badge */}
        <div className="brand-logo-icon">
          <Music size={18} color="#ffffff" />
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
          title="Developer API Portal"
        >
          <Code size={14} color="#38bdf8" />
          <span className="nav-text-full">API Portal</span>
          <span className="nav-text-short">API</span>
        </button>

        <button
          onClick={onOpenBatchModal}
          className="btn-secondary nav-btn"
          title="Batch Queue Downloader"
        >
          <Layers size={14} color="#06b6d4" />
          <span className="nav-text-full">Batch Queue</span>
          <span className="nav-text-short">Batch</span>
        </button>

        {isPro ? (
          <div className="platform-badge nav-btn" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981', fontWeight: 800 }}>
            <Zap size={14} />
            <span className="nav-text-full">PRO ACTIVE</span>
            <span className="nav-text-short">PRO</span>
          </div>
        ) : (
          <button
            onClick={onOpenProModal}
            className="btn-primary nav-btn"
            title="Get PRO Studio Membership"
          >
            <Sparkles size={14} />
            <span className="nav-text-full">Get PRO</span>
            <span className="nav-text-short">PRO</span>
          </button>
        )}
      </div>
    </header>
  );
}

