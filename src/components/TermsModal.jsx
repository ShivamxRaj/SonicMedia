import React from 'react';
import { X, FileText, Check, Shield } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sections = [
    {
      id: '01',
      title: 'Acceptance of Terms',
      content: 'By accessing SonicMedia Studio (sonicmedia.me), you agree to comply with these terms. If you do not agree with any part of these terms, you may not use our services.'
    },
    {
      id: '02',
      title: 'Permitted Personal Use Only',
      content: 'SonicMedia Studio is designed exclusively for personal, non-commercial offline backups and educational purposes. Converting copyrighted media for commercial distribution without authorization from content owners is strictly prohibited.'
    },
    {
      id: '03',
      title: 'Intellectual Property & Fair Use',
      content: 'SonicMedia Studio does not host, index, or store any audio or video files on its servers. All conversion streams are processed in real-time. Users bear full responsibility for ensuring their download activity complies with local copyright laws and Fair Use doctrine.'
    },
    {
      id: '04',
      title: 'Prohibited Activities',
      content: 'You agree not to use SonicMedia Studio for automated web scraping, denial-of-service (DDoS) attacks, or any malicious activity that disrupts server availability or violates third-party platform policies.'
    },
    {
      id: '05',
      title: 'Disclaimer & Service Availability',
      content: 'Services are provided on an "as is" and "as available" basis without warranties of any kind. SonicMedia Studio reserves the right to modify or pause features without prior notice.'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 5, 12, 0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        background: 'linear-gradient(180deg, #111526 0%, #0a0d18 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.12)',
        padding: '28px 32px',
        position: 'relative',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <Shield size={12} />
              <span>Legal Guidelines</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
              Terms of Service
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>
              Last updated: September 2026 • SonicMedia Studio
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Clause Cards */}
        <div style={{
          overflowY: 'auto',
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          flex: 1
        }}>
          {sections.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderLeft: '3px solid #6366f1',
                borderRadius: '14px',
                padding: '16px 20px',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', opacity: 0.8 }}>{item.id}</span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{item.title}</h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Bar */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            SonicMedia Studio • sonicmedia.me
          </span>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '8px 20px',
              fontSize: '0.85rem',
              borderRadius: '12px'
            }}
          >
            <Check size={16} />
            <span>I Accept & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
}
