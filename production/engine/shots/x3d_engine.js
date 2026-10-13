// 2.5D → true 3D: a tiny projection engine for "2D that looks 3D" shots (Ifverse-style 3D sets).
// World units are metres: x right, y up, z forward. A camera {x,y,z,yaw,pitch,f} projects to the
// 1920×1080 frame. Sets are flat-shaded polygons (cel lighting: lit / shadow tone, no gradients on
// geometry), painter-sorted; characters are the usual 2D rig placed at a 3D point, scaled by depth and
// turned (f) by their facing relative to the camera, so an orbiting camera really moves around them.
(function () {
  const E = globalThis.E;
  const P3 = (E.P3 = {});
  const NEAR = 0.15;
  P3.cam = (o) => { const c = Object.assign({ x: 0, y: 1.6, z: 0, yaw: 0, pitch: 0, f: 1150 }, o); c.cy = Math.cos(c.yaw); c.sy = Math.sin(c.yaw); c.cp = Math.cos(c.pitch); c.sp = Math.sin(c.pitch); return c; };
  // looking from (x,y,z) at target (tx,ty,tz)
  P3.lookAt = (pos, tgt, f = 1150) => { const dx = tgt[0] - pos[0], dy = tgt[1] - pos[1], dz = tgt[2] - pos[2]; return P3.cam({ x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, dz), pitch: Math.atan2(-dy, Math.hypot(dx, dz)), f }); };
  P3.toCam = (c, p) => { const x = p[0] - c.x, y = p[1] - c.y, z = p[2] - c.z; const x1 = x * c.cy - z * c.sy, z1 = x * c.sy + z * c.cy; return [x1, y * c.cp + z1 * c.sp, -y * c.sp + z1 * c.cp]; };
  const scr = (c, q) => [960 + (c.f * q[0]) / q[2], 540 - (c.f * q[1]) / q[2]];
  P3.pt = (c, p) => { const q = P3.toCam(c, p); if (q[2] < NEAR) return null; const s = scr(c, q); return [s[0], s[1], q[2]]; };
  const clip = (pts) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], ai = a[2] >= NEAR, bi = b[2] >= NEAR; if (ai) out.push(a); if (ai !== bi) { const t = (NEAR - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]); } } return out; };
  P3.path = (ctx, c, pts) => { const cp = clip(pts.map((p) => P3.toCam(c, p))); if (cp.length < 3) return false; ctx.beginPath(); cp.forEach((q, i) => { const [X, Y] = scr(c, q); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); return true; };
  P3.poly = (ctx, c, pts, fill) => { if (P3.path(ctx, c, pts)) { ctx.fillStyle = fill; ctx.fill(); } };
  P3.line = (ctx, c, a, b, style, w = 2) => { let A = P3.toCam(c, a), B = P3.toCam(c, b); if (A[2] < NEAR && B[2] < NEAR) return; if (A[2] < NEAR || B[2] < NEAR) { const t = (NEAR - A[2]) / (B[2] - A[2]); const M = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, NEAR]; if (A[2] < NEAR) A = M; else B = M; } const a2 = scr(c, A), b2 = scr(c, B); ctx.strokeStyle = style; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke(); };
  P3.depth = (c, pts) => pts.reduce((s, p) => s + P3.toCam(c, p)[2], 0) / pts.length;
  // cel shading: two tones per surface, chosen by the angle to the key light; shadow side tinted cool
  P3.cel = (base, n, L, o = {}) => { const d = n[0] * L[0] + n[1] * L[1] + n[2] * L[2]; return d > (o.th || 0.12) ? E.mixHex(base, o.key || '#ffcf8a', 0.1 + 0.12 * d) : E.mixHex(base, o.cool || '#1e2238', 0.36); };
  // a box → its faces (outward normals); back faces are culled at draw time
  P3.box = (x0, y0, z0, x1, y1, z1, color) => [
    { n: [-1, 0, 0], p: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]] }, { n: [1, 0, 0], p: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] },
    { n: [0, -1, 0], p: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] }, { n: [0, 1, 0], p: [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]] },
    { n: [0, 0, -1], p: [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]] }, { n: [0, 0, 1], p: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] },
  ].map((f) => Object.assign(f, { color }));
  const facing = (c, f) => { const ctr = f.p.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4, s[2] + p[2] / 4], [0, 0, 0]); return (c.x - ctr[0]) * f.n[0] + (c.y - ctr[1]) * f.n[1] + (c.z - ctr[2]) * f.n[2] > 0; };
  // a character standing at world point p, facing world angle a (0 = +z, π/2 = +x)
  P3.charAt = (ctx, c, p, a, o) => { const s = P3.pt(c, p); if (!s) return; const head = P3.pt(c, [p[0], p[1] + (o.H || 1.7), p[2]]); if (!head) return;
    const dir = P3.toCam(c, [p[0] + Math.sin(a), p[1], p[2] + Math.cos(a)]), q = P3.toCam(c, p); const fx = dir[0] - q[0];
    E.char(ctx, Object.assign({}, o, { x: s[0], y: s[1], h: Math.abs(s[1] - head[1]), f: E.clamp(fx * 2.4, -1, 1) })); };

  // ---------- 3D school corridor ----------
  // o: {chars:[{p:[x,y,z], a, opts}], t}
  P3.corridor = (ctx, c, t, o = {}) => {
    const W = 3, H = 3.2, Z1 = 34, L = [0.18, 0.5, 0.85]; const Ln = Math.hypot(...L); const LK = L.map((v) => v / Ln); // key: from the far window, high
    // enclosure (always behind everything inside)
    P3.poly(ctx, c, [[-W, H, -6], [W, H, -6], [W, H, Z1], [-W, H, Z1]], '#33232c');
    P3.poly(ctx, c, [[-W, 0, -6], [-W, H, -6], [-W, H, Z1], [-W, 0, Z1]], P3.cel('#5d3d44', [1, 0, 0], LK));
    P3.poly(ctx, c, [[W, 0, -6], [W, 0, Z1], [W, H, Z1], [W, H, -6]], P3.cel('#5d3d44', [-1, 0, 0], LK));
    P3.poly(ctx, c, [[-W, 0, Z1], [W, 0, Z1], [W, H, Z1], [-W, H, Z1]], '#4a3038');
    // end window: orange gradient pane + mullions
    const wt = P3.pt(c, [0, 2.95, Z1]), wb = P3.pt(c, [0, 0.85, Z1]);
    if (wt && wb && P3.path(ctx, c, [[-1.5, 0.85, Z1 - 0.01], [1.5, 0.85, Z1 - 0.01], [1.5, 2.95, Z1 - 0.01], [-1.5, 2.95, Z1 - 0.01]])) { const g = ctx.createLinearGradient(0, wt[1], 0, wb[1]); g.addColorStop(0, '#ffd68a'); g.addColorStop(0.6, '#f4a058'); g.addColorStop(1, '#e8803a'); ctx.fillStyle = g; ctx.fill(); }
    for (const x of [-0.5, 0.5]) P3.line(ctx, c, [x, 0.85, Z1 - 0.02], [x, 2.95, Z1 - 0.02], '#2b1a26', 5);
    P3.line(ctx, c, [-1.5, 1.9, Z1 - 0.02], [1.5, 1.9, Z1 - 0.02], '#2b1a26', 5);
    // floor + tiles
    P3.poly(ctx, c, [[-W, 0, -6], [W, 0, -6], [W, 0, Z1], [-W, 0, Z1]], '#4a3036');
    for (let z = -6; z <= Z1; z += 1) P3.line(ctx, c, [-W, 0.002, z], [W, 0.002, z], 'rgba(20,8,16,0.28)', 1.5);
    for (let x = -W; x <= W; x += 1) P3.line(ctx, c, [x, 0.002, -6], [x, 0.002, Z1], 'rgba(20,8,16,0.28)', 1.5);
    // light from the window: floor pool + volumetric beam (additive)
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    P3.poly(ctx, c, [[-1.5, 0.004, Z1], [1.5, 0.004, Z1], [2.4, 0.004, Z1 - 16], [-2.4, 0.004, Z1 - 16]], 'rgba(255,200,130,0.16)');
    P3.poly(ctx, c, [[-1.0, 0.005, Z1], [1.0, 0.005, Z1], [1.7, 0.005, Z1 - 11], [-1.7, 0.005, Z1 - 11]], 'rgba(255,214,150,0.14)');
    P3.poly(ctx, c, [[-1.5, 2.95, Z1], [1.5, 2.95, Z1], [2.4, 0, Z1 - 16], [-2.4, 0, Z1 - 16]], 'rgba(255,205,140,0.045)');
    ctx.restore();
    // things inside: lockers, lamps, characters — painter-sorted
    const items = [];
    for (const side of [-1, 1]) for (let k = 0; k < 44; k++) { const z0 = 1 + k * 0.62, x0 = side < 0 ? -W : W - 0.45, x1 = side < 0 ? -W + 0.45 : W;
      for (const f of P3.box(x0, 0, z0, x1, 1.95, z0 + 0.6, k % 2 ? '#2c3550' : '#283049')) { if (!facing(c, f)) continue; items.push({ d: P3.depth(c, f.p), draw: () => {
        P3.poly(ctx, c, f.p, P3.cel(f.color, f.n, LK));
        if (f.n[0] === -side) { const fx = side < 0 ? x1 + 0.003 : x0 - 0.003; // door detail: gap, vents, handle
          P3.line(ctx, c, [fx, 0.05, z0 + 0.6], [fx, 1.9, z0 + 0.6], 'rgba(8,6,16,0.6)', 2);
          for (let v = 0; v < 3; v++) P3.line(ctx, c, [fx, 1.62 + v * 0.07, z0 + 0.16], [fx, 1.62 + v * 0.07, z0 + 0.44], 'rgba(8,6,16,0.55)', 2);
          P3.line(ctx, c, [fx, 0.95, z0 + 0.48], [fx, 1.12, z0 + 0.48], 'rgba(200,190,220,0.55)', 3); } } }); } }
    for (let z = 2; z < Z1; z += 4) { const p = [0, H - 0.02, z]; items.push({ d: P3.depth(c, [p]), draw: () => { P3.poly(ctx, c, [[-0.7, H - 0.02, z - 0.15], [0.7, H - 0.02, z - 0.15], [0.7, H - 0.02, z + 0.15], [-0.7, H - 0.02, z + 0.15]], '#fff3d6'); const s = P3.pt(c, p); if (s) E.glow(ctx, s[0], s[1] + 8, Math.min(600, (c.f * 1.0) / s[2]), '#fff1c9', 0.35); } }); }
    const win = P3.pt(c, [0, 1.9, Z1]);
    for (const ch of o.chars || []) items.push({ d: P3.depth(c, [ch.p]) - 0.05, draw: () => { const s = P3.pt(c, ch.p); const rdx = win && s ? Math.sign(win[0] - s[0]) || 1 : 1;
      P3.charAt(ctx, c, ch.p, ch.a, Object.assign({ rim: { dx: rdx, dy: -0.45, color: '#ffc87a', k: 1.4 } }, ch.o)); } });
    items.sort((a, b) => b.d - a.d).forEach((it) => it.draw());
    E.dust(ctx, t, { n: 40, color: '#ffe2b8', a: 0.35 });
  };

  // ---------- demo: the s08c corridor two-shot as a 3D orbit ----------
  E.DEMO = E.DEMO || {};
  E.DEMO.corridor3d = { dur: 7, draw: (ctx, lt) => {
    const k = E.ease.sine(E.clamp(lt / 7)); const ang = E.lerp(-0.62, 0.22, k), r = E.lerp(3.7, 3.0, k), ctr = [0, 1.25, 6];
    const pos = [ctr[0] - r * Math.sin(ang), E.lerp(1.0, 1.55, k), ctr[2] - r * Math.cos(ang)];
    const c = P3.lookAt(pos, ctr, 1150);
    const talkN = Math.max(0, Math.sin(lt * 11)) * (lt > 0.4 && lt < 3.2 ? 1 : 0), talkL = Math.max(0, Math.sin(lt * 10 + 1)) * (lt > 3.6 && lt < 6.4 ? 1 : 0);
    P3.corridor(ctx, c, lt, { chars: [
      { p: [-0.5, 0, 6.1], a: Math.PI / 2, o: { costume: 'noah', t: lt, seed: 1, pose: E.poseAt(lt, [[0, 'pocket'], [1.2, 'shrug'], [3.4, 'crossed']]), expr: lt < 3.4 ? 'happy' : 'neutral', talk: talkN, look: [0.6, 0] } },
      { p: [0.5, 0, 5.9], a: -Math.PI / 2, o: { costume: 'leo', t: lt, seed: 2, pose: E.poseAt(lt, [[0, 'pocket'], [3.8, 'shrug'], [5.6, 'pocket']]), expr: lt < 3.6 ? 'smile' : 'happy', talk: talkL, look: [-0.6, 0] } },
      { p: [-1.6, 0, 15], a: Math.PI, o: { costume: E.extra(31), t: lt, seed: 5, pose: 'stand', expr: 'neutral' } },
      { p: [1.4, 0, 19 - lt * 0.9], a: Math.PI, o: { costume: E.extra(44), t: lt, seed: 6, pose: E.walkPose(lt), expr: 'neutral' } },
    ] });
  } };
})();
