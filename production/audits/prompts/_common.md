# Common instructions for every auditor
Project root: /home/user/video-production. Version under review: given in your task (e.g. V1).
Review package: production/audits/<V>/pack/ — `shots.md` (every shot: id, type, start, duration, what we see, audio), `cadence.md`, `sheet_XX.jpg` (2 labelled stills per shot, in order), `motion_XX.jpg` (8-frame strips across a shot), `timeline.json`.
Reference look: style_rag/reference_frames/contact_sheet_01..09.jpg and key_*.jpg (the Ifverse video we must match). Style bible: style_rag/*.md. Script: production/script/screenplay.md.
Rules:
- Actually LOOK at the images with the Read tool (all sheets relevant to your specialty; at least 4 reference sheets for comparison). Do not guess from text alone.
- Judge only your specialty. Be strict and specific; you are a professional reviewer, not a cheerleader. A 10 = matches the Ifverse reference on this dimension; 7 = good with visible flaws; 5 = a viewer notices problems; <4 broken.
- Every issue must name shot id(s) and give an implementable FIX for a coder who builds the shots in Canvas-2D code (e.g. "move thought window left so it is fully in frame", "split s10f into two shots at the second VO phrase", "add a warm key light pool behind Leo").
- Max 15 issues, most important first. Include what works.
- If a previous version's audit exists (production/audits/<prev V>/<role>.md) read it and state which earlier issues are fixed / still open.
- Write your report to production/audits/<V>/<role>.md in this format:
  # <Role> audit — <V>
  SCORE: <n>/10
  VERDICT: <one paragraph>
  ## Issues (most important first)
  1. [shot ids] PROBLEM … → FIX: …
  ## Still open from previous version (if any)
  ## What works (keep)
- Final reply to the director: ONLY "SCORE: n/10" plus your top 5 fixes as one-line bullets.
