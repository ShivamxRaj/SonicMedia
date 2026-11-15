import React, { useState } from 'react';
import {
  ChevronDown,
  Film,
  Headphones,
  HelpCircle,
  ShieldCheck,
  Smartphone,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: Headphones,
    title: 'Studio audio',
    desc: 'Save crisp MP3, WAV, or FLAC audio with flexible quality options.'
  },
  {
    icon: Film,
    title: 'HD video',
    desc: 'Keep your favourite videos sharp with fast 1080p and 4K downloads.'
  },
  {
    icon: Zap,
    title: 'Built for speed',
    desc: 'A focused workflow that gets you from link to download in seconds.'
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    desc: 'No account, no clutter, and no unnecessary steps before you start.'
  }
];

const faqs = [
  {
    icon: Zap,
    question: 'How do I download a file?',
    answer: 'Paste a supported link into the search bar, select your format and quality, then choose Download.'
  },
  {
    icon: Smartphone,
    question: 'Which platforms are supported?',
    answer: 'SonicMedia supports YouTube, Instagram, TikTok, Twitter/X, SoundCloud, Facebook, and many more.'
  },
  {
    icon: Headphones,
    question: 'Can I customise audio before saving?',
    answer: 'Yes. Audio Studio lets you adjust tempo and edit basic ID3 tags before downloading.'
  }
];

export default function FeaturesSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="features-page-section">
      <div className="section-heading features-section-heading">
        <h2>Powerful tools for perfect media conversions</h2>
        <p>Simple tools, polished output, and a workflow that stays out of your way.</p>
      </div>

      <div className="feature-grid">
        {features.map(({ icon: Icon, title, desc }, index) => (
          <article className={`feature-card feature-card-${index + 1} glass-card`} key={title}>
            <span className="feature-card-number">0{index + 1}</span>
            <div className="feature-icon"><Icon size={21} /></div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <span className="feature-card-link">Explore capability <span>↗</span></span>
          </article>
        ))}
      </div>

      <div className="trust-panel glass-card">
        <div>
          <span className="section-eyebrow">Made for everyday creators</span>
          <h2>From link to library, without the clutter.</h2>
        </div>
        <div className="trust-content">
          <p>Choose audio when you want the soundtrack. Choose video when you want the full moment. SonicMedia keeps both experiences in one place.</p>
          <div className="trust-points">
            <span>Audio + video</span>
            <span>Creator-first</span>
            <span>Ready when you are</span>
          </div>
        </div>
      </div>

      <div className="faq-panel glass-card">
        <div className="faq-heading">
          <div className="feature-icon"><HelpCircle size={21} /></div>
          <div>
            <span className="section-eyebrow">Quick answers</span>
            <h2>Frequently asked questions</h2>
          </div>
        </div>

        <div className="faq-list">
          {faqs.map(({ icon: Icon, question, answer }, index) => {
            const isOpen = openIndex === index;
            return (
              <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}>
                <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)}>
                  <span className="faq-question">
                    <span className="faq-icon"><Icon size={16} /></span>
                    <span>{question}</span>
                  </span>
                  <ChevronDown size={18} />
                </button>
                {isOpen && <p>{answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
