/**
 * One-off image optimization: converts showcase PNGs and the logo to
 * compressed WebP at 2x display size.
 *
 * Run: bun run scripts/optimize-images.ts
 */

import sharp from "sharp";
import { readdir, readFile } from "node:fs/promises";
import { resolve, join, basename, extname } from "node:path";

async function main() {
  const publicDir = resolve(process.cwd(), "public");

  // Showcase screenshots → WebP at 1280px wide (2x the ~640px grid card)
  const showsDir = join(publicDir, "images", "showcases");
  const shows = (await readdir(showsDir)).filter((f) => f.endsWith(".png"));
  for (const file of shows) {
    const input = join(showsDir, file);
    const output = join(showsDir, basename(file, extname(file)) + ".webp");
    const out = await sharp(input).resize(1280, undefined, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(output);
    const before = (await readFile(input)).length;
    console.log(`${file}: ${Math.round(before / 1024)}KiB → ${basename(output)} ${Math.round(out.size / 1024)}KiB`);
  }

  // Logo → 112px webp + png fallback (topbar/footer use it)
  const logo = join(publicDir, "images", "elur-logo.png");
  const base = sharp(logo).resize(112, 75, { fit: "inside" });
  await base.webp({ quality: 85 }).toFile(join(publicDir, "images", "elur-logo-112.webp"));
  await base.png({ compressionLevel: 9 }).toFile(join(publicDir, "images", "elur-logo-112.png"));
  console.log("logo → elur-logo-112.webp/png");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
