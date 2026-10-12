// SCENE 6 — Information overload · SCENE 7 — Can't escape · SCENE 8 — Leo's thought.
(function () {
  const E = globalThis.E;
  const RIM = { dx: 4, dy: -2, color: '#ffd2a0' };
  const VRIM = { dx: 5, dy: -3, color: '#b9a4ff' };
  const crowdIds = ['s06_c1', 's06_c2', 's06_c3', 's06_c4', 's06_c5', 's06_c6', 's06_c7', 's06_c8'];

  // 6A — orbit: cafeteria stretches into violet infinite space, layered panels
  E.cut('s06a_orbit', E.M('S06'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const ang = lt * 0.12;
    const cam = E.cam({ z: 1.05 + lt * 0.02, rot: Math.sin(ang) * 0.06, x: 960 + Math.sin(ang * 2) * 80, focus: 1, ap: 10 });
    const L = E.SET.void(t, { core: '#5a3f9a' });
    L.push({ d: 0.3, draw: (c) => { // ghost cafeteria tables receding endlessly
      for (let k = 0; k < 7; k++) { const z = Math.pow(0.72, k); c.fillStyle = E.rgba('#7a5040', 0.6 * z + 0.1); for (const sd of [-1, 1]) c.fillRect(960 + sd * (160 + 900 * z) - 600 * z, 560 + 420 * z, 1200 * z, 16 * z + 3); }
      const r = E.rng(3); for (let i = 0; i < 40; i++) { const z = 0.25 + r() * 0.5; E.char(c, { x: r() * 3000 - 500, y: 560 + 420 * z, h: 260 * z, f: r() * 2 - 1, costume: E.extra(600 + i), pose: 'sit', t, seed: i, rim: VRIM, alpha: 0.7 }); }
    } });
    L.push({ d: 0.6, draw: (c) => E.panelField(c, t, { seed: 11, n: 22, x: -300, y: 100, w: 2500, h: 800, t0: s.t0, spread: D * 0.6, texts: E.CROWD_TEXT, a: 0.55, scale: 0.8 }) });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 960, h: 470, f: Math.sin(ang * 3) * 0.6, pose: 'clutch', expr: 'worried', rim: VRIM }) });
    L.push({ d: 1.3, draw: (c) => E.panelField(c, t, { seed: 12, n: 8, x: -200, y: 0, w: 2300, h: 1100, t0: s.t0 + 0.5, spread: D * 0.6, texts: E.CROWD_TEXT, a: 0.7 }) });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Camera orbits Noah as the cafeteria stretches into an infinite violet space full of layered thought panels.', post: { bloom: 0.4 } });

  // 6B — overhead: countless tables, a thought window over every head; counter ticks up to 200
  E.cut('s06b_overhead', E.ph('s06_vo1', 1, 3) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.0 + lt * 0.05, rot: lt * 0.02, focus: 1, ap: 0 });
    ctx.save(); E.applyCam(ctx, cam, 1);
    E.vgrad(ctx, -400, -300, 2700, 1700, [[0, '#4a3038'], [1, '#3a262c']]);
    const r = E.rng(21); let n = 0;
    for (let row = 0; row < 6; row++) {
      ctx.fillStyle = '#7a5040'; ctx.fillRect(-100, 150 + row * 170, 2100, 40);
      for (let i = 0; i < 18; i++) for (const sd of [-1, 1]) {
        const x = -60 + i * 118 + (sd > 0 ? 50 : 0), y = 170 + row * 170 + sd * 52;
        ctx.fillStyle = '#f0a77e'; ctx.beginPath(); ctx.arc(x + 3, y - 2, 24, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0a080d'; ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = E.extra(700 + n).topC; ctx.beginPath(); ctx.ellipse(x, y + sd * 26, 30, 12, 0, 0, Math.PI * 2); ctx.fill();
        const p = E.pop(lt, (n / 216) * D * 0.7, 0.25); if (p > 0) E.thought(ctx, { x: x + 20, y: y - 40, w: 50, h: 26, s: p, a: 0.8, seed: n }, t);
        n++;
      }
    }
    ctx.restore();
    const cnt = Math.min(200, Math.floor(E.clamp(lt / (D * 0.75)) * 200));
    E.label(ctx, `${cnt} THOUGHTS`, 960, 140, 1, 46);
  }, { type: 'TOP', desc: 'Overhead: rows of students, a thought window pops over every head; counter ticks to "200 THOUGHTS".', post: { bloom: 0.35 } });

  // 6C — "Not so much." Noah deadpan, wincing
  E.cut('s06c_notsomuch', E.ph('s06_vo1', 2, 3) - 0.05, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.1, z1: 1.15, focus: 1, ap: 14 });
    const L = E.SET.cafeteria(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1150, 470), h: 1150, f: 0.1, pose: 'stand', expr: 'squint', tilt: -0.08, rim: RIM }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => E.panelField(c, t, { seed: 14, n: 14, x: 0, y: 60, w: 1920, h: 900, t0: s.t0, spread: 0.6, texts: E.CROWD_TEXT, a: 0.75 }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Close-up: Noah winces, deadpan, boxed in by thought windows ("Not so much.").' });

  // 6D/E — crowd thoughts: three framings, each centred on 2–3 students voicing their thoughts
  const crowdShot = (ids, seed, xs) => (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 960, dx: seed % 2 ? 60 : -60, focus: 1, ap: 10, rot: (seed % 2 ? 1 : -1) * 0.04 });
    const L = E.SET.cafeteria(t);
    L.push({ d: 0.75, draw: (c) => { E.table(c, 960, 860, 2400); } });
    L.push({ d: 1, draw: (c) => {
      ids.forEach((id, i) => { const x = xs[i]; E.char(c, { x, y: 1060, h: 640, f: i % 2 ? -0.5 : 0.5, costume: E.extra(seed * 10 + i), pose: 'sitDesk', expr: ['tired', 'worried', 'sad', 'nervous'][(seed + i) % 4], t, seed: i + seed, rim: RIM, talk: 0 });
        E.th(c, id, t, { x: x + (i % 2 ? -60 : 60), y: 330 + (i % 2) * 70, w: 420, h: 120, tail: [x, 520], size: 42, post: 1.5 }); });
    } });
    L.push({ d: 1.4, sharp: true, draw: (c) => E.panelField(c, t, { seed: seed + 20, n: 10, x: 0, y: 0, w: 1920, h: 1080, t0: s.t0, spread: D, texts: E.CROWD_TEXT, a: 0.35, scale: 0.9 }) });
    E.layers(ctx, cam, L);
  };
  E.cut('s06d_crowd1', E.st('s06_c1') - 0.2, crowdShot(['s06_c1', 's06_c2', 's06_c3'], 1, [460, 960, 1460]), { type: 'MS', desc: 'Students at a table, mouths shut, thoughts popping: "I\'m starving." / "Why did she leave me on read?" / "I hate Mondays."' });
  E.cut('s06e_crowd2', E.st('s06_c4') - 0.15, crowdShot(['s06_c4', 's06_c5', 's06_c6'], 2, [500, 1000, 1480]), { type: 'MS', desc: 'Another table: "Did I fail chemistry?" / "Does anyone even like me?" / "Is my hair weird today?"' });

  // 6F — Noah centre, more and more panels; orbit tightens (VO: couldn't turn any of it off)
  E.cut('s06f_tighten', E.st('s06_vo2') - 0.4, (ctx, lt, t, s) => {
    const D = E.D(s);
    const ang = lt * 0.35;
    const cam = E.cam({ z: 1.2 + lt * 0.06, rot: Math.sin(ang) * 0.08, x: 960 + Math.sin(ang) * 120, focus: 1, ap: 12 });
    const L = E.SET.void(t, { core: '#6a46b0' });
    L.push({ d: 0.5, draw: (c) => E.panelField(c, t, { seed: 31, n: 40, x: -500, y: -100, w: 2900, h: 1300, t0: s.t0 - 2, spread: 2, texts: E.CROWD_TEXT, a: 0.5, scale: 0.7 }) });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(900, 520), h: 900, f: Math.sin(ang * 2) * 0.5, pose: 'ears', expr: 'squint', rim: VRIM }) });
    L.push({ d: 1.4, draw: (c) => E.panelField(c, t, { seed: 32, n: 14, x: -300, y: -100, w: 2500, h: 1300, t0: s.t0, spread: D, texts: E.CROWD_TEXT, a: 0.75 }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Orbit tightens on Noah covering his ears as panels multiply around him ("couldn\'t turn any of it off").', post: { bloom: 0.45, vignette: 0.7 } });

  // 6G — peak: rapid cuts (eyes / hands / overhead countless windows) then hard silence
  E.cut('s06g_peak', E.M('peak'), (ctx, lt, t, s) => {
    const D = E.D(s) - 0.8; const k = lt < D / 3 ? 0 : lt < (2 * D) / 3 ? 1 : lt < D ? 2 : 3;
    if (k === 3) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1920, 1080); return; }
    const cam = E.cam({ z: 1.0 + (lt % (D / 3)) * 0.3, rot: [0.08, -0.1, 0.05][k], focus: 1, ap: 12, shakeX: Math.sin(lt * 60) * 8, shakeY: Math.cos(lt * 50) * 6 });
    const L = E.SET.void(t, { core: '#7a4ac0' });
    if (k === 0) L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(4200, 900), h: 4200, f: 0, expr: 'shock', rim: VRIM }) });
    if (k === 1) L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(2400, 560), h: 2400, f: 0, pose: 'ears', expr: 'squint', rim: VRIM }) });
    if (k === 2) L.push({ d: 1, draw: (c) => E.panelField(c, t, { seed: 41, n: 90, x: -200, y: -100, w: 2300, h: 1300, t0: s.t0 - 3, spread: 2, texts: E.CROWD_TEXT, a: 0.8, scale: 0.6 }) });
    L.push({ d: 1.3, draw: (c) => E.panelField(c, t, { seed: 42 + k, n: 18, x: -200, y: -100, w: 2300, h: 1300, t0: s.t0 - 3, spread: 1, texts: E.CROWD_TEXT, a: 0.8 }) });
    E.layers(ctx, cam, L);
  }, { type: 'MONTAGE', desc: 'Overload peak: rapid cuts — Noah\'s eyes, hands over ears, overhead of countless windows — then a hard cut to black silence.', post: (lt) => ({ bloom: 0.5, vignette: 0.8, flash: { color: '#a98bff', a: (lt % 0.47) < 0.06 ? 0.25 : 0 } }) });

  // ===== SCENE 7 =====
  const passLines = (c, t, n, seed, a = 0.8) => { // translucent thought lines drifting across the frame
    const r = E.rng(seed); c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) { const y = 150 + r() * 800, sp = 260 + r() * 300, len = 300 + r() * 500; const x = ((t * sp + r() * 3000) % 3000) - 600;
      const g = c.createLinearGradient(x, 0, x + len, 0); g.addColorStop(0, 'rgba(169,139,255,0)'); g.addColorStop(0.7, E.rgba('#a98bff', 0.5 * a)); g.addColorStop(1, E.rgba('#e8deff', 0.9 * a)); c.strokeStyle = g; c.lineWidth = 3 + r() * 4; c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + len * 0.3, y - 30, x + len * 0.6, y + 30, x + len, y); c.stroke();
      if (i % 3 === 0) E.thoughtText(c, E.CROWD_TEXT[(i + seed) % E.CROWD_TEXT.length], x + len * 0.5, y - 26, { size: 30, a: 0.7 * a }); }
    c.restore();
  };
  // 7A — ECU hands pressed over ears; thoughts still pass
  E.cut('s07a_ears', E.M('S07'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = E.SET.soft(t, { top: '#5a4050', bot: '#2a1c26', seed: 71, bokeh: ['#a98bff', '#ffd9b0'] });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(2200, 600), h: 2200, f: 0, pose: 'ears', expr: 'squint', rim: RIM }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => passLines(c, t, 9, 3) });
    E.layers(ctx, cam, L);
    const nx = E.ph('s07_vo1', 1, 5) - s.t0; if (lt > nx) E.label(ctx, 'NOTHING.', 960, 960, E.seg(lt, nx, nx + 0.2), 40);
  }, { type: 'ECU', desc: 'Extreme close-up: Noah\'s hands pressed over his ears; violet thought-lines keep streaming past ("Nothing.").' });

  // 7B — profile with huge headphones; thought lines pass straight through
  E.cut('s07b_headphones', E.ph('s07_vo1', 2, 5) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = E.SET.soft(t, { top: '#4a3a58', bot: '#22182a', seed: 72, bokeh: ['#a98bff', '#9fc6ff'] });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 900, y: E.headAt(1500, 520), h: 1500, f: 0.95, pose: 'pocket', expr: 'tired', headphones: true, rim: RIM }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => passLines(c, t, 12, 7) });
    E.layers(ctx, cam, L);
    const nx = E.ph('s07_vo1', 3, 5) - s.t0; if (lt > nx) E.label(ctx, 'STILL NOTHING.', 960, 960, E.seg(lt, nx, nx + 0.2), 40);
  }, { type: 'CU', desc: 'Profile: Noah in huge headphones; the thought lines pass straight through them ("Still nothing.").' });

  // 7C — wide symmetrical bathroom; glowing shapes pass through walls
  E.cut('s07c_bathroom', E.ph('s07_vo1', 4, 5) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 4, drift: 0 });
    const L = E.SET.bathroom(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 930, h: 330, f: 0, pose: E.poseAt(lt, [[0, 'stand'], [1.2, 'ears']]), expr: 'worried', rim: { dx: 0, dy: -5, color: '#e8fbff' } }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => { const r = E.rng(5); for (let i = 0; i < 10; i++) { const side = i % 2 ? -1 : 1; const p = ((lt * 0.25 + r()) % 1); const x = side > 0 ? -200 + p * 2300 : 2100 - p * 2300; const y = 250 + r() * 500; E.thought(c, { x, y, w: 240, h: 70, s: 0.9, a: 0.75 * Math.sin(p * Math.PI), text: E.CROWD_TEXT[(i * 3) % E.CROWD_TEXT.length], size: 30, seed: i }, t); } } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wide symmetrical bathroom: Noah alone in the centre while glowing thought windows drift straight through the walls.' });

  // 7D — low-angle shout "ARE YOU KIDDING ME?"
  E.cut('s07d_shout', E.st('s07_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.0 + E.seg(lt, 0, 0.3, 'out') * 0.12, rot: -0.04, focus: 1, ap: 10, shakeX: E.talk('noah', t) * Math.sin(lt * 70) * 6 });
    const L = E.SET.bathroom(t); L[0].d = 0.4;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1300, 420), h: 1300, f: 0, pose: 'shrug', expr: 'angry', rim: { dx: 0, dy: -8, color: '#e8fbff' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Low angle: Noah throws his arms up and shouts at the ceiling — "ARE YOU KIDDING ME?"' });

  // ===== SCENE 8 =====
  // 8A — quiet normal hallway, Noah at his locker, exhausted (chaos removed)
  E.cut('s08a_locker', E.M('S08'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.4, z1: 1.5, x: 1000, y: 640, focus: 1, ap: 9 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 1000, y: 905, h: 340, f: 0.7, pose: 'relaxed', expr: 'tired', tilt: 0.1, rim: RIM }); c.fillStyle = '#3d5a73'; c.beginPath(); c.moveTo(1090, 470); c.lineTo(1170, 445); c.lineTo(1170, 915); c.lineTo(1090, 890); c.closePath(); c.fill(); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'A calm, ordinary hallway (no effects): Noah slumps at his open locker, exhausted.' });

  // 8B — insert: photo inside the locker door: young Noah & Leo
  E.cut('s08b_photo', E.ph('s08_vo1', 1, 2) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 6 });
    const L = [{ d: 0.5, draw: (c) => { E.vgrad(c, -300, -300, 2600, 1700, [[0, '#3d5a73'], [1, '#2a4058']]); c.fillStyle = 'rgba(0,0,0,0.2)'; for (let i = 0; i < 5; i++) c.fillRect(200, 140 + i * 40, 1500, 8); } },
      { d: 1, draw: (c) => { c.save(); c.translate(960, 560); c.rotate(-0.05); c.fillStyle = '#f4ede6'; c.fillRect(-420, -300, 840, 600); E.vgrad(c, -390, -270, 780, 470, [[0, '#f6c98a'], [1, '#e8988a']]); E.sun(c, 200, -120, 40, t);
        E.ch(c, 'noah', t, { x: -120, y: 190, h: 330, f: 0.5, pose: 'cheer', expr: 'laugh', rim: { dx: 3, color: '#fff1c9' }, talk: 0 }); E.ch(c, 'leo', t, { x: 110, y: 190, h: 320, f: -0.5, pose: 'wave', expr: 'laugh', rim: { dx: 3, color: '#fff1c9' }, talk: 0 });
        c.fillStyle = '#c8302f'; c.beginPath(); c.arc(0, -300, 16, 0, Math.PI * 2); c.fill(); c.fillStyle = '#3a2a2a'; c.font = '700 40px Caveat'; c.textAlign = 'center'; c.fillText('N + L  — best friends forever (age 8)', 0, 255); c.restore(); } }];
    E.layers(ctx, cam, L);
  }, { type: 'INSERT', desc: 'Insert: a photo taped inside the locker — young Noah and Leo laughing, "best friends forever (age 8)".', post: { bloom: 0.3 } });

  // 8C — Leo enters from behind and taps Noah's shoulder; stable two-shot
  E.cut('s08c_twoshot', E.st('s08_leo_say1') - 0.6, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.5, z1: 1.52, x: 1000, y: 620, focus: 1, ap: 9, drift: 1 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => {
      const lx = E.lerp(1500, 1180, E.seg(lt, 0, 0.6, 'out'));
      E.ch(c, 'noah', t, { x: 920, y: 905, h: 340, f: 0.7, pose: 'relaxed', expr: 'tired', rim: RIM });
      E.ch(c, 'leo', t, { x: lx, y: 905, h: 345, f: -0.75, pose: E.poseAt(lt, [[0, E.walkPose(lt * 1.6)], [0.6, 'tap'], [1.3, 'pocket']]), expr: 'happy', rim: RIM });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Stable two-shot: Leo (green cap) strolls in, taps Noah\'s shoulder — "Yo, you coming over Friday?"' });

  // 8D — CU Noah; background darkens; "I can't keep doing this." appears phrase by phrase
  E.cut('s08d_cantkeep', E.st('s08_leo_th1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.14, focus: 1, ap: 14 });
    const L = E.SET.hallway(t + 5); L[0].d = 0.25; L[1].d = 0.35; L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 760, y: E.headAt(1150, 480), h: 1150, f: 0.4, pose: 'relaxed', expr: lt > 0.8 ? 'worried' : 'neutral', look: [0.8, 0], rim: RIM }) });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#0a0610', 0.6 * E.seg(lt, 0.0, 0.8), 'multiply');
    const v = E.tv('s08_leo_th1', t, 0.1, 3); E.floatText(ctx, v.text, 1340, 470, { size: 74, words: v.words, a: v.a });
  }, { type: 'CU', desc: 'Close on Noah; the hallway darkens; Leo\'s thought appears word by word beside him: "I can\'t keep doing this."', post: { vignette: 0.75 } });

  // 8E — two-shot: Noah "...Doing what?" Leo "What?"
  E.cut('s08e_doingwhat', E.st('s08_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.7, z1: 1.75, x: 1050, y: 600, focus: 1, ap: 10, drift: 1 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 920, y: 905, h: 340, f: 0.8, pose: 'relaxed', expr: 'worried', rim: RIM }); E.ch(c, 'leo', t, { x: 1180, y: 905, h: 345, f: -0.8, pose: lt > D * 0.5 ? 'shrug' : 'pocket', expr: lt > D * 0.5 ? 'nervous' : 'happy', rim: RIM }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Two-shot: Noah asks "...Doing what?" — Leo, confused: "What?"' });

  // 8F — CU Leo; he has no idea; thought behind him: "I have to tell him. He's gonna hate me."
  E.cut('s08f_hateme', E.st('s08_leo_th2') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 14 });
    const L = E.SET.hallway(t + 9); L[0].d = 0.25; L[1].d = 0.35; L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1060, y: E.headAt(1100, 480), h: 1100, f: -0.4, pose: 'pocket', expr: 'sad', look: [-0.3, 0.6], rim: RIM }); E.th(c, 's08_leo_th2', t, { x: 520, y: 330, w: 620, h: 150, tail: [900, 360], size: 48, post: 1.4 }); } });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#0a0610', 0.35 * E.seg(lt, 0.5, 2.5), 'multiply');
  }, { type: 'CU', desc: 'Close on Leo, looking down, unaware Noah can hear: "I have to tell him. He\'s gonna hate me." Silence after.', post: { vignette: 0.7 } });
})();
