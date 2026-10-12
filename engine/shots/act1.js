// ACT I — hook, ordinary Eli, discovery, proof of the rule.   (V2: auditor fixes applied)

const INSERT_GRADE = { tint: '#ffb070', op: .15 };
// shared framing for the "bewildered" callback (S026 ⇄ S108)
const BEWILDERED_FRAME = { headAt: [800, 430], h: 1200 };

// ---------- B01 HOOK: split-screen 10 hours vs 1 hour → same result ----------
function hookHalf(c, who, k, isLeft) {
  const music = ENV.musicroom({ t: c.T });
  const player = A(c, { who, x: 1060, y: 650, h: 330, f: -1, pose: P.sitPiano(c.T, isLeft ? 2.2 - k * 1.8 : 1), expr: k > .85 ? 'happy' : isLeft ? 'worried' : 'happy', light: LT.warmL });
  const prop = isLeft ? PR.calendar(560, 330, Math.min(10, 1 + Math.floor(k * 9.99)), .8, k < 1 ? (k * 9.99) % 1 : 0) : PR.clock(560, 330, 95, 3 + Math.min(1, k));
  let notes = '';
  if (k > .85) for (let i = 0; i < 4; i++) { const tt = (c.t * 1.2 + i * .25) % 1; notes += S.g({ opacity: 1 - tt }, S.circle(820 + i * 30, 520 - tt * 180, 14, PAL.gold), S.line(833 + i * 30, 520 - tt * 180, 833 + i * 30, 470 - tt * 180, PAL.gold, 5)); }
  return music.back + PR.piano(820, 800, 1.1) + player + PR.stool(1060, 800, 1.1) + prop + notes;
}
addBeat({ id: 'B01', lines: ['L001'], pre: .5, post: .4, music: { name: 'curious_open', vol: .55, fade: 1.5 }, shots: [
  { id: 'S001', type: 'GFX-split', desc: 'Split screen: left an ordinary kid practises piano while a calendar flips DAY 1→10; right Eli practises while a clock advances only 1 hour. Both reach the SAME result together (gold notes) and a big "=" appears.', w: 1.6,
    sfx: [[0, 'piano_bad_notes', .45], [0, 'clock_tick_loop', .5], [2.6, 'piano_clean_chord', .7], [2.6, 'ui_pop', .6]],
    draw: c => {
      const k = atE(c, .2, 2.6, 'inOut');
      const left = hookHalf(c, 'extra', k, true), right = hookHalf(c, 'eli', k, false);
      const mid = S.rect(0, 0, W, H, '#0b0709') + panel(0, 60, 945, 960, left, { s: 1.35, cx: 900, cy: 560 }) + panel(975, 60, 945, 960, right, { s: 1.35, cx: 900, cy: 560 });
      const eq = atE(c, 2.6, 3.0, 'outBack');
      const ov = label(472, 920, '10 HOURS OF PRACTICE', { size: 52, k: appear(c.t, .4) }) + label(1447, 920, '1 HOUR OF PRACTICE', { size: 52, k: appear(c.t, .7), fill: PAL.gold }) +
        label(472, 160, 'ORDINARY LEARNER', { size: 34, k: appear(c.t, .2), op: .8 }) + label(1447, 160, 'ELI · 10× LEARNER', { size: 34, k: appear(c.t, .3), fill: PAL.gold, op: .9 }) +
        S.g({ transform: `translate(960,540) scale(${eq})`, opacity: clamp(eq) }, S.circle(0, 0, 70, '#0b0709'), S.circle(0, 0, 70, 'none', { stroke: PAL.gold, 'stroke-width': 5 }), S.text(0, 30, '=', { 'font-family': 'Lilita One', 'font-size': 110, fill: PAL.gold, 'text-anchor': 'middle' })) +
        label(960, 690, 'SAME SONG', { size: 40, k: appear(c.t, 2.8), fill: PAL.cream });
      return scene(c, { mid, overlay: ov, cam: CAM.drift(960, 540, 1.0, .02, 20)(c.p) });
    } },
  { id: 'S001b', type: 'CU', desc: 'Close-up on Eli at the piano, playing fluently and smiling; the clock behind him shows only one hour passed.', w: 1,
    draw: c => { const r = ENV.musicroom({ t: c.T }); return scene(c, { back: r.back + PR.clock(1500, 330, 70, 4), bb: 8, mid: A(c, { who: 'eli', headAt: [760, 430], h: 1100, f: 1, pose: P.sitPiano(c.T, 1), expr: 'happy', light: LT.warmR }), cam: CAM.push(800, 520, 1, 1.08)(c.p), grade: INSERT_GRADE }); } },
] });

// ---------- B02 possibility montage ----------
const keysGrade = { vignette: .72, grade: INSERT_GRADE };
addBeat({ id: 'B02', lines: ['L002', 'L003'], pre: .2, post: .3, minShot: 1.5, shots: [
  { id: 'S002', type: 'TOP', desc: 'Top-down piano keys lighting up in a fluent melody (match-cut source). "1 HOUR = 10 HOURS".', w: 1.1, sfx: [[.1, 'piano_melody_good', .5]],
    draw: c => {
      const pressed = {}; const n = Math.floor(c.t * 7); pressed[(n * 5) % 21] = 1; pressed[(n * 3 + 2) % 21] = .7; pressed[100 + (n * 7) % 20] = 1;
      const mid = S.rect(-200, -200, 2400, 1500, '#1a0f14') + PR.keysTop(160, 330, 1600, 21, pressed) + glow(960, 500, 700, PAL.win, .25) + bigHand(700 + 200 * Math.sin(c.t * 2), 560, 1.4, -90, PAL.eli, { curl: true }) + bigHand(1250 + 120 * Math.sin(c.t * 2.5), 560, 1.4, -90, PAL.eli, { curl: true });
      return scene(c, { mid, ...keysGrade, cam: CAM.drift(960, 540, 1.05, .06, 30)(c.p), overlay: labelsIn(c, [[960, 200, '1 HOUR  =  10 HOURS', .5, null, { size: 64, fill: PAL.gold }]]) });
    } },
  { id: 'S003', type: 'TOP', desc: 'Match cut: piano keys become a laptop keyboard; fast typing.', w: 1, sfx: [[0, 'whoosh', .4], [.1, 'keyboard_typing', .5]],
    draw: c => {
      let keys = ''; for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) { const hit = hash(Math.floor(c.t * 12) + i * 3 + r) > .85; keys += S.rect(300 + i * 110 + r * 20, 380 + r * 110, 96, 96, hit ? '#ffcf8a' : '#2b2833', { rx: 12 }) + S.rect(300 + i * 110 + r * 20, 380 + r * 110, 96, 8, PAL.rim, { opacity: .35, rx: 4 }) + (hit ? glow(348 + i * 110 + r * 20, 428 + r * 110, 90, PAL.gold, .35) : ''); }
      const mid = S.rect(-200, -200, 2400, 1500, '#16131c') + S.rect(240, 330, 1440, 520, '#3b3846', { rx: 30 }) + keys + bigHand(760, 680, 1.2, -100, PAL.eli, { curl: true }) + bigHand(1200, 680, 1.2, -80, PAL.eli, { curl: true });
      return scene(c, { mid, ...keysGrade, cam: { x: 960, y: 560, z: 1.06 + .04 * c.p, r: lerp(4, 0, c.p) } });
    } },
  { id: 'S004', type: 'TOP', desc: 'Keyboard becomes a textbook page under a desk lamp; "1 DAY = 10 DAYS".', w: 1, sfx: [[0, 'paper_flip', .6], [.3, 'pencil_scratch', .4]],
    draw: c => {
      const mid = S.rect(-200, -200, 2400, 1500, '#2a1a1f') + PR.openBook(960, 900, 1300, { lines: 9 }) + glow(820, 560, 700, PAL.lamp, .3) + PR.pencil(1200 + 40 * Math.sin(c.t * 9), 640, 1.5, -40);
      return scene(c, { mid, vignette: .75, grade: INSERT_GRADE, cam: { x: 960, y: 600, z: 1.02 + .05 * c.p, r: lerp(-8, -3, c.p) }, overlay: labelsIn(c, [[960, 190, '1 DAY  =  10 DAYS', .3, null, { size: 64, fill: PAL.gold }]]) });
    } },
  { id: 'S005', type: 'GFX', desc: 'The page folds into a football tactics board; an arrow draws the play; pull-out reveals it.', w: .9, sfx: [[0, 'whoosh', .35], [.4, 'ball_kick', .5]],
    draw: c => {
      const k = atE(c, 0, 1.2);
      let mid = S.rect(-600, -400, 3200, 1900, '#1a1214') + S.rect(260, 160, 1400, 760, '#2a6a44', { rx: 10 }) + S.rect(260, 160, 1400, 760, 'none', { stroke: '#d9f0dd', 'stroke-width': 6, rx: 10 }) + S.line(960, 160, 960, 920, '#d9f0dd', 5) + S.circle(960, 540, 110, 'none', { stroke: '#d9f0dd', 'stroke-width': 5 }) + S.rect(260, 380, 150, 320, 'none', { stroke: '#d9f0dd', 'stroke-width': 5 }) + S.rect(1510, 380, 150, 320, 'none', { stroke: '#d9f0dd', 'stroke-width': 5 });
      const route = [[500, 700], [800, 520], [1150, 640], [1500, 540]];
      const m = Math.min(2, Math.floor(k * 3)); const part = route.slice(0, m + 2).map((p, i) => i === m + 1 ? [lerp(route[m][0], p[0], Math.min(1, k * 3 - m)), lerp(route[m][1], p[1], Math.min(1, k * 3 - m))] : p);
      mid += S.pl(part, PAL.gold, 10, { 'stroke-dasharray': '30 18' }) + [[500, 700], [800, 520], [1150, 640]].map(([x, y]) => S.circle(x, y, 26, PAL.eli)).join('') + PR.ball(part[part.length - 1][0], part[part.length - 1][1], 24, c.t * 400);
      return scene(c, { mid, vignette: .7, cam: { x: 960, y: 540, z: lerp(1.25, .95, E.out(c.p)), r: lerp(-6, 0, E.out(c.p)) } });
    } },
] });

// ---------- B03 question + title card (music-only beat before the question) ----------
addBeat({ id: 'B03', lines: ['L004'], pre: 1.2, post: 1.8, shots: [
  { id: 'S006', type: 'EST', hold: true, desc: 'School exterior at dusk; Eli and Noah walk to school; title card WHAT IF YOU COULD LEARN ANYTHING 10x FASTER? glows in.', w: 1, sfx: [[.4, 'sparkle', .5], [1.4, 'whoosh', .3]],
    draw: c => {
      const e = ENV.school({ t: c.T, sign: false });
      const tk = atE(c, 1.2, 2.4, 'out');
      const ex = 640 + c.t * 55;
      const ov = titleText([{ t: 'WHAT IF YOU COULD LEARN', size: 78, y: 220 }, { t: 'ANYTHING 10x FASTER?', size: 124, y: 350, fill: PAL.gold }], { op: tk, tf: `translate(0,${(1 - tk) * 30})` }) + S.line(560, 392, 1360, 392, PAL.cream, 3, { opacity: tk * .7 }) + label(960, 442, 'A STICKMAN WHAT-IF', { size: 30, k: appear(c.t, 1.8), op: .8 });
      return scene(c, { back: e.back, bb: 0, mid: A(c, { who: 'eli', x: ex, y: 880, h: 115, f: 1, pose: P.walk(walkPh(ex, 115)), light: LT.hotR }) + A(c, { who: 'noah', x: ex + 70, y: 880, h: 110, f: 1, pose: P.walk(walkPh(ex, 110) + .5), light: LT.hotR }), cam: CAM.push(960, 520, 1.0, 1.06)(c.p), overlay: ov });
    } },
] });

// ---------- B04 Meet Eli — fake hero intro ----------
addBeat({ id: 'B04', lines: ['L005'], pre: .3, post: .2, sfx: [[0, 'epic_rise_cut', .55]], music: { name: 'stop', at: 0 }, shots: [
  { id: 'S007', type: 'LOW', desc: 'Heroic low angle: Eli in the hallway, blinding backlight, rim light on both edges, lens flare; camera spins in like a superhero reveal.', w: 1,
    draw: c => {
      const e = ENV.hallway({ t: c.T });
      const mid = A(c, { who: 'eli', x: 960, y: 1060, h: 720, front: true, pose: P.stand(), expr: 'smug', light: { both: true, color: '#fff1d6' }, rimW: 10 }) + glow(960, 300, 300, '#fff', .25);
      const flare = S.g({ style: 'mix-blend-mode:screen' }, S.ellipse(960, 420, 900, 6, '#fff', { opacity: .5 }), S.ellipse(960, 420, 400, 3, '#ffd6a6', { opacity: .7 }));
      return scene(c, { back: e.back, bb: 2, mid, cam: { x: 960, y: 620, z: lerp(1.25, 1.02, E.out(c.p)), r: lerp(-10, 0, E.out(c.p)) }, overlay: flare + labelsIn(c, [[960, 960, 'ELI · AGE 16', .9, null, { size: 44, fill: PAL.cream }]]) });
    } },
] });

// ---------- B05 English class "thirty-seven" ----------
function classroomWide(c, o = {}) {
  const e = ENV.classroom({ t: c.T, board: o.board || 'ENGLISH' });
  const L = LT.warmL;
  const back = classDesks(1010, [180, 520], { t: c.T, light: L, s: .78, expr: o.extrasExpr || 'neutral', f: 1 });
  let mid = A(c, { who: 'teacher', x: 1330, y: 790, h: 330, f: -1, pose: o.tPose || P.point(), expr: o.tExpr || 'unimpressed', light: L });
  mid += PR.chair(930, 990, 1, .9) + A(c, { who: 'eli', x: 920, y: 935, h: 290, f: 1, pose: o.ePose || P.sit(), expr: o.eExpr || 'neutral', light: L, turn: .5 }) + PR.desk(1060, 1010, 220, { h: 95 });
  return { e, back, mid };
}
function e2(r) { return r.e.back + r.back; }
addBeat({ id: 'B05', minShot: 1.5, lines: ['L006', { id: 'L007', gap: .5 }, { id: 'L008', gap: .2 }], pre: .3, post: 1.8, music: { name: 'comedy_light', vol: .35, at: 2.0 }, shots: [
  { id: 'S008', type: 'WS', desc: 'Flat awkward classroom wide: teacher at the ENGLISH board points at Eli: "Eli. The answer?"', w: 1,
    draw: c => { const r = classroomWide(c, { tPose: P.point(), tExpr: 'unimpressed', eExpr: 'shock' }); return scene(c, { back: e2(r), bb: 2, mid: r.mid, cam: CAM.drift(960, 600, 1.02, .02)(c.p) }); } },
  { id: 'S009', type: 'MS', on: 'L007', desc: 'Eli medium shot, hand half-raised, confidently wrong: "Uh... thirty-seven?"', w: 1,
    draw: c => {
      const e = ENV.classroom({ t: c.T });
      const mid = PR.chair(760, 920, 1, 1.6) + A(c, { who: 'eli', x: 760, y: 820, h: 560, f: 1, pose: mixPose(P.sit(), P.raiseHand(), atE(c, .1, .5, 'outBack') * .7), expr: c.t > .9 ? 'happy' : 'worried', light: LT.warmL }) + PR.desk(1050, 980, 520, { h: 160 });
      return scene(c, { back: e.back, bb: 9, mid, cam: CAM.drift(860, 560, 1.0, .03)(c.p) });
    } },
  { id: 'S010', type: 'ECU', on: 'L008', off: -.25, desc: 'Extreme close-up on the teacher\'s unamused eyes behind her glasses: "We\'re in English class." The ENGLISH board is visible behind.', w: 1, sfx: [[0, 'record_scratch', .6]],
    draw: c => {
      const e = ENV.classroom({ t: c.T });
      const mid = A(c, { who: 'teacher', headAt: [1220, 470], h: 2000, f: -1, pose: P.stand(), expr: 'unimpressed', light: LT.warmL, turn: .2 });
      return scene(c, { back: e.back, bb: 10, mid, cam: { x: 1100 + 30 * c.p, y: 520, z: 1.0 + .05 * c.p } });
    } },
  { id: 'S011', type: 'WS', at: -1.7, desc: 'Class laughs (extras rocking with laughter); Eli sinks in his chair.', w: 1, sfx: [[0, 'class_laugh', .7]],
    draw: c => {
      const e = ENV.classroom({ t: c.T });
      let mid = '';
      [[240, 1, 0], [560, 1, 1], [1500, -1, 2], [1760, -1, 3]].forEach(([x, f, i]) => { mid += A(c, { who: 'extra', x, y: 930, h: 280, f, pose: P.sitLaugh(c.T + i), expr: 'happy', light: LT.warmL, talk: .5 + .4 * Math.sin(c.T * 12 + i), headTilt: -8 + 6 * Math.sin(c.T * 10 + i) }) + PR.desk(x + f * 110, 1010, 200); });
      mid += PR.chair(960, 1010, 1, 1) + A(c, { who: 'eli', x: 960, y: 950 + atE(c, .2, 1) * 25, h: 300, f: 1, pose: mixPose(P.sit(), P.sitSlump(), atE(c, .2, 1)), expr: 'sad', light: LT.warmL }) + PR.desk(1100, 1030, 220);
      return scene(c, { back: e.back, bb: 4, mid, cam: CAM.push(960, 700, 1.0, 1.08)(c.p) });
    } },
] });

// ---------- B06 not a genius + ordinary failures ----------
addBeat({ id: 'B06', minShot: 1.5, lines: ['L009', { id: 'L010', gap: .3 }], pre: .1, post: .5, shots: [
  { id: 'S012', type: 'CU', desc: 'Close-up Eli, deflated, chin on desk.', w: 1,
    draw: c => { const e = ENV.classroom({ t: c.T }); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [1180, 600], h: 1100, f: 1, pose: P.slump(), expr: 'unimpressed', light: LT.warmL }) + PR.desk(1000, 1500, 1800, { h: 200 }), cam: CAM.drift(1100, 560, 1.0, .03)(c.p) }); } },
  { id: 'S013', type: 'WS', on: 'L010', off: -.1, desc: 'Football field: Eli winds up (anticipation), swings, whiffs just over the ball, lands flat on his back with a thud; the ball dribbles away toward the goal.', w: 1.2, sfx: [[.5, 'whoosh', .35], [.72, 'body_fall', 1]],
    draw: c => {
      const e = ENV.field({ t: c.T });
      const pose = poseAt(c.t, [[0, P.stand()], [.45, P.kickWind(), 'out'], [.55, P.kick(), 'out'], [.75, P.trip(), 'out']]);
      const rot = c.t < .55 ? 0 : -kf(c.t, [[.55, 0], [.75, 85, 'out'], [.9, 78, 'inOut']]);
      const ey = c.t < .55 ? 880 : 880 + 22 * atE(c, .55, .75);
      const bx = 985 + 340 * E.out(seg(c.t, .6, 2.2));
      const legSmear = c.t > .45 && c.t < .58 ? ghosts(dt => A(c, { who: 'eli', x: 900, y: 880, h: 280, f: 1, pose: poseAt(c.t + dt, [[.45, P.kickWind()], [.55, P.kick()]]), light: { none: true } }), 3, .03, .3) : '';
      return scene(c, { back: e.back, bb: 3, mid: PR.goal(1650, 860, 420, 200) + legSmear + A(c, { who: 'eli', x: 900, y: ey, h: 280, f: 1, pose, rot, expr: c.t < .55 ? 'determined' : 'shock', blink: c.t > 1.2 && c.t < 1.28, light: LT.hotR }) + PR.ball(bx, 862, 18, c.t * 150), cam: CAM.drift(1000, 640, 1.08, .03, 25)(c.p), shake: c.t > .72 && c.t < .97 ? 7 : 0 });
    } },
  { id: 'S014', type: 'MS-side', desc: 'Side-profile piano: Eli hits awful notes, winces on each one; keys flash red.', w: 1, sfx: [[.05, 'piano_bad_notes', .8]],
    draw: c => {
      const e = ENV.musicroom({ t: c.T });
      const hit = Math.floor(c.t * 5) % 2;
      const mid = PR.piano(760, 860, 1.25) + PR.stool(1080, 860, 1.2) + A(c, { who: 'eli', x: 1080, y: 740, h: 360, f: -1, pose: P.sitPiano(c.T, 3), expr: hit ? 'worried' : 'shock', headTilt: hit ? 8 : -4, light: LT.warmL }) + (hit ? glow(640, 690, 120, PAL.red, .5) : '');
      return scene(c, { back: e.back, bb: 5, mid, cam: CAM.drift(900, 600, 1.12, .03)(c.p) });
    } },
  { id: 'S015', type: 'TOP', desc: 'Overhead under a lamp: a sheet of music flutters down and becomes a math test with a huge red F.', w: 1, sfx: [[.2, 'paper_flip', .7], [.6, 'comedic_sting', .5]],
    draw: c => {
      const k = atE(c, 0, .6, 'out');
      const mid = S.rect(-200, -200, 2400, 1500, '#3a2630') + glow(900, 500, 800, PAL.lamp, .25) + PR.testPaper(960, 560 - (1 - k) * 300, 1.5, { grade: 'F', r: lerp(-30, 4, k), gradeK: E.outBack(seg(c.t, .5, .8)), marks: [0, 0, 1, 0, 0, 0, 0] }) + PR.pencil(1400, 820, 1.4, -30);
      return scene(c, { mid, vignette: .75, grade: INSERT_GRADE, cam: CAM.drift(960, 540, 1.02, .04)(c.p) });
    } },
] });

// ---------- B07 Noah ----------
function benchTwoShot(c, o = {}) {
  const e = ENV.school({ t: c.T });
  const mid = S.rect(560, 830, 820, 24, PAL.woodD, { rx: 4 }) + S.rect(600, 854, 20, 70, PAL.woodD) + S.rect(1320, 854, 20, 70, PAL.woodD) +
    A(c, { who: 'eli', x: 840, y: 830, h: 300, f: 1, pose: o.ePose || P.sitSlump(), expr: o.eExpr || 'sad', light: LT.hotR }) +
    A(c, { who: 'noah', x: o.nx ?? 1100, y: o.ny ?? 830, h: 300, f: -1, pose: o.nPose || P.sit(), expr: o.nExpr || 'unimpressed', light: LT.hotR, holdSvg: o.nHold }) + PR.testPaper(780, 900, .25, { grade: 'F', r: -10 });
  return { e, mid };
}
addBeat({ id: 'B07', lines: ['L011', { id: 'L012', gap: .3 }, { id: 'L013', gap: .3 }], pre: .2, post: .6, shots: [
  { id: 'S016', type: 'MS-2', desc: 'Outside school at dusk: Eli slumped on a bench; Noah (yellow cap, blue shirt) walks in holding his own D- test and drops onto the bench.', w: 1,
    draw: c => {
      const walkK = at(c, 0, 1.2), nx = lerp(1560, 1100, walkK);
      const sitK = atE(c, 1.2, 1.55, 'outBack');
      const pose = c.t < 1.2 ? P.walk(walkPh(1560 - nx, 300)) : mixPose(P.stand(), P.sit(), sitK);
      const ny = c.t < 1.2 ? 830 + 117 : lerp(830 + 117, 830, sitK);
      const r = benchTwoShot(c, { nx, ny, nPose: pose, nExpr: 'unimpressed', nHold: PR.testPaper(0, -40, .2, { grade: 'D-', r: 8, showMarks: false }) });
      return scene(c, { back: r.e.back, bb: 5, mid: r.mid, cam: CAM.drift(960, 660, 1.35, .03)(c.p) });
    } },
  { id: 'S017', type: 'OTS', on: 'L012', desc: 'Over Eli\'s shoulder (Eli seen from behind, foreground): Noah, deadpan, looking at Eli: "Dude, we\'re so cooked."', w: 1,
    draw: c => { const e = ENV.school({ t: c.T }); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1180, 470], h: 1150, f: -1, pose: P.sit(), expr: 'unimpressed', lookX: .6, light: LT.hotR }), fg: A(c, { who: 'eli', headAt: [300, 640], h: 1500, front: true, back: true, pose: P.sitSlump(), light: LT.hotR }), fb: 18, cam: CAM.drift(1000, 540, 1, .03)(c.p) }); } },
  { id: 'S018', type: 'OTS', on: 'L013', desc: 'Reverse over Noah\'s shoulder: Eli, flat: "You think?"', w: 1,
    draw: c => { const e = ENV.school({ t: c.T }); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [740, 470], h: 1150, f: 1, pose: P.sit(), expr: 'unimpressed', lookX: .6, light: LT.hotR }), fg: A(c, { who: 'noah', headAt: [1680, 640], h: 1500, front: true, back: true, pose: P.sit(), light: LT.hotR }), fb: 18, cam: CAM.drift(900, 540, 1, .03)(c.p) }); } },
] });

// ---------- B08 one morning (DAWN bedroom), discovery ----------
function bedroomDesk(c, o = {}) {
  const e = ENV.bedroom({ t: c.T, lamp: o.lamp ?? 1, dawn: o.dawn ?? true });
  const mid = PR.chair(880, 820, -1, 1.6) + A(c, { who: 'eli', x: 880, y: 712, h: 360, f: 1, pose: o.pose || P.sitWrite(c.T), expr: o.expr || 'busy', light: LT.lampR, lookY: .6 }) + PR.openBook(1000, 592, 150) + PR.book(1140, 592, 80, 30, '#3a5a8a');
  return { e, mid };
}
addBeat({ id: 'B08', lines: ['L014', { id: 'L015', gap: .4 }], pre: .3, post: .4, music: { name: 'discovery', vol: .4, at: .2, fade: 2 }, shots: [
  { id: 'S019', type: 'EST', desc: 'Dawn establishing: the view from Eli\'s window at sunrise; 6:00 AM.', w: .9, sfx: [[.2, 'clock_tick_loop', .3]],
    draw: c => {
      const sky = rectGrad(0, 0, W, H, [[0, '#2a2a5e', 1], [.6, '#a86a8a', 1], [1, '#ffb38a', 1]]);
      const mid = sky + glow(1300, 900, 500, '#ffcf8a', .6) + S.circle(1300, 900 - 120 * c.p, 70, PAL.sun) + skyline(1000, 9, '#1c1636', -200, 2200, 260, .2) + S.rect(0, 0, 160, H, '#141026') + S.rect(W - 160, 0, 160, H, '#141026') + S.rect(0, 520, W, 30, '#141026') + S.rect(940, 0, 30, H, '#141026');
      return scene(c, { mid, cam: CAM.drift(960, 540, 1.04, .04)(c.p), overlay: label(1600, 960, '6:00 AM', { size: 60, k: appear(c.t, .3), fill: PAL.cream }) });
    } },
  { id: 'S020', type: 'MS', on: 'L015', desc: 'At his desk at dawn, Eli rubs his eyes over messy notes; DAY 7 on the wall calendar (a week of struggle).', w: 1.2, sfx: [[.4, 'pencil_scratch', .35]],
    draw: c => {
      const fp = atE(c, 1.3, 1.6, 'outBack') * (1 - atE(c, 2.4, 2.8));
      const r = bedroomDesk(c, { pose: mixPose(P.sitWrite(c.T), P.sitFacepalm(), fp), expr: 'unimpressed' });
      return scene(c, { back: r.e.back, bb: 6, mid: r.mid + PR.calendar(1180, 430, 7, .45), cam: CAM.drift(980, 560, 1.55, .04)(c.p) });
    } },
  { id: 'S021', type: 'INSERT', desc: 'Notebook insert under lamplight: messy crossed-out working, a red question mark.', w: .8,
    draw: c => {
      let mid = S.rect(-200, -200, 2400, 1500, '#1a1426') + PR.openBook(960, 980, 1500, { lines: 0 }) + glow(700, 400, 700, PAL.lamp, .25);
      const r = rng(4); for (let i = 0; i < 9; i++) mid += S.path(`M${300 + r() * 500},${330 + i * 55} q40,-20 80,0 t80,0 t${60 + r() * 120},0`, 'none', { stroke: '#4a3f6a', 'stroke-width': 6, opacity: .8 }) + (r() > .5 ? S.line(290 + r() * 400, 320 + i * 55, 600 + r() * 300, 340 + i * 55, '#c0392b', 5) : '');
      mid += S.text(1350, 640, '?', { 'font-family': 'Lilita One', 'font-size': 260, fill: '#c0392b', opacity: .8 });
      return scene(c, { mid, vignette: .78, grade: INSERT_GRADE, cam: CAM.drift(960, 540, 1.05, .05)(c.p) });
    } },
] });
addBeat({ id: 'B09', lines: ['L016', { id: 'L017', gap: .3 }], pre: .2, post: .3, shots: [
  { id: 'S022', type: 'ECU', desc: 'Extreme close-up pencil under lamplight: the messy steps rearrange themselves into a clean ordered solution (the pattern clicks).', w: 1.3, sfx: [[.1, 'pencil_scratch', .5], [1.1, 'sparkle', .5]],
    draw: c => {
      const k = atE(c, .6, 1.8);
      let mid = S.rect(-200, -200, 2400, 1500, '#d9c9ab') + glow(560, 400, 800, '#fff3df', .35);
      const r = rng(8);
      for (let i = 0; i < 6; i++) {
        const mx = 420 + r() * 900, my = 220 + r() * 600, mr = (r() - .5) * 40, cx = 520, cy = 260 + i * 110;
        mid += S.g({ transform: `translate(${lerp(mx, cx, k)},${lerp(my, cy, k)}) rotate(${lerp(mr, 0, k)})` }, S.text(0, 0, ['3x² − 12x + 9 = 0', 'x² − 4x + 3 = 0', '(x − 1)(x − 3) = 0', 'x − 1 = 0  or  x − 3 = 0', 'x = 1', 'x = 3'][i], { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 58, fill: mixc('#8a7fa0', '#2a2440', k) }));
      }
      if (k > .95) mid += S.rect(500, 820, 300, 90, 'none', { stroke: PAL.green, 'stroke-width': 8, rx: 12 });
      mid += PR.pencil(1350 + 60 * Math.sin(c.t * 12), 820 + 10 * Math.cos(c.t * 9), 2.2, -40);
      return scene(c, { mid, vignette: .78, grade: INSERT_GRADE, cam: CAM.drift(900, 560, 1.05, .05)(c.p) });
    } },
  { id: 'S023', type: 'CU', desc: 'Close-up: Eli\'s eyes widen — a double-take in the dawn light.', w: .8,
    draw: c => { const r = bedroomDesk(c); const take = c.t > .4 ? 1 + .08 * Math.sin(Math.PI * clamp((c.t - .4) / .25)) : 1; return scene(c, { back: r.e.back, bb: 12, mid: S.g({ transform: `translate(760,430) scale(${take}) translate(-760,-430)` }, A(c, { who: 'eli', headAt: [760, 430], h: 1150, f: 1, pose: P.sit(), expr: c.t > .4 ? 'shock' : 'busy', blink: c.t > .36 && c.t < .42, light: LT.lampR })), cam: CAM.push(800, 500, 1, 1.08)(c.p) }); } },
  { id: 'S024', type: 'TOP', on: 'L017', desc: 'Overhead page: problem after problem gets a green tick, tick, tick.', w: 1, sfx: [[.3, 'ui_tick', .7], [.9, 'ui_tick', .7], [1.5, 'ui_tick', .7]],
    draw: c => {
      let mid = S.rect(-200, -200, 2400, 1500, '#d9c9ab') + glow(800, 500, 900, '#fff3df', .3);
      for (let i = 0; i < 5; i++) { mid += S.text(300, 240 + i * 150, `${i + 2}.  ${['2x + 6 = 14', 'x² = 49', '5(x − 2) = 15', '√x = 9', 'x/4 + 1 = 3'][i]}`, { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 56, fill: '#2a2440' }); if (c.t > .3 + i * .5) mid += tick(1300, 220 + i * 150, 1.6 * E.outBack(clamp((c.t - .3 - i * .5) / .2))); }
      return scene(c, { mid, vignette: .78, grade: INSERT_GRADE, cam: { x: 960, y: lerp(450, 650, c.p), z: 1.05 } });
    } },
] });
// ---------- B10 the 10x proof ----------
addBeat({ id: 'B10', lines: ['L018', { id: 'L019', gap: 1.0 }], pre: .2, post: .6, shots: [
  { id: 'S025', type: 'GFX', desc: 'Proof graphic over a dimmed desk: timer 00:00→06:00; BEFORE bar = 60 MIN, NOW bar stops at 6 MIN (one tenth); "SAME UNDERSTANDING".', w: 1, sfx: [[0, 'clock_tick_fast', .4], [2.8, 'ui_pop', .6]],
    draw: c => {
      const r = bedroomDesk(c, { pose: P.sitWrite(c.T * 2) });
      const k = at(c, .2, c.d * .8), secs = Math.floor(k * 360);
      const ov = S.rect(0, 0, W, H, '#0b0709', { opacity: .55 }) + PR.timer(960, 330, `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`, { w: 420, h: 150, size: 100, fill: PAL.gold }) +
        label(560, 605, 'BEFORE', { size: 40, k: appear(c.t, .3), anchor: 'end' }) + S.rect(600, 570, 900, 40, '#3a2a3a', { rx: 20 }) + S.rect(600, 570, 900, 40, '#8a7a8a', { rx: 20 }) + label(1530, 605, '60 MIN', { size: 40, k: appear(c.t, .3), anchor: 'start' }) +
        label(560, 705, 'NOW', { size: 40, k: appear(c.t, .3), anchor: 'end', fill: PAL.gold }) + S.rect(600, 670, 900, 40, '#3a2a3a', { rx: 20 }) + S.rect(600, 670, 90 * k + .01, 40, PAL.gold, { rx: 20 }) + label(1530, 705, '6 MIN', { size: 40, k: appear(c.t, c.d * .8), anchor: 'start', fill: PAL.gold }) +
        label(960, 830, 'SAME UNDERSTANDING', { size: 46, k: appear(c.t, c.d * .82) });
      return scene(c, { back: r.e.back, bb: 8, mid: r.mid, mb: 4, cam: CAM.drift(960, 540, 1.2, .03)(c.p), overlay: ov });
    } },
  { id: 'S026', type: 'CU', on: 'L019', off: -.6, desc: 'Beat of silence, then Eli close-up facing camera with the BEWILDERED look (callback face for the ending): "Wait... what?"', w: 1,
    draw: c => { const r = bedroomDesk(c); return scene(c, { back: r.e.back, bb: 12, mid: A(c, { who: 'eli', ...BEWILDERED_FRAME, f: 1, front: true, pose: P.stand(), expr: c.t < .5 ? 'shock' : 'bewildered', light: LT.lampR }), cam: CAM.push(860, 500, 1, 1.06)(c.p) }); } },
] });
addBeat({ id: 'B11', lines: ['L020', { id: 'L021', gap: .4 }], pre: .2, post: .5, shots: [
  { id: 'S027', type: 'TOP', desc: 'Overhead: Eli\'s old F math test; his hand (sleeve entering from frame edge) re-does it; red crosses flip to green ticks one by one, then a big green 6/7 stamp lands over the F.', w: 1.2, sfx: [[.4, 'pencil_scratch', .4], [1.0, 'ui_tick', .6], [1.4, 'ui_tick', .6], [1.8, 'ui_tick', .6], [2.4, 'paper_flip', .7], [2.45, 'success_chime', .5]],
    draw: c => {
      const n = Math.floor(seg(c.t, .6, 2.2) * 7);
      const marks = [0, 1, 2, 3, 4, 5, 6].map(i => i < n ? (i !== 4) : (i === 2));
      const stamp = E.outBack(seg(c.t, 2.4, 2.65));
      const mid = S.rect(-200, -200, 2400, 1500, '#2a1f2a') + glow(900, 400, 800, PAL.lamp, .3) + PR.testPaper(960, 560, 1.55, { grade: 'F', marks, showGrade: c.t < 2.4 }) + bigHand(1450 - 40 * Math.sin(c.t * 4), 400 + n * 60, 1.1, 200, PAL.eli, { curl: true }) +
        (c.t > 2.4 ? S.g({ transform: `translate(1162,281) rotate(-12) scale(${stamp * 1.55})` }, S.circle(0, 0, 52, 'none', { stroke: '#2fa24d', 'stroke-width': 7 }), S.text(0, 22, '6/7', { 'font-family': 'Lilita One', 'font-size': 50, fill: '#2fa24d', 'text-anchor': 'middle' })) : '');
      return scene(c, { mid, vignette: .75, grade: INSERT_GRADE, cam: CAM.drift(960, 540, 1.02, .05)(c.p), shake: c.t > 2.4 && c.t < 2.55 ? 5 : 0 });
    } },
  { id: 'S027b', type: 'ECU', w: .5, min: 1.3, desc: 'Extreme close-up: Eli stares at the result, a slow grin spreading.', sfx: [[.2, 'sparkle', .4]],
    draw: c => { const r = bedroomDesk(c); return scene(c, { back: r.e.back, bb: 14, mid: A(c, { who: 'eli', headAt: [1180, 560], h: 2200, f: -1, front: true, pose: P.stand(), expr: c.t < .5 ? 'shock' : 'happy', light: LT.lampR, hideMouth: c.t < .5 }), cam: CAM.push(1100, 540, 1, 1.06)(c.p) }); } },
  { id: 'S028', type: 'GFX', on: 'L021', desc: 'The rule card: "LEARNS 10× FASTER FROM PRACTICE" with crossed-out myths: instant knowledge, superhuman body, perfect judgment. Eli thinking beside it.', w: 1.4, sfx: [[.2, 'ui_pop', .6], [1.4, 'ui_tick', .5], [1.8, 'ui_tick', .5], [2.2, 'ui_tick', .5]],
    draw: c => {
      const e = ENV.void({ t: c.T });
      const ov = label(960, 300, 'THE RULE', { size: 46, k: appear(c.t, .1), fill: PAL.gold }) + titleText([{ t: 'LEARNS 10× FASTER FROM PRACTICE', size: 72, y: 410 }], { op: appear(c.t, .3) }) +
        [['INSTANT KNOWLEDGE', 1.2], ['SUPERHUMAN BODY', 1.6], ['PERFECT JUDGMENT', 2.0]].map(([s, t0], i) => S.g({ opacity: appear(c.t, t0) }, cross(680, 560 + i * 95, .9), label(740, 580 + i * 95, s, { size: 48, k: 1, anchor: 'start', fill: '#cbbfc8' }))).join('') +
        S.g({ opacity: appear(c.t, 2.6) }, label(960, 900, 'STILL NEEDS: PRACTICE · SLEEP · TIME', { size: 40, k: 1, fill: PAL.cream }));
      return scene(c, { back: e.back, bb: 0, mid: A(c, { who: 'eli', x: 260, y: 1000, h: 520, f: 1, pose: P.think(), expr: 'busy', lookY: -.5, light: LT.warmR }), cam: CAM.drift(960, 540, 1, .03, 30)(c.p), overlay: ov });
    } },
] });
