"""Procedural ambience beds and long SFX layers (ElevenLabs SFX came back 1-3 s long, too short to loop cleanly).
Writes production/audio/synth/*.wav (48 kHz stereo)."""
import os, subprocess
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'synth'); os.makedirs(OUT, exist_ok=True)
SR = 48000
rng = np.random.default_rng(7)

def lp(x, fc):  # one-pole low-pass
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def lp_fast(x, fc):  # vectorised-ish low-pass via FFT
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / np.sqrt(1 + (f / fc) ** 4); return np.fft.irfft(X, len(x))
def bp_fast(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= ((f > lo) & (f < hi)) * 1.0; return np.fft.irfft(X, len(x))
def env_ar(n, a, r):
    e = np.ones(n); ka = int(a * SR); kr = int(r * SR)
    if ka: e[:ka] = np.linspace(0, 1, ka)
    if kr: e[-kr:] *= np.linspace(1, 0, kr)
    return e
def stereo(l, r=None, w=0.0):
    if r is None: r = l
    return np.stack([l * (1 - w) + r * w, r * (1 - w) + l * w], 1)
def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.7
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', os.path.join(OUT, name + '.wav')], input=x.astype(np.float32).tobytes(), check=True)
    print(name, f'{len(x) / SR:.1f}s')
def seamless(x, xf=2.0):  # make loop seamless by crossfading the tail into the head
    k = int(xf * SR); r = np.linspace(0, 1, k)[:, None] if x.ndim == 2 else np.linspace(0, 1, k)
    head = x[:k] * r + x[-k:] * (1 - r); return np.concatenate([head, x[k:-k]])

T = 32; n = T * SR; t = np.arange(n) / SR
# CITY NIGHT: distant traffic rumble + wind + occasional passing cars + far horn
rumble = lp_fast(rng.standard_normal(n), 180) * 1.0
wind = bp_fast(rng.standard_normal(n), 300, 1800) * (0.25 + 0.15 * np.sin(2 * np.pi * t / 7))
city = rumble + wind * .5
for k in range(6):
    c = rng.uniform(2, T - 6); d = rng.uniform(3, 5); m = (t > c) & (t < c + d)
    sw = np.zeros(n); sw[m] = np.sin(np.pi * (t[m] - c) / d) ** 2
    city += bp_fast(rng.standard_normal(n), 200, 2500) * sw * 1.4
for k in range(2):
    c = rng.uniform(4, T - 4); m = (t > c) & (t < c + .5)
    city[m] += 0.08 * np.sign(np.sin(2 * np.pi * 410 * t[m])) * np.sin(np.pi * (t[m] - c) / .5)
save('amb_city_night', seamless(stereo(city, np.roll(city, 900), .3)))
# CAFE: murmur (band-limited noise with syllable-rate modulation) + cup clinks
mur = np.zeros(n)
for v in range(5):
    sy = np.clip(lp_fast(rng.standard_normal(n), 4) * 3, 0, None)
    mur += bp_fast(rng.standard_normal(n), 250 + v * 60, 1800 + v * 100) * sy
cafe = mur * .8 + lp_fast(rng.standard_normal(n), 400) * .3
for k in range(18):
    c = rng.uniform(0, T - 1); f0 = rng.uniform(2200, 4200); m = (t > c) & (t < c + .35)
    cafe[m] += .12 * np.sin(2 * np.pi * f0 * (t[m] - c)) * np.exp(-(t[m] - c) * 22)
save('amb_cafe', seamless(stereo(cafe, np.roll(cafe, 2400), .25)))
# KITCHEN MORNING: room tone + fridge hum + birds
room = lp_fast(rng.standard_normal(n), 300) * .25 + .03 * np.sin(2 * np.pi * 60 * t) + .015 * np.sin(2 * np.pi * 120 * t)
for k in range(22):
    c = rng.uniform(0, T - 1); m = (t > c) & (t < c + .12); f = 3200 + 1400 * np.sin(np.pi * (t[m] - c) / .12)
    room[m] += .15 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * (t[m] - c) / .12)
save('amb_kitchen', seamless(stereo(room, np.roll(room, 1200), .2)))
# GYM: big hall tone + distant voices + squeaks
hall = lp_fast(rng.standard_normal(n), 500) * .4 + bp_fast(rng.standard_normal(n), 300, 1200) * np.clip(lp_fast(rng.standard_normal(n), 3) * 2, 0, None) * .5
for k in range(10):
    c = rng.uniform(0, T - 1); m = (t > c) & (t < c + .15); f = 1800 + 900 * (t[m] - c) / .15
    hall[m] += .1 * np.sin(2 * np.pi * np.cumsum(f) / SR)
save('amb_gym', seamless(stereo(hall, np.roll(hall, 3000), .35)))
# LONG SFX LAYERS
# truck approach: 6 s rising diesel rumble with doppler-ish pitch rise and tyre hiss on wet road
T2 = 6; n2 = T2 * SR; t2 = np.arange(n2) / SR; g = (t2 / T2) ** 2
f = 38 + 22 * g; ph = 2 * np.pi * np.cumsum(f) / SR
eng = (np.sign(np.sin(ph)) * .5 + np.sin(2 * ph) * .3 + np.sin(3 * ph) * .2)
eng = lp_fast(eng, 600) * (0.1 + g) + bp_fast(rng.standard_normal(n2), 1500, 7000) * g * .35
save('truck_approach_long', stereo(eng * env_ar(n2, .5, .05)))
# skid: 3 s screech
T3 = 3; n3 = T3 * SR; t3 = np.arange(n3) / SR
sc = bp_fast(rng.standard_normal(n3), 900, 3200) * (1 + .5 * np.sin(2 * np.pi * 11 * t3)) + .3 * np.sin(2 * np.pi * (1300 - 200 * t3) * t3)
save('skid_long', stereo(sc * env_ar(n3, .05, .8)))
# crash tail: boom + debris rattle 3.5 s
T4 = 3.5; n4 = int(T4 * SR); t4 = np.arange(n4) / SR
boom = np.sin(2 * np.pi * 48 * t4) * np.exp(-t4 * 3) * 1.2 + lp_fast(rng.standard_normal(n4), 900) * np.exp(-t4 * 2.5)
deb = np.zeros(n4)
for k in range(40):
    c = rng.uniform(.05, 2.8); m = (t4 > c) & (t4 < c + .08)
    deb[m] += rng.uniform(.1, .3) * bp_fast(rng.standard_normal(n4), 2000, 8000)[m] * np.exp(-(t4[m] - c) * 50)
save('crash_tail', stereo(boom + deb, boom + np.roll(deb, 500), .2))
