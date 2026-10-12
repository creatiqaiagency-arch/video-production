// DIAGRAM + ACT II + ACT III (s024, s032–s069)
const TB = { x: 960, y: 760, w: 440 }; // cafe table
function cafeScene(cam, gt, o = {}) { const e = envCafe(cam, gt, o); return e.bg; }
function paddle(x, y, rot = 0) { return g(rect(-4, 0, 8, 26, '#5a3a2a', { rx: 3 }) + ell(0, -16, 20, 24, '#c8323a') , { transform: `translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})` }); }
const withPaddle = rot => j => paddle(j.armF[2][0], j.armF[2][1], rot);
function seated(x, who, fc, gt, o = {}) { // floor at 880
  return shadowAt(x, 880, 60) + fig({ x, y: 880, s: 60, fc, who, pose: o.pose || 'sit', expr: o.expr || 'neutral', talk: o.talk || 0, t: gt, seed: o.seed || x, lookX: o.lookX || 0, lookY: o.lookY || 0, rim: o.rim, ghost: o.ghost, op: o.op, blur: o.blur, extra: o.extra, mouth: o.mouth, sweat: o.sweat });
}
function cafeGroup(gt, o = {}) {
  // back row (behind table): Nora, Maya ; table ; front: Leo left, Sam right
  let s = '';
  s += seated(880, 'nora', 0, gt, { expr: o.noraExpr || 'neutral', talk: o.noraTalk || 0, seed: 3, pose: o.noraPose, lookX: o.noraLook ?? 0 });
  s += seated(1050, 'maya', 0, gt, { expr: o.mayaExpr || 'happy', seed: 5, pose: o.mayaPose, lookX: o.mayaLook ?? 0, extra: o.mayaExtra });
  s += cafeTable(TB.x, TB.y, TB.w) + (o.tableItems || cup(870, TB.y, 1.1) + cup(1060, TB.y, 1.1));
  if (o.leo !== false) s += seated(700, 'leo', 1, gt, { expr: o.leoExpr || 'neutral', talk: o.leoTalk || 0, pose: o.leoPose, seed: 1, lookX: o.leoLook ?? .4, mouth: o.leoMouth });
  s += seated(1230, 'sam', -1, gt, { expr: o.samExpr || 'happy', talk: o.samTalk || 0, pose: o.samPose, seed: 7, lookX: o.samLook ?? .4 });
  return s;
}
const CU_BG = (gt, x = 960, y = 420, z = 2.4, blur = 10) => cafeScene({ x, y, z }, gt, { bgBlur: blur });

Object.assign(SHOTS_REG, {
  // ---------------- DIAGRAM ----------------
  diag_timeline(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1 }, { x: 980, y: 560, z: 1.06 });
    let w = boardBg(gt);
    const ax = seg(lt, 0, .8);
    w += line(300, 700, lerp(300, 1650, ax), 700, '#d8e3f0', 6) + poly([[1650, 700], [1620, 684], [1620, 716]], '#d8e3f0', { opacity: ax });
    w += line(560, 680, 560, 720, '#d8e3f0', 5) + line(1380, 680, 1380, 720, '#8fd3ff', 5);
    w += text(560, 770, 'NOW', { 'font-size': 40, 'font-weight': 800, fill: '#d8e3f0', 'text-anchor': 'middle' });
    w += text(1380, 770, '+5 s', { 'font-size': 40, 'font-weight': 800, fill: '#8fd3ff', 'text-anchor': 'middle', opacity: seg(lt, .6, 1) });
    w += fig({ x: 560, y: 660, s: 44, fc: 1, who: 'leo', pose: 'stand', expr: 'neutral', t: gt, rim: { dx: -3, dy: -2, c: '#9fd0ff' } });
    const gp = seg(lt, .9, 1.6);
    w += fig({ x: 1380, y: 660, s: 44, fc: 1, who: 'leo', pose: 'wave', expr: 'happy', ghost: true, op: .65 * gp });
    // eye beam
    const bp = seg(lt, 1.4, 2.2);
    if (bp > 0) w += dashedPath([[600, 395], [lerp(600, 1360, bp), 395]], '#8fd3ff', 5, 1);
    // control vs see
    const c1 = seg(lt, .4, .9), c2 = seg(lt, 2.6, 3.0), c3 = seg(lt, 3.1, 3.6);
    w += g(text(960, 230, 'CONTROL TIME', { 'font-size': 54, 'font-weight': 900, fill: '#ffb4a8', 'text-anchor': 'middle', 'letter-spacing': 4 }) + line(740, 212, lerp(740, 1180, c2), 212, '#ff6a5a', 8), { opacity: c1 * (1 - seg(lt, 3.6, 4.0)) });
    w += g(text(960, 230, 'SEE 5 SECONDS AHEAD', { 'font-size': 54, 'font-weight': 900, fill: '#8fd3ff', 'text-anchor': 'middle', 'letter-spacing': 4, filter: fGlow(8, '#2f7bff', .8) }), { opacity: c3 });
    return layer(cam, w);
  },

  // ---------------- TABLE TENNIS ----------------
  g_matchCut(lt, d, gt) {
    const p = ease.inOut(clamp((lt - .2) / 2.2));
    const cam = { x: lerp(1180, 960, p), y: lerp(640, 560, p), z: lerp(12, 1.0, p) };
    const e = envGym(cam, gt);
    const rally = Math.sin(lt * 2.4);
    const bx = lerp(1180, 960 + rally * 300, seg(lt, 1.5, 3)), by = lerp(640, 700 - Math.abs(Math.cos(lt * 2.4)) * 120, seg(lt, 1.5, 3));
    let w = pingTable(960, 760) + shadowAt(560, 900, 66) + fig({ x: 560, y: 900, s: 66, fc: 1, who: 'leo', pose: 'paddleReady', expr: 'happy', t: gt, extra: withPaddle(40) }) + shadowAt(1360, 900, 66) + fig({ x: 1360, y: 900, s: 66, fc: -1, who: 'sam', pose: 'paddleReady', expr: 'determined', t: gt, extra: withPaddle(-40) });
    w += scoreboard(960, 420, '0', '0', .9) + pingball(bx, by, lerp(6, 9, p));
    return e.bg + e.light + layer(cam, w) + circ(960, 540, lerp(1300, 0, seg(lt, 0, .35, ease.out)), '#fbf6ee');
  },
  g_wide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 580, z: 1.05 }, { x: 960, y: 590, z: 1.12 });
    const e = envGym(cam, gt);
    const u = (lt * .9) % 1, dir = Math.floor(lt * .9) % 2;
    const path = parabola(dir ? 1240 : 680, 700, dir ? 680 : 1240, 700, 110);
    let w = pingTable(960, 760) + shadowAt(560, 900, 66) + fig({ x: 560, y: 900, s: 66, fc: 1, who: 'leo', pose: poseAt(u, [[0, 'paddleReady'], [.5, 'swing']]), expr: 'happy', t: gt, extra: withPaddle(40) });
    w += shadowAt(1360, 900, 66) + fig({ x: 1360, y: 900, s: 66, fc: -1, who: 'sam', pose: 'paddleReady', expr: 'determined', t: gt, extra: withPaddle(-40) });
    w += scoreboard(960, 420, '0', '0', .9) + pingball(...pOn(path, u), 8);
    return e.bg + e.light + layer(cam, w);
  },
  g_serveOTS(lt, d, gt) {
    const cam = camMove(lt, d, { x: 780, y: 640, z: 1.6 }, { x: 760, y: 640, z: 1.7 });
    const e = envGym(cam, gt, { bgBlur: 4 });
    const hit = 1.1, bp = seg(lt, hit, hit + .5, ease.lin);
    const path = parabola(1260, 640, 560, 720, 40);
    let w = pingTable(960, 760) + shadowAt(560, 900, 66) + fig({ x: 560, y: 900, s: 66, fc: 1, who: 'leo', pose: lt > hit + .4 ? 'swing' : 'paddleReady', expr: 'determined', t: gt, extra: withPaddle(40) });
    w += lt < hit ? pingball(1290, kf(lt, [[0, 600], [.6, 420], [hit, 560]]), 9) : (bp < 1 ? pingball(...pOn(path, bp), 9) + streaks(...pOn(path, bp), 260, 10, Math.PI * 1.02, '#fff', .55) : pingball(...pOn(parabola(560, 720, 1300, 640, 80), seg(lt, hit + .5, hit + 1.1, ease.lin)), 9));
    let s = e.bg + e.light + layer(cam, w);
    s += layer({ x: 960, y: 540, z: 1 }, fig({ x: 1600, y: 1700, s: 210, fc: -1, who: 'sam', pose: poseAt(lt, [[0, 'serve'], [hit - .2, 'serve'], [hit, 'swing', ease.out]]), expr: 'none', t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }), { blur: 9 });
    return s;
  },
  g_overhead(lt, d, gt) {
    let s = rect(0, 0, W, H, '#4a2e28');
    for (let i = 0; i < 16; i++) s += rect(i * 130, 0, 4, H, '#3e261f');
    s += rect(560, 300, 800, 460, '#1f4a6a') + rect(560, 300, 800, 460, 'none', { stroke: '#e8eef2', 'stroke-width': 8 }) + line(960, 290, 960, 770, '#e8eef2', 8) + line(560, 530, 1360, 530, '#e8eef2', 3, { opacity: .7 });
    s += glowE(960, 530, 700, 400, '#ffc98a', .15);
    // players top-down
    const lx = kf(lt, [[0, 470], [1.1, 470], [1.5, 470]]), ly = kf(lt, [[0, 520], [1.0, 520], [1.4, 640]]);
    s += circ(1460, 520, 44, BODY, { filter: fRim(-5, -5, '#ffd29a') }) + path('M1420 500 A44 44 0 0 1 1500 500 Z', OUTFIT.sam.cap) + line(1460, 520, 1400, 470, BODY, 16);
    s += circ(lx, ly, 44, BODY, { filter: fRim(5, -5, '#ffd29a') }) + circ(lx, ly + 34, 30, OUTFIT.leo.cloth) + line(lx, ly, lx + 70, ly + 40, OUTFIT.leo.cloth, 22) + paddle(lx + 86, ly + 50, -120);
    const pred = [[1400, 470], [1120, 560], [760, 650], [560, 655]];
    s += dashedPath(pred, '#8fd3ff', 6, seg(lt, 0, .5));
    const u = seg(lt, .6, 1.5, ease.lin);
    const bp = u < .5 ? [lerp(1400, 1120, u * 2), lerp(470, 560, u * 2)] : [lerp(1120, 590, (u - .5) * 2), lerp(560, 650, (u - .5) * 2)];
    s += lt < 1.5 ? pingball(bp[0], bp[1], 11) + streaks(bp[0], bp[1], 120, 6, Math.atan2(180, -810), '#fff', .5) : pingball(lerp(590, 1300, seg(lt, 1.5, 2.1, ease.lin)), lerp(650, 420, seg(lt, 1.5, 2.1)), 11);
    s += countdownLabel(1500, 860, '0.17 s', seg(lt, .4, .8));
    return s;
  },
  g_samStunned(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    const e = envGym({ x: 900, y: 420, z: 2.2 }, gt, { bgBlur: 9 });
    const flip = seg(lt, .4, .7);
    let s = e.bg + layer({ x: 960, y: 540, z: 1 }, g(scoreboard(560, 330, flip > .5 ? '11' : '0', '0', 1.6), { filter: fBlur(3) }));
    s += layer(cam, figHead(1060, 500, 300, { who: 'sam', fc: -1, expr: 'shocked', talk: talkOf('sam', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
    return s;
  },
  // ---------------- ARCADE ----------------
  a_pov(lt, d, gt) {
    const e = envArcade({ x: 960, y: 400, z: 1.6 }, gt, { bgBlur: 8 });
    let s = e.bg + rect(260, 330, 1400, 760, '#1a1228', { rx: 30 }) + rect(260, 330, 1400, 760, 'none', { stroke: '#3fe0ff', 'stroke-width': 4, rx: 30, opacity: .5 });
    const seq = [4, 0, 8, 2, 6, 1, 7, 3, 5], per = .42;
    const k = Math.floor(lt / per), ph = (lt % per) / per, cur = seq[k % 9];
    for (let i = 0; i < 9; i++) {
      const x = 560 + (i % 3) * 400, y = 470 + Math.floor(i / 3) * 210;
      const lit = i === cur && ph > .35;
      s += ell(x, y + 12, 100, 40, '#0c0814') + ell(x, y, 100, 40, lit ? '#ffe14a' : '#3a2a52') + (lit ? glow(x, y, 180, '#ffe14a', .5) : '');
      if (i === cur && ph < .45) s += ell(x, y, 112, 48, 'none', { stroke: '#8fd3ff', 'stroke-width': 6, filter: fGlow(6, '#2f7bff', 1), opacity: 1 - ph });
    }
    const tx = 560 + (cur % 3) * 400, ty = 470 + Math.floor(cur / 3) * 210;
    const hp = seg(ph, .2, .4, ease.out);
    const hx = lerp(960, tx, hp), hy = lerp(1150, ty + 10, hp);
    s += `<g filter="${fRim(-4, -6, '#ffd29a')}">${pline([[hx - 120, 1300], [hx, hy + 40]], OUTFIT.leo.cloth, 90) + circ(hx, hy, 46, BODY)}</g>`;
    s += text(960, 140, String(Math.min(999, k * 111)).padStart(3, '0'), { 'font-size': 80, 'font-weight': 900, fill: '#ffe14a', 'text-anchor': 'middle', filter: fGlow(10, '#ff9a3c', 1) });
    return s;
  },
  a_score(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 520, z: 1.25 }, { x: 980, y: 520, z: 1.32 });
    const e = envArcade(cam, gt, { bgBlur: 3 });
    let w = rect(700, 260, 360, 640, '#1c1430', { rx: 18 }) + rect(730, 300, 300, 220, '#0a0614', { rx: 8 });
    const sc = Math.min(999, Math.floor(lerp(700, 999, seg(lt, 0, 1.2))));
    w += text(880, 400, String(sc), { 'font-size': 86, 'font-weight': 900, fill: '#ffe14a', 'text-anchor': 'middle', filter: fGlow(8, '#ff9a3c', 1) });
    w += text(880, 470, 'PERFECT!', { 'font-size': 40, 'font-weight': 900, fill: '#3fe0ff', 'text-anchor': 'middle', opacity: seg(lt, 1.2, 1.4), filter: fGlow(8, '#3fe0ff', 1) });
    w += glow(880, 410, 300, '#ffe14a', .25 * seg(lt, 1.1, 1.4));
    w += shadowAt(1180, 900, 70) + fig({ x: 1180, y: 900, s: 70, fc: -1, who: 'leo', pose: 'arcade', expr: 'smug', t: gt, rim: { dx: -6, dy: -3, c: '#3fe0ff' } });
    const turn = seg(lt, 1.0, 1.4);
    w += shadowAt(1450, 900, 70) + fig({ x: 1450, y: 900, s: 70, fc: -1, who: 'sam', pose: 'stand', expr: turn > .5 ? 'shocked' : 'neutral', lookX: turn > .5 ? 1 : -1, t: gt, rim: { dx: -6, dy: -3, c: '#ff3fa8' } });
    return e.bg + layer(cam, w);
  },
  // ---------------- DODGEBALL ----------------
  d_balls(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 600, z: 1.3 }, { x: 960, y: 600, z: 1.45 });
    const e = envGym(cam, gt, { bgBlur: 4 });
    let w = shadowAt(960, 900, 70) + fig({ x: 960, y: 900, s: 70, fc: -1, who: 'leo', pose: 'crouch', expr: 'determined', t: gt });
    const starts = [[1800, 560], [1750, 760], [1820, 380]], ends = [[980, 600], [960, 760], [940, 470]];
    starts.forEach((s0, i) => { const u = seg(lt, .1 * i, d + .4, ease.lin) * .7; const p = [lerp(s0[0], ends[i][0], u), lerp(s0[1], ends[i][1], u)]; w += dashedPath([p, ends[i]], '#8fd3ff', 4, 1, { op: .6 }) + circ(ends[i][0], ends[i][1], 30, '#7fc8ff', { opacity: .35, filter: fGlow(4, '#2f7bff', 1) }) + dodgeball(p[0], p[1]) + streaks(p[0], p[1], 120, 20, Math.PI, '#ffd6c0', .4, 4, i); });
    return e.bg + e.light + layer(cam, w);
  },
  d_dodge(lt, d, gt) {
    const a = lt * 40 - 20;
    const cam = { x: 960 + Math.sin(a * R) * 120, y: 600, z: 1.5 + lt * .04, r: Math.sin(lt * 1.3) * 2 };
    const e = envGym(cam, gt, { bgBlur: 4 });
    const pz = poseAt(lt, [[0, 'crouch'], [.4, 'dodgeL', ease.out], [.9, 'dodgeR', ease.out], [1.4, 'duck', ease.out], [1.9, 'stand']]);
    let w = shadowAt(960, 900, 70);
    [.5, .35, .2].forEach((k, i) => { w += fig({ x: 960, y: 900, s: 70, fc: -1, who: 'leo', pose: poseAt(Math.max(0, lt - k * .5), [[0, 'crouch'], [.4, 'dodgeL'], [.9, 'dodgeR'], [1.4, 'duck'], [1.9, 'stand']]), expr: 'none', rim: null, op: .1 + i * .05 }); });
    w += fig({ x: 960, y: 900, s: 70, fc: -1, who: 'leo', pose: pz, expr: 'determined', t: gt });
    [[.3, 520, 1], [.75, 640, 2], [1.25, 760, 3]].forEach(([t0, y, i]) => { const u = seg(lt, t0 - .3, t0 + .3, ease.lin); if (u > 0 && u < 1) w += dodgeball(lerp(1700, 200, u), y) + streaks(lerp(1700, 200, u), y, 200, 20, Math.PI, '#ffd6c0', .5, 4, i); });
    let s = e.bg + e.light + layer(cam, w);
    const cp = seg(lt, 1.5, 2.0, ease.lin);
    if (cp > 0 && cp < 1) s += circ(lerp(2300, -400, cp), 420, 380, '#c0392b', { filter: fBlur(18) });
    return s;
  },
  d_disbelief(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 580, z: 1.02 }, { x: 960, y: 590, z: 1.08 });
    const e = envGym(cam, gt);
    let w = shadowAt(560, 900, 66) + fig({ x: 560, y: 900, s: 66, fc: 1, who: 'leo', pose: poseAt(lt, [[0, 'stand'], [.6, 'armsUp', ease.outBack]]), expr: 'happy', mouth: 'grin', t: gt });
    [[1150, 'grey'], [1350, 'teal'], [1550, 'mauve']].forEach(([x, who], i) => { w += shadowAt(x, 900, 66) + fig({ x, y: 900, s: 66, fc: -1, who, pose: 'stand', expr: 'shocked', t: gt, seed: i * 3 }); });
    for (let i = 0; i < 4; i++) w += dodgeball(800 + i * 120, 880 - Math.abs(Math.sin(lt * 4 + i)) * 30 * (1 - seg(lt, 0, 2)), 22);
    return e.bg + e.light + layer(cam, w);
  },
  hero_rays(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1 }, { x: 960, y: 540, z: 1.08 });
    let s = envGym({ x: 960, y: 200, z: 1.4 }, gt, { bgBlur: 6 }).bg + layer({ x: 960, y: 540, z: 1 }, rays(1000, 260, 26, 1600, '#ffd6a0', .1, lt * 4) + glow(1000, 260, 300, '#fff1c9', .5));
    s += layer(cam, fig({ x: 960, y: 1500, s: 165, fc: 1, who: 'leo', pose: 'handsHips', expr: 'smug', t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    return s;
  },
  // ---------------- EVERYDAY ADVANTAGES ----------------
  sw_phone(lt, d, gt) {
    const cut = d * .45;
    if (lt < cut) {
      const cam = camMove(lt, cut, { x: 900, y: 560, z: 1.1 }, { x: 960, y: 560, z: 1.12 });
      const wx = 500 + lt * 160, ph = (lt * 1.6) % 1;
      let w = shadowAt(wx, 900, 62) + fig({ x: wx, y: 900, s: 62, fc: 1, who: 'mauve', pose: mixPose(walkPose(ph), 'phone', .5), expr: 'neutral', t: gt, lookY: 1 });
      const slip = seg(lt, cut - .6, cut, ease.in2);
      w += rect(wx + 70, 640 + slip * 200, 18, 30, '#20222a', { rx: 4, transform: `rotate(${f1(slip * 140)} ${f1(wx + 79)} ${f1(655 + slip * 200)})` });
      w += shadowAt(1350, 900, 62) + fig({ x: 1350, y: 900, s: 62, fc: -1, who: 'leo', pose: 'stand', expr: 'neutral', t: gt });
      return cafeScene(cam, gt, { bgBlur: 3 }) + layer(cam, w);
    }
    const l2 = lt - cut;
    let s = cafeScene({ x: 900, y: 880, z: 3 }, gt, { bgBlur: 10 }) + rect(0, 760, W, 400, lgrad([[0, '#3a2a36'], [1, '#1a1219']]));
    const py = kf(l2, [[0, 200], [.5, 660, ease.in2], [d - cut, 670]]), pr = kf(l2, [[0, 40], [.5, 160]]);
    s += g(rect(-40, -80, 80, 160, '#20222a', { rx: 14 }) + rect(-32, -70, 64, 130, '#3fa0ff', { rx: 8, opacity: .8 }), { transform: `translate(${f1(960)} ${f1(py)}) rotate(${f1(pr)})` });
    const hp = seg(l2, .25, .5, ease.out);
    s += `<g filter="${fRim(-6, -6, '#ffd29a')}">${pline([[lerp(1900, 1250, hp), lerp(1100, 820, hp)], [lerp(1600, 1040, hp), lerp(900, 720, hp)]], OUTFIT.leo.cloth, 120) + circ(lerp(1500, 1000, hp), lerp(860, 720, hp), 64, BODY)}</g>`;
    return s + streaks(960, py, 200 * (1 - hp), 30, Math.PI / 2, '#fff', .3);
  },
  c_cupSlide(lt, d, gt) {
    // overhead table
    let s = rect(0, 0, W, H, '#2c1c26');
    for (let i = 0; i < 12; i++) s += rect(i * 170, 0, 6, H, '#251720');
    s += circ(960, 560, 420, '#8a6266') + circ(960, 560, 400, '#7a565a') + glowE(1000, 500, 500, 300, '#ffd39a', .18);
    const elbow = seg(lt, .8, 1.6);
    s += `<g filter="${fRim(4, -6, '#ffd29a')}">${pline([[200, 1000], [lerp(560, 760, elbow), lerp(700, 640, elbow)], [500, 380]], '#8a5a6e', 70) + circ(500, 380, 34, BODY)}</g>`;
    const ghostP = seg(lt, .1, .7);
    s += circ(820, 600, 46, '#7fc8ff', { opacity: .5 * (1 - seg(lt, .7, 1.0)), filter: fGlow(4, '#2f7bff', 1) }) + ell(820 + ghostP * 90, 620 + ghostP * 60, 70 * ghostP, 40 * ghostP, '#4fa8ff', { opacity: .45 * (1 - seg(lt, .7, 1.0)) });
    const slide = seg(lt, .5, 1.2, ease.out);
    const cx = lerp(820, 1120, slide), cy = lerp(600, 560, slide);
    s += circ(cx, cy, 46, '#efe6dc') + circ(cx, cy, 36, '#6a3a2a') + circ(cx - 10, cy - 10, 10, '#a06a4a', { opacity: .6 });
    s += `<g filter="${fRim(-4, -6, '#ffd29a')}">${pline([[1900, 300], [lerp(1500, 1230, slide), lerp(420, 520, slide)]], OUTFIT.leo.cloth, 76) + circ(lerp(1440, 1170, slide), lerp(450, 540, slide), 36, BODY)}</g>`;
    return s;
  },
  c_tableWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 600, z: 1.35 }, { x: 960, y: 610, z: 1.42 });
    const fin = seg(lt, 1.6, 2.0);
    return cafeScene(cam, gt) + layer(cam, cafeGroup(gt, { samPose: mixPose(POSES.sit, { tor: 20, head: 5, ab: [30, 50], af: [60, 60], lb: [88, 88], lf: [86, 86] }, .8), samExpr: 'happy', samTalk: lt > 1.3 ? Math.abs(Math.sin(lt * 14)) * .6 : 0, leoPose: mixPose(POSES.sit, { tor: -6, head: -4, ab: [30, 50], af: [100, 70], lb: [88, 88], lf: [86, 86] }, fin), leoExpr: 'smug', mayaExpr: 'neutral' }));
  },
  c_samTalk(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.05 });
    return CU_BG(gt, 1100, 450) + layer(cam, figHead(1020, 480, 300, { who: 'sam', fc: -1, expr: lt > d - .8 ? 'shocked' : 'happy', talk: talkOf('sam', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  c_leoSmug(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 530, z: 1.07 });
    return CU_BG(gt, 800, 450) + layer(cam, figHead(900, 480, 300, { who: 'leo', fc: 1, expr: 'smug', talk: talkOf('leo', gt), t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }) + g(fig({ x: 1700, y: 1700, s: 220, fc: -1, who: 'sam', pose: 'sit', expr: 'none' }), { filter: fBlur(10) }));
  },
  c_samAnnoyed(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.05 });
    let s = CU_BG(gt, 1000, 450);
    s += layer({ x: 960, y: 540, z: 1 }, figHead(560, 430, 150, { who: 'nora', fc: 1, expr: 'closed', lookY: -1, t: gt, rim: { dx: -5, dy: -4, c: '#ffd29a' } }), { blur: 6 });
    s += layer(cam, figHead(1080, 500, 300, { who: 'sam', fc: -1, expr: 'angry', talk: talkOf('sam', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
    return s;
  },
  c_groupWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.05 }, { x: 960, y: 580, z: 1.15 });
    return cafeScene(cam, gt) + layer(cam, cafeGroup(gt, { leoPose: 'armsCross', leoExpr: 'smug', samTalk: Math.abs(Math.sin(lt * 12)) * .5, mayaExpr: 'happy' }).replace(/x="NaN"/g, ''));
  },
  c_ghostMouths(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 620, z: 1.4 }, { x: 820, y: 620, z: 1.75 });
    let w = cafeGroup(gt, { leoTalk: Math.abs(Math.sin(lt * 11)) * .7 * (lt % 1.3 < .7 ? 1 : 0), leoExpr: 'smug', samExpr: 'neutral', mayaExpr: 'neutral', noraExpr: 'neutral' });
    // ghost mouths/heads appear above each friend before they speak
    [[880, 590, 0], [1050, 590, .9], [1230, 600, 1.8]].forEach(([x, y, t0]) => { const a = seg(lt, t0, t0 + .3) * (1 - seg(lt, t0 + 1.1, t0 + 1.4)); if (a > 0) w += g(ell(x, y - 60, 46, 30, '#0d2a5c', { opacity: .7 }) + ell(x, y - 60, 16, 4 + Math.abs(Math.sin(lt * 18)) * 12, '#bfe6ff') + poly([[x - 10, y - 32], [x + 6, y - 32], [x - 4, y - 18]], '#0d2a5c', { opacity: .7 }), { opacity: a, filter: fGlow(5, '#2f7bff', 1) }); });
    return cafeScene(cam, gt) + layer(cam, w);
  },
  c_leoMouthing(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    const flap = Math.max(0, Math.sin(lt * 13)) * (lt % 1.1 < .8 ? .8 : 0);
    let s = CU_BG(gt, 800, 450);
    s += layer(cam, figHead(820, 480, 280, { who: 'leo', fc: 1, expr: 'neutral', talk: flap, t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    s += layer({ x: 960, y: 540, z: 1 }, figHead(1620, 520, 330, { who: 'maya', fc: -1, expr: 'neutral', talk: Math.max(0, Math.sin((lt - .25) * 13)) * (lt % 1.1 < .8 ? .8 : 0), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }), { blur: 9 });
    s += layer(cam, ell(1080, 470, 40, 10 + flap * 18, '#bfe6ff', { opacity: .5, filter: fGlow(5, '#2f7bff', 1) }));
    return s;
  },
  c_pushLeo(lt, d, gt) {
    const z = lerp(1.8, 2.6, ease.inOut(clamp(lt / d)));
    const cam = { x: 720, y: 600, z };
    let s = cafeScene(cam, gt, { bgBlur: 6 });
    s += layer(cam, seated(700, 'leo', 1, gt, { expr: 'neutral', lookX: .2 }));
    s += layer(cam, seated(880, 'nora', 0, gt, { expr: 'neutral' }) + seated(470, 'sam', 1, gt, { expr: 'neutral' }), { blur: 7 });
    s += rect(0, 0, W, H, '#2a2a6a', { opacity: (seg(lt, 0, d) * .18).toFixed(2), style: 'mix-blend-mode:multiply' });
    return s;
  },
  c_friendsTired(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1040, y: 600, z: 1.5 }, { x: 1060, y: 600, z: 1.55 });
    const phoneM = j => rect(j.armF[2][0] - 8, j.armF[2][1] - 30, 16, 28, '#3fa0ff', { rx: 3 }) + glow(j.armF[2][0], j.armF[2][1] - 16, 30, '#3fa0ff', .4);
    const w = cafeGroup(gt, { leoExpr: 'smug', samPose: { tor: -14, head: -6, ab: [20, 120], af: [25, 115], lb: [88, 88], lf: [86, 86] }, samExpr: 'closed', samLook: 0, noraExpr: 'sad', noraLook: -.6, mayaPose: 'phone', mayaExpr: 'neutral', mayaExtra: phoneM, mayaLook: 0 });
    return cafeScene(cam, gt) + layer(cam, w) + rect(0, 0, W, H, '#2a2a6a', { opacity: .15, style: 'mix-blend-mode:multiply' });
  },
  // ---------------- ACT III ----------------
  c3_approach(lt, d, gt) {
    const cam = camMove(lt, d, { x: 900, y: 580, z: 1.1 }, { x: 1000, y: 580, z: 1.2 });
    const lx = 260 + lt * 110;
    let w = cafeGroup(gt, { leo: false, noraExpr: 'neutral', samExpr: 'happy', mayaExpr: 'happy', samPose: { tor: 25, head: 10, ab: [30, 50], af: [40, 60], lb: [88, 88], lf: [86, 86] }, noraLook: -.8, mayaLook: .5 });
    w += rect(1050, 690, 140, 60, '#e8d9cf', { opacity: .9 }) + text(1120, 728, '🎂', { 'font-size': 1 });
    w += shadowAt(lx, 900, 62) + fig({ x: lx, y: 900, s: 62, fc: 1, who: 'leo', pose: walkPose((lt * 1.8) % 1), expr: 'neutral', t: gt });
    return cafeScene(cam, gt) + layer(cam, w);
  },
  c3_eyeRing(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .3)) * .25 };
    let s = CU_BG(gt, 1100, 420, 2.4, 14);
    s += layer(cam, figHead(960, 600, 900, { who: 'leo', fc: 0, expr: 'neutral', blink: false, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    for (const ex of [-1, 1]) s += layer(cam, ringFx(960 + ex * 450 * .27, 600 - 45, seg(lt, .2, 1.0, ease.lin), 240));
    return s + flash(seg(lt, d - .3, d) * .7, '#bfe6ff');
  },
  c3_noraFuture(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.1 }, { x: 960, y: 520, z: 1.25 });
    const talk = talkOf('nora', gt);
    let w = cafeScene({ x: 1000, y: 450, z: 2.4 }, gt, { bgBlur: 12 }) + layer(cam, figHead(960, 520, 360, { who: 'nora', fc: 0, expr: 'determined', talk, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    let s = futureWrap(w, 1, { t: gt });
    // echo rings around the mouth while she whispers
    if (talk > .1) s += layer(cam, circ(960, 520 + 70, 60 + talk * 80, 'none', { stroke: '#8fd3ff', 'stroke-width': 3, opacity: .4 }));
    return s;
  },
  c3_leoFroze(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.1 });
    return CU_BG(gt, 800, 430) + layer(cam, figHead(900, 490, 300, { who: 'leo', fc: 1, expr: 'shocked', talk: talkOf('leo', gt), blink: false, t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
  },
  c3_suspicious(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.05 }, { x: 960, y: 520, z: 1.18 });
    return CU_BG(gt, 800, 430) + layer(cam, figHead(900, 500, 300, { who: 'leo', fc: 1, expr: 'angry', lookX: .6, t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } })) + rect(0, 0, W, H, '#200810', { opacity: .15, style: 'mix-blend-mode:multiply' });
  },
  c3_march(lt, d, gt) {
    const lx = 200 + lt * 170;
    const cam = { x: lx + 250, y: 600, z: 1.5 };
    let w = cafeGroup(gt, { leo: false, noraExpr: 'neutral', noraLook: -1, samExpr: 'neutral', mayaExpr: 'worried' });
    w += shadowAt(lx, 900, 62) + fig({ x: lx, y: 900, s: 62, fc: 1, who: 'leo', pose: walkPose((lt * 2.3) % 1, 1.3), expr: 'angry', t: gt });
    return cafeScene(cam, gt) + layer(cam, w);
  },
  c3_otsAccuse(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.05 });
    let s = CU_BG(gt, 700, 430);
    s += layer(cam, figHead(760, 470, 260, { who: 'leo', fc: 1, expr: 'angry', talk: talkOf('leo', gt), t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    s += layer({ x: 960, y: 540, z: 1 }, figHead(1500, 520, 420, { who: 'nora', fc: -1, expr: 'none', t: gt, rim: { dx: 10, dy: -10, c: '#ffd29a' } }), { blur: 10 });
    return s;
  },
  c3_noraConfused(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.05 });
    return CU_BG(gt, 1100, 430) + layer(cam, figHead(1020, 490, 300, { who: 'nora', fc: -1, expr: 'worried', talk: talkOf('nora', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  c3_leoPoint(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.6 }, { x: 960, y: 560, z: 1.75 });
    const lx = 820;
    let w = shadowAt(lx, 900, 70) + fig({ x: lx, y: 900, s: 70, fc: 1, who: 'leo', pose: 'point', expr: 'angry', talk: talkOf('leo', gt), t: gt });
    return cafeScene(cam, gt, { bgBlur: 4 }) + layer(cam, w + seated(1230, 'nora', -1, gt, { expr: 'worried', lookX: .5 }));
  },
  c3_reveal(lt, d, gt) {
    // wide reveal: friends were hiding a banner and a cake
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.25 }, { x: 960, y: 570, z: 1.0 });
    const un = seg(lt, .2, 1.4, ease.out);
    let w = '';
    w += shadowAt(780, 900, 62) + fig({ x: 780, y: 900, s: 62, fc: 1, who: 'leo', pose: 'point', expr: 'angry', t: gt });
    w += seated(1030, 'nora', 0, gt, { expr: 'sad', talk: talkOf('nora', gt), pose: 'sitSad' });
    w += cafeTable(1150, TB.y, 360) + cake(1150, TB.y);
    // banner held by Sam and Maya
    w += shadowAt(1260, 900, 62) + fig({ x: 1260, y: 900, s: 62, fc: -1, who: 'maya', pose: 'holdBanner', expr: 'worried', t: gt });
    w += shadowAt(1580, 900, 62) + fig({ x: 1580, y: 900, s: 62, fc: -1, who: 'sam', pose: 'holdBanner', expr: 'worried', t: gt });
    const bw = lerp(60, 330, un);
    w += path(`M${1290} 600 Q${1290 + bw * .5} ${620 + 10} ${1290 + bw} 600 L${1290 + bw} 680 Q${1290 + bw * .5} ${690} 1290 680 Z`, '#f6d26a') + g(text(1290 + bw / 2, 655, 'HAPPY BIRTHDAY LEO!', { 'font-size': 26, 'font-weight': 900, fill: '#b5323a', 'text-anchor': 'middle' }), { opacity: un > .8 ? 1 : 0 });
    for (let i = 0; i < 10; i++) w += rect(900 + rnd(i) * 800, 300 + ((lt * 60 + rnd(i * 3) * 400) % 500), 10, 16, ['#ff6a8a', '#ffd23f', '#3fe0ff'][i % 3], { transform: `rotate(${f1(lt * 200 + i * 40)} ${f1(900 + rnd(i) * 800)} ${f1(300 + ((lt * 60 + rnd(i * 3) * 400) % 500))})`, opacity: .8 * un });
    return cafeScene(cam, gt) + layer(cam, w);
  },
  c3_oh(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.08 }, { x: 960, y: 540, z: 1.0 });
    return CU_BG(gt, 800, 430) + layer(cam, figHead(900, 500, 300, { who: 'leo', fc: 1, expr: 'sad', talk: talkOf('leo', gt), sweat: true, t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
  },
  c3_deflate(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 640, z: 2.0 }, { x: 1150, y: 650, z: 2.1 });
    const dr = seg(lt, .2, 1.5);
    let w = cafeTable(1150, TB.y, 360) + cake(1150, TB.y, seg(lt, .4, 1.0));
    w += path(`M1290 ${600 + dr * 60} Q1455 ${650 + dr * 120} 1620 ${600 + dr * 30} L1620 ${680 + dr * 30} Q1455 ${720 + dr * 120} 1290 ${680 + dr * 60} Z`, '#f6d26a') + g(text(1455, 660 + dr * 90, 'HAPPY BIRTHDAY LEO!', { 'font-size': 26, 'font-weight': 900, fill: '#b5323a', 'text-anchor': 'middle', transform: `rotate(${f1(dr * 8)} 1455 ${f1(660 + dr * 90)})` }));
    w += seated(1030, 'nora', 0, gt, { expr: 'sad', pose: 'sitSad' });
    return cafeScene(cam, gt, { bgBlur: 5 }) + layer(cam, w);
  },
  c3_whatVsWhy(lt, d, gt) {
    // left panel: what his 5-second preview showed (tight, blue). right panel: the context he missed (wide, warm)
    const sp = seg(lt, 0, .6, ease.out);
    const left = futureWrap(cafeScene({ x: 1000, y: 450, z: 2.4 }, gt, { bgBlur: 12 }) + figHead(960, 560, 380, { who: 'nora', fc: 0, expr: 'determined', talk: Math.abs(Math.sin(lt * 9)) * .6, t: gt }), 1, { t: gt, border: false });
    const rcam = { x: 1200, y: 600, z: 1.1 };
    const right = cafeScene(rcam, gt) + layer(rcam, seated(1030, 'nora', 0, gt, { expr: 'happy', talk: Math.abs(Math.sin(lt * 9)) * .6 }) + cafeTable(1150, TB.y, 360) + cake(1150, TB.y) + path('M1290 600 Q1455 610 1620 600 L1620 680 Q1455 690 1290 680 Z', '#f6d26a') + text(1455, 655, 'HAPPY BIRTHDAY LEO!', { 'font-size': 26, 'font-weight': 900, fill: '#b5323a', 'text-anchor': 'middle' }) + shadowAt(1580, 900, 62) + fig({ x: 1580, y: 900, s: 62, fc: -1, who: 'sam', pose: 'holdBanner', expr: 'happy', t: gt }));
    def('clL', `<clipPath id="clL"><rect x="0" y="0" width="${f1(lerp(1920, 950, sp))}" height="1080"/></clipPath>`);
    def('clR', `<clipPath id="clR"><rect x="${f1(lerp(1920, 970, sp))}" y="0" width="1920" height="1080"/></clipPath>`);
    let s = `<g clip-path="url(#clL)"><g transform="translate(${f1(-480 * sp)} 0)">${left}</g></g><g clip-path="url(#clR)"><g transform="translate(${f1(lerp(960, 480, sp) - 480)} 0)">${right}</g></g>`;
    s += rect(950, 0, 20, H, '#0b0709');
    s += label(120, 200, 'WHAT HE SAW', seg(lt, .7, 1.1), 40) + label(1040, 200, 'WHAT HE MISSED', seg(lt, 2.4, 2.8), 40);
    return s;
  },
  c3_noraLeaves(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 600, z: 1.3 }, { x: 1040, y: 600, z: 1.35 });
    const st = seg(lt, .3, 1.0);
    const nx = lt < 1 ? 1030 : 1030 + (lt - 1) * 180;
    let w = cafeTable(TB.x, TB.y, TB.w) + cake(1050, TB.y, 1) + seated(700, 'leo', 1, gt, { expr: 'sad', pose: 'sitSad', lookX: .6 });
    w += lt < 1 ? seated(1030, 'nora', 1, gt, { expr: 'sad', pose: mixPose(POSES.sit, POSES.stand, st) }) : shadowAt(nx, 900, 62) + fig({ x: nx, y: 900, s: 62, fc: 1, who: 'nora', pose: walkPose(((lt - 1) * 1.6) % 1), expr: 'sad', t: gt });
    return cafeScene(cam, gt, { night: false }) + layer(cam, w);
  },
  c3_ghostCallBack(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1200, y: 600, z: 1.4 }, { x: 1240, y: 600, z: 1.45 });
    const nx = 1500 + lt * 40;
    let w = cafeTable(TB.x, TB.y, TB.w) + seated(700, 'leo', 1, gt, { expr: 'sad', pose: 'sitSad', lookX: 1, mouth: lt > .8 && lt < 1.6 ? 'o' : 'flat' });
    w += shadowAt(nx, 900, 62) + fig({ x: nx, y: 900, s: 62, fc: 1, who: 'nora', pose: walkPose((lt * 1.4) % 1), expr: 'sad', t: gt });
    const ga = seg(lt, .3, .8) * (1 - seg(lt, 2.2, 3.2));
    if (ga > 0) w += g(fig({ x: nx - 20, y: 900, s: 62, fc: -1, who: 'nora', pose: 'wave', expr: 'happy', talk: Math.abs(Math.sin(lt * 10)) * .6, ghost: true, op: .6 }), { opacity: ga.toFixed(2), transform: `translate(0 ${f1(-40 * seg(lt, 2.2, 3.2))})` });
    return cafeScene(cam, gt) + layer(cam, w);
  },
  c3_aloneWide(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const cam = { x: lerp(760, 960, p), y: lerp(640, 520, p), z: lerp(1.6, .8, p) };
    let w = cafeTable(TB.x, TB.y, TB.w) + cake(1050, TB.y, 1) + seated(700, 'leo', 1, gt, { expr: 'sad', pose: 'sitSad', lookY: 1 });
    return cafeScene(cam, gt, { bgBlur: 2 }) + layer(cam, w) + rect(0, 0, W, H, '#1a1440', { opacity: (p * .3).toFixed(2), style: 'mix-blend-mode:multiply' });
  },
});
function dodgeball(x, y, r = 34) { return circ(x, y, r, '#c0392b') + path(`M${x - r} ${y} Q${x} ${y - r * .4} ${x + r} ${y}`, 'none', { stroke: '#8e2a20', 'stroke-width': 3 }) + circ(x - r * .3, y - r * .35, r * .25, '#e57063', { opacity: .6 }); }
function cake(x, y, out = 0) {
  let s = rect(x - 60, y - 60, 120, 60, '#f4e2d0', { rx: 8 }) + rect(x - 60, y - 66, 120, 14, '#ff8fb0', { rx: 6 }) + ell(x, y, 80, 8, '#d8cfc4');
  for (const cx of [-30, 0, 30]) { s += rect(x + cx - 3, y - 92, 6, 26, '#8fd3ff'); if (!out || out < .5) s += ell(x + cx, y - 100, 5, 9, '#ffd06a') + glow(x + cx, y - 100, 30, '#ffb45c', .6); else s += path(`M${x + cx} ${y - 96} q8 -20 -4 -40 q-8 -20 6 -40`, 'none', { stroke: '#d8d0e0', 'stroke-width': 3, opacity: .5 * (1 - out * .5) }); }
  return s;
}
function countdownLabel(x, y, str, a) { return g(clockIcon(x - 70, y - 14, 22, .3) + text(x, y, str, { 'font-size': 42, 'font-weight': 800, fill: CREAM, filter: fGlow(6, '#ff9a3c', .7) }), { opacity: a }); }
