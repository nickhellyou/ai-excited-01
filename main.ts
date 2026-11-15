// ai-excited-01: deliver the finished crayon poster (entry.png) to the
// competition output directory as entry.png. The artwork is pre-rendered
// and stored next to this script; this program only places a byte-for-byte
// copy where the judge expects it. Copying a fixed file means every run
// writes identical bytes, and the output directory is created if missing.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");
mkdirSync(outDir, { recursive: true });
copyFileSync(join(here, "entry.png"), target);
