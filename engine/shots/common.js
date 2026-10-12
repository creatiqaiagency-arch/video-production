// Shared helpers for shot files.
const BEATS = [];
const SPK = { eli: 'ELI', noah: 'NOA', teacher: 'TEA', announcer: 'ANN', student: 'STU' };
const LT = {
  warmL: { dx: -1, dy: -.35, color: PAL.rim }, warmR: { dx: 1, dy: -.35, color: PAL.rim },
  hotL: { dx: -1, dy: -.3, color: PAL.rimHot }, hotR: { dx: 1, dy: -.3, color: PAL.rimHot }, top: { dx: 0, dy: -1, color: PAL.rimHot },
  lampR: { dx: 1, dy: -.4, color: PAL.lamp }, lampL: { dx: -1, dy: -.4, color: PAL.lamp },
  coolL: { dx: -1, dy: -.3, color: PAL.rimCool }, coolR: { dx: 1, dy: -.3, color: PAL.rimCool },
  flood: { dx: -.7, dy: -.7, color: '#e6ecff' }, floodL: { dx: -1, dy: -.5, color: '#e6ecff' }, floodR: { dx: 1, dy: -.5, color: '#e6ecff' }, goldL: { dx: -1, dy: -.5, color: '#ffd79a' }, goldR: { dx: 1, dy: -.5, color: '#ffd79a' }, sepia: { dx: -1, dy: -.3, color: '#e8c89a' },
};
function actor(c, o) { const who = o.who; return character({ t: c.T, seed: (who || '').length * 1.3, talk: o.talk ?? (SPK[who] ? c.speak(SPK[who]) : 0), ...o }); }
const A = (c, o) => actor(c, o).svg;
// build a standard 3-layer spec
function scene(c, o) {
  const layers = [];
  if (o.back) layers.push({ svg: o.back, p: o.bp ?? .85, blur: o.bb ?? 3 });
  if (o.back2) layers.push({ svg: o.back2, p: o.bp2 ?? .95, blur: o.bb2 ?? 1 });
  if (o.mid) layers.push({ svg: [].concat(o.mid).join(''), p: 1, blur: o.mb || 0 });
  if (o.fg) layers.push({ svg: [].concat(o.fg).join(''), p: o.fp ?? 1.25, blur: o.fb ?? 14 });
  return { layers, cam: o.cam || { x: W / 2, y: H / 2, z: 1 }, overlay: o.overlay, grade: o.grade, shake: o.shake, flash: o.flash, fade: o.fade, vignette: o.vignette, letterbox: o.letterbox, grain: o.grain, bg: o.bgc };
}
// time-of-shot helpers
const at = (c, t0, t1) => seg(c.t, t0, t1);              // 0..1 progress between seconds
const atE = (c, t0, t1, e = 'inOut') => E[e](seg(c.t, t0, t1));
const lineOn = (c, id) => c.line(id).on;
function labelsIn(c, items) { return items.map(([x, y, str, t0, t1, o]) => label(x, y, str, { k: appear(c.t, t0, t1 ?? 1e9), ...(o || {}) })).join(''); }
// a clipped panel showing a sub-scene: inner content is in world coords; it's scaled about (cx,cy) to fit the panel
function panel(x, y, w, h, inner, o = {}) {
  const id = uid('pn'); const s = o.s || 1, cx = o.cx ?? W / 2, cy = o.cy ?? H / 2;
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx || 0}"/></clipPath>` + S.g({ 'clip-path': `url(#${id})` }, S.g({ transform: `translate(${x + w / 2},${y + h / 2}) scale(${s}) translate(${-cx},${-cy})` }, inner)) + (o.border ? S.rect(x, y, w, h, 'none', { stroke: o.border, 'stroke-width': 6, rx: o.rx || 0 }) : '');
}
function addBeat(b) { BEATS.push(b); return b; }
// overlay check/cross marks
const tick = (x, y, s = 1, col = PAL.green) => S.path(`M${x - 22 * s},${y} l${16 * s},${18 * s} l${32 * s},${-36 * s}`, 'none', { stroke: col, 'stroke-width': 10 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
const cross = (x, y, s = 1, col = PAL.red) => S.path(`M${x - 18 * s},${y - 18 * s} l${36 * s},${36 * s} M${x + 18 * s},${y - 18 * s} l${-36 * s},${36 * s}`, 'none', { stroke: col, 'stroke-width': 10 * s, 'stroke-linecap': 'round' });
// motion trail ghosts for fast actions
function ghosts(fn, n, dt, op = .25) { let s = ''; for (let i = n; i >= 1; i--) s += S.g({ opacity: op * (1 - i / (n + 1)) }, fn(-i * dt)); return s; }
// practice timeline bar (bottom-screen, screen space)
function practiceBar(k, labelTxt) {
  const x = 360, y = 930, w = 1200;
  return S.rect(x, y, w, 14, '#000', { opacity: .45, rx: 7 }) + S.rect(x, y, w * k, 14, PAL.gold, { rx: 7 }) + S.circle(x + w * k, y + 7, 14, PAL.cream) + label(x, y - 18, labelTxt, { size: 30, anchor: 'start', k: 1 });
}
