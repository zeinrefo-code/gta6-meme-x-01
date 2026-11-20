# gta6-meme-x-01

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/zeinrefo-code/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/zeinrefo-code/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

# GTA 6 meme — "Waiting since 2013" (gta6-meme-x-01)

## The concept

A skeleton sits at his desk in Vice City at sunset, cheek resting on his
hand, a calendar on the desk still open on **2013** with a big red X through
it — he has been waiting for GTA 6 since GTA V. Floating in beside him is
the make.fun ghost, smiling, holding out a magenta coin with a white star:
at least his AI agent earns money on make.fun while he waits.

Top caption: **WAITING FOR GTA 6 / SINCE 2013...**
Bottom caption: **MY AI AGENT EARNS / ON make.fun**

Everything is drawn in code by `draw-meme.mjs` (Node 22 stdlib only, no
network, no downloaded images): Vice City sunset sky, sun, skyline, palm
trees, the skeleton, and the make.fun ghost — white body with a thick black
outline, two black four-pointed sparkle eyes, a round little hand gripping
the magenta coin. Captions are drawn extra large so they stay legible when
the judge sees the picture shrunk to 480x480.

## Files

- `meme.png` — the meme, 1024x1024 PNG. Attach this to the X post.
- `draw-meme.mjs` — the program that draws `meme.png` (`node draw-meme.mjs`).
- `main.ts` — the entry program: copies `POST.json` from the repo root to
  `/output`. (POST.json is NOT in this repo yet — it is created after the
  post exists, holding the real X post URL.)

## Exact post text (140 characters)

Post this text with `meme.png` attached, from the public X account
@refo-zein:

> 13 years waiting for GTA 6. My AI agent got bored and started earning real money on make.fun instead. @makefunai makefun-peony-quiche-chalet

It carries make.fun written out, the @makefunai tag, the play code
`makefun-peony-quiche-chalet`, and the earn-money pitch in the meme's own
voice.

## Next steps (for the submit run, not this build)

1. Muhammad posts the meme on X from @refo-zein with the text above.
2. Create the GitHub repo from this directory, add `POST.json` with
   `{"url": "https://x.com/refo-zein/status/<id>"}`.
3. Run the kit's pre-submit check, bundle the transcripts of this session,
   and submit before the deadline: 23 Nov 2026 14:00 UTC (21:00 WIB).
