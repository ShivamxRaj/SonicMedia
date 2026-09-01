import React from 'react';
import { X, ShieldAlert, AlertTriangle, Mail, CheckCircle2 } from 'lucide-react';

export default function DmcaModal({ isOpen, onClose }) {
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>DMCA & Legal Disclaimer</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Copyright Compliance & Takedown Request Policy
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
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>1. Copyright Respect Policy</h4>
            <p>
              SonicMedia Studio respects the intellectual property rights of creators and copyright holders. SonicMedia Studio does not host, index, or store any files on its servers. All processing occurs in real-time.
            </p>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>2. DMCA Takedown Notice Procedure</h4>
            <p>
              If you are a copyright owner or an agent thereof and believe that any content made accessible through our service infringes upon your copyrights, please send a written takedown request including:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material or URL requested to be blocked.</li>
              <li>Your contact information (Email, Name, Address).</li>
            </ul>
          </section>

          <section>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontWeight: 700 }}>3. Contact Legal Agent</h4>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
              <Mail size={16} />
              <span>Email: <strong>support@sonicmedia.me</strong></span>
            </p>
          </section>
        </div>

        <div style={{ marginTop: '28px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px' }}>
            <CheckCircle2 size={16} />
            <span>Close Disclaimer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
