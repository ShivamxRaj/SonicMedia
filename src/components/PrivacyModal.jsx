import React from 'react';
import { X, Lock, Check } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sections = [
    {
      id: '01',
      title: 'Zero Data Logging Policy',
      content: 'SonicMedia Studio operates under a strict zero-data logging principle. We do not store, track, or record your converted media URLs, download history, or IP addresses on permanent database servers.'
    },
    {
      id: '02',
      title: 'Local Device Storage Only',
      content: 'Your recent download activity and PRO status pass are stored locally inside your browser\'s private localStorage. This data stays entirely on your own device and can be cleared by you at any time.'
    },
    {
      id: '03',
      title: 'No Invasive Tracking Cookies',
      content: 'We do not utilize invasive advertising profile cookies or third-party tracking scripts. Anonymous server performance metrics are solely utilized for server load management and anti-DDoS protection.'
    },
    {
      id: '04',
      title: 'Payment Reference Security',
      content: 'When submitting a 12-digit UPI UTR reference for PRO Pass verification, the reference is transmitted over SSL encrypted HTTPS directly to our Telegram Bot for instant admin approval.'
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
      padding: '12px'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        background: 'linear-gradient(180deg, #111526 0%, #0a0d18 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.12)',
        padding: '20px 18px',
        position: 'relative',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              <Lock size={12} />
              <span>Data Protection</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', margin: 0 }}>
              SonicMedia Studio • Privacy First
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Clause Cards */}
        <div style={{
          overflowY: 'auto',
          paddingRight: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1
        }}>
          {sections.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderLeft: '3px solid #38bdf8',
                borderRadius: '12px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8' }}>{item.id}</span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{item.title}</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Responsive Footer Bar */}
        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Privacy Policy
          </span>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.82rem',
              borderRadius: '10px',
              flex: '1 1 auto',
              justifyContent: 'center'
            }}
          >
            <Check size={15} />
            <span>Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
}
