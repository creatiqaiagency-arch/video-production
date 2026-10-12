// SCENE 3 — The first real advantage (classroom).
(function () {
  const E = globalThis.E;
  const RIM = { dx: -4, dy: -2, color: '#ffd2a0' }; // windows on the left
  const students = (c, t, rows, o = {}) => { // rows of seated students at desks (world space)
    const r = E.rng(o.seed || 5);
    rows.forEach(([y, s, n, x0, gap], ri) => { for (let i = 0; i < n; i++) { const x = x0 + i * gap; if (o.skip && o.skip(ri, i)) continue; E.char(c, { x, y, h: 300 * s, f: 0.75, costume: E.extra(100 + ri * 10 + i), pose: 'sitDesk', expr: o.expr || 'neutral', t, seed: ri * 7 + i, rim: RIM, desat: o.desat }); E.desk(c, x + 70 * s, y + 10 * s, s); } });
  };
  const noahDesk = (c, t, x, y, s, o = {}) => { E.ch(c, 'noah', t, Object.assign({ x, y, h: 300 * s, f: 0.75, pose: 'sitDesk', expr: 'neutral', rim: RIM }, o)); E.desk(c, x + 70 * s, y + 10 * s, s); };

  // 3A — Noah at his desk, smug, tapping his temple; tiny thoughts around classmates
  E.cut('s03a_smug', E.M('S03') - 0.05, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.5, z1: 1.62, x: 1100, y: 640, focus: 1, ap: 9 });
    const L = E.SET.classroom(t, { noDesksBack: true });
    L.push({ d: 1, draw: (c) => {
      students(c, t, [[860, 1, 5, 280, 380]], { skip: (r, i) => i === 2 });
      noahDesk(c, t, 1040, 860, 1, { pose: E.poseAt(lt, [[0, 'sitDesk'], [0.8, { aB: [0.9, 1.0], aF: [2.2, 2.6], lB: [1.5, -1.5], lF: [1.45, -1.5] }]]), expr: 'smug' });
      for (let i = 0; i < 4; i++) { const x = [280, 660, 1420, 1800][i]; const p = E.pop(lt, 0.6 + i * 0.35); if (p > 0) E.thought(c, { x, y: 470, w: 200, h: 64, s: p, text: ['lunch...', 'so bored', 'is it 3pm?', 'zzz'][i], size: 30, seed: i, a: 0.8 }, t); }
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Classroom: Noah taps his temple smugly; small thoughts pop over bored classmates.' });

  // 3B — wide classroom establishing; teacher at the chalkboard
  E.cut('s03b_wide', E.at('s03_vo1', 0.55), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 0.92, z1: 0.98, x: 960, y: 560, focus: 0.9, ap: 6 });
    const L = E.SET.classroom(t);
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'teacher', t, { x: 1180, y: 840, h: 420, f: -0.6, pose: E.poseAt(lt, [[0, 'point'], [D * 0.5, 'stand']]), expr: 'neutral', rim: RIM }); } });
    L.push({ d: 1.05, draw: (c) => { students(c, t, [[1040, 1.25, 4, 120, 500]], { skip: (r, i) => i === 3 }); noahDesk(c, t, 1620, 1040, 1.25, { expr: 'smug' }); } });
    L.push(E.dustL(t, { d: 1.1 }));
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wide classroom: teacher at the chalkboard, Noah near the back.' });

  // 3C — teacher asks question seven
  E.cut('s03c_teacher', E.st('s03_teacher1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 12 });
    const L = E.SET.classroom(t); L[0].d = 0.35; L[1].skip = true;
    L.push({ d: 1, draw: (c) => E.ch(c, 'teacher', t, { x: 980, y: E.headAt(900, 420), h: 900, f: 0.35, pose: 'point', expr: 'neutral', look: [0.6, 0], rim: { dx: -10, dy: -3, color: '#ffd2a0' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Teacher (glasses) points: "Noah. What\'s the answer to question seven?"' });

  // 3D — Noah "Uh..."
  E.cut('s03d_uh', E.st('s03_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.12, focus: 1, ap: 14 });
    const L = E.SET.classroom(t + 20); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 900, y: E.headAt(1050, 460), h: 1050, f: -0.3, pose: 'sitDesk', expr: 'nervous', look: [-0.5, -0.3], rim: RIM }); } });
    L.push({ d: 1.4, draw: (c) => E.desk(c, 900, 1500, 4.2) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Close-up: Noah freezes, nervous — "Uh..."' });

  // 3E — room desaturates, luminous B above the teacher, then travels to Noah's desk
  E.cut('s03e_B', E.st('s03_teacher_th') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const tB = E.M('b_travel') - s.t0; // B starts flying
    const travel = E.seg(lt, tB - 0.1, D - 0.2, 'io');
    const cam = E.cam({ x: E.lerp(1050, 1500, travel), y: E.lerp(560, 640, travel), z: E.lerp(1.0, 1.25, travel), focus: 1, ap: 7 });
    const L = E.SET.classroom(t);
    L.push({ d: 0.9, draw: (c) => E.ch(c, 'teacher', t, { x: 1180, y: 840, h: 420, f: -0.6, pose: 'crossed', expr: 'tired', rim: RIM }) });
    L.push({ d: 1.05, draw: (c) => { students(c, t, [[1040, 1.25, 4, 120, 500]], { skip: (r, i) => i === 3 }); noahDesk(c, t, 1620, 1040, 1.25, { expr: travel > 0.8 ? 'smug' : 'nervous', look: [-0.6, -0.5] }); } });
    E.layers(ctx, cam, L);
    // desaturate room except the B
    E.screenFill(ctx, '#808080', 0.85 * E.seg(lt, 0.1, 0.6), 'saturation');
    E.screenFill(ctx, '#1a1030', 0.35 * E.seg(lt, 0.1, 0.6), 'multiply');
    ctx.save(); E.applyCam(ctx, cam, 1);
    E.th(ctx, 's03_teacher_th', t, { x: 1180, y: 300, w: 560, h: 120, tail: [1180, 400], size: 42, post: 0.4 });
    const bx = E.lerp(1180, 1700, travel), by = E.lerp(250, 640, travel) - Math.sin(travel * Math.PI) * 160;
    const ba = E.seg(t, E.at('s03_teacher_th', 0.75), E.at('s03_teacher_th', 0.95));
    if (ba > 0) { E.glow(ctx, bx, by, 220, '#a98bff', 0.5 * ba); E.textGlow(ctx, 'B', bx, by, { font: '900 150px Nunito', color: '#f1eaff', glow: 'rgba(169,139,255,1)', glowBlur: 40, a: ba }); }
    ctx.restore();
  }, { type: 'WS', desc: 'Room desaturates; teacher\'s thought "It\'s B" — a luminous B floats across the room and lands above Noah\'s desk.' });

  // 3F — Noah "B!" (confident) — fast
  E.cut('s03f_Bshout', E.st('s03_noah2') - 0.12, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(1.25, 1.12, E.seg(lt, 0, 0.25, 'out')), focus: 1, ap: 14 });
    const L = E.SET.classroom(t + 20); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 900, y: E.headAt(1000, 470), h: 1000, f: -0.3, pose: 'raise', expr: 'happy', rim: RIM }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah shoots his hand up: "B!"' });

  // 3G — smash cut teacher shocked "...Correct."
  E.cut('s03g_correct', E.st('s03_teacher2') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.15, z1: 1.2, focus: 1, ap: 14 });
    const L = E.SET.classroom(t); L[0].d = 0.35; L[1].skip = true;
    L.push({ d: 1, draw: (c) => E.ch(c, 'teacher', t, { x: 980, y: E.headAt(1000, 440), h: 1000, f: 0.15, pose: 'crossed', expr: 'shock', rim: { dx: -10, dy: -3, color: '#ffd2a0' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Smash cut: the teacher, stunned — "...Correct."' });

  // 3H — montage: three quick answers with glowing numbers/words (VO "school wasn't so difficult")
  const answers = [['x = 7', '#a98bff'], ['1776', '#a98bff'], ['H₂O', '#a98bff']];
  E.cut('s03h_montage', E.M('montage'), (ctx, lt, t, s) => {
    const D = E.D(s); const k = Math.min(2, Math.floor(lt / (D / 3))); const ll = lt - k * (D / 3); const dk = D / 3;
    const cam = E.cam({ z: 1.25 + ll * 0.05, x: [880, 1040, 960][k], y: 520, rot: [0.03, -0.03, 0][k], focus: 1, ap: 10 });
    const L = E.SET.classroom(t + k * 7, { clock: k * 1.2 });
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'noah', t, { x: [700, 1250, 980][k], y: 1010, h: 520, f: [0.6, -0.6, 0.2][k], pose: 'raise', expr: k === 2 ? 'smug' : 'happy', rim: RIM, talk: 0 });
      const p = E.pop(ll, 0.1, 0.3); if (p > 0) { c.save(); c.translate([1250, 700, 1500][k], 400); c.scale(p, p); E.textGlow(c, answers[k][0], 0, 0, { font: '900 110px Nunito', color: '#f1eaff', glow: 'rgba(169,139,255,1)', glowBlur: 36 }); c.restore(); }
      // flash-cut wipe line between beats
    } });
    E.layers(ctx, cam, L);
    if (ll < 0.08) E.screenFill(ctx, '#ffffff', 0.25 * (1 - ll / 0.08));
  }, { type: 'MONTAGE', desc: 'Three-beat montage: Noah answers again and again; glowing answers "x = 7", "1776", "H₂O" (VO: school wasn\'t so difficult).' });

  // 3I — bell: clock + bell ringing, Noah high-fives himself out the door
  E.cut('s03i_bell', E.M('bell') + 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 2.3, z1: 2.45, x: 1780, y: 260, focus: 1, ap: 8 });
    const L = E.SET.classroom(t, { clock: Math.PI * 2 * 0.98 }); L[0].d = 1; L[1].skip = true;
    E.layers(ctx, cam, L);
    const rr = E.pulse(lt, 0.0, 1.2); ctx.save(); ctx.strokeStyle = E.rgba('#ffe6a0', 0.6 * rr); ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(960, 540, 260 + i * 60 + lt * 120, -0.5, 0.5); ctx.stroke(); ctx.beginPath(); ctx.arc(960, 540, 260 + i * 60 + lt * 120, Math.PI - 0.5, Math.PI + 0.5); ctx.stroke(); } ctx.restore();
  }, { type: 'INSERT', desc: 'Insert: the classroom clock hits 3:00 as the bell rings.' });
})();
