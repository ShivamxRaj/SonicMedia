import https from 'https';

https.get('https://www.y2mate.in.net/en1/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Find all script tags or js filenames
    const scripts = d.match(/<script[^>]*src=["']([^"']+)["']/g) || [];
    console.log('Script tags:', scripts);

    // Look for endpoints like /mates/analyzeV2/ajax or /mates/convertV2/index
    const endpoints = d.match(/var\s+[a-zA-Z0-9_]+\s*=\s*["']([^"']+)["']/g) || [];
    console.log('Variables:', endpoints);

    // Match ajax or fetch URLs
    const ajaxUrls = d.match(/(["'])(https?:\/\/[^"']+|\/[^"']+)\1/g) || [];
    console.log('Matching paths:', Array.from(new Set(ajaxUrls)).filter(p => p.includes('ajax') || p.includes('convert') || p.includes('analyze') || p.includes('api') || p.includes('mate')));
  });
});
