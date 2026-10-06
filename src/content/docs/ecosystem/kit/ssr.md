---
title: SSR & Hydration
description: Server-side rendering, static generation, streaming, ISR, and hydration with Elur Kit.
section: Elur Kit
order: 4
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

Wraps page HTML with the document shell (`<html>`, `<head>`, `<body>`).
The `#app` content is delimited with explicit
`<!--elur:app:start-->`/`<!--elur:app:end-->` comment markers so adapters
and the streaming pipeline can locate the body without fragile regexes —
use `extractAppBody(html)` to pull it back out:

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
  routerEntry: "/_elur/router.js", // split builds only
  routerEnabled: true,
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
| `headScripts` | `string[]?` | Inline scripts to inject in `<head>` (run before first paint — ideal for no-flash theme bootstrapping) |
| `headLinks` | `string[]?` | Raw HTML for `<head>` (`<link>` icons, manifest, theme-color) |
| `data` | `unknown?` | Serialized loader data for client hydration |
| `actions` | `Record<string, string[]>?` | Action names per page (for client) |
| `clientEntry` | `string?` | Client entry URL path — emitted only when the body contains islands (modern JS mode) |
| `routerEntry` | `string?` | URL of the split router chunk, e.g. `/_elur/router.js` |
| `routerEnabled` | `boolean?` | Whether the SPA router is enabled — `false` omits the `elur:render-endpoint` meta |
| `speculation` | `"prefetch" \| "prerender"?` | Emits `<script type="speculationrules">` (static builds only) |
| `metadata` | `PageMetadata?` | SEO metadata (title, description, OG, Twitter) |
| `renderEndpoint` | `boolean?` | Whether `/__elur-js/render` exists (default `true`; `false` for static) |

Every emitted module entry (`clientEntry`, `routerEntry`) also gets a
`<link rel="modulepreload">` so the fetch starts during HTML parsing.

### `extractAppBody(html)`

Returns the HTML between the `<!--elur:app:start-->`/`<!--elur:app:end-->`
markers — the stable way for adapters to pull the rendered body out of a
full document:

```typescript
import { extractAppBody } from "@elurjs/kit";

const body = extractAppBody(fullHtml);
```

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

Two complementary mechanisms:

- **`streamBoundary`** — a Suspense-style boundary inside a template. During
  SSR the fallback is emitted immediately and the resolved content is
  streamed as a `<template>` chunk that swaps in-place. During SSG,
  boundaries are resolved synchronously.
- **Real streaming SSR (opt-in, v2.5+)** — `defineConfig({ streaming: true })`
  streams the document shell + the `loading.ts` fallback immediately while
  the page renders in the background, then swaps the boundary in-place.

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

### Real streaming SSR (`streaming: true`)

```typescript
// elur.config.ts
export default defineConfig({
  output: "server",
  streaming: true, // experimental
});
```

```text
src/app/blog/loading.ts   → marks /blog/* as a streaming boundary
```

Behavior:

- Works everywhere the unified Web handler runs — `dev`, `preview`,
  `start`, and the generated Node/Bun servers. Hosts that declare
  `capabilities.streaming: false` degrade to buffered rendering, and the
  CLI `adapter` command validates the combination at build time.
- Streamed responses send `Content-Type: text/html` early, no
  `Content-Length`, `X-Accel-Buffering: no`, and `Cache-Control: no-store`.
- **ISR interaction**: streamed pages bypass the cache entirely (never
  read, never written). Buffered routes keep normal ISR behavior.
- **Abort handling**: client disconnects cancel the stream via
  `request.signal`; late background renders are discarded.
- **Mid-stream failures**: a loader `redirect()`/`throw new Response()`
  navigates via an inline script chunk; a render error swaps the boundary
  for an inline `role="alert"` notice instead of a dead spinner.

### `createStreamingResponse` / `createBufferedResponse`

Low-level primitives used by the handler (exported from the package root).
Both take `StreamResponseOptions` — the matched route plus render config —
and return a `Response`; `createStreamingResponse` falls back to buffered
rendering automatically when the route has no `loading` boundary:

```typescript
import { createStreamingResponse, createBufferedResponse } from "@elurjs/kit";

const response = await createStreamingResponse({
  route: matchedRoute,          // PageRoute with loadingPath → streams
  params: { slug: "hello" },
  searchParams: new URLSearchParams(),
  config: { lang: "es", clientEntry: "/_elur/entry-client.js" },
  request,
  signal: request.signal,       // client disconnect cancels the stream
});
```

`sendWebResponse(res, response, request.signal)` (from
`@elurjs/kit/runtime`) writes the response to a Node `ServerResponse`,
forwarding chunks with backpressure and cancelling the upstream stream on
socket close.

## `createSsrServer(options)` — deprecated

:::warning Deprecated since v2.5
`createSsrServer` is the legacy standalone SSR pipeline. `dev`, `preview`,
and `start` all run through `createWebHandler` now. It remains exported
for backward compatibility and will be removed in a future major — use
`elur-kit start` or `createWebHandler` instead.
:::

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

Default policy is `dynamic` (no caching). Stale entries are served
immediately while the page re-renders in the background
(stale-while-revalidate). Storage goes through the pluggable
`CacheAdapter` — filesystem by default, or Redis/Cloudflare KV via
`defineConfig({ cache: { adapter } })`. See
[Middleware & Cache](/docs/ecosystem/kit/middleware-cache/).

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

## `renderStreamingPage(options)` — deprecated

:::warning Deprecated since v2.5
`renderStreamingPage` used the legacy shell + client-fetch streaming
approach. It is superseded by `createStreamingResponse` — real streaming
via `defineConfig({ streaming: true })` + a `loading.ts` boundary.
:::

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
| `router` | `object?` | Router flags (`enabled`, `prefetch`, `morph`, `loadingIndicator`, `speculation`, `separate`, `entry`, `outFile`) baked into the generated entries |
| `js` | `"modern" \| "legacy"?` | Client JS emission mode — `"modern"` gates per page (0% JS) |
| `site` | `string?` | Public site URL — enables automatic `sitemap.xml` generation from scanned routes |
| `onPhase` | `(name, durationMs) => void?` | Observer called once per build phase (`scan`, `pages`, `images`, `integrations`, `sitemap`, `transform`, `manifest`, `client bundle`) |
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
4. **Streaming pages bypass the ISR cache** — never read, never written.
   Keep `streaming: false` for routes you want cacheable.
5. **`elur-kit start` needs a prior `elur-kit build`.** It fails fast when
   `dist/` is missing — it no longer renders everything on demand.
