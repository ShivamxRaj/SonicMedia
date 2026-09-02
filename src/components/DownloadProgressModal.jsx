import React from 'react';
import { X, Download, CheckCircle2, AlertTriangle, Loader2, Play, HardDrive, Zap, FileAudio, FileVideo, RefreshCw } from 'lucide-react';

export default function DownloadProgressModal({
  isOpen,
  onClose,
  downloadState,
  onSaveAgain,
  onPlayPreview
}) {
  if (!isOpen || !downloadState) return null;

  const {
    title,
    type,
    quality,
    status, // 'connecting' | 'downloading' | 'completed' | 'error'
    progress, // 0 - 100
    loadedBytes, // MB string or number
    totalBytes, // MB string or number
    speed, // string e.g. "2.4 MB/s"
    errorMessage,
    filename
  } = downloadState;

  const isAudio = type === 'audio';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      backgroundColor: 'rgba(5, 7, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '520px',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        background: 'linear-gradient(145deg, rgba(20, 25, 45, 0.95), rgba(10, 12, 25, 0.98))',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#a0aec0',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#a0aec0'; }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: status === 'completed'
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : status === 'error'
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
          }}>
            {status === 'completed' ? (
              <CheckCircle2 size={28} />
            ) : status === 'error' ? (
              <AlertTriangle size={28} />
            ) : isAudio ? (
              <FileAudio size={28} />
            ) : (
              <FileVideo size={28} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge" style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.4)'
              }}>
                {isAudio ? 'MP3 Audio' : 'MP4 Video'} • {quality || '320kbps'}
              </span>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {title || 'Media File'}
            </h3>
          </div>
        </div>

        {/* Progress Display Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.6rem',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: '#e2e8f0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {status === 'connecting' && <><Loader2 size={16} className="animate-spin" style={{ color: '#818cf8' }} /> Connecting to stream...</>}
              {status === 'downloading' && <><Loader2 size={16} className="animate-spin" style={{ color: '#c084fc' }} /> Downloading binary stream...</>}
              {status === 'completed' && <><CheckCircle2 size={16} style={{ color: '#34d399' }} /> Download Complete & Saved!</>}
              {status === 'error' && <><AlertTriangle size={16} style={{ color: '#f87171' }} /> Download Failed</>}
            </span>
            <span style={{
              fontWeight: 800,
              fontSize: '1rem',
              color: status === 'completed' ? '#34d399' : '#c084fc'
            }}>
              {Math.round(progress || 0)}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div style={{
            height: '10px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress || 0))}%`,
              background: status === 'completed'
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : status === 'error'
                ? 'linear-gradient(90deg, #ef4444, #f87171)'
                : 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
              borderRadius: '999px',
              transition: 'width 0.25s ease-out'
            }} />
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '0.85rem 1rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <HardDrive size={13} /> Transferred
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
              {loadedBytes || '0.0 MB'} {totalBytes ? `/ ${totalBytes}` : ''}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '0.85rem 1rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
              <Zap size={13} /> Download Speed
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
              {status === 'completed' ? 'Finished' : (speed || 'Calculating...')}
            </div>
          </div>
        </div>

        {/* Saved Filename Badge */}
        {filename && (
          <div style={{
            fontSize: '0.8rem',
            color: '#cbd5e1',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.6rem 0.85rem',
            borderRadius: '10px',
            wordBreak: 'break-all',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <Download size={14} style={{ color: '#818cf8', flexShrink: 0 }} />
            <span>Saved as: <strong style={{ color: '#fff' }}>{filename}</strong></span>
          </div>
        )}

        {/* Error message detail if failed */}
        {status === 'error' && (
          <div style={{
            fontSize: '0.85rem',
            color: '#f87171',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            {errorMessage || 'Failed to download stream. Please verify the URL and try again.'}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {status === 'completed' ? (
            <>
              {isAudio && onPlayPreview && (
                <button
                  onClick={onPlayPreview}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Play size={16} /> Play Audio
                </button>
              )}
              <button
                onClick={onSaveAgain}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Download size={16} /> Save File Again
              </button>
            </>
          ) : status === 'error' ? (
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '14px' }}
            >
              Close
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '14px' }}
            >
              Background Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
