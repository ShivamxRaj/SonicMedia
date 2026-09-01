import React, { useState, useEffect } from 'react';
import { Clipboard, ArrowRight, X, Sparkles, Youtube, Instagram, Music2, Twitter, Disc, AlertCircle } from 'lucide-react';

export default function HeroSection({ url, setUrl, onAnalyze, loading, error, onOpenBatchModal }) {
  const [copied, setCopied] = useState(false);

  // Keyboard Ctrl+V auto-fetch shortcut listener
  useEffect(() => {
    const handleGlobalPaste = (e) => {
      const pasteText = e.clipboardData?.getData('text');
      if (pasteText && (pasteText.startsWith('http://') || pasteText.startsWith('https://'))) {
        setUrl(pasteText);
        onAnalyze(pasteText);
      }
    };
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [setUrl, onAnalyze]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onAnalyze(text);
      }
    } catch (err) {
      console.error('Clipboard permission denied', err);
    }
  };

  const platforms = [
    { name: 'YouTube', icon: Youtube, color: '#ff0000' },
    { name: 'Instagram', icon: Instagram, color: '#e1306c' },
    { name: 'TikTok', icon: Music2, color: '#00f2fe' },
    { name: 'Twitter / X', icon: Twitter, color: '#1da1f2' },
    { name: 'SoundCloud', icon: Disc, color: '#ff5500' }
  ];

  return (
    <section style={{
      maxWidth: '920px',
      margin: '0 auto',
      padding: '50px 20px 25px',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 18px',
        borderRadius: '30px',
        background: 'rgba(168, 85, 247, 0.12)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        color: '#c084fc',
        fontSize: '0.875rem',
        fontWeight: 600,
        marginBottom: '22px'
      }}>
        <Sparkles size={16} />
        <span>Universal Social Media Downloader & Converter</span>
      </div>

      <h1 style={{
        fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
        fontWeight: 900,
        lineHeight: 1.15,
        marginBottom: '18px'
      }}>
        Paste Link & Convert <br />
        <span className="text-gradient">MP3 320kbps & 4K Video</span>
      </h1>

      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-muted)',
        maxWidth: '640px',
        margin: '0 auto 36px',
        lineHeight: 1.6
      }}>
        Extract studio-quality audio, customize ID3 metadata tags, or download 4K videos from YouTube, Instagram Reels, TikTok, Twitter/X, and SoundCloud instantly.
      </p>

      {/* Main Input Box with Dynamic Red Error Highlight */}
      <div 
        className="glass-card hero-input-box"
        style={{
          border: error ? '1.5px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: error ? '0 0 20px rgba(244, 63, 94, 0.25)' : 'none',
          marginBottom: error ? '10px' : '24px',
          transition: 'all 0.25s ease'
        }}
      >
        <input
          type="text"
          className="input-field"
          placeholder="Paste social media URL here (or press Ctrl+V for auto-fetch)..."
          value={url}
          onChange={(e) => {
            const val = e.target.value;
            setUrl(val);
            if (val.startsWith('http://') || val.startsWith('https://')) {
              onAnalyze(val);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && url.trim()) {
              onAnalyze(url.trim());
            }
          }}
          style={{
            border: 'none',
            background: 'transparent',
            padding: '14px 18px',
            fontSize: '1.05rem',
            boxShadow: 'none',
            flex: 1
          }}
        />

        {url && (
          <button
            onClick={() => setUrl('')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Clear input"
          >
            <X size={20} />
          </button>
        )}

        <div className="hero-input-actions">
          <button
            onClick={handlePaste}
            className="btn-secondary"
            style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}
            title="Paste from clipboard"
          >
            <Clipboard size={18} />
            <span>{copied ? 'Pasted!' : 'Paste'}</span>
          </button>

          <button
            onClick={() => onAnalyze(url)}
            className="btn-primary"
            disabled={!url.trim() || loading}
            style={{ padding: '12px 28px', whiteSpace: 'nowrap' }}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <>
                <span>Fetch</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Clean Single-Line Error Subtext (In-Input Style) */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          color: '#f87171',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '20px'
        }}>
          <AlertCircle size={15} color="#f87171" />
          <span>Invalid link. Please paste a valid video or track URL.</span>
        </div>
      )}

      {/* Clean Supported Platforms Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: error ? '0' : '20px'
      }}>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-dim)', fontWeight: 600 }}>Supported Services:</span>
        {platforms.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="platform-badge"
              style={{ opacity: 0.85 }}
            >
              <Icon size={14} color={item.color} />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
