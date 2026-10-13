// Render one shot function standalone as a clip: node demo.cjs --fn g_wide3d --dur 5 --out demo.mp4 [--gt 120] [--still 2.5]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
const a = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, arr) => (v.startsWith('--') ? acc.concat([[v.slice(2), arr[i + 1]]]) : acc), []));
(async () => {
  const b = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.error('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.error(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../engine/index.html'));
  const draw = (lt) => p.evaluate(([fn, lt, d, gt]) => { resetDefs(); const body = SHOTS_REG[fn](lt, d, gt + lt); root.innerHTML = `<defs>${[...DEFS.values()].join('')}</defs>${body}${vignette(.5) + letterbox()}`; }, [a.fn, lt, +a.dur, +(a.gt || 120)]);
  if (a.still) { for (const s of a.still.split(',')) { await draw(+s); await p.screenshot({ path: `${a.out}_${s}.jpg`, type: 'jpeg', quality: 90 }); } await b.close(); return; }
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '24', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', a.out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < Math.round(+a.dur * 24); f++) { await draw(f / 24); const buf = await p.screenshot({ type: 'jpeg', quality: 93 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();
