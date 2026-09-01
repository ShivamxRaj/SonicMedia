import React from 'react';
import { Zap, Headphones, Film, ShieldCheck, Infinity, Sparkles } from 'lucide-react';

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
      desc: 'Download videos up to 4K 2160p resolution with high frame rates and original audio tracks.',
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

  return (
    <section style={{
      maxWidth: '1100px',
      margin: '0 auto 80px',
      padding: '0 24px'
    }}>
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
        gap: '20px'
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
    </section>
  );
}
