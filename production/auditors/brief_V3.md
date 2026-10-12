# Auditor brief (common to all six auditors)

You are one member of a six-person review team checking an AI-made animated YouTube video:
"What If You Could See 5 Seconds Into the Future?" — a 16:9 stick-figure story in the exact style of the Ifverse
reference video ("What If Your Reaction Time Was 10x Faster?"). The video is made with code (SVG drawn per frame), so
mistakes are typical AI mistakes: things that look fine in code but make no sense to a viewer, wrong positions,
stiff poses, characters floating, unreadable moments, logic breaks in the story.

Be harsh and specific. Your job is to catch what a normal first-time viewer would find confusing, ugly or boring.
Do NOT praise generically. Every problem needs a concrete fix the animator can implement in code.

## Inputs (read them with the Read tool — they are images and markdown)
- Style bible for the reference look: /home/user/video-production/style_rag/ (start with README.md, 01, 04, 05, 10, 11)
- Reference frames from the original video: /home/user/video-production/style_rag/reference_frames/contact_sheets/sheet_0.jpg … sheet_6.jpg
- THIS VERSION's contact sheets (3 frames per shot: start / middle / end, labelled with shot id, start time, duration, VO clip ids):
  /home/user/video-production/production/build/review/V3/sheet_00.jpg … sheet_15.jpg
- Shot list with each shot's INTENT and the exact line spoken during it: /home/user/video-production/production/build/review/V3/shotlist.md
- PREVIOUS ROUND: /home/user/video-production/production/auditors/V2/scorecard.md (V1 average 4.7, V2 average 5.7, and the merged V3 fix plan).
  For each of YOUR V2 problems (see the V2 scorecard), judge whether V3 fixed it; then list what is still wrong or newly broken. Score V3 on its own merits.
- V2 contact sheets for comparison: /home/user/video-production/production/build/review/V2/sheet_00.jpg … sheet_14.jpg

## Required output (exactly this structure, nothing else)
AUDITOR: <your role>
SCORE: <1-10>  (10 = indistinguishable in quality from the reference; 7 = good YouTube quality; 5 = understandable but clearly amateur; 3 = confusing)
TOP PROBLEMS (most important first, max 12):
1. [shot id(s)] problem → FIX: concrete change (positions, poses, timing, colours, camera, what to add/remove)
...
WHAT WORKS (max 3 bullets, so fixes don't break it):
- ...
