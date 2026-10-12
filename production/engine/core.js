// Core maths, easing, colour, timeline lookup and the 2.5D layer camera.
(function () {
  const E = (globalThis.E = globalThis.E || {});
  E.W = 1920; E.H = 1080; E.LB = 62; E.FPS = 24;

  // ---------- maths ----------
  E.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  E.lerp = (a, b, t) => a + (b - a) * t;
  E.inv = (a, b, x) => (b === a ? 0 : (x - a) / (b - a));
  E.ease = {
    lin: (t) => t,
    in: (t) => t * t * t,
    out: (t) => 1 - Math.pow(1 - t, 3),
    io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    back: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    expo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  };
  // eased progress of t between t0 and t1
  E.seg = (t, t0, t1, ease = 'io') => E.ease[ease](E.clamp(E.inv(t0, t1, t)));
  // keyframes: [[t, v], ...] where v is number or array
  E.keys = (t, ks, ease = 'io') => {
    if (t <= ks[0][0]) return ks[0][1];
    for (let i = 0; i < ks.length - 1; i++) {
      const [ta, va] = ks[i], [tb, vb] = ks[i + 1];
      if (t <= tb) {
        const p = E.ease[ks[i][2] || ease](E.clamp(E.inv(ta, tb, t)));
        if (Array.isArray(va)) return va.map((v, j) => E.lerp(v, vb[j], p));
        return E.lerp(va, vb, p);
      }
    }
    return ks[ks.length - 1][1];
  };
  E.pulse = (t, t0, dur) => { const x = (t - t0) / dur; return x < 0 || x > 1 ? 0 : Math.sin(Math.PI * x); };

  // ---------- deterministic noise ----------
  E.rng = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const hash = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
  E.noise = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return E.lerp(hash(i), hash(i + 1), u) * 2 - 1; };
  E.wobble = (t, seed = 0, freq = 0.3, amp = 1) => E.noise(t * freq + seed * 17.3) * amp;

  // ---------- colour ----------
  const cache = {};
  E.rgb = (hex) => { if (cache[hex]) return cache[hex]; const h = hex.replace('#', ''); const v = [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); return (cache[hex] = v); };
  E.rgba = (hex, a = 1) => { const [r, g, b] = E.rgb(hex); return `rgba(${r},${g},${b},${a})`; };
  E.mix = (h1, h2, t, a = 1) => { const A = E.rgb(h1), B = E.rgb(h2); return `rgba(${A.map((v, i) => Math.round(E.lerp(v, B[i], t))).join(',')},${a})`; };
  E.mixHex = (h1, h2, t) => { const A = E.rgb(h1), B = E.rgb(h2); return '#' + A.map((v, i) => Math.round(E.lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };
  E.P = null; // palette, loaded by index.html

  // ---------- timeline ----------
  E.TL = { lines: {}, total: 0 };
  E.M = (k) => { const v = E.TL.marks && E.TL.marks[k]; if (v === undefined) throw new Error('missing mark ' + k); return v; };
  E.Lx = (id) => E.TL.lines[id];
  E.L = (id) => { const l = E.TL.lines[id]; if (!l) throw new Error('missing line ' + id); return l; };
  E.env = (id, t) => { // lip-flap envelope value 0..1 for line at absolute time t
    const l = E.TL.lines[id]; if (!l || !E.ENV || !E.ENV[id]) return 0;
    const i = Math.floor((t - l.start) * E.FPS); const a = E.ENV[id];
    return i < 0 || i >= a.length ? 0 : a[i];
  };
  // talk amount for a character at time t: max over that speaker's spoken lines
  E.talk = (speaker, t) => {
    let v = 0;
    for (const id in E.TL.lines) { const l = E.TL.lines[id]; if (l.speaker === speaker && l.kind !== 'thought' && t >= l.start && t <= l.end) v = Math.max(v, E.env(id, t)); }
    return v;
  };

  // ---------- offscreen pool ----------
  const pool = [];
  E.getCanvas = (w = E.W, h = E.H) => { let c = pool.find((p) => !p.busy && p.c.width === w && p.c.height === h); if (!c) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; c = { c: cv, busy: false }; pool.push(c); } c.busy = true; const ctx = c.c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.clearRect(0, 0, w, h); return c; };
  E.release = (c) => { c.busy = false; };

  // ---------- 2.5D camera + layers ----------
  // cam: {x, y, z, rot, focus, ap}  — x,y = look-at point in world px (960,540 default)
  // layer: {d: depth/parallax factor (0 sky … 1 subject … 1.5 FG), draw(ctx), blur?: extra, alpha?, op?}
  E.cam = (o = {}) => Object.assign({ x: 960, y: 540, z: 1, rot: 0, focus: 1, ap: 9, shakeX: 0, shakeY: 0 }, o);
  E.applyCam = (ctx, cam, d) => {
    const zl = Math.max(0.05, 1 + (cam.z - 1) * d);
    ctx.translate(E.W / 2 + cam.shakeX, E.H / 2 + cam.shakeY);
    ctx.rotate(cam.rot * Math.min(1, d + 0.2));
    ctx.scale(zl, zl);
    ctx.translate(-(E.W / 2 + (cam.x - E.W / 2) * d), -(E.H / 2 + (cam.y - E.H / 2) * d));
  };
  E.layers = (ctx, cam, layers) => {
    for (const L of layers) {
      if (!L || L.skip) continue;
      const blur = L.sharp ? 0 : Math.abs((L.fd !== undefined ? L.fd : L.d) - cam.focus) * cam.ap + (L.blur || 0);
      const alpha = L.alpha === undefined ? 1 : L.alpha;
      if (alpha <= 0.002) continue;
      if (blur < 0.7) {
        ctx.save(); ctx.globalAlpha = alpha; if (L.op) ctx.globalCompositeOperation = L.op;
        E.applyCam(ctx, cam, L.d); L.draw(ctx); ctx.restore();
      } else {
        const off = E.getCanvas(); const o = off.c.getContext('2d');
        o.save(); E.applyCam(o, cam, L.d); L.draw(o); o.restore();
        ctx.save(); ctx.globalAlpha = alpha; if (L.op) ctx.globalCompositeOperation = L.op;
        ctx.filter = `blur(${Math.min(blur, 40).toFixed(1)}px)`; ctx.drawImage(off.c, 0, 0); ctx.restore();
        E.release(off);
      }
    }
  };

  // ---------- shot registry ----------
  E.SHOTS = [];
  E.shot = (s) => { E.SHOTS.push(s); return s; };
  E.findShot = (t) => { for (let i = E.SHOTS.length - 1; i >= 0; i--) if (t >= E.SHOTS[i].t0) return E.SHOTS[i]; return E.SHOTS[0]; };
})();
