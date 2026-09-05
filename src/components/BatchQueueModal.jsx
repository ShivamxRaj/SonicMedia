import React, { useState } from 'react';
import { X, Layers, Play, CheckCircle2, Download, Sparkles, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function BatchQueueModal({ isOpen, onClose, onProcessBatch, isPro, onOpenProModal }) {
  const [linksText, setLinksText] = useState('');
  const [formatType, setFormatType] = useState('audio'); // 'audio' | 'video'
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [batchResults, setBatchResults] = useState([]);

  if (!isOpen) return null;

  const handleStartBatch = async (selectedFormat) => {
    const targetFormat = selectedFormat || formatType;
    if (selectedFormat) setFormatType(selectedFormat);

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
    setStatusMessage('Scanning links & playlist items...');
    setBatchResults([]);

    const allItems = [];
    let currentId = 1;

    for (let i = 0; i < lines.length; i++) {
      const lineUrl = lines[i];
      setStatusMessage(`Analyzing item ${i + 1} of ${lines.length}...`);

      try {
        // If it's a playlist URL or list link, extract playlist tracks
        if (lineUrl.includes('playlist?') || lineUrl.includes('/sets/') || lineUrl.includes('list=')) {
          const res = await axios.get(`/api/playlist?url=${encodeURIComponent(lineUrl)}`);
          if (res.data && res.data.tracks && res.data.tracks.length > 0) {
            res.data.tracks.forEach((track) => {
              allItems.push({
                id: currentId++,
                url: track.url,
                title: track.title,
                uploader: track.uploader,
                duration: track.duration,
                type: targetFormat,
                quality: targetFormat === 'audio' ? '320k' : '1080p',
                formatLabel: targetFormat === 'audio' ? 'MP3 320kbps' : 'MP4 1080p',
                status: 'completed',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
            });
          } else {
            throw new Error('No tracks');
          }
        } else {
          // Regular single video URL
          const res = await axios.get(`/api/info?url=${encodeURIComponent(lineUrl)}`);
          const title = res.data?.title || `Track #${currentId}`;
          allItems.push({
            id: currentId++,
            url: lineUrl,
            title: title,
            uploader: res.data?.uploader || 'Artist',
            duration: res.data?.duration || '',
            type: targetFormat,
            quality: targetFormat === 'audio' ? '320k' : '1080p',
            formatLabel: targetFormat === 'audio' ? 'MP3 320kbps' : 'MP4 1080p',
            status: 'completed',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      } catch (err) {
        // Fallback for offline or unreachable metadata
        allItems.push({
          id: currentId++,
          url: lineUrl,
          title: `Media Track ${currentId}`,
          uploader: 'Social Media',
          duration: '',
          type: targetFormat,
          quality: targetFormat === 'audio' ? '320k' : '1080p',
          formatLabel: targetFormat === 'audio' ? 'MP3 320kbps' : 'MP4 1080p',
          status: 'completed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      setBatchResults([...allItems]);
    }

    setIsProcessing(false);
    setStatusMessage('');
  };

  const handleDownloadAll = () => {
    batchResults.forEach((item, index) => {
      setTimeout(() => {
        onProcessBatch(item);
      }, index * 1200);
    });
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
          <div style={{ paddingRight: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Batch Queue</h3>
              {!isPro && (
                <span style={{ fontSize: '0.72rem', color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={10} /> PRO
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              Paste playlist URLs or multiple links (one per line) to download all at once.
            </p>
          </div>
        </div>

        {/* Input Textarea */}
        <div style={{ marginBottom: '18px' }}>
          <textarea
            className="input-field"
            rows={5}
            placeholder={`https://www.youtube.com/playlist?list=...\nhttps://www.youtube.com/watch?v=...\nhttps://www.instagram.com/reel/...`}
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Format Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => handleStartBatch('audio')}
            disabled={isProcessing || !linksText.trim()}
            className="btn-primary"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 18px',
              fontSize: '0.9rem',
              justifyContent: 'center',
              opacity: isProcessing && formatType !== 'audio' ? 0.5 : 1
            }}
          >
            {isProcessing && formatType === 'audio' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="spinner" />
                <span style={{ fontSize: '0.825rem' }}>{statusMessage || 'Extracting...'}</span>
              </div>
            ) : (
              <>
                <Download size={16} />
                <span>Batch MP3 Audio (320k)</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleStartBatch('video')}
            disabled={isProcessing || !linksText.trim()}
            className="btn-primary"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 18px',
              fontSize: '0.9rem',
              justifyContent: 'center',
              background: formatType === 'video' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.08)',
              opacity: isProcessing && formatType !== 'video' ? 0.5 : 1
            }}
          >
            {isProcessing && formatType === 'video' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="spinner" />
                <span style={{ fontSize: '0.825rem' }}>{statusMessage || 'Extracting...'}</span>
              </div>
            ) : (
              <>
                <Download size={16} />
                <span>Batch MP4 Video (1080p)</span>
              </>
            )}
          </button>
        </div>

        {/* Results Queue */}
        {batchResults.length > 0 && (
          <div style={{
            background: 'rgba(10, 12, 20, 0.7)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
                Extracted Tracks ({batchResults.length} Ready)
              </h4>
              <button
                onClick={handleDownloadAll}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '6px' }}
              >
                <Download size={14} />
                <span>Save All Tracks</span>
              </button>
            </div>

            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 700 }}>{item.title}</span>
                      {item.uploader && <span style={{ color: 'var(--text-dim)', marginLeft: '6px', fontSize: '0.75rem' }}>• {item.uploader}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{item.formatLabel}</span>
                    <button
                      onClick={() => onProcessBatch(item)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                    >
                      <Download size={12} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

