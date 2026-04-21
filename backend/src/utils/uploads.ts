import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import crypto from "crypto";
import sharp from "sharp";
import { logger } from "./logger.js";

export const UPLOADS_DIR = path.join(process.cwd(), "uploads");
export const MAX_IMAGE_WIDTH = 1920;
export const WEBP_QUALITY = 82;

sharp.cache(false);
sharp.concurrency(1);

fsSync.mkdirSync(UPLOADS_DIR, { recursive: true });

function randomName(): string {
  return `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
}

export async function processImageToWebp(buffer: Buffer): Promise<string> {
  const filename = randomName();
  const target = path.join(UPLOADS_DIR, filename);

  await sharp(buffer, { failOn: "error" })
    .rotate()
    .resize({
      width: MAX_IMAGE_WIDTH,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(target);

  return filename;
}

function isManagedUploadName(name: string): boolean {
  if (typeof name !== "string") return false;
  if (name.startsWith("/") || name.startsWith("http://") || name.startsWith("https://")) {
    return false;
  }
  return /^[A-Za-z0-9._-]+$/.test(name) && !name.includes("..");
}

export async function deleteUploadedImage(name: string): Promise<void> {
  if (!isManagedUploadName(name)) return;
  const target = path.join(UPLOADS_DIR, name);
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(UPLOADS_DIR) + path.sep)) return;
  try {
    await fs.unlink(resolved);
  } catch (err: any) {
    if (err?.code !== "ENOENT") {
      logger.warn({ err, name }, "deleteUploadedImage failed");
    }
  }
}

export async function deleteUploadedImages(names: string[]): Promise<void> {
  await Promise.all(names.map((n) => deleteUploadedImage(n)));
}

export function diffRemovedImages(oldList: string[], newList: string[]): string[] {
  const keep = new Set(newList);
  return oldList.filter((n) => !keep.has(n));
}
