import React from 'react';
import { Music, Sparkles, Layers, Code, Zap } from 'lucide-react';

export default function Navbar({ onOpenBatchModal, onOpenProModal, onOpenApiModal, isPro }) {
  return (
    <header className="header-nav">
      <div className="header-brand">
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '14px',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
        }}>
          <Music size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: 1.1 }}>
            Sonic<span className="text-gradient">Media</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Universal Downloader & Converter
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-actions">
        <button
          onClick={onOpenApiModal}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.825rem' }}
        >
          <Code size={15} color="#38bdf8" />
          <span>API Portal</span>
        </button>

        <button
          onClick={onOpenBatchModal}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.825rem' }}
        >
          <Layers size={15} color="#06b6d4" />
          <span>Batch Queue</span>
        </button>

        {isPro ? (
          <div className="platform-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981', fontWeight: 800 }}>
            <Zap size={14} />
            <span>PRO ACTIVE</span>
          </div>
        ) : (
          <button
            onClick={onOpenProModal}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            <span>Get PRO</span>
          </button>
        )}
      </div>
    </header>
  );
}
