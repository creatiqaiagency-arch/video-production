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
  sitFacepalm: () => ({ fa: [40, 150], ba: [55, 70], fl: [88, 92], bl: [84, 88], lean: 18, sit: true, headDrop: 8 }),
  sitLaugh: t => ({ fa: [30 + 10 * Math.sin(t * 10), 60], ba: [25, 50], fl: [88, 92], bl: [84, 88], lean: -6 + 5 * Math.sin(t * 10), sit: true }),
  cheerBounce: (t, ph = 0) => ({ fa: [158 + 15 * Math.sin(t * 18 + ph), -10], ba: [150 + 15 * Math.sin(t * 18 + ph + 1), -10], fl: [8, 0], bl: [-8, 0], lean: -4, bob: 5 * Math.abs(Math.sin(t * 9 + ph)) }),
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
const walkPh = (dist, h) => dist / (0.63 * h);
const runPh = (dist, h) => dist / (1.1 * h);
function mixPose(a, b, t) {
  const o = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (k === 'sit') { o.sit = lerp(+(a.sit || 0), +(b.sit || 0), t); continue; }
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
    case 'busy': xs.forEach(x => s += S.ellipse(x, ey + .03 * R, .09 * R, .09 * R * blink, ink)); break;
    default: xs.forEach(x => s += oval(x, .095 * R, .145 * R));
  }
  // brows
  const brow = (x, a, dy = -.25) => S.line(x - .12 * R, ey + dy * R + a * R, x + .12 * R, ey + dy * R - a * R, ink, sw * .9);
  if (['shout'].includes(e)) { s += brow(xs[0], -.06) + brow(xs[1], .06); }
  if (['determined', 'focused', 'smug'].includes(e)) { s += brow(xs[0], -.035) + brow(xs[1], .035); }
  if (['worried', 'sad', 'panic'].includes(e)) { s += brow(xs[0], .06) + brow(xs[1], -.06); }
  // mouth
  const mx = ex + lx * .5, my = .36 * R, talk = clamp(o.talk || 0);
  const mw = .19 * R;
  if (o.hideMouth) return s;
  if (e === 'shock') s += S.ellipse(mx, my + .02 * R, .07 * R + talk * .03 * R, .1 * R + talk * .05 * R, ink);
  else if (e === 'panic' || e === 'shout') { const op = .35 + .65 * talk; s += S.path(`M${mx - mw * .8},${my + .08 * R} Q${mx - mw * .7},${my - .12 * R * op} ${mx},${my - .13 * R * op} Q${mx + mw * .7},${my - .12 * R * op} ${mx + mw * .8},${my + .08 * R} Q${mx},${my + (.06 + .22 * op) * R} ${mx - mw * .8},${my + .08 * R}Z`, ink); }
  else if (talk > .08) {
    if (['sad', 'worried', 'unimpressed', 'bewildered'].includes(e)) s += S.path(`M${mx - mw * .8},${my + .05 * R} Q${mx},${my - (.03 + .10 * talk) * R} ${mx + mw * .8},${my + .05 * R} Q${mx},${my + (.07 + .08 * talk) * R} ${mx - mw * .8},${my + .05 * R}Z`, ink);
    else if (['happy', 'smug'].includes(e)) s += S.path(`M${mx - mw * .9},${my} Q${mx},${my - .03 * R} ${mx + mw * .9},${my} Q${mx},${my + (.05 + talk * .2) * R} ${mx - mw * .9},${my}Z`, ink);
    else s += S.ellipse(mx, my + .04 * R, mw * (.45 + .2 * talk), (.03 + .12 * talk) * R, ink);
  }
  else if (e === 'happy' || e === 'smug') s += S.path(`M${mx - mw},${my - .03 * R} Q${mx + (e === 'smug' ? .05 * R : 0)},${my + .14 * R} ${mx + mw},${my - (e === 'smug' ? .08 : .03) * R}`, 'none', { stroke: ink, 'stroke-width': sw, 'stroke-linecap': 'round' });
  else if (e === 'sad' || e === 'worried') s += S.path(`M${mx - mw * .8},${my + .06 * R} Q${mx},${my - .06 * R} ${mx + mw * .8},${my + .06 * R}`, 'none', { stroke: ink, 'stroke-width': sw, 'stroke-linecap': 'round' });
  else if (e === 'busy') s += S.line(mx - mw * .5, my + .03 * R, mx + mw * .5, my + .03 * R, ink, sw * .9);
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
  const sitW = clamp(+(pose.sit || 0));
  let hipY = lerp(-Math.max(legs.fl[1][1], legs.bl[1][1]), 0, sitW);
  hipY += -(pose.bob || 0) + (pose.drop || 0);
  const breath = 1 + .022 * Math.sin((o.t || 0) * TAU * .3 + (o.seed || 0));
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
      S.g({ 'clip-path': `url(#${id})` },
        // cel pass (bible: soft gradient multiply shadow + additive highlight, both clipped to the shape)
        S.rect(-tw - 2, shY - 10, tw * 2 + 4, torso + 20, `url(#${o.litSide > 0 ? 'shadeL' : 'shadeR'})`),
        S.rect(-tw - 2, shY - 10, tw * 2 + 4, torso + 20, `url(#${o.litSide > 0 ? 'hiR' : 'hiL'})`),
        S.rect(-tw - 2, -18, tw * 2 + 4, 26, 'url(#ao)'));
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
    fc = S.g({ transform: `translate(0,${headY})` }, face(fo, R, null));
    if (mono) fc = '';
    if (out.glasses && !mono && !o.noGlasses) { const turn = o.face?.turn ?? .45, ex = turn * .4 * R, sp = .25 * R * (1 - .45 * turn); fc += S.g({ transform: `translate(0,${headY})` }, S.circle(ex - sp, -.06 * R, .19 * R, 'none', { stroke: '#e9e4dc', 'stroke-width': 3.2 }), S.circle(ex + sp, -.06 * R, .19 * R, 'none', { stroke: '#e9e4dc', 'stroke-width': 3.2 }), S.line(ex - sp + .19 * R, -.06 * R, ex + sp - .19 * R, -.06 * R, '#e9e4dc', 3)); }
  }
  const tilt = o.headTilt || 0, nod = o.nod || 0;
  const headG = S.g({ transform: `translate(0,${nod}) rotate(${tilt},0,${headY})` }, head, fc);
  const upperBody = S.g({ transform: `translate(0,${hipY}) rotate(${lean})` }, bArm.svg, hood, body, headG, o.holdSvg ? S.g({ transform: `translate(${fArm.hand[0]},${fArm.hand[1]}) rotate(${-lean})` }, o.holdSvg) : '', fArm.svg);
  s += legSvg('bl') + upperBody + legSvg('fl');
  // joints for props (local, before world transform)
  const rot = (p) => { const r = rad(lean); return [p[0] * Math.cos(r) - p[1] * Math.sin(r), p[0] * Math.sin(r) + p[1] * Math.cos(r) + hipY]; };
  return { svg: s, j: { handF: rot(fArm.hand), handB: rot(bArm.hand), head: rot([0, headY]), hip: [0, hipY] } };
}


// ---- secondary dynamics (bible: follow-through & overlap, drag, squash & stretch, arcs) ----
// Per-character springs carried frame to frame. State resets on a cut or a time jump, so stills stay exact.
const DYN = { T: null, shot: null, idx: {}, st: {}, dt: 1 / 24 };
function dynFrame(T, shot) {
  const cont = DYN.T !== null && shot === DYN.shot && Math.abs(T - DYN.T - DYN.dt) < DYN.dt * .5;
  if (!cont) DYN.st = {};
  DYN.T = T; DYN.shot = shot; DYN.idx = {}; DYN.live = cont;
}
function spring(st, k, x, f, z) {
  let y = st[k], v = st[k + 'v'] || 0;
  if (y === undefined || Math.abs(x - y) > 120) { st[k] = x; st[k + 'v'] = 0; return x; }
  const w = TAU * f, h = DYN.dt / 2;
  for (let i = 0; i < 2; i++) { v += (w * w * (x - y) - 2 * z * w * v) * h; y += v * h; }
  st[k] = y; st[k + 'v'] = v; return y;
}
function dynamics(o, pose, h) {
  const who = o.who || 'x'; 
  const key = who + '|' + (DYN.idx[who] = (DYN.idx[who] || 0) + 1);
  const X = o.x ?? 0, Y = o.y ?? 0;
  let st = DYN.st[key];
  // a jump of more than half a body in one frame is a teleport or a different character: start fresh
  if (st && (Math.abs(X - st.x) > h * .5 || Math.abs(Y - st.y) > h * .5)) st = null;
  const fresh = !st;
  if (!st) st = DYN.st[key] = {};
  const out = { pose, sx: 1, sy: 1, headLag: 0 };
  if (o.still || o.noDyn) return out;
  // drag: lean into horizontal travel
  const vx = fresh ? 0 : (X - st.x) / DYN.dt * (o.f || 1);
  st.x = X;
  const dragLean = clamp(vx / h * 2.2, -5, 5);
  const p = { ...pose };
  // follow-through / overlap on arms (legs stay planted)
  for (const a of ['fa', 'ba']) if (p[a]) p[a] = [spring(st, a + '0', p[a][0], 4.5, .42), spring(st, a + '1', p[a][1], 4.0, .4)];
  const leanT = (p.lean || 0) + dragLean;
  p.lean = spring(st, 'lean', leanT, 3.2, .5);
  out.headLag = clamp(spring(st, 'head', p.lean, 2.4, .45) - p.lean, -9, 9);
  // squash & stretch on vertical travel (pivot at the feet, area preserved)
  const vy = fresh ? 0 : (Y - st.y) / DYN.dt;
  const pvy = st.vy || 0; st.y = Y; st.vy = vy;
  const land = pvy > 0 && vy < pvy * .4 ? clamp((pvy - vy) / h * .018, 0, .16) : 0;
  st.sq = Math.max((st.sq || 0) * .62, land);
  const sy = (1 + clamp(Math.abs(vy) / h * .028, 0, .1)) * (1 - st.sq);
  out.sy = sy; out.sx = 1 / Math.sqrt(sy);
  out.pose = p;
  return out;
}

// public: character(o)
// o: {who, x, y (ground or seat), h (height px), f (1 right/-1 left), pose, expr, turn, t, talk, light:{dx,dy,color}, rot, opacity}
function character(o) {
  o = { ...o };
  const out = OUTFITS[o.who] || OUTFITS.plain;
  const h = (o.h || 300) * (out.scale || 1), sc = h / 300, f = o.f || 1;
  let pose = o.pose || P.stand();
  const t = o.t || 0;
  if (!o.still) { const sd = (o.seed || 0) * 3.7; pose = { ...pose, lean: (pose.lean || 0) + 1.6 * noise1(t * .5 + sd), fa: pose.fa && [pose.fa[0] + 3 * noise1(t * .7 + sd + 1), pose.fa[1] + 4 * noise1(t * .6 + sd + 2)], ba: pose.ba && [pose.ba[0] + 3 * noise1(t * .65 + sd + 3), pose.ba[1] + 4 * noise1(t * .55 + sd + 4)] }; }
  const blink = o.blink ?? (() => { const tt = t + (o.seed || 0) * 1.7; let acc = 0, i = 0; while (acc < tt && i < 400) { const gap = 2 + 2 * hash(i * 7.1 + (o.seed || 0)); if (tt - acc < gap) { const ph = tt - acc; return ph < .12 || (hash(i * 3.3) > .8 && ph > .25 && ph < .37); } acc += gap; i++; } return false; })();
  const light = o.light || { dx: -1, dy: -.4, color: PAL.rim };
  const tk = o.talk || 0, sd = (o.seed || 0) * 7.3;
  if (o.headTilt === undefined) o.headTilt = noise1(t * .45 + sd) * 2.2 + (tk > .05 ? noise1(t * 2.6 + sd) * 4.5 : 0);
  if (o.nod === undefined) o.nod = tk > .05 ? -Math.abs(noise1(t * 5 + sd)) * 4 * tk : 0;
  const litSide = Math.sign(light.dx * f) || 1;
  const fo = { ...o, blink, litSide, face: { expr: o.expr, turn: o.turn ?? (o.front ? 0 : undefined), lookX: o.lookX, lookY: o.lookY, hideMouth: o.hideMouth, back: o.back } };
  const dy = dynamics(o, pose, h);
  pose = dy.pose; o.headTilt += dy.headLag;
  let main = drawFigure(fo, pose, null);
  if (o.headAt) { const hp = main.j.head; o = { ...o, x: o.headAt[0] - hp[0] * f * sc, y: o.headAt[1] - hp[1] * sc }; }
  const rimW = Math.min(16, Math.max(o.rimW ?? 6.5, h * .011)) / sc / (o.camZ || 1);
  const lx = light.dx * f * rimW, ly = light.dy * rimW;
  const rimCol = light.color || PAL.rim;
  const rim = drawFigure(fo, pose, rimCol);
  const tf = `translate(${o.x},${o.y}) rotate(${o.rot || 0}) scale(${(f * sc * dy.sx).toFixed(4)},${(sc * dy.sy).toFixed(4)})`;
  const rimG = (dx, dy) => S.g({ transform: `translate(${dx.toFixed(2)},${dy.toFixed(2)})`, opacity: light.op ?? 1 }, rim.svg);
    // rim bleed (bible: blurred copy of the rim under the hard edge so the light wraps into the air)
  const bleed = (dx, dy) => S.g({ transform: `translate(${(dx * 1.3).toFixed(2)},${(dy * 1.3).toFixed(2)})`, opacity: (light.op ?? 1) * .5, filter: 'url(#rimBleed)' }, rim.svg);
  const rims = light.none ? '' : light.both ? bleed(rimW, -rimW * .4) + bleed(-rimW, -rimW * .4) + rimG(rimW, -rimW * .4) + rimG(-rimW, -rimW * .4) : bleed(lx, ly) + rimG(lx, ly);
  const svg = S.g({ transform: tf, opacity: o.opacity }, rims, main.svg);
  const w = p => { const r = rad(o.rot || 0), px = p[0] * f * sc * dy.sx, py = p[1] * sc * dy.sy; return [o.x + px * Math.cos(r) - py * Math.sin(r), o.y + px * Math.sin(r) + py * Math.cos(r)]; };
  return { svg, handF: w(main.j.handF), handB: w(main.j.handB), head: w(main.j.head), headR: RIG.R * sc, hip: w(main.j.hip) };
}
const ch = o => character(o).svg;

// Close-up mitten hand (for inserts): x,y = wrist, ang = pointing angle (deg, 0 = right), sleeve colour
function bigHand(x, y, s, ang, sleeve, o = {}) {
  const ink = PAL.skin, rimc = o.rim || PAL.rim;
  const fingers = o.point ? [[0, -14, 64, 15], [0, 4, 30, 15], [0, 18, 28, 14], [0, 30, 24, 13]] : [[0, -18, 50, 14], [0, -2, 54, 15], [0, 14, 50, 14], [0, 28, 42, 13]];
  const shape = (col) => S.rect(-70, -26, 72, 64, col, { rx: 26 }) + fingers.map(([fx, fy, L, w]) => S.line(fx, fy, fx + L, fy + (o.curl ? 10 : 0), col, w * 1.05)).join('') + S.line(-10, 30, 20, 50, col, 16);
  const sl = sleeve ? S.rect(-1100, -36, 1050, 84, sleeve, { rx: 14 }) + S.rect(-80, -40, 26, 92, shade(sleeve, .75), { rx: 10 }) : '';
  return S.g({ transform: S.tr(x, y, s, ang) }, S.g({ transform: 'translate(-4,-5)' }, shape(rimc), sleeve ? S.rect(-1100, -36, 1050, 84, rimc, { rx: 14 }) : ''), sl, shape(ink));
}
