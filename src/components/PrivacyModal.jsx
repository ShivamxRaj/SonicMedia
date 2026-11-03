import React from 'react';
import { Check, ChevronRight, Lock, X } from 'lucide-react';

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
    <div className="terms-overlay privacy-overlay" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <div className="terms-modal privacy-modal">
        <header className="terms-header">
          <div className="terms-heading-group">
            <div className="terms-icon"><Lock size={21} /></div>
            <div>
              <span className="terms-overline">SonicMedia / Privacy</span>
              <h2 id="privacy-title">Privacy Policy</h2>
              <p>Your data stays yours. Here is how we keep it that way.</p>
            </div>
          </div>

          <button className="terms-close" onClick={onClose} aria-label="Close privacy policy">
            <X size={18} />
          </button>
        </header>

        <div className="terms-meta">
          <span><span className="terms-status-dot" />Privacy-first service</span>
          <span>sonicmedia.me</span>
        </div>

        <div className="terms-scroll">
          <div className="terms-intro">
            <strong>Simple, transparent privacy.</strong>
            <span>We collect only what is needed to run the service, and keep your personal workflow on your device whenever possible.</span>
          </div>

          <div className="terms-clause-list">
            {sections.map((item) => (
              <article className="terms-clause" key={item.id}>
                <div className="terms-clause-number">{item.id}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
                <ChevronRight className="terms-clause-arrow" size={16} />
              </article>
            ))}
          </div>
        </div>

        <footer className="terms-footer">
          <span>Privacy is part of the SonicMedia experience.</span>
          <button className="btn-primary terms-accept" onClick={onClose}>
            <Check size={16} />
            <span>Got It</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
