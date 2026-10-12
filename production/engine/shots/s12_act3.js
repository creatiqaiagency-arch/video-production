// ACT 3 (V2) — two camera axes, three lighting states (conf → reveal → warm), the lesson shown through action.
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

  // ===== S12 Friday (confrontation light) =====
  E.cut('s12a_ews', E.M('S12'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(0.8, 0.88, E.ease.sine(E.clamp(lt / D))), x: 980, y: 560, focus: 0.85, ap: 3 });
    const L = Y('conf', 'building', { treeX: 620 })(t);
    L.push({ d: 0.85, draw: (c) => { E.ch(c, 'noah', t, { x: 700, y: 900, h: 150, f: 0.8, pose: 'crossed', expr: 'angry', rim: RC }); E.ch(c, 'leo', t, { x: E.lerp(2300, 1500, E.seg(lt, 0, D, 'lin')), y: 900, h: 152, f: -0.8, pose: E.walkPose(lt * 1.3), expr: 'nervous', rim: RC }); } });
    L.push(E.dustL(t, { d: 0.9, n: 18, color: '#d9d0ff' }));
    E.layers(ctx, cam, L);
    E.dayChip(ctx, 'FRIDAY', E.fadeIO(lt, 0.4, D, 0.3, 0.4));
  }, { type: 'EWS', desc: 'FRIDAY. Extreme wide of a near-empty courtyard under a cool, overcast sky: Noah waits under the tree, arms crossed; Leo approaches from far away (slow push-in).', post: { bloom: 0.2, vignette: 0.6 } });
  E.cut('s12b_arrive', E.sg('s12_vo1', 1) - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.15, z1: 1.3, x: 980, y: 640, focus: 0.9, ap: 5 });
    const L = Y('conf', 'building', { treeX: 560 })(t);
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 700, y: 905, h: 240, f: 0.8, pose: 'crossed', expr: 'angry', rim: RC }); E.ch(c, 'leo', t, { x: E.lerp(1500, 1240, E.seg(lt, 0, D * 0.8, 'out')), y: 905, h: 242, f: -0.8, pose: lt < D * 0.8 ? E.walkPose(lt * 1.3) : 'pocket', expr: 'smile', rim: RC }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'The camera creeps closer as Leo reaches Noah; the friends take opposite sides of the frame.', post: { vignette: 0.55 } });
  E.cut('s12c_tell', E.st('s12_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, focus: 1, ap: 10, drift: 1 });
    const L = YB('conf', 'building')(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 560, y: 1150, h: 640, f: 0.8, pose: 'crossed', expr: 'angry', rim: RC }); E.ch(c, 'leo', t, { x: 1380, y: 1150, h: 650, f: -0.8, pose: lt > D * 0.6 ? 'shrug' : 'pocket', expr: lt > D * 0.6 ? 'nervous' : 'smile', rim: { dx: -1, dy: -0.5, color: '#c9b8e8' } }); E.pool(c, 960, 1120, 420, 60, '#2a1f3a', 0.0); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Medium two-shot with a cold band of shadow between them: Noah — "So. What were you gonna tell me?" Leo — "What?"', post: { vignette: 0.55 } });
  E.cut('s12d_dontact', E.st('s12_noah2') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = YB('conf', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 760, y: E.headAt(1100, 470), h: 1100, f: 0.4, pose: E.poseAt(lt, [[0, 'crossed'], [0.9, 'point', 0.2]]), expr: 'angry', look: [0.6, 0], rim: RC, ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'leo', t, { x: 1720, y: 2000, h: 1800, f: -0.5, faceAlpha: 0, rim: RC, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Leo\'s shoulder (school building behind Noah): Noah, cold — "Don\'t act like you don\'t know."', post: { vignette: 0.55 } });
  E.cut('s12e_notlikethis', E.st('s12_leo_th') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = YB('conf', 'tree')(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 900, y: E.headAt(1100, 470), h: 1100, f: -0.4, pose: 'pocket', expr: 'nervous', look: [-0.6, 0.2], rim: { dx: -1, dy: -0.5, color: '#c9b8e8' }, ground: false, shadow: false }); E.th(c, 's12_leo_th', t, { x: 1420, y: 330, w: 440, h: 110, tail: [1060, 360], size: 46, a: 0.8 }); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 180, y: 2000, h: 1800, f: 0.5, faceAlpha: 0, rim: RC, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Reverse axis (tree and open courtyard behind Leo), over Noah\'s shoulder: Leo panics silently; his subdued violet thought sits on his side of frame — "Oh no. Not like this."', post: { vignette: 0.55 } });

  // ===== S13 =====
  E.cut('s13a_track', E.M('S13'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.io(E.clamp(lt / D));
    const cam = E.cam({ x: E.lerp(760, 1160, k), y: 600, z: 1.35, rot: E.lerp(-0.02, 0.02, k), focus: 1, ap: 9 });
    const L = Y('conf', 'building', { treeX: 300 })(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 760, y: 905, h: 330, f: 0.8, pose: E.poseAt(lt, [[0, 'crossed'], [1.0, 'point', 0.2], [2.2, 'shrug']]), expr: 'angry', rim: RC }); E.ch(c, 'leo', t, { x: 1180, y: 905, h: 335, f: -0.8, pose: lt > D * 0.5 ? 'shrug' : 'pocket', expr: 'worried', rim: { dx: -1, dy: -0.5, color: '#c9b8e8' } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'The camera tracks around the pair (real parallax): Noah accuses — "You\'ve been hiding something from me all week." Leo pleads — "Noah, just let me explain."', post: { vignette: 0.55 } });
  E.cut('s13a2_explain', E.st('s13_leo1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 12 });
    const L = YB('conf', 'tree')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1050, 470), h: 1050, f: -0.35, pose: E.poseAt(lt, [[0, 'shrug'], [1.0, 'reach', 0.3]]), expr: 'worried', look: [-0.5, 0], rim: { dx: -1, dy: -0.5, color: '#c9b8e8' }, ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 220, y: 2050, h: 1800, f: 0.5, faceAlpha: 0, rim: RC, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder onto Leo, hands out, pleading: "Noah, just let me explain."', post: { vignette: 0.55 } });
  // 13B — ECU of Noah's eyes with the thought projected across, pulling back to a CU for "So you ARE abandoning me?"
  E.cut('s13b_projected', E.st('s13_leo_th') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const tp = E.st('s13_noah2') - s.t0;
    const pull = E.seg(lt, tp - 0.3, tp + 0.5, 'io');
    const L = YB('conf', 'building')(t);
    const h = E.lerp(3400, 1150, pull);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: E.lerp(960, 820, pull), y: E.headAt(h, E.lerp(820, 470, pull)), h, f: E.lerp(0, 0.4, pull), pose: pull > 0.5 ? 'shrug' : 'stand', expr: 'angry', rim: RC, ground: false, shadow: false }) });
    E.layers(ctx, E.cam({ focus: 1, ap: 14 }), L);
    const v = E.tv('s13_leo_th', t, 0.1, 0.8); const ta = v.a * (1 - pull);
    if (ta > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; E.projected(ctx, v.text, 960, 560 + Math.sin(lt) * 6, ta, 74); ctx.restore(); ctx.save(); ctx.globalAlpha = ta * 0.6; E.projected(ctx, v.text, 960, 560, 1, 74); ctx.restore(); }
  }, { type: 'ECU', desc: 'Extreme close-up on Noah\'s eyes with Leo\'s thought projected across his face ("He\'s gonna think I\'m abandoning him") — then a pull-back to a close-up as he says it aloud: "So you ARE abandoning me?"', post: { vignette: 0.7 } });
  E.cut('s13d_howdid', E.st('s13_leo2') - 0.1, (ctx, lt, t, s) => {
    const cam = E.push(lt, E.D(s), { z0: 1.0, z1: 1.04, focus: 1, ap: 14, drift: 1 });
    const L = YB('conf', 'tree')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 960, y: E.headAt(3000, 640), h: 3000, f: -0.1, expr: 'shock', rim: { dx: -1, dy: -0.5, color: '#c9b8e8' }, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'ECU', desc: 'Extreme close-up on Leo: his eyes widen, mouth falls open — "How did you—"' });
  E.cut('s13e_iknow', E.st('s13_noah3') - 0.15, (ctx, lt, t, s) => {
    const cam = E.cam({ z: 1.12 + E.seg(lt, 0.1, 0.3, 'out') * 0.08, y: 600, rot: 0.03, focus: 1, ap: 14 });
    const L = YB('conf', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1300, 430), h: 1300, f: 0.05, pose: E.poseAt(lt, [[0, 'stand'], [0.1, { aB: [0.1, 0.1], aF: [0.6, 0.2], lB: [0.04, 0], lF: [-0.04, 0] }, 0.08], [0.35, 'point', 0.15], [1.4, 'relaxed', 0.4]]), lean: E.pulse(lt, 0, 0.2) * -0.1, expr: 'angry', rim: RC, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'LOW', desc: 'Low-angle medium close-up: Noah jabs a finger — "I KNOW what you\'re thinking, Leo!"' });
  E.cut('s13f_distance', E.M('silence') - 0.05, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(1.4, 0.88, E.ease.out(E.clamp(lt / D))), x: 960, y: 580, focus: 0.9, ap: 4 });
    const L = Y('conf', 'building', { treeX: 420 })(t);
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 620, y: 905, h: 220, f: 0.8, pose: 'relaxed', expr: 'shock', rim: RC }); E.ch(c, 'leo', t, { x: 1340, y: 905, h: 222, f: -0.8, pose: 'relaxed', expr: 'shock', rim: { dx: -1, dy: -0.5, color: '#c9b8e8' } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Silence. The camera pulls back to a wide: a big empty gap of courtyard between the two friends.', post: { bloom: 0.2, vignette: 0.6 } });

  // ===== S14 reveal (neutral light, sun edge appears) =====
  E.cut('s14a_accepted', E.st('s14_leo1') - 0.6, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 12 });
    const L = YB('reveal', 'tree')(t);
    L.push({ d: 1, draw: (c) => { const out = E.seg(lt, 0.3, 1.1); E.ch(c, 'leo', t, { x: 1050, y: E.headAt(1000, 480), h: 1000, f: -0.4, pose: E.blendPose(E.POSE.bag, leoLetterPose, out), prop: out > 0.3 ? E.PROP.folded : null, expr: 'sad', look: [0, 0.4], rim: { dx: -1, dy: -0.45, color: '#f0b088' }, ground: false, shadow: false }); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 240, y: 2050, h: 1800, f: 0.5, faceAlpha: 0, rim: RN, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder: Leo draws a folded letter out of his bag and holds it out — "I got accepted into a school overseas."' });
  E.cut('s14b_what', E.st('s14_noah1') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.06, z1: 1.12, focus: 1, ap: 14 });
    const L = YB('reveal', 'building')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 860, y: E.headAt(1150, 470), h: 1150, f: 0.35, pose: E.poseAt(lt, [[0, 'crossed'], [0.9, 'relaxed', 0.6], [1.6, 'reach', 0.4]]), expr: lt < 1.0 ? 'shock' : 'sad', look: [0.5, 0.1], rim: RN, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah — "...What?" — the anger drains out: his arms drop, his brows relax, and his hand rises to take the letter.' });
  E.cut('s14c_letter', E.M('letter') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 0, dy: -20 });
    ctx.save(); E.applyCam(ctx, cam, 1);
    E.vgrad(ctx, -200, -200, 2400, 1500, [[0, '#4a3036'], [1, '#2a1c22']]);
    ctx.save(); ctx.translate(960, 560); ctx.rotate(-0.025);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-500, -380, 1060, 790); ctx.fillStyle = '#efe4d2'; ctx.fillRect(-520, -400, 1060, 790);
    const kg = ctx.createLinearGradient(-520, -400, 540, 390); kg.addColorStop(0, 'rgba(255,220,170,0.25)'); kg.addColorStop(1, 'rgba(60,30,40,0.25)'); ctx.fillStyle = kg; ctx.fillRect(-520, -400, 1060, 790);
    ctx.strokeStyle = 'rgba(160,140,120,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-520, -140); ctx.lineTo(540, -140); ctx.moveTo(-520, 120); ctx.lineTo(540, 120); ctx.stroke();
    ctx.fillStyle = '#2c3550'; ctx.beginPath(); ctx.arc(-420, -310, 46, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ffd166'; ctx.font = '900 40px Nunito'; ctx.textAlign = 'center'; ctx.fillText('A', -420, -296);
    ctx.textAlign = 'left'; ctx.fillStyle = '#2c3550'; ctx.font = '900 38px Nunito'; ctx.fillText('ASHFORD INTERNATIONAL ACADEMY', -350, -322); ctx.font = '600 26px Nunito'; ctx.fillStyle = '#6a6070'; ctx.fillText('London, United Kingdom', -350, -284);
    ctx.fillStyle = '#2a2230'; ctx.font = '600 30px Nunito'; ctx.fillText('Dear Leo Martinez,', -450, -200);
    ctx.fillText('We are delighted to offer you a place in our', -450, -150); ctx.fillText('International Scholars Programme with a', -450, -108);
    const hi = E.seg(lt, 0.6, 1.4); ctx.fillStyle = E.rgba('#ffd166', 0.55 * hi); ctx.fillRect(-456, -88, 470 * hi, 50);
    ctx.fillStyle = '#c8302f'; ctx.font = '900 40px Nunito'; ctx.fillText('FULL SCHOLARSHIP', -450, -50);
    ctx.fillStyle = '#2a2230'; ctx.font = '600 30px Nunito'; ctx.fillText('covering tuition, boarding and travel.', -450, 0);
    ctx.fillText('Term begins:', -450, 70); ctx.font = '900 34px Nunito'; ctx.fillText('Monday, January 11', -250, 70);
    ctx.font = '700 44px Caveat'; ctx.fillStyle = '#2c3550'; ctx.fillText('Congratulations!', -450, 180);
    ctx.restore();
    for (const sd of [-1, 1]) { ctx.fillStyle = '#f0b088'; ctx.beginPath(); ctx.arc(960 + sd * 560 + 6, 620, 70, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#0a080d'; ctx.beginPath(); ctx.arc(960 + sd * 560, 625, 70, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(960 + sd * 560 - 50, 640, 100, 800); }
    ctx.restore();
  }, { type: 'INSERT', desc: 'Insert, in Noah\'s hands: "ASHFORD INTERNATIONAL ACADEMY, London · FULL SCHOLARSHIP (highlighted) · Term begins: Monday, January 11" — the same "A" crest from Leo\'s laptop.', post: { bloom: 0.15 } });
  E.cut('s14d_leave', E.st('s14_noah2') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.55, z1: 1.6, x: 960, y: 640, focus: 1, ap: 7 });
    const L = Y('reveal', 'building', { treeX: 300 })(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 800, y: 905, h: 330, f: 0.8, pose: 'letter', prop: E.PROP.letter, expr: 'hurt', rim: RN }); E.ch(c, 'leo', t, { x: 1120, y: 905, h: 335, f: -0.8, pose: 'pocket', expr: 'worried', rim: { dx: -1, dy: -0.45, color: '#f0b088' } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wider two-shot with the letter in Noah\'s hands between them: "And you were just gonna leave without telling me?"' });
  E.cut('s14d2_how', E.st('s14_leo3') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 12 });
    const L = YB('reveal', 'tree')(t);
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1050, 470), h: 1050, f: -0.35, pose: E.poseAt(lt, [[0, 'shrug'], [1.2, 'clutch']]), expr: 'worried', look: [-0.5, 0], rim: { dx: -1, dy: -0.45, color: '#f0b088' }, ground: false, shadow: false }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 220, y: 2050, h: 1800, f: 0.5, faceAlpha: 0, rim: RN, ground: false, shadow: false }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder onto Leo (tree side): "No! I was trying to figure out HOW to tell you."' });
  E.cut('s14e_happy', E.st('s14_leo_th') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 14 });
    const L = YB('reveal', 'tree')(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1050, 470), h: 1050, f: -0.35, pose: 'clutch', expr: 'sad', look: [-0.4, 0], rim: { dx: -1, dy: -0.45, color: '#f0b088' }, ground: false, shadow: false }); E.th(c, 's14_leo_th', t, { x: 520, y: 340, w: 520, h: 110, tail: [920, 360], size: 46, a: 1 - E.seg(lt, D * 0.6, D) }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo, earnest and scared; his last violet thought glows then fades away — "Please just be happy for me." (the violet overlays leave the film here).' });

})();
