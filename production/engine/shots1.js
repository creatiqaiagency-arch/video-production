// COLD OPEN + ACT I (s001–s031) — V2
const C0 = { x: 960, y: 540, z: 1 };
// road-front perspective helpers (vanishing point 960,480)
const rfTruck = (gy) => ({ x: 960 + 0.62 * (gy - 480), s: 0.0028 * (gy - 480) });
function bokeh(seed, n, box, cols = ['#ffb45c', '#ff8a5c', '#9fb6ff'], a = .35) {
  const [x0, y0, w, h] = box; let s = '';
  for (let i = 0; i < n; i++) { const c = cols[i % cols.length]; s += circ(x0 + rnd(seed + i) * w, y0 + rnd(seed + i * 2) * h, 20 + rnd(seed + i * 3) * 60, c, { opacity: a * (.4 + rnd(i * 7) * .6), style: SCREEN }); }
  return s;
}
// close-up background = the real intersection plate, heavily defocused (recognisable location, motivated lights)
function nightBokehBg(cam, t, seed = 3, o = {}) {
  const x = o.x ?? (600 + rnd(seed) * 900);
  const e = envIntersection({ x, y: 560, z: 2.0 }, t, { bgBlur: 14, midBlur: 14 });
  let s = e.bg + layer(C0, bokeh(seed, 16, [-100, 100, 2100, 700], ['#ffb45c', '#ff8a5c', '#fff2c4'], .3), { blur: 6 });
  if (o.hazard) { const on = Math.sin(t * 2 * Math.PI * 1.2) > 0; s += glow(o.hazard === 'left' ? -60 : W + 60, 600, 700, '#ffb000', on ? .35 : .06); }
  return s;
}
function kitchenBg(cam, t, blur = 3) { return envKitchen(cam, t, { bgBlur: blur }).bg; }
// the present at the crossing, road-level view looking toward the oncoming truck (nearest→furthest: Leo, Nora, boy, guard)
function rfPeople(gt, o = {}) {
  const rim = { dx: -3, dy: -2, c: '#fff2c4' };
  let w = '';
  w += shadowAt(1650, 832, 26) + fig({ x: 1650, y: 832, s: 26, fc: -1, who: 'guard', pose: 'wave', expr: 'none', t: gt, rim });
  if (o.boyRoad) w += fig({ x: 1520, y: 866, s: 22, child: true, fc: -1, who: 'boy', pose: runPose((gt * 2) % 1, .8), expr: 'none', t: gt, rim }) + football(1450, 860, 8, gt * 300);
  else w += fig({ x: 1610, y: 864, s: 22, child: true, fc: -1, who: 'boy', pose: 'stand', expr: 'none', t: gt, rim }) + football(1580, 862, 8, 0);
  w += shadowAt(1730, 890, 32) + fig({ x: 1730, y: 890, s: 32, fc: -1, who: 'nora', pose: o.noraPose || 'armsCross', expr: 'none', t: gt, rim });
  w += shadowAt(1840, 928, 37) + fig({ x: 1840, y: 928, s: 37, fc: -1, who: 'leo', pose: o.leoPose || 'stand', expr: 'none', t: gt, rim });
  return w;
}
// the shot Leo sees in the cold open AND in the climax (Future B): ghost Leo in the lane, ghost boy safe on the sidewalk
function futureBHit(lt, d, gt) {
  const cam = camMove(lt, d, { x: 1110, y: 700, z: 1.55 }, { x: 1100, y: 710, z: 1.75 });
  const tx = kf(lt, [[0, 2050], [d * .62, 1100, ease.out], [d, 1088]]);
  let w = truckSide(tx, IXP.lane + 22, .8);
  const rec = seg(lt, d * .3, d * .6, ease.out), fl = { tor: -16, head: -10, ab: [120, 40], af: [130, 40], lb: [6, 0], lf: [-6, 0] };
  w += adult(gt, 'nora', IXP.nora, IXP.walk, { pose: mixPose(POSES.armsCross, fl, rec), expr: 'shocked' }) + guardFig(gt, { x: 1330, fc: -1, pose: mixPose(POSES.wave, fl, rec), sign: false, expr: 'shocked' });
  w += boyFig(gt, 1200, IXP.walk, { ghost: true, op: .65, pose: 'stand', expr: 'shocked', fc: -1 });
  for (let i = 0; i < 4; i++) w += line(tx + 300 + i * 40, IXP.lane - 10 - i * 34, tx + 700 + i * 60, IXP.lane - 10 - i * 34, '#cfe8ff', 4, { opacity: (.35 * (1 - rec * .5)).toFixed(2) });
  for (let i = 0; i < 5; i++) w += circ(tx + 160 + i * 40, IXP.lane + 10 - rnd(i + 3) * 20, 14 + i * 7, '#9a90a8', { opacity: .22 });
  w += adult(gt, 'leo', 1075, IXP.lane + 10, { fc: 1, pose: mixPose(runPose(.3, .5), { tor: -22, head: -28, ab: [95, 125], af: [80, 130], lb: [-20, 35], lf: [35, 45], drop: .3 }, rec), expr: 'scared', ghost: true, op: .8 });
  return futureWrap(ixWorld(cam, gt, w), 1, { t: gt });
}

Object.assign(SHOTS_REG, {
  // s001: knee-level tracking shot — the football bounces off the curb into the lane (squash & stretch), the boy's legs sprint in after it
  co_wide(lt, d, gt) {
    const bx = lerp(1330, 1215, seg(lt, 0, 1.4, ease.out)), gy = lerp(IXP.walk, IXP.road, seg(lt, 0, .9, ease.inOut));
    const h = hop(lt, .42, 70, 5, .55), rot = -lt * 420;
    const kx = lerp(1500, 1180, seg(lt, .15, d, ease.out)), ky = lerp(IXP.walk + 4, IXP.road + 14, seg(lt, .45, d, ease.inOut)), run = seg(lt, .15, d * .85);
    const boyPose = run < 1 ? { ...runPose((lt * 2.6) % 1, 1.1), tor: 30 } : 'scoop';
    const cam = { x: lerp(1330, 1230, seg(lt, 0, d, ease.sine)), y: lerp(890, 790, seg(lt, 0, d, ease.inOut)), z: 2.7, r: lerp(-3, -1, seg(lt, 0, d)) };
    let w = shadowAt(bx, gy, 14 * (1 - h.y / 120)) + football(bx, gy - 14 - h.y, 14, rot, { sq: h.sq }) + boyFig(gt, kx, ky, { pose: boyPose, expr: 'happy', fc: -1 });
    return ixWorld(cam, gt, w, { bgBlur: 4, clock: '8:17' }) + headlightWash(gt, .3) + label(120, 175, '8:17 PM', seg(lt, .1, .6), 36);
  },
  // s002: wide master — the geography in one frame: Leo & Nora on the curb, the boy scooping his ball in the near lane, the guard, and headlights sweeping in from the right
  co_truckFront(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 690, z: 1.0 }, { x: 1150, y: 700, z: 1.08 });
    const tx = lerp(2300, 1720, seg(lt, 0, d, ease.in2));
    const turn = seg(lt, .35, .6, ease.settle), crouch = seg(lt, d - .55, d, ease.inOut);
    let w = truckSide(tx, IXP.lane + 20, .8);
    w += football(IXP.boy + 70, IXP.road - 12, 14, 0) + boyFig(gt, IXP.boy, IXP.road, { pose: 'scoop', expr: 'happy', fc: 1 });
    w += guardFig(gt, { fc: -1, pose: 'hold', sign: false, lookX: -1 });
    w += adult(gt, 'nora', IXP.nora, IXP.walk, { pose: 'armsCross', expr: 'neutral', lookX: -.6 });
    w += adult(gt, 'leo', IXP.leo, IXP.walk, { fc: 1, pose: mixPose(POSES.stand, POSES.crouch, crouch * .7), expr: turn > .5 ? 'shocked' : 'neutral', lookX: turn > .5 ? 1 : -.5 });
    return ixWorld(cam, gt, w, { clock: '8:17' }) + headlightWash(gt, .5 + lt / d) + label(120, 175, '8:17 PM', 1, 36);
  },
  // s002b: low Dutch-angle push on the grille — the driver isn't braking
  co_grille(lt, d, gt) {
    const [sx, sy] = shake(lt, 4 + lt * 6);
    let s = rect(0, 0, W, H, '#0d0a18') + layer({ x: 960 + sx, y: 640 + sy, z: 1.0 + lt * .3, r: 0 }, truckFront(960, 1080, 1.55)) + streaks(960, 300, 900, 30, Math.PI, '#fff2c4', .15);
    s += rect(0, 0, W, H, '#fff6dc', { opacity: (.02 + lt / d * .12).toFixed(2), style: SCREEN });
    return dutch(s, -9);
  },
  // s003: extreme close-up eyes, crash zoom, headlight glints, blue ring, short flash pulse
  co_eyes(lt, d, gt) {
    const z = 1 + ease.outExpo(clamp(lt / .25)) * .35;
    const cam = { x: 960, y: 540, z };
    const hx = 960, hy = 650, s = 1150;
    let inner = nightBokehBg(C0, gt, 5, { x: 1500 });
    inner += figHead(hx, hy, s, { who: 'leo', fc: 0, expr: 'shocked', t: gt, blink: false, still: true, rim: { dx: 0, dy: -12, c: '#eaf2ff' } });
    for (const ex of [-1, 1]) inner += circ(hx + ex * s * .5 * .27 + 22, hy - s * .5 * .1 - 26, 14, '#fff', { opacity: .95 }) + circ(hx + ex * s * .5 * .27 - 14, hy - s * .5 * .1 + 10, 6, '#fff', { opacity: .7 });
    let o = layer(cam, inner);
    const p = seg(lt, .45, 1.15, ease.lin);
    for (const ex of [-1, 1]) o += layer(cam, ringFx(hx + ex * s * .5 * .27, hy - s * .5 * .1, p, 260));
    return o + flashPulse(lt, d - .03, .05, .5, '#7fc0ff');
  },
  // s004: FUTURE — the exact composition reused in the climax (s082)
  co_future(lt, d, gt) { return futureBHit(lt, d, gt) + flashPulse(lt, 0, .12, .7); },
  // s005: the future shatters back to the present — the same wide master as s002, a few seconds earlier
  co_rewind(lt, d, gt) {
    const present = SHOTS_REG.co_truckFront(Math.min(lt * .4, 1.2), 1.5, gt);
    if (lt > .7) return present;
    const frozen = futureBHit(2.9, 3, gt);
    return present + shards(frozen, seg(lt, 0, .7, ease.lin)) + flashPulse(lt, 0, .12, .7);
  },
  // s006: Leo close-up at the crossing; blue fading from his eyes; headlights sweep twice
  co_leoFace(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1100, y: 500, z: 1 }, { x: 1180, y: 470, z: 1.18 });
    let s = nightBokehBg(C0, gt, 9, { x: 1400 });
    s += layer(cam, figHead(1240, 440, 360, { who: 'leo', fc: -1, expr: lt < d * .5 ? 'scared' : 'determined', lookX: -.6, t: gt, rim: { dx: 10, dy: -6, c: '#ffd29a' } }));
    for (const k of [0, 1]) { const sw = kf(lt, [[k * d * .5, -500], [k * d * .5 + d * .45, 2400]], ease.lin); s += rect(sw - 300, 0, 600, H, lgrad([[0, '#fff2c4', 0], [.5, '#fff2c4', .16], [1, '#fff2c4', 0]], 0, 0, 1, 0), { style: SCREEN }); }
    const eg = 1 - seg(lt, 0, 1.6);
    if (eg > 0) for (const ex of [-1, 1]) s += layer(cam, glow(1240 - 180 * .34 + ex * 180 * .27 * .82, 425, 80, '#2f7bff', .9 * eg));
    return s;
  },
  // s007: title over close headlight bokeh (a different plate from the street)
  co_title(lt, d, gt) {
    let s = rect(0, 0, W, H, '#0d0a18') + layer(C0, truckFront(960, 1350, 2.6), { blur: 22 }) + layer(C0, bokeh(17, 24, [0, 0, 1920, 1080], ['#fff2c4', '#ffb45c', '#9fb6ff'], .25), { blur: 10 });
    s += rect(0, 0, W, H, '#0b0712', { opacity: .45 });
    return s + titleCard(Math.max(lt / d, .12 + lt / d * .88), 'WHAT IF YOU COULD SEE', '5 SECONDS INTO THE FUTURE?', 'A STICKMAN WHAT-IF');
  },
  // s008: camera rises over the lit city at night; THREE DAYS EARLIER; dip to black
  co_aerial(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const cam = { x: 960 + p * 160, y: lerp(980, 520, p), z: lerp(1.25, .95, p) };
    let s = envAerial(cam, gt, { blur: lerp(2, 0, p) });
    s += caption(seg(lt, .2, d, ease.lin), 'THREE DAYS EARLIER', 560, 70);
    return s + fadeBlack(seg(lt, d - .35, d));
  },

  // ---------------- KITCHEN (morning) ----------------
  k_establish(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 520, z: 1.0 }, { x: 990, y: 540, z: 1.08 });
    const e = envKitchen(cam, gt);
    const spoon = Math.max(0, Math.sin(lt * 3.2));
    return e.bg + e.light + layer(cam, leoAtTable(gt, { spoon }) + tableK() + bowl(1040, 680) + glass(GLX(), 680, 1.25));
  },
  k_ghostGlass(lt, d, gt) {
    const cam = { x: 1230, y: 690, z: 1.85 };
    const e = envKitchen(cam, gt, { bgBlur: 4 });
    const fp = seg(lt, .5, 2.1, ease.lin);
    const gx = kf(fp, [[0, GLX()], [.25, 1305], [.45, 1368], [1, 1392]]), gy = kf(fp, [[0, 680], [.45, 680], [1, 905, ease.in2]]), grot = kf(fp, [[0, 0], [.25, 25], [.45, 45], [1, 130]]);
    const ghost = fp < 1 ? `<g transform="rotate(${f1(grot)} ${f1(gx)} ${f1(gy)})">${glass(gx, gy, 1.25, { ghost: true })}</g>` : '';
    const look = kf(lt, [[0, -.6], [1.5, -.6], [1.7, 1], [1.9, -.2], [2.1, 1]]);
    let s = e.bg + e.light + layer(cam, leoAtTable(gt, { spoon: .2, look, expr: lt > 1.6 ? 'shocked' : 'neutral' }) + tableK() + bowl(1040, 680) + glass(GLX(), 680, 1.25) + ghost);
    s += glowE(W * .62, H * .55, 300, 260, '#2f7bff', .14 * seg(lt, .4, .8));
    return s;
  },
  k_ghostShatter(lt, d, gt) {
    const cam = { x: 1390, y: 880, z: 3.2 };
    const e = envKitchen(cam, gt, { bgBlur: 9 });
    const sp = seg(lt, .08, .8, ease.out);
    let w = '';
    for (let i = 0; i < 14; i++) { const a = (-175 + i * 12.5) * R, r = sp * (40 + rnd(i) * 70); w += poly([[0, 0], [9, -4], [4, 11]].map(q => [1392 + Math.cos(a) * r + q[0], 898 + Math.sin(a) * r * .7 + sp * sp * 20 * rnd(i * 3) + q[1]]), '#bfe6ff', { opacity: (1 - seg(lt, .7, d)).toFixed(2), filter: fGhost(2), class: 'gh' }); }
    w += ell(1392, 902, 80 * sp, 10 * sp, '#7fc8ff', { opacity: (.5 * (1 - seg(lt, .6, d))).toFixed(2), filter: fGhost(3) });
    return e.bg + e.light + layer(cam, w) + flashPulse(lt, .08, .1, .45, '#bfe6ff');
  },
  k_leoDoubleTake(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 560, z: 2.5 }, { x: 1150, y: 560, z: 2.6 });
    const e = envKitchen(cam, gt, { bgBlur: 7 });
    const look = kf(lt, [[0, 1], [.5, 1], [.7, -1]]);
    return e.bg + e.light + layer(cam, leoAtTable(gt, { spoon: .1, look, lookY: lt < .5 ? 1 : 0, expr: 'shocked' }) + tableK() + bowl(1040, 680) + glass(GLX(), 680, 1.25));
  },
  k_glassCU(lt, d, gt) {
    const cam = camMove(lt, d, { x: GLX() - 10, y: 640, z: 3.2 }, { x: GLX() - 5, y: 640, z: 3.4 });
    const e = envKitchen(cam, gt, { bgBlur: 6 });
    return e.bg + e.light + layer(cam, tableK() + glass(GLX(), 680, 1.25, { fill: .6 }) + ell(GLX(), 680 - 62 * 1.25 * .6, 18 + Math.sin(lt * 6) * 1.5, 2, '#dff4ff', { opacity: .6 }) + glow(GLX() + 10, 600, 80, '#fff1d6', .45));
  },
  k_leoConfused(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 560, z: 2.4 }, { x: 1150, y: 560, z: 2.55 });
    const e = envKitchen(cam, gt, { bgBlur: 7 });
    const sh = seg(lt, .2, .6, ease.outBack);
    return e.bg + e.light + layer(cam, leoAtTable(gt, { shrug: sh, look: .8, expr: 'worried', talk: talkOf('leo', gt) }) + tableK() + glass(GLX(), 680, 1.25));
  },
  k_elbow(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1250, y: 660, z: 2.4 }, { x: 1270, y: 670, z: 2.55 });
    const e = envKitchen(cam, gt, { bgBlur: 6 });
    const el = kf(lt, [[0, 0], [.35, -.12], [1.0, 1, ease.in2]]);
    const tc = 1.0, u = Math.max(0, lt - tc);
    const gx = GLX() + Math.min(u, .35) * 420 + Math.max(0, u - .35) * 40, gy = 680 + (u > .35 ? .5 * 2200 * (u - .35) ** 2 : 0), rot = u > 0 ? Math.min(30 + u * 260, 200) : 0;
    return e.bg + e.light + layer(cam, leoAtTable(gt, { reach: 1, elbow: el, look: -1 }) + tableK() + bowl(1040, 680) + `<g transform="rotate(${f1(rot)} ${f1(gx + 15)} ${f1(gy)})">${glass(gx, gy, 1.25)}</g>`);
  },
  k_catch(lt, d, gt) {
    const cam = { x: 1380, y: 820, z: 2.6 };
    const e = envKitchen(cam, gt, { bgBlur: 8 });
    const gy = kf(lt, [[0, 770], [d * .55, 830, ease.lin], [d, 834]]), rot = kf(lt, [[0, 150], [d * .55, 175], [d, 168]]);
    const hp = seg(lt, 0, d * .5, ease.out);
    const hx = lerp(1180, 1372, hp), hy = lerp(900, 812, hp);
    let w = `<g transform="rotate(${f1(rot)} 1392 ${f1(gy - 40)})">${glass(1392, gy, 1.25, { fill: .45 })}</g>`;
    const wp = seg(lt, .1, d, ease.out);
    for (let i = 0; i < 8; i++) w += circ(1392 + 50 + i * 14 * wp, gy - 30 - Math.sin(i / 8 * Math.PI) * 40 * wp + i * 6, 6 - i * .4, '#bfe6ff', { opacity: (.85 - i * .08).toFixed(2) });
    w += ell(1440, gy - 26, 40 * wp, 10, '#9fd0f0', { opacity: .5 });
    w += pline([[hx - 520, hy + 300], [hx - 230, hy + 80], [hx, hy]], OUTFIT.leo.shade, 46) + pline([[hx - 520, hy + 300], [hx - 230, hy + 80], [hx - 34, hy + 10]], OUTFIT.leo.cloth, 38) + mitten(hx, hy, 18, -20, hp > .95 ? 1 : 0);
    return e.bg + layer(cam, `<g filter="${fRim(-3, -3, '#ffd29a')}">${w}</g>`) + layer(C0, figHead(60, 980, 260, { who: 'leo', fc: 1, expr: 'none', pose: { tor: 40, head: 10 } }), { blur: 12 });
  },
  k_whatThe(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1300, y: 700, z: 1.9 }, { x: 1300, y: 690, z: 2.05 });
    const e = envKitchen(cam, gt, { bgBlur: 5 });
    let w = tableK() + bowl(1040, 680) + ell(1450, 905, 90, 12, '#9fd0f0', { opacity: .45 });
    w += leoChair() + shadowAt(1390, 900, 80) + fig({ x: 1390, y: 900, s: 80, fc: -1, who: 'leo', pose: { tor: 25, head: -8, ab: [40, 60], af: [45, 80], lb: [70, 120], lf: [10, 100] }, expr: 'shocked', talk: talkOf('leo', gt), t: gt, lookX: -1, extra: j => glass(j.armF[2][0] + 6, j.armF[2][1] + 34, 1.1, { fill: .35 }) });
    return e.bg + e.light + layer(cam, w);
  },
  k_rubEyes(lt, d, gt) {
    const cam = camMove(lt, d, { x: 900, y: 520, z: 1.5 }, { x: 920, y: 520, z: 1.6 });
    const e = envKitchen(cam, gt, { bgBlur: 4 });
    const pose = poseAt(lt, [[0, { tor: 6, head: 15, ab: [8, 8], af: [40, 150], lb: [4, 0], lf: [-4, 0] }], [.6, { tor: 6, head: 12, ab: [8, 8], af: [44, 140], lb: [4, 0], lf: [-4, 0] }], [1.2, { tor: 6, head: 15, ab: [8, 8], af: [40, 150], lb: [4, 0], lf: [-4, 0] }], [1.8, 'hold']]);
    return e.bg + e.light + layer(cam, shadowAt(900, 900, 80) + fig({ x: 900, y: 900, s: 80, fc: 1, who: 'leo', pose, expr: lt < 1.5 ? 'closed' : 'worried', t: gt, lookY: lt > 1.6 ? 1 : 0 }));
  },
  k_coinDrop(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1000, y: 640, z: 1.75 }, { x: 1000, y: 660, z: 1.85 });
    const e = envKitchen(cam, gt, { bgBlur: 6 });
    const tr = 1.7, tc = tr + .42;
    const a0 = { tor: 4, head: 14, ab: [8, 10], af: [88, 4], lb: [6, 0], lf: [-6, 0] }, a1 = { tor: 22, head: 18, ab: [8, 10], af: [52, 10], lb: [20, 25], lf: [-6, 15] };
    const pose = lt < tr ? a0 : mixPose(a0, a1, seg(lt, tr, tc, ease.in2));
    let hand0 = null, hand1 = null;
    fig({ x: 880, y: 900, s: 80, fc: 1, who: 'leo', pose: a0, still: true, joints: j => { hand0 = j.armF[2]; } });
    fig({ x: 880, y: 900, s: 80, fc: 1, who: 'leo', pose: a1, still: true, joints: j => { hand1 = j.armF[2]; } });
    let w = shadowAt(880, 900, 80) + fig({ x: 880, y: 900, s: 80, fc: 1, who: 'leo', pose, expr: 'determined', t: gt, lookY: 1, lookX: .5 });
    const gp = seg(lt, .2, .95, ease.in2);
    w += dashedPath([[hand0[0], hand0[1] + 16], [hand0[0] + 4, 896]], '#8fd3ff', 4, seg(lt, .2, .95));
    if (gp < 1) w += coin(hand0[0] + gp * 4, lerp(hand0[1] + 16, 896, gp), 13, lt * 9, true);
    else w += coin(hand0[0] + 4, 896, 13, 0, true) + ell(hand0[0] + 4, 900, 30 + seg(lt, .95, 1.6) * 30, 7, 'none', { stroke: '#8fd3ff', 'stroke-width': 3, opacity: (1 - seg(lt, .95, 1.6) * .7).toFixed(2) });
    const cy = lt < tr ? hand0[1] + 12 : Math.min(hand0[1] + 12 + .5 * 1900 * (lt - tr) ** 2, hand1[1] + 12);
    w += coin(lt < tc ? hand0[0] : hand1[0], lt < tc ? cy : hand1[1] + 8, 13, lt * 8);
    return e.bg + e.light + layer(cam, w);
  },
  k_coinOverhead(lt, d, gt) {
    let s = rect(0, 0, W, H, '#3e2c33');
    const off = lt * 10;
    for (let i = -1; i < 12; i++) for (let j = -1; j < 8; j++) s += rect(i * 180 - off, j * 180 - off * .5, 176, 176, (i + j) % 2 ? '#4a343b' : '#43303a');
    s += poly([[700, 0], [1500, 0], [1700, 1080], [600, 1080]], lgrad([[0, '#ffe2b0', .16], [1, '#ffe2b0', .05]]), { style: SCREEN });
    const ring = (lt * 1.4) % 1;
    s += circ(980, 560, 40 + ring * 60, 'none', { stroke: '#8fd3ff', 'stroke-width': 5, opacity: (1 - ring).toFixed(2), filter: fGlow(5, '#2f7bff', 1) }) + coin(980, 560, 34, 0, true);
    const rc = seg(lt, 0, d * .8, ease.in2);
    s += ell(980, 572, 34 * (.4 + rc * .6), 34 * (.4 + rc * .6), '#000', { opacity: (.15 + rc * .3).toFixed(2) });
    const hp = seg(lt, d * .6, d * .95, ease.out);
    s += coin(980, 560 - (1 - rc) * 30, 34 * (2.0 - rc * 1.0), lt * 7);
    s += `<g filter="${fRim(-5, -5, '#ffd29a')}">${pline([[1900, 1200], [lerp(1700, 1110, hp), lerp(1000, 640, hp)]], OUTFIT.leo.cloth, 120) + mitten(lerp(1640, 1040, hp), lerp(960, 600, hp), 40, -130, hp > .9 ? 1 : 0)}</g>`;
    return s;
  },
  k_coinPinch(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + lt * .03 };
    let s = kitchenBg({ x: 980, y: 700, z: 4 }, gt, 14);
    const cy = kf(lt, [[0, 200], [.9, 560, ease.in2], [d, 566]]);
    const close = seg(lt, .8, 1.0, ease.out);
    let w = coin(960, cy, 60, lt * 10);
    const fx = 960, fy = 570;
    w += pline([[fx - 1300, fy + 360], [fx - 120, fy + 40]], OUTFIT.leo.cloth, 120);
    w += pline([[fx - 120, fy + 40], [fx - 30, lerp(fy - 90, fy - 66, close)]], BODY, 46) + pline([[fx - 120, fy + 40], [fx - 30, lerp(fy + 120, fy + 62, close)]], BODY, 46);
    w += circ(fx - 120, fy + 40, 70, BODY);
    s += layer(cam, `<g filter="${fRim(-6, -6, '#ffd29a')}">${w}</g>`);
    if (close > .9) s += glow(960, 566, 120, '#ffe7a0', .4 * (1 - seg(lt, 1.1, 1.8)));
    return s;
  },
  k_twoCoins(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 620, z: 1.65 }, { x: 960, y: 630, z: 1.75 });
    const e = envKitchen(cam, gt, { bgBlur: 5 });
    const pz1 = { tor: 18, head: 10, ab: [62, 20], af: [62, 20], lb: [35, 55], lf: [-5, 30] };
    let hb = null, hf = null; fig({ x: 960, y: 900, s: 80, fc: 0, who: 'leo', pose: pz1, still: true, joints: j => { hb = j.armB[2]; hf = j.armF[2]; } });
    const pa = parabola(960, 600, hf[0], hf[1] - 4, 140), pb = parabola(960, 600, hb[0], hb[1] - 4, 110);
    const g1 = seg(lt, 0, .7), r1 = seg(lt, .7, 1.7, ease.lin);
    let w = shadowAt(960, 900, 80) + dashedPath(pa, '#8fd3ff', 4, g1) + dashedPath(pb, '#8fd3ff', 4, g1);
    const pose = poseAt(lt, [[0, 'hold'], [1.1, 'hold'], [1.65, pz1, ease.out]]);
    w += fig({ x: 960, y: 900, s: 80, fc: 0, who: 'leo', pose, expr: r1 >= 1 ? 'happy' : 'determined', t: gt });
    w += coin(...pOn(pa, r1), 13, lt * 9) + coin(...pOn(pb, r1), 13, lt * 11);
    return e.bg + e.light + layer(cam, w);
  },
  k_fiveCoins(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 520, z: 1.15 }, { x: 960, y: 530, z: 1.24 });
    const e = envKitchen(cam, gt, { bgBlur: 3 });
    let w = shadowAt(960, 900, 70);
    const spots = [[720, 760], [820, 520], [1080, 500], [1200, 700], [1000, 820]];
    spots.forEach(([x, y], i) => {
      const tc = .35 + i * .3, path = parabola(960, 560, x, y, 160 + i * 20);
      const u = seg(lt, 0, tc, ease.lin);
      if (lt < tc) w += dashedPath(path, '#8fd3ff', 3, 1, { op: .5 }) + coin(...pOn(path, u), 11, lt * 10 + i);
      else w += glow(x, y, 50, '#ffe7a0', .4 * (1 - seg(lt, tc, tc + .4)));
    });
    const ph = Math.floor(lt / .3) % 4;
    const poses = [{ tor: 10, head: -10, ab: [120, 10], af: [60, 20], lb: [30, 20], lf: [-20, 20] }, { tor: -10, head: -15, ab: [40, 30], af: [160, 10], lb: [-10, 0], lf: [25, 20] }, { tor: 20, head: 10, ab: [80, 10], af: [100, -10], lb: [40, 60], lf: [-15, 20] }, { tor: 0, head: -20, ab: [150, 20], af: [90, 20], lb: [10, 10], lf: [-10, 10] }];
    const pz = mixPose(poses[ph], poses[(ph + 1) % 4], ease.inOut((lt % .3) / .3));
    w += [1, 2, 3].map(k => fig({ x: 960, y: 900, s: 70, fc: 1, who: 'leo', pose: mixPose(poses[(ph + 3) % 4], pz, 1 - k * .25), expr: 'none', rim: null, op: .12, still: true })).join('');
    w += fig({ x: 960, y: 900, s: 70, fc: 1, who: 'leo', pose: pz, expr: 'happy', t: gt });
    return e.bg + e.light + layer(cam, w);
  },
  k_grin(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.08 });
    let s = kitchenBg({ x: 900, y: 400, z: 2.2 }, gt, 10) + layer(C0, rays(1500, 120, 16, 1400, '#ffe2b0', .08, lt * 3));
    const raise = seg(lt, 0, .5, ease.outBack);
    s += layer(cam, figHead(860, 470, 330, { who: 'leo', fc: 1, expr: 'happy', mouth: 'grin', t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    const px = 1320, py = lerp(1000, 820, raise);
    const arm = pline([[1050, 1250], [1230, py + 120], [px - 20, py + 20]], OUTFIT.leo.shade, 112) + pline([[1050, 1250], [1230, py + 120], [px - 60, py + 50]], OUTFIT.leo.cloth, 96) + mitten(px, py, 70, -60, 0, true);
    let hand = '';
    for (let i = 0; i < 5; i++) hand += coin(px - 50 + i * 26, py - 34 - Math.abs(i - 2) * 10, 30, .25 + i * .1);
    s += layer(cam, `<g filter="${fRim(-5, -5, '#ffd29a')}">${arm}</g>` + hand);
    return s;
  },

  // ---------------- LIVING ROOM (dusk) ----------------
  l_establish(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 980, y: 545, z: 1.07 });
    const e = envLiving(cam, gt);
    const toss = Math.abs(Math.sin(lt * 3));
    let w = shelfSet(0) + noraSofa(gt, 'happy') + shadowAt(560, 860, 70) + fig({ x: 560, y: 860, s: 70, fc: 1, who: 'sam', pose: poseAt(toss, [[0, 'hold'], [1, 'throw']]), expr: 'happy', t: gt }) + foamBall(640, 520 - toss * 140);
    w += shadowAt(1300, 860, 70) + fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'phone', expr: 'worried', t: gt, lookY: 1 });
    return e.bg + e.light + layer(cam, w);
  },
  l_throwPOV(lt, d, gt) {
    const p = ease.in2(clamp(lt / d)) * .32;
    const cam = { x: lerp(700, 1260, p), y: lerp(560, 470, p), z: lerp(1.2, 1.9, p / .32) };
    const e = envLiving(cam, gt, { bgBlur: 3 });
    let w = shelfSet(0) + fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'stand', expr: 'shocked', t: gt }) + fig({ x: 560, y: 860, s: 70, fc: 1, who: 'sam', pose: 'thrown', expr: 'happy', t: gt });
    const bx = lerp(640, 1262, p), by = lerp(520, 425, p);
    w += foamBall(bx, by, 22) + streaks(bx, by, 120, 20, Math.atan2(-95, 622), '#ffd6a0', .4);
    return e.bg + e.light + layer(cam, w);
  },
  l_previewFace(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1220, y: 470, z: 2.5 }, { x: 1240, y: 470, z: 2.7 });
    const e = envLiving(cam, gt, { bgBlur: 4 });
    const tc = 1.0, p = seg(lt, 0, tc, ease.in2), hit = lt >= tc;
    const hx = seg(lt, tc, tc + .3, ease.out);
    let w = shelfSet(0) + fig({ x: 1300 + hx * 18, y: 860, s: 70, fc: -1, who: 'leo', pose: hit ? { tor: -22 * hx, head: -30 * hx, ab: [20, 10], af: [-20, 10] } : 'stand', expr: hit ? 'closed' : 'shocked', t: gt, ghost: true, op: .7 });
    const face = [1262, 428];
    const bx = hit ? face[0] - 10 - hx * 140 : lerp(840, face[0] - 18, p), by = hit ? face[1] + hx * 140 : lerp(470, face[1], p);
    w += hit && hx < .3 ? ell(face[0] - 22, face[1], 14, 26, '#bfe6ff', { filter: fGhost(4), class: 'gh' }) : foamBall(bx, by, 22, true);
    if (hit) w += g(rays(face[0] - 10, face[1], 10, 90 * (1 - hx * .4), '#d8f0ff', .6 * (1 - hx)), { class: 'gh' });
    return futureWrap(e.bg + layer(cam, w), 1, { t: gt }) + flashPulse(lt, 0, .1, .5);
  },
  l_decide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 560, z: 1.1 });
    const e = envLiving({ x: 1200, y: 420, z: 2.4 }, gt, { bgBlur: 10 });
    const dip = seg(lt, d - .5, d, ease.in2);
    let s = e.bg + layer(cam, figHead(1000, 470 + dip * 120, 320, { who: 'leo', fc: -1, expr: lt < .6 ? 'shocked' : 'determined', lookX: -1, t: gt, rim: { dx: 10, dy: -8, c: '#ffd29a' } }));
    s += layer(C0, foamBall(380 + lt * 120, 420, 60), { blur: 12 });
    return s;
  },
  l_duck(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 560, z: 1.6 }, { x: 1160, y: 560, z: 1.7 });
    const e = envLiving(cam, gt, { bgBlur: 3 });
    const pose = poseAt(lt, [[0, 'stand'], [.3, 'duck', ease.out]]);
    const bp = seg(lt, .15, d, ease.lin);
    let w = shelfSet(0) + shadowAt(1300, 860, 70) + fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose, expr: 'determined', t: gt });
    const bx = lerp(980, 1400, bp), by = lerp(440, 420, bp);
    w += foamBall(bx, by, 22) + streaks(bx, by, 220, 18, 0, '#ffd6a0', .45);
    const og = 1 - seg(lt, 0, .6);
    if (og > 0) w += g(fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'stand', expr: 'shocked', ghost: true, op: .55 * og }), { transform: `translate(0 ${-40 * (1 - og)})` });
    return e.bg + e.light + layer(cam, w);
  },
  l_newPreview(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1500, y: 520, z: 1.8 }, { x: 1580, y: 540, z: 1.95 });
    const e = envLiving(cam, gt, { bgBlur: 3 });
    const p = seg(lt, .05, .8, ease.lin), hit = lt > .8;
    const bx = lerp(1350, 1660, p), by = lerp(425, 392, p);
    const tip = seg(lt, .9, 1.5, ease.in2), fall = seg(lt, 1.5, d, ease.in2);
    let w = shelf(1420, 430) + books(1450, 430, hit ? Math.sin(lt * 18) * 6 * (1 - seg(lt, .8, 2)) : 0);
    w += `<g class="gh" filter="${fGhostTint(3)}" opacity=".85">${plantPot(1720 + tip * 40 + fall * 20, 430 + fall * 420, .9, tip * 60 + fall * 140)}</g>`;
    w += fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'duck', expr: 'determined', t: gt, ghost: true, op: .35 });
    w += dashedPath(parabola(1300, 432, 1660, 392, 20), '#8fd3ff', 4, 1) + (hit ? foamBall(1660 - (lt - .8) * 80, 392 + (lt - .8) * 320, 22, true) : foamBall(bx, by, 22, true));
    return futureWrap(e.bg + layer(cam, w), 1, { t: gt });
  },
  l_shelfHit(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1560, y: 430, z: 1.9 }, { x: 1570, y: 440, z: 2.0 });
    const e = envLiving(cam, gt, { bgBlur: 3 });
    const hit = .35, bp = seg(lt, 0, hit, ease.lin);
    const wob = lt > hit ? Math.sin((lt - hit) * 16) * 8 * (1 - seg(lt, hit, d + 1)) : 0;
    const tip = seg(lt, hit + .4, d, ease.in2);
    let w = shelf(1420, 430) + books(1450, 430, wob) + plantPot(1720 + tip * 50, 430 + tip * tip * 160, .9, tip * 80);
    w += lt < hit ? foamBall(lerp(1380, 1660, bp), lerp(420, 392, bp), 22) : foamBall(1660 - (lt - hit) * 80, 392 + Math.min(lt - hit, .8) * 500, 22);
    const [sx, sy] = lt > hit ? shake(lt, 6 * (1 - seg(lt, hit, hit + .6))) : [0, 0];
    let s = e.bg + e.light + layer({ ...cam, x: cam.x + sx, y: cam.y + sy }, w);
    s += layer(C0, figHead(300, 900, 420, { who: 'leo', fc: 0, expr: 'none', rim: { dx: 10, dy: -10, c: '#ffd29a' } }), { blur: 12 });
    return s;
  },
  l_leoHorror(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 560, z: 1.1 });
    const e = envLiving({ x: 1300, y: 300, z: 2.5 }, gt, { bgBlur: 9 });
    return e.bg + layer(cam, figHead(900, 500, 300, { who: 'leo', fc: 1, expr: 'scared', lookY: -1, lookX: .6, t: gt, sweat: true, rim: { dx: -8, dy: -10, c: '#ffd29a' } }));
  },
  l_diveCatch(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1520, y: 690, z: 1.7 }, { x: 1560, y: 700, z: 1.8 });
    const e = envLiving(cam, gt, { bgBlur: 3 });
    const prone = { tor: 80, head: -12, ab: [112, 4], af: [104, 0], lb: [-80, 4], lf: [-86, 6] };
    const air = seg(lt, 0, .5), slide = seg(lt, .5, .9, ease.out);
    const lx = lt < .5 ? lerp(1260, 1500, air) : lerp(1500, 1585, slide);
    const pose = lt < .5 ? { ...mixPose(POSES.pushOff, prone, ease.out(air)), lift: Math.sin(air * Math.PI) * 1.1 } : prone;
    let hEnd = null; fig({ x: 1585, y: 860, s: 70, fc: 1, who: 'leo', pose: prone, still: true, joints: j => { hEnd = j.armF[2]; } });
    let w = shelf(1420, 430) + books(1450, 430, 0) + shadowAt(lx + 40, 860, 90);
    for (let k = 3; k >= 1 && lt < .9; k--) w += fig({ x: lx - k * 26, y: 860, s: 70, fc: 1, who: 'leo', pose, expr: 'none', rim: null, op: .08, still: true });
    const land = lt > .5 ? Math.max(0, 1 - (lt - .5) / .18) : 0;
    w += fig({ x: lx, y: 860, s: 70, fc: 1, who: 'leo', pose, expr: 'determined', t: gt, still: true, sq: lt < .5 ? -.1 * Math.sin(air * Math.PI) : .22 * land });
    const fp = ease.in2(seg(lt, 0, .85));
    const potX = lerp(1775, hEnd[0] + 14, fp), potY = lerp(640, hEnd[1] + 8, fp), rot = lerp(70, 8, fp);
    w += plantPot(potX, potY, .9, rot);
    if (lt > .5 && lt < 1.2) for (let i = 0; i < 4; i++) w += circ(lx - 120 - i * 40, 852 - i * 6, 10 + i * 6 + slide * 8, '#a89a8c', { opacity: (.35 * (1 - seg(lt, .6, 1.2))).toFixed(2) });
    return e.bg + e.light + layer(cam, w);
  },
  // s030c: on the floor, the saved pot held up — relief
  l_potSafe(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1560, y: 690, z: 2.2 }, { x: 1570, y: 700, z: 2.32 });
    const e = envLiving(cam, gt, { bgBlur: 5 });
    const up = seg(lt, .3, 1.0, ease.out);
    const pose = mixPose({ tor: 80, head: -12, ab: [112, 4], af: [104, 0], lb: [-80, 4], lf: [-86, 6] }, { tor: 72, head: -30, ab: [112, 4], af: [150, 10], lb: [-80, 4], lf: [-86, 6] }, up);
    let hand = null;
    let w = shadowAt(1600, 860, 90) + fig({ x: 1585, y: 860, s: 70, fc: 1, who: 'leo', pose, expr: up > .6 ? 'happy' : 'shocked', mouth: up > .6 ? 'grin' : 'o', t: gt, still: true, joints: j => { hand = j.armF[2]; } });
    w += plantPot(hand[0] + 14, hand[1] + 8, .9, 8 - up * 8);
    return e.bg + e.light + layer(cam, w);
  },
  l_potBase(lt, d, gt) {
    const p = ease.in(clamp(lt / d));
    let s = envLiving({ x: 1500, y: 700, z: 3 }, gt, { bgBlur: 12 }).bg;
    const r = lerp(150, 1300, p);
    s += `<g filter="${fRim(-6, -6, '#ffd29a')}">${pline([[600, 1300], [900, 760]], OUTFIT.leo.cloth, 150) + circ(960, 600, r * 1.08, BODY)}</g>` + circ(960, 600, r, '#b86a4a') + circ(960, 600, r * .82, '#cf7d5a') + circ(960, 600, r * .18, '#8a4a34');
    return s;
  },
});

// ---- props/characters used above ----
function bowl(x, y) { return path(`M${x - 46} ${y - 30} Q${x} ${y + 10} ${x + 46} ${y - 30} Z`, '#e8e0d4') + ell(x, y - 30, 46, 8, '#f4d9a8'); }
function foamBall(x, y, r = 22, ghost = false) { return ghost ? circ(x, y, r, '#bfe6ff', { opacity: .85, filter: fGhost(4), class: 'gh' }) : circ(x, y, r, '#ff8a3c') + circ(x - r * .3, y - r * .3, r * .35, '#ffc08a', { opacity: .7 }); }
function shelfSet(wob = 0) { return shelf(1420, 430) + `<g transform="rotate(${f1(wob * .3)} 1600 430)">` + books(1450, 430, wob) + plantPot(1720, 430, .9, wob * 1.5) + '</g>'; }
// mitten hand with thumb; rot in degrees; closed=1 curls the thumb in; open=true shows fingers
function mitten(x, y, r, rot = 0, closed = 0, open = false, c = BODY) {
  return g(ell(0, 0, r * 1.2, r * (open ? 1.05 : .9), c) + ell(r * (closed ? .3 : .9), -r * .7, r * .38, r * .62, c, { transform: `rotate(-35 ${r * .9} ${-r * .7})` }) + (open ? [0, 1, 2, 3].map(i => ell(r * (1.0 + i * .02), -r * .45 + i * r * .36, r * .55, r * .2, c)).join('') : ''), { transform: `translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})` });
}
function leoChair() { return rect(1145, 783, 130, 16, '#6b4540', { rx: 4 }) + rect(1258, 610, 16, 190, '#6b4540', { rx: 4 }) + rect(1150, 797, 12, 103, '#54352f') + rect(1258, 797, 12, 103, '#54352f'); }
function noraSofa(gt, expr = 'happy') { return shadowAt(170, 840, 60) + fig({ x: 170, y: 840, s: 60, fc: 1, who: 'nora', pose: { tor: -12, head: -6, ab: [20, 40], af: [40, 100], lb: [80, 85], lf: [84, 86] }, expr, mouth: expr === 'happy' ? 'grin' : undefined, t: gt, seed: 3 }); }
// the glass sits exactly where Leo's back elbow ends up when it swings back (so the knock is a real contact)
let _GLX = null;
function GLX() { if (_GLX === null) { let el = null; fig({ x: 1180, y: 900, s: 82, fc: -1, who: 'leo', still: true, pose: { tor: 12, head: 4, ab: [-68, 100], af: [70, 30], lb: [88, 88], lf: [86, 86] }, joints: j => { el = j.armB[1]; } }); _GLX = Math.round(el[0] + 16); } return _GLX; }
function leoAtTable(gt, o = {}) {
  const sp = o.spoon ?? 0, el = o.elbow ?? 0, sh = o.shrug ?? 0, rc = o.reach ?? 0;
  let pose = { tor: 6 + rc * 6, head: 4, ab: [lerp(30, -68, el), lerp(50, 100, el)], af: [lerp(lerp(55, 35, sp), 70, rc), lerp(lerp(70, 120, sp), 30, rc)], lb: [88, 88], lf: [86, 86] };
  if (sh) pose = mixPose(pose, { tor: 0, head: 8, ab: [45, 105], af: [50, 110], lb: [88, 88], lf: [86, 86] }, sh);
  return shadowAt(1180, 900, 82) + leoChair() + fig({ x: 1180, y: 900, s: 82, fc: -1, who: 'leo', pose, expr: o.expr || 'neutral', lookX: o.look ?? -.4, lookY: o.lookY || 0, talk: o.talk || 0, t: gt });
}
