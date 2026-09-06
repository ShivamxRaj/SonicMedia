import https from 'https';
import querystring from 'querystring';

function fetchJson(url, options = {}) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, headers: options.headers || {} };
    https.get(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve({ raw: d.slice(0, 200) }); }
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

function testYt1s(videoId) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      q: `https://www.youtube.com/watch?v=${videoId}`,
      vt: 'home'
    });

    const req = https.request({
      hostname: 'yt1s.com',
      path: '/api/ajaxSearch/index',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve({ raw: d }); }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- Testing YT1s API ---');
  const res1 = await testYt1s('A0_LHc8jN2E');
  console.log('YT1s Result:', res1.status, res1.title);
}

run();
