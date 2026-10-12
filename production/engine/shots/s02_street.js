// SCENE 2 — Testing whether it's real (street, side tracking).
(function () {
  const E = globalThis.E;
  const RIM = { dx: 3, dy: -1, color: '#ffc4a0' };
  // tracking camera: x follows Noah who walks right at 95 px/s in world space
  const NX0 = 400, SPEED = 95;

  // 2A — Noah outside the café, rubbing his temples ("losing his mind")
  E.cut('s02a_confused', E.M('S02'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.07, focus: 1, ap: 12 });
    const L = E.SET.soft(t, { top: '#7a5060', bot: '#3a2430', window: true, wx: 1150, wy: 140, seed: 21 });
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'noah', t, { x: 860, y: E.headAt(1100, 430), h: 1100, f: 0.3, pose: 'ears', expr: 'squint', tilt: Math.sin(lt * 2.2) * 0.06, rim: { dx: 10, dy: -4 } });
      // faint muddled whisper ghosts around his head
      for (let i = 0; i < 4; i++) { const p = (lt * 0.35 + i / 4) % 1; E.thoughtText(c, ['...', '?', '...', '!?'][i], 860 + Math.cos(i * 1.7 + lt) * (260 + p * 80), 420 + Math.sin(i * 2.3 + lt) * 160, { size: 60, a: Math.sin(p * Math.PI) * 0.5 }); }
    } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah clutches his head outside the café; faint whisper ghosts swirl ("losing his mind").' });

  // 2B — Noah pushes out onto the busy street (wide)
  E.cut('s02b_outside', E.ph('s02_vo1', 1, 2), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: E.lerp(500, 760, E.ease.io(E.clamp(lt / D))), y: 560, z: 0.9, focus: 1, ap: 6 });
    const L = E.SET.street(t);
    L.push({ d: 1, draw: (c) => {
      const r = E.rng(3);
      for (let i = 0; i < 7; i++) { const x = -200 + i * 330 + (i % 2 ? -1 : 1) * lt * 70; E.char(c, { x, y: 905, h: 300 + r() * 50, f: i % 2 ? -0.8 : 0.8, costume: E.extra(60 + i), pose: E.walkPose(lt * 1.6 + i * 0.3), expr: 'neutral', t, seed: i, rim: RIM }); }
      E.ch(c, 'noah', t, { x: E.lerp(420, 660, E.clamp(lt / D)), y: 910, h: 320, f: 0.8, pose: E.walkPose(lt * 1.6), expr: 'wide', look: [0.5, 0], rim: RIM });
      // tiny thought sparks above every head
      for (let i = 0; i < 7; i++) { const x = -200 + i * 330 + (i % 2 ? -1 : 1) * lt * 70; const p = E.pop(lt, 0.8 + i * 0.2, 0.3); if (p > 0) E.thought(c, { x, y: 520, w: 70, h: 44, s: p, text: '...', size: 34, seed: i, a: 0.85 }, t); }
    } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wide: Noah steps onto the morning street; a tiny "..." thought pops above every passer-by.' });

  // shared tracking frame for the three passers-by
  const track = (who, lineSay, lineTh, icon, ptsName) => (ctx, lt, t, s) => {
    const D = E.D(s);
    const nx = NX0 + (t - E.M('S02')) * SPEED;
    const cam = E.cam({ x: nx + 120, y: 560, z: 1.55, focus: 1, ap: 10 });
    const L = E.SET.street(t);
    const px = nx + 520 - lt * 190; // passer-by walking left past Noah
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'noah', t, { x: nx, y: 910, h: 340, f: 0.8, pose: E.walkPose((t - E.M('S02')) * 1.6), expr: 'wide', look: [0.6, 0], rim: RIM });
      E.ch(c, who, t, { x: px, y: 910, h: 360, f: -0.8, pose: who === 'biz' ? E.blendPose(E.walkPose(lt * 1.5), E.POSE.phone, 0.85) : E.walkPose(lt * 1.5), expr: who === 'man' ? 'angry' : 'neutral', rim: RIM, prop: who === 'biz' ? E.PROP.phone : null });
      if (lineTh) E.th(c, lineTh, t, { x: px + 40, y: 440, w: 260, h: 200, tail: [px, 590], inner: icon, size: 30, seed: 2 });
    } });
    E.layers(ctx, cam, L);
  };
  E.cut('s02c_biz', E.st('s02_biz_say') - 0.3, track('biz', 's02_biz_say', 's02_biz_th', E.icon.clockBoss), { type: 'TRACK', desc: 'Side-tracking: businessman on phone says "Almost at the office"; his thought window shows the boss tapping a foot beside a clock.' });
  E.cut('s02d_woman', E.st('s02_woman_th') - 0.35, track('woman', null, 's02_woman_th', E.icon.oven), { type: 'TRACK', desc: 'Woman passes; holographic window with a glowing oven: "Did I leave the oven on?"' });

  // 2E — punch-in on the staring man (snap zoom)
  E.cut('s02e_stare', E.st('s02_man_th') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const snap = E.seg(lt, 0, 0.18, 'out');
    const cam = E.cam({ x: E.lerp(1100, 1150, snap), y: E.lerp(540, 600, snap), z: E.lerp(1.4, 2.2, snap) + lt * 0.02, focus: 1, ap: 12, shakeX: lt < 0.25 ? Math.sin(lt * 80) * 4 : 0 });
    const L = E.SET.street(t);
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'man', t, { x: 1220, y: 900, h: 380, f: -0.35, pose: 'pocket', expr: 'angry', look: [-0.6, 0], rim: RIM });
      E.th(c, 's02_man_th', t, { x: 1010, y: 560, w: 250, h: 96, tail: [1180, 590], size: 26 });
    } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 700, y: 1700, h: 1100, f: 0.6, faceAlpha: 0, rim: RIM }) });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Snap zoom onto a man in a flat cap staring right back at Noah: "Why is that kid staring at me?"' });

  // 2F — Noah CU amazed: "Oh my god. This is actually real."
  E.cut('s02f_real', E.st('s02_noah1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 14 });
    const L = E.SET.street(t + 40);
    L[3].d = 0.6; L[4].d = 0.62;
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'noah', t, { x: 960, y: E.headAt(1250, 470), h: 1250, f: 0.15, pose: 'stand', expr: 'amazed', rim: { dx: 10, dy: -4, color: '#ffc4a0' } });
    } });
    L.push({ d: 1.5, draw: (c) => E.bokeh(c, t, { n: 6, seed: 4, a: 0.1, rmin: 80, rmax: 200 }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Close-up: Noah grins in disbelief — "Oh my god. This is actually real."' });
})();
