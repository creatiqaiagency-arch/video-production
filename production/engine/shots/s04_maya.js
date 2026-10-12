// SCENE 4 (V2) — What his crush thinks · SCENE 5 — the cafeteria.
(function () {
  const E = globalThis.E;
  const K = E.KEY, RIM = K.hallR;
  const hallStudents = (c, t, lt, seed, n = 5) => { const r = E.rng(seed); for (let i = 0; i < n; i++) { const y = 700 + r() * 220, dir = r() < 0.5 ? -1 : 1, x = 500 + r() * 1300 + dir * lt * 50 * (y / 900); E.char(c, { x, y, h: E.hallH(y), f: dir * 0.7, costume: E.extra(seed * 10 + i), pose: E.walkPose(lt * 1.5 + i), t, seed: i, rim: RIM }); } };

  // 4A — 3/4 hallway: Noah strolls in, cocky
  E.cut('s04a_hall', E.M('S04'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, x: 960, dx: 30, focus: 1, ap: 5 });
    const L = E.SET.hall3q(t, { mood: 'day' });
    L.push({ d: 1, draw: (c) => { hallStudents(c, t, lt, 21, 4); const y = E.lerp(1000, 900, E.clamp(lt / D)); E.ch(c, 'noah', t, { x: E.lerp(600, 760, E.clamp(lt / D)), y, h: E.hallH(y), f: 0.6, pose: E.walkPose(lt * 1.6), expr: 'smug', rim: RIM }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: '3/4 hallway with lockers receding and window light on the floor: Noah strolls in, cocky.' });

  // 4A2 — Noah scans the hallway; thoughts pop over students ("more than anyone")
  E.cut('s04a2_scan', E.sg('s04_vo1', 2) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.15, z1: 1.2, x: 1000, y: 560, focus: 0.7, ap: 7 });
    const L = E.SET.hall3q(t, { mood: 'day' });
    L.push({ d: 0.7, draw: (c) => { for (let i = 0; i < 4; i++) { const y = 720 + i * 25, x = 900 + i * 180; E.char(c, { x, y, h: E.hallH(y), f: -0.6, costume: E.extra(220 + i), pose: 'stand', t, seed: i, rim: RIM }); E.thought(c, { x: x + 10, y: y - E.hallH(y) - 50, w: 150, h: 46, s: E.pop(lt, 0.3 + i * 0.4) * 0.8, text: ['test?', 'hungry', 'meh', 'tired'][i], size: 26, seed: i, noClamp: true, tail: [x, y - E.hallH(y) + 10] }, t); } } });
    L.push({ d: 1.3, draw: (c) => E.ch(c, 'noah', t, { x: 420, y: 1500, h: 1100, f: 0.7, pose: 'pocket', expr: 'smug', faceAlpha: 0, rim: RIM, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder down the hallway: small thoughts pop over students as he scans them ("more than anyone").' });

  // 4B — corridor reveal: Maya alone in the light at the end; MAYA label held
  E.cut('s04b_maya_reveal', E.sg('s04_vo1', 3) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.16, x: 960, y: 520, focus: 0.2, ap: 8 });
    const L = E.SET.corridor(t);
    L.push({ d: 0.2, sharp: true, draw: (c) => E.ch(c, 'maya', t, { x: 980, y: 650, h: 200, f: -0.5, pose: E.poseAt(lt, [[0, 'clutch'], [1.6, E.POSE.neck]]), expr: 'smile', rim: { dx: 0.4, dy: -1, color: '#ffe6b8' } }) });
    L.push({ d: 1.5, draw: (c) => E.char(c, { x: 260, y: 2100, h: 1600, f: 0.8, costume: E.extra(240), pose: 'stand', t, rim: RIM, faceAlpha: 0, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
    { const la = E.fadeIO(lt, 0.15, D, 0.3, 0.3); ctx.save(); ctx.globalAlpha = la; ctx.fillStyle = 'rgba(14,8,22,0.7)'; ctx.beginPath(); ctx.roundRect(860, 820, 240, 70, 16); ctx.fill(); ctx.restore(); E.label(ctx, 'MAYA', 980, 857, la, 40); }
  }, { type: 'WS', desc: 'One-point corridor: Maya alone in a warm pool of light at the far end, holding her books; the label MAYA holds on screen.' });

  // 4C — Noah hides behind an open locker door, peeking (too scared to talk to her)
  E.cut('s04c_hide', E.sg('s04_vo1', 5) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, x: 700, y: 620, focus: 1, ap: 8 });
    const L = E.SET.hall3q(t, { mood: 'day' });
    L.push({ d: 1, draw: (c) => {
      const peek = E.seg(lt, 0.3, 0.8) - E.seg(lt, D - 0.9, D - 0.4) * 0.7;
      E.ch(c, 'noah', t, { x: 520 + peek * 60, y: 1010, h: E.hallH(1010), f: 0.75, pose: 'clutch', expr: 'nervous', look: [1, -0.2], lean: peek * 0.6, rim: RIM });
      c.fillStyle = '#2c3550'; c.beginPath(); c.moveTo(640, 360); c.lineTo(820, 400); c.lineTo(820, 1000); c.lineTo(640, 1040); c.closePath(); c.fill(); c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(690, 460, 90, 10);
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Comedic: Noah hides behind an open locker door and peeks out nervously (too scared to talk to her for a year).' });

  // 4D — long-lens push from behind Noah toward Maya; focus racks to her
  E.cut('s04d_push', E.M('push') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.io(E.clamp(lt / D));
    const cam = E.cam({ z: E.lerp(1.2, 2.2, k), x: 980, y: E.lerp(520, 560, k), focus: E.lerp(0.9, 0.25, E.seg(lt, 0.2, 1.2)), ap: 10 });
    const L = E.SET.corridor(t);
    L.push({ d: 0.25, draw: (c) => E.ch(c, 'maya', t, { x: 980, y: 650, h: 200, f: -0.5, pose: 'clutch', expr: 'smile', look: [-0.3, 0], rim: { dx: 0.4, dy: -1, color: '#ffe6b8' } }) });
    L.push({ d: 0.9, draw: (c) => E.ch(c, 'noah', t, { x: 760, y: 1250, h: 560, f: 0.6, pose: E.walkPose(lt * 0.9, 0.5), expr: 'nervous', rim: RIM, faceAlpha: 0 }) });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Long-lens push from behind Noah toward Maya; focus racks from Noah to Maya as the distance compresses.' });

  // 4E — Maya MS, pink thought on a dark wall area
  E.cut('s04e_cute', E.st('s04_maya_th1') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 13 });
    const L = E.SET.hall3q(t, { mood: 'day', back: [300, 330, 600, 640] }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'maya', t, { x: 1100, y: E.headAt(1000, 470), h: 1000, f: -0.4, pose: 'clutch', expr: 'smile', look: [-0.6, 0], rim: { dx: -1, dy: -0.4, color: '#ffd8b8' }, ground: false, shadow: false });
      E.th(c, 's04_maya_th1', t, { x: 520, y: 330, w: 560, h: 150, tail: [920, 340], kind: 'pink', size: 52 });
      for (let i = 0; i < 4; i++) { const p = ((lt * 0.4 + i / 4) % 1); const a = E.seg(lt, 0.6, 1.0) * Math.sin(p * Math.PI) * 0.7; c.fillStyle = E.rgba('#ff9ccf', a); const hx = 350 + i * 120, hy = 560 - p * 160; c.beginPath(); c.arc(hx - 9, hy, 10, Math.PI, 0); c.arc(hx + 9, hy, 10, Math.PI, 0); c.lineTo(hx, hy + 20); c.closePath(); c.fill(); }
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Maya (books held to her chest) glances over; a pink handwritten thought with tiny hearts: "Wait... Noah actually looks kinda cute today."' });

  // 4F — Noah: eyes wide → whispered "No way" → triumphant fist-pump
  E.cut('s04f_noway', E.st('s04_noah1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.18, focus: 1, ap: 14 });
    const L = E.SET.hall3q(t, { mood: 'day' }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1200, 470), h: 1200, f: -0.2, pose: E.poseAt(lt, [[0, 'stand'], [D * 0.5, 'cheerFists', 0.2]]), expr: lt < D * 0.45 ? 'amazed' : 'happy', rim: RIM, ground: false, shadow: false, talkScale: 0.5 }) });
    L.push({ d: 1.3, sharp: true, draw: (c) => { const a = E.seg(lt, D * 0.5, D); for (let i = 0; i < 18; i++) { const r = E.rng(i + 3); const x = r() * 1920, y = 1100 - ((lt * 200 * (0.5 + r())) % 1200); c.fillStyle = E.rgba(['#ff9ccf', '#ffd166', '#f1eaff'][i % 3], a * 0.7); c.beginPath(); c.arc(x, y, 5 + r() * 6, 0, Math.PI * 2); c.fill(); } } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah\'s eyes go wide — whispers "No way" — then a triumphant double fist-pump with sparkles.' });

  // 4G — Maya tilts her head; cooler blue thought "Why is he smiling like that?"
  E.cut('s04g_why', E.st('s04_maya_th2') - 0.25, (ctx, lt, t, s) => {
    const cam = E.push(lt, E.D(s), { z0: 1.08, z1: 1.12, focus: 1, ap: 13 });
    const L = E.SET.hall3q(t, { mood: 'day', back: [300, 330, 600, 640] }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'maya', t, { x: 1100, y: E.headAt(1000, 470), h: 1000, f: -0.4, pose: 'clutch', expr: 'worried', look: [-0.6, 0], tilt: E.ease.back(E.clamp((lt - 0.4) / 0.35)) * 0.18, rim: { dx: -1, dy: -0.4, color: '#ffd8b8' }, ground: false, shadow: false }); E.th(c, 's04_maya_th2', t, { x: 540, y: 330, w: 520, h: 130, tail: [920, 340], size: 50, color: '#6fa8ff' }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Maya tilts her head, puzzled; a cooler blue thought: "Why is he smiling like that?"' });

  // 4H — hard cut: Noah's awkward grin, eyes slide away ("Oh.")
  E.cut('s04h_oh', E.st('s04_noah2') - 0.1, (ctx, lt, t, s) => {
    const cam = E.cam({ z: 1.25, focus: 1, ap: 14, x: 960 + E.wobble(lt, 2, 0.3, 2) });
    const L = E.SET.hall3q(t, { mood: 'day' }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1150, 480), h: 1150, f: E.lerp(-0.1, 0.7, E.seg(lt, 0.5, 0.9)), pose: 'neck', expr: 'awkward', look: [E.lerp(0, 1, E.seg(lt, 0.5, 0.9)), 0.3], rim: RIM, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Hard cut: Noah freezes into a painfully awkward grin, rubs his neck and looks away — "Oh." (record scratch).' });

  // ===== SCENE 5 =====
  E.cut('s05a_lucky', E.M('S05'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, x: 960, focus: 1, ap: 5 });
    const L = E.SET.hall3q(t, { mood: 'day' });
    L.push({ d: 1, draw: (c) => { const y = E.lerp(760, 980, E.clamp(lt / D)); const x = E.lerp(1250, 900, E.clamp(lt / D)); E.ch(c, 'noah', t, { x, y, h: E.hallH(y), f: -0.6, pose: E.walkPose(lt * 1.9, 1.2), expr: 'happy', rim: RIM, tilt: Math.sin(lt * 6) * 0.05 });
      for (let i = 0; i < 10; i++) { const r = E.rng(i + 1); const p = (lt * 0.6 + r()) % 1; c.fillStyle = E.rgba('#ffd166', Math.sin(p * Math.PI) * 0.8); const sx = x + (r() - 0.5) * 300, sy = y - E.hallH(y) * 0.9 - p * 160; c.save(); c.translate(sx, sy); c.rotate(p * 3); c.fillRect(-4, -12, 8, 24); c.fillRect(-12, -4, 24, 8); c.restore(); } } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Noah struts down the 3/4 hallway toward camera with sparkles — "luckiest person alive".' });
  E.cut('s05a2_highfive', E.sg('s05_vo1', 1) + 1.0, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, x: 960, y: 600, focus: 1, ap: 9, rot: -0.03 });
    const L = E.SET.hall3q(t, { mood: 'day' }); L[0].d = 0.35;
    const hi = E.seg(lt, 0.4, 0.7, 'back');
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 780, y: 1100, h: 640, f: 0.7, pose: E.blendPose(E.walkPose(lt * 1.6), E.POSE.raise, hi), expr: 'laugh', rim: RIM, talk: 0 }); E.ch(c, 'leo', t, { x: 1180, y: 1100, h: 650, f: -0.7, pose: E.blendPose(E.walkPose(lt * 1.6 + 0.5), E.POSE.raise, hi), expr: 'laugh', rim: RIM, talk: 0 });
      if (lt > 0.6 && lt < 1.0) { c.save(); c.globalCompositeOperation = 'lighter'; E.glow(c, 980, 520, 160, '#ffd166', 0.6 * (1 - (lt - 0.6) / 0.4)); c.restore(); } } });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Low angle: Leo passes and the two best friends slap a high-five mid-stride.' });

  // 5B — Noah pushes the CAFETERIA doors open; warm light spills toward camera
  E.cut('s05b_doors', E.sg('s05_vo1', 2) - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 8 });
    const open = E.seg(t, E.M('doors'), E.M('doors') + 0.6, 'out');
    const L = [{ d: 0.3, draw: (c) => { E.vgrad(c, -600, -300, 3200, 1700, [[0, '#4a3038'], [1, '#2e1e24']]);
      c.fillStyle = '#ffd38a'; c.fillRect(700, 260, 520, 630); E.glow(c, 960, 520, 500 + 600 * open, '#ffd38a', 0.25 + 0.5 * open);
      if (open > 0.05) for (let i = 0; i < 9; i++) { const r = E.rng(i + 50); E.char(c, { x: 720 + i * 60, y: 820, h: 150, f: r() * 2 - 1, costume: E.extra(400 + i), pose: 'stand', t, seed: i, rim: { dx: 0, dy: -1, color: '#fff1c9' } }); }
      for (const sd of [-1, 1]) { const ang = open * 1.2; const w = 260 * Math.cos(ang); c.fillStyle = '#6b3f34'; const x0 = 960; c.beginPath(); c.moveTo(x0, 260); c.lineTo(x0 + sd * w, 260 - 40 * Math.sin(ang)); c.lineTo(x0 + sd * w, 890 + 40 * Math.sin(ang)); c.lineTo(x0, 890); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,211,138,0.8)'; c.fillRect(x0 + sd * w * 0.25 - (sd < 0 ? w * 0.5 : 0), 330, w * 0.5, 170); }
      c.strokeStyle = '#1e1218'; c.lineWidth = 26; c.strokeRect(690, 250, 540, 650); c.fillStyle = '#1e1218'; c.fillRect(600, 160, 720, 50); c.fillStyle = '#efe6dc'; c.font = '900 38px Nunito'; c.textAlign = 'center'; c.fillText('CAFETERIA', 960, 197);
      E.vgrad(c, -600, 890, 3200, 500, [[0, '#3a2a2c'], [1, '#22161a']]);
      if (open > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = E.rgba('#ffd38a', 0.25 * open); c.beginPath(); c.moveTo(700, 890); c.lineTo(1220, 890); c.lineTo(1700, 1400); c.lineTo(220, 1400); c.closePath(); c.fill(); E.rays(c, 960, 560, 1200, 10, '#ffd38a', 0.12 * open, t, 1.4, Math.PI / 2); c.restore(); } } }];
    L.push({ d: 1, draw: (c) => { const step = E.seg(lt, 0, D * 0.6); E.ch(c, 'noah', t, { x: 960, y: E.lerp(1520, 1380, step), h: 900, f: 0, pose: E.blendPose(E.walkPose(lt * 1.2, 0.5), E.POSE.push, E.seg(lt, D * 0.35, D * 0.55)), faceAlpha: 0, rim: { dx: 0, dy: -1, color: '#ffd38a', k: 1.3 }, ground: false, shadow: false }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'From behind Noah: he walks up and pushes the CAFETERIA double doors open — warm light and a crowd spill out toward camera.' });

  // 5C — locked behind Noah in a perspective cafeteria; a thought shape over every student, multiplying
  E.cut('s05c_bubbles', E.M('doors') + 0.5, (ctx, lt, t, s) => {
    const D = E.D(s);
    const grow = E.clamp(lt / D);
    const cam = E.cam({ z: 1.0 + grow * 0.2, focus: 0.9, ap: 5, x: 980, y: 540 });
    const L = E.SET.cafPersp(t);
    L.push({ d: 0.6, draw: (c) => { E.tableP(c, -1, 0.0, 0.55); E.tableP(c, 1, 0.0, 0.55); const r = E.rng(9);
      for (let k = 0; k < 5; k++) for (const sd of [-1, 1]) for (let j = 0; j < 2; j++) { const z = 0.04 + k * 0.1; const y = 600 + 780 * z; const kk = (y - 450) / 150; const x = 1010 + sd * (260 + (j ? 150 : -150)) * kk; const h = 120 * kk; E.char(c, { x, y, h, f: r() * 2 - 1, costume: E.extra(500 + k * 10 + j + (sd > 0 ? 5 : 0)), pose: 'sit', t, seed: k + j, rim: { dx: -0.6, dy: -1, color: '#ffe6b8' }, seat: false });
        const p = E.pop(lt, 0.2 + r() * 1.4 * (1 - grow * 0.4)); if (p > 0) E.thought(c, { x: x + Math.sin(t + k) * 6, y: y - h - 26 * kk, w: 60 * kk + 30, h: 26 * kk + 16, s: p * (1 + grow * 0.5), a: 0.85, seed: k * 9 + j, noClamp: true }, t); } } });
    L.push({ d: 1.2, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 1500, h: 1000, f: 0, pose: 'stand', faceAlpha: 0, rim: { dx: 0, dy: -1, color: '#ffd59a' }, ground: false, shadow: false }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => E.panelField(c, t, { seed: 4, n: Math.floor(6 + grow * 26), x: 100, y: 150, w: 1700, h: 600, t0: s.t0 + 0.8, spread: D - 1, scale: 0.8, a: 0.65 }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Locked behind Noah in a deep perspective cafeteria: every student has a thought shape over their head; they multiply and overlap.' });

  // 5D — "Wait. Wait, hold on—" push into the thoughts until violet fills the screen
  E.cut('s05d_hold_on', E.st('s05_noah1') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.in(E.clamp(lt / D));
    const cam = E.cam({ z: 1.0 + k * 2.5, focus: 1, ap: 10 });
    const L = E.SET.cafPersp(t); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1100, 470), h: 1100, f: 0, pose: 'clutch', expr: 'worried', look: [E.wobble(lt, 1, 2, 1), -0.2], rim: { dx: 0.3, dy: -1, color: '#ffd59a' }, ground: false, shadow: false }) });
    L.push({ d: 1.0, sharp: true, draw: (c) => E.panelField(c, t, { seed: 7, n: 22 + Math.floor(k * 30), x: -200, y: 0, w: 2300, h: 1000, t0: s.t0, spread: D * 0.8, texts: E.CROWD_TEXT, a: 0.8 }) });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#a98bff', k * 0.55, 'screen');
  }, { type: 'CU', desc: 'Noah, worried ("Wait, hold on—"), as overlapping thought windows crowd in; camera pushes into them until violet fills the screen.' });
})();
