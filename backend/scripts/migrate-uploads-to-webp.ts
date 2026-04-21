import "dotenv/config";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

type MigrationPlan = {
  rename: Map<string, string>; // old filename -> new .webp filename
  deleteOriginals: Set<string>;
};

function isManagedUploadName(name: string): boolean {
  if (typeof name !== "string") return false;
  if (name.startsWith("/") || name.startsWith("http")) return false;
  return /^[A-Za-z0-9._-]+$/.test(name) && !name.includes("..");
}

function newWebpName(): string {
  return `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
}

async function convertFile(srcPath: string, destPath: string): Promise<void> {
  await sharp(srcPath, { failOn: "error" })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true, fit: "inside" })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(destPath);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const entries = await fs.readdir(UPLOADS_DIR);
    const plan: MigrationPlan = { rename: new Map(), deleteOriginals: new Set() };

    console.log(`[migrate] našel jsem ${entries.length} souborů v ${UPLOADS_DIR}`);

    for (const entry of entries) {
      if (!isManagedUploadName(entry)) continue;
      const lower = entry.toLowerCase();
      if (lower.endsWith(".webp")) continue;
      if (!/\.(jpe?g|png|gif|tiff?|avif|heic|heif)$/i.test(lower)) continue;

      const srcPath = path.join(UPLOADS_DIR, entry);
      // Slight delay to avoid timestamp collisions in newWebpName
      await new Promise((r) => setTimeout(r, 1));
      const newName = newWebpName();
      const destPath = path.join(UPLOADS_DIR, newName);

      try {
        await convertFile(srcPath, destPath);
        plan.rename.set(entry, newName);
        plan.deleteOriginals.add(srcPath);
        console.log(`[migrate] ${entry} -> ${newName}`);
      } catch (err) {
        console.error(`[migrate] přeskočeno ${entry}:`, err);
      }
    }

    if (plan.rename.size === 0) {
      console.log("[migrate] žádné soubory k migraci");
      return;
    }

    console.log("[migrate] aktualizuji DB...");
    const news = await prisma.news.findMany({ select: { id: true, images: true } });
    let updated = 0;
    for (const n of news) {
      let changed = false;
      const next = n.images.map((img) => {
        const replacement = plan.rename.get(img);
        if (replacement) {
          changed = true;
          return replacement;
        }
        return img;
      });

      if (changed) {
        await prisma.news.update({
          where: { id: n.id },
          data: { images: next },
        });
        updated++;
      }
    }
    console.log(`[migrate] aktualizováno ${updated} záznamů novinek`);

    console.log("[migrate] mažu původní soubory...");
    let removed = 0;
    for (const src of plan.deleteOriginals) {
      try {
        await fs.unlink(src);
        removed++;
      } catch (err) {
        console.warn(`[migrate] unlink selhal pro ${src}:`, err);
      }
    }
    console.log(`[migrate] hotovo, smazáno ${removed} původních souborů`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[migrate] chyba:", err);
  process.exit(1);
});
