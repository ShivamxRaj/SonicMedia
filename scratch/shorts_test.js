import subprocess from 'child_process';

const testUrl = 'https://www.youtube.com/watch?v=A0_LHc8jN2E';

const formats = [
  'bestaudio/ba/b/best',
  'ba/b/best',
  '140/ba/best',
  '18/ba/best',
  'best'
];

for (const fmt of formats) {
  const fullCmd = ['python', '-m', 'yt_dlp', '-4', '-g', '-f', fmt, '--extractor-args', 'youtube:player_client=android', testUrl];
  const res = subprocess.spawnSync(fullCmd[0], fullCmd.slice(1), { encoding: 'utf8' });
  const firstLine = (res.stdout || '').trim().split('\n')[0];
  console.log(`Format [${fmt}]: Exit ${res.status} | Stream URL: ${firstLine.slice(0, 60)}...`);
}
