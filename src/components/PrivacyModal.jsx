import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 13, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '700px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)',
        maxHeight: '85vh',
        overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Privacy Policy</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              How SonicMedia Studio respects and protects your data privacy
            </p>
          </div>
        </div>

        <div style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>1. Zero Data Logging Policy</h4>
            <p>
              SonicMedia Studio operates under a strict zero-logging policy. We do not store, track, or save your converted media URLs, download history, or personal IP addresses on permanent databases.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>2. Local Browser Storage Only</h4>
            <p>
              Your recent download history and PRO subscription state are saved locally inside your own web browser's <code>localStorage</code>. This data never leaves your device and can be cleared at any time.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>3. Cookies & Analytics</h4>
            <p>
              We do not use invasive tracking cookies or third-party ad profiling trackers. Anonymous server logs are strictly used for bandwidth health monitoring and DDoS prevention.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>4. Payment Reference Privacy</h4>
            <p>
              When submitting a 12-digit UPI UTR reference for PRO Pass verification, the reference is transmitted securely via HTTPS encrypted channels to our Telegram bot solely for manual payment verification.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '28px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px' }}>
            <CheckCircle2 size={16} />
            <span>Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
}
