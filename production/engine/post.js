// Post stack: bloom, grade, vignette, grain, letterbox, flashes. Plus atmosphere helpers
// (sky, sun glow, god rays, dust, bokeh, light pools) used inside shot layers.
(function () {
  const E = globalThis.E;
  const { W, H } = E;

  // ---------- grain tiles ----------
  let grainTiles = null;
  const makeGrain = () => {
    grainTiles = [];
    const r = E.rng(7);
    for (let k = 0; k < 6; k++) {
      const c = document.createElement('canvas'); c.width = 256; c.height = 256;
      const x = c.getContext('2d'); const img = x.createImageData(256, 256);
      for (let i = 0; i < img.data.length; i += 4) { const v = Math.floor(r() * 255); img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      x.putImageData(img, 0, 0); grainTiles.push(c);
    }
  };

  // opts: {bloom, vignette, grain, grade:{color, a, op}, flash:{color,a}, lb:true, fade}
  E.post = (ctx, t, o = {}) => {
    const bloom = o.bloom === undefined ? 0.32 : o.bloom;
    if (bloom > 0) {
      const sm = E.getCanvas(480, 270); const s = sm.c.getContext('2d');
      s.filter = `brightness(${o.bloomBright || 1.0}) contrast(${o.bloomContrast || 2.6}) saturate(1.3) blur(7px)`;
      s.drawImage(ctx.canvas, 0, 0, 480, 270);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = bloom; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(sm.c, 0, 0, W, H); ctx.restore();
      E.release(sm);
    }
    // grade: lift blacks toward plum, warm/cool tint
    ctx.save(); ctx.globalCompositeOperation = 'lighten'; ctx.fillStyle = o.lift || '#120a14'; ctx.fillRect(0, 0, W, H); ctx.restore();
    if (o.grade) { ctx.save(); ctx.globalCompositeOperation = o.grade.op || 'soft-light'; ctx.globalAlpha = o.grade.a; ctx.fillStyle = o.grade.color; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (o.desat) { ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = o.desat; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    // vignette
    const vig = o.vignette === undefined ? 0.55 : o.vignette;
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
    g.addColorStop(0, 'rgba(8,4,10,0)'); g.addColorStop(1, `rgba(8,4,10,${vig})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (o.flash && o.flash.a > 0) { ctx.save(); ctx.globalAlpha = o.flash.a; ctx.fillStyle = o.flash.color || '#ffffff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    // grain
    if (!grainTiles) makeGrain();
    const tile = grainTiles[Math.floor(t * E.FPS) % grainTiles.length];
    ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = o.grain === undefined ? 0.07 : o.grain;
    const r = E.rng(Math.floor(t * E.FPS) + 3); const ox = -Math.floor(r() * 256), oy = -Math.floor(r() * 256);
    for (let y = oy; y < H; y += 256) for (let x = ox; x < W; x += 256) ctx.drawImage(tile, x, y);
    ctx.restore();
    if (o.fade) { ctx.save(); ctx.globalAlpha = o.fade; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (o.lb !== false) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, E.LB); ctx.fillRect(0, H - E.LB, W, E.LB); }
  };

  // ---------- atmosphere ----------
  E.vgrad = (ctx, x, y, w, h, stops) => { const g = ctx.createLinearGradient(0, y, 0, y + h); stops.forEach(([p, c]) => g.addColorStop(p, c)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); };
  E.sky = (ctx, top, mid, hor, y0 = -400, y1 = 900, x0 = -1200, w = 4400) => E.vgrad(ctx, x0, y0, w, y1 - y0, [[0, top], [0.55, mid], [1, hor]]);
  E.glow = (ctx, x, y, r, color, a = 1) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, E.rgba(color, a)); g.addColorStop(0.35, E.rgba(color, a * 0.45)); g.addColorStop(1, E.rgba(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  E.sun = (ctx, x, y, r, t = 0) => {
    E.glow(ctx, x, y, r * 7, '#ffcf9a', 0.55);
    E.glow(ctx, x, y, r * 2.4, '#fff1c9', 0.9);
    ctx.fillStyle = '#fff6df'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  };
  E.rays = (ctx, x, y, len, count, color, a, t = 0, spread = Math.PI * 2, dir = Math.PI / 2, width = 0.06) => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < count; i++) {
      const ang = dir - spread / 2 + (spread * (i + 0.5)) / count + Math.sin(t * 0.2 + i * 1.7) * 0.015;
      const w = width * (0.6 + 0.8 * Math.abs(Math.sin(i * 12.9898)));
      const aa = a * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.6 + i * 2.1)));
      const g = ctx.createLinearGradient(x, y, x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      g.addColorStop(0, E.rgba(color, aa)); g.addColorStop(1, E.rgba(color, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang - w) * len, y + Math.sin(ang - w) * len);
      ctx.lineTo(x + Math.cos(ang + w) * len, y + Math.sin(ang + w) * len); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  };
  // light cone (e.g. pendant lamp or window shaft): apex (x,y), spreading downward to width w at length h
  E.cone = (ctx, x, y, w0, w1, h, color, a = 0.25, angle = 0) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, E.rgba(color, a)); g.addColorStop(1, E.rgba(color, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-w0 / 2, 0); ctx.lineTo(w0 / 2, 0); ctx.lineTo(w1 / 2, h); ctx.lineTo(-w1 / 2, h); ctx.closePath(); ctx.fill(); ctx.restore();
  };
  E.pool = (ctx, x, y, rx, ry, color, a = 0.3) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); E.glow(ctx, 0, 0, rx, color, a); ctx.restore();
  };
  E.dust = (ctx, t, o = {}) => {
    const n = o.n || 40, r = E.rng(o.seed || 11), x0 = o.x || 0, y0 = o.y || 0, w = o.w || W, h = o.h || H;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const bx = r() * w, by = r() * h, sp = 6 + r() * 14, sz = 0.8 + r() * (o.size || 2.4), ph = r() * 10;
      const x = x0 + ((bx + t * sp * (o.vx || 0.6) + Math.sin(t * 0.4 + ph) * 12) % w + w) % w;
      const y = y0 + ((by - t * sp * (o.vy || 0.5) + Math.cos(t * 0.3 + ph) * 10) % h + h) % h;
      const a = (o.a || 0.5) * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.7 + ph)));
      ctx.fillStyle = E.rgba(o.color || '#ffe2b8', a); ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  };
  E.bokeh = (ctx, t, o = {}) => {
    const n = o.n || 10, r = E.rng(o.seed || 5);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const x = (o.x || 0) + r() * (o.w || W) + Math.sin(t * 0.15 + i) * 15, y = (o.y || 0) + r() * (o.h || H) + Math.cos(t * 0.12 + i) * 10;
      const rad = (o.rmin || 40) + r() * ((o.rmax || 140) - (o.rmin || 40));
      const col = o.colors ? o.colors[i % o.colors.length] : '#ffd9b0';
      ctx.fillStyle = E.rgba(col, (o.a || 0.08) * (0.5 + r())); ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = E.rgba(col, (o.a || 0.08) * 0.8); ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.restore();
  };
  // horizontal wispy cloud band
  E.cloud = (ctx, x, y, w, h, color, a = 0.6, under = '#ffd8b0') => {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
    ctx.globalAlpha = a * 0.7; ctx.fillStyle = under; ctx.beginPath(); ctx.roundRect(x + h * 0.6, y + h * 0.55, w - h * 1.2, h * 0.45, h * 0.25); ctx.fill();
    ctx.restore();
  };
  // full-frame screen-space helpers (no camera)
  E.screenFill = (ctx, color, a, op = 'source-over') => { ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore(); };
})();
