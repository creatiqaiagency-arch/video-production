// SCENE 3 (V2) — The first real advantage (classroom). Leo planted next to Noah.
(function () {
  const E = globalThis.E;
  const K = E.KEY, RIM = K.classL;
  // seat positions (side view classroom set): Noah back row right, Leo beside him
  const NOAH = [1620, 1040], LEO = [1260, 1040];
  const students = (c, t, o = {}) => { [[160, 1040], [560, 1040], [900, 1040]].forEach(([x, y], i) => { E.char(c, { x, y, h: 375, f: 0.75, costume: E.extra(100 + i), pose: 'sitDesk', expr: o.expr || 'neutral', t, seed: i, rim: RIM }); E.desk(c, x + 90, y, 1.25); }); };
  const pair = (c, t, o = {}) => { E.ch(c, 'leo', t, Object.assign({ x: LEO[0], y: LEO[1], h: 375, f: 0.75, pose: 'sitDesk', expr: 'neutral', rim: RIM, talk: 0 }, o.leo || {})); E.desk(c, LEO[0] + 90, LEO[1], 1.25); E.ch(c, 'noah', t, Object.assign({ x: NOAH[0], y: NOAH[1], h: 375, f: 0.75, pose: 'sitDesk', expr: 'smug', rim: RIM }, o.noah || {})); E.desk(c, NOAH[0] + 90, NOAH[1], 1.25); };
  const teacherBoard = (c, t, o = {}) => E.ch(c, 'teacher', t, Object.assign({ x: 820, y: 700, h: 300, f: 0.6, pose: 'point', expr: 'neutral', rim: RIM, costume: Object.assign({}, E.COSTUME.teacher, { topC: '#d9d2e6' }) }, o));
  const classLight = (t) => ({ d: 0.9, sharp: true, draw: (c) => E.rays(c, -700, -200, 2600, 7, '#ffd59a', 0.07, t, 0.5, 0.45, 0.05) });

  // 3A — school exterior, morning: NORTHVIEW HIGH, students heading in
  E.cut('s03a_school', E.M('S03') - 0.05, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 600, y: 560, focus: 0.9, ap: 4 });
    const L = E.SET.schoolAM(t);
    L.push({ d: 0.95, draw: (c) => { for (let i = 0; i < 6; i++) E.char(c, { x: 1300 - i * 160 - lt * 60, y: 900, h: 200 + (i % 3) * 10, f: -0.8, costume: E.extra(120 + i), pose: E.walkPose(lt * 1.6 + i * 0.4), t, seed: i, rim: K.morningR }); E.ch(c, 'noah', t, { x: 900 - lt * 70, y: 905, h: 220, f: -0.8, pose: E.walkPose(lt * 1.7), expr: 'smug', rim: K.morningR }); E.ch(c, 'leo', t, { x: 1010 - lt * 70, y: 905, h: 222, f: -0.8, pose: E.walkPose(lt * 1.7 + 0.5), expr: 'happy', rim: K.morningR }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Morning, NORTHVIEW HIGH: students head inside; Noah walks in beside his best friend Leo (green cap), looking smug.' });

  // 3B — classroom: Noah (back row) taps his temple; Leo beside him; tiny thoughts over classmates
  E.cut('s03b_smug', E.sg('s03_vo1', 2) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 0.95, z1: 1.02, x: 980, y: 580, focus: 1, ap: 6 });
    const L = E.SET.classroom(t, { noDesksBack: true });
    L.push({ d: 0.9, draw: (c) => teacherBoard(c, t, { pose: 'stand', f: 0.2 }) });
    L.push({ d: 1.05, draw: (c) => { students(c, t); pair(c, t, { noah: { pose: E.poseAt(lt, [[0, 'sitDesk'], [0.8, { front: 'in', aB: [0.9, 1.0], aF: [2.2, 2.6], lB: [1.5, -1.5], lF: [1.45, -1.5] }]]) } });
      [[160, 'zzz'], [560, 'lunch...'], [900, 'so bored'], [1260, 'is it 3 yet?']].forEach(([x, txt], i) => E.thought(c, { x: x + 40, y: 560, w: 200, h: 56, s: E.pop(lt, 0.5 + i * 0.35), text: txt, size: 30, tail: [x, 640], seed: i, noClamp: true }, t)); } });
    L.push(classLight(t));
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Classroom: Noah (back row, right) taps his temple smugly next to Leo; small thoughts pop above bored classmates ("anything he wanted").' });

  // 3C — reverse from Noah's desk: the teacher at the board asks question seven
  E.cut('s03c_teacher', E.st('s03_teacher1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, x: 980, focus: 1, ap: 12 });
    const L = E.SET.classroom(t); L[0].d = 0.35; L[1].skip = true;
    L.push({ d: 1, draw: (c) => E.ch(c, 'teacher', t, { x: 900, y: E.headAt(880, 430), h: 880, f: 0.3, pose: 'point', expr: 'neutral', look: [0.6, 0.1], rim: RIM, costume: Object.assign({}, E.COSTUME.teacher, { topC: '#d9d2e6' }), ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => { E.ch(c, 'noah', t, { x: 1720, y: 2050, h: 1700, f: -0.6, faceAlpha: 0, rim: RIM, ground: false, shadow: false }); E.desk(c, 1500, 1500, 4); } });
    L.push(classLight(t));
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'From Noah\'s desk (his shoulder blurred, right): the teacher points — "Noah. What\'s the answer to question seven?"' });

  // 3D — reverse from the teacher's spot: Noah freezes "Uh..."
  E.cut('s03d_uh', E.st('s03_noah1') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.5, z1: 1.62, x: 1000, y: 560, focus: 1, ap: 8 });
    const L = E.SET.classRev(t);
    L.push({ d: 1, draw: (c) => { [[640, 'n'], [1000, 'noah'], [1330, 'leo']].forEach(([x, who], i) => { const y = 860; if (who === 'n') E.char(c, { x, y, h: 290, f: 0, costume: E.extra(130), pose: 'sitDesk', t, seed: 3, rim: RIM }); else E.ch(c, who, t, { x, y, h: 300, f: who === 'leo' ? -0.3 : 0.05, pose: 'sitDesk', expr: who === 'leo' ? 'neutral' : 'nervous', look: who === 'leo' ? [-0.7, 0] : [0, -0.2], rim: RIM, talk: who === 'leo' ? 0 : undefined }); E.deskFront(c, x, y + 12, 260, 120); }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Reverse from the front of the class: Noah freezes at his desk, nervous — "Uh..." — Leo glances at him.' });

  // 3E — room desaturates (Noah stays in colour); the luminous B flies from the teacher to Noah's desk
  E.cut('s03e_B', E.st('s03_teacher_th') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const tB = E.M('b_travel') - s.t0;
    const travel = E.seg(lt, tB - 0.5, D - 0.15, 'io');
    const cam = E.cam({ x: E.lerp(900, 1450, travel), y: E.lerp(560, 640, travel), z: E.lerp(1.0, 1.22, travel), focus: 1, ap: 6 });
    const L = E.SET.classroom(t, { noDesksBack: true });
    L.push({ d: 0.9, draw: (c) => teacherBoard(c, t, { pose: 'crossed', f: 0.2, expr: 'tired' }) });
    L.push({ d: 1.05, draw: (c) => { students(c, t); pair(c, t, { noah: { expr: travel > 0.8 ? 'smug' : 'nervous', look: [-0.6, -0.5] } }); } });
    E.layers(ctx, cam, L);
    const ds = E.seg(lt, 0.1, 0.6);
    E.screenFill(ctx, '#808080', 0.85 * ds, 'saturation'); E.screenFill(ctx, '#1a1030', 0.3 * ds, 'multiply');
    // Noah stays in colour: redraw him on top
    ctx.save(); E.applyCam(ctx, cam, 1.05); E.ch(ctx, 'noah', t, { x: NOAH[0], y: NOAH[1], h: 375, f: 0.75, pose: 'sitDesk', expr: travel > 0.8 ? 'smug' : 'nervous', look: [-0.6, -0.5], rim: RIM }); E.desk(ctx, NOAH[0] + 90, NOAH[1], 1.25); ctx.restore();
    ctx.save(); E.applyCam(ctx, cam, 0.9);
    E.th(ctx, 's03_teacher_th', t, { x: 820, y: 330, w: 520, h: 110, tail: [820, 430], size: 42, post: 0.4 });
    ctx.restore();
    ctx.save(); E.applyCam(ctx, cam, 1);
    const bx = E.lerp(800, 1660, travel), by = E.lerp(260, 560, travel) - Math.sin(travel * Math.PI) * 180;
    const ba = E.seg(t, E.at('s03_teacher_th', 0.8), E.at('s03_teacher_th', 0.98));
    if (ba > 0) { E.glow(ctx, bx, by, 220, '#a98bff', 0.5 * ba); E.textGlow(ctx, 'B', bx, by, { font: '900 150px Nunito', color: '#f1eaff', glow: 'rgba(169,139,255,1)', glowBlur: 40, a: ba }); }
    ctx.restore();
  }, { type: 'WS', desc: 'The room drains of colour except Noah; the teacher\'s thought "Please don\'t say C again. It\'s B." — a glowing B detaches and flies across the room to hover over Noah\'s desk.' });

  // 3F — low angle from desk height: Noah's hand shoots up "B!"
  E.cut('s03f_Bshout', E.st('s03_noah2') - 0.12, (ctx, lt, t, s) => {
    const cam = E.cam({ z: E.lerp(1.2, 1.1, E.seg(lt, 0, 0.25, 'out')), y: 600, rot: 0.04, focus: 1, ap: 12 });
    const L = E.SET.classRev(t); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 960, y: E.headAt(1050, 420), h: 1050, f: 0.1, pose: E.poseAt(lt, [[0, 'sitDesk'], [0.15, 'raise', 0.12]]), expr: 'happy', rim: RIM, ground: false, shadow: false }); E.deskFront(c, 960, 1300, 900, 300); } });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Low angle from desk height: Noah\'s hand shoots up — "B!"' });

  // 3G — teacher, stunned: "...Correct."
  E.cut('s03g_correct', E.st('s03_teacher2') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.12, z1: 1.18, focus: 1, ap: 14 });
    const L = E.SET.classroom(t); L[0].d = 0.35; L[1].skip = true;
    L.push({ d: 1, draw: (c) => E.ch(c, 'teacher', t, { x: 980, y: E.headAt(1000, 440), h: 1000, f: 0.15, pose: 'crossed', expr: 'shock', rim: RIM, costume: Object.assign({}, E.COSTUME.teacher, { topC: '#d9d2e6' }), ground: false, shadow: false }) });
    L.push(classLight(t));
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Smash cut: the teacher, stunned — "...Correct."' });

  // 3H — montage: three real cuts, each a new setup + glowing answer; ends on a fist-bump with Leo
  const answers = ['x = 7', '1776', 'H₂O'];
  E.cut('s03h_montage', E.M('montage'), (ctx, lt, t, s) => {
    const D = E.D(s); const k = Math.min(2, Math.floor(lt / (D / 3))); const ll = lt - k * (D / 3);
    if (k === 0) { const cam = E.cam({ z: 1.0 + ll * 0.06, focus: 1, ap: 10 }); const L = E.SET.classRev(t); L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 960, y: 1040, h: 520, f: 0.1, pose: 'raise', expr: 'happy', rim: RIM, talk: 0 }); E.deskFront(c, 960, 1060, 420, 170); } }); E.layers(ctx, cam, L); }
    else if (k === 1) { const cam = E.cam({ z: 1.2, y: 640, rot: -0.05, focus: 1, ap: 10 }); const L = E.SET.classroom(t + 7); L.push({ d: 1, draw: (c) => { pair(c, t, { noah: { pose: 'raise', expr: 'smug', f: 0.75 } }); } }); E.layers(ctx, E.cam({ x: 1400, y: 700, z: 1.5, rot: -0.04, focus: 1, ap: 8 }), L); }
    else { const L = E.SET.classroom(t + 9); L.push({ d: 1, draw: (c) => { const bump = E.seg(ll, 0.1, 0.4, 'back'); E.ch(c, 'leo', t, { x: 1310, y: 1040, h: 375, f: 0.75, pose: E.blendPose(E.POSE.sitDesk, { front: 'in', aB: [0.9, 1.0], aF: [1.5, 0.1], lB: [1.5, -1.5], lF: [1.45, -1.5] }, bump), expr: 'laugh', rim: RIM, talk: 0 }); E.ch(c, 'noah', t, { x: 1560, y: 1040, h: 375, f: -0.75, pose: E.blendPose(E.POSE.sitDesk, { front: 'in', aB: [0.9, 1.0], aF: [1.5, 0.1], lB: [1.5, -1.5], lF: [1.45, -1.5] }, bump), expr: 'laugh', rim: RIM, talk: 0 }); } }); E.layers(ctx, E.cam({ x: 1430, y: 760, z: 1.9, focus: 1, ap: 8 }), L); }
    const p = E.pop(ll, 0.05, 0.25); if (p > 0) { ctx.save(); ctx.translate([1320, 600, 960][k], [330, 300, 280][k]); ctx.scale(p, p); E.textGlow(ctx, answers[k], 0, 0, { font: '900 104px Nunito', color: '#f1eaff', glow: 'rgba(169,139,255,1)', glowBlur: 36 }); ctx.restore(); }
    if (ll < 0.07) E.screenFill(ctx, '#ffffff', 0.2 * (1 - ll / 0.07));
  }, { type: 'MONTAGE', desc: 'Three-cut montage, each a new angle with a glowing answer ("x = 7", "1776", "H₂O"); it ends with Noah and Leo fist-bumping (VO: school wasn\'t so difficult).' });

  // 3I — the clock snaps to 3:00 and shakes as the bell rings
  E.cut('s03i_bell', E.M('bell') + 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const snap = E.seg(lt, 0.05, 0.3, 'back');
    const ring = lt > 0.3 ? Math.sin(lt * 190) * 3 * (1 - E.seg(lt, 0.3, D)) : 0;
    const cam = E.cam({ x: 1780 + ring, y: 240, z: 3.0 + lt * 0.05, focus: 1, ap: 6 });
    const L = E.SET.classroom(t, { clock: 0 }); L[0].d = 1; L[1].skip = true;
    L.push({ d: 1, draw: (c) => { c.fillStyle = '#efe6dc'; c.beginPath(); c.arc(1780, 230, 52, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#2a1826'; c.lineWidth = 7; c.stroke();
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.lineWidth = 3; c.beginPath(); c.moveTo(1780 + Math.sin(a) * 42, 230 - Math.cos(a) * 42); c.lineTo(1780 + Math.sin(a) * 48, 230 - Math.cos(a) * 48); c.stroke(); }
      const mA = E.lerp(-0.3, 0, snap); c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(1780, 230); c.lineTo(1780 + Math.sin(mA) * 38, 230 - Math.cos(mA) * 38); c.stroke(); c.lineWidth = 7; c.beginPath(); c.moveTo(1780, 230); c.lineTo(1780 + 24, 230); c.stroke();
      E.rays(c, 1500, 0, 600, 5, '#ffd59a', 0.12, t, 0.5, 0.7); } });
    E.layers(ctx, cam, L);
    const rr = E.pulse(lt, 0.3, 1.4); ctx.save(); ctx.strokeStyle = E.rgba('#ffe6a0', 0.6 * rr); ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { const R = 300 + i * 60 + lt * 120; ctx.beginPath(); ctx.arc(960, 540, R, -0.5, 0.5); ctx.stroke(); ctx.beginPath(); ctx.arc(960, 540, R, Math.PI - 0.5, Math.PI + 0.5); ctx.stroke(); } ctx.restore();
  }, { type: 'INSERT', desc: 'Insert: the classroom clock\'s minute hand snaps to 12 (3:00) and the clock shakes as the bell rings.' });
})();
