// Effects, overlays and typography.
const CREAM = '#ffe9c2';

// whole-frame blue future grade wrapper + frame border and "+5 s" tag
function futureWrap(inner, amt = 1, o = {}) {
  let s = `<g filter="${fFuture(amt)}">${inner}</g>`;
  if (amt > .05) {
    s += rect(0, 0, W, H, rgrad([[0, '#2f7bff', 0], [.7, '#2f7bff', .08 * amt], [1, '#1a4bb0', .35 * amt]]), { style: SCREEN });
    // scanline shimmer
    const sl = Math.floor(((o.t || 0) * 140) % H);
    s += rect(0, sl, W, 3, '#bfe6ff', { opacity: .12 * amt }) + rect(0, (sl + 377) % H, W, 2, '#bfe6ff', { opacity: .08 * amt });
    if (o.border !== false) {
      s += rect(26, BAR + 18, W - 52, H - 2 * BAR - 36, 'none', { stroke: '#8fd3ff', 'stroke-width': 3, rx: 18, opacity: .75 * amt, filter: fGlow(6, '#2f7bff', 1) });
      s += g(rect(52, BAR + 40, 132, 46, '#0d2a5c', { rx: 10, opacity: .8 }) + text(118, BAR + 73, '+5 s', { 'font-size': 30, 'font-weight': 800, fill: '#d8f0ff', 'text-anchor': 'middle', 'letter-spacing': 2 }), { opacity: amt });
    }
  }
  return s;
}
// thin blue ring sweeping across an eye / the frame (activation)
function ringFx(x, y, p, rMax = 900, c = '#8fd3ff') {
  if (p <= 0 || p >= 1) return '';
  const r = 20 + ease.out(p) * rMax, a = 1 - p;
  return circ(x, y, r, 'none', { stroke: c, 'stroke-width': 6 + 18 * a, opacity: a, filter: fGlow(8, '#2f7bff', 1) }) + circ(x, y, r * .7, 'none', { stroke: '#fff', 'stroke-width': 2, opacity: a * .6 });
}
function flash(p, c = '#dff2ff') { return p > 0 ? rect(0, 0, W, H, c, { opacity: clamp(p) }) : ''; }
// glass-shard break transition: shards fly out showing what's underneath (p 0..1). content = the image to break.
function shards(content, p, seed = 7) {
  if (p <= 0) return content;
  let out = '';
  const cols = 6, rows = 4, cw = W / cols, rh = H / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    for (let k = 0; k < 2; k++) {
      const x0 = i * cw, y0 = j * rh, jit = (a, b) => [a + (rnd(seed + i * 13 + j * 7 + a) - .5) * 30, b + (rnd(seed + i * 5 + j * 11 + b) - .5) * 30];
      const pts = k ? [jit(x0, y0), jit(x0 + cw, y0), jit(x0 + cw, y0 + rh)] : [jit(x0, y0), jit(x0 + cw, y0 + rh), jit(x0, y0 + rh)];
      const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
      const dx = (cx - W / 2) / W, dy = (cy - H / 2) / H, d = ease.in(clamp(p * (1.1 + rnd(i * 3 + j + k) * .5)));
      const id = 'sh' + seed + '_' + i + '_' + j + '_' + k;
      def(id, `<clipPath id="${id}"><polygon points="${pts.map(q => q.join(',')).join(' ')}"/></clipPath>`);
      const tx = dx * 1400 * d, ty = dy * 1000 * d + 300 * d * d, rot = (rnd(i + j * 3 + k) - .5) * 160 * d, sc = 1 - .3 * d;
      out += `<g transform="translate(${f1(cx + tx)} ${f1(cy + ty)}) rotate(${f1(rot)}) scale(${sc.toFixed(3)}) translate(${f1(-cx)} ${f1(-cy)})" opacity="${(1 - d).toFixed(3)}"><g clip-path="url(#${id})">${content}</g><polygon points="${pts.map(q => q.join(',')).join(' ')}" fill="none" stroke="#d8f0ff" stroke-width="3" opacity=".8"/></g>`;
    }
  }
  return out;
}
// speed streaks behind a moving object (dir in radians)
function streaks(x, y, len, w, dir, c = '#fff', a = .5, n = 5, seed = 1) {
  let s = '';
  for (let i = 0; i < n; i++) { const off = (rnd(seed + i) - .5) * w * 2, L = len * (.5 + rnd(seed + i * 3) * .5); const nx = -Math.sin(dir), ny = Math.cos(dir); s += line(x + nx * off, y + ny * off, x + nx * off - Math.cos(dir) * L, y + ny * off - Math.sin(dir) * L, c, 2 + rnd(i) * 3, { opacity: a * (.4 + rnd(i * 7) * .6) }); }
  return s;
}
function dashedPath(pts, c = '#8fd3ff', w = 5, p = 1, o = {}) {
  const n = Math.max(2, Math.floor(pts.length * p));
  return pline(pts.slice(0, n), c, w, { 'stroke-dasharray': `${w * 3} ${w * 2.4}`, opacity: o.op ?? .9, filter: fGlow(4, '#2f7bff', .8) });
}
function parabola(x0, y0, x1, y1, hgt, n = 40) { const pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([lerp(x0, x1, u), lerp(y0, y1, u) - 4 * hgt * u * (1 - u)]); } return pts; }
const pOn = (pts, u) => { const i = clamp(u) * (pts.length - 1), a = Math.floor(i), b = Math.min(pts.length - 1, a + 1); return [lerp(pts[a][0], pts[b][0], i - a), lerp(pts[a][1], pts[b][1], i - a)]; };

// ---------- typography ----------
function titleCard(p, l1, l2, sub) {
  const a = clamp(p * 3) * clamp((1 - p) * 4 + .001), y = 470 - (1 - ease.out(clamp(p * 2.5))) * 30;
  return g(
    text(960, y - 70, l1, { 'font-size': 62, 'font-weight': 800, fill: CREAM, 'text-anchor': 'middle', 'letter-spacing': 4, filter: fGlow(10, '#ff9a3c', .9) }) +
    text(960, y + 40, l2, { 'font-size': 104, 'font-weight': 900, fill: CREAM, 'text-anchor': 'middle', 'letter-spacing': 3, filter: fGlow(16, '#ff9a3c', 1) }) +
    rect(660, y + 80, 600, 3, CREAM, { opacity: .7 }) +
    text(960, y + 122, sub, { 'font-size': 26, 'font-weight': 600, fill: CREAM, 'text-anchor': 'middle', 'letter-spacing': 10, opacity: .9 }), { opacity: a.toFixed(3) });
}
function caption(p, str, y = 540, size = 64) { const a = clamp(p * 4) * clamp((1 - p) * 4); return text(960, y, str, { 'font-size': size, 'font-weight': 800, fill: CREAM, 'text-anchor': 'middle', 'letter-spacing': 14, opacity: a.toFixed(3), filter: fGlow(12, '#ff9a3c', .8) }); }
function label(x, y, str, a = 1, size = 34) { return g(text(x, y, str, { 'font-size': size, 'font-weight': 700, fill: CREAM, 'letter-spacing': 2, filter: fGlow(6, '#ff9a3c', .6) }), { opacity: a }); }
function clockIcon(x, y, r, p = 0, c = CREAM) { return circ(x, y, r, 'none', { stroke: c, 'stroke-width': r * .14 }) + line(x, y, x, y - r * .62, c, r * .12) + line(x, y, x + Math.sin(p * 2 * Math.PI) * r * .5, y - Math.cos(p * 2 * Math.PI) * r * .5, c, r * .1); }
// countdown HUD, value in seconds
function countdown(v, a = 1, x = 1660, y = 150, warn = false) {
  const c = warn || v < 2 ? '#ff8a7a' : '#d8f0ff';
  return g(rect(x - 60, y - 52, 260, 92, '#06142e', { rx: 16, opacity: .75 }) + clockIcon(x - 8, y - 6, 26, (5 - v) / 5, c) + text(x + 112, y + 12, `${Math.max(0, v).toFixed(1)} s`, { 'font-size': 46, 'font-weight': 800, fill: c, 'text-anchor': 'middle', filter: fGlow(8, '#2f7bff', .9) }), { opacity: a });
}

// ---------- finishing ----------
function vignette(str = .55) { return rect(0, 0, W, H, rgrad([[0, '#000', 0], [.62, '#000', 0], [1, '#000', str]], .5, .5, .75)); }
function letterbox() { return rect(0, 0, W, BAR, '#000') + rect(0, H - BAR, W, BAR, '#000'); }
function fadeBlack(a) { return a > 0 ? rect(0, 0, W, H, '#000', { opacity: clamp(a).toFixed(3) }) : ''; }
