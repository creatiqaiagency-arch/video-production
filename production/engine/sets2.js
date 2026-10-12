// V2 sets: perspective rooms (vanishing point, angled walls, receding features), courtyard reverse
// angles with three lighting moods, morning variants. Loaded after sets.js.
(function () {
  const E = globalThis.E;
  const S = E.SET, U = S._;
  const L0 = -400, R0 = 2320, T0 = -300, B0 = 1380; // drawable bounds (allow camera moves)

  // perspective helpers ------------------------------------------------------
  // wall quad defined by near edge (x at screen boundary) and far edge (back wall side); depth p 0..1
  const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const depthT = (p, r = 0.82, n = 1) => p; // linear in screen (we pre-space with geometric steps)
  const geo = (i, n, r = 0.8) => (1 - Math.pow(r, i)) / (1 - Math.pow(r, n));
  const quad = (c, pts, fill) => { c.fillStyle = fill; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fill(); };
  // point on a side wall: u along depth (0 near → 1 far), v vertical (0 top → 1 bottom)
  const wallPt = (w, u, v) => { const top = lerp2(w.nt, w.ft, u), bot = lerp2(w.nb, w.fb, u); return lerp2(top, bot, v); };
  const wallRect = (w, u0, u1, v0, v1) => [wallPt(w, u0, v0), wallPt(w, u1, v0), wallPt(w, u1, v1), wallPt(w, u0, v1)];

  // E.room: o = {back:[x0,y0,x1,y1], backC, wallL, wallR, floor, ceil, left:{type}, right:{type}, light:'#ffd08a', lamps:n}
  E.room = (c, t, o) => {
    const [bx0, by0, bx1, by1] = o.back;
    const vx = (bx0 + bx1) / 2, vy = (by0 + by1) / 2;
    const ext = (px, py, X) => [X, py + (vy - py) * 0 + ((py - vy) / (px - vx || 1)) * (X - px)]; // extend line from VP through (px,py) to x=X
    const lineTo = (px, py, X) => { const k = (py - vy) / (px - vx); return [X, vy + k * (X - vx)]; };
    const WL = { nt: lineTo(bx0, by0, L0), nb: lineTo(bx0, by1, L0), ft: [bx0, by0], fb: [bx0, by1] };
    const WR = { nt: lineTo(bx1, by0, R0), nb: lineTo(bx1, by1, R0), ft: [bx1, by0], fb: [bx1, by1] };
    // ceiling / floor / walls
    quad(c, [[L0, T0], [R0, T0], WR.nt, [bx1, by0], [bx0, by0], WL.nt], o.ceil || '#3a262e');
    const fg = c.createLinearGradient(0, by1, 0, B0); fg.addColorStop(0, o.floorFar || o.floor || '#5a3a3e'); fg.addColorStop(1, o.floor || '#3a242a');
    quad(c, [[bx0, by1], [bx1, by1], WR.nb, [R0, B0], [L0, B0], WL.nb], fg);
    const wlg = c.createLinearGradient(L0, 0, bx0, 0); wlg.addColorStop(0, o.wallLNear || o.wallL || '#4a3038'); wlg.addColorStop(1, o.wallL || '#5d3d44');
    quad(c, [WL.nt, WL.ft, WL.fb, WL.nb], wlg);
    const wrg = c.createLinearGradient(R0, 0, bx1, 0); wrg.addColorStop(0, o.wallRNear || o.wallR || '#4a3038'); wrg.addColorStop(1, o.wallR || '#5d3d44');
    quad(c, [WR.ft, WR.nt, WR.nb, WR.fb], wrg);
    E.vgrad(c, bx0, by0, bx1 - bx0, by1 - by0, [[0, o.backTop || o.backC || '#5d3d44'], [1, o.backC || '#4e343c']]);
    if (o.backDraw) o.backDraw(c, bx0, by0, bx1, by1);
    // floor perspective lines
    c.strokeStyle = 'rgba(255,220,190,0.06)'; c.lineWidth = 2; for (let i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(vx + i * (bx1 - bx0) / 8, by1); c.lineTo(vx + i * 520, B0); c.stroke(); }
    for (let i = 1; i < 10; i++) { const u = geo(i, 10, 0.75); const a = lerp2(WL.nb, WL.fb, u), b = lerp2(WR.nb, WR.fb, u); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    // wall features
    const feature = (w, f, side) => {
      if (!f) return;
      const n = f.n || 12;
      for (let i = 0; i < n; i++) {
        const u0 = geo(i, n, f.r || 0.86), u1 = geo(i + 1, n, f.r || 0.86);
        if (f.type === 'lockers') {
          const q = wallRect(w, u0, u1 - (u1 - u0) * 0.04, f.v0 || 0.38, 1); quad(c, q, i % 2 ? (f.c1 || '#2c3a55') : (f.c2 || '#28344d'));
          const sl = wallRect(w, u0 + (u1 - u0) * 0.2, u1 - (u1 - u0) * 0.25, 0.44, 0.47); quad(c, sl, 'rgba(0,0,0,0.25)');
          const hd = wallRect(w, u0 + (u1 - u0) * 0.72, u0 + (u1 - u0) * 0.8, 0.62, 0.7); quad(c, hd, '#8f8a98');
        } else if (f.type === 'windows') {
          if (i % 2) continue;
          const q = wallRect(w, u0, u1, f.v0 || 0.18, f.v1 || 0.58);
          const g = c.createLinearGradient(0, q[0][1], 0, q[3][1]); g.addColorStop(0, f.hi || '#ffd08a'); g.addColorStop(1, f.lo || '#d8743a'); quad(c, q, g);
          const mid = wallRect(w, (u0 + u1) / 2 - 0.004, (u0 + u1) / 2 + 0.004, f.v0 || 0.18, f.v1 || 0.58); quad(c, mid, '#2b1a26');
          // light shaft across the floor toward the other side
          if (f.shaft !== false) { const b0 = wallPt(w, u0, f.v1 || 0.58), b1 = wallPt(w, u1, f.v1 || 0.58); const ff = wallPt(w, u0, 1), ff1 = wallPt(w, u1, 1); const sh = f.shaftLen || 420; const dx = side * sh;
            c.save(); c.globalCompositeOperation = 'lighter'; const g2 = c.createLinearGradient(ff[0], ff[1], ff[0] + dx, ff[1] + sh * 0.35); g2.addColorStop(0, E.rgba(f.light || '#ffd08a', f.shaftA || 0.18)); g2.addColorStop(1, E.rgba(f.light || '#ffd08a', 0));
              c.fillStyle = g2; c.beginPath(); c.moveTo(ff[0], ff[1]); c.lineTo(ff1[0], ff1[1]); c.lineTo(ff1[0] + dx, ff1[1] + sh * 0.3); c.lineTo(ff[0] + dx * 1.2, ff[1] + sh * 0.4); c.closePath(); c.fill();
              // airborne beam
              const g3 = c.createLinearGradient(b0[0], b0[1], ff[0] + dx * 0.6, ff[1]); g3.addColorStop(0, E.rgba(f.light || '#ffd08a', 0.08)); g3.addColorStop(1, E.rgba(f.light || '#ffd08a', 0)); c.fillStyle = g3; c.beginPath(); c.moveTo(b0[0], b0[1]); c.lineTo(b1[0], b1[1]); c.lineTo(ff1[0] + dx, ff1[1] + sh * 0.3); c.lineTo(ff[0] + dx * 1.2, ff[1] + sh * 0.4); c.closePath(); c.fill(); c.restore(); }
        } else if (f.type === 'boards') {
          if (i % 3) continue; const q = wallRect(w, u0, u1, 0.25, 0.55); quad(c, q, ['#8a5a48', '#c98aa0', '#3d6a8a'][i % 3]);
        } else if (f.type === 'doors') {
          if (i % 4 !== 1) continue; const q = wallRect(w, u0, u1, 0.2, 1); quad(c, q, '#6b3f34'); const g = wallRect(w, u0 + (u1 - u0) * 0.2, u1 - (u1 - u0) * 0.2, 0.28, 0.5); quad(c, g, '#ffd08a');
        }
      }
      if (f.type === 'lockers') { const top = wallRect(w, 0, 1, (f.v0 || 0.38) - 0.015, f.v0 || 0.38); quad(c, top, '#1e1420'); }
    };
    feature(WL, o.left, 1); feature(WR, o.right, -1);
    // ceiling lamps down the middle
    for (let i = 0; i < (o.lamps || 0); i++) { const u = geo(i, o.lamps + 1, 0.72); const p = lerp2([vx, T0 + 80], [vx, by0 + 6], u); const s = 1 - u * 0.85; c.fillStyle = '#fff1d0'; c.fillRect(p[0] - 110 * s, p[1], 220 * s, 8 * s + 2); E.glow(c, p[0], p[1] + 10, 200 * s + 30, '#ffe6b8', 0.3); }
    // floor pools under lamps / key light
    if (o.pool) E.pool(c, o.pool[0], o.pool[1], o.pool[2], o.pool[3], o.light || '#ffd08a', o.poolA || 0.2);
    return { vx, vy, by1, scaleAt: (y) => E.clamp((y - by1) / (1080 - by1), 0.02, 3) };
  };
  // character height for a floor y inside a room (person ≈ 0.55 of back-wall height at the back)
  E.hAt = (rm, y, hNear = 820) => { const hb = 0.55 * (rm.backH || 300); return hb + (hNear - hb) * rm.scaleAt(y); };

  // HALLWAY 3/4: lockers on the left wall receding to a VP right of centre, windows on the right
  S.hall3q = (t, o = {}) => [{ d: o.d || 0.5, draw: (c) => {
    const back = o.back || [1120, 330, 1420, 640];
    const mood = o.mood || 'day';
    const pal = { day: { hi: '#ffd08a', lo: '#d8743a', light: '#ffd08a', wall: '#5d3d44', floor: '#3e2a30' }, afternoon: { hi: '#ffb070', lo: '#c8603a', light: '#ffa060', wall: '#553840', floor: '#382630' }, cool: { hi: '#c9b8e8', lo: '#8a78b8', light: '#b9a8e8', wall: '#3e3248', floor: '#2a2232' }, dusk: { hi: '#e88a5a', lo: '#a0503a', light: '#e08050', wall: '#4a3040', floor: '#2e1e28' } }[mood];
    const rm = E.room(c, t, { back, backC: pal.wall, wallL: pal.wall, wallR: pal.wall, floor: pal.floor, floorFar: E.mixHex(pal.floor, '#ffffff', 0.08), ceil: E.mixHex(pal.wall, '#000000', 0.3),
      left: { type: 'lockers', n: 16, r: 0.86, c1: '#2c3550', c2: '#283048' }, right: { type: 'windows', n: 10, r: 0.8, hi: pal.hi, lo: pal.lo, light: pal.light, shaftA: mood === 'cool' ? 0.1 : 0.2, shaftLen: 520 }, lamps: 5,
      backDraw: (x, x0, y0, x1, y1) => { U.win(x, x0 + (x1 - x0) * 0.2, y0 + (y1 - y0) * 0.15, (x1 - x0) * 0.6, (y1 - y0) * 0.45, { cols: 2, rows: 2, hi: pal.hi, lo: pal.lo }); E.glow(x, (x0 + x1) / 2, y0 + (y1 - y0) * 0.35, (x1 - x0) * 1.2, pal.light, 0.25); } });
    E.dust(c, t, { n: 30, color: '#ffe2b8', a: 0.35, x: 600, y: 200, w: 1300, h: 700 });
  } }];
  E.HALL3Q = { by1: 640, backH: 310 };
  E.hallH = (y) => { const by1 = 640, hb = 170, hNear = 880; return hb + (hNear - hb) * E.clamp((y - by1) / (1080 - by1), 0, 3); };

  // CLASSROOM REVERSE: from the teacher's desk looking at the class (back wall with posters, students facing camera)
  S.classRev = (t, o = {}) => [{ d: 0.4, draw: (c) => {
    E.room(c, t, { back: [520, 230, 1400, 640], backC: '#55383e', backTop: '#5e3f45', wallL: '#5a3c42', wallR: '#4e343a', floor: '#3e2a30', floorFar: '#4e363a', ceil: '#3a262e',
      left: { type: 'windows', n: 6, r: 0.75, hi: '#ffd08a', lo: '#d8743a', shaftA: 0.22, shaftLen: 700 }, right: { type: 'boards', n: 8 }, lamps: 3,
      backDraw: (x, x0, y0, x1, y1) => { x.fillStyle = '#8a5a48'; x.fillRect(x0 + 80, y0 + 60, 260, 170); [['#f2c184', 20, 20], ['#c98aa0', 150, 40], ['#efe6dc', 60, 100]].forEach(([col, a, b]) => { x.fillStyle = col; x.fillRect(x0 + 80 + a, y0 + 60 + b, 80, 50); }); x.fillStyle = '#efe6dc'; x.beginPath(); x.arc(x1 - 140, y0 + 120, 46, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#2a1826'; x.lineWidth = 6; x.stroke(); } });
  } }];

  // CAFETERIA PERSPECTIVE: long tables receding, windows on the right
  S.cafPersp = (t, o = {}) => [{ d: 0.45, draw: (c) => {
    E.room(c, t, { back: [760, 300, 1260, 600], backC: '#5a4048', wallL: '#5a4048', wallR: '#54383e', floor: '#4a3236', floorFar: '#5e4244', ceil: '#3a262e',
      left: { type: 'boards', n: 8 }, right: { type: 'windows', n: 8, r: 0.78, shaftLen: 600, shaftA: 0.18 }, lamps: 5,
      backDraw: (x, x0, y0, x1, y1) => { U.win(x, x0 + 120, y0 + 50, 260, 140, { cols: 3, rows: 1 }); } });
  } }];
  // a receding table on the floor of cafPersp (centre line x, from depth z0 to z1)
  E.tableP = (c, side, z0, z1) => { const vx = 1010, vy = 450, by1 = 600; const pt = (z, off) => { const y = by1 + (1380 - by1) * z; const k = (y - vy) / (by1 - vy); return [vx + off * k, y]; };
    const off = side * 260; const a = pt(z0, off - side * 120), b = pt(z0, off + side * 120), cc = pt(z1, off + side * 120), d = pt(z1, off - side * 120);
    quad(c, [a, b, cc, d], '#7a5040'); quad(c, [d, cc, [cc[0], cc[1] + 30 * z1 + 6], [d[0], d[1] + 30 * z1 + 6]], '#4a2c26'); };

  // COURTYARD views + moods ---------------------------------------------------
  const MOOD = {
    conf:   { top: '#3e3258', mid: '#8a6680', hor: '#b9788a', ground: '#5e4650', groundFar: '#7a5a60', sunA: 0.0, rays: 0.0, win: 0.5, shadow: 0.35, haze: '#6a7bc0' },
    reveal: { top: '#55406a', mid: '#a87a88', hor: '#d89a88', ground: '#6e5050', groundFar: '#8a6660', sunA: 0.5, rays: 0.05, win: 0.7, shadow: 0.25, haze: '#6a7bc0' },
    warm:   { top: '#6a4a7a', mid: '#d08a82', hor: '#ffc27a', ground: '#8a5e4e', groundFar: '#b07a5a', sunA: 1.0, rays: 0.16, win: 0.9, shadow: 0.3, haze: '#ffb070' },
  };
  E.yardMood = (t) => MOOD[t] || MOOD.warm;
  // view 'building' (Noah's reverse) or 'tree' (Leo's reverse: open courtyard, tree, low sun)
  S.yard = (t, o = {}) => {
    const m = MOOD[o.mood || 'warm'], view = o.view || 'building', sunX = o.sunX || (view === 'tree' ? 1250 : 1550);
    const L = [];
    L.push({ d: 0.05, draw: (c) => { E.sky(c, m.top, m.mid, m.hor, -600, 760, -2000, 6000); if (m.sunA > 0) { c.save(); c.globalAlpha = m.sunA; E.sun(c, sunX, view === 'tree' ? 600 : 470, 48, t); E.rays(c, sunX, view === 'tree' ? 600 : 470, 1800, 18, '#ffd59a', m.rays, t); c.restore(); } U.clouds(c, t, 120, 8, E.mixHex(m.mid, '#ffffff', 0.15)); } });
    if (view === 'building') {
      L.push({ d: 0.3, draw: (c) => { U.rect(c, -1400, 240, 4800, 470, '#4e3240'); U.rect(c, -1400, 225, 4800, 22, '#2e1c28');
        for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) U.win(c, -1300 + i * 300, 300 + j * 180, 150, 120, { cols: 2, rows: 2, lit: ((i + j) % 3 ? 1 : 0) * m.win, hi: '#ffc87a', lo: '#c8643a' });
        U.rect(c, 860, 480, 200, 230, '#24141e'); U.treeLine(c, 720, '#2e202c', 12, -1600, 3600, 0.7); E.screenFill && 0; } });
    } else {
      L.push({ d: 0.25, draw: (c) => { U.skyline(c, 760, E.mixHex(m.top, '#000000', 0.15), 31, -2000, 5000); U.treeLine(c, 760, E.mixHex(m.top, '#100810', 0.45), 14, -2000, 5000, 0.9); } });
      L.push({ d: 0.45, draw: (c) => { E.bigTree(c, 1450, 760, 1.25, t); for (let i = 0; i < 4; i++) U.lamp(c, -600 + i * 900, 760, 330, t, 0.0); } });
    }
    L.push({ d: 0.65, draw: (c) => { const g = c.createLinearGradient(0, 700, 0, 1500); g.addColorStop(0, m.groundFar); g.addColorStop(1, m.ground); c.fillStyle = g; c.fillRect(-2400, 700, 6800, 900);
      c.fillStyle = `rgba(30,16,30,${m.shadow})`; for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(-1800 + i * 520, 760); c.lineTo(-1700 + i * 520, 760); c.lineTo(-2400 + i * 520 + (view === 'tree' ? 900 : 0), 1500); c.lineTo(-2600 + i * 520 + (view === 'tree' ? 900 : 0), 1500); c.fill(); }
      c.strokeStyle = 'rgba(255,220,190,0.07)'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-2400, 760 + i * i * 9); c.lineTo(4400, 760 + i * i * 9); c.stroke(); }
      if (m.sunA > 0.6) E.pool(c, 960, 900, 900, 120, '#ffc27a', 0.16);
      // cool fill from the shadow side so warm and cool both exist
      c.save(); c.globalCompositeOperation = 'soft-light'; const hg = c.createLinearGradient(view === 'tree' ? 2200 : -400, 0, view === 'tree' ? -400 : 2200, 0); hg.addColorStop(0, E.rgba(m.haze, 0.35)); hg.addColorStop(1, E.rgba(m.haze, 0)); c.fillStyle = hg; c.fillRect(-2400, -600, 6800, 2200); c.restore();
    } });
    if (o.tree !== false && view === 'building') L.push({ d: 0.85, draw: (c) => E.bigTree(c, o.treeX === undefined ? 520 : o.treeX, 880, 1.6, t) });
    return L;
  };
  // close-up background variant (no foreground tree)
  S.yardBG = (t, o = {}) => { const L = S.yard(t, Object.assign({ tree: false }, o)); L[1].d = 0.2; L[2].d = 0.3; return L; };

  // MORNING variants ----------------------------------------------------------
  S.cafeIntAM = (t, o = {}) => { const L = S.cafeInt(t, o); L[0] = { d: 0.1, draw: (c) => { E.vgrad(c, -1000, -400, 4000, 1800, [[0, '#6a4a4a'], [1, '#4a3638']]);
      E.sky(c, '#8fb0d8', '#e8c8b0', '#ffe0a8', 120, 640, 120, 1700); E.sun(c, 420, 300, 44, t); E.rays(c, 420, 300, 900, 12, '#fff0c8', 0.1, t); U.skyline(c, 640, '#8a7a90', 9, 120, 1820);
      c.fillStyle = '#2b1a26'; [120, 520, 920, 1320, 1720].forEach((x) => c.fillRect(x - 10, 120, 20, 520)); c.fillRect(110, 110, 1720, 24); c.fillRect(110, 630, 1720, 24);
      E.vgrad(c, -1000, 654, 4000, 600, [[0, '#4a2f36'], [1, '#33222b']]); for (let i = 0; i < 4; i++) E.cone(c, 320 + i * 400, 640, 300, 900, 600, '#fff0c8', 0.06, 0.35); } }; return L; };
  S.streetAM = (t, o = {}) => { const L = S.street(t, o); L[0] = { d: 0.04, draw: (c) => { E.sky(c, '#7f9fd0', '#d8c0c8', '#ffd8a0', -600, 820, -2000, 9000); E.sun(c, 300, 300, 56, t); E.rays(c, 300, 300, 1600, 14, '#fff0c8', 0.08, t); U.clouds(c, t, 100, 6, '#f0d8e0'); } }; return L; };
  S.cafeExtAM = (t, o = {}) => { const L = S.cafeExt(t, o); L[0] = { d: 0.05, draw: (c) => { E.sky(c, '#7f9fd0', '#d8c0c8', '#ffd8a0', -600, 760); E.sun(c, 520, 260, 60, t); E.rays(c, 520, 260, 1500, 16, '#fff0c8', 0.08, t); U.clouds(c, t, 80, 2, '#f0d8e0'); } }; return L; };
  S.schoolAM = (t, o = {}) => { const L = S.entrance(t, o); L[0] = { d: 0.05, draw: (c) => { E.sky(c, '#7f9fd0', '#d8c0c8', '#ffd8a0', -600, 760, -2000, 6000); E.sun(c, 1500, 260, 60, t); E.rays(c, 1500, 260, 1700, 16, '#fff0c8', 0.08, t); U.clouds(c, t, 120, 9, '#f0d8e0'); } }; return L; };
  // sunset entrance: less blown
  S.entranceSet = (t, o = {}) => { const L = S.entrance(t, o); L[0] = { d: 0.05, draw: (c) => { E.sky(c, '#5a3a6e', '#d07a72', '#ffb46a', -600, 760, -2000, 6000); E.sun(c, 1500, 560, 52, t); E.rays(c, 1500, 560, 1800, 18, '#ffcf8a', 0.12, t); U.clouds(c, t, 120, 9, '#e08a8a'); } }; return L; };
})();
