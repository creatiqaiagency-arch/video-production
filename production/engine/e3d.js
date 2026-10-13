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
  for (const [p, col] of fcs) { const f = face3(c, p, col); if (f) out.push(f); }
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
