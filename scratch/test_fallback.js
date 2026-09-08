import https from 'https';

function postJson(url, body, headers = {}) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const postData = JSON.stringify(body);
      const req = https.request({
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...headers
        }
      }, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch (e) { resolve({ raw: data, status: res.statusCode }); }
        });
      });
      req.on('error', (err) => resolve({ error: err.message }));
      req.setTimeout(6000, () => { req.destroy(); resolve(null); });
      req.write(postData);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

function getJson(url, headers = {}) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...headers
        }
      }, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch (e) { resolve({ raw: data, status: res.statusCode }); }
        });
      });
      req.on('error', () => resolve(null));
      req.setTimeout(6000, () => { req.destroy(); resolve(null); });
    } catch (e) { resolve(null); }
  });
}

async function testCobaltInstances() {
  const videoUrl = 'https://www.youtube.com/watch?v=A0_LHc8jN2E';
  
  // Cobalt public instances list
  const cobaltInstances = [
    'https://cobalt.tools/api/json',
    'https://api.cobalt.tools/',
    'https://co.wuk.sh/api/json',
    'https://cobalt-api.kwippy.com/api/json',
    'https://cobalt.stream/api/json',
    'https://cobalt.qewertyy.dev/api/json'
  ];

  console.log('Testing Cobalt public instances...');
  for (const inst of cobaltInstances) {
    const res = await postJson(inst, { url: videoUrl, downloadMode: 'audio', audioFormat: 'mp3' }, { 'Accept': 'application/json' });
    console.log(`[${inst}] ->`, res ? (res.url || res.picker || JSON.stringify(res).slice(0, 100)) : 'NULL');
  }

  console.log('\nTesting Invidious adaptive streams...');
  const invidious = [
    'https://inv.tux.pizza/api/v1/videos/A0_LHc8jN2E',
    'https://invidious.nerdvpn.de/api/v1/videos/A0_LHc8jN2E',
    'https://vid.puffyan.us/api/v1/videos/A0_LHc8jN2E',
    'https://invidious.projectsegfau.lt/api/v1/videos/A0_LHc8jN2E'
  ];
  for (const url of invidious) {
    const res = await getJson(url);
    if (res && res.adaptiveFormats) {
      console.log(`[${url}] SUCCESS! Audio count:`, res.adaptiveFormats.filter(f => f.type.includes('audio')).length);
    } else {
      console.log(`[${url}] FAIL`);
    }
  }

  console.log('\nTesting Piped stream instances...');
  const piped = [
    'https://pipedapi.kavin.rocks/streams/A0_LHc8jN2E',
    'https://api.piped.privacydev.net/streams/A0_LHc8jN2E',
    'https://pipedapi.tokhmi.xyz/streams/A0_LHc8jN2E',
    'https://pipedapi.moomoo.me/streams/A0_LHc8jN2E'
  ];
  for (const url of piped) {
    const res = await getJson(url);
    if (res && res.audioStreams && res.audioStreams.length > 0) {
      console.log(`[${url}] SUCCESS! Audio Streams:`, res.audioStreams.length);
      console.log('Sample Audio Stream URL:', res.audioStreams[0].url.slice(0, 80));
    } else {
      console.log(`[${url}] FAIL`);
    }
  }
}

testCobaltInstances();
