import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MediaCard from './components/MediaCard';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

// Code-Splitting Deferred Lazy Loaded Components
const InAppPlayer = lazy(() => import('./components/InAppPlayer'));
const DownloadHistory = lazy(() => import('./components/DownloadHistory'));
const BatchQueueModal = lazy(() => import('./components/BatchQueueModal'));
const ProSubscriptionModal = lazy(() => import('./components/ProSubscriptionModal'));
const DeveloperApiPortal = lazy(() => import('./components/DeveloperApiPortal'));
const TermsModal = lazy(() => import('./components/TermsModal'));
const PrivacyModal = lazy(() => import('./components/PrivacyModal'));
const DmcaModal = lazy(() => import('./components/DmcaModal'));

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

  // ⚡ Direct Instant 0-Latency Native Browser Download Engine
  const handleDownload = async (item) => {
    const speedParam = item.speed && item.speed !== '1.0x' ? `&speed=${encodeURIComponent(item.speed)}` : '';
    const safeTitle = (item.title || 'sonicmedia-download')
      .replace(/#/g, '')
      .replace(/[^a-zA-Z0-9_\-\s.]/g, '_')
      .replace(/\s+/g, ' ')
      .trim();

    const ext = item.type === 'audio' ? 'mp3' : 'mp4';
    const downloadTarget = `/api/download?url=${encodeURIComponent(item.url)}&type=${item.type}&quality=${item.quality || '256k'}${speedParam}&title=${encodeURIComponent(safeTitle)}`;

    // Trigger instant native browser download stream
    const link = document.createElement('a');
    link.href = downloadTarget;
    link.setAttribute('download', `${safeTitle}.${ext}`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try { document.body.removeChild(link); } catch (e) {}
    }, 1000);

    // Save to local download history
    const historyItem = {
      id: Date.now(),
      title: item.title || 'SonicMedia Track',
      url: item.url,
      type: item.type,
      quality: item.quality || '256k',
      speed: item.speed || '1.0x',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => {
      const updated = [historyItem, ...prev.filter(h => h.url !== item.url).slice(0, 19)];
      try { localStorage.setItem('sonicmedia_history', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    return { success: true };
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

        <Suspense fallback={null}>
          <DownloadHistory
            history={history}
            onClearHistory={handleClearHistory}
            onReDownload={handleDownload}
          />
        </Suspense>

        <FeaturesSection />
      </main>

      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenDmca={() => setIsDmcaOpen(true)}
      />

      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}
