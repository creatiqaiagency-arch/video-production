#!/usr/bin/env python3
"""Build vo_data.json: per-line duration, speaker, and 24fps loudness envelope (for mouth animation)."""
import json, subprocess, sys, os, numpy as np
vo_dir, lines_json, out = sys.argv[1], sys.argv[2], sys.argv[3]
lines = json.load(open(lines_json))
dur, spk, env = {}, {}, {}
for lid, who, text in lines:
    f = os.path.join(vo_dir, lid + '.mp3')
    spk[lid] = who
    if not os.path.exists(f):
        continue
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '24000', '-f', 's16le', '-'], capture_output=True).stdout
    a = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
    # trim leading/trailing silence for timing purposes (keep the file untouched; mixer applies same offsets)
    hop = 1000  # 24 fps at 24 kHz
    n = len(a) // hop
    rms = np.array([np.sqrt(np.mean(a[i*hop:(i+1)*hop] ** 2)) for i in range(n)]) if n else np.zeros(1)
    thr = max(rms.max() * 0.06, 1e-4)
    on = np.where(rms > thr)[0]
    lead = int(on[0]) if len(on) else 0
    tail = int(on[-1]) + 1 if len(on) else n
    e = rms[lead:tail]
    e = e / (np.percentile(e, 95) + 1e-6)
    dur[lid] = round((tail - lead) / 24.0, 3)
    env[lid] = [round(float(min(1.0, x)), 2) for x in e]
    env.setdefault('_lead', {})[lid] = round(lead / 24.0, 3)
json.dump({'dur': dur, 'spk': spk, 'env': env}, open(out, 'w'))
print(len(dur), 'lines', round(sum(dur.values()), 1), 's total speech')
