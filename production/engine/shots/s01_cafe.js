// SCENE 1 — The first thought (café). Cold open → slow-mo cup → title card.
(function () {
  const E = globalThis.E;
  const RIM = { dx: 3, dy: -1 };
  const table = (c, x, y, s = 1) => { c.fillStyle = '#2a1826'; c.fillRect(x - 5 * s, y - 70 * s, 10 * s, 70 * s); c.fillRect(x - 28 * s, y - 4 * s, 56 * s, 6 * s); c.fillStyle = '#6b4a5a'; c.beginPath(); c.ellipse(x, y - 72 * s, 55 * s, 10 * s, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#efe6dc'; c.fillRect(x - 30 * s, y - 92 * s, 16 * s, 18 * s); c.fillRect(x + 14 * s, y - 92 * s, 16 * s, 18 * s); };
  const chair = (c, x, y, s = 1, dir = 1) => { c.strokeStyle = '#1a0f17'; c.lineWidth = 5 * s; c.beginPath(); c.moveTo(x - dir * 22 * s, y - 120 * s); c.lineTo(x - dir * 22 * s, y); c.moveTo(x + dir * 22 * s, y - 52 * s); c.lineTo(x + dir * 22 * s, y); c.moveTo(x - dir * 26 * s, y - 52 * s); c.lineTo(x + dir * 26 * s, y - 52 * s); c.stroke(); };

  // 1A — establishing EWS, dusk café, Noah walks toward the door
  E.cut('s01a_ews', 0, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.14, x: 960, dx: 60, y: 560, focus: 0.8, ap: 5 });
    const L = E.SET.cafeExt(t);
    L.push({ d: 0.8, draw: (c) => {
      table(c, 520, 900, 1); chair(c, 470, 900, 1, 1); chair(c, 575, 900, 1, -1);
      E.ch(c, 'woman', t, { x: 470, y: 900, h: 100, f: 0.7, pose: 'sit', expr: 'smile', rim: RIM, talk: 0 });
      E.char(c, { x: 575, y: 900, h: 104, f: -0.7, costume: E.extra(31), pose: 'sit', expr: 'happy', t, seed: 9, rim: RIM });
      const nx = E.lerp(1500, 1180, E.clamp(lt / D)); E.ch(c, 'noah', t, { x: nx, y: 902, h: 112, f: -0.8, pose: E.walkPose(lt * 1.7), expr: 'tired', rim: { dx: -2, dy: -1 } });
    } });
    L.push(E.dustL(t, { d: 0.9 }));
    E.layers(ctx, cam, L);
  }, { type: 'EWS', desc: 'Dusk café façade establishing; Noah walks toward the door; slow push-in.' });

  // 1B — through the window: two patrons whisper a secret / one hides crossed fingers (lie)
  E.cut('s01b_secret', E.at('s01_vo1', 0.36), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.12, x: 900, dx: 40, focus: 0.85, ap: 10 });
    const L = E.SET.cafeInt(t);
    L.push({ d: 0.85, draw: (c) => {
      const lean = E.seg(lt, 0.3, 1.0) * 0.6;
      table(c, 900, 900, 2.6);
      E.char(c, { x: 700, y: 990, h: 470, f: 0.8, costume: { hair: 'pony', top: 'cardigan', topC: '#3d8a8a', topS: '#2a6a6a', inner: '#efe6dc' }, pose: E.blendPose(E.POSE.sit, E.POSE.facepalm, E.seg(lt, 0.2, 0.7)), lean, expr: 'smug', t, seed: 4, rim: RIM });
      E.char(c, { x: 1110, y: 990, h: 480, f: -0.8, costume: E.extra(12), pose: 'sit', expr: lt > D * 0.55 ? 'shock' : 'neutral', t, seed: 6, rim: { dx: -3, dy: -1 } });
      // whisper squiggles
      const a = E.fadeIO(lt, 0.4, D, 0.3, 0.2); c.save(); c.globalAlpha = a; c.strokeStyle = '#f4ede6'; c.lineWidth = 4; c.lineCap = 'round';
      for (let i = 0; i < 3; i++) { const o = ((lt * 1.5 + i / 3) % 1); c.globalAlpha = a * (1 - o); c.beginPath(); c.arc(870 + o * 80, 560, 20 + o * 30, -0.6, 0.6); c.stroke(); } c.restore();
    } });
    L.push(E.fgHead(260, 860, 190));
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Inside café: patron whispers a secret to another (Every secret. Every lie.).' });

  // 1C — a girl glances at a boy on the café bench (crush)
  E.cut('s01c_crush', E.at('s01_vo1', 0.66), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 2.3, z1: 2.45, x: 760, y: 790, focus: 0.8, ap: 7 });
    const L = E.SET.cafeExt(t);
    L.push({ d: 0.8, draw: (c) => {
      c.fillStyle = '#4a2c34'; c.fillRect(640, 860, 260, 12); c.fillRect(650, 872, 10, 30); c.fillRect(880, 872, 10, 30);
      const glance = E.seg(lt, 0.6, 1.1);
      E.char(c, { x: 700, y: 900, h: 108, f: E.lerp(0.2, 0.85, glance), costume: { hair: 'bob', clip: '#9fc6ff', top: 'hoodie', topC: '#e8a070', topS: '#b97a50' }, pose: 'sit', expr: glance > 0.5 ? 'smile' : 'neutral', t, seed: 5, rim: RIM });
      E.char(c, { x: 830, y: 900, h: 116, f: 0.25, costume: E.extra(44), pose: 'sit', expr: 'neutral', look: [0, 0.5], t, seed: 8, rim: RIM });
      const p = E.pop(lt, 1.3, 0.4); if (p > 0) { c.save(); c.translate(705, 765 - Math.sin(lt * 2) * 3); c.scale(p, p); E.thought(c, { x: 0, y: 0, w: 46, h: 40, kind: 'pink', text: '?', size: 34 }, t); c.restore(); }
    } });
    L.push(E.dustL(t, { d: 0.9 }));
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Outside: a girl glances at a boy; tiny pink "?" thought (what your crush thinks).' });

  // 1D — morning: Noah wakes up with the power
  E.cut('s01d_wake', E.st('s01_vo2') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.25, z1: 1.4, x: 420, y: 640, focus: 1, ap: 8 });
    const L = E.SET.bedroom(t, { morning: true });
    L.push({ d: 1, draw: (c) => {
      const open = lt > D * 0.45;
      const sit = E.seg(lt, D * 0.55, D * 0.85, 'out');
      // pillow
      c.fillStyle = '#e8d8e8'; c.beginPath(); c.roundRect(-80, 640, 240, 70, 30); c.fill();
      E.char(c, { x: 360, y: 700, h: 360, f: 0, rot: -Math.PI / 2 * (1 - sit * 0.75), costume: 'noah', pose: 'stand', expr: open ? 'shock' : 'neutral', blink: !open, t, seed: 1, rim: { dx: 3, dy: -4, color: '#ffc98a' } });
      c.fillStyle = '#5a4a7a'; c.beginPath(); c.roundRect(180, 660, 560, 110, 30); c.fill(); c.fillStyle = '#6e5e92'; c.fillRect(180, 660, 560, 16);
      // nightstand + alarm
      c.fillStyle = '#3a2a40'; c.fillRect(-330, 650, 170, 230); c.fillStyle = '#c8302f'; c.beginPath(); c.roundRect(-300, 590, 100, 66, 14); c.fill(); c.fillStyle = '#ffe6a0'; c.font = '900 30px Nunito'; c.textAlign = 'center'; c.fillText('7:00', -250, 633);
      if (lt < 1.0) { const sh = Math.sin(lt * 70) * 3; c.strokeStyle = '#ffe6a0'; c.lineWidth = 3; c.beginPath(); c.arc(-250 + sh, 600, 70, -2.4, -0.7); c.stroke(); }
      const hx = E.lerp(64, 250, sit), hy = E.lerp(690, 420, sit);
      const p = E.seg(lt, D * 0.45, D * 0.95, 'out'); if (p > 0) { c.save(); c.globalCompositeOperation = 'lighter'; for (let k = 0; k < 3; k++) { const q = (p + k * 0.33) % 1; c.strokeStyle = E.rgba('#a98bff', (1 - q) * 0.6); c.lineWidth = 4; c.beginPath(); c.arc(hx, hy, 40 + q * 160, 0, Math.PI * 2); c.stroke(); } E.glow(c, hx, hy, 160, '#a98bff', 0.25 * p); c.restore(); }
    } });
    L.push(E.dustL(t, { color: '#ffe6b8', d: 1.2 }));
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Morning bedroom: alarm rings, Noah\'s eyes snap open and he sits up; a violet shimmer = the power arrives.' });

  // 1E — café counter OTS: barista hands Noah his coffee
  E.cut('s01e_handoff', E.M('counter') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, x: 900, focus: 0.8, ap: 12 });
    const L = E.SET.cafeInt(t);
    L.splice(2, 0, { d: 0.8, draw: (c) => { E.ch(c, 'barista', t, { x: 820, y: 1260, h: 760, f: 0.7, pose: E.poseAt(lt, [[0, 'stand'], [0.6, 'holdOut']]), expr: 'smile', prop: E.PROP.cup, rim: { dx: 6, dy: -2 } }); } });
    L.push({ d: 1.45, draw: (c) => { E.ch(c, 'noah', t, { x: 1540, y: 2150, h: 1900, f: -0.55, pose: 'stand', expr: 'tired', faceAlpha: 0, rim: { dx: -10, dy: -3 } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder: smiling barista hands him a coffee ("Here you go!").' });

  // 1F — CU barista: smile + thought appears behind her head
  E.cut('s01f_thought', E.st('s01_barista_th1') - 0.35, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 920, focus: 1, ap: 14 });
    const L = E.SET.cafeInt(t);
    L.push({ d: 1, draw: (c) => {
      const shake = E.seg(t, E.st('s01_barista_th1') + 0.6, E.en('s01_barista_th1'));
      E.ch(c, 'barista', t, { x: 640, y: E.headAt(1150, 470), h: 1150, f: 0.45, pose: 'holdOut', expr: 'smile', prop: E.PROP.cup, rim: { dx: 12, dy: -4 }, tilt: Math.sin(t * 30) * 0.01 * shake });
      E.th(c, 's01_barista_th1', t, { x: 1170, y: 300, w: 640, h: 160, tail: [790, 330], size: 48 });
    } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 1760, y: 2050, h: 1900, f: -0.5, faceAlpha: 0, rim: { dx: -12 } }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Barista keeps smiling (mouth closed) while a violet thought pops behind her: "Please don\'t spill it."' });

  // 1G — ECU Noah's eyes; reflections show the barista + falling cup
  E.cut('s01g_eyes', E.M('slip'), (ctx, lt, t, s) => {
    const D = E.D(s);
    ctx.save();
    const z = E.lerp(1, 1.12, E.ease.out(E.clamp(lt / D)));
    ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    E.vgrad(ctx, 0, 0, 1920, 1080, [[0, '#3a2430'], [1, '#1a0f17']]);
    ctx.fillStyle = '#f0a77e'; ctx.beginPath(); ctx.arc(960 + 14, 900, 1250, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0a080d'; ctx.beginPath(); ctx.arc(960, 900, 1250, 0, Math.PI * 2); ctx.fill();
    // tufts silhouette top
    const wide = E.seg(lt, 0.05, 0.35, 'back');
    for (const ex of [700, 1220]) {
      const r = 105 + 55 * wide;
      ctx.save(); ctx.beginPath(); ctx.arc(ex, 520, r, 0, Math.PI * 2); ctx.fillStyle = '#f4ede6'; ctx.fill(); ctx.clip();
      // reflection: warm café blur + barista silhouette + cup falling
      E.vgrad(ctx, ex - r, 520 - r, r * 2, r * 2, [[0, '#e8c8b0'], [1, '#c89a88']]);
      ctx.globalAlpha = 0.85; E.char(ctx, { x: ex - 25, y: 520 + r * 1.3, h: r * 1.9, f: 0.4, costume: 'barista', pose: 'holdOut', expr: 'shock', t, rim: false });
      const cy = 520 - r * 0.2 + E.ease.in(E.clamp(lt / D)) * r * 1.0; ctx.fillStyle = '#5a3a3a'; ctx.save(); ctx.translate(ex + r * 0.35, cy); ctx.rotate(lt * 2); ctx.fillRect(-12, -14, 24, 28); ctx.restore();
      ctx.globalAlpha = 1; ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(ex - r * 0.4, 520 - r * 0.45, r * 0.16, 0, Math.PI * 2); ctx.fill();
    }
    // brows jump
    ctx.strokeStyle = '#f4ede6'; ctx.lineWidth = 22; ctx.lineCap = 'round';
    for (const ex of [700, 1220]) { ctx.beginPath(); ctx.moveTo(ex - 90, 330 - 60 * wide); ctx.lineTo(ex + 90, 330 - 60 * wide); ctx.stroke(); }
    ctx.restore();
  }, { type: 'ECU', desc: 'Extreme close-up of Noah\'s eyes widening; pupils reflect the barista and the falling cup ("WHAT THE—").', post: { bloom: 0.25 } });

  // 1H — low-angle slow motion cup, time freeze, resume
  const cupDraw = (c, x, y, rot, s = 1, spill = 0) => {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    c.fillStyle = '#f0a77e'; c.beginPath(); c.moveTo(-62, -80); c.lineTo(68, -80); c.lineTo(58, 82); c.lineTo(-52, 82); c.closePath(); c.fill();
    c.fillStyle = '#efe6dc'; c.beginPath(); c.moveTo(-66, -82); c.lineTo(62, -82); c.lineTo(52, 80); c.lineTo(-56, 80); c.closePath(); c.fill();
    c.fillStyle = '#c8302f'; c.fillRect(-60, -10, 116, 36); c.fillStyle = '#efe6dc'; c.font = '900 22px Nunito'; c.textAlign = 'center'; c.fillText('☕', -2, 15);
    c.fillStyle = '#d8cfc4'; c.beginPath(); c.ellipse(-2, -82, 64, 14, 0, 0, Math.PI * 2); c.fill();
    c.restore();
    if (spill > 0) { for (let i = 0; i < 9; i++) { const a = rot - 1.9 + i * 0.12, d = 80 + spill * (60 + i * 14); c.fillStyle = '#6b3a2a'; c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 9 - i * 0.6, 0, Math.PI * 2); c.fill(); } }
  };
  E.cut('s01h_slowmo', E.M('freeze') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const tf0 = E.M('freeze') - s.t0, tf1 = tf0 + 0.95; // frozen window
    const frozen = lt > tf0 && lt < tf1;
    const simT = lt < tf0 ? lt * 0.25 : lt < tf1 ? tf0 * 0.25 : tf0 * 0.25 + (lt - tf1) * 1.6;
    const cam = E.cam({ z: 1.0 + lt * 0.03, focus: 1, ap: 14, rot: -0.05 });
    const L = E.SET.cafeInt(frozen ? s.t0 + tf0 : t);
    L.push({ d: 1, draw: (c) => {
      const y = 330 + simT * simT * 420, x = 960 + simT * 60;
      cupDraw(c, x, y, 0.4 + simT * 2.4, 1.3, E.clamp(simT * 2));
      if (frozen) { c.save(); c.globalCompositeOperation = 'lighter'; const q = (lt - tf0) / 0.95; c.strokeStyle = E.rgba('#a98bff', 0.6 * (1 - q)); c.lineWidth = 6; c.beginPath(); c.arc(x, y, 120 + q * 500, 0, Math.PI * 2); c.stroke(); c.restore(); }
    } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'barista', t, { x: 360, y: 2400, h: 2100, f: 0.4, pose: 'reach', faceAlpha: 0, rim: { dx: 12 } }) });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Low-angle slow motion: the cup tumbles, time FREEZES (violet pulse), then resumes falling.', post: (lt) => ({ desat: 0, grade: { color: '#6a4bd0', a: 0.0 } }) });

  // 1I — impact: cup shatters on the tiles
  E.cut('s01i_crash', E.M('crash') - 0.05, (ctx, lt, t, s) => {
    const cam = E.cam({ z: 1.0 + lt * 0.02, x: 960, y: 640, focus: 1, ap: 12, shakeX: lt < 0.25 ? Math.sin(lt * 90) * 10 : 0 });
    const L = [{ d: 0.3, draw: (c) => { E.vgrad(c, -400, -200, 2800, 1400, [[0, '#4a2c2c'], [0.6, '#3a2228'], [1, '#2a171c']]); c.strokeStyle = 'rgba(255,220,190,0.08)'; c.lineWidth = 3; for (let i = -10; i < 30; i++) { c.beginPath(); c.moveTo(960, 520); c.lineTo(i * 140 - 400, 1300); c.stroke(); } for (let j = 0; j < 8; j++) { c.beginPath(); c.moveTo(-400, 620 + j * j * 12); c.lineTo(2400, 620 + j * j * 12); c.stroke(); } E.pool(c, 960, 760, 600, 120, '#ffd59a', 0.15); } }];
    L.push({ d: 1, draw: (c) => {
      const imp = 0.12;
      if (lt < imp) cupDraw(c, 960, 520 + (lt / imp) * 200, 2.2, 1.2);
      else {
        const k = lt - imp; const r = E.rng(4);
        c.fillStyle = '#6b3a2a'; c.beginPath(); c.ellipse(960, 760, 80 + Math.min(1, k * 3) * 220, 22 + Math.min(1, k * 3) * 50, 0, 0, Math.PI * 2); c.fill();
        for (let i = 0; i < 9; i++) { const a = -Math.PI * r(), sp = 400 + r() * 500; const dx = Math.cos(a) * sp * Math.min(k, 0.6), dy = Math.sin(a) * sp * Math.min(k, 0.35) + 900 * Math.min(k, 0.35) ** 2; c.save(); c.translate(960 + dx, Math.min(780, 720 + dy)); c.rotate(k * (r() * 8 - 4)); c.fillStyle = i % 3 ? '#efe6dc' : '#c8302f'; c.beginPath(); c.moveTo(-24, -14); c.lineTo(26, -8); c.lineTo(8, 18); c.closePath(); c.fill(); c.restore(); }
      }
    } });
    E.layers(ctx, cam, L);
  }, { type: 'INSERT', desc: 'Floor-level: the cup smashes; coffee splashes, shards scatter.', post: (lt) => ({ flash: { color: '#ffffff', a: lt > 0.12 && lt < 0.2 ? 0.35 : 0 } }) });

  // 1J — barista horrified + "I'm getting fired."
  E.cut('s01j_fired', E.st('s01_barista_th2') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.08, z1: 1.16, x: 900, focus: 1, ap: 12 });
    const L = E.SET.cafeInt(t);
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'barista', t, { x: 760, y: E.headAt(1050, 500), h: 1050, f: 0.2, pose: 'clutch', expr: 'worried', look: [0, 1], rim: { dx: 10, dy: -4 } });
      E.th(c, 's01_barista_th2', t, { x: 1300, y: 320, w: 470, h: 130, tail: [900, 340], size: 52 });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Barista looks down in horror, hands to chest; thought: "I\'m getting fired."' });

  // TITLE — EWS with the title card (Ifverse 0:36 homage)
  E.cut('s01k_title', E.M('TITLE') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.12, z1: 1.0, x: 960, y: 560, focus: 0.8, ap: 4 });
    const L = E.SET.cafeExt(t);
    L.push({ d: 0.8, draw: (c) => { E.ch(c, 'noah', t, { x: E.lerp(1150, 1420, E.clamp(lt / D)), y: 902, h: 112, f: 0.8, pose: E.walkPose(lt * 1.5), expr: 'shock', rim: RIM }); } });
    L.push(E.dustL(t, { d: 0.9 }));
    E.layers(ctx, cam, L);
    const a1 = E.seg(lt, 0.3, 1.0), a2 = E.seg(lt, 0.8, 1.6); const fo = 1 - E.seg(lt, D - 0.5, D);
    E.textGlow(ctx, 'WHAT IF YOU COULD HEAR', 960, 175 - 10 * (1 - a1), { font: '900 66px Nunito', spacing: '7px', a: a1 * fo });
    E.textGlow(ctx, "EVERYONE'S THOUGHTS?", 960, 272 - 10 * (1 - a2), { font: '900 104px Nunito', spacing: '7px', a: a2 * fo });
  }, { type: 'EWS', desc: 'Title card over the café façade: "WHAT IF YOU COULD HEAR EVERYONE\'S THOUGHTS?"' });
})();
