#!/usr/bin/env python3
"""Mix VO + SFX + music from a timeline JSON into a 48 kHz stereo WAV.
usage: mix.py timeline.json vo_data.json prod_dir out.wav
Music cues: {name, vol, fade, at}; name 'stop' fades the current bed out, 'duck' changes its level.
"""
import json, subprocess, sys, os
import numpy as np

SR = 48000
tl = json.load(open(sys.argv[1])); vo = json.load(open(sys.argv[2])); prod = sys.argv[3]; out = sys.argv[4]
lead = vo['env'].get('_lead', {})
N = int((tl['total'] + 1.0) * SR)
cache = {}

def load(path):
    if path in cache: return cache[path]
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(pcm, dtype=np.float32).reshape(-1, 2).copy()
    cache[path] = a
    return a

def place(buf, a, t, gain=1.0):
    i = int(round(t * SR))
    if i < 0: a = a[-i:]; i = 0
    j = min(len(buf), i + len(a))
    if j > i: buf[i:j] += a[:j - i] * gain

def rms(a): return float(np.sqrt(np.mean(a ** 2)) + 1e-9)

voice = np.zeros((N, 2), np.float32)
lines_sorted = sorted(tl['lines'], key=lambda l: l['start'])
for k, L in enumerate(lines_sorted):
    a = load(os.path.join(prod, 'vo', L['id'] + '.mp3')).copy()
    if k + 1 < len(lines_sorted) and lines_sorted[k + 1]['start'] < L['end']:  # interrupted line: quick fade at the cut-in
        cut = int((lines_sorted[k + 1]['start'] - L['start'] + lead.get(L['id'], 0)) * SR)
        f = int(.08 * SR)
        if 0 < cut < len(a):
            a[cut:cut + f] *= np.linspace(1, 0, len(a[cut:cut + f]))[:, None]; a[cut + f:] = 0
    g = 0.10 / rms(a[np.abs(a).max(axis=1) > 0.01] if (np.abs(a).max(axis=1) > 0.01).any() else a)  # loudness-match lines
    place(voice, a, L['start'] - lead.get(L['id'], 0), min(g, 4.0) * L.get('vol', 1))

sfx = np.zeros((N, 2), np.float32)
for s in tl['sfx']:
    f = os.path.join(prod, 'sfx', s['name'] + '.mp3')
    if not os.path.exists(f): print('missing sfx', s['name']); continue
    a = load(f)
    if s.get('dur'):
        n = int(s['dur'] * SR); a = a[:n].copy(); fo = min(len(a), int(.25 * SR)); a[-fo:] *= np.linspace(1, 0, fo)[:, None]
    pk = np.abs(a).max() + 1e-9
    place(sfx, a, s['t'], (0.5 / pk) * s.get('vol', 1))

# music bed with cues
music = np.zeros((N, 2), np.float32)
cues = sorted(tl['music'], key=lambda m: m['t'])
cur = None  # dict(name, start, vol)
segments = []
for c in cues:
    if c['name'] == 'duck':
        if cur: segments.append(dict(cur, end=c['t'])); cur = dict(cur, start_level=c['t'], vol=c.get('vol', .2), cont=True)
        continue
    if cur: segments.append(dict(cur, end=c['t']))
    cur = None if c['name'] == 'stop' else dict(name=c['name'], start=c['t'], vol=c.get('vol', .35), fade=c.get('fade', 1.0), start_level=c['t'], cont=False)
if cur: segments.append(dict(cur, end=tl['total'] + .5))
for sgm in segments:
    a = load(os.path.join(prod, 'music', sgm['name'] + '.mp3'))
    t0, t1 = sgm['start_level'], sgm['end']
    n = int((t1 - t0) * SR)
    if n <= 0: continue
    off = int((t0 - sgm['start']) * SR)  # continue the same track position after a duck
    if sgm.get('loop'):
        idx = (np.arange(n) + off) % len(a)
    else:
        n = max(0, min(n, len(a) - off)); idx = np.arange(n) + off
    if n <= 0: continue
    seg = a[idx] * sgm['vol']
    fi = int((0 if sgm['cont'] else sgm['fade']) * SR); fo = int(.6 * SR)
    if fi > 0: seg[:min(fi, n)] *= np.linspace(0, 1, min(fi, n))[:, None]
    seg[-min(fo, n):] *= np.linspace(1, 0, min(fo, n))[:, None]
    place(music, seg, t0)
# sidechain duck music under VO
env = np.abs(voice).max(axis=1)
k = int(.25 * SR); kern = np.ones(k) / k
env = np.convolve(env, kern, mode='same')
duck = 1 - 0.6 * np.clip(env / 0.05, 0, 1)
music *= duck[:, None]

mix = voice + sfx * 0.8 + music * 1.0
pk = np.abs(mix).max()
if pk > 0.89: mix *= 0.89 / pk
import wave
w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
print('mixed', out, round(len(mix) / SR, 1), 's', 'segments', [(s['name'], round(s['start_level'], 1), round(s['end'], 1)) for s in segments])
