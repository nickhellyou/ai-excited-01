// ai-excited-01 — "Make the AI judge excited"
//
// The entry is a single crayon poster, entry.png, drawn by a six year old
// named Leo: the AI judge, wig and robe on, strapped into a big red rocket
// and launched skyward with confetti and stars, because the judge spends
// all day judging everyone else and never gets a turn to fly.
//
// This script is the whole entry program. It reads entry.png from beside
// itself, checks the first eight bytes match the PNG signature so a broken
// or swapped file fails loudly instead of shipping silently, creates the
// output directory when it does not exist yet, and copies the poster there
// as entry.png. The artwork itself is never modified.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

function loadPoster(path: string): Buffer {
  const bytes = readFileSync(path);
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("entry.png is not a valid PNG file (bad signature)");
  }
  return bytes;
}

const poster = loadPoster(source);
mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`Copied entry.png (${poster.length} bytes) to ${target}`);
