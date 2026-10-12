// ACT III–V — workshop conflict, tournament climax, reconciliation, piano callback.   (V2)

// ---------- helpers ----------
function pathAt(pts, k) {
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let d = clamp(k) * tot;
  for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) { const f = L[i] ? d / L[i] : 0; const a = pts[i], b = pts[i + 1]; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI]; } d -= L[i]; }
  return [...pts[pts.length - 1], 0];
}
const ROUTE_OK = [[360, 540], [600, 700], [900, 700], [1000, 420], [1220, 400], [1420, 500], [1600, 540]];
const ROUTE_FAIL = [[360, 540], [600, 700], [900, 700], [1060, 660]];
const ROUTE_RECOVER = [[1060, 660], [990, 600], [1000, 420], [1220, 400], [1420, 500], [1600, 540]];

// one shared competition clock (absolute time): 60 s at the start of the FINAL (S075) → 0:01 at the finish line (S095)
function shotStart(id) { const s = window.TL && window.TL.shots.find(x => x.id === id); return s ? s.start : 0; }
function finalSecs(T) { const s0 = shotStart('S075'), s1 = shotStart('S094b'); return T >= s1 ? 1 : Math.max(1, Math.ceil(60 - (T - s0) / (s1 - s0) * 59)); }
const fmtClock = n => n >= 60 ? '1:00' : `0:${String(n).padStart(2, '0')}`;
function finalTimer(c, x = 1650, y = 180) { return PR.timer(x, y, fmtClock(finalSecs(c.T)), { w: 220, h: 90, size: 60 }); }

function workshop(c, o = {}) {
  const e = ENV.workshop({ t: c.T, tod: o.tod ?? .35, lamp: o.lamp ?? 1 });
  let back = e.back + workbench(560, 900, 480, { photo: true }) + workbench(1380, 900, 480, { tray: '#2a4a7a', drawing: o.drawingOnBench ?? true }) + PR.stool(1380, 960, .9, '#4a5a7a');
  if (o.toolOnBench) back += PR.screwdriver(1300, 708, .55, 4, '#4aa3ff');
  back += PR.robot(560, 710, { s: .9, wheelRot: o.wheel || 0, ledBackup: false });
  return { e, back };
}
function arena(c, o = {}) {
  const T = c.T, fin = T >= shotStart('S075');
  const won = T >= shotStart('S095') + 1.2;
  const e = ENV.arena({ t: T, cheer: o.cheer || 0, warm: o.warm || 0, crowdBlur: o.crowdBlur, spot: o.spot, redSpill: o.redSpill, roundTxt: o.round || (won ? 'WINNER' : fin ? 'FINAL' : T >= shotStart('S073') + 1.5 ? 'ROUND 2' : 'ROUND 1'), clock: o.clock || (fin ? fmtClock(finalSecs(T)) : '1:00'), clockCol: won ? PAL.green : PAL.red });
  // Noah in the crowd (yellow cap), always the same seat: row 3, x=1280
  const noah = o.noahCrowd === false ? '' : A(c, { who: 'noah', x: 1280, y: 545, h: 120, f: -1, pose: o.noahPose || P.crossArms(), expr: o.noahExpr || 'unimpressed', light: LT.floodR }) + (o.noahBeam ? shaft([[1180, 175], [1300, 175], [1340, 560], [1220, 560]], '#e6ecff', .25) : '');
  return { e, back: e.back + noah };
}
function arenaTable(c) { return courseTable(380, 1540, 700) + PR.barrier(1040, 700, 70, 60, { glint: true }) + PR.barrier(1300, 700, 70, 60); }
const WARM = { tint: '#ffb070', op: .22 };

// ---------- B21 robot project with Noah ----------
addBeat({ id: 'B21', lines: ['L039', { id: 'L040', gap: .3 }], pre: .3, post: .3, music: { name: 'curious_open', vol: .3, at: 0, fade: 2 }, shots: [
  { id: 'S055', type: 'EST', desc: 'Robotics workshop, warm afternoon: Eli and Noah build the robot together and high-five. Two benches: Eli\'s (left, with a photo of the two friends) and Noah\'s (right, blue tool tray).', w: 1.2, sfx: [[0, 'workshop_ambience', .6], [2.2, 'ui_pop', .3]],
    draw: c => { const r = workshop(c); const hf = atE(c, 1.6, 2.2, 'outBack'); return scene(c, { back: r.back, bb: 2, mid: A(c, { who: 'eli', x: 860, y: 1000, h: 330, f: 1, pose: mixPose(P.hold(), P.raiseHand(), hf), expr: 'happy', light: LT.warmL }) + A(c, { who: 'noah', x: 1070, y: 1000, h: 320, f: -1, pose: mixPose(P.hold(), P.raiseHand(), hf), expr: 'happy', light: LT.warmL }), cam: CAM.drift(960, 600, 1.0, .03, 30)(c.p) }); } },
  { id: 'S056', type: 'INSERT', desc: 'Robot close-up: red stripe (Eli) and blue stripe (Noah) side by side — built together; both their hands (sleeves entering from the frame edges) tighten parts.', w: 1, sfx: [[.3, 'motor_whir', .5]],
    draw: c => { const r = workshop(c); return scene(c, { back: r.e.back, bb: 10, mid: PR.robot(960, 900, { s: 2.6, wheelRot: c.t * 90, ledBackup: false }) + bigHand(1520, 560, 1.1, 200, PAL.noah) + bigHand(400, 560, 1.1, -20, PAL.eli), cam: CAM.drift(960, 600, 1.02, .04, 30)(c.p) }); } },
  { id: 'S057', type: 'INSERT', on: 'L040', desc: 'A poster on the workshop wall: ROBOTICS CUP — WINNER QUALIFIES FOR STATE FINALS; a calendar beside it flips through months.', w: 1,
    draw: c => {
      const e = ENV.workshop({ t: c.T });
      const poster = S.g({ transform: 'rotate(-2,960,520)' }, S.rect(620, 180, 680, 700, '#d9c9ab'), S.rect(620, 180, 680, 150, '#2a1f4a'), S.text(960, 280, 'ROBOTICS CUP', { 'font-family': 'Lilita One', 'font-size': 84, fill: PAL.gold, 'text-anchor': 'middle' }), PR.robotTop(960, 520, -20, 1.6, {}), S.text(960, 760, 'WINNER QUALIFIES', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 52, fill: '#2a1f2a', 'text-anchor': 'middle' }), S.text(960, 830, 'FOR STATE FINALS', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 52, fill: '#c0392b', 'text-anchor': 'middle' }));
      return scene(c, { back: e.back, bb: 12, mid: poster, cam: CAM.push(960, 540, 1.0, 1.08)(c.p) });
    } },
  { id: 'S057b', type: 'INSERT', w: .8, desc: 'Calendar on the workshop wall: months flip by — they spent months building it.', sfx: [[.2, 'paper_flip', .5], [.8, 'paper_flip', .5], [1.4, 'paper_flip', .5]],
    draw: c => { const e = ENV.workshop({ t: c.T }); const n = Math.floor(c.t / .6), f = (c.t % .6) / .6; const m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'][Math.min(6, n)]; return scene(c, { back: e.back, bb: 12, mid: S.g({ transform: 'translate(960,560) scale(2.2)' }, S.rect(-90, -110, 180, 220, '#d9c9ab', { rx: 8 }), S.rect(-90, -110, 180, 60, '#d23b3b', { rx: 8 }), S.text(0, -66, m, { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 40, fill: '#fff', 'text-anchor': 'middle' }), S.text(0, 60, 'ROBOT', { 'font-family': 'Lilita One', 'font-size': 34, fill: '#3a302a', 'text-anchor': 'middle' }), S.g({ transform: `translate(0,${-f * 140}) rotate(${-f * 25})`, opacity: 1 - f }, S.rect(-90, -110, 180, 220, '#e9dcc4', { rx: 8 }))), cam: CAM.drift(960, 540, 1.05, .05, 30)(c.p) }); } },
] });
// ---------- B22 Eli outpaces Noah ----------
addBeat({ id: 'B22', lines: ['L041'], pre: .2, post: .3, shots: [
  { id: 'S058', type: 'MS-2', desc: 'Pace contrast: Eli types at blurring speed (motion-trail arms, code scrolling) while Noah slowly turns pages of a manual.', w: 1, sfx: [[0, 'keyboard_typing', .5]],
    draw: c => {
      const r = workshop(c);
      const fast = t => ({ ...P.controller(t), fa: [52 + 18 * Math.sin(t * 30), 72], ba: [48 + 18 * Math.cos(t * 28), 76] });
      const eh = PR.stool(760, 1000, 1.1) + A(c, { who: 'eli', x: 760, y: 893, h: 360, f: 1, pose: { ...fast(c.T), fl: [88, 92], bl: [84, 88], sit: true }, expr: 'busy', lookY: 1, light: LT.warmL });
      const nk = (c.t % 1.2) / 1.2;
      return scene(c, { back: r.back, bb: 5, mid: ghosts(dt => A({ ...c, T: c.T + dt }, { who: 'eli', x: 760, y: 893, h: 360, f: 1, pose: { ...fast(c.T + dt), fl: [88, 92], bl: [84, 88], sit: true }, expr: 'busy', light: { none: true } }), 4, .025, .35) + eh + PR.laptop(980, 800, .6, codeScreen((c.t * 2) % 1)) + A(c, { who: 'noah', x: 1300, y: 1000, h: 350, f: -1, pose: { ...P.hold(), fa: [62 + 10 * Math.sin(nk * Math.PI), 60] }, expr: 'worried', lookY: 1, light: LT.warmL, holdSvg: PR.book(0, 0, 90, 60, '#3a5a8a') }), cam: CAM.drift(1000, 640, 1.2, .03, 30)(c.p) });
    } },
] });
// ---------- B23 the plant: backup sensor ----------
addBeat({ id: 'B23', minShot: 1.0, lines: ['L042', { id: 'L043', gap: -.25 }], pre: .3, post: .4, shots: [
  { id: 'S059', type: 'MS-2', desc: 'Noah, eager, holds up his sensor drawing and points at it: "the metal barriers could confuse this sensor. I added a backup on the left..." Eli works at his bench, half-listening.', w: 1, sfx: [[0, 'workshop_ambience', .5]],
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 6, mid: A(c, { who: 'noah', x: 1200, y: 1060, h: 520, f: -1, pose: P.point(), expr: 'happy', light: LT.warmL, holdSvg: '' }) + PR.circuitDiagram(1010, 640, .45, { backup: true, metal: true, r: 4 }) + A(c, { who: 'eli', x: 600, y: 1060, h: 500, f: -1, pose: P.controller(c.T), expr: 'busy', lookY: 1, light: LT.warmL }), cam: CAM.drift(940, 600, 1.15, .03, 30)(c.p) }); } },
  { id: 'S060', type: 'INSERT', at: 3.2, desc: 'Insert of Noah\'s diagram: METAL barrier note, BACKUP sensor labelled LEFT; then the real robot\'s blue backup box on its left side lights up (labelled).', w: 1, sfx: [[.1, 'ui_pop', .5]],
    draw: c => {
      const e = ENV.workshop({ t: c.T });
      if (c.t < c.d * .55) return scene(c, { back: e.back, bb: 12, mid: PR.circuitDiagram(960, 540, 2.3, { backup: true, metal: true, note: 'METAL CAN CONFUSE IT!', r: -2 }) + bigHand(1500, 640, 1, 190, PAL.noah, { point: true }), cam: CAM.drift(960, 540, 1, .05, 30)(c.p) });
      return scene(c, { back: e.back, bb: 12, mid: PR.robot(1180, 980, { s: 3.0, ledBackup: true }) + glow(745, 722, 200, '#6fd0ff', .35), cam: CAM.push(900, 640, 1.0, 1.12)(seg(c.p, .55, 1)), overlay: label(760, 420, 'BACKUP SENSOR · LEFT SIDE', { size: 44, k: appear(c.t, c.d * .6), fill: '#9fdcff' }) + S.line(760, 440, 760, 600, '#9fdcff', 4, { opacity: appear(c.t, c.d * .6) }) });
    } },
  { id: 'S061', type: 'MS-rev', on: 'L043', off: -.05, desc: 'Reverse angle from Noah\'s side (shelves behind): Eli, seated at his bench with his back three-quarter to Noah, doesn\'t look up: "Already fixed it." Noah\'s sentence is cut off.', w: 1, sfx: [[.1, 'electric_switch', .3]],
    draw: c => { const e = ENV.workshopRev({ t: c.T }); return scene(c, { back: e.back, bb: 8, mid: A(c, { who: 'eli', headAt: [1000, 520], h: 900, f: 1, turn: .95, pose: P.controller(c.T), expr: 'busy', lookY: 1, light: LT.coolL }) + PR.laptop(1380, 980, 1.2, codeScreen(1)) + glow(1300, 760, 380, '#8fb0ff', .35), fg: A(c, { who: 'noah', headAt: [260, 380], h: 1300, front: true, back: true, pose: P.stand(), light: LT.coolL }), fb: 16, cam: CAM.drift(1000, 560, 1, .03, 30)(c.p) }); } },
] });
addBeat({ id: 'B24', lines: ['L044', { id: 'L045', gap: .1 }, { id: 'L046', gap: .6 }, { id: 'L047', gap: .5 }], pre: .2, post: 5.4, music: { name: 'stop', onLine: 'L046', off: -.2 }, shots: [
  { id: 'S062', type: 'OTS', desc: 'Over Eli\'s shoulder (Eli from behind, foreground): Noah tries again, "Oh. Well, what about the steering?"', w: 1,
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 7, mid: A(c, { who: 'noah', headAt: [1180, 480], h: 820, f: -1, pose: P.hold(), expr: 'worried', lookX: .6, light: LT.warmL }), fg: A(c, { who: 'eli', headAt: [420, 640], h: 1300, front: true, back: true, pose: P.controller(c.T), light: LT.warmL }), fb: 18, cam: CAM.drift(960, 560, 1, .03, 30)(c.p) }); } },
  { id: 'S063', type: 'TOP', on: 'L045', desc: 'Top-down over Eli\'s bench: his hands type on the laptop; Noah\'s hand slides his diagram in — Eli pushes it aside without looking: "Fixed that too."', w: 1, sfx: [[0, 'keyboard_typing', .5], [.8, 'paper_flip', .5]],
    draw: c => { const push = atE(c, .7, 1.2); const mid = S.rect(-200, -200, 2400, 1500, '#5a3e32') + glow(800, 400, 900, PAL.lamp, .25) + PR.laptop(860, 760, 2.0, codeScreen((c.t * 1.5) % 1)) + PR.circuitDiagram(lerp(1450, 1750, push), lerp(560, 400, push), .9, { backup: true, r: lerp(-6, -24, push) }) + bigHand(lerp(1650, 1800, push), 620, 1, 190, PAL.noah) + bigHand(620, 820, 1.1, -70, PAL.eli, { curl: true }) + bigHand(1050 + 60 * push, 820 - 80 * push, 1.1, -110, PAL.eli, { curl: true }); return scene(c, { mid, vignette: .72, cam: CAM.drift(1000, 560, 1.0, .03, 30)(c.p) }); } },
  { id: 'S064', type: 'CU', on: 'L046', off: -.4, desc: 'Noah close-up, hurt: "Dude, can I at least do something?" The music has dropped out.', w: 1,
    draw: c => { const r = workshop(c, { tod: .6 }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1180, 450], h: 1150, f: -1, pose: P.stand(), expr: 'sad', light: LT.warmL }), cam: CAM.push(1100, 520, 1, 1.05)(c.p) }); } },
  { id: 'S065', type: 'OTS', on: 'L047', desc: 'Over Noah\'s shoulder: Eli, back turned, still typing: "I mean... I\'ll probably finish it faster."', w: 1,
    draw: c => { const r = { back: ENV.workshopRev({ t: c.T }).back }; return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'eli', headAt: [820, 540], h: 880, f: -1, front: true, back: true, pose: P.controller(c.T), light: LT.warmL }) + PR.laptop(820, 1060, 1.3, codeScreen((c.t * .8) % 1)) + glow(820, 900, 300, '#8fb0ff', .3), fg: A(c, { who: 'noah', headAt: [1650, 420], h: 1300, front: true, back: true, pose: P.stand(), light: LT.warmL }), fb: 16, cam: CAM.drift(900, 560, 1, .03, 30)(c.p) }); } },
  { id: 'S066', type: 'MCU-hold', hold: true, at: -5.2, desc: 'HOLD on Noah in silence (no music). He hesitates, then slowly lowers his small blue screwdriver onto his bench in the foreground — one isolated click — head dropping.', w: 1, sfx: [[0, 'workshop_ambience', .35], [3.0, 'tool_place', 2.2]],
    draw: c => {
      const r = workshop(c, { tod: .75, lamp: .5 });
      const k = atE(c, 1.0, 2.7, 'inOut');
      const n = actor(c, { who: 'noah', headAt: [960, 420 + 14 * k], h: 1000, f: -1, pose: P.placeTool(k), expr: 'sad', lookY: .8 + .2 * k, blink: c.t > 4 && c.t < 4.12, light: LT.warmL, still: c.t > 2.7 });
      const benchY = 880;
      const bench = S.rect(200, benchY, 1600, 40, '#6a4a3a', { rx: 6 }) + S.rect(200, benchY, 1600, 8, PAL.rim, { opacity: .45 }) + S.rect(200, benchY + 40, 1600, 200, '#3a2620');
      // tool: in the hand until 2.7 s, then eased down onto the bench over 6 frames with a small rotation settle
      const rel = at(c, 2.75, 3.0), hx = n.handF[0], hy = n.handF[1];
      const tx = lerp(hx, hx + 10, rel), ty = lerp(hy, benchY - 8, E.inOut(rel)), rot = lerp(80, 0, E.out(rel)) + (c.t > 3.0 ? 4 * Math.max(0, 1 - (c.t - 3) / .15) : 0);
      return scene(c, { back: r.back, bb: 10, mid: n.svg + bench + PR.screwdriver(tx, ty, .5, rot, '#4aa3ff'), cam: CAM.push(960, 520, 1.0, 1.08, 'sine')(c.p), grade: { tint: '#6a5aa0', op: .18 } });
    } },
] });
addBeat({ id: 'B25', lines: [], min: 5.6, shots: [
  { id: 'S067', type: 'WS-hold', hold: true, desc: 'From the workshop doorway: Noah walks out toward camera and past it without a word; behind him Eli, small, keeps working at his bench, back turned. Noah\'s screwdriver lies on his empty bench.', w: 1, sfx: [[0, 'workshop_ambience', .35], [3.6, 'door_close', 3.0]],
    draw: c => {
      const k = at(c, .2, 3.0), door = c.t < 2.6 ? atE(c, 2.0, 2.5) : 1 - atE(c, 3.3, 3.7);
      const e = ENV.workshopRev({ t: c.T, door });
      const nx = lerp(900, 1590, k), out = c.t > 3.0;
      return scene(c, { back: e.back, bb: 3, mid: out ? '' : A(c, { who: 'noah', x: nx, y: 860, h: 330, f: 1, pose: P.walk(walkPh(nx - 900, 330)), expr: 'sad', lookY: .8, light: LT.coolL, opacity: c.t > 2.7 ? 1 - at(c, 2.7, 3.0) : 1 }), fg: A(c, { who: 'eli', headAt: [300, 560], h: 1300, f: 1, front: true, back: true, pose: P.controller(c.T), light: LT.coolL }) + PR.screwdriver(560, 1000, 1.1, 6, '#4aa3ff'), fb: 14, cam: CAM.move([1100, 560, 1.08], [1200, 560, .98])(c.p), grade: { tint: '#6a5aa0', op: .18 } });
    } },
] });
// ---------- B26 empty workspace time-lapse ----------
addBeat({ id: 'B26', minShot: 3.5, lines: ['L048', { id: 'L049', gap: .3 }, { id: 'L050', gap: .4 }], pre: 1.5, post: .8, music: { name: 'sad_piano', vol: .4, at: 0, fade: 2 }, shots: [
  { id: 'S068', type: 'WS-timelapse', hold: true, desc: 'One fixed wide over several afternoons: sunlight sweeps across the workshop again and again; Eli alone works faster, the robot gets more polished; Noah\'s bench stays empty (his screwdriver still lying there); the photo of the two friends sits on Eli\'s bench.', w: 1.6, sfx: [[0, 'clock_tick_loop', .3]],
    draw: c => { const tod = (c.t / 2.2) % 1; const r = workshop(c, { tod, toolOnBench: true }); return scene(c, { back: r.back, bb: 1, mid: A(c, { who: 'eli', x: 700 + 40 * Math.sin(c.t * 3), y: 1000, h: 330, f: -1, turn: .95, pose: P.controller(c.T * 3), expr: 'busy', lookY: 1, light: { dx: -1, dy: -.3, color: mixc(PAL.rim, PAL.rimCool, tod) } }) + label(1380, 640, `DAY ${1 + Math.floor(c.t / 2.2)}`, { size: 36, k: 1, op: .7 }), cam: CAM.push(1000, 640, 1.0, 1.15, 'lin')(c.p), grade: { tint: mixc('#ffb070', '#4a5aff', tod), op: .25 } }); } },
  { id: 'S069', type: 'CU', on: 'L050', desc: 'Close-up: Eli glances at the empty stool, then back to work. Cool light.', w: 1,
    draw: c => { const r = workshop(c, { tod: .9 }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [720, 450], h: 1100, f: 1, pose: P.stand(), expr: 'sad', lookX: c.t < 1.4 ? 1 : 0, light: LT.coolL }), cam: CAM.drift(800, 540, 1, .03)(c.p), grade: { tint: '#4a5aff', op: .3 } }); } },
] });

// ---------- ACT IV: tournament ----------
addBeat({ id: 'B27', lines: ['L051'], pre: .5, post: .3, music: { name: 'tension_competition', vol: .3, at: 0, fade: 1 }, sfx: [[0, 'crowd_cheer', .3]], shots: [
  { id: 'S070', type: 'EST', tin: 'whip', desc: 'Tournament hall wide: ROBOTICS CUP banner, floodlights and haze, crowd in the bleachers, course table with metal barriers.', w: 1,
    draw: c => { const r = arena(c, { cheer: .3 }); return scene(c, { back: r.back, bb: 1, mid: arenaTable(c) + PR.robot(560, 700, { s: .7 }), cam: CAM.move([960, 520, 1.15], [960, 560, 1.0])(c.p) }); } },
  { id: 'S071', type: 'MS', desc: 'Eli alone at the team station; the name card reads TEAM: ELI & NOAH (Noah is still officially registered). Telephoto: Noah, arms crossed, in the crowd under a pale beam.', w: 1.2,
    draw: c => {
      const r = arena(c, { noahBeam: c.t >= c.d * .6 });
      const card = S.g({}, S.rect(-160, -50, 320, 90, '#d9c9ab', { rx: 6 }), S.text(0, 10, 'TEAM: ELI & NOAH', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 36, fill: '#2a1f2a', 'text-anchor': 'middle' }));
      return scene(c, { back: r.back, bb: 9, mid: A(c, { who: 'eli', x: 860, y: 1080, h: 640, f: 1, pose: P.controller(c.T), expr: 'busy', light: LT.floodL }) + S.rect(500, 860, 900, 300, '#24304a') + S.g({ transform: 'translate(1150,920)' }, card) + PR.stool(1350, 1100, 1, '#4a5a7a'), cam: CAM.drift(960, 620, 1.0, .03, 30)(c.p) });
    } },
  { id: 'S071b', type: 'TELE', w: .7, desc: 'Telephoto: Noah, arms crossed, sitting in the crowd under a pale beam — he came, but not as part of the team.',
    draw: c => { const r = arena(c, { noahBeam: true, crowdBlur: 3, spot: [1280, 500] }); return scene(c, { back: r.back, bb: 0, cam: { x: 1280, y: 480, z: 3.0 + .2 * c.p } }); } },
] });
function topRun(c, route, k, o = {}) {
  const [x, y, a] = pathAt(route, k);
  return courseTop({ route: ROUTE_OK, routeOp: o.routeOp ?? .35, hiBar: o.hiBar, hiK: o.hiK, bad: o.bad }) + PR.robotTop(x, y, a, 1, { ledMain: o.ledMain, ledBackup: o.ledBackup });
}
addBeat({ id: 'B28', lines: ['L052', { id: 'L053', gap: .3 }, { id: 'L054', gap: .3 }], pre: .2, post: .6, minShot: 1.6, shots: [
  { id: 'S072', type: 'LOW', w: .6, desc: 'Low tracking shot beside the robot racing along the table: table seams and blurred foreground posts whip past, speed lines behind it.', w: 1, sfx: [[0, 'motor_whir', .7]],
    draw: c => {
      const r = arena(c, { cheer: .4 }); const x = lerp(-1200, 3000, c.p);
      let seams = ''; for (let i = -10; i < 30; i++) seams += S.line(i * 160, 770, i * 160 - 60, 1100, '#3a4a6a', 4);
      const speed = [0, 1, 2, 3].map(i => S.line(x - 260 - i * 30, 700 + i * 22, x - 260 - i * 30 - 160 - 60 * hash(i), 700 + i * 22, '#e6ecff', 4, { opacity: .5 })).join('');
      const posts = [0, 1, 2, 3, 4, 5].map(i => S.rect(i * 700 - 200, 500, 70, 900, '#0b0810')).join('');
      return scene(c, { back: r.back, bb: 10, mid: S.rect(-600, 760, 3200, 400, '#24304a') + seams + speed + PR.robot(x, 820 + noise1(c.t * 30) * 2, { s: 1.6, wheelRot: c.t * 720 }) + ghosts(dt => PR.robot(x + dt * 900, 820, { s: 1.6 }), 3, .03, .25), fg: posts, fp: 1.6, fb: 14, cam: { x: x + 100, y: 640, z: 1.0 } });
    } },
  { id: 'S072b', type: 'TOP', w: .5, tin: 'whip', desc: 'Whip to overhead: the robot zips through the course corners at speed, motion-blurred.', sfx: [[0, 'whoosh', .4]],
    draw: c => scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + ghosts(dt => PR.robotTop(...pathAt(ROUTE_OK, ((c.t + dt) * .35) % 1).slice(0, 2), pathAt(ROUTE_OK, ((c.t + dt) * .35) % 1)[2], 1), 4, .03, .3) + courseTop({ route: ROUTE_OK, routeOp: .2 }) + PR.robotTop(...pathAt(ROUTE_OK, (c.t * .35) % 1), 1), cam: { x: 960, y: 540, z: 1.25, r: lerp(-6, 0, c.p) } }) },
  { id: 'S073', type: 'TOP', on: 'L053', desc: 'Overhead course: the robot weaves around the barriers along the dotted route and finishes — ROUND 1 ✓, then ROUND 2 ✓.', w: 1, sfx: [[0, 'timer_beep', .6], [1.6, 'crowd_cheer', .5]],
    draw: c => scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + topRun(c, ROUTE_OK, ((c.t / (c.d * .48)) % 1)), cam: CAM.push(960, 540, .98, 1.05)(c.p), overlay: label(960, 120, c.t < c.d * .5 ? 'ROUND 1' : 'ROUND 2', { size: 54, k: 1, fill: PAL.gold }) + (c.t > c.d * .45 ? tick(1700, 120, 1.4) : '') + (c.t > c.d * .93 ? tick(1780, 120, 1.4) : '') }) },
  { id: 'S074', type: 'MS', on: 'L054', desc: 'Announcer with headset mic, arm thrown out to the side (face clear): "And Eli\'s team advances to the final!" Crowd cheers.', w: 1, sfx: [[.2, 'crowd_cheer', .8]],
    draw: c => { const r = arena(c, { cheer: 1 }); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'announcer', x: 900, y: 1160, h: 760, f: 1, pose: { ...P.stand(), ba: [135, 10], fa: [55, 120] }, expr: 'happy', light: LT.floodL }), cam: CAM.drift(960, 600, 1, .03, 30)(c.p) }); } },
] });
addBeat({ id: 'B29', lines: ['L055', { id: 'L056', gap: .3 }], pre: .3, post: .2, minShot: 1.3, shots: [
  { id: 'S075', type: 'INSERT', desc: 'Scoreboard flips to FINAL, clock starts at 0:60 in red; the music tightens.', w: .8, sfx: [[0, 'timer_beep', .8], [.2, 'clock_tick_fast', .5]],
    draw: c => { const r = arena(c, { crowdBlur: 4, redSpill: true }); return scene(c, { back: r.back, bb: 0, cam: { x: 1610, y: 380, z: 3.0 + .15 * c.p } }); } },
  { id: 'S076', type: 'POV', on: 'L056', dur: 1.6, desc: 'Robot POV rushing toward a shiny METAL barrier; the orange main-sensor LED flickers.', sfx: [[.4, 'sensor_warning', .8]],
    draw: c => { const r = arena(c); const z = lerp(1, 2.2, E.in(c.p)); const fl = Math.floor(c.t * 14) % 2; return scene(c, { back: r.back, bb: 10, mid: S.rect(-600, 760, 3200, 400, '#24304a') + PR.barrier(960, 790, 300, 200, { glint: true }), cam: { x: 960, y: 640, z }, overlay: S.g({ opacity: fl ? 1 : .2 }, glow(220, 900, 160, PAL.glow, .8), S.circle(220, 900, 26, PAL.glow)) + label(960, 200, 'METAL BARRIER', { size: 40, k: appear(c.t, .3), fill: '#c6c8d6' }) + finalTimer(c) }); } },
  { id: 'S077', type: 'TOP', w: .8, desc: 'Overhead: the robot suddenly veers the wrong way and bumps the barrier; red wrong-route line; clock running.', sfx: [[.6, 'robot_bump', .9], [.8, 'crowd_gasp', .7]],
    draw: c => scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + topRun(c, ROUTE_FAIL, atE(c, 0, .7, 'lin'), { hiBar: 1, hiK: at(c, .6, .9), ledMain: Math.floor(c.t * 14) % 2 ? 'off' : 'on', bad: c.t > .5 ? [[900, 700], [1080, 650]] : null }), cam: { x: 960, y: 560, z: 1.0 + .15 * at(c, .6, 1) }, shake: c.t > .6 && c.t < .9 ? 8 : 0, overlay: finalTimer(c) }) },
] });
addBeat({ id: 'B30', minShot: 1.5, lines: ['L057', { id: 'L058', gap: .3 }], pre: .1, post: .2, shots: [
  { id: 'S078', type: 'CU', desc: 'Eli panics, hands on his head: "No, no, no. WHAT?!"', w: 1, sfx: [[0, 'heartbeat_muffled', .5]],
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [960, 460], h: 1000, f: 1, front: true, pose: poseAt(c.t, [[0, P.stand()], [.15, { ...P.stand(), lean: -6 }], [.4, P.panic(), 'outBack']]), expr: 'panic', light: LT.floodL }), cam: CAM.drift(960, 540, 1, .03)(c.p), shake: 3, overlay: finalTimer(c) }); } },
  { id: 'S079', type: 'INSERT', on: 'L058', desc: 'Diagnostic laptop: SOFTWARE ✓ OK, MOTORS ✓ OK — nothing wrong found; the timer keeps falling.', w: 1, sfx: [[.4, 'ui_tick', .6], [2.0, 'ui_tick', .6]],
    draw: c => {
      const scr = S.rect(0, 0, 296, 186, '#0e0c1a') + S.text(14, 30, 'DIAGNOSTICS', { 'font-family': 'Oswald', 'font-size': 18, fill: '#9a96b0' }) + (c.t > .4 ? S.text(14, 70, 'SOFTWARE ....... OK', { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 15, fill: '#7dffa6' }) : '') + (c.t > 2 ? S.text(14, 100, 'MOTORS ......... OK', { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 15, fill: '#7dffa6' }) : '') + (c.t > 2.6 ? S.text(14, 140, 'ERROR SOURCE:  ???', { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 15, fill: '#ff8a8a' }) : '');
      const r = arena(c); return scene(c, { back: r.back, bb: 14, mid: PR.laptop(960, 900, 2.4, scr), cam: CAM.push(960, 600, 1, 1.08)(c.p), overlay: finalTimer(c) });
    } },
] });
addBeat({ id: 'B31', lines: ['L059', { id: 'L060', gap: .4 }], pre: .2, post: .2, shots: [
  { id: 'S080', type: 'MS', desc: 'Eli frozen at the station, the crowd blurred and muffled; the timer ticks.', w: 1, sfx: [[0, 'clock_tick_fast', .5]],
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 16, mid: A(c, { who: 'eli', x: 960, y: 1180, h: 760, f: 1, front: true, pose: P.slump(), expr: 'worried', light: LT.coolL }), cam: CAM.push(960, 600, 1, 1.1, 'lin')(c.p), grade: { tint: '#4a5aff', op: .3 }, overlay: finalTimer(c) }); } },
  { id: 'S080b', type: 'INSERT', w: .6, desc: 'Cutaway: the robot stuck against the barrier, wheels spinning, orange LED flickering.', sfx: [[0, 'motor_whir', .5]],
    draw: c => { const r = arena(c); const fl = Math.floor(c.t * 12) % 2; return scene(c, { back: r.back, bb: 12, mid: S.rect(-600, 760, 3200, 400, '#24304a') + PR.barrier(1180, 790, 160, 140, { glint: true }) + PR.robot(900, 880, { s: 1.8, wheelRot: c.t * 900, ledMain: fl ? 'off' : 'on' }), cam: { x: 1000, y: 680, z: 1.1 }, shake: 2, overlay: finalTimer(c) }); } },
  { id: 'S081', type: 'ECU', desc: 'Extreme close-up on Eli\'s eyes: this isn\'t something he can learn his way out of.', w: .8, sfx: [[0, 'heartbeat_muffled', .6]],
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 16, mid: A(c, { who: 'eli', headAt: [760, 560], h: 2400, f: 1, front: true, pose: P.stand(), expr: 'worried', light: LT.floodL, hideMouth: true }), cam: { x: 900, y: 520, z: 1 + .05 * c.p } }); } },
  { id: 'S082', type: 'TELE', on: 'L060', desc: 'Eli looks up; a telephoto shot isolates Noah (yellow cap) in the crowd, picked out by a pale beam.', w: 1,
    draw: c => { const r = arena(c, { noahExpr: 'worried', noahPose: P.stand(), noahBeam: true, crowdBlur: 3, spot: [1280, 500] }); return scene(c, { back: r.back, bb: 0, cam: { x: 1280, y: 480, z: lerp(2.6, 3.4, E.out(c.p)) }, overlay: finalTimer(c) }); } },
] });
addBeat({ id: 'B32', lines: ['L061', { id: 'L062', gap: .15 }, { id: 'L063', gap: .2 }, { id: 'L064', gap: .2 }], pre: .1, post: .3, minShot: 1.4, shots: [
  { id: 'S083', type: 'CU', desc: 'Eli shouts across the hall: "NOAH!"', w: 1,
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [700, 460], h: 1000, f: 1, pose: poseAt(c.t, [[0, { ...P.stand(), lean: -6 }], [.15, P.shout(), 'outBack']]), expr: 'shout', light: LT.floodR }), cam: CAM.drift(800, 540, 1, .03)(c.p), shake: c.t < .3 ? 4 : 0, overlay: finalTimer(c) }); } },
  { id: 'S084', type: 'WS-geo', on: 'L062', desc: 'Geography wide from behind Eli at the station: across the hall, Noah stands up in the bleachers: "What?!"', w: 1,
    draw: c => { const r = arena(c, { noahPose: mixPose(P.crossArms(), P.shout(), atE(c, 0, .4, 'outBack')), noahExpr: 'shock', noahBeam: true }); return scene(c, { back: r.back, bb: 2, mid: arenaTable(c) + PR.robot(990, 700, { s: .5, wheelRot: c.t * 800, ledMain: Math.floor(c.t * 12) % 2 ? 'off' : 'on' }), fg: A(c, { who: 'eli', headAt: [460, 520], h: 900, front: true, back: true, pose: P.shout(), light: LT.floodL }), fb: 8, fp: 1.1, cam: { x: lerp(1060, 1140, c.p), y: 540, z: lerp(1.2, 1.3, c.p) }, overlay: finalTimer(c) }); } },
  { id: 'S085', type: 'OTS-high', on: 'L063', desc: 'High angle over Noah\'s shoulder down to Eli at the station: "Remember that sensor setup...? Why did you want to change it?"', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false }); return scene(c, { back: r.back, bb: 10, mid: A(c, { who: 'eli', x: 980, y: 1080, h: 560, f: 1, pose: P.point(), expr: 'worried', lookY: -1, light: LT.floodL }) + S.rect(560, 960, 900, 300, '#24304a'), fg: A(c, { who: 'noah', headAt: [1560, 360], h: 1300, front: true, back: true, pose: P.stand(), light: LT.floodR }), fb: 16, cam: { x: 1000, y: lerp(560, 640, c.p), z: lerp(1.0, 1.08, c.p), r: -3 }, overlay: finalTimer(c) }); } },
  { id: 'S086', type: 'CU', on: 'L064', desc: 'Noah close-up, frustrated: "Because the metal barriers mess with the readings! I told you that three weeks ago!"', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1200, 460], h: 1050, f: -1, pose: P.shout(), expr: 'shout', light: LT.floodR }), cam: CAM.drift(1100, 540, 1, .03)(c.p), overlay: finalTimer(c) }); } },
  { id: 'S086b', type: 'INSERT', on: 'L064', off: 2.4, min: 1.2, desc: 'Cutaway under Noah\'s line: the robot still jammed against the metal barrier, wheels spinning, orange LED flickering.', sfx: [[0, 'motor_whir', .4]],
    draw: c => { const r = arena(c); const fl = Math.floor(c.t * 12) % 2; return scene(c, { back: r.back, bb: 12, mid: S.rect(-600, 760, 3200, 400, '#24304a') + PR.barrier(1180, 790, 160, 140, { glint: true }) + PR.robot(900, 880, { s: 1.8, wheelRot: c.t * 900, ledMain: fl ? 'off' : 'on' }), cam: CAM.push(1000, 680, 1.1, 1.2)(c.p), overlay: finalTimer(c) }); } },
] });
// ---------- B33 payoff of the plant (flashback; no narration — the picture carries it) ----------
addBeat({ id: 'B33', lines: [], min: 3.8, music: { name: 'stop', at: 0 }, shots: [
  { id: 'S087', type: 'FLASH', tin: 'flash', desc: 'Sepia flashback that exactly matches S059: Noah holding up the diagram and pointing (BACKUP · LEFT, METAL); Eli not listening; the soft tool-click returns.', w: 1.4, sfx: [[.1, 'sparkle', .4], [1.4, 'tool_place', 2.2]],
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 6, mid: A(c, { who: 'noah', x: 1200, y: 1060, h: 520, f: -1, pose: P.point(), expr: 'happy', light: LT.sepia }) + PR.circuitDiagram(1010, 640, .45, { backup: true, metal: true, r: 4 }) + A(c, { who: 'eli', x: 600, y: 1060, h: 500, f: -1, pose: P.controller(c.T), expr: 'busy', lookY: 1, light: LT.sepia }), cam: CAM.push(980, 600, 1.15, 1.3)(c.p), grade: { sat: .1, sepia: '#c8a878' }, vignette: .85, grain: .12 }); } },
  { id: 'S088', type: 'CU', desc: 'Back in the hall: Eli freezes — guilty realisation.', w: 1,
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [1180, 460], h: 1050, f: -1, front: true, pose: P.stand(), expr: 'sad', light: LT.floodR }), cam: CAM.push(1100, 520, 1, 1.06)(c.p), overlay: finalTimer(c) }); } },
] });
addBeat({ id: 'B34', lines: ['L066', { id: 'L067', gap: .15 }], pre: .1, post: .2, minShot: 1.3, music: { name: 'tension_competition', vol: .32, at: 0, fade: .2 }, shots: [
  { id: 'S089', type: 'LOW', desc: 'Low angle on Eli, the timer large in the foreground: "Okay! What do I do?!"', w: 1,
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 10, mid: A(c, { who: 'eli', x: 900, y: 1300, h: 900, f: 1, pose: P.shrug(), expr: 'panic', light: LT.floodL }), cam: { x: 900, y: lerp(640, 580, c.p), z: lerp(1, 1.06, c.p), r: 4 }, overlay: finalTimer(c, 1500, 900) }); } },
  { id: 'S090', type: 'TELE', on: 'L067', desc: 'Telephoto push on Noah in the bleachers, pointing hard to his left: "Switch to the backup sensor! LEFT SIDE!"', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false, cheer: .3 }); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'noah', x: 1000, y: 1150, h: 720, f: -1, pose: P.point(), expr: 'shout', light: LT.floodR }), cam: CAM.push(1000, 560, 1, 1.15, 'out')(c.p), overlay: finalTimer(c) }); } },
] });
addBeat({ id: 'B35', lines: ['L068'], pre: .2, post: .4, minShot: 1.2, music: { name: 'stop', at: .15 }, shots: [
  { id: 'S091', type: 'INSERT', desc: 'Tight on the controller: Eli\'s thumb flips the switch MAIN → BACKUP SENSOR; zap.', w: .8, sfx: [[.3, 'electric_switch', .9]],
    draw: c => { const r = arena(c); const on = c.t > .35; return scene(c, { back: r.back, bb: 16, mid: PR.controller(960, 560, 3.2, { sw: on }) + bigHand(1260 + (on ? 70 : 0), 420, 1.2, 160, PAL.eli, { point: true }), cam: CAM.drift(960, 560, 1, .03)(c.p), flash: on ? clamp(1 - (c.t - .35) / .15) * .5 : 0, overlay: finalTimer(c) }); } },
  { id: 'S091b', type: 'ECU', dur: 1.0, tin: 'flash', desc: 'Extreme close-up on the robot\'s rear-left corner — the same blue BACKUP box labelled in S060 — its LED ignites and floods the dark chassis with blue light.', music: { name: 'triumph_resolve', vol: .4, fade: .3, at: .3 }, sfx: [[.15, 'sparkle', .5]],
    draw: c => {
      const r = arena(c); const on = c.t > .2, k = on ? E.out(clamp((c.t - .2) / .2)) : 0;
      const chassis = S.rect(200, 260, 1500, 620, '#1c2233', { rx: 60 }) + S.rect(200, 260, 1500, 30, PAL.rim, { opacity: .35, rx: 15 }) + S.rect(320, 420, 1200, 40, '#d7383a', { rx: 10 }) + S.rect(320, 480, 1200, 40, '#8cc7f0', { rx: 10 });
      const box = S.rect(560, 560, 420, 300, '#3b7bd2', { rx: 30 }) + S.rect(560, 560, 420, 20, '#6aa0e8', { rx: 10 }) + S.circle(770, 710, 46, mixc('#1f3b5a', '#bff0ff', k)) + (on ? glow(770, 710, 420, '#6fd0ff', .85 * k) + glow(770, 710, 120, '#ffffff', .8 * k) + S.rect(200, 260, 1500, 620, '#4aa3ff', { opacity: .18 * k, rx: 60 }) : '');
      return scene(c, { back: r.back, bb: 18, mid: chassis + box, cam: { x: 900, y: 600, z: 1.1 + .05 * c.p }, flash: on ? clamp(1 - (c.t - .2) / .12) * .6 : 0, flashColor: '#bff0ff', overlay: label(770, 980, 'BACKUP · LEFT', { size: 50, k: appear(c.t, .3), fill: '#9fdcff' }) });
    } },
  { id: 'S093', type: 'TOP-close', desc: 'Close overhead on the metal barrier: lit by its blue backup LED, the robot curves cleanly AROUND the barrier this time (blue trail) instead of veering into it.', w: 1.2, sfx: [[0, 'motor_whir', .8]],
    draw: c => {
      const k = atE(c, 0, c.d, 'inOut'); const route = ROUTE_RECOVER.slice(0, 4);
      const [x, y, a] = pathAt(route, k);
      let trail = ''; for (let i = 1; i <= 8; i++) { const [tx, ty] = pathAt(route, Math.max(0, k - i * .03)); trail += S.circle(tx, ty, 18 - i * 1.5, '#6fd0ff', { opacity: .35 - i * .04 }); }
      return scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + courseTop({ route: ROUTE_OK, routeOp: .25, hiBar: 1, hiK: .5 }) + trail + PR.robotTop(x, y, a, 1, { ledBackup: true }) + glow(x, y, 160, '#4aa3ff', .45), cam: { x: lerp(1040, 1060, k), y: lerp(620, 470, k), z: 2.1 }, overlay: finalTimer(c) });
    } },
  { id: 'S092', type: 'GFX', dur: 1.1, desc: 'Overlay explaining why it worked: the main sensor\'s reading near metal is jagged; the backup sensor\'s reading is clean.', sfx: [[.1, 'ui_pop', .5]],
    draw: c => {
      const e = ENV.void({ t: c.T, glow: '#1a3a6a' }); let bad = [], good = [];
      for (let i = 0; i <= 60; i++) { const x = 360 + i * 20; bad.push([x, 420 + Math.sin(i * .4) * 30 + (i > 25 && i < 45 ? (hash(i + Math.floor(c.t * 10)) - .5) * 160 : 0)]); good.push([x, 720 + Math.sin(i * .4) * 30]); }
      const kk = Math.floor(at(c, 0, 1.0) * 61);
      return scene(c, { back: e.back, bb: 0, mid: S.pl(bad.slice(0, kk), PAL.red, 6) + S.pl(good.slice(0, kk), '#6fd0ff', 6) + S.rect(860, 300, 200, 520, '#8a8c9c', { opacity: .15 }), overlay: label(360, 330, 'MAIN SENSOR (near metal)', { size: 40, anchor: 'start', k: 1, fill: '#ff9a9a' }) + label(360, 640, 'BACKUP SENSOR · LEFT', { size: 40, anchor: 'start', k: 1, fill: '#9fdcff' }) + label(960, 870, 'METAL', { size: 34, k: 1, fill: '#c6c8d6' }), cam: CAM.push(960, 560, 1, 1.05)(c.p) });
    } },
  { id: 'S094', type: 'TOP', desc: 'Overhead: the robot races the rest of the route toward the finish; clock 0:03 → 0:02.', w: 1, sfx: [[0, 'clock_tick_fast', .7]],
    draw: c => scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + topRun(c, ROUTE_RECOVER, lerp(.45, .82, atE(c, 0, c.d, 'inOut')), { ledBackup: true }), cam: CAM.drift(960, 560, 1.0, .04, 30)(c.p), overlay: finalTimer(c) }) },
  { id: 'S094b', type: 'ECU', dur: .9, tin: 'flash', desc: 'Extreme close-up of the red timer hitting 0:01. The music cuts out.', music: { name: 'stop', at: 0 }, sfx: [[0, 'clock_tick_fast', .8]],
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 16, mid: PR.timer(960, 560, fmtClock(finalSecs(c.T)), { w: 900, h: 360, size: 260 }) + glow(960, 560, 600, PAL.red, .3), cam: CAM.push(960, 560, 1, 1.1)(c.p), shake: 3 }); } },
  { id: 'S095', type: 'ECU', tin: 'flash', w: 1.6, min: 2.6, desc: 'Slow-motion extreme close-up on the checkered finish line: in silence but for a heartbeat, the robot\'s front wheel creeps over it; then FINISH horn, flash, crowd, and the triumph theme returns.', music: { name: 'triumph_resolve', vol: .45, fade: .1, at: 1.2 }, sfx: [[0, 'heartbeat_muffled', .8], [1.2, 'finish_horn', .9], [1.3, 'crowd_cheer', .9]],
    draw: c => { const r = arena(c, { cheer: c.t > 1.2 ? 1 : 0 }); const k = c.t < 1.2 ? E.out(seg(c.t, 0, 1.2)) * .9 : .9 + .1 * E.out(seg(c.t, 1.2, 1.5)); const x = lerp(400, 1100, k); return scene(c, { back: r.back, bb: 14, mid: S.rect(-600, 780, 3200, 400, '#24304a') + S.g({ transform: 'translate(1000,780) skewX(-20)' }, PR.checker(0, 0, 200, 300, 4)) + PR.robot(x, 960, { s: 2.6, wheelRot: k * 600, ledBackup: true }), cam: CAM.push(960, 640, 1, 1.12, 'out')(c.p), flash: c.t > 1.2 ? clamp(1 - (c.t - 1.2) / .3) * .7 : 0, overlay: finalTimer(c) }); } },
] });

// ---------- ACT V (warm payoff light) ----------
addBeat({ id: 'B36', lines: ['L070'], pre: .3, post: .3, sfx: [[0, 'applause', .6]], shots: [
  { id: 'S096', type: 'WS', desc: 'The crowd erupts under golden light, confetti falls; scoreboard WINNER 0:01.', w: .8,
    draw: c => { const r = arena(c, { cheer: 1, warm: 1 }); let conf = ''; const rr = rng(5); for (let i = 0; i < 80; i++) { const x = rr() * W, y = ((rr() * H + c.t * (200 + rr() * 200)) % H); conf += S.rect(x, y, 10, 16, ['#d7383a', '#8cc7f0', PAL.gold, '#5fe07a'][i % 4], { transform: `rotate(${c.t * 200 + i * 20},${x},${y})` }); } return scene(c, { back: r.back, bb: 2, mid: conf, cam: CAM.drift(960, 520, 1.05, .03, 30)(c.p), grade: WARM }); } },
  { id: 'S097', type: 'CU-rack', desc: 'An official\'s hand lifts the trophy in the foreground; Eli glances at it, then his eyeline moves past it, screen-right, toward Noah (rack focus trophy → Eli).', w: 1.1,
    draw: c => { const r = arena(c, { cheer: .8, warm: 1 }); const k = atE(c, .4, 1.4); return { layers: [{ svg: r.back, p: .8, blur: 10 }, { svg: A(c, { who: 'eli', x: 1250, y: 1150, h: 700, f: 1, pose: P.stand(), expr: 'neutral', lookX: c.t < .5 ? -1 : 1, light: LT.goldL }), p: 1, blur: lerp(8, 0, k) }, { svg: PR.trophy(620, 780, 2.2) + bigHand(420, 760, 1.1, -10, '#2f3b63'), p: 1.2, blur: lerp(0, 12, k) }], cam: CAM.drift(960, 560, 1, .03)(c.p), grade: WARM }; } },
  { id: 'S098', type: 'MS', desc: 'Eli walks away from the trophy, threading through the cheering crowd toward Noah — sheepish, determined.', w: 1,
    draw: c => { const r = arena(c, { cheer: .7, warm: 1 }); let crowd = ''; [[300, 1], [1600, -1], [1800, -1], [140, 1]].forEach(([x, f], i) => crowd += A(c, { who: 'extra', x, y: 1100, h: 640, f, pose: P.cheerBounce(c.T, i), expr: 'happy', light: LT.goldL, t: c.T + i })); const ex = lerp(700, 1200, c.p); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'eli', x: ex, y: 1100, h: 640, f: 1, pose: P.walk(walkPh(ex, 640)), expr: 'worried', light: LT.goldL }), fg: crowd, fb: 12, cam: { x: lerp(860, 1100, c.p), y: 600, z: 1 }, grade: WARM }); } },
] });
addBeat({ id: 'B37', lines: ['L071', { id: 'L072', gap: .5 }, { id: 'L073', gap: .9 }, { id: 'L074', gap: .3 }, { id: 'L075', gap: .3 }], pre: .5, post: .8, minShot: 3.0, music: [{ name: 'stop', at: 0 }, { name: 'sad_piano', vol: .25, at: .4, fade: 2 }], shots: [
  { id: 'S099', type: 'MS-2', desc: 'Two-shot by the bleachers, applause softening, golden light: Eli, sincere: "Dude... I\'m sorry." Noah, arms crossed: "For what?"', w: 1.2,
    draw: c => { const r = arena(c, { cheer: .2, noahCrowd: false, warm: 1 }); return scene(c, { back: r.back, bb: 9, mid: glow(970, 560, 520, '#ffcf8a', .3) + A(c, { who: 'eli', x: 760, y: 1100, h: 640, f: 1, pose: P.stand(), expr: 'sad', light: LT.goldR }) + A(c, { who: 'noah', x: 1180, y: 1100, h: 620, f: -1, pose: P.crossArms(), expr: 'unimpressed', light: LT.goldL }), cam: CAM.push(960, 600, 1.2, 1.28)(c.p), grade: WARM }); } },
  { id: 'S100', type: 'OTS', on: 'L073', desc: 'Over Noah\'s shoulder: Eli: "Thinking I didn\'t need you."', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false, warm: 1 }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [760, 460], h: 1050, f: 1, pose: P.stand(), expr: 'sad', lookX: .6, light: LT.goldL }), fg: A(c, { who: 'noah', headAt: [1680, 560], h: 1400, front: true, back: true, pose: P.crossArms(), light: LT.goldR }), fb: 16, cam: CAM.push(860, 540, 1, 1.05)(c.p), grade: WARM }); } },
  { id: 'S100b', type: 'CU', on: 'L074', off: -1.3, min: 1.1, desc: 'Noah\'s soft, unreadable reaction — then the corner of a smile.', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false, warm: 1 }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1160, 460], h: 1050, f: -1, pose: P.stand(), expr: c.t < .9 ? 'neutral' : 'smug', blink: c.t > .86 && c.t < .96, smile: false, light: LT.goldR }), cam: CAM.push(1100, 520, 1, 1.05)(c.p), grade: WARM }); } },
  { id: 'S101', type: 'OTS', on: 'L074', off: -.05, desc: 'Over Eli\'s shoulder: Noah, teasing: "Yeah, that was pretty stupid."', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false, warm: 1 }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1160, 460], h: 1050, f: -1, pose: P.stand(), expr: 'smug', lookX: .6, light: LT.goldR }), fg: A(c, { who: 'eli', headAt: [240, 560], h: 1400, front: true, back: true, pose: P.stand(), light: LT.goldL }), fb: 16, cam: CAM.drift(1060, 540, 1, .03)(c.p), grade: WARM }); } },
  { id: 'S102', type: 'WS-low', on: 'L075', desc: 'Low profile wide, blurred applauding crowd in the foreground: Eli laughs "You\'re telling me." — Noah bumps his shoulder; Eli rocks sideways and they both laugh.', w: 1, sfx: [[.9, 'ui_tick', .4]],
    draw: c => {
      const r = arena(c, { cheer: .3, noahCrowd: false, warm: 1 });
      const k = poseAt(c.t, [[0, { v: 0 }], [.6, { v: -.25 }], [.8, { v: 1 }, 'out'], [1.2, { v: .85 }]]).v;
      const hit = c.t > .75 && c.t < 1.2 ? 25 * Math.sin((c.t - .75) / .45 * Math.PI) : 0;
      let crowd = ''; [[200, 1], [1700, -1]].forEach(([x, f], i) => crowd += A(c, { who: 'extra', x, y: 1250, h: 900, f, pose: P.cheerBounce(c.T, i), expr: 'happy', light: LT.goldL }));
      return scene(c, { back: r.back + glow(960, 560, 600, '#ffcf8a', .3), bb: 9, mid: A(c, { who: 'eli', x: 820 - hit, y: 1080, h: 600, f: 1, pose: P.stand(), rot: -hit * .3, expr: 'happy', headTilt: c.t > 1 ? -8 : 0, light: LT.goldL }) + A(c, { who: 'noah', x: lerp(1160, 1060, Math.max(0, k)), y: 1080, h: 580, f: -1, pose: { ...P.walk(walkPh(1160 - lerp(1160, 1060, Math.max(0, k)), 580)), lean: -4 * k }, expr: 'happy', light: LT.goldL }), fg: crowd, fb: 14, cam: { x: lerp(920, 1000, c.p), y: 660, z: lerp(1.02, 1.08, c.p), r: 0 }, grade: WARM });
    } },
] });
addBeat({ id: 'B38', minShot: 3.5, lines: [{ id: 'L077', gap: .5 }], pre: .8, post: 1.0, music: { name: 'ending_light', vol: .35, at: 0, fade: 2 }, shots: [
  { id: 'S103', type: 'EST', hold: true, desc: 'Dusk outside the school: the two friends walk home together through the warm door-light, carrying the robot and the trophy; camera pans with them.', w: 1.1,
    draw: c => { const e = ENV.school({ t: c.T }); const ex = lerp(760, 1180, c.p); return scene(c, { back: e.back, bb: 0, mid: A(c, { who: 'eli', x: ex, y: 880, h: 150, f: 1, pose: P.walk(walkPh(ex, 150)), expr: 'happy', light: LT.hotR, holdSvg: PR.trophy(0, 0, .25) }) + A(c, { who: 'noah', x: ex + 80, y: 880, h: 145, f: 1, pose: P.walk(walkPh(ex, 145) + .5), expr: 'happy', light: LT.hotR }), cam: CAM.move([880, 620, 1.25], [1080, 620, 1.18])(c.p) }); } },
  { id: 'S104', type: 'INSERT', on: 'L077', off: 1.5, desc: 'The robot\'s red and blue stripes side by side in warm light; the camera drifts to the friends\' photo propped next to it.', w: 1,
    draw: c => { const e = ENV.workshop({ t: c.T, tod: .2 }); return scene(c, { back: e.back, bb: 12, mid: PR.robot(820, 900, { s: 2.6, ledBackup: true }) + PR.photo(1450, 820, 2.6, -6), cam: CAM.move([820, 620, 1.1], [1300, 600, 1.2])(c.p) }); } },
] });
addBeat({ id: 'B39', lines: [{ id: 'L078', gap: 2.0 }, { id: 'L079', gap: .4 }, { id: 'L080', gap: .3 }, { id: 'L081', gap: .9 }], pre: .3, post: 1.2, sfx: [['L079-1.9', 'piano_melody_good', .6, { dur: 1.7 }]], shots: [
  { id: 'S105', type: 'TOP-callback', desc: 'Match cut to the opening piano (overhead keys): Noah\'s hand hits a terrible note.', w: 1, sfx: [[.3, 'piano_bad_notes', .7]],
    draw: c => { const pressed = {}; if (c.t > .3) { pressed[3] = 1; pressed[104] = 1; } const mid = S.rect(-200, -200, 2400, 1500, '#1a0f14') + PR.keysTop(160, 330, 1600, 21, pressed, { hit: '#ff6a5a' }) + bigHand(560, 560, 1.4, -90, PAL.noah, { curl: true }); return scene(c, { mid, vignette: .72, grade: INSERT_GRADE, cam: CAM.drift(960, 540, 1.05, .03)(c.p) }); } },
  { id: 'S106', type: 'MS-2', on: 'L078', desc: 'Music room: Noah at the piano: "So... you gonna teach me that piano song or what?" Eli walks in and sits down beside him.', w: 1.4,
    draw: c => {
      const e = ENV.musicroom({ t: c.T });
      const wk = at(c, .3, 1.6), ex = lerp(1560, 1240, wk), sitK = atE(c, 1.6, 2.2, 'outBack');
      const pose = c.t < 1.6 ? P.walk(walkPh(1560 - ex, 360)) : mixPose({ ...P.stand(), fa: [40, 30] }, c.t > c.d - 2 ? P.sitPiano(c.T, 1) : P.sit(), sitK);
      const ey = c.t < 1.6 ? 740 + 117 * 1.2 : lerp(740 + 117 * 1.2, 740, sitK);
      return scene(c, { back: e.back, bb: 4, mid: PR.piano(700, 860, 1.25) + PR.stool(1000, 860, 1.2) + PR.stool(1240, 860, 1.2) + A(c, { who: 'noah', x: 1000, y: 740, h: 360, f: -1, pose: P.sitPiano(c.T, .5), expr: 'smug', light: LT.warmL }) + A(c, { who: 'eli', x: ex, y: ey, h: 360, f: -1, pose, expr: 'happy', light: LT.warmL }), cam: CAM.drift(1000, 600, 1.15, .03, 30)(c.p) });
    } },
  { id: 'S106b', type: 'TOP-callback', on: 'L079', off: -2.0, min: 1.5, desc: 'Overhead keys (same angle as S002/S105): Eli\'s red-sleeved hands play the first two bars of the song, clean and gold, next to Noah\'s blue sleeve — "Yeah."', 
    draw: c => { const mel = [0, 4, 7, 4, 2, 5]; const pressed = {}; const n = Math.floor(c.t * 3.6); if (n < mel.length) pressed[mel[n] + 6] = 1; const hx = 160 + (mel[Math.min(n, mel.length - 1)] + 6) * 76 + 38; const mid = S.rect(-200, -200, 2400, 1500, '#1a0f14') + PR.keysTop(160, 330, 1600, 21, pressed, { hit: PAL.gold }) + bigHand(hx, 560, 1.4, -90, PAL.eli, { curl: true }) + bigHand(420, 600, 1.3, -80, PAL.noah); return scene(c, { mid, vignette: .72, grade: INSERT_GRADE, cam: CAM.drift(960, 540, 1.05, .04)(c.p) }); } },
  { id: 'S107', type: 'MS', on: 'L080', desc: 'Noah, seated at the piano (keyboard edge in frame), cheerfully: "Cool. It\'ll only take me ten hours."', w: 1,
    draw: c => { const e = ENV.musicroom({ t: c.T }); return scene(c, { back: e.back, bb: 9, mid: A(c, { who: 'noah', headAt: [1080, 480], h: 950, f: 1, pose: P.sitPiano(c.T, .3), expr: 'happy', light: LT.warmL }) + PR.keysTop(-200, 980, 1100, 12, {}), cam: CAM.drift(1000, 540, 1, .03)(c.p) }); } },
  { id: 'S108', type: 'CU-callback', on: 'L081', off: -.9, desc: 'Callback: Eli, seated, turns to camera with exactly the same bewildered face and framing as "Wait... what?" (S026): "...Oh my God." Silent beat, comedic sting, hard cut to black.', w: 1, sfx: [[-0.5, 'comedic_sting', .8]],
    draw: c => { const e = ENV.musicroom({ t: c.T }); const turn = atE(c, 0, .25, 'outBack'); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'eli', ...BEWILDERED_FRAME, f: 1, front: turn > .5, turn: lerp(.45, 0, turn), pose: P.sit(), expr: c.t < .25 ? 'busy' : c.t < 1.4 ? 'shock' : 'bewildered', blink: (c.t > 1.36 && c.t < 1.46) || (c.t > .21 && c.t < .3), light: LT.warmL }), cam: CAM.push(860, 500, 1, 1.05)(c.p) }); } },
] });
addBeat({ id: 'B40', lines: [], min: 3.8, shots: [
  { id: 'S109', type: 'END', desc: 'Title on black: WHAT IF YOU COULD LEARN ANYTHING 10x FASTER?', w: 1, music: { name: 'stop', at: 3.0 },
    draw: c => { const k = atE(c, .2, .9, 'out'); return scene(c, { bgc: '#000', mid: '', overlay: titleText([{ t: 'WHAT IF YOU COULD LEARN', size: 60, y: 480 }, { t: 'ANYTHING 10x FASTER?', size: 96, y: 590, fill: PAL.gold }], { op: k * (1 - at(c, 3.2, 3.8)) }), vignette: 0, burn: 0 }); } },
] });
