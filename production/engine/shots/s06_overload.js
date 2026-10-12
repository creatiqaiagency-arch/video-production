// SCENE 6 (V2) — Information overload · SCENE 7 — Can't escape · SCENE 8 — Leo's thought.
(function () {
  const E = globalThis.E;
  const K = E.KEY;
  const VRIM = K.violet;
  // overload space: radial violet void, top spotlight cone on Noah, floor pool
  const voidSpot = (t, core = '#4b2fa0') => [{ d: 0.02, draw: (c) => { const g = c.createRadialGradient(960, 600, 60, 960, 560, 1400); g.addColorStop(0, core); g.addColorStop(1, '#120a26'); c.fillStyle = g; c.fillRect(-1500, -1000, 4900, 3100); E.dust(c, t, { n: 80, color: '#c8b8ff', a: 0.5, size: 2, x: -400, y: -300, w: 2700, h: 1700 }); } },
    { d: 0.5, draw: (c) => { E.cone(c, 960, -200, 200, 900, 1300, '#c9a6ff', 0.16); E.pool(c, 960, 1000, 520, 90, '#c9a6ff', 0.3); } }];
  const panelsAt = (d, seed, n, t, t0, o = {}) => ({ d, draw: (c) => E.panelField(c, t, Object.assign({ seed, n, x: -500, y: -150, w: 2900, h: 1350, t0, spread: 1.5, texts: E.CROWD_TEXT, a: 0.75 }, o)) });

  // 6A — orbit: Noah in the spotlight, thought panels on three depth layers moving at different speeds
  E.cut('s06a_orbit', E.M('S06'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const ang = lt * 0.14;
    const cam = E.cam({ z: 1.0 + lt * 0.02, rot: Math.sin(ang) * 0.05, x: 960 + Math.sin(ang * 2) * 260, focus: 1, ap: 9 });
    const L = voidSpot(t);
    L.push({ d: 0.3, draw: (c) => { for (let k = 0; k < 7; k++) { const z = Math.pow(0.72, k); c.fillStyle = E.rgba('#7a5040', 0.45 * z + 0.1); for (const sd of [-1, 1]) c.fillRect(960 + sd * (160 + 900 * z) - 600 * z, 560 + 420 * z, 1200 * z, 16 * z + 3); } } });
    L.push(panelsAt(0.4, 11, 18, t, s.t0 - 1, { a: 0.45, scale: 0.7 }));
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 980, h: 470, f: Math.sin(ang * 3) * 0.6, pose: 'clutch', expr: 'worried', look: [Math.sin(lt * 2), -0.3], rim: { dx: 0.2, dy: -1, color: '#d9c9ff', k: 1.2 } }) });
    L.push(panelsAt(1.5, 12, 7, t, s.t0 + 0.3, { a: 0.8 }));
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Orbit: Noah alone in a violet spotlight; thought panels hang on three depth layers and slide past at different speeds ("one person\'s thoughts was amazing").', post: { bloom: 0.35, vignette: 0.6 } });

  // 6B — real top-down cafeteria: tables in slight perspective; thought windows rise toward camera; counter to 200
  E.cut('s06b_overhead', E.sg('s06_vo1', 2) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.0 + lt * 0.05, rot: lt * 0.015, focus: 1, ap: 0 });
    ctx.save(); E.applyCam(ctx, cam, 1);
    E.vgrad(ctx, -400, -300, 2700, 1700, [[0, '#3a262c'], [0.5, '#4e3438'], [1, '#3a262c']]);
    E.pool(ctx, 960, 540, 900, 520, '#ffd59a', 0.18);
    let n = 0;
    for (let row = 0; row < 5; row++) {
      const y = 170 + row * 190, sk = 1 + (row - 2) * 0.04;
      ctx.fillStyle = '#6b4436'; ctx.fillRect(-60, y, 2040, 46);
      for (let i = 0; i < 15; i++) for (const sd of [-1, 1]) {
        const x = -20 + i * 140 * sk + (sd > 0 ? 60 : 0), yy = y + 23 + sd * 62;
        ctx.fillStyle = E.extra(700 + n).topC; ctx.beginPath(); ctx.ellipse(x, yy + sd * 26, 34, 14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f0a77e'; ctx.beginPath(); ctx.arc(x + 3, yy - 2, 26, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0a080d'; ctx.beginPath(); ctx.arc(x, yy, 26, 0, Math.PI * 2); ctx.fill();
        const p = E.pop(lt, (n / 150) * D * 0.7, 0.3); if (p > 0) { const rise = Math.min(1, (lt - (n / 150) * D * 0.7) * 0.8); E.thought(ctx, { x: x + 24, y: yy - 40 - rise * 20, w: 56, h: 28, s: p * (1 + rise * 0.3), a: 0.85, seed: n, noClamp: true }, t); }
        n++;
      }
    }
    ctx.restore();
    // tilt-shift + edge darkening
    E.screenFill(ctx, '#000000', 0, 'source-over');
    const vg = ctx.createLinearGradient(0, 0, 0, 1080); vg.addColorStop(0, 'rgba(10,4,14,0.55)'); vg.addColorStop(0.3, 'rgba(10,4,14,0)'); vg.addColorStop(0.7, 'rgba(10,4,14,0)'); vg.addColorStop(1, 'rgba(10,4,14,0.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, 1920, 1080);
    const cnt = Math.min(200, Math.floor(E.clamp(lt / (D * 0.75)) * 200));
    ctx.fillStyle = 'rgba(14,8,22,0.72)'; ctx.beginPath(); ctx.roundRect(700, 105, 520, 80, 18); ctx.fill();
    E.label(ctx, `${cnt} THOUGHTS`, 960, 146, 1, 48);
  }, { type: 'TOP', desc: 'Top-down over the cafeteria: long tables, a thought window rises over every head; a counter ticks up to "200 THOUGHTS".', post: { bloom: 0.3 } });

  // 6C — "Not so much." Noah deadpan, wincing
  E.cut('s06c_notsomuch', E.sg('s06_vo1', 5) - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.1, z1: 1.15, focus: 1, ap: 14 });
    const L = E.SET.cafPersp(t); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1150, 480), h: 1150, f: 0.1, pose: 'crossed', expr: 'tired', tilt: -0.08, rim: { dx: 1, dy: -0.5, color: '#ffd08a' }, ground: false, shadow: false }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => E.panelField(c, t, { seed: 14, n: 12, x: 0, y: 80, w: 1920, h: 880, t0: s.t0, spread: 0.6, texts: E.CROWD_TEXT, a: 0.7, scale: 0.85 }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Close-up: Noah, arms crossed, deadpan and wincing, boxed in by thought windows ("Not so much.").' });

  // 6D — students at a cafeteria table (benches), mouths shut, thoughts popping
  E.cut('s06d_crowd1', E.st('s06_c1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 960, dx: 50, focus: 1, ap: 10, rot: 0.03 });
    const L = E.SET.cafeteria(t);
    L.push({ d: 1, draw: (c) => { ['s06_c1', 's06_c2', 's06_c3'].forEach((id, i) => { const x = [460, 960, 1460][i]; E.char(c, { x, y: 1080, h: 600, f: i % 2 ? -0.5 : 0.5, costume: E.extra(10 + i), pose: 'sitDesk', expr: ['tired', 'worried', 'sad'][i], t, seed: i, rim: { dx: 1, dy: -0.4, color: '#ffd08a' }, talk: 0, seat: '#3a2420' }); E.th(c, id, t, { x: x + (i % 2 ? -60 : 60), y: 330 + (i % 2) * 70, w: 420, h: 110, tail: [x, 500], size: 42, post: 1.5 }); }); E.table(c, 960, 880, 2600); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Students on a bench at a cafeteria table, mouths shut, thoughts popping: "I\'m starving." / "Why did she leave me on read?" / "I hate Mondays."' });
  // 6E — high 3/4 angle down the length of a table
  E.cut('s06e_crowd2', E.st('s06_c4') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, x: 980, y: 560, focus: 1, ap: 6, rot: -0.04 });
    const L = E.SET.cafPersp(t);
    L.push({ d: 1, draw: (c) => { E.tableP(c, 1, 0.0, 0.7); const ids = ['s06_c4', 's06_c5', 's06_c6', 's06_c7', 's06_c8'];
      ids.forEach((id, i) => { const z = 0.6 - i * 0.12; const y = 600 + 780 * z; const kk = (y - 450) / 150; const x = 1010 + (260 - 150) * kk; const h = 125 * kk; E.char(c, { x, y, h, f: 0.6, costume: E.extra(30 + i), pose: 'sit', t, seed: i, rim: { dx: -0.6, dy: -1, color: '#ffe6b8' }, talk: 0, seat: '#3a2420' }); E.th(c, id, t, { x: x - 260 * kk * 0.4 - 120, y: y - h - 30, w: 340, h: 90, tail: [x, y - h], size: 34, post: 1.2 }); }); } });
    E.layers(ctx, cam, L);
  }, { type: 'HIGH', desc: 'High 3/4 angle down a long table: one thought after another — "Did I fail chemistry?" / "Does anyone even like me?" / "Is my hair weird today?" …' });

  // 6F — Dutch high angle over the panels ("Everyone was thinking something different")
  E.cut('s06f_dutch', E.st('s06_vo2') - 0.35, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.1 + lt * 0.05, rot: 0.12, x: 980, y: 520, focus: 0.6, ap: 8 });
    const L = voidSpot(t, '#5a3aa8');
    L.push(panelsAt(0.6, 21, 40, t, s.t0 - 3, { a: 0.75, scale: 0.75 }));
    L.push({ d: 0.6, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 900, h: 300, f: 0.2, pose: 'ears', expr: 'squint', rim: { dx: 0, dy: -1, color: '#d9c9ff' } }) });
    L.push(panelsAt(1.4, 22, 8, t, s.t0, { a: 0.8 }));
    E.layers(ctx, cam, L);
  }, { type: 'HIGH', desc: 'Dutch high angle: tiny Noah in the spotlight below a sea of different thoughts ("Everyone was thinking something different").', post: { bloom: 0.4, vignette: 0.65 } });

  // 6F2 — orbit tightens on Noah
  E.cut('s06f2_tighten', E.sg('s06_vo2', 1) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const ang = lt * 0.45;
    const cam = E.cam({ z: 1.2 + lt * 0.08, rot: Math.sin(ang) * 0.08, x: 960 + Math.sin(ang) * 160, focus: 1, ap: 12 });
    const L = voidSpot(t, '#6a46b0');
    L.push(panelsAt(0.5, 31, 40, t, s.t0 - 2, { a: 0.5, scale: 0.7 }));
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(900, 520), h: 900, f: Math.sin(ang * 2) * 0.5, pose: 'crossed', expr: 'squint', rim: { dx: 0.2, dy: -1, color: '#d9c9ff' }, ground: false, shadow: false }) });
    L.push(panelsAt(1.4, 32, 14, t, s.t0, { a: 0.75 }));
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'The orbit tightens on Noah hugging himself as panels multiply around him ("couldn\'t turn ANY of it off").', post: { bloom: 0.45, vignette: 0.75 } });

  // 6G — peak: real 3-cut burst (ECU eyes / top-down hands on ears / overhead of windows) then black
  E.cut('s06g_peak', E.M('peak'), (ctx, lt, t, s) => {
    const D = E.D(s) - 0.85; const k = lt < D / 3 ? 0 : lt < (2 * D) / 3 ? 1 : lt < D ? 2 : 3;
    if (k === 3) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1920, 1080); return; }
    const cam = E.cam({ z: 1.0 + (lt % (D / 3)) * 0.35, rot: [0.08, -0.1, 0.05][k], focus: 1, ap: 12, shakeX: Math.sin(lt * 60) * 8, shakeY: Math.cos(lt * 50) * 6 });
    const L = voidSpot(t, '#7a4ac0');
    if (k === 0) L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(4200, 900), h: 4200, f: 0, expr: 'shock', rim: VRIM, ground: false, shadow: false }) });
    if (k === 1) L.push({ d: 1, draw: (c) => { c.save(); c.translate(960, 540); E.char(c, { x: 0, y: 900, h: 1200, f: 0, rot: 0, costume: 'noah', pose: 'ears', expr: 'squint', t, faceAlpha: 0, rim: VRIM, ground: false, shadow: false }); c.restore(); c.fillStyle = '#0a080d'; c.beginPath(); c.arc(960, 540, 170, 0, Math.PI * 2); c.fill(); for (let i = 0; i < 3; i++) { c.fillStyle = '#0a080d'; c.beginPath(); c.ellipse(900 + i * 60, 380, 40, 60, 0, 0, Math.PI * 2); c.fill(); } } });
    if (k === 2) L.push({ d: 1, draw: (c) => E.panelField(c, t, { seed: 41, n: 90, x: -200, y: -100, w: 2300, h: 1300, t0: s.t0 - 3, spread: 2, texts: E.CROWD_TEXT, a: 0.8, scale: 0.6 }) });
    L.push(panelsAt(1.3, 42 + k, 14, t, s.t0 - 3));
    E.layers(ctx, cam, L);
  }, { type: 'MONTAGE', desc: 'Overload peak, three fast cuts: ECU of Noah\'s eyes, top-down of his hands pressed on his head, overhead of countless windows — then a hard cut to black silence.', post: (lt) => ({ bloom: 0.5, vignette: 0.8, flash: { color: '#a98bff', a: (lt % 0.43) < 0.06 ? 0.25 : 0 } }) });

  // ===== SCENE 7 =====
  const passLines = (c, t, n, seed, a = 0.8) => { const r = E.rng(seed); c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) { const y = 150 + r() * 800, sp = 260 + r() * 300, len = 300 + r() * 500; const x = ((t * sp + r() * 3000) % 3000) - 600;
      const g = c.createLinearGradient(x, 0, x + len, 0); g.addColorStop(0, 'rgba(169,139,255,0)'); g.addColorStop(0.7, E.rgba('#a98bff', 0.5 * a)); g.addColorStop(1, E.rgba('#e8deff', 0.9 * a)); c.strokeStyle = g; c.lineWidth = 3 + r() * 4; c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + len * 0.3, y - 30, x + len * 0.6, y + 30, x + len, y); c.stroke();
      if (i % 3 === 0) E.thoughtText(c, E.CROWD_TEXT[(i + seed) % E.CROWD_TEXT.length], x + len * 0.5, y - 26, { size: 30, a: 0.7 * a }); }
    c.restore(); };
  // 7A — 3/4 MS in a quiet corner: Noah presses his hands over his ears
  E.cut('s07a_ears', E.M('S07'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 12 });
    const L = E.SET.hall3q(t, { mood: 'cool' }); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 900, y: E.headAt(1250, 520), h: 1250, f: 0.55, pose: E.poseAt(lt, [[0, 'stand'], [0.5, 'ears', 0.3]]), expr: 'squint', rim: K.hallCool, ground: false, shadow: false }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => passLines(c, t, 7, 3) });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: '3/4 medium shot in a quiet corridor: Noah presses his hands over his ears ("He tried covering his ears").' });
  // 7A2 — profile ECU: hand on the ear, thought lines pass straight through ("Nothing.")
  E.cut('s07a2_nothing', E.sg('s07_vo1', 1) - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = E.SET.soft(t, { top: '#3e3248', bot: '#1e1828', seed: 71, bokeh: ['#a98bff', '#9fc6ff'] });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 1050, y: E.headAt(3000, 560), h: 3000, f: 0.95, pose: 'ears', expr: 'squint', rim: K.hallCool, ground: false, shadow: false }); } });
    L.push({ d: 1.0, sharp: true, draw: (c) => passLines(c, t, 12, 9, 1) });
    E.layers(ctx, cam, L);
    E.label(ctx, 'NOTHING.', 960, 930, E.seg(lt, 0.2, 0.4), 44);
  }, { type: 'ECU', desc: 'Profile extreme close-up: his hand clamped over his ear while violet thought-lines pass straight through it ("Nothing.").' });
  // 7B — huge headphones; lines pass through them
  E.cut('s07b_headphones', E.sg('s07_vo1', 2) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = E.SET.soft(t, { top: '#4a3a58', bot: '#22182a', seed: 72, bokeh: ['#a98bff', '#9fc6ff'] });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 900, y: E.headAt(1500, 520), h: 1500, f: 0.9, pose: E.poseAt(lt, [[0, 'neck'], [0.6, 'pocket']]), expr: 'tired', headphones: true, rim: K.hallCool, ground: false, shadow: false }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => passLines(c, t, 12, 7) });
    E.layers(ctx, cam, L);
    const nx = E.sg('s07_vo1', 3) - s.t0; if (lt > nx) E.label(ctx, 'STILL NOTHING.', 960, 930, E.seg(lt, nx, nx + 0.2), 44);
  }, { type: 'CU', desc: 'Profile: Noah jams on huge headphones; the thought lines pass straight through them ("Still nothing.").' });
  // 7C — wide symmetrical bathroom; lock click; glowing windows drift through the walls
  E.cut('s07c_bathroom', E.sg('s07_vo1', 4) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 4, drift: 0 });
    const L = E.SET.bathroom(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 930, h: 330, f: 0, pose: E.poseAt(lt, [[0, 'stand'], [1.2, 'ears']]), expr: 'worried', rim: K.bath }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => { const r = E.rng(5); for (let i = 0; i < 10; i++) { const side = i % 2 ? -1 : 1; const p = ((lt * 0.25 + r()) % 1); const x = side > 0 ? -200 + p * 2300 : 2100 - p * 2300; const y = 250 + r() * 500; E.thought(c, { x, y, w: 240, h: 70, s: 0.9, a: 0.75 * Math.sin(p * Math.PI), text: E.CROWD_TEXT[(i * 3) % E.CROWD_TEXT.length], size: 30, seed: i, noClamp: true }, t); } } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wide symmetrical bathroom under one cold light: Noah alone in the centre while glowing thought windows drift straight through the walls.' });
  // 7D — low angle: arms thrown up at the ceiling, "ARE YOU KIDDING ME?"
  E.cut('s07d_shout', E.st('s07_noah1') - 0.2, (ctx, lt, t, s) => {
    const cam = E.cam({ z: 1.0 + E.seg(lt, 0, 0.3, 'out') * 0.12, rot: -0.04, y: 600, focus: 1, ap: 10, shakeX: E.talk('noah', t) * Math.sin(lt * 70) * 6 });
    const L = E.SET.bathroom(t); L[0].d = 0.4;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1300, 440), h: 1300, f: 0, pose: E.poseAt(lt, [[0, 'stand'], [0.12, 'cheerFists', 0.1]]), expr: 'angry', look: [0, -1], tilt: -0.08, rim: K.bath, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Low angle: Noah throws his fists up and yells at the ceiling — "ARE YOU KIDDING ME?"' });

  // ===== SCENE 8 — afternoon, the hallway calm again =====
  const HR = K.hallR;
  E.cut('s08a_locker', E.M('S08'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, x: 760, y: 600, focus: 1, ap: 6 });
    const L = E.SET.hall3q(t, { mood: 'afternoon' });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 600, y: 1000, h: E.hallH(1000), f: 0.7, pose: 'relaxed', expr: 'tired', tilt: 0.1, rim: { dx: 1, dy: -0.4, color: '#ffa060' } }); c.fillStyle = '#2c3550'; c.beginPath(); c.moveTo(700, 360); c.lineTo(860, 395); c.lineTo(860, 990); c.lineTo(700, 1030); c.closePath(); c.fill(); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Afternoon, the hallway calm again (no effects): Noah slumps at his open locker, exhausted.' });
  E.cut('s08b_photo', E.sg('s08_vo1', 2) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 6 });
    const L = [{ d: 0.5, draw: (c) => { E.vgrad(c, -300, -300, 2600, 1700, [[0, '#2c3550'], [1, '#202840']]); c.fillStyle = 'rgba(0,0,0,0.2)'; for (let i = 0; i < 5; i++) c.fillRect(200, 140 + i * 40, 1500, 8); } },
      { d: 1, draw: (c) => { c.save(); c.translate(960, 560); c.rotate(-0.05); c.fillStyle = '#eadfcf'; c.fillRect(-420, -300, 840, 600); E.vgrad(c, -390, -270, 780, 470, [[0, '#f4c48a'], [1, '#d8806a']]); E.sun(c, 200, -120, 34, t); c.fillStyle = '#7a8a50'; c.fillRect(-390, 120, 780, 80);
        E.ch(c, 'noah', t, { x: -120, y: 170, h: 250, f: 0.5, pose: 'cheer', expr: 'laugh', rim: { dx: 1, dy: -0.4, color: '#fff1c9' }, talk: 0 }); E.ch(c, 'leo', t, { x: 110, y: 170, h: 245, f: -0.5, pose: 'wave', expr: 'laugh', rim: { dx: -1, dy: -0.4, color: '#fff1c9' }, talk: 0 });
        c.fillStyle = '#c8302f'; c.beginPath(); c.arc(0, -300, 16, 0, Math.PI * 2); c.fill(); c.fillStyle = '#3a2a2a'; c.font = '700 40px Caveat'; c.textAlign = 'center'; c.fillText('N + L — best friends forever (age 8)', 0, 255); c.restore(); } }];
    E.layers(ctx, cam, L);
  }, { type: 'INSERT', desc: 'Insert: a photo taped inside the locker — Noah and Leo aged 8 (smaller, kid-sized), laughing: "best friends forever (age 8)".', post: { bloom: 0.25 } });
  E.cut('s08c_twoshot', E.st('s08_leo_say1') - 0.6, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.03, x: 800, y: 600, focus: 1, ap: 6, drift: 1 });
    const L = E.SET.hall3q(t, { mood: 'afternoon' });
    L.push({ d: 1, draw: (c) => { const y = 1000; const lx = E.lerp(1250, 900, E.seg(lt, 0, 0.6, 'out'));
      E.ch(c, 'noah', t, { x: 640, y, h: E.hallH(y), f: E.lerp(0.7, -0.2, E.seg(lt, 0.5, 0.8)), pose: 'relaxed', expr: 'tired', rim: { dx: 1, dy: -0.4, color: '#ffa060' } });
      E.ch(c, 'leo', t, { x: lx, y: y - 20, h: E.hallH(y - 20), f: -0.7, pose: E.poseAt(lt, [[0, E.walkPose(lt * 1.6)], [0.6, 'tap'], [1.3, 'pocket']]), expr: 'happy', rim: { dx: 1, dy: -0.4, color: '#ffa060' } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Two-shot: Leo strolls in and taps Noah\'s shoulder — "Yo, you coming over Friday?"' });
  // 8D — CU Noah; violet thought window whose tail lands on Leo's blurred cap (right foreground)
  E.cut('s08d_cantkeep', E.st('s08_leo_th1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.12, focus: 1, ap: 14 });
    const L = E.SET.hall3q(t + 5, { mood: 'afternoon' }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 700, y: E.headAt(1150, 500), h: 1150, f: 0.4, pose: 'relaxed', expr: lt > 0.8 ? 'worried' : 'neutral', look: [0.8, 0], rim: { dx: 1, dy: -0.4, color: '#ffa060' }, ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'leo', t, { x: 1760, y: 2200, h: 1900, f: -0.5, faceAlpha: 0, rim: { dx: 1, dy: -0.4, color: '#ffa060' }, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#0a0610', 0.45 * E.seg(lt, 0.0, 0.8), 'multiply');
    E.th(ctx, 's08_leo_th1', t, { x: 1250, y: 330, w: 520, h: 110, tail: [1680, 470], size: 54, post: 2.5 });
  }, { type: 'CU', desc: 'Close on Noah as the hallway darkens; a violet thought window — its tail running to Leo\'s blurred cap in the right foreground — reveals word by word: "I can\'t keep doing this."', post: { vignette: 0.7 } });
  // 8E — corridor axis: Noah "...Doing what?" / Leo "What?"
  E.cut('s08e_doingwhat', E.st('s08_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.3, z1: 1.36, x: 980, y: 560, focus: 0.25, ap: 7 });
    const L = E.SET.corridor(t);
    L.push({ d: 0.25, draw: (c) => E.ch(c, 'noah', t, { x: 1040, y: 690, h: 250, f: -0.6, pose: 'relaxed', expr: 'worried', rim: { dx: 0.3, dy: -1, color: '#ffe6b8' } }) });
    L.push({ d: 1.4, draw: (c) => E.ch(c, 'leo', t, { x: 620, y: 1500, h: 1100, f: 0.6, pose: lt > D * 0.5 ? 'shrug' : 'pocket', expr: lt > D * 0.5 ? 'nervous' : 'happy', rim: { dx: 1, dy: -0.4, color: '#ffa060' }, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Down the corridor axis over Leo\'s shoulder: Noah asks "...Doing what?" — Leo, caught out: "What?"' });
  // 8F — CU Leo looking down; thought; held silence after "He's gonna hate me."
  E.cut('s08f_hateme', E.st('s08_leo_th2') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 14 });
    const L = E.SET.hall3q(t + 9, { mood: 'afternoon', back: [300, 330, 600, 640] }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1100, 480), h: 1100, f: -0.4, pose: 'pocket', expr: 'sad', look: [-0.2, 0.9], tilt: 0.1, rim: { dx: -1, dy: -0.4, color: '#ffa060' }, ground: false, shadow: false }); E.th(c, 's08_leo_th2', t, { x: 520, y: 330, w: 560, h: 130, tail: [920, 360], size: 48, post: 2.5 }); } });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#0a0610', 0.35 * E.seg(lt, 0.5, 2.5), 'multiply');
  }, { type: 'CU', desc: 'Close on Leo, looking down, unaware Noah can hear: "I have to tell him. He\'s gonna hate me." — then a held silence.', post: { vignette: 0.7 } });
})();
