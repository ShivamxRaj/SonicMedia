import React, { useState } from 'react';
import { Sliders, Lock, Sparkles, Edit3 } from 'lucide-react';

export default function AudioStudioTools({ media, audioSettings, onChangeSettings, isPro, onOpenProModal }) {
  const [showTagEditor, setShowTagEditor] = useState(false);

  const speedOptions = [
    { label: '0.8x (Slowed + Reverb)', val: '0.8x', icon: '🌙', isProOnly: true },
    { label: '1.0x (Original Master)', val: '1.0x', icon: '🎧', isProOnly: false },
    { label: '1.25x (Nightcore Remix)', val: '1.25x', icon: '⚡', isProOnly: true },
    { label: '1.5x (Fast Workout)', val: '1.5x', icon: '🔥', isProOnly: false }
  ];

  const handleSelectSpeed = (s) => {
    if (s.isProOnly && !isPro) {
      onOpenProModal();
    } else {
      onChangeSettings({ ...audioSettings, speed: s.val });
    }
  };

  return (
    <div style={{
      background: 'rgba(10, 12, 22, 0.6)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      border: '1px solid var(--border-color)',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={16} color="#8b5cf6" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Audio Studio Enhancer</h4>
          {!isPro && (
            <span style={{
              fontSize: '0.72rem',
              background: 'rgba(236, 72, 153, 0.15)',
              color: '#ec4899',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Lock size={10} /> PRO FEATURES
            </span>
          )}
        </div>

        <button
          onClick={() => setShowTagEditor(!showTagEditor)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#38bdf8',
            cursor: 'pointer',
            fontSize: '0.825rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Edit3 size={14} />
          <span>{showTagEditor ? 'Hide ID3 Tags' : 'Edit ID3 Tags'}</span>
        </button>
      </div>

      {/* Speed Selector */}
      <div style={{ marginBottom: showTagEditor ? '16px' : '0' }}>
        <label style={{
          display: 'block',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          Playback Tempo / Pitch Modifier
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
          {speedOptions.map((s, idx) => {
            const isSelected = audioSettings.speed === s.val;
            const isLocked = s.isProOnly && !isPro;
            return (
              <button
                key={idx}
                onClick={() => handleSelectSpeed(s)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1.5px solid var(--primary-purple)' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.03)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>{s.icon} {s.label}</span>
                {isLocked && <Lock size={12} color="#ec4899" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ID3 Tag Editor Section */}
      {showTagEditor && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px dashed var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px'
        }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Song Title Tag</label>
            <input
              type="text"
              className="input-field"
              value={audioSettings.customTitle || media?.title || ''}
              onChange={(e) => onChangeSettings({ ...audioSettings, customTitle: e.target.value })}
              style={{ padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Artist Name Tag</label>
            <input
              type="text"
              className="input-field"
              value={audioSettings.customArtist || media?.uploader || ''}
              onChange={(e) => onChangeSettings({ ...audioSettings, customArtist: e.target.value })}
              style={{ padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Album Tag</label>
            <input
              type="text"
              className="input-field"
              value={audioSettings.customAlbum || 'SonicMedia Collection'}
              onChange={(e) => onChangeSettings({ ...audioSettings, customAlbum: e.target.value })}
              style={{ padding: '8px 12px', fontSize: '0.85rem', marginTop: '4px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
