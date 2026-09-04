---
title: Image & SEO
description: image() responsive images, getImage, generateSitemap, generateRobots, jsonLd structured data, and build hooks.
section: Elur Kit
order: 9
---

# Image & SEO

## `image(opts)` — responsive images

Emits responsive `<img>` or `<picture>` tags with `srcset`, `sizes`, lazy
loading, and CLS-preventing `width`/`height`:

```typescript
import { image } from "@elurjs/kit";
import { html } from "@elurjs/core";

export default function HeroPage() {
  return html`
    ${image({
      src: "/images/hero.jpg",
      alt: "Hero image",
      width: 1920,
      height: 1080,
      widths: [640, 1280, 1920],
      sizes: "100vw",
      priority: true,
    })}
  `;
}
```

### `ImageOptions`

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | Yes | — | Source path relative to public dir |
| `alt` | `string` | Yes | — | Alt text (required for accessibility) |
| `width` | `number` | Yes | — | Intrinsic width in pixels |
| `height` | `number` | Yes | — | Intrinsic height in pixels |
| `widths` | `number[]` | No | `[width]` | Responsive widths for srcset |
| `sizes` | `string` | No | — | Sizes attribute, e.g. `"100vw"` or `"(min-width: 768px) 50vw, 100vw"` |
| `priority` | `boolean` | No | `false` | Eager load with `fetchpriority="high"` (above-the-fold) |
| `class` | `string` | No | — | CSS class |
| `attributes` | `Record<string, string>` | No | `{}` | Additional HTML attributes |

### Build-time processing

When `sharp` is installed (optional peer dep), `build()` automatically:

- Generates WebP and AVIF variants at requested widths
- Content-based hashing for indefinite caching
- Emits `<picture>` with `<source>` per format
- Uses real dimensions from the manifest

Without `sharp`, emits a plain `<img>` with the original src.

### Image pipeline hardening

- **SHA-256 transform keys** — variant hash incorporates source content digest + transform options + encoder versions
- **Path containment** — sources and outputs validated against traversal, NUL, symlink escape
- **Atomic writes + single-flight** — temp+rename with bounded concurrency pool
- **`images.strict`** — fails build on missing source or failed transform

## `getImage(request, options)` — programmatic

```typescript
import { getImage } from "@elurjs/kit/image";

const meta = await getImage(
  {
    src: "/images/hero.jpg",
    alt: "Hero",
    widths: [640, 1280],
    formats: ["avif", "webp"],
    width: 1920,
    height: 1080,
    priority: true,
  },
  { publicDir: "public", outDir: "dist" },
);
// meta.src, meta.width, meta.height, meta.sources, meta.attributes, meta.generated
```

### `ImageRequest`

| Field | Type | Description |
| --- | --- | --- |
| `src` | `string` | Source path relative to public dir |
| `alt` | `string` | Alt text |
| `widths` | `number[]?` | Responsive widths |
| `formats` | `ImageFormat[]?` | Output formats |
| `sizes` | `string?` | Sizes attribute |
| `width` | `number?` | Intrinsic width |
| `height` | `number?` | Intrinsic height |
| `priority` | `boolean?` | Eager load with high priority |
| `loading` | `"lazy" \| "eager"?` | Loading strategy |
| `decoding` | `"async" \| "sync" \| "auto"?` | Decoding hint |
| `quality` | `number?` | Quality (1-100) |
| `class` | `string?` | CSS class |
| `attributes` | `Record<string, unknown>?` | Additional HTML attributes |

### `ImageMetadata`

| Field | Type | Description |
| --- | --- | --- |
| `src` | `string` | Original source path |
| `width` | `number?` | Real width from manifest |
| `height` | `number?` | Real height from manifest |
| `sources` | `Array<{ type, srcset }>` | `<source>` entries per format |
| `attributes` | `Record<string, string \| number \| boolean \| undefined>` | HTML attributes for `<img>` |
| `generated` | `GeneratedImage[]` | Generated variant details |

### `ProcessOptions`

Options for `getImage` and `createImageService`:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `publicDir` | `string` | — | Absolute path to public directory (required) |
| `outDir` | `string` | — | Absolute path to output directory (required) |
| `formats` | `ImageFormat[]?` | `["webp", "avif"]` | Formats to generate |
| `quality` | `number?` | `80` | Quality (1-100) |
| `manifestPath` | `string?` | — | Path to write manifest JSON |
| `strict` | `boolean?` | `false` | Fail build on missing sources or transform errors |
| `concurrency` | `number?` | `4` | Max concurrent sharp transforms |
| `base` | `string?` | — | URL base prefix applied to variant URLs |

## `createImageService(options)`

```typescript
import { createImageService } from "@elurjs/kit/image";

const service = createImageService({ publicDir: "public", outDir: "dist" });
// service.resolve(request, ctx) — resolve an image request
// service.capabilities — ImageServiceCapabilities
```

## `processImages(images, options)` — build-time

Processes a batch of images: for each image, generates variants at the
specified widths and formats using sharp:

```typescript
import { processImages } from "@elurjs/kit";

const results = await processImages(
  [
    { src: "/images/hero.jpg", widths: [640, 1280, 1920], formats: ["avif", "webp"] },
    { src: "/images/logo.png", widths: [320, 640], formats: ["webp"] },
  ],
  {
    publicDir: "public",
    outDir: "dist",
    quality: 80,
  }
);
// Returns ProcessedImage[] with src and generated variants
```

If `sharp` is not installed, returns an empty array and logs a warning.

### `PipelineOptions`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `publicDir` | `string` | — | Absolute path to public directory |
| `outDir` | `string` | — | Absolute path to output directory |
| `formats` | `ImageFormat[]?` | `["webp", "avif"]` | Formats to generate |
| `quality` | `number?` | `80` | Quality (1-100) |

## `isSharpAvailable()`

```typescript
import { isSharpAvailable } from "@elurjs/kit";

if (isSharpAvailable()) {
  // sharp is installed — build will generate variants
} else {
  // no sharp — images emit plain <img> with original src
}
```

## `consumeImageRegistry()`

Returns all images registered via `image()` during rendering, for build-time
processing:

```typescript
import { consumeImageRegistry } from "@elurjs/kit";

const images = consumeImageRegistry();
// [{ src: "/images/hero.jpg", widths: [640, 1280, 1920] }, ...]
```

## `setImageManifest(manifest)`

Loads the image manifest so `image()` emits `<picture>` with real variant
URLs:

```typescript
import { setImageManifest } from "@elurjs/kit";

const manifest = JSON.parse(await readFile("dist/_elur/image-manifest.json", "utf-8"));
setImageManifest(manifest);
```

### `ImageManifest`

```typescript
interface ImageManifest {
  entries: Record<string, ImageEntry>;
}
```

### `ImageEntry`

| Field | Type | Description |
| --- | --- | --- |
| `src` | `string` | Original source path |
| `width` | `number` | Real width |
| `height` | `number` | Real height |
| `variants` | `ImageVariant[]` | Generated variants |

### `ImageVariant`

| Field | Type | Description |
| --- | --- | --- |
| `url` | `string` | Variant URL (hashed) |
| `width` | `number` | Variant width |
| `height` | `number` | Variant height |
| `format` | `ImageFormat` | Variant format (`webp`, `avif`, etc.) |
| `size` | `number` | File size in bytes |

## SEO

### `generateSitemap(config)`

Writes `sitemap.xml` to `outDir` and returns the file path:

```typescript
import { generateSitemap } from "@elurjs/kit/seo";

const filePath = await generateSitemap({
  siteUrl: "https://example.com",
  outDir: "./dist",
  urls: [
    "/",
    "/blog",
    { url: "/blog/hello-world", lastmod: "2024-01-15", priority: 0.8 },
  ],
});
```

### `SitemapConfig`

| Field | Type | Description |
| --- | --- | --- |
| `siteUrl` | `string` | Base URL of the site |
| `urls` | `(SitemapEntry \| string)[]` | URL entries (strings or objects) |
| `outDir` | `string` | Output directory where `sitemap.xml` is written |

### `SitemapEntry`

| Field | Type | Description |
| --- | --- | --- |
| `url` | `string` | URL path |
| `lastmod` | `string?` | Last modification date (ISO 8601 or YYYY-MM-DD) |
| `changefreq` | `"always" \| "hourly" \| "daily" \| "weekly" \| "monthly" \| "yearly" \| "never"?` | Change frequency |
| `priority` | `number?` | Priority (0.0–1.0) |

### `generateRobots(config)`

Writes `robots.txt` to `outDir` and returns the file path:

```typescript
import { generateRobots } from "@elurjs/kit/seo";

const filePath = await generateRobots({
  siteUrl: "https://example.com",
  outDir: "./dist",
  disallow: ["/api/", "/_elur/"],
});
```

### `RobotsConfig`

| Field | Type | Description |
| --- | --- | --- |
| `siteUrl` | `string` | Base URL of the site |
| `outDir` | `string` | Output directory where `robots.txt` is written |
| `rules` | `RobotsRule[]?` | Access rules per user agent (alternative to `disallow`) |
| `disallow` | `string[]?` | Paths to disallow for all crawlers (shorthand) |
| `sitemapUrl` | `string?` | Sitemap URL override (defaults to `${siteUrl}/sitemap.xml`) |

### `RobotsRule`

| Field | Type | Description |
| --- | --- | --- |
| `userAgent` | `string` | User agent (`*` for all) |
| `allow` | `string[]?` | Allowed paths |
| `disallow` | `string[]?` | Disallowed paths |
| `crawlDelay` | `number?` | Crawl delay in seconds |

### `jsonLd(schema)` — structured data

```typescript
import { jsonLd } from "@elurjs/kit/seo";

const script = jsonLd({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hello World",
  author: { "@type": "Person", name: "Ada" },
  datePublished: "2024-01-15",
});
// Returns <script type="application/ld+json">...</script>
```

Safe escaping: `<`, `>`, `&`, U+2028, U+2029 are escaped to prevent injection.

## Using in build hook

Generate sitemap and robots during build:

```typescript
// elur.config.ts
import { defineConfig } from "@elurjs/kit";
import { generateSitemap, generateRobots } from "@elurjs/kit/seo";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    {
      name: "seo",
      hooks: {
        build: async ({ manifest, config }) => {
          await generateSitemap({
            siteUrl: config.site!,
            outDir: config.outDir,
            urls: manifest.routes.map(r => r.path),
          });

          await generateRobots({
            siteUrl: config.site!,
            outDir: config.outDir,
            disallow: ["/api/"],
          });
        },
      },
    },
  ],
});
```
