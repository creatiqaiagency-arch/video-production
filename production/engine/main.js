// Frame assembly: find the shot for time t, render it, add finishing layers.
const SHOTS = SHOTS_REG;
const root = document.getElementById('root');
function talkOf(speaker, gt) {
  for (const v of TL.vo) if (v.speaker === speaker && gt >= v.t0 && gt < v.t1) { const e = VOI[v.clip].env; const i = Math.floor((gt - v.t0) * 24); return e[Math.min(i, e.length - 1)] || 0; }
  return 0;
}
function shotTimes(id) { const s = TL.shots.find(x => x.id === id); return [s.f0 / 24, s.f1 / 24]; }
// climax clock: real-world seconds left before the truck reaches the crossing (keeps running in the present)
function clockVal(gt) {
  const a = shotTimes('s076')[0], b = shotTimes('s099')[0];
  return clamp(5 * (1 - (gt - a) / (b - a)), 0, 5);
}
function shotAt(t) {
  const f = Math.round(t * 24); const S = TL.shots;
  let lo = 0, hi = S.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (S[m].f0 <= f) lo = m; else hi = m - 1; }
  return S[lo];
}
function placeholder(sh, lt) { return rect(0, 0, W, H, '#20182a') + text(960, 540, `${sh.id} · ${sh.fn}`, { 'font-size': 60, fill: '#fff', 'text-anchor': 'middle' }) + text(960, 610, lt.toFixed(2), { 'font-size': 30, fill: '#aaa', 'text-anchor': 'middle' }); }
function renderFrame(t) {
  resetDefs();
  const sh = shotAt(t);
  const lt = t - sh.f0 / 24, d = (sh.f1 - sh.f0) / 24;
  let body;
  const fn = SHOTS[sh.fn];
  try { body = fn ? fn(lt, d, t, sh) : placeholder(sh, lt); }
  catch (e) { body = placeholder(sh, lt) + text(960, 700, String(e.message).replace(/[<>&]/g, ''), { 'font-size': 26, fill: '#f88', 'text-anchor': 'middle' }); console.error(sh.fn, e.stack); }
  const push = 1 + .035 * ease.sine(clamp(lt / d));  // every shot gets a little camera life
  const fin = vignette(.5) + letterbox() + fadeBlack(1 - clamp(t / 0.12));
  root.innerHTML = `<defs>${[...DEFS.values()].join('')}</defs><g transform="translate(960 540) scale(${push.toFixed(4)}) translate(-960 -540)">${body}</g>${fin}`;
  return sh.id;
}
function renderShotAt(id, lt) { const sh = TL.shots.find(s => s.id === id); const t = sh.f0 / 24 + Math.min(+lt, (sh.f1 - sh.f0) / 24 - 1 / 24); renderFrame(t); return t; }
