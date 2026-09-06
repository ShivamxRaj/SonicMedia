import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve({ raw: d.slice(0, 200) }); }
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

async function run() {
  const v = 'A0_LHc8jN2E';
  console.log('Testing RapidAPI / Public Youtube Converters...');
  
  // Test loader.to public endpoint
  const loaderRes = await fetchUrl(`https://loader.to/ajax/download.php?format=1080&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + v)}`);
  console.log('Loader.to response:', loaderRes);
}

run();
