// Render frames [start,end) of the film (or one shot) with headless Chromium and pipe JPEGs into ffmpeg.
// usage: node render.cjs --out seg.mp4 --start 0 --end 240 [--scale 1] | --stills "shotId:lt,shotId:lt" --dir out/
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1]]]) : a), []));
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb', '--disable-lcd-text'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: +(args.scale || 1) });
  page.setDefaultTimeout(300000);
  page.on('pageerror', e => { console.error('PAGEERR', e.message); });
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '../engine/index.html'));
  await page.evaluate(() => document.fonts.ready);
  if (args.stills) {
    const fs = require('fs'); fs.mkdirSync(args.dir, { recursive: true });
    for (const spec of args.stills.split(',')) {
      const [id, lt] = spec.split(':');
      const t = await page.evaluate(([id, lt]) => (id === 'T' ? (renderFrame(+lt), +lt) : renderShotAt(id, +lt)), [id, lt]);
      await page.screenshot({ path: path.join(args.dir, `${id}_${lt}.jpg`), type: 'jpeg', quality: 88 });
    }
    await browser.close(); return;
  }
  const start = +args.start, end = +args.end;
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '24', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', args.crf || '17', '-pix_fmt', 'yuv420p', args.out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = start; f < end; f++) {
    await page.evaluate(t => renderFrame(t), f / 24);
    let buf; for (let k = 0; ; k++) { try { buf = await page.screenshot({ type: 'jpeg', quality: 93, timeout: 300000 }); break; } catch (e) { if (k >= 3) throw e; console.error('retry frame', f, e.message); } }
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - start) % 240 === 0) console.error(`[${args.out}] frame ${f}/${end} ${((Date.now() - t0) / Math.max(1, f - start)).toFixed(0)}ms/f`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await browser.close();
})();
