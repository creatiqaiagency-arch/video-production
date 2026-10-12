// SCENE 4 — What his crush thinks (hallway) + SCENE 5 — cafeteria doors.
(function () {
  const E = globalThis.E;
  const RIM = { dx: 4, dy: -2, color: '#ffd2a0' };

  // 4A — busy hallway, Noah walks confidently, students pass
  E.cut('s04a_hall', E.M('S04'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 700 + lt * 70, y: 560, z: 1.0, focus: 1, ap: 8 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => {
      for (let i = 0; i < 6; i++) { const dir = i % 2 ? -1 : 1; E.char(c, { x: 100 + i * 360 + dir * lt * 90, y: 900, h: 330 + (i % 3) * 15, f: dir * 0.8, costume: E.extra(200 + i), pose: E.walkPose(lt * 1.6 + i * 0.37), expr: 'neutral', t, seed: i, rim: RIM }); }
      E.ch(c, 'noah', t, { x: 520 + lt * 140, y: 905, h: 340, f: 0.8, pose: E.walkPose(lt * 1.7), expr: 'smile', rim: RIM });
    } });
    L.push({ d: 1.5, blur: 10, draw: (c) => { for (let i = 0; i < 2; i++) E.char(c, { x: 400 + i * 1300 - lt * 160, y: 1700, h: 1100, f: -0.8, costume: E.extra(230 + i), pose: E.walkPose(lt * 1.4 + i), t, rim: RIM, faceAlpha: 0 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Busy school hallway: Noah walks through, confident; blurred students pass in the foreground.' });

  // 4B — reveal Maya at the far end of the corridor ("Maya.")
  E.cut('s04b_maya_reveal', E.ph('s04_vo1', 1, 3) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.18, x: 960, y: 520, focus: 0.2, ap: 8 });
    const L = E.SET.corridor(t);
    L.push({ d: 0.2, sharp: true, draw: (c) => { E.ch(c, 'maya', t, { x: 980, y: 650, h: 200, f: -0.5, pose: E.blendPose(E.POSE.stand, E.POSE.bag, 0.6), expr: 'smile', rim: { dx: 3, dy: -2, color: '#ffe6b8' } }); E.char(c, { x: 1090, y: 655, h: 195, f: -0.8, costume: E.extra(301), pose: 'stand', t, seed: 3, rim: { dx: 3, color: '#ffe6b8' } }); } });
    L.push({ d: 1.5, draw: (c) => { E.char(c, { x: 260, y: 2100, h: 1600, f: 0.8, costume: E.extra(240), pose: 'stand', t, rim: RIM, faceAlpha: 0 }); } });
    E.layers(ctx, cam, L);
    const a = E.fadeIO(lt, 0.5, D, 0.4, 0.3); E.label(ctx, 'MAYA', 980, 330, a * 0.9, 30);
  }, { type: 'WS', desc: 'One-point corridor: Maya stands in a pool of warm light at the far end (label: MAYA).' });

  // 4C — Noah hides behind an open locker door, peeking (too scared to talk to her)
  E.cut('s04c_hide', E.ph('s04_vo1', 2, 3) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.6, z1: 1.7, x: 1060, y: 640, focus: 1, ap: 10 });
    const L = E.SET.hallway(t, { boardX: 400 });
    L.push({ d: 1, draw: (c) => {
      const peek = E.seg(lt, 0.4, 1.0) - E.seg(lt, D - 1.0, D - 0.5) * 0.7;
      E.ch(c, 'noah', t, { x: 1000 + peek * 70, y: 905, h: 340, f: 0.8, pose: 'clutch', expr: 'nervous', look: [1, -0.2], rim: RIM, lean: peek * 0.5 });
      // open locker door in front of him
      c.fillStyle = '#3d5a73'; c.beginPath(); c.moveTo(1110, 470); c.lineTo(1200, 440); c.lineTo(1200, 920); c.lineTo(1110, 890); c.closePath(); c.fill(); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(1140, 520, 40, 6);
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Comedic: Noah hides behind an open locker door, peeking out nervously (too scared for a year).' });

  // 4D — long-lens push: Noah small in FG (blurred), Maya far; distance compresses
  E.cut('s04d_push', E.M('push') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.io(E.clamp(lt / D));
    const cam = E.cam({ z: E.lerp(1.2, 2.2, k), x: 980, y: E.lerp(520, 560, k), focus: E.lerp(0.9, 0.25, E.seg(lt, 0.2, 1.2)), ap: 10 });
    const L = E.SET.corridor(t);
    L.push({ d: 0.25, draw: (c) => E.ch(c, 'maya', t, { x: 980, y: 650, h: 200, f: -0.5, pose: E.blendPose(E.POSE.stand, E.POSE.bag, 0.6), expr: 'smile', look: [-0.3, 0], rim: { dx: 3, dy: -2, color: '#ffe6b8' } }) });
    L.push({ d: 0.9, draw: (c) => E.ch(c, 'noah', t, { x: 760, y: 1250, h: 560, f: 0.6, pose: E.walkPose(lt * 0.9, 0.5), expr: 'nervous', rim: RIM, faceAlpha: 0 }) });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Long-lens push from behind Noah toward Maya; focus racks from Noah to Maya as the distance compresses.' });

  // 4E — Maya MS, pink handwritten thought: "Wait... Noah actually looks kinda cute today."
  E.cut('s04e_cute', E.st('s04_maya_th1') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 13 });
    const L = E.SET.soft(t, { top: '#7a5060', bot: '#4a3038', window: true, wx: 1180, wy: 120, seed: 41 });
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'maya', t, { x: 700, y: E.headAt(1000, 470), h: 1000, f: 0.45, pose: E.blendPose(E.POSE.stand, E.POSE.bag, 0.6), expr: 'smile', look: [0.6, 0], rim: { dx: 10, dy: -4, color: '#ffd8b8' } });
      E.th(c, 's04_maya_th1', t, { x: 1260, y: 330, w: 640, h: 170, tail: [860, 340], kind: 'pink', size: 52 });
      // little hearts
      for (let i = 0; i < 4; i++) { const p = ((lt * 0.4 + i / 4) % 1); const a = E.seg(lt, 0.6, 1.0) * Math.sin(p * Math.PI) * 0.7; c.fillStyle = E.rgba('#ff9ccf', a); const hx = 1100 + i * 120, hy = 520 - p * 160; c.beginPath(); c.arc(hx - 9, hy, 10, Math.PI, 0); c.arc(hx + 9, hy, 10, Math.PI, 0); c.lineTo(hx, hy + 20); c.closePath(); c.fill(); }
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Maya glances over; a pink handwritten thought (with tiny hearts): "Wait... Noah actually looks kinda cute today."' });

  // 4F — Noah eyes widen, whisper "No way", triumphant grin builds
  E.cut('s04f_noway', E.st('s04_noah1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.18, focus: 1, ap: 14 });
    const L = E.SET.hallway(t + 10); L[0].d = 0.25; L[1].d = 0.35; L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1200, 470), h: 1200, f: -0.2, pose: E.poseAt(lt, [[0, 'stand'], [D * 0.55, 'cheer']]), expr: lt < D * 0.45 ? 'amazed' : 'happy', rim: RIM }) });
    L.push({ d: 1.3, sharp: true, draw: (c) => { const a = E.seg(lt, D * 0.5, D); for (let i = 0; i < 18; i++) { const r = E.rng(i + 3); const x = r() * 1920, y = 1100 - ((lt * 200 * (0.5 + r())) % 1200); c.fillStyle = E.rgba(['#ff9ccf', '#ffd166', '#f1eaff'][i % 3], a * 0.7); c.beginPath(); c.arc(x, y, 5 + r() * 6, 0, Math.PI * 2); c.fill(); } } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah\'s eyes go wide — whispers "No way" — then a triumphant fist-pump grin with sparkles.' });

  // 4G — second thought, different colour: "Why is he smiling like that?"
  E.cut('s04g_why', E.st('s04_maya_th2') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.08, z1: 1.12, focus: 1, ap: 13 });
    const L = E.SET.soft(t, { top: '#7a5060', bot: '#4a3038', window: true, wx: 1180, wy: 120, seed: 41 });
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'maya', t, { x: 700, y: E.headAt(1000, 470), h: 1000, f: 0.45, pose: 'bag', expr: 'worried', look: [0.6, 0], tilt: 0.12, rim: { dx: 10, dy: -4, color: '#ffd8b8' } });
      E.th(c, 's04_maya_th2', t, { x: 1260, y: 330, w: 560, h: 150, tail: [860, 340], size: 50, color: '#6fa8ff' });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Maya tilts her head, puzzled; a cooler blue thought: "Why is he smiling like that?"' });

  // 4H — hard cut: Noah's painfully awkward grin, looks away ("Oh.")
  E.cut('s04h_oh', E.st('s04_noah2') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.25, focus: 1, ap: 14, x: 960 + E.wobble(lt, 2, 0.3, 2) });
    const L = E.SET.hallway(t + 10); L[0].d = 0.25; L[1].d = 0.35; L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1150, 480), h: 1150, f: E.lerp(-0.1, 0.7, E.seg(lt, 0.5, 0.9)), pose: 'pocket', expr: 'awkward', look: [E.lerp(0, 1, E.seg(lt, 0.5, 0.9)), 0.3], rim: RIM }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Hard cut: Noah freezes into a painfully awkward grin and looks away — "Oh." (record scratch).' });

  // ===== SCENE 5 =====
  // 5A — Noah struts, luckiest person alive (sparkles)
  E.cut('s05a_lucky', E.M('S05'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 600 + lt * 120, y: 540, z: 1.25, focus: 1, ap: 9 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 480 + lt * 170, y: 905, h: 360, f: 0.8, pose: E.walkPose(lt * 1.9, 1.2), expr: 'happy', rim: RIM, tilt: Math.sin(lt * 6) * 0.05 }); for (let i = 0; i < 10; i++) { const r = E.rng(i + 1); const p = (lt * 0.6 + r()) % 1; c.fillStyle = E.rgba('#ffd166', Math.sin(p * Math.PI) * 0.8); const x = 480 + lt * 170 + (r() - 0.5) * 300, y = 600 - p * 200; c.save(); c.translate(x, y); c.rotate(p * 3); c.fillRect(-4, -12, 8, 24); c.fillRect(-12, -4, 24, 8); c.restore(); } } });
    E.layers(ctx, cam, L);
  }, { type: 'TRACK', desc: 'Noah struts down the hallway with sparkles — "luckiest person alive".' });

  // 5B — cafeteria double doors from the hallway side; doors swing open
  E.cut('s05b_doors', E.at('s05_vo1', 0.55), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 8 });
    const open = E.seg(t, E.M('doors'), E.M('doors') + 0.6, 'out');
    const L = [{ d: 0.3, draw: (c) => { E.vgrad(c, -600, -300, 3200, 1700, [[0, '#5d3d44'], [1, '#3a262c']]); // cafeteria glow behind doors
      E.glow(c, 960, 520, 700 * (0.4 + open), '#ffd59a', 0.35 + 0.45 * open); E.vgrad(c, -600, 890, 3200, 500, [[0, '#6a4644'], [1, '#3a2428']]);
      c.fillStyle = '#2a1826'; c.fillRect(600, 170, 720, 40); c.fillStyle = '#efe6dc'; c.font = '900 38px Nunito'; c.textAlign = 'center'; c.fillText('CAFETERIA', 960, 203);
      // crowd silhouettes visible through the opening
      if (open > 0.05) { for (let i = 0; i < 9; i++) { const r = E.rng(i + 50); E.char(c, { x: 700 + i * 65, y: 820, h: 150, f: r() * 2 - 1, costume: E.extra(400 + i), pose: 'stand', t, seed: i, rim: { dx: 2, color: '#ffe6b8' } }); } }
      // doors
      for (const sd of [-1, 1]) { const w = 260 * (1 - open * 0.75); const x = 960 + sd * (open * 60); c.fillStyle = '#7a4a3a'; c.fillRect(sd < 0 ? x - w : x, 260, w, 630); c.fillStyle = '#ffe6b8'; c.fillRect((sd < 0 ? x - w : x) + w * 0.25, 330, w * 0.5, 180); c.fillStyle = '#c9c0c8'; c.fillRect(sd < 0 ? x - 30 : x + 10, 560, 20, 90); }
      c.strokeStyle = '#2a1826'; c.lineWidth = 24; c.strokeRect(690, 250, 540, 650);
    } }];
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.lerp(1500, 1350, E.clamp(lt / D)), h: 900, f: 0, pose: E.poseAt(lt, [[0, 'stand'], [0.4, { aB: [1.3, 0.2], aF: [1.3, 0.2], lB: [0.04, 0], lF: [-0.04, 0] }]]), faceAlpha: 0, rim: { dx: 0, dy: -8, color: '#ffd59a' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'From behind Noah: he pushes the CAFETERIA double doors open — warm light and a crowd beyond.' });

  // 5C — camera locked behind Noah; a thought shape above each student, multiplying
  E.cut('s05c_bubbles', E.M('doors') + 0.45, (ctx, lt, t, s) => {
    const D = E.D(s);
    const grow = E.clamp(lt / D);
    const cam = E.cam({ z: 1.0 + grow * 0.25, focus: 0.9, ap: 6, x: 960, y: 520 });
    const L = E.SET.cafeteriaDeep(t);
    L.push({ d: 0.6, draw: (c) => { const r = E.rng(9); for (let k = 0; k < 4; k++) for (let i = 0; i < 9; i++) { const z = Math.pow(0.68, k + 1); const x = 960 + (i - 4) * 230 * z * 1.6, y = 490 + 700 * z * 0.75; E.char(c, { x, y, h: 420 * z, f: r() * 2 - 1, costume: E.extra(500 + k * 10 + i), pose: 'sit', t, seed: i + k, rim: { dx: 2, color: '#ffe6b8' } }); const p = E.pop(lt, 0.3 + r() * 1.5 * (1 - grow * 0.5)); if (p > 0) E.thought(c, { x: x + Math.sin(t + i) * 8, y: y - 420 * z - 30, w: 110 * z + 40, h: 50 * z + 22, s: p * (1 + grow * 0.6), a: 0.85, seed: i + k * 9 }, t); } } });
    L.push({ d: 1.2, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 1500, h: 1000, f: 0, pose: 'stand', faceAlpha: 0, rim: { dx: 0, dy: -8, color: '#ffd59a' } }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => E.panelField(c, t, { seed: 4, n: Math.floor(10 + grow * 30), x: 100, y: 150, w: 1700, h: 600, t0: s.t0 + 0.8, spread: D - 1, scale: 0.8, a: 0.7 }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Locked behind Noah: every student has a thought shape above their head; they multiply and overlap.' });

  // 5D — "Wait. Wait, hold on—" push into the overlapping thoughts until they fill the screen
  E.cut('s05d_hold_on', E.st('s05_noah1') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.in(E.clamp(lt / D));
    const cam = E.cam({ z: 1.0 + k * 2.5, focus: 1, ap: 10 });
    const L = E.SET.cafeteriaDeep(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 960, y: E.headAt(1100, 470), h: 1100, f: 0, pose: 'clutch', expr: 'worried', look: [E.wobble(lt, 1, 2, 1), -0.2], rim: { dx: 8, dy: -5, color: '#ffd59a' } }); } });
    L.push({ d: 1.0, sharp: true, draw: (c) => E.panelField(c, t, { seed: 7, n: 26 + Math.floor(k * 30), x: -200, y: 0, w: 2300, h: 1000, t0: s.t0, spread: D * 0.8, texts: E.CROWD_TEXT, a: 0.8 }) });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#a98bff', k * 0.55, 'screen');
  }, { type: 'CU', desc: 'Noah, worried ("Wait, hold on—"), as overlapping thought windows crowd in; camera pushes into them until violet fills the screen.' });
})();
