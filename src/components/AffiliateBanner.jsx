import React from 'react';
import { ShieldAlert, ExternalLink, Coffee, Sparkles } from 'lucide-react';

export default function AffiliateBanner() {
  return (
    <div style={{
      maxWidth: '920px',
      margin: '0 auto 40px',
      padding: '0 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '18px'
    }}>
      {/* VPN Affiliate Card */}
      <div className="glass-card" style={{
        padding: '20px',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.08))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={22} color="#06b6d4" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>
              Protect Your Downloads with UltraVPN
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Bypass geo-restrictions & hide IP. Special <strong style={{ color: '#38bdf8' }}>80% OFF Deal</strong>.
            </p>
          </div>
        </div>

        <a
          href="https://nordvpn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap', textDecoration: 'none' }}
        >
          <span>Claim 80% Off</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Buy Me A Coffee Donation Card */}
      <div className="glass-card" style={{
        padding: '20px',
        borderColor: 'rgba(251, 146, 60, 0.3)',
        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(236, 72, 153, 0.08))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(251, 146, 60, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Coffee size={22} color="#fb923c" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>
              Support SonicMedia Developer
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Love this free studio? Buy the dev a coffee to keep servers running.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open('https://buymeacoffee.com', '_blank')}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap', borderColor: 'rgba(251, 146, 60, 0.4)', color: '#fb923c' }}
        >
          <Coffee size={14} />
          <span>Buy Coffee</span>
        </button>
      </div>
    </div>
  );
}
