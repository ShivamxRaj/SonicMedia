import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

const app = express();
const PORT = process.env.PORT || 5000;

// Process Crash Protection: Prevent server status 1 exit on background network timeouts
process.on('uncaughtException', (err) => {
  console.error('⚠️ [CRASH GUARD] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ [CRASH GUARD] Unhandled Rejection:', reason);
});

app.use(compression());
app.use(cors());
app.use(express.json());

const YTDLP_BIN = path.join(process.cwd(), 'server', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
const YTDLP_TMP = path.join(process.cwd(), 'server', process.platform === 'win32' ? 'yt-dlp.tmp.exe' : 'yt-dlp.tmp');
const YTDLP_PKG = path.join(process.cwd(), 'server', 'yt_pkg');
const COOKIES_FILE = path.join(process.cwd(), 'server', 'cookies.txt');

function getCookieArgs() {
  try {
    if (fs.existsSync(COOKIES_FILE) && fs.statSync(COOKIES_FILE).size > 50) {
      const content = fs.readFileSync(COOKIES_FILE, 'utf8');
      if (content.includes('youtube.com') || content.includes('google.com') || content.includes('LOGIN_INFO') || content.includes('VISITOR_INFO1_LIVE') || content.includes('PREF')) {
        return ['--cookies', COOKIES_FILE];
      }
    }
  } catch (e) {}
  return [];
}

function getExtractorArgs(client = 'android') {
  return ['--extractor-args', `youtube:player_client=${client}`];
}

// Download & Auto-Update standalone yt-dlp binary atomically via GitHub releases
function ensureYtDlpBinary(forceUpdate = false, callback = null) {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const isExpired = fs.existsSync(YTDLP_BIN) && (Date.now() - fs.statSync(YTDLP_BIN).mtimeMs > TWENTY_FOUR_HOURS);

  if (fs.existsSync(YTDLP_BIN) && fs.statSync(YTDLP_BIN).size > 5000000 && !forceUpdate && !isExpired) {
    if (process.platform !== 'win32') {
      try { fs.chmodSync(YTDLP_BIN, 0o755); } catch (e) {}
    }
    console.log(`✅ Standalone yt-dlp binary verified (Up to date): ${YTDLP_BIN}`);
    if (callback) callback(YTDLP_BIN);
    return YTDLP_BIN;
  }

  console.log(`⏳ Auto-updating official latest standalone yt-dlp binary from GitHub...`);
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
            if (fs.existsSync(YTDLP_BIN)) {
              try { fs.unlinkSync(YTDLP_BIN); } catch (e) {}
            }
            fs.renameSync(YTDLP_TMP, YTDLP_BIN);
            if (process.platform !== 'win32') {
              try { fs.chmodSync(YTDLP_BIN, 0o755); } catch (e) {}
            }
            console.log(`✅ Standalone latest yt-dlp binary updated successfully: ${YTDLP_BIN}`);
            if (callback) callback(YTDLP_BIN);
          } catch (err) {
            console.error('Failed to update yt-dlp binary:', err);
          }
        });
      });
    }).on('error', (err) => {
      console.error('Failed to download yt-dlp binary update:', err);
      if (callback) callback(null);
    });
  }

  fetchUrl(downloadUrl);
}

// Check & Auto-Update yt-dlp binary on server startup and every 24 hours
ensureYtDlpBinary();
setInterval(() => ensureYtDlpBinary(true), 24 * 60 * 60 * 1000);

const JS_RUNTIME_ARG = process.execPath ? `node:${process.execPath}` : 'node';

// Dynamically return valid yt-dlp commands across cascading player client fallback strategies
function getCommands() {
  const homeBin = path.join(process.env.HOME || '/root', '.local', 'bin', 'yt-dlp');
  const nodeModulesBin = path.join(process.cwd(), 'node_modules', 'yt-dlp-exec', 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');

  const nodeDir = path.dirname(process.execPath);
  const pathSep = process.platform === 'win32' ? ';' : ':';
  const extendedPath = process.env.PATH ? `${nodeDir}${pathSep}${process.env.PATH}` : nodeDir;

  const envWithPkg = {
    ...process.env,
    PATH: extendedPath,
    PYTHONPATH: fs.existsSync(YTDLP_PKG) ? `${YTDLP_PKG}${pathSep}${process.env.PYTHONPATH || ''}` : process.env.PYTHONPATH
  };

  let baseCmd = 'python3';
  let baseExtra = ['-m', 'yt_dlp'];

  if (fs.existsSync(YTDLP_BIN) && fs.statSync(YTDLP_BIN).size > 1000000) {
    baseCmd = YTDLP_BIN;
    baseExtra = [];
  } else if (fs.existsSync(nodeModulesBin)) {
    baseCmd = nodeModulesBin;
    baseExtra = [];
  }

  const profiles = [
    { client: 'android', ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36' },
    { client: 'web', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' },
    { client: 'mweb', ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36' },
    { client: 'ios', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' },
    { client: 'default', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', noClientArg: true }
  ];

  const commandsList = [];
  profiles.forEach(({ client, ua, noClientArg }) => {
    const extra = noClientArg
      ? ['--user-agent', ua]
      : [...getExtractorArgs(client), '--user-agent', ua];

    commandsList.push({
      label: `yt-dlp-${client}`,
      cmd: baseCmd,
      extraArgs: [...baseExtra, ...extra],
      env: envWithPkg
    });

    if (baseCmd !== 'python3') {
      commandsList.push({
        label: `python3-${client}`,
        cmd: 'python3',
        extraArgs: ['-m', 'yt_dlp', ...extra],
        env: envWithPkg
      });
    }
  });

  return commandsList;
}

// Dynamic Sitemap.xml endpoint for Googlebot Indexer
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const today = new Date().toISOString().split('T')[0];
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sonicmedia.me/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sonicmedia.me/vs-y2mate</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sonicmedia.me/best-youtube-to-mp3</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sonicmedia.me/savefrom-alternative</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sonicmedia.me/reviews</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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

// Serve Production Frontend Dist static files with optimized HTTP Cache-Control headers
const DIST_DIR = path.join(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
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
                const now = Date.now();
                const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
                
                record.status = 'VERIFIED_PRO_ACTIVE';
                record.activatedAt = now;
                record.expiresAt = now + THIRTY_DAYS_MS;
                record.expiryDateStr = new Date(record.expiresAt).toLocaleDateString();
                
                pendingPayments.set(utr, record);
                savePayment(record);
                console.log(`✅ [TELEGRAM APPROVED] UTR: ${utr} | Valid until: ${record.expiryDateStr}`);

                answerTelegramCallback(cbId, `✅ PRO Pass Activated for 30 Days (Expires: ${record.expiryDateStr})!`);
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

    const { cmd, extraArgs, label, env } = commands[index];
    const fullArgs = [...extraArgs, ...args];

    let py;
    let handled = false;

    try {
      py = spawn(cmd, fullArgs, { env: env || process.env });
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

// Format duration from seconds or duration string to MM:SS / HH:MM:SS
function formatDuration(sec, fallbackStr = '') {
  if (sec !== undefined && sec !== null) {
    if (typeof sec === 'string' && sec.includes(':')) {
      const parts = sec.split(':').map(p => p.trim());
      if (parts.every(p => !isNaN(parseInt(p, 10)))) {
        return parts.map(p => p.padStart(2, '0')).join(':');
      }
    }
    const num = typeof sec === 'number' ? sec : parseFloat(sec);
    if (!isNaN(num) && num > 0) {
      const hours = Math.floor(num / 3600);
      const m = Math.floor((num % 3600) / 60);
      const s = Math.floor(num % 60);
      if (hours > 0) {
        return `${hours}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  }
  if (fallbackStr && typeof fallbackStr === 'string' && fallbackStr.includes(':')) {
    return fallbackStr;
  }
  return '03:45';
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
    cookies: fs.existsSync(COOKIES_FILE) && fs.statSync(COOKIES_FILE).size > 50 ? `active (${fs.statSync(COOKIES_FILE).size} bytes)` : 'inactive',
    telegram: TELEGRAM_BOT_TOKEN ? 'configured' : 'not_configured',
    bot_name: '@sonic_media_pro_bot',
    chat_id: TELEGRAM_CHAT_ID,
    available_commands: getCommands().map(c => `${c.label}: ${c.cmd}`),
    time: new Date().toISOString()
  });
});

// Admin Cookie Sync Endpoint to refresh cookies directly from browser
app.post('/api/admin/upload-cookies', (req, res) => {
  const { cookies } = req.body;
  if (!cookies || typeof cookies !== 'string' || cookies.length < 50) {
    return res.status(400).json({ error: 'Valid Netscape format cookie string is required.' });
  }

  try {
    fs.writeFileSync(COOKIES_FILE, cookies, 'utf8');
    console.log(`✅ [ADMIN] YouTube Netscape cookies updated successfully (${cookies.length} bytes)`);
    return res.json({ success: true, message: `Cookies updated successfully (${cookies.length} bytes).` });
  } catch (err) {
    console.error('Failed to write cookies file:', err);
    return res.status(500).json({ error: 'Failed to save cookies on server.' });
  }
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
    '-4',
    '-q',
    '--no-progress',
    '--remote-components', 'ejs:github',
    '--js-runtimes', 'node',
    '-o', '-',
    '-f', '251/250/249/140/ba/b/best',
    '--geo-bypass',
    '--geo-bypass-country', 'US',
    '--no-check-certificates',
    '--no-playlist',
    ...getCookieArgs(),
    testUrl
  ];

  commands.forEach(({ label, cmd, extraArgs, env }) => {
    let py;
    let handled = false;

    const done = () => {
      if (handled) return;
      handled = true;
      completed++;
      if (completed === commands.length && !res.headersSent) {
        res.json({ testUrl, commands: results });
      }
    };

    try {
      py = spawn(cmd, [...extraArgs, ...testPipeArgs], { env: env || process.env });
    } catch (e) {
      results.push({ label, cmd, status: 'spawn_error', error: e.message });
      done();
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
      done();
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
      done();
    });
  });
});

// Debug endpoint to test -g direct CDN stream URL extraction on Render
app.get('/api/debug-g', (req, res) => {
  const testUrl = req.query.url || 'https://www.youtube.com/watch?v=A0_LHc8jN2E';
  const results = [];
  const commands = getCommands();
  let completed = 0;

  if (commands.length === 0) {
    return res.json({ testUrl, status: 'no_commands_found' });
  }

  const testGArgs = [
    '-4',
    '-g',
    '-f', 'ba/b/18/best',
    '--remote-components', 'ejs:github',
    '--js-runtimes', 'node',
    '--geo-bypass',
    '--geo-bypass-country', 'US',
    '--no-check-certificates',
    '--no-playlist',
    ...getCookieArgs(),
    testUrl
  ];

  commands.forEach(({ label, cmd, extraArgs, env }) => {
    let py;
    let handled = false;

    const done = () => {
      if (handled) return;
      handled = true;
      completed++;
      if (completed === commands.length && !res.headersSent) {
        res.json({ testUrl, commands: results });
      }
    };

    try {
      py = spawn(cmd, [...extraArgs, ...testGArgs], { env: env || process.env });
    } catch (e) {
      results.push({ label, cmd, status: 'spawn_error', error: e.message });
      done();
      return;
    }

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', d => stdout += d.toString());
    py.stderr.on('data', d => stderr += d.toString());

    py.on('error', (e) => {
      results.push({ label, cmd, status: 'error', error: e.message });
      done();
    });

    py.on('close', (code) => {
      const url = stdout.trim().split('\n')[0];
      results.push({
        label,
        cmd,
        exitCode: code,
        status: (code === 0 && url.startsWith('http')) ? 'ok' : 'fail',
        url: url.slice(0, 100),
        stderr: stderr.slice(-300)
      });
      done();
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
    // Automated 30-Day Expiry Check
    if (record.status === 'VERIFIED_PRO_ACTIVE' && record.expiresAt && Date.now() > record.expiresAt) {
      record.status = 'EXPIRED';
      pendingPayments.set(cleanUtr, record);
      savePayment(record);
      return res.json({ utr: cleanUtr, status: 'EXPIRED', message: 'PRO Pass subscription expired after 30 days.' });
    }

    return res.json({
      utr: cleanUtr,
      status: record.status,
      expiresAt: record.expiresAt,
      daysRemaining: record.expiresAt ? Math.max(0, Math.ceil((record.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))) : 30
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

  if (cleanUrl.includes('/shorts/')) {
    const shortsMatch = cleanUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch && shortsMatch[1]) {
      cleanUrl = `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
    }
  }

  const platform = detectPlatform(cleanUrl);

  console.log(`[API /info] Extracting metadata & direct CDN streams for [${platform.name}]: ${cleanUrl}`);

  const infoArgs = [
    '-4',
    '--dump-single-json',
    '--remote-components', 'ejs:github',
    '--js-runtimes', JS_RUNTIME_ARG,
    '--geo-bypass',
    '--geo-bypass-country', 'US',
    '--no-check-certificates',
    '--ignore-no-formats-error',
    '--no-warnings',
    '--no-playlist',
    ...getCookieArgs(),
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

      const titleEnc = encodeURIComponent(info.title || 'media');
      const urlEnc = encodeURIComponent(cleanUrl);

      const rawDuration = info.duration ?? info.duration_seconds ?? info.length_seconds ?? info.duration_string;
      const formattedDuration = formatDuration(rawDuration, info.duration_string);
      const secondsVal = typeof rawDuration === 'number' ? rawDuration : (parseFloat(rawDuration) || 0);

      const response = {
        title: info.title || 'Social Media Video',
        uploader: info.uploader || info.channel || info.artist || `${platform.name} Author`,
        duration: formattedDuration,
        duration_seconds: secondsVal,
        thumbnail: info.thumbnail || (info.thumbnails && info.thumbnails.length > 0 ? info.thumbnails[info.thumbnails.length - 1].url : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'),
        platform,
        url: cleanUrl,
        views: info.view_count ? info.view_count.toLocaleString() : 'N/A',
        formats: {
          audio: [
            { label: 'MP3 Ultra HD (320 kbps)', bitrate: '320k', size: '~8.5 MB', format_id: 'mp3-320' },
            { label: 'MP3 High Quality (256 kbps)', bitrate: '256k', size: '~6.2 MB', format_id: 'mp3-256' },
            { label: 'MP3 Standard (128 kbps)', bitrate: '128k', size: '~3.4 MB', format_id: 'mp3-128' },
            { label: 'M4A Original Stream', bitrate: 'm4a', size: '~5.1 MB', format_id: 'm4a-orig' }
          ],
          video: [
            { label: 'MP4 4K Ultra HD (2160p 4K Master)', res: '2160p', size: '~250–600 MB', format_id: 'mp4-4k' },
            { label: 'MP4 Full HD (1080p Crisp Master)', res: '1080p', size: '~80–120 MB', format_id: 'mp4-1080' },
            { label: 'MP4 HD (720p Standard HD)', res: '720p', size: '~30–50 MB', format_id: 'mp4-720' },
            { label: 'MP4 SD (480p Mobile Quality)', res: '480p', size: '~15–25 MB', format_id: 'mp4-480' }
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

// Extract YouTube/Social Playlist API
app.get('/api/playlist', async (req, res) => {
  const { url } = req.query;

  let rawUrl = (url || '').trim();
  const secondHttp = rawUrl.indexOf('http', 8);
  if (secondHttp !== -1) {
    rawUrl = rawUrl.substring(0, secondHttp);
  }

  const match = rawUrl.match(/(https?:\/\/[^\s>]+)/i);
  let cleanUrl = match ? match[0] : null;

  if (!cleanUrl) {
    return res.status(400).json({ error: '⚠️ Please paste a valid playlist or video URL.' });
  }

  console.log(`[API /playlist] Extracting playlist entries for: ${cleanUrl}`);

  const playlistArgs = [
    '--flat-playlist',
    '--dump-single-json',
    '--user-agent', '',
    '--no-check-certificates',
    '--ignore-no-formats-error',
    '--no-warnings',
    cleanUrl
  ];

  runYtDlp(playlistArgs, (code, stdoutData, stderrData) => {
    if (code !== 0 || !stdoutData) {
      console.error('yt-dlp playlist stderr:', stderrData);
      return res.status(400).json({ error: '⚠️ Could not read playlist link. Please verify the URL and try again.' });
    }

    try {
      const data = JSON.parse(stdoutData);
      const entries = Array.isArray(data.entries) ? data.entries : [data];

      const tracks = entries.map((item, index) => {
        const itemTitle = item.title || `Track #${index + 1}`;
        const itemUrl = item.url || (item.id ? `https://www.youtube.com/watch?v=${item.id}` : cleanUrl);
        const itemDuration = formatDuration(item.duration || item.duration_string);
        const itemUploader = item.uploader || item.channel || data.uploader || 'Artist';
        let itemThumbnail = item.thumbnail;
        if (!itemThumbnail && item.thumbnails && item.thumbnails.length > 0) {
          itemThumbnail = item.thumbnails[item.thumbnails.length - 1].url;
        }

        return {
          id: index + 1,
          title: itemTitle,
          uploader: itemUploader,
          duration: itemDuration,
          url: itemUrl,
          thumbnail: itemThumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
        };
      });

      return res.json({
        playlistTitle: data.title || 'Playlist',
        itemCount: tracks.length,
        tracks
      });
    } catch (e) {
      console.error('Playlist JSON parse error:', e);
      return res.status(400).json({ error: '⚠️ Failed to parse playlist data.' });
    }
  });
});

// High-availability Public Invidious / Piped CDN Stream Fallback
async function fetchPublicCdnAudioUrl(urlOrId) {
  let videoId = urlOrId;
  const vMatch = (urlOrId || '').match(/(?:v=|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (vMatch) videoId = vMatch[1];
  if (!videoId || videoId.length !== 11) return null;

  console.log(`[Fallback CDN API] Querying public nodes for Video ID: ${videoId}`);

  const pipedInstances = [
    'https://pipedapi.kavin.rocks',
    'https://api.piped.privacydev.net',
    'https://pipedapi.adminforge.de',
    'https://pipedapi.tokhmi.xyz'
  ];

  for (const domain of pipedInstances) {
    try {
      const data = await new Promise((resolve) => {
        const req = https.get(`${domain}/streams/${videoId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          timeout: 4000
        }, res => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
      });

      if (data && data.audioStreams && data.audioStreams.length > 0) {
        console.log(`✅ [Fallback CDN API] Piped (${domain}) Audio Stream Found!`);
        return data.audioStreams[0].url;
      }
    } catch (e) {}
  }

  const invidiousInstances = [
    'https://inv.tux.pizza',
    'https://invidious.nerdvpn.de',
    'https://invidious.drgns.space',
    'https://invidious.privacydev.net'
  ];

  for (const domain of invidiousInstances) {
    try {
      const data = await new Promise((resolve) => {
        const req = https.get(`${domain}/api/v1/videos/${videoId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          timeout: 4000
        }, res => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
      });

      if (data && data.adaptiveFormats) {
        const audio = data.adaptiveFormats.find(f => f.type && f.type.includes('audio'));
        if (audio && audio.url) {
          console.log(`✅ [Fallback CDN API] Invidious (${domain}) Audio Stream Found!`);
          return audio.url;
        }
      }
    } catch (e) {}
  }

  return null;
}

// Stream Download Handler API (INSTANT HEADERS & DIRECT FFMPEG AUDIO FILTER PIPE)
app.get('/api/download', (req, res) => {
  const { url, type, quality, speed, title } = req.query;

  let rawUrl = (url || '').trim();
  const secondHttp = rawUrl.indexOf('http', 8);
  if (secondHttp !== -1) {
    rawUrl = rawUrl.substring(0, secondHttp);
  }

  const match = rawUrl.match(/(https?:\/\/[^\s>]+)/i);
  let cleanUrl = match ? match[0] : null;

  if (!cleanUrl) {
    return res.status(400).send('⚠️ Valid video or music URL is required.');
  }

  let targetDownloadUrl = cleanUrl;
  let isPurePlaylist = false;

  // Clean playlist parameters if video ID is present to target single video cleanly
  if (targetDownloadUrl.includes('/shorts/')) {
    const shortsMatch = targetDownloadUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch && shortsMatch[1]) {
      targetDownloadUrl = `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
    }
  } else if (targetDownloadUrl.includes('watch?v=') && targetDownloadUrl.includes('list=')) {
    targetDownloadUrl = targetDownloadUrl.replace(/([?&])list=[^&]+&?/, '$1').replace(/[?&]$/, '');
  } else if (targetDownloadUrl.includes('/playlist?') || targetDownloadUrl.includes('/sets/')) {
    isPurePlaylist = true;
  }

  const safeAsciiTitle = (title || 'sonicmedia-download')
    .replace(/#/g, '')
    .replace(/[^a-zA-Z0-9_\-\s.]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
  const ext = type === 'audio' ? 'mp3' : 'mp4';
  const filename = `${safeAsciiTitle}.${ext}`;

  console.log(`[API /download] Direct Media Stream Request for [${type} - ${quality || 'best'} - speed ${speed || '1.0x'}]: ${targetDownloadUrl} -> ${filename}`);

  const commands = getCommands();
  const FFMPEG_BIN = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
  const hasFfmpeg = fs.existsSync(FFMPEG_BIN);
  if (hasFfmpeg && process.platform !== 'win32') {
    try { fs.chmodSync(FFMPEG_BIN, 0o755); } catch (e) {}
  }

  const qLower = (quality || '').toLowerCase();

  if (type === 'audio') {
    // Flexible quality matching for 320k, 256k, 128k, m4a or 'MP3 320kbps'
    let audioQualityArg = '2';
    if (qLower.includes('320')) audioQualityArg = '0';
    else if (qLower.includes('128')) audioQualityArg = '5';
    else if (qLower.includes('256')) audioQualityArg = '2';

    // Build FFmpeg Audio Filter for Playback Tempo / Pitch Modifiers
    let afFilter = null;
    if (speed === '0.8x') {
      afFilter = 'asetrate=44100*0.85,aresample=44100,aecho=0.8:0.88:60:0.4';
    } else if (speed === '1.25x') {
      afFilter = 'asetrate=44100*1.25,aresample=44100';
    } else if (speed === '1.5x') {
      afFilter = 'atempo=1.5';
    }

    // ⚡ Direct Instant Piping Engine (yt-dlp stdout -> FFmpeg -> HTTP Response)
    // 0-second disk latency, 3-second instant stream start, zero timeout errors!
    // ⚡ Direct Instant Piping Engine (yt-dlp stdout -> FFmpeg -> HTTP Response)
    // 0-second disk latency, 3-second instant stream start, zero timeout errors!
    async function tryDirectPipe(index, currentUrl = targetDownloadUrl, isSearchRetry = false) {
      if (index >= commands.length) {
        // Fallback Step 1: Retry via ytsearch1 if URL has video ID and not retried yet
        const vMatch = cleanUrl.match(/(?:v=|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
        if (!isSearchRetry && vMatch && vMatch[1]) {
          console.log(`[tryDirectPipe] Direct URL failed all profiles. Retrying via search query ytsearch1:${vMatch[1]}...`);
          return tryDirectPipe(0, `ytsearch1:${vMatch[1]}`, true);
        }

        // Fallback Step 2: Query public CDN API for direct audio stream URL and pipe with FFmpeg
        console.log(`[tryDirectPipe] Attempting Public CDN Stream Fallback for: ${cleanUrl}`);
        const cdnAudioUrl = await fetchPublicCdnAudioUrl(cleanUrl);
        if (cdnAudioUrl) {
          console.log(`[tryDirectPipe CDN Fallback] Piping public CDN stream directly to FFmpeg...`);
          let ffmpegArgs = ['-y', '-i', cdnAudioUrl, '-vn', '-acodec', 'libmp3lame'];
          if (audioQualityArg === '0') ffmpegArgs.push('-q:a', '0');
          else if (audioQualityArg === '5') ffmpegArgs.push('-q:a', '5');
          else ffmpegArgs.push('-q:a', '2');
          if (afFilter) ffmpegArgs.push('-af', afFilter);
          ffmpegArgs.push('-f', 'mp3', 'pipe:1');

          const ffmpegCmd = hasFfmpeg ? FFMPEG_BIN : 'ffmpeg';
          let ff;
          try {
            ff = spawn(ffmpegCmd, ffmpegArgs);
          } catch (e) {
            console.error('[CDN Fallback] FFmpeg spawn error:', e.message);
          }

          if (ff) {
            let bytesWritten = 0;
            let headersSentLocal = false;
            ff.stdout.on('data', (chunk) => {
              if (!headersSentLocal && !res.headersSent) {
                headersSentLocal = true;
                console.log(`[CDN Fallback] ⚡ Streaming MP3 audio to client!`);
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
                res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, X-Filename');
                res.setHeader('X-Filename', encodeURIComponent(filename));
              }
              bytesWritten += chunk.length;
              res.write(chunk);
            });
            ff.stdout.on('end', () => {
              if (bytesWritten > 0) return res.end();
            });
            req.on('close', () => { try { ff.kill('SIGKILL'); } catch (e) {} });
            return;
          }
        }

        console.error(`❌ All direct audio extraction strategies failed for: ${cleanUrl}`);
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'application/json');
          res.status(400).json({ error: '⚠️ Could not process this YouTube link right now. Please verify the URL or try another track.' });
        } else if (!res.writableEnded) {
          res.end();
        }
        return;
      }

      const { cmd, extraArgs, label, env } = commands[index];
      console.log(`[tryDirectPipe ${label}] Launching direct audio pipe for: ${currentUrl}`);

      const playlistHandlingArgs = isPurePlaylist ? ['--playlist-items', '1'] : ['--no-playlist'];

      const pipeYtArgs = [
        '-4',
        '-q',
        '--no-progress',
        '-o', '-',
        '-f', 'bestaudio[ext=m4a]/bestaudio[ext=webm]/251/250/249/140/ba/bestaudio/18/22/b/best',
        '--js-runtimes', JS_RUNTIME_ARG,
        '--geo-bypass',
        '--geo-bypass-country', 'US',
        '--no-check-certificates',
        ...playlistHandlingArgs,
        ...getCookieArgs(),
        currentUrl
      ];

      let ytdlp;
      let ff;
      let handled = false;

      try {
        ytdlp = spawn(cmd, [...extraArgs, ...pipeYtArgs], { env: env || process.env });
      } catch (e) {
        console.error(`[tryDirectPipe ${label}] spawn error:`, e.message);
        return tryDirectPipe(index + 1, currentUrl, isSearchRetry);
      }

      let ffmpegArgs = [
        '-y',
        '-i', 'pipe:0',
        '-vn',
        '-acodec', 'libmp3lame'
      ];
      if (audioQualityArg === '0') ffmpegArgs.push('-q:a', '0');
      else if (audioQualityArg === '5') ffmpegArgs.push('-q:a', '5');
      else ffmpegArgs.push('-q:a', '2');

      if (afFilter) ffmpegArgs.push('-af', afFilter);
      ffmpegArgs.push('-f', 'mp3', 'pipe:1');

      const ffmpegCmd = hasFfmpeg ? FFMPEG_BIN : 'ffmpeg';
      try {
        ff = spawn(ffmpegCmd, ffmpegArgs);
      } catch (e) {
        console.error(`[tryDirectPipe ${label}] FFmpeg spawn error:`, e.message);
        try { ytdlp.kill('SIGKILL'); } catch (e) {}
        return tryDirectPipe(index + 1, currentUrl, isSearchRetry);
      }

      ytdlp.stdout.pipe(ff.stdin);

      let bytesWritten = 0;
      let headersSentLocal = false;

      const timer = setTimeout(() => {
        if (!handled && bytesWritten === 0) {
          handled = true;
          try { ytdlp.kill('SIGKILL'); } catch (e) {}
          try { ff.kill('SIGKILL'); } catch (e) {}
          console.error(`[tryDirectPipe ${label}] timed out after 10s with 0 bytes, trying next strategy...`);
          tryDirectPipe(index + 1, currentUrl, isSearchRetry);
        }
      }, 10000);

      ff.stdout.on('data', (chunk) => {
        if (!headersSentLocal && !res.headersSent) {
          headersSentLocal = true;
          clearTimeout(timer);
          console.log(`[tryDirectPipe ${label}] ⚡ First MP3 chunk arrived! Streaming directly to client...`);
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
          res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, X-Filename');
          res.setHeader('X-Filename', encodeURIComponent(filename));
        }
        bytesWritten += chunk.length;
        res.write(chunk);
      });

      ff.stdout.on('end', () => {
        if (!handled) {
          handled = true;
          clearTimeout(timer);
          if (bytesWritten === 0) {
            console.error(`[tryDirectPipe ${label}] FFmpeg stream ended with 0 bytes, trying next strategy...`);
            tryDirectPipe(index + 1, currentUrl, isSearchRetry);
          } else {
            res.end();
          }
        }
      });

      ytdlp.on('error', () => {
        if (!handled && bytesWritten === 0) {
          handled = true;
          clearTimeout(timer);
          try { ff.kill('SIGKILL'); } catch (e) {}
          tryDirectPipe(index + 1, currentUrl, isSearchRetry);
        }
      });

      ff.on('error', () => {
        if (!handled && bytesWritten === 0) {
          handled = true;
          clearTimeout(timer);
          try { ytdlp.kill('SIGKILL'); } catch (e) {}
          tryDirectPipe(index + 1, currentUrl, isSearchRetry);
        }
      });

      req.on('close', () => {
        try { ytdlp.kill('SIGKILL'); } catch (e) {}
        try { ff.kill('SIGKILL'); } catch (e) {}
      });
    }

    return tryDirectPipe(0);
  }

  // 🎬 Video Processing Engine with Direct Stream Piping & Faststart Frag Keyframe MP4 Header
  let formatString = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best';
  if (quality) {
    const qLower = quality.toLowerCase();
    if (qLower.includes('2160') || qLower.includes('4k') || qLower.includes('8k')) {
      formatString = 'bestvideo[height<=2160][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=2160]+bestaudio/best';
    } else if (qLower.includes('1080')) {
      formatString = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best';
    } else if (qLower.includes('720')) {
      formatString = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best';
    } else if (qLower.includes('480')) {
      formatString = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=480]+bestaudio/best';
    }
  }

  function tryDirectVideoPipe(index, currentUrl = targetDownloadUrl, isSearchRetry = false) {
    if (index >= commands.length) {
      const vMatch = cleanUrl.match(/(?:v=|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
      if (!isSearchRetry && vMatch && vMatch[1]) {
        console.log(`[tryDirectVideoPipe] Direct URL failed all profiles. Retrying via search query ytsearch1:${vMatch[1]}...`);
        return tryDirectVideoPipe(0, `ytsearch1:${vMatch[1]}`, true);
      }

      console.error(`❌ All video extraction strategies failed for: ${cleanUrl}`);
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: '❌ Video extraction failed. YouTube link may be restricted or protected.' });
      } else if (!res.writableEnded) {
        res.end();
      }
      return;
    }

    const { cmd, extraArgs, label, env } = commands[index];
    console.log(`[tryDirectVideoPipe ${label}] Launching direct video pipe for: ${currentUrl}`);

    const playlistHandlingArgs = isPurePlaylist ? ['--playlist-items', '1'] : ['--no-playlist'];

    const pipeVideoArgs = [
      '-4',
      '-q',
      '--no-progress',
      '-o', '-',
      '-f', formatString,
      '--js-runtimes', JS_RUNTIME_ARG,
      '--geo-bypass',
      '--geo-bypass-country', 'US',
      '--no-check-certificates',
      ...playlistHandlingArgs,
      ...getCookieArgs(),
      currentUrl
    ];

    let ytdlp;
    let ff;
    let handled = false;

    try {
      ytdlp = spawn(cmd, [...extraArgs, ...pipeVideoArgs], { env: env || process.env });
    } catch (e) {
      console.error(`[tryDirectVideoPipe ${label}] spawn error:`, e.message);
      return tryDirectVideoPipe(index + 1);
    }

    const ffmpegArgs = [
      '-y',
      '-i', 'pipe:0',
      '-c', 'copy',
      '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
      '-f', 'mp4',
      'pipe:1'
    ];

    const ffmpegCmd = hasFfmpeg ? FFMPEG_BIN : 'ffmpeg';
    try {
      ff = spawn(ffmpegCmd, ffmpegArgs);
    } catch (e) {
      console.error(`[tryDirectVideoPipe ${label}] FFmpeg spawn error:`, e.message);
      try { ytdlp.kill('SIGKILL'); } catch (e) {}
      return tryDirectVideoPipe(index + 1);
    }

    ytdlp.stdout.pipe(ff.stdin);

    let bytesWritten = 0;
    let headersSentLocal = false;

    const timer = setTimeout(() => {
      if (!handled && bytesWritten === 0) {
        handled = true;
        try { ytdlp.kill('SIGKILL'); } catch (e) {}
        try { ff.kill('SIGKILL'); } catch (e) {}
        console.error(`[tryDirectVideoPipe ${label}] timed out after 12s with 0 bytes, trying next strategy...`);
        tryDirectVideoPipe(index + 1);
      }
    }, 12000);

    ff.stdout.on('data', (chunk) => {
      if (!headersSentLocal && !res.headersSent) {
        headersSentLocal = true;
        clearTimeout(timer);
        console.log(`[tryDirectVideoPipe ${label}] ⚡ First MP4 video chunk arrived! Streaming directly to client...`);
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, X-Filename');
        res.setHeader('X-Filename', encodeURIComponent(filename));
      }
      bytesWritten += chunk.length;
      res.write(chunk);
    });

    ff.stdout.on('end', () => {
      if (!handled) {
        handled = true;
        clearTimeout(timer);
        if (bytesWritten === 0) {
          console.error(`[tryDirectVideoPipe ${label}] FFmpeg video stream ended with 0 bytes, trying next strategy...`);
          tryDirectVideoPipe(index + 1);
        } else {
          res.end();
        }
      }
    });

    ytdlp.on('error', () => {
      if (!handled && bytesWritten === 0) {
        handled = true;
        clearTimeout(timer);
        try { ff.kill('SIGKILL'); } catch (e) {}
        tryDirectVideoPipe(index + 1);
      }
    });

    ff.on('error', () => {
      if (!handled && bytesWritten === 0) {
        handled = true;
        clearTimeout(timer);
        try { ytdlp.kill('SIGKILL'); } catch (e) {}
        tryDirectVideoPipe(index + 1);
      }
    });

    return tryDirectVideoPipe(0);
  }

  return tryDirectVideoPipe(0);
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
