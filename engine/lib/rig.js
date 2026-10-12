// Stickman character rig in the Ifverse style.
// Local design space: height ~300, facing right, ground at y=0. The group is scaled and flipped into world space.
// Silhouette = near-black; identity = wardrobe colour; signature warm rim light = offset mono copy behind the figure.

const RIG = { thigh: 60, shin: 57, torso: 82, neck: 6, R: 40, upper: 52, fore: 50, lw: 17, hand: 9.5 };

const OUTFITS = {
  eli: { top: PAL.eli, topS: PAL.eliS, sleeves: 'long', hood: true, strings: true, pocket: true },
  noah: { top: PAL.noah, topS: PAL.noahS, sleeves: 'short', cap: PAL.cap, capS: PAL.capS },
  teacher: { top: PAL.teacher, topS: PAL.teacherS, sleeves: 'long', glasses: true, scale: 1.08, buttons: true },
  announcer: { top: PAL.ann, topS: PAL.annS, sleeves: 'long', headset: true, lapel: true },
  student: { top: PAL.stuTee, topS: '#25242a', sleeves: 'short', cap: PAL.stu, capS: PAL.stuS },
  extra: { top: '#6b5d6e', topS: '#463b48', sleeves: 'short' },
  plain: { top: null },
};

// ---- poses (degrees). arms: [shoulder, elbow]; legs: [hip, knee]. 0 = hanging straight down, + = forward ----
const P = {
  stand: () => ({ fa: [8, 10], ba: [-6, 8], fl: [3, 0], bl: [-3, 0], lean: 0 }),
  walk: ph => { const s = Math.sin(ph * TAU), c = Math.cos(ph * TAU); return { fa: [-22 * s, 18], ba: [22 * s, 18], fl: [24 * s, Math.max(0, -38 * c) + 4], bl: [-24 * s, Math.max(0, 38 * c) + 4], lean: 3, bob: Math.abs(c) * 4 }; },
  run: ph => { const s = Math.sin(ph * TAU), c = Math.cos(ph * TAU); return { fa: [-50 * s, 85], ba: [50 * s, 85], fl: [42 * s + 8, Math.max(10, -75 * c)], bl: [-42 * s + 8, Math.max(10, 75 * c)], lean: 14, bob: Math.abs(c) * 9 }; },
  sit: () => ({ fa: [35, 45], ba: [30, 45], fl: [88, 92], bl: [84, 88], lean: 2, sit: true }),
  sitWrite: (t = 0) => ({ fa: [62 + 4 * Math.sin(t * 18), 58], ba: [55, 70], fl: [88, 92], bl: [84, 88], lean: 16, sit: true }),
  sitType: (t = 0) => ({ fa: [58 + 3 * Math.sin(t * 25), 48 + 4 * Math.sin(t * 31)], ba: [54 + 3 * Math.cos(t * 23), 50], fl: [88, 92], bl: [84, 88], lean: 10, sit: true }),
  sitPiano: (t = 0, intensity = 1) => ({ fa: [60 + 5 * intensity * Math.sin(t * 13), 32], ba: [57 + 5 * intensity * Math.sin(t * 11 + 1), 34], fl: [86, 90], bl: [82, 86], lean: 6, sit: true }),
  sitSlump: () => ({ fa: [15, 20], ba: [10, 20], fl: [88, 92], bl: [84, 88], lean: 24, sit: true, headDrop: 10 }),
  point: () => ({ fa: [92, 0], ba: [-4, 10], fl: [3, 0], bl: [-3, 0], lean: 2 }),
  raiseHand: () => ({ fa: [168, 8], ba: [-4, 10], fl: [3, 0], bl: [-3, 0], lean: 0 }),
  cheer: () => ({ fa: [158, -10], ba: [150, -10], fl: [8, 0], bl: [-8, 0], lean: -4 }),
  panic: () => ({ fa: [150, 150], ba: [140, 150], fl: [6, 0], bl: [-6, 0], lean: -2 }),
  think: () => ({ fa: [28, 150], ba: [15, 100], fl: [3, 0], bl: [-3, 0], lean: 3 }),
  facepalm: () => ({ fa: [42, 160], ba: [-4, 10], fl: [3, 0], bl: [-3, 0], lean: 10, headDrop: 6 }),
  hold: () => ({ fa: [62, 60], ba: [56, 62], fl: [3, 0], bl: [-3, 0], lean: 2 }),
  reach: () => ({ fa: [84, 6], ba: [76, 8], fl: [8, 0], bl: [-6, 0], lean: 10 }),
  wave: t => ({ fa: [148, 40 + 25 * Math.sin(t * 10)], ba: [-4, 10], fl: [3, 0], bl: [-3, 0], lean: 0 }),
  shrug: () => ({ fa: [38, -75], ba: [30, -75], fl: [3, 0], bl: [-3, 0], lean: -2 }),
  crossArms: () => ({ fa: [38, 118], ba: [34, 122], fl: [3, 0], bl: [-3, 0], lean: -3 }),
  kickWind: () => ({ fa: [-35, 20], ba: [45, 20], fl: [-42, 62], bl: [6, 4], lean: -4 }),
  kick: () => ({ fa: [35, 10], ba: [-45, 10], fl: [78, 4], bl: [-8, 6], lean: -14 }),
  trip: () => ({ fa: [130, 20], ba: [110, 30], fl: [70, 10], bl: [-30, 20], lean: -30 }),
  crouch: () => ({ fa: [70, 40], ba: [60, 50], fl: [80, 125], bl: [40, 115], lean: 28 }),
  shout: () => ({ fa: [55, 120], ba: [-10, 20], fl: [8, 0], bl: [-8, 0], lean: 8 }),
  controller: (t = 0) => ({ fa: [52, 72 + 3 * Math.sin(t * 20)], ba: [48, 76], fl: [6, 0], bl: [-6, 0], lean: 6 }),
  slump: () => ({ fa: [4, 6], ba: [-4, 6], fl: [3, 0], bl: [-3, 0], lean: 14, headDrop: 12 }),
  placeTool: k => ({ fa: [lerp(62, 40, k), lerp(60, 20, k)], ba: [-4, 10], fl: [3, 0], bl: [-3, 0], lean: lerp(4, 12, k) }),
};
function mixPose(a, b, t) {
  const o = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const va = a[k] ?? b[k], vb = b[k] ?? a[k];
    if (Array.isArray(va)) o[k] = va.map((x, i) => lerp(x, vb[i], t));
    else if (typeof va === 'number') o[k] = lerp(va, vb, t);
    else o[k] = t < .5 ? va : vb;
  }
  return o;
}
// pose timeline: [[t, poseObj], ...] eased with outBack-ish settle
function poseAt(t, keys, ease = 'inOut') {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, p0] = keys[i], [t1, p1, en] = keys[i + 1];
    if (t <= t1) return mixPose(p0, p1, E[en || ease](seg(t, t0, t1)));
  }
  return keys[keys.length - 1][1];
}

function fk(x, y, L, a) { const r = rad(a); return [x + L * Math.sin(r), y + L * Math.cos(r)]; }

// ---- face ----
function face(o, R, mono) {
  const ink = mono || PAL.eye;
  const turn = o.turn ?? .45, ex = turn * .40 * R, sp = .25 * R * (1 - .45 * turn);
  const ey = -.06 * R + (o.lookY || 0) * R * .08, lx = (o.lookX || 0) * R * .08;
  const xs = [ex - sp + lx, ex + sp + lx];
  const e = o.expr || 'neutral';
  const blink = o.blink ? .12 : 1;
  const sw = R * .085;
  let s = '';
  const oval = (x, rx, ry) => S.ellipse(x, ey, rx, ry * blink, ink);
  if (o.back) return '';
  switch (e) {
    case 'happy': xs.forEach(x => s += blink < 1 ? S.line(x - .1 * R, ey, x + .1 * R, ey, ink, sw) : S.path(`M${x - .11 * R},${ey + .04 * R} Q${x},${ey - .14 * R} ${x + .11 * R},${ey + .04 * R}`, 'none', { stroke: ink, 'stroke-width': sw, 'stroke-linecap': 'round' })); break;
    case 'shock': case 'panic': xs.forEach(x => { s += S.circle(x, ey, .15 * R * (blink < 1 ? .3 : 1), ink); if (!mono) s += S.circle(x + .02 * R, ey + .01 * R, .055 * R, PAL.skin); }); break;
    case 'unimpressed': case 'bewildered': xs.forEach(x => { s += S.path(`M${x - .12 * R},${ey - .01 * R} L${x + .12 * R},${ey - .01 * R} L${x + .1 * R},${ey + .06 * R} Q${x},${ey + .1 * R} ${x - .1 * R},${ey + .06 * R}Z`, ink); }); break;
    case 'smug': xs.forEach(x => s += S.path(`M${x - .11 * R},${ey} L${x + .11 * R},${ey - .03 * R} Q${x + .1 * R},${ey + .1 * R} ${x},${ey + .1 * R} Q${x - .1 * R},${ey + .09 * R} ${x - .11 * R},${ey}Z`, ink)); break;
    case 'sad': xs.forEach(x => s += oval(x, .09 * R, .12 * R)); break;
    default: xs.forEach(x => s += oval(x, .095 * R, .145 * R));
  }
  // brows
  const brow = (x, a, dy = -.25) => S.line(x - .12 * R, ey + dy * R + a * R, x + .12 * R, ey + dy * R - a * R, ink, sw * .9);
  if (['determined', 'focused', 'shout', 'smug'].includes(e)) { s += brow(xs[0], -.06) + brow(xs[1], .06); }
  if (['worried', 'sad', 'panic'].includes(e)) { s += brow(xs[0], .06) + brow(xs[1], -.06); }
  // mouth
  const mx = ex + lx * .5, my = .36 * R, talk = clamp(o.talk || 0);
  const mw = .19 * R;
  if (o.hideMouth) return s;
  if (e === 'shock') s += S.ellipse(mx, my + .02 * R, .07 * R + talk * .03 * R, .1 * R + talk * .05 * R, ink);
  else if (e === 'panic' || e === 'shout') s += S.path(`M${mx - mw},${my - .05 * R} Q${mx},${my - .1 * R} ${mx + mw},${my - .05 * R} Q${mx + mw * .6},${my + (.22 + talk * .1) * R} ${mx},${my + (.24 + talk * .1) * R} Q${mx - mw * .6},${my + (.22 + talk * .1) * R} ${mx - mw},${my - .05 * R}Z`, ink);
  else if (talk > .08) s += S.path(`M${mx - mw * .9},${my} Q${mx},${my - .03 * R} ${mx + mw * .9},${my} Q${mx},${my + (.05 + talk * .2) * R} ${mx - mw * .9},${my}Z`, ink);
  else if (e === 'happy' || e === 'smug') s += S.path(`M${mx - mw},${my - .03 * R} Q${mx + (e === 'smug' ? .05 * R : 0)},${my + .14 * R} ${mx + mw},${my - (e === 'smug' ? .08 : .03) * R}`, 'none', { stroke: ink, 'stroke-width': sw, 'stroke-linecap': 'round' });
  else if (e === 'sad' || e === 'worried') s += S.path(`M${mx - mw * .8},${my + .06 * R} Q${mx},${my - .06 * R} ${mx + mw * .8},${my + .06 * R}`, 'none', { stroke: ink, 'stroke-width': sw, 'stroke-linecap': 'round' });
  else if (e === 'neutral' && o.smile !== false) s += S.path(`M${mx - mw * .7},${my} Q${mx},${my + .07 * R} ${mx + mw * .7},${my}`, 'none', { stroke: ink, 'stroke-width': sw, 'stroke-linecap': 'round' });
  else s += S.line(mx - mw * .7, my + .02 * R, mx + mw * .7, my + .02 * R, ink, sw);
  if (e === 'panic' && !mono) s += S.path(`M${-.55 * R},${-.45 * R} q${.06 * R},${.14 * R} 0,${.2 * R} q${-.06 * R},${-.06 * R} 0,${-.2 * R}Z`, '#bfe6ff');
  return s;
}

// ---- draw one character pass (normal or mono for rim) ----
function drawFigure(o, pose, mono) {
  const out = OUTFITS[o.who] || OUTFITS.plain;
  const c = k => mono || k;
  const ink = c(PAL.skin);
  const { thigh, shin, torso, neck, R, upper, fore, lw, hand } = RIG;
  // legs FK relative to hip at (0,0)
  const legs = {};
  const front = !!o.front;
  const mx = k => front && (k === 'ba' || k === 'bl') ? -1 : 1;
  const hx = k => front ? (k === 'fl' ? 11 : -11) : 0;
  for (const k of ['fl', 'bl']) {
    const [ha, kb] = pose[k];
    const knee = fk(0, 0, thigh, ha), foot = fk(knee[0], knee[1], shin, ha - kb);
    legs[k] = [[hx(k) + knee[0] * mx(k), knee[1]], [hx(k) + foot[0] * mx(k), foot[1]]];
  }
  let hipY;
  if (pose.sit) hipY = 0;
  else hipY = -Math.max(legs.fl[1][1], legs.bl[1][1]) + (pose.bob || 0) * 0;
  hipY += -(pose.bob || 0) + (pose.drop || 0);
  const breath = 1 + .012 * Math.sin((o.t || 0) * TAU * .3 + (o.seed || 0));
  const lean = pose.lean || 0;
  let s = '';
  const legSvg = k => { const [kn, ft] = legs[k]; return S.pl([[hx(k), hipY], [kn[0], kn[1] + hipY], [ft[0], ft[1] + hipY]], c(k === 'bl' && !mono ? '#120c10' : PAL.skin), lw * 1.05) + S.ellipse(ft[0] + (front ? 0 : 7), ft[1] + hipY - 2, front ? 11 : 13, 7, c(PAL.skin)); };
  // upper body in rotated frame around hip
  const shY = -torso * breath, shX = 0;
  const headY = shY - neck - R + (pose.headDrop || 0);
  const armSvg = (k) => {
    const [sa, eb] = pose[k];
    const sh = [front ? (k === 'fa' ? 23 : -23) : shX, shY + 10];
    const m = mx(k);
    const el0 = fk(0, sh[1], upper, sa), hd0 = fk(el0[0], el0[1], fore, sa + eb);
    const el = [sh[0] + el0[0] * m, el0[1]], hd = [sh[0] + hd0[0] * m, hd0[1]];
    const back = k === 'ba';
    let col = c(PAL.skin), col2 = col;
    if (out.top && !mono) { col = back ? out.topS : out.top; col2 = out.sleeves === 'long' ? col : PAL.skin; }
    if (back && !mono && !out.top) col = col2 = '#120c10';
    let a = S.line(sh[0], sh[1], el[0], el[1], col, lw) + S.line(el[0], el[1], hd[0], hd[1], col2, lw) + S.circle(el[0], el[1], lw / 2, col);
    a += S.circle(hd[0], hd[1], hand, ink);
    return { svg: a, hand: hd, elbow: el };
  };
  const bArm = armSvg('ba'), fArm = armSvg('fa');
  // torso / clothing
  let body = '';
  const tw = 25, hw = 22;
  const torsoD = `M${-tw},${shY + 6} Q${-tw},${shY - 4} ${-tw + 12},${shY - 4} L${tw - 12},${shY - 4} Q${tw},${shY - 4} ${tw},${shY + 6} L${hw},${-4} Q${hw},${4} ${hw - 8},${4} L${-hw + 8},${4} Q${-hw},${4} ${-hw},${-4}Z`;
  if (out.top) {
    const id = uid('cl');
    body += mono ? S.path(torsoD, mono) : `<clipPath id="${id}"><path d="${torsoD}"/></clipPath>` + S.path(torsoD, out.top) +
      S.g({ 'clip-path': `url(#${id})` }, S.rect(o.litSide > 0 ? -tw - 2 : tw * .25, shY - 10, tw * .8, torso + 20, out.topS, { opacity: .55 }));
    if (!mono && out.pocket) body += S.path(`M${-14},${-30} L${14},${-30} L${17},${-6} L${-17},${-6}Z`, out.topS, { opacity: .7 });
    if (!mono && out.strings) body += front ? S.line(-7, shY + 4, -8, shY + 34, PAL.string, 3) + S.line(7, shY + 4, 8, shY + 30, PAL.string, 3) : S.line(6, shY + 4, 7, shY + 34, PAL.string, 3) + S.line(15, shY + 4, 16, shY + 30, PAL.string, 3);
    if (!mono && out.buttons) [0, 1, 2].forEach(i => body += S.circle(10, shY + 18 + i * 18, 2.6, '#e9e1d6'));
    if (!mono && out.lapel) body += S.path(`M${4},${shY - 2} L${16},${shY + 30} L${10},${shY - 2}Z`, '#e6e2dc');
  } else body += S.line(0, shY, 0, 0, ink, lw * 1.1);
  // hood behind head
  let hood = '';
  if (out.hood && front) hood = S.ellipse(0, headY + R * .72, R * .95, R * .42, c(out.topS)) + S.ellipse(0, headY + R * .95, R * .8, R * .25, c(out.top));
  else if (out.hood) hood = S.ellipse(-R * .5, headY + R * .62, R * .62, R * .5, c(out.topS)) + S.ellipse(-R * .2, headY + R * .85, R * .7, R * .28, c(out.top));
  // head
  let head = S.circle(0, headY, R, ink);
  if (out.cap) {
    head += S.path(`M${-R * .98},${headY - R * .12} A${R},${R} 0 0 1 ${R * .98},${headY - R * .12} Q0,${headY - R * .32} ${-R * .98},${headY - R * .12}Z`, c(out.cap));
    if (o.front) head += S.ellipse(0, headY - R * .2, R * 1.1, R * .16, c(out.capS));
    else head += S.path(`M${R * .45},${headY - R * .28} Q${R * 1.25},${headY - R * .38} ${R * 1.45},${headY - R * .18} Q${R * 1.05},${headY - R * .1} ${R * .45},${headY - R * .14}Z`, c(out.capS));
  }
  if (out.headset) head += S.path(`M${-R * .9},${headY} A${R * 1.02},${R * 1.02} 0 0 1 ${R * .5},${headY - R * .9}`, 'none', { stroke: c('#3a3a44'), 'stroke-width': 5 }) + S.path(`M${-R * .1},${headY + R * .3} Q${R * .3},${headY + R * .6} ${R * .62},${headY + R * .45}`, 'none', { stroke: c('#3a3a44'), 'stroke-width': 4 });
  let fc = '';
  if (!mono || mono) {
    const fo = { ...o.face, talk: o.talk, blink: o.blink };
    fc = S.g({ transform: `translate(0,${headY}) rotate(${(o.headTilt || 0)})` }, face(fo, R, mono ? null : null));
    if (mono) fc = '';
    if (out.glasses && !mono) { const turn = o.face?.turn ?? .45, ex = turn * .4 * R, sp = .25 * R * (1 - .45 * turn); fc += S.g({ transform: `translate(0,${headY})` }, S.circle(ex - sp, -.06 * R, .19 * R, 'none', { stroke: '#e9e4dc', 'stroke-width': 3.2 }), S.circle(ex + sp, -.06 * R, .19 * R, 'none', { stroke: '#e9e4dc', 'stroke-width': 3.2 }), S.line(ex - sp + .19 * R, -.06 * R, ex + sp - .19 * R, -.06 * R, '#e9e4dc', 3)); }
  }
  const upperBody = S.g({ transform: `translate(0,${hipY}) rotate(${lean})` }, bArm.svg, hood, body, head, fc, o.holdSvg ? S.g({ transform: `translate(${fArm.hand[0]},${fArm.hand[1]}) rotate(${-lean})` }, o.holdSvg) : '', fArm.svg);
  s += legSvg('bl') + upperBody + legSvg('fl');
  // joints for props (local, before world transform)
  const rot = (p) => { const r = rad(lean); return [p[0] * Math.cos(r) - p[1] * Math.sin(r), p[0] * Math.sin(r) + p[1] * Math.cos(r) + hipY]; };
  return { svg: s, j: { handF: rot(fArm.hand), handB: rot(bArm.hand), head: rot([0, headY]), hip: [0, hipY] } };
}

// public: character(o)
// o: {who, x, y (ground or seat), h (height px), f (1 right/-1 left), pose, expr, turn, t, talk, light:{dx,dy,color}, rot, opacity}
function character(o) {
  o = { ...o };
  const out = OUTFITS[o.who] || OUTFITS.plain;
  const h = (o.h || 300) * (out.scale || 1), sc = h / 300, f = o.f || 1;
  const pose = o.pose || P.stand();
  const t = o.t || 0;
  const blink = o.blink ?? (((t + (o.seed || 0) * 1.7) % 3.1) < .09);
  const light = o.light || { dx: -1, dy: -.4, color: PAL.rim };
  const litSide = Math.sign(light.dx * f) || 1;
  const fo = { ...o, blink, litSide, face: { expr: o.expr, turn: o.turn ?? (o.front ? 0 : undefined), lookX: o.lookX, lookY: o.lookY, hideMouth: o.hideMouth, back: o.back } };
  let main = drawFigure(fo, pose, null);
  if (o.headAt) { const hp = main.j.head; o = { ...o, x: o.headAt[0] - hp[0] * f * sc, y: o.headAt[1] - hp[1] * sc }; }
  const rimW = (o.rimW ?? 4.2) / sc;
  const lx = light.dx * f * rimW, ly = light.dy * rimW;
  const rimCol = light.color || PAL.rim;
  const rim = drawFigure(fo, pose, rimCol);
  const tf = `translate(${o.x},${o.y}) rotate(${o.rot || 0}) scale(${f * sc},${sc})`;
  const svg = S.g({ transform: tf, opacity: o.opacity }, light.none ? '' : S.g({ transform: `translate(${lx.toFixed(2)},${ly.toFixed(2)})`, opacity: light.op ?? 1 }, rim.svg), main.svg);
  const w = p => { const r = rad(o.rot || 0), px = p[0] * f * sc, py = p[1] * sc; return [o.x + px * Math.cos(r) - py * Math.sin(r), o.y + px * Math.sin(r) + py * Math.cos(r)]; };
  return { svg, handF: w(main.j.handF), handB: w(main.j.handB), head: w(main.j.head), headR: RIG.R * sc, hip: w(main.j.hip) };
}
const ch = o => character(o).svg;

// Close-up mitten hand (for inserts): x,y = wrist, ang = pointing angle (deg, 0 = right), sleeve colour
function bigHand(x, y, s, ang, sleeve, o = {}) {
  const ink = PAL.skin, rimc = o.rim || PAL.rim;
  const fingers = o.point ? [[0, -14, 64, 15], [0, 4, 30, 15], [0, 18, 28, 14], [0, 30, 24, 13]] : [[0, -18, 50, 14], [0, -2, 54, 15], [0, 14, 50, 14], [0, 28, 42, 13]];
  const shape = (col) => S.rect(-70, -26, 72, 64, col, { rx: 26 }) + fingers.map(([fx, fy, L, w]) => S.line(fx, fy, fx + L, fy + (o.curl ? 10 : 0), col, w * 1.05)).join('') + S.line(-10, 30, 20, 50, col, 16);
  const sl = sleeve ? S.rect(-260, -36, 210, 84, sleeve, { rx: 14 }) + S.rect(-80, -40, 26, 92, shade(sleeve, .75), { rx: 10 }) : '';
  return S.g({ transform: S.tr(x, y, s, ang) }, S.g({ transform: 'translate(-4,-5)' }, shape(rimc), sleeve ? S.rect(-260, -36, 210, 84, rimc, { rx: 14 }) : ''), sl, shape(ink));
}
