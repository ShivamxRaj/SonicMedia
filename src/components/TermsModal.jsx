import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
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
            <FileText size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Terms & Conditions</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Official Usage Terms & Service Guidelines for SonicMedia Studio
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
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>1. Acceptance of Terms</h4>
            <p>
              By accessing and using <strong>SonicMedia Studio (sonicmedia.me)</strong>, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>2. Permitted Personal Use Only</h4>
            <p>
              SonicMedia Studio is designed strictly for personal, non-commercial offline backup and educational use. Users are prohibited from converting or downloading copyrighted content for commercial distribution or redistribution without authorization from content creators.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>3. Intellectual Property & Fair Use</h4>
            <p>
              SonicMedia Studio does not host, store, or index any copyrighted audio or video files on its servers. All media processing occurs dynamically via public streaming streams. Users are solely responsible for ensuring their usage adheres to local copyright laws and Fair Use regulations.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>4. User Responsibility & Compliance</h4>
            <p>
              You agree not to use SonicMedia Studio for automated scraping, malicious attacks, or any activity that violates third-party terms of service or copyright laws.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>5. Modifications to Service</h4>
            <p>
              SonicMedia Studio reserves the right to modify, suspend, or discontinue any feature or service at any time without prior notice.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '28px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px' }}>
            <CheckCircle2 size={16} />
            <span>I Understand & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
}
