#!/usr/bin/env node
// Frame renderer: loads render.html in headless Chromium, steps time deterministically, pipes JPEG frames to ffmpeg.
// Usage:
//   node render.js --shots shots/learn10x.js --vo ../production/learn-10x/vo/vo_data.json --stills 1.5,10,22 --outdir /tmp/x
//   node render.js --shots shots/learn10x.js --vo ... --video out.mp4 [--res 1280x720] [--workers 4] [--fps 24] [--from 0 --to 30]
//   node render.js ... --timeline out.json        (dump timeline only)
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');

const args = {}; process.argv.slice(2).forEach((a, i, arr) => { if (a.startsWith('--')) args[a.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true; });
const FPS = +(args.fps || 24);
const [RW, RH] = (args.res || '1920x1080').split('x').map(Number);
const shotsFile = args.shots || 'shots/learn10x.js';
const vo = args.vo ? JSON.parse(fs.readFileSync(args.vo, 'utf8')) : { dur: {}, spk: {}, env: {} };
const EXE = process.env.CHROMIUM || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: RW, height: RH }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  const tags = shotsFile.split(',').map(f => `<script src="${f}"></script>`).join('\n');
  const html = fs.readFileSync(path.join(__dirname, 'render.html'), 'utf8').replace('<script src="SHOTS_FILE"></script>', tags);
  const tmp = path.join(__dirname, `.render_${process.pid}_${Math.random().toString(36).slice(2)}.html`);
  fs.writeFileSync(tmp, html);
  await page.addInitScript(v => { window.VO = v; }, vo);
  await page.goto('file://' + tmp);
  const total = await page.evaluate(() => window.ready);
  fs.unlinkSync(tmp);
  return { page, total };
}

async function main() {
  const browser = await chromium.launch({ executablePath: EXE, args: ['--disable-gpu', '--force-color-profile=srgb', '--disable-lcd-text'] });
  const { page, total } = await openPage(browser);
  console.error(`timeline total ${total.toFixed(2)}s`);
  if (!Object.keys(vo.dur || {}).length) throw new Error('VO durations missing: refusing to build a placeholder-timed video (pass --vo vo_data.json)');
  const nDefault = await page.evaluate(() => TL.lines.filter(l => !(window.VO && window.VO.dur && window.VO.dur[l.id])).length);
  if (nDefault) throw new Error(`${nDefault} VO lines have no real duration — timeline would use placeholders`);
  if (args.timeline) {
    const tl = await page.evaluate(() => ({ total: TL.total, lines: TL.lines, sfx: TL.sfx, music: TL.music, beats: TL.beats.map(b => ({ id: b.id, start: b.start, end: b.end })), shots: TL.shots.map(s => ({ id: s.id, beat: s.beat, start: s.start, end: s.end, dur: s.dur, hold: s.hold, type: s.type, desc: s.def.desc || '' })) }));
    fs.mkdirSync(path.dirname(path.resolve(args.timeline)), { recursive: true }); fs.writeFileSync(args.timeline, JSON.stringify(tl, null, 1));
    console.error('timeline written', args.timeline);
  }
  if (args.stills) {
    fs.mkdirSync(args.outdir || '.', { recursive: true });
    const ts = args.stills === 'shots' ? await page.evaluate(() => TL.shots.map(s => +(s.start + s.dur * .55).toFixed(3))) : String(args.stills).split(',').map(Number);
    for (const t of ts) {
      await page.evaluate(T => window.renderAt(T), t);
      const id = await page.evaluate(T => findShot(TL, T).id, t);
      const f = path.join(args.outdir || '.', `${id}_${t.toFixed(2).padStart(7, '0')}.jpg`);
      await page.screenshot({ path: f, type: 'jpeg', quality: 88 });
      console.log(f);
    }
  }
  if (args.video) {
    const from = +(args.from || 0), to = Math.min(+(args.to || total), total);
    const nWorkers = +(args.workers || 3);
    const nFrames = Math.ceil((to - from) * FPS);
    const per = Math.ceil(nFrames / nWorkers);
    const segs = [];
    const t0 = Date.now();
    await Promise.all(Array.from({ length: nWorkers }, async (_, w) => {
      const f0 = w * per, f1 = Math.min(nFrames, f0 + per);
      if (f0 >= f1) return;
      const p = w === 0 ? page : (await openPage(browser)).page;
      const seg = `${args.video}.seg${w}.mp4`; segs[w] = seg;
      const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(args.crf || 18), '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
      await p.evaluate(fps => { DYN.dt = 1 / fps; }, FPS);
      for (let f = Math.max(0, f0 - 24); f < f0; f++) await p.evaluate(T => window.renderAt(T), from + f / FPS); // warm up the springs across chunk seams
      for (let f = f0; f < f1; f++) {
        const T = from + f / FPS;
        await p.evaluate(T => window.renderAt(T), T);
        const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        if (w === 0 && f % 48 === 0) console.error(`w0 frame ${f}/${f1} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      }
      ff.stdin.end();
      await new Promise(r => ff.on('close', r));
    }));
    const list = `${args.video}.txt`;
    fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${path.resolve(s)}'`).join('\n'));
    await new Promise(r => spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', args.video], { stdio: 'inherit' }).on('close', r));
    segs.filter(Boolean).forEach(s => fs.unlinkSync(s)); fs.unlinkSync(list);
    console.error(`video done ${args.video} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
