// Tiny 3D layer for "2D that reads as 3D" shots (reference: stadium aerial, overhead course).
// Real perspective camera (crane/orbit/dolly), cel-banded flat shading, atmospheric fog, painter's sort.
// World units are metres: X right, Y up, Z forward. Characters stay 2D rig billboards placed in 3D.

const P3 = {};
P3.cam = (o) => {
  // o: {pos:[x,y,z], target:[x,y,z], fov(deg), roll(deg)} or orbit form {target, dist, yaw, pitch}
  let pos = o.pos;
  if (!pos) { const yw = rad(o.yaw || 0), pt = rad(o.pitch || 0); pos = [o.target[0] + o.dist * Math.sin(yw) * Math.cos(pt), o.target[1] + o.dist * Math.sin(pt), o.target[2] - o.dist * Math.cos(yw) * Math.cos(pt)]; }
  const t = o.target, f = norm3(sub3(t, pos)), r = norm3(cross3([0, 1, 0], f)), u = cross3(f, r);
  const roll = rad(o.roll || 0);
  const fl = (H / 2) / Math.tan(rad(o.fov || 40) / 2);
  return { pos, f, r, u, fl, roll, near: .15, fog: o.fog || { color: '#1a1530', d0: 8, d1: 70, max: .7 } };
};
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
P3.view = (C, p) => { const d = sub3(p, C.pos); return [dot3(d, C.r), dot3(d, C.u), dot3(d, C.f)]; };
P3.screen = (C, v) => { const x = C.fl * v[0] / v[2], y = -C.fl * v[1] / v[2], c = Math.cos(C.roll), s = Math.sin(C.roll); return [W / 2 + x * c - y * s, H / 2 + x * s + y * c]; };
P3.proj = (C, p) => { const v = P3.view(C, p); return v[2] > C.near ? [...P3.screen(C, v), v[2]] : null; };
// clip a view-space polygon against the near plane
function clipNear(C, vs) {
  const out = [];
  for (let i = 0; i < vs.length; i++) {
    const a = vs[i], b = vs[(i + 1) % vs.length], ina = a[2] > C.near, inb = b[2] > C.near;
    if (ina) out.push(a);
    if (ina !== inb) { const k = (C.near - a[2]) / (b[2] - a[2]); out.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k), C.near]); }
  }
  return out;
}
const LIGHT3 = norm3([-.45, .85, -.35]);
// cel banding (bible: colour is relative; keep 3 clean value steps) + distance fog (aerial perspective)
P3.shadeCol = (C, base, n, depth, o = {}) => {
  const k = dot3(n, o.light || LIGHT3), band = o.flat ? 1 : k > .55 ? 1.0 : k > .1 ? .78 : .58;
  const fg = C.fog, fk = clamp((depth - fg.d0) / (fg.d1 - fg.d0)) * fg.max;
  return mixc(shade(base, band), fg.color, fk);
};
// a scene is a list of primitives; render sorts them back-to-front
P3.scene = () => ({ items: [] });
P3.poly = (sc, C, pts, base, o = {}) => {
  let vs = clipNear(C, pts.map(p => P3.view(C, p)));
  if (vs.length < 3) return;
  const n = o.n || norm3(cross3(sub3(pts[1], pts[0]), sub3(pts[2], pts[0])));
  // back-face cull (faces whose normal points away from the camera)
  const toCam = sub3(C.pos, pts[0]);
  if (!o.twoSided && dot3(n, toCam) < 0) return;
  const depth = vs.reduce((s, v) => s + v[2], 0) / vs.length;
  const sp = vs.map(v => P3.screen(C, v));
  const fill = o.raw ? base : P3.shadeCol(C, base, n, depth, o);
  sc.items.push({ z: o.z ?? depth, svg: S.poly(sp, fill, o.attr || {}) + (o.edge ? S.pl([...sp, sp[0]], o.edge, o.edgeW || 2, { opacity: o.edgeOp ?? .5 }) : '') });
};
P3.box = (sc, C, [x0, y0, z0], [x1, y1, z1], base, o = {}) => {
  const v = (a, b, c) => [a ? x1 : x0, b ? y1 : y0, c ? z1 : z0];
  const faces = [
    [[v(0, 1, 0), v(1, 1, 0), v(1, 1, 1), v(0, 1, 1)], [0, 1, 0], o.top || base],
    [[v(0, 0, 0), v(1, 0, 0), v(1, 1, 0), v(0, 1, 0)], [0, 0, -1], base],
    [[v(1, 0, 1), v(0, 0, 1), v(0, 1, 1), v(1, 1, 1)], [0, 0, 1], base],
    [[v(0, 0, 1), v(0, 0, 0), v(0, 1, 0), v(0, 1, 1)], [-1, 0, 0], base],
    [[v(1, 0, 0), v(1, 0, 1), v(1, 1, 1), v(1, 1, 0)], [1, 0, 0], base],
  ];
  // whole box sorts as one unit (by its centre) so faces never interleave with neighbours
  const cz = P3.view(C, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2])[2] + (o.bias || 0);
  for (const [pts, n, col] of faces) P3.poly(sc, C, pts, col, { ...o, n, z: cz, edge: o.edge });
};
P3.line = (sc, C, a, b, col, w, o = {}) => {
  let va = P3.view(C, a), vb = P3.view(C, b);
  if (va[2] <= C.near && vb[2] <= C.near) return;
  if (va[2] <= C.near) { const k = (C.near - va[2]) / (vb[2] - va[2]); va = va.map((x, i) => lerp(x, vb[i], k)); }
  if (vb[2] <= C.near) { const k = (C.near - vb[2]) / (va[2] - vb[2]); vb = vb.map((x, i) => lerp(x, va[i], k)); }
  const pa = P3.screen(C, va), pb = P3.screen(C, vb), z = (va[2] + vb[2]) / 2;
  const ww = o.world ? w * C.fl / z : w;
  sc.items.push({ z: o.z ?? z, svg: S.line(pa[0], pa[1], pb[0], pb[1], o.raw ? col : mixc(col, C.fog.color, clamp((z - C.fog.d0) / (C.fog.d1 - C.fog.d0)) * C.fog.max), ww, o.attr || {}) });
};
// 2D content placed at a 3D anchor, scaled by perspective (billboards: characters, crowd, glows)
P3.sprite = (sc, C, p, fn, o = {}) => {
  const q = P3.proj(C, p); if (!q) return;
  const px = C.fl / q[2]; // screen pixels per metre at that depth
  if (o.cull !== false && (q[0] < -600 || q[0] > W + 600 || q[1] < -600 || q[1] > H + 900)) return;
  sc.items.push({ z: o.z ?? q[2] + (o.bias || 0), svg: fn(q[0], q[1], px, q[2]) });
};
P3.render = sc => sc.items.sort((a, b) => b.z - a.z).map(i => i.svg).join('');
// camera path helper: keyframed orbit params eased between keys
P3.camKeys = (p, keys) => {
  const v = kf(p, keys.map(([t, o, e]) => [t, [o.yaw, o.pitch, o.dist, o.target[0], o.target[1], o.target[2], o.fov, o.roll || 0], e]));
  return { yaw: v[0], pitch: v[1], dist: v[2], target: [v[3], v[4], v[5]], fov: v[6], roll: v[7] };
};
