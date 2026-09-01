# SonicMedia — Live Deployment & Production Guide

This guide details how to host **SonicMedia** live on the internet so users worldwide can convert and download videos & MP3 audio!

---

## 🚀 Option 1: 100% Free All-in-One Deployment on Render.com (Recommended)

Render is the best free platform because it supports **Node.js, Express, Python3, and FFmpeg streaming**.

### Step 1: Initialize Git and Push to GitHub
Open your terminal in `d:/music` and run:
```bash
git init
git add .
git commit -m "SonicMedia Production v1.0"
```
Create a new public or private repository on [GitHub](https://github.com/new) named `sonicmedia`.
Link and push your repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/sonicmedia.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render.com
1. Go to [Render.com](https://render.com) and sign up for a free account.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository `sonicmedia`.
4. Configure the service settings:
   - **Name**: `sonicmedia`
   - **Environment**: `Node`
   - **Region**: Singapore or Frankfurt
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/server.mjs`
   - **Instance Type**: Free
5. Under **Environment Variables**, add:
   - `TELEGRAM_BOT_TOKEN`: `8876051212:AAFqaooU_NvyqZbhnLxeIc27fS4TFrs3feU`
   - `TELEGRAM_CHAT_ID`: `5852264415`
6. Click **Create Web Service**.

Within 2 minutes, Render will provide a live HTTPS URL like:
👉 **`https://sonicmedia.onrender.com`**

---

## ⚡ Option 2: Custom Domain Setup (e.g. sonicmedia.in or .com)

If you buy a domain name (from Hostinger, GoDaddy, or Namecheap for ~₹199/year):
1. In Render Dashboard, go to **Settings** -> **Custom Domains**.
2. Add your domain name (e.g., `sonicmedia.in`).
3. Add the CNAME record in your GoDaddy/Hostinger DNS settings.
4. Render automatically issues a free SSL certificate (`https://`).

---

## 🛡️ Live Anti-Scam & Telegram Verification

- All PRO subscriptions will automatically send real-time Telegram alerts to `@sonic_media_pro_bot` on your phone.
- Tapping **`[ ✅ APPROVE PRO ]`** in Telegram will instantly unlock PRO features for the live user worldwide!
