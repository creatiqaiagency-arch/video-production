// DIAGRAM + ACT II + ACT III (s024, s032–s069) — V2
const TB = { x: 960, y: 760, w: 440 }; // cafe table. Fixed seating left→right: Leo 700 (front), Nora 880 (back), Maya 1050 (back), Sam 1230 (front)
function cafeScene(cam, gt, o = {}) { return envCafe(cam, gt, o).bg; }
function paddle(x, y, rot = 0) { return g(rect(-4, 0, 8, 26, '#5a3a2a', { rx: 3 }) + ell(0, -16, 20, 24, '#c8323a'), { transform: `translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})` }); }
const withPaddle = rot => j => paddle(j.armF[2][0], j.armF[2][1], rot);
function chair(x, fc, floor = 880, s = 60) { const sy = floor - 1.42 * s; return rect(x - s * .7, sy, s * 1.4, s * .2, '#5a3a40', { rx: 4 }) + rect(x - fc * s * .7 - 6, sy - s * 1.3, 12, s * 1.3, '#5a3a40', { rx: 4 }) + rect(x - s * .6, sy, 8, floor - sy, '#43292f') + rect(x + s * .55, sy, 8, floor - sy, '#43292f'); }
function seated(x, who, fc, gt, o = {}) { // floor at 880, sits on a chair
  return chair(x, fc === 0 ? 1 : fc) + shadowAt(x, 880, 60) + fig({ x, y: 880, s: 60, fc, who, pose: o.pose || 'sit', expr: o.expr || 'neutral', talk: o.talk || 0, t: gt, seed: o.seed || x, lookX: o.lookX || 0, lookY: o.lookY || 0, rim: o.rim, ghost: o.ghost, op: o.op, blur: o.blur, extra: o.extra, mouth: o.mouth, sweat: o.sweat });
}
function cafeGroup(gt, o = {}) {
  let s = o.planted ? cakeBox(1130, 884) + rolledBanner(1300, 860) : '';
  s += seated(880, 'nora', 0, gt, { expr: o.noraExpr || 'neutral', talk: o.noraTalk || 0, seed: 3, pose: o.noraPose, lookX: o.noraLook ?? 0, extra: o.noraExtra, mouth: o.noraMouth });
  s += seated(1050, 'maya', 0, gt, { expr: o.mayaExpr || 'happy', seed: 5, pose: o.mayaPose, lookX: o.mayaLook ?? 0, extra: o.mayaExtra });
  s += cafeTable(TB.x, TB.y, TB.w) + (o.tableItems ?? (cup(870, TB.y, 1.1) + cup(1060, TB.y, 1.1)));
  if (o.leo !== false) s += seated(700, 'leo', 1, gt, { expr: o.leoExpr || 'neutral', talk: o.leoTalk || 0, pose: o.leoPose, seed: 1, lookX: o.leoLook ?? .4, mouth: o.leoMouth });
  s += seated(1230, 'sam', -1, gt, { expr: o.samExpr || 'happy', talk: o.samTalk || 0, pose: o.samPose, seed: 7, lookX: o.samLook ?? .4 });
  return s;
}
const CU_BG = (gt, x = 960, y = 420, z = 2.4, blur = 10, tod) => cafeScene({ x, y, z }, gt, { bgBlur: blur, tod });
const giftBox = (x, y) => rect(x - 40, y - 34, 80, 40, '#7fb4ff', { rx: 4 }) + rect(x - 4, y - 34, 8, 40, '#f6d26a') + path(`M${x} ${y - 34} q-20 -22 -26 -4 M${x} ${y - 34} q20 -22 26 -4`, 'none', { stroke: '#f6d26a', 'stroke-width': 5 });
const cakeBox = (x, y, hl = 0) => (hl ? circ(x, y - 40, 90, '#fff2c4', { opacity: .18 * hl, filter: fGlow(10, '#ffd27a', 1) }) : '') + rect(x - 50, y - 70, 100, 70, '#f4efe6', { rx: 4 }) + rect(x - 54, y - 76, 108, 12, '#e6ddd0', { rx: 3 }) + rect(x - 5, y - 76, 10, 76, '#ff8fb0');
const rolledBanner = (x, y, hl = 0) => (hl ? circ(x, y - 50, 70, '#fff2c4', { opacity: .18 * hl, filter: fGlow(10, '#ffd27a', 1) }) : '') + rect(x - 11, y - 120, 22, 120, '#f6d26a', { rx: 10 }) + ell(x, y - 120, 11, 5, '#e0b84a');
function banner(x0, y0, x1, y1, sag = 20, a = 1) { // hangs between two hands
  const mx = (x0 + x1) / 2, w = Math.hypot(x1 - x0, y1 - y0);
  return g(path(`M${x0} ${y0} Q${mx} ${(y0 + y1) / 2 + sag} ${x1} ${y1} L${x1} ${y1 + 70} Q${mx} ${(y0 + y1) / 2 + sag + 70} ${x0} ${y0 + 70} Z`, '#f6d26a') + text(mx, (y0 + y1) / 2 + sag * .6 + 48, 'HAPPY BIRTHDAY LEO!', { 'font-size': Math.min(30, w / 11), 'font-weight': 900, fill: '#b5323a', 'text-anchor': 'middle' }), { opacity: a });
}

Object.assign(SHOTS_REG, {
  // ---------------- DIAGRAM: the rules ----------------
  diag_timeline(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1 }, { x: 980, y: 560, z: 1.06 });
    let w = boardBg(gt);
    const ax = seg(lt, 0, .8);
    w += line(300, 700, lerp(300, 1650, ax), 700, '#d8e3f0', 6) + poly([[1650, 700], [1620, 684], [1620, 716]], '#d8e3f0', { opacity: ax });
    w += line(560, 680, 560, 720, '#d8e3f0', 5) + line(1380, 680, 1380, 720, '#8fd3ff', 5);
    w += text(560, 775, 'NOW', { 'font-size': 46, 'font-weight': 900, fill: '#d8e3f0', 'text-anchor': 'middle' });
    w += text(1380, 775, '+5 s', { 'font-size': 46, 'font-weight': 900, fill: '#8fd3ff', 'text-anchor': 'middle', opacity: seg(lt, .6, 1) });
    w += fig({ x: 560, y: 660, s: 44, fc: 1, who: 'leo', pose: 'stand', expr: 'neutral', t: gt, rim: { dx: -3, dy: -2, c: '#9fd0ff' } });
    const gp = seg(lt, .9, 1.6);
    w += fig({ x: 1380, y: 660, s: 44, fc: 1, who: 'leo', pose: 'wave', expr: 'happy', ghost: true, op: .7 * gp });
    const bp = seg(lt, 1.4, 2.2);
    if (bp > 0) w += dashedPath([[600, 395], [lerp(600, 1360, bp), 395]], '#8fd3ff', 5, 1);
    const c1 = seg(lt, .3, .8), c2 = seg(lt, 2.5, 2.9), c3 = seg(lt, 3.0, 3.5);
    w += g(text(960, 220, 'CONTROL TIME', { 'font-size': 60, 'font-weight': 900, fill: '#ffb4a8', 'text-anchor': 'middle', 'letter-spacing': 4 }) + line(720, 200, lerp(720, 1200, c2), 200, '#ff6a5a', 9), { opacity: c1 * (1 - seg(lt, 3.5, 3.9)) });
    w += g(text(960, 220, 'SEE 5 SECONDS AHEAD', { 'font-size': 60, 'font-weight': 900, fill: '#8fd3ff', 'text-anchor': 'middle', 'letter-spacing': 4, filter: fGlow(8, '#2f7bff', .8) }) + text(960, 290, 'IF NOTHING CHANGES', { 'font-size': 40, 'font-weight': 800, fill: '#d8e3f0', 'text-anchor': 'middle', 'letter-spacing': 6 }), { opacity: c3 });
    return layer(cam, w);
  },

  // ---------------- TABLE TENNIS ----------------
  g_matchCut(lt, d, gt) {
    const p = ease.inOut(clamp((lt - .25) / 2.2));
    const cam = { x: lerp(1180, 960, p), y: lerp(640, 560, p), z: lerp(12, 1.0, p) };
    const e = envGym(cam, gt);
    const rally = Math.sin(lt * 2.4);
    const bx = lerp(1180, 960 + rally * 300, seg(lt, 1.5, 3)), by = lerp(640, 700 - Math.abs(Math.cos(lt * 2.4)) * 120, seg(lt, 1.5, 3));
    let w = pingTable(960, 760) + benchNora(gt, 'happy') + shadowAt(560, 900, 66) + fig({ x: 560, y: 900, s: 66, fc: 1, who: 'leo', pose: rally > .3 ? 'swing' : 'paddleReady', expr: 'happy', t: gt, extra: withPaddle(40) }) + shadowAt(1360, 900, 66) + fig({ x: 1360, y: 900, s: 66, fc: -1, who: 'sam', pose: rally < -.3 ? 'swing' : 'paddleReady', expr: 'determined', t: gt, extra: withPaddle(-40) });
    w += scoreboard(960, 420, '0', '0', .9) + pingball(bx, by, lerp(6, 9, p));
    const circleC = mix('#cf7d5a', '#fbf6ee', seg(lt, 0, .25));
    return e.bg + e.light + layer(cam, w) + circ(960, 540, lerp(1300, 0, seg(lt, .1, .45, ease.out)), circleC);
  },
  g_wide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 580, z: 1.05 }, { x: 960, y: 590, z: 1.14 });
    const e = envGym(cam, gt);
    const per = 1.1, u = (lt % per) / per, dir = Math.floor(lt / per) % 2;
    const path = parabola(dir ? 1240 : 680, 700, dir ? 680 : 1240, 700, 110);
    const leoHit = dir === 1 && u > .75, samHit = dir === 0 && u > .75;
    let w = pingTable(960, 760) + benchNora(gt, 'happy');
    w += shadowAt(560, 900, 66) + fig({ x: 560, y: 900, s: 66, fc: 1, who: 'leo', pose: leoHit ? 'swing' : mixPose(POSES.paddleReady, POSES.swing, dir === 0 && u < .2 ? 1 - u * 5 : 0), expr: 'happy', t: gt, extra: withPaddle(40) });
    w += shadowAt(1360, 900, 66) + fig({ x: 1360, y: 900, s: 66, fc: -1, who: 'sam', pose: samHit ? 'swing' : mixPose(POSES.paddleReady, POSES.swing, dir === 1 && u < .2 ? 1 - u * 5 : 0), expr: 'determined', t: gt, extra: withPaddle(-40) });
    w += scoreboard(960, 420, '0', '0', .9) + pingball(...pOn(path, u), 8);
    return e.bg + e.light + layer(cam, w);
  },
  g_serveOTS(lt, d, gt) {
    const cam = camMove(lt, d, { x: 780, y: 640, z: 1.6 }, { x: 760, y: 640, z: 1.72 });
    const e = envGym(cam, gt, { bgBlur: 4 });
    const hit = 1.0, bp = seg(lt, hit, hit + .45, ease.lin);
    const path = parabola(1260, 640, 600, 700, 40);
    let w = pingTable(960, 760) + shadowAt(560, 900, 66) + fig({ x: 560, y: 900, s: 66, fc: 1, who: 'leo', pose: lt > hit + .35 ? 'swing' : 'paddleReady', expr: 'determined', t: gt, extra: withPaddle(40) });
    w += lt < hit ? pingball(1290, kf(lt, [[0, 600], [.55, 420], [hit, 560]]), 9) : (bp < 1 ? pingball(...pOn(path, bp), 9) + streaks(...pOn(path, bp), 260, 10, Math.PI * 1.02, '#fff', .55) : pingball(...pOn(parabola(600, 700, 1300, 640, 80), seg(lt, hit + .45, hit + 1.1, ease.lin)), 9));
    let s = e.bg + e.light + layer(cam, w);
    s += layer(C0, fig({ x: 1600, y: 1700, s: 210, fc: -1, who: 'sam', pose: poseAt(lt, [[0, 'serve'], [hit - .2, 'serve'], [hit, 'swing', ease.out]]), expr: 'none', t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }), { blur: 9 });
    return s;
  },
  // s035: overhead — predicted path with a landing ring; the ball follows it exactly into Leo's paddle and comes back
  g_overhead(lt, d, gt) {
    let s = rect(0, 0, W, H, '#4a2e28');
    for (let i = 0; i < 16; i++) s += rect(i * 130, 0, 4, H, '#3e261f');
    s += rect(560, 300, 800, 460, '#1f4a6a') + rect(560, 300, 800, 460, 'none', { stroke: '#e8eef2', 'stroke-width': 8 }) + line(960, 290, 960, 770, '#e8eef2', 8) + line(560, 530, 1360, 530, '#e8eef2', 3, { opacity: .7 });
    s += glowE(960, 530, 700, 400, '#ffc98a', .15);
    const P0 = [1400, 470], B = [760, 640], Pd = [520, 660];
    s += circ(1460, 520, 44, BODY, { filter: fRim(-5, -5, '#ffd29a') }) + path('M1420 500 A44 44 0 0 1 1500 500 Z', OUTFIT.sam.cap) + line(1460, 520, 1400, 470, BODY, 16);
    const reach = seg(lt, .7, 1.1, ease.out);
    const lx = 470, ly = lerp(560, 640, reach);
    s += circ(lx, ly, 44, BODY, { filter: fRim(5, -5, '#ffd29a') }) + circ(lx, ly + 34, 30, OUTFIT.leo.cloth) + line(lx, ly, lx + 50, ly + 20, OUTFIT.leo.cloth, 22) + paddle(Pd[0] + 6, Pd[1] + 6, -110);
    s += dashedPath([P0, [1120, 560], B, Pd], '#8fd3ff', 6, seg(lt, 0, .45));
    s += circ(B[0], B[1], 26 + Math.sin(lt * 8) * 4, 'none', { stroke: '#8fd3ff', 'stroke-width': 4, opacity: .8, filter: fGlow(4, '#2f7bff', 1) });
    const u = seg(lt, .5, 1.25, ease.lin);
    const bp = u < .7 ? [lerp(P0[0], B[0], u / .7), lerp(P0[1], B[1], u / .7)] : [lerp(B[0], Pd[0], (u - .7) / .3), lerp(B[1], Pd[1], (u - .7) / .3)];
    if (lt < 1.25) s += pingball(bp[0], bp[1], 11) + streaks(bp[0], bp[1], 120, 6, Math.atan2(B[1] - P0[1], B[0] - P0[0]), '#fff', .5);
    else { const r = seg(lt, 1.25, 1.9, ease.lin); s += pingball(lerp(Pd[0], 1300, r), lerp(Pd[1], 420, r), 11) + streaks(lerp(Pd[0], 1300, r), lerp(Pd[1], 420, r), 160, 6, Math.atan2(-240, 780), '#fff', .5) + glow(Pd[0] + 20, Pd[1], 90, '#fff', .6 * (1 - seg(lt, 1.25, 1.45))); }
    s += label(1430, 880, '130 km/h', seg(lt, .4, .8), 40);
    return s;
  },
  g_samStunned(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.07 });
    const e = envGym({ x: 900, y: 420, z: 2.2 }, gt, { bgBlur: 9 });
    const k = Math.min(3, Math.floor(seg(lt, .1, 1.0, ease.lin) * 4));
    let s = e.bg + layer(C0, g(scoreboard(560, 330, ['3', '6', '9', '11'][k], '0', 1.6), { filter: fBlur(2) }));
    s += layer(cam, figHead(1060, 500, 300, { who: 'sam', fc: -1, expr: 'shocked', talk: talkOf('sam', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
    return s;
  },
  // s036b: Nora on the bench jumps up cheering "LEO!"
  g_noraCheer(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1 }, { x: 960, y: 540, z: 1.08 });
    const e = envGym({ x: 700, y: 420, z: 2.0 }, gt, { bgBlur: 9 });
    const dip = Math.sin(seg(lt, 0, .15) * Math.PI) * 30, j = hop(Math.max(0, lt - .15), .45, 90, 2, .3), up = seg(lt, .1, .35, ease.outBack);
    return e.bg + layer(cam, `<g transform="translate(960 ${f1(900)}) scale(${(1 + j.sq * .5).toFixed(3)} ${(1 - j.sq * .6).toFixed(3)}) translate(-960 -900)">` + figHead(960, 600 + dip - j.y, 220, { who: 'nora', fc: 0, expr: 'happy', mouth: 'grin', lookX: .7, t: gt, pose: mixPose(POSES.stand, POSES.armsUp, up), rim: { dx: 0, dy: -10, c: '#ffd29a' } }) + '</g>');
  },
  // ---------------- ARCADE ----------------
  a_pov(lt, d, gt) {
    const e = envArcade({ x: 960, y: 400, z: 1.6 }, gt, { bgBlur: 8 });
    let s = e.bg + rect(260, 330, 1400, 760, '#1a1228', { rx: 30 }) + rect(260, 330, 1400, 760, 'none', { stroke: '#3fe0ff', 'stroke-width': 4, rx: 30, opacity: .5 });
    const seq = [4, 0, 8, 2, 6, 1, 7, 3, 5], per = .42;
    const k = Math.floor(lt / per), ph = (lt % per) / per, cur = seq[k % 9], prev = seq[(k + 8) % 9];
    const bpos = i => [560 + (i % 3) * 400, 470 + Math.floor(i / 3) * 210];
    for (let i = 0; i < 9; i++) {
      const [x, y] = bpos(i); const lit = i === cur && ph > .35;
      s += ell(x, y + 12, 100, 40, '#0c0814') + ell(x, y, 100, 40, lit ? '#ffe14a' : '#3a2a52') + (lit ? glow(x, y, 180, '#ffe14a', .5) : '');
      if (i === cur && ph < .45) s += ell(x, y, 112, 48, 'none', { stroke: '#8fd3ff', 'stroke-width': 6, filter: fGlow(6, '#2f7bff', 1), opacity: 1 - ph });
    }
    const [tx, ty] = bpos(cur), [px, py] = bpos(prev);
    const hp = seg(ph, 0, .35, ease.out);
    const hand = u => [lerp(px, tx, u), lerp(py + 10, ty + 10, u)];
    for (const k2 of [.25, .5, .75]) { if (hp > k2) { const [hx, hy] = hand(hp - k2 * .3); s += g(pline([[hx - 120, 1300], [hx, hy + 40]], OUTFIT.leo.cloth, 90) + circ(hx, hy, 46, BODY), { opacity: .18 }); } }
    const [hx, hy] = hand(hp);
    s += `<g filter="${fRim(-4, -6, '#ff3fa8')}">${pline([[hx - 120, 1300], [hx, hy + 40]], OUTFIT.leo.cloth, 90) + circ(hx, hy, 46, BODY)}</g>`;
    s += text(960, 140, String(Math.min(999, k * 111)).padStart(3, '0'), { 'font-size': 80, 'font-weight': 900, fill: '#ffe14a', 'text-anchor': 'middle', filter: fGlow(10, '#ff9a3c', 1) });
    return s;
  },
  a_score(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 520, z: 1.25 }, { x: 980, y: 520, z: 1.34 });
    const e = envArcade(cam, gt, { bgBlur: 3 });
    let w = rect(700, 260, 360, 640, '#1c1430', { rx: 18 }) + rect(730, 300, 300, 220, '#0a0614', { rx: 8 });
    const sc = Math.min(999, Math.floor(lerp(700, 999, seg(lt, 0, 1.2))));
    w += text(880, 400, String(sc), { 'font-size': 86, 'font-weight': 900, fill: '#ffe14a', 'text-anchor': 'middle', filter: fGlow(8, '#ff9a3c', 1) });
    w += text(880, 470, 'PERFECT!', { 'font-size': 40, 'font-weight': 900, fill: '#ffe14a', 'text-anchor': 'middle', opacity: seg(lt, 1.2, 1.4), filter: fGlow(8, '#ff3fa8', 1) });
    w += glow(880, 410, 300, '#ffe14a', .25 * seg(lt, 1.1, 1.4));
    w += shadowAt(1180, 900, 70) + fig({ x: 1180, y: 900, s: 70, fc: -1, who: 'leo', pose: poseAt(lt, [[0, 'arcade'], [1.3, 'arcade'], [1.6, 'armsUp', ease.outBack]]), expr: lt > 1.3 ? 'happy' : 'smug', t: gt, rim: { dx: -6, dy: -3, c: '#ff3fa8' } });
    const turn = seg(lt, 1.0, 1.4);
    w += shadowAt(1450, 900, 70) + fig({ x: 1450, y: 900, s: 70, fc: -1, who: 'sam', pose: 'stand', expr: turn > .5 ? 'shocked' : 'neutral', lookX: turn > .5 ? 1 : -1, t: gt, rim: { dx: -6, dy: -3, c: '#ffd23f' } });
    return e.bg + layer(cam, w);
  },
  // ---------------- DODGEBALL ----------------
  d_balls(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 600, z: 1.3 }, { x: 960, y: 600, z: 1.48 });
    const e = envGym(cam, gt, { bgBlur: 4 });
    let w = shadowAt(960, 900, 70) + fig({ x: 960, y: 900, s: 70, fc: -1, who: 'leo', pose: 'crouch', expr: 'determined', t: gt });
    const starts = [[1800, 560], [1750, 760], [1820, 380]], ends = [[980, 600], [960, 760], [940, 470]];
    starts.forEach((s0, i) => { const u = seg(lt, .1 * i, d + .4, ease.lin) * .7; const p = [lerp(s0[0], ends[i][0], u), lerp(s0[1], ends[i][1], u)]; w += dashedPath([p, ends[i]], '#8fd3ff', 4, 1, { op: .7 }) + circ(ends[i][0], ends[i][1], 30, '#7fc8ff', { opacity: .45, filter: fGhost(3) }) + dodgeball(p[0], p[1]) + streaks(p[0], p[1], 120, 20, Math.PI, '#ffd6c0', .4, 4, i); });
    return e.bg + e.light + layer(cam, w);
  },
  // s040: low angle; dodges with trails; one ball whooshes right past the lens; lands into a crouch
  d_dodge(lt, d, gt) {
    const cam = { x: 960 + Math.sin(lt * .7) * 120, y: 640, z: 1.6 + lt * .05, r: Math.sin(lt * 1.3) * 2 };
    const e = envGym(cam, gt, { bgBlur: 4 });
    const keys = [[0, 'crouch'], [.4, 'dodgeL', ease.out], [.9, 'dodgeR', ease.out], [1.4, 'duck', ease.out], [1.9, 'crouch', ease.out], [2.3, 'stand']];
    let w = shadowAt(960, 900, 70);
    [.5, .35, .2].forEach((k, i) => { w += fig({ x: 960, y: 900, s: 70, fc: -1, who: 'leo', pose: poseAt(Math.max(0, lt - k * .5), keys), expr: 'none', rim: null, op: .1 + i * .05, still: true }); });
    w += fig({ x: 960, y: 900, s: 70, fc: -1, who: 'leo', pose: poseAt(lt, keys), expr: 'determined', t: gt });
    [[.3, 520, 1], [.75, 640, 2], [1.25, 760, 3]].forEach(([t0, y, i]) => { const u = seg(lt, t0 - .3, t0 + .3, ease.lin); if (u > 0 && u < 1) w += dodgeball(lerp(1700, 200, u), y) + streaks(lerp(1700, 200, u), y, 200, 20, Math.PI, '#ffd6c0', .5, 4, i); });
    let s = e.bg + e.light + layer(cam, w);
    const cp = seg(lt, 1.45, 1.9, ease.lin);
    if (cp > 0 && cp < 1) s += circ(lerp(2300, -400, cp), 420, 380, '#c0392b', { filter: fBlur(18) });
    return s;
  },
  d_disbelief(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 600, z: 1.15 }, { x: 960, y: 600, z: 1.22 });
    const e = envGym(cam, gt);
    const up = seg(lt, .15, .6, ease.outBack);
    let w = shadowAt(560, 900, 66) + fig({ x: 560, y: 900 - Math.sin(up * Math.PI) * 50, sq: up < .1 ? .12 * up * 10 : (up > .9 ? .18 * (1 - up) * 10 : -.08), s: 66, fc: 0, who: 'leo', pose: mixPose(POSES.stand, { tor: 0, head: -10, ab: [150, 10], af: [150, 10], lb: [8, 0], lf: [-8, 0] }, up), expr: 'happy', mouth: 'grin', t: gt });
    [[1150, 'grey'], [1350, 'teal'], [1550, 'mauve']].forEach(([x, who], i) => { w += shadowAt(x, 900, 66) + fig({ x, y: 900, s: 66, fc: -1, who, pose: 'stand', expr: 'shocked', t: gt, seed: i * 3 }); });
    for (let i = 0; i < 4; i++) w += dodgeball(800 + i * 120, 880 - Math.abs(Math.sin(lt * 4 + i)) * 30 * (1 - seg(lt, 0, 2)), 22);
    return e.bg + e.light + layer(cam, w);
  },
  d_jawDrop(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.1 });
    const e = envGym({ x: 1300, y: 420, z: 2.2 }, gt, { bgBlur: 10 });
    const drop = seg(lt, .1, .4, ease.outBack);
    return e.bg + layer(cam, figHead(1000, 480, 300, { who: 'teal', fc: -1, expr: 'shocked', mouth: drop > .5 ? 'shout' : 'o', talk: drop * .6, t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  d_highFive(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 640, z: 1.6 }, { x: 960, y: 640, z: 1.7 });
    const e = envGym(cam, gt, { bgBlur: 4 });
    const hf = seg(lt, .3, .7, ease.out);
    const nx = lerp(1300, 1090, seg(lt, 0, .6, ease.out));
    const fiveL = mixPose(POSES.stand, { tor: 4, head: -6, ab: [6, 8], af: [150, 10], lb: [6, 0], lf: [-6, 0] }, hf);
    let w = shadowAt(880, 900, 70) + fig({ x: 880, y: 900, s: 70, fc: 1, who: 'leo', pose: fiveL, expr: 'happy', mouth: 'grin', t: gt });
    w += shadowAt(nx, 900, 66) + fig({ x: nx, y: 900, s: 66, fc: -1, who: 'nora', pose: lt < .6 ? runPose((lt * 2.4) % 1, .7) : fiveL, expr: 'happy', mouth: 'grin', t: gt });
    if (lt > .68 && lt < 1.0) w += rays(985, 470, 10, 90, '#fff2c4', .7);
    return e.bg + e.light + layer(cam, w);
  },
  hero_rays(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1 }, { x: 960, y: 540, z: 1.08 });
    let s = envGym({ x: 940, y: 300, z: 1.5 }, gt, { bgBlur: 6 }).bg + layer(C0, rays(950, 340, 26, 1600, '#ffd6a0', .11, lt * 4) + glow(950, 340, 340, '#fff1c9', .55));
    s += layer(cam, fig({ x: 960, y: 1500, s: 165, fc: 0, who: 'leo', pose: { tor: 0, head: -6, ab: [40, -120], af: [40, -120], lb: [10, 0], lf: [-10, 0] }, expr: 'smug', t: gt, rim: { dx: 0, dy: -12, c: '#ffd29a' } }));
    return s;
  },
  // ---------------- EVERYDAY ADVANTAGES ----------------
  sw_phone(lt, d, gt) {
    const cut = d * .55;
    if (lt < cut) {
      const cam = camMove(lt, cut, { x: 900, y: 600, z: 1.35 }, { x: 980, y: 600, z: 1.38 });
      const wx = 640 + lt * 150, ph = (lt * 1.6) % 1;
      let pz = mixPose(walkPose(ph), POSES.phone, .5);
      let hand = null;
      let w = shadowAt(wx, 900, 62) + fig({ x: wx, y: 900, s: 62, fc: 1, who: 'mauve', pose: pz, expr: lt > cut - .5 ? 'shocked' : 'neutral', t: gt, lookY: 1, joints: j => { hand = j.armF[2]; } });
      const slip = seg(lt, cut - .7, cut, ease.in2);
      w += rect(hand[0] - 9 + slip * 20, hand[1] - 20 + slip * 200, 18, 30, '#20222a', { rx: 4, transform: `rotate(${f1(slip * 140)} ${f1(hand[0] + slip * 20)} ${f1(hand[1] + slip * 200)})` }) + rect(hand[0] - 6 + slip * 20, hand[1] - 16 + slip * 200, 12, 20, '#3fa0ff', { opacity: .8 });
      w += shadowAt(wx + 120, 900, 62) + fig({ x: wx + 120, y: 900, s: 62, fc: 1, who: 'leo', pose: walkPose((ph + .5) % 1), expr: 'neutral', t: gt, lookX: -.4 });
      return cafeScene(cam, gt, { bgBlur: 3, tod: 'dusk' }) + layer(cam, w);
    }
    const l2 = lt - cut;
    let s = cafeScene({ x: 900, y: 880, z: 3 }, gt, { bgBlur: 10, tod: 'dusk' }) + rect(0, 760, W, 400, lgrad([[0, '#3a2a36'], [1, '#1a1219']])) + glowE(900, 820, 700, 120, '#ffb46a', .2);
    const py = kf(l2, [[0, 200], [.5, 640, ease.in2], [d - cut, 648]]), pr = kf(l2, [[0, 40], [.5, 150]]);
    s += g(rect(-40, -80, 80, 160, '#20222a', { rx: 14 }) + rect(-32, -70, 64, 130, '#3fa0ff', { rx: 8, opacity: .85 }) + glow(0, -10, 90, '#3fa0ff', .35), { transform: `translate(960 ${f1(py)}) rotate(${f1(pr)})` });
    const hp = seg(l2, .25, .5, ease.out);
    s += `<g filter="${fRim(-6, -6, '#ffd29a')}">${pline([[lerp(1900, 1250, hp), lerp(1100, 820, hp)], [lerp(1600, 1040, hp), lerp(900, 720, hp)]], OUTFIT.leo.cloth, 120) + mitten(lerp(1520, 990, hp), lerp(860, 700, hp), 56, 200, hp > .9 ? 1 : 0)}</g>`;
    return s + streaks(960, py, 200 * (1 - hp), 30, Math.PI / 2, '#fff', .3);
  },
  c_cupSlide(lt, d, gt) {
    let s = rect(0, 0, W, H, '#2c1c26');
    for (let i = 0; i < 12; i++) s += rect(i * 170, 0, 6, H, '#251720');
    s += glowE(960, 560, 700, 520, '#f0b27a', .35) + circ(960, 560, 420, '#8a6266') + circ(960, 560, 400, '#7a565a');
    const elbow = seg(lt, .9, 1.5, ease.out);
    s += `<g filter="${fRim(4, -6, '#ffd29a')}">${pline([[200, 1000], [lerp(520, 780, elbow), lerp(720, 640, elbow)]], OUTFIT.grey.cloth, 110) + pline([[lerp(520, 780, elbow), lerp(720, 640, elbow)], [460, 360]], OUTFIT.grey.cloth, 90) + circ(lerp(520, 780, elbow), lerp(720, 640, elbow), 50, OUTFIT.grey.shade)}</g>`;
    const ga = 1 - seg(lt, .85, 1.1);
    const gp = seg(lt, .05, .6, ease.in2);
    if (ga > 0) s += g(g(circ(0, 0, 70, '#dff3ff') + circ(0, 0, 50, '#bfe6ff') + circ(0, 0, 40, '#4fa8ff'), { transform: `translate(${f1(820 + gp * 80)} ${f1(600 + gp * 40)}) scale(1 ${f1(1 - gp * .6)}) rotate(${f1(gp * 80)})` }) + ell(900 + gp * 130, 660 + gp * 80, 170 * gp, 90 * gp, '#7fc8ff', { opacity: .75 }) + [0, 1, 2, 3, 4].map(i => circ(900 + gp * (160 + i * 40), 640 + gp * (i * 30 - 40), 12 * gp, '#bfe6ff')).join(''), { opacity: ga.toFixed(2), filter: fGhost(4), class: 'gh' });
    const slide = seg(lt, .5, 1.1, ease.outBack);
    const cx = lerp(820, 1100, slide), cy = lerp(600, 560, slide);
    s += circ(cx + 6, cy + 8, 72, '#000', { opacity: .3 }) + circ(cx, cy, 70, '#e8e0d4') + circ(cx, cy, 46, '#f4ece2') + circ(cx, cy, 36, '#6a3a2a') + circ(cx - 10, cy - 10, 10, '#a06a4a', { opacity: .6 });
    s += `<g filter="${fRim(-4, -6, '#ffd29a')}">${pline([[1900, 300], [lerp(1500, 1210, slide), lerp(420, 520, slide)]], OUTFIT.leo.cloth, 76) + mitten(lerp(1440, 1150, slide), lerp(450, 540, slide), 34, 200)}</g>`;
    return s;
  },
  c_tableWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 620, z: 1.4 }, { x: 960, y: 630, z: 1.48 });
    const fin = seg(lt, 1.6, 2.0);
    return cafeScene(cam, gt) + layer(cam, cafeGroup(gt, { samPose: mixPose(POSES.sit, { tor: 20, head: 5, ab: [30, 50], af: [60, 60], lb: [88, 88], lf: [86, 86] }, .8), samExpr: 'happy', samTalk: lt > 1.3 ? Math.abs(Math.sin(lt * 14)) * .6 : 0, leoPose: mixPose(POSES.sit, { tor: -6, head: -4, ab: [30, 50], af: [80, 60], lb: [88, 88], lf: [86, 86] }, fin), leoExpr: 'smug', mayaExpr: 'neutral' }));
  },
  c_samTalk(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    return CU_BG(gt, 1100, 450) + layer(cam, figHead(1020, 480, 300, { who: 'sam', fc: -1, expr: 'happy', talk: talkOf('sam', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  c_leoSmug(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 530, z: 1.08 });
    return CU_BG(gt, 800, 450) + layer(cam, figHead(860, 480, 300, { who: 'leo', fc: 1, expr: 'smug', talk: talkOf('leo', gt), t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } })) + layer(C0, figHead(1640, 560, 330, { who: 'nora', fc: -1, expr: 'none' }), { blur: 10 });
  },
  // s048: reverse two-shot: Sam annoyed ("Dude, can you stop") and Nora's eye-roll, both sharp
  c_samNora(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1 }, { x: 980, y: 560, z: 1.06 });
    const e = envCafeReverse({ x: 960, y: 500, z: 1.6 }, gt, { bgBlur: 8 });
    const roll = seg(lt, .4, .9);
    let s = e.bg;
    s += layer(cam, figHead(1290, 520, 250, { who: 'nora', fc: -1, expr: lt > .4 && lt < 1.3 ? 'closed' : 'neutral', lookY: -roll, lookX: .5, t: gt, rim: { dx: 8, dy: -6, c: '#ffd29a' } }));
    s += layer(cam, figHead(640, 500, 280, { who: 'sam', fc: 1, expr: 'angry', talk: talkOf('sam', gt), t: gt, rim: { dx: -8, dy: -6, c: '#ffd29a' } }));
    s += layer(C0, figHead(965, 900, 300, { who: 'maya', fc: 0, expr: 'none' }), { blur: 10 });
    return s;
  },
  // s049: reverse angle from inside the café — the group through the window
  c_reverseWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.0 }, { x: 980, y: 570, z: 1.08 });
    const e = envCafeReverse(cam, gt, { bgBlur: 3, frameBlur: 3 });
    const pc = { x: 960, y: 620, z: 1.25 };
    let w = '';
    w += seated(1230, 'leo', -1, gt, { expr: 'smug', pose: { ...POSES.sit, ab: [20, 120], af: [25, 115] }, seed: 1 }) + seated(1050, 'nora', 0, gt, { expr: 'neutral', seed: 3 }) + seated(880, 'maya', 0, gt, { expr: 'happy', seed: 5 }) + cafeTable(TB.x, TB.y, TB.w) + cup(870, TB.y, 1.1) + cup(1060, TB.y, 1.1) + seated(700, 'sam', 1, gt, { expr: 'happy', talk: Math.abs(Math.sin(lt * 12)) * .5, seed: 7 });
    return e.bg.replace(/<g transform="[^"]*" filter="url\(#bl2\)">/, m => m) + layer(pc, w, { p: .9 }) + layer(cam, path('M-800 -400 H2800 V1500 H-800 Z M-60 120 V780 H1980 V120 Z', '#24161e', { 'fill-rule': 'evenodd' }) + rect(458, 120, 24, 660, '#24161e') + rect(1438, 120, 24, 660, '#24161e'), { p: 1.2, blur: 3 });
  },
  // s050: ghost speech bubbles pop over each friend before they speak; Leo answers early; camera pushes in on Leo
  c_ghostMouths(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const cam = { x: lerp(960, 760, p), y: 620, z: lerp(1.4, 2.0, p) };
    let w = cafeGroup(gt, { leoTalk: Math.abs(Math.sin(lt * 11)) * .7 * (lt % 1.3 < .7 ? 1 : 0), leoExpr: 'smug', samExpr: 'neutral', mayaExpr: 'neutral', noraExpr: 'neutral' });
    [[880, 560, 0, 'haha—'], [1050, 560, .9, 'wait, did—'], [1230, 570, 1.8, 'guess wh—']].forEach(([x, y, t0, str]) => { const a = seg(lt, t0, t0 + .25, ease.outBack) * (1 - seg(lt, t0 + 1.0, t0 + 1.3)); if (a > 0) w += g(rect(x - 90, y - 110, 180, 64, '#0d2a5c', { rx: 24, opacity: .85 }) + poly([[x - 12, y - 48], [x + 10, y - 48], [x - 6, y - 30]], '#0d2a5c') + text(x, y - 68, str, { 'font-size': 28, 'font-weight': 800, fill: '#d8f0ff', 'text-anchor': 'middle' }), { opacity: a.toFixed(2), filter: fGhost(4), transform: `translate(${x} ${y}) scale(${(.6 + a * .4).toFixed(2)}) translate(${-x} ${-y})` }); });
    return cafeScene(cam, gt) + layer(cam, w);
  },
  c_leoMouthing(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.07 });
    const flap = Math.max(0, Math.sin(lt * 13)) * (lt % 1.1 < .8 ? .8 : 0);
    let s = CU_BG(gt, 800, 450);
    s += layer(cam, figHead(820, 480, 280, { who: 'leo', fc: 1, expr: 'neutral', talk: flap, t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    s += layer(C0, figHead(1620, 520, 330, { who: 'nora', fc: -1, expr: 'neutral', talk: flap, t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }), { blur: 9 });
    return s;
  },
  // s052: Leo's smile fades as the grade cools and desaturates
  c_leoSmileFades(lt, d, gt) {
    const p = seg(lt, 0, d);
    const cam = { x: 960, y: 540, z: lerp(1.0, 1.15, p) };
    let s = `<g filter="${fFuture(p * .35)}">${CU_BG(gt, 760, 450) + layer(cam, figHead(900, 490, 300, { who: 'leo', fc: 1, expr: lt < d * .45 ? 'happy' : 'neutral', mouth: lt < d * .45 ? 'smile' : 'flat', t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }))}</g>`;
    s += layer(C0, figHead(1600, 560, 330, { who: 'nora', fc: -1, expr: 'none' }) + figHead(2010, 540, 330, { who: 'maya', fc: -1, expr: 'none' }), { blur: 12 });
    return s + rect(0, 0, W, H, '#2a2a6a', { opacity: (p * .2).toFixed(2), style: 'mix-blend-mode:multiply' });
  },
  // s053: low 3/4 across the table — Sam's crossed arms blurred in the foreground, Maya on her phone, Nora sad
  c_friendsTired(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 700, z: 1.6 }, { x: 980, y: 700, z: 1.66 });
    const phoneM = j => rect(j.armF[2][0] - 8, j.armF[2][1] - 30, 16, 28, '#3fa0ff', { rx: 3 }) + glow(j.armF[2][0], j.armF[2][1] - 16, 30, '#3fa0ff', .4);
    let w = seated(700, 'leo', 1, gt, { expr: 'smug', lookX: .5 }) + seated(880, 'nora', 0, gt, { expr: 'sad', lookX: -.6, lookY: .4 }) + seated(1050, 'maya', 0, gt, { pose: 'phone', expr: 'neutral', extra: phoneM, lookY: 1 }) + cafeTable(TB.x, TB.y, TB.w) + cup(870, TB.y, 1.1);
    let s = cafeScene(cam, gt) + layer(cam, w);
    s += layer(C0, fig({ x: 1600, y: 1650, s: 220, fc: -1, who: 'sam', pose: 'armsCross', expr: 'none', rim: { dx: 8, dy: -8, c: '#ffd29a' } }), { blur: 11 });
    return s + rect(0, 0, W, H, '#2a2a6a', { opacity: .16, style: 'mix-blend-mode:multiply' });
  },
  c_noraHurt(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.08 });
    const away = seg(lt, d * .5, d * .7);
    return CU_BG(gt, 1100, 430) + layer(cam, figHead(1000, 490, 300, { who: 'nora', fc: away > .5 ? 1 : -1, expr: 'sad', lookX: away > .5 ? .6 : .9, t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } })) + rect(0, 0, W, H, '#2a2a6a', { opacity: .14, style: 'mix-blend-mode:multiply' });
  },
  // ---------------- ACT III (afternoon → dusk) ----------------
  c3_approach(lt, d, gt) {
    const cam = camMove(lt, d, { x: 860, y: 500, z: 1.1 }, { x: 900, y: 510, z: 1.16 });
    const lx = 140 + lt * 75;
    let w = cafeGroup(gt, { leo: false, noraExpr: 'happy', samExpr: 'happy', mayaExpr: 'happy', samPose: { tor: 25, head: 10, ab: [30, 50], af: [40, 60], lb: [88, 88], lf: [86, 86] }, noraPose: { tor: 15, head: 10, ab: [30, 60], af: [40, 90], lb: [88, 88], lf: [86, 86] }, noraLook: .6, mayaLook: .5, planted: true, noraExtra: j => giftBox(j.hip[0] + 10, j.hip[1] - 6) });
    w += shadowAt(lx, 900, 62) + fig({ x: lx, y: 900, s: 62, fc: 1, who: 'leo', pose: walkPose((lt * 1.6) % 1), expr: 'happy', t: gt });
    return cafeScene(cam, gt, { tod: 'day' }) + layer(cam, w);
  },
  c3_eyeRing(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .3)) * .25 };
    let s = CU_BG(gt, 1100, 420, 2.4, 14, 'day');
    s += layer(cam, figHead(960, 600, 900, { who: 'leo', fc: 0, expr: 'neutral', blink: false, still: true, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    for (const ex of [-1, 1]) s += layer(cam, ringFx(960 + ex * 450 * .27, 600 - 45, seg(lt, .15, .9, ease.lin), 240));
    return s + flashPulse(lt, d - .03, .05, .5, '#7fc0ff');
  },
  // s056: FUTURE — Nora leans to Sam, hand cupped at her mouth, eyes flick toward camera (checking Leo isn't near). Cake corner in frame.
  c3_noraFuture(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.05 }, { x: 960, y: 520, z: 1.18 });
    const talk = talkOf('nora', gt);
    const cupH = j => mitten(j.head[0] + j.headR * .9, j.head[1] + j.headR * .45, j.headR * .32, -70, 0, false, '#9ad6ff');
    let w = CU_BG(gt, 1000, 450, 2.4, 12, 'day');
    w += layer(cam, figHead(860, 520, 330, { who: 'nora', fc: 1, expr: 'neutral', talk, lookX: lt % 1.6 > 1.0 ? -1 : .8, t: gt, ghost: true, op: .8, pose: { tor: 10, head: 14, ab: [6, 8], af: [70, 120] }, extra: cupH }));
    w += layer(C0, figHead(1580, 560, 360, { who: 'sam', fc: -1, expr: 'neutral', ghost: true, op: .55 }) + cake(300, 1080), { blur: 7 });
    return futureWrap(w, 1, { t: gt });
  },
  c3_leoFroze(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.1 });
    const up = seg(lt, .9, 1.2, ease.outBack);
    return CU_BG(gt, 800, 430, 2.4, 10, 'day') + layer(cam, figHead(900, 490, 300, { who: 'leo', fc: 1, expr: 'shocked', talk: talkOf('leo', gt), blink: false, t: gt, pose: mixPose(POSES.stand, POSES.shrug, up), rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
  },
  c3_eyesNarrow(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 520, z: 1.9 }, { x: 960, y: 520, z: 2.1 });
    const n = seg(lt, .2, .8);
    return CU_BG(gt, 800, 430, 2.4, 12, 'day') + layer(cam, figHead(960, 600, 560, { who: 'leo', fc: 0, expr: n > .5 ? 'angry' : 'neutral', t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } })) + rect(0, 0, W, H, '#200810', { opacity: (.18 * n).toFixed(2), style: 'mix-blend-mode:multiply' });
  },
  // s059: low-angle tracking march; he stops at the table's near edge
  c3_march(lt, d, gt) {
    const lx = Math.min(250 + lt * 160, 560);
    const cam = { x: lx + 300, y: 600, z: 1.45, r: -1.5 };
    const walking = lx < 560;
    let w = cafeGroup(gt, { leo: false, noraExpr: 'neutral', noraLook: -1, samExpr: 'neutral', mayaExpr: 'worried', planted: true, noraExtra: j => giftBox(j.hip[0] + 10, j.hip[1] - 6) });
    w += shadowAt(lx, 900, 62) + fig({ x: lx, y: 900, s: 62, fc: 1, who: 'leo', pose: walking ? walkPose((lt * 2.3) % 1, 1.3) : 'stand', expr: 'angry', t: gt });
    return cafeScene(cam, gt, { tod: 'day' }) + layer(cam, w);
  },
  c3_otsAccuse(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    let s = CU_BG(gt, 700, 430, 2.4, 10, 'day');
    s += layer(cam, figHead(760, 470, 260, { who: 'leo', fc: 1, expr: 'angry', talk: talkOf('leo', gt), t: gt, pose: { tor: 8, head: 4, ab: [6, 8], af: [70, 25] }, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    s += layer(C0, figHead(1500, 540, 420, { who: 'nora', fc: -1, expr: 'none', t: gt, rim: { dx: 10, dy: -10, c: '#ffd29a' } }), { blur: 10 });
    return s;
  },
  c3_noraConfused(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    return CU_BG(gt, 1100, 430, 2.4, 10, 'day') + layer(cam, figHead(1020, 490, 300, { who: 'nora', fc: -1, expr: 'worried', talk: talkOf('nora', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  c3_leoPoint(lt, d, gt) {
    const cam = camMove(lt, d, { x: 900, y: 640, z: 1.65 }, { x: 900, y: 640, z: 1.78 });
    let w = seated(880, 'nora', -1, gt, { expr: 'worried', lookX: .5, extra: j => giftBox(j.hip[0] - 10, j.hip[1] - 6) }) + seated(1050, 'maya', 0, gt, { expr: 'worried' }) + cafeTable(TB.x, TB.y, TB.w) + seated(1230, 'sam', -1, gt, { expr: 'worried' });
    w += shadowAt(620, 900, 70) + fig({ x: 620, y: 900, s: 70, fc: 1, who: 'leo', pose: { tor: 6, head: 4, ab: [6, 8], af: [100, 18], lb: [6, 0], lf: [-6, 0] }, expr: 'angry', talk: talkOf('leo', gt), t: gt });
    return cafeScene(cam, gt, { bgBlur: 4, tod: 'day' }) + layer(cam, w);
  },
  // s063: wide reveal — Maya and Sam unroll the banner between their hands, the cake comes out; Leo's accusing arm drops
  c3_reveal(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1000, y: 520, z: 1.2 }, { x: 1000, y: 530, z: 1.08 });
    const un = seg(lt, .1, 1.1, ease.out), drop = seg(lt, 1.4, 1.8, ease.outBack);
    let w = shadowAt(640, 900, 62) + fig({ x: 640, y: 900, s: 62, fc: 1, who: 'leo', pose: mixPose({ tor: 6, head: 4, ab: [6, 8], af: [100, 18], lb: [6, 0], lf: [-6, 0] }, { tor: 10, head: 14, ab: [4, 6], af: [-4, 6], lb: [6, 0], lf: [-6, 0] }, drop), expr: drop > .3 ? 'shocked' : 'angry', t: gt });
    w += seated(880, 'nora', 0, gt, { expr: 'sad', talk: talkOf('nora', gt), pose: 'sitSad' });
    w += cafeTable(1100, TB.y, 360) + cake(1100, TB.y);
    let hM = null, hS = null;
    w += shadowAt(1260, 900, 62) + fig({ x: 1260, y: 900, s: 62, fc: -1, who: 'maya', pose: 'holdBanner', expr: 'worried', t: gt, joints: j => { hM = j.armF[2]; } });
    const sx = lerp(1300, 1600, un);
    w += shadowAt(sx, 900, 62) + fig({ x: sx, y: 900, s: 62, fc: -1, who: 'sam', pose: un < 1 ? walkPose((lt * 2) % 1, .5) : 'holdBanner', expr: 'worried', t: gt, joints: j => { hS = j.armF[2]; } });
    w += banner(hM[0], hM[1], hS[0], hS[1], 24);
    for (let i = 0; i < 10; i++) { const cx = 900 + rnd(i) * 800, cy = 300 + ((lt * 60 + rnd(i * 3) * 400) % 500); w += rect(cx, cy, 10, 16, ['#ff6a8a', '#ffd23f', '#3fe0ff'][i % 3], { transform: `rotate(${f1(lt * 200 + i * 40)} ${f1(cx)} ${f1(cy)})`, opacity: .8 * un }); }
    return cafeScene(cam, gt, { tod: 'day' }) + layer(cam, w);
  },
  c3_bannerInsert(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1180, y: 680, z: 2.3 }, { x: 1200, y: 690, z: 2.45 });
    let w = cafeTable(1100, TB.y, 360) + cake(1100, TB.y) + banner(640, 540, 1760, 540, 34) + mitten(660, 560, 26, 90) + mitten(1740, 560, 26, -90);
    return cafeScene(cam, gt, { bgBlur: 6, tod: 'day' }) + layer(cam, w);
  },
  c3_oh(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.08 }, { x: 960, y: 540, z: 1.0 });
    const rub = j => mitten(j.neck[0] - j.headR * .3, j.neck[1] - j.headR * .2 + Math.sin(lt * 9) * 6, j.headR * .3, 30);
    return CU_BG(gt, 800, 430, 2.4, 10, 'day') + layer(cam, figHead(900, 500, 300, { who: 'leo', fc: 1, expr: 'sad', talk: talkOf('leo', gt), sweat: true, t: gt, pose: { tor: 4, head: 12 }, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
  },
  c3_deflate(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 640, z: 2.0 }, { x: 1150, y: 650, z: 2.12 });
    const dr = seg(lt, .2, 1.5);
    let w = cafeTable(1100, TB.y, 360) + cake(1100, TB.y, seg(lt, .4, 1.0)) + banner(1290, 600 + dr * 40, 1640, 600 + dr * 20, 30 + dr * 90);
    w += seated(880, 'nora', 0, gt, { expr: 'sad', pose: 'sitSad' });
    return cafeScene(cam, gt, { bgBlur: 5, tod: 'day' }) + layer(cam, w);
  },
  // s066: 50/50 split — left: the blue preview (Nora whispering, tight); right: the same instant wide (Nora whispering to Sam, cake, banner)
  c3_whatVsWhy(lt, d, gt) {
    const talk = Math.abs(Math.sin(lt * 9)) * .6;
    const cupH = j => mitten(j.head[0] + j.headR * .9, j.head[1] + j.headR * .45, j.headR * .32, -70, 0, false, '#9ad6ff');
    const left = futureWrap(CU_BG(gt, 1000, 450, 2.4, 12, 'day') + figHead(1060, 560, 420, { who: 'nora', fc: 1, expr: 'neutral', talk, t: gt, ghost: true, op: .8, pose: { tor: 10, head: 14, ab: [6, 8], af: [70, 120] }, extra: cupH }), 1, { t: gt, border: false });
    const rcam = { x: 1120, y: 640, z: 1.25 };
    const right = cafeScene(rcam, gt, { tod: 'day' }) + layer(rcam, seated(880, 'nora', 1, gt, { expr: 'happy', talk, pose: { tor: 15, head: 10, ab: [30, 60], af: [70, 120], lb: [88, 88], lf: [86, 86] } }) + cakeBox(1080, 884, .6 + .4 * Math.sin(lt * 4)) + cafeTable(1100, TB.y, 360) + cup(1060, TB.y, 1.1) + seated(1250, 'sam', -1, gt, { expr: 'happy', pose: { tor: 15, head: 5, ab: [30, 50], af: [40, 60], lb: [88, 88], lf: [86, 86] } }) + rolledBanner(1320, 860, .6 + .4 * Math.sin(lt * 4 + 1)));
    def('clL', `<clipPath id="clL"><rect x="0" y="0" width="958" height="1080"/></clipPath>`);
    def('clR', `<clipPath id="clR"><rect x="962" y="0" width="958" height="1080"/></clipPath>`);
    let s = `<g clip-path="url(#clL)"><g transform="translate(-480 0)">${left}</g></g><g clip-path="url(#clR)"><g transform="translate(480 0)">${right}</g></g>`;
    s += rect(956, 0, 8, H, '#0b0709');
    s += label(110, 190, 'WHAT HE SAW', 1, 44) + label(1030, 190, 'WHAT HE MISSED', 1, 44);
    return s;
  },
  // s067: over Leo's shoulder (blurred, sinking into his chair) — Nora walks away in focus; Sam lowers the banner
  c3_noraLeaves(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1100, y: 640, z: 1.45 }, { x: 1150, y: 640, z: 1.5 });
    const nx = lt < .8 ? 900 : 900 + (lt - .8) * 170;
    const up = seg(lt, d - 1.1, d - .5);
    let w = cafeTable(1100, TB.y, 360) + cake(1100, TB.y, 1) + seated(1250, 'sam', up > 0 ? 1 : -1, gt, { expr: 'sad', pose: mixPose(POSES.sit, POSES.stand, up) }) + seated(1050, 'maya', up > 0 ? 1 : 0, gt, { expr: 'sad', pose: mixPose(POSES.sit, POSES.stand, up) });
    w += lt < .8 ? seated(900, 'nora', 1, gt, { expr: 'sad', pose: mixPose(POSES.sit, POSES.stand, seg(lt, .2, .8)) }) : shadowAt(nx, 900, 62) + fig({ x: nx, y: 900, s: 62, fc: 1, who: 'nora', pose: walkPose(((lt - .8) * 1.6) % 1), expr: 'sad', t: gt });
    let s = cafeScene(cam, gt, { tod: 'dusk' }) + layer(cam, w);
    s += layer(C0, figHead(300, 760, 380, { who: 'leo', fc: 1, expr: 'none', pose: { tor: 20, head: 20 } }), { blur: 10 });
    return s;
  },
  // s068: medium on Leo; the preview shows Nora turning back — he looks down and away, the ghost glitches out, the real Nora keeps walking
  c3_ghostCallBack(lt, d, gt) {
    const cam = camMove(lt, d, { x: 980, y: 650, z: 1.5 }, { x: 1000, y: 650, z: 1.56 });
    const nx = 1450 + lt * 60;
    const away = seg(lt, 1.6, 2.1);
    let w = cafeTable(1100, TB.y, 360) + cake(1100, TB.y, 1) + seated(760, 'leo', 1, gt, { expr: 'sad', pose: mixPose(POSES.sit, POSES.sitSad, away), lookX: away > .5 ? -1 : 1, lookY: away, mouth: lt > .9 && lt < 1.5 ? 'o' : 'flat' });
    w += shadowAt(nx, 900, 62) + fig({ x: nx, y: 900, s: 62, fc: 1, who: 'nora', pose: walkPose((lt * 1.4) % 1), expr: 'sad', t: gt });
    const ga = seg(lt, .3, .7) * (1 - seg(lt, 2.0, 2.5));
    const gl = lt > 1.9 && lt < 2.5 && Math.floor(lt * 14) % 2 === 0;
    if (ga > 0) w += g(fig({ x: 800, y: 900, s: 62, fc: 1, who: 'leo', pose: mixPose(POSES.sit, { tor: -6, head: -8, ab: [20, 30], af: [100, 40], lb: [20, 10], lf: [-10, 20] }, seg(lt, .3, .7)), expr: 'determined', mouth: 'shout', talk: .7, ghost: true, op: .65 }) + fig({ x: nx - 30, y: 900, s: 62, fc: -1, who: 'nora', pose: 'wave', expr: 'happy', talk: Math.abs(Math.sin(lt * 10)) * .6, ghost: true, op: .7 }), { opacity: ga.toFixed(2), transform: `translate(${gl ? 16 : 0} 0)` });
    return cafeScene(cam, gt, { tod: 'dusk' }) + layer(cam, w);
  },
  // s069: one long pull back — Leo small and alone; dusk fades into blue hour
  c3_aloneWide(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const cam = { x: lerp(760, 960, p), y: lerp(660, 520, p), z: lerp(1.7, .8, p) };
    let w = cafeTable(TB.x, TB.y, TB.w) + cake(1050, TB.y, 1) + seated(700, 'leo', 1, gt, { expr: 'sad', pose: 'sitSad', lookY: 1 });
    return cafeScene(cam, gt, { bgBlur: 2, tod: p > .5 ? 'blue' : 'dusk' }) + layer(cam, w) + rect(0, 0, W, H, '#1a1440', { opacity: (p * .25).toFixed(2), style: 'mix-blend-mode:multiply' });
  },
});
function dodgeball(x, y, r = 34) { return circ(x, y, r, '#c0392b') + path(`M${x - r} ${y} Q${x} ${y - r * .4} ${x + r} ${y}`, 'none', { stroke: '#8e2a20', 'stroke-width': 3 }) + circ(x - r * .3, y - r * .35, r * .25, '#e57063', { opacity: .6 }); }
function cake(x, y, out = 0) {
  let s = rect(x - 60, y - 60, 120, 60, '#f4e2d0', { rx: 8 }) + rect(x - 60, y - 66, 120, 14, '#ff8fb0', { rx: 6 }) + ell(x, y, 80, 8, '#d8cfc4');
  for (const cx of [-30, 0, 30]) { s += rect(x + cx - 3, y - 92, 6, 26, '#8fd3ff'); if (!out || out < .5) s += ell(x + cx, y - 100, 5, 9, '#ffd06a') + glow(x + cx, y - 100, 30, '#ffb45c', .6); else s += path(`M${x + cx} ${y - 96} q8 -20 -4 -40 q-8 -20 6 -40`, 'none', { stroke: '#d8d0e0', 'stroke-width': 3, opacity: .5 * (1 - out * .5) }); }
  return s;
}
function benchNora(gt, expr) { return rect(1540, 820, 260, 20, '#5a3628') + rect(1550, 840, 14, 60, '#3a2520') + rect(1776, 840, 14, 60, '#3a2520') + shadowAt(1660, 900, 56) + fig({ x: 1660, y: 900, s: 56, fc: -1, who: 'nora', pose: { tor: -6, head: -4, ab: [30, 60], af: [40, 90], lb: [88, 88], lf: [86, 86] }, expr, t: gt, seed: 3 }); }
