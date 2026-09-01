# ⚡ SonicMedia — Universal Music & Video Studio

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Backend-Express.js-000000?logo=express)](https://expressjs.com/)
[![FFmpeg](https://img.shields.io/badge/Engine-FFmpeg_Muxer-0078D7?logo=ffmpeg)](https://ffmpeg.org/)
[![Telegram](https://img.shields.io/badge/Bot-Telegram_Realtime-26A5E4?logo=telegram)](https://telegram.org/)

**SonicMedia** is a state-of-the-art, high-performance web application engineered for high-fidelity audio extraction and 4K Ultra HD video downloads from YouTube, Instagram Reels, TikTok, Twitter/X, SoundCloud, and Facebook.

---

## ✨ Features & Highlights

- 🎧 **Studio-Quality Audio Extraction**: Download 320kbps MP3, WAV, and FLAC audio streams with ID3 metadata tag editor.
- 🎨 **4K HDR Video Enhancer**: Stream 4K 2160p videos with dynamic FFmpeg HDR color grading (+20% color saturation) and edge sharpening filters.
- 🎛️ **Audio Studio Modifier**: Built-in 0.8x Slowed + Reverb and 1.25x Nightcore remix engines.
- 💳 **Direct UPI QR Micro-Pass (₹9 / month)**: Integrated zero-commission UPI QR payments for GPay, PhonePe, Paytm, and BHIM with strict 12-digit UTR validation.
- 🤖 **Real-Time Telegram Approval Bot**: Instant notifications sent to owner phone via `@sonic_media_pro_bot` with inline `[ ✅ APPROVE PRO ]` and `[ ❌ REJECT FAKE ]` buttons.
- 🛡️ **Anti-Scam Protection**: Logs transaction UTRs in `server/payments.json` and prevents reuse of duplicate reference numbers.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Outfit & Plus Jakarta Sans Google Fonts
- **Backend**: Express.js, Node.js ES Modules
- **Engine**: Python `yt-dlp` stream extractor + FFmpeg binary muxer
- **Notifications**: Telegram Bot Webhook & Long Polling Engine

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/ShivamxRaj/SonicMedia.git
cd SonicMedia
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start Express Backend
```bash
node server/server.mjs
```

### 4. Start Vite Frontend
```bash
npx vite --port 5174
```

Open `http://localhost:5174` in your browser!

---

## 🌐 Free Production Deployment (Render.com)

1. Connect your repository to [Render.com](https://render.com).
2. Set Build Command: `npm install && npm run build`
3. Set Start Command: `node server/server.mjs`
4. Set Environment Variables:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token from `@BotFather`
   - `TELEGRAM_CHAT_ID`: Your Telegram Chat ID from `@userinfobot`

For full hosting documentation, see [DEPLOYMENT_GUIDE.md](file:///d:/music/DEPLOYMENT_GUIDE.md).

---

## 📄 License

Created by **Shivam Raj**. Open source under the MIT License.
