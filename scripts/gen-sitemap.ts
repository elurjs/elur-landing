import { generateSitemap, generateRobots } from "@elurjs/kit/seo";

const SITE_URL = "https://www.elur.dev";

await generateSitemap({
  siteUrl: SITE_URL,
  outDir: "dist",
  urls: [{ url: "/", priority: 1.0, changefreq: "weekly" }],
});

await generateRobots({
  siteUrl: SITE_URL,
  outDir: "dist",
});

console.log("✓ Generated sitemap.xml + robots.txt");
