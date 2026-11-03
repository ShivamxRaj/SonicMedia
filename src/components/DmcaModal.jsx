import React from 'react';
import { Check, ChevronRight, Mail, ShieldAlert, X } from 'lucide-react';

export default function DmcaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sections = [
    {
      id: '01',
      title: 'What SonicMedia Provides',
      content: 'SonicMedia is a user-directed conversion tool. We do not host, index, or permanently store audio or video files. Processing begins only when a user submits a link and is handled in real time.'
    },
    {
      id: '02',
      title: 'Your Responsibility',
      content: 'Only download content you own, have permission to use, or are legally allowed to save. Users are responsible for respecting copyright, intellectual property rights, and the terms of the source platform.'
    },
    {
      id: '03',
      title: 'Submitting a Takedown Request',
      content: 'Copyright owners or authorised representatives may contact us with the exact source URL, details of the copyrighted work, proof of ownership, a good-faith statement, and valid contact information so the request can be reviewed.'
    },
    {
      id: '04',
      title: 'Review & Response',
      content: 'Complete and credible notices are reviewed by our team. Where appropriate, we may restrict access to the requested conversion route while the matter is assessed. Send official notices to support@sonicmedia.me.'
    }
  ];

  return (
    <div className="terms-overlay dmca-overlay" role="dialog" aria-modal="true" aria-labelledby="dmca-title">
      <div className="terms-modal dmca-modal">
        <header className="terms-header">
          <div className="terms-heading-group">
            <div className="terms-icon"><ShieldAlert size={22} /></div>
            <div>
              <span className="terms-overline">SonicMedia / Copyright</span>
              <h2 id="dmca-title">DMCA Disclaimer</h2>
              <p>A clear process for protecting creative work.</p>
            </div>
          </div>

          <button className="terms-close" onClick={onClose} aria-label="Close DMCA disclaimer">
            <X size={18} />
          </button>
        </header>

        <div className="terms-meta">
          <span><span className="terms-status-dot" />Copyright guidance</span>
          <span>sonicmedia.me</span>
        </div>

        <div className="terms-scroll">
          <div className="terms-intro">
            <strong>Respect the people behind the content.</strong>
            <span>SonicMedia supports responsible personal use and provides a direct channel for copyright owners to raise concerns.</span>
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
          <a
            className="dmca-contact"
            href="mailto:support@sonicmedia.me?subject=DMCA%20Support%20Request"
          >
            <Mail size={14} />
            <span>support@sonicmedia.me</span>
          </a>
          <button className="btn-primary terms-accept" onClick={onClose}>
            <Check size={16} />
            <span>Close Disclaimer</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
