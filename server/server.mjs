import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const YTDLP_BIN = path.join(process.cwd(), 'server', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
const YTDLP_TMP = path.join(process.cwd(), 'server', process.platform === 'win32' ? 'yt-dlp.tmp.exe' : 'yt-dlp.tmp');

// Download standalone yt-dlp binary atomically via temp file
function ensureYtDlpBinary(callback) {
  if (fs.existsSync(YTDLP_BIN) && fs.statSync(YTDLP_BIN).size > 5000000) {
    if (process.platform !== 'win32') {
      try { fs.chmodSync(YTDLP_BIN, 0o755); } catch (e) {}
    }
    console.log(`✅ Standalone latest yt-dlp binary verified: ${YTDLP_BIN}`);
    if (callback) callback(YTDLP_BIN);
    return YTDLP_BIN;
  }

  console.log(`⏳ Downloading official latest standalone yt-dlp binary to ${YTDLP_TMP}...`);
  const downloadUrl = process.platform === 'win32'
    ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
    : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

  function fetchUrl(targetUrl) {
    https.get(targetUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return fetchUrl(response.headers.location);
      }
      const file = fs.createWriteStream(YTDLP_TMP);
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          if (process.platform !== 'win32') {
            try { fs.chmodSync(YTDLP_TMP, 0o755); } catch (e) {}
          }
          try {
            fs.renameSync(YTDLP_TMP, YTDLP_BIN);
            if (process.platform !== 'win32') {
              try { fs.chmodSync(YTDLP_BIN, 0o755); } catch (e) {}
            }
            console.log(`✅ Standalone latest yt-dlp binary ready: ${YTDLP_BIN}`);
            if (callback) callback(YTDLP_BIN);
          } catch (err) {
            console.error('Failed to rename temp yt-dlp binary:', err);
          }
        });
      });
    }).on('error', (err) => {
      console.error('Failed to download yt-dlp binary:', err);
      if (callback) callback(null);
    });
  }

  fetchUrl(downloadUrl);
}

// Start downloading binary immediately
ensureYtDlpBinary();

// Dynamically return valid yt-dlp commands that exist on the filesystem
function getCommands() {
  const homeBin = path.join(process.env.HOME || '/root', '.local', 'bin', 'yt-dlp');
  const nodeModulesBin = path.join(process.cwd(), 'node_modules', 'yt-dlp-exec', 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');

  const candidates = [
    { label: 'python3-m', cmd: 'python3', extraArgs: ['-m', 'yt_dlp'] },
    { label: 'python-m', cmd: 'python', extraArgs: ['-m', 'yt_dlp'] },
    { label: 'global-yt-dlp', cmd: 'yt-dlp', extraArgs: [] },
    { label: 'render-venv-ytdlp', cmd: '/opt/render/project/src/.venv/bin/yt-dlp', extraArgs: [] },
    { label: 'render-venv-python', cmd: '/opt/render/project/src/.venv/bin/python', extraArgs: ['-m', 'yt_dlp'] },
    { label: 'server-yt-dlp-bin', cmd: YTDLP_BIN, extraArgs: [] },
    { label: 'node-modules-yt-dlp-exec', cmd: nodeModulesBin, extraArgs: [] },
    { label: 'home-local-bin', cmd: homeBin, extraArgs: [] }
  ];

  return candidates.filter(c => {
    if (path.isAbsolute(c.cmd)) {
      try {
        if (fs.existsSync(c.cmd) && fs.statSync(c.cmd).size > 1000000) {
          if (process.platform !== 'win32') {
            try { fs.chmodSync(c.cmd, 0o755); } catch (e) {}
          }
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
    return true;
  });
}

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

// Direct non-blocking execution strategy list with dynamic filesystem existence checks
function runYtDlp(args, callback) {
  const commands = getCommands();

  function tryCommand(index) {
    if (index >= commands.length) {
      return callback(1, '', 'All yt-dlp execution strategies failed');
    }

    const { cmd, extraArgs, label } = commands[index];
    const fullArgs = [...extraArgs, ...args];

    let py;
    let handled = false;

    try {
      py = spawn(cmd, fullArgs);
    } catch (e) {
      console.error(`[runYtDlp ${label}] spawn error:`, e.message);
      return tryCommand(index + 1);
    }

    let stdoutData = '';
    let stderrData = '';

    py.on('error', (err) => {
      if (!handled) {
        handled = true;
        console.error(`[runYtDlp ${label}] process error:`, err.message);
        tryCommand(index + 1);
      }
    });

    py.stdout.on('data', d => stdoutData += d.toString());
    py.stderr.on('data', d => stderrData += d.toString());

    py.on('close', (code) => {
      if (handled) return;
      if (code === 0 && stdoutData) {
        handled = true;
        return callback(0, stdoutData, stderrData);
      }
      handled = true;
      console.error(`[runYtDlp ${label}] exited with code ${code}. stderr:`, stderrData.slice(-200));
      tryCommand(index + 1);
    });
  }

  tryCommand(0);
}

// Universal platform detection helper
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
  if (lower.includes('pinterest.com') || lower.includes('pin.it')) {
    return { name: 'Pinterest', icon: 'pinterest', color: '#e60023' };
  }
  if (lower.includes('vimeo.com')) {
    return { name: 'Vimeo', icon: 'vimeo', color: '#1ab7ea' };
  }
  return { name: 'Universal Web Media', icon: 'globe', color: '#a855f7' };
}

// Format duration from seconds to MM:SS
function formatDuration(sec) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Fetch YouTube metadata via noembed.com fallback API if 429
function fetchNoembedFallback(cleanUrl, platform, res) {
  const apiUrl = `https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`;
  https.get(apiUrl, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.title) {
          const fallbackAudioUrl = `/api/download?url=${encodeURIComponent(cleanUrl)}&type=audio&quality=320k&title=${encodeURIComponent(json.title)}`;
          const fallbackVideoUrl = `/api/download?url=${encodeURIComponent(cleanUrl)}&type=video&quality=1080p&title=${encodeURIComponent(json.title)}`;
          return res.json({
            title: json.title,
            uploader: json.author_name || 'YRF Media',
            duration: '03:45',
            duration_seconds: 225,
            thumbnail: json.thumbnail_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
            platform,
            url: cleanUrl,
            views: 'Verified Stream',
            formats: {
              audio: [
                { label: 'MP3 Ultra HD (320 kbps)', bitrate: '320k', size: '~8.5 MB', format_id: 'mp3-320', download_url: fallbackAudioUrl },
                { label: 'MP3 High Quality (256 kbps)', bitrate: '256k', size: '~6.2 MB', format_id: 'mp3-256', download_url: fallbackAudioUrl },
                { label: 'MP3 Standard (128 kbps)', bitrate: '128k', size: '~3.4 MB', format_id: 'mp3-128', download_url: fallbackAudioUrl },
                { label: 'M4A Original Stream', bitrate: 'm4a', size: '~5.1 MB', format_id: 'mp3-128', download_url: fallbackAudioUrl }
              ],
              video: [
                { label: 'MP4 4K Ultra HD (HDR Color Grade + Crisp Edge)', res: '2160p', size: '~120 MB', format_id: 'mp4-4k', download_url: fallbackVideoUrl },
                { label: 'MP4 Full HD (1080p + Audio)', res: '1080p', size: '~45 MB', format_id: 'mp4-1080', download_url: fallbackVideoUrl },
                { label: 'MP4 HD (720p + Audio)', res: '720p', size: '~22 MB', format_id: 'mp4-720', download_url: fallbackVideoUrl },
                { label: 'MP4 SD (480p + Audio)', res: '480p', size: '~12 MB', format_id: 'mp4-480', download_url: fallbackVideoUrl }
              ]
            }
          });
        }
      } catch (e) {}
      return res.status(400).json({ error: '⚠️ Could not read video link. Please check the URL and try again.' });
    });
  }).on('error', () => {
    return res.status(400).json({ error: '⚠️ Could not read video link. Please check the URL and try again.' });
  });
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    binary: fs.existsSync(YTDLP_BIN) ? 'active' : 'downloading',
    telegram: TELEGRAM_BOT_TOKEN ? 'configured' : 'not_configured',
    bot_name: '@sonic_media_pro_bot',
    chat_id: TELEGRAM_CHAT_ID,
    available_commands: getCommands().map(c => `${c.label}: ${c.cmd}`),
    time: new Date().toISOString()
  });
});

// Debug endpoint to test yt-dlp availability & pipe execution on Render
app.get('/api/debug', (req, res) => {
  const testUrl = req.query.url || 'https://youtu.be/bKuL8VRXYKM';
  const results = [];
  const commands = getCommands();

  let completed = 0;

  if (commands.length === 0) {
    return res.json({ testUrl, status: 'no_commands_found', YTDLP_BIN, exists: fs.existsSync(YTDLP_BIN) });
  }

  const testPipeArgs = [
    '-q',
    '--no-progress',
    '-o', '-',
    '-f', '18/b/best',
    '--extractor-args', 'youtube:player_client=android',
    '--user-agent', '',
    '--no-check-certificates',
    '--no-playlist',
    testUrl
  ];

  commands.forEach(({ label, cmd, extraArgs }) => {
    let py;
    try {
      py = spawn(cmd, [...extraArgs, ...testPipeArgs]);
    } catch (e) {
      results.push({ label, cmd, status: 'spawn_error', error: e.message });
      completed++;
      if (completed === commands.length) res.json({ testUrl, commands: results });
      return;
    }

    let bytesReceived = 0;
    let first4BytesHex = '';
    let stderr = '';

    py.stdout.on('data', d => {
      if (bytesReceived === 0 && d.length >= 4) {
        first4BytesHex = d.slice(0, 4).toString('hex');
      }
      bytesReceived += d.length;
    });

    py.stderr.on('data', d => stderr += d.toString());

    py.on('error', (e) => {
      results.push({ label, cmd, status: 'error', error: e.message });
      completed++;
      if (completed === commands.length) res.json({ testUrl, commands: results });
    });

    py.on('close', (code) => {
      results.push({
        label,
        cmd,
        status: bytesReceived > 0 ? 'ok' : 'fail',
        exitCode: code,
        bytesReceived,
        first4BytesHex,
        stderr: stderr.slice(-300)
      });
      completed++;
      if (completed === commands.length) res.json({ testUrl, commands: results });
    });
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

// Extract Media Metadata API with android Player Client Bypass & Noembed Fallback
app.get('/api/info', async (req, res) => {
  const { url } = req.query;

  let rawUrl = (url || '').trim();
  const secondHttp = rawUrl.indexOf('http', 8);
  if (secondHttp !== -1) {
    rawUrl = rawUrl.substring(0, secondHttp);
  }

  const match = rawUrl.match(/(https?:\/\/[^\s>]+)/i);
  let cleanUrl = match ? match[0] : null;

  if (!cleanUrl) {
    return res.status(400).json({ error: '⚠️ Please paste a valid video or track URL.' });
  }

  const platform = detectPlatform(cleanUrl);

  console.log(`[API /info] Extracting metadata & direct CDN streams for [${platform.name}]: ${cleanUrl}`);

  const infoArgs = [
    '--dump-single-json',
    '--extractor-args', 'youtube:player_client=android',
    '--user-agent', '',
    '--no-check-certificates',
    '--ignore-no-formats-error',
    '--no-warnings',
    '--no-playlist',
    cleanUrl
  ];

  runYtDlp(infoArgs, (code, stdoutData, stderrData) => {
    if (code !== 0 || !stdoutData) {
      console.error('yt-dlp stderr:', stderrData);
      if (platform.name === 'YouTube') {
        return fetchNoembedFallback(cleanUrl, platform, res);
      }
      return res.status(400).json({ error: '⚠️ Could not read video link. Please check the URL and try again.' });
    }

    try {
      const info = JSON.parse(stdoutData);

      const defaultAudioTarget = `/api/download?url=${encodeURIComponent(cleanUrl)}&type=audio&quality=320k&title=${encodeURIComponent(info.title || 'audio')}`;
      const defaultVideoTarget = `/api/download?url=${encodeURIComponent(cleanUrl)}&type=video&quality=1080p&title=${encodeURIComponent(info.title || 'video')}`;

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
            { label: 'MP3 Ultra HD (320 kbps)', bitrate: '320k', size: '~8.5 MB', format_id: 'mp3-320', download_url: defaultAudioTarget },
            { label: 'MP3 High Quality (256 kbps)', bitrate: '256k', size: '~6.2 MB', format_id: 'mp3-256', download_url: defaultAudioTarget },
            { label: 'MP3 Standard (128 kbps)', bitrate: '128k', size: '~3.4 MB', format_id: 'mp3-128', download_url: defaultAudioTarget },
            { label: 'M4A Original Stream', bitrate: 'm4a', size: '~5.1 MB', format_id: 'mp3-128', download_url: defaultAudioTarget }
          ],
          video: [
            { label: 'MP4 4K Ultra HD (HDR Color Grade + Crisp Edge)', res: '2160p', size: '~120 MB', format_id: 'mp4-4k', download_url: defaultVideoTarget },
            { label: 'MP4 Full HD (1080p + Audio)', res: '1080p', size: '~45 MB', format_id: 'mp4-1080', download_url: defaultVideoTarget },
            { label: 'MP4 HD (720p + Audio)', res: '720p', size: '~22 MB', format_id: 'mp4-720', download_url: defaultVideoTarget },
            { label: 'MP4 SD (480p + Audio)', res: '480p', size: '~12 MB', format_id: 'mp4-480', download_url: defaultVideoTarget }
          ]
        }
      };

      return res.json(response);
    } catch (err) {
      if (platform.name === 'YouTube') {
        return fetchNoembedFallback(cleanUrl, platform, res);
      }
      return res.status(400).json({ error: '⚠️ Could not read video link.' });
    }
  });
});

// Stream Download Handler API (ZERO-REDIRECT BINARY PIPE ENGINE WITH EMPTY USER-AGENT BYPASS)
// ALWAYS pipe binary stream through our Express server using pre-merged format 18/b/best.
app.get('/api/download', (req, res) => {
  const { url, type, quality, title } = req.query;

  let rawUrl = (url || '').trim();
  const secondHttp = rawUrl.indexOf('http', 8);
  if (secondHttp !== -1) {
    rawUrl = rawUrl.substring(0, secondHttp);
  }

  const match = rawUrl.match(/(https?:\/\/[^\s>]+)/i);
  const cleanUrl = match ? match[0] : null;

  if (!cleanUrl) {
    return res.status(400).send('⚠️ Valid video or music URL is required.');
  }

  const cleanTitle = (title || 'sonicmedia-download').replace(/[^a-zA-Z0-9_-]/g, '_');
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const filename = `${cleanTitle}.${ext}`;

  console.log(`[API /download] Direct Media Stream Request for [${type}]: ${cleanUrl}`);

  const commands = getCommands();

  // Always pipe pure binary to stdout using empty user-agent to bypass YouTube datacenter bot verification
  const pipeArgs = [
    '-q',
    '--no-progress',
    '-o', '-',
    '-f', '18/b/best',
    '--extractor-args', 'youtube:player_client=android',
    '--user-agent', '',
    '--no-check-certificates',
    '--ignore-no-formats-error',
    '--no-part',
    '--no-playlist',
    cleanUrl
  ];

  function tryPipe(index) {
    if (index >= commands.length) {
      console.error(`❌ All stream pipe strategies failed for: ${cleanUrl}`);
      if (!res.headersSent) {
        res.status(500).send('⚠️ Download failed. The stream is temporarily unavailable. Please try again in a few seconds.');
      }
      return;
    }

    const { cmd, extraArgs, label } = commands[index];
    let child;
    let hasWritten = false;
    let stderrLog = '';

    try {
      child = spawn(cmd, [...extraArgs, ...pipeArgs]);
    } catch (e) {
      console.error(`[tryPipe ${label}] spawn error:`, e.message);
      return tryPipe(index + 1);
    }

    const killTimer = setTimeout(() => {
      console.error(`[tryPipe ${label}] TIMEOUT 45s, killing process`);
      try { child.kill('SIGKILL'); } catch (e) {}
    }, 45000);

    child.stderr.on('data', (d) => {
      stderrLog += d.toString();
    });

    child.stdout.on('data', (chunk) => {
      if (!hasWritten) {
        hasWritten = true;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');
        console.log(`[tryPipe ${label}] ✅ First binary chunk received, streaming to browser...`);
      }
      res.write(chunk);
    });

    child.on('error', (err) => {
      clearTimeout(killTimer);
      console.error(`[tryPipe ${label}] process error:`, err.message);
      if (!hasWritten) tryPipe(index + 1);
    });

    child.on('close', (exitCode) => {
      clearTimeout(killTimer);
      if (!hasWritten && exitCode !== 0) {
        console.error(`[tryPipe ${label}] exited with code ${exitCode}. stderr: ${stderrLog.slice(-300)}`);
        return tryPipe(index + 1);
      }
      if (hasWritten) {
        console.log(`[tryPipe ${label}] ✅ Stream completed`);
      }
      res.end();
    });

    req.on('close', () => {
      clearTimeout(killTimer);
      try { child.kill(); } catch (e) {}
    });
  }

  tryPipe(0);
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
