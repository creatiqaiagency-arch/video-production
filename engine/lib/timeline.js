// Timeline: beats -> absolute times for VO lines, shots, sfx, music. Shared by renderer and audio mixer.
// Beat: {id, lines:[id | {id, gap, at}], pre, post, min, music:{name, vol, fadeIn, at}, shots:[{id, w, on, off, at, dur, draw(ctx), sfx:[[t,name,vol]]}]}

function buildTimeline(BEATS, VO) {
  const dur = VO.dur || {}, spk = VO.spk || {};
  const lines = [], shots = [], sfx = [], music = [], beats = [];
  let cur = 0;
  for (const b of BEATS) {
    const start = cur;
    const extra = {};               // extra pause inserted before a line so shots before it can breathe
    let lt, bd, starts, lastGap, lineRecs;
    for (let iter = 0; iter < 12; iter++) {
      let t = b.pre ?? .3; lt = {}; lastGap = 0; lineRecs = [];
      for (const L of (b.lines || [])) {
        const o = typeof L === 'string' ? { id: L } : L;
        if (o.at !== undefined) t = o.at;
        t += extra[o.id] || 0;
        const d = dur[o.id] ?? 2.5;
        lt[o.id] = { start: start + t, end: start + t + d };
        lineRecs.push({ id: o.id, start: start + t, dur: d, end: start + t + d, spk: spk[o.id] || 'NAR', beat: b.id, vol: o.vol ?? 1 });
        lastGap = o.gap ?? .22;
        t += d + lastGap;
      }
      bd = Math.max(b.min || 0, t - lastGap + (b.post ?? .35));
      const anchors = b.shots.map((s, i) => {
        if (i === 0) return 0;
        if (s.on) { const L = lt[s.on]; if (!L) throw new Error(`beat ${b.id} shot ${s.id} anchors to missing line ${s.on}`); return L.start - start + (s.off ?? -.15); }
        if (s.at !== undefined) return s.at < 0 ? bd + s.at : s.at;
        return null;
      });
      starts = new Array(b.shots.length);
      let i = 0, changed = false;
      while (i < b.shots.length) {
        let j = i + 1; while (j < b.shots.length && anchors[j] === null) j++;
        const a0 = anchors[i], a1 = j < b.shots.length ? anchors[j] : bd;
        const group = b.shots.slice(i, j);
        const fixed = group.reduce((s, x) => s + (x.dur || 0), 0);
        const wsum = group.reduce((s, x) => s + (x.dur ? 0 : (x.w ?? 1)), 0);
        const need = fixed + group.reduce((s, x) => s + (x.dur ? 0 : (x.min ?? b.minShot ?? 2.2)), 0);
        if (a1 - a0 < need - 1e-3) {
          const short = need - (a1 - a0);
          if (j < b.shots.length && b.shots[j].on && iter < 11) { extra[b.shots[j].on] = (extra[b.shots[j].on] || 0) + short; changed = true; break; }
          else if (j >= b.shots.length) { bd += short; }
        }
        const free = Math.max(0, (j < b.shots.length ? anchors[j] : bd) - a0 - fixed);
        // distribute by weight but respect minimums
        // give every weighted shot its minimum first, then share the rest by weight
        const mins = group.map(x => x.dur ? 0 : (x.min ?? b.minShot ?? 2.2));
        const minSum = mins.reduce((a, b) => a + b, 0);
        let lens;
        if (free <= minSum) lens = group.map((x, k) => x.dur ? x.dur : free * mins[k] / (minSum || 1));
        else {
          lens = group.map((x, k) => x.dur ? x.dur : free * (x.w ?? 1) / (wsum || 1));
          for (let it = 0; it < 6; it++) {
            const under = group.map((x, k) => !x.dur && lens[k] < mins[k]);
            if (!under.some(Boolean)) break;
            let deficit = 0; group.forEach((x, k) => { if (under[k]) { deficit += mins[k] - lens[k]; lens[k] = mins[k]; } });
            const ow = group.reduce((a, x, k) => a + (!x.dur && !under[k] && lens[k] > mins[k] ? (x.w ?? 1) : 0), 0);
            group.forEach((x, k) => { if (!x.dur && !under[k] && lens[k] > mins[k] && ow) lens[k] -= deficit * (x.w ?? 1) / ow; });
          }
        }
        let tt = a0;
        group.forEach((s, k) => { starts[i + k] = tt; tt += lens[k]; });
        i = j;
      }
      if (!changed) break;
    }
    lines.push(...lineRecs);
    b.shots.forEach((s, k) => {
      const s0 = start + starts[k], s1 = start + (k + 1 < b.shots.length ? starts[k + 1] : bd);
      const rec = { id: s.id, beat: b.id, start: s0, end: s1, dur: s1 - s0, def: s, hold: !!s.hold, type: s.type || '' };
      shots.push(rec);
      (s.sfx || []).forEach(([tt, name, vol = 1, opt = {}]) => sfx.push({ t: s0 + (tt < 0 ? rec.dur + tt : tt), name, vol, ...opt, shot: s.id }));
    });
    if (b.music) (Array.isArray(b.music) ? b.music : [b.music]).forEach(m => music.push({ ...m, t: m.onLine ? lt[m.onLine].start + (m.off || 0) : start + (m.at || 0), beat: b.id }));
    b.shots.forEach((s, k) => { if (s.music) music.push({ ...s.music, t: start + starts[k] + (s.music.at || 0), beat: b.id }); });
    const sfxT = tt => { if (typeof tt === 'string') { const m = tt.match(/^(L\d+)([+-][\d.]+)?$/); return lt[m[1]].start + (+m[2] || 0); } return start + tt; };
    (b.sfx || []).forEach(([tt, name, vol = 1, opt = {}]) => sfx.push({ t: sfxT(tt), name, vol, ...opt, beat: b.id }));
    beats.push({ id: b.id, start, end: start + bd, lt });
    cur += bd;
  }
  return { total: cur, lines, shots, sfx, music, beats };
}

function findShot(TL, T) {
  let lo = 0, hi = TL.shots.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (TL.shots[m].start <= T) lo = m; else hi = m - 1; }
  return TL.shots[lo];
}

// mouth amplitude for a speaker at absolute time T
function speakAmp(TL, T, who) {
  for (const L of TL.lines) {
    if (L.spk !== who || T < L.start || T > L.end) continue;
    const env = (window.VO && window.VO.env && window.VO.env[L.id]) || null;
    if (env) {
      if (!env._s) { const s = []; let v = 0; for (let i = 0; i < env.length; i++) { const x = env[i] || 0; v = x > v ? x : v * .62 + x * .38; s.push(v); } env._s = s; }
      const i = Math.floor((T - L.start) * 24) + 1; return clamp((env._s[i] || 0) * 1.0);
    }
    return .5 + .5 * Math.sin((T - L.start) * 40);
  }
  return 0;
}

function frameSpec(TL, T) {
  const sh = findShot(TL, T);
  const beat = TL.beats.find(b => b.id === sh.beat);
  const t = T - sh.start, d = sh.dur;
  const ctx = {
    T, t, d, p: clamp(t / d), id: sh.id, shot: sh,
    bt: T - beat.start,
    speak: who => speakAmp(TL, T, who),
    line: id => { const L = TL.lines.find(l => l.id === id); return L ? { t: T - L.start, p: clamp((T - L.start) / L.dur), on: T >= L.start && T <= L.end, start: L.start - sh.start, end: L.end - sh.start } : { t: -1, p: 0, on: false, start: 0, end: 0 }; },
  };
  const spec = sh.def.draw(ctx) || { layers: [] };
  // global entry transitions
  const tr = sh.def.tin;
  if (tr === 'flash') spec.flash = Math.max(spec.flash || 0, 1 - t / .18);
  if (tr === 'whip') spec.whip = Math.max(0, 1 - t / .22);
  if (tr === 'fade') spec.fade = Math.max(spec.fade || 0, 1 - t / .5);
  if (sh.def.tout === 'fade') spec.fade = Math.max(spec.fade || 0, 1 - (d - t) / .5);
  return spec;
}
