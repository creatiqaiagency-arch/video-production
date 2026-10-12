// Thought-world graphics, titles and small illustrated props.
(function () {
  const E = globalThis.E;
  const VIOLET = '#a98bff', GLOW = '#d9c9ff', TXT = '#f1eaff';

  // word-by-word reveal progress for a line id at absolute time t
  E.wordsShown = (text, id, t, lead = 0.12) => {
    const l = E.TL.lines[id]; const words = text.split(' ');
    if (!l) return words.length;
    const p = E.clamp((t - l.start + lead) / Math.max(0.3, l.dur * 0.9));
    return Math.ceil(p * words.length);
  };
  // pop-in scale for an element appearing at time ta
  E.pop = (t, ta, dur = 0.33) => { if (t < ta) return 0; const p = E.clamp((t - ta) / dur); return E.ease.back(p); };
  E.fadeIO = (t, ta, tb, fi = 0.25, fo = 0.3) => E.clamp(Math.min((t - ta) / fi, (tb - t) / fo));

  E.textGlow = (ctx, str, x, y, o = {}) => {
    ctx.save();
    ctx.font = o.font || '900 64px Nunito'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
    if (o.spacing) ctx.letterSpacing = o.spacing;
    const a = o.a === undefined ? 1 : o.a; ctx.globalAlpha *= a;
    if (o.shadow !== false) { ctx.shadowColor = o.shadowColor || 'rgba(20,6,20,0.65)'; ctx.shadowBlur = o.shadowBlur || 18; ctx.shadowOffsetY = 4; ctx.fillStyle = o.color || '#ffefd7'; ctx.fillText(str, x, y); }
    ctx.shadowColor = o.glow || 'rgba(255,170,110,0.8)'; ctx.shadowBlur = o.glowBlur || 26; ctx.shadowOffsetY = 0;
    ctx.fillStyle = o.color || '#ffefd7'; ctx.fillText(str, x, y);
    ctx.restore();
  };

  // Thought window: rounded translucent panel with tail dots toward (tx,ty)
  // o: {x,y,w,h, s(scale), a, tail:[tx,ty], color, text, font, size, words, inner(ctx,w,h), kind:'thought'|'spec'|'pink'|'warm'}
  E.thought = (ctx, o, t = 0) => {
    const s = o.s === undefined ? 1 : o.s; if (s <= 0.01) return;
    const a = o.a === undefined ? 1 : o.a; if (a <= 0.01) return;
    const kind = o.kind || 'thought';
    const col = kind === 'spec' ? '#8d8597' : kind === 'pink' ? '#ff9ccf' : kind === 'warm' ? '#ffc98a' : o.color || VIOLET;
    const glow = kind === 'spec' ? '#bdb6c4' : kind === 'pink' ? '#ffd2ea' : kind === 'warm' ? '#ffe2bd' : GLOW;
    const fy = Math.sin(t * 1.1 + (o.seed || 0)) * 6;
    ctx.save(); ctx.globalAlpha *= a;
    // tail dots
    if (o.tail) {
      const [tx, ty] = o.tail;
      for (let i = 0; i < 3; i++) {
        const p = (i + 1) / 4; const r = (12 - i * 3.2) * s;
        const px = E.lerp(o.x, tx, 0.35 + p * 0.55), py = E.lerp(o.y + (o.h / 2) * s + fy, ty, 0.35 + p * 0.55);
        ctx.fillStyle = E.rgba(col, 0.35); ctx.strokeStyle = E.rgba(glow, 0.9); ctx.lineWidth = 2;
        ctx.shadowColor = glow; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(px, py, Math.max(2, r), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }
    ctx.translate(o.x, o.y + fy); ctx.scale(s, s);
    const w = o.w, h = o.h;
    ctx.shadowColor = glow; ctx.shadowBlur = kind === 'spec' ? 4 : 28;
    if (kind === 'spec') { // torn jagged frame, grey, grainy
      const r = E.rng(o.seed || 3); ctx.beginPath();
      const pts = []; const n = 28;
      for (let i = 0; i < n; i++) { const p = i / n; let x, y; if (p < 0.25) { x = -w / 2 + w * p * 4; y = -h / 2; } else if (p < 0.5) { x = w / 2; y = -h / 2 + h * (p - 0.25) * 4; } else if (p < 0.75) { x = w / 2 - w * (p - 0.5) * 4; y = h / 2; } else { x = -w / 2; y = h / 2 - h * (p - 0.75) * 4; } pts.push([x + (r() - 0.5) * 16, y + (r() - 0.5) * 16]); }
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
      ctx.fillStyle = E.rgba('#2a2630', 0.82); ctx.fill(); ctx.strokeStyle = E.rgba(glow, 0.5); ctx.lineWidth = 2; ctx.stroke();
    } else {
      ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22);
      const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, E.rgba(col, 0.32)); g.addColorStop(1, E.rgba(col, 0.14));
      ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = E.rgba(glow, 0.95); ctx.lineWidth = 2.5; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = E.rgba('#ffffff', 0.18); ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14, 16); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    if (o.inner) { ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 16); ctx.clip(); o.inner(ctx, w, h, t); ctx.restore(); }
    if (kind === 'spec') { // grain + flicker
      ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); const r = E.rng(Math.floor(t * 12) + 9);
      for (let i = 0; i < 260; i++) { ctx.fillStyle = `rgba(255,255,255,${r() * 0.12})`; ctx.fillRect(-w / 2 + r() * w, -h / 2 + r() * h, 2, 2); }
      ctx.restore();
    }
    if (o.text) E.thoughtText(ctx, o.text, 0, o.inner ? h / 2 - 34 : 0, { size: o.size || 48, words: o.words, color: kind === 'spec' ? '#e7e2ea' : kind === 'pink' ? '#fff0f8' : TXT, glow, maxW: w - 40 });
    ctx.restore();
  };
  E.thoughtText = (ctx, text, x, y, o = {}) => {
    const size = o.size || 48; ctx.save();
    ctx.font = `700 ${size}px Caveat`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const words = text.split(' '); const n = o.words === undefined ? words.length : o.words;
    // wrap
    const lines = []; let cur = '';
    for (const wd of words) { const tryS = cur ? cur + ' ' + wd : wd; if (o.maxW && ctx.measureText(tryS).width > o.maxW && cur) { lines.push(cur); cur = wd; } else cur = tryS; }
    lines.push(cur);
    let k = 0; const lh = size * 1.05; const y0 = y - ((lines.length - 1) * lh) / 2;
    lines.forEach((ln, li) => {
      const ws = ln.split(' '); const full = ctx.measureText(ln).width; let cx = x - full / 2;
      ws.forEach((wd) => { const ww = ctx.measureText(wd + ' ').width; if (k < n) { ctx.globalAlpha = o.a === undefined ? 1 : o.a; ctx.shadowColor = o.glow || GLOW; ctx.shadowBlur = 18; ctx.fillStyle = o.color || TXT; ctx.textAlign = 'left'; ctx.fillText(wd, cx, y0 + li * lh); } k++; cx += ww; });
    });
    ctx.restore();
  };
  // floating glowing text with no panel (projected thought)
  E.floatText = (ctx, text, x, y, o = {}) => E.thoughtText(ctx, text, x, y, o);

  // spoken caption (white, near mouth) — used sparingly
  E.caption = (ctx, text, x, y, a = 1, size = 40) => { ctx.save(); ctx.globalAlpha *= a; ctx.font = `800 ${size}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(10,6,12,0.75)'; ctx.strokeText(text, x, y); ctx.fillStyle = '#ffffff'; ctx.fillText(text, x, y); ctx.restore(); };

  // ---------- tiny illustrated props for thought windows ----------
  E.icon = {
    clockBoss: (ctx, w, h, t) => { // boss figure tapping foot next to a big clock
      E.vgrad(ctx, -w / 2, -h / 2, w, h, [[0, '#3b2a7a'], [1, '#6c56c0']]);
      ctx.save(); ctx.translate(w * 0.18, -h * 0.05); const r = h * 0.28;
      ctx.fillStyle = '#f1eaff'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#2a1d5c'; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.7); ctx.stroke(); const a = t * 2.2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a) * r * 0.8, -Math.cos(a) * r * 0.8); ctx.stroke(); ctx.restore();
      E.char(ctx, { x: -w * 0.2, y: h * 0.42, h: h * 0.75, f: 0.7, costume: 'biz', pose: Math.sin(t * 6) > 0 ? 'crossed' : E.blendPose(E.POSE.crossed, E.POSE.stand, 0.2), expr: 'angry', t, rim: { color: '#d9c9ff', dx: 3, dy: -1 } });
    },
    oven: (ctx, w, h, t) => {
      E.vgrad(ctx, -w / 2, -h / 2, w, h, [[0, '#3b2a7a'], [1, '#6c56c0']]);
      const ow = w * 0.48, oh = h * 0.62; ctx.fillStyle = '#e9e4f5'; ctx.beginPath(); ctx.roundRect(-ow / 2, -oh / 2 + 6, ow, oh, 10); ctx.fill();
      ctx.fillStyle = '#2a1d5c'; ctx.beginPath(); ctx.roundRect(-ow * 0.38, -oh * 0.15, ow * 0.76, oh * 0.55, 8); ctx.fill();
      const fl = 0.6 + 0.4 * Math.sin(t * 9); E.glow(ctx, 0, oh * 0.12, ow * 0.45, '#ff8a3a', 0.9 * fl);
      for (let i = 0; i < 4; i++) { ctx.fillStyle = '#2a1d5c'; ctx.beginPath(); ctx.arc(-ow * 0.33 + i * ow * 0.22, -oh * 0.33, 7, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#ffd36a'; ctx.font = '900 34px Nunito'; ctx.textAlign = 'center'; ctx.fillText('!', ow * 0.42, -oh * 0.32);
    },
    staring: (ctx, w, h, t) => {
      E.vgrad(ctx, -w / 2, -h / 2, w, h, [[0, '#3b2a7a'], [1, '#6c56c0']]);
      E.char(ctx, { x: 0, y: h * 0.9, h: h * 1.5, f: -0.2, costume: 'noah', pose: 'stand', expr: 'wide', look: [1, 0], t, rim: { color: '#d9c9ff', dx: 3 } });
    },
    letterB: (ctx, w, h) => { E.textGlow(ctx, 'B', 0, 0, { font: '900 120px Nunito', color: '#f1eaff', glow: '#a98bff' }); },
    laptop: (ctx, w, h, t) => { E.vgrad(ctx, -w / 2, -h / 2, w, h, [[0, '#2a2630'], [1, '#4a4452']]); },
  };

  // Speculation scene drawings (monochrome, inside spec panels)
  E.specScene = {
    leoLeaving: (ctx, w, h, t) => { // Leo walking away with new friends, Noah alone
      E.vgrad(ctx, -w / 2, -h / 2, w, h, [[0, '#4a4452'], [1, '#2a2630']]);
      const g = { color: '#d8d2dc', dx: 3, dy: -1 };
      E.char(ctx, { x: w * 0.12, y: h * 0.42, h: h * 0.62, f: 0.8, costume: { hair: 'capBack', capC: '#9a94a0', top: 'tee', topC: '#77717d', topS: '#5f5965' }, pose: E.walkPose(t * 1.4), expr: 'happy', t, rim: g });
      E.char(ctx, { x: w * 0.3, y: h * 0.42, h: h * 0.6, f: 0.8, costume: { hair: 'cap', capC: '#8a8490', top: 'tee', topC: '#6a6470', topS: '#57515d' }, pose: E.walkPose(t * 1.4 + 0.5), expr: 'laugh', t, seed: 2, rim: g });
      E.char(ctx, { x: -w * 0.3, y: h * 0.42, h: h * 0.62, f: 0.4, costume: { hair: 'tufts', top: 'hoodie', topC: '#8c8690', topS: '#6c6670' }, pose: 'stand', expr: 'sad', t, rim: g });
    },
    lying: (ctx, w, h, t) => { // Leo whispering behind hand to someone, pointing back
      E.vgrad(ctx, -w / 2, -h / 2, w, h, [[0, '#4a4452'], [1, '#2a2630']]);
      const g = { color: '#d8d2dc', dx: 3, dy: -1 };
      E.char(ctx, { x: -w * 0.12, y: h * 0.42, h: h * 0.66, f: 0.8, costume: { hair: 'capBack', capC: '#9a94a0', top: 'tee', topC: '#77717d', topS: '#5f5965' }, pose: 'point', expr: 'smug', t, rim: g });
      E.char(ctx, { x: w * 0.16, y: h * 0.42, h: h * 0.64, f: -0.8, costume: { hair: 'bob', top: 'tee', topC: '#6a6470', topS: '#57515d' }, pose: 'facepalm', expr: 'laugh', t, seed: 4, rim: g });
    },
    ditched: (ctx, w, h, t) => { // empty chair / Noah alone on Friday
      E.vgrad(ctx, -w / 2, -h / 2, w, h, [[0, '#4a4452'], [1, '#2a2630']]);
      ctx.fillStyle = '#1c1820'; ctx.fillRect(-w / 2, h * 0.25, w, h * 0.3);
      E.char(ctx, { x: 0, y: h * 0.38, h: h * 0.6, f: 0.1, costume: { hair: 'tufts', top: 'hoodie', topC: '#8c8690', topS: '#6c6670' }, pose: 'sit', expr: 'sad', t, rim: { color: '#d8d2dc', dx: 3 } });
      ctx.fillStyle = '#e7e2ea'; ctx.font = '900 40px Nunito'; ctx.textAlign = 'center'; ctx.fillText('FRIDAY', 0, -h * 0.3);
    },
  };

  // Projected text across a face/frame (scene 13)
  E.projected = (ctx, text, x, y, a, size = 80) => { E.thoughtText(ctx, text, x, y, { size, a, color: '#efe6ff', glow: '#a98bff' }); };
})();
