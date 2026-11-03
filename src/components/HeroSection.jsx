import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clipboard,
  Disc,
  Instagram,
  Music2,
  Twitter,
  X,
  Youtube
} from 'lucide-react';

export default function HeroSection({ url, setUrl, onAnalyze, loading, error }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleGlobalPaste = (event) => {
      const pasteText = event.clipboardData?.getData('text');
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
    } catch (clipboardError) {
      console.error('Clipboard permission denied', clipboardError);
    }
  };

  const platforms = [
    { name: 'YouTube', icon: Youtube },
    { name: 'Instagram', icon: Instagram },
    { name: 'TikTok', icon: Music2 },
    { name: 'Twitter / X', icon: Twitter },
    { name: 'SoundCloud', icon: Disc }
  ];

  return (
    <section className="hero-section-container">
      <div className="hero-layout">
        <div className="hero-copy">
          <h1 className="hero-title">
            Save what inspires you.
            <span className="hero-title-accent">In the format you want.</span>
          </h1>

          <p className="hero-description">
            Convert a link into polished audio or high-quality video with a calm, focused workflow.
          </p>

          <div className="hero-proof-row">
            <span><Check size={14} /> Studio quality</span>
            <span><Check size={14} /> Fast processing</span>
            <span><Check size={14} /> No sign-up</span>
          </div>
        </div>

        <div className="hero-converter-card glass-card">
          <div className="converter-card-header">
            <div>
              <span className="converter-overline">Start a conversion</span>
              <h2>Paste your link</h2>
            </div>
          </div>

          <div className={`hero-input-box ${url ? 'has-value' : ''} ${error ? 'has-error' : ''}`}>
            <div className="hero-input-leading">↗</div>
            <input
              type="text"
              className="input-field"
              placeholder="Paste a YouTube, Instagram or TikTok link"
              aria-label="Paste video or track URL"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && url.trim()) onAnalyze(url.trim());
              }}
            />

            {url && (
              <button className="hero-clear-button" onClick={() => setUrl('')} title="Clear input" aria-label="Clear input">
                <X size={17} />
              </button>
            )}
          </div>

          <div className="hero-input-actions">
            <button onClick={handlePaste} className="btn-secondary" title="Paste from clipboard">
              <Clipboard size={17} />
              <span>{copied ? 'Pasted' : 'Paste'}</span>
            </button>
            <button onClick={() => onAnalyze(url)} className="btn-primary" disabled={!url.trim() || loading}>
              {loading ? <div className="spinner" /> : <><span>Fetch media</span><ArrowRight size={17} /></>}
            </button>
          </div>

          {error && (
            <div className="hero-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="converter-card-footnote">
            <span className="converter-secure-dot" />
            <span>Paste a public link to get started</span>
          </div>
        </div>
      </div>

      <div className="hero-platforms">
        <span className="hero-platform-label">Supported platforms</span>
        <div className="hero-platform-list">
          {platforms.map(({ name, icon: Icon }) => (
            <span className="platform-badge" key={name}>
              <Icon size={14} />
              <span>{name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
