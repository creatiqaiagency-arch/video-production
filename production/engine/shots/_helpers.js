// Shared helpers for shot files. Loaded first (underscore sorts before "s").
(function () {
  const E = globalThis.E;
  const SPK = { biz: 'businessman' };
  const SEED = { noah: 1, leo: 2, maya: 3, barista: 4, teacher: 5, biz: 6, woman: 7, man: 8 };
  // character options with automatic lip-flap from that speaker's spoken lines
  E.C = (who, t, o = {}) => Object.assign({ costume: who, t, talk: E.talk(SPK[who] || who, t), seed: SEED[who] || 0 }, o);
  E.ch = (c, who, t, o) => E.char(c, E.C(who, t, o));
  // y for a character of height h whose head centre should sit at hy
  E.headAt = (h, hy) => hy + h - 0.14 * h;
  // time within a line: frac of its duration
  E.at = (id, f = 0) => { const l = E.L(id); return l.start + l.dur * f; };
  E.st = (id) => E.L(id).start;
  E.en = (id) => E.L(id).end;
  // k-th phrase start of a line (falls back to fractional split)
  E.ph = (id, k, n) => { const l = E.L(id); if (l.segs && l.segs.length > k && (!n || l.segs.length === n)) return l.segs[k][0]; return l.start + (l.dur * k) / (n || Math.max(1, (l.segs || []).length) || 1); };
  // cut: define a shot that starts at t0; t1 is filled from the next cut at boot
  E.cut = (id, t0, draw, meta = {}) => E.shot(Object.assign({ id, t0, draw }, meta));
  // thought-window visibility for a line: pops slightly before its audio, lingers after
  E.tv = (id, t, pre = 0.12, post = 1.3) => {
    const l = E.TL.lines[id]; if (!l) return { s: 0, a: 0, words: 0, text: '' };
    const s = E.pop(t, l.start - pre, 0.35);
    const a = E.clamp(Math.min((t - (l.start - pre)) / 0.2, (l.end + post - t) / 0.35));
    return { s, a: Math.max(0, a), words: E.wordsShown(l.text, id, t), text: l.text };
  };
  // convenience: draw a thought window for line id
  E.th = (c, id, t, o) => { const v = E.tv(id, t, o.pre, o.post); if (v.a <= 0) return; E.thought(c, Object.assign({ s: v.s * (o.s || 1), a: v.a * (o.a === undefined ? 1 : o.a), text: v.text, words: o.allWords ? undefined : v.words }, o, { size: Math.max(44, o.size || 48) }), t); };
  // standard camera with slow push and handheld drift
  E.push = (lt, D, o = {}) => E.cam(Object.assign({ z: E.lerp(o.z0 || 1, o.z1 || 1.06, E.ease.sine(E.clamp(lt / D))), x: (o.x || 960) + (o.dx || 0) * E.ease.sine(E.clamp(lt / D)) + E.wobble(lt, 3, 0.25, o.drift || 3), y: (o.y || 540) + (o.dy || 0) * E.ease.sine(E.clamp(lt / D)) + E.wobble(lt, 7, 0.22, o.drift || 3), focus: o.focus === undefined ? 1 : o.focus, ap: o.ap === undefined ? 9 : o.ap, rot: o.rot || 0 }, o.extra || {}));
  E.D = (s) => s.t1 - s.t0;
  // dust layer
  E.dustL = (t, o = {}) => ({ d: o.d || 1.1, sharp: true, draw: (c) => E.dust(c, t, Object.assign({ n: 35, a: 0.45, x: -200, y: -100, w: 2300, h: 1300 }, o)) });
  // subtle FG silhouette (blurred shoulder/head) for depth
  E.fgHead = (x, y, r, rim = '#f0a77e') => ({ d: 1.6, draw: (c) => { c.fillStyle = rim; c.beginPath(); c.arc(x + 10, y - 4, r, 0, Math.PI * 2); c.fill(); c.fillStyle = '#0a080d'; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.fillRect(x - r * 1.4, y + r * 0.7, r * 2.8, 2000); } });
  // numbers-on-screen style label
  E.label = (c, txt, x, y, a = 1, size = 34) => E.textGlow(c, txt, x, y, { font: `900 ${size}px Nunito`, spacing: '4px', a });
  // panel field for overload: many windows at depth
  E.panelField = (c, t, o) => {
    const r = E.rng(o.seed || 1); const n = o.n || 30; const texts = o.texts || [];
    for (let i = 0; i < n; i++) {
      const x = (o.x || 0) + r() * (o.w || 1920), y = (o.y || 0) + r() * (o.h || 1080), w = 180 + r() * 260, h = 70 + r() * 70, ph = r() * 6.28, ta = (o.t0 || 0) + r() * (o.spread || 4);
      const s = E.pop(t, ta, 0.4) * (o.scale || 1); if (s <= 0) continue;
      const dx = Math.sin(t * 0.4 + ph) * 18, dy = Math.cos(t * 0.33 + ph) * 12;
      E.thought(c, { x: x + dx, y: y + dy, w, h, s, a: (o.a || 0.85) * (0.6 + 0.4 * r()), text: texts.length ? texts[i % texts.length] : undefined, size: 30 + r() * 10, seed: i, kind: o.kind }, t);
    }
  };
  E.CROWD_TEXT = ["I'm starving.", 'Why did she leave me on read?', 'I hate Mondays.', 'Did I fail chemistry?', 'Does anyone even like me?', 'Is my hair weird today?', 'Two more periods.', 'I should have studied.', 'Pizza again?', 'He looked at me!', 'So tired...', 'What time is it?', 'I forgot my homework', 'Is she mad at me?', 'Need more coffee', 'Did I lock my bike?', 'That test though...', 'Why is it so loud?'];
})();
// V2 helpers --------------------------------------------------------------
(function () {
  const E = globalThis.E;
  // absolute start / end of phrase k of a line (clamped to available phrases)
  E.sg = (id, k) => { const l = E.L(id); const s = l.segs && l.segs.length ? l.segs : [[l.start, l.end]]; return s[Math.min(k, s.length - 1)][0]; };
  E.sgE = (id, k) => { const l = E.L(id); const s = l.segs && l.segs.length ? l.segs : [[l.start, l.end]]; return s[Math.min(k, s.length - 1)][1]; };
  // key-light presets per location (rim direction + colour)
  E.KEY = {
    dusk: { dx: 1, dy: -0.4, color: '#ffb070' }, morningL: { dx: -1, dy: -0.4, color: '#ffd89a' }, morningR: { dx: 1, dy: -0.4, color: '#ffd89a' },
    classL: { dx: -1, dy: -0.35, color: '#ffd08a' }, hallR: { dx: 1, dy: -0.35, color: '#ffc87a' }, hallCool: { dx: 1, dy: -0.35, color: '#c9b8e8' },
    violet: { dx: 1, dy: -0.5, color: '#c79bff' }, bath: { dx: 0, dy: -1, color: '#9fc4ff' }, moon: { dx: 1, dy: -0.5, color: '#9fc4ff' },
    yardConf: { dx: 1, dy: -0.5, color: '#c9b8e8' }, yardWarmR: { dx: 1, dy: -0.4, color: '#ffc27a' }, yardWarmL: { dx: -1, dy: -0.4, color: '#ffc27a' }, sunset: { dx: 1, dy: -0.4, color: '#ffb46a' },
  };
  // day chip (corner date label)
  E.dayChip = (ctx, txt, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(14,8,22,0.72)'; ctx.beginPath(); ctx.roundRect(1560, 96, 250, 76, 16); ctx.fill(); ctx.strokeStyle = 'rgba(255,220,180,0.55)'; ctx.lineWidth = 2; ctx.stroke(); E.textGlow(ctx, txt, 1685, 135, { font: '900 40px Nunito', spacing: '5px', glowBlur: 14 }); ctx.restore(); };
  // front-facing desk (covers a seated student's legs)
  E.deskFront = (c, x, y, w, h, col = '#6b4436') => { c.fillStyle = col; c.fillRect(x - w / 2, y - h, w, h * 0.16); c.fillStyle = E.mixHex(col, '#000000', 0.35); c.fillRect(x - w / 2 + w * 0.04, y - h * 0.84, w * 0.92, h * 0.84); };
  // a stool/chair silhouette (side view)
  E.chairS = (c, x, y, s, dir = 1) => { c.strokeStyle = '#1e1218'; c.lineWidth = 6 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - dir * 24 * s, y - 120 * s); c.lineTo(x - dir * 24 * s, y); c.moveTo(x + dir * 24 * s, y - 52 * s); c.lineTo(x + dir * 24 * s, y); c.moveTo(x - dir * 28 * s, y - 52 * s); c.lineTo(x + dir * 28 * s, y - 52 * s); c.stroke(); };
})();
// cadence exceptions (see E.retime): impact/montage beats and moving Act-3 holds
(function () { const E = globalThis.E;
  E.BEATS = new Set(['s01h_eyes', 's01i_slowmo', 's01j_crash', 's03d_uh', 's03f_Bshout', 's04c_hide', 's06c_notsomuch', 's13d_howdid', 's04h_oh']);
  E.HOLDS = new Set(['s12a_ews', 's13b_projected', 's15d_scared', 's16a_face', 's17e_choose', 's17f_hug', 's19_endcard', 's16f_wide', 's15g_silence']);
})();
