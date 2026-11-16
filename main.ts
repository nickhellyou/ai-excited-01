/**
 * ai-excited-01 entrypoint.
 *
 * Writes the poster (entry.png, next to this file) to the output directory
 * as /output/entry.png, honouring MAKEFUN_OUTPUT_DIR.
 *
 * More than a plain copy: before anything is written, the source image is
 * validated as a real PNG within the bounty limits (signature, dimensions,
 * file size), and after the copy the destination is hashed and compared
 * byte for byte with the source, so a truncated or corrupted output can
 * never pass silently.
 */
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1_048_576;
const MAX_DIMENSION = 1024;

const repoRoot = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoRoot, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const destPath = join(outputDir, "entry.png");

function sha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

/** Validate the bytes are a PNG inside the bounty limits; return its size. */
function validatePng(data: Buffer): { width: number; height: number } {
  if (data.length < 33) {
    throw new Error(`entry.png is too small to be a PNG (${data.length} bytes)`);
  }
  if (!data.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("entry.png does not start with the PNG signature 89 50 4E 47 0D 0A 1A 0A");
  }
  if (data.subarray(12, 16).toString("latin1") !== "IHDR") {
    throw new Error("entry.png has no IHDR chunk where the PNG header belongs");
  }
  if (data.length > MAX_BYTES) {
    throw new Error(`entry.png is ${data.length} bytes, over the 1,048,576 byte limit`);
  }
  // IHDR chunk: width and height are big-endian uint32 at offsets 16 and 20.
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
  }
  return { width, height };
}

const source = await readFile(sourcePath);
const { width, height } = validatePng(source);
const sourceHash = sha256(source);

await mkdir(outputDir, { recursive: true });
await copyFile(sourcePath, destPath);

const written = await readFile(destPath);
const writtenHash = sha256(written);
if (writtenHash !== sourceHash) {
  throw new Error(
    `copy verification failed: ${destPath} sha256 ${writtenHash} != source ${sourceHash}`,
  );
}

console.log(`Wrote ${destPath} (${width}x${height}, ${written.length} bytes)`);
console.log(`sha256: ${writtenHash}`);
