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

  // ⚡ Adaptive Real-Time Streaming Download Engine with Dynamic Byte-Flow Progress
  const handleDownload = async (item, onProgress) => {
    const speedParam = item.speed && item.speed !== '1.0x' ? `&speed=${encodeURIComponent(item.speed)}` : '';
    const safeTitle = (item.title || 'sonicmedia-download')
      .replace(/#/g, '')
      .replace(/[^a-zA-Z0-9_\-\s.]/g, '_')
      .replace(/\s+/g, ' ')
      .trim();

    const ext = item.type === 'audio' ? 'mp3' : 'mp4';
    const durSec = media && media.duration_seconds > 0 ? media.duration_seconds : 0;
    const downloadTarget = `/api/download?url=${encodeURIComponent(item.url)}&type=${item.type}&quality=${item.quality || '256k'}${speedParam}&title=${encodeURIComponent(safeTitle)}&dur=${durSec}`;

    // === Phase 1: Warming (0% → 15%) — smooth animation while server connects ===
    let currentProgress = 0;
    const warmingTarget = 15;
    if (onProgress) onProgress(currentProgress, '0 MB', 'Connecting...');

    const warmingTimer = setInterval(() => {
      if (currentProgress < warmingTarget) {
        currentProgress += 1;
        if (onProgress) onProgress(currentProgress, '0 MB', 'Connecting...');
      }
    }, 150);

    // === Adaptive tracking state ===
    let firstChunkReceived = false;
    let downloadStartTime = 0;
    let lastSpeedCalcTime = 0;
    let lastSpeedCalcBytes = 0;
    let currentSpeed = 0; // bytes per second
    let dynamicTotalEstimate = 0; // recalculated each second

    try {
      const response = await axios.get(downloadTarget, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const loadedBytes = progressEvent.loaded;
          const now = Date.now();

          // First chunk: transition from warming to real tracking
          if (!firstChunkReceived) {
            firstChunkReceived = true;
            clearInterval(warmingTimer);
            downloadStartTime = now;
            lastSpeedCalcTime = now;
            lastSpeedCalcBytes = 0;

            // Use server's X-Expected-Size hint or axios total as initial estimate
            const serverHint = parseInt(progressEvent.event?.target?.getResponseHeader?.('X-Expected-Size') || '0', 10);
            const axiosTotal = progressEvent.total && progressEvent.total > 0 ? progressEvent.total : 0;
            dynamicTotalEstimate = axiosTotal || serverHint || (5 * 1024 * 1024);
            currentProgress = warmingTarget;
          }

          // === Phase 2: Real Byte-Flow (15% → 95%) with adaptive estimate ===
          const elapsedMs = now - downloadStartTime;
          const elapsedSec = elapsedMs / 1000;

          // Calculate rolling speed every 500ms for smoothness
          if (now - lastSpeedCalcTime >= 500) {
            const bytesDelta = loadedBytes - lastSpeedCalcBytes;
            const timeDelta = (now - lastSpeedCalcTime) / 1000;
            if (timeDelta > 0) {
              const instantSpeed = bytesDelta / timeDelta;
              // Smooth the speed with a weighted average (70% new, 30% old)
              currentSpeed = currentSpeed > 0 
                ? (instantSpeed * 0.7) + (currentSpeed * 0.3) 
                : instantSpeed;
            }
            lastSpeedCalcTime = now;
            lastSpeedCalcBytes = loadedBytes;

            // Dynamically recalculate total estimate based on actual throughput
            // If we have real speed data and it's been > 2 seconds, update estimate
            if (currentSpeed > 0 && elapsedSec > 2) {
              // If server provided Content-Length (progressEvent.total), use that
              if (progressEvent.total && progressEvent.total > 0) {
                dynamicTotalEstimate = progressEvent.total;
              } else {
                // Extrapolate: if loaded X bytes in Y seconds at Z speed,
                // and the download seems to still be flowing, scale estimate up
                // Only grow the estimate if we're approaching the limit too fast
                const projectedTotal = loadedBytes * (1 + (0.5 / Math.max(0.1, loadedBytes / dynamicTotalEstimate)));
                // Ensure estimate never shrinks below what we've already received
                dynamicTotalEstimate = Math.max(loadedBytes * 1.05, Math.min(projectedTotal, dynamicTotalEstimate * 2));
              }
            }
          }

          // Calculate progress percentage within the 15-95% range
          let rawPercent = 0;
          if (progressEvent.total && progressEvent.total > 0) {
            rawPercent = (loadedBytes / progressEvent.total) * 100;
          } else if (dynamicTotalEstimate > 0) {
            rawPercent = (loadedBytes / dynamicTotalEstimate) * 100;
          }

          // Map raw 0-100% to our 15-95% display range (saving 95-100% for completion)
          const displayPercent = Math.min(95, Math.max(warmingTarget, warmingTarget + (rawPercent * 0.8)));
          currentProgress = Math.round(displayPercent);

          // Format display values
          const mbLoaded = (loadedBytes / (1024 * 1024)).toFixed(1);
          const speedStr = currentSpeed > 0 
            ? `${(currentSpeed / (1024 * 1024)).toFixed(1)} MB/s` 
            : 'Calculating...';

          if (onProgress) onProgress(currentProgress, `${mbLoaded} MB`, speedStr);
        }
      });

      // === Phase 3: Completion — snap to 100% ===
      clearInterval(warmingTimer);
      const finalSize = response.data?.size 
        ? (response.data.size / (1024 * 1024)).toFixed(1) 
        : '';
      if (onProgress) onProgress(100, finalSize ? `${finalSize} MB` : '', 'Complete');

      // Trigger native browser download save dialog with actual file blob
      const blob = new Blob([response.data], { type: item.type === 'audio' ? 'audio/mpeg' : 'video/mp4' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${safeTitle}.${ext}`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        try {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (e) {}
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
    } catch (err) {
      clearInterval(warmingTimer);
      console.error('Download Error:', err);
      let errorMsg = '⚠️ Download failed. Please try again.';
      if (err.response && err.response.data) {
        try {
          if (err.response.data instanceof Blob) {
            const text = await err.response.data.text();
            try {
              const json = JSON.parse(text);
              if (json.error) errorMsg = json.error;
            } catch (e) {
              if (text && text.length < 200) errorMsg = text;
            }
          } else if (err.response.data.error) {
            errorMsg = err.response.data.error;
          }
        } catch (e) {}
      }
      return { success: false, error: errorMsg };
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
