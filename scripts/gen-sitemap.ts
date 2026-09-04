import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { generateSitemap, generateRobots, type SitemapEntry } from "@elurjs/kit/seo";

const SITE_URL = "https://www.elur.dev";

async function isDraft(path: string): Promise<boolean> {
  const source = await readFile(path, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
  return frontmatter ? /^draft:\s*true\s*$/m.test(frontmatter[1]) : false;
}

async function collectUrls(dir: string, base: string): Promise<string[]> {
  const urls: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      urls.push(...(await collectUrls(path, `${base}${entry.name}/`)));
    } else if (entry.name.endsWith(".md") && !(await isDraft(path))) {
      urls.push(`${base}${entry.name.replace(/\.md$/, "")}/`);
    }
  }
  return urls;
}

const docs = await collectUrls("src/content/docs", "/docs/");
const examples = await collectUrls("src/content/examples", "/examples/");
const tutorial = await collectUrls("src/content/tutorial", "/tutorial/");

const urls: SitemapEntry[] = [
  { url: "/", priority: 1.0, changefreq: "weekly" },
  { url: "/examples/", priority: 0.8, changefreq: "weekly" },
  ...docs.map((url) => ({ url, priority: 0.7, changefreq: "monthly" as const })),
  ...examples.map((url) => ({ url, priority: 0.6, changefreq: "monthly" as const })),
  ...tutorial.map((url) => ({ url, priority: 0.6, changefreq: "monthly" as const })),
];

await generateSitemap({ siteUrl: SITE_URL, outDir: "dist", urls });
await generateRobots({ siteUrl: SITE_URL, outDir: "dist" });

console.log(`✓ Generated sitemap.xml (${urls.length} URLs) + robots.txt`);
