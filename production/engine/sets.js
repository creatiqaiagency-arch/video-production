// Environments. Each E.SET.<name>(t, o) returns an array of layers {d, draw} (back → front)
// in a 1920×1080 world; shots add character layers (d≈1) and foreground layers (d>1).
(function () {
  const E = globalThis.E;
  const S = (E.SET = {});
  const P = {
    skyTop: '#85618f', skyMid: '#bb80a0', hor: '#e8a070', bldg: '#3a2433', bldgD: '#2a1826', far: '#6a4a66', street: '#593736',
    win: '#d8743a', winHi: '#ffc87a', awn: '#9a3a44', awnS: '#e8d2bc',
  };
  E.PAL = P;

  // ---------- primitives ----------
  const rect = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const win = (ctx, x, y, w, h, o = {}) => { // glowing window with mullions
    const lit = o.lit === undefined ? 1 : o.lit;
    if (lit > 0) {
      E.vgrad(ctx, x, y, w, h, [[0, E.mix(o.hi || P.winHi, o.lo || P.win, 0, 1)], [1, o.lo || P.win]]);
      if (o.glow !== false) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glow(ctx, x + w / 2, y + h * 0.4, Math.max(w, h) * 0.9, o.hi || P.winHi, 0.12 * lit); ctx.restore(); }
    } else rect(ctx, x, y, w, h, o.dark || '#241521');
    ctx.fillStyle = o.frame || '#2b1a26'; const cols = o.cols || 2, rows = o.rows || 2, fw = o.fw || Math.max(3, w * 0.035);
    for (let i = 1; i < cols; i++) ctx.fillRect(x + (w * i) / cols - fw / 2, y, fw, h);
    for (let j = 1; j < rows; j++) ctx.fillRect(x, y + (h * j) / rows - fw / 2, w, fw);
    ctx.lineWidth = fw * 1.4; ctx.strokeStyle = o.frame || '#2b1a26'; ctx.strokeRect(x, y, w, h);
    if (o.sil) { ctx.fillStyle = 'rgba(40,20,30,0.75)'; ctx.beginPath(); ctx.arc(x + w * o.sil, y + h * 0.55, h * 0.12, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x + w * o.sil - h * 0.1, y + h * 0.66, h * 0.2, h * 0.34); }
  };
  const tree = (ctx, x, y, s, c = '#1d1119') => { // lollipop tree, base at (x,y)
    ctx.fillStyle = c; ctx.fillRect(x - 5 * s, y - 160 * s, 10 * s, 160 * s);
    [[0, -230, 70], [-45, -195, 52], [45, -200, 55], [-20, -265, 50], [28, -255, 46]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); ctx.fill(); });
  };
  const lamp = (ctx, x, y, h, t, a = 1) => { // street lamp, base at (x,y)
    ctx.strokeStyle = '#1a0f17'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.quadraticCurveTo(x, y - h - 40, x + 45, y - h - 30); ctx.stroke();
    ctx.fillStyle = '#1a0f17'; ctx.beginPath(); ctx.ellipse(x + 50, y - h - 26, 22, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glow(ctx, x + 50, y - h - 18, 90, '#ffd59a', 0.55 * a); ctx.restore();
  };
  const awning = (ctx, x, y, w, h) => {
    const n = Math.round(w / 46); const sw = w / n;
    for (let i = 0; i < n; i++) { ctx.fillStyle = i % 2 ? P.awnS : P.awn; ctx.beginPath(); ctx.moveTo(x + i * sw, y); ctx.lineTo(x + (i + 1) * sw, y); ctx.lineTo(x + (i + 1) * sw + 6, y + h); ctx.arc(x + i * sw + sw / 2 + 3, y + h, sw / 2 + 3, 0, Math.PI); ctx.closePath(); ctx.fill(); }
    E.vgrad(ctx, x, y, w, h, [[0, 'rgba(30,10,20,0.15)'], [1, 'rgba(30,10,20,0.45)']]);
  };
  const pendant = (ctx, x, y, len, t, a = 1) => {
    ctx.strokeStyle = '#1a0f17'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + len); ctx.stroke();
    ctx.fillStyle = '#1a0f17'; ctx.beginPath(); ctx.moveTo(x - 26, y + len + 22); ctx.lineTo(x + 26, y + len + 22); ctx.lineTo(x + 10, y + len); ctx.lineTo(x - 10, y + len); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff1c9'; ctx.beginPath(); ctx.ellipse(x, y + len + 22, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glow(ctx, x, y + len + 24, 70, '#ffd59a', 0.6 * a); ctx.restore();
    E.cone(ctx, x, y + len + 22, 50, 260, 380, '#ffd59a', 0.10 * a);
  };
  const building = (ctx, x, y, w, h, col, o = {}) => { // base at y
    rect(ctx, x, y - h, w, h, col);
    E.vgrad(ctx, x, y - h, w, h, [[0, 'rgba(255,200,170,0.06)'], [1, 'rgba(0,0,0,0.25)']]);
    rect(ctx, x - 6, y - h - 10, w + 12, 14, E.mixHex(col, '#000000', 0.25));
    const rows = o.rows || 3, cols = o.cols || 3, ww = o.ww || 70, wh = o.wh || 90;
    const r = E.rng(o.seed || 1);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const wx = x + (w / cols) * (i + 0.5) - ww / 2, wy = y - h + 60 + j * (wh + 55);
      if (wy + wh > y - (o.groundFloor || 0)) continue;
      win(ctx, wx, wy, ww, wh, { lit: r() < (o.litP || 0.6) ? 1 : 0, sil: r() < 0.12 ? 0.3 + r() * 0.4 : 0 });
    }
  };
  const skyline = (ctx, y, col, seed = 3, x0 = -1400, x1 = 3400) => {
    const r = E.rng(seed); ctx.fillStyle = col; let x = x0;
    while (x < x1) { const w = 60 + r() * 140, h = 90 + r() * 260; ctx.fillRect(x, y - h, w, h + 400); if (r() < 0.3) ctx.fillRect(x + w * 0.4, y - h - 60, 10, 60); x += w + r() * 10; }
  };
  const treeLine = (ctx, y, col, seed = 4, x0 = -1400, x1 = 3400, s = 1) => { const r = E.rng(seed); ctx.fillStyle = col; for (let x = x0; x < x1; x += 40 * s + r() * 50 * s) { ctx.beginPath(); ctx.arc(x, y - 20 * s - r() * 40 * s, (40 + r() * 40) * s, 0, Math.PI * 2); ctx.fill(); } ctx.fillRect(x0, y - 20 * s, x1 - x0, 400); };
  const clouds = (ctx, t, y0 = 120, seed = 2, col = '#c993b3') => { const r = E.rng(seed); for (let i = 0; i < 7; i++) { const x = -800 + r() * 3600 + t * (6 + r() * 6), y = y0 + r() * 260, w = 300 + r() * 700; E.cloud(ctx, x, y, w, 26 + r() * 18, col, 0.45 + r() * 0.25); } };
  S._ = { win, tree, lamp, awning, pendant, building, skyline, treeLine, clouds, rect };

  // ---------- CAFÉ exterior (dusk) ----------
  S.cafeExt = (t, o = {}) => [
    { d: 0.05, draw: (c) => { E.sky(c, P.skyTop, P.skyMid, P.hor, -600, 760); E.sun(c, 960, 300, 70, t); E.rays(c, 960, 300, 1500, 16, '#ffd9b0', 0.10, t); clouds(c, t, 80); } },
    { d: 0.25, draw: (c) => { skyline(c, 760, '#5a3a5c', 7); } },
    { d: 0.6, draw: (c) => {
      building(c, -700, 900, 620, 900, P.bldgD, { rows: 4, cols: 3, seed: 3 });
      building(c, 1500, 900, 900, 960, P.bldgD, { rows: 4, cols: 4, seed: 5 });
      // café building
      rect(c, 230, 260, 1460, 640, P.bldg); rect(c, 220, 250, 1480, 22, '#2a1826'); rect(c, 230, 420, 1460, 14, '#2a1826');
      for (let i = 0; i < 5; i++) win(c, 300 + i * 280, 300, 120, 100, { lit: i % 2 ? 1 : 0.0, cols: 2, rows: 1 });
      c.fillStyle = '#2a1826'; c.beginPath(); c.arc(960, 470, 34, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#e8d2bc'; c.lineWidth = 3; c.stroke(); c.fillStyle = '#e8d2bc'; c.fillRect(946, 462, 22, 16); c.beginPath(); c.arc(970, 470, 6, -1.4, 1.4); c.stroke();
      win(c, 300, 560, 380, 300, { cols: 4, rows: 2 }); win(c, 760, 560, 400, 300, { cols: 4, rows: 2, sil: 0.6 }); win(c, 1240, 560, 150, 300, { cols: 1, rows: 2 }); win(c, 1450, 560, 180, 300, { cols: 2, rows: 2 });
      awning(c, 260, 500, 1400, 60);
      for (let i = 0; i < 6; i++) pendant(c, 380 + i * 230, 560, 10, t, 0.8);
      // planters
      for (let i = 0; i < 26; i++) { c.fillStyle = '#21121c'; c.beginPath(); c.arc(300 + i * 52, 862, 30, Math.PI, 0); c.fill(); }
      rect(c, 280, 860, 1360, 40, '#2a1826');
      lamp(c, 1790, 900, 420, t); tree(c, 1830, 900, 1.1);
    } },
    { d: 0.8, draw: (c) => { E.vgrad(c, -1500, 900, 4900, 600, [[0, '#4a2c34'], [1, '#2a1820']]); c.strokeStyle = 'rgba(255,200,170,0.08)'; c.lineWidth = 3; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(-1500, 960 + i * 40); c.lineTo(3400, 960 + i * 40); c.stroke(); } } },
  ];

  // ---------- CAFÉ interior counter (barista behind counter, warm) ----------
  S.cafeInt = (t, o = {}) => [
    { d: 0.1, draw: (c) => { E.vgrad(c, -1000, -400, 4000, 1800, [[0, '#5b3a3e'], [1, '#43343d']]); // back wall with big window to dusk street
      E.sky(c, P.skyTop, P.skyMid, P.hor, 120, 640, 120, 1700); E.sun(c, 1250, 470, 46, t); E.rays(c, 1250, 470, 900, 12, '#ffd9b0', 0.12, t);
      skyline(c, 640, '#6a4a66', 9, 120, 1820);
      c.fillStyle = '#2b1a26'; [120, 520, 920, 1320, 1720].forEach((x) => c.fillRect(x - 10, 120, 20, 520)); c.fillRect(110, 110, 1720, 24); c.fillRect(110, 630, 1720, 24);
      E.vgrad(c, -1000, 654, 4000, 600, [[0, '#4a2f36'], [1, '#33222b']]);
    } },
    { d: 0.45, draw: (c) => { // shelves, espresso machine, menu board
      c.fillStyle = '#2a1826'; c.fillRect(-300, 300, 360, 20); c.fillRect(1880, 300, 400, 20);
      for (let i = 0; i < 5; i++) { c.fillStyle = ['#e8d2bc', '#c98aa0', '#e8a070'][i % 3]; c.beginPath(); c.roundRect(-260 + i * 60, 250, 40, 50, 6); c.fill(); }
      for (let i = 0; i < 4; i++) pendant(c, 300 + i * 450, -60, 140, t, 0.9);
    } },
    { d: 0.85, draw: (c) => { // counter
      E.vgrad(c, -900, 760, 3800, 520, [[0, '#6b4038'], [0.08, '#4a2c2c'], [1, '#2a171c']]);
      rect(c, -900, 748, 3800, 18, '#8a5a48');
      // espresso machine
      c.fillStyle = '#c9c0c8'; c.beginPath(); c.roundRect(1500, 560, 300, 190, 18); c.fill(); c.fillStyle = '#8f8590'; c.fillRect(1520, 690, 260, 20); c.fillStyle = '#2a1826'; c.fillRect(1560, 640, 30, 50); c.fillRect(1700, 640, 30, 50);
      E.glow(c, 1650, 600, 80, '#ffffff', 0.08);
      // cups stack
      for (let i = 0; i < 4; i++) { c.fillStyle = '#efe6dc'; c.beginPath(); c.moveTo(1880 + i * 8, 748 - i * 36); c.lineTo(1940 + i * 8, 748 - i * 36); c.lineTo(1934 + i * 8, 716 - i * 36); c.lineTo(1886 + i * 8, 716 - i * 36); c.fill(); }
    } },
  ];

  // ---------- STREET (long side view, morning-dusk) ----------
  S.street = (t, o = {}) => [
    { d: 0.04, draw: (c) => { E.sky(c, '#7a6aa0', '#d79aa8', '#f2b07c', -600, 820, -2000, 9000); E.sun(c, 1400, 330, 60, t); E.rays(c, 1400, 330, 1600, 14, '#ffe0b8', 0.09, t); clouds(c, t, 100, 6, '#e6a9b8'); } },
    { d: 0.2, draw: (c) => skyline(c, 760, '#8a6a88', 11, -2000, 9000) },
    { d: 0.55, draw: (c) => { treeLine(c, 840, '#5a3e58', 6, -2000, 9000, 0.8); for (let i = 0; i < 9; i++) building(c, -1600 + i * 1050, 840, 900 + (i % 3) * 60, 520 + (i % 2) * 120, i % 2 ? '#6a4250' : '#5a3846', { rows: 2, cols: 4, seed: 20 + i, ww: 80, wh: 80 }); } },
    { d: 0.9, draw: (c) => { // shopfront row behind sidewalk
      for (let i = 0; i < 12; i++) { const x = -1800 + i * 760; rect(c, x, 300, 740, 560, i % 2 ? '#4a2c3c' : '#3f2634'); win(c, x + 60, 520, 330, 280, { cols: 3, rows: 2, sil: i % 3 === 0 ? 0.5 : 0 }); rect(c, x + 450, 540, 180, 320, '#2a1826'); win(c, x + 475, 565, 130, 150, { cols: 1, rows: 1 }); if (i % 3 === 1) awning(c, x + 40, 470, 380, 50); lamp(c, x + 700, 900, 470, t, 0.6); }
      E.vgrad(c, -2000, 860, 11000, 60, [[0, '#7a5052'], [1, '#62404a']]);
    } },
    { d: 1.0, draw: (c) => { E.vgrad(c, -2000, 900, 11000, 400, [[0, '#6d4648'], [1, '#3a2228']]); rect(c, -2000, 896, 11000, 8, '#8a6060'); c.fillStyle = 'rgba(255,220,190,0.07)'; for (let i = -40; i < 160; i++) c.fillRect(i * 70, 900, 3, 300); } },
  ];

  // ---------- CLASSROOM (side-ish view: chalkboard back wall, rows of desks) ----------
  S.classroom = (t, o = {}) => [
    { d: 0.15, draw: (c) => {
      E.vgrad(c, -1200, -400, 4400, 1500, [[0, '#5b3a3e'], [1, '#4a3238']]);
      rect(c, -1200, 700, 4400, 30, '#35232a'); // wainscot
      // windows on the left wall area with light
      for (let i = 0; i < 3; i++) { win(c, -1000 + i * 330, 160, 240, 420, { cols: 2, rows: 3, hi: '#ffd08a', lo: '#e0864a' }); }
      // chalkboard
      rect(c, 300, 180, 1320, 460, '#2f3f37'); c.strokeStyle = '#6b4a3a'; c.lineWidth = 18; c.strokeRect(300, 180, 1320, 460); rect(c, 300, 640, 1320, 16, '#6b4a3a');
      c.strokeStyle = 'rgba(230,240,230,0.55)'; c.lineWidth = 4; c.font = '600 40px Caveat'; c.fillStyle = 'rgba(235,240,230,0.7)'; c.textAlign = 'left';
      c.fillText('7.  Which of these is a prime number?', 360, 260); c.fillText('A) 21    B) 23    C) 27    D) 33', 400, 330); c.fillText('8.  x² = 49 , x = ?', 360, 430);
      // clock
      c.fillStyle = '#efe6dc'; c.beginPath(); c.arc(1780, 230, 52, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#2a1826'; c.lineWidth = 7; c.stroke(); c.lineCap = 'round'; const a = (o.clock || 0) + t * 0.05; c.beginPath(); c.moveTo(1780, 230); c.lineTo(1780 + Math.sin(a) * 36, 230 - Math.cos(a) * 36); c.stroke(); c.beginPath(); c.moveTo(1780, 230); c.lineTo(1780 + Math.sin(a / 12) * 24, 230 - Math.cos(a / 12) * 24); c.stroke();
      // posters
      rect(c, 2000, 260, 160, 220, '#c98aa0'); rect(c, 2200, 300, 140, 180, '#e8a070');
      E.vgrad(c, -1200, 730, 4400, 700, [[0, '#4a3036'], [1, '#2e1d24']]);
      // window light shafts on floor
      for (let i = 0; i < 3; i++) E.cone(c, -880 + i * 330, 200, 240, 700, 900, '#ffd59a', 0.06, -0.55);
    } },
    { d: 0.5, draw: (c) => { if (o.noDesksBack) return; for (let i = 0; i < 6; i++) desk(c, -400 + i * 420, 820, 1.0, '#6b4436'); } },
  ];
  const desk = (c, x, y, s, col = '#6b4436') => { c.fillStyle = col; c.fillRect(x - 130 * s, y - 120 * s, 260 * s, 22 * s); c.fillStyle = '#2a1826'; c.fillRect(x - 118 * s, y - 98 * s, 12 * s, 98 * s); c.fillRect(x + 106 * s, y - 98 * s, 12 * s, 98 * s); };
  E.desk = desk;

  // ---------- HALLWAY side view (lockers + windows) ----------
  S.hallway = (t, o = {}) => [
    { d: 0.1, draw: (c) => { E.vgrad(c, -2000, -400, 7000, 1500, [[0, '#5d3d44'], [1, '#4a3038']]); for (let i = 0; i < 8; i++) { win(c, -1600 + i * 700, 120, 300, 300, { cols: 2, rows: 2, hi: o.night ? '#7a6ab0' : '#ffd08a', lo: o.night ? '#4a3a7a' : '#d8743a' }); } } },
    { d: 0.6, draw: (c) => {
      for (let i = 0; i < 60; i++) { const x = -2400 + i * 110; const col = i % 2 ? '#3d5a73' : '#365069'; rect(c, x, 470, 104, 420, col); rect(c, x + 8, 480, 88, 8, 'rgba(0,0,0,0.25)'); for (let k = 0; k < 4; k++) rect(c, x + 22, 500 + k * 10, 60, 4, 'rgba(0,0,0,0.3)'); rect(c, x + 78, 660, 8, 40, '#c9c0c8'); }
      rect(c, -2400, 460, 7000, 14, '#2a1826');
      // notice board
      rect(c, o.boardX || 900, 210, 300, 190, '#8a5a48'); [['#f2c184', 20, 20], ['#c98aa0', 150, 40], ['#efe6dc', 60, 110], ['#9fc6ff', 190, 120]].forEach(([col, x, y]) => rect(c, (o.boardX || 900) + x, 210 + y, 90, 60, col));
    } },
    { d: 0.95, draw: (c) => { E.vgrad(c, -2600, 890, 7400, 500, [[0, '#6a4644'], [1, '#3a2428']]); rect(c, -2600, 886, 7400, 8, '#8a6060'); for (let i = 0; i < 8; i++) E.pool(c, -1450 + i * 700, 960, 260, 50, '#ffd59a', 0.18); } },
  ];

  // ---------- HALLWAY one-point perspective (long-lens corridor) ----------
  S.corridor = (t, o = {}) => [
    { d: 0.2, draw: (c) => {
      const vx = 960, vy = 470;
      E.vgrad(c, -1000, -500, 4000, 2000, [[0, '#5d3d44'], [1, '#3a262c']]);
      // far end window
      win(c, vx - 160, vy - 210, 320, 330, { cols: 3, rows: 3, hi: '#ffcf7a', lo: '#e8803a' }); E.glow(c, vx, vy - 40, 520, '#ffc27a', 0.3);
      // floor + ceiling planes
      c.fillStyle = '#4a3036'; c.beginPath(); c.moveTo(-1000, 1400); c.lineTo(vx - 180, vy + 140); c.lineTo(vx + 180, vy + 140); c.lineTo(2900, 1400); c.fill();
      c.fillStyle = '#4e343c'; c.beginPath(); c.moveTo(-1000, -500); c.lineTo(vx - 180, vy - 230); c.lineTo(vx + 180, vy - 230); c.lineTo(2900, -500); c.fill();
      // lockers in perspective on both walls
      for (const side of [-1, 1]) {
        for (let k = 0; k < 18; k++) { const z0 = Math.pow(0.82, k), z1 = Math.pow(0.82, k + 1); const x0 = vx + side * (180 + 2200 * z0), x1 = vx + side * (180 + 2200 * z1);
          const top0 = vy - 230 + (-500 - (vy - 230)) * z0 * 0.55 + 260 * z0, bot0 = vy + 140 + (1400 - vy - 140) * z0 * 0.55;
          const top1 = vy - 230 + (-500 - (vy - 230)) * z1 * 0.55 + 260 * z1, bot1 = vy + 140 + (1400 - vy - 140) * z1 * 0.55;
          c.fillStyle = k % 2 ? '#2c3550' : '#262e46'; c.beginPath(); c.moveTo(x0, top0); c.lineTo(x1, top1); c.lineTo(x1, bot1); c.lineTo(x0, bot0); c.closePath(); c.fill();
          c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 2; c.stroke(); }
      }
      // light from the end window: a warm trapezoid on the floor + rays (V3)
      c.save(); c.globalCompositeOperation = 'lighter'; const fg = c.createLinearGradient(0, vy + 140, 0, 1300); fg.addColorStop(0, 'rgba(255,208,138,0.32)'); fg.addColorStop(1, 'rgba(255,208,138,0)');
      c.fillStyle = fg; c.beginPath(); c.moveTo(vx - 150, vy + 140); c.lineTo(vx + 150, vy + 140); c.lineTo(vx + 620, 1300); c.lineTo(vx - 620, 1300); c.closePath(); c.fill(); c.restore();
      E.rays(c, vx, vy - 40, 1400, 10, '#ffcf8a', 0.08, t, Math.PI * 0.9, Math.PI / 2);
      // ceiling lights
      for (let k = 0; k < 7; k++) { const z = Math.pow(0.7, k); const y = vy - 230 - 500 * z * 0.9; E.glow(c, vx, y + 20, 160 * z + 20, '#fff1c9', 0.5); c.fillStyle = '#fff6df'; c.fillRect(vx - 120 * z - 10, y, 240 * z + 20, 10 * z + 3); }
      E.dust(c, t, { n: 40, color: '#ffe2b8', a: 0.4 });
    } },
  ];

  // ---------- CAFETERIA (side view) ----------
  S.cafeteria = (t, o = {}) => [
    { d: 0.1, draw: (c) => { E.vgrad(c, -2000, -500, 7000, 1600, [[0, '#5a4048'], [1, '#463038']]); for (let i = 0; i < 7; i++) win(c, -1500 + i * 620, 100, 380, 360, { cols: 3, rows: 3, hi: '#ffd08a', lo: '#e0864a' }); rect(c, -2000, 640, 7000, 26, '#33222a'); for (let i = 0; i < 7; i++) E.cone(c, -1310 + i * 620, 460, 380, 900, 700, '#ffd59a', 0.05, 0.3); } },
    { d: 0.4, draw: (c) => { for (let i = 0; i < 8; i++) pendant(c, -1300 + i * 560, -100, 150, t, 0.8); } },
    { d: 0.8, draw: (c) => { E.vgrad(c, -2600, 840, 7600, 600, [[0, '#6a4a48'], [1, '#3a2629']]); } },
  ];
  // long table (side view), centred x, top at y
  E.table = (c, x, y, w, col = '#7a5040') => { c.fillStyle = col; c.fillRect(x - w / 2, y, w, 22); c.fillStyle = '#2a1826'; c.fillRect(x - w / 2 + 30, y + 22, 16, 120); c.fillRect(x + w / 2 - 46, y + 22, 16, 120); for (let i = 0; i < w / 160; i++) { c.fillStyle = '#c9c0c8'; c.fillRect(x - w / 2 + 40 + i * 160, y - 8, 90, 8); c.fillStyle = ['#e8a070', '#8fb36a', '#efe6dc'][i % 3]; c.beginPath(); c.arc(x - w / 2 + 85 + i * 160, y - 12, 14, Math.PI, 0); c.fill(); } };

  // CAFETERIA view from behind Noah (perspective, double doors foreground frame)
  S.cafeteriaDeep = (t, o = {}) => [
    { d: 0.15, draw: (c) => {
      const vx = 960, vy = 430;
      E.vgrad(c, -1200, -500, 4400, 2000, [[0, '#5a4048'], [1, '#3e2a32']]);
      for (let i = 0; i < 5; i++) win(c, 360 + i * 250, 170, 190, 220, { cols: 2, rows: 2, hi: '#ffd08a', lo: '#e0864a' });
      c.fillStyle = '#54383c'; c.beginPath(); c.moveTo(-1200, 1500); c.lineTo(vx - 700, vy + 60); c.lineTo(vx + 700, vy + 60); c.lineTo(3100, 1500); c.fill();
      for (let k = 0; k < 6; k++) { const z = Math.pow(0.68, k); const y = vy + 60 + 700 * z * 0.75; const w = 1400 * z + 400; for (const sd of [-1, 1]) { c.fillStyle = '#7a5040'; c.fillRect(vx + sd * (120 + 200 * z) - (sd < 0 ? w * 0.55 : 0), y, w * 0.55, 18 * z + 4); } }
      for (let k = 0; k < 6; k++) { const z = Math.pow(0.7, k); E.glow(c, vx + (k % 2 ? -1 : 1) * 260 * z, vy - 120 - 300 * z, 120 * z + 30, '#ffd59a', 0.45); }
    } },
  ];

  // ---------- BATHROOM (symmetrical, cool) ----------
  S.bathroom = (t, o = {}) => [
    { d: 0.2, draw: (c) => {
      E.vgrad(c, -800, -400, 3600, 1600, [[0, '#3c5a66'], [1, '#2a3c46']]);
      c.strokeStyle = 'rgba(200,230,240,0.10)'; c.lineWidth = 3; for (let x = -800; x < 2800; x += 64) { c.beginPath(); c.moveTo(x, -400); c.lineTo(x, 900); c.stroke(); } for (let y = -400; y < 900; y += 64) { c.beginPath(); c.moveTo(-800, y); c.lineTo(2800, y); c.stroke(); }
      // stalls left/right
      for (let i = 0; i < 3; i++) { rect(c, 60 + i * 230, 360, 210, 520, '#5d7f8c'); rect(c, 60 + i * 230, 350, 210, 14, '#2a3c46'); rect(c, 1650 - i * 230, 360, 210, 520, '#5d7f8c'); rect(c, 1650 - i * 230, 350, 210, 14, '#2a3c46'); }
      // mirror centre-back
      rect(c, 820, 280, 280, 220, '#8fb0bc'); c.strokeStyle = '#2a3c46'; c.lineWidth = 10; c.strokeRect(820, 280, 280, 220); E.glow(c, 960, 390, 200, '#d8f0ff', 0.12);
      rect(c, 790, 520, 340, 40, '#c9d6dc');
      E.vgrad(c, -800, 880, 3600, 600, [[0, '#4a6670'], [1, '#22323a']]);
      c.strokeStyle = 'rgba(200,230,240,0.08)'; for (let i = -10; i < 40; i++) { c.beginPath(); c.moveTo(960, 880); c.lineTo(960 + i * 160 - 2400, 1500); c.stroke(); }
      // single overhead light
      c.fillStyle = '#1c2a30'; c.fillRect(940, -50, 40, 140); E.glow(c, 960, 120, 260, '#e8fbff', 0.55); E.cone(c, 960, 110, 80, 900, 900, '#e8fbff', 0.08);
      E.pool(c, 960, 960, 520, 90, '#e8fbff', 0.18);
    } },
  ];

  // ---------- BEDROOM night ----------
  S.bedroom = (t, o = {}) => [
    { d: 0.15, draw: (c) => {
      const m = !!o.morning;
      E.vgrad(c, -1000, -400, 4000, 1600, m ? [[0, '#6a4a5a'], [1, '#4a3040']] : [[0, '#262a52'], [1, '#1b1d3c']]);
      // window with moon (night) or sunrise (morning)
      if (m) { E.vgrad(c, 1180, 180, 420, 380, [[0, '#f6c98a'], [1, '#e8988a']]); E.sun(c, 1400, 470, 40, t); E.cone(c, 1390, 560, 420, 1100, 600, '#ffd59a', 0.12, 0.35); }
      else { rect(c, 1180, 180, 420, 380, '#0f1430'); E.vgrad(c, 1180, 180, 420, 380, [[0, '#1c2550'], [1, '#3a3a7a']]); c.fillStyle = '#f2f0e6'; c.beginPath(); c.arc(1460, 280, 38, 0, Math.PI * 2); c.fill(); E.glow(c, 1460, 280, 160, '#cfd8ff', 0.35); }
      c.fillStyle = '#121633'; c.fillRect(1380, 180, 14, 380); c.fillRect(1180, 360, 420, 14); c.strokeStyle = '#121633'; c.lineWidth = 16; c.strokeRect(1180, 180, 420, 380);
      E.cone(c, 1390, 560, 420, 900, 520, '#9fb0ff', 0.06, 0.25);
      // posters
      rect(c, 300, 220, 200, 260, '#8a5cff'); rect(c, 560, 260, 160, 200, '#3d8a8a'); c.fillStyle = '#efe6dc'; c.beginPath(); c.arc(400, 330, 40, 0, Math.PI * 2); c.fill();
      E.vgrad(c, -1000, 820, 4000, 700, [[0, '#2a2a50'], [1, '#141530']]);
      // bed
      c.fillStyle = '#3a3a72'; c.beginPath(); c.roundRect(-200, 700, 900, 160, 20); c.fill(); c.fillStyle = '#6b6bb0'; c.beginPath(); c.roundRect(-160, 660, 260, 70, 30); c.fill(); c.fillStyle = '#2a2a58'; c.fillRect(-200, 840, 900, 30);
    } },
  ];

  // ---------- COURTYARD (late-afternoon gold) ----------
  S.courtyard = (t, o = {}) => {
    const g = o.gold === undefined ? 1 : o.gold; // 1 golden, 0 cooler/tense
    const top = E.mixHex('#6d5a8a', '#8a6aa0', g), mid = E.mixHex('#b48aa0', '#e8a890', g), hor = E.mixHex('#d89a80', '#f6c98a', g);
    return [
      { d: 0.05, draw: (c) => { E.sky(c, top, mid, hor, -600, 700, -2000, 6000); E.sun(c, o.sunX || 1500, 420, 60, t); E.rays(c, o.sunX || 1500, 420, 1700, 18, '#ffe2b0', 0.1 + 0.05 * g, t); clouds(c, t, 100, 8, E.mixHex('#c993b3', '#f0b8a0', g)); } },
      { d: 0.3, draw: (c) => { // school building in back
        rect(c, -1400, 220, 4800, 480, '#5a3a46'); rect(c, -1400, 205, 4800, 22, '#3a2430');
        for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) win(c, -1300 + i * 300, 280 + j * 190, 150, 130, { cols: 2, rows: 2, lit: (i + j) % 3 ? 0.9 : 0, hi: '#ffd08a', lo: '#e0864a' });
        rect(c, 860, 470, 200, 230, '#2a1826'); win(c, 880, 490, 160, 180, { cols: 2, rows: 1 });
        treeLine(c, 720, '#3c2a3a', 12, -1600, 3600, 0.7);
      } },
      { d: 0.65, draw: (c) => { // ground with long shadows
        E.vgrad(c, -2400, 700, 6800, 900, [[0, E.mixHex('#7a5a52', '#a07058', g)], [1, '#4a3034']]);
        c.fillStyle = 'rgba(40,20,30,0.25)'; for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(-1800 + i * 520, 760); c.lineTo(-1700 + i * 520, 760); c.lineTo(-2400 + i * 520, 1500); c.lineTo(-2600 + i * 520, 1500); c.fill(); }
        // paving lines
        c.strokeStyle = 'rgba(255,220,190,0.08)'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-2400, 760 + i * i * 9); c.lineTo(4400, 760 + i * i * 9); c.stroke(); }
        // benches
        [[-300, 840], [2200, 840]].forEach(([x, y]) => { rect(c, x, y, 300, 18, '#6b4436'); rect(c, x + 20, y + 18, 14, 60, '#2a1826'); rect(c, x + 266, y + 18, 14, 60, '#2a1826'); rect(c, x, y - 60, 300, 14, '#6b4436'); });
      } },
      { d: 0.85, draw: (c) => { if (o.noTree) return; bigTree(c, o.treeX === undefined ? 520 : o.treeX, 880, 1.6, t); } },
    ];
  };
  const bigTree = (c, x, y, s, t) => {
    c.fillStyle = '#24141c'; c.beginPath(); c.moveTo(x - 24 * s, y); c.quadraticCurveTo(x - 10 * s, y - 200 * s, x - 4 * s, y - 330 * s); c.lineTo(x + 8 * s, y - 330 * s); c.quadraticCurveTo(x + 14 * s, y - 200 * s, x + 26 * s, y); c.fill();
    c.strokeStyle = '#24141c'; c.lineWidth = 12 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y - 260 * s); c.lineTo(x - 90 * s, y - 360 * s); c.moveTo(x, y - 290 * s); c.lineTo(x + 100 * s, y - 380 * s); c.stroke();
    const blobs = [[0, -430, 150], [-130, -380, 110], [130, -390, 115], [-70, -500, 110], [80, -510, 105], [-190, -320, 80], [190, -330, 80]];
    blobs.forEach(([dx, dy, r], i) => { const sw = Math.sin(t * 0.7 + i) * 3 * s; c.fillStyle = '#2a1620'; c.beginPath(); c.arc(x + dx * s + sw, y + dy * s, r * s, 0, Math.PI * 2); c.fill(); });
    blobs.forEach(([dx, dy, r], i) => { const sw = Math.sin(t * 0.7 + i) * 3 * s; c.fillStyle = 'rgba(240,160,110,0.18)'; c.beginPath(); c.arc(x + dx * s + sw + r * s * 0.25, y + dy * s - r * s * 0.2, r * s * 0.7, 0, Math.PI * 2); c.fill(); });
  };
  E.bigTree = bigTree;

  // ---------- SCHOOL ENTRANCE (sunset, steps, gate) ----------
  S.entrance = (t, o = {}) => [
    { d: 0.05, draw: (c) => { E.sky(c, '#7a5a90', '#e8988a', '#ffc27a', -600, 760, -2000, 6000); E.sun(c, 1500, 520, 70, t); E.rays(c, 1500, 520, 1800, 18, '#ffe6b8', 0.14, t); clouds(c, t, 120, 9, '#f2a8a0'); } },
    { d: 0.3, draw: (c) => { skyline(c, 760, '#8a5a70', 13, -2000, 5000); } },
    { d: 0.6, draw: (c) => {
      rect(c, -900, 180, 1500, 620, '#5a3446'); for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) win(c, -820 + i * 290, 240 + j * 220, 160, 150, { cols: 2, rows: 2, hi: '#ffd08a', lo: '#e0864a' });
      rect(c, 250, 470, 260, 330, '#2a1826'); win(c, 280, 500, 200, 200, { cols: 2, rows: 1 }); c.fillStyle = '#efe6dc'; c.font = '900 34px Nunito'; c.textAlign = 'center'; c.fillText('NORTHVIEW HIGH', 380, 450);
      for (let i = 0; i < 5; i++) rect(c, 200 - i * 20, 800 + i * 16, 360 + i * 40, 16, i % 2 ? '#6b4a48' : '#7a5452');
      // gate railings
      c.strokeStyle = '#1a0f17'; c.lineWidth = 6; for (let x = 700; x < 2600; x += 34) { c.beginPath(); c.moveTo(x, 880); c.lineTo(x, 700); c.stroke(); } c.lineWidth = 10; c.beginPath(); c.moveTo(700, 720); c.lineTo(2600, 720); c.stroke();
      lamp(c, 1400, 890, 430, t, 0.5); tree(c, 2000, 890, 1.2);
    } },
    { d: 0.9, draw: (c) => { E.vgrad(c, -2400, 880, 6800, 600, [[0, '#8a5a52'], [1, '#4a2c30']]); } },
  ];

  // ---------- THOUGHT VOID (overload space) ----------
  S.void = (t, o = {}) => [
    { d: 0.02, draw: (c) => { const g = c.createRadialGradient(960, 540, 50, 960, 540, 1400); g.addColorStop(0, o.core || '#4b3590'); g.addColorStop(1, '#0d0820'); c.fillStyle = g; c.fillRect(-1500, -1000, 4900, 3100); E.dust(c, t, { n: 90, color: '#c8b8ff', a: 0.6, size: 2.2, x: -400, y: -300, w: 2700, h: 1700 }); } },
  ];

  // ---------- generic interior wall for close-ups (soft gradient + bokeh) ----------
  S.soft = (t, o = {}) => [
    { d: 0.1, draw: (c) => { E.vgrad(c, -1000, -500, 4000, 2100, [[0, o.top || '#6a4450'], [1, o.bot || '#3a2630']]); if (o.window) { win(c, o.wx || 1200, o.wy || 160, 520, 520, { cols: 2, rows: 2, hi: o.hi || '#ffe6b8', lo: o.lo || '#f0b97a' }); E.glow(c, (o.wx || 1200) + 260, (o.wy || 160) + 260, 600, o.hi || '#ffd59a', 0.25); } E.bokeh(c, t, { n: 12, seed: o.seed || 3, colors: o.bokeh || ['#ffd9b0', '#f0a77e', '#c98aa0'], a: 0.09, x: -200, y: -100, w: 2300, h: 1200 }); } },
  ];
})();
