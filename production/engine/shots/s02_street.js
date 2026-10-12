// SCENE 2 (V2) — Testing whether it's real (morning street).
(function () {
  const E = globalThis.E;
  const K = E.KEY;
  const RIM = K.morningL;
  const NX0 = 400, SPEED = 95;

  // 2A — 3/4 MS: Noah stumbles against the café window, hand to his head
  E.cut('s02a_stumble', E.M('S02'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.6, z1: 1.7, x: 1180, y: 640, focus: 1, ap: 8, rot: 0.02 });
    const L = E.SET.cafeExtAM(t);
    L.push({ d: 0.8, draw: (c) => { E.ch(c, 'noah', t, { x: 1180, y: 902, h: 150, f: -0.6, pose: E.poseAt(lt, [[0, 'stand'], [0.4, E.blendPose(E.POSE.ears, E.POSE.stand, 0.4)]]), lean: -0.3, expr: 'squint', rim: RIM });
      for (let i = 0; i < 3; i++) { const p = (lt * 0.4 + i / 3) % 1; E.thoughtText(c, ['...', '?!', '...'][i], 1180 + Math.cos(i * 2.1 + lt) * (70 + p * 30), 720 + Math.sin(i * 1.7 + lt) * 30, { size: 30, a: Math.sin(p * Math.PI) * 0.7 }); } } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: '3/4 medium shot: outside the café, Noah stumbles against the window clutching his head; faint whispers swirl ("losing his mind").' });

  // 2A2 — POV through the café window: patrons with ghost whispers fading in
  E.cut('s02a2_pov', E.sg('s02_vo1', 1) + 0.9, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 940, focus: 0.85, ap: 10 });
    const L = E.SET.cafeIntAM(t);
    L.push({ d: 0.85, draw: (c) => { [[600, 0.8], [960, -0.6], [1320, 0.5]].forEach(([x, f], i) => { E.char(c, { x, y: 1000, h: 440, f, costume: E.extra(150 + i), pose: 'sit', expr: 'neutral', t, seed: i, rim: RIM }); E.thought(c, { x: x + 20, y: 420, w: 260, h: 64, s: E.pop(lt, 0.4 + i * 0.6), a: 0.7, text: ['Need sugar...', 'Late again', 'Is he okay?'][i], size: 34, tail: [x, 520], seed: i }, t); }); } });
    L.push({ d: 1.6, draw: (c) => { c.fillStyle = 'rgba(200,220,255,0.08)'; c.fillRect(-200, -200, 2400, 1500); c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 30; c.beginPath(); c.moveTo(200, 1100); c.lineTo(700, -100); c.stroke(); } });
    E.layers(ctx, cam, L);
  }, { type: 'POV', desc: 'Noah\'s point of view through the café window: the patrons\' thoughts fade in one after another.' });

  // 2B — Noah pushes out of the door onto the busy morning street
  E.cut('s02b_outside', E.sg('s02_vo1', 2) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: E.lerp(500, 700, E.ease.io(E.clamp(lt / D))), y: 560, z: 0.92, focus: 1, ap: 6 });
    const L = E.SET.streetAM(t);
    L.push({ d: 1, draw: (c) => {
      const r = E.rng(3);
      for (let i = 0; i < 7; i++) { const x = -200 + i * 330 + (i % 2 ? -1 : 1) * lt * 70; E.char(c, { x, y: 905, h: 300 + r() * 50, f: i % 2 ? -0.8 : 0.8, costume: E.extra(60 + i), pose: E.walkPose(lt * 1.6 + i * 0.3), expr: 'neutral', t, seed: i, rim: RIM }); }
      E.ch(c, 'noah', t, { x: E.lerp(420, 640, E.clamp(lt / D)), y: 910, h: 320, f: 0.8, pose: E.walkPose(lt * 1.6), expr: 'wide', look: [0.5, 0], rim: RIM });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wide: Noah steps out onto the busy morning street.' });

  // 2B2 — high angle: readable mini thoughts pop over every passer-by ("EVERY single person")
  E.cut('s02b2_every', E.sg('s02_vo1', 5) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 900 + lt * 30, y: 640, z: 1.0 + lt * 0.04, rot: 0.03, focus: 1, ap: 6 });
    const L = E.SET.streetAM(t + 10);
    const txt = ['Late!', 'Coffee...', 'Rent is due', 'Cute dog!', 'Meeting at 9', 'Ugh, Monday', 'Text her back'];
    L.push({ d: 1, draw: (c) => { for (let i = 0; i < 7; i++) { const x = -60 + i * 310 + (i % 2 ? -1 : 1) * lt * 60; E.char(c, { x, y: 910, h: 330, f: i % 2 ? -0.8 : 0.8, costume: E.extra(160 + i), pose: E.walkPose(lt * 1.6 + i * 0.3), expr: 'neutral', t, seed: i, rim: RIM }); E.thought(c, { x, y: 470 - (i % 2) * 50, w: 190, h: 56, s: E.pop(lt, 0.1 + i * 0.32), text: txt[i], size: 32, tail: [x, 590], seed: i, noClamp: true }, t); } } });
    E.layers(ctx, cam, L);
  }, { type: 'HIGH', desc: 'Slightly high angle over the crowd: a readable thought window pops over every passer-by in sequence ("EVERY single person around him").' });

  // tracking frame for the passers-by
  const track = (who, lineTh, icon) => (ctx, lt, t, s) => {
    const nx = NX0 + (t - E.M('S02')) * SPEED;
    const cam = E.cam({ x: nx + 120, y: 600, z: 1.55, focus: 1, ap: 10 });
    const L = E.SET.streetAM(t);
    const px = nx + 520 - lt * 190;
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'noah', t, { x: nx, y: 910, h: 340, f: 0.8, pose: E.walkPose((t - E.M('S02')) * 1.6), expr: 'wide', look: [0.6, 0], rim: RIM });
      E.ch(c, who, t, { x: px, y: 910, h: 360, f: -0.8, pose: E.blendPose(E.walkPose(lt * 1.5), E.POSE.phone, 0.85), expr: 'neutral', rim: RIM, prop: E.PROP.phone });
      if (lineTh) E.th(c, lineTh, t, { x: px + 40, y: 470, w: 280, h: 210, tail: [px, 600], inner: icon, size: 30, seed: 2 });
    } });
    E.layers(ctx, cam, L);
  };
  E.cut('s02c_biz', E.st('s02_biz_say') - 0.3, track('biz', null, null), { type: 'TRACK', desc: 'Side-tracking: a businessman on his phone strides past Noah — "Yes, boss. Almost at the office."' });
  // 2C2 — push-in CU on the businessman with his thought
  E.cut('s02c2_bizthought', E.st('s02_biz_th') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 12 });
    const L = E.SET.streetAM(t + 4); L[3].d = 0.6; L[4].d = 0.62;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'biz', t, { x: 700, y: E.headAt(1100, 480), h: 1100, f: 0.4, pose: 'phone', prop: E.PROP.phone, expr: 'nervous', rim: RIM, ground: false, shadow: false }); E.th(c, 's02_biz_th', t, { x: 1300, y: 420, w: 480, h: 330, tail: [880, 420], inner: E.icon.clockBoss, size: 38, seed: 3 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Push in on the businessman: his thought window shows his boss tapping a foot beside a clock — "I\'m still twenty minutes away."' });
  // 2D — front-on low angle: the woman walks toward camera, oven window above her
  E.cut('s02d_woman', E.st('s02_woman_th') - 0.35, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 960, y: 500, z: 1.0 + lt * 0.05, focus: 1, ap: 10, rot: -0.02 });
    const L = E.SET.streetAM(t + 20);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'woman', t, { x: 960, y: 1180 + lt * 30, h: 760 + lt * 40, f: 0.05, pose: E.walkPose(lt * 1.5, 0.6), expr: 'worried', look: [0.3, -0.4], rim: RIM, prop: null }); E.th(c, 's02_woman_th', t, { x: 1350, y: 330, w: 330, h: 280, tail: [1040, 430], inner: E.icon.oven, size: 34, seed: 4 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Front-on, slightly low: a woman walks toward camera; her window shows a glowing oven — "Did I leave the oven on?"' });

  // 2E — snap zoom on the staring man
  E.cut('s02e_stare', E.st('s02_man_th') - 0.3, (ctx, lt, t, s) => {
    const snap = E.seg(lt, 0, 0.18, 'out');
    const cam = E.cam({ x: E.lerp(1100, 1150, snap), y: E.lerp(540, 600, snap), z: E.lerp(1.4, 2.2, snap) + lt * 0.02, focus: 1, ap: 12, shakeX: lt < 0.25 ? Math.sin(lt * 80) * 4 : 0 });
    const L = E.SET.streetAM(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'man', t, { x: 1220, y: 900, h: 380, f: -0.35, pose: 'pocket', expr: 'angry', look: [-0.6, 0], rim: RIM }); E.th(c, 's02_man_th', t, { x: 1010, y: 560, w: 250, h: 96, tail: [1180, 590], size: 26 }); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 700, y: 1700, h: 1100, f: 0.6, faceAlpha: 0, rim: RIM, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Snap zoom onto a man in a flat cap staring right back at Noah: "Why is that kid staring at me?"' });

  // 2F — Noah CU amazed
  E.cut('s02f_real', E.st('s02_noah1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 14 });
    const L = E.SET.streetAM(t + 40); L[3].d = 0.6; L[4].d = 0.62;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1250, 470), h: 1250, f: 0.15, pose: E.poseAt(lt, [[0, 'stand'], [1.4, 'shrug']]), expr: lt < 1.2 ? 'amazed' : 'happy', rim: RIM, ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => E.bokeh(c, t, { n: 6, seed: 4, a: 0.1, rmin: 80, rmax: 200 }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Close-up: Noah\'s disbelief turns into a grin — "Oh my god. This is actually real."' });
})();
