// ACT III–V — workshop conflict, tournament climax, reconciliation, piano callback.

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

function workshop(c, o = {}) {
  const e = ENV.workshop({ t: c.T, tod: o.tod ?? .35, lamp: o.lamp ?? 1 });
  let back = e.back + workbench(560, 900, 480, { photo: true }) + workbench(1380, 900, 480, { tray: '#2a4a7a', drawing: o.drawingOnBench ?? true }) + PR.stool(1380, 960, .9, '#4a5a7a');
  back += PR.robot(560, 710, { s: .9, wheelRot: o.wheel || 0, ledBackup: false });
  return { e, back };
}
function arena(c, o = {}) {
  const e = ENV.arena({ t: c.T, cheer: o.cheer || 0, roundTxt: o.round || 'ROUND 1', clock: o.clock || '1:00', clockCol: o.clockCol });
  // Noah in the crowd (yellow cap), always seated at the same spot: row 3, x=1280
  const noah = o.noahCrowd === false ? '' : A(c, { who: 'noah', x: 1280, y: 520, h: 120, f: -1, pose: o.noahPose || P.crossArms(), expr: o.noahExpr || 'unimpressed', light: LT.flood });
  return { e, back: e.back + noah };
}
function arenaTable(c, o = {}) {
  return courseTable(380, 1540, 700) + PR.barrier(1040, 700, 70, 60, { glint: true }) + PR.barrier(1300, 700, 70, 60);
}

// ---------- B21 robot project with Noah ----------
addBeat({ id: 'B21', lines: ['L039', { id: 'L040', gap: .3 }], pre: .3, post: .3, music: { name: 'curious_open', vol: .3, at: 0, fade: 2 }, shots: [
  { id: 'S055', type: 'EST', desc: 'Robotics workshop, warm afternoon: Eli and Noah build the robot together and high-five. Two benches: Eli\'s (left) and Noah\'s (right, blue tool tray).', w: 1.2, sfx: [[0, 'workshop_ambience', .6], [2.2, 'ui_pop', .3]],
    draw: c => { const r = workshop(c); const hf = atE(c, 1.6, 2.2, 'outBack'); return scene(c, { back: r.back, bb: 2, mid: A(c, { who: 'eli', x: 860, y: 1000, h: 330, f: 1, pose: mixPose(P.hold(), P.raiseHand(), hf), expr: 'happy', light: LT.warmL }) + A(c, { who: 'noah', x: 1070, y: 1000, h: 320, f: -1, pose: mixPose(P.hold(), P.raiseHand(), hf), expr: 'happy', light: LT.warmL }), cam: CAM.drift(960, 600, 1.0, .03)(c.p) }); } },
  { id: 'S056', type: 'INSERT', desc: 'Robot close-up: red stripe (Eli) and blue stripe (Noah) side by side — built together.', w: 1, sfx: [[.3, 'motor_whir', .5]],
    draw: c => { const r = workshop(c); return scene(c, { back: r.e.back, bb: 10, mid: PR.robot(960, 900, { s: 2.6, wheelRot: c.t * 90, ledBackup: false }) + bigHand(1500, 520, 1.1, 200, PAL.noah) + bigHand(420, 520, 1.1, -20, PAL.eli), cam: CAM.drift(960, 600, 1.02, .04)(c.p) }); } },
  { id: 'S057', type: 'INSERT', on: 'L040', desc: 'A poster on the wall: ROBOTICS CUP — WINNER QUALIFIES FOR STATE. Calendar crosses off months.', w: 1,
    draw: c => {
      const e = ENV.workshop({ t: c.T });
      const poster = S.g({ transform: 'rotate(-2,960,520)' }, S.rect(620, 180, 680, 700, '#e9dcc4'), S.rect(620, 180, 680, 150, '#2a1f4a'), S.text(960, 280, 'ROBOTICS CUP', { 'font-family': 'Lilita One', 'font-size': 84, fill: PAL.gold, 'text-anchor': 'middle' }), PR.robotTop(960, 520, -20, 1.6, {}), S.text(960, 760, 'WINNER QUALIFIES', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 52, fill: '#2a1f2a', 'text-anchor': 'middle' }), S.text(960, 830, 'FOR STATE FINALS', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 52, fill: '#c0392b', 'text-anchor': 'middle' }));
      return scene(c, { back: e.back, bb: 12, mid: poster + PR.calendar(1540, 700, Math.min(90, 30 + Math.floor(c.t * 25)), .7), cam: CAM.push(960, 540, 1.0, 1.08)(c.p) });
    } },
] });
// ---------- B22 Eli outpaces Noah ----------
addBeat({ id: 'B22', lines: ['L041'], pre: .2, post: .3, shots: [
  { id: 'S058', type: 'MS-2', desc: 'Split pace: Eli works at blurring speed (motion-trail hands, code scrolling), Noah slowly reads a manual.', w: 1, sfx: [[0, 'keyboard_typing', .5]],
    draw: c => { const r = workshop(c); const eh = A(c, { who: 'eli', x: 760, y: 1000, h: 360, f: 1, pose: P.controller(c.T * 3), expr: 'focused', light: LT.warmL }); return scene(c, { back: r.back, bb: 5, mid: ghosts(dt => A({ ...c, T: c.T + dt }, { who: 'eli', x: 760, y: 1000, h: 360, f: 1, pose: P.controller((c.T + dt) * 3), expr: 'focused', light: { none: true } }), 3, .05, .3) + eh + PR.laptop(980, 800, .6, codeScreen((c.t * 2) % 1)) + A(c, { who: 'noah', x: 1300, y: 1000, h: 350, f: -1, pose: P.hold(), expr: 'worried', light: LT.warmL, holdSvg: PR.book(0, 0, 90, 60, '#3a5a8a') }), cam: CAM.drift(1000, 640, 1.2, .03)(c.p) }); } },
] });
// ---------- B23 the plant: backup sensor (auditor-mandated) ----------
addBeat({ id: 'B23', lines: ['L042', { id: 'L043', gap: .05 }], pre: .3, post: .4, music: { name: 'stop', at: 0 }, shots: [
  { id: 'S059', type: 'MS-2', desc: 'Noah eagerly points at his sensor drawing: "the metal barriers could confuse this sensor. I added a backup on the left..."', w: 1, sfx: [[0, 'workshop_ambience', .5]],
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 6, mid: A(c, { who: 'noah', x: 1200, y: 1060, h: 520, f: -1, pose: P.point(), expr: 'happy', light: LT.warmL }) + A(c, { who: 'eli', x: 640, y: 1060, h: 500, f: 1, pose: P.controller(c.T), expr: 'focused', light: LT.warmL, lookY: 1 }), cam: CAM.drift(940, 600, 1.15, .03)(c.p) }); } },
  { id: 'S060', type: 'INSERT', at: 3.2, desc: 'Insert of Noah\'s diagram: METAL barrier note, BACKUP sensor labelled LEFT; cut to the real robot\'s blue backup box on its left side.', w: 1, sfx: [[.1, 'ui_pop', .5]],
    draw: c => {
      const e = ENV.workshop({ t: c.T });
      if (c.t < c.d * .55) return scene(c, { back: e.back, bb: 12, mid: PR.circuitDiagram(960, 540, 2.3, { backup: true, metal: true, note: 'METAL CAN CONFUSE IT!', r: -2 }) + bigHand(1450, 600, 1, 190, PAL.noah, { point: true }), cam: CAM.drift(960, 540, 1, .05)(c.p) });
      return scene(c, { back: e.back, bb: 12, mid: PR.robot(1100, 980, { s: 3.4, ledBackup: true }) + glow(660, 690, 200, '#6fd0ff', .35), cam: CAM.push(700, 640, 1.0, 1.15)(seg(c.p, .55, 1)), overlay: label(660, 380, 'BACKUP SENSOR · LEFT SIDE', { size: 44, k: appear(c.t, c.d * .6), fill: '#9fdcff' }) });
    } },
  { id: 'S061', type: 'MS', on: 'L043', off: -.05, desc: 'Eli grabs the component without looking up: "Already fixed it." Noah\'s sentence is cut off.', w: 1, sfx: [[.1, 'electric_switch', .3]],
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'eli', headAt: [820, 560], h: 900, f: 1, pose: P.controller(c.T), expr: 'focused', light: LT.warmL, lookY: 1, rimW: 6 }), fg: A(c, { who: 'noah', headAt: [1650, 420], h: 1200, f: -1, pose: P.point(), expr: 'neutral', light: LT.warmL }), fb: 16, cam: CAM.drift(960, 560, 1, .03)(c.p) }); } },
] });
addBeat({ id: 'B24', lines: ['L044', { id: 'L045', gap: .1 }, { id: 'L046', gap: .5 }, { id: 'L047', gap: .5 }], pre: .2, post: 3.2, shots: [
  { id: 'S062', type: 'OTS', desc: 'Over Eli\'s shoulder: Noah tries again, "Oh. Well, what about the steering?"', w: 1,
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 7, mid: A(c, { who: 'noah', headAt: [1180, 480], h: 820, f: -1, pose: P.hold(), expr: 'worried', light: LT.warmL }), fg: A(c, { who: 'eli', headAt: [420, 640], h: 1300, f: 1, pose: P.controller(c.T), expr: 'focused', light: LT.warmL }), fb: 18, cam: CAM.drift(960, 560, 1, .03)(c.p) }); } },
  { id: 'S063', type: 'MS', on: 'L045', desc: 'Eli, back half-turned, still typing: "Fixed that too."', w: 1,
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'eli', headAt: [900, 520], h: 850, f: -1, pose: P.controller(c.T * 2), expr: 'focused', turn: .9, light: LT.warmL, lookY: 1 }) + PR.laptop(560, 1000, 1.1, codeScreen(1)), cam: CAM.drift(900, 560, 1, .03)(c.p) }); } },
  { id: 'S064', type: 'CU', on: 'L046', desc: 'Noah close-up, hurt: "Dude, can I at least do something?"', w: 1,
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1000, 520], h: 1150, f: -1, pose: P.stand(), expr: 'sad', light: LT.warmL, rimW: 8 }), cam: CAM.push(1000, 520, 1, 1.05)(c.p) }); } },
  { id: 'S065', type: 'MS', on: 'L047', desc: 'Eli, not looking up: "I mean... I\'ll probably finish it faster."', w: 1,
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'eli', headAt: [880, 540], h: 900, f: 1, pose: P.controller(c.T), expr: 'neutral', light: LT.warmL, lookY: 1 }), cam: CAM.drift(900, 560, 1, .03)(c.p) }); } },
  { id: 'S066', type: 'MCU-hold', hold: true, at: -3.0, desc: 'HOLD on Noah (medium close-up) in silence; the upbeat music is gone; he slowly lowers his blue screwdriver to the bench — a small isolated click.', w: 1, sfx: [[1.6, 'tool_place', 2.2]],
    draw: c => { const r = workshop(c); const k = atE(c, .5, 1.7); return scene(c, { back: r.back, bb: 10, mid: A(c, { who: 'noah', headAt: [960, 470], h: 1000, f: -1, pose: P.placeTool(k), expr: 'sad', light: LT.warmL, lookY: .8, holdSvg: k < .98 ? PR.screwdriver(0, 0, 1.4, 90, '#4aa3ff') : '' }) + (k >= .98 ? PR.screwdriver(1150, 980, 1.4, 4, '#4aa3ff') : ''), cam: CAM.push(960, 520, 1.0, 1.04, 'lin')(c.p) }); } },
] });
addBeat({ id: 'B25', lines: [], min: 3.2, shots: [
  { id: 'S067', type: 'WS-hold', hold: true, desc: 'Wide: Noah walks out of the workshop door without a word; Eli keeps working. Noah\'s workstation is left empty (tray + stool, no Noah).', w: 1, sfx: [[2.4, 'door_close', 3.0]],
    draw: c => { const r = workshop(c); const k = at(c, .2, 2.6); return scene(c, { back: r.back + S.rect(1720, 470, 160, 340, '#1a1014') + S.rect(1720, 470, 160 * (k < .95 ? 1 : 0), 340, '#3a2a2a'), bb: 2, mid: A(c, { who: 'eli', x: 700, y: 1000, h: 330, f: 1, pose: P.controller(c.T), expr: 'focused', light: LT.warmL }) + (k < .95 ? A(c, { who: 'noah', x: lerp(1250, 1800, k), y: 990, h: 320, f: 1, pose: P.walk(c.t * .9), expr: 'sad', light: LT.warmL }) : ''), cam: CAM.drift(960, 600, 1.0, .02)(c.p) }); } },
] });
// ---------- B26 empty workspace time-lapse ----------
addBeat({ id: 'B26', lines: ['L048', { id: 'L049', gap: .3 }, { id: 'L050', gap: .4 }], pre: .4, post: .8, music: { name: 'sad_piano', vol: .4, at: 0, fade: 2 }, shots: [
  { id: 'S068', type: 'WS-timelapse', hold: true, desc: 'One fixed wide over several afternoons: sunlight sweeps across the workshop again and again; Eli alone works faster, the robot grows more polished; Noah\'s bench stays empty. The photo of the two friends sits on Eli\'s bench (planted).', w: 1.6, sfx: [[0, 'clock_tick_loop', .3]],
    draw: c => { const tod = (c.t / 2.2) % 1; const r = workshop(c, { tod }); return scene(c, { back: r.back, bb: 1, mid: A(c, { who: 'eli', x: 700 + 40 * Math.sin(c.t * 3), y: 1000, h: 330, f: 1, pose: P.controller(c.T * 3), expr: 'focused', light: { dx: -1, dy: -.3, color: mixc(PAL.rim, PAL.rimCool, tod) } }) + label(1380, 640, `DAY ${1 + Math.floor(c.t / 2.2)}`, { size: 36, k: 1, op: .7 }), cam: CAM.drift(960, 600, 1.0, .015)(c.p), grade: { tint: mixc('#ffb070', '#4a5aff', tod), op: .25 } }); } },
  { id: 'S069', type: 'CU', on: 'L050', desc: 'Close-up: Eli glances at the empty stool, then back to work. Cool light.', w: 1,
    draw: c => { const r = workshop(c, { tod: .9 }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [820, 520], h: 1100, f: 1, pose: P.stand(), expr: 'sad', lookX: c.t < 1.2 ? 1 : 0, light: LT.coolL, rimW: 7 }), cam: CAM.drift(860, 540, 1, .03)(c.p), grade: { tint: '#4a5aff', op: .3 } }); } },
] });

// ---------- ACT IV: tournament ----------
addBeat({ id: 'B27', lines: ['L051'], pre: .5, post: .3, music: { name: 'tension_competition', vol: .3, at: 0, fade: 1 }, sfx: [[0, 'crowd_cheer', .3]], shots: [
  { id: 'S070', type: 'EST', desc: 'Tournament hall wide: ROBOTICS CUP banner, floodlights, crowd in bleachers, course table with metal barriers.', w: 1,
    draw: c => { const r = arena(c, { cheer: .3 }); return scene(c, { back: r.back, bb: 1, mid: arenaTable(c) + PR.robot(560, 700, { s: .7 }), cam: CAM.move([960, 520, 1.15], [960, 560, 1.0])(c.p) }); } },
  { id: 'S071', type: 'MS', desc: 'Eli alone at the team station; the name card reads TEAM: ELI & NOAH (Noah is still officially registered). Telephoto glimpse: Noah, arms crossed, in the crowd.', w: 1.2,
    draw: c => {
      const r = arena(c);
      const card = S.g({}, S.rect(-160, -50, 320, 90, '#efe3cf', { rx: 6 }), S.text(0, 10, 'TEAM: ELI & NOAH', { 'font-family': 'Oswald', 'font-weight': 600, 'font-size': 36, fill: '#2a1f2a', 'text-anchor': 'middle' }));
      if (c.t < c.d * .6) return scene(c, { back: r.back, bb: 9, mid: A(c, { who: 'eli', x: 860, y: 1080, h: 640, f: 1, pose: P.controller(c.T), expr: 'focused', light: LT.flood }) + S.rect(500, 860, 900, 300, '#24304a') + S.g({ transform: 'translate(1150,920)' }, card) + PR.stool(1350, 1100, 1, '#4a5a7a'), cam: CAM.drift(960, 620, 1.0, .03)(c.p) });
      return scene(c, { back: r.back, bb: 0, cam: { x: 1280, y: 470, z: 3.2 + .1 * c.p } });
    } },
] });
function topRun(c, route, k, o = {}) {
  const [x, y, a] = pathAt(route, k);
  return courseTop({ route: ROUTE_OK, routeOp: o.routeOp ?? .35, hiBar: o.hiBar, hiK: o.hiK, bad: o.bad }) + PR.robotTop(x, y, a, 1, { ledMain: o.ledMain, ledBackup: o.ledBackup });
}
addBeat({ id: 'B28', lines: ['L052', { id: 'L053', gap: .3 }, { id: 'L054', gap: .3 }], pre: .2, post: .6, shots: [
  { id: 'S072', type: 'LOW', desc: 'Low tracking shot beside the robot as it races along the table, smooth and fast.', w: 1, sfx: [[0, 'motor_whir', .7]],
    draw: c => { const r = arena(c, { cheer: .4 }); const x = lerp(300, 1600, c.p); return scene(c, { back: r.back, bb: 10, mid: S.rect(-600, 760, 3200, 400, '#24304a') + S.rect(-600, 760, 3200, 10, '#3a4a6a') + PR.robot(x, 820, { s: 1.6, wheelRot: c.t * 720 }) + ghosts(dt => PR.robot(x + dt * 900, 820, { s: 1.6 }), 3, .03, .25), cam: { x: x + 100, y: 640, z: 1.0 } }); } },
  { id: 'S073', type: 'TOP', on: 'L053', desc: 'Overhead course: ROUND 1 — robot weaves around the barriers along the dotted route and finishes. ✓', w: 1, sfx: [[0, 'timer_beep', .6], [1.6, 'crowd_cheer', .5]],
    draw: c => scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + topRun(c, ROUTE_OK, atE(c, .1, c.d * .85, 'inOut')), cam: { x: 960, y: 540, z: .98 }, overlay: label(960, 120, c.t < c.d * .5 ? 'ROUND 1' : 'ROUND 2', { size: 54, k: 1, fill: PAL.gold }) + (c.t > c.d * .85 ? tick(1700, 120, 1.4) : '') }) },
  { id: 'S074', type: 'MS', on: 'L054', desc: 'Announcer with headset mic, arm raised: "And Eli\'s team advances to the final!" Crowd cheers.', w: 1, sfx: [[.2, 'crowd_cheer', .8]],
    draw: c => { const r = arena(c, { cheer: 1 }); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'announcer', x: 900, y: 1160, h: 760, f: 1, pose: P.raiseHand(), expr: 'happy', light: LT.flood }), cam: CAM.drift(960, 600, 1, .03)(c.p) }); } },
] });
addBeat({ id: 'B29', lines: ['L055', { id: 'L056', gap: .3 }], pre: .3, post: .2, shots: [
  { id: 'S075', type: 'INSERT', desc: 'Scoreboard flips to FINAL, clock 1:00 in red; music tightens.', w: .8, sfx: [[0, 'timer_beep', .8], [.2, 'clock_tick_fast', .5]],
    draw: c => { const r = arena(c, { round: 'FINAL', clock: `0:${String(59 - Math.floor(c.t)).padStart(2, '0')}` }); return scene(c, { back: r.back, bb: 0, cam: { x: 1610, y: 320, z: 3.0 + .15 * c.p } }); } },
  { id: 'S076', type: 'POV', on: 'L056', desc: 'Robot POV rushing toward a shiny METAL barrier; the orange main-sensor LED flickers.', w: 1, sfx: [[.4, 'sensor_warning', .8]],
    draw: c => { const r = arena(c); const z = lerp(1, 2.2, E.in(c.p)); const fl = Math.floor(c.t * 14) % 2; return scene(c, { back: r.back, bb: 10, mid: S.rect(-600, 760, 3200, 400, '#24304a') + PR.barrier(960, 790, 300, 200, { glint: true }), cam: { x: 960, y: 640, z }, overlay: S.g({ opacity: fl ? 1 : .2 }, glow(220, 900, 160, PAL.glow, .8), S.circle(220, 900, 26, PAL.glow)) + label(960, 200, 'METAL BARRIER', { size: 40, k: appear(c.t, .4), fill: '#c6c8d6' }) }); } },
  { id: 'S077', type: 'TOP', desc: 'Overhead: the robot suddenly veers the wrong way and bumps the barrier; red wrong-route line.', w: 1, sfx: [[.6, 'robot_bump', .9], [.8, 'crowd_gasp', .7]],
    draw: c => scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + topRun(c, ROUTE_FAIL, atE(c, 0, .7, 'lin'), { hiBar: 1, hiK: at(c, .6, .9), ledMain: Math.floor(c.t * 14) % 2 ? 'off' : 'on', bad: c.t > .5 ? [[900, 700], [1080, 650]] : null }), cam: { x: 960, y: 560, z: 1.0 + .15 * at(c, .6, 1) }, shake: c.t > .6 && c.t < .9 ? 8 : 0 }) },
] });
addBeat({ id: 'B30', lines: ['L057', { id: 'L058', gap: .3 }], pre: .1, post: .2, music: { name: 'stop', at: 0 }, shots: [
  { id: 'S078', type: 'CU', desc: 'Eli panics, hands on head: "No, no, no. WHAT?!"', w: 1, sfx: [[0, 'heartbeat_muffled', .5]],
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [960, 520], h: 1000, f: 1, front: true, pose: P.panic(), expr: 'panic', light: LT.flood, rimW: 7 }), cam: CAM.drift(960, 540, 1, .03)(c.p), shake: 3 }); } },
  { id: 'S079', type: 'INSERT', on: 'L058', desc: 'Diagnostic laptop: SOFTWARE ✓ OK, MOTORS ✓ OK — nothing wrong found; timer keeps falling.', w: 1, sfx: [[.4, 'ui_tick', .6], [2.0, 'ui_tick', .6]],
    draw: c => {
      const scr = S.rect(0, 0, 296, 186, '#0e0c1a') + S.text(14, 30, 'DIAGNOSTICS', { 'font-family': 'Oswald', 'font-size': 18, fill: '#9a96b0' }) + (c.t > .4 ? S.text(14, 70, 'SOFTWARE ....... OK', { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 15, fill: '#7dffa6' }) : '') + (c.t > 2 ? S.text(14, 100, 'MOTORS ......... OK', { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 15, fill: '#7dffa6' }) : '') + (c.t > 2.6 ? S.text(14, 140, 'ERROR SOURCE:  ???', { 'font-family': 'Inter', 'font-weight': 700, 'font-size': 15, fill: '#ff8a8a' }) : '');
      const r = arena(c); return scene(c, { back: r.back, bb: 14, mid: PR.laptop(960, 900, 2.4, scr), cam: CAM.push(960, 600, 1, 1.08)(c.p), overlay: PR.timer(1650, 180, `0:${String(Math.max(0, 31 - Math.floor(c.t * 2))).padStart(2, '0')}`, { w: 220, h: 90, size: 60 }) });
    } },
] });
addBeat({ id: 'B31', lines: ['L059', { id: 'L060', gap: .4 }], pre: .2, post: .2, shots: [
  { id: 'S080', type: 'MS', desc: 'Eli frozen at the station, the crowd blurred and muffled; the timer ticks.', w: 1, sfx: [[0, 'clock_tick_fast', .5]],
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 16, mid: A(c, { who: 'eli', x: 960, y: 1180, h: 760, f: 1, front: true, pose: P.slump(), expr: 'worried', light: LT.coolL }), cam: CAM.push(960, 600, 1, 1.1, 'lin')(c.p), grade: { tint: '#4a5aff', op: .3 }, overlay: PR.timer(1650, 180, `0:${String(Math.max(0, 24 - Math.floor(c.t))).padStart(2, '0')}`, { w: 220, h: 90, size: 60 }) }); } },
  { id: 'S081', type: 'ECU', desc: 'Extreme close-up on Eli\'s eyes: no answer to learn from.', w: .8, sfx: [[0, 'heartbeat_muffled', .6]],
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 16, mid: A(c, { who: 'eli', headAt: [960, 560], h: 2400, f: 1, front: true, pose: P.stand(), expr: 'worried', light: LT.coolL, rimW: 10, hideMouth: true }), cam: { x: 960, y: 520, z: 1 + .05 * c.p } }); } },
  { id: 'S082', type: 'TELE', on: 'L060', desc: 'Eli looks up; telephoto isolates Noah (yellow cap) in the crowd.', w: 1,
    draw: c => { const r = arena(c, { noahExpr: 'worried', noahPose: P.stand() }); return scene(c, { back: r.back, bb: 0, cam: { x: 1280, y: 470, z: lerp(2.6, 3.4, E.out(c.p)) } }); } },
] });
addBeat({ id: 'B32', lines: ['L061', { id: 'L062', gap: .15 }, { id: 'L063', gap: .2 }, { id: 'L064', gap: .2 }], pre: .1, post: .3, shots: [
  { id: 'S083', type: 'CU', desc: 'Eli shouts across the hall: "NOAH!"', w: 1,
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [820, 520], h: 1000, f: 1, pose: P.shout(), expr: 'shout', light: LT.flood }), cam: CAM.drift(860, 540, 1, .03)(c.p) }); } },
  { id: 'S084', type: 'MS', on: 'L062', desc: 'Noah stands up in the crowd: "What?!"', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false }); return scene(c, { back: r.back, bb: 6, mid: A(c, { who: 'noah', x: 1000, y: 1150, h: 700, f: -1, pose: P.shout(), expr: 'shock', light: LT.flood }), cam: CAM.drift(1000, 600, 1, .03)(c.p) }); } },
  { id: 'S085', type: 'MS', on: 'L063', desc: 'Eli, urgent: "Remember that sensor setup...? Why did you want to change it?"', w: 1,
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 10, mid: A(c, { who: 'eli', x: 880, y: 1150, h: 720, f: 1, pose: P.point(), expr: 'worried', light: LT.flood }), cam: CAM.drift(900, 600, 1, .03)(c.p), overlay: PR.timer(1650, 180, '0:17', { w: 220, h: 90, size: 60 }) }); } },
  { id: 'S086', type: 'CU', on: 'L064', desc: 'Noah, frustrated: "Because the metal barriers mess with the readings! I told you that three weeks ago!"', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1020, 520], h: 1050, f: -1, pose: P.shout(), expr: 'shout', light: LT.flood }), cam: CAM.drift(1000, 540, 1, .03)(c.p) }); } },
] });
// ---------- B33 payoff of the plant (flashback) ----------
addBeat({ id: 'B33', lines: ['L065'], pre: .3, post: .4, shots: [
  { id: 'S087', type: 'FLASH', tin: 'flash', desc: 'Sepia flashback that matches S059/S060: Noah pointing at the diagram (BACKUP · LEFT); the soft tool-click returns.', w: 1.3, sfx: [[.1, 'sparkle', .4], [1.4, 'tool_place', 2.2]],
    draw: c => { const r = workshop(c); return scene(c, { back: r.back, bb: 6, mid: A(c, { who: 'noah', x: 1200, y: 1060, h: 520, f: -1, pose: P.point(), expr: 'happy', light: LT.sepia }) + PR.circuitDiagram(760, 520, 1.1, { backup: true, metal: true, note: 'METAL CAN CONFUSE IT!' }), cam: CAM.push(900, 560, 1.1, 1.25)(c.p), grade: { tint: '#c89a5a', op: .55 }, vignette: .7 }); } },
  { id: 'S088', type: 'CU', desc: 'Back in the hall: Eli freezes, guilty realisation.', w: 1,
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [960, 520], h: 1050, f: 1, front: true, pose: P.stand(), expr: 'sad', light: LT.flood }), cam: CAM.push(960, 520, 1, 1.06)(c.p) }); } },
] });
addBeat({ id: 'B34', lines: ['L066', { id: 'L067', gap: .15 }], pre: .1, post: .2, music: { name: 'triumph_resolve', vol: .35, at: .4, fade: 1 }, shots: [
  { id: 'S089', type: 'MS', desc: 'Eli, desperate: "Okay! What do I do?!"', w: 1,
    draw: c => { const r = arena(c); return scene(c, { back: r.back, bb: 10, mid: A(c, { who: 'eli', x: 900, y: 1150, h: 720, f: 1, pose: P.shrug(), expr: 'panic', light: LT.flood }), cam: CAM.drift(900, 600, 1, .03)(c.p), overlay: PR.timer(1650, 180, '0:09', { w: 220, h: 90, size: 60 }) }); } },
  { id: 'S090', type: 'MS', on: 'L067', desc: 'Noah points hard to his left: "Switch to the backup sensor! LEFT SIDE!"', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false, cheer: .3 }); return scene(c, { back: r.back, bb: 6, mid: A(c, { who: 'noah', x: 1000, y: 1150, h: 720, f: -1, pose: P.point(), expr: 'shout', light: LT.flood }), cam: CAM.drift(1000, 600, 1, .03)(c.p) }); } },
] });
addBeat({ id: 'B35', lines: ['L068', { id: 'L069', gap: .3 }], pre: .2, post: .4, shots: [
  { id: 'S091', type: 'INSERT', desc: 'Tight on the controller: Eli\'s thumb flips the switch MAIN → BACKUP SENSOR; zap.', w: .8, sfx: [[.3, 'electric_switch', .9]],
    draw: c => { const r = arena(c); const on = c.t > .35; return scene(c, { back: r.back, bb: 16, mid: PR.controller(960, 560, 3.2, { sw: on }) + bigHand(1260 + (on ? 70 : 0), 420, 1.2, 160, PAL.eli, { point: true }), cam: CAM.drift(960, 560, 1, .03)(c.p), flash: on ? clamp(1 - (c.t - .35) / .15) * .5 : 0 }); } },
  { id: 'S092', type: 'GFX', desc: 'Overlay: the main sensor\'s reading near metal is a jagged, distorted line; the backup reading is clean.', w: .8, sfx: [[.1, 'ui_pop', .5]],
    draw: c => {
      const e = ENV.void({ t: c.T, glow: '#1a3a6a' }); let bad = [], good = [];
      for (let i = 0; i <= 60; i++) { const x = 360 + i * 20; bad.push([x, 420 + Math.sin(i * .4) * 30 + (i > 25 && i < 45 ? (hash(i + Math.floor(c.t * 10)) - .5) * 160 : 0)]); good.push([x, 720 + Math.sin(i * .4) * 30]); }
      const kk = at(c, 0, 1.2) * 61;
      return scene(c, { back: e.back, bb: 0, mid: S.pl(bad.slice(0, kk), PAL.red, 6) + S.pl(good.slice(0, kk), '#6fd0ff', 6) + S.rect(860, 300, 200, 520, '#8a8c9c', { opacity: .15 }), overlay: label(360, 330, 'MAIN SENSOR (near metal)', { size: 40, anchor: 'start', k: 1, fill: '#ff9a9a' }) + label(360, 640, 'BACKUP SENSOR · LEFT', { size: 40, anchor: 'start', k: 1, fill: '#9fdcff' }) + label(960, 870, 'METAL', { size: 34, k: 1, fill: '#c6c8d6' }), cam: { x: 960, y: 560, z: 1 } });
    } },
  { id: 'S093', type: 'LOW', desc: 'Low tracking: the blue backup LED lights up; the robot turns cleanly and slips past the barrier.', w: 1, sfx: [[0, 'motor_whir', .8]],
    draw: c => { const r = arena(c, { cheer: .6 }); const x = lerp(600, 1500, E.inOut(c.p)); return scene(c, { back: r.back, bb: 10, mid: S.rect(-600, 760, 3200, 400, '#24304a') + PR.barrier(1050, 790, 140, 120, { glint: true }) + PR.robot(x, 860 + 60 * Math.sin(c.p * Math.PI), { s: 1.5, wheelRot: c.t * 720, ledBackup: true }), cam: { x: x, y: 660, z: 1.0 } }); } },
  { id: 'S094', type: 'TOP', on: 'L069', desc: 'Overhead: robot recovers along the route to the finish; timer 0:03→0:01.', w: 1, sfx: [[0, 'clock_tick_fast', .7]],
    draw: c => scene(c, { mid: S.rect(-200, -200, 2400, 1500, '#120e20') + topRun(c, ROUTE_RECOVER, atE(c, 0, c.d * .95, 'inOut'), { ledBackup: true }), cam: { x: 960, y: 560, z: 1.0 }, overlay: PR.timer(1650, 160, `0:0${Math.max(1, 3 - Math.floor(c.p * 3))}`, { w: 220, h: 90, size: 60 }) }) },
  { id: 'S095', type: 'ECU', desc: 'Extreme close-up on the checkered finish line: the robot\'s front wheel crosses it; FINISH horn, flash.', w: .8, sfx: [[.4, 'finish_horn', .9], [.5, 'crowd_cheer', .9]],
    draw: c => { const r = arena(c, { cheer: 1 }); const x = lerp(400, 1100, E.out(at(c, 0, .5))); return scene(c, { back: r.back, bb: 14, mid: S.rect(-600, 780, 3200, 400, '#24304a') + S.g({ transform: 'translate(1000,780) skewX(-20)' }, PR.checker(0, 0, 200, 300, 4)) + PR.robot(x, 960, { s: 2.6, wheelRot: c.t * 900, ledBackup: true }), cam: { x: 960, y: 640, z: 1 }, flash: c.t > .45 ? clamp(1 - (c.t - .45) / .25) * .7 : 0 }); } },
] });

// ---------- ACT V ----------
addBeat({ id: 'B36', lines: ['L070'], pre: .3, post: .3, sfx: [[0, 'applause', .6]], shots: [
  { id: 'S096', type: 'WS', desc: 'Crowd erupts, confetti; scoreboard WINNER.', w: .8,
    draw: c => { const r = arena(c, { cheer: 1, round: 'WINNER', clock: '0:01', clockCol: PAL.green }); let conf = ''; const rr = rng(5); for (let i = 0; i < 80; i++) { const x = rr() * W, y = ((rr() * H + c.t * (200 + rr() * 200)) % H); conf += S.rect(x, y, 10, 16, ['#d7383a', '#8cc7f0', PAL.gold, '#5fe07a'][i % 4], { transform: `rotate(${c.t * 200 + i * 20},${x},${y})` }); } return scene(c, { back: r.back, bb: 2, mid: conf, cam: CAM.drift(960, 520, 1.05, .03)(c.p) }); } },
  { id: 'S097', type: 'CU-rack', desc: 'Trophy held up in the foreground; Eli\'s eyeline passes the trophy toward Noah (rack focus from trophy to Eli).', w: 1.1,
    draw: c => { const r = arena(c, { cheer: .8 }); const k = atE(c, .4, 1.4); return { layers: [{ svg: r.back, p: .8, blur: 10 }, { svg: A(c, { who: 'eli', x: 1250, y: 1150, h: 700, f: 1, pose: P.stand(), expr: 'neutral', light: LT.flood, lookX: 1 }), p: 1, blur: lerp(8, 0, k) }, { svg: PR.trophy(620, 780, 2.2), p: 1.2, blur: lerp(0, 12, k) }], cam: CAM.drift(960, 560, 1, .03)(c.p) }; } },
  { id: 'S098', type: 'MS', desc: 'Eli walks away from the trophy, threading through the cheering crowd toward Noah.', w: 1,
    draw: c => { const r = arena(c, { cheer: .7 }); let crowd = ''; [[300, 1], [1600, -1], [1800, -1], [140, 1]].forEach(([x, f], i) => crowd += A(c, { who: 'extra', x, y: 1100, h: 640, f, pose: P.cheer(), expr: 'happy', light: LT.flood, t: c.T + i })); return scene(c, { back: r.back, bb: 8, mid: A(c, { who: 'eli', x: lerp(700, 1200, c.p), y: 1100, h: 640, f: 1, pose: P.walk(c.t * 1.2), expr: 'determined', light: LT.flood }), fg: crowd, fb: 12, cam: { x: lerp(860, 1100, c.p), y: 600, z: 1 } }); } },
] });
addBeat({ id: 'B37', lines: ['L071', { id: 'L072', gap: .2 }, { id: 'L073', gap: .2 }, { id: 'L074', gap: .3 }, { id: 'L075', gap: .2 }], pre: .3, post: .6, music: { name: 'duck', vol: .15, at: 0 }, shots: [
  { id: 'S099', type: 'MS-2', desc: 'Two-shot by the bleachers, applause softening: Eli, sincere: "Dude... I\'m sorry." Noah: "For what?"', w: 1.2,
    draw: c => { const r = arena(c, { cheer: .2, noahCrowd: false }); return scene(c, { back: r.back, bb: 9, mid: A(c, { who: 'eli', x: 760, y: 1100, h: 640, f: 1, pose: P.stand(), expr: 'sad', light: LT.flood }) + A(c, { who: 'noah', x: 1180, y: 1100, h: 620, f: -1, pose: P.crossArms(), expr: 'unimpressed', light: LT.flood }), cam: CAM.drift(960, 600, 1.0, .03)(c.p) }); } },
  { id: 'S100', type: 'CU', on: 'L073', desc: 'Eli close-up: "Thinking I didn\'t need you."', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'eli', headAt: [860, 520], h: 1050, f: 1, pose: P.stand(), expr: 'sad', light: LT.flood }), fg: A(c, { who: 'noah', headAt: [1720, 560], h: 1400, f: -1, pose: P.crossArms(), expr: 'neutral', light: LT.flood }), fb: 16, cam: CAM.drift(900, 540, 1, .03)(c.p) }); } },
  { id: 'S101', type: 'CU', on: 'L074', desc: 'Noah close-up, a teasing smile breaking through: "Yeah, that was pretty stupid."', w: 1,
    draw: c => { const r = arena(c, { noahCrowd: false }); return scene(c, { back: r.back, bb: 12, mid: A(c, { who: 'noah', headAt: [1060, 520], h: 1050, f: -1, pose: P.stand(), expr: 'smug', light: LT.flood }), fg: A(c, { who: 'eli', headAt: [200, 560], h: 1400, f: 1, pose: P.stand(), expr: 'neutral', light: LT.flood }), fb: 16, cam: CAM.drift(1020, 540, 1, .03)(c.p) }); } },
  { id: 'S102', type: 'MS-2', on: 'L075', desc: 'Two-shot: Eli laughs "You\'re telling me." — Noah bumps his shoulder; they\'re friends again.', w: 1,
    draw: c => { const r = arena(c, { cheer: .2, noahCrowd: false }); const k = atE(c, .8, 1.4, 'outBack'); return scene(c, { back: r.back, bb: 9, mid: A(c, { who: 'eli', x: 800, y: 1100, h: 640, f: 1, pose: P.stand(), expr: 'happy', light: LT.flood }) + A(c, { who: 'noah', x: lerp(1160, 1010, k), y: 1100, h: 620, f: -1, pose: P.stand(), expr: 'happy', light: LT.flood, rot: -6 * k }), cam: CAM.push(960, 600, 1.0, 1.06)(c.p) }); } },
] });
addBeat({ id: 'B38', lines: ['L076', { id: 'L077', gap: .5 }], pre: .3, post: .6, music: { name: 'ending_light', vol: .35, at: 0, fade: 2 }, shots: [
  { id: 'S103', type: 'EST', desc: 'Dusk outside the school: the two friends walk home together carrying the robot and the trophy.', w: 1.1,
    draw: c => { const e = ENV.school({ t: c.T }); return scene(c, { back: e.back, bb: 0, mid: A(c, { who: 'eli', x: lerp(600, 1100, c.p), y: 880, h: 150, f: 1, pose: P.walk(c.t * .9), expr: 'happy', light: LT.hotR, holdSvg: PR.trophy(0, 0, .25) }) + A(c, { who: 'noah', x: lerp(680, 1180, c.p), y: 880, h: 145, f: 1, pose: P.walk(c.t * .9 + .5), expr: 'happy', light: LT.hotR }), cam: CAM.drift(960, 600, 1.15, .03)(c.p) }); } },
  { id: 'S104', type: 'INSERT', on: 'L077', desc: 'The robot\'s red and blue stripes side by side in warm light; the friends\' photo propped next to it.', w: 1,
    draw: c => { const e = ENV.workshop({ t: c.T, tod: .2 }); return scene(c, { back: e.back, bb: 12, mid: PR.robot(820, 900, { s: 2.6, ledBackup: true }) + PR.photo(1450, 820, 2.6, -6), cam: CAM.push(960, 600, 1, 1.07)(c.p) }); } },
] });
addBeat({ id: 'B39', lines: ['L078', { id: 'L079', gap: .3 }, { id: 'L080', gap: .3 }, { id: 'L081', gap: .9 }], pre: .3, post: 2.4, shots: [
  { id: 'S105', type: 'TOP-callback', desc: 'Match cut to the opening piano (overhead keys): Noah hits a terrible note.', w: 1, sfx: [[.3, 'piano_bad_notes', .7]],
    draw: c => { const pressed = {}; if (c.t > .3) { pressed[3] = 1; pressed[104] = 1; } const mid = S.rect(-200, -200, 2400, 1500, '#1a0f14') + PR.keysTop(160, 330, 1600, 21, pressed, { hit: '#ff6a5a' }) + bigHand(560, 520, 1.4, -90, PAL.noah, { curl: true }); return scene(c, { mid, cam: CAM.drift(960, 540, 1.05, .03)(c.p) }); } },
  { id: 'S106', type: 'MS-2', on: 'L078', desc: 'Music room: Noah at the piano: "So... you gonna teach me that piano song or what?" Eli sits down beside him: "Yeah."', w: 1.2,
    draw: c => { const e = ENV.musicroom({ t: c.T }); const k = atE(c, .4, 1.4); return scene(c, { back: e.back, bb: 4, mid: PR.piano(700, 860, 1.25) + PR.stool(1000, 860, 1.2) + PR.stool(1220, 860, 1.2) + A(c, { who: 'noah', x: 1000, y: 740, h: 360, f: -1, pose: P.sitPiano(c.T, .5), expr: 'smug', light: LT.warmL }) + A(c, { who: 'eli', x: lerp(1500, 1220, k), y: k < 1 ? lerp(860, 740, k) : 740, h: 360, f: -1, pose: k < 1 ? P.walk(c.t) : P.sit(), expr: 'happy', light: LT.warmL }), cam: CAM.drift(1000, 600, 1.15, .03)(c.p) }); } },
  { id: 'S107', type: 'MS', on: 'L080', desc: 'Noah, cheerfully: "Cool. It\'ll only take me ten hours."', w: 1,
    draw: c => { const e = ENV.musicroom({ t: c.T }); return scene(c, { back: e.back, bb: 9, mid: A(c, { who: 'noah', headAt: [1000, 500], h: 950, f: 1, pose: P.stand(), expr: 'happy', light: LT.warmL }), cam: CAM.drift(1000, 540, 1, .03)(c.p) }); } },
  { id: 'S108', type: 'CU-callback', on: 'L081', off: -.8, desc: 'Callback: Eli turns to camera with the same bewildered look from "Wait... what?": "...Oh my God." Comedic sting, cut to black with title.', w: 1, sfx: [[1.4, 'comedic_sting', .8]], tout: 'fade',
    draw: c => { const e = ENV.musicroom({ t: c.T }); const end = at(c, c.d - 1.4, c.d - .4); return scene(c, { back: e.back, bb: 12, mid: A(c, { who: 'eli', headAt: [960, 520], h: 1150, f: 1, front: true, pose: P.stand(), expr: 'bewildered', light: LT.warmL, rimW: 8 }), cam: CAM.push(960, 520, 1, 1.05)(c.p), overlay: S.g({ opacity: end }, S.rect(0, 0, W, H, '#0b0709', { opacity: .75 }), titleText([{ t: 'WHAT IF YOU COULD LEARN', size: 60, y: 480 }, { t: 'ANYTHING 10x FASTER?', size: 96, y: 590, fill: PAL.gold }])) }); } },
] });
