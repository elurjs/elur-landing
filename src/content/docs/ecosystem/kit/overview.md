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

## Key features

- **File-based routing** — `page.ts`, `layout.ts`, dynamic routes `[slug]`,
  catch-all `[...slug]`, route groups `(group)`.
- **SSR + SSG + ISR** — static generation, on-demand server rendering, and
  incremental static regeneration.
- **Islands architecture** — hydrate only the interactive components with
  `load`, `idle`, `visible`, and `only` directives.
- **Content collections** — typed Markdown with YAML frontmatter.
- **Server actions** — type-safe mutations with progressive enhancement.
- **Zero client JS by default** — pages ship zero JavaScript unless you
  explicitly add islands.
- **Deployment adapters** — Vercel, Netlify, Bun, Node.

## Installation

```bash
npm install @elurjs/core @elurjs/kit
```

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
elur-kit build      # static site build to dist/
elur-kit preview    # serve the static build in production mode
elur-kit start      # SSR server that renders pages on demand
elur-kit adapter vercel   # generate Vercel output
elur-kit adapter netlify  # generate Netlify output
elur-kit adapter bun      # generate Bun server
elur-kit adapter node     # generate Node server
elur-kit check      # typecheck + validate route/config integrity
elur-kit routes     # list all discovered routes and metadata
elur-kit doctor     # diagnose common config and environment issues
```

Common options: `--root`, `--app`, `--islands`, `--out`, `--public`,
`--port`, `--host`, `--lang`, `--config`, `--cache-dir`,
`--default-revalidate`.

## Configuration

```typescript
// elur.config.ts
import { defineConfig } from "@elurjs/kit";

export default defineConfig({
  output: "static",        // "static" | "server" | "hybrid"
  trailingSlash: "always", // "always" | "never" | "ignore"
  images: { formats: ["avif", "webp"], quality: 80 },
  security: { strictOrigin: true, bodyLimit: 1_000_000 },
});
```

## Subpath exports

| Path | Key exports |
| --- | --- |
| `@elurjs/kit` | `build`, `island`, `defineConfig`, `renderToString`, `documentShell`, `image`, `streamBoundary`, `renderPage`, `renderStreamingPage`, `renderErrorPage`, `renderPageBody`, `createSsrServer`, `scanRoutes`, `scanActions`, `scanIslands`, `createAppManifest`, `matchRoute` |
| `/island` | `island`, `hydrateIslands`, `scanIslands`, `lazyIsland` |
| `/action` | `defineAction`, `elurJsAction`, `callAction`, `fail`, `redirect`, `handleActionRequest`, `verifyOrigin` |
| `/config` | `defineConfig`, `loadElurConfig`, `ElurConfig` |
| `/content` | `defineCollection`, `getEntry`, `getCollection`, `getEntries`, `renderMarkdown`, `renderEntryHTML`, `raw`, `parseDocument`, `parseFrontmatter`, `splitFrontmatter`, `createValidator`, `getZod` |
| `/seo` | `generateSitemap`, `generateRobots`, `jsonLd` |
| `/image` | `image`, `processImages`, `getImage`, `createImageService`, `consumeImageRegistry`, `setImageManifest`, `isSharpAvailable` |
| `/adapters/vercel` | `vercelAdapter` |
| `/adapters/netlify` | `netlifyAdapter` |
| `/adapters/bun` | `bunAdapter` |
| `/adapters/node` | `nodeAdapter` |
| `/router` | `startClientRouter`, `navigateTo`, `prefetch` |
| `/runtime` | `createWebHandler`, `RequestContext`, `serveStaticFile`, `resolveStaticFile`, `incomingMessageToRequest`, `htmlResponse`, `jsonResponse`, `textResponse`, `notFound`, `methodNotAllowed`, `serverError`, `guessContentType`, `buildSecurityHeaders`, `applySecurityHeaders` |
| `/vite` | `elurJsKit` (Vite plugin), `elurJsInterpolationPlugin` |
| `/manifest` | `createAppManifest`, `writeAppManifest`, `writeRouteTypes`, `validateManifestRoutes`, `assertClientImportAllowed` |
| `/integrations` | `runIntegrationHook`, `registerIntegration`, `getI18nIntegration`, `getAuthIntegration`, `getQueryIntegration`, `getTestingIntegration` |
| `/cli` | CLI entry (`elur-kit` command) |

:::tip
This very documentation site is built with Elur Kit! It uses content
collections for docs, islands for interactive components, and static
generation for fast page loads.
:::

## Next steps

- [Routing](/docs/ecosystem/kit/routing/) — file conventions, layouts, dynamic routes, SPA router, redirects
- [Data & Backend](/docs/ecosystem/kit/data-backend/) — loaders, API routes, actions, middleware, metadata, cache
- [SSR & Hydration](/docs/ecosystem/kit/ssr/) — `build()`, `renderToString`, streaming, ISR
- [Islands](/docs/ecosystem/kit/islands/) — `island()`, directives, `hydrateIslands`, `lazyIsland`
- [Content Collections](/docs/ecosystem/kit/content/) — `defineCollection`, `getEntry`, frontmatter
- [Server Actions](/docs/ecosystem/kit/actions/) — `defineAction`, `elurJsAction`, progressive enhancement
- [Middleware & Cache](/docs/ecosystem/kit/middleware-cache/) — middleware, `streamBoundary`, cache adapters
- [Image & SEO](/docs/ecosystem/kit/image-seo/) — `image()`, `generateSitemap`, `jsonLd`
- [Configuration](/docs/ecosystem/kit/config/) — `ElurConfig`, security, Vite plugin, integrations
- [Runtime & Manifest](/docs/ecosystem/kit/runtime-manifest/) — `createWebHandler`, `RequestContext`, `AppManifest`
- [Deployment](/docs/ecosystem/kit/deployment/) — Vercel, Netlify, Bun, Node adapters, capabilities
