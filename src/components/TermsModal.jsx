import React from 'react';
import { Check, ChevronRight, Shield, X } from 'lucide-react';

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
    <div className="terms-overlay" role="dialog" aria-modal="true" aria-labelledby="terms-title">
      <div className="terms-modal">
        <header className="terms-header">
          <div className="terms-heading-group">
            <div className="terms-icon"><Shield size={22} /></div>
            <div>
              <span className="terms-overline">SonicMedia / Legal</span>
              <h2 id="terms-title">Terms of Service</h2>
              <p>Clear guidelines for a safe and responsible experience.</p>
            </div>
          </div>

          <button className="terms-close" onClick={onClose} aria-label="Close terms of service">
            <X size={18} />
          </button>
        </header>

        <div className="terms-meta">
          <span><span className="terms-status-dot" />Service guidelines</span>
          <span>sonicmedia.me</span>
        </div>

        <div className="terms-scroll">
          <div className="terms-intro">
            <strong>Please read before using SonicMedia.</strong>
            <span>These terms explain how the service may be used and what you can expect from the platform.</span>
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
          <span>By continuing, you acknowledge these terms.</span>
          <button className="btn-primary terms-accept" onClick={onClose}>
            <Check size={16} />
            <span>I Accept &amp; Agree</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
