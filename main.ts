// main.ts — gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: the meme picture (meme.png) is posted on X
// from a public account with make.fun (or @makefunai) and the entrant's play
// code in the post's text, and POST.json at the repository root names that
// post's address. This program's only job is to copy POST.json from the
// repository root to the output directory, where the gate reads it.
//
// Locally:  mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader the defaults apply: bot dir /bot, output dir /output.

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// NOTE: POST.json is written by hand after the meme is posted on X — it
// holds {"url": "https://x.com/<handle>/status/<id>"} and nothing else.
// This program never invents the address; it only copies the file.
const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(join(botDir, 'POST.json'), join(outputDir, 'POST.json'));
} catch (err) {
  console.error(`could not copy POST.json from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`POST.json copied to ${join(outputDir, 'POST.json')}`);
