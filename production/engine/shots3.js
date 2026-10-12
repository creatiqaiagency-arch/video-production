// ACT IV (s070–s106) — the intersection. Side view: near sidewalk y=960, near lane y=820, crosswalk x 820..1100, truck comes from the right.
const IXP = { leo: 900, nora: 800, boy0: 1380, guard: 1230, walk: 960, lane: 822 };
const IXCAM = { x: 1050, y: 690, z: 1.15 };
function hud(gt, a = 1) { return countdown(clockVal(gt), a); }
function stopSign(j) { const h = j.armF[2]; return line(h[0], h[1] + 10, h[0], h[1] - 120, '#bfbfbf', 6) + circ(h[0], h[1] - 150, 40, '#c8323a') + circ(h[0], h[1] - 150, 40, 'none', { stroke: '#fff', 'stroke-width': 4 }) + text(h[0], h[1] - 141, 'STOP', { 'font-size': 22, 'font-weight': 900, fill: '#fff', 'text-anchor': 'middle' }); }
function guardFig(gt, o = {}) { return shadowAt(o.x ?? IXP.guard, IXP.walk, 44) + fig({ x: o.x ?? IXP.guard, y: IXP.walk, s: 44, fc: o.fc ?? 1, who: 'guard', pose: o.pose || 'hold', expr: o.expr || 'neutral', t: gt, seed: 9, lookX: o.lookX ?? 0, extra: o.sign === false ? null : stopSign, ghost: o.ghost }); }
function boyFig(gt, x, y, o = {}) { return shadowAt(x, y, 30) + fig({ x, y, s: 42, child: true, fc: o.fc ?? -1, who: 'boy', pose: o.pose || runPose((gt * 2.2) % 1, .9), expr: o.expr || 'happy', t: gt, seed: 11, ghost: o.ghost, op: o.op }); }
function adult(gt, who, x, y, o = {}) { return shadowAt(x, y, 44) + fig({ x, y, s: 44, fc: o.fc ?? 1, who, pose: o.pose || 'stand', expr: o.expr || 'neutral', talk: o.talk || 0, t: gt, seed: who.length, lookX: o.lookX ?? 0, ghost: o.ghost, op: o.op, mouth: o.mouth }); }
function bystanders(gt, o = {}) { return adult(gt, 'grey', 560, IXP.walk, { fc: 1, pose: o.turn ? 'stand' : walkPose((gt * 1.4) % 1, .6), lookX: o.turn ? 1 : 0, expr: o.turn ? 'shocked' : 'neutral' }) + adult(gt, 'teal', 1560, IXP.walk, { fc: -1, pose: o.turn ? 'stepBack' : 'phone', expr: o.turn ? 'shocked' : 'neutral' }); }
function ixWorld(cam, gt, inner, o = {}) { const e = envIntersection(cam, gt, o); return e.bg + layer(cam, inner); }

Object.assign(SHOTS_REG, {
  n_walkTwoShot(lt, d, gt) {
    const x = -300 + lt * 70;
    const cam = { x: x + 60, y: 760, z: 2.0 };
    let w = adult(gt, 'nora', x + 120, IXP.walk, { pose: mixPose(walkPose((lt * 1.1) % 1, .7), POSES.armsCross, .55), expr: 'neutral', lookX: 0 });
    w += adult(gt, 'leo', x - 60, IXP.walk, { pose: walkPose((lt * 1.1 + .5) % 1, .7), expr: 'sad', lookX: lt > 1.5 && lt < 3.2 ? 1 : 0, mouth: lt > 2 && lt < 2.6 ? 'o' : 'flat' });
    return ixWorld(cam, gt, w, { bgBlur: 4 });
  },
  n_walkWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 200, y: 640, z: .95 }, { x: 260, y: 640, z: 1.0 });
    const x = -200 + (lt + 4.3) * 70;
    let w = adult(gt, 'nora', x + 120, IXP.walk, { pose: mixPose(walkPose(((lt + 4.3) * 1.1) % 1, .7), POSES.armsCross, .55) }) + adult(gt, 'leo', x - 60, IXP.walk, { pose: walkPose(((lt + 4.3) * 1.1 + .5) % 1, .7), expr: 'sad' });
    return ixWorld(cam, gt, w);
  },
  ix_establish(lt, d, gt) {
    // same road-level angle as the cold open; now Nora, the boy and the guard are there too
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.0 }, { x: 990, y: 560, z: 1.06 });
    const e = envRoadFront(cam, gt);
    const gy = kf(lt, [[0, 486], [d, 492]]), tr = rfTruck(gy);
    let w = truckFront(tr.x, gy, tr.s);
    w += shadowAt(1640, 880, 30) + fig({ x: 1640, y: 880, s: 30, fc: -1, who: 'nora', pose: 'armsCross', expr: 'none', t: gt, rim: { dx: -3, dy: -2, c: '#fff2c4' } });
    w += shadowAt(1730, 880, 30) + fig({ x: 1730, y: 880, s: 30, fc: -1, who: 'leo', pose: 'relaxed', expr: 'none', t: gt, rim: { dx: -3, dy: -2, c: '#fff2c4' } });
    w += shadowAt(1840, 940, 32) + fig({ x: 1840, y: 940, s: 32, fc: -1, who: 'guard', pose: 'hold', expr: 'none', t: gt, extra: stopSign, rim: { dx: -3, dy: -2, c: '#fff2c4' } });
    w += fig({ x: 1560, y: 860, s: 22, child: true, fc: -1, who: 'boy', pose: runPose((lt * 2) % 1, .8), expr: 'none', t: gt }) + football(1500 - lt * 20, 850, 8, lt * 200);
    return e.bg + layer(cam, w) + label(120, 170, '8:17 PM', seg(lt, .2, .8), 34);
  },
  ix_map(lt, d, gt) {
    // top-down blocking diagram (auditor edit 3)
    let s = boardBg(gt);
    s += rect(0, 380, W, 320, '#2a3446') + rect(0, 370, W, 10, '#5a6780') + rect(0, 700, W, 10, '#5a6780') + line(0, 540, W, 540, '#8a96ad', 4, { 'stroke-dasharray': '40 30' });
    for (let i = 0; i < 7; i++) s += rect(820, 395 + i * 44, 280, 24, '#8a96ad', { opacity: .55 });
    const dot = (x, y, c, lbl, a) => g(circ(x, y, 26, c, { filter: fGlow(6, c, .8) }) + text(x, y - 40, lbl, { 'font-size': 30, 'font-weight': 800, fill: '#e6eefc', 'text-anchor': 'middle' }), { opacity: a });
    s += dot(900, 760, '#d8373a', 'LEO', seg(lt, 0, .3)) + dot(790, 790, '#e3b23c', 'NORA', seg(lt, .2, .5)) + dot(1230, 770, '#ff7a1a', 'GUARD', seg(lt, .4, .7));
    const bx = lerp(1380, 1180, seg(lt, .6, d)), bb = lerp(1300, 1080, seg(lt, .6, d));
    s += dot(bx, 790, '#7ee08a', 'BOY', seg(lt, .6, .9)) + g(circ(bb, 730, 12, '#f1ece3'), { opacity: seg(lt, .6, .9) });
    const ta = seg(lt, 1.0, 1.6);
    s += g(rect(lerp(2000, 1720, ta), 590, 200, 90, '#d9d4cc', { rx: 10 }) + rect(lerp(2000, 1720, ta), 590, 50, 90, '#b5323a', { rx: 8 }) + text(lerp(2100, 1820, ta), 575, 'TRUCK', { 'font-size': 30, 'font-weight': 800, fill: '#e6eefc', 'text-anchor': 'middle' }) + line(lerp(1980, 1700, ta), 635, lerp(1600, 1300, ta), 635, '#ff8a7a', 8) + poly([[lerp(1600, 1300, ta) - 30, 635], [lerp(1600, 1300, ta), 615], [lerp(1600, 1300, ta), 655]], '#ff8a7a'), { opacity: ta });
    return s;
  },
  ix_ballRoll(lt, d, gt) {
    const cam = { x: 1120, y: 880, z: 3.0 };
    const bx = 1180 - lt * 120, by = kf(lt, [[0, 950], [.3, 930], [.6, 950], [.9, 940], [1.3, 870]]) - 10;
    let w = football(bx, by, 14, -lt * 300) + boyFig(gt, 1330 - lt * 100, IXP.walk, { expr: 'happy' });
    return ixWorld(cam, gt, w, { bgBlur: 5 });
  },
  ix_eyeRing(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .3)) * .3 };
    let s = nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 21);
    s += layer(cam, figHead(960, 600, 900, { who: 'leo', fc: 0, expr: 'shocked', blink: false, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    for (const ex of [-1, 1]) s += layer(cam, ringFx(960 + ex * 450 * .27, 555, seg(lt, .2, 1.0, ease.lin), 240));
    return s + flash(seg(lt, d - .25, d) * .8, '#bfe6ff');
  },
  // ---------- FUTURE A: the boy gets hit ----------
  fa_child(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1160, y: 790, z: 2.4 }, { x: 1110, y: 780, z: 2.5 });
    const bx = lerp(1260, 1080, seg(lt, 0, d)), by = lerp(IXP.walk, IXP.lane, seg(lt, .2, d));
    let w = football(bx - 70, by - 12, 14, -lt * 300, { ghost: true }) + boyFig(gt, bx, by, { ghost: true, op: .7 });
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt);
  },
  fa_truckWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1200, y: 690, z: 1.2 }, { x: 1150, y: 690, z: 1.3 });
    const tx = lerp(2300, 1200, ease.in2(clamp(lt / (d + .6))));
    let w = boyFig(gt, 1060, IXP.lane, { ghost: true, op: .7, pose: 'stand', expr: 'shocked', fc: 1 }) + truckSide(tx, IXP.lane + 20, .8, {}) + adult(gt, 'leo', IXP.leo, IXP.walk, { fc: 1, expr: 'shocked', ghost: true, op: .5 });
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt);
  },
  fa_driver(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1160, y: 640, z: 3.0 }, { x: 1170, y: 640, z: 3.2 });
    const [sx, sy] = shake(lt, 4);
    const w = truckSide(1050 + sx, IXP.lane + 20 + sy, .8, { driver: true, driverExpr: lt > .8 ? 'scared' : 'neutral' });
    return futureWrap(ixWorld(cam, gt, w, { bgBlur: 4 }), 1, { t: gt }) + hud(gt);
  },
  // ---------- present: Leo pushes off ----------
  p_pushOff(lt, d, gt) {
    const cam = camMove(lt, d, { x: 900, y: 800, z: 2.2 }, { x: 960, y: 800, z: 2.3 });
    const lx = IXP.leo + seg(lt, .3, d) * 70;
    let w = adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'neutral' }) + adult(gt, 'leo', lx, IXP.walk, { pose: poseAt(lt, [[0, 'stand'], [.4, 'pushOff', ease.out]]), expr: 'determined' });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + hud(gt);
  },
  // ---------- FUTURE B ----------
  fb_flicker(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1100, y: 720, z: 1.5 }, { x: 1100, y: 720, z: 1.55 });
    const gl = Math.floor(lt * 12) % 3 === 0 && lt < 1.6;
    const oldA = 1 - seg(lt, .2, 1.2), newA = seg(lt, 1.0, 2.0);
    let w = g(boyFig(gt, 1060, IXP.lane, { ghost: true, op: .7, pose: 'stand', expr: 'shocked', fc: 1 }), { opacity: oldA.toFixed(2), transform: `translate(${gl ? 14 : 0} 0)` });
    w += g(adult(gt, 'leo', lerp(IXP.leo, 1000, newA), lerp(IXP.walk, IXP.lane + 30, newA), { pose: runPose((lt * 2) % 1), expr: 'determined', ghost: true, op: .7 }), { opacity: newA.toFixed(2) });
    w += boyFig(gt, lerp(1300, 1120, seg(lt, 0, d)), lerp(IXP.walk, IXP.lane + 40, seg(lt, .5, d)), { ghost: true, op: .5 * newA });
    let s = futureWrap(ixWorld(cam, gt, w), 1, { t: gt });
    if (gl) s += rect(0, 300 + rnd(Math.floor(lt * 12)) * 400, W, 40, '#bfe6ff', { opacity: .25 });
    return s + hud(gt);
  },
  fb_grabPush(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1060, y: 760, z: 1.9 }, { x: 1100, y: 760, z: 2.0 });
    const p = seg(lt, .3, 1.4);
    const lx = lerp(1000, 1080, p), bx = lerp(1110, 1180, seg(lt, 1.0, 1.8)), by = lerp(IXP.lane + 40, IXP.walk, seg(lt, 1.0, 1.8));
    let w = boyFig(gt, bx, by, { ghost: true, op: .7, pose: lt > 1.6 ? 'stand' : 'thrown', expr: 'shocked' });
    w += adult(gt, 'leo', lx, IXP.lane + 30, { pose: poseAt(lt, [[0, runPose(.3)], [.8, 'grabKid'], [1.3, 'reach']]), expr: 'determined', ghost: true, op: .75 });
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt);
  },
  fb_leoHit(lt, d, gt) {
    // mirrors the cold open's future shot (s004) — this is the moment Leo saw at the start
    const cam = camMove(lt, d, { x: 1050, y: 640, z: 1.25 }, { x: 1010, y: 650, z: 1.42 });
    const tx = kf(lt, [[0, 2100], [d * .62, 1180, ease.out], [d, 1172]]);
    let w = adult(gt, 'leo', 1010, 780, { fc: 1, pose: 'shout', expr: 'scared', ghost: true, op: .7 }) + boyFig(gt, 1180, IXP.walk, { ghost: true, op: .5, pose: 'stand', expr: 'shocked' }) + truckSide(tx, 790, .85);
    let s = futureWrap(ixWorld(cam, gt, w), 1, { t: gt });
    const frz = seg(lt, d * .62, d * .7);
    if (frz > 0) s += rect(0, 0, W, H, '#dff2ff', { opacity: (frz * .12).toFixed(3) });
    return s + hud(gt);
  },
  // ---------- present: Leo stops ----------
  p_skid(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 800, z: 2.2 }, { x: 980, y: 800, z: 2.3 });
    const lx = IXP.leo + 70 + seg(lt, 0, .6, ease.out) * 30;
    let w = adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'worried', lookX: 1 }) + adult(gt, 'leo', lx, IXP.walk, { fc: lt > 1.5 ? -1 : 1, pose: poseAt(lt, [[0, 'pushOff'], [.5, 'skid', ease.out], [1.6, 'stand']]), expr: 'worried' });
    for (let i = 0; i < 4; i++) w += circ(lx + 30 + i * 12, IXP.walk - 6 - i * 4, 8 + i * 3, '#8a7f96', { opacity: (.4 * (1 - seg(lt, 0, 1.2))).toFixed(2) });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + hud(gt);
  },
  p_eyes2(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1.1 + lt * .03 };
    let s = nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 33);
    s += layer(cam, figHead(960, 560, 600, { who: 'leo', fc: 0, expr: 'worried', blink: false, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    for (const ex of [-1, 1]) s += layer(cam, ringFx(960 + ex * 300 * .27, 530, seg(lt, .4, 1.3, ease.lin), 200));
    return s + flash(seg(lt, d - .25, d) * .7, '#bfe6ff') + hud(gt);
  },
  // ---------- FUTURE C: Nora runs in ----------
  fc_noraRuns(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1000, y: 760, z: 1.8 }, { x: 1040, y: 760, z: 1.9 });
    const nx = lerp(IXP.nora + 60, 1080, seg(lt, .2, d)), ny = lerp(IXP.walk, IXP.lane + 20, seg(lt, .8, d));
    let w = boyFig(gt, lerp(1180, 1110, seg(lt, 0, d)), lerp(IXP.walk, IXP.lane + 40, seg(lt, .4, d)), { ghost: true, op: .6 }) + adult(gt, 'nora', nx, ny, { pose: runPose((lt * 2.2) % 1), expr: 'scared', ghost: true, op: .75 });
    let s = futureWrap(ixWorld(cam, gt, w), 1, { t: gt });
    s += layer({ x: 960, y: 540, z: 1 }, fig({ x: 300, y: 1800, s: 220, fc: 1, who: 'leo', pose: 'stand', expr: 'none', rim: { dx: 10, dy: -10, c: '#9fd0ff' } }), { blur: 9 });
    return s + hud(gt);
  },
  fc_noraDanger(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1250, y: 700, z: 1.2 }, { x: 1200, y: 700, z: 1.3 });
    const tx = lerp(2200, 1400, ease.in2(clamp(lt / (d + .3))));
    let w = adult(gt, 'nora', 1080, IXP.lane + 20, { pose: 'grabKid', expr: 'scared', ghost: true, op: .75, fc: 1 }) + boyFig(gt, 1130, IXP.lane + 40, { ghost: true, op: .6, pose: 'stand', expr: 'shocked', fc: 1 }) + truckSide(tx, IXP.lane + 20, .8);
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt);
  },
  p_no(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .25)) * .2 };
    let s = nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 41);
    s += layer(cam, figHead(960, 520, 420, { who: 'leo', fc: 0, expr: 'scared', mouth: talkOf('leo', gt) > .1 ? 'shout' : 'wobble', t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    return s + hud(gt);
  },
  triptych(lt, d, gt) {
    let s = rect(0, 0, W, H, '#05091a');
    const panels = [['A', 'the boy'], ['B', 'Leo'], ['C', 'Nora']];
    panels.forEach(([k, who], i) => {
      const a = seg(lt, i * .45, i * .45 + .4, ease.out);
      const px = 120 + i * 580, pw = 520;
      const cam = { x: 1080, y: 720, z: 1.6 };
      let w = truckSide(1200, IXP.lane + 20, .8);
      if (i === 0) w += boyFig(gt, 1080, IXP.lane, { ghost: true, op: .7, pose: 'stand', expr: 'shocked', fc: 1 });
      if (i === 1) w += adult(gt, 'leo', 1080, IXP.lane + 20, { pose: 'shout', expr: 'scared', ghost: true, op: .75 });
      if (i === 2) w += adult(gt, 'nora', 1080, IXP.lane + 20, { pose: 'grabKid', expr: 'scared', ghost: true, op: .75 });
      const id = 'tp' + i; def(id, `<clipPath id="${id}"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>`);
      const inner = futureWrap(ixWorld(cam, gt, w), 1, { t: gt, border: false });
      s += g(`<g transform="translate(${px} 280) scale(${(pw / W).toFixed(4)})">${inner}</g>` + rect(px, 280, pw, pw * 9 / 16, 'none', { stroke: '#8fd3ff', 'stroke-width': 4, rx: 10, filter: fGlow(6, '#2f7bff', 1) }) + text(px + 30, 340, k, { 'font-size': 52, 'font-weight': 900, fill: '#d8f0ff' }) + text(px + pw / 2, 280 + pw * 9 / 16 + 70, `hits ${who}`, { 'font-size': 38, 'font-weight': 700, fill: '#d8f0ff', 'text-anchor': 'middle' }), { opacity: a, transform: `translate(0 ${f1((1 - a) * 40)})` });
    });
    return s + hud(gt);
  },
  clockCU(lt, d, gt) {
    const pulse = 1 + Math.max(0, Math.sin(lt * 7)) * .04;
    let s = nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 51) + rect(0, 0, W, H, '#05091a', { opacity: .5 });
    s += g(countdown(clockVal(gt), 1, 960 - 60, 560), { transform: `translate(960 540) scale(${(2.6 * pulse).toFixed(3)}) translate(-960 -540)` });
    return s;
  },
  p_decide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.05 }, { x: 960, y: 540, z: 1.15 });
    let s = nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 61);
    s += layer(cam, figHead(960, 520, 420, { who: 'leo', fc: 0, expr: lt < d * .55 ? 'closed' : 'determined', t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    return s + hud(gt);
  },
  // ---------- the real solution ----------
  p_breath(lt, d, gt) {
    // slowed present, from behind Leo: everyone is still where they were
    const cam = camMove(lt, d, { x: 1000, y: 760, z: 1.6 }, { x: 1020, y: 760, z: 1.7 });
    let w = adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'worried', lookX: 1 }) + guardFig(gt, { lookX: 1 }) + boyFig(gt, 1150, IXP.walk, { pose: runPose(.2, .8) }) + football(1080, 900, 14, 30) + truckSide(2200, IXP.lane + 20, .8);
    let s = ixWorld(cam, gt, w);
    s += layer({ x: 960, y: 540, z: 1 }, fig({ x: 520, y: 1850, s: 230, fc: 1, who: 'leo', pose: 'skid', expr: 'none', rim: { dx: 10, dy: -10, c: '#ffd29a' } }), { blur: 8 });
    return s + rect(0, 0, W, H, '#2f7bff', { opacity: .06, style: SCREEN }) + hud(gt);
  },
  p_turnToNora(lt, d, gt) {
    const cam = camMove(lt, d, { x: 860, y: 780, z: 2.2 }, { x: 860, y: 780, z: 2.35 });
    const tn = seg(lt, .8, 1.4);
    let w = adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'worried', lookX: .5 }) + adult(gt, 'leo', IXP.leo + 40, IXP.walk, { fc: tn > .5 ? -1 : 1, pose: 'stand', expr: 'determined' });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + hud(gt);
  },
  p_shout1(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .2)) * .12 };
    let s = nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 71);
    s += layer(cam, figHead(1000, 500, 360, { who: 'leo', fc: -1, expr: 'determined', talk: talkOf('leo', gt), mouth: 'shout', t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
    return s + hud(gt);
  },
  p_noraTurns(lt, d, gt) {
    const cam = camMove(lt, d, { x: 980, y: 780, z: 2.0 }, { x: 1040, y: 780, z: 2.1 });
    const nx = IXP.nora + seg(lt, .4, d) * 220;
    let w = adult(gt, 'nora', nx, IXP.walk, { pose: lt < .4 ? 'stand' : runPose((lt * 2.2) % 1, .8), expr: 'determined' }) + boyFig(gt, 1150, IXP.walk, { pose: runPose(.2, .8) }) + guardFig(gt, { fc: -1, lookX: 1 });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + hud(gt);
  },
  p_shout2(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1000, y: 720, z: 1.25 }, { x: 1000, y: 720, z: 1.3 });
    let w = bystanders(gt, { turn: lt > .5 }) + adult(gt, 'leo', IXP.leo, IXP.walk, { fc: 1, pose: 'shout', expr: 'determined', talk: talkOf('leo', gt), mouth: 'shout' }) + adult(gt, 'nora', 1060, IXP.walk, { pose: 'reach', expr: 'determined' }) + guardFig(gt, { fc: -1, pose: 'reach', sign: false }) + boyFig(gt, 1140, IXP.walk - 10, { pose: 'stand', expr: 'shocked', fc: -1 });
    return ixWorld(cam, gt, w) + hud(gt);
  },
  p_guardReach(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1120, y: 800, z: 2.4 }, { x: 1100, y: 800, z: 2.5 });
    const pb = seg(lt, .3, 1.4);
    let w = adult(gt, 'nora', lerp(1060, 990, pb), IXP.walk, { pose: 'pullBack', expr: 'determined', fc: 1 }) + guardFig(gt, { x: lerp(1230, 1250, pb), fc: -1, pose: 'pullBack', sign: false, expr: 'determined' }) + boyFig(gt, lerp(1140, 1110, pb), IXP.walk, { pose: 'stand', expr: 'shocked', fc: 1 });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + hud(gt);
  },
  p_stepBack(lt, d, gt) {
    const cam = { x: 920, y: 900, z: 3.2 };
    const lx = IXP.leo - seg(lt, .1, .9) * 70;
    let w = adult(gt, 'leo', lx, IXP.walk, { fc: 1, pose: poseAt(lt, [[0, 'stand'], [.5, 'stepBack'], [1.2, 'stand']]), expr: 'determined' });
    let s = ixWorld(cam, gt, w, { bgBlur: 3 });
    s += rect(0, 0, W, H, '#fff2c4', { opacity: (seg(lt, 0, d) * .2).toFixed(2), style: SCREEN });
    return s + hud(gt);
  },
  p_truckThrough(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1000, y: 690, z: 1.05 }, { x: 900, y: 690, z: 1.05 });
    const [sx, sy] = shake(lt, 6);
    const tx = lerp(2200, 300, seg(lt, 0, d + .3, ease.lin));
    let w = '';
    for (let i = 0; i < 2; i++) w += line(tx + 120, IXP.lane + 12 + i * 20, 2400, IXP.lane + 12 + i * 20, '#0d0a10', 10, { opacity: .7 });
    w += adult(gt, 'leo', IXP.leo - 70, IXP.walk, { fc: 1, expr: 'shocked' }) + adult(gt, 'nora', 990, IXP.walk + 10, { pose: 'hold', expr: 'scared', fc: 1 }) + boyFig(gt, 1030, IXP.walk + 10, { pose: 'stand', expr: 'shocked', fc: 1 }) + guardFig(gt, { x: 1170, fc: -1, pose: 'stepBack', sign: false, expr: 'shocked' }) + bystanders(gt, { turn: true });
    w += `<g transform="rotate(-4 ${f1(tx)} ${IXP.lane})">${truckSide(tx + sx, IXP.lane + 20 + sy, .8)}</g>`;
    for (let i = 0; i < 8; i++) w += circ(tx + 200 + i * 50, IXP.lane + 10 - rnd(i) * 40, 20 + i * 6, '#9a90a8', { opacity: (.25 - i * .025).toFixed(2) });
    return ixWorld({ ...cam, x: cam.x + sx * .5 }, gt, w) + hud(gt);
  },
  p_crash(lt, d, gt) {
    const cam = camMove(lt, d, { x: -150, y: 620, z: 1.7 }, { x: -170, y: 620, z: 1.9 });
    const hit = .4, p = seg(lt, 0, hit, ease.lin);
    const [sx, sy] = lt > hit ? shake(lt, 14 * (1 - seg(lt, hit, hit + 1.2))) : [0, 0];
    const tx = lerp(240, -60, p);
    let w = `<g transform="rotate(${f1(-8 - (lt > hit ? 4 : 0))} ${f1(tx)} 640)">${truckSide(tx, 650, .8)}</g>`;
    if (lt > hit) { const q = seg(lt, hit, d, ease.out); for (let i = 0; i < 14; i++) { const a = (-170 + rnd(i) * 160) * R, r = q * (120 + rnd(i * 3) * 260); w += poly([[0, 0], [14, -6], [6, 16]].map(k => [-80 + Math.cos(a) * r + k[0], 600 + Math.sin(a) * r + q * q * 200 * rnd(i) + k[1]]), i % 3 ? '#c9c2b8' : '#c13a3a', { opacity: (1 - q * .6).toFixed(2) }); } w += glow(-80, 600, 260 * (1 - seg(lt, hit, hit + .5)), '#ffd6a0', .8); }
    let s = ixWorld({ ...cam, x: cam.x + sx, y: cam.y + sy }, gt, w);
    s += flash((lt > hit ? 1 - seg(lt, hit, hit + .25) : 0) * .6, '#fff2c4');
    return s + hud(gt);
  },
  p_ballStops(lt, d, gt) {
    const cam = { x: 1000, y: 900, z: 3.4 };
    const bx = kf(lt, [[0, 1180], [d * .7, 1050, ease.out]]);
    let w = football(bx, 865, 14, bx * 1.5);
    let s = ixWorld(cam, gt, w, { bgBlur: 6 });
    s += layer({ x: 960, y: 540, z: 1 }, glow(200, 380, 300, '#ff9a3c', .25 * (Math.sin(lt * 6) > 0 ? 1 : .3)));
    return s;
  },
  // ---------- ending ----------
  e_twoShot(lt, d, gt) {
    const cam = camMove(lt, d, { x: 900, y: 790, z: 2.3 }, { x: 900, y: 790, z: 2.4 });
    let w = adult(gt, 'nora', 960, IXP.walk, { fc: -1, pose: 'hold', expr: 'worried', talk: talkOf('nora', gt) }) + adult(gt, 'leo', 840, IXP.walk, { fc: 1, expr: 'neutral', lookX: -.3 }) + boyFig(gt, 1060, IXP.walk, { pose: 'stand', expr: 'neutral', fc: -1 });
    let s = ixWorld(cam, gt, w, { bgBlur: 5 });
    s += rect(0, 0, W, H, '#ff9a3c', { opacity: (Math.sin(lt * 6) > 0 ? .06 : 0), style: SCREEN });
    return s;
  },
  e_leoYeah(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.05 });
    return nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 81) + layer(cam, figHead(880, 500, 320, { who: 'leo', fc: 1, expr: 'neutral', talk: talkOf('leo', gt), t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
  },
  e_noraAsk(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.05 });
    return nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 91) + layer(cam, figHead(1040, 500, 320, { who: 'nora', fc: -1, expr: 'neutral', talk: talkOf('nora', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  e_ghostFade(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    let s = nightBokehBg({ x: 960, y: 540, z: 1 }, gt, 81);
    const ga = seg(lt, .2, .8) * (1 - seg(lt, 1.6, d));
    s += layer(cam, g(figHead(1280, 470, 280, { who: 'leo', fc: -1, expr: 'neutral', ghost: true, op: .55 }), { opacity: ga.toFixed(2), transform: `translate(0 ${f1(-30 * seg(lt, 1.6, d))})` }));
    s += layer(cam, figHead(820, 500, 320, { who: 'leo', fc: 1, expr: lt > 1.2 ? 'closed' : 'neutral', lookX: .8, t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    return s;
  },
  e_final(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const cam = { x: 900, y: lerp(790, 740, p), z: lerp(2.4, 1.7, p) };
    let w = adult(gt, 'nora', 960, IXP.walk, { fc: -1, pose: 'hold', expr: lt > 1.4 ? 'happy' : 'neutral', mouth: lt > 1.4 ? 'smile' : 'flat' }) + adult(gt, 'leo', 840, IXP.walk, { fc: 1, expr: 'neutral', talk: talkOf('leo', gt), mouth: 'smile' });
    return ixWorld(cam, gt, w, { bgBlur: 4 }) + fadeBlack(seg(lt, d - 1.0, d));
  },
  black(lt, d, gt) { return rect(0, 0, W, H, '#000'); },
});
