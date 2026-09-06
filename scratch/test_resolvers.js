import https from 'https';

function testEndpoint(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data.slice(0, 150) });
        }
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function run() {
  const videoId = 'A0_LHc8jN2E';
  console.log('Testing public stream resolvers for YouTube ID:', videoId);

  // 1. Test Cobalt API mirror endpoints
  const cobaltPost = (host) => new Promise((resolve) => {
    const body = JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}`, audioFormat: 'mp3', downloadMode: 'audio' });
    const req = https.request({
      hostname: host,
      path: '/',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ host, status: res.statusCode, data: JSON.parse(d) }); }
        catch (e) { resolve({ host, status: res.statusCode, raw: d.slice(0, 150) }); }
      });
    });
    req.on('error', e => resolve({ host, error: e.message }));
    req.write(body);
    req.end();
  });

  const cobaltHosts = ['co.wuk.sh', 'api.cobalt.tools', 'cobalt-api.kwippy.com'];
  for (const h of cobaltHosts) {
    const res = await cobaltPost(h);
    console.log(`Cobalt [${h}]:`, res);
  }

  // 2. Test Invidious instances
  const invidiousHosts = ['invidious.nerdvpn.de', 'inv.riverside.rocks', 'invidious.drgns.space'];
  for (const h of invidiousHosts) {
    const res = await testEndpoint(`https://${h}/api/v1/videos/${videoId}`);
    console.log(`Invidious [${h}]:`, res.status, res.data?.title ? 'Title: ' + res.data.title : res.raw);
  }
}

run();
