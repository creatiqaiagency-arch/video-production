"""Analyse ElevenLabs VO clips: trim lead/tail silence, find phrase starts (pauses), and a 24fps loudness envelope for lip-sync.
Writes production/build/vo_index.json and trimmed WAVs in production/build/vo/."""
import json, os, subprocess, sys
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "audio", "vo"); OUT = os.path.join(ROOT, "build", "vo"); os.makedirs(OUT, exist_ok=True)
SR = 48000; FPS = 24

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

index = {}
for f in sorted(os.listdir(SRC)):
    if not f.endswith(".mp3"): continue
    name = f[:-4]; x = load(os.path.join(SRC, f))
    win = SR // 100  # 10 ms
    n = len(x) // win
    rms = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    thr = max(db.max() - 38, -50)
    voiced = db > thr
    idx = np.where(voiced)[0]
    a, b = max(idx[0] - 3, 0), min(idx[-1] + 8, n)
    seg = x[a * win: b * win]
    v = voiced[a:b]
    # phrase starts: voiced after >= 22 x 10ms of silence
    phrases, sil, start = [], 0, 0
    for i, on in enumerate(v):
        if on:
            if i == 0 or sil >= 22:
                if i: phrases.append([start / 100, (i - sil) / 100])
                start = i
            sil = 0
        else:
            sil += 1
    phrases.append([start / 100, len(v) / 100])
    # 24fps envelope 0..1
    fw = SR // FPS; m = len(seg) // fw + 1
    padded = np.pad(seg, (0, m * fw - len(seg)))
    env = np.sqrt((padded.reshape(m, fw) ** 2).mean(axis=1))
    env = np.clip(env / (np.percentile(env, 95) + 1e-9), 0, 1)
    # write trimmed wav (stereo 48k)
    wav = os.path.join(OUT, name + ".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-ac", "2", wav], input=seg.tobytes(), check=True)
    index[name] = {"dur": round(len(seg) / SR, 3), "phrases": [[round(p, 2), round(q, 2)] for p, q in phrases], "env": [round(float(e), 2) for e in env]}
    print(f"{name}: {index[name]['dur']:.2f}s phrases={[p[0] for p in index[name]['phrases']]}")
json.dump(index, open(os.path.join(ROOT, "build", "vo_index.json"), "w"))
