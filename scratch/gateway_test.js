import https from 'https';

function fetchJsonTimeout(url, timeoutMs = 3000) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.get({
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
        });
      });

      req.on('error', () => resolve(null));
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        resolve(null);
      });
    } catch (e) {
      resolve(null);
    }
  });
}

async function testFastGateways(videoId) {
  console.log('Testing fast public stream gateways...');
  const invidiousInstances = [
    `https://invidious.nerdvpn.de/api/v1/videos/${videoId}`,
    `https://inv.tux.pizza/api/v1/videos/${videoId}`,
    `https://invidious.drgns.space/api/v1/videos/${videoId}`,
    `https://pipedapi.kavin.rocks/streams/${videoId}`,
    `https://api.piped.privacydev.net/streams/${videoId}`
  ];

  for (const url of invidiousInstances) {
    const start = Date.now();
    const data = await fetchJsonTimeout(url, 3000);
    console.log(`[${Date.now() - start}ms] Endpoint ${url.slice(0, 35)}...:`, data ? 'SUCCESS!' : 'Timeout/Fail');
    if (data) {
      const formats = data.adaptiveFormats || data.audioStreams || [];
      if (formats.length > 0) {
        console.log('Stream URL found:', (formats[0].url || '').slice(0, 60));
        return formats[0].url;
      }
    }
  }
  return null;
}

testFastGateways('A0_LHc8jN2E');
