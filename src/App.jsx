import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MediaCard from './components/MediaCard';
import InAppPlayer from './components/InAppPlayer';
import DownloadHistory from './components/DownloadHistory';
import BatchQueueModal from './components/BatchQueueModal';
import ProSubscriptionModal from './components/ProSubscriptionModal';
import DeveloperApiPortal from './components/DeveloperApiPortal';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import TermsModal from './components/TermsModal';
import PrivacyModal from './components/PrivacyModal';
import DmcaModal from './components/DmcaModal';

export default function App() {
  const [url, setUrl] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [history, setHistory] = useState([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDmcaOpen, setIsDmcaOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Load state safely from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sonicmedia_history');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse history', e);
      setHistory([]);
    }

    try {
      const savedPro = localStorage.getItem('sonicmedia_pro');
      if (savedPro === 'true') {
        setIsPro(true);
      }
    } catch (e) {}

    // Dynamic SEO Route & Target Keyword Title Engine
    const path = window.location.pathname.toLowerCase();
    if (path.includes('youtube-to-mp3')) {
      document.title = "YouTube to MP3 320kbps Converter (Free & Studio Quality) — SonicMedia";
    } else if (path.includes('4k-youtube')) {
      document.title = "4K YouTube Video Downloader (2160p Ultra HD Free) — SonicMedia";
    } else if (path.includes('instagram-reels')) {
      document.title = "Instagram Reels Downloader Online (Fast & MP4) — SonicMedia";
    } else if (path.includes('tiktok-downloader')) {
      document.title = "TikTok Downloader Without Watermark (Free HD) — SonicMedia";
    } else if (path.includes('slowed-and-reverb')) {
      document.title = "Slowed and Reverb Songs Generator Online — SonicMedia Studio";
    }
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('sonicmedia_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const handleActivatePro = () => {
    setIsPro(true);
    try {
      localStorage.setItem('sonicmedia_pro', 'true');
    } catch (e) {}
  };

  const handleAnalyze = async (inputUrl) => {
    const rawUrl = inputUrl || url;
    if (!rawUrl.trim()) return;

    let cleanUrl = rawUrl.trim();
    const secondHttp = cleanUrl.indexOf('http', 8);
    if (secondHttp !== -1) {
      cleanUrl = cleanUrl.substring(0, secondHttp);
    }

    const match = cleanUrl.match(/(https?:\/\/[^\s>]+)/i);
    cleanUrl = match ? match[0] : null;

    if (!cleanUrl) {
      setError('Please paste a valid video or track URL (e.g. YouTube, Instagram, TikTok, Twitter).');
      return;
    }

    setUrl(cleanUrl);
    setLoading(true);
    setError(null);
    setMedia(null);

    try {
      const response = await axios.get(`/api/info?url=${encodeURIComponent(cleanUrl)}`);
      if (response.data && response.data.title) {
        setMedia(response.data);
      } else {
        setMedia(null);
        setError('Could not extract media info.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setMedia(null);
      const serverMsg = err.response?.data?.error;
      setError(serverMsg || 'Could not fetch video. Please check the link and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Safe Browser File Download Engine with content-type & stream progress validation
  const handleDownload = async (item, onProgress) => {
    const speedParam = item.speed ? `&speed=${encodeURIComponent(item.speed)}` : '';
    const downloadTarget = item.download_url || `/api/download?url=${encodeURIComponent(item.url)}&type=${item.type}&quality=${item.quality}${speedParam}&title=${encodeURIComponent(item.title)}`;
    
    try {
      const res = await fetch(downloadTarget);
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok || contentType.includes('application/json') || contentType.includes('text/plain') || contentType.includes('text/html')) {
        let errorMsg = '⚠️ Could not download file. YouTube stream may be protected or restricted.';
        try {
          const text = await res.text();
          if (text.startsWith('{')) {
            const json = JSON.parse(text);
            if (json.error) errorMsg = json.error;
          } else if (text.trim()) {
            errorMsg = text.replace(/^[❌⚠️\s]+/, '⚠️ ');
          }
        } catch (e) {}
        alert(errorMsg);
        return false;
      }

      const contentLength = res.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      let receivedBytes = 0;

      const reader = res.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;

        if (totalBytes > 0 && typeof onProgress === 'function') {
          const percent = Math.min(Math.round((receivedBytes / totalBytes) * 100), 99);
          onProgress(percent);
        }
      }

      const blob = new Blob(chunks, { type: contentType.split(';')[0] || (item.type === 'audio' ? 'audio/mpeg' : 'video/mp4') });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeTitle = (item.title || 'sonicmedia-download').replace(/[^a-zA-Z0-9_\-\s.]/g, '_').replace(/\s+/g, ' ').trim();
      const ext = item.type === 'audio' ? 'mp3' : 'mp4';
      link.setAttribute('download', `${safeTitle}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      if (typeof onProgress === 'function') onProgress(100);

      const historyItem = {
        title: item.title,
        uploader: item.uploader,
        url: item.url,
        type: item.type,
        quality: item.quality,
        speed: item.speed || '1.0x',
        formatLabel: item.formatLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // ⚡ Keep max 3 recent download items only! Older items automatically disappear
      const updated = [historyItem, ...history.filter(h => h.url !== item.url || h.quality !== item.quality)].slice(0, 3);
      saveHistory(updated);
      return true;
    } catch (err) {
      console.error('Download error:', err);
      alert('⚠️ Network error while downloading file. Please try again.');
      return false;
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-pattern" />
      <Navbar
        onOpenBatchModal={() => setIsBatchModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        isPro={isPro}
      />

      <main style={{ flex: 1 }}>
        <HeroSection
          url={url}
          setUrl={setUrl}
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
          onOpenBatchModal={() => setIsBatchModalOpen(true)}
        />

        <MediaCard
          media={media}
          onDownload={handleDownload}
          onPreview={(m) => setPreviewMedia(m)}
          isPro={isPro}
          onOpenProModal={() => setIsProModalOpen(true)}
        />

        <DownloadHistory
          history={history}
          onClearHistory={handleClearHistory}
          onReDownload={handleDownload}
        />

        <FeaturesSection />
      </main>

      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenDmca={() => setIsDmcaOpen(true)}
      />

      {previewMedia && (
        <InAppPlayer
          media={previewMedia}
          onClose={() => setPreviewMedia(null)}
        />
      )}

      <BatchQueueModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onProcessBatch={handleDownload}
        isPro={isPro}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      <ProSubscriptionModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isPro={isPro}
        onActivatePro={handleActivatePro}
      />

      <DeveloperApiPortal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <DmcaModal
        isOpen={isDmcaOpen}
        onClose={() => setIsDmcaOpen(false)}
      />
    </div>
  );
}
