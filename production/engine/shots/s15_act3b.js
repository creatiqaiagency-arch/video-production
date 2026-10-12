// Act 3b: S15–S19 (low point, realisation, choosing what to listen to, sunset, end card). Split from s12_act3.js for V3.
(function () {
  const E = globalThis.E;
  const K = E.KEY;
  const RC = { dx: 1, dy: -0.5, color: '#c9b8e8' };        // confrontation key (cool, sun hidden)
  const RN = { dx: 1, dy: -0.45, color: '#f0b088' };        // reveal (neutral warm)
  const RW = { dx: 1, dy: -0.4, color: '#ffc27a' };         // reconciliation (gold) — sun on the right
  const RWL = { dx: -1, dy: -0.4, color: '#ffc27a' };
  const Y = (mood, view, o = {}) => (t) => E.SET.yard(t, Object.assign({ mood, view }, o));
  const YB = (mood, view) => (t) => E.SET.yardBG(t, { mood, view });
  const leoLetterPose = { front: 'in', aB: [0.6, 1.3], aF: [1.15, 0.3], lB: [0.04, 0], lF: [-0.04, 0] };
  // a thought that starts to form but Noah chooses not to read: pops small, never resolves, fades
  const unread = (c, t, ta, x, y, tail, kind) => { const lt = t - ta; if (lt < 0 || lt > 1.6) return; const s = E.pop(lt, 0, 0.3) * 0.75; const a = E.clamp(Math.min(lt / 0.2, (1.6 - lt) / 0.7)) * 0.7; E.thought(c, { x, y, w: 200, h: 60, s, a, text: '· · ·', size: 34, kind, tail, noClamp: true, backing: false }, t); };

  // ===== S15 the low point (golden light breaks out) =====
  E.cut('s15a_couldnt', E.st('s15_noah1') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.55, z1: 1.62, x: 960, y: 620, focus: 1, ap: 6 });
    const L = Y('warm', 'tree', {})(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 820, y: 905, h: 330, f: 0.8, pose: 'letter', prop: E.PROP.letter, expr: 'sad', look: [0, 0.6], rim: RW }); E.ch(c, 'leo', t, { x: 1100, y: 905, h: 335, f: -0.8, pose: 'pocket', expr: 'sad', look: [0, 0.6], rim: RWL }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Profile two-shot against the low golden sun, the letter between them: Noah, quietly — "You said you couldn\'t keep doing this."' });
  E.cut('s15b_pretending', E.st('s15_leo1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14, drift: 2 });
    const L = YB('warm', 'tree')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1050, 470), h: 1050, f: -0.35, pose: E.poseAt(lt, [[0, 'pocket'], [1.6, 'clutch']]), expr: 'sad', look: E.lerp(0.9, 0, E.seg(lt, 2.8, 3.4)) > 0.5 ? [-0.2, 0.9] : [-0.5, 0], rim: RWL, ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 220, y: 2050, h: 1800, f: 0.5, faceAlpha: 0, rim: RW, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder, sun behind Leo: "Yeah. Pretending everything was normal..." — he looks down, then up.' });
  E.cut('s15c_reaction', E.sg('s15_leo1', 2) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = YB('warm', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 800, y: E.headAt(1100, 470), h: 1100, f: 0.85, pose: 'letter', prop: E.PROP.letter, expr: 'sad', look: lt < D * 0.5 ? [0.2, 0.9] : [0.6, 0], rim: RW, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Profile on Noah looking down at the letter in his hands as Leo finishes ("...while I knew I was leaving"), then up at him: "And you thought I\'d hate you?"' });
  E.cut('s15d_scared', E.st('s15_leo2') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.sine(E.clamp(lt / D));
    const cam = E.cam({ z: E.lerp(1.0, 1.5, k), x: 1080, y: E.lerp(560, 420, k), rot: 0.02, focus: 1, ap: 14 });
    const L = YB('warm', 'tree')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1050, 470), h: 1050, f: -0.3, pose: 'crossed', expr: 'hurt', look: [-0.3, 0.3], tilt: Math.sin(lt * 37) * 0.004, rim: RWL, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'HIGH', desc: 'Slightly high angle, a slow push from close-up to extreme close-up on Leo, arms wrapped around himself, voice trembling: "I was scared you\'d think I chose a new life over being your friend."' });
  // 15E — memory: young Noah & Leo in a golden park (nostalgic grade, kid scale), white flash in/out
  E.cut('s15e_memory', E.M('memory') + 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 0.9, ap: 4 });
    const L = [{ d: 0.05, draw: (c) => { E.sky(c, '#e8a070', '#f6c88a', '#ffe0a8', -600, 760, -2000, 6000); E.sun(c, 1400, 380, 60, t); E.rays(c, 1400, 380, 1600, 14, '#fff0c8', 0.14, t); } },
      { d: 0.4, draw: (c) => { for (let i = 0; i < 8; i++) E.SET._.tree(c, -300 + i * 380, 800, 1.1 + (i % 3) * 0.2, '#8a5a4a'); c.fillStyle = '#9a8a50'; c.fillRect(-1500, 790, 5000, 700); } },
      { d: 0.9, draw: (c) => { const bx = 960 + Math.sin(lt * 2.4) * 160, by = 860 - Math.abs(Math.sin(lt * 4.8)) * 120;
        E.ch(c, 'noah', t, { x: 760, y: 905, h: 170, f: 0.8, pose: E.walkPose(lt * 2), expr: 'laugh', rim: { dx: 1, dy: -0.4, color: '#fff1c9' }, talk: 0 }); E.ch(c, 'leo', t, { x: 1160, y: 905, h: 165, f: -0.8, pose: E.walkPose(lt * 2 + 0.5), expr: 'laugh', rim: { dx: -1, dy: -0.4, color: '#fff1c9' }, talk: 0 });
        c.fillStyle = '#f4ede6'; c.beginPath(); c.arc(bx, by, 20, 0, Math.PI * 2); c.fill(); c.fillStyle = '#0a080d'; c.beginPath(); c.arc(bx, by, 7, 0, Math.PI * 2); c.fill(); } }];
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#c08850', 0.35, 'soft-light'); E.screenFill(ctx, '#808080', 0.35, 'saturation');
    ctx.save(); ctx.translate(Math.sin(lt * 30) * 2, Math.cos(lt * 27) * 1.5); ctx.restore();
    const fl = Math.max(0, 1 - lt / 0.25, 1 - (D - lt) / 0.25); if (fl > 0) E.screenFill(ctx, '#fff6e6', fl * 0.9);
  }, { type: 'WS', desc: 'A brief warm memory (sepia grade, heavy grain, white flash in and out): Noah and Leo aged 8, laughing, kicking a ball in a golden park.', post: { bloom: 0.5, vignette: 0.9, grain: 0.14 } });
  E.cut('s15f_first', E.st('s15_leo3') - 0.4, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = YB('warm', 'tree')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1050, 470), h: 1050, f: -0.35, pose: 'relaxed', expr: 'sad', look: [-0.6, 0], tilt: -0.08, rim: RWL, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Back on Leo, relaxed now, head tilted toward Noah, sincere: "I wanted you to be the first person I told."' });
  E.cut('s15g_silence', E.en('s15_leo3') + 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(1.0, 1.12, E.ease.sine(E.clamp(lt / D))), focus: 1, ap: 14 });
    const L = YB('warm', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 860, y: E.headAt(1150, 470), h: 1150, f: 0.35, pose: 'letter', prop: E.PROP.letter, expr: lt > D * 0.6 ? 'neutral' : 'sad', look: lt > D * 0.5 ? [0.5, 0] : [0.2, 0.8], blink: Math.abs(lt - D * 0.55) < 0.07, rim: RW, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Silence; only the music. A slow push on Noah: he looks at the letter, blinks, and looks back up at Leo — something shifts.' });

  // ===== S16 realization — in-world replays =====
  const replay = (setFn, who, said, thought, o = {}) => (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 10 });
    const L = setFn(t);
    L.push({ d: 1, draw: (c) => E.ch(c, who, t, Object.assign({ x: 1000, y: E.headAt(1000, 470), h: 1000, f: -0.3, pose: 'clutch', expr: 'worried', rim: { dx: -1, dy: -0.4, color: '#ffd8b8' }, talk: 0, ground: false, shadow: false }, o)) });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#808080', 0.55, 'saturation'); E.screenFill(ctx, '#d8a070', 0.25, 'soft-light');
    const a1 = E.seg(lt, 0.15, 0.45), a2 = E.seg(lt, 0.7, 1.0);
    ctx.save(); ctx.globalAlpha = a1; ctx.fillStyle = 'rgba(10,6,14,0.6)'; ctx.beginPath(); ctx.roundRect(240, 820, 700, 110, 18); ctx.fill(); ctx.restore();
    E.caption(ctx, `"${said}"`, 590, 875, a1, 38);
    ctx.save(); ctx.globalAlpha = a2; ctx.fillStyle = 'rgba(40,20,70,0.7)'; ctx.beginPath(); ctx.roundRect(980, 820, 700, 110, 18); ctx.fill(); ctx.restore();
    E.thoughtText(ctx, thought, 1330, 875, { size: 44, a: a2, color: '#efe6ff', glow: '#a98bff', maxW: 660 });
  };
  E.cut('s16a_face', E.M('S16'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.sine(E.clamp(lt / D));
    const cam = E.cam({ z: E.lerp(1.0, 1.35, k), y: E.lerp(540, 460, k), focus: 1, ap: 14 });
    const L = YB('warm', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 900, y: E.headAt(1150, 470), h: 1150, f: 0.3, pose: 'letter', prop: E.PROP.letter, expr: lt > D * 0.6 ? 'smile' : 'sad', look: lt > D * 0.4 ? [0.3, 0.7] : [0.5, 0], blink: Math.abs(lt - D * 0.6) < 0.07, rim: RW, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'A continuous push from close-up toward Noah\'s eyes; his face softens from sad to a small smile ("And suddenly... Noah understood. All day, he\'d been hearing people\'s thoughts.").' });
  E.cut('s16b_fear', E.sg('s16_vo1', 4) - 0.2, replay((t) => E.SET.hall3q(t, { mood: 'afternoon', back: [300, 330, 600, 640] }), 'leo', 'Yo, you coming over Friday?', "He's gonna hate me.", { expr: 'sad', look: [-0.2, 0.8] }), { type: 'INSERT', desc: 'Replay, warm and desaturated, back in the hallway: Leo SAID "Yo, you coming over Friday?" while he THOUGHT "He\'s gonna hate me." ("every passing fear").' });
  E.cut('s16c_unfinished', E.sg('s16_vo1', 5) - 0.2, replay((t) => E.SET.hall3q(t, { mood: 'cool', back: [1200, 360, 1500, 640] }), 'maya', 'Hey, Noah. You okay?', "I want to help, but I don't know what to say.", { x: 1000, f: -0.4, expr: 'worried' }), { type: 'INSERT', desc: 'Replay in the hallway: Maya SAID "Hey, Noah. You okay?" while she THOUGHT "I want to help, but I don\'t know what to say." ("every unfinished sentence").' });
  E.cut('s16d_worry', E.sg('s16_vo1', 6) - 0.2, replay((t) => { const L = E.SET.classroom(t); L[0].d = 0.35; L[1].skip = true; return L; }, 'teacher', "Noah. What's the answer?", "Please don't say C again.", { x: 1000, f: 0.2, expr: 'worried', costume: Object.assign({}, E.COSTUME.teacher, { topC: '#d9d2e6' }) }), { type: 'INSERT', desc: 'Replay in the classroom: the teacher SAID "What\'s the answer?" while she THOUGHT "Please don\'t say C again." ("every private worry, like it was the whole truth").' });
  E.cut('s16e_hear', E.sg('s16_vo1', 8) - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 14 });
    const L = YB('warm', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 860, y: E.headAt(1150, 470), h: 1150, f: 0.35, pose: E.poseAt(lt, [[0, 'letter'], [1.4, 'relaxed', 0.5]]), prop: lt < 1.2 ? E.PROP.letter : null, expr: 'smile', look: [0.6, 0], rim: RW, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah lowers the letter and looks up at Leo ("He could hear what people were thinking.").' });
  E.cut('s16f_wide', E.sg('s16_vo1', 9) - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(0.95, 0.9, E.clamp(lt / D)), x: 960, y: 580, focus: 0.9, ap: 3 });
    const L = Y('warm', 'building', { treeX: 520 })(t);
    L.push({ d: 0.9, draw: (c) => { const turn = E.seg(lt, 0.5, 1.5); E.ch(c, 'noah', t, { x: 870, y: 905, h: 200, f: E.lerp(0.8, 0.5, turn), pose: 'relaxed', expr: 'smile', rim: RW }); E.ch(c, 'leo', t, { x: 1070, y: 905, h: 202, f: -0.8, pose: 'pocket', expr: 'sad', rim: RWL }); } });
    L.push(E.dustL(t, { d: 0.95, n: 30 }));
    E.layers(ctx, cam, L);
  }, { type: 'EWS', desc: 'Wide, golden courtyard, no text on screen: the two friends now standing close ("He still didn\'t know what they meant.").', post: { bloom: 0.4 } });

  // ===== S17 choosing what to listen to =====
  E.cut('s17a_dude', E.M('S17'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = YB('warm', 'building')(t);
    L.push({ d: 0.35, draw: (c) => E.panelField(c, t, { seed: 81, n: 5, x: 0, y: 80, w: 1920, h: 500, t0: -50, spread: 1, a: 0.2, scale: 0.7 }) });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 820, y: E.headAt(1100, 470), h: 1100, f: 0.35, pose: E.poseAt(lt, [[0, 'relaxed'], [1.2, 'shrug']]), expr: lt > D * 0.4 ? 'happy' : 'amazed', look: [0.5, 0], rim: RW, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah breaks into a grin: "Dude. You\'re actually getting a FULL scholarship?" — faint, blurred thought windows still drift in the background; he pays them no attention.' });
  E.cut('s17b_yeah', E.st('s17_leo1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.08, focus: 1, ap: 14 });
    const L = YB('warm', 'tree')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1100, y: E.headAt(1100, 470), h: 1100, f: -0.35, pose: 'neck', expr: 'smile', look: [-0.4, 0.3], rim: RWL, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo, shy, hand behind his neck: "Yeah." (Noah, off-screen: "That\'s insane!")' });
  E.cut('s17c_insane', E.sg('s17_noah2', 1) - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(1.5, 1.68, E.ease.sine(E.clamp(lt / D))), x: 960, y: 620, focus: 1, ap: 7 });
    const L = Y('warm', 'tree', {})(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 860, y: 905, h: 330, f: 0.8, pose: E.poseAt(lt, [[0, 'shrug'], [1.6, 'relaxed']]), expr: 'happy', rim: RW }); E.ch(c, 'leo', t, { x: 1070, y: 905, h: 335, f: -0.8, pose: E.poseAt(lt, [[0, 'neck'], [1.3, 'shrug']]), expr: lt > 1.2 ? 'laugh' : 'smile', rim: RWL }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Two-shot, now standing close, with a slow push-in: "Why didn\'t you just tell me?" — Leo laughs: "I was TRYING to."' });
  E.cut('s17d_happy', E.st('s17_noah3') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.1, focus: 1, ap: 14 });
    const L = YB('warm', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 820, y: E.headAt(1100, 470), h: 1100, f: 0.35, pose: 'relaxed', expr: 'smile', look: [0.5, 0], rim: RW, ground: false, shadow: false, talkScale: 0.7 }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah, sincere, softly: "...I\'m happy for you, man."' });
  // 17E — the lesson in action: a thought starts to form beside Leo; Noah's eyes flick to it, then back to Leo's face; it fades unread
  E.cut('s17e_choose', E.st('s17_leo_th') - 0.35, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, focus: 1, ap: 10 });
    const L = YB('warm', 'tree')(t);
    const ta = E.st('s17_leo_th') - 0.1;
    const flick = t > ta + 0.15 && t < ta + 0.45;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 560, y: E.headAt(900, 500), h: 900, f: 0.7, pose: 'relaxed', expr: 'smile', look: flick ? [0.6, -0.8] : [1, 0], rim: RW, ground: false, shadow: false }); E.ch(c, 'leo', t, { x: 1250, y: E.headAt(910, 500), h: 910, f: -0.7, pose: lt > 1.0 ? 'shrug' : 'pocket', expr: lt > 0.6 ? 'laugh' : 'happy', rim: RWL, ground: false, shadow: false }); unread(c, t, ta, 1420, 250, [1270, 340]); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'THE CHOICE: a small thought window starts to form beside Leo — Noah\'s eyes flick up to it for a split second, then he looks back at Leo\'s face and smiles; the window fades away unread as they both laugh.' });
  E.cut('s17f_hug', E.M('hug') - 0.4, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.io(E.seg(lt, D * 0.45, D));
    const cam = E.cam({ z: E.lerp(1.9, 0.85, k), x: E.lerp(960, 980, k), y: E.lerp(600, 570, k), focus: 0.9, ap: E.lerp(6, 3, k) });
    const L = Y('warm', 'building', { treeX: 520 })(t);
    L.push({ d: 0.9, draw: (c) => { const hug = E.seg(lt, 0.2, 0.7), pat = hug > 0.9 ? Math.sin(lt * 25) * 0.15 * (1 - E.seg(lt, 1.6, 2.0)) : 0;
      E.ch(c, 'leo', t, { x: E.lerp(1090, 1018, hug), y: 905, h: 305, f: -0.8, pose: E.blendPose(E.POSE.pocket, { aB: [1.3, 1.1], aF: [1.4 + pat, 1.2], lB: [0.05, 0], lF: [-0.08, 0] }, hug), expr: 'happy', rim: RWL, talk: 0 });
      E.ch(c, 'noah', t, { x: E.lerp(870, 945, hug), y: 905, h: 300, f: 0.8, pose: E.blendPose(E.POSE.relaxed, E.POSE.hug, hug), expr: 'happy', rim: RW, talk: 0 }); } });
    L.push(E.dustL(t, { d: 0.95, n: 35 }));
    E.layers(ctx, cam, L);
    if (lt > 0.6) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glow(ctx, 1500, 380, 500, '#ffc27a', 0.18 * E.seg(lt, 0.6, 1.4)); ctx.restore(); }
  }, { type: 'WS', desc: 'A small, slightly awkward hug with two back-pats, in medium shot; then the camera slowly pulls out to the wide golden courtyard from the start of Act 3.', post: { bloom: 0.42 } });

  // ===== S18 sting — sunset =====
  E.cut('s18a_steps', E.M('S18'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 700, y: 560, focus: 1, ap: 5 });
    const L = E.SET.entranceSet(t);
    L.push({ d: 0.95, draw: (c) => E.ch(c, 'noah', t, { x: E.lerp(380, 560, E.clamp(lt / D)), y: E.lerp(820, 890, E.clamp(lt / D)), h: 240, f: 0.8, pose: E.walkPose(lt * 1.4), expr: 'smile', rim: K.sunset }) });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Sunset at the school entrance: Noah walks down the steps ("one person he was too scared to ask about").' });
  E.cut('s18b_sorry', E.M('sorry') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.5, z1: 1.55, x: 760, y: 630, focus: 1, ap: 8 });
    const L = E.SET.entranceSet(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: E.lerp(980, 860, E.seg(lt, 0, 0.8)), y: 900, h: 300, f: -0.8, pose: E.poseAt(lt, [[0, E.walkPose(lt * 1.4)], [0.8, 'neck'], [1.6, 'wave']]), expr: lt > 1.0 ? 'awkward' : 'nervous', rim: K.sunset, talk: lt > 1.1 && lt < 1.7 ? 0.25 + 0.2 * Math.abs(Math.sin(lt * 14)) : 0 });
      E.ch(c, 'maya', t, { x: 560, y: 900, h: 290, f: 0.8, pose: 'clutch', expr: lt > D * 0.7 ? 'smile' : 'neutral', rim: K.sunset }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Noah spots Maya first and walks over; a wordless apology — hand behind his neck, a sheepish half-wave, a silently mouthed "sorry" — and her small forgiving smile.' });
  E.cut('s18c_walkhome', E.st('s18_maya1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 12 });
    const L = E.SET.entranceSet(t); L[2].d = 0.35;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'maya', t, { x: 760, y: E.headAt(1050, 470), h: 1050, f: 0.4, pose: E.poseAt(lt, [[0, 'clutch'], [1.2, 'behind']]), expr: 'smile', look: [0.5, 0], rim: K.sunset, ground: false, shadow: false }); unread(c, t, E.st('s18_maya_th') - 0.1, 1100, 260, [900, 330], 'pink'); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 1720, y: 2100, h: 1800, f: -0.5, faceAlpha: 0, rim: K.sunset, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder: Maya, shy — "Hey. You want to walk home together?" A tiny pink thought starts to form… and fades unread.' });
  E.cut('s18d_yes', E.st('s18_noah1') - 0.5, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = E.SET.entranceSet(t); L[2].d = 0.35;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 1100, y: E.headAt(1100, 470), h: 1100, f: -0.35, pose: 'pocket', expr: 'smile', look: [-0.5, 0], rim: K.sunset, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Held on Noah\'s genuine smile — looking at her face, not at any thought — he answers what she SAID: "Yeah. I\'d like that."' });
  E.cut('s18e_walkoff', E.M('walk_off') + 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(1.1, 0.95, E.ease.sine(E.clamp(lt / D))), x: 1150, y: 560, focus: 0.9, ap: 4 });
    const L = E.SET.entranceSet(t);
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 900 + lt * 110, y: 905, h: 230, f: 0.8, pose: E.walkPose(lt * 1.3), expr: 'happy', rim: K.sunset, talk: 0 }); E.ch(c, 'maya', t, { x: 815 + lt * 110, y: 905, h: 220, f: 0.8, pose: E.walkPose(lt * 1.3 + 0.5), expr: 'happy', rim: K.sunset, talk: 0 }); } });
    L.push(E.dustL(t, { d: 0.95, n: 35 }));
    E.layers(ctx, cam, L);
  }, { type: 'EWS', desc: 'Wide sunset street: Noah and Maya walk off together toward the sun, silhouetted.', post: { bloom: 0.45 } });
  // END CARD over the sunset street
  E.cut('s19_endcard', E.M('END'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.0 + lt * 0.02, x: 1200, y: 560, focus: 0.9, ap: 6 });
    const L = E.SET.entranceSet(t);
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 1500 + lt * 40, y: 905, h: 150, f: 0.8, pose: E.walkPose(lt * 1.3), expr: 'happy', rim: K.sunset, talk: 0 }); E.ch(c, 'maya', t, { x: 1440 + lt * 40, y: 905, h: 145, f: 0.8, pose: E.walkPose(lt * 1.3 + 0.5), expr: 'happy', rim: K.sunset, talk: 0 }); } });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#1a0c18', 0.35);
    E.textGlow(ctx, 'What would YOU do if you could', 960, 230, { font: 'italic 800 64px Nunito', a: E.seg(lt, 0.2, 0.8) });
    E.textGlow(ctx, "hear everyone's thoughts?", 960, 320, { font: 'italic 900 80px Nunito', color: '#ffd166', a: E.seg(lt, 0.5, 1.1) });
    const cast = ['noah', 'leo', 'maya', 'teacher', 'barista', 'biz', 'woman', 'man'];
    cast.forEach((k, i) => { const a = E.seg(lt, 0.8 + i * 0.1, 1.2 + i * 0.1); E.char(ctx, { x: 450 + i * 145, y: 950 + (1 - a) * 40, h: 290, f: 0, costume: k, pose: k === 'noah' ? 'wave' : 'stand', expr: 'smile', t, seed: i, alpha: a, rim: { dx: 0, dy: -1, color: '#ffc98a' } }); });
  }, { type: 'END', desc: 'End card over the sunset street (Noah and Maya small in the distance): "What would YOU do if you could hear everyone\'s thoughts?" with the cast line-up.' });
})();
