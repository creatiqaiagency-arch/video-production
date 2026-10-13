// Environment building blocks. All drawn in world coordinates (1920x1080 = the "normal" framing) and placed through camera layers.
const SCREEN = 'mix-blend-mode:screen';
const glow = (x, y, r, c, a = .6) => circ(x, y, r, rgrad([[0, c, a], [.35, c, a * .45], [1, c, 0]]), { style: SCREEN });
const glowE = (x, y, rx, ry, c, a = .5) => ell(x, y, rx, ry, rgrad([[0, c, a], [.5, c, a * .35], [1, c, 0]]), { style: SCREEN });

// ---------- skies ----------
const SKY = {
  dusk: [[0, '#241a44'], [.35, '#4f3566'], [.62, '#9a5a6c'], [.82, '#e0946a'], [1, '#f4c58a']],
  night: [[0, '#0b0a1c'], [.5, '#17142f'], [.8, '#2e2448'], [1, '#4a3558']],
  morning: [[0, '#7fa7d6'], [.55, '#cfe3f2'], [1, '#fff3d6']],
  afternoon: [[0, '#5b6fa8'], [.6, '#c79a8c'], [1, '#f2c08e']],
  day: [[0, '#6f9fd0'], [.6, '#b9d3e8'], [1, '#f3e2c0']],
};
function sky(kind, x = -2000, y = -800, w = 6000, h = 1700) { return rect(x, y, w, h, lgrad(SKY[kind])); }
function clouds(y, n, seed, c = '#e9a982', a = .55, spread = 2600, x0 = -400) {
  let s = '';
  for (let i = 0; i < n; i++) { const x = x0 + rnd(seed + i) * spread, w = 180 + rnd(seed + i * 3) * 420, yy = y + rnd(seed + i * 7) * 120; s += ell(x, yy, w, 7 + rnd(i + seed) * 6, c, { opacity: a * (.5 + rnd(i * 5 + seed) * .5) }); }
  return s;
}
function stars(n, seed, x0 = -800, y0 = -600, w = 3600, h = 900) { let s = ''; for (let i = 0; i < n; i++) s += circ(x0 + rnd(seed + i) * w, y0 + rnd(seed + i * 2.3) * h, .8 + rnd(i * 9) * 1.4, '#fff', { opacity: .2 + rnd(i * 4 + seed) * .5 }); return s; }
function sun(x, y, r, c1 = '#fff1c9', c2 = '#ffb46a') { return glow(x, y, r * 6, c2, .5) + circ(x, y, r, c1) + glow(x, y, r * 2.2, '#fff', .5); }
function moon(x, y, r) { return glow(x, y, r * 5, '#9fb6ff', .25) + circ(x, y, r, '#e8ecff'); }
function rays(x, y, n, len, c, a, rot = 0, spread = 360) {
  let s = '';
  for (let i = 0; i < n; i++) { const an = (rot + i * spread / n) * R, w = 0.035 + rnd(i) * .03; s += poly([[x, y], [x + Math.cos(an - w) * len, y + Math.sin(an - w) * len], [x + Math.cos(an + w) * len, y + Math.sin(an + w) * len]], c, { opacity: a * (.5 + rnd(i * 3) * .5), style: SCREEN }); }
  return s;
}
function motes(t, n, seed, box, c = '#ffe2b0', a = .5) {
  const [x0, y0, w, h] = box; let s = '';
  for (let i = 0; i < n; i++) { const x = x0 + ((rnd(seed + i) * w + t * (8 + rnd(i) * 14)) % w), y = y0 + ((rnd(seed + i * 2) * h + Math.sin(t * .7 + i) * 18 - t * 5) % h + h) % h; s += circ(x, y, 1 + rnd(i * 7) * 2.2, c, { opacity: a * (.3 + .7 * Math.abs(Math.sin(t * .8 + i))) }); }
  return s;
}

// ---------- architecture ----------
function windowLit(x, y, w, h, lit = 1, c = '#f2b866', frame = '#2a1a22') {
  let s = rect(x, y, w, h, frame);
  s += rect(x + 4, y + 4, w - 8, h - 8, lit ? lgrad([[0, mix(c, '#fff2d0', .35)], [1, c]]) : '#1b1426');
  if (w > 50) s += rect(x + w / 2 - 2, y + 4, 4, h - 8, frame);
  if (h > 60) s += rect(x + 4, y + h * .45, w - 8, 4, frame);
  return s;
}
function building(x, yBase, w, h, wall, o = {}) {
  let s = rect(x, yBase - h, w, h, wall);
  if (o.roof) s += rect(x - 6, yBase - h - 10, w + 12, 12, o.roof);
  const cols = o.cols || Math.max(2, Math.floor(w / 90)), rows = o.rows || Math.max(2, Math.floor((h - 60) / 110));
  const ww = o.ww || 46, wh = o.wh || 62, gx = (w - cols * ww) / (cols + 1), gy = (h - (o.ground || 0) - rows * wh) / (rows + 1);
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const lit = rnd((o.seed || 1) * 31 + i * 7 + j * 13) < (o.litP ?? .45);
    const wx = x + gx + i * (ww + gx), wy = yBase - h + gy + j * (wh + gy);
    s += windowLit(wx, wy, ww, wh, lit, o.winC || '#f2b866', o.frame || mix(wall, '#000', .4));
    if (lit && o.glowWin) s += glow(wx + ww / 2, wy + wh / 2, ww * 1.1, '#ffb45c', .25);
  }
  return s;
}
function skyline(yBase, seed, c = '#2a2140', n = 26, x0 = -1200, span = 4400, hMax = 380, lit = '#f0b060') {
  let s = '';
  for (let i = 0; i < n; i++) {
    const w = 80 + rnd(seed + i) * 140, x = x0 + i * span / n, h = 120 + rnd(seed + i * 5) * hMax;
    s += rect(x, yBase - h, w, h, c);
    for (let k = 0; k < 6; k++) if (rnd(seed + i * 11 + k) < .5) s += rect(x + 8 + rnd(i * 3 + k) * (w - 20), yBase - h + 14 + rnd(i * 5 + k * 2) * (h - 40), 5, 7, lit, { opacity: .7 });
  }
  return s;
}
function lamp(x, yBase, h, t = 0, on = true, c = '#ffc477') {
  let s = rect(x - 5, yBase - h, 10, h, '#120c16') + path(`M${x} ${yBase - h} q0 -30 40 -30 h18`, 'none', { stroke: '#120c16', 'stroke-width': 9 });
  s += rect(x + 40, yBase - h - 36, 34, 12, '#1d1420', { rx: 4 });
  if (on) { s += rect(x + 44, yBase - h - 25, 26, 6, '#fff3d6', { rx: 3 }) + glow(x + 57, yBase - h - 20, 120, c, .55) + poly([[x + 44, yBase - h - 22], [x + 70, yBase - h - 22], [x + 190, yBase], [x - 76, yBase]], lgrad([[0, c, .28], [1, c, 0]]), { style: SCREEN }) + glowE(x + 57, yBase + 4, 170, 30, c, .5); }
  return s;
}
function tree(x, yBase, s, c = '#140d18', seed = 1) {
  let o = rect(x - s * .06, yBase - s * 1.1, s * .12, s * 1.1, c);
  for (let i = 0; i < 9; i++) { const a = rnd(seed + i) * Math.PI * 2, d = rnd(seed + i * 3) * s * .45; o += circ(x + Math.cos(a) * d, yBase - s * 1.45 + Math.sin(a) * d * .7, s * (.28 + rnd(seed + i * 5) * .18), c); }
  return o;
}
function bushes(x0, x1, yBase, s, c = '#160e1a', seed = 3) { let o = ''; for (let x = x0, i = 0; x < x1; x += s * .7, i++) o += circ(x, yBase - s * .3, s * (.45 + rnd(seed + i) * .25), c); return o + rect(x0 - s * .4, yBase - s * .35, x1 - x0 + s * .8, s * .35, c); }
function fence(x0, x1, yBase, h, c = '#120c16') { let s = rect(x0, yBase - h, x1 - x0, 5, c) + rect(x0, yBase - h * .45, x1 - x0, 4, c); for (let x = x0; x < x1; x += 22) s += rect(x, yBase - h - 6, 4, h + 6, c); return s; }
function awning(x, y, w, h, n = 10, c1 = '#a83a3d', c2 = '#e8d9cf') {
  let s = '';
  const sw = w / n;
  for (let i = 0; i < n; i++) { const c = i % 2 ? c2 : c1; s += poly([[x + i * sw, y], [x + (i + 1) * sw, y], [x + (i + 1) * sw + 6, y + h], [x + i * sw + 6, y + h]], c); s += path(`M${x + i * sw + 6} ${y + h} a${sw / 2} ${sw * .45} 0 0 0 ${sw} 0`, c); }
  return g(s, { opacity: .95 });
}
function trafficLight(x, yBase, h, state = 'red') {
  let s = rect(x - 6, yBase - h, 12, h, '#120c16') + rect(x - 22, yBase - h - 92, 44, 100, '#18111d', { rx: 8 });
  const cols = { red: '#ff3b3b', amber: '#ffb13b', green: '#3bff8a' };
  ['red', 'amber', 'green'].forEach((k, i) => { const on = k === state; s += circ(x, yBase - h - 74 + i * 30, 11, on ? cols[k] : '#2a2030'); if (on) s += glow(x, yBase - h - 74 + i * 30, 70, cols[k], .55); });
  return s;
}
function table(x, yTop, w, c = '#5a3c44', top = '#7e5a5e') { return rect(x - 6, yTop, 12, 118, mix(c, '#000', .3)) + rect(x - 40, yTop + 112, 80, 8, mix(c, '#000', .3)) + ell(x, yTop, w / 2, w * .09, top) + rect(x - w / 2, yTop, w, 10, c); }
function cafeTable(x, yTop, w) { return table(x, yTop, w, '#4a3038', '#8a6266'); }
function cup(x, y, s = 1, c = '#efe6dc') { return rect(x - 11 * s, y - 20 * s, 22 * s, 20 * s, c, { rx: 3 * s }) + path(`M${x + 11 * s} ${y - 15 * s} q${10 * s} 2 0 ${10 * s}`, 'none', { stroke: c, 'stroke-width': 3 * s }) + ell(x, y + 1, 18 * s, 4 * s, '#d8cfc4'); }
function glass(x, y, s = 1, o = {}) {
  const c = o.ghost ? '#8fd3ff' : '#cfe6f2', a = o.ghost ? .75 : .55;
  const fillH = (o.fill ?? .6);
  let q = path(`M${x - 18 * s} ${y - 62 * s} L${x - 14 * s} ${y} L${x + 14 * s} ${y} L${x + 18 * s} ${y - 62 * s} Z`, c, { opacity: a * .45 });
  q += path(`M${x - 17 * s + 1.5 * s} ${y - 62 * s * fillH} L${x - 14 * s + 1 * s} ${y - 2 * s} L${x + 14 * s - 1 * s} ${y - 2 * s} L${x + 17 * s - 1.5 * s} ${y - 62 * s * fillH} Z`, o.ghost ? '#4fa8ff' : '#86b7d4', { opacity: a });
  q += path(`M${x - 18 * s} ${y - 62 * s} L${x - 14 * s} ${y} L${x + 14 * s} ${y} L${x + 18 * s} ${y - 62 * s}`, 'none', { stroke: o.ghost ? '#dff4ff' : '#eef7fb', 'stroke-width': 2.5 * s, opacity: .9 });
  q += line(x - 9 * s, y - 52 * s, x - 7 * s, y - 12 * s, '#fff', 3 * s, { opacity: .6 });
  return g(q, o.ghost ? { filter: fGhost(4), class: 'gh' } : {});
}
function coin(x, y, r, spin = 0, ghost = false) { const rx = Math.max(1.5, r * Math.abs(Math.cos(spin))); return ghost ? ell(x, y, rx, r, '#9ad6ff', { opacity: .8, filter: fGhost(3), class: 'gh' }) : ell(x, y, rx, r, '#e9b949') + ell(x - rx * .15, y - r * .15, rx * .6, r * .6, '#f6d77c', { opacity: .7 }); }
function football(x, y, r, rot = 0, o = {}) {
  const c1 = o.ghost ? '#c9ecff' : '#f1ece3', c2 = o.ghost ? '#4f9be8' : '#15121a';
  let s = circ(x, y, r, c1);
  for (let i = 0; i < 5; i++) { const a = (rot + i * 72) * R; s += poly([0, 1, 2, 3, 4].map(k => [x + Math.cos(a) * r * .62 + Math.cos(k * 72 * R + a) * r * .2, y + Math.sin(a) * r * .62 + Math.sin(k * 72 * R + a) * r * .2]), c2); }
  s += poly([0, 1, 2, 3, 4].map(k => [x + Math.cos(k * 72 * R + rot * R) * r * .24, y + Math.sin(k * 72 * R + rot * R) * r * .24]), c2);
  return g(s, o.ghost ? { opacity: .85, filter: fGhost(4), class: 'gh' } : { filter: fRim(-r * .08, -r * .06, o.rimC || '#f0b27a') });
}
function pingball(x, y, r, ghost = false) { return ghost ? circ(x, y, r, '#bfe6ff', { opacity: .8, filter: fGhost(4), class: 'gh' }) : glow(x, y, r * 3, '#fff', .25) + circ(x, y, r, '#fbf6ee'); }

// ---------- vehicles ----------
// side-view delivery truck facing LEFT; (x,y) = front-bottom of the bumper at road level, s = scale (1 = ~640px long)
function truckSide(x, y, s = 1, o = {}) {
  const gh = o.ghost, body = gh ? '#bfe6ff' : '#a39cab', dark = gh ? '#6fb4ff' : '#1b151d', cab = gh ? '#9ad6ff' : '#b5323a';
  const P = (px, py) => [x + px * s, y + py * s];
  let q = '';
  // light cone ahead (to the left)
  if (o.lights !== false && !gh) q += poly([P(10, -70), P(10, -40), P(-900, 40), P(-900, -170)], lgrad([[0, '#fff2c4', .5], [1, '#fff2c4', 0]], 1, 0, 0, 0), { style: SCREEN });
  q += rect(...P(180, -330), 460 * s, 290 * s, body, { rx: 6 * s });
  if (!gh) q += rect(...P(180, -330), 460 * s, 290 * s, lgrad([[0, '#ffffff', .12], [.5, '#000000', 0], [1, '#000000', .3]], 0, 0, 0, 1), { rx: 6 * s }) + rect(...P(180, -330), 460 * s, 10 * s, '#ffb35c', { opacity: .35 });
  q += rect(...P(180, -110), 460 * s, 18 * s, gh ? '#7fc8ff' : '#b5323a');
  if (!gh) q += text(...P(410, -205), 'DELIVERY', { 'font-size': 38 * s, 'font-weight': 800, fill: '#8b2a30', 'text-anchor': 'middle', 'letter-spacing': 3 * s });
  q += path(`M${P(20, -40).join(' ')} L${P(30, -190).join(' ')} Q${P(40, -250).join(' ')} ${P(110, -255).join(' ')} L${P(185, -255).join(' ')} L${P(185, -40).join(' ')} Z`, cab);
  q += path(`M${P(45, -150).join(' ')} L${P(58, -225).join(' ')} L${P(150, -225).join(' ')} L${P(150, -150).join(' ')} Z`, gh ? '#e6f6ff' : '#3a4a66', { opacity: .9 });
  if (o.driver && !gh) q += circ(...P(115, -185), 22 * s, BODY) + face(...P(115, -185), 22 * s, -1, { expr: o.driverExpr || 'shocked' });
  q += rect(...P(5, -60), 190 * s, 26 * s, dark, { rx: 6 * s });
  q += rect(...P(8, -95), 22 * s, 20 * s, gh ? '#fff' : '#fff6d8', { rx: 4 * s });
  if (!gh && o.lights !== false) q += glow(...P(14, -85), 90 * s, '#fff2c4', .9);
  for (const wx of [110, 470, 570]) { const c = P(wx, -30); q += circ(c[0], c[1], 44 * s, dark) + circ(c[0], c[1], 18 * s, gh ? '#e6f6ff' : '#6f6874'); }
  return g(q, gh ? { opacity: o.op ?? .6, filter: fGhost(6), class: 'gh' } : { filter: fRim(10 * s, -6 * s, o.rimC || '#ffb46a') });
}
// front view of the truck centred at (x, yGround) with scale s (1 = 520px wide)
function truckFront(x, y, s = 1, o = {}) {
  const P = (px, py) => [x + px * s, y + py * s];
  let q = '';
  q += ell(x, y, 300 * s, 22 * s, '#000', { opacity: .5 }) + glowE(x, y - 40 * s, 900 * s, 260 * s, '#fff2c4', .35);
  for (const sx of [-1, 1]) q += rect(...P(sx * 262 - (sx > 0 ? 0 : 26), -330), 26 * s, 70 * s, '#1b151d', { rx: 6 * s }) + line(...P(sx * 230, -300), ...P(sx * 262, -300), '#1b151d', 6 * s);
  q += rect(...P(-260, -560), 520 * s, 300 * s, '#cfc9c0', { rx: 10 * s });
  q += path(`M${P(-230, -40).join(' ')} L${P(-220, -300).join(' ')} Q${P(-210, -330).join(' ')} ${P(-180, -330).join(' ')} L${P(180, -330).join(' ')} Q${P(210, -330).join(' ')} ${P(220, -300).join(' ')} L${P(230, -40).join(' ')} Z`, '#b5323a');
  q += rect(...P(-180, -310), 360 * s, 120 * s, '#2c3850', { rx: 8 * s });
  q += rect(...P(-150, -160), 300 * s, 80 * s, '#1b151d', { rx: 6 * s });
  for (let i = 0; i < 6; i++) q += rect(...P(-140, -150 + i * 12), 280 * s, 5 * s, '#3b3240');
  for (const sx of [-1, 1]) { q += circ(...P(sx * 175, -110), 32 * s, '#fffbe8') + glow(...P(sx * 175, -110), 260 * s, '#fff2c4', .85) + glow(...P(sx * 175, -110), 90 * s, '#ffffff', .9) + glowE(...P(sx * 175, -110), 900 * s, 10 * s + 4, '#dfeaff', .7); }
  q += rect(...P(-240, -60), 480 * s, 34 * s, '#1b151d', { rx: 8 * s });
  for (const sx of [-1, 1]) q += rect(...P(sx * 200 - 30, -40), 60 * s, 46 * s, '#0e0a10', { rx: 8 * s });
  return q;
}

// ---------- diagrams (reference: dark blueprint insert) ----------
function boardBg(t) {
  let s = rect(-400, -300, 2720, 1680, '#1a2230');
  for (let x = -400; x < 2400; x += 80) s += line(x, -300, x, 1400, '#2a3446', 2);
  for (let y = -300; y < 1400; y += 80) s += line(-400, y, 2400, y, '#2a3446', 2);
  return s + rect(-400, -300, 2720, 1680, rgrad([[0, '#000', 0], [1, '#000', .55]]));
}

// ---------- full environments: return {bg, fg} strings drawn with the camera ----------
// INTERSECTION (side view). Road y 610..860, far sidewalk 560..610, near sidewalk 860..1100. Truck drives right -> left.
const IX = { farCurb: 610, nearCurb: 860, cross0: 820, cross1: 1100, barrierX: -260 };
function envIntersection(cam, t, o = {}) {
  const wet = '#2a2440';
  let far = sky('night') + stars(60, 3) + moon(1500, 90, 26) + clouds(170, 8, 4, '#5b4a7a', .35);
  far += skyline(470, 11, '#1d1832', 30, -1400, 4600, 300, '#d9a35e');
  let mid = '';
  // shops along far sidewalk
  const shops = [[-900, 330, '#3a2a3e'], [-560, 420, '#46303e'], [-130, 380, '#3d2c40'], [260, 300, '#4a3340'], [560, 460, '#3a2a3e'], [1030, 360, '#4b3142'], [1400, 420, '#3d2c40'], [1830, 330, '#46303e'], [2170, 380, '#3a2a3e']];
  shops.forEach(([x, h, c], i) => { mid += building(x, 560, 330, h, c, { seed: i + 2, litP: .55, glowWin: true, cols: 3, rows: 2, ground: 140 }); mid += windowLit(x + 30, 445, 270, 105, 1, '#f0a85a', '#22161f'); mid += glow(x + 165, 500, 200, '#ffb45c', .2); });
  mid += awning(1050, 430, 300, 34, 10, '#a83a3d', '#e8d9cf');
  mid += rect(-1400, 560, 4400, 52, '#2c2236') + rect(-1400, 606, 4400, 6, '#4a3a52');
  for (const lx of [-700, 120, 900, 1700, 2500]) mid += lamp(lx, 600, 330, t);
  mid += trafficLight(780, 600, 300, o.light || 'green');
  // road
  mid += rect(-1400, IX.farCurb, 4400, IX.nearCurb - IX.farCurb, lgrad([[0, '#16121f'], [1, '#1f1a2b']]));
  for (let x = -1400; x < 3000; x += 220) mid += rect(x, 730, 110, 7, '#8c8496', { opacity: .55 });
  // crosswalk (perspective stripes across the road)
  for (let i = 0; i < 6; i++) { const yy = IX.farCurb + 12 + i * 40; mid += poly([[IX.cross0 + 20 - i * 6, yy], [IX.cross1 - 20 + i * 6, yy], [IX.cross1 - 14 + i * 7, yy + 24], [IX.cross0 + 14 - i * 7, yy + 24]], '#8e86a0', { opacity: .55 }); }
  // wet reflections
  for (const lx of [-700, 120, 900, 1700, 2500]) mid += rect(lx + 40, 640, 34, 200, lgrad([[0, '#ffc477', .35], [1, '#ffc477', 0]]), { style: SCREEN });
  for (let i = 0; i < 9; i++) mid += rect(-900 + i * 400 + 150, 650, 60, 150, lgrad([[0, '#f0a85a', .1], [1, '#f0a85a', 0]]), { style: SCREEN });
  for (const px of [-300, 560, 1340, 2100]) mid += glowE(px, 975, 330, 60, '#ffb35a', .32) + glowE(px, 760, 260, 50, '#ffb35a', .16);
  // barrier (far-left, where the truck finally crashes)
  const bx = IX.barrierX;
  mid += rect(bx - 220, 575, 440, 26, '#c9c2b8') + rect(bx - 220, 575, 440, 8, '#e6dfd5');
  for (let i = 0; i < 6; i++) mid += rect(bx - 210 + i * 84, 575, 36, 26, '#c13a3a', { opacity: .9 });
  for (const px of [-200, 0, 200]) mid += rect(bx + px - 6, 598, 12, 26, '#6d6670');
  // near sidewalk
  mid += rect(-1400, IX.nearCurb, 4400, 14, '#9a8ca6') + rect(-1400, IX.nearCurb, 4400, 3, '#d8cce0') + rect(-1400, IX.nearCurb + 14, 4400, 300, lgrad([[0, '#3a3247'], [1, '#221c2d']]));
  for (let x = -1400; x < 3000; x += 160) mid += rect(x, IX.nearCurb + 14, 3, 300, '#241d2e');
  mid += rect(1985, 600, 10, 240, '#120c16') + circ(1990, 590, 34, '#e8dccf') + circ(1990, 590, 28, '#f6efe6') + text(1990, 598, o.clock || '8:17', { 'font-size': 20, 'font-weight': 800, fill: '#2a1a22', 'text-anchor': 'middle' });
  return { bg: layer(cam, far, { p: .35, blur: o.bgBlur ?? 2 }) + layer(cam, mid, { p: 1, blur: o.midBlur || 0 }), fg: '' };
}

// ROAD-LEVEL FRONT VIEW (one-point perspective, vanishing point at (960, 470))
function envRoadFront(cam, t, o = {}) {
  const vx = 960, vy = 480;
  let far = sky('night') + stars(50, 8) + moon(1180, 150, 22) + clouds(240, 6, 9, '#5b4a7a', .35, 1600, 200) + skyline(vy + 10, 21, '#1a1630', 30, -800, 3600, 260) + glowE(960, vy, 900, 60, '#ff9a5c', .12);
  let mid = rect(-1200, vy - 2, 4400, 1300, lgrad([[0, '#2a2236'], [1, '#3a3046']]));
  // road
  mid += poly([[vx - 30, vy], [vx + 30, vy], [2600, 1400], [-700, 1400]], lgrad([[0, '#1b1728'], [1, '#2d2640']]));
  for (let i = 0; i < 10; i++) { const a = Math.pow(i / 10, 2), b = Math.pow((i + .45) / 10, 2); mid += poly([[vx - 2 - a * 40, vy + a * 920], [vx + 2 + a * 40, vy + a * 920], [vx + 2 + b * 40, vy + b * 920], [vx - 2 - b * 40, vy + b * 920]], '#9a92a6', { opacity: .6 }); }
  // crosswalk near camera
  if (o.crosswalk !== false) { const hw = y => 30 + 1.78 * (y - vy); const y1 = 890, y2 = 1010; for (let i = 0; i < 9; i++) { const u0 = -1 + (i * 2 + .25) / 9, u1 = -1 + (i * 2 + 1.05) / 9; mid += poly([[vx + u0 * hw(y1), y1], [vx + u1 * hw(y1), y1], [vx + u1 * hw(y2), y2], [vx + u0 * hw(y2), y2]], '#a49cb0', { opacity: .55 }); } }
  for (const [lx, ly, r] of [[560, 700, 260], [1380, 700, 260], [300, 860, 420], [1640, 860, 420]]) mid += glowE(lx, ly, r, r * .22, '#ffb35a', .3);
  // building blocks receding both sides
  for (const side of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const d0 = Math.pow(1 - k / 7, 1.6), d1 = Math.pow(1 - (k + 1) / 7, 1.6);
      const xA = vx + side * (60 + d0 * 1500), xB = vx + side * (60 + d1 * 1500);
      const hA = 40 + d0 * 900, hB = 40 + d1 * 900;
      const c = mix('#2b2138', '#4a3448', rnd(k * 3 + side));
      mid += poly([[xA, vy + d0 * 520], [xB, vy + d1 * 520], [xB, vy + d1 * 520 - hB], [xA, vy + d0 * 520 - hA]], c);
      for (let r = 0; r < 4; r++) for (let q = 0; q < 2; q++) if (rnd(k * 17 + r * 5 + q + side * 3) < .55) {
        const u = (q + .3) / 2.2, u2 = (q + .8) / 2.2, yy = .2 + r * .19;
        const xa = lerp(xA, xB, u), xb = lerp(xA, xB, u2), ha = lerp(hA, hB, u), hb = lerp(hA, hB, u2), ya = lerp(vy + d0 * 520, vy + d1 * 520, u), yb = lerp(vy + d0 * 520, vy + d1 * 520, u2);
        mid += poly([[xa, ya - ha * (1 - yy)], [xb, yb - hb * (1 - yy)], [xb, yb - hb * (1 - yy - .1)], [xa, ya - ha * (1 - yy - .1)]], '#f0a85a', { opacity: .85 });
      }
    }
    // lamps
    for (let k = 1; k < 6; k++) { const d = Math.pow(1 - k / 6, 1.6), lx = vx + side * (90 + d * 1150), ly = vy + d * 600, h = 30 + d * 720; mid += line(lx, ly, lx, ly - h, '#120c16', 2 + d * 10) + glow(lx - side * d * 40, ly - h, 30 + d * 160, '#ffc477', .6); }
  }
  // wet reflections streaks
  for (let i = 0; i < 7; i++) mid += rect(200 + i * 230, 700, 30, 400, lgrad([[0, '#f0a85a', .12], [1, '#f0a85a', 0]]), { style: SCREEN });
  return { bg: layer(cam, far, { p: .4, blur: 2 }) + layer(cam, mid, { p: 1, blur: o.midBlur || 1 }), fg: '' };
}

// KITCHEN (morning). Table top at y=640 centred x=960. Window at back.
function envKitchen(cam, t, o = {}) {
  let back = rect(-600, -400, 3200, 1200, lgrad([[0, '#5d4250'], [1, '#7a5658']])) + rect(-600, 700, 3200, 100, '#4a3238');
  // window
  back += rect(560, 120, 620, 420, '#3a2730') + rect(580, 140, 580, 380, lgrad(SKY.morning));
  back += sun(1080, 230, 30, '#fffbea', '#ffe7b0') + ell(760, 250, 120, 8, '#fff1dd', { opacity: .5 }) + ell(1060, 300, 90, 6, '#fff1dd', { opacity: .45 });
  back += tree(700, 520, 160, '#6a6f80', 4) + rect(580, 330, 580, 4, '#3a2730') + rect(868, 140, 4, 380, '#3a2730');
  back += rect(540, 520, 660, 22, '#8a6662');
  // cabinets
  back += rect(-300, 80, 760, 200, '#6b4a4e') + rect(1290, 80, 900, 200, '#6b4a4e');
  for (const x of [-280, -40, 200, 1310, 1550, 1790]) back += rect(x, 96, 220, 168, '#7b585a', { rx: 4 }) + rect(x + 190, 170, 8, 30, '#c9a58a', { rx: 3 });
  back += rect(-300, 520, 760, 260, '#5c3f45') + rect(1290, 520, 900, 260, '#5c3f45') + rect(-300, 505, 760, 22, '#a8806e') + rect(1290, 505, 900, 22, '#a8806e');
  back += rect(1720, 260, 260, 520, '#857a80', { rx: 10 }) + rect(1740, 300, 14, 90, '#5d5358', { rx: 4 }) + rect(1800, 420, 30, 24, '#e0c25a', { rx: 4 }) + rect(1860, 470, 26, 26, '#6b8fd6', { rx: 4 });
  back += circ(1420, 380, 46, '#e8dccf') + circ(1420, 380, 40, '#f6efe6') + line(1420, 380, 1420, 352, '#3a2a30', 4) + line(1420, 380, 1440, 390, '#3a2a30', 4);
  back += path('M220 505 q0 -50 40 -50 h40 q40 0 40 50 Z', '#c9a58a') + rect(300, 470, 30, 8, '#c9a58a');
  back += line(960, -400, 960, 60, '#2a1a22', 4) + path('M900 60 h120 l-20 40 h-80 Z', '#3a2a30') + glow(960, 110, 140, '#ffe2b0', .35);
  // floor
  let floor = rect(-600, 780, 3200, 600, '#3e2c33');
  for (let i = 0; i < 14; i++) floor += line(-600 + i * 260, 780, -900 + i * 330, 1400, '#33242a', 3);
  for (let j = 0; j < 6; j++) floor += line(-600, 800 + j * j * 22, 2600, 800 + j * j * 22, '#33242a', 3);
  // sunlight shafts + patch
  let light = poly([[600, 150], [1150, 150], [1500, 1100], [700, 1100]], lgrad([[0, '#ffe2b0', .22], [1, '#ffe2b0', 0]]), { style: SCREEN }) + glowE(1050, 900, 380, 70, '#ffd9a0', .35) + motes(t, 28, 5, [600, 160, 800, 900]);
  return { bg: layer(cam, back + floor, { p: .85, blur: o.bgBlur ?? 3 }), light: layer(cam, light, { p: .9 }), fg: '' };
}
function tableK(y = 680) { return rect(560, y, 800, 26, '#8d6152') + rect(560, y, 800, 6, '#b98470') + rect(600, y + 24, 20, 900 - y - 24, '#5a3a33') + rect(1300, y + 24, 20, 900 - y - 24, '#5a3a33'); }
function kitchenTable(cam, o = {}) { // drawn in the subject plane, top at y=680
  const y = o.y || 680;
  let s = rect(560, y, 800, 26, '#8d6152') + rect(560, y, 800, 6, '#b98470') + rect(600, y + 24, 20, 900 - y - 24, '#5a3a33') + rect(1300, y + 24, 20, 900 - y - 24, '#5a3a33');
  return layer(cam, s, { blur: o.blur || 0 });
}

// LIVING ROOM (afternoon) — shelf on the right wall.
function envLiving(cam, t, o = {}) {
  let back = rect(-600, -400, 3200, 1260, lgrad([[0, '#3f2e45'], [1, '#5a3f50']]));
  back += rect(160, 150, 420, 380, '#2a1e2c') + rect(176, 166, 388, 348, lgrad(SKY.dusk)) + sun(470, 470, 22) + rect(368, 166, 6, 348, '#2a1e2c');
  back += rect(1000, 200, 150, 110, '#2a1e2c') + rect(1010, 210, 130, 90, '#7a5a6e') + rect(1180, 230, 110, 140, '#2a1e2c') + rect(1190, 240, 90, 120, '#5a7a8e');
  back += rect(860, 560, 300, 180, '#141018', { rx: 8 }) + rect(872, 572, 276, 156, '#1e2a3a') + rect(990, 740, 40, 60, '#141018') + rect(900, 800, 220, 12, '#141018');
  back += line(1500, -400, 1500, 80, '#1b1420', 4) + ell(1500, 90, 70, 22, '#2a1e2c') + glow(1500, 110, 200, '#ffd39a', .3);
  back += rect(1820, 260, 160, 580, '#2a1e2c', { rx: 6 }) + circ(1840, 560, 8, '#c9a58a');
  back += skyline(514, 5, '#6a5a78', 8, 176, 400, 120, '#ffd39a');
  back += rect(-200, 640, 640, 200, '#4c3a52', { rx: 30 }) + rect(-220, 590, 120, 250, '#43334a', { rx: 30 }); // sofa
  back += rect(760, 360, 8, 420, '#1b1420') + ell(764, 350, 50, 30, '#e7c08a') + glow(764, 360, 160, '#ffd39a', .45);
  let floor = rect(-600, 830, 3200, 600, '#2d2130') + rect(-600, 830, 3200, 8, '#4a3a4e') + ell(820, 900, 620, 70, '#5a3a4a') + ell(820, 900, 560, 56, '#6a4658') + glowE(764, 840, 320, 60, '#f0b27a', .3);
  let light = poly([[180, 170], [560, 170], [900, 1000], [260, 1000]], lgrad([[0, '#ffd39a', .2], [1, '#ffd39a', 0]]), { style: SCREEN }) + motes(t, 22, 9, [200, 160, 900, 800]);
  return { bg: layer(cam, back + floor, { p: .85, blur: o.bgBlur ?? 2.5 }), light: layer(cam, light, { p: .9 }) };
}
// shelf drawn as an object; returns svg (positioned in world)
function shelf(x, y, o = {}) { // x,y top-left of shelf board
  let s = rect(x, y, 360, 18, '#7a5446') + rect(x + 20, y + 18, 14, 40, '#5a3a33') + rect(x + 326, y + 18, 14, 40, '#5a3a33');
  return s;
}
function books(x, y, tilt = 0, fall = 0) {
  const cols = ['#6b8fd6', '#d66b6b', '#e0c25a', '#6bc28c', '#a77bd6'];
  let s = '';
  cols.forEach((c, i) => { const bx = x + i * 30, h = 70 + (i % 2) * 14; const dy = fall * (i + 1) * 40, rot = tilt * (i % 2 ? 1 : -.6) + fall * (i * 25 + 20); s += rect(bx, y - h + dy, 24, h, c, { transform: `rotate(${f1(rot)} ${bx + 12} ${y + dy})` }); });
  return s;
}
function plantPot(x, y, s = 1, rot = 0) { return g(path(`M${-34 * s} ${-70 * s} L${34 * s} ${-70 * s} L${24 * s} 0 L${-24 * s} 0 Z`, '#b86a4a') + rect(-38 * s, -80 * s, 76 * s, 14 * s, '#cf7d5a', { rx: 3 }) + circ(-10 * s, -100 * s, 24 * s, '#3f7a54') + circ(14 * s, -110 * s, 26 * s, '#4c8e62') + circ(0, -126 * s, 20 * s, '#5aa070'), { transform: `translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})` }); }

// GYM HALL (sunset through arched windows)
function envGym(cam, t, o = {}) {
  let back = rect(-800, -500, 3600, 1300, lgrad([[0, '#2a1820'], [1, '#4a2e30']]));
  for (let i = 0; i < 5; i++) { const x = -200 + i * 520; back += path(`M${x} 620 L${x} 200 A110 110 0 0 1 ${x + 220} 200 L${x + 220} 620 Z`, '#1c1016'); back += path(`M${x + 12} 608 L${x + 12} 205 A98 98 0 0 1 ${x + 208} 205 L${x + 208} 608 Z`, lgrad(SKY.dusk.map(([a, b]) => [a, b]))); back += rect(x + 108, 110, 5, 500, '#1c1016'); for (let k = 0; k < 4; k++) back += rect(x + 12, 300 + k * 80, 196, 4, '#1c1016'); back += glow(x + 110, 420, 240, '#ffb46a', .22); }
  back += rect(-800, 620, 3600, 30, '#3a2226');
  let floor = rect(-800, 650, 3600, 800, lgrad([[0, '#6a4232'], [1, '#3a2520']]));
  for (let i = 0; i < 30; i++) floor += line(-800 + i * 130, 650, -1600 + i * 190, 1450, '#5a3628', 2);
  floor += path('M-200 900 Q960 760 2100 900', 'none', { stroke: '#e0c39a', 'stroke-width': 4, opacity: .4 });
  let light = '';
  for (let i = 0; i < 5; i++) { const x = -200 + i * 520; light += poly([[x + 20, 230], [x + 200, 230], [x + 520, 1100], [x + 260, 1100]], lgrad([[0, '#ffc98a', .2], [1, '#ffc98a', 0]]), { style: SCREEN }); }
  light += motes(t, 40, 13, [-200, 150, 2400, 900]);
  return { bg: layer(cam, back, { p: .8, blur: o.bgBlur ?? 3 }) + layer(cam, floor, { p: 1, blur: o.floorBlur || 0 }), light: layer(cam, light, { p: .9 }) };
}
function pingTable(x, y, s = 1) { // side view, y = table top
  return rect(x - 300 * s, y, 600 * s, 16 * s, '#1f4a6a') + rect(x - 300 * s, y, 600 * s, 4 * s, '#e8eef2') + rect(x - 3 * s, y - 34 * s, 6 * s, 34 * s, '#e8eef2') + rect(x - 3, y - 34 * s, 4, 30 * s, '#d8e0e6', { opacity: .6 }) + rect(x - 260 * s, y + 16 * s, 12 * s, 150 * s, '#120c16') + rect(x + 248 * s, y + 16 * s, 12 * s, 150 * s, '#120c16');
}
function scoreboard(x, y, a, b, s = 1) { return rect(x - 80 * s, y - 40 * s, 160 * s, 80 * s, '#140c12', { rx: 8 }) + text(x - 36 * s, y + 18 * s, a, { 'font-size': 50 * s, 'font-weight': 800, fill: '#ffe9c2', 'text-anchor': 'middle' }) + text(x + 36 * s, y + 18 * s, b, { 'font-size': 50 * s, 'font-weight': 800, fill: '#ffe9c2', 'text-anchor': 'middle' }) + text(x, y + 14 * s, ':', { 'font-size': 40 * s, fill: '#ffe9c2', 'text-anchor': 'middle' }); }

// ARCADE
function envArcade(cam, t, o = {}) {
  let back = rect(-800, -500, 3600, 1600, lgrad([[0, '#0c0818'], [1, '#1c1030']]));
  const cols = ['#ff3fa8', '#3fe0ff', '#9a5bff', '#ffd23f'];
  for (let i = 0; i < 7; i++) { const x = -500 + i * 420, c = cols[i % 4]; back += rect(x, 180, 260, 600, '#160f22', { rx: 14 }) + rect(x + 30, 230, 200, 160, c, { opacity: .35, rx: 8 }) + glow(x + 130, 300, 240, c, .3) + rect(x, 170, 260, 20, c, { opacity: .8 }) + glowE(x + 130, 800, 240, 40, c, .25); }
  back += text(960, 120, 'ARCADE', { 'font-size': 90, 'font-weight': 900, fill: '#ff6ac1', 'text-anchor': 'middle', 'letter-spacing': 20, filter: fGlow(10, '#ff3fa8', 1) });
  let floor = rect(-800, 780, 3600, 700, '#120c1c');
  for (let i = 0; i < 20; i++) floor += line(-800 + i * 200, 780, -1300 + i * 260, 1500, '#2a1b40', 3);
  return { bg: layer(cam, back + floor, { p: .85, blur: o.bgBlur ?? 4 }) };
}

// CAFE STREET (dusk, striped awning — the reference location). Table row at y=700.
function envCafe(cam, t, o = {}) {
  const tod = o.tod || (o.night ? 'night' : 'dusk');
  const sk = { day: 'day', dusk: 'dusk', blue: 'night', night: 'night' }[tod];
  let far = sky(sk) + (tod === 'night' || tod === 'blue' ? stars(50, 2) : sun(1500, tod === 'day' ? 120 : 330, 40)) + clouds(120, 9, 7, tod === 'night' || tod === 'blue' ? '#5b4a7a' : '#f0a982', .5);
  if (tod === 'dusk') far += rays(1500, 330, 22, 1400, '#ffd6a0', .07, t * 2);
  if (tod === 'blue') far += glowE(1500, 520, 900, 120, '#ff8a5c', .25);
  far += skyline(560, 4, '#3a2a48', 26, -1200, 4400, 260);
  let mid = '';
  const lit = tod !== 'day';
  mid += rect(-800, 200, 3600, 400, tod === 'day' ? '#7a5866' : '#47303e') + rect(-800, 186, 3600, 16, '#2c1c26');
  for (let i = 0; i < 14; i++) mid += windowLit(-700 + i * 260, 230, 70, 80, lit && rnd(i * 3 + 1) < .6, '#e8a860');
  mid += rect(300, 330, 1320, 330, '#2c1c26');
  for (let i = 0; i < 4; i++) { mid += windowLit(330 + i * 325, 360, 300, 260, 1, lit ? '#f2b06a' : '#9fb3c4', '#2a1a22'); for (let k = 0; k < (i % 2 ? 1 : 2); k++) { const px = 380 + i * 325 + k * 150 + rnd(i * 5 + k) * 70, sz = .75 + rnd(i * 3 + k) * .5, py = 520 + rnd(i + k * 7) * 30; mid += circ(px, py, 24 * sz, '#3a2430', { opacity: .55 }) + rect(px - 28 * sz, py + 24 * sz, 56 * sz, 80, '#3a2430', { opacity: .55, rx: 18 }); } mid += rect(340 + i * 325, 590, 280, 20, '#3a2430', { opacity: .5 }); mid += line(480 + i * 325, 362, 480 + i * 325, 410, '#2a1a22', 3) + path(`M${455 + i * 325} 410 h50 l-8 18 h-34 Z`, '#2a1a22') + glow(480 + i * 325, 425, 70, '#ffd27a', lit ? .55 : .25); }
  mid += glow(960, 500, 700, '#ffb46a', lit ? .22 : .08);
  mid += rect(1660, 520, 130, 150, '#1e1418', { rx: 6 }) + text(1725, 575, 'CAFE', { 'font-size': 26, 'font-weight': 800, fill: '#e8d9cf', 'text-anchor': 'middle' }) + text(1725, 610, 'open', { 'font-size': 20, fill: '#e8d9cf', 'text-anchor': 'middle' }) + rect(1700, 670, 10, 20, '#1e1418') + rect(1740, 670, 10, 20, '#1e1418');
  for (const px of [240, 1650]) mid += rect(px - 40, 600, 80, 70, '#5a3a33', { rx: 6 }) + circ(px - 20, 590, 34, '#2f5a40') + circ(px + 20, 585, 38, '#3a6a4c') + circ(px, 560, 30, '#3f7a54');
  mid += awning(260, 270, 1400, 70, 16);
  for (let i = 0; i < 18; i++) { const x = 270 + i * 78; mid += line(x, 262, x + 78, 262, '#120c16', 2) + circ(x + 39, 270 + Math.sin(i) * 3, 5, lit ? '#ffe1a0' : '#c8bfb0') + (lit ? glow(x + 39, 270, 26, '#ffd27a', .5) : ''); }
  mid += rect(-800, 660, 3600, 560, tod === 'day' ? lgrad([[0, '#8a7480'], [1, '#5a4652']]) : lgrad([[0, '#3a2a36'], [1, '#22161f']]));
  for (let i = 0; i < 20; i++) mid += line(-800 + i * 200, 660, -1000 + i * 240, 1300, '#2c1f2a', 3);
  mid += tree(-260, 660, 260, '#1a1018', 6) + tree(2180, 660, 240, '#1a1018', 9) + lamp(-500, 662, 360, t, tod !== 'day');
  const grade = tod === 'blue' ? rect(-2000, -1000, 6000, 3000, '#1a1440', { opacity: .28, style: 'mix-blend-mode:multiply' }) : tod === 'day' ? rect(-2000, -1000, 6000, 3000, '#dfeaf5', { opacity: .2, style: SCREEN }) : '';
  return { bg: layer(cam, far, { p: .35, blur: (o.bgBlur ?? 3) + 1 }) + layer(cam, mid + grade, { p: .8, blur: o.bgBlur ?? 3 }), fg: '' };
}
// CAFE REVERSE ANGLE: from inside the cafe looking out through the big window at the street
function envCafeReverse(cam, t, o = {}) {
  const tod = o.tod || 'dusk';
  let far = sky(tod === 'day' ? 'afternoon' : tod === 'blue' ? 'night' : 'dusk') + (tod === 'dusk' ? sun(400, 360, 36) : '') + clouds(150, 8, 3, '#f0a982', .45);
  far += building(-300, 640, 420, 420, '#3d2c40', { seed: 3, litP: tod === 'day' ? .1 : .5, glowWin: tod !== 'day' }) + building(180, 640, 360, 300, '#46303e', { seed: 5, litP: tod === 'day' ? .1 : .5 }) + building(1300, 640, 520, 380, '#3a2a3e', { seed: 8, litP: tod === 'day' ? .1 : .5, glowWin: tod !== 'day' }) + tree(900, 640, 220, '#1a1018', 4) + lamp(1150, 660, 330, t, tod !== 'day');
  far += rect(-800, 640, 3600, 600, lgrad([[0, '#3a2a36'], [1, '#22161f']]));
  let room = path('M-800 -400 H2800 V1500 H-800 Z M-60 120 V780 H1980 V120 Z', '#24161e', { 'fill-rule': 'evenodd' });
  for (const x of [600, 1300]) room += rect(x - 12, 120, 24, 660, '#24161e');
  room += rect(-60, 760, 2040, 30, '#3a2630') + glow(960, 60, 400, '#ffd27a', .3);
  const grade = tod === 'blue' ? rect(-2000, -1000, 6000, 3000, '#1a1440', { opacity: .28, style: 'mix-blend-mode:multiply' }) : '';
  return { bg: layer(cam, far, { p: .5, blur: o.bgBlur ?? 5 }) + layer(cam, room + grade, { p: 1.2, blur: o.frameBlur ?? 2 }) };
}

// CITY AERIAL (for the "three days earlier" lift)
function envAerial(cam, t, o = {}) {
  let s = sky(o.sky || 'night', -2000, -1600, 6000, 2400) + stars(120, 5, -1500, -1500, 5000, 1300);
  for (let row = 0; row < 7; row++) { s += skyline(620 + row * 110, 30 + row * 7, mix('#1a1530', '#3d2c4c', row / 7), 40, -1600, 5200, 300 - row * 25, '#f0b060'); s += glowE(960, 640 + row * 110, 2200, 60, '#ff9a5c', .06); }
  for (let i = 0; i < 160; i++) s += circ(-1500 + rnd(i * 3) * 5000, 700 + rnd(i * 7) * 700, 2 + rnd(i) * 3, rnd(i * 11) < .7 ? '#ffc477' : '#fff2c4', { opacity: .5 + rnd(i * 5) * .5 });
  s += glowE(960, 620, 2600, 180, '#ff8a5c', .22);
  s += rect(-2000, 1260, 6000, 1000, '#120e1e');
  return layer(cam, s, { p: 1, blur: o.blur || 0 });
}
