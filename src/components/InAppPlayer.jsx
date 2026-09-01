import React, { useState, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Music, Maximize2, Sparkles, Disc } from 'lucide-react';

export default function InAppPlayer({ media, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  if (!media) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Sample audio streams for demo preview playback
  const previewAudioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

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
        maxWidth: '550px',
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

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="platform-badge" style={{ marginBottom: '14px', background: 'rgba(139, 92, 246, 0.2)' }}>
            <Sparkles size={14} color="#8b5cf6" />
            <span>Interactive Media Player</span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
            {media.title}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {media.uploader} • {media.duration}
          </p>
        </div>

        {/* Vinyl / Cover Art Visualizer */}
        <div style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 28px',
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          border: '4px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isPlaying ? '0 0 40px rgba(139, 92, 246, 0.6)' : 'none',
          animation: isPlaying ? 'rotateVinyl 10s linear infinite' : 'none'
        }}>
          <img
            src={media.thumbnail}
            alt={media.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#090a0f',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Disc size={20} color="#8b5cf6" />
            </div>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={previewAudioSrc}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Waveform Animation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          height: '40px',
          marginBottom: '28px'
        }}>
          {[40, 75, 30, 90, 50, 85, 35, 95, 60, 45, 80, 55, 70, 30].map((h, idx) => (
            <div
              key={idx}
              style={{
                width: '4px',
                height: isPlaying ? `${h}%` : '20%',
                background: 'var(--primary-gradient)',
                borderRadius: '4px',
                transition: 'height 0.25s ease'
              }}
            />
          ))}
        </div>

        {/* Player Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}>
          <button
            onClick={toggleMute}
            className="btn-secondary"
            style={{ borderRadius: '50%', width: '46px', height: '46px', padding: 0 }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button
            onClick={togglePlay}
            className="btn-primary"
            style={{
              borderRadius: '50%',
              width: '64px',
              height: '64px',
              padding: 0,
              boxShadow: '0 8px 30px rgba(139, 92, 246, 0.5)'
            }}
          >
            {isPlaying ? <Pause size={28} fill="#fff" /> : <Play size={28} fill="#fff" style={{ marginLeft: '4px' }} />}
          </button>

          <button
            onClick={() => alert('Full screen audio player engaged')}
            className="btn-secondary"
            style={{ borderRadius: '50%', width: '46px', height: '46px', padding: 0 }}
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <style>{`
          @keyframes rotateVinyl {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
