import React from 'react';
import { Zap, Headphones, Film, ShieldCheck, HelpCircle } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Headphones,
      title: '320kbps Studio Audio',
      desc: 'Extract pristine studio quality MP3, WAV, and FLAC audio streams with crystal clear sound.',
      color: '#8b5cf6'
    },
    {
      icon: Film,
      title: '4K & 1080p Ultra HD Video',
      desc: 'Download videos up to 4K 2160p resolution with high frame rates, original audio tracks, and HDR color grading.',
      color: '#06b6d4'
    },
    {
      icon: Zap,
      title: '1000+ Platforms Supported',
      desc: 'YouTube, Instagram Reels, TikTok without watermark, Twitter/X, SoundCloud, Facebook and more.',
      color: '#ec4899'
    },
    {
      icon: ShieldCheck,
      title: '100% Free & Safe',
      desc: 'No registration, no pop-up ads, no malware. Pure high-speed media conversion directly in browser.',
      color: '#10b981'
    }
  ];

  const faqs = [
    {
      q: 'How to convert YouTube videos to 320kbps MP3 audio for free?',
      a: 'Simply copy the YouTube video link, paste it into the SonicMedia input box, select 320kbps MP3, and click Download. No installation required.'
    },
    {
      q: 'Can I download 4K Ultra HD videos with HDR color enhancement?',
      a: 'Yes! SonicMedia applies FFmpeg HDR color grading and edge sharpening filters to 4K 2160p video downloads for vibrant, remaster-quality visuals.'
    },
    {
      q: 'How to download Instagram Reels & TikTok without watermark?',
      a: 'Paste any Instagram Reel or TikTok URL into SonicMedia. The engine strips watermarks and lets you download clean MP4 HD video.'
    },
    {
      q: 'How to make Slowed + Reverb or Nightcore remixes online?',
      a: 'Use the built-in Audio Studio tools on SonicMedia to toggle 0.8x Slowed + Reverb or 1.25x Nightcore pitch mods before downloading your MP3.'
    }
  ];

  return (
    <section style={{
      maxWidth: '1100px',
      margin: '0 auto 80px',
      padding: '0 24px'
    }}>
      {/* Features Grid Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>
          Why Choose <span className="text-gradient">SonicMedia</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Engineered for speed, high fidelity audio, and seamless video extraction.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '60px'
      }}>
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card glass-card-hover"
              style={{ padding: '24px' }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: `${item.color}20`,
                border: `1px solid ${item.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Icon size={24} color={item.color} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* SEO FAQ & Content Keyword Hierarchy */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <HelpCircle size={22} color="#38bdf8" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            Frequently Asked Questions & User Guide
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              padding: '18px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
