// ACT 3 — S12 Friday · S13 exposure · S14 real reason · S15 low point · S16 realization · S17 choice · S18 sting + end card.
(function () {
  const E = globalThis.E;
  const GOLD = { dx: 6, dy: -3, color: '#ffc98a' };   // sun from the right
  const GOLDL = { dx: -6, dy: -3, color: '#ffc98a' };
  const yard = (t, o = {}) => E.SET.courtyard(t, Object.assign({ gold: 0.6 }, o));
  const bgYard = (t, o = {}) => { const L = yard(t, Object.assign({ noTree: true }, o)); L[1].d = 0.2; L[2].d = 0.3; return L; };

  // 12A — extreme wide, empty courtyard, Noah under the tree, Leo approaching from afar (held)
  E.cut('s12a_ews', E.M('S12'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(0.78, 0.84, E.ease.sine(E.clamp(lt / D))), x: 980, y: 560, focus: 0.85, ap: 3 });
    const L = yard(t, { gold: 0.45, treeX: 620 });
    L.push({ d: 0.85, draw: (c) => { E.ch(c, 'noah', t, { x: 700, y: 900, h: 150, f: 0.8, pose: 'crossed', expr: 'angry', rim: GOLD }); E.ch(c, 'leo', t, { x: E.lerp(2300, 1500, E.seg(lt, 0, D, 'lin')), y: 900, h: 152, f: -0.8, pose: E.walkPose(lt * 1.3), expr: 'nervous', rim: GOLD }); } });
    L.push(E.dustL(t, { d: 0.9, n: 25 }));
    E.layers(ctx, cam, L);
  }, { type: 'EWS', desc: 'Extreme wide, nearly empty courtyard (Friday): Noah waits under a big tree, arms crossed; Leo approaches from far away. Held.', post: { bloom: 0.35 } });

  // 12B — closer wide: Leo arrives; the two take opposite sides of frame
  E.cut('s12b_arrive', E.ph('s12_vo1', 1, 2) - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.15, z1: 1.3, x: 980, y: 640, focus: 0.9, ap: 5 });
    const L = yard(t, { gold: 0.45, treeX: 560 });
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 700, y: 905, h: 240, f: 0.8, pose: 'crossed', expr: 'angry', rim: GOLD }); E.ch(c, 'leo', t, { x: E.lerp(1500, 1240, E.seg(lt, 0, D * 0.8, 'out')), y: 905, h: 242, f: -0.8, pose: lt < D * 0.8 ? E.walkPose(lt * 1.3) : 'pocket', expr: 'smile', rim: GOLD }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Camera creeps closer as Leo reaches Noah; the friends occupy opposite sides of the frame.' });

  // 12C — two-shot: "So. What were you gonna tell me?" / "What?"
  E.cut('s12c_tell', E.st('s12_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, x: 960, focus: 1, ap: 10, drift: 1 });
    const L = bgYard(t, { gold: 0.45 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 560, y: 1150, h: 640, f: 0.8, pose: 'crossed', expr: 'angry', rim: GOLD }); E.ch(c, 'leo', t, { x: 1380, y: 1150, h: 650, f: -0.8, pose: 'pocket', expr: lt > D * 0.6 ? 'nervous' : 'smile', rim: GOLDL }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Medium two-shot, wide gap between them: Noah — "So. What were you gonna tell me?" Leo — "What?"' });

  // 12D — Noah "Don't act like you don't know."
  E.cut('s12d_dontact', E.st('s12_noah2') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 0.45 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 760, y: E.headAt(1100, 470), h: 1100, f: 0.4, pose: 'crossed', expr: 'angry', look: [0.6, 0], rim: GOLD }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'leo', t, { x: 1720, y: 2000, h: 1800, f: -0.5, faceAlpha: 0, rim: GOLDL }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Leo\'s shoulder: Noah, cold — "Don\'t act like you don\'t know."' });

  // 12E — Leo; subdued violet thought behind him: "Oh no. Not like this."
  E.cut('s12e_notlikethis', E.st('s12_leo_th') - 0.25, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 0.45 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1120, y: E.headAt(1100, 470), h: 1100, f: -0.4, pose: 'pocket', expr: 'nervous', look: [-0.6, 0.2], rim: GOLDL }); E.th(c, 's12_leo_th', t, { x: 560, y: 320, w: 440, h: 120, tail: [960, 360], size: 46, a: 0.7 }); } });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 220, y: 2000, h: 1800, f: 0.5, faceAlpha: 0, rim: GOLD }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Over Noah\'s shoulder: Leo panics silently; a subdued violet thought behind him — "Oh no. Not like this."' });

  // ===== SCENE 13 =====
  // 13A — slow track around both: "You've been hiding..." / "Noah, just let me explain."
  E.cut('s13a_track', E.M('S13'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.sine(E.clamp(lt / D));
    const cam = E.cam({ x: E.lerp(820, 1120, k), y: 600, z: 1.35, focus: 1, ap: 9 });
    const L = yard(t, { gold: 0.4, treeX: 300 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 760, y: 905, h: 330, f: 0.8, pose: 'point', expr: 'angry', rim: GOLD }); E.ch(c, 'leo', t, { x: 1180, y: 905, h: 335, f: -0.8, pose: lt > D * 0.5 ? 'shrug' : 'pocket', expr: 'worried', rim: GOLDL }); } });
    L.push({ d: 1.5, draw: (c) => { c.fillStyle = '#2a1620'; c.beginPath(); c.arc(1650 - k * 400, 400, 260, 0, Math.PI * 2); c.fill(); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Camera tracks around the pair: Noah accuses ("You\'ve been hiding something from me all week"); Leo pleads ("just let me explain").' });

  // 13B — sharp CU of Noah's eyes; Leo's thought projected across his face
  E.cut('s13b_projected', E.st('s13_leo_th') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 0.3 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(3400, 820), h: 3400, f: 0, expr: 'angry', rim: GOLD }) });
    E.layers(ctx, cam, L);
    const v = E.tv('s13_leo_th', t, 0.1, 1.5);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; E.projected(ctx, v.text, 960, 560 + Math.sin(lt) * 6, v.a, 82); ctx.restore();
    ctx.save(); ctx.globalAlpha = v.a * 0.6; E.projected(ctx, v.text, 960, 560, 1, 82); ctx.restore();
  }, { type: 'ECU', desc: 'Sharp close-up of Noah\'s eyes; Leo\'s thought "He\'s gonna think I\'m abandoning him" is projected across his face.', post: { vignette: 0.75 } });

  // 13C — Noah: "So you ARE abandoning me?"
  E.cut('s13c_abandon', E.st('s13_noah2') - 0.15, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.12, focus: 1, ap: 14, rot: -0.02 });
    const L = bgYard(t, { gold: 0.35 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 820, y: E.headAt(1150, 470), h: 1150, f: 0.4, pose: 'shrug', expr: 'angry', rim: GOLD }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah, angry and hurt, repeats the private thought aloud: "So you ARE abandoning me?"' });

  // 13D — ECU Leo: eyes widen, mouth opens slightly ("How did you—"), no SFX
  E.cut('s13d_howdid', E.st('s13_leo2') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.04, focus: 1, ap: 14, drift: 1 });
    const L = bgYard(t, { gold: 0.35 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 960, y: E.headAt(3000, 700), h: 3000, f: -0.1, expr: 'shock', rim: GOLDL }) });
    E.layers(ctx, cam, L);
  }, { type: 'ECU', desc: 'Extreme close-up on Leo: his eyes widen, mouth falls open — "How did you—"' });

  // 13E — Noah: "I KNOW what you're thinking, Leo!"
  E.cut('s13e_iknow', E.st('s13_noah3') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: 1.15 + E.seg(lt, 0, 0.2, 'out') * 0.08, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 0.3 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 960, y: E.headAt(1300, 460), h: 1300, f: 0.05, pose: 'point', expr: 'angry', rim: GOLD }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah blurts out his secret: "I KNOW what you\'re thinking, Leo!"' });

  // 13F — pull back to wide; noticeable distance between them; silence
  E.cut('s13f_distance', E.M('silence') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(1.4, 0.9, E.ease.out(E.clamp(lt / D))), x: 960, y: 580, focus: 0.9, ap: 4 });
    const L = yard(t, { gold: 0.3, treeX: 420 });
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 620, y: 905, h: 220, f: 0.8, pose: 'relaxed', expr: 'shock', rim: GOLD }); E.ch(c, 'leo', t, { x: 1340, y: 905, h: 222, f: -0.8, pose: 'relaxed', expr: 'shock', rim: GOLDL }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Silence. The camera pulls back to a wide: a big empty gap of courtyard between the two friends.', post: { bloom: 0.25 } });

  // ===== SCENE 14 =====
  // 14A — Leo pulls a folded letter from his bag: "I got accepted into a school overseas."
  E.cut('s14a_accepted', E.st('s14_leo1') - 0.6, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 12 });
    const L = bgYard(t, { gold: 0.5 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1050, y: E.headAt(1000, 480), h: 1000, f: -0.4, pose: E.poseAt(lt, [[0, 'bag'], [0.9, 'holdOut']]), prop: lt > 0.7 ? E.PROP.folded : null, expr: 'sad', look: [0, 0.4], rim: GOLDL }) });
    L.push({ d: 1.5, draw: (c) => E.ch(c, 'noah', t, { x: 240, y: 2050, h: 1800, f: 0.5, faceAlpha: 0, rim: GOLD }) });
    E.layers(ctx, cam, L);
  }, { type: 'OTS', desc: 'Leo pulls a folded letter from his bag and holds it out: "I got accepted into a school overseas."' });

  // 14B — Noah stunned "...What?"
  E.cut('s14b_what', E.st('s14_noah1') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.08, z1: 1.12, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 0.55 });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 860, y: E.headAt(1150, 470), h: 1150, f: 0.35, pose: 'relaxed', expr: 'shock', look: [0.5, 0.1], rim: GOLD }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah, all the anger draining away — "...What?"' });

  // 14C — insert: the acceptance letter (real readable text)
  E.cut('s14c_letter', E.M('letter') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 0, dy: -20 });
    ctx.save(); E.applyCam(ctx, cam, 1);
    E.vgrad(ctx, -200, -200, 2400, 1500, [[0, '#a07058'], [1, '#5a3a3a']]);
    ctx.save(); ctx.translate(960, 560); ctx.rotate(-0.025);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-500, -380, 1010, 780); ctx.fillStyle = '#f7f1e8'; ctx.fillRect(-510, -400, 1000, 780);
    ctx.strokeStyle = 'rgba(160,140,120,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-510, -140); ctx.lineTo(490, -140); ctx.moveTo(-510, 120); ctx.lineTo(490, 120); ctx.stroke();
    ctx.fillStyle = '#2c3550'; ctx.beginPath(); ctx.arc(-410, -310, 46, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ffd166'; ctx.font = '900 40px Nunito'; ctx.textAlign = 'center'; ctx.fillText('A', -410, -296);
    ctx.textAlign = 'left'; ctx.fillStyle = '#2c3550'; ctx.font = '900 44px Nunito'; ctx.fillText('ASHFORD INTERNATIONAL ACADEMY', -340, -322); ctx.font = '600 26px Nunito'; ctx.fillStyle = '#6a6070'; ctx.fillText('London, United Kingdom', -340, -284);
    ctx.fillStyle = '#2a2230'; ctx.font = '600 30px Nunito'; ctx.fillText('Dear Leo Martinez,', -440, -200);
    ctx.fillText('We are delighted to offer you a place in our', -440, -150); ctx.fillText('International Scholars Programme with a', -440, -108);
    const hi = E.seg(lt, 0.8, 1.6); ctx.fillStyle = E.rgba('#ffd166', 0.55 * hi); ctx.fillRect(-446, -88, 470 * hi, 50);
    ctx.fillStyle = '#c8302f'; ctx.font = '900 40px Nunito'; ctx.fillText('FULL SCHOLARSHIP', -440, -50);
    ctx.fillStyle = '#2a2230'; ctx.font = '600 30px Nunito'; ctx.fillText('covering tuition, boarding and travel.', -440, 0);
    ctx.fillText('Departure date:', -440, 70); ctx.font = '900 34px Nunito'; ctx.fillText('Sunday, August 30', -200, 70);
    ctx.font = '700 44px Caveat'; ctx.fillStyle = '#2c3550'; ctx.fillText('Congratulations!', -440, 180);
    ctx.restore();
    // hands holding the letter edges
    for (const sd of [-1, 1]) { ctx.fillStyle = '#f0a77e'; ctx.beginPath(); ctx.arc(960 + sd * 540 + 6, 620, 70, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#0a080d'; ctx.beginPath(); ctx.arc(960 + sd * 540, 625, 70, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(960 + sd * 540 - 50, 640, 100, 800); }
    ctx.restore();
  }, { type: 'INSERT', desc: 'Insert: the acceptance letter — "ASHFORD INTERNATIONAL ACADEMY, London · FULL SCHOLARSHIP · Departure: Sunday, August 30".', post: { bloom: 0.25 } });

  // 14D — wide two-shot, the letter between them: "And you were just gonna leave without telling me?"
  E.cut('s14d_leave', E.st('s14_noah2') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.55, z1: 1.6, x: 960, y: 640, focus: 1, ap: 7 });
    const L = yard(t, { gold: 0.6, treeX: 300 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 800, y: 905, h: 330, f: 0.8, pose: 'letter', prop: E.PROP.letter, expr: 'hurt', rim: GOLD }); E.ch(c, 'leo', t, { x: 1120, y: 905, h: 335, f: -0.8, pose: lt > D * 0.5 ? 'shrug' : 'pocket', expr: 'worried', rim: GOLDL }); } });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'Wider two-shot with the letter between them: Noah — "And you were just gonna leave without telling me?" Leo — "No! I was trying to figure out HOW to tell you."' });

  // 14E — Leo CU; thought fades: "Please just be happy for me."
  E.cut('s14e_happy', E.st('s14_leo_th') - 0.3, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.06, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 0.7 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1050, 470), h: 1050, f: -0.35, pose: 'clutch', expr: 'sad', look: [-0.4, 0], rim: GOLDL }); E.th(c, 's14_leo_th', t, { x: 520, y: 340, w: 520, h: 120, tail: [920, 360], size: 44, a: 0.55 * (1 - E.seg(lt, D * 0.6, D)) }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo, earnest and scared; his last thought glows faintly then fades away: "Please just be happy for me." (violet overlays fade out of the film here).' });

  // ===== SCENE 15 — restrained eye-level close-ups =====
  const cuNoah = (expr, look = [0.5, 0.2], pose = 'relaxed', prop) => (ctx, lt, t, s) => { const D = E.D(s); const cam = E.push(lt, D, { z0: 1.06, z1: 1.09, focus: 1, ap: 14, drift: 2 }); const L = bgYard(t, { gold: 0.85 }); L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 820, y: E.headAt(1100, 470), h: 1100, f: 0.35, pose, prop, expr, look, rim: GOLD }) }); E.layers(ctx, cam, L); };
  const cuLeo = (expr, look = [-0.5, 0.2]) => (ctx, lt, t, s) => { const D = E.D(s); const cam = E.push(lt, D, { z0: 1.06, z1: 1.09, focus: 1, ap: 14, drift: 2 }); const L = bgYard(t, { gold: 0.85 }); L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1100, y: E.headAt(1100, 470), h: 1100, f: -0.35, pose: 'pocket', expr, look, rim: GOLDL }) }); E.layers(ctx, cam, L); };
  E.cut('s15a_couldnt', E.st('s15_noah1') - 0.25, cuNoah('sad', [0.4, 0.3]), { type: 'CU', desc: 'Eye-level close-up, golden light: Noah, quietly — "You said you couldn\'t keep doing this."' });
  E.cut('s15b_pretending', E.st('s15_leo1') - 0.2, cuLeo('sad', [-0.2, 0.5]), { type: 'CU', desc: 'Leo, embarrassed and sad: "Yeah. Pretending everything was normal… while I knew I was leaving."' });
  E.cut('s15c_hate', E.st('s15_noah2') - 0.2, cuNoah('sad', [0.1, 1], 'letter', E.PROP.letter), { type: 'CU', desc: 'Noah looks down at the letter in his hands: "And you thought I\'d hate you?"' });
  E.cut('s15d_scared', E.st('s15_leo2') - 0.2, cuLeo('hurt', [-0.3, 0.3]), { type: 'CU', desc: 'Leo, voice trembling: "I was scared you\'d think I chose a new life over being your friend."' });
  // 15E — memory: young Noah & Leo playing football in a golden park
  E.cut('s15e_memory', E.M('memory') + 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, focus: 0.9, ap: 4 });
    const L = E.SET.entrance(t); L[2].skip = true;
    L.push({ d: 0.9, draw: (c) => { treeLineGold(c); const bx = 960 + Math.sin(lt * 2.4) * 160, by = 860 - Math.abs(Math.sin(lt * 4.8)) * 120;
      E.ch(c, 'noah', t, { x: 760, y: 905, h: 210, f: 0.8, pose: E.walkPose(lt * 2), expr: 'laugh', rim: { dx: 4, color: '#fff1c9' }, talk: 0 }); E.ch(c, 'leo', t, { x: 1160, y: 905, h: 205, f: -0.8, pose: E.walkPose(lt * 2 + 0.5), expr: 'laugh', rim: { dx: 4, color: '#fff1c9' }, talk: 0 });
      c.fillStyle = '#f4ede6'; c.beginPath(); c.arc(bx, by, 22, 0, Math.PI * 2); c.fill(); c.fillStyle = '#0a080d'; c.beginPath(); c.arc(bx, by, 8, 0, Math.PI * 2); c.fill(); } });
    E.layers(ctx, cam, L);
    E.screenFill(ctx, '#ffd59a', 0.18, 'soft-light');
  }, { type: 'WS', desc: 'Brief warm memory: young Noah and Leo (age 8) laughing, kicking a ball in a golden park.', post: { bloom: 0.55, vignette: 0.85, grain: 0.12 } });
  const treeLineGold = (c) => { c.fillStyle = '#7a4a50'; for (let x = -600; x < 2600; x += 90) { c.beginPath(); c.arc(x, 800, 70, 0, Math.PI * 2); c.fill(); } c.fillStyle = '#8a6a4a'; c.fillRect(-1000, 860, 4000, 600); };
  E.cut('s15f_first', E.st('s15_leo3') - 0.4, cuLeo('sad', [-0.6, 0]), { type: 'CU', desc: 'Back on Leo, a small sincere look: "I wanted you to be the first person I told." Music enters after the line.' });

  // ===== SCENE 16 — realization =====
  E.cut('s16a_face', E.M('S16'), cuNoah('neutral', [0.2, 0.1]), { type: 'CU', desc: 'Noah\'s face softens as he understands ("And suddenly, Noah understood.").' });
  // revisit panels: full conversation + the thought, side by side
  const revisit = (who, spoken, thought, costume, kind) => (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 8 });
    const L = E.SET.void(t, { core: '#5a3a5a' });
    L.push({ d: 1, draw: (c) => {
      c.save(); c.fillStyle = 'rgba(255,240,220,0.07)'; c.strokeStyle = 'rgba(255,230,200,0.5)'; c.lineWidth = 3; c.beginPath(); c.roundRect(260, 170, 1400, 740, 30); c.fill(); c.stroke(); c.restore();
      E.ch(c, who, t, { x: 620, y: 930, h: 560, f: 0.6, pose: 'relaxed', expr: 'worried', rim: { dx: 4, color: '#ffd8b8' }, talk: 0 });
      const a1 = E.seg(lt, 0.2, 0.6), a2 = E.seg(lt, 0.9, 1.3);
      E.caption(c, spoken, 1170, 380, a1, 46); c.save(); c.globalAlpha = a1; c.fillStyle = 'rgba(255,255,255,0.6)'; c.font = '700 24px Nunito'; c.textAlign = 'center'; c.fillText('SAID', 1170, 320); c.restore();
      E.thought(c, { x: 1170, y: 600, w: 640, h: 140, s: E.pop(lt, 0.9), a: a2, text: thought, size: 44, kind }, t); c.save(); c.globalAlpha = a2; c.fillStyle = 'rgba(217,201,255,0.7)'; c.font = '700 24px Nunito'; c.textAlign = 'center'; c.fillText('THOUGHT', 1170, 505); c.restore();
      const a3 = E.seg(lt, D * 0.55, D * 0.75); E.label(c, 'MEANT', 1170, 760, a3, 26); E.thoughtText(c, { maya: 'She cared about him.', teacher: 'She was rooting for him.', leo: 'He was scared of losing his best friend.' }[who], 1170, 820, { size: 50, a: a3, color: '#ffe6c8', glow: '#ffb070' });
    } });
    E.layers(ctx, cam, L);
  };
  E.cut('s16b_maya', E.ph('s16_vo1', 2, 6) - 0.2, revisit('maya', 'Hey, Noah. You okay?', "I want to help, but I don't know what to say.", 'maya', 'warm'), { type: 'INSERT', desc: 'Revisit: Maya — SAID "You okay?" + THOUGHT "I want to help…" → MEANT "She cared about him."' });
  E.cut('s16c_teacher', E.ph('s16_vo1', 3, 6) - 0.2, revisit('teacher', "Noah. What's the answer?", "Please don't say C again.", 'teacher'), { type: 'INSERT', desc: 'Revisit: Teacher — SAID "What\'s the answer?" + THOUGHT "Please don\'t say C again." → MEANT "She was rooting for him."' });
  E.cut('s16d_leo', E.ph('s16_vo1', 4, 6) - 0.2, revisit('leo', 'Yo, you coming over Friday?', "He's gonna hate me.", 'leo'), { type: 'INSERT', desc: 'Revisit: Leo — SAID "Coming over Friday?" + THOUGHT "He\'s gonna hate me." → MEANT "He was scared of losing his best friend."' });
  E.cut('s16e_hear', E.ph('s16_vo1', 5, 6) - 0.2, cuNoah('sad', [0.3, 0.6], 'letter', E.PROP.letter), { type: 'CU', desc: 'Noah looks at the letter, then up ("He could hear what people were thinking…").' });
  E.cut('s16f_wide', E.at('s16_vo1', 0.9), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(0.95, 0.9, E.clamp(lt / D)), x: 960, y: 580, focus: 0.9, ap: 3 });
    const L = yard(t, { gold: 0.95, treeX: 520 });
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 860, y: 905, h: 200, f: 0.8, pose: 'letter', prop: E.PROP.letter, expr: 'sad', rim: GOLD }); E.ch(c, 'leo', t, { x: 1080, y: 905, h: 202, f: -0.8, pose: 'pocket', expr: 'sad', rim: GOLDL }); } });
    L.push(E.dustL(t, { d: 0.95, n: 30 }));
    E.layers(ctx, cam, L);
  }, { type: 'EWS', desc: 'Wide, golden courtyard, no text on screen: the two friends standing closer now ("He still didn\'t know what they meant.").', post: { bloom: 0.45 } });

  // ===== SCENE 17 — choosing what to listen to =====
  const faint = (c, t, seed) => E.panelField(c, t, { seed, n: 6, x: 0, y: 80, w: 1920, h: 500, t0: -50, spread: 1, a: 0.18, scale: 0.7 });
  E.cut('s17a_dude', E.M('S17'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 1 });
    L.push({ d: 0.35, draw: (c) => faint(c, t, 81) });
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 820, y: E.headAt(1100, 470), h: 1100, f: 0.35, pose: 'shrug', expr: lt > D * 0.4 ? 'happy' : 'amazed', look: [0.5, 0], rim: GOLD }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Noah breaks into a grin: "Dude. You\'re actually getting a FULL scholarship?" Faint thought windows linger, blurred, in the background — he ignores them.' });
  E.cut('s17b_yeah', E.st('s17_leo1') - 0.25, (ctx, lt, t, s) => { const D = E.D(s); const cam = E.push(lt, D, { z0: 1.05, z1: 1.08, focus: 1, ap: 14 }); const L = bgYard(t, { gold: 1 }); L.push({ d: 0.35, draw: (c) => faint(c, t, 82) }); L.push({ d: 1, draw: (c) => E.ch(c, 'leo', t, { x: 1100, y: E.headAt(1100, 470), h: 1100, f: -0.35, pose: 'pocket', expr: 'smile', look: [-0.4, 0.3], rim: GOLDL }) }); E.layers(ctx, cam, L); }, { type: 'CU', desc: 'Leo, shy smile: "Yeah."' });
  E.cut('s17c_insane', E.st('s17_leo2') - 0.35, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.5, z1: 1.56, x: 960, y: 620, focus: 1, ap: 7 });
    const L = yard(t, { gold: 1, treeX: 300 });
    L.push({ d: 0.5, draw: (c) => faint(c, t, 83) });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 860, y: 905, h: 330, f: 0.8, pose: lt < D * 0.5 ? 'shrug' : 'relaxed', expr: 'happy', rim: GOLD }); E.ch(c, 'leo', t, { x: 1080, y: 905, h: 335, f: -0.8, pose: lt > D * 0.5 ? 'shrug' : 'pocket', expr: lt > D * 0.5 ? 'laugh' : 'smile', rim: GOLDL }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Two-shot, now standing close: "That\'s insane! Why didn\'t you just tell me?" — Leo laughs: "I was TRYING to."' });
  E.cut('s17d_happy', E.st('s17_noah3') - 0.35, (ctx, lt, t, s) => { const D = E.D(s); const cam = E.push(lt, D, { z0: 1.06, z1: 1.1, focus: 1, ap: 14 }); const L = bgYard(t, { gold: 1 }); L.push({ d: 0.35, draw: (c) => faint(c, t, 84) }); L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 820, y: E.headAt(1100, 470), h: 1100, f: 0.35, pose: 'relaxed', expr: 'smile', look: [0.5, 0], rim: GOLD }) }); E.layers(ctx, cam, L); }, { type: 'CU', desc: 'Noah, sincere: "...I\'m happy for you, man."' });
  E.cut('s17e_thankgod', E.st('s17_leo_th') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.05, z1: 1.08, focus: 1, ap: 14 });
    const L = bgYard(t, { gold: 1 });
    L.push({ d: 1, draw: (c) => { E.ch(c, 'leo', t, { x: 1080, y: E.headAt(1100, 470), h: 1100, f: -0.35, pose: 'pocket', expr: lt > D * 0.4 ? 'laugh' : 'happy', look: [-0.5, 0], rim: GOLDL }); E.th(c, 's17_leo_th', t, { x: 560, y: 330, w: 280, h: 90, tail: [900, 380], size: 36, a: 0.35, post: 0.3 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Leo relaxes into a laugh; a tiny, faint thought ("Thank god.") appears small and soft — Noah doesn\'t react to it.' });
  E.cut('s17f_hug', E.M('hug') - 0.4, (ctx, lt, t, s) => {
    const D = E.D(s);
    const k = E.ease.io(E.clamp(lt / D));
    const cam = E.cam({ z: E.lerp(1.55, 0.82, k), x: E.lerp(960, 980, k), y: E.lerp(640, 570, k), focus: 0.9, ap: E.lerp(6, 3, k) });
    const L = yard(t, { gold: 1, treeX: 520 });
    L.push({ d: 0.9, draw: (c) => { const hug = E.seg(lt, 0.3, 1.0); E.ch(c, 'noah', t, { x: E.lerp(890, 935, hug), y: 905, h: 300, f: 0.8, pose: hug > 0.5 ? 'hug' : 'relaxed', expr: 'happy', rim: GOLD, talk: 0 }); E.ch(c, 'leo', t, { x: E.lerp(1090, 1035, hug), y: 905, h: 305, f: -0.8, pose: hug > 0.5 ? 'hug' : 'pocket', expr: 'happy', rim: GOLDL, talk: 0 }); } });
    L.push(E.dustL(t, { d: 0.95, n: 35 }));
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'A small, slightly awkward hug; the camera slowly pulls out to the wide courtyard composition from the start of Act 3.', post: { bloom: 0.45 } });

  // ===== SCENE 18 — sting =====
  E.cut('s18a_steps', E.M('S18'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.08, x: 700, y: 560, focus: 1, ap: 5 });
    const L = E.SET.entrance(t);
    L.push({ d: 0.95, draw: (c) => E.ch(c, 'noah', t, { x: E.lerp(380, 560, E.clamp(lt / D)), y: E.lerp(820, 890, E.clamp(lt / D)), h: 240, f: 0.8, pose: E.walkPose(lt * 1.4), expr: 'smile', rim: { dx: 5, color: '#ffc27a' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'WS', desc: 'School entrance in warm late-afternoon light: Noah walks down the steps ("one person he was too scared to ask about").' });
  E.cut('s18b_walkhome', E.st('s18_maya1') - 0.5, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.5, z1: 1.55, x: 760, y: 630, focus: 1, ap: 8 });
    const L = E.SET.entrance(t);
    L.push({ d: 1, draw: (c) => { E.ch(c, 'noah', t, { x: 840, y: 900, h: 300, f: E.lerp(0.8, -0.8, E.seg(lt, 0.2, 0.6)), pose: 'relaxed', expr: 'shock', rim: { dx: 5, color: '#ffc27a' } }); E.ch(c, 'maya', t, { x: E.lerp(300, 600, E.seg(lt, 0, 0.8, 'out')), y: 900, h: 290, f: 0.8, pose: lt < 0.8 ? E.walkPose(lt * 1.5) : 'bag', expr: 'smile', rim: { dx: 5, color: '#ffc27a' } }); } });
    E.layers(ctx, cam, L);
  }, { type: 'MS', desc: 'Maya enters from the left; Noah turns to her — "Hey. You want to walk home together?"' });
  E.cut('s18c_sayyes', E.st('s18_maya_th') - 0.2, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = E.SET.entrance(t); L[2].d = 0.35;
    L.push({ d: 1, draw: (c) => { E.ch(c, 'maya', t, { x: 760, y: E.headAt(1050, 470), h: 1050, f: 0.4, pose: 'bag', expr: 'smile', look: [0.5, 0], rim: { dx: 10, dy: -4, color: '#ffc27a' } }); E.th(c, 's18_maya_th', t, { x: 1080, y: 230, w: 240, h: 80, tail: [900, 300], size: 34, kind: 'pink', a: 0.6 }); } });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Maya, nervous smile; a small understated thought: "Please say yes."' });
  E.cut('s18d_yes', E.st('s18_noah1') - 0.4, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.push(lt, D, { z0: 1.0, z1: 1.05, focus: 1, ap: 14 });
    const L = E.SET.entrance(t); L[2].d = 0.35;
    L.push({ d: 1, draw: (c) => E.ch(c, 'noah', t, { x: 1100, y: E.headAt(1100, 470), h: 1100, f: -0.35, pose: 'pocket', expr: 'smile', look: [-0.5, 0], rim: { dx: 10, dy: -4, color: '#ffc27a' } }) });
    E.layers(ctx, cam, L);
  }, { type: 'CU', desc: 'Hold on Noah\'s genuine smile — he answers what she SAID: "Yeah. I\'d like that."' });
  E.cut('s18e_walkoff', E.M('walk_off') - 0.1, (ctx, lt, t, s) => {
    const D = E.D(s);
    const cam = E.cam({ z: E.lerp(1.1, 0.95, E.ease.sine(E.clamp(lt / D))), x: 1100, y: 560, focus: 0.9, ap: 4 });
    const L = E.SET.entrance(t);
    L.push({ d: 0.9, draw: (c) => { E.ch(c, 'noah', t, { x: 900 + lt * 95, y: 905, h: 230, f: 0.8, pose: E.walkPose(lt * 1.3), expr: 'happy', rim: { dx: 5, color: '#ffc27a' }, talk: 0 }); E.ch(c, 'maya', t, { x: 820 + lt * 95, y: 905, h: 220, f: 0.8, pose: E.walkPose(lt * 1.3 + 0.5), expr: 'happy', rim: { dx: 5, color: '#ffc27a' }, talk: 0 }); } });
    L.push(E.dustL(t, { d: 0.95, n: 35 }));
    E.layers(ctx, cam, L);
  }, { type: 'EWS', desc: 'Wide sunset street: Noah and Maya walk off together.', post: { bloom: 0.5 } });
  // END CARD
  E.cut('s19_endcard', E.M('END'), (ctx, lt, t, s) => {
    const D = E.D(s);
    const g = ctx.createRadialGradient(960, 900, 50, 960, 700, 1100); g.addColorStop(0, '#5a2a3a'); g.addColorStop(1, '#1a0c18'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    E.textGlow(ctx, 'What would YOU do if you could', 960, 250, { font: 'italic 800 60px Nunito', a: E.seg(lt, 0.2, 0.8) });
    E.textGlow(ctx, "hear everyone's thoughts?", 960, 330, { font: 'italic 900 70px Nunito', color: '#ffd166', a: E.seg(lt, 0.5, 1.1) });
    const cast = ['noah', 'leo', 'maya', 'teacher', 'barista', 'biz', 'woman', 'man'];
    cast.forEach((k, i) => { const a = E.seg(lt, 0.8 + i * 0.12, 1.2 + i * 0.12); E.char(ctx, { x: 470 + i * 140, y: 900 + (1 - a) * 40, h: 240, f: 0, costume: k, pose: k === 'noah' ? 'wave' : 'stand', expr: 'smile', t, seed: i, alpha: a, rim: { dx: 0, dy: -4, color: '#ffc98a' } }); });
    E.pool(ctx, 960, 910, 700, 60, '#ffb070', 0.25);
  }, { type: 'END', desc: 'End card: "What would YOU do if you could hear everyone\'s thoughts?" with the cast line-up.' });
})();
