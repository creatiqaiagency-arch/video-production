// Core helpers: math, easing, colour, SVG string builders, deterministic noise.
// Loaded in the browser (render.html) as a classic script; everything hangs off globals.

const W = 1920, H = 1080;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const TAU = Math.PI * 2;
const rad = d => d * Math.PI / 180;

const E = {
  lin: t => t,
  in: t => t * t * t,
  out: t => 1 - Math.pow(1 - t, 3),
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: t => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1,
  step: t => t < 1 ? 0 : 1,
};

// ease between a and b while t moves from t0 to t1
function tween(t, t0, t1, a, b, fn = E.inOut) { return lerp(a, b, fn(seg(t, t0, t1))); }

// keyframes: [[time, value, easeName?], ...]; value may be number or array of numbers
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1, en] = keys[i + 1];
    if (t <= t1) {
      const f = (E[en || 'inOut'])(seg(t, t0, t1));
      if (Array.isArray(v0)) return v0.map((x, j) => lerp(x, v1[j], f));
      if (typeof v0 === 'object') { const o = {}; for (const k in v0) o[k] = typeof v0[k] === 'number' ? lerp(v0[k], v1[k], f) : (f < .5 ? v0[k] : v1[k]); return o; }
      return lerp(v0, v1, f);
    }
  }
  return keys[keys.length - 1][1];
}

// deterministic RNG
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }

// colour
function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgb2hex(r, g, b) { return '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
function mixc(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); }
function shade(c, k) { const A = hex2rgb(c); return rgb2hex(A[0] * k, A[1] * k, A[2] * k); }

// palette (mirrors rag/ifverse-style/02_palette.json)
const PAL = {
  skin: '#0b0709', rim: '#f3b483', rimHot: '#ffd6a6', rimCool: '#86c9ff', eye: '#fff6ec',
  eli: '#d7383a', eliS: '#8f1f27', string: '#f4ece6',
  noah: '#8cc7f0', noahS: '#4f86b3', cap: '#f2c230', capS: '#b8901b',
  teacher: '#8a7d72', teacherS: '#5d534b', ann: '#2f3b63', annS: '#1f2745', stu: '#5fd16a', stuS: '#3c9146', stuTee: '#3b3a40',
  sd: '#1e101b', s: '#25151e', md: '#3a2229', m: '#5a3a55', ml: '#694a53', haze: '#b48e86',
  skyT: '#3b2a54', skyM: '#8a5f8a', skyH: '#e8a37a', sun: '#ffe2b0',
  win: '#f2a65a', winHot: '#ffcf8a', lamp: '#ffe0a8',
  nDeep: '#0d0b19', nBase: '#14112a', nMid: '#2a2a55', nLight: '#4e4870', screen: '#9a7cff',
  fieldD: '#1f5a3a', field: '#2f7d4f', line: '#d9f0dd', flood: '#f4f6ff', crowd: '#3a3352',
  cream: '#fff3df', gold: '#ffd27a', glow: '#ff9e4a', red: '#ff4a4a', green: '#5fe07a', panel: '#15121c',
  wood: '#5b3a2e', woodL: '#7a5040', woodD: '#3a241d', metal: '#6d6a78', metalL: '#a9a6b5',
};

// SVG builders ---------------------------------------------------------------
let __uid = 0;
function uid(p = 'u') { return p + (++__uid); }
function resetUid() { __uid = 0; }
function attrs(o) { let s = ''; for (const k in o) { if (o[k] === undefined || o[k] === null || o[k] === false) continue; s += ` ${k}="${typeof o[k] === 'number' ? +o[k].toFixed(2) : o[k]}"`; } return s; }
const S = {
  g: (o, ...kids) => `<g${attrs(o || {})}>${kids.flat().join('')}</g>`,
  rect: (x, y, w, h, fill, o = {}) => `<rect${attrs({ x, y, width: Math.max(0, w), height: Math.max(0, h), fill, ...o })}/>`,
  circle: (cx, cy, r, fill, o = {}) => `<circle${attrs({ cx, cy, r: Math.max(0, r), fill, ...o })}/>`,
  ellipse: (cx, cy, rx, ry, fill, o = {}) => `<ellipse${attrs({ cx, cy, rx: Math.max(0, rx), ry: Math.max(0, ry), fill, ...o })}/>`,
  path: (d, fill, o = {}) => `<path${attrs({ d, fill, ...o })}/>`,
  line: (x1, y1, x2, y2, stroke, w, o = {}) => `<line${attrs({ x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round', ...o })}/>`,
  poly: (pts, fill, o = {}) => `<polygon${attrs({ points: pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '), fill, ...o })}/>`,
  pl: (pts, stroke, w, o = {}) => `<polyline${attrs({ points: pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '), fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...o })}/>`,
  text: (x, y, str, o = {}) => `<text${attrs({ x, y, ...o })}>${str}</text>`,
  tr: (x, y, s = 1, r = 0) => `translate(${x.toFixed(2)},${y.toFixed(2)})${r ? ` rotate(${r.toFixed(2)})` : ''}${s !== 1 ? ` scale(${(+s).toFixed(4)})` : ''}`,
};

// gradients are emitted inline (defs inside the frame); returns {def, url}
function linGrad(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  const id = uid('lg');
  const def = `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  return { def, url: `url(#${id})` };
}
function radGrad(stops, cx = .5, cy = .5, r = .5) {
  const id = uid('rg');
  const def = `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
  return { def, url: `url(#${id})` };
}
// soft glow blob (bloom stand-in)
function glow(x, y, r, color, op = .6, sx = 1) {
  const g = radGrad([[0, color, op], [.35, color, op * .45], [1, color, 0]]);
  return `<defs>${g.def}</defs>` + S.ellipse(x, y, r * sx, r, g.url);
}
// light shaft polygon with fade
function shaft(pts, color, op = .25) {
  const p0 = pts[0], p3 = pts[pts.length - 1];
  const g = linGrad([[0, color, op], [1, color, 0]], 0, 0, 0, 1);
  return `<defs>${g.def}</defs>` + S.poly(pts, g.url, { style: 'mix-blend-mode:screen' });
}
