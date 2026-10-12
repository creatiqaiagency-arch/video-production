"""Mix VO + SFX + ambience + music from build/timeline.json into build/mix.wav (48 kHz stereo)."""
import json, os, subprocess
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
tl = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
N = int((tl['duration'] + 0.5) * SR)
vo_bus = np.zeros((N, 2), np.float32); fx_bus = np.zeros((N, 2), np.float32); amb_bus = np.zeros((N, 2), np.float32); mus_bus = np.zeros((N, 2), np.float32)
_cache = {}
def load(path):
    if path not in _cache:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
        _cache[path] = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
    return _cache[path]
def db(x): return 10 ** (x / 20)
def place(bus, x, t0, gain=0.0, fade_in=0.0, fade_out=0.0, length=None):
    if length is not None:
        n = int(length * SR)
        if len(x) < n:  # loop with crossfade
            xf = int(0.25 * SR); out = x.copy()
            while len(out) < n:
                k = min(xf, len(x) // 3, len(out))
                ramp = np.linspace(0, 1, k)[:, None]
                out = np.concatenate([out[:-k], out[-k:] * (1 - ramp) + x[:k] * ramp, x[k:]])
            x = out
        x = x[:n]
    x = x * db(gain)
    x = x.copy()
    if fade_in > 0: k = min(len(x), int(fade_in * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fade_out > 0: k = min(len(x), int(fade_out * SR)); x[-k:] *= np.linspace(1, 0, k)[:, None]
    s = int(t0 * SR)
    if s < 0: x = x[-s:]; s = 0
    e = min(N, s + len(x)); bus[s:e] += x[:e - s]

GAIN = {'narrator': 0.0, 'leo': -0.5, 'nora': -0.5, 'sam': -1.0}
for v in tl['vo']:
    x = load(os.path.join(ROOT, 'build', 'vo', v['clip'] + '.wav'))
    place(vo_bus, x, v['t0'], GAIN[v['speaker']])
missing = set()
LAYERS = {'sfx_truck_approach': [('truck_approach_long', -4.5, -2)], 'sfx_skid_horn': [('skid_long', 0.4, -3)], 'sfx_crash': [('crash_tail', 0.0, -2)]}
for s in tl['sfx']:
    p = os.path.join(ROOT, 'audio', 'sfx', s['name'] + '.mp3')
    if not os.path.exists(p): missing.add(s['name']); continue
    if s['name'].startswith('amb_') and os.path.exists(os.path.join(ROOT, 'audio', 'synth', s['name'] + '.wav')):
        p = os.path.join(ROOT, 'audio', 'synth', s['name'] + '.wav')
    x = load(p)
    for layer, off, lg in LAYERS.get(s['name'], []):
        place(fx_bus, load(os.path.join(ROOT, 'audio', 'synth', layer + '.wav')), s['t0'] + off, s['gain'] + lg, 0.05, 0.3)
    if s['name'].startswith('amb_'):
        place(amb_bus, x, s['t0'], s['gain'], 0.8, 0.8, length=s['block_end'] - s['t0'])
    else:
        place(fx_bus, x, s['t0'], s['gain'], 0.0, 0.05)
for m in tl['music']:
    p = os.path.join(ROOT, 'audio', 'music', m['name'] + '.mp3')
    if not os.path.exists(p): missing.add(m['name']); continue
    place(mus_bus, load(p), m['t0'], m['gain'], m['fade_in'], m['fade_out'], length=m['t1'] - m['t0'])
# duck music + ambience under VO
env = np.abs(vo_bus).max(axis=1)
win = int(0.05 * SR); env = np.convolve(env, np.ones(win) / win, mode='same')
active = (env > 0.01).astype(np.float32)
sm = int(0.3 * SR); active = np.convolve(active, np.ones(sm) / sm, mode='same')
duck = 1 - 0.55 * active
mix = vo_bus + fx_bus + amb_bus * (1 - 0.3 * active)[:, None] + mus_bus * duck[:, None]
# soft limiter + normalise
peak = np.abs(mix).max(); rms = np.sqrt((vo_bus ** 2).mean() + 1e-12)
mix *= min(0.9 / peak, 0.13 / max(rms, 1e-6)) if peak > 0 else 1
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
out = os.path.join(ROOT, 'build', 'mix.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', out], input=mix.astype(np.float32).tobytes(), check=True)
print('mix written', out, f'{N / SR:.1f}s', 'missing:', sorted(missing))
