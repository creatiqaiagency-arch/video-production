const L = { dx: -1, dy: -.35, color: PAL.rim };
const BEATS = [
 { id: 'T1', min: 3, shots: [
  { id: 'T_class', draw: c => { const e = ENV.classroom({ t: c.T });
     const mid = classDesks(900, [300, 700], { t: c.T, light: L, s: .9 }) +
       ch({ who: 'teacher', x: 1250, y: 770, h: 330, f: -1, pose: P.point(), expr: 'unimpressed', t: c.T, light: L, talk: .3 }) +
       ch({ who: 'eli', x: 1000, y: 830, h: 300, f: -1, pose: P.sit(), expr: 'happy', t: c.T, light: L }) + PR.desk(980, 960, 230);
     return { layers: [{ svg: e.back, p: .8, blur: 3 }, { svg: mid, p: 1 }, { svg: PR.desk(1700, 1200, 500), p: 1.3, blur: 14 }], cam: CAM.drift(960, 560, 1.02)(c.p) }; } } ] },
 { id: 'T2', min: 3, shots: [
  { id: 'T_hall', draw: c => { const e = ENV.hallway({ t: c.T });
     return { layers: [{ svg: e.back, p: .7, blur: 2 }, { svg: ch({ who: 'eli', x: 960, y: 980, h: 620, f: 1, pose: P.stand(), expr: 'smug', turn: .2, t: c.T, light: { dx: 0, dy: -1, color: PAL.rimHot }, rimW: 6 }), p: 1 }], cam: CAM.push(960, 640, 1.0, 1.08)(c.p) }; } } ] },
 { id: 'T3', min: 3, shots: [
  { id: 'T_cu', draw: c => { const e = ENV.bedroom({ t: c.T });
     return { layers: [{ svg: e.back, p: .6, blur: 10 }, { svg: ch({ who: 'eli', x: 900, y: 1500, h: 1100, f: 1, pose: P.stand(), expr: 'shock', t: c.T, light: { dx: 1, dy: -.3, color: PAL.lamp }, rimW: 7 }), p: 1 },
       { svg: ch({ who: 'noah', x: 1650, y: 1700, h: 1300, f: -1, pose: P.stand(), expr: 'neutral', t: c.T, light: L }), p: 1.2, blur: 16 }], cam: CAM.drift(960, 540, 1, .03)(c.p) }; } } ] },
 { id: 'T4', min: 3, shots: [
  { id: 'T_field', draw: c => { const e = ENV.field({ t: c.T });
     const k = (c.t * 1.3) % 1;
     return { layers: [{ svg: e.back, p: .7, blur: 2 }, { svg: PR.goal(380, 840) + ch({ who: 'eli', x: 800 + c.t * 60, y: 880, h: 260, f: 1, pose: P.run(k), expr: 'determined', t: c.T, light: { dx: 1, dy: -.3, color: PAL.rimHot } }) + ch({ who: 'noah', x: 1400, y: 870, h: 250, f: -1, pose: P.cheer(), expr: 'shock', t: c.T, light: { dx: 1, dy: -.3, color: PAL.rimHot } }) + PR.ball(900 + c.t * 80, 860, 18, c.t * 300), p: 1 }], cam: CAM.drift(960, 600, 1.02)(c.p) }; } } ] },
];
