/**
 * Pre-build script: generates the deferred CSS bundle in public/_elur/
 * so it gets copied to dist/ by the kit build's public dir copy step.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

async function main() {
  const root = resolve(process.cwd());
  const stylesDir = join(root, "src", "styles");

  const deferredFiles = ["home.css", "components.css", "prose.css"];
  const parts: string[] = [];
  for (const file of deferredFiles) {
    try {
      const content = await readFile(join(stylesDir, file), "utf8");
      parts.push(content);
    } catch {
      // Skip missing files
    }
  }

  const css = minifyCss(parts.join("\n\n"));
  const hash = createHash("sha256").update(css).digest("hex").slice(0, 12);
  const fileName = `styles-${hash}.css`;
  const outDir = resolve(root, "public", "css");
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, fileName), css, "utf8");

  // Write the hash to a manifest so layout.data.ts can read it
  await writeFile(join(outDir, "deferred-css.json"), JSON.stringify({ fileName, hash }), "utf8");

  console.log(`  ✓ Deferred CSS: ${fileName} (${(css.length / 1024).toFixed(1)} KB)`);
}

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

main().catch((err) => {
  console.error("Failed to generate deferred CSS:", err);
  process.exit(1);
});
