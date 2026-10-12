// Props: flat-shaded vector objects with a warm rim edge. All take world coords; most accept a scale s.

const PR = {};

PR.desk = (x, y, w = 220, o = {}) => { // y = floor
  const top = o.top || PAL.woodL, side = o.side || PAL.wood, hgt = o.h || 105;
  return S.g({}, S.rect(x - w / 2 + 10, y - hgt, 12, hgt, PAL.woodD), S.rect(x + w / 2 - 22, y - hgt, 12, hgt, PAL.woodD),
    S.rect(x - w / 2, y - hgt - 14, w, 16, top, { rx: 3 }), S.rect(x - w / 2, y - hgt - 14, w, 4, o.rim || PAL.rim, { opacity: .55 }),
    S.rect(x - w / 2 + 6, y - hgt + 2, w - 12, 26, side));
};
PR.chair = (x, y, f = 1, s = 1) => S.g({ transform: `translate(${x},${y}) scale(${f * s},${s})` },
  S.rect(-28, -62, 56, 10, PAL.woodD, { rx: 3 }), S.rect(-26, -62, 6, 62, PAL.woodD), S.rect(20, -62, 6, 62, PAL.woodD), S.rect(-30, -140, 8, 82, PAL.woodD, { rx: 3 }), S.rect(-30, -140, 30, 40, PAL.woodD, { rx: 4 }));
PR.stool = (x, y, s = 1, col = PAL.metal) => S.g({ transform: `translate(${x},${y}) scale(${s})` }, S.ellipse(0, -96, 34, 9, shade(col, 1.2)), S.rect(-32, -98, 64, 10, col, { rx: 5 }), S.line(-24, -90, -32, 0, shade(col, .7), 6), S.line(24, -90, 32, 0, shade(col, .7), 6), S.line(-28, -40, 28, -40, shade(col, .6), 4));

PR.book = (x, y, w = 90, h = 18, col = '#7a3b48', o = {}) => S.g({ transform: `translate(${x},${y}) rotate(${o.r || 0})` }, S.rect(-w / 2, -h, w, h, col, { rx: 2 }), S.rect(-w / 2 + 4, -h + 3, w - 8, h - 7, '#efe3cf'), S.rect(-w / 2, -h, w, 4, shade(col, 1.25)));
PR.openBook = (x, y, w = 260, o = {}) => {
  const h = w * .62, k = o.lines ?? 7;
  let s = S.path(`M${x - w / 2},${y} L${x - w / 2 + 8},${y - h} Q${x - w / 4},${y - h - 14} ${x},${y - h + 4} Q${x + w / 4},${y - h - 14} ${x + w / 2 - 8},${y - h} L${x + w / 2},${y} Q${x + w / 4},${y - 12} ${x},${y + 4} Q${x - w / 4},${y - 12} ${x - w / 2},${y}Z`, '#d9c9ab');
  for (let i = 0; i < k; i++) { const yy = y - h + 26 + i * (h - 44) / k; s += S.line(x - w / 2 + 22, yy, x - 18, yy, '#8a7f74', 3, { opacity: .6 }) + S.line(x + 18, yy, x + w / 2 - 22 - (i % 3) * 18, yy, '#8a7f74', 3, { opacity: .6 }); }
  return s + S.line(x, y - h + 4, x, y + 4, '#b9ab98', 3);
};
// test paper with grade
PR.testPaper = (x, y, s = 1, o = {}) => {
  const grade = o.grade || 'F', gc = grade === 'F' ? '#d8322f' : '#2fa24d';
  let k = '';
  for (let i = 0; i < 7; i++) {
    const yy = -150 + i * 40;
    k += S.text(-160, yy, `${i + 1}.`, { 'font-family': 'Inter', 'font-size': 20, fill: '#5b5048' }) + S.line(-130, yy - 6, -10 + (i * 37 % 90), yy - 6, '#6d6258', 4, { opacity: .7 });
    const ok = o.marks ? o.marks[i] : grade !== 'F';
    if (o.showMarks !== false) k += ok ? S.path(`M70,${yy - 14} l12,14 l24,-28`, 'none', { stroke: '#2fa24d', 'stroke-width': 6, 'stroke-linecap': 'round' }) : S.path(`M72,${yy - 22} l26,24 M98,${yy - 22} l-26,24`, 'none', { stroke: '#d8322f', 'stroke-width': 6, 'stroke-linecap': 'round' });
  }
  return S.g({ transform: `translate(${x},${y}) rotate(${o.r || 0}) scale(${s})` },
    S.rect(-196, -236, 400, 500, '#000', { opacity: .25, rx: 4, transform: 'translate(10,12)' }),
    S.rect(-200, -240, 400, 500, '#d9c9ab', { rx: 4 }), S.text(-170, -196, o.title || 'MATH TEST', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 34, fill: '#3a302a' }),
    S.line(-170, -184, 40, -184, '#3a302a', 2), k,
    o.showGrade === false ? '' : S.g({ transform: `translate(130,-180) rotate(-12) scale(${o.gradeK ?? 1})` }, S.circle(0, 0, 52, 'none', { stroke: gc, 'stroke-width': 7 }), S.text(0, 24, grade, { 'font-family': 'Lilita One', 'font-size': grade.length > 1 ? 52 : 70, fill: gc, 'text-anchor': 'middle' })));
};
PR.pencil = (x, y, s = 1, r = -35) => S.g({ transform: `translate(${x},${y}) rotate(${r}) scale(${s})` }, S.rect(0, -7, 150, 14, '#f2c230', { rx: 2 }), S.rect(150, -7, 18, 14, '#e8a4a4'), S.poly([[0, -7], [-26, 0], [0, 7]], '#f0d6a8'), S.poly([[-18, -2.5], [-26, 0], [-18, 2.5]], '#2a2a2a'));
// analog clock
PR.clock = (x, y, r, hours, o = {}) => {
  const hA = hours / 12 * 360, mA = (hours % 1) * 360;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = rad(i * 30); ticks += S.line(x + Math.sin(a) * r * .8, y - Math.cos(a) * r * .8, x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9, o.ink || '#3a302a', r * .05); }
  return S.g({}, S.circle(x, y, r * 1.08, o.rimc || PAL.rim, { opacity: .7 }), S.circle(x, y, r, o.face || '#efe3cf'), ticks,
    S.line(x, y, x + Math.sin(rad(hA)) * r * .5, y - Math.cos(rad(hA)) * r * .5, o.ink || '#3a302a', r * .08),
    S.line(x, y, x + Math.sin(rad(mA)) * r * .75, y - Math.cos(rad(mA)) * r * .75, o.ink || '#3a302a', r * .05), S.circle(x, y, r * .06, o.ink || '#3a302a'));
};
PR.stopwatch = (x, y, r, secs, o = {}) => PR.clock(x, y, r, secs / 60 * 12, { face: '#1b1622', ink: PAL.cream, rimc: o.rimc || PAL.gold }) + S.rect(x - r * .15, y - r * 1.32, r * .3, r * .22, PAL.gold, { rx: 3 });
// digital timer readout
PR.timer = (x, y, str, o = {}) => S.g({}, S.rect(x - (o.w || 300) / 2, y - (o.h || 110) / 2, o.w || 300, o.h || 110, o.bg || '#120e17', { rx: 14, stroke: o.edge || '#3d3450', 'stroke-width': 4 }),
  S.text(x, y + (o.size || 72) * .35, str, { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': o.size || 72, fill: o.fill || PAL.red, 'text-anchor': 'middle', 'letter-spacing': 4 }));
// calendar page stack
PR.calendar = (x, y, day, s = 1, flip = 0) => {
  const page = (d, op = 1, ty = 0, rot = 0) => S.g({ transform: `translate(0,${ty}) rotate(${rot})`, opacity: op }, S.rect(-90, -110, 180, 220, '#f3eadb', { rx: 8 }), S.rect(-90, -110, 180, 48, '#d23b3b', { rx: 8 }), S.rect(-90, -80, 180, 18, '#d23b3b'),
    S.text(0, -72, 'DAY', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 26, fill: '#fff', 'text-anchor': 'middle' }), S.text(0, 60, d, { 'font-family': 'Lilita One', 'font-size': 100, fill: '#3a302a', 'text-anchor': 'middle' }));
  return S.g({ transform: `translate(${x},${y}) scale(${s})` }, S.rect(-86, -104, 180, 220, '#000', { opacity: .3, rx: 8, transform: 'translate(8,10)' }), page(day + 1), flip > 0 ? page(day, 1 - flip, -flip * 140, -flip * 25) : page(day));
};
// football
PR.ball = (x, y, r, rot = 0) => S.g({ transform: `translate(${x},${y}) rotate(${rot})` }, S.circle(0, 0, r * 1.06, PAL.rim, { opacity: .8 }), S.circle(0, 0, r, '#f1ece4'),
  S.poly([0, 1, 2, 3, 4].map(i => [Math.sin(rad(i * 72)) * r * .38, -Math.cos(rad(i * 72)) * r * .38]), '#1b1418'),
  ...[0, 1, 2, 3, 4].map(i => { const a = rad(i * 72 + 36); return S.circle(Math.sin(a) * r * .92, -Math.cos(a) * r * .92, r * .26, '#1b1418'); }), S.circle(-r * .3, -r * .35, r * .25, '#fff', { opacity: .35 }));
PR.goal = (x, y, w = 520, h = 230) => {
  let net = '';
  for (let i = 0; i <= 14; i++) net += S.line(x - w / 2 + i * w / 14, y - h, x - w / 2 + 30 + i * (w - 60) / 14, y - 20, '#e6e6f0', 1.6, { opacity: .35 });
  for (let j = 0; j <= 8; j++) net += S.line(x - w / 2 + j * 30 / 8, y - h + j * (h - 20) / 8, x + w / 2 - j * 30 / 8, y - h + j * (h - 20) / 8, '#e6e6f0', 1.6, { opacity: .35 });
  return S.g({}, net, S.rect(x - w / 2 - 6, y - h - 6, 12, h + 6, '#f2f0f5'), S.rect(x + w / 2 - 6, y - h - 6, 12, h + 6, '#f2f0f5'), S.rect(x - w / 2 - 6, y - h - 8, w + 12, 12, '#f2f0f5'));
};
// upright piano (side-ish 3/4 view). x = centre, y = floor
PR.piano = (x, y, s = 1, o = {}) => S.g({ transform: `translate(${x},${y}) scale(${s})` },
  S.rect(-170, -270, 340, 270, '#2a1a1e', { rx: 6 }), S.rect(-170, -270, 340, 10, PAL.rim, { opacity: .5 }), S.rect(-160, -250, 320, 110, '#3a2429', { rx: 4 }),
  S.rect(-150, -240, 110, 90, '#efe3cf', { opacity: o.sheet ? .9 : 0, rx: 2, transform: 'rotate(-4,-95,-195)' }),
  S.rect(-185, -132, 370, 34, '#1d1215'), S.rect(-178, -128, 356, 18, '#f1ebe0'), ...Array.from({ length: 22 }, (_, i) => S.rect(-170 + i * 16.3, -128, 7, 11, '#141014')),
  S.rect(-160, -98, 20, 98, '#24171a'), S.rect(140, -98, 20, 98, '#24171a'), S.rect(-150, -60, 300, 8, '#1d1215'));
// top-down keyboard (keys pressed: set of indices). x,y = top-left, width w
PR.keysTop = (x, y, w, n = 21, pressed = {}, o = {}) => {
  const kw = w / n, kh = kw * 5.2;
  let s = S.rect(x - 20, y - 60, w + 40, kh + 90, o.body || '#21151a', { rx: 10 });
  for (let i = 0; i < n; i++) { const pr = pressed[i] || 0; s += S.rect(x + i * kw + 2, y, kw - 4, kh, mixc('#e3d6c3', o.hit || '#ffcf8a', pr), { rx: 4 }) + (pr > .5 ? glow(x + i * kw + kw / 2, y + kh * .7, kw * 1.5, o.hit || PAL.gold, .45) : ''); }
  for (let i = 0; i < n - 1; i++) { if ([2, 6].includes(i % 7)) continue; const pr = pressed[100 + i] || 0; s += S.rect(x + (i + 1) * kw - kw * .32, y, kw * .64, kh * .6, mixc('#141014', '#ff8a4a', pr), { rx: 3 }); }
  return s;
};
PR.laptop = (x, y, s = 1, screen = '', o = {}) => S.g({ transform: `translate(${x},${y}) scale(${s})` },
  S.poly([[-170, 0], [170, 0], [190, 18], [-190, 18]], '#3b3846'), S.rect(-160, -220, 320, 210, '#26232e', { rx: 10 }), S.rect(-148, -208, 296, 186, o.glow || '#1a1730'),
  S.g({ transform: 'translate(-148,-208)' }, screen), S.rect(-160, -220, 320, 6, PAL.rim, { opacity: .4 }));
// laptop screen content generator: code lines typed (progress 0..1)
function codeScreen(p, w = 296, h = 186, o = {}) {
  const r = rng(o.seed || 7); let s = S.rect(0, 0, w, h, '#15122a');
  const n = 11, shown = p * n;
  for (let i = 0; i < n; i++) {
    if (i > shown) break;
    const ind = (r() * 3 | 0) * 14, len = 40 + r() * 160, part = clamp(shown - i);
    const col = ['#ff79c6', '#8be9fd', '#50fa7b', '#f1fa8c', '#bd93f9'][i % 5];
    s += S.rect(10 + ind, 10 + i * 15, len * .25 * part, 7, col, { rx: 2 }) + S.rect(14 + ind + len * .27, 10 + i * 15, len * .73 * part, 7, '#cfd2e8', { rx: 2, opacity: .6 });
  }
  if (o.error) s += S.rect(0, h - 30, w, 30, '#5a1622') + S.text(10, h - 10, '✗ ERROR line 7', { 'font-family': 'Inter', 'font-size': 15, fill: '#ff8a8a' });
  if (o.ok) s += S.rect(0, h - 30, w, 30, '#174a2a') + S.text(10, h - 10, '✓ BUILD OK', { 'font-family': 'Inter', 'font-size': 15, fill: '#7dffa6' });
  return s;
}
PR.flashcard = (x, y, s, front, back, flip = 0, o = {}) => { // flip 0..1
  const k = Math.cos(flip * Math.PI), sx = Math.abs(k), txt = k >= 0 ? front : back;
  return S.g({ transform: `translate(${x},${y}) rotate(${o.r || 0}) scale(${s * Math.max(.02, sx)},${s})` }, S.rect(-160, -100, 320, 200, '#000', { opacity: .3, rx: 12, transform: 'translate(10,12)' }), S.rect(-160, -100, 320, 200, k >= 0 ? '#f3eadb' : '#e8dcc8', { rx: 12 }),
    S.rect(-160, -100, 320, 14, k >= 0 ? (o.band || '#d23b3b') : '#3b7bd2', { rx: 6 }), S.text(0, 22, txt, { 'font-family': o.font || 'Lilita One, IPAGothic', 'font-size': o.size || 56, fill: '#2d2420', 'text-anchor': 'middle' }));
};
PR.trophy = (x, y, s = 1) => S.g({ transform: `translate(${x},${y}) scale(${s})` }, S.rect(-50, -30, 100, 30, '#3a2a20', { rx: 4 }), S.rect(-14, -80, 28, 52, '#d9a63a'),
  S.path('M-60,-200 L60,-200 Q60,-110 0,-86 Q-60,-110 -60,-200Z', '#f2c14e'), S.path('M-60,-190 Q-100,-180 -86,-140 Q-76,-120 -48,-124', 'none', { stroke: '#f2c14e', 'stroke-width': 10 }), S.path('M60,-190 Q100,-180 86,-140 Q76,-120 48,-124', 'none', { stroke: '#f2c14e', 'stroke-width': 10 }),
  S.path('M-40,-196 L-20,-196 Q-22,-130 0,-100 Q-40,-120 -40,-196Z', '#fff2c4', { opacity: .55 }), glow(0, -150, 140, '#ffd27a', .25));
PR.photo = (x, y, s = 1, r = -6) => S.g({ transform: `translate(${x},${y}) rotate(${r}) scale(${s})` }, S.rect(-60, -80, 120, 100, '#efe3cf', { rx: 3 }), S.rect(-50, -70, 100, 70, '#e6a46a'),
  ch({ who: 'eli', x: -18, y: 0, h: 62, f: 1, expr: 'happy', light: { none: true } }), ch({ who: 'noah', x: 22, y: 0, h: 60, f: -1, expr: 'happy', light: { none: true } }), S.rect(-12, -12, 24, 10, '#5a5866'));
PR.chessboard = (x, y, s = 1) => { let q = ''; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) q += S.rect(-80 + i * 20, -80 + j * 20, 20, 20, (i + j) % 2 ? '#3a2a24' : '#e8dcc8'); return S.g({ transform: `translate(${x},${y}) scale(${s})` }, S.rect(-88, -88, 176, 176, '#5b3a2e', { rx: 4 }), q, S.circle(-30, -30, 7, '#111'), S.circle(10, 30, 7, '#fff'), S.circle(50, -10, 7, '#111')); };
PR.cube = (x, y, s = 1, t = 0) => { const cols = ['#d23b3b', '#3b7bd2', '#f2c230', '#2fa24d', '#f08a2a', '#f3eadb']; let q = ''; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) q += S.rect(-45 + i * 30, -45 + j * 30, 27, 27, cols[(i * 3 + j + Math.floor(t * 3)) % 6], { rx: 4 }); return S.g({ transform: `translate(${x},${y}) scale(${s}) rotate(${Math.sin(t * 2) * 6})` }, S.rect(-48, -48, 96, 96, '#111', { rx: 8 }), q); };
PR.circuitDiagram = (x, y, s = 1, o = {}) => {
  let d = S.rect(-220, -150, 440, 300, '#e9e1cf', { rx: 6 }) + S.rect(-220, -150, 440, 300, '#000', { opacity: 0, rx: 6 });
  d += S.pl([[-180, -90], [-60, -90], [-60, 40], [80, 40], [80, -90], [180, -90]], '#3a4a8a', 4) + S.pl([[-180, 90], [180, 90]], '#3a4a8a', 4);
  d += S.rect(-100, -110, 80, 40, 'none', { stroke: '#3a4a8a', 'stroke-width': 4 }) + S.text(-60, -84, 'MCU', { 'font-family': 'Oswald', 'font-size': 20, fill: '#3a4a8a', 'text-anchor': 'middle' });
  d += S.rect(110, -60, 70, 44, '#f08a2a', { rx: 4, opacity: .9 }) + S.text(145, -32, 'SENSOR', { 'font-family': 'Oswald', 'font-size': 14, fill: '#2a1a10', 'text-anchor': 'middle' });
  if (o.backup) d += S.rect(-200, 10, 76, 44, '#4aa3ff', { rx: 4 }) + S.text(-162, 38, 'BACKUP', { 'font-family': 'Oswald', 'font-size': 14, fill: '#0e2240', 'text-anchor': 'middle' }) + S.text(-162, 72, 'LEFT', { 'font-family': 'Oswald', 'font-size': 14, fill: '#2a64b8', 'text-anchor': 'middle' });
  if (o.note) d += S.text(-10, 132, o.note, { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 20, fill: '#c0392b', 'text-anchor': 'middle' }) + S.path('M90,120 Q130,100 140,-10', 'none', { stroke: '#c0392b', 'stroke-width': 3, 'marker-end': '' });
  if (o.metal) d += S.rect(-30, 100, 60, 26, '#8a8a99', { rx: 3 }) + S.text(0, 118, 'METAL', { 'font-family': 'Oswald', 'font-size': 13, fill: '#222', 'text-anchor': 'middle' });
  return S.g({ transform: `translate(${x},${y}) rotate(${o.r || 0}) scale(${s})` }, S.rect(-214, -142, 440, 300, '#000', { opacity: .3, rx: 6, transform: 'translate(8,10)' }), d);
};
PR.wrench = (x, y, s = 1, r = 0) => S.g({ transform: `translate(${x},${y}) rotate(${r}) scale(${s})` }, S.rect(-60, -7, 120, 14, '#9aa0b0', { rx: 7 }), S.path('M60,-18 a20,20 0 1 1 0,36 l-6,-12 l10,0 l0,-12 l-10,0Z', '#9aa0b0'), S.rect(-60, -7, 120, 4, '#fff', { opacity: .4 }));
PR.screwdriver = (x, y, s = 1, r = 0, col = '#4aa3ff') => S.g({ transform: `translate(${x},${y}) rotate(${r}) scale(${s})` }, S.rect(-60, -10, 56, 20, col, { rx: 8 }), S.rect(-6, -3, 70, 6, '#c9ccd6'));
PR.controller = (x, y, s = 1, o = {}) => S.g({ transform: `translate(${x},${y}) scale(${s}) rotate(${o.r || 0})` }, S.rect(-120, -60, 240, 120, '#2b2833', { rx: 40 }), S.rect(-120, -60, 240, 8, PAL.rim, { opacity: .5, rx: 4 }),
  S.circle(-60, 0, 26, '#1a1820'), S.circle(-60, 0, 14, '#3d3a48'), S.rect(30, -30, 70, 26, o.sw ? '#2fa24d' : '#5a5866', { rx: 8 }), S.circle(o.sw ? 85 : 45, -17, 11, '#e9e4dc'),
  S.text(65, 26, o.sw ? 'BACKUP' : 'MAIN', { 'font-family': 'Oswald', 'font-size': 18, fill: o.sw ? '#7dffa6' : '#cfcbd8', 'text-anchor': 'middle' }), S.text(65, 46, 'SENSOR', { 'font-family': 'Oswald', 'font-size': 14, fill: '#8f8a9a', 'text-anchor': 'middle' }));

// The robot (side view). x = centre, y = ground. o: {s, wheelRot, ledMain:'on|off|flicker', ledBackup, built (0..1), stripe}
PR.robot = (x, y, o = {}) => {
  const s = o.s || 1, wr = o.wheelRot || 0, built = o.built ?? 1;
  const wheel = (wx) => S.g({ transform: `translate(${wx},-28) rotate(${wr})` }, S.circle(0, 0, 30, '#161419'), S.circle(0, 0, 14, '#4a4655'), S.rect(-3, -28, 6, 56, '#2b2833'), S.rect(-28, -3, 56, 6, '#2b2833'));
  const main = o.ledMain === 'off' ? '#4a2a14' : PAL.glow, back = o.ledBackup ? '#6fd0ff' : '#1f3b5a';
  let s2 = S.g({ transform: 'translate(-5,-4)' }, S.rect(-130, -120, 260, 82, PAL.rim, { rx: 14, opacity: .8 }));
  s2 += S.rect(-130, -120, 260, 82, '#34303d', { rx: 14 }) + S.rect(-130, -120, 260, 14, '#4a4555', { rx: 8 });
  s2 += S.rect(-110, -96, 220, 9, '#d7383a', { rx: 3 }) + S.rect(-110, -82, 220, 9, '#8cc7f0', { rx: 3 });
  if (built > .3) s2 += S.rect(-40, -150, 80, 32, '#26232e', { rx: 6 }) + S.line(0, -150, 0, -186, '#26232e', 6) + S.circle(0, -190, 8, PAL.red);
  // main sensor (front = +x)
  s2 += S.rect(118, -104, 40, 34, '#f08a2a', { rx: 6 }) + S.circle(150, -87, 7, main) + (o.ledMain !== 'off' ? glow(150, -87, 30, PAL.glow, .7) : '');
  // backup sensor (left side — visible as a blue box at the rear-left in side view, labelled when needed)
  if (o.backup !== false) s2 += S.rect(-150, -100, 30, 28, '#3b7bd2', { rx: 5 }) + S.circle(-135, -86, 5, back) + (o.ledBackup ? glow(-135, -86, 26, '#6fd0ff', .7) : '');
  s2 += wheel(-80) + wheel(80);
  return S.g({ transform: `translate(${x},${y}) scale(${(o.f || 1) * s},${s})` }, s2);
};
// Robot top view (for course overheads). angle deg (0 = facing +x)
PR.robotTop = (x, y, ang, s = 1, o = {}) => {
  const main = o.ledMain === 'off' ? '#4a2a14' : PAL.glow;
  return S.g({ transform: `translate(${x},${y}) rotate(${ang}) scale(${s})` },
    S.rect(-56, -46, 112, 92, '#34303d', { rx: 12 }), S.rect(-56, -46, 112, 8, PAL.rim, { opacity: .5, rx: 4 }),
    S.rect(-44, -60, 34, 14, '#161419', { rx: 3 }), S.rect(10, -60, 34, 14, '#161419', { rx: 3 }), S.rect(-44, 46, 34, 14, '#161419', { rx: 3 }), S.rect(10, 46, 34, 14, '#161419', { rx: 3 }),
    S.rect(-40, -10, 80, 7, '#d7383a'), S.rect(-40, 3, 80, 7, '#8cc7f0'),
    S.rect(52, -14, 18, 28, '#f08a2a', { rx: 4 }), S.circle(64, 0, 5, main), o.ledMain !== 'off' ? glow(64, 0, 24, PAL.glow, .7) : '',
    S.rect(-14, -58, 28, 16, '#3b7bd2', { rx: 4 }), S.circle(0, -50, 4, o.ledBackup ? '#6fd0ff' : '#1f3b5a'), o.ledBackup ? glow(0, -50, 22, '#6fd0ff', .8) : '');
};
PR.barrier = (x, y, w = 120, h = 60, o = {}) => S.g({}, S.rect(x - w / 2, y - h, w, h, '#7d7f8f', { rx: 4 }), S.rect(x - w / 2, y - h, w, 8, '#c6c8d6', { rx: 3 }), S.line(x - w / 2 + 10, y - h + 24, x + w / 2 - 10, y - h + 24, '#5c5e6c', 4), o.glint ? glow(x, y - h, 50, '#c6c8d6', .3) : '');
PR.checker = (x, y, w, h, n = 10) => { let s = ''; const c = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < Math.round(h / c); j++) s += S.rect(x + i * c, y + j * c, c, c, (i + j) % 2 ? '#111' : '#eee'); return s; };
PR.phone = (x, y, s = 1) => S.g({ transform: `translate(${x},${y}) scale(${s})` }, S.rect(-30, -55, 60, 110, '#1b1820', { rx: 10 }), S.rect(-25, -48, 50, 92, '#3a5a9a', { rx: 4 }));
PR.lamp = (x, y, s = 1, on = 1) => S.g({ transform: `translate(${x},${y}) scale(${s})` }, S.rect(-30, -8, 60, 10, '#2a2530', { rx: 4 }), S.line(0, -6, -30, -90, '#2a2530', 8), S.line(-30, -90, 10, -140, '#2a2530', 8), S.path('M-10,-150 L40,-120 L20,-96 L-26,-128Z', '#3a3440'), on ? glow(20, -110, 120 * on, PAL.lamp, .55) : '');
PR.plant = (x, y, s = 1) => S.g({ transform: `translate(${x},${y}) scale(${s})` }, S.path('M-30,0 L30,0 L24,-50 L-24,-50Z', '#7a4a38'), ...[[-40, -120], [-10, -140], [20, -130], [44, -100], [-50, -90]].map(([lx, ly]) => S.path(`M0,-50 Q${lx / 2},${ly / 2 - 20} ${lx},${ly}`, 'none', { stroke: '#2e4a32', 'stroke-width': 14, 'stroke-linecap': 'round' })));
