// ACT IV (s070–s106) — V2. Side view: near sidewalk ground y=960, curb edge y=860, near lane y=822 (truck wheels ~842), crosswalk x 820..1100, truck comes from the RIGHT.
// Fixed blocking along the curb (left→right): Nora 800, Leo 900, crosswalk, boy ~1150 (steps into the lane), guard 1420 (faces traffic).
// V3 blocking: Leo (left) — Nora — boy (in the near lane) — guard (far side). Nora is always the one closest to the boy.
const IXP = { leo: 740, nora: 1000, boy: 1150, guard: 1420, walk: 960, lane: 780, road: 800, gutter: 858 };
// draw items sorted by their ground y (further = smaller y first)
const zs = (...items) => items.filter(Boolean).sort((a, b) => a[0] - b[0]).map(i => i[1]).join('');
function hud(gt, a = 1) { return countdown(clockVal(gt), a); }
function stopSign(j) { const h = j.armF[2]; return line(h[0], h[1] + 10, h[0], h[1] - 120, '#bfbfbf', 6) + circ(h[0], h[1] - 150, 40, '#c8323a') + circ(h[0], h[1] - 150, 40, 'none', { stroke: '#fff', 'stroke-width': 4 }) + text(h[0], h[1] - 141, 'STOP', { 'font-size': 22, 'font-weight': 900, fill: '#fff', 'text-anchor': 'middle' }); }
function guardFig(gt, o = {}) { const x = o.x ?? IXP.guard, y = o.y ?? IXP.walk; return shadowAt(x, y, 44) + fig({ x, y, s: 44, fc: o.fc ?? 1, who: 'guard', pose: o.pose || 'hold', expr: o.expr || 'neutral', t: gt, seed: 9, lookX: o.lookX ?? 0, extra: o.sign === false ? null : stopSign, ghost: o.ghost, joints: o.joints }); }
function boyFig(gt, x, y, o = {}) { return shadowAt(x, y, 30) + fig({ x, y, s: 42, child: true, fc: o.fc ?? -1, who: 'boy', pose: o.pose || runPose((x / 140) % 1, .9), expr: o.expr || 'happy', t: gt, seed: 11, ghost: o.ghost, op: o.op, joints: o.joints }); }
function adult(gt, who, x, y, o = {}) { return shadowAt(x, y, 44) + fig({ x, y, s: 44, fc: o.fc ?? 1, who, pose: o.pose || 'stand', expr: o.expr || 'neutral', talk: o.talk || 0, t: gt, seed: who.length, lookX: o.lookX ?? 0, lookY: o.lookY ?? 0, ghost: o.ghost, op: o.op, mouth: o.mouth, blur: o.blur, extra: o.extra, joints: o.joints }); }
function bystanders(gt, o = {}) { return adult(gt, 'grey', 520, IXP.walk, { fc: 1, pose: o.turn ? 'stepBack' : walkPose((gt * 1.4) % 1, .6), lookX: o.turn ? 1 : 0, expr: o.turn ? 'shocked' : 'neutral' }) + adult(gt, 'teal', 1640, IXP.walk + 10, { fc: -1, pose: o.turn ? 'stepBack' : 'phone', expr: o.turn ? 'shocked' : 'neutral' }); }
function ixWorld(cam, gt, inner, o = {}) { const e = envIntersection(cam, gt, o); return e.bg + layer(cam, inner); }
// the truck in the present, approaching from the right (x by clock)
function presentTruck(gt) { const v = clockVal(gt); const tx = 1180 + v * 260; return truckSide(tx, IXP.lane + 20, .8); }

Object.assign(SHOTS_REG, {
  // s070: walking home — a visible gap between them; Nora arms crossed, facing forward; Leo glances, opens his mouth, gives up
  n_walkTwoShot(lt, d, gt) {
    const x = -300 + lt * 70;
    const cam = { x: x + 70, y: 760, z: 2.0 };
    const cross = { tor: 4, head: 2, ab: [-15, 105], af: [-10, 100] };
    let w = adult(gt, 'nora', x + 170, IXP.walk, { pose: mixPose(walkPose((lt * 1.1) % 1, .6), cross, .6), expr: 'neutral' });
    const glance = lt > 1.2 && lt < 3.4;
    w += adult(gt, 'leo', x - 60, IXP.walk, { pose: walkPose((lt * 1.1 + .5) % 1, .6), expr: 'sad', lookX: glance ? 1 : 0, mouth: lt > 2.0 && lt < 2.7 ? 'o' : 'flat' });
    return ixWorld(cam, gt, w, { bgBlur: 4, clock: '8:16' });
  },
  n_walkWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 200, y: 640, z: .95 }, { x: 260, y: 640, z: 1.0 });
    const x = -200 + (lt + 4.3) * 70;
    const cross = { tor: 4, head: 2, ab: [-15, 105], af: [-10, 100] };
    let w = adult(gt, 'nora', x + 170, IXP.walk, { pose: mixPose(walkPose(((lt + 4.3) * 1.1) % 1, .6), cross, .6) }) + adult(gt, 'leo', x - 60, IXP.walk, { pose: walkPose(((lt + 4.3) * 1.1 + .5) % 1, .6), expr: 'sad' });
    return ixWorld(cam, gt, w, { clock: '8:16' });
  },
  ix_establish(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1000, y: 580, z: 1.05 }, { x: 1030, y: 580, z: 1.1 });
    const e = envRoadFront(cam, gt);
    const gy = kf(lt, [[0, 486], [d, 492]]), tr = rfTruck(gy);
    return e.bg + layer(cam, truckFront(tr.x, gy, tr.s) + rfPeople(gt, { boyRoad: false })) + label(120, 175, '8:17 PM', seg(lt, .2, .8), 36);
  },
  // s073: top-down blocking map — all labels pop in within 0.8 s, big; the truck arrow slides in
  ix_map(lt, d, gt) {
    let s = boardBg(gt);
    s += rect(0, 380, W, 320, '#2a3446') + rect(0, 370, W, 10, '#5a6780') + rect(0, 700, W, 10, '#5a6780') + line(0, 540, W, 540, '#8a96ad', 4, { 'stroke-dasharray': '40 30' });
    for (let i = 0; i < 7; i++) s += rect(820, 395 + i * 44, 280, 24, '#8a96ad', { opacity: .55 });
    const dot = (x, y, c, lbl, a) => g(circ(x, y, 34, c, { filter: fGlow(6, c, .8) }) + text(x, y + 88, lbl, { 'font-size': 46, 'font-weight': 900, fill: '#e6eefc', 'text-anchor': 'middle' }), { opacity: a, transform: `translate(${x} ${y}) scale(${(.6 + .4 * a).toFixed(2)}) translate(${-x} ${-y})` });
    s += dot(930, 780, '#e3b23c', 'NORA', seg(lt, 0, .25, ease.outBack)) + dot(760, 780, '#d8373a', 'LEO', seg(lt, .15, .4, ease.outBack)) + dot(1440, 780, '#ff7a1a', 'GUARD', seg(lt, .45, .7, ease.outBack));
    const bx = lerp(1220, 1150, seg(lt, .8, d)), bb = lerp(1150, 1060, seg(lt, .8, d));
    s += dot(bx, lerp(780, 650, seg(lt, .8, d)), '#7ee08a', 'BOY', seg(lt, .3, .55, ease.outBack)) + g(circ(bb, lerp(760, 620, seg(lt, .8, d)), 14, '#f1ece3'), { opacity: seg(lt, .3, .55) });
    const ta = seg(lt, .7, 1.4, ease.out);
    const tx = lerp(2050, 1650, ta);
    s += g(rect(tx, 580, 220, 100, '#d9d4cc', { rx: 10 }) + rect(tx, 580, 56, 100, '#b5323a', { rx: 8 }) + text(tx + 110, 560, 'TRUCK', { 'font-size': 44, 'font-weight': 900, fill: '#e6eefc', 'text-anchor': 'middle' }) + line(tx - 20, 630, tx - 340, 630, '#ff8a7a', 10) + poly([[tx - 370, 630], [tx - 336, 606], [tx - 336, 654]], '#ff8a7a'), { opacity: ta });
    return s;
  },
  ix_ballRoll(lt, d, gt) {
    const cam = { x: 1150, y: 860, z: 2.6 };
    const h = hop(lt, .45, 60, 5, .55), gy = lerp(IXP.walk, IXP.road, seg(lt, .2, 1.2, ease.inOut));
    const bx = 1200 - lt * 90, boyX = 1420 - lt * 160, boyY = lerp(IXP.walk, IXP.road + 16, seg(lt, .5, d, ease.inOut));
    let w = shadowAt(bx, gy, 14) + football(bx, gy - 14 - h.y, 14, -bx * 4, { sq: h.sq }) + boyFig(gt, boyX, boyY, { expr: 'happy', pose: { ...runPose((lt * 2.4) % 1, 1), tor: 26 } });
    return ixWorld(cam, gt, w, { bgBlur: 5 });
  },
  ix_eyeRing(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .3)) * .3 };
    let s = nightBokehBg(C0, gt, 21, { x: 1300 });
    s += layer(cam, figHead(960, 600, 900, { who: 'leo', fc: 0, expr: 'shocked', blink: false, still: true, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    for (const ex of [-1, 1]) s += layer(cam, ringFx(960 + ex * 450 * .27, 555, seg(lt, .15, .95, ease.lin), 240));
    return s + flashPulse(lt, d - .03, .05, .5, '#7fc0ff');
  },
  // ---------- FUTURE A: the boy gets hit (everyone present, only the boy is the ghost) ----------
  fa_child(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 790, z: 2.3 }, { x: 1110, y: 780, z: 2.45 });
    const bx = lerp(1250, 1120, seg(lt, 0, d)), by = lerp(IXP.walk, IXP.road, seg(lt, .2, d));
    let w = adult(gt, 'leo', IXP.leo, IXP.walk, { expr: 'neutral' }) + football(bx - 70, by - 12, 14, -bx * 1.6, { ghost: true }) + boyFig(gt, bx, by, { ghost: true, op: .75 });
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt) + flashPulse(lt, 0, .1, .5);
  },
  fa_truckWide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1200, y: 700, z: 1.2 }, { x: 1150, y: 700, z: 1.3 });
    const tx = lerp(2300, 1280, ease.in2(clamp(lt / (d + .6))));
    let w = truckSide(tx, IXP.lane + 20, .8) + adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross' }) + adult(gt, 'leo', IXP.leo, IXP.walk) + guardFig(gt, { pose: 'wave', sign: false }) + boyFig(gt, 1100, IXP.road, { ghost: true, op: .75, pose: 'stand', expr: 'shocked', fc: 1 });
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt);
  },
  // s078: the driver, big — eyes wide, arms locked on the wheel, can't stop in time
  fa_driver(lt, d, gt) {
    const [sx, sy] = shake(lt, 5);
    let w = rect(0, 0, W, H, '#1b151d') + rect(220, 120, 1500, 700, '#2c3850', { rx: 30 }) + rect(220, 120, 1500, 700, 'none', { stroke: '#b5323a', 'stroke-width': 40, rx: 30 });
    w += layer(C0, glow(1500, 500, 500, '#fff2c4', .4) + glow(300, 600, 300, '#ffb45c', .3), { blur: 4 });
    const lean = seg(lt, .3, .8, ease.out);
    w += figHead(980 + sx, 520 + sy + lean * 20, 300, { who: 'driver', fc: 0, expr: 'scared', mouth: 'shout', ghost: true, op: .85, t: gt, pose: { tor: -15 * lean, head: -10 * lean, ab: [70, 20], af: [70, 20] }, rim: { dx: 0, dy: -10, c: '#fff2c4' } });
    w += circ(980 + sx, 1060 + sy, 300, 'none', { stroke: '#0e0a10', 'stroke-width': 40 });
    return futureWrap(w, 1, { t: gt }) + hud(gt);
  },
  // ---------- present: Leo pushes off (anticipation crouch → launch into a run) ----------
  p_pushOff(lt, d, gt) {
    const cam = camMove(lt, d, { x: 900, y: 800, z: 2.0 }, { x: 960, y: 790, z: 2.05 });
    const run = seg(lt, .35, d, ease.in2);
    const lx = IXP.leo + run * 110, ly = lerp(IXP.walk, IXP.gutter, seg(lt, .6, d));
    const pose = lt < .35 ? mixPose(POSES.stand, POSES.crouch, seg(lt, 0, .3)) : runPose((lt * 2.4) % 1);
    let w = presentTruck(gt) + boyFig(gt, IXP.boy, IXP.road, { pose: 'reach', expr: 'neutral', mouth: 'o', fc: 1 }) + football(IXP.boy + 110 + lt * 12, IXP.road - 12, 14, lt * 60) + zs([IXP.walk, adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'neutral' })], [ly, adult(gt, 'leo', lx, ly, { pose, expr: 'determined' })]);
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + headlightWash(gt) + hud(gt);
  },
  // ---------- FUTURE B ----------
  fb_flicker(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1100, y: 720, z: 1.5 }, { x: 1100, y: 720, z: 1.56 });
    const gl = Math.floor(lt * 12) % 3 === 0 && lt < 1.6;
    const oldA = 1 - seg(lt, .2, 1.2), newA = seg(lt, 1.0, 2.0);
    let w = adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross' });
    w += g(boyFig(gt, 1100, IXP.road, { ghost: true, op: .7, pose: 'stand', expr: 'shocked', fc: 1 }), { opacity: oldA.toFixed(2), transform: `translate(${gl ? 14 : 0} 0)` });
    w += g(adult(gt, 'leo', lerp(IXP.leo, 1040, newA), lerp(IXP.walk, IXP.road + 20, newA), { pose: runPose((lt * 2) % 1), expr: 'determined', ghost: true, op: .75 }), { opacity: newA.toFixed(2) });
    w += g(boyFig(gt, 1150, IXP.road, { ghost: true, op: .6, pose: 'stand' }), { opacity: newA.toFixed(2) });
    let s = futureWrap(ixWorld(cam, gt, w), 1, { t: gt });
    if (gl) s += rect(0, 300 + rnd(Math.floor(lt * 12)) * 400, W, 40, '#bfe6ff', { opacity: .25 });
    return s + hud(gt);
  },
  fb_grabPush(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1080, y: 780, z: 1.9 }, { x: 1110, y: 780, z: 2.0 });
    const p = seg(lt, .2, 1.2);
    const lx = lerp(1040, 1110, p), bx = lerp(1150, 1200, seg(lt, 1.0, 1.7)), by = lerp(IXP.road, IXP.walk, seg(lt, 1.0, 1.7));
    let w = adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'shocked' });
    w += boyFig(gt, bx, by, { ghost: true, op: .7, pose: lt > 1.6 ? 'stand' : 'thrown', expr: 'shocked', fc: -1 });
    w += adult(gt, 'leo', lx, IXP.road + 20, { pose: poseAt(lt, [[0, runPose(.3)], [.8, 'grabKid'], [1.3, 'reach']]), expr: 'determined', ghost: true, op: .75 });
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt);
  },
  // s082: the cold-open image again — now we know what it is
  fb_leoHit(lt, d, gt) { return futureBHit(lt, d, gt) + hud(gt); },
  // ---------- present: Leo stops — front foot in the gutter, lean back, dust, pivot ----------
  p_skid(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 800, z: 2.0 }, { x: 970, y: 800, z: 2.1 });
    const lx = IXP.leo + 100 + seg(lt, 0, .5, ease.out) * 30, ly = IXP.gutter;
    const pose = poseAt(lt, [[0, runPose(.25)], [.35, 'skid', ease.out], [1.0, 'skid'], [1.5, 'stand']]);
    let w = presentTruck(gt) + boyFig(gt, IXP.boy + 10, IXP.road, { pose: 'stand', expr: 'happy', fc: -1 }) + adult(gt, 'leo', lx, ly, { fc: 1, pose, expr: 'worried' }) + adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'worried', lookX: -1 });
    for (let i = 0; i < 5; i++) w += circ(lx + 30 + i * 14, ly - 6 - i * 5, 8 + i * 4 + seg(lt, 0, 1) * 10, '#8a7f96', { opacity: (.45 * (1 - seg(lt, .1, 1.3))).toFixed(2) });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + headlightWash(gt) + hud(gt);
  },
  p_eyes2(lt, d, gt) {
    const z = 1.0 + ease.outExpo(clamp(lt / .3)) * .6;
    const cam = { x: 960, y: 540, z };
    let s = nightBokehBg(C0, gt, 33, { x: 1300 });
    s += layer(cam, figHead(960, 560, 600, { who: 'leo', fc: 0, expr: 'worried', blink: false, still: true, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    for (const ex of [-1, 1]) s += layer(cam, ringFx(960 + ex * 300 * .27, 530, seg(lt, .1, .9, ease.lin), 220));
    return s + headlightWash(gt, .6) + flashPulse(lt, d - .03, .05, .5, '#7fc0ff') + hud(gt);
  },
  // ---------- FUTURE C: Nora runs in (Leo, real, darkened in the foreground) ----------
  fc_noraRuns(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1020, y: 770, z: 1.8 }, { x: 1060, y: 770, z: 1.9 });
    const nx = lerp(IXP.nora, 1110, seg(lt, .2, d)), ny = lerp(IXP.walk, IXP.road + 20, seg(lt, .8, d));
    let w = boyFig(gt, IXP.boy, IXP.road, { ghost: true, op: .6, pose: 'stand' }) + adult(gt, 'nora', nx, ny, { pose: runPose((lt * 2.2) % 1), expr: 'scared', ghost: true, op: .8 });
    w += layer(cam, '');
    const inner = ixWorld(cam, gt, w) + layer(C0, fig({ x: 300, y: 1800, s: 220, fc: 1, who: 'leo', pose: 'stand', expr: 'none', rim: { dx: 10, dy: -10, c: '#9fd0ff' } }), { blur: 9 });
    return futureWrap(inner, 1, { t: gt }) + hud(gt);
  },
  fc_noraDanger(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1250, y: 700, z: 1.2 }, { x: 1200, y: 700, z: 1.3 });
    const tx = lerp(2200, 1420, ease.in2(clamp(lt / (d + .3))));
    let w = truckSide(tx, IXP.lane + 20, .8) + adult(gt, 'leo', IXP.leo + 130, IXP.gutter, { pose: 'stand', expr: 'shocked' }) + boyFig(gt, IXP.boy, IXP.road, { ghost: true, op: .6, pose: 'stand', expr: 'shocked', fc: 1 }) + adult(gt, 'nora', IXP.boy - 50, IXP.road + 10, { pose: 'grabKid', expr: 'scared', ghost: true, op: .8, fc: 1 });
    return futureWrap(ixWorld(cam, gt, w), 1, { t: gt }) + hud(gt);
  },
  p_no(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .25)) * .2 };
    let s = nightBokehBg(C0, gt, 41, { x: 1200 });
    s += layer(cam, figHead(680, 560, 460, { who: 'leo', fc: 1, expr: 'scared', mouth: 'shout', talk: Math.max(talkOf('leo', gt), lt < .9 ? .8 : 0), t: gt, pose: { tor: -8, head: -10 }, rim: { dx: -10, dy: -10, c: '#ffd29a' } }));
    s += rect(0, 0, W, H, lgrad([[0, '#2f7bff', 0], [1, '#2f7bff', .22]], 0, 0, 1, 0), { style: SCREEN });
    return dutch(s + headlightWash(gt, .7), 8) + hud(gt);
  },
  // s088: three large panels A/B/C, each a frozen impact frame, big labels, red X stamps in turn
  triptych(lt, d, gt) {
    let s = nightBokehBg(C0, gt, 55, { x: 1100 }) + rect(0, 0, W, H, '#05091a', { opacity: .7 });
    const panels = [['A', 'THE BOY'], ['B', 'LEO'], ['C', 'NORA']];
    const pw = 560, ph = 720, top = 80, k = 1.05;
    panels.forEach(([kk, who], i) => {
      const a = seg(lt, i * .25, i * .25 + .3, ease.out);
      const px = 60 + i * (pw + 50);
      const cam = { x: 1100, y: 700, z: 1.7 };
      let w = truckSide(1200, IXP.lane + 20, .8);
      if (i === 0) w += boyFig(gt, 1100, IXP.road, { ghost: true, op: .8, pose: 'stand', expr: 'shocked', fc: 1 });
      if (i === 1) w += adult(gt, 'leo', 1100, IXP.road + 20, { pose: 'shout', expr: 'scared', ghost: true, op: .8 });
      if (i === 2) w += adult(gt, 'nora', 1100, IXP.road + 20, { pose: 'grabKid', expr: 'scared', ghost: true, op: .8 });
      const inner = futureWrap(ixWorld(cam, gt, w), 1, { t: gt, border: false });
      def('tpc' + i, `<clipPath id="tpc${i}"><rect x="${px}" y="${top}" width="${pw}" height="${ph}" rx="10"/></clipPath>`);
      const xs = seg(lt, 1.3 + i * .55, 1.6 + i * .55, ease.outBack);
      s += g(`<g clip-path="url(#tpc${i})"><g transform="translate(${f1(px + pw / 2 - 960 * k)} ${f1(top + ph / 2 - 560 * k)}) scale(${k})">${inner}</g></g>` + rect(px, top, pw, ph, 'none', { stroke: '#8fd3ff', 'stroke-width': 5, rx: 10, filter: fGlow(6, '#2f7bff', 1) }) + text(px + 24, top + 62, kk, { 'font-size': 60, 'font-weight': 900, fill: '#d8f0ff' }) + text(px + pw / 2, top + ph + 70, who, { 'font-size': 54, 'font-weight': 900, fill: CREAM, 'text-anchor': 'middle', filter: fGlow(10, '#ff9a3c', .8) })
        + (xs > 0 ? g(line(px + 60, top + 40, px + pw - 60, top + ph - 40, '#ff4a3a', 18) + line(px + pw - 60, top + 40, px + 60, top + ph - 40, '#ff4a3a', 18), { opacity: (.85 * Math.min(1, xs)).toFixed(2), transform: `translate(${px + pw / 2} ${top + ph / 2}) scale(${(.6 + .4 * xs).toFixed(2)}) translate(${-(px + pw / 2)} ${-(top + ph / 2)})` }) : ''), { opacity: a, transform: `translate(0 ${f1((1 - a) * 40)})` });
    });
    return s + hud(gt);
  },
  // s089: extreme close-up of the stopwatch, heartbeat pulses
  clockCU(lt, d, gt) {
    const beat = Math.max(0, Math.sin(lt * 7.5)) ** 4;
    let s = nightBokehBg(C0, gt, 51, { x: 1000 }) + rect(0, 0, W, H, '#05091a', { opacity: .55 });
    const v = clockVal(gt), c = v < 1 ? '#ff8a6a' : CREAM;
    s += g(stopwatch(960, 560, 230, (5 - v) % 1, c), { transform: `translate(960 560) scale(${(1 + beat * .04).toFixed(3)}) translate(-960 -560)`, filter: fGlow(14, '#ff9a3c', .8) });
    s += text(960, 930, `${v.toFixed(1)} s`, { 'font-size': 90, 'font-weight': 900, fill: c, 'text-anchor': 'middle', filter: fGlow(14, '#ff9a3c', .9) });
    return s + rect(0, 0, W, H, '#ff3a2a', { opacity: (beat * .08).toFixed(3), style: SCREEN });
  },
  p_decide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.05 }, { x: 960, y: 540, z: 1.18 });
    let s = nightBokehBg(C0, gt, 61, { x: 1100 });
    s += layer(cam, figHead(640, 440, 440, { who: 'leo', fc: 1, expr: lt < d * .55 ? 'closed' : 'determined', lookX: 1, t: gt, rim: { dx: 12, dy: -6, c: '#eaf2ff' } }));
    return s + headlightWash(gt, .6) + hud(gt);
  },
  // ---------- the real solution ----------
  // s091: upright over-the-shoulder from behind Leo (blurred). The boy is a step into the lane, the guard is waving at traffic further down.
  p_breath(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 760, z: 1.55 }, { x: 1160, y: 760, z: 1.62 });
    let w = presentTruck(gt) + football(IXP.boy + 125, IXP.road - 12, 14, 30) + boyFig(gt, IXP.boy, IXP.road, { pose: 'reach', fc: 1 }) + adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'worried', lookX: 1 }) + guardFig(gt, { fc: 1, pose: 'wave', sign: false, lookX: 1 });
    let s = ixWorld(cam, gt, w);
    s += layer(C0, figHead(380, 820, 420, { who: 'leo', fc: 0, expr: 'none', rim: { dx: 10, dy: -10, c: '#eaf2ff' } }), { blur: 9 });
    return s + headlightWash(gt) + rect(0, 0, W, H, '#2f7bff', { opacity: .05, style: SCREEN }) + hud(gt);
  },
  // s092: over Nora's shoulder — Leo turns from the road toward her (head first, then body)
  p_turnToNora(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.05 });
    let s = nightBokehBg(C0, gt, 63, { x: 1200 });
    const tn = seg(lt, .4, 1.0);
    s += layer(cam, figHead(1060, 480, 300, { who: 'leo', fc: tn > .6 ? -1 : 1, expr: 'determined', lookX: tn > .6 ? -1 : 1, t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
    s += layer(C0, figHead(330, 640, 420, { who: 'nora', fc: 1, expr: 'none' }), { blur: 10 });
    return s + headlightWash(gt, .6) + hud(gt);
  },
  p_shout1(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .2)) * .12 };
    let s = nightBokehBg(C0, gt, 71, { x: 900 });
    const cupH = j => mitten(j.head[0] - j.headR * .75, j.head[1] + j.headR * .45, j.headR * .3, 60);
    s += layer(cam, figHead(1000, 500, 360, { who: 'leo', fc: -1, expr: 'determined', talk: talkOf('leo', gt), mouth: 'shout', t: gt, pose: { tor: 10, head: -6 }, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
    return s + headlightWash(gt, .6) + hud(gt);
  },
  // s093b: Nora's eyes meet Leo's — a tiny nod
  p_noraNod(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.05 }, { x: 960, y: 540, z: 1.12 });
    let s = nightBokehBg(C0, gt, 75, { x: 1000 });
    const nod = Math.sin(seg(lt, .35, .8) * Math.PI) * 14;
    s += layer(cam, figHead(940, 500, 320, { who: 'nora', fc: 1, expr: 'determined', t: gt, pose: { tor: 0, head: nod }, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    return s + headlightWash(gt, .6) + hud(gt);
  },
  p_noraTurns(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 820, z: 1.9 }, { x: 1010, y: 820, z: 2.0 });
    const nx = IXP.nora + seg(lt, .2, d) * 100, ny = lerp(IXP.walk, IXP.walk - 50, seg(lt, .5, d));
    let w = presentTruck(gt) + boyFig(gt, IXP.boy, IXP.road, { pose: 'stand', fc: -1 }) + adult(gt, 'leo', IXP.leo + 130, IXP.gutter, { fc: 1, pose: 'point', expr: 'determined' }) + adult(gt, 'nora', nx, ny, { pose: runPose((lt * 2.4) % 1, .8), expr: 'determined' }) + guardFig(gt, { fc: 1, pose: 'wave', sign: false });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + headlightWash(gt) + hud(gt);
  },
  p_shout2(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1060, y: 730, z: 1.3 }, { x: 1060, y: 730, z: 1.36 });
    const turn = lt > .4;
    let w = presentTruck(gt) + boyFig(gt, IXP.boy, IXP.road, { pose: 'stand', expr: 'shocked', fc: 1 }) + bystanders(gt, { turn });
    const np = seg(lt, 0, d * .8, ease.out), ny = lerp(IXP.walk - 50, IXP.road + 12, np), gp = seg(lt, .5, d, ease.out), gy = lerp(IXP.walk, IXP.road + 12, gp);
    w += zs([IXP.gutter, adult(gt, 'leo', IXP.leo + 130, IXP.gutter, { fc: 1, pose: 'point', expr: 'determined', talk: talkOf('leo', gt), mouth: 'shout' })],
      [ny, adult(gt, 'nora', lerp(1030, 1085, np), ny, { pose: np < 1 ? runPose((lt * 2.4) % 1, .8) : 'reach', expr: 'determined' })],
      [gy, guardFig(gt, { x: lerp(1420, 1225, gp), y: gy, fc: -1, pose: turn ? runPose((lt * 2) % 1, .7) : 'wave', sign: false, expr: 'shocked' })]);
    return ixWorld(cam, gt, w) + headlightWash(gt) + hud(gt);
  },
  // s096: Nora and the guard grab the boy by the shoulders and haul him back up over the curb
  p_guardReach(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 830, z: 2.3 }, { x: 1120, y: 840, z: 2.4 });
    const pb = seg(lt, .4, 1.5, ease.inOut);
    const by = lerp(IXP.road, IXP.walk, pb), bx = IXP.boy, hop = Math.sin(pb * Math.PI) * 26;
    const ay = lerp(IXP.road + 14, IXP.walk + 12, pb), haul = { tor: -8, head: -4, ab: [55, 35], af: [62, 25], lb: [-14, 6], lf: [18, 10] };
    let w = presentTruck(gt);
    w += boyFig(gt, bx, by - hop, { pose: { tor: -10, head: -6, ab: [60, 30], af: [50, 30], lb: [10 + hop * .6, 30], lf: [-20, 40] }, expr: 'shocked', fc: 1 });
    w += adult(gt, 'nora', bx - 62, ay, { fc: 1, pose: lt < .4 ? 'reach' : haul, expr: 'determined' });
    w += guardFig(gt, { x: bx + 62, y: ay, fc: -1, pose: lt < .4 ? 'reach' : haul, sign: false, expr: 'determined' });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + headlightWash(gt) + hud(gt);
  },
  // s096b: low road-level — the truck's grille and headlights filling frame, flare
  p_grille(lt, d, gt) {
    const [sx, sy] = shake(lt, 6);
    let s = rect(0, 0, W, H, '#0d0a18') + layer({ x: 960 + sx, y: 540 + sy, z: 1 + lt * .25 }, truckFront(960, 1180, 2.3));
    return s + rect(0, 0, W, H, '#fff6dc', { opacity: (.04 + lt / d * .22).toFixed(2), style: SCREEN }) + hud(gt);
  },
  // s097: low insert at curb height: Leo's sneaker steps back up onto the curb
  p_stepBack(lt, d, gt) {
    const cam = { x: IXP.leo + 110, y: 935, z: 4.6 };
    const st = seg(lt, .1, .7, ease.inOut);
    const lx = lerp(IXP.leo + 130, IXP.leo + 60, st), ly = lerp(IXP.gutter, IXP.walk, st);
    let w = adult(gt, 'leo', lx, ly, { fc: 1, pose: poseAt(lt, [[0, 'stand'], [.35, 'stepBack'], [.8, 'stand']]), expr: 'determined' });
    return ixWorld(cam, gt, w, { bgBlur: 3 }) + headlightWash(gt, 1.2) + hud(gt);
  },
  // s098: the truck skids through the crossing, BEHIND everyone, who are safe on the sidewalk and flinch back
  p_truckThrough(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1000, y: 720, z: 1.08 }, { x: 900, y: 720, z: 1.08 });
    const [sx, sy] = shake(lt, 6);
    const tx = lerp(1300, 150, seg(lt, 0, d + .2, ease.lin));
    let w = '';
    for (let i = 0; i < 2; i++) w += line(tx + 120, IXP.lane + 12 + i * 20, 2400, IXP.lane + 12 + i * 20, '#0d0a10', 10, { opacity: .7 });
    w += `<g transform="rotate(-4 ${f1(tx)} ${IXP.lane})">${truckSide(tx + sx, IXP.lane + 20 + sy, .8)}</g>`;
    for (let i = 0; i < 8; i++) w += circ(tx + 200 + i * 50, IXP.lane + 10 - rnd(i) * 40, 20 + i * 6, '#9a90a8', { opacity: (.25 - i * .025).toFixed(2) });
    const fl = seg(lt, .2, .6, ease.out);
    const flinch = { tor: -18 * fl, head: -10 * fl, ab: [lerp(6, 120, fl), 40], af: [lerp(-6, 130, fl), 40], lb: [6, 0], lf: [-6, 0] };
    w += adult(gt, 'leo', IXP.leo + 60, IXP.walk + 40, { fc: 1, pose: flinch, expr: 'shocked' }) + adult(gt, 'nora', IXP.boy - 62, IXP.walk + 50, { pose: flinch, expr: 'scared', fc: 1 }) + boyFig(gt, IXP.boy, IXP.walk + 55, { pose: 'stand', expr: 'shocked', fc: 1 }) + guardFig(gt, { x: IXP.boy + 62, y: IXP.walk + 45, fc: -1, pose: flinch, sign: false, expr: 'shocked' }) + bystanders(gt, { turn: true });
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
    s += flashPulse(lt, hit + .03, .12, .6, '#fff2c4');
    return s + hud(gt);
  },
  // s099b: Leo lets out the breath he was holding
  p_exhale(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.08 }, { x: 960, y: 550, z: 1.0 });
    let s = nightBokehBg(C0, gt, 85, { x: 900, hazard: 'left' });
    s += layer(cam, figHead(960, 500, 340, { who: 'leo', fc: 0, expr: lt < .5 ? 'shocked' : 'closed', mouth: lt > .5 ? 'o' : 'flat', t: gt, pose: { tor: 6 * seg(lt, .5, 1), head: 10 * seg(lt, .5, 1.1) }, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    return s;
  },
  p_ballStops(lt, d, gt) {
    const cam = { x: 1000, y: 900, z: 3.4 };
    const bx = kf(lt, [[0, 1180], [d * .7, 1050, ease.out]]);
    let s = ixWorld(cam, gt, football(bx, 865, 14, bx * 4.1), { bgBlur: 6 });
    s += layer(C0, glow(200, 380, 300, '#ffb000', .25 * (Math.sin(gt * 2 * Math.PI * 1.2) > 0 ? 1 : .3)));
    return s;
  },
  // ---------- ending ----------
  e_twoShot(lt, d, gt) {
    const cam = camMove(lt, d, { x: 910, y: 790, z: 2.6 }, { x: 910, y: 790, z: 2.7 });
    let w = adult(gt, 'leo', 860, IXP.walk, { fc: 1, expr: 'neutral', lookX: -.3 }) + adult(gt, 'nora', 960, IXP.walk, { fc: -1, pose: 'hold', expr: 'worried', talk: talkOf('nora', gt) }) + boyFig(gt, 1080, IXP.walk, { pose: seg(lt, 0, .7) > .8 ? 'hold' : 'reach', expr: 'neutral', fc: 1 }) + football(lerp(1140, 1112, seg(lt, 0, .7, ease.inOut)), IXP.walk - lerp(110, 80, seg(lt, 0, .7, ease.inOut)), 14, 0) + guardFig(gt, { x: 1170, fc: -1, sign: false, pose: lt < .6 ? 'reach' : 'stand' });
    let s = ixWorld(cam, gt, w, { bgBlur: 5 });
    s += rect(0, 0, W, H, '#ffb000', { opacity: (Math.sin(gt * 2 * Math.PI * 1.2) > 0 ? .08 : 0), style: SCREEN });
    return s;
  },
  e_leoYeah(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    return nightBokehBg(C0, gt, 81, { x: 900, hazard: 'left' }) + layer(cam, figHead(880, 500, 320, { who: 'leo', fc: 1, expr: 'neutral', talk: talkOf('leo', gt), t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
  },
  e_noraAsk(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    return nightBokehBg(C0, gt, 91, { x: 1000, hazard: 'left' }) + layer(cam, figHead(1040, 500, 320, { who: 'nora', fc: -1, expr: 'neutral', talk: talkOf('nora', gt), t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  // s104: the blue ring starts to form on his pupils — he closes his eyes and lets it dissolve
  e_ghostFade(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1.1 }, { x: 960, y: 540, z: 1.25 });
    let s = nightBokehBg(C0, gt, 81, { x: 900, hazard: 'left' });
    const closed = lt > d * .55;
    s += layer(cam, figHead(960, 560, 620, { who: 'leo', fc: 0, expr: closed ? 'closed' : 'neutral', blink: false, still: true, t: gt, rim: { dx: 0, dy: -10, c: '#ffd29a' } }));
    const r = seg(lt, .2, d * .5) * (1 - seg(lt, d * .55, d * .75));
    if (r > 0) for (const ex of [-1, 1]) s += layer(cam, circ(960 + ex * 310 * .27, 529, 30 + r * 30, 'none', { stroke: '#8fd3ff', 'stroke-width': 5, opacity: (r * .9).toFixed(2), filter: fGlow(6, '#2f7bff', 1) }));
    return s;
  },
  e_final(lt, d, gt) {
    const cam = camMove(lt, d, { x: 910, y: 780, z: 2.5 }, { x: 910, y: 780, z: 2.6 });
    let w = adult(gt, 'leo', 860, IXP.walk, { fc: 1, expr: 'neutral', talk: talkOf('leo', gt), mouth: 'smile' }) + adult(gt, 'nora', 960, IXP.walk, { fc: -1, pose: 'hold', expr: 'neutral' });
    return ixWorld(cam, gt, w, { bgBlur: 4 }) + rect(0, 0, W, H, '#ffb000', { opacity: (Math.sin(gt * 2 * Math.PI * 1.2) > 0 ? .06 : 0), style: SCREEN });
  },
  e_noraSmile(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.06 });
    const sm = seg(lt, .2, .6);
    return nightBokehBg(C0, gt, 93, { x: 1000, hazard: 'left' }) + layer(cam, figHead(1040, 500, 320, { who: 'nora', fc: -1, expr: sm > .5 ? 'happy' : 'neutral', mouth: sm > .5 ? 'smile' : 'flat', t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
  },
  // s105c: pull back: Leo and Nora shoulder to shoulder, the boy holding his ball by the guard, the crashed truck's hazards blinking far left
  e_pullBack(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const cam = { x: lerp(920, 500, p), y: lerp(790, 650, p), z: lerp(2.4, .95, p) };
    let w = `<g transform="rotate(-12 -60 640)">${truckSide(-60, 650, .8, { lights: false })}</g>` + glow(-120, 560, 160, '#ffb000', Math.sin(gt * 2 * Math.PI * 1.2) > 0 ? .7 : .1);
    w += adult(gt, 'leo', 890, IXP.walk, { fc: 1, expr: 'happy', mouth: 'smile', lookX: 1 }) + adult(gt, 'nora', 950, IXP.walk, { fc: -1, expr: 'happy', mouth: 'smile', lookX: -1 }) + boyFig(gt, 1180, IXP.walk, { pose: 'hold', expr: 'happy', fc: -1 }) + football(1205, IXP.walk - 80, 14, 0) + guardFig(gt, { x: 1260, fc: -1, sign: false });
    return ixWorld(cam, gt, w) + fadeBlack(seg(lt, d - 1.0, d));
  },
  black(lt, d, gt) { return rect(0, 0, W, H, '#000'); },
});
Object.assign(SHOTS_REG, {
  // s082b: the real Leo gasps — he just saw himself get hit
  p_gasp(lt, d, gt) {
    let s = nightBokehBg(C0, gt, 37, { x: 1250 });
    s += layer({ x: 960, y: 540, z: 1 + ease.outExpo(clamp(lt / .12)) * .25 }, figHead(960, 700, 1500, { who: 'leo', fc: 0, expr: 'scared', blink: false, still: true, t: gt, rim: { dx: 0, dy: -12, c: '#ffd29a' } })) + rect(0, 0, W, 330, '#000') + rect(0, 760, W, 330, '#000');
    return s + headlightWash(gt, .5) + hud(gt);
  },
});
