// Stick-figure rig in the Ifverse style: black rounded limbs, white faces, flat clothing colours, rim light.
const BODY = '#0b0709', FACE = '#f6f1e8';
const OUTFIT = {
  leo:   { cloth: '#d8373a', shade: '#9e2229', hood: true, strings: true },
  nora:  { cloth: '#e3b23c', shade: '#a77b1c', pony: true },
  sam:   { cap: '#4cc36b', capShade: '#2e8a48' },
  maya:  { cloth: '#7b6cff', shade: '#5246b8', bun: true },
  boy:   { cloth: '#7ee08a', shade: '#4fae5c', short: true },
  guard: { cloth: '#ff7a1a', shade: '#c4560c', vest: true, cap: '#2a2a35', capShade: '#15151c' },
  plain: {},
  grey:  { cloth: '#5d5468', shade: '#433b4d' },
  mauve: { cloth: '#8a5a6e', shade: '#6a4255' },
  teal:  { cloth: '#3c7f86', shade: '#2a5d63' },
  driver:{ cap: '#3a3f4a', capShade: '#22262e' },
};
// proportions in head diameters
const PR = { thigh: 1.42, shin: 1.42, torso: 1.95, neck: .13, upper: 1.08, fore: 1.02, foot: .42, limbW: .19, torsoW: .28 };

// ---- pose library (angles in degrees; limbs measured from straight down, + = forward; torso/head from up, + = lean forward) ----
const POSES = {
  stand: { tor: 0, head: 0, ab: [6, 8], af: [-6, 8], lb: [3, 0], lf: [-3, 0] },
  relaxed: { tor: -2, head: 2, ab: [10, 12], af: [-8, 10], lb: [5, 2], lf: [-4, 0] },
  sit: { tor: -4, head: 0, ab: [30, 50], af: [35, 55], lb: [88, 88], lf: [86, 86], drop: 1.25 },
  sitEat: { tor: 6, head: 6, ab: [30, 50], af: [40, 95], lb: [88, 88], lf: [86, 86], drop: 1.25 },
  reach: { tor: 12, head: 6, ab: [20, 20], af: [85, 5], lb: [10, 4], lf: [-12, 6] },
  catchLow: { tor: 35, head: 20, ab: [30, 20], af: [60, 0], lb: [55, 70], lf: [-10, 40], drop: .4 },
  point: { tor: 4, head: 2, ab: [8, 10], af: [92, 0], lb: [6, 0], lf: [-6, 0] },
  shout: { tor: -6, head: -8, ab: [30, 40], af: [55, 100], lb: [8, 0], lf: [-10, 0] },
  armsUp: { tor: -4, head: -10, ab: [165, 10], af: [170, 10], lb: [8, 0], lf: [-8, 0] },
  shrug: { tor: 0, head: 6, ab: [40, 100], af: [40, 100], lb: [4, 0], lf: [-4, 0] },
  duck: { tor: 60, head: 25, ab: [70, 60], af: [90, 50], lb: [70, 110], lf: [10, 90], drop: .9 },
  crouch: { tor: 30, head: 10, ab: [40, 40], af: [50, 40], lb: [60, 100], lf: [0, 80], drop: .6 },
  handsHips: { tor: 0, head: 0, ab: [35, -110], af: [35, -110], lb: [6, 0], lf: [-6, 0] },
  armsCross: { tor: 0, head: 4, ab: [20, 120], af: [25, 115], lb: [4, 0], lf: [-4, 0] },
  serve: { tor: 15, head: 5, ab: [40, 60], af: [120, 30], lb: [20, 10], lf: [-15, 5] },
  swing: { tor: 18, head: 6, ab: [-20, 40], af: [80, -10], lb: [25, 20], lf: [-20, 10] },
  throw: { tor: -10, head: -5, ab: [30, 30], af: [160, 40], lb: [20, 5], lf: [-25, 10] },
  thrown: { tor: 20, head: 10, ab: [-20, 30], af: [70, 0], lb: [-10, 0], lf: [30, 20] },
  dodgeL: { tor: -25, head: -10, ab: [60, 40], af: [100, 30], lb: [20, 30], lf: [-30, 10] },
  dodgeR: { tor: 30, head: 10, ab: [-40, 30], af: [120, 20], lb: [40, 50], lf: [-10, 10] },
  hold: { tor: 2, head: 4, ab: [30, 80], af: [35, 80], lb: [4, 0], lf: [-4, 0] },
  phone: { tor: 4, head: 18, ab: [6, 8], af: [30, 100], lb: [4, 0], lf: [-4, 0] },
  pushOff: { tor: 30, head: 10, ab: [-40, 30], af: [60, 40], lb: [-25, 10], lf: [50, 90], drop: .25 },
  skid: { tor: -25, head: -10, ab: [60, 20], af: [70, 30], lb: [-25, 0], lf: [35, 10], drop: .2 },
  grabKid: { tor: 35, head: 15, ab: [70, 30], af: [80, 20], lb: [40, 60], lf: [-20, 20], drop: .35 },
  pullBack: { tor: -20, head: -5, ab: [60, 70], af: [70, 60], lb: [30, 10], lf: [-30, 20] },
  stepBack: { tor: -10, head: -4, ab: [10, 20], af: [-10, 15], lb: [-20, 5], lf: [15, 10] },
  sad: { tor: 10, head: 22, ab: [4, 6], af: [-4, 6], lb: [3, 0], lf: [-3, 0] },
  sitSad: { tor: 18, head: 25, ab: [35, 60], af: [40, 70], lb: [88, 88], lf: [86, 86], drop: 1.25 },
  facepalm: { tor: 6, head: 15, ab: [8, 8], af: [40, 150], lb: [4, 0], lf: [-4, 0] },
  wave: { tor: -2, head: 0, ab: [6, 8], af: [150, 40], lb: [4, 0], lf: [-4, 0] },
  paddleReady: { tor: 20, head: 4, ab: [30, 50], af: [55, 70], lb: [25, 25], lf: [-15, 20], drop: .2 },
  arcade: { tor: 8, head: 4, ab: [55, 50], af: [65, 45], lb: [4, 0], lf: [-4, 0] },
  holdBanner: { tor: 0, head: 0, ab: [80, 60], af: [80, 60], lb: [4, 0], lf: [-4, 0] },
  stop: { tor: 0, head: 0, ab: [6, 8], af: [100, -10], lb: [6, 0], lf: [-6, 0] },
};
function mixPose(a, b, t) {
  const o = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const va = a[k] ?? (Array.isArray(b[k]) ? [0, 0] : 0), vb = b[k] ?? (Array.isArray(a[k]) ? [0, 0] : 0);
    o[k] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], t)) : lerp(va, vb, t);
  }
  return o;
}
const P = n => (typeof n === 'string' ? POSES[n] : n);
// pose keyframes: poseAt(t, [[t0,'stand'],[t1,'reach'] ...])
function poseAt(t, keys, e = ease.inOut) {
  if (t <= keys[0][0]) return P(keys[0][1]);
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return mixPose(P(keys[i - 1][1]), P(keys[i][1]), (keys[i][2] || e)(clamp((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]))));
  return P(keys[keys.length - 1][1]);
}
// cycles
function walkPose(ph, amt = 1) {
  const s = Math.sin(ph * 2 * Math.PI), c = Math.cos(ph * 2 * Math.PI);
  return { tor: 4 * amt, head: 1, ab: [-24 * s * amt + 6, 18], af: [24 * s * amt - 6, 18], lb: [26 * s * amt, Math.max(0, -c) * 40 * amt + 4], lf: [-26 * s * amt, Math.max(0, c) * 40 * amt + 4], bob: Math.abs(c) * .06 * amt };
}
function runPose(ph, amt = 1) {
  const s = Math.sin(ph * 2 * Math.PI), c = Math.cos(ph * 2 * Math.PI);
  return { tor: 18 * amt, head: 4, ab: [-55 * s * amt + 15, 80], af: [55 * s * amt + 15, 80], lb: [45 * s * amt + 10, (1 - s) * 50 * amt + 10], lf: [-45 * s * amt + 10, (1 + s) * 50 * amt + 10], bob: Math.abs(c) * .15 * amt, drop: .15 };
}

function blinkAt(t, seed = 0) { const per = 2.6 + rnd(seed) * 2.2; const ph = (t + rnd(seed + 3) * per) % per; return ph < 0.09; }

// ---------- face ----------
// expr: neutral happy smug shocked scared angry sad determined closed worried
function face(hx, hy, r, fc, o) {
  const F = o.ghost ? '#ffffff' : FACE, B = o.ghost ? 'none' : BODY;
  const dx = fc * r * .34 + (o.lookX || 0) * r * .12, dy = (o.lookY || 0) * r * .1;
  const ex = r * .27, ey = -r * .1, out = [];
  const e = o.expr || 'neutral';
  const closed = o.blink || e === 'closed';
  const eyes = [-1, 1].map(sx => [hx + dx + sx * ex * (fc ? .82 : 1) + (fc ? -fc * r * .02 * sx : 0), hy + ey + dy]);
  const sw = r * .075;
  for (const [x, y] of eyes) {
    if (closed) { out.push(path(`M${x - r * .11} ${y} Q${x} ${y + r * .07} ${x + r * .11} ${y}`, 'none', { stroke: F, 'stroke-width': sw, 'stroke-linecap': 'round' })); continue; }
    if (e === 'happy') out.push(path(`M${x - r * .12} ${y + r * .04} Q${x} ${y - r * .14} ${x + r * .12} ${y + r * .04}`, 'none', { stroke: F, 'stroke-width': sw * 1.2, 'stroke-linecap': 'round' }));
    else if (e === 'shocked' || e === 'scared') { out.push(circ(x, y, r * .15, F)); out.push(circ(x + (o.lookX || 0) * r * .04, y + (o.lookY || 0) * r * .04, r * (e === 'scared' ? .04 : .06), BODY)); }
    else if (e === 'smug' || e === 'angry' || e === 'determined') {
      out.push(ell(x, y + r * .02, r * .085, r * .11, F));
      const slope = e === 'angry' ? .1 : e === 'determined' ? .05 : 0;
      const sx = x < hx + dx ? 1 : -1;
      out.push(poly([[x - r * .14, y - r * .14], [x + r * .14, y - r * .14], [x + r * .14, y - r * .01 + sx * slope * r], [x - r * .14, y - r * .01 - sx * slope * r]], B === 'none' ? '#5aa9e6' : BODY));
    } else if (e === 'sad') { out.push(ell(x, y + r * .05, r * .07, r * .09, F)); }
    else out.push(ell(x, y, r * .075, r * .11, F));
    if (o.sparkle) out.push(circ(x + r * .04, y - r * .05, r * .025, BODY));
  }
  // brows
  const browY = hy + ey + dy - r * .24;
  const brow = (k1, k2) => eyes.map(([x], i) => { const s = i ? 1 : -1; return line(x - r * .1, browY + (s < 0 ? k1 : k2) * r, x + r * .1, browY + (s < 0 ? k2 : k1) * r, F, sw * .9); }).join('');
  if (e === 'angry') out.push(brow(-.02, .07));
  if (e === 'determined') out.push(brow(0, .04));
  if (e === 'sad' || e === 'worried' || e === 'scared') out.push(brow(.06, -.03));
  if (e === 'shocked') out.push(brow(-.05, -.05));
  if (e === 'smug') out.push(eyes.map(([x], i) => i === 1 ? line(x - r * .1, browY - r * .06, x + r * .1, browY - r * .02, F, sw * .9) : '').join(''));
  // mouth
  const mx = hx + dx * 1.05, my = hy + r * .38 + dy;
  const talk = o.talk || 0;
  let m = o.mouth || ({ neutral: 'flat', happy: 'smile', smug: 'smirk', shocked: 'o', scared: 'wobble', angry: 'flat', sad: 'frown', determined: 'flat', closed: 'flat', worried: 'wobble' })[e];
  if (talk > .08 && m !== 'shout') m = 'talk';
  if (m === 'flat') out.push(line(mx - r * .1, my, mx + r * .1, my, F, sw));
  if (m === 'smile') out.push(path(`M${mx - r * .2} ${my - r * .05} Q${mx} ${my + r * .16} ${mx + r * .2} ${my - r * .05}`, 'none', { stroke: F, 'stroke-width': sw * 1.1, 'stroke-linecap': 'round' }));
  if (m === 'grin') out.push(path(`M${mx - r * .24} ${my - r * .06} Q${mx} ${my + r * .3} ${mx + r * .24} ${my - r * .06} Z`, F));
  if (m === 'smirk') out.push(path(`M${mx - r * .14} ${my} Q${mx + r * .05} ${my + r * .07} ${mx + r * .18} ${my - r * .08}`, 'none', { stroke: F, 'stroke-width': sw, 'stroke-linecap': 'round' }));
  if (m === 'frown') out.push(path(`M${mx - r * .14} ${my + r * .06} Q${mx} ${my - r * .07} ${mx + r * .14} ${my + r * .06}`, 'none', { stroke: F, 'stroke-width': sw, 'stroke-linecap': 'round' }));
  if (m === 'o') out.push(ell(mx, my + r * .02, r * .07, r * .09, F));
  if (m === 'wobble') out.push(path(`M${mx - r * .15} ${my} q${r * .05} ${-r * .05} ${r * .1} 0 t${r * .1} 0 t${r * .1} 0`, 'none', { stroke: F, 'stroke-width': sw * .9, 'stroke-linecap': 'round' }));
  if (m === 'talk') { const a = clamp(talk); out.push(a < .35 ? ell(mx, my, r * .12, r * .04, F) : ell(mx, my + r * .03, r * (.1 + a * .06), r * (.05 + a * .15), F)); }
  if (m === 'shout') { const a = .6 + clamp(talk) * .6; out.push(path(`M${mx - r * .2 * a} ${my - r * .05} L${mx + r * .2 * a} ${my - r * .05} Q${mx + r * .16 * a} ${my + r * .3 * a} ${mx} ${my + r * .32 * a} Q${mx - r * .16 * a} ${my + r * .3 * a} ${mx - r * .2 * a} ${my - r * .05} Z`, F)); }
  if (o.sweat) out.push(path(`M${hx - fc * r * .7} ${hy - r * .35} q${r * .08} ${r * .14} 0 ${r * .2} q${-r * .08} ${-r * .06} 0 ${-r * .2}Z`, '#bfe6ff'));
  return out.join('');
}

// ---------- full figure ----------
// o: {x, y (ground), s (head px), fc (1 right, -1 left, 0 front), pose (object or name), who, expr, talk, t, seed, rim:{dx,dy,c}, blur, ghost, op, holding:fn(handPos) }
function fig(o) {
  const s = o.s, fc = o.fc ?? 1, fs = fc === 0 ? 1 : fc;
  const pz = Object.assign({}, POSES.stand, P(o.pose || 'stand'));
  const k = OUTFIT[o.who || 'plain'] || {};
  const ghost = !!o.ghost;
  const C = ghost ? { body: '#7fc8ff', cloth: '#c9ecff', shade: '#9ad6ff', face: '#fff' } : { body: BODY, cloth: k.cloth, shade: k.shade, face: FACE };
  const sc = o.child ? .62 : 1;
  const L = n => PR[n] * s * sc;
  const dirDown = (a, side = 1) => [Math.sin(a * R) * (fc === 0 ? side : fs), Math.cos(a * R)];
  const dirUp = a => [Math.sin(a * R) * fs, -Math.cos(a * R)];
  const breathe = Math.sin(((o.t || 0) + (o.seed || 0)) * 2.2) * .012;
  // hip height from the lower foot
  const legY = l => L('thigh') * Math.cos(l[0] * R) + L('shin') * Math.cos((l[0] - l[1]) * R);
  const hipH = Math.max(legY(pz.lb), legY(pz.lf)) - (pz.drop || 0) * s * 0 + 0;
  const hip = [o.x, o.y - hipH + (pz.bob || 0) * s - (pz.lift || 0) * s];
  const tu = dirUp(pz.tor);
  const neck = [hip[0] + tu[0] * L('torso') * (1 + breathe), hip[1] + tu[1] * L('torso') * (1 + breathe)];
  const sway = o.still ? 0 : Math.sin(((o.t || 0) + (o.seed || 0) * 1.7) * 1.4) * 2.5;
  const hu = dirUp(pz.tor + pz.head + sway);
  const headR = s * .5 * (o.child ? .82 : 1);
  const head = [neck[0] + hu[0] * (L('neck') + headR), neck[1] + hu[1] * (L('neck') + headR)];
  const sh = [neck[0] - tu[0] * s * .14, neck[1] - tu[1] * s * .14];
  const limb = (root, l, a, side, len1, len2, bendSign) => {
    const d1 = dirDown(a[0], side), j = [root[0] + d1[0] * len1, root[1] + d1[1] * len1];
    const d2 = dirDown(a[0] + bendSign * a[1], side), e = [j[0] + d2[0] * len2, j[1] + d2[1] * len2];
    return [root, j, e];
  };
  const nX = -tu[1], nY = tu[0];
  const shB = fc === 0 ? [sh[0] - s * .34, sh[1] + s * .06] : [sh[0] + nX * fs * s * .13, sh[1] + nY * fs * s * .13], shF = fc === 0 ? [sh[0] + s * .34, sh[1] + s * .06] : [sh[0] - nX * fs * s * .13, sh[1] - nY * fs * s * .13];
  const armB = limb(shB, 0, pz.ab, -1, L('upper'), L('fore'), 1), armF = limb(shF, 0, pz.af, 1, L('upper'), L('fore'), 1);
  const legB = limb(hip, 0, pz.lb, -1, L('thigh'), L('shin'), -1), legF = limb(hip, 0, pz.lf, 1, L('thigh'), L('shin'), -1);
  const lw = s * PR.limbW * (o.child ? .9 : 1);
  const stroke = (pts, c, w) => pline(pts, c, f1(w));
  const foot = (lg, c) => { const e = lg[2]; const fx = fc === 0 ? 0 : fs; return line(e[0], e[1], e[0] + fx * L('foot'), e[1] + (fc === 0 ? s * .05 : 0), c, lw * 1.05); };
  const hand = (a, c) => circ(a[2][0], a[2][1], lw * .72, c);
  const parts = [];
  const shadeC = C.shade || C.body, clothC = C.cloth || C.body;
  // back limbs
  parts.push(stroke(armB, C.body, lw), hand(armB, C.body));
  const sleeve = a => k.short ? a.slice(0, 2) : a.slice(0, 2).concat([[lerp(a[1][0], a[2][0], .85), lerp(a[1][1], a[2][1], .85)]]);
  if (k.cloth && !k.vest) parts.push(stroke(sleeve(armB), mix(shadeC, '#000000', .25), lw * 1.75), stroke(sleeve(armB), shadeC, lw * 1.45));
  parts.push(stroke(legB, C.body, lw), foot(legB, C.body));
  // hood / ponytail behind head
  if (k.hood) parts.push(ell(head[0] - fs * s * (fc === 0 ? 0 : .2), head[1] + s * .34, s * (fc === 0 ? .56 : .46), s * .3, shadeC, { transform: `rotate(${f1(pz.tor * fs)} ${f1(neck[0])} ${f1(neck[1])})` }));
  if (k.pony) { const sw = Math.sin(((o.t || 0) + (o.seed || 0)) * 3) * 6 - (pz.tor || 0) * .3; parts.push(ell(head[0] - fs * s * .55, head[1] + s * .05, s * .2, s * .34, C.body, { transform: `rotate(${f1(-fs * (25 + sw))} ${f1(head[0] - fs * s * .45)} ${f1(head[1] - s * .1)})` }), circ(head[0] - fs * s * .45, head[1] - s * .12, s * .09, clothC)); }
  if (k.bun) parts.push(circ(head[0] - fs * s * .3, head[1] - s * .42, s * .22, C.body));
  // torso
  parts.push(stroke([hip, neck], C.body, s * PR.torsoW));
  parts.push(stroke([[hip[0], hip[1]], [neck[0], neck[1]]], C.body, s * PR.torsoW));
  if (!k.cloth) { const top = [lerp(hip[0], neck[0], .95), lerp(hip[1], neck[1], .95)]; parts.push(poly([[top[0] + nX * s * .3, top[1] + nY * s * .3], [top[0] - nX * s * .3, top[1] - nY * s * .3], [hip[0] - nX * s * .16, hip[1] - nY * s * .16], [hip[0] + nX * s * .16, hip[1] + nY * s * .16]], C.body, { stroke: C.body, 'stroke-width': f1(s * .12), 'stroke-linejoin': 'round' })); }
  if (k.cloth) {
    const top = [lerp(hip[0], neck[0], .96), lerp(hip[1], neck[1], .96)], bot = [lerp(hip[0], neck[0], -.06), lerp(hip[1], neck[1], -.06)];
    const nx = -tu[1], ny = tu[0], wS = s * (k.vest ? .36 : (o.child ? .32 : .46)), wHp = s * (k.vest ? .3 : .3);
    parts.push(poly([[top[0] + nx * wS, top[1] + ny * wS], [top[0] - nx * wS, top[1] - ny * wS], [bot[0] - nx * wHp, bot[1] - ny * wHp], [bot[0] + nx * wHp, bot[1] + ny * wHp]], clothC, { stroke: clothC, 'stroke-width': f1(s * .14), 'stroke-linejoin': 'round' }));
    if (!ghost && !k.vest) parts.push(line(bot[0] + nx * wHp * .9, bot[1] + ny * wHp * .9, bot[0] - nx * wHp * .9, bot[1] - ny * wHp * .9, shadeC, s * .07));
    if (k.vest && !ghost) { for (const q of [.3, .55]) { const a = [lerp(hip[0], neck[0], q), lerp(hip[1], neck[1], q)]; parts.push(line(a[0] - s * .24, a[1], a[0] + s * .24, a[1], '#e6edf2', s * .07, { 'stroke-linecap': 'butt' })); } }
    if (k.strings && !ghost) { for (const d of [-.07, .07]) parts.push(line(neck[0] + fs * s * (.12 + d), neck[1] + s * .1, neck[0] + fs * s * (.14 + d), neck[1] + s * .62, FACE, s * .035)); }
  }
  // front leg
  parts.push(stroke(legF, C.body, lw), foot(legF, C.body));
  // neck + head
  parts.push(stroke([neck, [lerp(neck[0], head[0], .5), lerp(neck[1], head[1], .5)]], C.body, s * .2));
  parts.push(circ(head[0], head[1], headR, C.body));
  if (k.cap) { const cc = ghost ? '#c9ecff' : k.cap; parts.push(path(`M${head[0] - headR * 1.02} ${head[1] - headR * .1} A${headR * 1.02} ${headR * 1.05} 0 0 1 ${head[0] + headR * 1.02} ${head[1] - headR * .1} Z`, cc)); parts.push(line(head[0] + fs * headR * .2, head[1] - headR * .12, head[0] + fs * headR * 1.55, head[1] - headR * .02, ghost ? '#9ad6ff' : (k.capShade || cc), headR * .2)); }
  // face
  const blink = o.blink ?? blinkAt(o.t || 0, o.seed || 0);
  if (o.expr !== 'none' && fc !== -2) parts.push(face(head[0], head[1], headR, fc === 0 ? 0 : fs, { ...o, blink, ghost }));
  // front arm (drawn last so gestures read)
  parts.push(stroke(armF, C.body, lw), hand(armF, C.body));
  if (k.cloth && !k.vest) parts.push(stroke(sleeve(armF), shadeC, lw * 1.8), stroke(sleeve(armF), clothC, lw * 1.45));
  if (o.extra) parts.push(o.extra({ hip, neck, head, headR, armF, armB, legF, legB, s, fs }));
  // filter: ghost glow, or rim (+ optional depth blur)
  let filt = null;
  const rim = o.rim === undefined ? { dx: -fs * s * .06, dy: -s * .03, c: '#f0b27a' } : o.rim;
  if (ghost) filt = fGhost(Math.max(2, s * .07));
  else if (rim && o.blur) filt = fRimBlur(rim.dx, rim.dy, rim.c, o.blur);
  else if (rim) filt = fRim(rim.dx, rim.dy, rim.c);
  else if (o.blur) filt = fBlur(o.blur);
  const op = ghost ? (o.op ?? .6) : (o.op ?? 1);
  if (o.joints) o.joints({ hip, neck, head, headR, armF, armB, legF, legB });
  return `<g${ghost ? ' class="gh"' : ''}${filt ? ` filter="${filt}"` : ''}${op !== 1 ? ` opacity="${op}"` : ''}>${parts.join('')}</g>`;
}
// ground shadow under a figure
const shadowAt = (x, y, s, op = .35) => ell(x, y + s * .04, s * .9, s * .14, '#000', { opacity: op });

// place a figure so that its head centre lands at (hx, hy) — for close-ups
function figHead(hx, hy, s, o = {}) {
  let hp = null;
  fig({ ...o, x: 0, y: 0, s, joints: j => { hp = j.head; } });
  return fig({ ...o, x: hx - hp[0], y: hy - hp[1], s });
}
// head-only close-up (no body below frame needed): big head + shoulders/hoodie
function bust(hx, hy, s, o = {}) { return figHead(hx, hy, s, o); }
