// ai-excited-01: validate entry.png and write it to the output directory.
// Node 22, standard library only. No network, no extra dependencies.

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1_048_576;
const MAX_DIMENSION = 1024;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDir, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outputPath = join(outputDir, "entry.png");

if (!existsSync(sourcePath)) {
  throw new Error(`entry.png not found at ${sourcePath}`);
}

const data = readFileSync(sourcePath);

if (data.length < 8 || !data.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png is not a valid PNG: bad PNG signature (expected 89 50 4E 47 0D 0A 1A 0A)");
}

if (data.length > MAX_BYTES) {
  throw new Error(`entry.png is ${data.length} bytes, over the ${MAX_BYTES} byte limit`);
}

// Parse the IHDR chunk: length (4) + "IHDR" (4) + width (4, BE) + height (4, BE).
if (data.length < 33 || data.toString("ascii", 12, 16) !== "IHDR") {
  throw new Error("entry.png has no IHDR chunk where one was expected");
}
const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (width === 0 || height === 0 || width > MAX_DIMENSION || height > MAX_DIMENSION) {
  throw new Error(`entry.png is ${width}x${height}, outside the allowed 1..${MAX_DIMENSION} range`);
}

// The file must end with a proper IEND trailer chunk.
const IEND_TRAILER = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
if (data.length < 12 || !data.subarray(data.length - 12).equals(IEND_TRAILER)) {
  throw new Error("entry.png is truncated or corrupt: missing IEND trailer");
}

const sourceHash = createHash("sha256").update(data).digest("hex");

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, outputPath);

// Verify the copy byte for byte: same size, same bytes, same sha256.
const copied = readFileSync(outputPath);
if (copied.length !== data.length || !copied.equals(data)) {
  throw new Error("output copy does not match entry.png byte for byte");
}
const copiedHash = createHash("sha256").update(copied).digest("hex");
if (copiedHash !== sourceHash) {
  throw new Error(`output sha256 mismatch: ${copiedHash} != ${sourceHash}`);
}

const stat = statSync(outputPath);
console.log(`Wrote ${outputPath} (${width}x${height}, ${stat.size} bytes, sha256 ${sourceHash})`);
