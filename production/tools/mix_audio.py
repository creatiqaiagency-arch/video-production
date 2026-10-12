#!/usr/bin/env python3
"""Mix the film's soundtrack from build/timeline.json.

VO (spoken + processed thoughts) → VO bus; music cues → music bus, ducked under VO with a
sidechain compressor; ambience + SFX → FX bus. Final loudness-normalised to -16 LUFS.
usage: mix_audio.py <out.wav>
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'audio')
tl = json.load(open(os.path.join(ROOT, 'build', 'timeline.json')))
M, Ls, TOTAL = tl['marks'], tl['lines'], tl['total']
st = lambda i: Ls[i]['start']
en = lambda i: Ls[i]['end']

# (file, start, dur, gain_dB, fade_in, fade_out, src_offset, loop)
music = [
    ('m01_curious_playful', M['TITLE'] - 0.3, M['S04'] - M['TITLE'] + 0.8, -9, 1.2, 1.5, 0, False),
    ('m02_romantic_swell', M['push'] - 0.2, st('s04_noah2') - M['push'] + 0.2, -7, 0.8, 0.05, 0, False),
    ('m01_curious_playful', M['S05'], M['doors'] - M['S05'] + 0.6, -10, 0.6, 1.0, 40, False),
    ('m03_overload_tension', M['doors'], M['cut_silence'] - M['doors'], -8, 1.5, 0.03, 0, False),
    ('m04_suspicion_low', M['S09'] - 0.5, M['S10'] - M['S09'] + 1.0, -11, 1.5, 2.0, 0, False),
    ('m04_suspicion_low', M['S11'], M['S12'] - M['S11'], -11, 1.5, 1.5, 28, False),
    ('m04_suspicion_low', M['S12'] + 1.0, M['silence'] - M['S12'] - 1.0, -15, 3.0, 0.05, 5, False),
    ('m05_heartfelt_piano', M['music_in'] - 0.3, M['S17'] - M['music_in'] + 1.5, -10, 2.5, 2.0, 0, False),
    ('m06_warm_resolution', M['S17'] + 0.5, TOTAL - M['S17'] - 0.5, -10, 2.0, 3.0, 0, False),
]
fx = [
    ('sfx_cafe_ambience', 0, M['crash'] + 0.2, -16, 1.0, 0.3, 0, True),
    ('sfx_time_freeze', M['freeze'] - 0.5, 1.0, -6, 0, 0.1, 0, False),
    ('sfx_ceramic_shatter', M['crash'] + 0.05, 2.5, -4, 0, 0.8, 0, False),
    ('sfx_whoosh_soft', M['TITLE'] - 0.3, 2.0, -8, 0, 0.3, 0, False),
    ('sfx_city_street', M['S02'], M['S03'] - M['S02'], -18, 1.0, 1.0, 0, True),
    ('sfx_classroom_tone', M['S03'], M['S04'] - M['S03'], 6, 0.8, 0.8, 0, True),
    ('sfx_school_bell', M['bell'] + 0.3, 1.0, -6, 0, 0.2, 0, False),
    ('sfx_school_bell', M['bell'] + 1.3, 1.0, -8, 0, 0.4, 0, False),
    ('sfx_record_scratch', st('s04_noah2') - 0.15, 1.2, -6, 0, 0.3, 0, False),
    ('sfx_door_double', M['doors'], 2.0, -6, 0, 0.3, 0, False),
    ('sfx_cafeteria_walla', M['doors'] + 0.2, M['S06'] + 4 - M['doors'], -14, 0.4, 3.0, 0, True),
    ('sfx_riser_tension', M['peak'] - 3.5, 4.0, -8, 0.5, 0.05, 0, False),
    ('sfx_impact_soft', M['peak'], 2.0, -6, 0, 0.5, 0, False),
    ('sfx_whoosh_deep', M['cut_silence'] - 0.3, 1.0, -6, 0, 0.2, 0, False),
    ('sfx_bathroom_lock', M['bathroom'] - 1.2, 1.0, -6, 0, 0.1, 0, False),
    ('sfx_low_tone', st('s08_leo_th1') - 0.1, 2.0, -6, 0, 0.6, 0, False),
    ('sfx_low_tone', st('s08_leo_th2') - 0.1, 2.0, -4, 0, 0.8, 0, False),
    ('sfx_heartbeat_slow', en('s08_leo_th2'), 3.0, -10, 0.2, 1.0, 0, False),
    ('sfx_clock_tick', M['S11'], M['S12'] - M['S11'], -12, 0.5, 0.8, 0, True),
    ('sfx_courtyard_wind', M['S12'], M['S18'] - M['S12'], -20, 2.0, 2.0, 0, True),
    ('sfx_heartbeat_slow', M['silence'], 2.4, -10, 0.1, 0.8, 0, False),
    ('sfx_paper_unfold', M['letter'] - 0.9, 1.6, -8, 0, 0.3, 0, False),
    ('sfx_city_street', M['S18'], TOTAL - M['S18'], -22, 1.5, 3.0, 0, True),
    ('sfx_whoosh_soft', st('s16_vo1') + 3, 2.0, -12, 0, 0.3, 0, False),
]
# a soft pop for every thought that appears on screen
for lid, l in Ls.items():
    if l['kind'] == 'thought' and not lid.startswith('s06_c'):
        fx.append(('sfx_thought_pop', l['start'] - 0.12, 1.0, -12, 0, 0.2, 0, False))

def src(name):
    for d in ('music', 'sfx'):
        p = os.path.join(A, d, name + '.mp3')
        if os.path.exists(p): return p
    raise FileNotFoundError(name)

# thoughts Noah chooses not to read (s17e / s18d): heard only as a muffled fragment
UNREAD = {'s17_leo_th', 's18_maya_th'}

def build(out):
    inputs, chains, vo_labels, mu_labels, fx_labels = [], [], [], [], []
    def add_input(path, loop=False):
        if loop: inputs.extend(['-stream_loop', '-1'])
        inputs.extend(['-i', path]); return len([x for x in inputs if x == '-i']) - 1
    # VO
    for lid, l in sorted(Ls.items(), key=lambda kv: kv[1]['start']):
        if not l.get('file'): continue
        k = add_input(os.path.join(ROOT, l['file']))
        g = -2.0 if l['kind'] == 'thought' else 0.0
        if lid.startswith('s06_c'): g = -5.0
        d = int(round(l['start'] * 1000))
        extra = ''
        if lid in UNREAD:  # Noah chooses not to read it: muffled, far away, cut off mid-word
            cut = l['dur'] * 0.5
            extra = f',lowpass=f=1100,volume=-18dB,afade=t=out:st={cut:.3f}:d=0.12,atrim=0:{cut + 0.12:.3f}'
        chains.append(f'[{k}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={g}dB{extra},adelay={d}|{d}[v{k}]'); vo_labels.append(f'[v{k}]')
    def cue(item, labels, tag):
        name, start, dur, gain, fi, fo, off, loop = item
        if dur <= 0.05: return
        k = add_input(src(name), loop)
        d = int(round(max(0, start) * 1000))
        chains.append(f'[{k}:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim={off}:{off + dur},asetpts=PTS-STARTPTS,'
                      f'afade=t=in:d={max(fi, 0.01)},afade=t=out:st={max(0, dur - fo):.3f}:d={max(fo, 0.01)},volume={gain}dB,adelay={d}|{d}[{tag}{k}]')
        labels.append(f'[{tag}{k}]')
    for m in music: cue(m, mu_labels, 'm')
    for f in fx: cue(f, fx_labels, 'f')
    n = lambda L: len(L)
    chains.append(f"{''.join(vo_labels)}amix=inputs={n(vo_labels)}:normalize=0:dropout_transition=0,apad=whole_dur={TOTAL}[vo]")
    chains.append(f"{''.join(mu_labels)}amix=inputs={n(mu_labels)}:normalize=0:dropout_transition=0,apad=whole_dur={TOTAL}[mu]")
    chains.append(f"{''.join(fx_labels)}amix=inputs={n(fx_labels)}:normalize=0:dropout_transition=0,apad=whole_dur={TOTAL}[fx]")
    chains.append('[vo]asplit=2[vo1][vo2]')
    chains.append('[mu][vo2]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450:makeup=1[mud]')
    chains.append(f'[vo1][mud][fx]amix=inputs=3:normalize=0:dropout_transition=0,atrim=0:{TOTAL},loudnorm=I=-16:TP=-1.5:LRA=11[out]')
    fc = os.path.join(ROOT, 'build', 'mix_filter.txt'); open(fc, 'w').write(';\n'.join(chains))
    cmd = ['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex_script', fc, '-map', '[out]', '-ar', '48000', '-ac', '2', out]
    subprocess.run(cmd, check=True)
    print('mixed', out, f'{TOTAL:.1f}s', len(vo_labels), 'vo', len(mu_labels), 'music', len(fx_labels), 'fx')

if __name__ == '__main__':
    build(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build', 'mix.wav'))
