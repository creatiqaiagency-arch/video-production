// Frame composer: camera + parallax layers + depth-of-field + post stack (vignette, grade, grain, letterbox).

const BLUR_LEVELS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 30];
function blurDefs() {
  return BLUR_LEVELS.slice(1).map(b => `<filter id="b${b}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${b}"/></filter>`).join('') +
    `<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>` +
    `<filter id="txtGlow" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur in="SourceAlpha" stdDeviation="14" result="b"/><feFlood flood-color="${PAL.glow}" flood-opacity=".55"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    `<filter id="desat" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.12"/></filter>` +
    `<filter id="bloom" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="l"/><feComponentTransfer in="SourceGraphic" result="hi"><feFuncR type="linear" slope="2.6" intercept="-1.55"/><feFuncG type="linear" slope="2.6" intercept="-1.55"/><feFuncB type="linear" slope="2.6" intercept="-1.55"/></feComponentTransfer><feGaussianBlur in="hi" stdDeviation="28"/></filter>` +
    `<filter id="whip" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="40 0"/></filter>`;
}
function nearestBlur(b) { if (b <= .5) return 0; let best = BLUR_LEVELS[1]; for (const l of BLUR_LEVELS) if (Math.abs(l - b) < Math.abs(best - b)) best = l; return best; }

// camera: {x, y, z, r} — x,y = world point at screen centre, z zoom, r rotation deg
function camTransform(cam, par = 1) {
  const z = 1 + (cam.z - 1) * par;
  const cx = W / 2 + (cam.x - W / 2) * par, cy = H / 2 + (cam.y - H / 2) * par;
  return `translate(${W / 2},${H / 2}) rotate(${(cam.r || 0) * par}) scale(${z.toFixed(4)}) translate(${(-cx).toFixed(2)},${(-cy).toFixed(2)})`;
}

// Camera motion presets ------------------------------------------------------
const CAM = {
  still: (x = W / 2, y = H / 2, z = 1) => () => ({ x, y, z }),
  drift: (x = W / 2, y = H / 2, z = 1, dz = .05, dx = 30) => p => ({ x: x + dx * (p - .5) * 2, y, z: z + dz * E.sine(p) }),
  push: (x, y, z0, z1, ease = 'inOut') => p => ({ x, y, z: lerp(z0, z1, E[ease](p)) }),
  move: (a, b, ease = 'inOut') => p => { const k = E[ease](p); return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), z: lerp(a[2], b[2], k), r: lerp(a[3] || 0, b[3] || 0, k) }; },
  keys: keys => p => kf(p, keys.map(([t, v, e]) => [t, { x: v[0], y: v[1], z: v[2], r: v[3] || 0 }, e])),
};
function shake(t, amp, freq = 22) { return { x: noise1(t * freq) * amp, y: noise1(t * freq + 99) * amp }; }

// grain: tiles generated once in the browser
let GRAIN = [];
function initGrain() {
  if (typeof document === 'undefined') return;
  for (let k = 0; k < 6; k++) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), d = x.createImageData(256, 256), r = rng(1234 + k);
    for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); GRAIN.push(c.toDataURL());
  }
}

// compose a frame
// spec: {layers:[{svg, p (parallax), blur, op}], cam, overlay (screen-space svg), grade:{tint, op}, vignette, grain, letterbox, flash, fade}
function composeFrame(spec, T) {
  const cam = spec.cam || { x: W / 2, y: H / 2, z: 1 };
  if (spec.shake) { const s = shake(T, spec.shake); cam.x += s.x; cam.y += s.y; }
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><defs>${blurDefs()}</defs>`;
  s += S.rect(0, 0, W, H, spec.bg || '#000');
  const gr0 = spec.grade || {};
  s += `<g${gr0.sat !== undefined ? ' filter="url(#desat)"' : ''}><g${spec.whip > 0 ? ' filter="url(#whip)"' : ''}>`;
  let bloomSrc = '';
  for (const L of spec.layers) {
    if (!L || !L.svg) continue;
    const b = nearestBlur((L.blur || 0) * (spec.blurScale ?? 1));
    const lg = `<g transform="${camTransform(cam, L.p ?? 1)}"${L.op !== undefined ? ` opacity="${L.op}"` : ''}>${b ? `<g filter="url(#b${b})">` : '<g>'}${L.svg}</g></g>`;
    s += lg;
    // bloom: blurred highlights of the background layer, screen-blended UNDER the characters (never over them)
    if (L === spec.layers[0] && (spec.bloom ?? .55) > 0) s += `<g filter="url(#bloom)" opacity="${spec.bloom ?? .55}" style="mix-blend-mode:screen">${lg}</g>`;
  }
  s += '</g></g>';
  // colour grade: multiply tint + lifted blacks
  const gr = spec.grade || {};
  if (gr.sepia) s += S.rect(0, 0, W, H, gr.sepia, { opacity: .55, style: 'mix-blend-mode:multiply' });
  if (gr.tint) s += S.rect(0, 0, W, H, gr.tint, { opacity: gr.op ?? .12, style: 'mix-blend-mode:soft-light' });
  if (gr.warm !== false) s += S.rect(0, 0, W, H, '#1a0f1a', { opacity: .10, style: 'mix-blend-mode:lighten' });
  if (spec.overlay) s += spec.overlay;
  // vignette
  const vs = spec.vignette ?? .65;
  if (vs > 0) { const v = radGrad([[0, '#000', 0], [.45, '#000', 0], [1, '#000', vs]], .5, .5, .72); s += `<defs>${v.def}</defs>` + S.rect(0, 0, W, H, v.url); }
  // grain
  if ((spec.grain ?? .05) > 0 && GRAIN.length) {
    const k = Math.floor(T * 24) % GRAIN.length, ox = Math.floor(hash(T * 24) * 256), oy = Math.floor(hash(T * 24 + 7) * 256);
    s += `<defs><pattern id="gr" patternUnits="userSpaceOnUse" width="256" height="256" x="${ox}" y="${oy}"><image href="${GRAIN[k]}" width="256" height="256"/></pattern></defs>` + S.rect(0, 0, W, H, 'url(#gr)', { opacity: spec.grain ?? .05, style: 'mix-blend-mode:overlay' });
  }
  if ((spec.burn ?? .35) > 0) s += rectGrad(0, 0, W, 200, [[0, '#000', spec.burn ?? .35], [1, '#000', 0]]) + rectGrad(0, H - 200, W, 200, [[0, '#000', 0], [1, '#000', (spec.burn ?? .35) * .8]]);
  if (spec.flash) s += S.rect(0, 0, W, H, spec.flashColor || '#fff', { opacity: clamp(spec.flash) });
  if (spec.fade) s += S.rect(0, 0, W, H, '#000', { opacity: clamp(spec.fade) });
  // letterbox
  const lb = spec.letterbox ?? 60;
  if (lb > 0) s += S.rect(0, 0, W, lb, '#000') + S.rect(0, H - lb, W, lb, '#000');
  s += '</svg>';
  return s;
}

// ---- text helpers (screen-space overlays) ----
function titleText(lines, o = {}) {
  // lines: [{t, size, y}] centred
  const cx = o.x ?? W / 2;
  return S.g({ filter: 'url(#txtGlow)', opacity: o.op ?? 1, transform: o.tf || '' }, lines.map(l => S.text(cx, l.y, l.t, { 'font-family': 'Lilita One, Arial Black, sans-serif', 'font-size': l.size, fill: l.fill || PAL.cream, 'text-anchor': 'middle', 'letter-spacing': (l.size * .06).toFixed(1), stroke: '#2a1420', 'stroke-width': l.size * .045, 'paint-order': 'stroke', opacity: l.op ?? 1 })).join(''));
}
function label(x, y, str, o = {}) {
  const size = o.size || 54, k = o.k ?? 1;
  const sc = lerp(.85, 1, E.outBack(clamp(k)));
  return S.g({ transform: `translate(${x},${y}) scale(${sc})`, opacity: clamp(k * 1.4) * (o.op ?? 1) },
    S.text(3, 4, str, { 'font-family': 'Oswald, Inter, sans-serif', 'font-weight': 600, 'font-size': size, fill: '#000', opacity: .45, 'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls ?? 2 }),
    S.text(0, 0, str, { 'font-family': 'Oswald, Inter, sans-serif', 'font-weight': 600, 'font-size': size, fill: o.fill || PAL.cream, 'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls ?? 2 }));
}
// appear factor for labels: in over 0.25s from t0, out over .2s before t1
function appear(t, t0, t1 = 1e9) { return clamp((t - t0) / .25) * clamp((t1 - t) / .2); }
