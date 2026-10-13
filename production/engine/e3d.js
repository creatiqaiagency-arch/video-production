// 2.5D: a tiny perspective engine so flat-shaded SVG scenes get a real 3D camera (orbit / dolly / crane).
// World units = cm. X right, Y up, Z forward (away from the default camera). Painter's sort by depth.
function cam3(o) { // {x,y,z, yaw (deg, + turns right), pitch (deg, + looks down), f (focal px)}
  const cy = Math.cos(o.yaw * R), sy = Math.sin(o.yaw * R), cp = Math.cos(o.pitch * R), sp = Math.sin(o.pitch * R);
  return { ...o, cy, sy, cp, sp, f: o.f || 1100 };
}
function proj(c, p) {
  const dx = p[0] - c.x, dy = p[1] - c.y, dz = p[2] - c.z;
  const x1 = dx * c.cy - dz * c.sy, z1 = dx * c.sy + dz * c.cy; // yaw
  const y2 = dy * c.cp + z1 * c.sp, z2 = -dy * c.sp + z1 * c.cp;  // pitch
  return [960 + x1 / z2 * c.f, 540 - y2 / z2 * c.f, z2];
}
const NEAR = 30;
// a flat-shaded polygon in 3D: returns {d, svg} or null when behind the camera
function face3(c, pts, fill, attrs = {}) {
  const P = pts.map(p => proj(c, p));
  if (P.some(q => q[2] < NEAR)) return null;
  const d = P.reduce((a, q) => a + q[2], 0) / P.length;
  return { d: attrs.depth ?? d, svg: poly(P.map(q => [q[0], q[1]]), fill, attrs) };
}
function line3(c, a, b, col, w, attrs = {}) {
  const A = proj(c, a), B = proj(c, b); if (A[2] < NEAR || B[2] < NEAR) return null;
  return { d: (A[2] + B[2]) / 2, svg: line(A[0], A[1], B[0], B[1], col, w * c.f / ((A[2] + B[2]) / 2) / 4) };
}
// axis-aligned box [x0,x1]x[y0,y1]x[z0,z1]; cols = {top, side, front}
function box3(c, x0, x1, y0, y1, z0, z1, cols) {
  const out = [], v = (x, y, z) => [x, y, z];
  const fcs = [
    [[v(x0, y1, z0), v(x1, y1, z0), v(x1, y1, z1), v(x0, y1, z1)], cols.top],
    [[v(x0, y0, z0), v(x1, y0, z0), v(x1, y1, z0), v(x0, y1, z0)], cols.front],
    [[v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1)], cols.front],
    [[v(x0, y0, z0), v(x0, y0, z1), v(x0, y1, z1), v(x0, y1, z0)], cols.side],
    [[v(x1, y0, z0), v(x1, y0, z1), v(x1, y1, z1), v(x1, y1, z0)], cols.side],
  ];
  // back-face culling: only faces turned toward the camera
  const vis = [c.y > y1, c.z < z0, c.z > z1, c.x < x0, c.x > x1];
  fcs.forEach(([p, col], i) => { if (!vis[i]) return; const f = face3(c, p, col); if (f) out.push(f); });
  return out;
}
// a character standing at world point (x, 0, z): a camera-facing billboard scaled by depth
function figAt(c, x, z, o) {
  const P = proj(c, [x, 0, z]); if (P[2] < NEAR) return null;
  const hpx = 175 * c.f / P[2] * (o.child ? .7 : 1);
  const s = hpx / 4.6;
  return { d: P[2], svg: shadowAt(P[0], P[1], s * 1.1) + fig({ ...o, x: P[0], y: P[1], s }) };
}
function arcPts(cx, cy, r, a0, a1, n) { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n) * R; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }

// ---------- TABLE-TENNIS HALL in 3D (matches the reference's arched-window hall) ----------
function gym3d(c, t, actors = []) {
  const items = [];
  const HW = 1150, D0 = -700, D1 = 1500, WH = 760;
  // floor planks (tiles so the near ones clip cleanly)
  for (let i = 0; i < 23; i++) for (let k = 0; k < 22; k++) {
    const x0 = -HW + i * 100, z0 = D0 + k * 100, shade = mix('#6a4232', '#4a2e24', (k / 22) * .6 + ((i + k) % 2) * .06);
    const f = face3(c, [[x0, 0, z0], [x0 + 100, 0, z0], [x0 + 100, 0, z0 + 100], [x0, 0, z0 + 100]], shade, { stroke: '#3e261d', 'stroke-width': 1, depth: 1e6 + 1 });
    if (f) items.push(f);
  }
  // court line ellipse-ish rectangle on the floor
  for (const [a, b] of [[[-420, .5, 300], [420, .5, 300]], [[420, .5, 300], [420, .5, 1100]], [[420, .5, 1100], [-420, .5, 1100]], [[-420, .5, 1100], [-420, .5, 300]]]) { const l = line3(c, a, b, '#e0c39a', 10); if (l) items.push({ d: 1e6, svg: g(l.svg, { opacity: .35 }) }); }
  // walls
  const wallBack = face3(c, [[-HW, 0, D1], [HW, 0, D1], [HW, WH, D1], [-HW, WH, D1]], lgrad([[0, '#2a1820'], [1, '#4a2e30']]), { depth: 2e6 });
  if (wallBack) items.push(wallBack);
  for (const sx of [-1, 1]) { const f = face3(c, [[sx * HW, 0, D0], [sx * HW, 0, D1], [sx * HW, WH, D1], [sx * HW, WH, D0]], sx < 0 ? '#3a2226' : '#2c1a1e', { depth: 1.9e6 }); if (f) items.push(f); }
  const ceil = face3(c, [[-HW, WH, D0], [HW, WH, D0], [HW, WH, D1], [-HW, WH, D1]], '#1e1216', { depth: 1.95e6 }); if (ceil) items.push(ceil);
  for (let i = 0; i < 4; i++) { const z = 100 + i * 380; items.push(...box3(c, -HW, HW, WH - 40, WH, z, z + 30, { top: '#160d11', side: '#24161b', front: '#2a1a1f' }).map(f => ({ ...f, d: 1.94e6 }))); }
  // arched windows on the back wall + mullions
  const wins = [-500, 0, 500];
  for (const wx of wins) {
    const outline = [[wx - 150, 100], [wx + 150, 100], ...arcPts(wx, 450, 150, 0, 180, 16)];
    const fr = face3(c, outline.map(([x, y]) => [x, y, D1 - 1]), '#1c1016', { depth: 1.8e6 }); if (fr) items.push(fr);
    const gl = face3(c, outline.map(([x, y]) => [wx + (x - wx) * .9, 110 + (y - 110) * .96, D1 - 2]), lgrad(SKY.dusk.map(([a, b]) => [a, b])), { depth: 1.7e6 }); if (gl) items.push(gl);
    for (let k = 1; k < 5; k++) { const l = line3(c, [wx - 135, 100 + k * 80, D1 - 3], [wx + 135, 100 + k * 80, D1 - 3], '#1c1016', 14); if (l) items.push({ d: 1.6e6, svg: l.svg }); }
    const m = line3(c, [wx, 100, D1 - 3], [wx, 590, D1 - 3], '#1c1016', 14); if (m) items.push({ d: 1.6e6, svg: m.svg });
    const gp = proj(c, [wx, 330, D1]); if (gp[2] > NEAR) items.push({ d: 1.55e6, svg: glow(gp[0], gp[1], 260 * c.f / gp[2] * 3, '#ffb46a', .22) });
    // volumetric light shaft from the window down onto the floor (toward camera)
    const sh = face3(c, [[wx - 135, 540, D1 - 5], [wx + 135, 540, D1 - 5], [wx + 190, 0, 520], [wx - 70, 0, 520]], lgrad([[0, '#ffc98a', .18], [1, '#ffc98a', 0]], 0, 0, 0, 1), { style: SCREEN, depth: 1.5e6 }); if (sh) items.push(sh);
    const pool = face3(c, [[wx - 70, 1, 560], [wx + 170, 1, 560], [wx + 140, 1, 980], [wx - 100, 1, 980]], '#ffc98a', { opacity: .12, style: SCREEN, depth: 1e6 - 1 }); if (pool) items.push(pool);
  }
  // the table: top, white edge lines, net, legs (long axis along X, centred at z=700)
  const TZ = 700;
  items.push(...box3(c, -137, 137, 72, 76, TZ - 76, TZ + 76, { top: '#1f4a6a', side: '#173a54', front: '#173a54' }));
  for (const [a, b] of [[[-137, 76.5, TZ - 76], [137, 76.5, TZ - 76]], [[-137, 76.5, TZ + 76], [137, 76.5, TZ + 76]], [[-137, 76.5, TZ - 76], [-137, 76.5, TZ + 76]], [[137, 76.5, TZ - 76], [137, 76.5, TZ + 76]], [[-137, 76.5, TZ], [137, 76.5, TZ]]]) { const l = line3(c, a, b, '#e8eef2', 9); if (l) items.push({ d: l.d - 1, svg: l.svg }); }
  const net = face3(c, [[0, 76, TZ - 82], [0, 76, TZ + 82], [0, 92, TZ + 82], [0, 92, TZ - 82]], '#d8e0e6', { opacity: .55 }); if (net) items.push({ ...net, d: net.d - 2 });
  for (const lx of [-110, 110]) for (const lz of [TZ - 60, TZ + 60]) items.push(...box3(c, lx - 3, lx + 3, 0, 72, lz - 3, lz + 3, { top: '#120c16', side: '#120c16', front: '#120c16' }));
  for (const a of actors) if (a) items.push(a);
  items.sort((a, b) => b.d - a.d);
  return items.map(i => i.svg).join('') + motes(t, 40, 13, [0, 100, 1920, 900]);
}

Object.assign(SHOTS_REG, {
  // 3D version of the rally wide: the camera cranes down and orbits ~35° around the table while the rally plays
  g_wide3d(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const yaw = lerp(-28, 10, p), dist = lerp(980, 720, p), ch = lerp(330, 210, p);
    const cx = Math.sin(yaw * R) * -dist, cz = 700 - Math.cos(yaw * R) * dist;
    const c = cam3({ x: cx, y: ch, z: cz, yaw, pitch: lerp(15, 9, p), f: 1150 });
    const per = 1.1, u = (lt % per) / per, dir = Math.floor(lt / per) % 2;
    const leoHit = dir === 1 && u > .75, samHit = dir === 0 && u > .75;
    const actors = [
      figAt(c, -235, 700, { fc: 1, who: 'leo', pose: leoHit ? 'swing' : mixPose(POSES.paddleReady, POSES.swing, dir === 0 && u < .2 ? 1 - u * 5 : 0), expr: 'happy', t: gt, extra: withPaddle(40) }),
      figAt(c, 235, 700, { fc: -1, who: 'sam', pose: samHit ? 'swing' : mixPose(POSES.paddleReady, POSES.swing, dir === 1 && u < .2 ? 1 - u * 5 : 0), expr: 'determined', t: gt, extra: withPaddle(-40) }),
      figAt(c, 640, 1150, { fc: -1, who: 'nora', pose: 'sit', expr: 'happy', t: gt }),
      ...box3(c, 520, 780, 38, 46, 1120, 1180, { top: '#5a3628', side: '#3a2520', front: '#4a2e24' }),
    ];
    // the ball: real 3D arc over the net with a bounce on the far half, squash on contact
    const xa = dir ? 160 : -160, xb = dir ? -160 : 160, bu = u < .55 ? u / .55 : (u - .55) / .45;
    const bx = u < .55 ? lerp(xa, xb * .45, bu) : lerp(xb * .45, xb, bu), by = u < .55 ? 100 + 60 * Math.sin(bu * Math.PI) - bu * 24 : 77 + 50 * Math.sin(bu * Math.PI) + bu * 20;
    const BP = proj(c, [bx, by, 700 + Math.sin(lt * 3) * 20]);
    if (BP[2] > NEAR) { const r = 4 * c.f / BP[2] * 1.2, near = Math.abs(u - .55) < .03 ? .3 : 0; actors.push({ d: BP[2] - 5, svg: `<g transform="translate(${f1(BP[0])} ${f1(BP[1] + r)}) scale(${1 + near * .8} ${1 - near}) translate(${f1(-BP[0])} ${f1(-BP[1] - r)})">` + pingball(BP[0], BP[1], Math.max(4, r)) + '</g>' }); }
    return gym3d(c, gt, actors) + vignette(.35);
  },
});

// ---------- generic helpers ----------
// box rotated about Y (ang deg) around (cx, cz), half sizes hx/hz
function boxR(c, cx, cz, hx, hz, y0, y1, ang, cols) {
  const ca = Math.cos(ang * R), sa = Math.sin(ang * R), P = (x, y, z) => [cx + x * ca - z * sa, y, cz + x * sa + z * ca];
  const out = [], q = [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]];
  if (c.y > y1) { const top = face3(c, q.map(([x, z]) => P(x, y1, z)), cols.top); if (top) out.push(top); }
  for (let i = 0; i < 4; i++) { const [a, b] = [q[i], q[(i + 1) % 4]]; const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, [wx, , wz] = P(mx, 0, mz), nx = mx * ca - mz * sa, nz = mx * sa + mz * ca;
    if (nx * (c.x - wx) + nz * (c.z - wz) <= 0) continue;
    const f = face3(c, [P(a[0], y0, a[1]), P(b[0], y0, b[1]), P(b[0], y1, b[1]), P(a[0], y1, a[1])], i % 2 ? cols.side : cols.front); if (f) out.push(f); }
  return out;
}
function groundEll(c, x, z, rx, rz, col, op, depth) { const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * 2 * Math.PI; pts.push([x + Math.cos(a) * rx, 1, z + Math.sin(a) * rz]); } const f = face3(c, pts, col, { opacity: op, style: SCREEN, depth }); return f; }
function skyBg(c, t) {
  let s = rect(0, 0, W, H, lgrad([[0, '#140f2a'], [.55, '#2a2048'], [1, '#4a3058']]));
  for (let i = 0; i < 70; i++) { const x = ((rnd(i) * 2400 - c.yaw * 14) % 2400 + 2400) % 2400 - 240, y = rnd(i * 3) * 600 - c.pitch * 12; s += circ(x, y, rnd(i * 5) * 1.6 + .4, '#fff', { opacity: .3 + rnd(i * 7) * .5 }); }
  const m = proj(c, [-6000, 9000, 30000]); if (m[2] > 0) s += glow(m[0], m[1], 140, '#e8e4ff', .3) + circ(m[0], m[1], 26, '#f4f0ff');
  return s;
}

// ---------- THE CROSSING in 3D ----------
// X: along the road (truck comes from +X). Z: 0 = near curb, 0..700 road, 700..1000 far sidewalk, shops beyond. Near sidewalk Z<0.
const X3 = x2 => (x2 - 1150) * 1.1;               // 2D IXP x → world X
const Z3 = { walk: -130, road: 200, lane: 170 };
function truck3d(c, x, z, ang = 0, o = {}) {
  const out = [], ca = Math.cos(ang * R), sa = Math.sin(ang * R);
  const at = (dx, dz) => [x + dx * ca - dz * sa, z + dx * sa + dz * ca];
  const [kx, kz] = at(260, 0);   // cargo centre (behind the cab, +X)
  out.push(...boxR(c, kx, kz, 260, 120, 45, 330, ang, { top: '#8c8696', side: '#7c7684', front: '#9a92a0' }));
  const [bx, bz] = at(-80, 0);   // cab
  out.push(...boxR(c, bx, bz, 80, 112, 35, 240, ang, { top: '#8a2a30', side: '#a83a3a', front: '#b5323a' }));
  const [wx, wz] = at(-161, 0);  // windshield on the cab front
  out.push(...boxR(c, wx, wz, 1, 92, 140, 225, ang, { top: '#3a4a66', side: '#3a4a66', front: '#3a4a66' }));
  for (const [dx, dz] of [[-90, -114], [-90, 114], [330, -114], [330, 114], [440, -114], [440, 114]]) { const [ex, ez] = at(dx, dz); out.push(...boxR(c, ex, ez, 38, 14, 0, 70, ang, { top: '#0e0a10', side: '#0e0a10', front: '#1b151d' })); }
  if (o.lights !== false) {
    for (const dz of [-80, 80]) { const [hx, hz] = at(-163, dz), P = proj(c, [hx, 80, hz]); if (P[2] > NEAR) { const r = 34 * c.f / P[2]; out.push({ d: P[2] - 30, svg: glow(P[0], P[1], r * 9, '#fff2c4', .75) + glow(P[0], P[1], r * 2.5, '#ffffff', .95) + circ(P[0], P[1], r, '#fffbe8') }); } }
    const [ax, az] = at(-170, -100), [bx2, bz2] = at(-170, 100), [cx2, cz2] = at(-1500, 420), [dx2, dz2] = at(-1500, -420);
    const cone = face3(c, [[ax, 2, az], [bx2, 2, bz2], [cx2, 2, cz2], [dx2, 2, dz2]], lgrad([[0, '#fff2c4', .45], [1, '#fff2c4', 0]], 1, 0, 0, 0), { style: SCREEN, depth: 1e6 - 2 }); if (cone) out.push(cone);
  }
  if (o.hazard) for (const dx of [-163, 518]) { const [hx, hz] = at(dx, -118), P = proj(c, [hx, 60, hz]); if (P[2] > NEAR) out.push({ d: P[2] - 30, svg: glow(P[0], P[1], 2200 / P[2] * 40, '#ffb000', o.hazard) }); }
  return out;
}
function street3d(c, t, actors = [], o = {}) {
  const items = [];
  const X0 = -3200, X1 = 3600;
  // road / sidewalks as strips of tiles (clip-friendly)
  for (let x = X0; x < X1; x += 200) {
    const T = (z0, z1, col, dp) => { const f = face3(c, [[x, 0, z0], [x + 200, 0, z0], [x + 200, 0, z1], [x, 0, z1]], col, { depth: dp, stroke: col, 'stroke-width': 1 }); if (f) items.push(f); };
    T(-2800, -15, '#3a3247', 1e6 + 3);
    const sm = line3(c, [x, 1, -2800], [x, 1, -15], '#2a2336', 10); if (sm) items.push({ d: 1e6 + 2.5, svg: sm.svg }); T(0, 700, '#1d1828', 1e6 + 3); T(715, 1000, '#33293f', 1e6 + 3);
    const cu = face3(c, [[x, 0, -15], [x + 200, 0, -15], [x + 200, 15, 0], [x, 15, 0]], '#9a8ca6', { depth: 1e6 + 2 }); if (cu) items.push(cu);
    const cf = face3(c, [[x, 0, 700], [x + 200, 0, 700], [x + 200, 15, 715], [x, 15, 715]], '#7a6c86', { depth: 1e6 + 2 }); if (cf) items.push(cf);
    if ((x / 200) % 2 === 0) { const ds = face3(c, [[x, 1, 345], [x + 110, 1, 345], [x + 110, 1, 355], [x, 1, 355]], '#8c8496', { opacity: .6, depth: 1e6 + 1 }); if (ds) items.push(ds); }
  }
  for (let i = 0; i < 7; i++) { const sx = -190 + i * 60; const f = face3(c, [[sx, 1, 30], [sx + 34, 1, 30], [sx + 34, 1, 670], [sx, 1, 670]], '#8e86a0', { opacity: .45, depth: 1e6 + 1 }); if (f) items.push(f); }
  // shop row beyond the far sidewalk
  for (let i = 0; i < 14; i++) {
    const bx = X0 + 200 + i * 480, h = 520 + rnd(i * 7) * 420, col = ['#3a2a3e', '#46303e', '#3d2c40', '#4a3340'][i % 4];
    items.push(...box3(c, bx, bx + 440, 0, h, 1000, 1400, { top: '#1d1622', side: mix(col, '#000000', .3), front: col }).map(f => ({ ...f, d: f.d + 4000 })));
    const fd = proj(c, [bx + 220, h / 2, 1000])[2] + 3990;
    const sh = face3(c, [[bx + 30, 30, 999], [bx + 410, 30, 999], [bx + 410, 200, 999], [bx + 30, 200, 999]], '#f0a85a', { depth: fd }); if (sh) items.push(sh);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { if (260 + r * 110 + 80 > h) continue; const wx = bx + 40 + k * 100, wy = 260 + r * 110, lit = rnd(i * 13 + r * 4 + k) < .55; const f = face3(c, [[wx, wy, 999], [wx + 60, wy, 999], [wx + 60, wy + 70, 999], [wx, wy + 70, 999]], lit ? '#f2b866' : '#22161f', { depth: fd }); if (f) items.push(f); }
    const g0 = proj(c, [bx + 220, 110, 990]); if (g0[2] > NEAR) items.push({ d: fd - 1, svg: glow(g0[0], g0[1], 260000 / g0[2], '#ffb45c', .25) });
    if (i === 7) items.push(...box3(c, bx + 20, bx + 420, 200, 215, 900, 1000, { top: '#a83a3d', side: '#a83a3d', front: '#e8d9cf' }).map(f => ({ ...f, d: fd - 2 })));
  }
  // lamps (near + far side) with sodium pools
  for (const [lx, lz] of [[-1700, -60], [-500, 760], [700, -60], [1900, 760], [-2900, 760], [3100, -60]]) {
    items.push(...box3(c, lx - 6, lx + 6, 0, 430, lz - 6, lz + 6, { top: '#120c16', side: '#120c16', front: '#1b151d' }));
    const hp = proj(c, [lx, 430, lz]); if (hp[2] > NEAR) items.push({ d: hp[2] - 1, svg: glow(hp[0], hp[1], 90000 / hp[2], '#ffc477', .55) + circ(hp[0], hp[1], 3000 / hp[2], '#fff1c9') });
    const pool = groundEll(c, lx, lz + (lz < 0 ? -40 : 40), 340, 200, '#ffb35c', .3, 1e6); if (pool) items.push(pool);
  }
  // the barrier on the far curb, far left (where the truck ends up)
  items.push(...box3(c, -2300, -1900, 0, 90, 725, 745, { top: '#e6dfd5', side: '#c13a3a', front: '#c9c2b8' }));
  for (const a of actors.flat()) if (a) items.push(a);
  items.sort((a, b) => b.d - a.d);
  return skyBg(c, t) + items.map(i => i.svg).join('');
}

// keep the flat versions around, then point the shots at the 3D sets
SHOTS_REG.co_truckFront2d = SHOTS_REG.co_truckFront; SHOTS_REG.ix_establish2d = SHOTS_REG.ix_establish; SHOTS_REG.p_truckThrough2d = SHOTS_REG.p_truckThrough; SHOTS_REG.e_pullBack2d = SHOTS_REG.e_pullBack;
function person3(c, who, x, z, o = {}) { return figAt(c, x, z, { who, fc: o.fc ?? 1, pose: o.pose || 'stand', expr: o.expr || 'neutral', t: o.t, child: who === 'boy', lookX: o.lookX || 0, extra: o.extra, sq: o.sq, rim: o.rim }); }
Object.assign(SHOTS_REG, {
  // s002: 3D wide master — camera behind Leo on the near sidewalk, panning right toward the boy and the truck as it arrives
  co_truckFront(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d)), turn = seg(lt, .35, .6, ease.settle), crouch = seg(lt, d - .55, d, ease.inOut);
    const c = cam3({ x: lerp(-900, -760, p), y: lerp(170, 150, p), z: lerp(-950, -880, p), yaw: lerp(14, 26, p), pitch: 1.5, f: 1050 });
    const tx = lerp(2600, 1700, ease.in2(clamp(lt / d)));
    const A = [truck3d(c, tx, Z3.lane),
      person3(c, 'boy', 0, Z3.road, { fc: 1, pose: 'scoop', expr: 'happy', t: gt }), football3(c, 70, Z3.road, 0),
      person3(c, 'guard', 330, Z3.walk, { fc: -1, pose: 'hold', t: gt }),
      person3(c, 'nora', -170, Z3.walk - 20, { fc: 1, pose: 'armsCross', lookX: -.6, t: gt }),
      person3(c, 'leo', -440, Z3.walk - 40, { fc: 1, pose: mixPose(POSES.stand, POSES.crouch, crouch * .7), expr: turn > .5 ? 'shocked' : 'neutral', lookX: turn > .5 ? 1 : -.5, t: gt })];
    return street3d(c, gt, A) + headlightWash(gt, .4 + lt / d * .8) + label(120, 175, '8:17 PM', 1, 36);
  },
  // s072: 3D establishing — crane down from above the street onto the crossing, 8:17 PM
  ix_establish(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const c = cam3({ x: lerp(-200, -350, p), y: lerp(1100, 230, p), z: lerp(-2300, -1300, p), yaw: lerp(-6, 10, p), pitch: lerp(24, 6, p), f: 1000 });
    const A = [truck3d(c, 5200, Z3.lane),
      person3(c, 'boy', 120, Z3.walk - 10, { fc: -1, pose: 'stand', expr: 'happy', t: gt }), football3(c, 60, Z3.walk - 10, 0),
      person3(c, 'guard', 330, Z3.walk, { fc: -1, pose: 'hold', t: gt }),
      person3(c, 'nora', -170, Z3.walk - 20, { fc: 1, pose: 'armsCross', t: gt }), person3(c, 'leo', -440, Z3.walk - 40, { fc: 1, expr: 'sad', t: gt })];
    return street3d(c, gt, A) + label(120, 175, '8:17 PM', seg(lt, .2, .8), 36);
  },
  // s098: low 3D camera behind the group; the truck skids through the crossing behind them while the camera orbits and shakes
  p_truckThrough(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d)), [sx, sy] = shake(lt, 10);
    const c = cam3({ x: lerp(-650, -350, p) + sx, y: 110 + sy, z: lerp(-1050, -1000, p), yaw: lerp(-8, 14, p), pitch: 0, f: 1050 });
    const tx = lerp(1600, -900, seg(lt, 0, d + .2, ease.lin)), ang = 8 + seg(lt, 0, d) * 8;
    const fl = seg(lt, .2, .6, ease.settle), flinch = { tor: -18 * fl, head: -10 * fl, ab: [lerp(6, 120, fl), 40], af: [lerp(-6, 130, fl), 40], lb: [6, 0], lf: [-6, 0] };
    const smoke = []; for (let i = 0; i < 8; i++) { const P = proj(c, [tx + 300 + i * 90, 40 + rnd(i) * 60, Z3.lane - 60 + rnd(i * 3) * 120]); if (P[2] > NEAR) smoke.push({ d: P[2], svg: circ(P[0], P[1], (30 + i * 12) * 900 / P[2], '#9a90a8', { opacity: (.3 - i * .03).toFixed(2) }) }); }
    const A = [truck3d(c, tx, Z3.lane + 40, ang), smoke,
      person3(c, 'leo', -370, -170, { fc: 1, pose: flinch, expr: 'shocked', t: gt }), person3(c, 'nora', -70, -150, { fc: 1, pose: flinch, expr: 'scared', t: gt }),
      person3(c, 'boy', 0, -160, { fc: 1, pose: 'stand', expr: 'shocked', t: gt }), person3(c, 'guard', 70, -150, { fc: -1, pose: flinch, expr: 'shocked', t: gt })];
    return street3d(c, gt, A) + hud(gt);
  },
  // s105c: the final crane — up and back over the crossing; the crashed truck's hazards blink far left
  e_pullBack(lt, d, gt) {
    const p = ease.inOut(clamp(lt / (d - .6)));
    const c = cam3({ x: lerp(-180, -500, p), y: lerp(150, 1250, p), z: lerp(-520, -2300, p), yaw: lerp(4, -10, p), pitch: lerp(4, 24, p), f: 1050 });
    const blink = Math.sin(gt * 2 * Math.PI * 1.2) > 0 ? .8 : .12;
    const A = [truck3d(c, -2050, 620, 28, { lights: false, hazard: blink }),
      person3(c, 'leo', -230, -110, { fc: 1, expr: 'happy', lookX: 1, t: gt }), person3(c, 'nora', -160, -110, { fc: -1, expr: 'happy', lookX: -1, t: gt }),
      person3(c, 'boy', 80, -120, { fc: -1, pose: 'hold', expr: 'happy', t: gt }), football3(c, 105, -120, 0, 95), person3(c, 'guard', 150, -110, { fc: -1, t: gt })];
    return street3d(c, gt, A) + fadeBlack(seg(lt, d - 1.0, d));
  },
});
function football3(c, x, z, rot, y = 14) { const P = proj(c, [x, y, z]); if (P[2] < NEAR) return null; const r = 14 * c.f / P[2]; return { d: P[2] - 1, svg: football(P[0], P[1], r, rot) }; }

// ---------- CAFÉ TERRACE in 3D ----------
// facade on the plane Z = 900 (glass front, awning, string lights); terrace floor Z < 900; the group's table at (0, 0, 420)
function cyl3(c, x, z, r, y0, y1, colTop, colSide, n = 18) {
  const out = [], P = (a, y) => [x + Math.cos(a) * r, y, z + Math.sin(a) * r];
  const top = face3(c, Array.from({ length: n }, (_, i) => P(i / n * 2 * Math.PI, y1)), colTop); if (top) out.push({ ...top, d: top.d - 2 });
  for (let i = 0; i < n; i++) { const a0 = i / n * 2 * Math.PI, a1 = (i + 1) / n * 2 * Math.PI; if (Math.sin((a0 + a1) / 2) > .2) continue; const f = face3(c, [P(a0, y0), P(a1, y0), P(a1, y1), P(a0, y1)], colSide); if (f) out.push(f); }
  return out;
}
function cafe3d(c, t, actors = [], tod = 'dusk') {
  const items = [], lit = tod !== 'day';
  const sky = tod === 'day' ? SKY.day : tod === 'blue' ? [[0, '#141030'], [.6, '#2a2050'], [1, '#6a4a7a']] : SKY.dusk;
  let bg = rect(0, 0, W, H, lgrad(sky)); if (tod === 'blue') for (let i = 0; i < 40; i++) bg += circ(rnd(i) * W, rnd(i * 3) * 400, 1.2, '#fff', { opacity: .5 });
  // terrace floor + street beyond the camera side
  for (let x = -1600; x < 1600; x += 200) for (let z = -1400; z < 900; z += 200) { const f = face3(c, [[x, 0, z], [x + 200, 0, z], [x + 200, 0, z + 200], [x, 0, z + 200]], tod === 'day' ? mix('#8a7480', '#6a5662', ((x + z) / 200) % 2 ? .3 : 0) : mix('#3a2a36', '#2c1f2a', ((x + z) / 200) % 2 ? .5 : 0), { depth: 1e6 + 3, stroke: '#2c1f2a', 'stroke-width': 1 }); if (f) items.push(f); }
  // building block + upper storey
  items.push(...box3(c, -3000, 3000, 0, 900, 900, 1300, { top: '#2c1c26', side: '#2c1c26', front: tod === 'day' ? '#7a5866' : '#47303e' }).map(f => ({ ...f, d: 1.5e6 })));
  const fd = 1.5e6 - 10;
  // four big café windows with warm interiors and silhouettes
  for (let i = 0; i < 4; i++) {
    const x0 = -1300 + i * 660;
    const w = face3(c, [[x0, 40, 899], [x0 + 600, 40, 899], [x0 + 600, 300, 899], [x0, 300, 899]], lit ? '#f2b06a' : '#9fb3c4', { depth: fd }); if (w) items.push(w);
    for (let k = 0; k < 2; k++) { const px = x0 + 140 + k * 280 + rnd(i * 5 + k) * 60, P = proj(c, [px, 110, 898]); if (P[2] > NEAR) { const r = 24 * c.f / P[2]; items.push({ d: fd - 1, svg: circ(P[0], P[1] - r * 2.4, r, '#3a2430', { opacity: .55 }) + rect(P[0] - r * 1.2, P[1] - r * 1.4, r * 2.4, r * 3, '#3a2430', { opacity: .55, rx: r * .6 }) }); } }
    const gp = proj(c, [x0 + 300, 170, 890]); if (gp[2] > NEAR) items.push({ d: fd - 2, svg: glow(gp[0], gp[1], 300000 / gp[2], '#ffb46a', lit ? .3 : .1) });
  }
  // awning: a sloped striped plane sticking out over the terrace
  for (let i = 0; i < 17; i++) { const x0 = -1360 + i * 160; const f = face3(c, [[x0, 410, 899], [x0 + 160, 410, 899], [x0 + 160, 330, 720], [x0, 330, 720]], i % 2 ? '#e8d9cf' : '#b5323a', { depth: fd - 5 }); if (f) items.push(f); }
  // string lights under the awning edge
  for (let i = 0; i < 26; i++) { const P = proj(c, [-1350 + i * 106, 318 - Math.sin(i * .9) * 8, 720]); if (P[2] > NEAR) items.push({ d: fd - 6, svg: circ(P[0], P[1], 2200 / P[2], lit ? '#ffe1a0' : '#c8bfb0') + (lit ? glow(P[0], P[1], 16000 / P[2], '#ffd27a', .45) : '') }); }
  // planters
  for (const px of [-1500, 1500]) { items.push(...box3(c, px - 60, px + 60, 0, 90, 780, 860, { top: '#2f5a40', side: '#4a2e2a', front: '#5a3a33' })); const P = proj(c, [px, 150, 820]); if (P[2] > NEAR) items.push({ d: P[2] - 1, svg: circ(P[0], P[1], 9000 / P[2], '#3a6a4c') + circ(P[0] + 4000 / P[2], P[1] - 5000 / P[2], 7000 / P[2], '#3f7a54') }); }
  for (const a of actors.flat()) if (a) items.push(a);
  items.sort((a, b) => b.d - a.d);
  return bg + items.map(i => i.svg).join('') + (tod === 'blue' ? rect(0, 0, W, H, '#1a1440', { opacity: .25, style: 'mix-blend-mode:multiply' }) : '');
}
// the group's round table with cups, and chairs; seat = [x, z, facing]
const CAFE_SEATS = { leo: [-170, 380, 1], nora: [-60, 520, 0], maya: [80, 520, 0], sam: [180, 380, -1] };
function cafeTable3(c, cups = true) {
  const out = [...cyl3(c, 0, 450, 120, 70, 76, '#8a6266', '#4a3038'), ...box3(c, -5, 5, 0, 70, 445, 455, { top: '#2a1a22', side: '#2a1a22', front: '#2a1a22' })];
  if (cups) for (const [x, z] of [[-40, 430], [50, 470]]) { const P = proj(c, [x, 78, z]); if (P[2] > NEAR) { const s = c.f / P[2] * 1.6; out.push({ d: P[2] - 4, svg: cup(P[0], P[1], s) }); } }
  return out;
}
function seated3(c, who, gt, o = {}) {
  const [x, z, fc] = CAFE_SEATS[who];
  const chair = box3(c, x - 22, x + 22, 42, 46, z - 22, z + 22, { top: '#5a3a40', side: '#43292f', front: '#43292f' });
  const P = proj(c, [x, 0, z]); if (P[2] < NEAR) return chair;
  const s = 175 * c.f / P[2] / 4.6;
  return [...chair, { d: P[2] - 3, svg: fig({ x: P[0], y: P[1], s, fc: o.fc ?? fc, who, pose: o.pose || 'sit', expr: o.expr || 'neutral', talk: o.talk || 0, t: gt, seed: who.length, lookX: o.lookX || 0, lookY: o.lookY || 0 }) }];
}
SHOTS_REG.c_tableWide2d = SHOTS_REG.c_tableWide; SHOTS_REG.c3_aloneWide2d = SHOTS_REG.c3_aloneWide;
Object.assign(SHOTS_REG, {
  // s045: 3D — the camera arcs around the café table while Sam tells his story (dusk)
  c_tableWide(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d)), yaw = lerp(-22, 4, p), dist = lerp(820, 700, p);
    const c = cam3({ x: Math.sin(yaw * R) * -dist, y: lerp(260, 220, p), z: 450 - Math.cos(yaw * R) * dist, yaw, pitch: 12, f: 1150 });
    const fin = seg(lt, 1.6, 2.0);
    const A = [cafeTable3(c),
      seated3(c, 'sam', gt, { expr: 'happy', talk: lt > 1.3 ? Math.abs(Math.sin(lt * 14)) * .6 : 0, pose: mixPose(POSES.sit, { tor: 20, head: 5, ab: [30, 50], af: [60, 60], lb: [88, 88], lf: [86, 86] }, .8) }),
      seated3(c, 'leo', gt, { expr: 'smug', lookX: .4, pose: mixPose(POSES.sit, { tor: -6, head: -4, ab: [30, 50], af: [80, 60], lb: [88, 88], lf: [86, 86] }, fin) }),
      seated3(c, 'nora', gt, {}), seated3(c, 'maya', gt, {})];
    return cafe3d(c, gt, A, 'dusk');
  },
  // s069: 3D — one long crane up and back: Leo small and alone at the table, dusk sliding into blue hour
  c3_aloneWide(lt, d, gt) {
    const p = ease.inOut(clamp(lt / d));
    const c = cam3({ x: lerp(-420, -120, p), y: lerp(170, 900, p), z: lerp(80, -1500, p), yaw: lerp(18, 4, p), pitch: lerp(6, 24, p), f: 1100 });
    const A = [cafeTable3(c, false), seated3(c, 'leo', gt, { expr: 'sad', pose: 'sitSad', lookY: 1 })];
    const P = proj(c, [20, 78, 460]); if (P[2] > NEAR) A.push({ d: P[2] - 4, svg: cake(P[0], P[1], 1) .replace(/^/, `<g transform="translate(${f1(P[0])} ${f1(P[1])}) scale(${(c.f / P[2] * .55).toFixed(3)}) translate(${f1(-P[0])} ${f1(-P[1])})">`) + '</g>' });
    return cafe3d(c, gt, A, p > .5 ? 'blue' : 'dusk') + rect(0, 0, W, H, '#1a1440', { opacity: (p * .2).toFixed(2), style: 'mix-blend-mode:multiply' });
  },
});
