// Render a standalone demo shot (E.DEMO[name]) to mp4 for approval.
// usage: node demo.mjs corridor3d out.mp4 [--res 1]
import { createRequire } from 'module'; import path from 'path'; import fs from 'fs'; import { spawn } from 'child_process'; import { fileURLToPath } from 'url';
const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url)); const [name, out] = process.argv.slice(2); const res = +(process.argv[process.argv.indexOf('--res') + 1] || 1) || 1;
const build = path.resolve(here, '../build'); const tl = JSON.parse(fs.readFileSync(path.join(build, 'timeline.json'))); const env = {};
const shotFiles = fs.readdirSync(path.join(here, 'shots')).filter((f) => f.endsWith('.js')).sort().map((f) => 'shots/' + f);
const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
if (res !== 1) await page.addInitScript((r) => { window.RENDER_SCALE = r; }, res);
await page.goto('file://' + path.join(here, 'index.html')); await page.waitForFunction(() => window.ENGINE_FILES_LOADED);
await page.evaluate(([a, b, c]) => window.boot(a, b, c), [tl, env, shotFiles]);
const dur = await page.evaluate((n) => E.DEMO[n].dur, name);
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '24', '-c:v', 'mjpeg', '-i', '-', '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', path.resolve(out)], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < dur * 24; i++) {
  const b64 = await page.evaluate(([n, t]) => { const cv = document.getElementById('c'), ctx = cv.getContext('2d'), S = E.S; ctx.setTransform(S, 0, 0, S, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1920, 1080);
    ctx.save(); E.DEMO[n].draw(ctx, t); ctx.restore(); ctx.setTransform(S, 0, 0, S, 0, 0); E.post(ctx, t, {}); return window.grab(0.93); }, [name, i / 24]);
  if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
}
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await browser.close(); console.log('demo ->', out);
