# Auditor brief (shared by all auditors)

Project: "What If You Could Learn Anything 10× Faster?" — an Ifverse-style stickman animated story made entirely in code (SVG scenes rendered frame-by-frame).

You are one member of a review team. Your job is to judge the **current version** strictly on your own dimension, give a **score from 1 to 10**, and list **concrete, actionable fixes** the animator can implement in code.

## Materials (paths relative to /home/user/video-production)
- Version folder: `production/learn-10x/renders/<V>/`
  - `learn10x_<V>.mp4` — the full video with audio (1080p, 24 fps)
  - `timeline.json` — every shot: id, start, end, dur, type, hold flag, desc (what the shot is supposed to show); every VO line with start time and speaker; sfx; music cues
  - `stills/` — one still per shot (mid-shot); `contact_sheet_*.jpg` — 28 shots per sheet
- Script lines: `production/learn-10x/vo_lines.json` ([id, speaker, text])
- Style RAG (the bar to hit): `rag/ifverse-style/` — read `README.md`, `01_style_bible.md`, `03_camera_editing_pacing.md`, `04_characters_learn10x.md`, `06_auditor_rubrics.md`. Reference look: `rag/ifverse-style/contact_sheets/` and `reference_frames/`.
- Engine source (so fixes can be specific): `engine/shots/act1.js`, `act2.js`, `act3.js` (shots by id), `engine/lib/*.js`.

## Tools you may use
- Read images (contact sheets, stills). To inspect motion, extract frames with ffmpeg, e.g.
  `ffmpeg -v error -ss <t> -t 2 -i <mp4> -vf "fps=6,scale=480:-1,tile=6x2" -frames:v 1 /tmp/claude-0/audit_<you>_<n>.jpg` and Read the result.
- Write scratch files only under `/tmp/claude-0/`. Do NOT edit engine or production files except your own report.

## Output
Write your report as JSON to `production/learn-10x/audits/<V>/<auditor_key>.json`:
```json
{"auditor": "...", "version": "V1", "score": 6.5, "summary": "...", "strengths": ["..."],
 "issues": [{"shot": "S012", "severity": "high|med|low", "problem": "...", "fix": "specific change, ideally naming the code (e.g. 'act1.js S012: move headAt to [960,500], use expr shock')"}]}
```
Order issues by impact on a first-time viewer. Up to ~20 issues. Be harsh but fair: 10 = indistinguishable in quality from the Ifverse reference on your dimension. Then reply with a ≤8-line summary (score + top 3 fixes).
