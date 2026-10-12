// SCENE 9 (V2) — imagining the worst · SCENE 10 — Maya · SCENE 11 — the week passes.
(function () {
  const E = globalThis.E;
  const K = E.KEY;
  const COOL = { dx: 1, dy: -0.4, color: '#c9b8e8' };
  const edgeNoise = (c, t, seed, a = 0.5) => { E.panelField(c, t, { seed, n: 6, x: -150, y: 60, w: 520, h: 900, t0: -100, spread: 1, texts: E.CROWD_TEXT, a: 0.35 * a, scale: 0.65 }); E.panelField(c, t, { seed: seed + 9, n: 6, x: 1550, y: 60, w: 520, h: 900, t0: -100, spread: 1, texts: E.CROWD_TEXT, a: 0.35 * a, scale: 0.65 }); };
  const library = (t) => { const L = E.SET.classroom(t, { noDesksBack: true });
    L.splice(1, 0, { d: 0.3, draw: (c) => { for (let k = 0; k < 2; k++) { const x = 250 + k * 1050; c.fillStyle = '#4a2c2c'; c.fillRect(x, 160, 600, 520); for (let j = 0; j < 4; j++) { c.fillStyle = '#2a1826'; c.fillRect(x, 160 + j * 130 + 118, 600, 12); const r = E.rng(j + k * 9); for (let i = 0; i < 18; i++) { c.fillStyle = ['#c98aa0', '#3d6a8a', '#e8a070', '#6b7fd6', '#d0a040'][Math.floor(r() * 5)]; c.fillRect(x + 12 + i * 32, 160 + j * 130 + 30 + r() * 20, 26, 88 - r() * 20); } } } } });
    return L; };

  // 9A — Noah at his desk staring; Leo's two thoughts echo as faded violet windows around him
  E.cut('s09a_stare', E.M('S09'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 14 });
    const L = E.SET.classRev(t); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 860, y: E.headAt(1000, 470), h: 1000, f: 0.3, pose: { front: 'in', aB: [0.9, 1.0], aF: [1.0, 2.4], lB: [1.5, -1.5], lF: [1.45, -1.5] }, expr: 'worried', look: [0.6, 0.4], rim: K.classL, ground: false, shadow: false }); E.deskFront(c, 860, 1500, 1200, 480);
      ["I can't keep doing this.", "He's gonna hate me."].forEach((txt, i) => { const p = (lt * 0.25 + i * 0.5) % 1; E.thought(c, { x: 1400 + Math.cos(p * 6.28 + i) * 60, y: 300 + i * 300 + Math.sin(p * 6.28) * 20, w: 440, h: 90, s: 0.85, a: 0.42 * Math.sin(p * Math.PI) + 0.12, text: txt, size: 40, seed: i, noClamp: true }, t); }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah at his desk, chin in hand, worried; Leo\'s two thoughts drift around him as faded violet memory windows.' });

  // 9B — library: Leo snaps his laptop shut as Noah walks up (screen shows an "A" crest)
  E.cut('s09b_laptop', E.sg('s09_vo1', 1) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.7, z1: 1.8, x: 1080, y: 640, focus: 1, ap: 9 });
    const L = library(t);
    L.push({ d: 1, draw: (c) => {
      const shut = E.seg(lt, D * 0.5, D * 0.65);
      E.desk(c, 1150, 880, 1.2);
      E.ch(c, 'leo', t, { x: 1010, y: 880, h: 330, f: shut > 0.5 ? -0.6 : 0.8, pose: shut > 0.5 ? 'sitDesk' : 'laptop', expr: shut > 0.5 ? 'nervous' : 'neutral', look: shut > 0.5 ? [-1, 0] : [1, 0.5], rim: K.classL, talk: 0 });
      c.save(); c.translate(1130, 734); c.fillStyle = '#c9c0c8'; c.fillRect(-70, 0, 140, 9); c.rotate(-Math.PI / 2 * (1 - shut) - 0.08);
      c.fillStyle = '#c9c0c8'; c.fillRect(-70, -8, 140, 10); if (shut < 0.7) { c.fillStyle = '#e8eef8'; c.fillRect(-64, -6, 128, 0.1); c.save(); c.rotate(Math.PI / 2); c.fillStyle = '#e8eef8'; c.fillRect(-120 * (1 - shut), -64, 112 * (1 - shut), 128); c.fillStyle = '#2c3550'; c.beginPath(); c.arc(-62 * (1 - shut), 0, 24 * (1 - shut), 0, Math.PI * 2); c.fill(); c.fillStyle = '#ffd166'; c.font = `900 ${Math.max(1, 26 * (1 - shut))}px Nunito`; c.textAlign = 'center'; c.fillText('A', -62 * (1 - shut), 9 * (1 - shut)); c.restore(); }
      c.restore();
      if (shut < 0.8) E.glow(c, 1110, 670, 120, '#8fb4ff', 0.35 * (1 - shut));
      E.ch(c, 'noah', t, { x: E.lerp(560, 760, E.seg(lt, 0, D * 0.6, 'out')), y: 905, h: 340, f: 0.8, pose: E.walkPose(lt * 1.5, 1 - E.seg(lt, D * 0.4, D * 0.6)), expr: 'worried', rim: K.classL });
    } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Library: Leo is looking at a page with a blue crest ("A") on his laptop and slams it shut as Noah walks up ("Was Leo planning to ditch him?").' });

  // 9C — Leo laughing on the phone, sees Noah, hangs up and pockets it with an awkward smile
  E.cut('s09c_phone', E.sg('s09_vo1', 2) + 0.6, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 12 });
    const L = E.SET.hall3q(t, { mood: 'cool', back: [300, 330, 600, 640] }); L[0].d = 0.3;
    const off = E.seg(lt, D * 0.5, D * 0.62);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1100, y: E.headAt(1000, 480), h: 1000, f: -0.5, pose: off > 0.5 ? 'pocket' : 'phone', prop: off > 0.5 ? null : E.PROP.phone, expr: off > 0.5 ? 'awkward' : 'laugh', look: [off > 0.5 ? -0.8 : 0.3, 0], rim: COOL, talk: off > 0.5 ? 0 : 0.2 + 0.25 * Math.abs(Math.sin(lt * 9)), bob: off > 0.5 ? 1 : 3, ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 330, y: 2000, h: 1700, f: 0.6, faceAlpha: 0, rim: COOL, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder: Leo laughs into his phone, spots Noah, and quickly hangs up and pockets it with an awkward smile ("lying this whole time?").' });

  // 9C2 — Noah leans in to eavesdrop ("the more Noah listened")
  E.cut('s09c2_listen', E.sg('s09_vo1', 3) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.1, z1: 1.25, x: 900, focus: 1, ap: 12 });
    const L = E.SET.hall3q(t, { mood: 'cool' }); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 820, y: E.headAt(1200, 500), h: 1200, f: 0.75, pose: 'clutch', lean: 0.5, expr: 'worried', look: [1, 0], rim: COOL, ground: false, shadow: false }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => edgeNoise(c, t, 3, 1) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Slow push on Noah leaning around a corner to eavesdrop; faint thought-noise at the frame edges ("the more Noah listened...").' });

  // 9D — high angle above the lockers: Leo at his locker, Noah hovering; "I wish he'd stop asking."
  E.cut('s09d_stopasking', E.st('s09_leo_th1') - 0.6, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 900, y: 640, z: 1.25 + lt * 0.03, rot: 0.04, focus: 1, ap: 6 });
    const L = E.SET.hall3q(t, { mood: 'cool', back: [1000, 420, 1300, 640] });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 760, y: 960, h: 560, f: -0.7, pose: 'bag', expr: 'tired', rim: COOL }); E.ch(c, 'noah', t, { x: 1060, y: 940, h: 540, f: -0.7, pose: 'relaxed', expr: 'worried', look: [-1, 0.2], rim: COOL }); E.th(c, 's09_leo_th1', t, { x: 520, y: 330, w: 460, h: 100, tail: [740, 420], size: 40 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'HIGH', desc: 'High angle down at the lockers: Leo grabs his bag with Noah hovering behind; Leo\'s thought: "I wish he\'d stop asking."' });

  // 9E — Leo CU, calendar with FRIDAY circled in his thought
  E.cut('s09e_friday', E.st('s09_leo_th2') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.07, focus: 1, ap: 14 });
    const L = E.SET.hall3q(t + 12, { mood: 'cool', back: [1300, 330, 1600, 640] }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 760, y: E.headAt(1050, 480), h: 1050, f: 0.4, pose: 'pocket', expr: 'nervous', look: [0.3, 0.2], rim: COOL, ground: false, shadow: false });
      E.th(c, 's09_leo_th2', t, { x: 1320, y: 380, w: 520, h: 290, tail: [930, 380], size: 40, inner: (x, w, h) => { x.fillStyle = '#f1eaff'; x.fillRect(-w * 0.28, -h * 0.36, w * 0.56, h * 0.5); x.fillStyle = '#c8302f'; x.fillRect(-w * 0.28, -h * 0.36, w * 0.56, h * 0.12); x.fillStyle = '#2a1d5c'; x.font = '900 34px Nunito'; x.textAlign = 'center'; x.fillText('FRI', 0, -h * 0.02); x.strokeStyle = '#c8302f'; x.lineWidth = 5; x.beginPath(); x.ellipse(0, -h * 0.08, w * 0.12, h * 0.1, 0, 0, Math.PI * 2); x.stroke(); } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo, determined; his thought window shows a calendar with FRIDAY circled — "Friday. I have to do it Friday."' });

  // 9F — Leo walks away; grey torn SPECULATION panels rise out of Noah (left half)
  E.cut('s09f_speculation', E.st('s09_vo2') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, x: 900, y: 600, focus: 1, ap: 6 });
    const L = E.SET.hall3q(t, { mood: 'cool' });
    L.push({ d: 1, draw: (c) => {
      const ly = E.lerp(820, 700, E.clamp(lt / D)); E.ch(c, 'leo', t, { x: E.lerp(1250, 1350, E.clamp(lt / D)), y: ly, h: E.hallH(ly), f: 0.5, pose: E.walkPose(lt * 1.4), expr: 'neutral', rim: COOL });
      E.ch(c, 'noah', t, { x: 520, y: 1020, h: E.hallH(1020), f: 0.6, pose: 'relaxed', expr: 'sad', rim: COOL });
      [['leoLeaving', 360, 330, 0.3], ['lying', 820, 300, 0.9], ['ditched', 600, 560, 1.5]].forEach(([k, x, y, ta], i) => { const p = E.pop(lt, ta, 0.4); if (p > 0) E.thought(c, { x, y, w: 380, h: 230, s: p, a: 0.92, kind: 'spec', seed: i + 3, inner: E.specScene[k], tail: [520, 640], noClamp: true }, t); });
    } });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#808080', 0.3, 'saturation');
  }, { type: 'MS', desc: 'Leo walks away down the hall; grey, grainy, torn SPECULATION panels rise out of Noah (Leo ditching him, laughing behind his back, Noah alone on Friday) — imagined, not real thoughts.' });
  E.cut('s09f2_terrible', E.sg('s09_vo2', 2) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.io(E.clamp(lt / D));
    ctx.fillStyle = '#1a1620'; ctx.fillRect(0, 0, 1920, 1080);
    ctx.save(); ctx.translate(960, 540); ctx.scale(1 + k * 0.5, 1 + k * 0.5); E.thought(ctx, { x: 0, y: 0, w: 900, h: 520, s: 1, kind: 'spec', seed: 9, inner: E.specScene.leoLeaving, noClamp: true }, t); ctx.restore();
  }, { type: 'INSERT', desc: 'Push into the grey speculation panel until it fills the frame: Leo walking off happily with new friends, Noah left alone ("something terrible").', post: { desat: 0.6, vignette: 0.8 } });

  // ===== SCENE 10 =====
  const noiseA = (t) => 1 - E.seg(t, E.st('s10_noah2') + 0.15, E.st('s10_noah2') + 0.2);
  const MAYA_RIM = { dx: -1, dy: -0.4, color: '#ffc87a' };
  // 10A — from Maya's side: the window wall behind Noah; she reaches for his arm
  E.cut('s10a_okay', E.M('S10'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, x: 900, y: 600, focus: 1, ap: 8, drift: 1 });
    const L = E.SET.hall3q(t, { mood: 'cool', back: [1200, 360, 1500, 640] }); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 1000, y: E.headAt(900, 470), h: 900, f: -0.6, pose: 'clutch', expr: 'tired', look: [0, 0.4], rim: COOL, ground: false, shadow: false }); } });
    L.push({ d: 1.4, draw: (c) => E.ch(c, 'maya', t, { x: 330, y: 2000, h: 1600, f: 0.6, pose: E.poseAt(lt, [[0, 'clutch'], [D * 0.45, 'reach']]), faceAlpha: 0, rim: MAYA_RIM, ground: false, shadow: false }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => edgeNoise(c, t, 3, noiseA(t)) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Maya\'s shoulder: she reaches toward Noah — "Hey, Noah. You okay?" — he\'s still surrounded by harsh purple thought-noise.' });
  // 10B — reverse OTS onto Noah, Maya's warm thought by her head; Noah: "I'm fine."
  E.cut('s10b_fine', E.st('s10_maya_th1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 12 });
    const L = E.SET.hall3q(t + 3, { mood: 'cool', back: [300, 330, 600, 640] }); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 1150, y: E.headAt(1000, 480), h: 1000, f: -0.45, pose: 'crossed', expr: 'angry', look: [-0.9, 0.2], rim: COOL, ground: false, shadow: false }) });
    L.push({ d: 1.4, draw: (c) => { E.ch(c, 'maya', t, { x: 330, y: 2050, h: 1700, f: 0.55, pose: 'reach', faceAlpha: 0, rim: MAYA_RIM, ground: false, shadow: false }); } });
    L.push({ d: 1.1, sharp: true, draw: (c) => { E.th(c, 's10_maya_th1', t, { x: 520, y: 260, w: 460, h: 100, tail: [360, 420], kind: 'warm', size: 44 }); edgeNoise(c, t, 5, noiseA(t)); } });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Reverse, over Maya\'s shoulder: her warm thought "He seems really upset." floats by her head; Noah, arms crossed, avoids her eyes — "I\'m fine."' });
  // 10C — OTS on Maya: "I want to help, but I don't know what to say."
  E.cut('s10c_help', E.st('s10_maya_th2') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, focus: 1, ap: 12 });
    const L = E.SET.hall3q(t, { mood: 'cool', back: [1200, 360, 1500, 640] }); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'maya', t, { x: 1050, y: E.headAt(900, 480), h: 900, f: -0.5, pose: 'clutch', expr: 'worried', look: [-0.6, 0.1], rim: MAYA_RIM, ground: false, shadow: false }); E.th(c, 's10_maya_th2', t, { x: 1240, y: 240, w: 640, h: 100, tail: [1080, 330], kind: 'warm', size: 42 }); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 330, y: 2100, h: 1800, f: 0.6, faceAlpha: 0, rim: COOL, ground: false, shadow: false }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => edgeNoise(c, t, 7, noiseA(t) * 0.8) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder on Maya, hesitant: "I want to help, but I don\'t know what to say."' });
  // 10D — low angle CU: Noah snaps "Then don't say ANYTHING!" — every overlay shatters away
  E.cut('s10d_snap', E.st('s10_noah2') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.12, y: 560, rot: 0.03, focus: 1, ap: 14 });
    const L = E.SET.hall3q(t + 4, { mood: 'cool' }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1150, 430), h: 1150, f: 0.05, pose: 'shrug', expr: 'angry', rim: COOL, ground: false, shadow: false }) });
    L.push({ d: 1.1, sharp: true, draw: (c) => { const k = E.clamp(lt / 0.5); if (k < 1) { const r = E.rng(3); for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = 300 + k * 900; c.save(); c.globalAlpha = 1 - k; c.translate(960 + Math.cos(a) * d, 500 + Math.sin(a) * d * 0.6); c.rotate(k * 3 * (r() - 0.5)); c.fillStyle = 'rgba(169,139,255,0.5)'; c.fillRect(-60, -24, 120, 48); c.restore(); } } } });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Low angle close-up: Noah snaps "Then don\'t say ANYTHING!" — the thought-noise shatters and flies off-screen, leaving the frame clean.' });
  // 10E — clean frame: Maya hurt "...What?" (facing screen-left toward Noah) — held
  E.cut('s10e_what', E.st('s10_maya_say2') - 0.3, (ctx, lt, t, s) => {
    const cam = E.cam({ z: 1.08, focus: 1, ap: 14 });
    const L = E.SET.hall3q(t, { mood: 'cool', back: [1200, 360, 1500, 640] }); L[0].d = 0.3;
    L.push({ d: 1, draw: (c) => E.ch(c, 'maya', t, { x: 1000, y: E.headAt(1050, 470), h: 1050, f: -0.25, pose: E.poseAt(lt, [[0, 'clutch'], [1.4, 'bag', 0.8]]), expr: 'hurt', look: [-0.3, 0.2], rim: MAYA_RIM, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Clean, ordinary frame — no overlays at all: Maya, hurt and confused, "...What?" Held for a full beat.', post: { bloom: 0.18 } });
  // 10F — corridor axis: Maya walks away down the vanishing line; Noah alone
  E.cut('s10f_alone', E.st('s10_vo1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.15, z1: 1.05, x: 980, focus: 0.5, ap: 6 });
    const L = E.SET.corridor(t);
    L.push({ d: 0.3, draw: (c) => { const k = E.clamp(lt / D); E.ch(c, 'maya', t, { x: 990, y: E.lerp(760, 660, k), h: E.lerp(330, 190, k), f: 0.2, pose: E.walkPose(lt * 1.3), expr: 'sad', rim: { dx: 0.3, dy: -1, color: '#ffe6b8' } }); } });
    L.push({ d: 1.2, draw: (c) => E.ch(c, 'noah', t, { x: 660, y: 1600, h: 1050, f: 0.4, pose: 'relaxed', expr: 'sad', faceAlpha: 0, rim: COOL, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#1a1030', 0.2, 'multiply');
  }, { type: 'OTS', desc: 'Down the corridor axis behind Noah: Maya walks away and shrinks down the vanishing line ("that\'s when Noah realized something").' });
  // 10G — high angle looking down on Noah, palms up, alone (no captions)
  E.cut('s10g_understand', E.sg('s10_vo1', 2) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 960, y: 560, z: 1.0 + lt * 0.015, rot: -0.03, focus: 1, ap: 6 });
    const L = E.SET.hall3q(t, { mood: 'cool' });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: 1000, h: E.hallH(1000) * 0.95, f: 0.1, pose: 'palms', expr: 'sad', look: [0, 1], tilt: E.lerp(0, 0.12, E.clamp(lt / D)), rim: COOL }) });
    E.layers(ctx, cam, L);
  }, { type: 'HIGH', desc: 'High angle looking down on Noah, alone in the corridor, staring at his open hands (VO: hearing a thought didn\'t mean he understood it).' });

  E.cut('s10g2_fists', E.sg('s10_vo1', 5) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.1, focus: 1, ap: 14 });
    const L = E.SET.hall3q(t + 6, { mood: 'cool' }); L[0].d = 0.25;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 900, y: E.headAt(1150, 480), h: 1150, f: 0.75, pose: E.poseAt(lt, [[0, 'palms'], [1.2, 'relaxed', 0.6]]), expr: 'sad', look: [0.4, 0.6], rim: COOL, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Profile close-up: Noah lets his hands drop, eyes lowered ("...didn\'t mean he understood it").' });

  // ===== SCENE 11 — the week passes =====
  // 11A — TUE / WED / THU montage with date chips
  E.cut('s11a_days', E.M('S11'), (ctx, lt, t, s) => {
    const D = E.D(s); const k = Math.min(2, Math.floor(lt / (D / 3))); const ll = lt - k * (D / 3);
    if (k === 0) { const L = E.SET.hall3q(t, { mood: 'cool' }); L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1050, y: 900, h: E.hallH(900), f: E.lerp(-0.6, 0.6, E.seg(ll, 0.3, 0.6)), pose: 'bag', expr: 'nervous', rim: COOL }); E.ch(c, 'noah', t, { x: 700, y: 980, h: E.hallH(980), f: 0.6, pose: 'wave', expr: 'neutral', rim: COOL }); } }); E.layers(ctx, E.cam({ z: 1.1 + ll * 0.05, focus: 1, ap: 6 }), L); }
    else if (k === 1) { const L = E.SET.cafPersp(t); L.push({ d: 1, draw: (c) => { E.tableP(c, 1, 0.1, 0.6); E.ch(c, 'leo', t, { x: 1250, y: 980, h: 420, f: -0.3, pose: 'phone', prop: E.PROP.phone, expr: 'sad', look: [0, 0.6], rim: { dx: -0.6, dy: -1, color: '#ffe6b8' }, seat: '#3a2420' }); } }); E.layers(ctx, E.cam({ z: 1.15 + ll * 0.05, x: 1100, focus: 1, ap: 6 }), L); }
    else { const L = E.SET.classroom(t, { clock: Math.PI * 2 * 0.93 }); L[0].d = 1; L[1].skip = true; E.layers(ctx, E.cam({ x: 1780, y: 240, z: 3.0 + ll * 0.08, focus: 1, ap: 6 }), L); }
    E.dayChip(ctx, ['TUESDAY', 'WEDNESDAY', 'THURSDAY'][k], 1);
    if (ll < 0.06) E.screenFill(ctx, '#ffffff', 0.15 * (1 - ll / 0.06));
  }, { type: 'MONTAGE', desc: 'The week passes in three beats with date chips: TUESDAY Leo turns away from Noah\'s wave; WEDNESDAY Leo eats alone, on his phone; THURSDAY the clock creeps toward 3:00.' });
  // 11B — dusk, school gate: Leo still close, on the steps; Noah watches (OTS)
  E.cut('s11b_gate', E.sg('s11_vo1', 1) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ x: 700 + lt * 30, y: 600, z: 1.3, focus: 0.95, ap: 9 });
    const L = E.SET.entranceSet(t);
    L.push({ d: 0.95, draw: (c) => E.ch(c, 'leo', t, { x: 520 + lt * 50, y: 880, h: 260, f: 0.8, pose: E.walkPose(lt * 1.2), expr: 'nervous', rim: K.sunset }) });
    L.push({ d: 1.4, draw: (c) => E.ch(c, 'noah', t, { x: 1250, y: 1900, h: 1500, f: -0.6, faceAlpha: 0, rim: K.sunset, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
    E.dayChip(ctx, 'THURSDAY', 0.85);
  }, { type: 'OTS', desc: 'Thursday dusk at the school gate: over Noah\'s shoulder we watch Leo come down the front steps, only a few metres away ("What was Leo planning to tell him on Friday?").' });
  // 11C — Leo CU at the gate with his thought
  E.cut('s11c_tomorrow', E.st('s11_leo_th') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 12 });
    const L = E.SET.entranceSet(t); L[2].d = 0.4;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 900, y: E.headAt(1000, 480), h: 1000, f: 0.5, pose: 'bag', expr: 'nervous', look: [0.4, 0.4], rim: K.sunset, ground: false, shadow: false }); E.th(c, 's11_leo_th', t, { x: 1420, y: 330, w: 540, h: 110, tail: [1060, 370], size: 44, post: 0.6 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo at the gate, anxious; his thought: "Tomorrow\'s going to change everything."' });
  // 11D — night: Noah lies awake in moonlight; date flips THURSDAY → FRIDAY
  E.cut('s11d_date', E.M('tick') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.15, z1: 1.2, x: 420, y: 640, focus: 1, ap: 8 });
    const L = E.SET.bedroom(t);
    L.push({ d: 1, draw: (c) => { c.fillStyle = '#c8c8e8'; c.beginPath(); c.roundRect(-120, 625, 240, 70, 30); c.fill(); c.fillStyle = '#2a2a58'; c.fillRect(-160, 700, 980, 180);
      E.ch(c, 'noah', t, { x: 330, y: 700, h: 360, f: 0.3, hipRot: -Math.PI / 2 + 0.03, pose: 'stand', expr: 'worried', look: [0, -1], blink: Math.abs(lt - D * 0.52) < 0.06, rim: K.moon, seat: false, shadow: false });
      c.fillStyle = '#3a3a72'; c.beginPath(); c.roundRect(240, 660, 580, 60, 24); c.fill();
      c.save(); c.globalCompositeOperation = 'lighter'; E.cone(c, 1390, 560, 420, 1100, 600, '#9fb6ff', 0.12, 0.6); c.restore();
      c.fillStyle = '#3a2a40'; c.fillRect(-330, 650, 150, 230); E.glow(c, -255, 620, 60, '#ffb36b', 0.5); c.fillStyle = '#ffb36b'; c.fillRect(-290, 600, 70, 34); } });
    E.layers(ctx, cam, L);
    const flip = E.seg(lt, D * 0.45, D * 0.6, 'io');
    ctx.save(); ctx.translate(1300, 470); ctx.fillStyle = 'rgba(10,10,30,0.75)'; ctx.beginPath(); ctx.roundRect(-300, -120, 600, 240, 30); ctx.fill(); ctx.strokeStyle = 'rgba(159,198,255,0.6)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.scale(1, Math.abs(Math.cos(flip * Math.PI))); E.textGlow(ctx, flip < 0.5 ? 'THURSDAY' : 'FRIDAY', 0, -10, { font: '900 86px Nunito', spacing: '6px', glow: 'rgba(159,198,255,0.9)' }); ctx.restore();
    E.textGlow(ctx, flip < 0.5 ? '11:59 PM' : '12:00 AM', 0, 72, { font: '800 36px Nunito', glow: 'rgba(159,198,255,0.7)' }); ctx.restore();
  }, { type: 'MS', desc: 'Night: Noah lies awake in bed in a shaft of moonlight; the date card flips THURSDAY 11:59 PM → FRIDAY 12:00 AM over a low clock tick.', post: { vignette: 0.7 } });
})();
