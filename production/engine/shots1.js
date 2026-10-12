// COLD OPEN + ACT I (s001–s031)
// shared helpers -------------------------------------------------------------
const C0 = { x: 960, y: 540, z: 1 };
const RIM_HEAD = { dx: 0, dy: -5, c: '#fff4d6' };
// road-front perspective helpers (vanishing point 960,480)
const rfTruck = (gy) => ({ x: 960 + 0.62 * (gy - 480), s: 0.0028 * (gy - 480) });
function bokeh(seed, n, box, cols = ['#ffb45c', '#ff8a5c', '#9fb6ff'], a = .35) {
  const [x0, y0, w, h] = box; let s = '';
  for (let i = 0; i < n; i++) { const c = cols[i % cols.length]; s += circ(x0 + rnd(seed + i) * w, y0 + rnd(seed + i * 2) * h, 20 + rnd(seed + i * 3) * 60, c, { opacity: a * (.4 + rnd(i * 7) * .6), style: SCREEN }); }
  return s;
}
function nightBokehBg(cam, t, seed = 3) {
  return layer(cam, rect(-600, -400, 3200, 1900, lgrad([[0, '#141026'], [.6, '#241b38'], [1, '#2e2236']])) + bokeh(seed, 26, [-300, 0, 2500, 900]), { p: .4, blur: 14 });
}
function kitchenBg(cam, t, blur = 3) { const e = envKitchen(cam, t, { bgBlur: blur }); return e.bg; }

Object.assign(SHOTS_REG, {
  // s001: extreme wide road-level; truck far, approaching; Leo small at the right curb
  co_wide(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.0 }, { x: 990, y: 560, z: 1.08 });
    const e = envRoadFront(cam, gt);
    const gy = kf(lt, [[0, 505], [d, 600]], ease.in2);
    const tr = rfTruck(gy);
    let s = e.bg + layer(cam, truckFront(tr.x, gy, tr.s) + shadowAt(1730, 880, 30) + fig({ x: 1730, y: 880, s: 30, fc: -1, who: 'leo', pose: 'stand', expr: 'none', t: gt, rim: { dx: -3, dy: -2, c: '#fff2c4' } }));
    s += label(120, 170, '8:17 PM', seg(lt, .4, 1.2), 34);
    return s;
  },
  // s002: over-the-shoulder from behind Leo, truck headlights growing, shake
  co_truckFront(lt, d, gt) {
    const [sx, sy] = shake(lt, 2 + lt * 3);
    const cam = { x: 960 + sx, y: 540 + sy, z: kf(lt, [[0, 1.0], [d, 1.18]]) };
    const e = envRoadFront(cam, gt, { midBlur: 2.5 });
    const gy = kf(lt, [[0, 610], [d, 720]], ease.in2), tr = rfTruck(gy);
    let s = e.bg + layer(cam, truckFront(tr.x - 260, gy, tr.s * 1.25));
    s += layer(cam, fig({ x: 1420, y: 1500, s: 150, fc: 0, who: 'leo', pose: 'stand', expr: 'none', t: gt, rim: { dx: 0, dy: -8, c: '#fff6dc' } }), { p: 1.4, blur: 1.5 });
    s += rect(0, 0, W, H, '#fff2c4', { opacity: (.05 + lt / d * .25).toFixed(3), style: SCREEN });
    return s;
  },
  // s003: extreme close-up eyes, crash zoom, blue ring across pupils
  co_eyes(lt, d, gt) {
    const z = 1 + ease.outExpo(clamp(lt / .25)) * .35;
    const cam = { x: 960, y: 540, z };
    const hx = 960, hy = 640, s = 1150;
    let inner = rect(0, 0, W, H, '#1a1426') + bokeh(5, 10, [0, 0, 1920, 1080], ['#fff2c4'], .4);
    inner += figHead(hx, hy, s, { who: 'leo', fc: 0, expr: 'shocked', t: gt, blink: false, rim: { dx: 0, dy: -10, c: '#fff6dc' } });
    // headlight glints
    for (const ex of [-1, 1]) inner += circ(hx + ex * s * .5 * .27 + 18, hy - s * .5 * .1 - 22, 12, '#fff', { opacity: .9 });
    let o = layer(cam, inner);
    const p = seg(lt, .55, 1.25, ease.lin);
    for (const ex of [-1, 1]) o += layer(cam, ringFx(hx + ex * s * .5 * .27, hy - s * .5 * .1, p, 260));
    o += flash(seg(lt, 1.2, 1.4) * (1 - seg(lt, 1.45, d)) * .9, '#bfe6ff');
    return o;
  },
  // s004: FUTURE — side profile, truck hits ghost Leo, freeze before impact
  co_future(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1050, y: 640, z: 1.25 }, { x: 1010, y: 650, z: 1.42 });
    const e = envIntersection(cam, gt, { light: 'green' });
    const tx = kf(lt, [[0, 2100], [d * .62, 1180, ease.out], [d, 1172]]);
    const lx = 1010, ly = 780;
    let w = e.bg;
    w += layer(cam, shadowAt(lx, ly, 40) + fig({ x: lx, y: ly, s: 40, fc: 1, who: 'leo', pose: 'shout', expr: 'scared', t: gt, ghost: true, op: .7 }) + truckSide(tx, ly + 10, .85, {}));
    const frz = seg(lt, d * .62, d * .7);
    let s = futureWrap(w, 1, { t: gt });
    s += flash((1 - seg(lt, 0, .2)) * .8, '#bfe6ff');
    if (frz > 0) s += rect(0, 0, W, H, '#dff2ff', { opacity: (frz * .12).toFixed(3) });
    return s;
  },
  // s005: shatter back to the present — same angle as s001, truck far again, Leo alive at the curb
  co_rewind(lt, d, gt) {
    const cam = { x: 960, y: 560, z: 1.0 + lt * .01 };
    const e = envRoadFront(cam, gt);
    const gy = kf(lt, [[0, 498], [d, 520]], ease.lin), tr = rfTruck(gy);
    const present = e.bg + layer(cam, truckFront(tr.x, gy, tr.s) + shadowAt(1730, 880, 30) + fig({ x: 1730, y: 880, s: 30, fc: -1, who: 'leo', pose: 'relaxed', expr: 'none', t: gt, rim: { dx: -3, dy: -2, c: '#fff2c4' } }));
    if (lt > .7) return present + label(120, 170, '8:17 PM', 1, 34);
    // the frozen future frame breaking apart over the present
    const fcam = { x: 1010, y: 650, z: 1.42 };
    const fe = envIntersection(fcam, gt);
    const frozen = futureWrap(fe.bg + layer(fcam, fig({ x: 1010, y: 780, s: 40, fc: 1, who: 'leo', pose: 'shout', expr: 'scared', ghost: true, op: .7 }) + truckSide(1172, 790, .85)), 1, { t: gt, border: false });
    return present + shards(frozen, seg(lt, 0, .7, ease.lin)) + flash((1 - seg(lt, 0, .15)) * .7, '#dff2ff');
  },
  // s006: Leo close-up, blue fading from his eyes, headlights sweeping
  co_leoFace(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 520, z: 1.08 });
    let s = nightBokehBg(cam, gt, 9);
    const sweep = kf(lt, [[0, -400], [d, 2400]], ease.lin);
    s += layer(cam, figHead(1000, 470, 300, { who: 'leo', fc: -1, expr: lt < d * .5 ? 'scared' : 'determined', lookX: -.6, t: gt, rim: { dx: 10, dy: -6, c: '#ffd29a' } }));
    s += rect(sweep - 300, 0, 600, H, lgrad([[0, '#fff2c4', 0], [.5, '#fff2c4', .14], [1, '#fff2c4', 0]], 0, 0, 1, 0), { style: SCREEN });
    const eg = 1 - seg(lt, 0, 1.6);
    if (eg > 0) for (const ex of [-1, 1]) s += layer(cam, glow(1000 - 150 * .34 + ex * 150 * .27 * .82, 470 - 15, 70, '#2f7bff', .9 * eg));
    return s;
  },
  // s007: title card over the blurred street
  co_title(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.05 }, { x: 960, y: 560, z: 1.12 });
    const e = envRoadFront(cam, gt, { midBlur: 7 });
    let s = `<g filter="${fBlur(4)}">${e.bg}</g>` + rect(0, 0, W, H, '#0b0712', { opacity: .35 });
    s += titleCard(lt / d, 'WHAT IF YOU COULD SEE', '5 SECONDS INTO THE FUTURE?', 'A STICKMAN WHAT-IF');
    return s;
  },
  // s008: camera flies up above the city -> THREE DAYS EARLIER
  co_aerial(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const cam = { x: 960 + p * 200, y: lerp(1000, 380, p), z: lerp(1.3, .95, p) };
    let s = envAerial(cam, gt, { blur: lerp(4, 0, p) });
    s += caption(seg(lt, d * .35, d, ease.lin), 'THREE DAYS EARLIER', 560, 70);
    s += fadeBlack(seg(lt, d - .5, d) * .6) + rect(0, 0, W, H, '#ffe9c2', { opacity: (seg(lt, d - .35, d) * .5).toFixed(3) });
    return s;
  },

  // ---------------- KITCHEN ----------------
  // Leo sits at x=1180 facing left, eats from bowl at 1040; glass at 1300 (behind his elbow); table top y=680
  k_establish(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 520, z: 1.0 }, { x: 990, y: 540, z: 1.06 });
    const e = envKitchen(cam, gt);
    const spoon = Math.sin(lt * 3.2) * .5 + .5;
    let s = e.bg + e.light;
    s += layer(cam, leoAtTable(gt, { spoon }) + tableK() + bowl(1040, 680) + glass(1300, 680, 1.25));
    return s;
  },
  k_ghostGlass(lt, d, gt) {
    const cam = { x: 1150, y: 600, z: 1.55 + lt * .01 };
    const e = envKitchen(cam, gt, { bgBlur: 4 });
    let s = e.bg + e.light;
    const fp = seg(lt, .5, 2.3, ease.lin);
    // ghost glass: tips, slides off the table end, falls and shatters
    const gx = kf(fp, [[0, 1300], [.3, 1330], [.45, 1372], [1, 1395]]), gy = kf(fp, [[0, 680], [.45, 680], [1, 900, ease.in2]]), grot = kf(fp, [[0, 0], [.3, 20], [.45, 40], [1, 120]]);
    let ghost = '';
    if (fp < 1) ghost = `<g transform="rotate(${f1(grot)} ${f1(gx)} ${f1(gy)})">${glass(gx, gy, 1.25, { ghost: true })}</g>`;
    else { const sp = seg(lt, 2.3, 3.6, ease.out); for (let i = 0; i < 9; i++) { const a = (-160 + i * 18) * R; ghost += poly([[0, 0], [10, -4], [4, 12]].map(q => [1395 + Math.cos(a) * sp * (60 + i * 9) + q[0], 900 + Math.sin(a) * sp * 50 - (1 - sp) * 0 + q[1]]), '#9ad6ff', { opacity: (.8 * (1 - seg(lt, 3, 4.2))).toFixed(2), filter: fGlow(3, '#2f7bff', .9) }); } }
    s += layer(cam, leoAtTable(gt, { spoon: .2, look: kf(lt, [[0, -1], [1.8, 1]]), expr: lt > 2 ? 'shocked' : 'neutral' }) + tableK() + bowl(1040, 680) + glass(1300, 680, 1.25) + ghost);
    s += glowE(1340, 760, 200, 160, '#2f7bff', .18 * seg(lt, .4, .8));
    return s;
  },
  k_glassCU(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1290, y: 640, z: 3.2 }, { x: 1295, y: 640, z: 3.4 });
    const e = envKitchen(cam, gt, { bgBlur: 6 });
    return e.bg + e.light + layer(cam, tableK() + glass(1300, 680, 1.25, { fill: .6 }) + ell(1300, 680 - 62 * 1.25 * .6, 18 + Math.sin(lt * 6) * 1.5, 2, '#dff4ff', { opacity: .6 }) + glow(1290, 620, 60, '#fff1d6', .4));
  },
  k_leoConfused(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 560, z: 2.6 }, { x: 1150, y: 560, z: 2.75 });
    const e = envKitchen(cam, gt, { bgBlur: 7 });
    return e.bg + e.light + layer(cam, leoAtTable(gt, { spoon: .1, look: 1, expr: 'worried', talk: talkOf('leo', gt) }) + tableK());
  },
  k_elbow(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1260, y: 650, z: 2.4 }, { x: 1280, y: 660, z: 2.6 });
    const e = envKitchen(cam, gt, { bgBlur: 6 });
    const p = seg(lt, .4, 1.4);
    const gx = kf(lt, [[0, 1300], [1.2, 1300], [1.7, 1360], [2.2, 1392]]), gy = kf(lt, [[0, 680], [1.7, 680], [d, 760, ease.in2]]), rot = kf(lt, [[1.1, 0], [1.6, 30], [d, 80]]);
    return e.bg + e.light + layer(cam, leoAtTable(gt, { spoon: .2, elbow: p, look: -1 }) + tableK() + bowl(1040, 680) + `<g transform="rotate(${f1(rot)} ${f1(gx)} ${f1(gy)})">${glass(gx, gy, 1.25)}</g>`);
  },
  k_catch(lt, d, gt) {
    // slow motion near the floor: glass falling, hand shoots in and catches with a splash
    const cam = { x: 1380, y: 820, z: 2.6 };
    const e = envKitchen(cam, gt, { bgBlur: 8 });
    const gy = kf(lt, [[0, 760], [d * .55, 830, ease.lin], [d, 832]]), rot = kf(lt, [[0, 80], [d * .55, 120], [d, 100]]);
    const hx = kf(lt, [[0, 1200], [d * .5, 1360, ease.out], [d, 1366]]), hy = kf(lt, [[0, 700], [d * .5, 820, ease.out], [d, 826]]);
    let w = `<g transform="rotate(${f1(rot)} 1392 ${f1(gy)})">${glass(1392, gy, 1.25, { fill: .5 })}</g>`;
    w += pline([[hx - 260, hy - 200], [hx - 120, hy - 70], [hx, hy]], BODY, 22) + pline([[hx - 260, hy - 200], [hx - 120, hy - 70], [hx - 30, hy - 25]], OUTFIT.leo.cloth, 32) + circ(hx, hy, 17, BODY);
    const sp = seg(lt, d * .5, d);
    for (let i = 0; i < 6; i++) w += circ(1392 + Math.cos((-120 + i * 12) * R) * sp * 70, gy - 70 + Math.sin((-120 + i * 12) * R) * sp * 60 + sp * sp * 40, 4, '#bfe6ff', { opacity: (1 - sp).toFixed(2) });
    return e.bg + layer(cam, `<g filter="${fRim(-3, -3, '#ffd29a')}">${w}</g>`) + streaks(1392, gy - 40, 140 * (1 - sp), 20, Math.PI / 2, '#fff', .25);
  },
  k_whatThe(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1200, y: 600, z: 1.9 }, { x: 1200, y: 590, z: 2.05 });
    const e = envKitchen(cam, gt, { bgBlur: 5 });
    const hold = fig({ x: 1240, y: 900, s: 82, fc: -1, who: 'leo', pose: 'catchLow', expr: 'shocked', talk: talkOf('leo', gt), t: gt, lookX: 1, extra: j => glass(j.armF[2][0], j.armF[2][1] + 30, 1.1) });
    return e.bg + e.light + layer(cam, tableK() + bowl(1040, 680) + hold);
  },
  k_rubEyes(lt, d, gt) {
    const cam = camMove(lt, d, { x: 900, y: 520, z: 1.5 }, { x: 920, y: 520, z: 1.58 });
    const e = envKitchen(cam, gt, { bgBlur: 4 });
    const pose = poseAt(lt, [[0, 'facepalm'], [1.2, 'facepalm'], [1.8, 'hold']]);
    return e.bg + e.light + layer(cam, shadowAt(900, 900, 80) + fig({ x: 900, y: 900, s: 80, fc: 1, who: 'leo', pose, expr: lt < 1.5 ? 'closed' : 'worried', t: gt, lookY: lt > 1.6 ? 1 : 0 }));
  },
  k_coinDrop(lt, d, gt) {
    const cam = camMove(lt, d, { x: 980, y: 560, z: 1.8 }, { x: 980, y: 600, z: 1.9 });
    const e = envKitchen(cam, gt, { bgBlur: 6 });
    let w = shadowAt(880, 900, 80) + fig({ x: 880, y: 900, s: 80, fc: 1, who: 'leo', pose: 'point', expr: 'determined', t: gt, lookY: 1, lookX: .5 });
    const hand = [880 + 80 * (PR.upper + PR.fore) + 10, 900 - 80 * (PR.thigh + PR.shin + PR.torso) + 14 * 1];
    const path0 = [[hand[0], hand[1] + 14], [hand[0] + 6, 640], [hand[0] + 4, 900]];
    const gp = seg(lt, .3, 1.3, ease.in2);
    w += dashedPath([[hand[0], hand[1] + 16], [hand[0] + 5, 896]], '#8fd3ff', 4, seg(lt, .3, 1.3)) + coin(hand[0] + gp * 5, lerp(hand[1] + 16, 896, gp), 13, lt * 9, true);
    if (gp >= 1) w += ell(hand[0] + 5, 898, 30 * (1 + Math.sin(lt * 8) * .1), 7, 'none', { stroke: '#8fd3ff', 'stroke-width': 3, opacity: .8 });
    const rp = seg(lt, 2.0, d, ease.in2);
    w += coin(hand[0], lerp(hand[1] + 16, 870, rp), 13, lt * 8);
    return e.bg + e.light + layer(cam, w);
  },
  k_coinOverhead(lt, d, gt) {
    // overhead floor tiles; ghost lands on a tile, real coin shadow converges
    let s = rect(0, 0, W, H, '#3e2c33');
    const off = lt * 10;
    for (let i = -1; i < 12; i++) for (let j = -1; j < 8; j++) s += rect(i * 180 - off, j * 180 - off * .5, 176, 176, (i + j) % 2 ? '#4a343b' : '#43303a');
    s += glowE(1100, 500, 600, 400, '#ffd9a0', .2);
    const ring = seg(lt, .1, .9, ease.out);
    s += circ(980, 560, 40 + ring * 60, 'none', { stroke: '#8fd3ff', 'stroke-width': 5, opacity: (1 - ring * .6).toFixed(2), filter: fGlow(5, '#2f7bff', 1) }) + coin(980, 560, 34, 0, true);
    const rc = seg(lt, .5, d, ease.in2);
    s += ell(980 + (1 - rc) * 30, 570, 34 * (.4 + rc * .6), 34 * (.4 + rc * .6), '#000', { opacity: (.15 + rc * .3).toFixed(2) });
    s += coin(980 + (1 - rc) * 30, 560 - (1 - rc) * 40, 34 * (2.2 - rc * 1.2), lt * 7);
    return s;
  },
  k_coinPinch(lt, d, gt) {
    const cam = { x: 960, y: 540, z: 1 + lt * .02 };
    let s = kitchenBg({ x: 980, y: 700, z: 4 }, gt, 14);
    const cy = kf(lt, [[0, 200], [.9, 560, ease.in2], [d, 566]]);
    const close = seg(lt, .8, 1.0, ease.out);
    let w = coin(960, cy, 60, lt * 10);
    const fx = 960, fy = 570;
    w += pline([[fx - 700, fy + 160], [fx - 120, fy + 40]], OUTFIT.leo.cloth, 120);
    w += pline([[fx - 120, fy + 40], [fx - 30, lerp(fy - 90, fy - 66, close)]], BODY, 46) + pline([[fx - 120, fy + 40], [fx - 30, lerp(fy + 120, fy + 62, close)]], BODY, 46);
    w += circ(fx - 120, fy + 40, 70, BODY);
    s += layer(cam, `<g filter="${fRim(-6, -6, '#ffd29a')}">${w}</g>`);
    if (close > .9) s += glow(960, 566, 120, '#ffe7a0', .4 * (1 - seg(lt, 1.1, 1.8)));
    return s;
  },
  k_twoCoins(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 560, z: 1.6 }, { x: 960, y: 560, z: 1.7 });
    const e = envKitchen(cam, gt, { bgBlur: 5 });
    let w = shadowAt(960, 900, 80);
    const pa = parabola(1010, 600, 1180, 860, 120), pb = parabola(1010, 600, 760, 850, 60);
    const g1 = seg(lt, 0, .8), r1 = seg(lt, .5, 1.5, ease.lin);
    w += dashedPath(pa, '#8fd3ff', 4, g1) + dashedPath(pb, '#8fd3ff', 4, g1);
    w += coin(...pOn(pa, Math.min(r1, .82)), 13, lt * 9) + coin(...pOn(pb, Math.min(r1, .8)), 13, lt * 11);
    const pose = poseAt(lt, [[0, 'hold'], [.9, 'hold'], [1.3, { tor: 25, head: 15, ab: [-50, 30], af: [70, 10], lb: [40, 60], lf: [-10, 30] }]]);
    w += fig({ x: 960, y: 900, s: 80, fc: 1, who: 'leo', pose, expr: 'determined', t: gt });
    return e.bg + e.light + layer(cam, w);
  },
  k_fiveCoins(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 520, z: 1.15 }, { x: 960, y: 530, z: 1.22 });
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
    const ghostTrail = [1, 2, 3].map(k => fig({ x: 960, y: 900, s: 70, fc: 1, who: 'leo', pose: mixPose(poses[(ph + 3) % 4], pz, 1 - k * .25), expr: 'none', rim: null, op: .12 })).join('');
    w += ghostTrail + fig({ x: 960, y: 900, s: 70, fc: 1, who: 'leo', pose: pz, expr: 'happy', t: gt });
    return e.bg + e.light + layer(cam, w);
  },
  k_grin(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 540, z: 1.07 });
    let s = kitchenBg({ x: 900, y: 400, z: 2.2 }, gt, 10) + layer({ x: 960, y: 540, z: 1 }, rays(1500, 120, 16, 1400, '#ffe2b0', .08, lt * 3));
    s += layer(cam, figHead(940, 480, 330, { who: 'leo', fc: 1, expr: 'happy', mouth: 'grin', t: gt, rim: { dx: -10, dy: -8, c: '#ffd29a' } }));
    let hand = '';
    for (let i = 0; i < 5; i++) hand += coin(1250 + i * 34, 860 - Math.abs(i - 2) * 16, 34, .2 + i * .1);
    s += layer(cam, `<g filter="${fRim(-4, -4, '#ffd29a')}">${pline([[1700, 1200], [1320, 920]], OUTFIT.leo.cloth, 110) + circ(1310, 900, 70, BODY)}</g>` + hand, { p: 1.2, blur: 1 });
    return s;
  },

  // ---------------- LIVING ROOM ----------------
  // Sam at x=560 (faces right), Leo at x=1300 (faces left). Shelf top at (1420,430).
  l_establish(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 980, y: 545, z: 1.06 });
    const e = envLiving(cam, gt);
    const toss = Math.abs(Math.sin(lt * 3));
    let w = shelfSet(0) + shadowAt(560, 860, 70) + fig({ x: 560, y: 860, s: 70, fc: 1, who: 'sam', pose: poseAt(toss, [[0, 'hold'], [1, 'throw']]), expr: 'happy', t: gt }) + foamBall(640, 520 - toss * 140);
    w += shadowAt(1300, 860, 70) + fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'phone', expr: 'worried', t: gt, lookY: 1 });
    return e.bg + e.light + layer(cam, w);
  },
  l_throwPOV(lt, d, gt) {
    // camera rides behind the ball toward Leo
    const p = ease.in2(clamp(lt / d));
    const cam = { x: lerp(700, 1260, p), y: lerp(560, 470, p), z: lerp(1.2, 3.2, p) };
    const e = envLiving(cam, gt, { bgBlur: 3 });
    let w = shelfSet(0) + fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'stand', expr: 'shocked', t: gt });
    const bx = lerp(700, 1262, p), by = lerp(560, 425, p);
    w += foamBall(bx, by, 22) + streaks(bx, by, 120, 20, Math.atan2(by - 560, bx - 700), '#ffd6a0', .4);
    return e.bg + e.light + layer(cam, w);
  },
  l_previewFace(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1240, y: 470, z: 2.6 }, { x: 1250, y: 470, z: 2.8 });
    const e = envLiving(cam, gt, { bgBlur: 5 });
    const p = seg(lt, .2, 1.2, ease.in2), hit = lt > 1.2;
    const hx = lerp(0, 1, seg(lt, 1.2, 1.5, ease.out));
    let w = shelfSet(0) + fig({ x: 1300 + hx * 20, y: 860, s: 70, fc: -1, who: 'leo', pose: hit ? { tor: -25 * hx, head: -30 * hx } : 'stand', expr: hit ? 'closed' : 'shocked', t: gt, ghost: true, op: .65 });
    const bx = hit ? 1262 - hx * 140 : lerp(1000, 1262, p), by = hit ? 425 + hx * 120 : lerp(450, 425, p);
    w += foamBall(bx, by, 22, true);
    if (hit) w += rays(1262, 425, 10, 90 * (1 - hx * .4), '#bfe6ff', .5 * (1 - hx));
    return futureWrap(e.bg + layer(cam, w), 1, { t: gt });
  },
  l_duck(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1150, y: 560, z: 1.6 }, { x: 1160, y: 560, z: 1.7 });
    const e = envLiving(cam, gt, { bgBlur: 3 });
    const pose = poseAt(lt, [[0, 'stand'], [.35, 'duck', ease.out]]);
    const bp = seg(lt, .2, 1.2, ease.lin);
    let w = shelfSet(0) + shadowAt(1300, 860, 70) + fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose, expr: 'determined', t: gt });
    const bx = lerp(900, 1550, bp), by = lerp(450, 420, bp);
    w += foamBall(bx, by, 22) + streaks(bx, by, 220, 18, 0, '#ffd6a0', .45);
    // old preview cracks and fades
    const og = 1 - seg(lt, 0, .5);
    if (og > 0) w += g(fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'stand', expr: 'shocked', ghost: true, op: .5 * og }), { transform: `translate(0 ${-30 * (1 - og)})` });
    return e.bg + e.light + layer(cam, w);
  },
  l_newPreview(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1450, y: 470, z: 1.9 }, { x: 1560, y: 450, z: 2.1 });
    const e = envLiving(cam, gt, { bgBlur: 3 });
    const p = seg(lt, .1, 1.1, ease.lin);
    const bx = lerp(1350, 1650, p), by = lerp(425, 380, p);
    const wob = lt > 1.1 ? Math.sin((lt - 1.1) * 18) * 8 * (1 - seg(lt, 1.1, 2.5)) : 0;
    let w = shelfSet(wob, true) + fig({ x: 1300, y: 860, s: 70, fc: -1, who: 'leo', pose: 'duck', expr: 'determined', t: gt, ghost: true, op: .4 });
    w += dashedPath(parabola(1300, 430, 1650, 380, 20), '#8fd3ff', 4, 1) + (lt < 1.2 ? foamBall(bx, by, 22, true) : foamBall(1650 - (lt - 1.1) * 60, 380 + (lt - 1.1) * 300, 22, true));
    return futureWrap(e.bg + layer(cam, w), 1, { t: gt });
  },
  l_shelfHit(lt, d, gt) {
    const cam = camMove(lt, d, { x: 1560, y: 430, z: 1.9 }, { x: 1560, y: 420, z: 2.0 });
    const e = envLiving(cam, gt, { bgBlur: 3 });
    const hit = .35, wob = lt > hit ? Math.sin((lt - hit) * 16) * 10 * (1 - seg(lt, hit, d + 1)) : 0;
    const bp = seg(lt, 0, hit, ease.lin);
    let w = shelfSet(wob) + (lt < hit ? foamBall(lerp(1350, 1650, bp), lerp(425, 380, bp), 22) : foamBall(1650 - (lt - hit) * 80, 380 + Math.min((lt - hit), .8) * 500, 22));
    const [sx, sy] = lt > hit ? shake(lt, 6 * (1 - seg(lt, hit, hit + .6))) : [0, 0];
    let s = e.bg + e.light + layer({ ...cam, x: cam.x + sx, y: cam.y + sy }, w);
    // blurred black shoulder of Leo in the foreground (OTS)
    s += layer({ x: 960, y: 540, z: 1 }, fig({ x: 380, y: 1900, s: 260, fc: 1, who: 'leo', pose: 'stand', expr: 'none', rim: { dx: 10, dy: -10, c: '#ffd29a' } }), { blur: 10 });
    return s;
  },
  l_leoHorror(lt, d, gt) {
    const cam = camMove(lt, d, { x: 960, y: 540, z: 1 }, { x: 960, y: 560, z: 1.08 });
    const e = envLiving({ x: 1300, y: 300, z: 2.5 }, gt, { bgBlur: 9 });
    let s = e.bg + layer(cam, figHead(900, 500, 300, { who: 'leo', fc: 1, expr: 'scared', lookY: -1, lookX: .6, t: gt, sweat: true, rim: { dx: -8, dy: -10, c: '#ffd29a' } }));
    s += layer(cam, rect(-200, -200, 2400, 380, '#000', { opacity: .3 }));
    return s;
  },
  l_potFall(lt, d, gt) {
    // low angle beneath the shelf: pot falls toward the lens, its circle fills frame (match cut)
    const p = ease.in2(clamp(lt / d));
    let s = rect(0, 0, W, H, lgrad([[0, '#3f2e45'], [1, '#2a1e2c']]));
    s += poly([[300, 0], [1700, 0], [1500, 260], [500, 260]], '#5a3a33') + rect(500, 260, 1000, 30, '#7a5446');
    s += books(640, 260, Math.sin(lt * 10) * 6, 0);
    const sc = lerp(.6, 9, p), y = lerp(330, 620, p);
    s += `<g filter="${p > .5 ? fBlur(lerp(0, 8, (p - .5) * 2)) : 'none'}">${plantPot(1180 - p * 220, y + 60 * sc, sc, 180 + lt * 140)}</g>`;
    s += circ(960, 540, lerp(0, 1300, seg(lt, d - .25, d, ease.in)), '#fbf6ee');
    return s;
  },
});

// ---- props/characters used above ----
function bowl(x, y) { return path(`M${x - 46} ${y - 30} Q${x} ${y + 10} ${x + 46} ${y - 30} Z`, '#e8e0d4') + ell(x, y - 30, 46, 8, '#f4d9a8'); }
function foamBall(x, y, r = 22, ghost = false) { return ghost ? circ(x, y, r, '#bfe6ff', { opacity: .75, filter: fGlow(4, '#2f7bff', .9) }) : circ(x, y, r, '#ff8a3c') + circ(x - r * .3, y - r * .3, r * .35, '#ffc08a', { opacity: .7 }); }
function shelfSet(wob = 0, ghost = false) {
  let s = shelf(1420, 430) + `<g transform="rotate(${f1(wob * .3)} 1600 430)">` + books(1450, 430, wob) + plantPot(1720, 430, .9, wob * 1.5) + '</g>';
  return s;
}
// Leo seated at the kitchen table (facing left). opts: spoon 0..1, elbow 0..1 (back arm swings into the glass), look -1..1, expr, talk
function leoAtTable(gt, o = {}) {
  const sp = o.spoon ?? 0, el = o.elbow ?? 0;
  const pose = { tor: 6, head: 4, ab: [lerp(30, -55, el), lerp(50, 95, el)], af: [lerp(55, 35, sp), lerp(70, 120, sp)], lb: [88, 88], lf: [86, 86] };
  return shadowAt(1180, 900, 82) + rect(1150, 783, 120, 14, '#4a3030') + rect(1255, 640, 14, 160, '#4a3030') + fig({ x: 1180, y: 900, s: 82, fc: -1, who: 'leo', pose, expr: o.expr || 'neutral', lookX: o.look ?? -.4, talk: o.talk || 0, t: gt });
}
