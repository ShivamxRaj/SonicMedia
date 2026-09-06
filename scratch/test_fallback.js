import https from 'https';
import http from 'http';

function fetchUrl(targetUrl) {
  return new Promise((resolve) => {
    try {
      const client = targetUrl.startsWith('https') ? https : http;
      client.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try { resolve({ status: res.statusCode, json: JSON.parse(d) }); }
          catch (e) { resolve({ status: res.statusCode, text: d.slice(0, 200) }); }
        });
      }).on('error', e => resolve({ error: e.message }));
    } catch (e) { resolve({ error: e.message }); }
  });
}

async function run() {
  const v = 'A0_LHc8jN2E';
  console.log('Testing public converter APIs for video ID:', v);

  const endpoints = [
    `https://api.vevioz.com/api/button/mp3/${v}`,
    `https://y2mate.is/api/v1/analyze`,
    `https://loader.to/ajax/download.php?format=1080&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + v)}`
  ];

  for (const ep of endpoints) {
    const res = await fetchUrl(ep);
    console.log(`Endpoint [${ep.slice(0, 45)}...]:`, res.status, res.json || res.text);
  }
}

run();
