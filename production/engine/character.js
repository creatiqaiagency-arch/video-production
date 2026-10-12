// Ifverse-style stick-figure rig: black round head, thick rounded limbs, one coloured garment,
// white face marks, warm offset rim light. Origin = point between the feet.
(function () {
  const E = globalThis.E;
  const BODY = '#0a080d', FACE = '#f4ede6';

  // ---------- costumes ----------
  E.COSTUME = {
    noah:   { hair: 'tufts', top: 'hoodie', topC: '#c8302f', topS: '#942327', strings: true },
    leo:    { hair: 'capBack', capC: '#5fd068', top: 'tee', topC: '#2f8f87', topS: '#22706a', strap: '#1a1418' },
    maya:   { hair: 'bob', clip: '#ffd166', top: 'cardigan', topC: '#c9a0e8', topS: '#9f78c4', inner: '#f2e6d8' },
    barista:{ hair: 'bun', top: 'apron', topC: '#e8d8c0', topS: '#bfae95' },
    teacher:{ hair: 'bun', glasses: true, top: 'shirt', topC: '#ece8e2', topS: '#bdb6ad' },
    biz:    { hair: 'side', top: 'suit', topC: '#2c3550', topS: '#1e253a', tie: '#c8a03a' },
    woman:  { hair: 'pony', top: 'coat', topC: '#c98aa0', topS: '#9e6479' },
    man:    { hair: 'flatcap', capC: '#d0a040', top: 'jacket', topC: '#b98a32', topS: '#8d6822' },
    kid:    { hair: 'none', top: 'tee', topC: '#7a8cff', topS: '#5a6bd0' },
  };
  E.extra = (seed) => { // random background student
    const r = E.rng(seed); const cols = ['#d0a040', '#c98aa0', '#6b7fd6', '#d47a5a', '#9a7ad0', '#5a9ec9', '#b8b0c0', '#e0905a', '#a05a7a'];
    const hairs = ['none', 'cap', 'bob', 'pony', 'side', 'tufts', 'bun'];
    const c = cols[Math.floor(r() * cols.length)];
    return { hair: hairs[Math.floor(r() * hairs.length)], capC: cols[Math.floor(r() * cols.length)], top: r() < 0.5 ? 'tee' : 'hoodie', topC: c, topS: E.mixHex(c, '#000000', 0.25), strings: false };
  };

  // ---------- poses (angles in radians: 0 = straight down; + = forward (profile) / outward (front)) ----------
  // arm: [shoulder, elbowBend]  leg: [hip, kneeBend]
  E.POSE = {
    stand:     { aB: [0.12, 0.1], aF: [0.1, 0.15], lB: [0.04, 0], lF: [-0.04, 0] },
    relaxed:   { aB: [0.18, 0.25], aF: [0.06, 0.3], lB: [0.06, 0], lF: [-0.06, 0] },
    pocket:    { aB: [-0.25, 1.2], aF: [-0.2, 1.1], lB: [0.05, 0], lF: [-0.05, 0] },
    holdOut:   { front: 'in', aB: [0.15, 0.2], aF: [1.15, 0.25], lB: [0.04, 0], lF: [-0.04, 0] },   // handing something
    reach:     { aB: [0.2, 0.2], aF: [1.3, 0.28], lB: [0.1, 0], lF: [-0.15, 0.1] },
    ears:      { aB: [1.9, 1.86], aF: [1.9, 1.86], lB: [0.05, 0], lF: [-0.05, 0] },     // hands on ears
    raise:     { aB: [0.15, 0.2], aF: [2.9, 0.1], lB: [0.04, 0], lF: [-0.04, 0] },     // hand up
    shrug:     { aB: [0.7, -1.9], aF: [0.7, -1.9], lB: [0.06, 0], lF: [-0.06, 0] },
    point:     { aB: [0.15, 0.2], aF: [1.4, 0.22], lB: [0.06, 0], lF: [-0.06, 0] },
    crossed:   { front: 'in', aB: [0.55, 2.2], aF: [0.55, 2.3], lB: [0.05, 0], lF: [-0.05, 0] },
    hug:       { front: 'in', aB: [1.3, 1.1], aF: [1.4, 1.2], lB: [0.05, 0], lF: [-0.08, 0] },
    letter:    { front: 'in', aB: [0.6, 1.3], aF: [0.75, 1.2], lB: [0.04, 0], lF: [-0.04, 0] },     // holding paper in front
    phone:     { front: 'in', aB: [0.12, 0.15], aF: [0.3, 2.6], lB: [0.04, 0], lF: [-0.04, 0] },    // phone to ear
    laptop:    { front: 'in', aB: [0.9, 0.9], aF: [0.95, 0.85], lB: [1.5, -1.5], lF: [1.45, -1.5] }, // sitting typing
    sit:       { aB: [0.4, 0.6], aF: [0.5, 0.5], lB: [1.5, -1.5], lF: [1.45, -1.5] },
    sitDesk:   { front: 'in', aB: [0.9, 1.0], aF: [0.8, 1.1], lB: [1.5, -1.5], lF: [1.45, -1.5] },
    cheer:     { aB: [2.6, 0.2], aF: [2.7, 0.15], lB: [0.1, 0], lF: [-0.1, 0] },
    facepalm:  { front: 'in', aB: [0.15, 0.2], aF: [0.9, 2.5], lB: [0.04, 0], lF: [-0.04, 0] },
    tap:       { front: 'in', aB: [0.12, 0.15], aF: [1.25, 0.45], lB: [0.04, 0], lF: [-0.04, 0] },
    wave:      { aB: [0.12, 0.15], aF: [2.3, -0.6], lB: [0.04, 0], lF: [-0.04, 0] },
    clutch:    { front: 'in', aB: [0.8, 2.0], aF: [0.8, 2.0], lB: [0.08, 0], lF: [-0.08, 0] },     // hands to chest
    bag:       { front: 'in', aB: [0.6, 1.5], aF: [1.0, 1.0], lB: [0.04, 0], lF: [-0.04, 0] },
  };
  E.blendPose = (a, b, t) => { const o = {}; for (const k of ['aB', 'aF', 'lB', 'lF']) o[k] = [E.lerp(a[k][0], b[k][0], t), E.lerp(a[k][1], b[k][1], t)]; o.front = t < 0.5 ? a.front : b.front; return o; };
  E.POSE.cheerFists = { aB: [2.75, 0.25], aF: [2.8, 0.2], lB: [0.1, 0], lF: [-0.1, 0] };
  E.POSE.neck = { front: 'in', aB: [0.12, 0.15], aF: [2.0, 2.3], lB: [0.04, 0], lF: [-0.04, 0] };   // hand behind neck (shy)
  E.POSE.palms = { front: 'in', aB: [0.5, 1.2], aF: [0.5, 1.2], lB: [0.04, 0], lF: [-0.04, 0] };    // looking at hands
  E.POSE.behind = { aB: [-0.35, -0.6], aF: [-0.3, -0.6], lB: [0.04, 0], lF: [-0.04, 0] };          // hands behind back
  E.POSE.push = { front: 'in', aB: [1.2, 0.35], aF: [1.25, 0.3], lB: [0.25, 0.15], lF: [-0.2, 0.05] }; // pushing doors
  E.walkPose = (ph, amp = 1) => { const s = Math.sin(ph * Math.PI * 2) * amp; return { aB: [-s * 0.45, 0.35], aF: [s * 0.45, 0.35], lB: [s * 0.45, Math.max(0, -s) * 0.6 + 0.05], lF: [-s * 0.45, Math.max(0, s) * 0.6 + 0.05] }; };
  E.poseAt = (t, ks) => { // ks: [[t, 'poseName'|poseObj], ...] eased transitions of 0.35s
    let cur = ks[0][1];
    for (let i = 1; i < ks.length; i++) {
      if (t >= ks[i][0]) cur = ks[i][1];
      else { const prev = typeof ks[i - 1][1] === 'string' ? E.POSE[ks[i - 1][1]] : ks[i - 1][1]; const nx = typeof ks[i][1] === 'string' ? E.POSE[ks[i][1]] : ks[i][1]; const dt = ks[i][2] || 0.35; if (t > ks[i][0] - dt) return E.blendPose(prev, nx, E.ease.io((t - (ks[i][0] - dt)) / dt)); return prev; }
    }
    return typeof cur === 'string' ? E.POSE[cur] : cur;
  };

  // ---------- main draw ----------
  // c: {x,y,h, f (facing -1..1), pose, expr, talk, blink, look:[x,y], tilt, costume, rim:{dx,dy,color,a}, alpha, bob}
  E.char = (ctx, c) => {
    const cos = typeof c.costume === 'string' ? E.COSTUME[c.costume] : c.costume || E.COSTUME.kid;
    const pose = c.pose ? (typeof c.pose === 'string' ? E.POSE[c.pose] : c.pose) : E.POSE.stand;
    const h = c.h, f = c.f === undefined ? 0.6 : c.f;
    const fd = Math.abs(f) > 0.35 ? Math.sign(f) : 0;
    const R = 0.14 * h, lw = 0.062 * h;
    const tt = c.t || 0, sd = c.seed || 0, life = c.bob === undefined ? 1 : c.bob;
    const breath = life * Math.sin(tt * 1.7 + sd) * 0.015 * h;
    const bob = breath;
    const hipY = -0.45 * h + (c.squat || 0) * h;
    const headY = -(h - R) + bob * 1.2 + (c.squat || 0) * h * 0.9;
    const neckY = headY + R * 0.9;
    const shY = neckY + 0.04 * h - breath * 0.4;
    const sway = life * Math.sin(tt * 0.9 + sd * 2.1) * 0.045;
    const lean = c.lean || 0;
    const headX = lean * h * 0.1 + f * R * 0.08;
    const shSpread = 0.065 * h * (1 - Math.abs(f) * 0.75);
    const hipSpread = 0.04 * h * (1 - Math.abs(f) * 0.7);
    const L1 = 0.165 * h, L2 = 0.15 * h, T1 = 0.235 * h, T2 = 0.215 * h;
    const inward = fd === 0 && pose.front === 'in';
    const limb = (ox, oy, ang, bend, l1, l2, side, arm) => {
      const dir = fd !== 0 ? fd : side;
      let a1 = ang * dir, a2 = a1 + bend * dir;
      if (arm && inward) { a1 = ang * 0.4 * side; a2 = a1 - bend * side; }
      if (!arm && fd === 0 && ang > 1.0) { a1 = 0.16 * side; a2 = a1; l1 *= 0.32; }
      const p1 = [ox + Math.sin(a1) * l1, oy + Math.cos(a1) * l1];
      const p2 = [p1[0] + Math.sin(a2) * l2, p1[1] + Math.cos(a2) * l2];
      return [[ox, oy], p1, p2];
    };
    const sx = lean * h * 0.06;
    const armB = limb(sx - shSpread * 1.15 - (fd ? fd * 0.01 * h : 0), shY, pose.aB[0] + sway, pose.aB[1], L1, L2, -1, true);
    const armF = limb(sx + shSpread * 1.15 + (fd ? fd * 0.01 * h : 0), shY, pose.aF[0] - sway * 0.8, pose.aF[1], L1, L2, 1, true);
    const legB = limb(-hipSpread, hipY, pose.lB[0], pose.lB[1], T1, T2, -1);
    const legF = limb(hipSpread, hipY, pose.lF[0], pose.lF[1], T1, T2, 1);
    const seated = pose.lB[0] > 1.0 && pose.lF[0] > 1.0;
    // ground: lowest foot rests on y=0 (unless lying / disabled)
    const ground = c.ground === false || c.rot || c.hipRot ? 0 : -Math.max(legB[2][1], legF[2][1]) - lw * 0.05;
    const tilt = (c.tilt || 0) + life * Math.sin(tt * 0.7 + sd * 1.3) * 0.025;
    let keySide = 1;

    const poly = (x, pts) => { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); };
    const stroke = (x, pts, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round'; poly(x, pts); x.stroke(); };
    const circ = (x, cx, cy, r, col) => { x.fillStyle = col; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); };

    const paint = (x, rim) => {
      const C = (col) => (rim ? rim : col);
      // back limbs
      stroke(x, legB, lw, C(BODY)); footAt(x, legB, C);
      stroke(x, armB, lw, C(BODY)); circ(x, armB[2][0], armB[2][1], lw * 0.62, C(BODY));
      if (cos.top && !rim) sleeve(x, armB, cos, true);
      // torso
      stroke(x, [[sx, neckY], [0, hipY]], lw * 1.15, C(BODY));
      if (cos.top) torso(x, cos, rim);
      stroke(x, legF, lw, C(BODY)); footAt(x, legF, C);
      // head + hair
      x.save(); x.translate(headX, headY); x.rotate(tilt);
      hairBack(x, cos, C);
      circ(x, 0, 0, R, C(BODY));
      hairFront(x, cos, C, rim);
      if (!rim) face(x);
      if (c.headphones) { const col = rim ? rim : '#2b2f45'; x.strokeStyle = col; x.lineWidth = R * 0.16; x.beginPath(); x.arc(0, 0, R * 1.03, Math.PI * 1.05, Math.PI * 1.95); x.stroke(); x.fillStyle = col; const ex = (fd ? -fd * 0.25 : 1) * R; x.beginPath(); x.roundRect(ex * (fd ? 1 : 1) - R * 0.32, -R * 0.4, R * 0.64, R * 0.8, R * 0.25); x.fill(); if (!fd) { x.beginPath(); x.roundRect(-R * 1.32, -R * 0.4, R * 0.64, R * 0.8, R * 0.25); x.fill(); } if (!rim) { x.fillStyle = '#ff5a6e'; x.beginPath(); x.arc(ex, 0, R * 0.12, 0, Math.PI * 2); x.fill(); } }
      x.restore();
      // front arm on top
      stroke(x, armF, lw, C(BODY)); circ(x, armF[2][0], armF[2][1], lw * 0.62, C(BODY));
      if (cos.top && !rim) sleeve(x, armF, cos, false);
      if (c.prop && !rim) c.prop(x, armF[2], armB[2], h);
    };
    const footAt = (x, leg, C) => { const p = leg[2]; const dir = fd || (leg === legB ? -1 : 1); x.strokeStyle = C(BODY); x.lineWidth = lw * 0.95; x.lineCap = 'round'; x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(p[0] + dir * lw * 0.9, p[1] + lw * 0.05); x.stroke(); };
    const sleeve = (x, arm, cs, back) => {
      if (cs.top === 'apron') return;
      const col = back ? cs.topS : cs.topC;
      const long = cs.top === 'hoodie' || cs.top === 'cardigan' || cs.top === 'suit' || cs.top === 'coat' || cs.top === 'jacket' || cs.top === 'shirt';
      const pts = long ? [arm[0], arm[1], [E.lerp(arm[1][0], arm[2][0], 0.82), E.lerp(arm[1][1], arm[2][1], 0.82)]] : [arm[0], [E.lerp(arm[0][0], arm[1][0], 0.55), E.lerp(arm[0][1], arm[1][1], 0.55)]];
      stroke(x, pts, lw * 1.25, col);
    };
    const torso = (x, cs, rim) => {
      const w1 = 0.082 * h * (1 - Math.abs(f) * 0.35), w2 = 0.07 * h * (1 - Math.abs(f) * 0.3);
      const top = neckY - 0.005 * h, bot = hipY + 0.035 * h;
      const col = rim ? rim : cs.topC;
      x.fillStyle = col; x.beginPath();
      const rr = 0.035 * h;
      x.moveTo(sx - w1, top + rr); x.quadraticCurveTo(sx - w1, top, sx - w1 + rr, top - 0.004 * h);
      x.lineTo(sx + w1 - rr, top - 0.004 * h); x.quadraticCurveTo(sx + w1, top, sx + w1, top + rr);
      x.lineTo(w2 * 1.05, bot); x.quadraticCurveTo(0, bot + 0.012 * h, -w2 * 1.05, bot); x.closePath(); x.fill();
      if (rim) return;
      // shading: lit on the key side, falling off to ~60 % on the far side
      const ld = keySide;
      x.save(); x.clip(); const sg = x.createLinearGradient(sx + ld * w1, 0, sx - ld * w1, 0); sg.addColorStop(0, 'rgba(10,4,16,0)'); sg.addColorStop(0.45, 'rgba(10,4,16,0.12)'); sg.addColorStop(1, 'rgba(10,4,16,0.45)'); x.fillStyle = sg; x.fillRect(sx - w1 * 1.6, top - 0.05 * h, w1 * 3.2, bot - top + 0.1 * h); x.restore();
      if (cs.top === 'hoodie') { // hood lump + strings
        const hb = fd ? -fd : 0;
        x.fillStyle = cs.topS; x.beginPath(); x.ellipse(sx + hb * w1 * 0.55, top + 0.01 * h, w1 * 0.85, 0.035 * h, 0, Math.PI, 0); x.fill();
        if (cs.strings) { x.strokeStyle = FACE; x.lineWidth = 0.008 * h; x.lineCap = 'round'; const so = fd * w1 * 0.25; [-1, 1].forEach((s) => { if (fd && s === -fd) return; x.beginPath(); x.moveTo(sx + so + s * w1 * 0.22, top + 0.03 * h); x.lineTo(sx + so + s * w1 * 0.26, top + 0.12 * h); x.stroke(); }); }
      }
      if (cs.top === 'cardigan') { x.fillStyle = cs.inner; x.beginPath(); x.moveTo(sx + fd * w1 * 0.25 - w1 * 0.22, top + 0.02 * h); x.lineTo(sx + fd * w1 * 0.25 + w1 * 0.22, top + 0.02 * h); x.lineTo(sx + fd * w1 * 0.2, top + 0.13 * h); x.closePath(); x.fill(); }
      if (cs.top === 'suit' || cs.top === 'shirt') { x.fillStyle = '#f4ede6'; x.beginPath(); x.moveTo(sx + fd * w1 * 0.25 - w1 * 0.25, top + 0.015 * h); x.lineTo(sx + fd * w1 * 0.25 + w1 * 0.25, top + 0.015 * h); x.lineTo(sx + fd * w1 * 0.25, top + 0.07 * h); x.closePath(); x.fill(); if (cs.tie) { x.fillStyle = cs.tie; x.beginPath(); x.moveTo(sx + fd * w1 * 0.25 - 0.012 * h, top + 0.03 * h); x.lineTo(sx + fd * w1 * 0.25 + 0.012 * h, top + 0.03 * h); x.lineTo(sx + fd * w1 * 0.25, top + 0.15 * h); x.closePath(); x.fill(); } }
      if (cs.top === 'apron') { x.fillStyle = '#4a3a3a'; x.fillRect(sx - w1, top + 0.02 * h, w1 * 2, 0.03 * h); x.fillStyle = cs.topC; x.beginPath(); x.roundRect(sx - w1 * 0.7 + fd * w1 * 0.15, top + 0.06 * h, w1 * 1.4, bot - top + 0.05 * h, 0.01 * h); x.fill(); }
      if (cs.strap) { x.strokeStyle = cs.strap; x.lineWidth = 0.014 * h; x.beginPath(); x.moveTo(sx - w1 * 0.5, top + 0.01 * h); x.lineTo(sx + w1 * 0.6, bot - 0.02 * h); x.stroke(); }
    };
    const hairBack = (x, cs, C) => {
      if (cs.hair === 'bob') { x.fillStyle = C(BODY); x.beginPath(); x.ellipse(-f * R * 0.15, R * 0.15, R * 1.18, R * 1.12, 0, 0, Math.PI * 2); x.fill(); }
      if (cs.hair === 'pony') { x.fillStyle = C(BODY); x.beginPath(); x.ellipse(-(fd || 0.6) * R * 1.05, -R * 0.1, R * 0.35, R * 0.75, -(fd || 0.6) * 0.5, 0, Math.PI * 2); x.fill(); }
      if (cs.hair === 'bun') circ(x, -(fd || 0) * R * 0.55, -R * 0.92, R * 0.42, C(BODY));
    };
    const hairFront = (x, cs, C, rim) => {
      if (cs.hair === 'tufts') { x.fillStyle = C(BODY); for (let i = -1; i <= 1; i++) { x.beginPath(); const bx = i * R * 0.42 - f * R * 0.15, by = -R * 0.9; x.moveTo(bx - R * 0.28, by + R * 0.12); x.quadraticCurveTo(bx + i * R * 0.08, by - R * 0.55, bx + R * 0.32, by + R * 0.1); x.closePath(); x.fill(); } }
      if (cs.hair === 'side') { x.fillStyle = C(BODY); x.beginPath(); x.ellipse(f * R * 0.2, -R * 0.75, R * 0.95, R * 0.4, -0.15, 0, Math.PI * 2); x.fill(); }
      if (cs.hair === 'capBack' || cs.hair === 'cap') {
        const col = rim ? rim : cs.capC; const back = cs.hair === 'capBack' ? -1 : 1; const dir = (fd || 1) * back;
        x.fillStyle = col; x.beginPath(); x.ellipse(0, -R * 0.28, R * 1.04, R * 0.82, 0, Math.PI, 0); x.fill();
        x.beginPath(); x.ellipse(dir * R * 0.95, -R * 0.3, R * 0.62 * (fd ? 1 : 0.6), R * 0.14, 0, 0, Math.PI * 2); x.fill();
        if (!rim) { x.fillStyle = E.rgba('#ffffff', 0.25); x.beginPath(); x.ellipse(-dir * R * 0.2, -R * 0.75, R * 0.45, R * 0.14, -0.2, 0, Math.PI * 2); x.fill(); }
      }
      if (cs.hair === 'flatcap') { const col = rim ? rim : cs.capC; x.fillStyle = col; x.beginPath(); x.ellipse(f * R * 0.15, -R * 0.62, R * 1.05, R * 0.42, 0, Math.PI, 0); x.fill(); x.beginPath(); x.ellipse((fd || 0.4) * R * 0.75, -R * 0.62, R * 0.55, R * 0.12, 0, 0, Math.PI * 2); x.fill(); }
      if (cs.hair === 'bob') { x.fillStyle = C(BODY); x.beginPath(); x.ellipse(f * R * 0.25, -R * 0.55, R * 1.05, R * 0.55, 0.1 * f, Math.PI, 0); x.fill(); if (!rim && cs.clip) { x.fillStyle = cs.clip; x.save(); x.translate(-f * R * 0.45 + (fd ? 0 : R * 0.55), -R * 0.62); x.rotate(-0.5); x.beginPath(); x.roundRect(-R * 0.2, -R * 0.07, R * 0.4, R * 0.14, R * 0.07); x.fill(); x.restore(); } }
    };
    const face = (x) => {
      const fa = c.faceAlpha === undefined ? 1 : c.faceAlpha; if (fa <= 0) return;
      x.save(); x.globalAlpha *= fa;
      const ex = f * R * 0.36, ey = -R * 0.08, sp = R * 0.3 * (1 - Math.abs(f) * 0.35);
      const lk = c.look || [0, 0]; const lx = lk[0] * R * 0.1, ly = lk[1] * R * 0.1;
      const expr = c.expr || 'neutral';
      x.strokeStyle = FACE; x.fillStyle = FACE; x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = R * 0.085;
      const eyes = [[ex - sp, ey], [ex + sp, ey]];
      const blink = c.blink !== undefined ? c.blink : blinkAt(c.t || 0, c.seed || 0);
      const eyeR = R * 0.105;
      for (const [px, py] of eyes) {
        const X = px + lx, Y = py + ly;
        if (blink) { x.beginPath(); x.moveTo(X - eyeR, Y); x.lineTo(X + eyeR, Y); x.stroke(); continue; }
        if (expr === 'happy' || expr === 'laugh') { x.beginPath(); x.arc(X, Y + eyeR * 0.5, eyeR * 1.15, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); }
        else if (expr === 'shock' || expr === 'amazed') { x.lineWidth = R * 0.06; x.beginPath(); x.arc(X, Y, eyeR * 2.1, 0, Math.PI * 2); x.stroke(); circ(x, X + lx * 0.5, Y + ly * 0.5, eyeR * 0.85, FACE); x.lineWidth = R * 0.085; }
        else if (expr === 'squint') { x.beginPath(); const s = px < ex ? 1 : -1; x.moveTo(X - eyeR * s, Y - eyeR); x.lineTo(X + eyeR * s, Y); x.lineTo(X - eyeR * s, Y + eyeR); x.stroke(); }
        else if (expr === 'smug' || expr === 'tired') { circ(x, X, Y + eyeR * 0.25, eyeR * 0.9, FACE); x.fillStyle = BODY; x.fillRect(X - eyeR * 1.4, Y - eyeR * 1.4, eyeR * 2.8, eyeR * 1.4); x.fillStyle = FACE; x.beginPath(); x.moveTo(X - eyeR * 1.2, Y - eyeR * 0.05); x.lineTo(X + eyeR * 1.2, Y - eyeR * 0.05); x.stroke(); }
        else circ(x, X, Y, eyeR * (expr === 'wide' ? 1.35 : 1), FACE);
      }
      // brows
      const brow = { worried: [0.35, -1], sad: [0.3, -1], angry: [0.35, 1], shock: [0, 0, -0.5], amazed: [0, 0, -0.5], smug: [0.2, 0], awkward: [0, 0, -0.3], hurt: [0.3, -1], nervous: [0.3, -1] }[expr];
      if (brow) for (const [px] of eyes) { const s = px < ex ? -1 : 1; let by = ey - R * (0.32 + (brow[2] ? -brow[2] * 0.3 : 0)); if (cos.hair === 'cap' || cos.hair === 'capBack') by = Math.max(by, -R * 0.2); const tiltB = -brow[0] * brow[1] * s; x.lineWidth = R * 0.07; x.beginPath(); x.moveTo(px + lx - R * 0.14, by - tiltB * R * 0.12); x.lineTo(px + lx + R * 0.14, by + tiltB * R * 0.12); x.stroke(); }
      // mouth
      const mx = ex + lx * 0.6, my = R * 0.4 + ly * 0.5, talk = E.clamp(c.talk || 0);
      x.lineWidth = R * 0.08;
      const talkK = talk * (c.talkScale || 1);
      if (talkK > 0.06 && ['happy', 'smile', 'laugh', 'smug', 'amazed2'].includes(expr)) { const w = R * 0.26, hh = R * (0.06 + talkK * 0.22); x.beginPath(); x.moveTo(mx - w, my - R * 0.06); x.quadraticCurveTo(mx, my - R * 0.1, mx + w, my - R * 0.06); x.quadraticCurveTo(mx + w * 0.8, my + hh * 1.4, mx, my + hh * 1.5); x.quadraticCurveTo(mx - w * 0.8, my + hh * 1.4, mx - w, my - R * 0.06); x.fill(); }
      else if (talkK > 0.06 && ['sad', 'hurt', 'worried', 'nervous'].includes(expr)) { const w = R * (0.15 + talkK * 0.06), hh = R * (0.05 + talkK * 0.16); x.beginPath(); x.moveTo(mx - w, my + hh); x.quadraticCurveTo(mx, my - hh * 1.4, mx + w, my + hh); x.quadraticCurveTo(mx, my + hh * 1.6, mx - w, my + hh); x.fill(); }
      else if (talkK > 0.06) { const ow = R * (0.15 + talkK * 0.11), oh = R * (0.05 + talkK * 0.22); x.beginPath(); x.ellipse(mx, my + oh * 0.3, ow, oh, 0, 0, Math.PI * 2); x.fill(); }
      else if (expr === 'happy' || expr === 'laugh' || expr === 'amazed2') { x.beginPath(); x.arc(mx, my - R * 0.12, R * 0.28, Math.PI * 0.2, Math.PI * 0.8); x.stroke(); if (expr === 'laugh') { x.beginPath(); x.arc(mx, my - R * 0.08, R * 0.24, 0, Math.PI); x.fill(); } }
      else if (expr === 'smile' || expr === 'neutral_smile') { x.beginPath(); x.arc(mx, my - R * 0.18, R * 0.24, Math.PI * 0.28, Math.PI * 0.72); x.stroke(); }
      else if (expr === 'smug') { x.beginPath(); x.moveTo(mx - R * 0.18, my - R * 0.02); x.quadraticCurveTo(mx + R * 0.05, my + R * 0.08, mx + R * 0.24, my - R * 0.12); x.stroke(); }
      else if (expr === 'shock' || expr === 'amazed') { x.beginPath(); x.ellipse(mx, my + R * 0.04, R * 0.1, R * 0.15, 0, 0, Math.PI * 2); x.fill(); }
      else if (expr === 'worried' || expr === 'nervous') { x.beginPath(); for (let i = 0; i <= 12; i++) { const px = mx - R * 0.2 + (i / 12) * R * 0.4, py = my + Math.sin(i / 12 * Math.PI * 3) * R * 0.04; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
      else if (expr === 'awkward') { x.beginPath(); x.roundRect(mx - R * 0.26, my - R * 0.03, R * 0.52, R * 0.1, R * 0.05); x.fill(); }
      else if (expr === 'sad' || expr === 'hurt') { x.beginPath(); x.arc(mx, my + R * 0.16, R * 0.18, Math.PI * 1.25, Math.PI * 1.75); x.stroke(); }
      else if (expr === 'angry') { x.beginPath(); x.moveTo(mx - R * 0.17, my + R * 0.03); x.lineTo(mx + R * 0.17, my + R * 0.03); x.stroke(); }
      else if (expr === 'squint') { x.beginPath(); x.moveTo(mx - R * 0.2, my); x.lineTo(mx + R * 0.2, my); x.stroke(); }
      else if (expr === 'neutral' || expr === 'tired') { x.beginPath(); x.moveTo(mx - R * 0.12, my + R * 0.02); x.lineTo(mx + R * 0.12, my + R * 0.02); x.stroke(); }
      if (cos.glasses) { x.strokeStyle = FACE; x.lineWidth = R * 0.045; for (const [px, py] of eyes) { x.beginPath(); x.arc(px + lx, py + ly, R * 0.2, 0, Math.PI * 2); x.stroke(); } x.beginPath(); x.moveTo(eyes[0][0] + R * 0.2 + lx, ey + ly); x.lineTo(eyes[1][0] - R * 0.2 + lx, ey + ly); x.stroke(); }
      x.restore();
    };

    ctx.save();
    ctx.translate(c.x, c.y);
    if (c.scaleX) ctx.scale(c.scaleX, 1);
    if (c.rot) ctx.rotate(c.rot);
    if (c.hipRot) { ctx.translate(0, hipY); ctx.rotate(c.hipRot); ctx.translate(0, -hipY); }
    if (c.alpha !== undefined) ctx.globalAlpha *= c.alpha;
    if (c.shadow !== false && !c.rot && !c.hipRot && h < 900) { ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = '#0a0410'; ctx.beginPath(); ctx.ellipse(0, -lw * 0.1, 0.13 * h, 0.022 * h, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    ctx.translate(0, ground);
    if (seated && c.seat !== false) { const sx0 = -0.09 * h - (fd < 0 ? 0.06 * h : 0), sw = 0.24 * h; ctx.fillStyle = c.seat || '#2a1826'; ctx.fillRect(sx0 + (fd > 0 ? -0.05 * h : 0), hipY + 0.02 * h, sw, 0.035 * h); ctx.fillRect(sx0 + 0.02 * h, hipY + 0.05 * h, 0.025 * h, -hipY - 0.05 * h - ground); ctx.fillRect(sx0 + sw - 0.09 * h, hipY + 0.05 * h, 0.025 * h, -hipY - 0.05 * h - ground); }
    let rim = c.rim === false ? null : Object.assign({ dx: 1, dy: -0.3, color: '#f0a77e', a: 1 }, c.rim || {});
    if (rim) { const L = Math.hypot(rim.dx, rim.dy) || 1, mag = E.clamp(0.013 * h, 2.5, 18) * (rim.k || 1); rim = Object.assign({}, rim, { dx: (rim.dx / L) * mag, dy: (rim.dy / L) * mag }); ctx.save(); ctx.globalAlpha *= rim.a; ctx.translate(rim.dx, rim.dy); paint(ctx, rim.color); ctx.restore(); }
    keySide = rim ? Math.sign(rim.dx || 1) : 1;
    paint(ctx, null);
    ctx.restore();
  };
  const blinkAt = (t, seed) => { const period = 3.2 + (seed % 5) * 0.37; const ph = (t + seed * 1.13) % period; return ph < 0.09; };
})();
// ---------- hand props (pass as c.prop) ----------
(function () {
  const E = globalThis.E;
  E.PROP = {
    cup: (x, hf, hb, h) => { const s = h * 0.055; x.save(); x.translate(hf[0], hf[1] - s * 0.6); x.fillStyle = '#efe6dc'; x.beginPath(); x.moveTo(-s * 0.55, -s * 0.7); x.lineTo(s * 0.55, -s * 0.7); x.lineTo(s * 0.45, s * 0.6); x.lineTo(-s * 0.45, s * 0.6); x.closePath(); x.fill(); x.fillStyle = '#6b3a2a'; x.beginPath(); x.ellipse(0, -s * 0.7, s * 0.55, s * 0.14, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#c8302f'; x.fillRect(-s * 0.5, -s * 0.15, s, s * 0.25); x.restore(); },
    phone: (x, hf, hb, h) => { const s = h * 0.05; x.save(); x.translate(hf[0], hf[1] - s * 0.4); x.rotate(-0.2); x.fillStyle = '#1c1c2a'; x.beginPath(); x.roundRect(-s * 0.35, -s * 0.7, s * 0.7, s * 1.3, s * 0.12); x.fill(); x.fillStyle = '#8fb4ff'; x.fillRect(-s * 0.27, -s * 0.6, s * 0.54, s * 1.05); x.restore(); },
    letter: (x, hf, hb, h) => { const s = h * 0.12; const cx = (hf[0] + hb[0]) / 2, cy = (hf[1] + hb[1]) / 2 - s * 0.2; x.save(); x.translate(cx, cy); x.rotate(-0.05); x.fillStyle = '#f4ede6'; x.fillRect(-s * 0.45, -s * 0.6, s * 0.9, s * 1.1); x.fillStyle = '#b9a99a'; for (let i = 0; i < 5; i++) x.fillRect(-s * 0.33, -s * 0.4 + i * s * 0.16, s * (0.66 - (i === 4 ? 0.3 : 0)), s * 0.04); x.fillStyle = '#c8302f'; x.beginPath(); x.arc(s * 0.25, s * 0.32, s * 0.08, 0, Math.PI * 2); x.fill(); x.restore(); },
    folded: (x, hf, hb, h) => { const s = h * 0.07; x.save(); x.translate(hf[0], hf[1] - s * 0.3); x.rotate(-0.3); x.fillStyle = '#f4ede6'; x.fillRect(-s * 0.5, -s * 0.35, s, s * 0.7); x.strokeStyle = '#c9b9aa'; x.lineWidth = 2; x.beginPath(); x.moveTo(-s * 0.5, 0); x.lineTo(s * 0.5, 0); x.stroke(); x.restore(); },
    tray: (x, hf, hb, h) => { const s = h * 0.13; const cx = (hf[0] + hb[0]) / 2, cy = Math.min(hf[1], hb[1]); x.save(); x.translate(cx, cy); x.fillStyle = '#c9c0c8'; x.fillRect(-s * 0.6, -s * 0.06, s * 1.2, s * 0.1); x.fillStyle = '#e8a070'; x.beginPath(); x.arc(-s * 0.2, -s * 0.06, s * 0.16, Math.PI, 0); x.fill(); x.restore(); },
  };
})();
// ---------- in bed (V3) ----------
// Hip fixed on the mattress top; torso pivots from lying (u=0) to sitting (u=1) while the legs stay
// flat under the duvet. o: {x (hip x), y (mattress top), h, f (±1 = direction the legs point), u,
// arms (pose name for the arms), duvet (colour | false), + any E.char options}.
(function () {
  const E = globalThis.E;
  E.inBed = (ctx, o) => {
    const dir = Math.sign(o.f || 1), th = (Math.PI / 2) * (1 - E.clamp(o.u || 0));
    const lw = 0.062 * o.h, hipY = -0.45 * o.h, ang = Math.PI / 2 - th;
    const arms = E.POSE[o.arms || 'sit'];
    const pose = Object.assign({}, arms, { lB: [ang, 0], lF: [ang + 0.02, 0] });
    E.char(ctx, Object.assign({}, o, { y: o.y - hipY - lw * 0.6, pose, hipRot: -dir * th || -dir * 1e-6, ground: false, seat: false, shadow: false }));
    if (o.duvet !== false) { const L = 0.44 * o.h; ctx.save(); ctx.fillStyle = o.duvet || '#4a3d78'; ctx.beginPath(); ctx.roundRect(dir > 0 ? o.x - 0.06 * o.h : o.x - L, o.y - lw * 1.7, L + 0.06 * o.h, lw * 2.3, lw * 0.9); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(dir > 0 ? o.x - 0.06 * o.h : o.x - L, o.y - lw * 1.7, L + 0.06 * o.h, lw * 0.35); ctx.restore(); }
  };
})();
