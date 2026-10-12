// ACT II — experiments: piano, football, languages, coding; status reversal; obsession montage.   (V2)

function musicRoom(c, o = {}) {
  const e = ENV.musicroom({ t: c.T });
  const mid = PR.piano(760, 860, 1.25, { sheet: true }) + PR.stool(1080, 860, 1.2) + A(c, { who: 'eli', x: 1080, y: 740, h: 360, f: -1, pose: o.pose || P.sitPiano(c.T, o.int ?? 1), expr: o.expr || 'busy', light: LT.warmL });
  return { e, mid };
}

addBeat({ id: 'B12', lines: ['L022', { id: 'L023', gap: .3 }], pre: .2, post: .4, music: { name: 'montage_upbeat', vol: .35, at: 1.2, fade: 1 }, shots: [
  { id: 'S029', type: 'MS', desc: 'Dawn bedroom: Eli springs up from the desk with an eager grin and cracks his knuckles.', w: 1, sfx: [[.4, 'whoosh', .3]],
    draw: c => { const e = ENV.bedroom({ t: c.T, dawn: true }); const k = atE(c, 0, .8, 'outBack'); return scene(c, { back: e.back, bb: 7, mid: A(c, { who: 'eli', x: 900, y: lerp(1000, 960, k), h: 560, f: 1, pose: mixPose(P.sit(), P.crossArms(), k), expr: 'happy', light: LT.lampR }) + (k < .5 ? PR.chair(900, 1100, -1, 1.6) : ''), cam: CAM.drift(960, 600, 1.05, .04, 30)(c.p) }); } },
  { id: 'S030', type: 'EST', desc: 'Music room wide at sunset: upright piano waiting; label EXPERIMENT 1 · PIANO.', w: 1,
    draw: c => { const r = musicRoom(c, { pose: P.sit(), expr: 'happy' }); return scene(c, { back: r.e.back, bb: 2, mid: r.mid, cam: CAM.move([760, 560, 1.15], [880, 600, 1.0])(c.p), overlay: label(960, 200, 'EXPERIMENT 1 · PIANO', { size: 52, k: appear(c.t, .4), fill: PAL.gold }) }); } },
  { id: 'S031', type: 'MS', on: 'L023', desc: 'Eli at the piano, cocky: "Okay. How hard can this be?"', w: 1,
    draw: c => { const r = musicRoom(c, { pose: P.sit(), expr: 'smug' }); return scene(c, { back: r.e.back, bb: 6, mid: r.mid, cam: CAM.drift(1000, 560, 1.7, .04)(c.p) }); } },
] });
addBeat({ id: 'B13', minShot: 1.5, lines: [{ id: 'L024', gap: .6 }, 'L025'], pre: 1.4, post: 3.4, shots: [
  { id: 'S032', type: 'TOP', desc: 'Overhead hands: wrong keys flash red, discordant notes, camera jolts on each clunker.', w: 1, sfx: [[.05, 'piano_bad_notes', .9]],
    draw: c => { const pressed = {}; const n = Math.floor(c.t * 5); pressed[(n * 7) % 21] = 1; pressed[100 + (n * 5) % 20] = 1; const mid = S.rect(-200, -200, 2400, 1500, '#1a0f14') + PR.keysTop(160, 330, 1600, 21, pressed, { hit: '#ff6a5a' }) + bigHand(560 + 300 * hash(n), 560, 1.4, -90, PAL.eli, { curl: true }) + bigHand(1100 + 300 * hash(n + 3), 560, 1.4, -90, PAL.eli); return scene(c, { mid, vignette: .72, grade: INSERT_GRADE, cam: CAM.drift(960, 540, 1.08, .03)(c.p), shake: n % 2 ? 3 : 0 }); } },
  { id: 'S033', type: 'CU', on: 'L024', desc: 'Eli wincing close-up as the narrator deadpans "Pretty hard, apparently."', w: 1,
    draw: c => { const r = musicRoom(c); return scene(c, { back: r.e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [1180, 450], h: 1150, f: -1, pose: P.sit(), expr: 'worried', light: LT.warmL }), cam: CAM.drift(1100, 540, 1, .03)(c.p) }); } },
  { id: 'S034', type: 'WS-timelapse', on: 'L025', desc: 'Time-lapse: sunlight slides across the room, the clock spins one hour, Eli practises with less and less fumbling; PRACTICE bar fills to 60 MIN.', w: 1.2, sfx: [[0, 'clock_tick_fast', .35]],
    draw: c => { const r = musicRoom(c, { int: 1 + 2 * (1 - c.p), expr: c.p > .7 ? 'happy' : 'busy' }); return scene(c, { back: r.e.back + PR.clock(1250, 320, 60, 4 + c.p), bb: 2, mid: r.mid, cam: CAM.drift(900, 600, 1.08, .04, 30)(c.p), grade: { tint: mixc('#ffcf8a', '#8a5f8a', c.p), op: .2 }, overlay: practiceBar(c.p, `PRACTICE  ${Math.floor(c.p * 60)} MIN`) }); } },
  { id: 'S035', type: 'TOP-dolly', at: -4.4, desc: 'Music moment (no VO): slow lateral dolly along the keyboard as Eli plays the full melody; correct keys glow gold and release floating note shapes.', w: 1, sfx: [[0, 'piano_melody_good', .95]],
    draw: c => {
      const mel = [0, 4, 7, 4, 2, 5, 9, 5, 0, 4, 7, 11];
      const pressed = {}; const n = Math.floor(c.t * 3.2); pressed[mel[n % mel.length] + 6] = 1;
      let notes = ''; for (let i = 0; i < 14; i++) { const tt = c.t - i * .31; if (tt < 0) continue; const x = -100 + (mel[i % mel.length] + 6) * 76, y = 320 - tt * 140; notes += S.g({ opacity: clamp(1 - tt / 2.2) }, S.circle(x, y, 18, PAL.gold), S.line(x + 16, y, x + 16, y - 60, PAL.gold, 6)) + glow(x, y, 50, PAL.gold, .3); }
      const hx = -100 + (mel[n % mel.length] + 6) * 76;
      const mid = S.rect(-400, -200, 2800, 1500, '#1a0f14') + PR.keysTop(-100, 380, 2200, 29, pressed, { hit: PAL.gold }) + notes + bigHand(hx, 620, 1.4, -90, PAL.eli, { curl: true });
      return scene(c, { mid, vignette: .72, grade: INSERT_GRADE, cam: { x: lerp(700, 1150, c.p), y: 520, z: 1.05 } });
    } },
] });

// ---------- football ----------
function fieldScene(c, o = {}) { return ENV.field({ t: c.T, sunX: o.sunX }); }
const repPose = ph => poseAt(ph, [[0, P.stand()], [.12, P.kickWind()], [.22, P.kick(), 'out'], [.5, P.stand(), 'inOut']]);
addBeat({ id: 'B14', lines: ['L026', { id: 'L027', gap: .3 }], pre: .2, post: .3, shots: [
  { id: 'S036', type: 'WS', tin: 'whip', desc: 'Field at sunset: Eli tries to trap the ball; it bounces off his shin and rolls away. He facepalms.', w: 1, sfx: [[0, 'whoosh', .4], [.95, 'ball_bounce', .7]],
    draw: c => {
      const e = fieldScene(c); const k = c.t;
      const bx = k < 1 ? 1300 - k * 380 : 920 + (k - 1) * 520, by = k < 1 ? 700 + Math.abs(Math.sin(k * 6)) * -180 + k * 160 : 862 - Math.abs(Math.sin(k * 8)) * 40 * Math.max(0, 1.8 - k);
      const pose = poseAt(k, [[0, P.reach()], [.95, P.reach()], [1.15, P.kickWind(), 'out'], [1.5, P.facepalm(), 'outBack']]);
      return scene(c, { back: e.back, bb: 3, mid: A(c, { who: 'eli', x: 860, y: 880, h: 300, f: 1, pose, expr: k < 1.1 ? 'focused' : 'unimpressed', light: LT.hotR }) + PR.ball(bx, by, 18, k * 500), cam: CAM.drift(980, 660, 1.2, .03, 25)(c.p), overlay: label(960, 200, 'EXPERIMENT 2 · FOOTBALL', { size: 52, k: appear(c.t, .2, 1.6), fill: PAL.gold }) });
    } },
  { id: 'S037', type: 'LOW', on: 'L027', desc: 'Extreme low angle beside the ball: Eli taps it up again and again; dotted trajectory lines get tighter and tidier each rep; REP counter climbs.', w: 1.1, sfx: [[.2, 'ball_kick', .5], [.8, 'ball_kick', .5], [1.4, 'ball_kick', .5], [2.0, 'ball_kick', .5], [2.6, 'ball_kick', .5]],
    draw: c => {
      const e = fieldScene(c); const rep = Math.floor(c.t / .6), ph = (c.t % .6) / .6, mess = Math.max(.1, 1 - rep * .25);
      let traj = ''; for (let i = 0; i <= rep && i < 6; i++) { const m = Math.max(.1, 1 - i * .25); traj += S.path(`M${980},${860} Q${980 + 160 * m * (i % 2 ? 1 : -1)},${520 - 60 * m} ${980 + 30 * m},${860}`, 'none', { stroke: PAL.gold, 'stroke-width': 4, 'stroke-dasharray': '10 10', opacity: i === rep ? .9 : .25 }); }
      const by = 860 - Math.sin(ph * Math.PI) * 340, bx = 980 + Math.sin(ph * Math.PI) * 160 * mess * (rep % 2 ? 1 : -1);
      return scene(c, { back: e.back, bb: 6, mid: traj + A(c, { who: 'eli', x: 760, y: 1120, h: 620, f: 1, pose: repPose(ph), expr: 'focused', light: LT.hotR }) + PR.ball(bx, by, 34, c.t * 400), cam: CAM.drift(960, 640, 1.05, .04, 30)(c.p), overlay: label(1650, 180, `REP ${rep * 7 + 1}`, { size: 54, k: 1, fill: PAL.gold }) });
    } },
  { id: 'S038', type: 'WS', tin: 'flash', desc: 'Wide: a clean skill move — Eli flicks the ball up and volleys it into the goal; the net bulges; he celebrates.', w: 1, sfx: [[.6, 'ball_kick', .9], [1.0, 'whoosh', .4]],
    draw: c => {
      const e = fieldScene(c); const k = c.t;
      const bx = k < .6 ? 760 : lerp(780, 1560, E.out(seg(k, .6, 1.1))), by = k < .6 ? 860 - Math.sin(k / .6 * Math.PI) * 120 : lerp(800, 740, seg(k, .6, 1.1));
      const pose = poseAt(k, [[0, P.stand()], [.45, P.kickWind(), 'out'], [.6, P.kick(), 'out'], [.9, P.kick()], [1.15, P.cheerBounce(c.T), 'outBack']]);
      const net = k > 1.1 ? Math.sin((k - 1.1) * 20) * Math.exp(-(k - 1.1) * 4) * 18 : 0;
      return scene(c, { back: e.back, bb: 2, mid: S.g({ transform: `translate(${net},0)` }, PR.goal(1580, 860, 420, 200)) + A(c, { who: 'eli', x: 700, y: 880, h: 280, f: 1, pose, expr: k > 1 ? 'happy' : 'determined', light: LT.hotR }) + (k > .6 && k < 1.1 ? ghosts(dt => PR.ball(lerp(780, 1560, E.out(seg(k + dt, .6, 1.1))), by, 18, 0), 3, .04) : '') + PR.ball(bx, by, 18, k * 700), cam: CAM.drift(1100, 640, 1.08, .03, 30)(c.p) });
    } },
] });
addBeat({ id: 'B15', lines: ['L028', { id: 'L029', gap: .2 }], pre: .2, post: .5, shots: [
  { id: 'S039', type: 'MS', desc: 'Noah arrives at the touchline, jaw on the floor: "Bro, since WHEN could you do that?!"', w: 1, sfx: [[0, 'ball_bounce', .4]],
    draw: c => { const e = fieldScene(c); return scene(c, { back: e.back, bb: 8, mid: A(c, { who: 'noah', x: 1150, y: 1120, h: 700, f: -1, pose: poseAt(c.t, [[0, P.stand()], [.3, P.panic(), 'outBack']]), expr: 'shock', light: LT.hotR }), fg: PR.ball(500, 1000, 90, c.t * 50), fb: 16, cam: CAM.drift(1050, 560, 1.0, .03)(c.p) }); } },
  { id: 'S040', type: 'MS', on: 'L029', desc: 'Eli, juggling, shrugs, equally amazed: "I don\'t know!"', w: 1,
    draw: c => { const e = fieldScene(c); const ph = (c.t * 1.6) % 1; return scene(c, { back: e.back, bb: 8, mid: A(c, { who: 'eli', x: 760, y: 1120, h: 700, f: 1, pose: P.shrug(), expr: 'happy', light: LT.hotR }) + PR.ball(900, 1000 - Math.sin(ph * Math.PI) * 250, 40, c.t * 300), cam: CAM.drift(820, 560, 1.0, .03)(c.p) }); } },
] });

// ---------- languages + coding cascade ----------
addBeat({ id: 'B16', lines: ['L030', { id: 'L031', gap: .3 }], pre: .2, post: .4, shots: [
  { id: 'S041', type: 'TOP', desc: 'Flashcard HOLA flips to こんにちは, flips again; the practice timeline at the bottom keeps filling.', w: 1.1, sfx: [[.4, 'paper_flip', .6], [1.4, 'paper_flip', .6]],
    draw: c => {
      const e = ENV.bedroom({ t: c.T });
      const f1 = atE(c, .3, .8), f2 = atE(c, 1.3, 1.8);
      const card = c.t < 1.3 ? PR.flashcard(960, 520, 2.2, 'HOLA', 'こんにちは', f1, { font: 'Lilita One, IPAGothic' }) : PR.flashcard(960, 520, 2.2, 'こんにちは', 'ARIGATŌ', f2, { band: '#3b7bd2', font: 'IPAGothic' });
      return scene(c, { back: e.back, bb: 14, mid: card, cam: { x: 960, y: 540, z: 1.0 + .04 * c.p, r: lerp(-3, 2, c.p) }, overlay: labelsIn(c, [[960, 180, 'EXPERIMENT 3 · LANGUAGES', .1, null, { size: 48, fill: PAL.gold }]]) + practiceBar(.2 + .2 * c.p, 'PRACTICE: WEEK 1') });
    } },
  { id: 'S042', type: 'TOP', desc: 'The flashcard slides into a laptop screen: code types, an ERROR appears, gets fixed, BUILD OK.', w: 1.2, sfx: [[0, 'keyboard_typing', .6], [1.6, 'success_chime', .6]],
    draw: c => { const e = ENV.bedroom({ t: c.T }); const p = at(c, 0, 1.6); return scene(c, { back: e.back, bb: 12, mid: PR.laptop(960, 760, 2.3, codeScreen(p, 296, 186, { error: c.t > 1 && c.t < 1.5, ok: c.t > 1.6 })), cam: CAM.push(960, 520, 1.0, 1.12)(c.p), overlay: practiceBar(.4 + .2 * c.p, 'PRACTICE: WEEK 2') }); } },
  { id: 'S043', type: 'WS', on: 'L031', desc: 'The coded animation (a little bouncing gold ball) hops out of the screen into the real bedroom.', w: 1,
    draw: c => {
      const r = bedroomDesk(c, { pose: P.sitType(c.T), expr: 'happy', dawn: false });
      const k = at(c, .2, c.d), bx = lerp(1000, 1500, k), by = 560 - Math.abs(Math.sin(k * 9)) * 160 * (1 - k * .5) + k * 200;
      return scene(c, { back: r.e.back, bb: 3, mid: r.mid + PR.laptop(1000, 590, .55, codeScreen(1, 296, 186, { ok: true })) + S.circle(bx, by, 20, PAL.gold) + glow(bx, by, 60, PAL.gold, .5), cam: CAM.drift(1050, 560, 1.4, .04, 30)(c.p), overlay: practiceBar(.6 + .2 * c.p, 'PRACTICE: WEEK 3') });
    } },
  { id: 'S043b', type: 'CU', desc: 'Eli close-up, delighted, eyes following the bouncing ball.', w: .8,
    draw: c => { const r = bedroomDesk(c, { dawn: false }); const bx = lerp(1300, 1700, c.p); return scene(c, { back: r.e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [760, 450], h: 1100, f: 1, pose: P.sit(), expr: 'happy', lookX: 1, lookY: Math.sin(c.t * 9) * .5, light: LT.lampR }) + S.circle(bx, 600 - Math.abs(Math.sin(c.t * 9)) * 200, 30, PAL.gold) + glow(bx, 600 - Math.abs(Math.sin(c.t * 9)) * 200, 90, PAL.gold, .5), cam: CAM.drift(860, 520, 1, .03)(c.p), overlay: practiceBar(.8 + .2 * c.p, 'PRACTICE: WEEK 4') }); } },
] });
addBeat({ id: 'B17', lines: ['L032'], pre: .2, post: .5, music: { name: 'duck', vol: .2, at: 0 }, shots: [
  { id: 'S044', type: 'MS', desc: 'Limits #1: Eli asleep with his head on his open textbook at 2:00 AM, lamp still on — he still needs sleep.', w: 1, sfx: [[0, 'night_room_tone', .8]],
    draw: c => { const r = bedroomDesk(c, { pose: { ...P.sitSlump(), lean: 48, headDrop: 14 }, expr: 'sad', dawn: false }); return scene(c, { back: r.e.back + PR.clock(1180, 420, 40, 2), bb: 5, mid: r.mid + S.text(1010, 500 - (c.t * 20 % 40), 'z', { 'font-family': 'Lilita One', 'font-size': 50, fill: PAL.cream, opacity: .7 }), cam: CAM.drift(960, 580, 1.5, .03)(c.p), overlay: label(960, 200, 'STILL NEEDS SLEEP', { size: 48, k: appear(c.t, .3), fill: PAL.cream }) }); } },
  { id: 'S045', type: 'WS', desc: 'Limits #2: on the field Eli dribbles neatly, but a bigger kid simply out-sprints him to the ball. Labels SKILL ✓ / SPEED · STRENGTH ✗.', w: 1.2, sfx: [[.3, 'ball_kick', .5], [1.2, 'whoosh', .4]],
    draw: c => {
      const e = fieldScene(c); const k = c.t;
      const ex = 700 + k * 110, bx = 1000 + k * 170, ox = 300 + k * 480;
      return scene(c, { back: e.back, bb: 3, mid: A(c, { who: 'eli', x: ex, y: 880, h: 280, f: 1, pose: P.run(runPh(ex, 280)), expr: 'determined', light: LT.hotR }) + A(c, { who: 'extra', x: ox, y: 890, h: 360, f: 1, pose: P.run(runPh(ox, 360)), expr: 'smug', light: LT.hotR }) + PR.ball(bx, 862, 18, k * 600), cam: CAM.drift(1000, 640, 1.1, .03, 30)(c.p), overlay: label(560, 200, 'SKILL  ✓', { size: 52, k: appear(c.t, .3), fill: PAL.green }) + label(1360, 200, 'SPEED · STRENGTH  ✗', { size: 52, k: appear(c.t, 1.1), fill: PAL.red }) });
    } },
] });

// ---------- success / status reversal ----------
addBeat({ id: 'B18', lines: ['L033', { id: 'L034', gap: .3 }], pre: .2, post: .5, music: { name: 'montage_upbeat', vol: .35, at: 0 }, shots: [
  { id: 'S046', type: 'WS-repeat', desc: 'SAME classroom angle as S008 (deliberate repeat). MATH on the board now; teacher asks; Eli raises his hand confidently.', w: 1.1,
    draw: c => { const r = classroomWide(c, { board: 'MATH', tPose: P.point(), tExpr: 'neutral', ePose: mixPose(P.sit(), P.raiseHand(), atE(c, .4, .8, 'outBack')), eExpr: 'happy' }); return scene(c, { back: e2(r), bb: 2, mid: r.mid, cam: CAM.drift(960, 600, 1.02, .02)(c.p) }); } },
  { id: 'S047', type: 'TOP-match', tin: 'flash', desc: 'Match cut: the old F test is swept aside by a new test stamped A+.', w: 1, sfx: [[.3, 'paper_flip', .7], [.7, 'success_chime', .5]],
    draw: c => { const k = atE(c, .2, .7); const mid = S.rect(-200, -200, 2400, 1500, '#3a2630') + glow(900, 500, 800, PAL.lamp, .25) + PR.testPaper(960 - k * 1300, 560, 1.5, { grade: 'F', r: 4 - k * 20 }) + PR.testPaper(960 + (1 - k) * 1300, 560, 1.5, { grade: 'A+', r: -3, marks: [1, 1, 1, 1, 1, 1, 1], gradeK: E.outBack(seg(c.t, .7, 1)) }); return scene(c, { mid, vignette: .72, grade: INSERT_GRADE, cam: CAM.drift(960, 540, 1.02, .04)(c.p) }); } },
  { id: 'S048', type: 'CU', on: 'L034', desc: 'Teacher close-up: her glasses slide down her face in genuine surprise.', w: .9, sfx: [[0, 'impressed_murmur', .6]],
    draw: c => {
      const e = ENV.classroom({ t: c.T, board: 'MATH' });
      const slide = atE(c, .2, .6, 'outBack') * 25;
      const ch1 = actor(c, { who: 'teacher', headAt: [1180, 470], h: 1200, f: -1, pose: P.stand(), expr: 'shock', light: LT.warmL, noGlasses: true });
      // glasses drawn as a separate sliding layer over the shocked eyes
      const R = ch1.headR, gx = ch1.head[0] - .45 * .4 * R, gy = ch1.head[1] - .06 * R + slide, sp = .25 * R * (1 - .45 * .45);
      const glasses = S.g({}, S.circle(gx - sp, gy, .19 * R, 'none', { stroke: '#e9e4dc', 'stroke-width': 12 }), S.circle(gx + sp, gy, .19 * R, 'none', { stroke: '#e9e4dc', 'stroke-width': 12 }), S.line(gx - sp + .19 * R, gy, gx + sp - .19 * R, gy, '#e9e4dc', 10));
      return scene(c, { back: e.back, bb: 12, mid: ch1.svg + glasses, cam: CAM.push(1100, 520, 1, 1.07)(c.p) });
    } },
  { id: 'S049', type: 'WS', desc: 'Students crowd around Eli\'s desk holding out notebooks and questions.', w: 1, sfx: [[0, 'impressed_murmur', .5]],
    draw: c => {
      const e = ENV.classroom({ t: c.T, board: 'MATH' }); let mid = PR.chair(960, 1000, 1, 1) + A(c, { who: 'eli', x: 960, y: 940, h: 300, f: 1, pose: P.sit(), expr: 'happy', light: LT.warmL }) + PR.desk(1100, 1020, 220);
      [[620, 1], [760, 1], [1300, -1], [1460, -1], [1180, -1]].forEach(([x, f], i) => { const k = atE(c, i * .15, .6 + i * .15, 'out'); const xx = lerp(x + f * -500, x, k); mid += A(c, { who: i === 4 ? 'student' : 'extra', x: xx, y: 940, h: 300, f, pose: k < 1 ? P.walk(walkPh(xx, 300)) : P.hold(), expr: 'happy', light: LT.warmL, holdSvg: PR.book(0, 0, 70, 50, ['#3a5a8a', '#7a3b48', '#5a7a3a', '#8a6a3a', '#3a3a5a'][i]) }); });
      return scene(c, { back: e.back, bb: 4, mid, cam: CAM.push(960, 700, 1.05, 1.15)(c.p) });
    } },
] });
function hallProp(kind, x, y) {
  if (kind === 'guitar') return S.g({ transform: `translate(${x},${y}) rotate(-15)` }, S.ellipse(0, 40, 50, 60, '#a8642e'), S.ellipse(0, -20, 38, 44, '#a8642e'), S.circle(0, 20, 14, '#2a1a10'), S.rect(-6, -180, 12, 160, '#3a2618'));
  if (kind === 'chess') return S.g({ transform: `translate(${x},${y})` }, S.rect(-70, -90, 140, 180, '#efe3cf'), S.text(0, -50, 'CHESS', { 'font-family': 'Oswald', 'font-size': 30, fill: '#3a302a', 'text-anchor': 'middle' }), S.text(0, -15, 'CLUB', { 'font-family': 'Oswald', 'font-size': 30, fill: '#3a302a', 'text-anchor': 'middle' }), PR.chessboard(0, 45, .35));
  return S.g({ transform: `translate(${x},${y})` }, S.rect(-60, -80, 120, 160, '#2a3a5a'), S.circle(0, -10, 40, 'none', { stroke: '#f08a2a', 'stroke-width': 8 }), S.text(0, 66, 'HOOPS', { 'font-family': 'Oswald', 'font-size': 24, fill: '#f08a2a', 'text-anchor': 'middle' }));
}
addBeat({ id: 'B19', lines: ['L035', { id: 'L036', gap: .3 }, { id: 'L037', gap: .2 }], pre: .2, post: .6, shots: [
  { id: 'S050', type: 'WS', desc: 'Hallway: friends point at things on the lockers — a guitar, a chess-club flyer, a basketball poster; Eli grins eagerly at each one.', w: 1,
    draw: c => {
      const e = ENV.hallway({ t: c.T });
      const props = hallProp('guitar', 520, 640) + hallProp('chess', 1380, 560) + hallProp('hoops', 1580, 700);
      return scene(c, { back: e.back + props, bb: 3, mid: A(c, { who: 'eli', x: 860, y: 1000, h: 520, f: 1, pose: P.stand(), expr: 'happy', lookX: c.t < 1.2 ? -1 : 1, light: LT.top }) + A(c, { who: 'extra', x: 1180, y: 1000, h: 500, f: 1, pose: P.point(), expr: 'smug', light: LT.top }), cam: CAM.drift(980, 640, 1.0, .04, 30)(c.p), overlay: labelsIn(c, [[520, 820, 'GUITAR?', .3, null, { size: 42 }], [1380, 700, 'CHESS?', .9, null, { size: 42 }], [1580, 830, 'BASKETBALL?', 1.5, null, { size: 42, fill: PAL.gold }]]) });
    } },
  { id: 'S051', type: 'MS-2', on: 'L036', desc: 'Classroom: Eli seated at his desk (left, looking up); a cocky student in a green cap stands behind the desk and slaps a scrambled Rubik\'s cube down: "Bet you can\'t solve this."', w: 1, sfx: [[.2, 'tool_place', 1.4]],
    draw: c => { const e = ENV.classroom({ t: c.T }); const k = atE(c, 0, .3, 'out'); return scene(c, { back: e.back, bb: 9, mid: A(c, { who: 'student', x: 1250, y: 1000, h: 640, f: -1, pose: mixPose(P.hold(), P.point(), k), expr: 'smug', light: LT.warmL }) + PR.chair(620, 1180, 1, 1.6) + A(c, { who: 'eli', x: 600, y: 1080, h: 600, f: 1, pose: P.sit(), expr: 'neutral', lookX: 1, lookY: -.6, light: LT.warmL }) + PR.desk(950, 1180, 760, { h: 150 }) + PR.cube(980, lerp(900, 980, k), 1.2, 0), cam: CAM.drift(960, 600, 1.0, .03)(c.p), shake: c.t > .28 && c.t < .4 ? 4 : 0 }); } },
  { id: 'S052', type: 'CU', on: 'L037', desc: 'Eli close-up, sly confident smile: "Give me ten minutes."', w: 1,
    draw: c => { const e = ENV.classroom({ t: c.T }); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [740, 450], h: 1150, f: 1, pose: P.sit(), expr: 'smug', light: LT.warmL }), fg: PR.cube(1500, 900, 2.5, c.t), fb: 10, cam: CAM.push(800, 520, 1, 1.06)(c.p) }); } },
] });
// obsession montage — locked front composition; objects swap with smears; crowd thins; light cools
addBeat({ id: 'B20', lines: ['L038'], pre: .4, post: .4, music: { name: 'obsession_cool', vol: .4, at: 0, fade: 1.5 }, shots: [
  { id: 'S053', type: 'MS-locked', desc: 'Obsession montage A: Eli centred, front-on; a puzzle cube then a chessboard swap in front of him; friends behind him lose patience and walk away; light shifts warm → cool.', w: 1, sfx: [[.1, 'whoosh', .3], [1.4, 'whoosh', .3]],
    draw: c => obsession(c, 0) },
  { id: 'S054', type: 'MS-locked', desc: 'Obsession montage B: same framing; a book then a circuit diagram; the background is now empty; cool blue light.', w: 1, sfx: [[.1, 'whoosh', .3], [1.4, 'whoosh', .3]],
    draw: c => obsession(c, 1) },
  { id: 'S054b', type: 'CU', dur: 2.6, desc: 'Alone in the cold light: Eli\'s phone lights up on the desk — "Noah: hey, wanna hang out?" — and he flips it face-down without looking.', sfx: [[.3, 'ui_pop', .5]],
    draw: c => {
      const e = ENV.classroom({ t: c.T });
      const flip = atE(c, 1.6, 2.0);
      const phone = S.g({ transform: `translate(1180,860) scale(${2.2},${2.2 * (1 - 2 * Math.min(.5, flip))})` }, S.rect(-30, -55, 60, 110, '#1b1820', { rx: 10 }), flip < .5 ? S.rect(-25, -48, 50, 92, '#3a5a9a', { rx: 4 }) : '');
      const bubble = flip < .4 ? S.g({ opacity: appear(c.t, .3) }, S.rect(1260, 640, 420, 110, '#efe3cf', { rx: 18 }), S.text(1290, 690, 'NOAH', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 26, fill: '#3b7bd2' }), S.text(1290, 730, 'hey, wanna hang out?', { 'font-family': 'Inter', 'font-weight': 600, 'font-size': 30, fill: '#2a2420' })) : '';
      return scene(c, { back: e.back, bb: 14, mid: A(c, { who: 'eli', headAt: [700, 470], h: 1000, f: 1, pose: P.hold(), expr: 'busy', lookY: 1, light: LT.coolL }) + PR.desk(1000, 1300, 1600, { h: 300 }) + phone + bubble, cam: CAM.drift(900, 540, 1, .03)(c.p), grade: { tint: '#4a6aff', op: .35 } });
    } },
] });
function obsession(c, part) {
  const k = clamp((part + c.p) / 2); // 0..1 across both shots
  const e = ENV.classroom({ t: c.T });
  let back = e.back;
  const crowd = [[500, 1], [700, 1], [1250, -1], [1450, -1], [1600, -1]];
  crowd.forEach(([x, f], i) => { const leave = clamp((k - i * .17) * 3); if (leave < 1) { const xx = x + (x < 960 ? -1 : 1) * leave * 700; back += A(c, { who: 'extra', x: xx, y: 900, h: 330, f: leave > 0 ? (x < 960 ? -1 : 1) : f, pose: leave > 0 ? P.walk(walkPh(Math.abs(xx - x), 330)) : P.crossArms(), expr: leave > 0 ? 'unimpressed' : 'neutral', light: LT.warmL }); } });
  const objs = [() => PR.cube(960, 920, 1.6, c.T), () => PR.chessboard(960, 920, 1.5), () => PR.openBook(960, 1000, 520), () => PR.circuitDiagram(960, 920, .9, {})];
  const q = k * 4, idx = Math.min(3, Math.floor(q)), f = q - idx;
  const sIn = idx > 0 ? E.outBack(clamp(f / .12)) : 1, sOut = idx < 3 && f > .9 ? 1 - (f - .9) / .1 * .4 : 1;
  const obj = S.g({ transform: `translate(960,920) scale(${Math.min(sIn, sOut)}) translate(-960,-920)` }, objs[idx]());
  const workPose = [{ ...P.hold(), fa: [62 + 8 * Math.sin(c.T * 12), 60], ba: [56 - 8 * Math.sin(c.T * 12), 62] }, { ...P.hold(), fa: [80, 20] }, { ...P.hold(), fa: [60 + 10 * Math.sin(c.T * 3), 70] }, { ...P.hold(), lean: 12 }][idx];
  const mid = A(c, { who: 'eli', x: 960, y: 1100, h: 600, front: true, pose: workPose, expr: 'busy', light: { dx: 0, dy: -1, color: mixc(PAL.rimHot, PAL.rimCool, k) }, lookY: 1 }) + PR.desk(960, 1250, 900, { h: 200 }) + obj;
  return scene(c, { back, bb: 5, mid, cam: { x: 960, y: 620, z: 1.0 + .03 * c.p }, grade: { tint: mixc('#ffb070', '#4a6aff', k), op: .35 } });
}
