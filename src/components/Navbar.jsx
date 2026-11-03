import React from 'react';
import { Sparkles, Layers, Code, Zap } from 'lucide-react';
import SonicLogo from './SonicLogo';

export default function Navbar({ onOpenBatchModal, onOpenProModal, onOpenApiModal, isPro }) {
  return (
    <header className="header-nav">
      <div className="header-nav-inner">
        <div className="header-brand" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          <div className="brand-logo-icon">
            <SonicLogo size={42} />
          </div>

          <div className="brand-text-container">
            <h1 className="brand-title">
              Sonic<span className="text-gradient">Media</span>
            </h1>
          </div>
        </div>

        {/* Right Controls */}
        <div className="header-actions">
          <button
            onClick={onOpenApiModal}
            className="btn-secondary nav-btn nav-btn-quiet"
            title="Developer API Portal"
          >
            <Code size={15} color="#67e8f9" />
            <span className="nav-text-full">API Portal</span>
            <span className="nav-text-short">API</span>
          </button>

          <button
            onClick={onOpenBatchModal}
            className="btn-secondary nav-btn nav-btn-quiet"
            title="Batch Queue Downloader"
          >
            <Layers size={15} color="#22d3ee" />
            <span className="nav-text-full">Batch Queue</span>
            <span className="nav-text-short">Batch</span>
          </button>

          <span className="nav-divider" aria-hidden="true" />

          {isPro ? (
            <div className="platform-badge nav-btn nav-pro-active">
              <Zap size={15} />
              <span className="nav-text-full">PRO ACTIVE</span>
              <span className="nav-text-short">PRO</span>
            </div>
          ) : (
            <button
              onClick={onOpenProModal}
              className="btn-primary nav-btn nav-pro-button"
              title="Get PRO Studio Membership"
            >
              <Sparkles size={15} />
              <span className="nav-text-full">Get PRO</span>
              <span className="nav-text-short">PRO</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
