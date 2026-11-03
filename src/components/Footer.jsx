import React from 'react';
import { ShieldCheck, FileText, ShieldAlert } from 'lucide-react';
import SonicLogo from './SonicLogo';

export default function Footer({ onOpenTerms, onOpenPrivacy, onOpenDmca }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '28px 16px 24px 16px',
      background: 'rgba(5, 7, 12, 0.95)',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: '1150px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto 0 0' }}>
          <div style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SonicLogo size={30} />
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
             Sonic<span className="text-gradient">Media</span>
          </span>
        </div>

        {/* Legal Links (Terms, Privacy, DMCA) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          fontSize: '0.825rem'
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
              gap: '5px',
              fontWeight: 500,
              padding: '4px 0'
            }}
          >
            <FileText size={14} />
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
              gap: '5px',
              fontWeight: 500,
              padding: '4px 0'
            }}
          >
            <ShieldCheck size={14} />
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
              gap: '5px',
              fontWeight: 500,
              padding: '4px 0'
            }}
          >
            <ShieldAlert size={14} />
            <span>DMCA Disclaimer</span>
          </button>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
          © {new Date().getFullYear()} SonicMedia Studio (sonicmedia.me)
        </p>
      </div>
    </footer>
  );
}
