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
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('sonicmedia_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const handleActivatePro = (key) => {
    setIsPro(true);
    try {
      localStorage.setItem('sonicmedia_pro', 'true');
    } catch (e) {}
  };

  // Universal Bulletproof URL Extractor
  const extractValidMediaUrl = (input) => {
    if (!input || typeof input !== 'string') return null;

    let raw = input.trim();
    const secondHttp = raw.indexOf('http', 8);
    if (secondHttp !== -1) {
      raw = raw.substring(0, secondHttp);
    }

    const match = raw.match(/(https?:\/\/[^\s>]+)/i);
    if (!match) return null;

    let cleanUrl = match[0];
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    return null;
  };

  // Analyze URL via Backend API
  const handleAnalyze = async (targetUrl) => {
    const rawInput = (targetUrl || url).trim();
    if (!rawInput) return;

    const cleanUrl = extractValidMediaUrl(rawInput);

    if (!cleanUrl) {
      setMedia(null);
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

  // Trigger Native Browser Stream Download & Log History
  const handleDownload = (item) => {
    const downloadUrl = `/api/download?url=${encodeURIComponent(item.url)}&type=${item.type}&quality=${item.quality}&title=${encodeURIComponent(item.title)}`;
    
    // Direct window location redirect triggers browser's native file download prompt
    window.location.href = downloadUrl;

    const historyItem = {
      title: item.title,
      uploader: item.uploader,
      url: item.url,
      type: item.type,
      quality: item.quality,
      formatLabel: item.formatLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [historyItem, ...history.slice(0, 9)];
    saveHistory(updated);
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
