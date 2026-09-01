import React from 'react';
import { Music, ShieldCheck, FileText, ShieldAlert } from 'lucide-react';

export default function Footer({ onOpenTerms, onOpenPrivacy, onOpenDmca }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '36px 24px 28px 24px',
      background: 'rgba(5, 7, 12, 0.95)',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: '1150px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Music size={17} color="#fff" />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
            Sonic<span className="text-gradient">Media</span> Studio
          </span>
        </div>

        {/* Legal Links (Terms, Privacy, DMCA) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          fontSize: '0.85rem'
        }}>
          <button
            onClick={onOpenTerms}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <FileText size={15} />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={onOpenPrivacy}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <ShieldCheck size={15} />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={onOpenDmca}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <ShieldAlert size={15} />
            <span>DMCA Disclaimer</span>
          </button>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)' }}>
          © {new Date().getFullYear()} SonicMedia Studio (sonicmedia.me). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
