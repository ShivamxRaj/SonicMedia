import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, CheckCircle, Sparkles, Copy, Check, HelpCircle, Loader2 } from 'lucide-react';

export default function ProSubscriptionModal({ isOpen, onClose, isPro, onActivatePro }) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [utrSuccess, setUtrSuccess] = useState(false);
  const [utrError, setUtrError] = useState('');

  // Active Personal UPI ID
  const myUpiId = 'shivam.r452@ptyes';

  // Real-time Telegram Approval Polling Listener
  useEffect(() => {
    let timer;
    if (isOpen && isPolling && utrNumber.trim()) {
      timer = setInterval(async () => {
        try {
          const res = await axios.get(`/api/payment-status?utr=${utrNumber.trim()}`);
          if (res.data && res.data.status === 'VERIFIED_PRO_ACTIVE') {
            clearInterval(timer);
            setIsPolling(false);
            setUtrSuccess(true);
            setTimeout(() => {
              onActivatePro(`UTR-${utrNumber.trim()}`);
              setUtrSuccess(false);
              onClose();
            }, 1200);
          } else if (res.data && res.data.status === 'REJECTED_FAKE_UTR') {
            clearInterval(timer);
            setIsPolling(false);
            setUtrError('❌ Payment rejected by Admin. Please check receipt UTR.');
          }
        } catch (err) {
          console.error('Polling error', err);
        }
      }, 1500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, isPolling, utrNumber, onActivatePro, onClose]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText(myUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch (e) {}
  };

  const handleVerifyUtr = async () => {
    const cleanUtr = (utrNumber || '').trim();
    
    // Strict 12-Digit Numeric UTR Validation
    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError('⚠️ Enter the 12-digit UPI Ref ID (e.g. 624483836603) found on GPay/PhonePe receipt.');
      return;
    }

    setUtrError('');
    setIsSubmitting(true);

    try {
      // Submit UTR reference to backend /api/submit-payment for ₹9
      const response = await axios.post('/api/submit-payment', { utr: cleanUtr, amount: 9 });
      
      if (response.data && response.data.success) {
        if (response.data.status === 'VERIFIED_PRO_ACTIVE') {
          setUtrSuccess(true);
          setTimeout(() => {
            onActivatePro(`UTR-${cleanUtr}`);
            setUtrSuccess(false);
            onClose();
          }, 1200);
        } else {
          setIsPolling(true);
        }
      }
    } catch (e) {
      console.error('UTR submission failed', e);
      const errMsg = e.response?.data?.error || '⚠️ Invalid or duplicate UTR number.';
      setUtrError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '28px',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: 'var(--primary-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)',
            marginBottom: '10px'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
            Sonic<span className="text-gradient">PRO</span> Studio Pass
          </h2>
          
          <div style={{ marginTop: '6px' }}>
            <span style={{ fontSize: '2.3rem', fontWeight: 900, color: '#38bdf8' }}>₹9</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}> / month</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {[
            'MP3 320kbps Studio Audio',
            '4K 2160p Ultra HD Video',
            'Slowed & Nightcore Remix',
            'Unlimited Batch Queue'
          ].map((feat, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              background: 'rgba(255,255,255,0.03)',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <CheckCircle size={14} color="#10b981" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Direct UPI QR Payment Container */}
        <div style={{
          background: 'rgba(10, 12, 20, 0.85)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
            Scan QR with GPay, PhonePe, Paytm, or BHIM to pay <strong>₹9</strong>
          </p>

          {/* Live UPI QR Code Image configured for ₹9 */}
          <div style={{
            background: '#ffffff',
            padding: '12px',
            borderRadius: '14px',
            display: 'inline-block',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            marginBottom: '14px'
          }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${myUpiId}&pn=SonicMediaPRO&am=9&cu=INR`)}`}
              alt="UPI Payment QR Code"
              style={{ width: '140px', height: '140px', display: 'block' }}
            />
          </div>

          {/* Copy UPI ID */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>UPI ID: {myUpiId}</span>
            <button
              onClick={handleCopyUpi}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copiedUpi ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Conditional UTR Input vs Waiting State */}
          {isPolling ? (
            <div style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <Loader2 size={18} className="spinner" />
              <span>Waiting for Admin Telegram Approval...</span>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter 12-digit UPI Ref ID..."
                  value={utrNumber}
                  maxLength={12}
                  onChange={(e) => {
                    setUtrNumber(e.target.value);
                    if (utrError) setUtrError('');
                  }}
                  style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                />
                <button
                  onClick={handleVerifyUtr}
                  className="btn-primary"
                  disabled={!utrNumber.trim() || isSubmitting}
                  style={{ padding: '10px 18px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                >
                  {utrSuccess ? 'Verified!' : isSubmitting ? 'Verifying...' : 'Unlock PRO'}
                </button>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: utrError ? '6px' : '14px', textAlign: 'left' }}>
                💡 Enter 12-digit <strong>UPI Ref ID</strong> (e.g. {utrNumber || '624483836603'}) from PhonePe/GPay receipt.
              </p>
            </div>
          )}

          {/* UTR Validation Error Subtext */}
          {utrError && (
            <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px' }}>
              {utrError}
            </p>
          )}

          {/* Payment Failed / Help Link */}
          <div style={{
            paddingTop: '10px',
            borderTop: '1px dashed var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <HelpCircle size={13} />
            <span>Payment failed or money deducted?</span>
            <a
              href="https://wa.me/?text=Hi%20SonicMedia%20Support,%20I%20need%20help%20with%20PRO%20Payment"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
