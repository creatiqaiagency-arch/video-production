// Approval demo: 3D crane/orbit establishing shot of the tournament hall (appended after the film).
addBeat({ id: 'DEMO3D', lines: [], pre: 5.5, post: 0, shots: [
  { id: 'D3D', dur: 5.5, desc: '3D crane-down orbit over the tournament hall.',
    draw: c => {
      const cam = P3.camKeys(c.p, [
        [0, { yaw: -48, pitch: 40, dist: 30, target: [0, 1, 6], fov: 46, roll: -3 }],
        [1, { yaw: 22, pitch: 9, dist: 12.5, target: [-1.2, 1.3, 2.6], fov: 38, roll: 0 }, 'inOut']]);
      const a = arena3D(c, cam, { robotK: lerp(.05, .55, E.inOut(c.p)), cheer: .3, focus: lerp(40, 15, E.inOut(seg(c.p, .3, 1))) });
      return scene(c, { back: a.far, bp: 1, bb: lerp(0, 6, E.inOut(seg(c.p, .35, 1))), mid: a.near, bgc: '#0e0b1a', bloom: .6 });
    } }] });
