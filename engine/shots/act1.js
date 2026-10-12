// ACT I — hook, ordinary Eli, discovery, proof of the rule.

// ---------- B01 HOOK: split-screen 10 hours vs 1 hour ----------
addBeat({ id: 'B01', lines: ['L001'], pre: .5, post: .5, music: { name: 'curious_open', vol: .55, fade: 1.5 }, shots: [
  { id: 'S001', type: 'GFX-split', desc: 'Split screen: left ordinary kid struggling at piano while calendar flips DAY 1→10; right Eli at piano with clock advancing 1 hour. Labels 10 HOURS / 1 HOUR.', w: 1,
    sfx: [[0, 'piano_bad_notes', .45], [0, 'clock_tick_loop', .5], [2.6, 'ui_pop', .6]],
    draw: c => {
      const music = ENV.musicroom({ t: c.T });
      const left = music.back + PR.piano(820, 800, 1.1) + A(c, { who: 'extra', x: 1060, y: 650, h: 330, f: -1, pose: P.sitPiano(c.T, 2), expr: 'worried', light: LT.warmL }) + PR.stool(1060, 800, 1.1) + PR.calendar(560, 330, Math.min(10, 1 + Math.floor(c.t * 3.2)), .8, (c.t * 3.2) % 1);
      const right = music.back + PR.piano(820, 800, 1.1) + A(c, { who: 'eli', x: 1060, y: 650, h: 330, f: -1, pose: P.sitPiano(c.T, 1), expr: 'happy', light: LT.warmL }) + PR.stool(1060, 800, 1.1) + PR.clock(560, 330, 95, 3 + Math.min(1, c.t / 4.5));
      const k = atE(c, 3.6, 5.2);
      const lw = lerp(940, 300, k), rx = lerp(980, 340, k), rw = W - rx;
      let mid = S.rect(0, 0, W, H, '#0b0709');
      mid += panel(0, 60, lw, 960, left, { s: .95, cx: 900, cy: 560 }) + panel(rx, 60, rw, 960, right, { s: lerp(.95, 1.15, k), cx: 940, cy: 560 });
      const ov = label(lw / 2, 900, '10 HOURS OF PRACTICE', { size: 50, k: appear(c.t, .6), op: 1 - k }) + label(rx + rw / 2, 900, '1 HOUR OF PRACTICE', { size: lerp(50, 64, k), k: appear(c.t, 1.0), fill: PAL.gold }) +
        label(lw / 2, 150, 'ORDINARY', { size: 34, k: appear(c.t, .3), op: (1 - k) * .8 }) + label(rx + rw / 2, 150, 'ELI · 10× LEARNING', { size: 34, k: appear(c.t, .5), fill: PAL.gold, op: .9 });
      return scene(c, { mid, overlay: ov, cam: { x: 960, y: 540, z: 1 + .02 * c.p } });
    } },
] });

// ---------- B02 possibility montage: piano keys -> keyboard -> textbook -> football diagram ----------
addBeat({ id: 'B02', lines: ['L002', 'L003'], pre: .2, post: .3, minShot: 1.6, shots: [
  { id: 'S002', type: 'TOP', desc: 'Top-down piano keys lighting up in a fluent melody (match-cut source).', w: 1.1, sfx: [[.1, 'piano_melody_good', .5]],
    draw: c => {
      const pressed = {}; const n = Math.floor(c.t * 7); pressed[(n * 5) % 21] = 1; pressed[(n * 3 + 2) % 21] = .7; pressed[100 + (n * 7) % 20] = 1;
      const mid = S.rect(-200, -200, 2400, 1500, '#1a0f14') + PR.keysTop(160, 330, 1600, 21, pressed) + glow(960, 500, 700, PAL.win, .25) + bigHand(700 + 200 * Math.sin(c.t * 2), 520, 1.4, -90, PAL.eli, { curl: true }) + bigHand(1250 + 120 * Math.sin(c.t * 2.5), 520, 1.4, -90, PAL.eli, { curl: true });
      return scene(c, { mid, cam: CAM.drift(960, 540, 1.05, .06)(c.p), overlay: labelsIn(c, [[960, 200, '1 HOUR  =  10 HOURS', .8, null, { size: 64, fill: PAL.gold }]]) });
    } },
  { id: 'S003', type: 'TOP', desc: 'Match cut: piano keys become a laptop keyboard; code typing.', w: 1, sfx: [[0, 'whoosh', .4], [.1, 'keyboard_typing', .5]],
    draw: c => {
      let keys = ''; for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) { const hit = hash(Math.floor(c.t * 12) + i * 3 + r) > .85; keys += S.rect(300 + i * 110 + r * 20, 380 + r * 110, 96, 96, hit ? '#ffcf8a' : '#2b2833', { rx: 12 }) + S.rect(300 + i * 110 + r * 20, 380 + r * 110, 96, 8, PAL.rim, { opacity: .35, rx: 4 }); }
      const mid = S.rect(-200, -200, 2400, 1500, '#16131c') + S.rect(240, 330, 1440, 520, '#3b3846', { rx: 30 }) + keys + bigHand(760, 640, 1.2, -100, PAL.eli, { curl: true }) + bigHand(1200, 640, 1.2, -80, PAL.eli, { curl: true });
      return scene(c, { mid, cam: CAM.drift(960, 560, 1.06, .05, -30)(c.p) });
    } },
  { id: 'S004', type: 'TOP', desc: 'Keyboard becomes a textbook page; a "1 DAY = 10 DAYS" counter; pencil annotating.', w: 1, sfx: [[0, 'paper_flip', .6], [.3, 'pencil_scratch', .4]],
    draw: c => {
      const mid = S.rect(-200, -200, 2400, 1500, '#2a1a1f') + glow(800, 400, 900, PAL.lamp, .25) + PR.openBook(960, 900, 1300, { lines: 9 }) + PR.pencil(1200 + 40 * Math.sin(c.t * 9), 640, 1.5, -40);
      return scene(c, { mid, cam: CAM.drift(960, 600, 1.0, .05)(c.p), overlay: labelsIn(c, [[960, 190, '1 DAY  =  10 DAYS', .4, null, { size: 64, fill: PAL.gold }]]) });
    } },
  { id: 'S005', type: 'TOP', desc: 'Page folds into a football tactics board; arrows draw a play.', w: .9, sfx: [[0, 'whoosh', .35], [.4, 'ball_kick', .5]],
    draw: c => {
      const k = atE(c, 0, 1.4);
      let mid = S.rect(-200, -200, 2400, 1500, '#123020') + S.rect(260, 160, 1400, 760, '#2a7a4a', { rx: 10 }) + S.rect(260, 160, 1400, 760, 'none', { stroke: '#d9f0dd', 'stroke-width': 6, rx: 10 }) + S.line(960, 160, 960, 920, '#d9f0dd', 5) + S.circle(960, 540, 110, 'none', { stroke: '#d9f0dd', 'stroke-width': 5 }) + S.rect(260, 380, 150, 320, 'none', { stroke: '#d9f0dd', 'stroke-width': 5 }) + S.rect(1510, 380, 150, 320, 'none', { stroke: '#d9f0dd', 'stroke-width': 5 });
      const route = [[500, 700], [800, 520], [1150, 640], [1500, 540]];
      const m = Math.floor(k * 3); const part = route.slice(0, m + 2).map((p, i) => i === m + 1 ? [lerp(route[m][0], p[0], (k * 3) % 1), lerp(route[m][1], p[1], (k * 3) % 1)] : p);
      mid += S.pl(part, PAL.gold, 10, { 'stroke-dasharray': '30 18' }) + [[500, 700], [800, 520], [1150, 640]].map(([x, y]) => S.circle(x, y, 26, PAL.eli)).join('') + PR.ball(part[part.length - 1][0], part[part.length - 1][1], 24, c.t * 400);
      return scene(c, { mid, cam: { x: 960, y: 540, z: lerp(1.25, 1.02, E.out(c.p)), r: lerp(-6, 0, E.out(c.p)) } });
    } },
] });

// ---------- B03 question + title card ----------
addBeat({ id: 'B03', lines: ['L004'], pre: .2, post: 1.6, shots: [
  { id: 'S006', type: 'EST', desc: 'School exterior at dusk; title card WHAT IF YOU COULD LEARN ANYTHING 10x FASTER? glows in.', w: 1, sfx: [[.2, 'sparkle', .5], [1.2, 'whoosh', .3]],
    draw: c => {
      const e = ENV.school({ t: c.T, sign: false });
      const tk = atE(c, 1.0, 2.2, 'out');
      const ov = titleText([{ t: 'WHAT IF YOU COULD LEARN', size: 78, y: 230 }, { t: 'ANYTHING 10x FASTER?', size: 124, y: 360, fill: PAL.gold }], { op: tk, tf: `translate(0,${(1 - tk) * 30})` }) + S.line(560, 400, 1360, 400, PAL.cream, 3, { opacity: tk * .7 }) + label(960, 450, 'A STICKMAN WHAT-IF', { size: 30, k: appear(c.t, 1.6), op: .8 });
      return scene(c, { back: e.back, bb: 0, mid: A(c, { who: 'eli', x: 930, y: 860, h: 60, f: 1, pose: P.walk(c.t * .8), light: LT.hotR }) + A(c, { who: 'noah', x: 980, y: 860, h: 58, f: 1, pose: P.walk(c.t * .8 + .5), light: LT.hotR }), cam: CAM.push(960, 520, 1.0, 1.06)(c.p), overlay: ov });
    } },
] });

// ---------- B04 Meet Eli — fake hero intro ----------
addBeat({ id: 'B04', lines: ['L005'], pre: .3, post: .2, sfx: [[0, 'epic_rise_cut', .55]], music: { name: 'stop', at: 0 }, shots: [
  { id: 'S007', type: 'LOW', desc: 'Heroic low-angle: Eli in hallway, blinding backlight, rays, camera spins in like a superhero reveal.', w: 1,
    draw: c => {
      const e = ENV.hallway({ t: c.T });
      const mid = A(c, { who: 'eli', x: 960, y: 1060, h: 720, front: true, pose: P.stand(), expr: 'smug', light: LT.top, rimW: 7 }) + glow(960, 300, 300, '#fff', .25);
      return scene(c, { back: e.back, bb: 2, mid, cam: { x: 960, y: 620, z: lerp(1.25, 1.02, E.out(c.p)), r: lerp(-10, 0, E.out(c.p)) }, overlay: labelsIn(c, [[960, 960, 'ELI · AGE 16', .9, null, { size: 44, fill: PAL.cream }]]) });
    } },
] });

// ---------- B05 English class "thirty-seven" ----------
function classroomWide(c, o = {}) {
  const e = ENV.classroom({ t: c.T, board: o.board || 'ENGLISH' });
  const L = LT.warmL;
  const back = classDesks(1010, [180, 520], { t: c.T, light: L, s: .78, expr: o.extrasExpr || 'neutral', f: 1 }) ;
  let mid = A(c, { who: 'teacher', x: 1330, y: 790, h: 330, f: -1, pose: o.tPose || P.point(), expr: o.tExpr || 'unimpressed', light: L });
  mid += PR.chair(930, 990, 1, .9) + A(c, { who: 'eli', x: 920, y: 935, h: 290, f: 1, pose: o.ePose || P.sit(), expr: o.eExpr || 'neutral', light: L, turn: .5 }) + PR.desk(1060, 1010, 220, { h: 95 });
  return { e, back, mid };
}
addBeat({ id: 'B05', lines: ['L006', { id: 'L007', gap: .5 }, { id: 'L008', gap: .2 }], pre: .3, post: 1.6, music: { name: 'comedy_light', vol: .35, at: 2.0 }, shots: [
  { id: 'S008', type: 'WS', desc: 'Flat awkward classroom wide: teacher at ENGLISH board points at Eli: "Eli. The answer?"', w: 1,
    draw: c => { const r = classroomWide(c, { tPose: P.point(), tExpr: 'unimpressed', eExpr: 'shock' }); return scene(c, { back: e2(r), bb: 2, mid: r.mid, cam: CAM.drift(960, 600, 1.02, .02)(c.p) }); } },
  { id: 'S009', type: 'MS', on: 'L007', desc: 'Eli medium shot, confidently wrong: "Uh... thirty-seven?"', w: 1,
    draw: c => {
      const e = ENV.classroom({ t: c.T });
      const mid = PR.chair(860, 920, 1, 1.6) + A(c, { who: 'eli', x: 860, y: 820, h: 560, f: 1, pose: mixPose(P.sit(), P.raiseHand(), atE(c, .1, .5) * .7), expr: c.t > .8 ? 'happy' : 'worried', light: LT.warmL }) + PR.desk(1150, 980, 520, { h: 160 });
      return scene(c, { back: e.back, bb: 9, mid, cam: CAM.drift(900, 560, 1.0, .03)(c.p) });
    } },
  { id: 'S010', type: 'ECU', on: 'L008', off: -.25, desc: 'Extreme close-up on the teacher\'s unamused eyes behind glasses: "We\'re in English class." Board reads ENGLISH behind.', w: 1, sfx: [[0, 'record_scratch', .6]],
    draw: c => {
      const e = ENV.classroom({ t: c.T });
      const mid = A(c, { who: 'teacher', x: 960, y: 2250, h: 2000, f: -1, pose: P.stand(), expr: 'unimpressed', light: LT.warmL, turn: .2, rimW: 10 });
      return scene(c, { back: e.back, bb: 14, mid, cam: { x: 960 + 30 * c.p, y: 520, z: 1.0 + .05 * c.p } });
    } },
  { id: 'S011', type: 'WS', at: -1.5, desc: 'Class laughs (extras with happy faces bobbing); Eli sinks in his chair.', w: 1, sfx: [[0, 'class_laugh', .7]],
    draw: c => {
      const e = ENV.classroom({ t: c.T });
      let mid = '';
      [[240, 1, 0], [560, 1, 1], [1500, -1, 2], [1760, -1, 3]].forEach(([x, f, i]) => { mid += A(c, { who: 'extra', x, y: 930 + Math.abs(Math.sin(c.T * 14 + i)) * -10, h: 280, f, pose: P.sit(), expr: 'happy', light: LT.warmL, talk: .6 }) + PR.desk(x + f * 110, 1010, 200); });
      mid += PR.chair(960, 1010, 1, 1) + A(c, { who: 'eli', x: 960, y: 950 + atE(c, .2, 1) * 25, h: 300, f: 1, pose: mixPose(P.sit(), P.sitSlump(), atE(c, .2, 1)), expr: 'sad', light: LT.warmL }) + PR.desk(1100, 1030, 220);
      return scene(c, { back: e.back, bb: 4, mid, cam: CAM.push(960, 700, 1.0, 1.08)(c.p) });
    } },
] });
function e2(r) { return r.e.back + r.back; }

// ---------- B06 not a genius + B07 ordinary failures ----------
addBeat({ id: 'B06', lines: ['L009', { id: 'L010', gap: .3 }], pre: .1, post: .4, shots: [
  { id: 'S012', type: 'CU', desc: 'Close-up Eli, deflated, slumped face on desk.', w: 1,
    draw: c => { const e = ENV.classroom({ t: c.T }); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'eli', x: 960, y: 1500, h: 1100, f: 1, pose: P.slump(), expr: 'unimpressed', light: LT.warmL, rimW: 7 }) + PR.desk(1000, 1500, 1400, { h: 200 }), cam: CAM.drift(960, 540, 1.0, .03)(c.p) }); } },
  { id: 'S013', type: 'WS', on: 'L010', off: -.1, desc: 'Football field: Eli swings to kick, misses the ball entirely, falls on his back. Ball rolls away.', w: 1.1, sfx: [[.55, 'body_fall', 1], [.5, 'whoosh', .3]],
    draw: c => {
      const e = ENV.field({ t: c.T });
      const k = c.t;
      let pose = k < .35 ? mixPose(P.stand(), P.kickWind(), atE(c, 0, .35)) : k < .55 ? mixPose(P.kickWind(), P.trip(), atE(c, .35, .55)) : P.trip();
      const rot = k < .5 ? 0 : -lerp(0, 75, atE(c, .5, .8, 'out'));
      const ey = k < .5 ? 880 : 880 + 20 * atE(c, .5, .8);
      const bx = 1060 + Math.max(0, k - .5) * 120;
      return scene(c, { back: e.back, bb: 3, mid: PR.goal(1650, 860, 420, 200) + A(c, { who: 'eli', x: 900, y: ey, h: 280, f: 1, pose, rot, expr: k < .5 ? 'determined' : 'shock', light: LT.hotR }) + PR.ball(bx, 862, 18, k * 200), cam: CAM.drift(1000, 640, 1.08, .03)(c.p) });
    } },
  { id: 'S014', type: 'MS-side', desc: 'Side-profile piano: the rolling ball becomes the stool wheel; Eli plays awful notes, keys flash red.', w: 1, sfx: [[.05, 'piano_bad_notes', .8]],
    draw: c => {
      const e = ENV.musicroom({ t: c.T });
      const mid = PR.piano(760, 860, 1.25) + PR.stool(1080, 860, 1.2) + A(c, { who: 'eli', x: 1080, y: 740, h: 360, f: -1, pose: P.sitPiano(c.T, 3), expr: hash(Math.floor(c.t * 4)) > .5 ? 'worried' : 'shock', light: LT.warmL }) + (Math.floor(c.t * 5) % 2 ? glow(640, 690, 120, PAL.red, .5) : '');
      return scene(c, { back: e.back, bb: 5, mid, cam: CAM.drift(900, 600, 1.12, .03)(c.p) });
    } },
  { id: 'S015', type: 'TOP', desc: 'Overhead: sheet music flutters down and becomes a math test with a huge red F.', w: 1, sfx: [[.2, 'paper_flip', .7], [.6, 'comedic_sting', .5]],
    draw: c => {
      const k = atE(c, 0, .6, 'out');
      const mid = S.rect(-200, -200, 2400, 1500, '#3a2630') + S.rect(-200, -200, 2400, 1500, '#000', { opacity: .1 }) + PR.testPaper(960, 560 - (1 - k) * 300, 1.5, { grade: 'F', r: lerp(-30, 4, k), gradeK: E.outBack(seg(c.t, .5, .8)), marks: [0, 0, 1, 0, 0, 0, 0] }) + PR.pencil(1400, 820, 1.4, -30);
      return scene(c, { mid, cam: CAM.drift(960, 540, 1.02, .04)(c.p) });
    } },
] });

// ---------- B07 Noah ----------
function benchTwoShot(c, o = {}) {
  const e = ENV.school({ t: c.T });
  const mid = S.rect(560, 830, 820, 24, PAL.woodD, { rx: 4 }) + S.rect(600, 854, 20, 70, PAL.woodD) + S.rect(1320, 854, 20, 70, PAL.woodD) +
    A(c, { who: 'eli', x: 840, y: 830, h: 300, f: 1, pose: o.ePose || P.sitSlump(), expr: o.eExpr || 'sad', light: LT.hotR }) +
    A(c, { who: 'noah', x: o.nx ?? 1100, y: 830, h: 300, f: -1, pose: o.nPose || P.sit(), expr: o.nExpr || 'unimpressed', light: LT.hotR, holdSvg: o.nHold }) + PR.testPaper(o.nx ? o.nx - 300 : 800, 900, .25, { grade: 'F', r: -10 });
  return { e, mid };
}
addBeat({ id: 'B07', lines: ['L011', { id: 'L012', gap: .3 }, { id: 'L013', gap: .2 }], pre: .2, post: .5, shots: [
  { id: 'S016', type: 'MS-2', desc: 'Outside school at dusk: Eli on a bench; Noah (yellow cap, blue shirt) slides into frame holding his own D- test.', w: 1,
    draw: c => { const nx = lerp(1500, 1100, atE(c, 0, 1.2, 'out')); const r = benchTwoShot(c, { nx, nPose: c.t < 1.2 ? P.walk(c.t * 1.4) : P.sit(), nExpr: 'unimpressed', nHold: PR.testPaper(0, -40, .2, { grade: 'D-', r: 8, showMarks: false }) }); return scene(c, { back: r.e.back, bb: 5, mid: r.mid + '', cam: CAM.drift(960, 660, 1.35, .03)(c.p) }); } },
  { id: 'S017', type: 'CU', on: 'L012', desc: 'Noah close-up, deadpan: "Dude, we\'re so cooked."', w: 1,
    draw: c => { const e = ENV.school({ t: c.T }); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1060, 520], h: 1150, f: -1, pose: P.sit(), expr: 'unimpressed', light: LT.hotR, rimW: 8 }), fg: A(c, { who: 'eli', headAt: [260, 640], h: 1500, f: 1, pose: P.sitSlump(), expr: 'sad', light: LT.hotR }), fb: 18, cam: CAM.drift(960, 540, 1, .03)(c.p) }); } },
  { id: 'S018', type: 'CU', on: 'L013', desc: 'Eli reverse close-up, flat: "You think?"', w: 1,
    draw: c => { const e = ENV.school({ t: c.T }); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [860, 520], h: 1150, f: 1, pose: P.sit(), expr: 'unimpressed', light: LT.hotR, rimW: 8 }), fg: A(c, { who: 'noah', headAt: [1720, 640], h: 1500, f: -1, pose: P.sit(), expr: 'neutral', light: LT.hotR }), fb: 18, cam: CAM.drift(960, 540, 1, .03)(c.p) }); } },
] });

// ---------- B08 one morning (dawn bedroom), discovery ----------
function bedroomDesk(c, o = {}) {
  const e = ENV.bedroom({ t: c.T, lamp: o.lamp ?? 1 });
  const mid = PR.chair(880, 820, -1, 1) + A(c, { who: 'eli', x: 880, y: 720, h: 300, f: 1, pose: o.pose || P.sitWrite(c.T), expr: o.expr || 'focused', light: LT.lampR, lookY: .6 }) + PR.openBook(990, 590, 150) + PR.book(1140, 590, 80, 30, '#3a5a8a');
  return { e, mid };
}
addBeat({ id: 'B08', lines: ['L014', { id: 'L015', gap: .4 }], pre: .3, post: .4, music: { name: 'discovery', vol: .4, at: .2, fade: 2 }, shots: [
  { id: 'S019', type: 'EST', desc: 'Dawn establishing: Eli\'s window at sunrise, alarm clock reads 6:00 AM.', w: .9, sfx: [[.2, 'clock_tick_loop', .3]],
    draw: c => {
      const sky = rectGrad(0, 0, W, H, [[0, '#2a2a5e', 1], [.6, '#a86a8a', 1], [1, '#ffb38a', 1]]);
      const mid = sky + glow(1300, 900, 500, '#ffcf8a', .6) + S.circle(1300, 900 - 120 * c.p, 70, PAL.sun) + skyline(1000, 9, '#1c1636', -200, 2200, 260, .2) + S.rect(0, 0, 160, H, '#141026') + S.rect(W - 160, 0, 160, H, '#141026') + S.rect(0, 520, W, 30, '#141026') + S.rect(940, 0, 30, H, '#141026');
      return scene(c, { mid, cam: CAM.drift(960, 540, 1.04, .04)(c.p), overlay: label(1600, 960, '6:00 AM', { size: 60, k: appear(c.t, .3), fill: PAL.cream }) });
    } },
  { id: 'S020', type: 'OTS', on: 'L015', desc: 'Over-the-shoulder at desk: Eli rubs his eyes over messy notes; DAY 7 on the wall calendar (a week of struggle).', w: 1.2, sfx: [[.4, 'pencil_scratch', .35]],
    draw: c => {
      const r = bedroomDesk(c, { pose: c.t > 1.5 && c.t < 2.6 ? P.facepalm() : P.sitWrite(c.T), expr: 'unimpressed' });
      return scene(c, { back: r.e.back, bb: 6, mid: r.mid + PR.calendar(1180, 430, 7, .45), cam: CAM.drift(980, 560, 1.55, .04)(c.p) });
    } },
  { id: 'S021', type: 'INSERT', desc: 'Notebook insert: messy crossed-out working, a red question mark.', w: .8,
    draw: c => {
      let mid = S.rect(-200, -200, 2400, 1500, '#1a1426') + glow(700, 300, 700, PAL.lamp, .3) + PR.openBook(960, 980, 1500, { lines: 0 });
      const r = rng(4); for (let i = 0; i < 9; i++) mid += S.path(`M${300 + r() * 500},${330 + i * 55} q40,-20 80,0 t80,0 t${60 + r() * 120},0`, 'none', { stroke: '#4a3f6a', 'stroke-width': 6, opacity: .8 }) + (r() > .5 ? S.line(290 + r() * 400, 320 + i * 55, 600 + r() * 300, 340 + i * 55, '#c0392b', 5) : '');
      mid += S.text(1350, 640, '?', { 'font-family': 'Lilita One', 'font-size': 260, fill: '#c0392b', opacity: .8 });
      return scene(c, { mid, cam: CAM.drift(960, 540, 1.05, .05)(c.p) });
    } },
] });
addBeat({ id: 'B09', lines: ['L016', { id: 'L017', gap: .3 }], pre: .2, post: .3, shots: [
  { id: 'S022', type: 'ECU', desc: 'Extreme close-up pencil: the messy steps rearrange themselves into a clean, ordered sequence (pattern recognised).', w: 1.3, sfx: [[.1, 'pencil_scratch', .5], [1.1, 'sparkle', .5]],
    draw: c => {
      const k = atE(c, .6, 1.8);
      let mid = S.rect(-200, -200, 2400, 1500, '#efe3cf') + glow(400, 200, 700, '#fff3df', .4);
      const r = rng(8);
      for (let i = 0; i < 6; i++) {
        const mx = 420 + r() * 900, my = 220 + r() * 600, mr = (r() - .5) * 40, cx = 520, cy = 260 + i * 110;
        const x = lerp(mx, cx, k), y = lerp(my, cy, k);
        mid += S.g({ transform: `translate(${x},${y}) rotate(${lerp(mr, 0, k)})` }, S.text(0, 0, ['3x² − 12x + 9 = 0', 'x² − 4x + 3 = 0', '(x − 1)(x − 3) = 0', 'x − 1 = 0  or  x − 3 = 0', 'x = 1', 'x = 3'][i], { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 58, fill: mixc('#8a7fa0', '#2a2440', k) }));
      }
      mid += k > .95 ? S.rect(500, 820, 300, 90, 'none', { stroke: PAL.green, 'stroke-width': 8, rx: 12 }) : '';
      mid += PR.pencil(1350 + 60 * Math.sin(c.t * 12), 820 + 10 * Math.cos(c.t * 9), 2.2, -40);
      return scene(c, { mid, cam: CAM.drift(900, 560, 1.05, .05)(c.p) });
    } },
  { id: 'S023', type: 'CU', desc: 'Close-up: Eli\'s eyes widen, lamp-lit.', w: .8,
    draw: c => { const r = bedroomDesk(c); return scene(c, { back: r.e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [900, 500], h: 1150, f: 1, pose: P.sit(), expr: c.t > .4 ? 'shock' : 'focused', light: LT.lampR, rimW: 9 }), cam: CAM.push(960, 520, 1, 1.08)(c.p) }); } },
  { id: 'S024', type: 'TOP', on: 'L017', desc: 'Overhead page: problem after problem gets a green tick, tick, tick.', w: 1, sfx: [[.3, 'ui_tick', .7], [.9, 'ui_tick', .7], [1.5, 'ui_tick', .7]],
    draw: c => {
      let mid = S.rect(-200, -200, 2400, 1500, '#efe3cf');
      for (let i = 0; i < 5; i++) { mid += S.text(300, 240 + i * 150, `${i + 2}.  ${['2x + 6 = 14', 'x² = 49', '5(x − 2) = 15', '√x = 9', 'x/4 + 1 = 3'][i]}`, { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 56, fill: '#2a2440' }); if (c.t > .3 + i * .5) mid += tick(1300, 220 + i * 150, 1.6); }
      return scene(c, { mid, cam: { x: 960, y: lerp(450, 650, c.p), z: 1.05 } });
    } },
] });
// ---------- B10 the 10x proof ----------
addBeat({ id: 'B10', lines: ['L018', { id: 'L019', gap: 1.0 }], pre: .2, post: .5, shots: [
  { id: 'S025', type: 'GFX', desc: 'Proof graphic over a dimmed desk: big timer 00:00→06:00 while ordinary-Eli bar fills to 60 min; comparison "BEFORE 60 MIN / NOW 6 MIN".', w: 1, sfx: [[0, 'clock_tick_fast', .4], [3.2, 'ui_pop', .6]],
    draw: c => {
      const r = bedroomDesk(c, { pose: P.sitWrite(c.T * 2) });
      const k = atE(c, .2, 3.0, 'lin'), mins = Math.floor(k * 6), secs = Math.floor((k * 360) % 60);
      const ov = S.rect(0, 0, W, H, '#0b0709', { opacity: .55 }) + PR.timer(960, 330, `00:0${mins}:${String(secs).padStart(2, '0')}`, { w: 520, h: 150, size: 100, fill: PAL.gold }) +
        label(560, 600, 'BEFORE', { size: 40, k: appear(c.t, .3), anchor: 'end' }) + S.rect(600, 570, 900, 40, '#3a2a3a', { rx: 20 }) + S.rect(600, 570, 900 * Math.min(1, k * 10) * .999, 40, '#8a7a8a', { rx: 20 }) + label(1530, 605, '60 MIN', { size: 40, k: appear(c.t, .3), anchor: 'start' }) +
        label(560, 700, 'NOW', { size: 40, k: appear(c.t, .3), anchor: 'end', fill: PAL.gold }) + S.rect(600, 670, 900, 40, '#3a2a3a', { rx: 20 }) + S.rect(600, 670, 90 * k / 1 + 0.01, 40, PAL.gold, { rx: 20 }) + label(1530, 705, '6 MIN', { size: 40, k: appear(c.t, 3), anchor: 'start', fill: PAL.gold }) +
        label(960, 830, 'SAME UNDERSTANDING', { size: 46, k: appear(c.t, 3.2) });
      return scene(c, { back: r.e.back, bb: 8, mid: r.mid, mb: 4, cam: CAM.drift(960, 540, 1.2, .03)(c.p), overlay: ov });
    } },
  { id: 'S026', type: 'CU', on: 'L019', off: -.6, desc: 'Beat of silence, then Eli close-up: "Wait... what?"', w: 1,
    draw: c => { const r = bedroomDesk(c); return scene(c, { back: r.e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [960, 500], h: 1200, f: 1, front: true, pose: P.stand(), expr: 'shock', light: LT.lampR, rimW: 9 }), cam: CAM.push(960, 520, 1, 1.06)(c.p) }); } },
] });
addBeat({ id: 'B11', lines: ['L020', { id: 'L021', gap: .4 }], pre: .2, post: .5, shots: [
  { id: 'S027', type: 'TOP', desc: 'Overhead: Eli\'s old F math test; red crosses flip to green ticks one by one; grade becomes 9/10.', w: 1.2, sfx: [[.4, 'pencil_scratch', .4], [1.2, 'ui_tick', .6], [1.6, 'ui_tick', .6], [2.0, 'ui_tick', .6], [2.6, 'success_chime', .5]],
    draw: c => {
      const n = Math.floor(seg(c.t, .8, 2.8) * 7);
      const marks = [0, 1, 2, 3, 4, 5, 6].map(i => i < n ? (i !== 4) : (i === 2));
      const g = c.t > 2.6 ? '9/10' : 'F';
      const mid = S.rect(-200, -200, 2400, 1500, '#2a1f2a') + glow(900, 300, 800, PAL.lamp, .3) + PR.testPaper(960, 560, 1.55, { grade: g, marks, gradeK: c.t > 2.6 ? E.outBack(seg(c.t, 2.6, 2.9)) : 1 }) + bigHand(1450 - 40 * Math.sin(c.t * 4), 400 + n * 60, 1.1, 200, PAL.eli, { curl: true });
      return scene(c, { mid, cam: CAM.drift(960, 540, 1.02, .05)(c.p) });
    } },
  { id: 'S028', type: 'GFX', on: 'L021', desc: 'The rule card (objection handling): "LEARNS 10× FASTER FROM PRACTICE" with crossed-out myths: instant knowledge, super strength, perfect judgment.', w: 1.4, sfx: [[.2, 'ui_pop', .6], [1.4, 'ui_tick', .5], [1.8, 'ui_tick', .5], [2.2, 'ui_tick', .5]],
    draw: c => {
      const e = ENV.void({ t: c.T });
      const ov = label(960, 300, 'THE RULE', { size: 46, k: appear(c.t, .1), fill: PAL.gold }) + titleText([{ t: 'LEARNS 10× FASTER FROM PRACTICE', size: 72, y: 410 }], { op: appear(c.t, .3) }) +
        [['INSTANT KNOWLEDGE', 1.2], ['SUPERHUMAN BODY', 1.6], ['PERFECT JUDGMENT', 2.0]].map(([s, t0], i) => S.g({ opacity: appear(c.t, t0) }, cross(680, 560 + i * 95, .9), label(740, 580 + i * 95, s, { size: 48, k: 1, anchor: 'start', fill: '#cbbfc8' }))).join('') +
        S.g({ opacity: appear(c.t, 2.6) }, label(960, 900, 'STILL NEEDS: PRACTICE · SLEEP · TIME', { size: 40, k: 1, fill: PAL.cream }));
      return scene(c, { back: e.back, bb: 0, mid: A(c, { who: 'eli', x: 260, y: 1000, h: 520, f: 1, pose: P.think(), expr: 'focused', light: LT.warmR }), cam: CAM.drift(960, 540, 1, .02)(c.p), overlay: ov });
    } },
] });
