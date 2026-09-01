import React from 'react';
import { Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '30px 24px',
      background: 'rgba(5, 7, 12, 0.95)',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Music size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
            Sonic<span className="text-gradient">Media</span> Studio
          </span>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)' }}>
          © {new Date().getFullYear()} SonicMedia Studio. All rights reserved. Fast, Ultra HD Media Converter.
        </p>
      </div>
    </footer>
  );
}
