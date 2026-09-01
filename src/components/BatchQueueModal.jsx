import React, { useState } from 'react';
import { X, Layers, Play, CheckCircle2, Download, Sparkles, Lock, ArrowRight } from 'lucide-react';

export default function BatchQueueModal({ isOpen, onClose, onProcessBatch, isPro, onOpenProModal }) {
  const [linksText, setLinksText] = useState('');
  const [formatType, setFormatType] = useState('audio'); // 'audio' | 'video'
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState([]);

  if (!isOpen) return null;

  const handleStartBatch = () => {
    const lines = linksText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('http://') || l.startsWith('https://'));

    if (lines.length === 0) {
      alert('Please enter at least one valid media URL (http:// or https://)');
      return;
    }

    if (lines.length > 2 && !isPro) {
      onOpenProModal();
      return;
    }

    setIsProcessing(true);
    setBatchResults([]);

    let count = 0;
    const items = [];

    const interval = setInterval(() => {
      if (count >= lines.length) {
        clearInterval(interval);
        setIsProcessing(false);
        return;
      }

      const url = lines[count];
      const resultItem = {
        id: count + 1,
        url,
        title: `Track #${count + 1} - Social Media Media`,
        type: formatType,
        quality: formatType === 'audio' ? 'MP3 320kbps' : 'MP4 1080p',
        status: 'completed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      items.push(resultItem);
      setBatchResults([...items]);
      count++;
    }, 800);
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
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Batch Multi-Link Queue</h3>
              {!isPro && (
                <span style={{ fontSize: '0.75rem', color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={10} /> PRO (Max 2 for Free)
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Paste multiple links (one per line) to extract & download all at once.
            </p>
          </div>
        </div>

        {/* Input Textarea */}
        <div style={{ marginBottom: '18px' }}>
          <textarea
            className="input-field"
            rows={5}
            placeholder={`https://www.youtube.com/watch?v=...\nhttps://www.instagram.com/reel/...\nhttps://www.tiktok.com/...`}
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Format Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setFormatType('audio')}
              className={formatType === 'audio' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Batch MP3 Audio
            </button>
            <button
              onClick={() => setFormatType('video')}
              className={formatType === 'video' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Batch MP4 Video
            </button>
          </div>

          <button
            onClick={handleStartBatch}
            disabled={isProcessing || !linksText.trim()}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            {isProcessing ? (
              <div className="spinner" />
            ) : (
              <>
                <span>Start Batch Queue</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Results Queue */}
        {batchResults.length > 0 && (
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            background: 'rgba(10, 12, 20, 0.7)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Batch Progress ({batchResults.length} Ready)
            </h4>
            {batchResults.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  fontSize: '0.825rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontWeight: 700 }}>{item.title}</span>
                  <span style={{ color: 'var(--text-dim)' }}>({item.quality})</span>
                </div>
                <button
                  onClick={() => onProcessBatch(item)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Download size={12} />
                  <span>Save</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
