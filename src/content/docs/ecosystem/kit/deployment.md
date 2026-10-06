---
title: Deployment
description: Deploy Elur Kit apps to Vercel, Netlify, Bun, or Node with built-in adapters.
section: Elur Kit
order: 13
---

# Deployment

Elur Kit includes adapters for common deployment targets. Each adapter
generates the correct output format for the platform.

## Adapters

| Adapter | Command | Output |
| --- | --- | --- |
| Vercel | `elur-kit adapter vercel` | Vercel output (`.vercel/output.json`) |
| Netlify | `elur-kit adapter netlify` | Netlify functions + static |
| Bun | `elur-kit adapter bun` | Bun server (`bun run server.ts`) |
| Node | `elur-kit adapter node` | Node server (`node server.js`) |

## Vercel

```bash
elur-kit build
elur-kit adapter vercel
```

The Vercel adapter generates `.vercel/output/` (Build Output API v3):

- `functions/__elur-js-kit.func/index.js` — bundled SSR function
- `static/` — static files from `dist/`
- `config.json` — routing config

Deploy with `vercel` CLI or push to Git.

## Netlify

```bash
elur-kit build
elur-kit adapter netlify
```

Produces:

- `netlify/functions/__elur-js-kit.mjs` — bundled SSR function (Netlify
  Functions v2)
- `netlify.toml` — redirects unmatched routes to the function

Static files stay in `dist/` and are served directly by Netlify.

## Bun

```bash
elur-kit build
elur-kit adapter bun
bun run .elur/bun-server.ts
```

Produces:

- `.elur/bun-index.ts` — SSR handler entry
- `.elur/bun-server.ts` — Bun server serving `dist/` + rendering pages on
  demand

Respects `PORT` env var (default `3000`).

## Node

```bash
elur-kit build
elur-kit adapter node
node .elur/node-server.mjs
```

Produces a single bundled `.elur/node-server.mjs` that serves `dist/` static
files and renders pages on demand. Requires Node >= 20.19.0.

## Programmatic usage

Each adapter is an object with a `.build(options)` method:

```typescript
import { vercelAdapter } from "@elurjs/kit/adapters/vercel";
import { netlifyAdapter } from "@elurjs/kit/adapters/netlify";
import { bunAdapter } from "@elurjs/kit/adapters/bun";
import { nodeAdapter } from "@elurjs/kit/adapters/node";

await vercelAdapter.build({
  root: process.cwd(),
  appDir: "src/app",
  islandsDir: "src/islands",
  outDir: "dist",
  clientEntry: "/_elur/entry-client.js",
  lang: "es",
});

await netlifyAdapter.build({ /* same options */ });
await bunAdapter.build({ /* same options */ });
await nodeAdapter.build({ /* same options */ });
```

## Output modes and deployment

| Output mode | Deployment |
| --- | --- |
| `"static"` | Any static host (Vercel, Netlify, GitHub Pages, S3, etc.) |
| `"server"` | Requires a server runtime (Vercel, Netlify Functions, Bun, Node) |
| `"hybrid"` | Static + server routes (Vercel, Netlify, Bun, Node) |

## Image optimization

Elur Kit includes built-in image optimization:

```typescript
import { image } from "@elurjs/kit";

const optimized = image("/images/photo.jpg", {
  widths: [400, 800, 1200],
  formats: ["avif", "webp"],
  quality: 80,
});
```

## SEO

```typescript
import { generateSitemap, generateRobots, jsonLd } from "@elurjs/kit/seo";

// Generate sitemap.xml (writes file, returns path)
const sitemapPath = await generateSitemap({
  siteUrl: "https://elur.dev",
  urls: ["/", "/docs", "/examples"],
  outDir: "./dist",
});

// Generate robots.txt (writes file, returns path)
const robotsPath = await generateRobots({
  siteUrl: "https://elur.dev",
  outDir: "./dist",
  rules: [{ userAgent: "*", allow: ["/"] }],
  sitemapUrl: "https://elur.dev/sitemap.xml",
});

// JSON-LD structured data
const ld = jsonLd({
  "@type": "WebSite",
  name: "Elur",
  url: "https://elur.dev",
});
```

## Adapter capabilities

Each adapter declares an explicit capability contract for build-time
diagnostics:

```typescript
interface AdapterCapabilities {
  streaming: boolean;
  filesystem: "none" | "readonly" | "persistent" | "ephemeral";
  imageRuntime: boolean;
  backgroundWork: boolean;
  maxBodySize?: number;
}
```

| Capability | Node/Bun | Vercel/Netlify | Edge |
| --- | --- | --- | --- |
| `streaming` | Yes | Yes | Yes |
| `filesystem` | Persistent | Ephemeral | Readonly |
| `imageRuntime` | Yes | No | No |
| `backgroundWork` | Yes | No | No |

### `validateCapabilities(caps, features)`

Returns `{ ok: boolean, problems: string[] }` — does not throw:

```typescript
import { validateCapabilities, SERVERLESS_CAPABILITIES } from "@elurjs/kit/runtime";

const result = validateCapabilities(SERVERLESS_CAPABILITIES, {
  isr: true,       // needs persistent filesystem
  images: true,    // needs image runtime
  streaming: true, // needs streaming support
});
if (!result.ok) {
  console.error(result.problems);
}
```

The CLI `adapter` command runs this automatically — incompatible host +
feature combinations fail at build time.

### Predefined capability sets

```typescript
import {
  DEFAULT_CAPABILITIES,    // Node/Bun — full capabilities
  SERVERLESS_CAPABILITIES, // Vercel/Netlify — ephemeral filesystem
  EDGE_CAPABILITIES,       // Edge — readonly filesystem
  createCapabilities,      // Build custom capabilities
} from "@elurjs/kit/runtime";

const custom = createCapabilities({
  streaming: false,
  filesystem: "ephemeral",
});
```

## `Adapter` interface

```typescript
interface Adapter {
  name: string;
  build(options: AdapterOptions): Promise<void>;
  /** Declared host capabilities for build-time diagnostics. */
  capabilities?: AdapterCapabilities;
}
```

### `AdapterOptions`

| Field | Type | Description |
| --- | --- | --- |
| `root` | `string` | Project root directory |
| `appDir` | `string` | Pages directory (relative to root) |
| `islandsDir` | `string` | Islands directory (relative to root) |
| `outDir` | `string` | Output directory (relative to root) |
| `publicDir` | `string?` | Public directory (relative to root) |
| `clientEntry` | `string` | Client entry URL path |
| `lang` | `string` | HTML lang attribute |
| `hydrateImport` | `string?` | Import specifier for `hydrateIslands` |
| `logLevel` | `LogLevel?` | Minimum level for the runtime structured logger |
| `cacheAdapter` | `CacheAdapter?` | Pluggable ISR cache (programmatic only — generated Node/Bun servers can't serialize adapter instances) |
| `redirects` | `RedirectRule[]?` | Redirect rules baked into the generated server |
| `rewrites` | `RewriteRule[]?` | Rewrite rules baked into the generated server |
| `routeHeaders` | `RouteHeadersRule[]?` | Route headers baked into the generated server |
| `streaming` | `boolean?` | Opt-in streaming SSR — streams `loading` boundaries when the adapter declares `capabilities.streaming: true` |
| `router` | `{ enabled?: boolean }?` | Router flag baked into the generated server |
| `js` | `"modern" \| "legacy"?` | Client JS mode baked into the generated server |

## Notes

- `elur-kit adapter <name>` runs `validateCapabilities` at build time —
  incompatible host/feature combinations (e.g. `streaming` on a host that
  can't stream, ISR on an ephemeral filesystem) fail fast instead of
  producing broken output.
- The generated Node/Bun servers serve `dist/` and delegate SSR to the
  bundled handler; they do **not** load `src/middleware.ts` yet —
  middleware runs in `dev`, `preview`, and `start` only.
- Vercel and Netlify functions pin `runtime: nodejs20.x` — there is no
  runtime-version config option.
- `elur-kit start` is single-process; use a process manager or container
  replica for multi-core/multi-instance deployments.
- The shipped adapter set is Vercel, Netlify, Bun, and Node. AWS Lambda,
  Cloudflare Workers, and Docker have no dedicated adapter yet — Node
  output covers container deployments.
- `buildSsrEntry` bundles the SSR graph into a single file; on very large
  apps the bundling step can consume substantial memory.
