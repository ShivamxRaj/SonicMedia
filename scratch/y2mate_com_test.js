import https from 'https';
import querystring from 'querystring';

function testY2MateCom(videoId) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      k_query: `https://www.youtube.com/watch?v=${videoId}`,
      k_page: 'home',
      hl: 'en',
      q_auto: '0'
    });

    const req = https.request({
      hostname: 'www.y2mate.com',
      path: '/mates/analyzeV2/ajax',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve({ raw: d }); }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- Testing y2mate.com analyzeV2 API ---');
  const res = await testY2MateCom('A0_LHc8jN2E');
  console.log('Status:', res.status);
  console.log('Title:', res.title);
  if (res.links && res.links.mp3) {
    console.log('MP3 formats available:', Object.keys(res.links.mp3));
    const firstMp3Key = Object.keys(res.links.mp3)[0];
    console.log('First MP3 details:', res.links.mp3[firstMp3Key]);
  } else {
    console.log('Keys in response:', Object.keys(res));
  }
}

run();
