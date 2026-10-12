// Environments: layered, flat-shaded, softly lit dusk worlds. Each returns {back, mid, front} SVG strings (world coords).

const ENV = {};

function rectGrad(x, y, w, h, stops, dir = [0, 0, 0, 1], o = {}) { const g = linGrad(stops, ...dir); return `<defs>${g.def}</defs>` + S.rect(x, y, w, h, g.url, o); }
function sunRays(x, y, n, len, color, op = .18, rot = 0, spread = 360) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = rad(rot + (spread === 360 ? i * 360 / n : -spread / 2 + i * spread / (n - 1))), w = rad(spread === 360 ? 3.2 : spread / n * .35);
    s += S.poly([[x, y], [x + Math.cos(a - w) * len, y + Math.sin(a - w) * len], [x + Math.cos(a + w) * len, y + Math.sin(a + w) * len]], color, { opacity: op * (.6 + .4 * hash(i)) });
  }
  return S.g({ style: 'mix-blend-mode:screen' }, s);
}
function dust(t, n, x0, y0, w, h, seed = 3, col = '#ffe2b0', op = .5) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const bx = r() * w, by = r() * h, sp = .3 + r() * .7, rr = 1 + r() * 2.6, ph = r() * TAU;
    const x = x0 + ((bx + t * 12 * sp) % w), y = y0 + ((by - t * 6 * sp + h * 10) % h) + Math.sin(t * sp + ph) * 8;
    s += S.circle(x, y, rr, col, { opacity: op * (.3 + .7 * Math.abs(Math.sin(t * .7 * sp + ph))) });
  }
  return s;
}
function skyline(y, seed, col, x0 = -400, x1 = 2400, hmax = 220, lit = 0) {
  const r = rng(seed); let s = '', x = x0, win = '';
  while (x < x1) {
    const w = 50 + r() * 110, h = 40 + r() * hmax; s += S.rect(x, y - h, w, h + 400, col);
    if (r() < .35) s += S.rect(x + w * .4, y - h - 30, 6, 30, col);
    if (lit) for (let k = 0; k < 6; k++) if (r() < lit) win += S.rect(x + 8 + r() * (w - 20), y - h + 10 + r() * (h - 20), 5, 7, PAL.winHot, { opacity: .7 });
    x += w + r() * 10;
  }
  return s + win;
}
function treeLine(y, seed, col, x0 = -400, x1 = 2400, sz = 1) {
  const r = rng(seed); let s = '';
  for (let x = x0; x < x1; x += 30 + r() * 50) { const h = (40 + r() * 70) * sz, w = (24 + r() * 34) * sz; s += S.ellipse(x, y - h * .6, w, h * .6, col) + S.rect(x - 3, y - h * .3, 6, h * .3, col); }
  return s;
}
function windowPane(x, y, w, h, o = {}) {
  const cols = o.cols || 2, rows = o.rows || 3, fr = o.frame || '#24141c', glowC = o.glow || PAL.win, hot = o.hot || PAL.winHot;
  let s = rectGrad(x, y, w, h, [[0, hot, 1], [.6, glowC, 1], [1, shade(glowC, .8), 1]]);
  if (o.inside) s += o.inside;
  for (let i = 1; i < cols; i++) s += S.rect(x + i * w / cols - 4, y, 8, h, fr);
  for (let j = 1; j < rows; j++) s += S.rect(x, y + j * h / rows - 4, w, 8, fr);
  s += S.rect(x - 10, y - 10, w + 20, 14, fr) + S.rect(x - 10, y + h - 4, w + 20, 18, fr) + S.rect(x - 10, y - 10, 12, h + 20, fr) + S.rect(x + w - 2, y - 10, 12, h + 20, fr);
  return s;
}
function floorGrad(y, h, a, b) { return rectGrad(-600, y, W + 1200, h, [[0, a, 1], [1, b, 1]]); }
function wallGrad(a, b, y0 = -300, y1 = 800) { return rectGrad(-600, y0, W + 1200, y1 - y0, [[0, a, 1], [1, b, 1]]); }

// -------- CLASSROOM (golden hour) --------
ENV.classroom = (o = {}) => {
  const t = o.t || 0, fy = 760;
  let back = wallGrad('#2e1b26', '#3d2530', -300, fy) + floorGrad(fy, 600, '#2a1a1f', '#1a1014');
  for (let i = -12; i <= 24; i++) back += S.line(960 + i * 60, fy, 960 + i * 190, fy + 600, '#140b0f', 3, { opacity: .5 });
  back += S.rect(-600, fy - 6, W + 1200, 10, '#1d1016');
  // left windows
  for (let i = 0; i < 3; i++) back += windowPane(-420 + i * 300, 170, 220, 430, { cols: 2, rows: 3 });
  back += glow(-100, 380, 520, PAL.win, .35, 1.4);
  // chalkboard
  back += S.rect(760, 210, 820, 380, '#3a2a22') + S.rect(774, 224, 792, 352, '#1e2c29');
  const bt = o.board || 'ENGLISH';
  if (bt === 'ENGLISH') back += S.text(812, 300, 'ENGLISH', { 'font-family': 'Lilita One', 'font-size': 64, fill: '#e9efe6', opacity: .85 }) + S.text(812, 370, 'Poetry · Metaphors', { 'font-family': 'Inter', 'font-weight': 600, 'font-size': 38, fill: '#e9efe6', opacity: .7 }) + S.path('M812,420 q60,-30 120,0 t120,0 t120,0', 'none', { stroke: '#e9efe6', 'stroke-width': 4, opacity: .45 }) + S.text(812, 500, '"The sun is a ..."', { 'font-family': 'Inter', 'font-size': 34, fill: '#e9efe6', opacity: .55 });
  else if (bt === 'MATH') back += S.text(812, 300, 'ALGEBRA II', { 'font-family': 'Lilita One', 'font-size': 60, fill: '#e9efe6', opacity: .85 }) + S.text(812, 380, '3x² − 12x + 9 = 0', { 'font-family': 'Inter', 'font-weight': 600, 'font-size': 44, fill: '#e9efe6', opacity: .75 }) + S.text(812, 450, 'x = ?', { 'font-family': 'Inter', 'font-size': 40, fill: '#e9efe6', opacity: .6 });
  back += S.rect(774, 568, 792, 10, '#5a4636');
  back += PR.clock(1700, 250, 52, 2.25);
  back += S.rect(1640, 360, 220, 300, '#4a2c36') + S.rect(1660, 380, 180, 120, '#6a4a52') + S.rect(1660, 520, 180, 120, '#5a3a45');
  // light shafts on floor + wall
  back += shaft([[-200, 170], [40, 170], [760, fy + 260], [300, fy + 260]], PAL.winHot, .16) + shaft([[100, 170], [330, 170], [1100, fy + 260], [650, fy + 260]], PAL.winHot, .12);
  back += dust(t, 40, 0, 150, 1400, 650, 11, PAL.winHot, .45);
  return { back, fy };
};
// row of student desks with seated extras (mid layer helper)
function classDesks(y, xs, o = {}) {
  let s = '';
  const r = rng(o.seed || 5);
  xs.forEach((x, i) => {
    const sc = o.s || 1;
    if (o.students !== false && !(o.skip || []).includes(i)) s += ch({ who: 'extra', x: x - 40 * sc, y: y - 70 * sc, h: 250 * sc, f: o.f || 1, pose: P.sit(), expr: o.expr || 'neutral', t: (o.t || 0) + i, seed: i, light: o.light, turn: .3 });
    s += PR.desk(x, y, 200 * sc, { h: 100 * sc });
  });
  return s;
}

// -------- HALLWAY (heroic backlight, one-point perspective) --------
ENV.hallway = (o = {}) => {
  const t = o.t || 0, vx = 960, vy = 470;
  let back = S.rect(-600, -300, W + 1200, 1700, '#1a0e16');
  back += glow(vx, vy, 520, PAL.winHot, .85) + S.rect(vx - 130, vy - 220, 260, 330, '#ffe9c8') + glow(vx, vy, 260, '#fff', .6);
  // lockers both sides
  for (let side of [-1, 1]) for (let i = 0; i < 9; i++) {
    const d0 = 1 - i / 9, d1 = 1 - (i + 1) / 9;
    const xa = vx + side * (130 + 1100 * d0 * d0), xb = vx + side * (130 + 1100 * d1 * d1);
    const ya0 = vy - 220 - 460 * d0 * d0, yb0 = vy - 220 - 460 * d1 * d1, ya1 = vy + 110 + 560 * d0 * d0, yb1 = vy + 110 + 560 * d1 * d1;
    const col = mixc('#3a2433', '#7a4a52', 1 - d0);
    back += S.poly([[xa, ya0], [xb, yb0], [xb, yb1], [xa, ya1]], col) + S.line(xa, ya0, xa, ya1, '#1a0e16', 3) + S.line(xa + (xb - xa) * .5, lerp(ya0, yb0, .5) + 40, xa + (xb - xa) * .5, lerp(ya0, yb0, .5) + 80, '#1a0e16', 3);
  }
  back += S.poly([[vx - 130, vy + 110], [vx + 130, vy + 110], [W + 600, 1500], [-600, 1500]], '#24141c') + S.poly([[vx - 30, vy + 110], [vx + 30, vy + 110], [vx + 420, 1500], [vx - 420, 1500]], '#ffcf8a', { opacity: .18 });
  back += sunRays(vx, vy - 40, 18, 1500, PAL.winHot, .05, t * 3);
  back += dust(t, 60, 300, 100, 1300, 900, 21, PAL.winHot, .5);
  return { back, fy: 1000 };
};

// -------- BEDROOM (night, lamp) --------
ENV.bedroom = (o = {}) => {
  const t = o.t || 0, fy = 820, lamp = o.lamp ?? 1;
  let back = wallGrad(o.dawn ? '#1e1530' : '#120f24', o.dawn ? '#2c1e36' : '#1a1530', -300, fy) + floorGrad(fy, 600, '#15101f', '#0b0814');
  // window with moon + city
  const wx = 1250, wy = 160, ww = 460, wh = 400;
  const dawn = !!o.dawn;
  back += S.rect(wx, wy, ww, wh, '#141032') + (dawn ? rectGrad(wx, wy, ww, wh, [[0, '#4a3a7a', 1], [.6, '#c8789a', 1], [1, '#ffb38a', 1]]) + S.circle(wx + 330, wy + 330, 50, PAL.sun) + glow(wx + 330, wy + 330, 220, '#ffcf8a', .6) : rectGrad(wx, wy, ww, wh, [[0, '#2a2860', 1], [1, '#5a3a70', 1]]) + S.circle(wx + 330, wy + 100, 44, '#f4efe0') + glow(wx + 330, wy + 100, 140, '#bfc8ff', .35));
  back += S.g({}, `<clipPath id="wclip"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}"/></clipPath>`, S.g({ 'clip-path': 'url(#wclip)' }, skyline(wy + wh + 10, 9, '#120f2a', wx - 50, wx + ww + 50, 200, .5)));
  back += S.rect(wx + ww / 2 - 5, wy, 10, wh, '#0c0a1a') + S.rect(wx, wy + wh / 2 - 5, ww, 10, '#0c0a1a') + S.rect(wx - 14, wy - 14, ww + 28, 16, '#0c0a1a') + S.rect(wx - 20, wy + wh, ww + 40, 22, '#0c0a1a');
  back += S.path(`M${wx - 60},${wy - 30} L${wx + 40},${wy - 30} Q${wx + 10},${wy + 200} ${wx + 40},${wy + wh + 40} L${wx - 60},${wy + wh + 40}Z`, '#3a2448') + S.path(`M${wx + ww + 60},${wy - 30} L${wx + ww - 40},${wy - 30} Q${wx + ww - 10},${wy + 200} ${wx + ww - 40},${wy + wh + 40} L${wx + ww + 60},${wy + wh + 40}Z`, '#3a2448');
  // moon shaft
  back += shaft([[wx, wy + wh], [wx + ww, wy + wh], [wx + ww - 260, fy + 300], [wx - 500, fy + 300]], dawn ? '#ffb38a' : '#8f9cff', dawn ? .16 : .14);
  // posters + shelf
  back += S.rect(240, 180, 170, 230, '#3a2a4a') + S.circle(325, 270, 50, '#d7383a', { opacity: .6 }) + S.rect(450, 220, 140, 180, '#2a3a5a') + S.path('M470,380 L520,250 L570,380Z', '#5fd16a', { opacity: .5 });
  back += S.rect(640, 330, 320, 14, '#3a2a30') + PR.book(680, 330, 22, 70, '#6a3a4a', { r: 0 }) + PR.book(706, 330, 22, 64, '#3a5a6a') + PR.book(732, 330, 22, 74, '#7a6a3a') + PR.trophy(860, 330, .35);
  // bed (left)
  back += S.rect(-200, fy - 170, 600, 60, '#2c2442', { rx: 20 }) + S.rect(-200, fy - 120, 640, 120, '#3a2f55', { rx: 10 }) + S.rect(-220, fy - 260, 40, 260, '#2a2238', { rx: 8 }) + S.ellipse(40, fy - 165, 90, 34, '#d9d2e6', { opacity: .8 });
  // desk with lamp (centre)
  back += S.rect(660, fy - 230, 520, 22, '#4a3540') + S.rect(680, fy - 208, 16, 208, '#2a1e26') + S.rect(1140, fy - 208, 16, 208, '#2a1e26') + S.rect(980, fy - 208, 170, 150, '#3a2832');
  back += PR.lamp(1080, fy - 230, 1.1, lamp);
  if (lamp) back += glow(1100, fy - 340, 300, PAL.lamp, .45 * lamp, 1.2) + glow(1100, fy - 340, 70, '#fff3d0', .8 * lamp) + glow(950, fy - 228, 300, PAL.lamp, .28 * lamp, 2);
  back += dust(t, 25, 600, 200, 700, 500, 31, '#ffe0a8', .3 * lamp);
  return { back, fy, deskY: fy - 230, deskX: 920 };
};

// -------- MUSIC ROOM (sunset window, piano) --------
ENV.musicroom = (o = {}) => {
  const t = o.t || 0, fy = 800;
  let back = wallGrad('#3a2230', '#4a2c36', -300, fy) + floorGrad(fy, 600, '#2a1a1e', '#170e12');
  // tall arched windows
  for (const wx of [200, 1400]) {
    const w = 330, h = 520, y = 120;
    back += `<clipPath id="arch${wx}"><path d="M${wx},${y + h} L${wx},${y + w / 2} A${w / 2},${w / 2} 0 0 1 ${wx + w},${y + w / 2} L${wx + w},${y + h}Z"/></clipPath>`;
    back += S.g({ 'clip-path': `url(#arch${wx})` }, rectGrad(wx, y, w, h, [[0, '#8a5f8a', 1], [.55, '#e8a37a', 1], [1, '#ffcf8a', 1]]), S.circle(wx + w * .6, y + h * .75, 60, PAL.sun), treeLine(y + h + 10, wx, '#5a3040', wx - 50, wx + w + 50, .9), S.rect(wx + w / 2 - 5, y, 10, h, '#2a1620'), S.rect(wx, y + h * .55, w, 10, '#2a1620'));
    back += glow(wx + w / 2, y + h * .6, 420, PAL.win, .35);
    back += shaft([[wx, y + h], [wx + w, y + h], [wx + w + 300, fy + 300], [wx + 100, fy + 300]], PAL.winHot, .12);
  }
  back += S.rect(700, 240, 200, 150, '#2a1a20') + S.rect(712, 252, 176, 126, '#6a4a3a') + S.rect(960, 260, 140, 110, '#2a1a20') + S.rect(972, 272, 116, 86, '#4a5a6a');
  back += S.ellipse(960, fy + 90, 620, 70, '#5a2a30', { opacity: .55 });
  back += dust(t, 40, 100, 100, 1700, 700, 41, PAL.winHot, .45);
  return { back, fy };
};

// -------- FOOTBALL FIELD (sunset) --------
ENV.field = (o = {}) => {
  const t = o.t || 0, hy = 560;
  let back = rectGrad(-600, -300, W + 1200, hy + 300, [[0, '#2e2148', 1], [.45, '#7a4f80', 1], [.8, '#e19a78', 1], [1, '#ffcf8a', 1]]);
  const sx = o.sunX ?? 1300;
  back += glow(sx, hy - 40, 380, '#ffcf8a', .7) + S.circle(sx, hy - 40, 70, PAL.sun) + sunRays(sx, hy - 40, 22, 1400, '#ffe2b0', .08, t * 2);
  back += S.path(`M-600,${hy - 220} q300,-30 700,-10 t900,-20 t1200,10 l0,24 q-500,-10 -1000,6 t-1800,0Z`, '#c98a8a', { opacity: .35 });
  back += treeLine(hy, 77, '#4a2a44', -600, W + 600, 1.2) + treeLine(hy + 8, 78, '#3a1f36', -600, W + 600, .8);
  // floodlight towers
  for (const fx of [180, 1760]) back += S.line(fx, hy, fx, 200, '#2a1a30', 8) + S.rect(fx - 50, 170, 100, 46, '#2a1a30') + [0, 1, 2, 3].map(i => S.rect(fx - 42 + i * 22, 178, 16, 30, '#f4f6ff', { opacity: .7 })).join('') + glow(fx, 192, 120, '#f4f6ff', .3);
  back += S.rect(-600, hy - 30, W + 1200, 30, '#2a1a30', { opacity: .6 });
  for (let x = -600; x < W + 600; x += 40) back += S.line(x, hy - 30, x, hy, '#2a1a30', 3);
  // field stripes in perspective
  back += S.rect(-600, hy, W + 1200, 800, '#24503a');
  for (let i = 0; i < 9; i++) { const y0 = hy + Math.pow(i / 9, 1.7) * 600, y1 = hy + Math.pow((i + 1) / 9, 1.7) * 600; if (i % 2) back += S.rect(-600, y0, W + 1200, y1 - y0, '#2a5c40'); }
  back += rectGrad(-600, hy, W + 1200, 220, [[0, '#ffcf8a', .45], [1, '#ffcf8a', 0]]) + rectGrad(-600, 780, W + 1200, 500, [[0, '#10140f', 0], [1, '#10140f', .6]]);
  back += rectGrad(-600, hy, W + 1200, 160, [[0, '#ffcf8a', .35], [1, '#ffcf8a', 0]]);
  back += S.line(-600, hy + 40, W + 600, hy + 40, PAL.line, 3, { opacity: .5 }) + S.line(o.lineX ?? 900, hy + 40, (o.lineX ?? 900) - 120, 1200, PAL.line, 5, { opacity: .45 });
  back += dust(t, 30, 0, 200, W, 500, 51, '#ffe2b0', .35) + S.rect(-600, -300, W + 1200, H + 600, '#1a0f1a', { opacity: .14 });
  return { back, fy: 900, hy };
};

// -------- WORKSHOP (robotics lab). tod 0..1 moves the sun across the window --------
ENV.workshop = (o = {}) => {
  const t = o.t || 0, fy = 800, tod = o.tod ?? .35;
  const warm = mixc('#ffcf8a', '#ff9a6a', tod), wallA = mixc('#35242a', '#2a1c2a', tod);
  let back = wallGrad(shade(wallA, .85), wallA, -300, fy) + floorGrad(fy, 600, '#2a1d20', '#150d10');
  // big window wall (left)
  back += windowPane(-380, 110, 760, 420, { cols: 4, rows: 2, glow: mixc(PAL.win, '#d77a6a', tod), hot: warm, inside: treeLine(560, 5, '#6a3a4a', -400, 400, 1) });
  back += glow(0, 300, 600, warm, .3, 1.3);
  const ang = lerp(-260, 420, tod);
  back += shaft([[-380, 520], [380, 520], [380 + ang + 500, fy + 300], [-380 + ang, fy + 300]], warm, .15);
  // pegboard + tools
  back += S.rect(620, 200, 560, 300, '#5a463e') + Array.from({ length: 70 }, (_, i) => S.circle(640 + (i % 14) * 38, 220 + Math.floor(i / 14) * 58, 3, '#3a2a26')).join('');
  back += PR.wrench(720, 300, .8, -60) + PR.wrench(800, 300, .6, -70) + PR.screwdriver(900, 300, .9, -80, '#d7383a') + PR.screwdriver(960, 300, .9, -80, '#4aa3ff') + S.circle(1080, 290, 40, 'none', { stroke: '#b8901b', 'stroke-width': 8 }) + PR.wrench(1060, 420, .7, 0);
  // shelves w/ boxes (right)
  back += S.rect(1300, 230, 520, 14, '#3a2a26') + S.rect(1300, 380, 520, 14, '#3a2a26') + [0, 1, 2, 3].map(i => S.rect(1320 + i * 120, 170, 96, 60, ['#6a4a3a', '#5a5a6a', '#7a5a3a', '#4a5a4a'][i], { rx: 4 })).join('') + [0, 1, 2].map(i => S.rect(1330 + i * 150, 314, 120, 66, ['#4a4a5a', '#6a4a4a', '#5a5a3a'][i], { rx: 4 })).join('');
  back += S.text(1320, 520, 'ROBOTICS CLUB', { 'font-family': 'Lilita One', 'font-size': 40, fill: '#d7a87a', opacity: .5 });
  // hanging lamp
  back += S.line(1000, -300, 1000, 120, '#1a1214', 4) + S.path('M940,150 L1060,150 L1030,110 L970,110Z', '#2a1e22') + glow(1000, 170, 260, PAL.lamp, .35 * (o.lamp ?? 1));
  back += dust(t, 40, 0, 150, 1500, 600, 61, warm, .4);
  return { back, fy, warm };
};
// reverse angle of the workshop: door (right), metal shelving, whiteboard, cool high window
ENV.workshopRev = (o = {}) => {
  const t = o.t || 0, fy = 800, door = o.door ?? 0;
  let back = wallGrad('#241c26', '#2e2430', -300, fy) + floorGrad(fy, 600, '#231a1e', '#120b0e');
  back += S.rect(80, 80, 360, 150, '#141026') + rectGrad(80, 80, 360, 150, [[0, '#5a6aa8', 1], [1, '#2a2a55', 1]]) + S.rect(250, 80, 10, 150, '#141016') + glow(260, 155, 300, '#8f9cff', .35) + shaft([[80, 230], [440, 230], [900, fy + 250], [300, fy + 250]], '#8f9cff', .12);
  back += S.rect(560, 220, 420, 260, '#d9d4cc') + S.rect(560, 220, 420, 260, 'none', { stroke: '#3a3440', 'stroke-width': 10 }) + S.path('M600,400 q60,-80 120,-10 t140,-30', 'none', { stroke: '#3b7bd2', 'stroke-width': 5 }) + S.rect(620, 270, 120, 60, 'none', { stroke: '#d7383a', 'stroke-width': 5 }) + S.text(800, 300, 'v2 sensor?', { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 26, fill: '#3b7bd2' });
  for (let i = 0; i < 4; i++) back += S.rect(1040, 160 + i * 140, 280, 12, '#4a4a58') + [0, 1, 2].map(k => S.rect(1050 + k * 90, 100 + i * 140, 76, 60, ['#6a4a3a', '#4a5a6a', '#7a6a3a', '#5a3a4a'][(i + k) % 4], { rx: 4 })).join('');
  back += S.rect(1036, 100, 10, 700, '#3a3a48') + S.rect(1314, 100, 10, 700, '#3a3a48');
  // door
  back += S.rect(1440, 230, 300, 570, '#140c10') + S.rect(1452, 242, 276, 558, '#ffcf8a', { opacity: .55 * door + .05 }) + glow(1590, 520, 300, '#ffcf8a', .35 * door) + S.g({ transform: `translate(1452,242) scale(${1 - .85 * door},1)` }, S.rect(0, 0, 276, 558, '#4a3430'), S.circle(240, 290, 10, '#c9a65a')) + S.rect(1430, 220, 320, 20, '#2a1c20');
  back += S.text(1590, 200, 'EXIT', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 34, fill: '#5fe07a', 'text-anchor': 'middle' }) + glow(1590, 190, 80, '#5fe07a', .3);
  back += dust(t, 25, 0, 150, 1800, 600, 63, '#bfc8ff', .3);
  return { back, fy };
};
// workbench (front-ish 3/4). o: {tools, owner, photo, drawing, used}
function workbench(x, y, w = 520, o = {}) {
  let s = S.rect(x - w / 2, y - 190, w, 26, '#6a4a3a', { rx: 4 }) + S.rect(x - w / 2, y - 190, w, 6, PAL.rim, { opacity: .5 }) + S.rect(x - w / 2 + 14, y - 164, 20, 164, '#3a2620') + S.rect(x + w / 2 - 34, y - 164, 20, 164, '#3a2620') + S.rect(x - w / 2 + 30, y - 80, w - 60, 14, '#3a2620');
  if (o.tray) s += S.rect(x - 120, y - 214, 150, 24, o.tray, { rx: 4 }) + PR.screwdriver(x - 80, y - 216, .7, -8, '#4aa3ff') + PR.wrench(x - 20, y - 214, .4, 4);
  if (o.photo) s += PR.photo(x + w / 2 - 80, y - 190, .9, -8);
  if (o.drawing) s += PR.circuitDiagram(x - 40, y - 250, .38, { backup: true, r: -3 });
  return s;
}

// -------- ARENA (tournament hall) --------
ENV.arena = (o = {}) => {
  const t = o.t || 0, cheer = o.cheer || 0, fy = 820, warm = o.warm || 0;
  const flood = mixc('#dfe6ff', '#ffd79a', warm);
  let back = rectGrad(-600, -300, W + 1200, 1400, [[0, mixc('#0c0a1a', '#1a0f14', warm), 1], [.6, mixc('#191530', '#2a1a20', warm), 1], [1, '#110d1c', 1]]);
  // haze band + floodlight cones
  back += rectGrad(-600, 160, W + 1200, 520, [[0, flood, 0], [.5, flood, .07], [1, flood, 0]]);
  for (const fx of [200, 960, 1720]) back += shaft([[fx - 80, 175], [fx + 80, 175], [fx + 420, fy + 260], [fx - 420, fy + 260]], flood, .16);
  // banners
  back += S.rect(560, 210, 800, 84, mixc('#2a1f4a', '#4a2a2a', warm)) + S.text(960, 272, 'ROBOTICS CUP', { 'font-family': 'Lilita One', 'font-size': 60, fill: PAL.gold, 'text-anchor': 'middle', 'letter-spacing': 6 });
  // bleachers + desaturated crowd (top rows darker)
  const r = rng(o.seed || 91);
  const backBefore = back; back = '';
  for (let row = 0; row < 6; row++) {
    const y = 330 + row * 58, dark = .75 - row * .09;
    back += S.rect(-600, y + 26, W + 1200, 34, mixc('#1c1730', '#2a2442', row / 6));
    for (let x = -560 + (row % 2) * 22; x < W + 560; x += 44) {
      if (r() < .12) continue;
      const bob = Math.sin(t * 9 + x * .05 + row) * 6 * cheer * (r() < .7 ? 1 : 0);
      const shirt = mixc(['#5a4a7a', '#7a4a5a', '#4a6a7a', '#6a6a4a', '#3a3a5a', '#8a5a3a'][Math.floor(r() * 6)], '#221c34', dark);
      const arm = cheer > .3 && r() < .5;
      back += S.rect(x - 10, y - 4 + bob, 20, 30, shirt, { rx: 6 }) + S.circle(x, y - 16 + bob, 12, '#0b0810') + S.path(`M${x - 9},${y - 24 + bob} a12,12 0 0 1 18,0`, 'none', { stroke: flood, 'stroke-width': 2, opacity: .35 }) + (arm ? S.line(x + 8, y + bob, x + 16, y - 30 + bob, '#0b0810', 6) : '');
    }
  }
  back = backBefore + (o.crowdBlur ? `<g filter="url(#b${o.crowdBlur})">${back}</g>` : back);
  if (o.spot) back += `<defs>${radGrad([[0, '#000', 0], [.25, '#000', 0], [1, '#000', .55]], .5, .5, .5).def}</defs>`.replace(/id="(rg\d+)"/, 'id="spotg"') + S.rect(o.spot[0] - 700, o.spot[1] - 400, 1400, 800, 'url(#spotg)');
  back += rectGrad(-600, 600, W + 1200, 240, [[0, '#110d1c', 0], [1, '#110d1c', 1]]);
  // floodlight clusters (below the letterbox) with bloom
  for (const fx of [200, 960, 1720]) back += S.rect(fx - 90, 120, 180, 54, '#16121f', { rx: 6 }) + [0, 1, 2, 3, 4].map(i => S.rect(fx - 80 + i * 34, 130, 26, 32, '#fbfcff', { rx: 3 })).join('') + glow(fx, 146, 300, flood, .55) + glow(fx, 146, 140, '#ffffff', .85) + S.ellipse(fx, 146, 420, 4, '#ffffff', { opacity: .45, style: 'mix-blend-mode:screen' });
  // scoreboard
  if (o.board !== false) back += S.rect(1440, 300, 340, 160, '#0a0810', { rx: 10, stroke: '#3a3350', 'stroke-width': 6 }) + S.text(1610, 360, o.roundTxt || 'ROUND 1', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 36, fill: PAL.gold, 'text-anchor': 'middle' }) + S.text(1610, 438, o.clock || '1:00', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 70, fill: o.clockCol || PAL.red, 'text-anchor': 'middle' }) + glow(1610, 400, o.redSpill ? 520 : 200, o.clockCol || PAL.red, o.redSpill ? .35 : .2);
  // floor with pool of light behind the course
  back += S.rect(-600, fy - 80, W + 1200, 900, '#141120') + glow(960, fy, 700, flood, .16, 2.2) + rectGrad(-600, fy - 80, W + 1200, 300, [[0, '#3a3456', .35], [1, '#3a3456', 0]]);
  back += dust(t, 40, 0, 100, W, 700, 71, flood, .35);
  return { back, fy };
};
// course table in 3/4 side view: table top from x0 to x1 at height y
function courseTable(x0, x1, y, o = {}) {
  let s = S.poly([[x0 - 40, y + 70], [x1 + 40, y + 70], [x1, y], [x0, y]], '#24304a') + S.poly([[x0 - 40, y + 70], [x1 + 40, y + 70], [x1 + 40, y + 96], [x0 - 40, y + 96]], '#151b2c') + S.rect(x0 - 20, y + 96, 16, 200, '#151b2c') + S.rect(x1 + 4, y + 96, 16, 200, '#151b2c');
  s += S.line(x0 - 20, y + 35, x1 + 20, y + 35, '#e9e4dc', 3, { opacity: .35, 'stroke-dasharray': '20 16' });
  if (o.finish !== false) s += S.g({ transform: `translate(${x1 - 60},${y})` }, PR.checker(0, 0, 50, 70, 5));
  return s;
}
// top-down course map. route: array of [x,y]
function courseTop(o = {}) {
  let s = S.rect(260, 140, 1400, 800, '#24304a', { rx: 20 }) + S.rect(260, 140, 1400, 800, 'none', { rx: 20, stroke: '#3a4a6a', 'stroke-width': 10 });
  for (let i = 0; i < 14; i++) s += S.line(260 + i * 100, 140, 260 + i * 100, 940, '#2e3a58', 2) + (i < 8 ? S.line(260, 140 + i * 100, 1660, 140 + i * 100, '#2e3a58', 2) : '');
  s += S.rect(300, 470, 120, 140, '#2fa24d', { opacity: .35, rx: 8 }) + S.text(360, 640, 'START', { 'font-family': 'Oswald', 'font-size': 30, fill: '#7dffa6', 'text-anchor': 'middle' });
  s += S.g({ transform: 'translate(1540,460)' }, PR.checker(0, 0, 80, 160, 4)) + S.text(1580, 660, 'FINISH', { 'font-family': 'Oswald', 'font-size': 30, fill: '#fff', 'text-anchor': 'middle' });
  // barriers (metal)
  const bars = o.barriers || [[760, 300, 40, 260], [1100, 520, 40, 300], [1300, 260, 40, 200]];
  bars.forEach(([x, y, w, h], i) => s += S.rect(x, y, w, h, '#8a8c9c', { rx: 4 }) + S.rect(x, y, 8, h, '#c6c8d6') + (o.hiBar === i ? glow(x + w / 2, y + h / 2, 160, PAL.red, .35 * (o.hiK ?? 1)) : ''));
  if (o.route) s += S.pl(o.route, o.routeCol || '#fff', 5, { 'stroke-dasharray': '18 14', opacity: o.routeOp ?? .6 });
  if (o.bad) s += S.pl(o.bad, PAL.red, 6, { 'stroke-dasharray': '10 10', opacity: .8 });
  return s;
}

// -------- STREET / SCHOOL EXTERIOR at dusk --------
ENV.school = (o = {}) => {
  const t = o.t || 0, fy = 860;
  let back = rectGrad(-600, -300, W + 1200, fy + 300, [[0, '#2a1f48', 1], [.5, '#6a4a7a', 1], [.85, '#d98a78', 1], [1, '#ffcf8a', 1]]);
  back += glow(1500, 620, 380, '#ffcf8a', .5) + S.circle(1500, 640, 60, PAL.sun);
  back += skyline(720, 13, '#3a2440', -600, W + 600, 160);
  // school building
  back += S.rect(260, 280, 1400, 560, '#3a2230') + S.rect(260, 280, 1400, 20, '#5a3a45') + S.poly([[760, 280], [960, 160], [1160, 280]], '#33202c');
  if (o.sign !== false) back += S.text(960, 250, 'WESTBROOK HIGH', { 'font-family': 'Lilita One', 'font-size': 38, fill: '#e6c79a', 'text-anchor': 'middle', 'letter-spacing': 4 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) { const lit = hash(r * 10 + c + 3) > .35; back += S.rect(320 + c * 135, 330 + r * 150, 80, 100, lit ? PAL.win : '#2a1820') + (lit ? glow(360 + c * 135, 380 + r * 150, 80, PAL.win, .25) : ''); }
  back += S.rect(890, 690, 140, 150, '#24141c') + S.rect(900, 700, 120, 140, '#ffcf8a', { opacity: .75 }) + S.poly([[900, 840], [1020, 840], [1180, 1100], [740, 1100]], '#ffcf8a', { opacity: .18 });
  back += treeLine(fy, 33, '#24141c', -600, 300, 1.8) + treeLine(fy, 34, '#24141c', 1650, W + 600, 1.8);
  back += S.rect(-600, fy, W + 1200, 400, '#1e1218') + S.rect(-600, fy, W + 1200, 10, '#3a2230');
  for (const lx of [200, 1720]) back += S.line(lx, fy, lx, 560, '#140b10', 8) + S.circle(lx, 556, 14, PAL.lamp) + glow(lx, 560, 160, PAL.lamp, .4);
  back += dust(t, 20, 0, 200, W, 600, 81, '#ffe2b0', .3);
  return { back, fy };
};

// -------- GRAPHIC SPACE (dark plum void with soft glow) for diagrams/cards --------
ENV.void = (o = {}) => ({ back: rectGrad(-600, -300, W + 1200, H + 600, [[0, o.top || '#1e1226', 1], [1, o.bottom || '#0e0810', 1]]) + glow(W / 2, H / 2, 900, o.glow || '#5a2a4a', .5) + dust(o.t || 0, 30, 0, 0, W, H, 99, '#ffe2b0', .25) });
