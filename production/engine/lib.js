// Core helpers for the SVG frame renderer. Everything is a pure function of time so any frame can be rendered independently.
const SHOTS_REG = {};
const W = 1920, H = 1080, FPS = 24, BAR = 62;

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = {
  lin: t => t,
  inOut: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  in2: t => t * t,
  outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};
// progress of t through [a,b] with easing
const seg = (t, a, b, e = ease.inOut) => e(clamp((t - a) / (b - a)));
// keyframes: kf(t, [[t0, v0], [t1, v1, easing?] ...]) — values may be numbers or arrays
function kf(t, keys, e = ease.inOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e1] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      const p = (e1 || e)(clamp((t - t0) / (t1 - t0)));
      return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], p)) : lerp(v0, v1, p);
    }
  }
  return keys[keys.length - 1][1];
}
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function noise1(t, seed = 0) { const i = Math.floor(t), f = t - i; const a = rnd(i + seed * 97), b = rnd(i + 1 + seed * 97); return lerp(a, b, f * f * (3 - 2 * f)) * 2 - 1; }
const R = Math.PI / 180;
const f1 = n => (Math.round(n * 10) / 10);

// ---------- colour ----------
function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); }

// ---------- svg primitives ----------
const at = o => Object.entries(o || {}).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}="${v}"`).join(' ');
const rect = (x, y, w, h, fill, o = {}) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" ${at(o)}/>`;
const circ = (x, y, r, fill, o = {}) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(r, 0))}" fill="${fill}" ${at(o)}/>`;
const ell = (x, y, rx, ry, fill, o = {}) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(Math.max(rx, 0))}" ry="${f1(Math.max(ry, 0))}" fill="${fill}" ${at(o)}/>`;
const path = (d, fill, o = {}) => `<path d="${d}" fill="${fill}" ${at(o)}/>`;
const line = (x1, y1, x2, y2, stroke, w, o = {}) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${stroke}" stroke-width="${f1(w)}" stroke-linecap="round" ${at(o)}/>`;
const poly = (pts, fill, o = {}) => `<polygon points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="${fill}" ${at(o)}/>`;
const pline = (pts, stroke, w, o = {}) => `<polyline points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${at(o)}/>`;
const g = (inner, o = {}) => `<g ${at(o)}>${inner}</g>`;
const tr = (x, y, s = 1, r = 0) => `translate(${f1(x)} ${f1(y)})${r ? ` rotate(${f1(r)})` : ''}${s !== 1 ? ` scale(${Math.round(s * 1000) / 1000})` : ''}`;
const text = (x, y, str, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" ${at(o)}>${str}</text>`;

// ---------- per-frame defs (gradients, filters) ----------
let DEFS = new Map();
function resetDefs() { DEFS = new Map(); }
function def(id, svg) { if (!DEFS.has(id)) DEFS.set(id, svg); return id; }
const url = id => `url(#${id})`;
function lgrad(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  const id = 'lg' + hashStr(JSON.stringify([stops, x1, y1, x2, y2]));
  def(id, `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`);
  return url(id);
}
function rgrad(stops, cx = .5, cy = .5, r = .5) {
  const id = 'rg' + hashStr(JSON.stringify([stops, cx, cy, r]));
  def(id, `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`);
  return url(id);
}
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }

// filters
function fBlur(sd) {
  sd = Math.round(sd * 2) / 2; if (sd <= 0.4) return null;
  const id = 'bl' + String(sd).replace('.', '_');
  def(id, `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  return url(id);
}
// rim light: silhouette offset toward the light, flooded with rim colour, behind the source graphic
function fRim(dx, dy, color, blur = 0) {
  dx = Math.round(dx); dy = Math.round(dy);
  const id = 'rim' + hashStr([dx, dy, color, blur].join());
  def(id, `<filter id="${id}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
  <feOffset in="SourceAlpha" dx="${dx}" dy="${dy}" result="o"/>
  <feFlood flood-color="${color}"/><feComposite in2="o" operator="in" result="r"/>
  ${blur ? `<feGaussianBlur in="r" stdDeviation="${blur}" result="r"/>` : ''}
  <feMerge><feMergeNode in="r"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  return url(id);
}
// rim + depth blur in one pass
function fRimBlur(dx, dy, color, sd) {
  dx = Math.round(dx); dy = Math.round(dy); sd = Math.round(sd * 2) / 2;
  const id = 'rb' + hashStr([dx, dy, color, sd].join());
  def(id, `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
  <feOffset in="SourceAlpha" dx="${dx}" dy="${dy}" result="o"/>
  <feFlood flood-color="${color}"/><feComposite in2="o" operator="in" result="r"/>
  <feMerge result="m"><feMergeNode in="r"/><feMergeNode in="SourceGraphic"/></feMerge>
  <feGaussianBlur in="m" stdDeviation="${sd}"/></filter>`);
  return url(id);
}
// ghost look: ice-white edge + blue bloom; ghosts are lifted out of the future grade (class "gh")
function fGhost(sd) {
  sd = Math.round(sd);
  const id = 'gho' + sd;
  def(id, `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceAlpha" operator="dilate" radius="${Math.max(1.5, sd * .3).toFixed(1)}" result="d"/>
  <feFlood flood-color="#e6f6ff"/><feComposite in2="d" operator="in" result="edge"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="${sd * 1.6}" result="b"/><feFlood flood-color="#2f7bff" flood-opacity=".95"/><feComposite in2="b" operator="in" result="gl"/>
  <feMerge><feMergeNode in="gl"/><feMergeNode in="gl"/><feMergeNode in="edge"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  return url(id);
}
function fGlow(sd, color, strength = 1) {
  const id = 'gw' + hashStr([sd, color, strength].join());
  def(id, `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
  <feGaussianBlur in="SourceAlpha" stdDeviation="${sd}" result="b"/>
  <feFlood flood-color="${color}" flood-opacity="${strength}"/><feComposite in2="b" operator="in" result="gl"/>
  <feMerge><feMergeNode in="gl"/><feMergeNode in="gl"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  return url(id);
}
// future-vision grade: desaturate + push to deep navy (ghosts are re-drawn on top, ungraded — see futureWrap)
function fFuture(amount = 1, blur = 0) {
  const a = Math.round(amount * 20) / 20;
  const id = 'fut' + String(a).replace('.', '_') + '_' + blur;
  const L = [0.299, 0.587, 0.114];
  const rows = [0, 1, 2].map(i => { const tgt = [0.07, 0.17, 0.42][i]; return [0, 1, 2].map(j => (i === j ? 1 : 0) * (1 - a) + a * L[j] * tgt * 1.45); });
  const off = [0.008, 0.022, 0.06].map(v => v * a);
  const mat = rows.map((r, i) => `${r.map(v => v.toFixed(3)).join(' ')} 0 ${off[i].toFixed(3)}`).join(' ') + ' 0 0 0 1 0';
  const gam = (1 + .6 * a).toFixed(2);
  def(id, `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${mat}"/><feComponentTransfer><feFuncR type="gamma" exponent="${gam}"/><feFuncG type="gamma" exponent="${gam}"/><feFuncB type="gamma" exponent="${gam}" amplitude="1.05"/></feComponentTransfer>${blur ? `<feGaussianBlur stdDeviation="${blur}"/>` : ''}</filter>`);
  return url(id);
}

// ---------- camera ----------
// cam = {x, y, z, r} : world point (x,y) shown at frame centre, zoom z, roll r (deg). Layers with parallax p<1 move/zoom less.
function camT(cam, p = 1) {
  const z = 1 + (cam.z - 1) * p;
  const cx = cam.x * p + (W / 2) * (1 - p), cy = cam.y * p + (H / 2) * (1 - p);
  return `translate(${W / 2} ${H / 2}) rotate(${f1(cam.r || 0)}) scale(${z.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
}
function layer(cam, inner, { p = 1, blur = 0, op } = {}) {
  const fb = fBlur(blur);
  return `<g transform="${camT(cam, p)}"${fb ? ` filter="${fb}"` : ''}${op !== undefined ? ` opacity="${op}"` : ''}>${inner}</g>`;
}
function shake(t, amp, freq = 18, seed = 1) { return [noise1(t * freq, seed) * amp, noise1(t * freq, seed + 7) * amp]; }
// simple camera helper: push-in + drift over a shot
function camMove(lt, d, from, to, e = ease.sine) { const p = e(clamp(lt / d)); return { x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p), z: lerp(from.z, to.z, p), r: lerp(from.r || 0, to.r || 0, p) }; }
