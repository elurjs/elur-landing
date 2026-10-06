---
title: Kit Overview
description: Elur Kit — a full-stack meta-framework with file-based routing, SSR/SSG, islands, and content collections.
section: Elur Kit
order: 1
---

# Kit Overview

**Elur Kit** (`@elurjs/kit`) is a full-stack meta-framework built on top of
`@elurjs/core`. It brings file-based routing, server-side rendering, islands
architecture, content collections, and deployment adapters to Elur.

| | |
| --- | --- |
| **Current version** | `2.6.1` |
| **Peer dependency** | `@elurjs/core` `^4.0.5` |
| **Runtime** | Node `>= 20.19` (Bun supported via adapter) |
| **License** | MIT |

:::warning Upgrading from Elur 3
`@elurjs/kit@2.6.1` requires `@elurjs/core@^4.0.5` — the Elur 3 range was
dropped so the package always resolves the v4 engine (with duplicate-instance
detection). Projects still on Elur 3 should stay on `@elurjs/kit@2.5.x`.
:::

## Key features

- **File-based routing** — `page.ts`, `layout.ts`, dynamic routes `[slug]`,
  catch-all `[...slug]`, route groups `(group)`.
- **SSR + SSG + ISR** — static generation, on-demand server rendering, and
  incremental static regeneration.
- **Islands architecture** — hydrate only the interactive components with
  `load`, `idle`, `visible`, and `only` directives.
- **Content collections** — typed Markdown with YAML frontmatter.
- **Server actions** — type-safe mutations with progressive enhancement.
- **Zero client JS by default** — pages without islands ship **0 KB** of
  JavaScript (or only the router chunk); per-page gating with a
  `js: "legacy"` escape hatch.
- **Next-generation client router** — SPA navigation with lifecycle
  events, `data-elur-persist` element survival, network-aware LRU
  prefetch, optional idiomorph morphing, Speculation Rules, and a loading
  indicator.
- **Streaming SSR (opt-in)** — real streaming for routes with a
  `loading.ts` boundary via `defineConfig({ streaming: true })`.
- **Deployment adapters** — Vercel, Netlify, Bun, Node.
- **Observability built in** — structured JSON request logging,
  `X-Request-ID` correlation, and `Server-Timing` metrics on every
  response.

## Requirements

| Requirement | Version |
| --- | --- |
| Node.js | `>= 20.19.0` |
| `@elurjs/core` (peer) | `^4.0.5` |
| `vite` (peer) | `^7.0.0 \|\| ^8.0.0` |
| `marked` (optional peer) | `^16 \|\| ^17 \|\| ^18` — Markdown for content collections |
| `zod` (optional peer) | `^4.0.0` — frontmatter/action validation |
| `sharp` (optional peer) | `^0.33 \|\| ^0.34 \|\| ^0.35` — image variants |
| `@elurjs/vite-plugin-elur` (optional peer) | `^2.2.1` — build-time compiler + HMR |

## Installation

### Scaffold a new project (recommended)

```bash
npm create elur-app@latest my-app -- --template kit
cd my-app
npm run dev
```

The `kit` template ships `elur-kit` scripts already wired up: `dev`,
`build`, `preview`, `start`, `check`, `routes`, and `doctor`. Tailwind CSS
v4 is available via `--tailwind`.

### Add to an existing project

```bash
npm install @elurjs/core @elurjs/kit vite
```

Optional peers, installed only if you use the feature:

```bash
npm install marked   # content collections (renderMarkdown)
npm install zod      # frontmatter + action input validation
npm install sharp    # build-time image variants (WebP/AVIF)
```

## Your first page

```typescript
// src/app/page.ts
import { html } from "@elurjs/core";
import type { PageProps } from "@elurjs/kit";
import { load } from "./page.data.ts";

export default function HomePage({ data }: PageProps<typeof load>) {
  return html`<h1>${data.title}</h1>`;
}
```

```typescript
// src/app/page.data.ts
import type { PageDataLoad } from "@elurjs/kit";

export const load: PageDataLoad = async () => {
  return { title: "Hello Elur Kit" };
};
```

Then `elur-kit dev` and open `http://localhost:3000`.

## Project structure

```text
src/
├── app/
│   ├── layout.ts          # root layout (wraps all pages)
│   ├── page.ts            # home page → /
│   ├── page.data.ts       # home loader
│   ├── page.action.ts     # home server actions
│   ├── about/page.ts      # → /about
│   ├── blog/
│   │   ├── layout.ts      # nested layout for /blog/*
│   │   ├── [slug]/page.ts # → /blog/:slug (needs generateStaticParams)
│   │   └── page.action.ts # blog actions
│   ├── (marketing)/       # route group — ignored in URL
│   │   ├── layout.ts      # group layout
│   │   └── pricing/page.ts # → /pricing
│   ├── api/posts/route.ts # API endpoint
│   ├── 404.page.ts        # custom 404
│   └── 500.page.ts        # custom 500
├── content/
│   ├── config.ts          # collection definitions
│   └── blog/*.md          # markdown content
├── islands/               # client-side interactive components
│   ├── LikeButton.ts
│   └── nav/MobileMenu.ts
└── middleware.ts          # optional request middleware
```

## CLI

```bash
elur-kit dev        # dev server with rebuild-on-change
elur-kit build      # static site build to dist/ (atomic staging, phase timings)
elur-kit preview    # serve the static build in production mode
elur-kit start      # SSR server — requires a previous `elur-kit build`
elur-kit adapter vercel   # generate Vercel output
elur-kit adapter netlify  # generate Netlify output
elur-kit adapter bun      # generate Bun server
elur-kit adapter node     # generate Node server
elur-kit check      # typecheck + validate route/config integrity
elur-kit routes     # list all discovered routes and metadata
elur-kit doctor     # diagnose common config and environment issues
```

`check` exit codes: `0` success, `1` generic error, `2` config error,
`3` type error, `4` route conflict, `5` missing dependency — useful for
CI gating.

`dev` runs a supervisor/worker pair: the supervisor watches `src/app/`
and `src/islands/` and restarts the Vite worker on change (400 ms
debounce, 600 ms after a crash).

Common options: `--root`, `--app`, `--islands`, `--out`, `--public`,
`--port`, `--host`, `--lang`, `--hydrate-import`, `--router-import`,
`--client-config`, `--config`, `--cache-dir`, `--default-revalidate`.

Verbosity flags (override `logger.level` from the config file):

```bash
elur-kit build --verbose   # debug logging
elur-kit build --quiet     # errors only (wins over --verbose)
```

:::note
`dev`, `preview`, and `start` all run through the unified Web handler —
same redirects/rewrites, middleware, ISR cache, logging, and streaming
code path as production. `start` fails fast when `dist/` is missing.
If the requested port is busy, the server retries on the next port (up
to 20 candidates) and prints the bound URL in the startup banner.

Note that `adapter` does *not* verify `dist/` exists — run `elur-kit
build` first so the generated output has something to serve.
:::

## Configuration

```typescript
// elur.config.ts
import { defineConfig } from "@elurjs/kit";

export default defineConfig({
  output: "static",        // "static" | "server" | "hybrid"
  site: "https://example.com", // enables automatic sitemap.xml on build
  trailingSlash: "always", // "always" | "never" | "ignore"
  js: "modern",            // "modern" (0% JS gating) | "legacy"
  streaming: false,        // opt-in streaming SSR (experimental)
  router: {
    enabled: true,         // SPA router (false → 0 KB JS on island-free pages)
    prefetch: true,        // hover/focus/pointerdown prefetch
    morph: false,          // idiomorph DOM morphing (experimental)
    speculation: "prefetch", // "prefetch" | "prerender" speculation rules
  },
  redirects: [{ from: "/old/:slug", to: "/blog/:slug", status: 301 }],
  rewrites:  [{ from: "/docs/*", to: "/pages/docs/:0" }],
  headers:   [{ path: "/api/*", headers: { "Cache-Control": "no-store" } }],
  images: { formats: ["avif", "webp"], quality: 80 },
  cache: { dir: "./.cache", adapter: myCacheAdapter }, // pluggable ISR adapter
  logger: { level: "info" }, // structured request logging
  security: { strictOrigin: true, bodyLimit: 1_000_000 },
});
```

## Subpath exports

| Path | Key exports |
| --- | --- |
| `@elurjs/kit` | `build`, `scanRoutes`, `island`, `defineConfig`, `loadElurConfig`, `renderToString`, `isSSR`, `documentShell`, `extractAppBody`, `APP_START_MARKER`, `APP_END_MARKER`, `buildHeadTags`, `collectShellExtras`, `image`, `processImages`, `processImageBatch`, `readManifest`, `writeManifest`, `getManifestEntry`, `buildSrcset`, `buildPictureMarkup`, `validateManifestUrls`, `isSharpAvailable`, `consumeImageRegistry`, `setImageManifest`, `streamBoundary`, `renderPage`, `renderErrorPage`, `renderPageBody`, `createStreamingResponse`, `createBufferedResponse`, `createSsrServer` *(deprecated)*, `renderStreamingPage` *(deprecated)*, `scanActions`, `scanIslands`, `generateClientEntry`, `buildEntrySource`, `buildRouterEntrySource`, `matchRoute`, `matchApiRoute`, `createAppManifest`, `writeAppManifest`, `writeRouteTypes`, `validateManifestRoutes`, `assertClientImportAllowed`, `createWebHandler`, `RequestContext`, `serveStaticFile`, `resolveStaticFile`, `incomingMessageToRequest`, `htmlResponse`, `jsonResponse`, `textResponse`, `notFound`, `methodNotAllowed`, `serverError`, `guessContentType`, `defineAction`, `callAction`, `handleActionRequest`, `verifyOrigin`, `originForbidden`, `fail`, `redirect`, `ActionFailure`, `RedirectResponse`, action error cookie helpers, `loadMiddleware`, `runMiddleware`, `matchesMiddleware`, `getCachedHtml`, `setCachedHtml`, `clearCache`, `StructuredLogger`, `createRequestLogger`, `vercelAdapter`, `netlifyAdapter`, `bunAdapter`, `nodeAdapter`, `startClientRouter`, `navigateTo`, `prefetch`, `runIntegrationHook`, `buildClientBundle`, `beginAtomicStage`, `copyPublicAssets` |
| `/island` | `hydrateIslands`, `cleanupHydratedIslands`, `lazyIsland`, `ISLAND_MARKER_ATTR`, `PERSIST_ATTR` (`island` and `scanIslands` are root exports) |
| `/action` | `callAction`, `elurJsAction`, `defineAction` (+ `ActionRequest`, `CallActionOptions`, `ElurJsAction`, `ActionContext`, `DefineActionOptions`, `DefinedAction`, `DefinedActionFn`, `ActionInputValidator`, `ActionConcurrencyMode` types) |
| `/config` | `defineConfig`, `loadElurConfig`, `ElurConfig`, `ResolvedElurConfig` |
| `/content` | `defineCollection`, `getEntry`, `getCollection`, `getEntries`, `renderMarkdown`, `renderEntryHTML`, `raw`, `parseDocument`, `parseFrontmatter`, `splitFrontmatter`, `createValidator`, `getZod`, `setContentRoot`, `withContentRoot`, `clearContentCache` |
| `/seo` | `generateSitemap`, `generateSitemapFromRoutes`, `generateRobots`, `jsonLd` |
| `/image` | `image`, `processImageBatch`, `getImage`, `createImageService`, `consumeImageRegistry`, `setImageManifest`, `isSharpAvailable`, `readManifest`, `writeManifest`, `getManifestEntry`, `buildSrcset`, `buildPictureMarkup`, `validateManifestUrls`, `transformHash` |
| `/cache` | `CacheAdapter`, `createFsCacheAdapter`, `createRedisCacheAdapter`, `createCloudflareKVCacheAdapter`, `getWithSWR`, `cacheKey`, `defaultInvalidator`, `connectCacheAdapter`, `CacheInvalidator`, `normalizeCachePolicy`, `shouldCachePublic`, `isStale` |
| `/adapters/vercel` | `vercelAdapter` |
| `/adapters/netlify` | `netlifyAdapter` |
| `/adapters/bun` | `bunAdapter` |
| `/adapters/node` | `nodeAdapter` |
| `/router` | `startClientRouter`, `navigateTo`, `prefetch`, `hoistStyles`, `ClientRouterOptions`, `NavigationEventDetail` |
| `/runtime` | `createWebHandler`, `RequestContext`, `serveStaticFile`, `resolveStaticFile`, `incomingMessageToRequest`, `sendWebResponse`, `htmlResponse`, `jsonResponse`, `textResponse`, `notFound`, `methodNotAllowed`, `serverError`, `guessContentType`, `buildSecurityHeaders`, `applySecurityHeaders`, `DEFAULT_SECURITY_HEADERS`, `StructuredLogger`, `createRequestLogger`, `validateCapabilities`, `createCapabilities`, `supportsStreaming`, `supportsPersistentStorage`, `supportsWritableFilesystem`, `DEFAULT_CAPABILITIES`, `SERVERLESS_CAPABILITIES`, `EDGE_CAPABILITIES` |
| `/vite` | `elurJsKit` (Vite plugin), `elurJsInterpolationPlugin` |
| `/manifest` | `createAppManifest`, `writeAppManifest`, `writeRouteTypes`, `validateManifestRoutes`, `assertClientImportAllowed` |
| `/integrations` | `runIntegrationHook`, `registerIntegration`, `getI18nIntegration`, `getAuthIntegration`, `getQueryIntegration`, `getTestingIntegration`, `getCustomIntegrations`, `clearIntegrations` |
| `/cli` | CLI entry (`elur-kit` command) |

:::tip
This very documentation site is built with Elur Kit! It uses content
collections for docs, islands for interactive components, and static
generation for fast page loads.
:::

## Next steps

- [Routing](/docs/ecosystem/kit/routing/) — file conventions, layouts,
  dynamic routes, SPA router, redirects
- [Data & Backend](/docs/ecosystem/kit/data-backend/) — loaders, API
  routes, actions, middleware, metadata, cache
- [SSR & Hydration](/docs/ecosystem/kit/ssr/) — `build()`,
  `renderToString`, streaming, ISR
- [Islands](/docs/ecosystem/kit/islands/) — `island()`, directives,
  `hydrateIslands`, `lazyIsland`
- [Content Collections](/docs/ecosystem/kit/content/) — `defineCollection`,
  `getEntry`, frontmatter
- [Server Actions](/docs/ecosystem/kit/actions/) — `defineAction`,
  `elurJsAction`, progressive enhancement
- [Middleware & Cache](/docs/ecosystem/kit/middleware-cache/) — middleware,
  `streamBoundary`, cache adapters
- [Image & SEO](/docs/ecosystem/kit/image-seo/) — `image()`,
  `generateSitemap`, `jsonLd`
- [Configuration](/docs/ecosystem/kit/config/) — `ElurConfig`, security,
  Vite plugin, integrations
- [Runtime & Manifest](/docs/ecosystem/kit/runtime-manifest/) —
  `createWebHandler`, `RequestContext`, `AppManifest`
- [Client router](/docs/ecosystem/kit/client-router/) — SPA navigation,
  lifecycle events, `data-elur-persist`, morphing, speculation
- [Deployment](/docs/ecosystem/kit/deployment/) — Vercel, Netlify, Bun,
  Node adapters, capabilities
