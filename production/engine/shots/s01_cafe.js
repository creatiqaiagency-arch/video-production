// SCENE 1 (V2) — hook vignettes → Monday wake-up → morning café → the first thought → slow-mo mug → title.
(function () {
  const E = globalThis.E;
  const K = E.KEY;
  const table = (c, x, y, s = 1) => { c.fillStyle = '#2a1826'; c.fillRect(x - 5 * s, y - 70 * s, 10 * s, 70 * s); c.fillRect(x - 28 * s, y - 4 * s, 56 * s, 6 * s); c.fillStyle = '#6b4a5a'; c.beginPath(); c.ellipse(x, y - 72 * s, 55 * s, 10 * s, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#efe6dc'; c.fillRect(x - 30 * s, y - 92 * s, 16 * s, 18 * s); c.fillRect(x + 14 * s, y - 92 * s, 16 * s, 18 * s); };
  // ceramic mug (side view) — consistent prop from hand-off to shatter
  E.mug = (c, x, y, rot, s = 1) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    c.strokeStyle = '#efe6dc'; c.lineWidth = 12; c.beginPath(); c.arc(50, 0, 26, -1.2, 1.2); c.stroke();
    c.fillStyle = '#efe6dc'; c.beginPath(); c.roundRect(-50, -55, 100, 110, 14); c.fill();
    c.fillStyle = 'rgba(120,90,110,0.35)'; c.fillRect(10, -55, 40, 110);
    c.fillStyle = '#c8302f'; c.fillRect(-50, -12, 100, 22);
    c.fillStyle = '#5a3022'; c.beginPath(); c.ellipse(0, -55, 50, 9, 0, 0, Math.PI * 2); c.fill(); c.restore(); };
  E.PROP.mug = (x, hf, hb, h) => E.mug(x, hf[0] + h * 0.01, hf[1] - h * 0.035, 0, h * 0.0006 * 1.0);

  // 1A — dusk café teaser EWS: thought windows pop over several patrons ("EVERYONE was thinking")
  E.cut('s01a_everyone', 0, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, x: 960, dx: 40, y: 600, focus: 0.8, ap: 4 });
    const L = E.SET.cafeExt(t);
    const pats = [[470, 'woman', 0.7], [575, E.extra(31), -0.7], [1230, E.extra(33), 0.6], [1330, E.extra(35), -0.6]];
    L.push({ d: 0.8, draw: (c) => {
      table(c, 520, 900, 1); table(c, 1280, 900, 1);
      pats.forEach(([x, cos, f], i) => E.char(c, { x, y: 900, h: 102, f, costume: cos, pose: 'sit', expr: ['smile', 'happy', 'neutral', 'smug'][i], t, seed: i + 3, rim: K.dusk, seat: '#1e1218' }));
      ['Did he notice?', 'So bored...', 'I forgot her name', 'Pizza later?'].forEach((txt, i) => { const p = E.pop(t, 1.4 + i * 0.45, 0.35); if (p > 0) E.thought(c, { x: pats[i][0] + (i % 2 ? 40 : -40), y: 780 - (i % 2) * 34, w: 200, h: 54, s: p * 0.85, text: txt, size: 30, seed: i, tail: [pats[i][0], 820], noClamp: true }, t); });
    } });
    L.push(E.dustL(t, { d: 0.9 }));
    E.layers(ctx, cam, L);
  }, { type: 'EWS', desc: 'Dusk café façade (teaser): one by one, a violet thought window pops above every patron ("what EVERYONE was thinking").' });

  // 1B — "Every secret. Every lie." two friends at a table, both thoughts visible
  E.cut('s01b_secretlie', E.sg('s01_vo1', 3) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.12, x: 940, focus: 0.85, ap: 10 });
    const L = E.SET.cafeInt(t);
    L.push({ d: 0.85, draw: (c) => {
      table(c, 940, 960, 2.6);
      E.char(c, { x: 720, y: 1000, h: 470, f: 0.8, costume: { hair: 'pony', top: 'cardigan', topC: '#c98aa0', topS: '#9e6479', inner: '#efe6dc' }, pose: E.poseAt(lt, [[0, 'sit'], [0.5, E.blendPose(E.POSE.sit, E.POSE.facepalm, 0.7)]]), lean: 0.4, expr: 'smug', t, seed: 4, rim: K.dusk });
      E.char(c, { x: 1160, y: 1000, h: 480, f: -0.8, costume: E.extra(12), pose: 'sit', expr: lt > D * 0.5 ? 'smile' : 'neutral', t, seed: 6, rim: { dx: -1, dy: -0.4, color: '#ffb070' } });
      E.thought(c, { x: 560, y: 360, w: 360, h: 80, s: E.pop(lt, 0.15), text: 'I copied her homework.', size: 38, tail: [700, 470], seed: 1 }, t);
      E.thought(c, { x: 1330, y: 400, w: 330, h: 80, s: E.pop(lt, E.sg('s01_vo1', 4) - s.t0 - 0.1), text: "I'm SO not fine.", size: 38, tail: [1170, 490], seed: 2 }, t);
      if (lt > D * 0.45) E.caption(c, '"I\'m fine!"', 1170, 330, E.seg(lt, D * 0.45, D * 0.55), 34);
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Café table: a girl leans in, thinking "I copied her homework." (a secret); her friend says "I\'m fine!" while thinking "I\'m SO not fine." (a lie).' });

  // 1C — crush: girl on a bench glances at a boy; pink thought
  E.cut('s01c_crush', E.sg('s01_vo1', 5) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 2.3, z1: 2.45, x: 770, y: 770, focus: 0.8, ap: 7 });
    const L = E.SET.cafeExt(t);
    L.push({ d: 0.8, draw: (c) => {
      c.fillStyle = '#4a2c34'; c.fillRect(640, 860, 260, 12); c.fillRect(650, 872, 10, 30); c.fillRect(880, 872, 10, 30);
      const glance = E.seg(lt, 0.5, 1.0);
      E.char(c, { x: 700, y: 900, h: 108, f: E.lerp(0.2, 0.85, glance), costume: { hair: 'bob', clip: '#9fc6ff', top: 'hoodie', topC: '#e8a070', topS: '#b97a50' }, pose: 'sit', seat: false, expr: glance > 0.5 ? 'smile' : 'neutral', t, seed: 5, rim: K.dusk });
      E.char(c, { x: 830, y: 900, h: 116, f: 0.25, costume: E.extra(44), pose: 'sit', seat: false, expr: 'neutral', look: [0, 0.5], t, seed: 8, rim: K.dusk });
      E.thought(c, { x: 690, y: 775, w: 150, h: 30, s: E.pop(lt, 1.0) * 0.45, kind: 'pink', text: 'He\'s kinda cute...', size: 30, tail: [702, 805], noClamp: true }, t);
    } });
    L.push(E.dustL(t, { d: 0.9 }));
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'A girl on a bench steals a glance at the boy beside her; a pink thought: "He\'s kinda cute..." (what your crush actually thinks).' });

  // 1D — MONDAY: alarm, Noah's eyes snap open, he sits up (hip pivot)
  const bed = (c) => { c.fillStyle = '#e8d8e8'; c.beginPath(); c.roundRect(-120, 625, 240, 70, 30); c.fill(); c.fillStyle = '#3a2a4a'; c.fillRect(-160, 700, 980, 40); c.fillStyle = '#2a1e36'; c.fillRect(-160, 740, 980, 140); };
  E.cut('s01d_wake', E.st('s01_vo2') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.25, z1: 1.35, x: 380, y: 600, focus: 1, ap: 8 });
    const L = E.SET.bedroom(t, { morning: true });
    L.push({ d: 1, draw: (c) => {
      bed(c);
      const open = lt > 0.9, up = E.seg(lt, 1.25, 2.2, 'out');
      E.ch(c, 'noah', t, { x: 330, y: 700 + 0.45 * 360, h: 360, f: 0.6, pose: 'sit', hipRot: E.lerp(-Math.PI / 2 + 0.05, 0, up), expr: open ? 'shock' : 'neutral', blink: !open, rim: K.morningR, seat: false, shadow: false, talk: 0 });
      c.fillStyle = '#6e5e92'; c.beginPath(); c.roundRect(300, 655, 520, 70, 24); c.fill(); c.fillStyle = '#7e6ea2'; c.fillRect(300, 655, 520, 14); // duvet over legs
      c.fillStyle = '#3a2a40'; c.fillRect(-330, 650, 150, 230); c.fillStyle = '#c8302f'; c.beginPath(); c.roundRect(-305, 590, 100, 62, 14); c.fill(); c.fillStyle = '#ffe6a0'; c.font = '900 30px Nunito'; c.textAlign = 'center'; c.fillText('7:00', -255, 632);
      if (lt < 1.1) { const sh = Math.sin(lt * 70) * 3; c.strokeStyle = '#ffe6a0'; c.lineWidth = 3; for (const r of [60, 85]) { c.beginPath(); c.arc(-255 + sh, 600, r, -2.4, -0.7); c.stroke(); } }
      E.cone(c, 1390, 560, 420, 1300, 900, '#ffd89a', 0.1, 0.55);
    } });
    L.push(E.dustL(t, { color: '#ffe6b8', d: 1.2 }));
    E.layers(ctx, cam, L);
    E.dayChip(ctx, 'MONDAY', E.fadeIO(lt, 0.3, D, 0.3, 0.3));
  }, { type: 'MS', desc: 'MONDAY chip. The alarm rings at 7:00; Noah\'s eyes snap open and he sits up in bed in warm morning light.' });

  // 1D2 — ECU: violet shimmer ripples out from Noah's head ("exactly that power")
  E.cut('s01d2_power', E.sg('s01_vo2', 3) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.12, focus: 1, ap: 14 });
    const L = E.SET.bedroom(t, { morning: true }); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'noah', t, { x: 900, y: E.headAt(1500, 520), h: 1500, f: 0.25, pose: 'stand', expr: 'amazed', look: [0.2, -0.4], rim: K.morningR, talk: 0 });
      c.save(); c.globalCompositeOperation = 'lighter'; for (let k = 0; k < 4; k++) { const q = (lt * 0.7 + k * 0.25) % 1; c.strokeStyle = E.rgba('#a98bff', (1 - q) * 0.7); c.lineWidth = 6; c.beginPath(); c.arc(930, 500, 230 + q * 520, 0, Math.PI * 2); c.stroke(); } E.glow(c, 930, 500, 520, '#a98bff', 0.22); c.restore();
    } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Close-up: violet rings ripple out from Noah\'s head as he realises something is different ("exactly that power").', post: { bloom: 0.3 } });

  // 1E — morning café exterior: Noah walks in
  E.cut('s01e_enter', E.M('enter') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.35, z1: 1.45, x: 1000, y: 700, focus: 0.8, ap: 5 });
    const L = E.SET.cafeExtAM(t);
    L.push({ d: 0.8, draw: (c) => { E.ch(c, 'noah', t, { x: E.lerp(1420, 1180, E.clamp(lt / D)), y: 902, h: 118, f: -0.8, pose: E.walkPose(lt * 1.8), expr: 'tired', rim: K.morningL });
      for (let i = 0; i < 2; i++) E.char(c, { x: 600 + i * 200 + lt * 40, y: 902, h: 112, f: 0.8, costume: E.extra(80 + i), pose: E.walkPose(lt * 1.6 + i), t, seed: i, rim: K.morningL }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Morning: the same café in daylight; Noah, sleepy, walks in for his coffee.' });

  // 1F — OTS: barista slides a ceramic mug across the counter; Noah's hand comes in
  E.cut('s01f_handoff', E.M('counter') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.1, x: 900, focus: 0.8, ap: 12 });
    const L = E.SET.cafeIntAM(t);
    const give = E.seg(lt, 0.2, 1.0, 'out');
    L.splice(2, 0, { d: 0.8, draw: (c) => { E.ch(c, 'barista', t, { x: 760, y: 1240, h: 900, f: 0.7, pose: E.blendPose(E.POSE.stand, E.POSE.holdOut, give), expr: 'smile', prop: E.PROP.mug, rim: K.morningL, shadow: false, ground: false }); } });
    L.push({ d: 1.45, draw: (c) => { E.ch(c, 'noah', t, { x: 1600, y: 2150, h: 1900, f: -0.55, pose: E.blendPose(E.POSE.stand, E.POSE.reach, E.seg(lt, D * 0.55, D * 0.9)), expr: 'tired', faceAlpha: 0, rim: K.morningL, shadow: false, ground: false }); } });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder: the smiling barista slides a ceramic mug toward him — "Here you go! Have a great day!" — and his hand reaches in.' });

  // 1G — CU barista smiling, mouth shut; her thought appears beside her bun; the mug slips in the last beat
  E.cut('s01g_thought', E.st('s01_barista_th1') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 900, focus: 1, ap: 14 });
    const L = E.SET.cafeIntAM(t);
    const slip = E.seg(lt, D - 0.45, D, 'in');
    L.push({ d: 1, draw: (c) => {
      const shake = E.seg(t, E.st('s01_barista_th1') + 0.6, E.en('s01_barista_th1'));
      E.ch(c, 'barista', t, { x: 900, y: E.headAt(1150, 470), h: 1150, f: 0.4, pose: 'holdOut', expr: 'smile', rim: K.morningL, tilt: Math.sin(t * 30) * 0.012 * shake, ground: false, shadow: false });
      E.mug(c, 1290 + slip * 30, 730 + slip * slip * 260, slip * 0.9, 0.9);
      E.th(c, 's01_barista_th1', t, { x: 420, y: 300, w: 560, h: 120, tail: [760, 330], size: 46 });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'The barista keeps smiling (mouth closed) while her thought appears beside her head: "Please don\'t spill it. Please don\'t spill it." — the mug starts to slip from her fingers.' });

  // 1H — ECU Noah's eyes: real face, café blurred behind, eyes widen, falling mug reflected
  E.cut('s01h_eyes', E.M('slip') + 0.05, (ctx, lt, t, s) => {
    const D = E.D(s);
    const L = E.SET.cafeIntAM(t); L.forEach((l) => (l.d = 0.2));
    E.layers(ctx, E.cam({ z: 1.4, focus: 1, ap: 24 }), L);
    ctx.save(); const z = E.lerp(1, 1.1, E.ease.out(E.clamp(lt / D))); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    ctx.fillStyle = '#ffd89a'; ctx.beginPath(); ctx.arc(960 - 16, 1060 - 10, 900, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0d0a10'; ctx.beginPath(); ctx.arc(960, 1060, 900, 0, Math.PI * 2); ctx.fill();
    const wide = E.seg(lt, 0.05, 0.3, 'back');
    for (const ex of [720, 1200]) {
      const r = 92 + 46 * wide;
      ctx.save(); ctx.beginPath(); ctx.arc(ex, 470, r, 0, Math.PI * 2); ctx.fillStyle = '#f2e8dc'; ctx.fill(); ctx.clip();
      ctx.globalAlpha = 0.5; ctx.fillStyle = '#c9b8a8'; ctx.fillRect(ex - r, 470 - r * 0.2, r * 2, r * 0.6);
      ctx.globalAlpha = 0.85; const my = 470 - r * 0.5 + E.ease.in(E.clamp(lt / D)) * r * 1.1; E.mug(ctx, ex + r * 0.15, my, lt * 3, r / 300);
      ctx.restore();
      ctx.fillStyle = '#ffe6b0'; ctx.beginPath(); ctx.arc(ex - r * 0.42, 470 - r * 0.42, r * 0.14, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#f2e8dc'; ctx.lineWidth = 20; ctx.lineCap = 'round';
    for (const ex of [720, 1200]) { ctx.beginPath(); ctx.moveTo(ex - 85, 300 - 55 * wide); ctx.lineTo(ex + 85, 300 - 55 * wide); ctx.stroke(); }
    ctx.restore();
  }, { type: 'ECU', desc: 'Extreme close-up of Noah\'s face: his eyes snap wide and the falling mug is reflected in them ("WHAT THE—").', post: { bloom: 0.2 } });

  // 1I — low-angle slow motion: mug tumbles, time FREEZES (violet pulse), then resumes
  E.cut('s01i_slowmo', E.M('freeze') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const tf0 = 0.25, tf1 = tf0 + 0.85;
    const frozen = lt > tf0 && lt < tf1;
    const simT = lt < tf0 ? lt * 0.25 : lt < tf1 ? tf0 * 0.25 : tf0 * 0.25 + (lt - tf1) * 1.3;
    const cam = E.cam({ z: 1.0 + lt * 0.03, focus: 1, ap: 14, rot: -0.05 });
    const L = E.SET.cafeIntAM(frozen ? s.t0 + tf0 : t);
    L.push({ d: 1, draw: (c) => {
      const y = 360 + simT * simT * 520 + simT * 120, x = 900 + simT * 50;
      E.mug(c, x, y, 0.3 + simT * 2.6, 1.4);
      if (frozen) { c.save(); c.globalCompositeOperation = 'lighter'; const q = (lt - tf0) / 0.85; c.strokeStyle = E.rgba('#a98bff', 0.7 * (1 - q)); c.lineWidth = 7; c.beginPath(); c.arc(x, y, 140 + q * 600, 0, Math.PI * 2); c.stroke(); c.restore(); }
      for (let i = 0; i < 6; i++) { const a = 0.6 + i * 0.35, d = 90 + simT * 140 + i * 6; c.fillStyle = '#5a3022'; c.beginPath(); c.arc(x + Math.cos(a) * d * 0.6, y - 60 + Math.sin(a) * d * 0.3, 8 - i * 0.8, 0, Math.PI * 2); c.fill(); }
    } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 1720, y: 2300, h: 2000, f: -0.5, pose: 'reach', faceAlpha: 0, rim: K.morningL, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
    if (frozen) E.screenFill(ctx, '#6a4bd0', 0.12, 'soft-light');
  }, { type: 'LOW', desc: 'Low-angle slow motion: the ceramic mug tumbles past Noah\'s reaching silhouette (right), time FREEZES with a violet pulse, then resumes.' });

  // 1J — floor level: the mug shatters; barista's feet for scale
  E.cut('s01j_crash', E.M('crash') - 0.05, (ctx, lt, t, s) => {
    const cam = E.cam({ z: 1.0 + lt * 0.02, x: 960, y: 600, focus: 1, ap: 10, shakeX: lt < 0.25 ? Math.sin(lt * 90) * 10 : 0 });
    const L = [{ d: 0.3, draw: (c) => { E.vgrad(c, -400, -200, 2800, 1400, [[0, '#6a4a4a'], [0.45, '#4a2c2c'], [1, '#2a171c']]); E.room(c, t, { back: [560, 120, 1360, 470], backC: '#6a4a4a', wallL: '#5a3a3e', wallR: '#5a3a3e', floor: '#3a2228', floorFar: '#5a3a3a', ceil: '#4a3038' }); } }];
    L.push({ d: 1, draw: (c) => {
      for (const fx of [520, 680]) { c.fillStyle = '#0a080d'; c.beginPath(); c.roundRect(fx, 560, 30, 240, 14); c.fill(); c.beginPath(); c.roundRect(fx - 10, 790, 70, 26, 12); c.fill(); }
      const imp = 0.12;
      if (lt < imp) E.mug(c, 960, 480 + (lt / imp) * 320, 2.4, 1.3);
      else { const k = lt - imp; const r = E.rng(4);
        c.fillStyle = '#5a3022'; c.beginPath(); c.ellipse(960, 820, 90 + Math.min(1, k * 3) * 260, 22 + Math.min(1, k * 3) * 50, 0, 0, Math.PI * 2); c.fill();
        for (let i = 0; i < 11; i++) { const a = -Math.PI * r(), sp = 420 + r() * 520; const dx = Math.cos(a) * sp * Math.min(k, 0.6), dy = Math.sin(a) * sp * Math.min(k, 0.3) + 1100 * Math.min(k, 0.3) ** 2; c.save(); c.translate(960 + dx, Math.min(840, 780 + dy)); c.rotate(k * (r() * 8 - 4)); c.fillStyle = i % 4 ? '#efe6dc' : '#c8302f'; c.beginPath(); c.moveTo(-30, -16); c.lineTo(32, -10); c.lineTo(10, 22); c.closePath(); c.fill(); c.restore(); }
        for (let i = 0; i < 14; i++) { const a = -0.3 - r() * 2.5, d = Math.min(k, 0.4) * (300 + r() * 400); c.fillStyle = '#5a3022'; c.beginPath(); c.arc(960 + Math.cos(a) * d, 800 + Math.sin(a) * d * 0.6 + 600 * Math.min(k, 0.4) ** 2, 6 + r() * 6, 0, Math.PI * 2); c.fill(); } }
    } });
    E.layers(ctx, cam, L);
  }, { type: 'INSERT', desc: 'Floor level, the barista\'s feet behind: the ceramic mug smashes — coffee splash, shards scatter.', post: (lt) => ({ flash: { color: '#ffffff', a: lt > 0.12 && lt < 0.2 ? 0.3 : 0 } }) });

  // 1K — barista horrified, hands to chest; "I'm getting fired."
  E.cut('s01k_fired', E.st('s01_barista_th2') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.08, z1: 1.16, x: 960, focus: 1, ap: 12 });
    const L = E.SET.cafeIntAM(t);
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'barista', t, { x: 1060, y: E.headAt(1050, 500), h: 1050, f: -0.2, pose: 'clutch', expr: 'worried', look: [0, 0.9], tilt: 0.1, rim: K.morningL, ground: false, shadow: false });
      E.th(c, 's01_barista_th2', t, { x: 520, y: 330, w: 460, h: 110, tail: [880, 350], size: 50 });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'The barista stares down at the mess, hands clutched to her chest; thought: "I\'m getting fired."' });

  // TITLE — dusk façade, bold opaque title in the sky
  E.cut('s01l_title', E.M('TITLE') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.1, z1: 1.0, x: 960, y: 600, focus: 0.8, ap: 4 });
    const L = E.SET.cafeExt(t);
    L.push({ d: 0.8, draw: (c) => E.ch(c, 'noah', t, { x: E.lerp(1150, 1420, E.clamp(lt / D)), y: 902, h: 112, f: 0.8, pose: E.walkPose(lt * 1.5), expr: 'shock', rim: K.dusk }) });
    L.push(E.dustL(t, { d: 0.9 }));
    E.layers(ctx, cam, L);
    const a1 = E.seg(lt, 0.2, 0.7), a2 = E.seg(lt, 0.5, 1.1); const fo = 1 - E.seg(lt, D - 0.35, D);
    const sc = 0.94 + 0.06 * E.ease.out(E.clamp(lt / 1.2));
    ctx.save(); ctx.translate(960, 230); ctx.scale(sc, sc);
    E.textGlow(ctx, 'WHAT IF YOU COULD HEAR', 0, -50, { font: '900 70px Nunito', spacing: '7px', color: '#fff1d6', a: a1 * fo, shadowBlur: 10, glowBlur: 30 });
    E.textGlow(ctx, "EVERYONE'S THOUGHTS?", 0, 50, { font: '900 112px Nunito', spacing: '7px', color: '#fff1d6', a: a2 * fo, shadowBlur: 10, glowBlur: 34 });
    ctx.restore();
  }, { type: 'EWS', desc: 'Title card in the dusk sky above the café: "WHAT IF YOU COULD HEAR EVERYONE\'S THOUGHTS?" (bold, glowing, fully opaque).' });
})();
