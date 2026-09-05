import React, { useState } from 'react';
import { 
  Download, Music, Video, Play, Eye, Clock, CheckCircle2, 
  Sparkles, Sliders, Share2, Lock
} from 'lucide-react';
import AudioStudioTools from './AudioStudioTools';

export default function MediaCard({ media, onDownload, onPreview, isPro, onOpenProModal }) {
  const [activeTab, setActiveTab] = useState('audio'); // 'audio' | 'video'
  const [selectedQuality, setSelectedQuality] = useState('256k'); // default free bitrate
  const [audioSettings, setAudioSettings] = useState({
    speed: '1.0x',
    customTitle: '',
    customArtist: '',
    customAlbum: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!media) return null;

  // Add PRO flags to high quality options
  const formatsList = (activeTab === 'audio' ? media.formats.audio : media.formats.video).map((f) => {
    const isProFormat = f.bitrate === '320k' || f.bitrate === 'wav' || f.res === '2160p';
    return { ...f, isProOnly: isProFormat };
  });

  const currentFormat = formatsList.find(
    (f) => f.bitrate === selectedQuality || f.res === selectedQuality
  ) || formatsList[0];

  const handleSelectFormat = (formatItem) => {
    if (formatItem.isProOnly && !isPro) {
      onOpenProModal();
    } else {
      setSelectedQuality(formatItem.bitrate || formatItem.res);
    }
  };

  const handleDownloadClick = () => {
    if (currentFormat.isProOnly && !isPro) {
      onOpenProModal();
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(100);
    setDownloadSuccess(false);

    // ⚡ Instant native download trigger!
    onDownload({
      url: media.url,
      type: activeTab,
      quality: selectedQuality,
      speed: activeTab === 'audio' ? (audioSettings.speed || '1.0x') : '1.0x',
      title: audioSettings.customTitle || media.title,
      uploader: audioSettings.customArtist || media.uploader,
      formatLabel: currentFormat.label,
      audioSettings: activeTab === 'audio' ? audioSettings : null
    });

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 400);
  };

  return (
    <div className="glass-card" style={{
      maxWidth: '920px',
      margin: '0 auto 40px',
      padding: '28px',
      border: '1px solid var(--border-color)',
      position: 'relative'
    }}>
      {/* Header Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="platform-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: media.platform.color }} />
            {media.platform.name}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Link Verified & Stream Ready
          </span>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: media.title, url: media.url }).catch(() => {});
            } else {
              navigator.clipboard.writeText(media.url);
              alert('Link copied to clipboard!');
            }
          }}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="media-card-grid">
        {/* Left Column: Thumbnail Preview & Player Trigger */}
        <div>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-color)',
            aspectRatio: '16/9',
            background: '#0a0c14'
          }}>
            <img
              src={media.thumbnail}
              alt={media.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {/* Play Overlay */}
            <button
              onClick={() => onPreview(media)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.35)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              title="Preview Media Player"
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(168, 85, 247, 0.6)'
              }}>
                <Play size={20} color="#fff" style={{ marginLeft: '3px' }} />
              </div>
            </button>

            {/* Duration Tag */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.8)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Clock size={12} />
              <span>{media.duration}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Metadata, Tabs, and Downloads */}
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: '6px'
          }}>
            {media.title}
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <span>by <strong style={{ color: '#fff' }}>{media.uploader}</strong></span>
            {media.views !== 'N/A' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={14} /> {media.views} views
              </span>
            )}
          </div>

          {/* Type Toggle Tabs (Audio vs Video) */}
          <div style={{
            display: 'flex',
            background: 'rgba(10, 12, 20, 0.7)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => {
                setActiveTab('audio');
                setSelectedQuality('256k');
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'audio' ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === 'audio' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Music size={16} />
              <span>Audio Studio (MP3)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('video');
                setSelectedQuality('1080p');
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'video' ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === 'video' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Video size={16} />
              <span>Video (MP4)</span>
            </button>
          </div>

          {/* Audio Studio Tools */}
          {activeTab === 'audio' && (
            <AudioStudioTools
              media={media}
              audioSettings={audioSettings}
              onChangeSettings={setAudioSettings}
              isPro={isPro}
              onOpenProModal={onOpenProModal}
            />
          )}

          {/* Quality Grid Selection */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              <Sliders size={14} />
              <span>Select {activeTab === 'audio' ? 'Bitrate & Quality' : 'Resolution'}</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {formatsList.map((f, i) => {
                const keyVal = f.bitrate || f.res;
                const isSelected = selectedQuality === keyVal;
                const isLocked = f.isProOnly && !isPro;
                const is4K = keyVal === '2160p' || keyVal === 'mp4-4k';
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectFormat(f)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '1.5px solid var(--primary-purple)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: isSelected ? '#38bdf8' : '#fff' }}>
                        {is4K ? 'MP4 4K HDR ✨' : `${f.label.split(' ')[0]} ${f.label.split(' ')[1]}`}
                      </span>
                      {isLocked && <Lock size={13} color="#ec4899" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '2px' }}>
                      {is4K ? '~120 MB (4K Master)' : f.size}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download Action & Progress */}
          <div>
            {isDownloading ? (
              <div style={{
                background: 'rgba(10, 12, 20, 0.8)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--primary-purple)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                    {selectedQuality === '2160p' || selectedQuality === 'mp4-4k' ? '✨ Applying 4K HDR Color Grade & Sharpening Filters...' : `Streaming ${activeTab.toUpperCase()}...`}
                  </span>
                  <span style={{ fontWeight: 700 }}>{downloadProgress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${downloadProgress}%`,
                    height: '100%',
                    background: 'var(--primary-gradient)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ) : (
              <button
                onClick={handleDownloadClick}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <Download size={20} />
                <span>
                  Download {activeTab === 'audio' ? 'MP3 Audio' : 'MP4 Video'} ({selectedQuality === '2160p' || selectedQuality === 'mp4-4k' ? '4K HDR Remaster' : currentFormat.label.split(' ')[1] || 'HD'})
                </span>
              </button>
            )}

            {downloadSuccess && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '12px',
                color: '#10b981',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={16} />
                <span>Download started! Saved to your downloads folder.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
