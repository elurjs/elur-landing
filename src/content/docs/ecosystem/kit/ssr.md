---
title: SSR & Hydration
description: Server-side rendering, static generation, streaming, ISR, and hydration with Elur Kit.
section: Elur Kit
order: 3
---

# SSR & Hydration

Elur Kit supports three output modes: static (SSG), server (SSR), and hybrid.

## Output modes

| Mode | Description |
| --- | --- |
| `"static"` | Pre-render all pages at build time (default) |
| `"server"` | Render on demand on each request |
| `"hybrid"` | Static by default, per-route server rendering |

```typescript
// elur.config.ts
export default defineConfig({
  output: "static",  // "static" | "server" | "hybrid"
});
```

## Build

The `build()` function scans `src/app/`, generates routes, and outputs to
`dist/`:

```typescript
import { build } from "@elurjs/kit";

await build({
  appDir: "./src/app",
  outDir: "./dist",
  islandsDir: "./src/islands",
  generatedEntry: "./.elur/entry-client.ts",
});
```

## `renderToString(factory, options?)`

Renders a Elur template to an HTML string on the server. Accepts a *factory*
(thunk) because `html\`\`` evaluates at call time:

```typescript
import { renderToString } from "@elurjs/kit";

const html = await renderToString(() => Page({ data }));
// options: { markers?: "none" | "hydration" } — default "hydration"
```

## `documentShell(options)`

Wraps page HTML with the document shell (`<html>`, `<head>`, `<body>`):

```typescript
import { documentShell } from "@elurjs/kit";

const fullHtml = documentShell({
  body: pageHtml,
  title: "My Page",
  lang: "en",
  htmlAttributes: { "data-theme": "dark" },
  headScripts: ["/scripts/analytics.js"],
  headLinks: ['<link rel="stylesheet" href="/styles/tokens.css">'],
  data: { user: { name: "Ada" } },
  actions: { "/contact": ["submitContact"] },
  clientEntry: "/_elur/entry-client.js",
  metadata: pageMetadata,
  renderEndpoint: true,
});
```

### `ShellOptions`

| Field | Type | Description |
| --- | --- | --- |
| `body` | `string` | Page HTML body (required) |
| `title` | `string?` | Page title |
| `lang` | `string?` | HTML lang attribute |
| `htmlAttributes` | `Record<string, string>?` | Additional `<html>` attributes |
| `headScripts` | `string[]?` | Scripts to inject in `<head>` |
| `headLinks` | `string[]?` | `<link>` tags for `<head>` |
| `data` | `unknown?` | Serialized loader data for client hydration |
| `actions` | `Record<string, string[]>?` | Action names per page (for client) |
| `clientEntry` | `string?` | Client entry URL path |
| `metadata` | `PageMetadata?` | SEO metadata (title, description, OG, Twitter) |
| `renderEndpoint` | `boolean?` | Whether `/__elur-js/render` exists (default `true`; `false` for static) |

## `buildHeadTags(metadata, fallbackTitle)`

Builds `<head>` tag strings from `PageMetadata`:

```typescript
import { buildHeadTags } from "@elurjs/kit";

const head = buildHeadTags(metadata, "My Site");
// <title>...</title><meta name="description">...<meta property="og:...">...
```

Tags include: `<title>`, `<meta name="description">`, `<link rel="canonical">`,
`<meta name="robots">`, Open Graph tags, and Twitter Card tags. All tags carry
`data-elur-head` for the SPA router to merge on navigation.

## `collectShellExtras(pageData, layoutDataList)`

Collects `htmlAttributes` and `headScripts`/`headLinks` declared by data
loaders (page and layouts) via top-level fields:

```typescript
import { collectShellExtras } from "@elurjs/kit";

const extras = collectShellExtras(pageData, layoutDataList);
// { htmlAttributes: { "data-theme": "dark" }, headScripts: [...], headLinks: [...] }
```

Loaders can declare these fields in their returned data:

```typescript
// src/app/blog/[slug]/page.data.ts
export const load = async ({ params }) => {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    htmlAttributes: { "data-page": "blog" },
    headScripts: ["/scripts/highlight.js"],
    headLinks: ['<link rel="stylesheet" href="/styles/code.css">'],
    post,
  };
};
```

## Streaming

Use `streamBoundary` for per-request Suspense-style streaming. During SSR,
the fallback is emitted immediately and the resolved content is streamed as
a `<template>` chunk that swaps in-place. During SSG, boundaries are
resolved synchronously:

```typescript
import { streamBoundary } from "@elurjs/kit";

const template = streamBoundary({
  fallback: html`<p>Loading…</p>`,
  promise: fetchUserData(),
  children: (user) => html`<p>Hello, ${user.name}</p>`,
});
```

### `StreamBoundaryOptions<T>`

| Field | Type | Description |
| --- | --- | --- |
| `fallback` | `ElurTemplate` | Content shown while the promise resolves |
| `promise` | `Promise<T>` | Promise that resolves to the real data |
| `children` | `(value: T) => ElurTemplate` | Renders the resolved value |

## `createSsrServer(options)`

Create an SSR server for on-demand rendering:

```typescript
import { createSsrServer } from "@elurjs/kit";

const server = await createSsrServer({
  appDir: "./src/app",
  outDir: "./dist",
});

await server.listen(); // default port 3000
await server.close();  // shutdown
```

### `SsrServer`

```typescript
interface SsrServer {
  server: Server;       // Node.js http.Server
  listen(): Promise<void>;
  close(): Promise<void>;
}
```

## Hydration

The client entry hydrates islands and starts the client router:

```typescript
// src/entry-client.ts
import { hydrateIslands } from "@elurjs/kit/island";
import LikeButton from "./islands/LikeButton";

hydrateIslands({ LikeButton });
```

Or let `build()` auto-generate it from `src/islands/`:

```typescript
await build({
  appDir: "./src/app",
  outDir: "./dist",
  islandsDir: "./src/islands",
  generatedEntry: "./.elur/entry-client.ts",
});
```

## ISR (Incremental Static Regeneration)

For hybrid mode, pages can be regenerated on-demand. Export a `cache` policy
from the loader:

```typescript
// src/app/blog/[slug]/page.data.ts
export const load = async ({ params }) => {
  const post = await db.posts.findBySlug(params.slug);
  return { post };
};

export const cache = {
  mode: "public",     // "public" | "private" | "dynamic"
  revalidate: 60,     // seconds (0 = always revalidate)
  tags: ["posts"],    // for tag-based invalidation
};
```

Default policy is `dynamic` (no caching).

## `renderPage(options)` — single page SSR

Renders a matched route to HTML. Used internally by the SSR server and
adapters:

```typescript
import { renderPage } from "@elurjs/kit";

const result = await renderPage({
  route: matchedRoute,        // PageRoute from scanRoutes
  params: { slug: "hello" },
  searchParams: new URLSearchParams(),
  config: { lang: "es", clientEntry: "/_elur/entry-client.js" },
  request,                    // for loaders that need cookies/headers
});
// result.html, result.revalidate, result.head, result.resolvedTitle
// result.clearActionErrorCookie (if action error was consumed)
```

`RenderPageResult` also includes `response` when a loader throws a
first-class `Response` (redirect, 404, etc.).

### `RenderPageOptions`

| Field | Type | Description |
| --- | --- | --- |
| `route` | `PageRoute` | Matched route from `scanRoutes` (required) |
| `params` | `RouteParams?` | Route parameters |
| `searchParams` | `URLSearchParams?` | Query string |
| `config` | `Pick<BuildConfig, "lang" \| "clientEntry" \| "renderEndpoint">` | Render config (required) |
| `importer` | `(path) => Promise<unknown>?` | Custom module loader |
| `actions` | `Record<string, string[]>?` | Action registry |
| `request` | `Request?` | Original request (for loaders) |

## `renderStreamingPage(options)` — streaming SSR

Streaming renders pages incrementally — sending static parts immediately and
resolving async boundaries as they complete:

```typescript
import { renderStreamingPage } from "@elurjs/kit";

const stream = await renderStreamingPage({
  route: matchedRoute,
  params: { slug: "hello-world" },
  searchParams: new URLSearchParams(),
  config: { lang: "es", clientEntry: "/_elur/entry-client.js" },
  request,
});
// Returns a ReadableStream
```

### `StreamingPageOptions`

| Field | Type | Description |
| --- | --- | --- |
| `route` | `PageRoute` | Matched route (required) |
| `params` | `Record<string, string \| string[]>` | Route parameters (required) |
| `searchParams` | `URLSearchParams` | Query string (required) |
| `config` | `Pick<BuildConfig, "lang" \| "clientEntry">` | Render config (required) |
| `importer` | `(path) => Promise<unknown>?` | Custom module loader |
| `actions` | `Record<string, string[]>?` | Action registry |
| `request` | `Request?` | Original request |

:::note
Streaming is experimental. Some adapters may buffer the response.
:::

## `renderPageBody(options)` — SPA render endpoint

Renders only the inner HTML body for a page (without the document shell).
Used by the client router's `/__elur-js/render` endpoint to inject real
content during SPA navigation:

```typescript
import { renderPageBody } from "@elurjs/kit";

const result = await renderPageBody({
  routes: scannedRoutes,
  pathname: "/blog/hello-world",
  searchParams: new URLSearchParams(),
  config: { lang: "es", clientEntry: "/_elur/entry-client.js" },
  request,
});
// result.body — inner HTML
// result.title — page title
// result.head — <head> tags for SPA merge
// result.fullHtml — full document (for ISR caching)
// result.clearActionErrorCookie — cookie cleanup if action error was consumed
// result.response — first-class Response if a loader threw one
```

Throws `RouteNotFoundError` if no route matches the pathname.

### `RenderPageBodyOptions`

| Field | Type | Description |
| --- | --- | --- |
| `routes` | `ScannedRoutes` | All scanned routes |
| `pathname` | `string` | Path to render |
| `searchParams` | `URLSearchParams` | Query string |
| `config` | `Pick<BuildConfig, "lang" \| "clientEntry">` | Render config |
| `actions` | `Record<string, string[]>?` | Action registry |
| `importer` | `(path) => Promise<unknown>?` | Custom module loader |
| `request` | `Request?` | Original request |

## `renderErrorPage(options)` — error pages

Renders a 404 or 500 error page using the scanned `404.page.ts` / `500.page.ts`
routes. Returns `undefined` if no error page exists:

```typescript
import { renderErrorPage } from "@elurjs/kit";

const result = await renderErrorPage({
  routes: scannedRoutes,
  status: 404,
  config: { lang: "es", clientEntry: "/_elur/entry-client.js", renderEndpoint: true },
});
// result: { html: string, status: 404 } | undefined
```

### `RenderErrorPageOptions`

| Field | Type | Description |
| --- | --- | --- |
| `routes` | `ScannedRoutes` | All scanned routes |
| `status` | `404 \| 500` | Error status code |
| `error` | `unknown?` | The original error (for 500 pages) |
| `config` | `Pick<BuildConfig, "lang" \| "clientEntry" \| "renderEndpoint">` | Render config |
| `actions` | `Record<string, string[]>?` | Action registry |
| `importer` | `(path) => Promise<unknown>?` | Custom module loader |

## `BuildConfig`

| Field | Type | Description |
| --- | --- | --- |
| `appDir` | `string` | Absolute path to the app directory |
| `outDir` | `string` | Absolute path to the output directory |
| `root` | `string?` | Project root (for relative action paths in HTML shell) |
| `clientEntry` | `string?` | Client entry URL path, e.g. `/_elur/entry-client.js` |
| `lang` | `string?` | Default HTML lang attribute |
| `islandsDir` | `string?` | Islands directory (enables auto-generated entry) |
| `generatedEntry` | `string?` | Path for generated client entry (required with `islandsDir`) |
| `hydrateImport` | `string?` | Import specifier for `hydrateIslands` (default `@elurjs/kit/island`) |
| `routerImport` | `string?` | Import specifier for `startClientRouter` (default `@elurjs/kit/router`) |
| `publicDir` | `string?` | Public directory for static assets |
| `imageFormats` | `ImageFormat[]?` | Image formats (default `["webp", "avif"]`) |
| `renderEndpoint` | `boolean?` | Whether `/__elur-js/render` exists (default `true`; `false` for static) |
| `integrations` | `ElurKitIntegration[]?` | Integrations to invoke during build |

## `BuildResult`

| Field | Type | Description |
| --- | --- | --- |
| `pages` | `number` | Number of static HTML pages generated |
| `skipped` | `string[]` | Paths skipped (dynamic without static params) |
| `files` | `string[]` | Absolute paths to generated HTML files |
| `islands` | `IslandModule[]` | Discovered islands |
| `generatedEntry` | `string?` | Path to generated client entry |
| `imagesProcessed` | `number` | Image variants generated (0 if no sharp) |
| `outDir` | `string` | Output directory (atomic staging dir when via CLI) |

## `ShellOptions`

| Field | Type | Description |
| --- | --- | --- |
| `body` | `string` | Rendered inner HTML for `#app` |
| `title` | `string?` | `<title>` text |
| `lang` | `string?` | `<html lang>` attribute |
| `htmlAttributes` | `Record<string, string>?` | Additional `<html>` attributes |
| `headScripts` | `string[]?` | Inline scripts in `<head>` (no-flash bootstrapping) |
| `headLinks` | `string[]?` | Raw HTML in `<head>` (icons, manifest, theme-color) |
| `data` | `unknown?` | Loader data serialized in `<script id="elur-data">` |
| `actions` | `Record<string, string[]>?` | Per-page action names in `<script id="elur-actions">` |
| `clientEntry` | `string?` | Client entry URL path |
| `metadata` | `PageMetadata?` | Page metadata (meta, link, OG/Twitter tags) |
| `renderEndpoint` | `boolean?` | Whether `/__elur-js/render` exists (default `true`) |

## `SsrServerOptions`

| Field | Type | Description |
| --- | --- | --- |
| `appDir` | `string` | Absolute path to the app directory |
| `root` | `string?` | Project root (for relative action paths) |
| `publicDir` | `string?` | Absolute path to static files directory |
| `clientEntry` | `string?` | Client entry URL path |
| `lang` | `string?` | Default HTML lang attribute |
| `port` | `number?` | Server port |
| `host` | `string?` | Server host |
| `cacheDir` | `string?` | ISR cache directory |
| `defaultRevalidate` | `number?` | Default revalidate seconds |
| `streaming` | `boolean?` | Render with `loading.ts` streaming boundaries |
| `actionSecurity` | `ActionSecurityOptions?` | CSRF/origin policy for actions |

## Build internals

### `buildClientBundle(options)` — Vite client build

Builds the client bundle using the Vite JS API (no `npx` subprocess):

```typescript
import { buildClientBundle } from "@elurjs/kit";

const result = await buildClientBundle({
  root: process.cwd(),
  entry: "./.elur/entry-client.ts",
  outDir: "dist/_elur",
  clientEntry: "/_elur/entry-client.js",
});
```

### `beginAtomicStage(options)` — atomic staging

Stages build output outside `dist/` and swaps only on success:

```typescript
import { beginAtomicStage } from "@elurjs/kit";

const stage = await beginAtomicStage({ outDir: "dist", stageDir: ".elur-stage" });
// ... write files to stage.path ...
await stage.commit(); // atomic swap to dist/
```

### `copyPublicAssets(options)` — copy static files

```typescript
import { copyPublicAssets } from "@elurjs/kit";

await copyPublicAssets({
  publicDir: "public",
  outDir: "dist",
});
```

## Gotchas

1. **`page.data.ts` loader runs on server.** Don't access `window` or
   `document` in loaders.
2. **Dynamic routes need `generateStaticParams`.** Without it, `[slug]`
   routes are skipped during SSG.
3. **SSR errors are never silenced.** If an island throws during SSR, the
   error propagates with remediation hints. Use `directive: "only"` or
   `options: { ssr: false }` to skip SSR.
