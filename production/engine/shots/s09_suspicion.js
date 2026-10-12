// SCENE 9 — imagining the worst · SCENE 10 — Maya · SCENE 11 — the growing suspicion.
(function () {
  const E = globalThis.E;
  const RIM = { dx: 4, dy: -2, color: '#ffd2a0' };
  const library = (t) => { // reuse classroom walls as a study room with shelves
    const L = E.SET.classroom(t, { noDesksBack: true });
    L.splice(1, 0, { d: 0.3, draw: (c) => { for (let k = 0; k < 2; k++) { const x = 250 + k * 1050; c.fillStyle = '#4a2c2c'; c.fillRect(x, 160, 600, 520); for (let j = 0; j < 4; j++) { c.fillStyle = '#2a1826'; c.fillRect(x, 160 + j * 130 + 118, 600, 12); const r = E.rng(j + k * 9); for (let i = 0; i < 18; i++) { c.fillStyle = ['#c98aa0', '#3d8a8a', '#e8a070', '#6b7fd6', '#d0a040'][Math.floor(r() * 5)]; c.fillRect(x + 12 + i * 32, 160 + j * 130 + 30 + r() * 20, 26, 88 - r() * 20); } } } } });
    return L;
  };

  // 9A — Noah at his desk, staring, can't stop thinking (thought echo replays)
  E.cut('s09a_stare', E.M('S09'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 14 });
    const L = E.SET.classroom(t + 30); L[0].d = 0.3; L[1].skip = true;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 820, y: E.headAt(1000, 480), h: 1000, f: 0.5, pose: { aB: [0.9, 1.0], aF: [1.0, 2.4], lB: [1.5, -1.5], lF: [1.45, -1.5] }, expr: 'worried', look: [0.6, 0.4], rim: RIM }); E.desk(c, 980, 1400, 3.6); } });
    E.layers(ctx, cam, L);
    // echo of Leo's words circling, fading
    ["I can't keep doing this.", "He's gonna hate me."].forEach((txt, i) => { const p = (lt * 0.3 + i * 0.5) % 1; E.floatText(ctx, txt, 1350 + Math.cos(p * 6.28 + i) * 80, 320 + i * 260 + Math.sin(p * 6.28) * 30, { size: 52, a: 0.55 * Math.sin(p * Math.PI) }); });
  }, { type: 'CU', desc: 'Noah at his desk, chin in hand, worried; Leo\'s two thoughts echo and drift around him.' });

  // 9B — Leo snaps a laptop shut as Noah approaches (library)
  E.cut('s09b_laptop', E.ph('s09_vo1', 1, 4) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.6, z1: 1.7, x: 1040, y: 640, focus: 1, ap: 9 });
    const L = library(t);
    L.push({ d: 1, draw: (c) => {
      const shut = E.seg(lt, 0.7, 0.95);
      E.desk(c, 1150, 880, 1.2);
      E.ch(c, 'leo', t, { x: 1000, y: 880, h: 330, f: 0.8, pose: shut > 0.5 ? 'sitDesk' : 'laptop', expr: shut > 0.5 ? 'nervous' : 'neutral', look: shut > 0.5 ? [-1, 0] : [1, 0.5], rim: RIM, f: shut > 0.5 ? -0.6 : 0.8 });
      // laptop
      c.save(); c.translate(1130, 734); c.fillStyle = '#c9c0c8'; c.fillRect(-60, 0, 120, 8); c.rotate(-Math.PI / 2 * (1 - shut) - 0.05); c.fillStyle = '#c9c0c8'; c.fillRect(-60, -6, 120, 8); c.restore();
      if (shut < 0.8) { E.glow(c, 1130, 690, 90, '#8fb4ff', 0.4 * (1 - shut)); }
      E.ch(c, 'noah', t, { x: E.lerp(560, 760, E.seg(lt, 0, 1.0, 'out')), y: 905, h: 340, f: 0.8, pose: E.walkPose(lt * 1.5, 1 - E.seg(lt, 0.6, 1.0)), expr: 'worried', rim: RIM });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Library: Leo quickly snaps his laptop shut as Noah walks up ("Was Leo planning to ditch him?").' });

  // 9C — Leo ends a phone call abruptly when he sees Noah
  E.cut('s09c_phone', E.ph('s09_vo1', 2, 4) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 12 });
    const L = E.SET.hallway(t + 3); L[0].d = 0.3; L[1].d = 0.4;
    L.push({ d: 1, draw: (c) => { const off = E.seg(lt, 0.6, 0.9); E.ch(c, 'leo', t, { x: 1100, y: E.headAt(1000, 480), h: 1000, f: E.lerp(0.6, -0.4, off), pose: off > 0.5 ? 'pocket' : 'phone', prop: off > 0.5 ? null : E.PROP.phone, expr: off > 0.5 ? 'awkward' : 'happy', look: [off > 0.5 ? -0.8 : 0.5, 0], rim: RIM, talk: off > 0.5 ? 0 : 0.2 + 0.2 * Math.abs(Math.sin(lt * 9)) }); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 360, y: 2000, h: 1700, f: 0.6, faceAlpha: 0, rim: RIM }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder: Leo laughs on the phone, sees Noah, hangs up abruptly with an awkward smile ("lying this whole time?").' });

  // 9D — Leo at his locker; thought: "I wish he'd stop asking."
  E.cut('s09d_stopasking', E.st('s09_leo_th1') - 0.6, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.55, z1: 1.62, x: 1080, y: 620, focus: 1, ap: 9 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1180, y: 905, h: 345, f: 0.75, pose: 'bag', expr: 'tired', rim: RIM }); E.ch(c, 'noah', t, { x: 880, y: 905, h: 340, f: 0.8, pose: 'relaxed', expr: 'worried', rim: RIM }); E.th(c, 's09_leo_th1', t, { x: 1400, y: 380, w: 420, h: 110, tail: [1200, 520], size: 38 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Leo at his locker with Noah hovering behind; Leo\'s thought: "I wish he\'d stop asking."' });

  // 9E — "Friday. I have to do it Friday." — Leo CU, calendar circle in thought
  E.cut('s09e_friday', E.st('s09_leo_th2') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.07, focus: 1, ap: 14 });
    const L = E.SET.hallway(t + 12); L[0].d = 0.25; L[1].d = 0.35; L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 760, y: E.headAt(1050, 480), h: 1050, f: 0.4, pose: 'pocket', expr: 'nervous', look: [0.3, 0.2], rim: RIM });
      E.th(c, 's09_leo_th2', t, { x: 1320, y: 360, w: 520, h: 280, tail: [930, 380], size: 40, inner: (x, w, h) => { x.fillStyle = '#f1eaff'; x.fillRect(-w * 0.28, -h * 0.36, w * 0.56, h * 0.5); x.fillStyle = '#c8302f'; x.fillRect(-w * 0.28, -h * 0.36, w * 0.56, h * 0.12); x.fillStyle = '#2a1d5c'; x.font = '900 34px Nunito'; x.textAlign = 'center'; x.fillText('FRI', 0, -h * 0.02); x.strokeStyle = '#c8302f'; x.lineWidth = 5; x.beginPath(); x.ellipse(0, -h * 0.08, w * 0.12, h * 0.1, 0, 0, Math.PI * 2); x.stroke(); } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo, determined; his thought window shows a calendar with FRIDAY circled: "Friday. I have to do it Friday."' });

  // 9F — Leo walks away; grainy monochrome SPECULATION panels (Noah's imagination) behind him
  E.cut('s09f_speculation', E.st('s09_vo2') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.2, z1: 1.3, x: 1100, y: 600, focus: 1, ap: 8 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => {
      E.ch(c, 'leo', t, { x: 1300 + lt * 90, y: 905, h: 345, f: 0.8, pose: E.walkPose(lt * 1.5), expr: 'neutral', rim: RIM });
      E.ch(c, 'noah', t, { x: 760, y: 905, h: 340, f: 0.8, pose: 'relaxed', expr: 'sad', rim: RIM });
      [['leoLeaving', 1150, 330, 0.3], ['lying', 1560, 470, 0.9], ['ditched', 1120, 560, 1.6]].forEach(([k, x, y, ta], i) => { const p = E.pop(lt, ta, 0.4); if (p > 0) E.thought(c, { x, y, w: 360, h: 220, s: p, a: 0.92, kind: 'spec', seed: i + 3, inner: E.specScene[k] }, t); });
    } });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#808080', 0.35, 'saturation');
  }, { type: 'MS', desc: 'Leo walks away; behind him, Noah\'s imagined fears appear as grainy grey torn panels (Leo ditching him, laughing behind his back, Noah alone on Friday) — speculation, not real thoughts.' });

  // ===== SCENE 10 =====
  const noise = (c, t, a, seed = 1) => { if (a <= 0) return; E.panelField(c, t, { seed, n: 9, x: -100, y: 0, w: 2100, h: 330, t0: -100, spread: 1, texts: E.CROWD_TEXT, a: 0.5 * a, scale: 0.7 }); E.panelField(c, t, { seed: seed + 50, n: 5, x: -100, y: 880, w: 2100, h: 150, t0: -100, spread: 1, texts: E.CROWD_TEXT, a: 0.45 * a, scale: 0.7 }); c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = a * 0.25; c.fillStyle = '#6a46b0'; c.fillRect(-500, -300, 3000, 1700); c.restore(); };
  const noiseA = (t) => 1 - E.seg(t, E.st('s10_noah2') + 0.15, E.st('s10_noah2') + 0.2);
  // 10A — close two-shot: Maya reaches for Noah's arm; harsh purple noise around Noah
  E.cut('s10a_okay', E.M('S10'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 2.0, z1: 2.05, x: 1000, y: 560, focus: 1, ap: 8, drift: 1 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 900, y: 905, h: 340, f: 0.75, pose: 'clutch', expr: 'tired', rim: RIM }); E.ch(c, 'maya', t, { x: 1110, y: 905, h: 320, f: -0.75, pose: E.poseAt(lt, [[0, 'bag'], [D * 0.5, 'reach']]), expr: 'worried', rim: RIM }); } });
    L.push({ d: 1.1, sharp: true, draw: (c) => noise(c, t, noiseA(t) * 0.8, 3) });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Close two-shot: Maya gently reaches toward Noah — "Hey, Noah. You okay?" — he\'s still buried in harsh purple thought-noise.' });

  // 10B — Maya CU; warm thought "He seems really upset."
  E.cut('s10b_upset', E.st('s10_maya_th1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = E.SET.soft(t, { top: '#7a5060', bot: '#4a3038', window: true, wx: 1180, wy: 120, seed: 41 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'maya', t, { x: 720, y: E.headAt(1050, 470), h: 1050, f: 0.4, pose: 'reach', expr: 'worried', look: [0.6, 0], rim: { dx: 10, dy: -4, color: '#ffd8b8' } }); E.th(c, 's10_maya_th1', t, { x: 1290, y: 330, w: 520, h: 130, tail: [880, 340], kind: 'warm', size: 50 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Maya, concerned; her thought is soft and warm-coloured: "He seems really upset."' });

  // 10C — Noah CU "I'm fine." amid noise
  E.cut('s10c_fine', E.st('s10_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.1, focus: 1, ap: 14, rot: 0.03 });
    const L = E.SET.hallway(t + 5); L[0].d = 0.25; L[1].d = 0.35; L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 1050, y: E.headAt(1100, 480), h: 1100, f: -0.3, pose: 'crossed', expr: 'angry', look: [-0.4, 0.3], rim: RIM }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => noise(c, t, noiseA(t), 5) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah, arms crossed, avoiding her eyes — "I\'m fine." — purple noise all around him.' });

  // 10D — OTS on Maya; thought "I want to help, but I don't know what to say." → Noah snaps
  E.cut('s10d_help', E.st('s10_maya_th2') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const snap = E.st('s10_noah2') - s.t0;
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, focus: 1, ap: 12, extra: { shakeX: 0 } });
    const L = E.SET.soft(t, { top: '#7a5060', bot: '#4a3038', window: true, wx: 1180, wy: 120, seed: 41 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'maya', t, { x: 1100, y: E.headAt(900, 480), h: 900, f: -0.4, pose: 'clutch', expr: lt > snap ? 'shock' : 'worried', look: [-0.5, 0], rim: { dx: -8, dy: -4, color: '#ffd8b8' } }); if (lt < snap + 0.15) E.th(c, 's10_maya_th2', t, { x: 1150, y: 230, w: 700, h: 120, tail: [1100, 330], kind: 'warm', size: 42 }); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 330, y: 2100, h: 1800, f: 0.6, faceAlpha: 0, rim: RIM }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => noise(c, t, noiseA(t) * 0.6, 7) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder on Maya: "I want to help, but I don\'t know what to say." — Noah snaps "Then don\'t say ANYTHING!" and every overlay vanishes.' });

  // 10E — clean frame: Maya hurt "...What?" — hold the beat, no effects, no shake
  E.cut('s10e_what', E.st('s10_maya_say2') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.08, focus: 1, ap: 14 });
    const L = E.SET.soft(t, { top: '#6a4a52', bot: '#3e2a32', window: true, wx: 1180, wy: 120, seed: 41 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'maya', t, { x: 900, y: E.headAt(1050, 470), h: 1050, f: -0.15, pose: E.poseAt(lt, [[0, 'clutch'], [1.4, 'bag', 0.8]]), expr: 'hurt', look: [0, 0.2], rim: { dx: 8, dy: -4, color: '#ffd8b8' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Clean, ordinary frame — no overlays: Maya, hurt and confused, "...What?" Held for a full beat.', post: { bloom: 0.2 } });

  // 10F — Maya walks away; Noah alone in the hallway (VO: hear ≠ understand)
  E.cut('s10f_alone', E.st('s10_vo1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 0.92, x: 1000, focus: 1, ap: 7 });
    const L = E.SET.hallway(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'maya', t, { x: 1300 + lt * 110, y: 905, h: 320, f: 0.8, pose: E.walkPose(lt * 1.4), expr: 'sad', rim: RIM }); E.ch(c, 'noah', t, { x: 900, y: 905, h: 340, f: 0.6, pose: 'relaxed', expr: 'sad', look: [1, 0.3], rim: RIM }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wide: Maya walks off; Noah left alone in the empty hallway, regretful.' });

  // 10G — Noah CU, looking at his hands: thoughts he heard vs. what they meant
  E.cut('s10g_understand', E.ph('s10_vo1', 1, 2) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 14 });
    const L = E.SET.hallway(t + 14); L[0].d = 0.25; L[1].d = 0.35; L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1150, 470), h: 1150, f: 0.1, pose: 'clutch', expr: 'sad', look: [0, 0.8], rim: RIM }) });
    E.layers(ctx, cam, L);
    const a1 = E.seg(lt, 0.3, 0.8), a2 = E.seg(lt, D * 0.5, D * 0.5 + 0.5);
    E.label(ctx, 'HEAR', 420, 470, a1, 54); E.label(ctx, '≠', 960, 200, a2, 64); E.label(ctx, 'UNDERSTAND', 1500, 470, a2, 54);
  }, { type: 'CU', desc: 'Close on Noah looking down at his hands; labels HEAR ≠ UNDERSTAND fade in (VO: hearing a thought didn\'t mean he understood it).' });

  // ===== SCENE 11 =====
  // 11A — classroom clock close-up, ticking
  E.cut('s11a_clock', E.M('S11'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 3.2, z1: 3.4, x: 1780, y: 240, focus: 1, ap: 6 });
    const L = E.SET.classroom(t, { clock: 2.4 + Math.floor(lt) * 0.105 - t * 0.05 }); L[0].d = 1; L[1].skip = true; E.layers(ctx, cam, L);
  }, { type: 'INSERT', desc: 'Insert: the classroom clock ticks toward the end of Thursday.' });

  // 11B — school entrance at dusk: Noah watches Leo leave; camera tracks behind Leo
  E.cut('s11b_watch', E.ph('s11_vo1', 1, 2) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 900 + lt * 60, y: 560, z: 1.05, focus: 0.6, ap: 9 });
    const L = E.SET.entrance(t);
    L.push({ d: 0.6, draw: (c) => E.ch(c, 'leo', t, { x: 1000 + lt * 80, y: 880, h: 190, f: 0.8, pose: E.walkPose(lt * 1.4), expr: 'neutral', rim: { dx: 3, color: '#ffe6b8' } }) });
    L.push({ d: 1.4, draw: (c) => E.ch(c, 'noah', t, { x: 420, y: 1900, h: 1500, f: 0.7, faceAlpha: 0, rim: { dx: 10, color: '#ffc27a' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Dusk, school entrance: over Noah\'s shoulder (blurred FG) we watch Leo walk away down the street.' });

  // 11C — Leo thought "Tomorrow's going to change everything."
  E.cut('s11c_tomorrow', E.st('s11_leo_th') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 12 });
    const L = E.SET.entrance(t); L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 900, y: E.headAt(1000, 480), h: 1000, f: 0.5, pose: E.walkPose(lt * 0.8, 0.3), expr: 'nervous', look: [0.4, 0.4], rim: { dx: 10, dy: -4, color: '#ffc27a' } }); E.th(c, 's11_leo_th', t, { x: 1420, y: 360, w: 560, h: 140, tail: [1060, 360], size: 44, post: 1.2 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo walking in the sunset, anxious; thought: "Tomorrow\'s going to change everything."' });

  // 11D — bedroom night: phone on nightstand; date graphic THURSDAY → FRIDAY, clock tick
  E.cut('s11d_date', E.M('tick') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 10 });
    const L = E.SET.bedroom(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 260, y: 700, h: 330, f: 0, rot: -Math.PI / 2, pose: 'stand', expr: 'worried', look: [0, -1], rim: { dx: 0, dy: -3, color: '#9fc6ff' } }); c.fillStyle = '#4b4f9a'; c.beginPath(); c.roundRect(-40, 650, 640, 120, 30); c.fill(); } });
    E.layers(ctx, cam, L);
    const flip = E.seg(lt, D * 0.45, D * 0.6, 'io');
    ctx.save(); ctx.translate(1300, 540); ctx.fillStyle = 'rgba(10,10,30,0.7)'; ctx.beginPath(); ctx.roundRect(-300, -120, 600, 240, 30); ctx.fill(); ctx.strokeStyle = 'rgba(159,198,255,0.6)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.scale(1, Math.abs(Math.cos(flip * Math.PI))); E.textGlow(ctx, flip < 0.5 ? 'THURSDAY' : 'FRIDAY', 0, -10, { font: '900 86px Nunito', spacing: '6px', glow: 'rgba(159,198,255,0.9)' }); ctx.restore();
    E.textGlow(ctx, flip < 0.5 ? '11:59 PM' : '12:00 AM', 0, 72, { font: '800 36px Nunito', glow: 'rgba(159,198,255,0.7)' }); ctx.restore();
  }, { type: 'INSERT', desc: 'Night: Noah lies awake; a date graphic flips THURSDAY 11:59 PM → FRIDAY 12:00 AM over the low clock tick.', post: { vignette: 0.7 } });
})();
