// Render frames of the film in headless Chromium and pipe them into ffmpeg.
// usage: node render.mjs --out file.mp4 [--from 0] [--to end] [--fps 24] [--workers 3] [--scale 1]
//        node render.mjs --stills "1.0,5.5,..." --outdir dir [--label]
//        node render.mjs --shotlist out.json
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const here = path.dirname(new URL(import.meta.url).pathname);
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
const build = path.resolve(here, '../build');
const tl = JSON.parse(fs.readFileSync(path.join(build, 'timeline.json')));
const env = fs.existsSync(path.join(build, 'envelopes.json')) ? JSON.parse(fs.readFileSync(path.join(build, 'envelopes.json'))) : {};
const shotFiles = fs.readdirSync(path.join(here, 'shots')).filter(f => f.endsWith('.js')).sort().map(f => 'shots/' + f);

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  await page.goto('file://' + path.join(here, 'index.html'));
  await page.waitForFunction(() => window.ENGINE_FILES_LOADED);
  const shots = await page.evaluate(([a, b, c]) => window.boot(a, b, c), [tl, env, shotFiles]);
  if (args.label) await page.evaluate(() => { window.DEBUG_LABEL = true; });
  return { page, shots };
}
const browser = await chromium.launch({ args: ['--disable-web-security', '--allow-file-access-from-files', '--enable-unsafe-swiftshader'] });
const fps = +(args.fps || 24);

if (args.shotlist) {
  const { shots } = await openPage(browser);
  fs.writeFileSync(args.shotlist, JSON.stringify(shots, null, 1));
  console.log('shots', shots.length);
} else if (args.stills) {
  const { page } = await openPage(browser);
  fs.mkdirSync(args.outdir, { recursive: true });
  const ts = String(args.stills).split(',').map(Number);
  for (const t of ts) {
    await page.evaluate(t => window.renderFrame(t), t);
    const b64 = await page.evaluate(() => window.grab(0.9));
    fs.writeFileSync(path.join(args.outdir, `t${t.toFixed(2).padStart(7, '0')}.jpg`), Buffer.from(b64, 'base64'));
  }
  console.log('stills', ts.length);
} else {
  const t0 = +(args.from || 0), t1 = +(args.to || tl.total);
  const workers = +(args.workers || 3);
  const nTotal = Math.round((t1 - t0) * fps);
  const per = Math.ceil(nTotal / workers);
  const tmp = args.out + '.parts'; fs.mkdirSync(tmp, { recursive: true });
  const started = Date.now();
  let done = 0;
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const a = w * per, b = Math.min(nTotal, (w + 1) * per); if (a >= b) return;
    const { page } = await openPage(browser);
    const scale = args.scale ? `scale=${Math.round(1920 * args.scale)}:-2,` : '';
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-vf', scale + 'format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(args.crf || 18), path.join(tmp, `part${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = a; i < b; i++) {
      const t = t0 + i / fps;
      await page.evaluate(t => window.renderFrame(t), t);
      const b64 = await page.evaluate(() => window.grab(0.93));
      if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      done++;
      if (done % 240 === 0) { const el = (Date.now() - started) / 1000; console.log(`${done}/${nTotal} frames  ${(done / el).toFixed(1)} fps  eta ${((nTotal - done) / (done / el) / 60).toFixed(1)} min`); }
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    await page.close();
  }));
  const list = Array.from({ length: workers }, (_, w) => path.join(tmp, `part${w}.mp4`)).filter(f => fs.existsSync(f));
  fs.writeFileSync(path.join(tmp, 'list.txt'), list.map(f => `file '${f}'`).join('\n'));
  await new Promise(r => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', args.out], { stdio: 'inherit' }).on('close', r));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`rendered ${nTotal} frames in ${((Date.now() - started) / 1000).toFixed(0)}s -> ${args.out}`);
}
await browser.close();
