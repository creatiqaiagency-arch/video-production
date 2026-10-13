// V3: selected scenes re-staged in true 3D (real camera moves through modelled sets).
// Loaded after every other shot file; replaces the draw of existing shots by id so timing stays intact.
(function () {
  const E = globalThis.E, P3 = E.P3;
  const sh = (id) => E.SHOTS.find((s) => s.id === id);
  const replace = (id, draw, meta) => { const s = sh(id); if (!s) return; s.draw = draw; Object.assign(s, meta); };
  const DAY = { wall: '#6a4a50', floor: '#53373d' };

  // 4A — Noah strolls down the corridor toward a camera that dollies back ahead of him, drifting across
  replace('s04a_hall', (ctx, lt, t, s) => {
    const D = E.D(s), k = E.clamp(lt / D), nz = E.lerp(15, 11.6, k), nx = E.lerp(-0.4, 0.2, k);
    const c = P3.lookAt([E.lerp(1.3, -0.6, E.ease.sine(k)), E.lerp(1.15, 1.35, k), nz - E.lerp(4.2, 3.4, k)], [nx, 1.1, nz], 1150);
    P3.corridor(ctx, c, t, Object.assign({ chars: [
      { p: [nx, 0, nz], a: Math.PI - 0.1, o: E.C('noah', t, { pose: E.walkPose(lt), expr: 'smug', look: [0.2, 0] }) },
      { p: [1.7, 0, 18 - lt * 0.6], a: Math.PI, o: { costume: E.extra(211), t, seed: 11, pose: E.walkPose(lt + 0.3), expr: 'neutral' } },
      { p: [-1.9, 0, 21], a: Math.PI / 2, o: { costume: E.extra(212), t, seed: 12, pose: 'phone', expr: 'neutral' } },
      { p: [2.0, 0, 9 + lt * 0.7], a: 0, o: { costume: E.extra(213), t, seed: 13, pose: E.walkPose(lt + 0.6), expr: 'neutral' } },
      { p: [-1.6, 0, 26], a: Math.PI / 2, o: { costume: E.extra(214), t, seed: 14, pose: 'pocket', expr: 'happy' } },
      { p: [-1.1, 0, 26.2], a: -Math.PI / 2, o: { costume: E.extra(215), t, seed: 15, pose: 'crossed', expr: 'laugh' } },
    ] }, DAY));
  }, { type: 'WS', desc: '3D corridor: the camera dollies back ahead of Noah as he strolls toward it, drifting across the lockers (real perspective shift); students around, warm window at the end.' });

  // 8C — Leo walks up the corridor and taps Noah; the camera orbits round the pair while craning up
  replace('s08c_twoshot', (ctx, lt, t, s) => {
    const D = E.D(s), k = E.ease.sine(E.clamp(lt / D));
    const ang = E.lerp(-0.55, 0.18, k), r = E.lerp(3.8, 3.1, k), ctr = [0, 1.2, 6];
    const c = P3.lookAt([ctr[0] - r * Math.sin(ang), E.lerp(1.0, 1.5, k), ctr[2] - r * Math.cos(ang)], ctr, 1150);
    const w = E.seg(lt, 0, 0.75, 'out'), lz = E.lerp(9.5, 5.95, w), la = lt < 0.75 ? Math.PI : -Math.PI / 2;
    P3.corridor(ctx, c, t, { chars: [
      { p: [-0.5, 0, 6.1], a: E.lerp(Math.PI, Math.PI / 2, E.seg(lt, 0.4, 0.9)), o: E.C('noah', t, { pose: 'relaxed', expr: 'tired', look: [0.5, 0] }) },
      { p: [0.5, 0, lz], a: la, o: E.C('leo', t, { pose: E.poseAt(lt, [[0, E.walkPose(lt)], [0.75, 'tap'], [1.4, 'pocket']]), expr: 'happy', look: [-0.6, 0] }) },
      { p: [1.6, 0, 16 - lt * 0.8], a: Math.PI, o: { costume: E.extra(221), t, seed: 21, pose: E.walkPose(lt), expr: 'neutral' } },
      { p: [-1.9, 0, 19], a: Math.PI / 2, o: { costume: E.extra(222), t, seed: 22, pose: 'pocket', expr: 'neutral' } },
    ] });
  }, { type: 'MS', desc: '3D corridor two-shot: Leo walks up and taps Noah\'s shoulder while the camera orbits round the pair and cranes up (true perspective move).' });

  // ---------- 3D courtyard ----------
  P3.yard = (ctx, c, t, o = {}) => {
    const m = E.yardMood(o.mood || 'conf'), LK = [0.45, 0.6, -0.65];
    const hz = P3.pt(c, [c.x + Math.sin(c.yaw) * 2000, c.y, c.z + Math.cos(c.yaw) * 2000]); const hy = hz ? hz[1] : 400;
    E.sky(ctx, m.top, m.mid, m.hor, hy - 900, hy, -400, 2800); E.cloud && 0;
    ctx.fillStyle = E.mixHex(m.top, '#100810', 0.45); for (let i = 0; i < 14; i++) { const r = E.rng(i + 40); const x = -200 + i * 170 + r() * 60, hh = 40 + r() * 70; ctx.beginPath(); ctx.arc(x, hy, hh, Math.PI, 0); ctx.fill(); }
    P3.poly(ctx, c, [[-80, 0, -30], [80, 0, -30], [80, 0, 160], [-80, 0, 160]], m.ground);
    for (let z = -10; z <= 60; z += 2) P3.line(ctx, c, [-30, 0.003, z], [30, 0.003, z], 'rgba(255,230,210,0.05)', 1.5);
    for (let x = -30; x <= 30; x += 2) P3.line(ctx, c, [x, 0.003, -10], [x, 0.003, 60], 'rgba(255,230,210,0.05)', 1.5);
    const items = [];
    // school building: a cel-shaded block with a window grid
    for (const f of P3.box(-26, 0, 30, 26, 9, 40, '#3e2e40')) { if (f.n[2] !== -1 && f.n[1] !== 1 && f.n[0] === 0) continue; items.push({ d: 1e4, draw: () => P3.poly(ctx, c, f.p, P3.cel(f.color, f.n, LK, { key: o.key || '#a9b0d8' })) }); }
    items.push({ d: 1e4 - 1, draw: () => { for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) { const x0 = -24 + i * 3.1, y0 = 2 + j * 3.6; const lit = (i + j) % 3 ? m.win : 0;
      P3.poly(ctx, c, [[x0, y0, 29.98], [x0 + 1.7, y0, 29.98], [x0 + 1.7, y0 + 2.1, 29.98], [x0, y0 + 2.1, 29.98]], E.mixHex('#2a1d30', '#f0a058', lit * 0.8)); P3.line(ctx, c, [x0 + 0.85, y0, 29.97], [x0 + 0.85, y0 + 2.1, 29.97], '#24141e', 3); }
      P3.poly(ctx, c, [[-1.6, 0, 29.97], [1.6, 0, 29.97], [1.6, 3, 29.97], [-1.6, 3, 29.97]], '#24141e'); } });
    // benches + lamp posts
    for (const [x, z] of [[-8, 16], [6, 21], [-12, 24]]) for (const f of P3.box(x - 1, 0.42, z - 0.25, x + 1, 0.5, z + 0.25, '#3a2630')) if (f.n[1] === 1 || f.n[2] === -1 || f.n[0] !== 0) items.push({ d: P3.depth(c, f.p), draw: () => P3.poly(ctx, c, f.p, P3.cel(f.color, f.n, LK)) });
    for (const [x, z] of [[-14, 12], [10, 14], [-6, 27], [14, 27]]) items.push({ d: P3.depth(c, [[x, 2, z]]), draw: () => { P3.line(ctx, c, [x, 0, z], [x, 4, z], '#2a1a24', Math.max(2, 900 / Math.max(1, P3.toCam(c, [x, 2, z])[2]) * 0.12)); const p = P3.pt(c, [x, 4.05, z]); if (p) E.glow(ctx, p[0], p[1], 600 / p[2], '#ffd59a', 0.25 * m.win); } });
    // the big tree (2D painterly tree standing at a 3D point) + its shadow
    const tp = [o.treeX === undefined ? -3.5 : o.treeX, 0, o.treeZ || 18];
    items.push({ d: P3.depth(c, [tp]) + 0.3, draw: () => { ctx.save(); ctx.globalAlpha = 0.35; P3.poly(ctx, c, [[tp[0] - 3, 0.01, tp[2] - 1.5], [tp[0] + 3, 0.01, tp[2] - 1.5], [tp[0] + 3.5, 0.01, tp[2] + 2], [tp[0] - 3.5, 0.01, tp[2] + 2]], '#1e1428'); ctx.restore();
      const b = P3.pt(c, tp), top = P3.pt(c, [tp[0], 6.5, tp[2]]); if (b && top) E.bigTree(ctx, b[0], b[1], (b[1] - top[1]) / 610, t); } });
    for (const ch of o.chars || []) items.push({ d: P3.depth(c, [ch.p]), draw: () => P3.charAt(ctx, c, ch.p, ch.a, Object.assign({ rim: { dx: 1, dy: -0.5, color: '#c9b8e8' } }, ch.o)) });
    items.sort((a, b) => b.d - a.d).forEach((it) => it.draw());
    // cool overcast haze
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = E.rgba(m.haze, 0.25); ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
  };

  // 12A — FRIDAY: crane down from high over the courtyard to Noah waiting under the tree as Leo crosses toward him
  replace('s12a_ews', (ctx, lt, t, s) => {
    const D = E.D(s), k = E.ease.io(E.clamp(lt / D));
    const c = P3.lookAt([E.lerp(9, 4, k), E.lerp(9, 2.6, k), E.lerp(-2, 7, k)], [E.lerp(-1, -2, k), E.lerp(1.5, 1.4, k), 18.5], 1150);
    const lw = E.clamp(lt / D);
    P3.yard(ctx, c, t, { mood: 'conf', chars: [
      { p: [-3, 0, 18.6], a: -0.5, o: E.C('noah', t, { pose: 'crossed', expr: 'angry' }) },
      { p: [E.lerp(9, 1.5, lw), 0, E.lerp(23, 19.5, lw)], a: -Math.PI / 2 - 0.4, o: E.C('leo', t, { pose: E.walkPose(lt), expr: 'nervous' }) },
    ] });
    E.dayChip(ctx, 'FRIDAY', E.fadeIO(lt, 0.4, D, 0.3, 0.4));
  }, { type: 'EWS', desc: 'FRIDAY. 3D crane down from high above a cool, overcast courtyard (building, benches, lamp posts in true perspective) to Noah waiting under the tree; Leo crosses the paving toward him.' });
})();
