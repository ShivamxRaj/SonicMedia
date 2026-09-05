import React from 'react';
import { History, Download, Trash2, Music, Video, ExternalLink } from 'lucide-react';

export default function DownloadHistory({ history, onClearHistory, onReDownload }) {
  if (!history || history.length === 0) return null;

  return (
    <div style={{
      maxWidth: '850px',
      margin: '0 auto 60px',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={20} color="#8b5cf6" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Downloads</h3>
          <span style={{
            fontSize: '0.75rem',
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#c084fc',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 700
          }}>
            {history.length}
          </span>
        </div>

        <button
          onClick={onClearHistory}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Trash2 size={14} />
          <span>Clear Log</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {history.map((item, index) => (
          <div
            key={index}
            className="glass-card"
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: item.type === 'audio' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.type === 'audio' ? <Music size={20} color="#8b5cf6" /> : <Video size={20} color="#06b6d4" />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.formatLabel}{item.speed && item.speed !== '1.0x' ? ` • Tempo ${item.speed}` : ''} • {item.timestamp}
                </p>
              </div>
            </div>

            <button
              onClick={() => onReDownload(item)}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.825rem' }}
            >
              <Download size={14} />
              <span>Save Again</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
