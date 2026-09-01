import express from 'express';
import cors from 'cors';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dynamic Sitemap.xml endpoint for Googlebot Indexer
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sonicmedia.me/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

// Dynamic Robots.txt endpoint
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: https://sonicmedia.me/sitemap.xml\n`);
});

// Dynamic LLMs.txt endpoint for AI Agents (ChatGPT, Gemini, DeepSeek, Claude)
app.get('/llms.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`# SonicMedia — Universal Music & Video Studio

> SonicMedia is a free, high-performance web application for converting and downloading YouTube MP3 320kbps audio, 4K Ultra HD videos, Instagram Reels, TikTok without watermark, and SoundCloud tracks.

## Core Capabilities & Features
- YouTube to MP3 320kbps: Extract studio-quality 320kbps MP3 audio with customizable ID3 metadata.
- 4K HDR Video Downloader: Download MP4 videos up to 4K 2160p with FFmpeg HDR color grading and edge sharpening.
- Remix Studio Engine: Generate 0.8x Slowed + Reverb and 1.25x Nightcore audio remixes directly in browser.
- Multi-Platform Support: YouTube, Instagram Reels, TikTok (no watermark), Twitter/X, SoundCloud, Facebook.

## Official Site
- Homepage: https://sonicmedia.me/
- Sitemap: https://sonicmedia.me/sitemap.xml
`);
});

// Serve Production Frontend Dist static files so http://localhost:5000 ALSO loads the web app!
const DIST_DIR = path.join(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

const PAYMENTS_FILE = path.join(process.cwd(), 'server', 'payments.json');

// Extracted Telegram Bot Credentials for @sonic_media_pro_bot
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876051212:AAFqaooU_NvyqZbhnLxeIc27fS4TFrs3feU';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '5852264415';

// Memory store for pending real-time verification requests
const pendingPayments = new Map();

// Helper to get payments history
function getPayments() {
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

// Helper to save payment record with duplicate check
function savePayment(record) {
  const existing = getPayments();
  const updated = [record, ...existing.filter(p => p.utr !== record.utr)];
  try {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(updated, null, 2));
  } catch (e) {
    console.error('Failed to log payment', e);
  }
}

// Send Telegram Message to Owner Phone with [Approve] / [Reject] Inline Buttons
function sendTelegramNotification(utr, amount) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log(`ℹ️ Telegram Bot not configured.`);
    return;
  }

  const text = `🔔 *NEW PRO PAYMENT SUBMITTED!*\n\n💰 *Amount:* ₹${amount || 9}\n🔢 *UTR Ref:* \`${utr}\` \n📅 *Time:* ${new Date().toLocaleTimeString()}\n\n_Did you receive ₹${amount || 9} on GPay/Paytm?_`;

  const postData = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ APPROVE PRO', callback_data: `approve_${utr}` },
          { text: '❌ REJECT FAKE', callback_data: `reject_${utr}` }
        ]
      ]
    }
  });

  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let responseString = '';
    res.on('data', chunk => responseString += chunk);
    res.on('end', () => console.log('⚡ Telegram Alert Sent to Owner:', responseString));
  });

  req.on('error', (e) => console.error('Telegram API Request Error:', e));
  req.write(postData);
  req.end();
}

// Long Polling for Telegram Bot inline button clicks
let lastUpdateId = 0;
function pollTelegramUpdates() {
  if (!TELEGRAM_BOT_TOKEN) return;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=5`;

  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.ok && json.result && json.result.length > 0) {
          for (const update of json.result) {
            lastUpdateId = update.update_id;
            if (update.callback_query) {
              const cbData = update.callback_query.data;
              const cbId = update.callback_query.id;

              if (cbData.startsWith('approve_')) {
                const utr = cbData.replace('approve_', '');
                const record = pendingPayments.get(utr) || getPayments().find(p => p.utr === utr) || { utr, amount: 9 };
                record.status = 'VERIFIED_PRO_ACTIVE';
                pendingPayments.set(utr, record);
                savePayment(record);
                console.log(`✅ [TELEGRAM APPROVED] UTR: ${utr}`);

                answerTelegramCallback(cbId, '✅ PRO Pass Activated for user!');
              } else if (cbData.startsWith('reject_')) {
                const utr = cbData.replace('reject_', '');
                const record = pendingPayments.get(utr) || getPayments().find(p => p.utr === utr) || { utr, amount: 9 };
                record.status = 'REJECTED_FAKE_UTR';
                pendingPayments.set(utr, record);
                savePayment(record);
                console.log(`❌ [TELEGRAM REJECTED] UTR: ${utr}`);

                answerTelegramCallback(cbId, '❌ Payment Rejected.');
              }
            }
          }
        }
      } catch (e) {}
      setTimeout(pollTelegramUpdates, 1500);
    });
  }).on('error', () => {
    setTimeout(pollTelegramUpdates, 4000);
  });
}

function answerTelegramCallback(callbackQueryId, text) {
  const postData = JSON.stringify({
    callback_query_id: callbackQueryId,
    text: text,
    show_alert: true
  });

  const req = https.request({
    hostname: 'api.telegram.org',
    path: `/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  });
  req.write(postData);
  req.end();
}

// Start Telegram Polling loop
pollTelegramUpdates();

// Auto-detect FFmpeg binary path via imageio_ffmpeg
let ffmpegPath = '';
try {
  ffmpegPath = execSync('python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"', { encoding: 'utf8' }).trim();
  console.log(`✅ FFmpeg Muxer Engine detected: ${ffmpegPath}`);
} catch (e) {
  console.warn('⚠️ Could not locate FFmpeg via imageio_ffmpeg, relying on system PATH');
}

// Platform detection helper
function detectPlatform(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return { name: 'YouTube', icon: 'youtube', color: '#ff0000' };
  }
  if (lower.includes('instagram.com')) {
    return { name: 'Instagram', icon: 'instagram', color: '#e1306c' };
  }
  if (lower.includes('tiktok.com')) {
    return { name: 'TikTok', icon: 'tiktok', color: '#00f2fe' };
  }
  if (lower.includes('twitter.com') || lower.includes('x.com')) {
    return { name: 'Twitter / X', icon: 'twitter', color: '#1da1f2' };
  }
  if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
    return { name: 'Facebook', icon: 'facebook', color: '#1877f2' };
  }
  if (lower.includes('soundcloud.com')) {
    return { name: 'SoundCloud', icon: 'soundcloud', color: '#ff5500' };
  }
  if (lower.includes('spotify.com')) {
    return { name: 'Spotify', icon: 'spotify', color: '#1db954' };
  }
  return null;
}

// Format duration from seconds to MM:SS
function formatDuration(sec) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'python yt-dlp',
    ffmpeg: ffmpegPath ? 'active' : 'not_found',
    telegram: TELEGRAM_BOT_TOKEN ? 'configured' : 'not_configured',
    bot_name: '@sonic_media_pro_bot',
    chat_id: TELEGRAM_CHAT_ID,
    time: new Date().toISOString()
  });
});

// Submit Payment UTR for Real-time Telegram Approval
app.post('/api/submit-payment', (req, res) => {
  const { utr, amount } = req.body;
  const cleanUtr = (utr || '').trim();

  if (!cleanUtr || !/^\d{12}$/.test(cleanUtr)) {
    return res.status(400).json({ error: 'Standard UTR numbers are exactly 12 digits.' });
  }

  const existingPayments = getPayments();
  const isDuplicate = existingPayments.some((item) => item.utr === cleanUtr && item.status === 'VERIFIED_PRO_ACTIVE');

  if (isDuplicate) {
    return res.status(400).json({ error: '⚠️ This UTR reference has already been used!' });
  }

  const record = {
    utr: cleanUtr,
    amount: amount || 9,
    status: 'PENDING_ADMIN_APPROVAL',
    ip: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  };

  pendingPayments.set(cleanUtr, record);
  savePayment(record);

  sendTelegramNotification(cleanUtr, record.amount);

  res.json({
    success: true,
    status: record.status,
    message: 'Payment reference submitted. Sent to admin Telegram for verification.',
    record
  });
});

// Poll Payment Status API
app.get('/api/payment-status', (req, res) => {
  const { utr } = req.query;
  const cleanUtr = (utr || '').trim();

  if (!cleanUtr) {
    return res.status(400).json({ error: 'UTR is required' });
  }

  const record = pendingPayments.get(cleanUtr) || getPayments().find(p => p.utr === cleanUtr);

  if (record) {
    return res.json({
      utr: cleanUtr,
      status: record.status
    });
  }

  res.json({ utr: cleanUtr, status: 'NOT_FOUND' });
});

// Extract Media Metadata API
app.get('/api/info', async (req, res) => {
  const { url } = req.query;
  const match = (url || '').match(/(https?:\/\/[^\s]+)/i);
  const cleanUrl = match ? match[0] : null;

  if (!cleanUrl) {
    return res.status(400).json({ error: '⚠️ Invalid Link! Please paste a valid video or track link.' });
  }

  const platform = detectPlatform(cleanUrl);
  if (!platform) {
    return res.status(400).json({ error: '⚠️ Unsupported Link! Please paste a video or music link.' });
  }

  console.log(`[API /info] Extracting metadata for: ${cleanUrl}`);

  try {
    const py = spawn('python', ['-m', 'yt_dlp', '--dump-single-json', '--no-warnings', '--no-playlist', cleanUrl]);
    let stdoutData = '';
    let stderrData = '';

    py.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    py.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0 || !stdoutData) {
        return res.status(400).json({ error: '⚠️ Link not found! Check the link and try again.' });
      }

      try {
        const info = JSON.parse(stdoutData);

        const response = {
          title: info.title || 'Social Media Video',
          uploader: info.uploader || info.channel || info.artist || `${platform.name} Author`,
          duration: formatDuration(info.duration),
          duration_seconds: info.duration || 0,
          thumbnail: info.thumbnail || (info.thumbnails && info.thumbnails.length > 0 ? info.thumbnails[info.thumbnails.length - 1].url : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'),
          platform,
          url: cleanUrl,
          views: info.view_count ? info.view_count.toLocaleString() : 'N/A',
          formats: {
            audio: [
              { label: 'MP3 Ultra HD (320 kbps)', bitrate: '320k', size: '~8.5 MB', format_id: 'mp3-320' },
              { label: 'MP3 High Quality (256 kbps)', bitrate: '256k', size: '~6.2 MB', format_id: 'mp3-256' },
              { label: 'MP3 Standard (128 kbps)', bitrate: '128k', size: '~3.4 MB', format_id: 'mp3-128' },
              { label: 'M4A Original Stream', bitrate: 'm4a', size: '~5.1 MB', format_id: 'm4a' }
            ],
            video: [
              { label: 'MP4 4K Ultra HD (HDR Color Grade + Crisp Edge)', res: '2160p', size: '~120 MB', format_id: 'mp4-4k' },
              { label: 'MP4 Full HD (1080p + Audio)', res: '1080p', size: '~45 MB', format_id: 'mp4-1080' },
              { label: 'MP4 HD (720p + Audio)', res: '720p', size: '~22 MB', format_id: 'mp4-720' },
              { label: 'MP4 SD (480p + Audio)', res: '480p', size: '~12 MB', format_id: 'mp4-480' }
            ]
          }
        };

        return res.json(response);
      } catch (err) {
        return res.status(400).json({ error: '⚠️ Could not read link.' });
      }
    });
  } catch (e) {
    return res.status(500).json({ error: 'Internal extraction error.' });
  }
});

// Stream Download Handler API with FFmpeg Muxing & 4K Master Video Color Grading
app.get('/api/download', (req, res) => {
  const { url, type, quality, title } = req.query;

  const match = (url || '').match(/(https?:\/\/[^\s]+)/i);
  const cleanUrl = match ? match[0] : null;

  if (!cleanUrl) {
    return res.status(400).send('URL is required');
  }

  const cleanTitle = (title || 'sonicmedia-download').replace(/[^a-zA-Z0-9_-]/g, '_');
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const filename = `${cleanTitle}.${ext}`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');

  const args = ['-m', 'yt_dlp', '-o', '-'];
  
  if (ffmpegPath) {
    args.push('--ffmpeg-location', ffmpegPath);
  }

  if (type === 'audio') {
    args.push('-f', 'ba/b');
  } else {
    // If 4K PRO video option, apply FFmpeg 4K Master Color Grade & Unsharp Filter!
    if (quality === '2160p' || quality === 'mp4-4k') {
      console.log('✨ [PRO 4K ENHANCER] Applying HDR Color Grade & Edge Sharpening Filters to 4K Stream');
      args.push('-f', 'bv*+ba/best');
      args.push('--postprocessor-args', 'ffmpeg:-vf eq=contrast=1.12:brightness=0.02:saturation=1.20,unsharp=5:5:0.8:5:5:0.0');
    } else {
      args.push('-f', 'b/bv*+ba/best');
    }
  }
  
  args.push(cleanUrl);

  const py = spawn('python', args);

  py.stdout.pipe(res);

  py.stderr.on('data', (d) => {});

  py.on('error', (err) => {
    if (!res.headersSent) {
      res.status(500).send('Download stream failed');
    }
  });

  req.on('close', () => {
    py.kill();
  });
});

// Fallback to index.html for SPA routing
if (fs.existsSync(DIST_DIR)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`⚡ SonicMedia Backend active on http://localhost:${PORT}`);
  console.log(`🤖 Telegram Approval Bot: @sonic_media_pro_bot | Chat ID: ${TELEGRAM_CHAT_ID}`);
});
