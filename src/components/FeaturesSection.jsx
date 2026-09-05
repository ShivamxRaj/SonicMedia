import React, { useState } from 'react';
import { Zap, Headphones, Film, ShieldCheck, HelpCircle, ChevronDown, Sparkles, Music, Video, Smartphone, Sliders } from 'lucide-react';

export default function FeaturesSection() {
  const [openIndex, setOpenIndex] = useState(0); // Default open first FAQ item

  const features = [
    {
      icon: Headphones,
      title: '320kbps Studio Audio',
      desc: 'Extract pristine studio quality MP3, WAV, and FLAC audio streams with crystal clear sound.',
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.25)'
    },
    {
      icon: Film,
      title: '4K & 1080p Ultra HD Video',
      desc: 'Download videos up to 4K 2160p resolution with high frame rates, original audio tracks, and HDR color grading.',
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.25)'
    },
    {
      icon: Zap,
      title: '1000+ Platforms Supported',
      desc: 'YouTube, Instagram Reels, TikTok without watermark, Twitter/X, SoundCloud, Facebook and more.',
      color: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.25)'
    },
    {
      icon: ShieldCheck,
      title: '100% Free & Ad-Free',
      desc: 'No registration, no pop-up ads, no malware. Pure high-speed media conversion directly in browser.',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.25)'
    }
  ];

  const faqs = [
    {
      icon: Music,
      category: 'Audio Extraction',
      q: 'How to convert YouTube videos to 320kbps MP3 audio for free?',
      a: 'Simply copy the YouTube video link, paste it into the SonicMedia input box, select 320kbps MP3 Ultra HD, and click Download. Our server streams the audio instantly without software installation.'
    },
    {
      icon: Video,
      category: '4K HDR Video',
      q: 'Can I download 4K Ultra HD videos with HDR color enhancement?',
      a: 'Yes! SonicMedia applies FFmpeg HDR color grading and edge sharpening filters to 4K 2160p video downloads for vibrant, remaster-quality visuals.'
    },
    {
      icon: Smartphone,
      category: 'Social Media',
      q: 'How to download Instagram Reels & TikTok without watermark?',
      a: 'Paste any Instagram Reel or TikTok URL into SonicMedia. The extraction engine automatically strips platform watermarks and delivers clean HD video.'
    },
    {
      icon: Sliders,
      category: 'Audio Studio',
      q: 'How to make Slowed + Reverb or Nightcore remixes online?',
      a: 'Use the built-in Audio Studio tools on SonicMedia to toggle 0.8x Slowed + Reverb, 1.25x Nightcore, or 1.5x Fast Workout pitch modifications directly before saving your MP3.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{
      maxWidth: '1100px',
      margin: '0 auto 80px',
      padding: '0 24px'
    }}>
      {/* Features Grid Header */}
      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          color: '#c084fc',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <Sparkles size={14} />
          <span>ULTRA HIGH PERFORMANCE</span>
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Why Choose <span className="text-gradient">SonicMedia</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Engineered for speed, studio-fidelity audio, and seamless high-definition video extraction.
        </p>
      </div>

      {/* Features Cards */}
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
              className="glass-card"
              style={{
                padding: '26px 22px',
                background: 'rgba(12, 14, 22, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.07)'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Icon size={22} color={item.color} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* SEO Interactive FAQ Accordions */}
      <div className="glass-card" style={{
        padding: '32px',
        background: 'rgba(12, 14, 22, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.07)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={22} color="#38bdf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Everything you need to know about downloading & converting media
              </p>
            </div>
          </div>

          <span style={{
            fontSize: '0.78rem',
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: 700,
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            4 Key Guides
          </span>
        </div>

        {/* Accordion Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const IconComponent = faq.icon;
            return (
              <div
                key={i}
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: isOpen ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.05)',
                  background: isOpen ? 'rgba(18, 22, 34, 0.7)' : 'rgba(255, 255, 255, 0.02)',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: isOpen ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}>
                      <IconComponent size={16} color="#fff" />
                    </div>

                    <div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: isOpen ? '#c084fc' : 'var(--text-dim)',
                        display: 'block',
                        marginBottom: '2px'
                      }}>
                        {faq.category}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isOpen ? '#38bdf8' : '#e2e8f0' }}>
                        {faq.q}
                      </h3>
                    </div>
                  </div>

                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    color: isOpen ? '#a855f7' : 'var(--text-muted)'
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Collapsible Content Body */}
                {isOpen && (
                  <div style={{
                    padding: '0 22px 20px 70px',
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65,
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '14px',
                    animation: 'fadeIn 0.25s ease'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
