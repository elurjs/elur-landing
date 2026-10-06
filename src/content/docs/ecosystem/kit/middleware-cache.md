---
title: Middleware & Cache
description: Request middleware, streamBoundary, cache adapters (Filesystem, Redis, Cloudflare KV), and tag-based invalidation.
section: Elur Kit
order: 8
---

# Middleware & Cache

## Middleware

Create `src/middleware.ts` to run logic before every request (a single
global file — there is no middleware directory or per-route middleware):

```typescript
import type { Middleware } from "@elurjs/kit";

const middleware: Middleware = (request, context) => {
  if (!request.headers.get("Cookie")?.includes("session=")) {
    return Response.redirect(new URL("/login", request.url), 307);
  }
  // Return nothing to continue to the route handler
};

export default middleware;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

Since v2.5 middleware runs in the unified Web handler — `dev`, `preview`,
and `start` share the same pipeline: it executes after redirects/rewrites
and the internal endpoints, before routing. A returned `Response`
short-circuits through the standard finalize step (security headers,
`X-Request-ID`, `Server-Timing` still apply); `next({ headers, locals })`
merges into the downstream request and exposes `locals` to API routes.
Middleware errors return a sanitized 500 instead of crashing the
request. The generated Node/Bun adapter servers do not run the middleware
file yet.

### `Middleware` type

```typescript
type Middleware = (
  request: Request,
  context: MiddlewareContext,
) => Response | void | Promise<Response | void>;
```

### `MiddlewareContext`

| Field | Type | Description |
| --- | --- | --- |
| `next(options?)` | `(options?: { headers?, params?, locals? }) => void` | Continue to next handler with optional headers/params/locals |
| `params` | `Record<string, string \| string[]> \| undefined` | Matched route params (if path matches a page route) |
| `locals` | `Record<string, unknown> \| undefined` | Per-request data published via `next({ locals })` — reaches API route handlers as `ctx.locals` (does **not** reach `page.data.ts` loaders; the built-in action endpoint currently passes an empty object) |

### `MiddlewareConfig`

| Field | Type | Description |
| --- | --- | --- |
| `matcher` | `string[]` | Path patterns — `*` wildcard, `:param` segments, `:param*` catch-alls (a catch-all also matches the bare base path, so `/dashboard/:path*` matches `/dashboard` itself). No matcher = runs on every request |

### `LoadedMiddleware`

```typescript
interface LoadedMiddleware {
  handler: Middleware;
  config: MiddlewareConfig;
}
```

### `MiddlewareResult`

Tagged union returned by `runMiddleware`:

```typescript
type MiddlewareResult =
  | { kind: "response"; response: Response }
  | {
      kind: "continue";
      headers?: Record<string, string>;
      params?: Record<string, string | string[]>;
      locals?: Record<string, unknown>;
    };
```

### Matching patterns

```typescript
export const config = {
  matcher: [
    "/dashboard/:path*",   // all dashboard routes
    "/admin/*",            // all admin routes
    "/api/:method",        // specific param
  ],
};
```

## `streamBoundary(options)` — streaming content

Renders fallback content while a promise resolves, then swaps in the real
content during streaming SSR:

```typescript
import { streamBoundary } from "@elurjs/kit";
import { html } from "@elurjs/core";

html`
  <h1>Blog Post</h1>
  ${streamBoundary({
    fallback: html`<p>Loading comments…</p>`,
    promise: fetchComments(postId),
    children: (comments) => html`
      <ul>${comments.map(c => html`<li>${c.text}</li>`)}</ul>
    `,
  })}
`
```

### `StreamBoundaryOptions<T>`

| Field | Type | Description |
| --- | --- | --- |
| `fallback` | `ElurTemplate` | Content shown while promise resolves |
| `promise` | `Promise<T>` | Promise that resolves to data |
| `children` | `(value: T) => ElurTemplate` | Renders resolved value |

:::note
Streaming is experimental. Some adapters may buffer the response instead of
streaming.
:::

## HTML cache

Legacy cache functions. `getCachedHtml`, `setCachedHtml`, and `clearCache`
are exported from both `@elurjs/kit` and `@elurjs/kit/cache` for backward
compatibility; `isStale` lives only on the `/cache` subpath:

```typescript
import { getCachedHtml, setCachedHtml, clearCache, isStale } from "@elurjs/kit/cache";

// Check cache before rendering — returns the entry only while fresh
const cached = await getCachedHtml(cacheDir, "/blog/hello-world");
if (cached) return cached.html;

// Staleness probe (cacheDir + pathname, async)
const stale = await isStale(cacheDir, "/blog/hello-world");

// Cache after rendering (60s revalidate)
await setCachedHtml(cacheDir, "/blog/hello-world", html, 60);

// Clear all cache
await clearCache(cacheDir);
```

### `CacheEntry`

```typescript
interface CacheEntry {
  html: string;
  generatedAt: number;
  revalidate: number;
  tags?: string[]; // adapter CacheEntry only (tag-based invalidation)
  version?: string; // adapter CacheEntry only
}
```

`getCachedHtml` returns the entry only while it is **fresh** (returns
`undefined` once stale — use `isStale()` to distinguish miss from stale),
and the legacy entry shape has no `tags`/`version` fields.

## Cache adapters

Everything below is exported from the dedicated **`@elurjs/kit/cache`**
subpath only. Wire an adapter globally via
`defineConfig({ cache: { adapter } })`, or manually with
`connectCacheAdapter`.

### Filesystem (default)

```typescript
import { createFsCacheAdapter } from "@elurjs/kit/cache";

const adapter = createFsCacheAdapter({
  cacheDir: "./.elur/cache",
  maxEntries: 1000,  // default: 1000
  maxAgeMs: 86_400_000, // default: 24h
});
```

When `cache.adapter` is omitted, the handler creates a filesystem adapter
rooted at `cache.dir` and shares it per directory for the process.

### Redis

```typescript
import { createRedisCacheAdapter } from "@elurjs/kit/cache";

const adapter = createRedisCacheAdapter({
  client: redisClient, // ioredis, node-redis, or Upstash
  prefix: "elur-kit:", // default prefix
});
```

### Cloudflare KV

```typescript
import { createCloudflareKVCacheAdapter } from "@elurjs/kit/cache";

const adapter = createCloudflareKVCacheAdapter({
  namespace: KV_NAMESPACE, // Cloudflare KV binding
});
```

### `CacheAdapter` interface

```typescript
interface CacheAdapter {
  get(key: string): Promise<CacheEntry | null>;
  set(key: string, value: CacheEntry, options: CacheWriteOptions): Promise<void>;
  delete(key: string): Promise<void>;
  invalidateTags(tags: readonly string[]): Promise<void>;
}
```

### `CacheWriteOptions`

| Field | Type | Description |
| --- | --- | --- |
| `revalidate` | `number` | Revalidation seconds |
| `tags` | `string[]?` | Tags for tag-based invalidation |
| `version` | `string?` | Version string |

### `getWithSWR(adapter, key, revalidate)`

Stale-while-revalidate read: returns the cached entry immediately and
revalidates in the background when it is stale. On a cache miss the
revalidation runs synchronously:

```typescript
import { getWithSWR, cacheKey } from "@elurjs/kit/cache";

const { entry, stale } = await getWithSWR(
  adapter,
  cacheKey("/blog/hello-world"),
  async () => {
    const html = await renderPage(options);
    return { html, generatedAt: Date.now(), revalidate: 60, tags: ["posts"] };
  },
);
```

### `cacheKey(...parts)`

SHA-256 page cache keys — the same scheme used by path-based invalidation:

```typescript
const key = cacheKey("/blog/hello-world"); // sha256 hex
```

### Cache policy helpers

```typescript
import {
  normalizeCachePolicy,
  shouldCachePublic,
  DEFAULT_CACHE_POLICY,
} from "@elurjs/kit/cache";

const policy = normalizeCachePolicy(route.cache); // fills defaults
shouldCachePublic(policy, request); // false when Cookie/Authorization present
```

:::warning
`shouldCachePublic` only inspects the **request** — it does not check
response headers (`Set-Cookie`, `private`, `no-store`). A route that sets
cookies in its response can still be publicly cached; mark those routes
`mode: "private"` or `"dynamic"` explicitly.
:::

## Cache policy

Per-page cache policy via the loader — export `cache` (not `cachePolicy`):

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

A plain `export const revalidate = 60` on the same data module also works —
it sets `revalidate` without a full policy object. If both are present,
`cache.revalidate` wins when it is greater than `0`.

Default policy is `dynamic` (no caching). Requests with `Cookie` or
`Authorization` headers are never cached publicly.

| Mode | Description |
| --- | --- |
| `public` | ISR/public cache, shared (`shouldCachePublic` still skips requests with `Cookie`/`Authorization`) |
| `private` | Never publicly cached — reserved for a future per-user adapter (today it renders on demand) |
| `dynamic` | Never cache, always render on demand |

## Invalidation

### Tag-based

```typescript
import { defaultInvalidator } from "@elurjs/kit/cache";

await defaultInvalidator.invalidateTags(["posts"]);
```

### Path-based

```typescript
await defaultInvalidator.invalidatePaths(["/blog", "/blog/hello-world"]);
// paths are hashed with cacheKey() before hitting the adapter
```

### From actions

```typescript
export const deletePost = defineAction(
  {
    invalidateTags: ["posts"],
    invalidatePaths: ["/blog"],
  },
  async (input) => {
    await db.posts.delete(input.id);
    return { ok: true };
  }
);
```

Actions declared via `defineAction` dispatch their `invalidateTags` /
`invalidatePaths` to the connected cache adapter automatically on success —
actions that return `fail(...)` invalidate nothing.

### `CacheInvalidator`

A pub/sub hub for invalidation events — actions emit, adapters listen:

```typescript
import { CacheInvalidator } from "@elurjs/kit/cache";

const invalidator = new CacheInvalidator();

const unsubscribe = invalidator.on(async (event) => {
  // event: { tags?: string[]; paths?: string[]; source?: string }
});

await invalidator.invalidateTags(["posts"], "admin-panel");
await invalidator.emit({ tags: ["posts"], source: "webhook" });

unsubscribe();   // remove one listener
invalidator.clear(); // remove all listeners
```

`defaultInvalidator` is the global instance the runtime registers the cache
adapter on.

### `InvalidationEvent`

```typescript
interface InvalidationEvent {
  tags?: readonly string[];
  paths?: readonly string[];
  source?: string;
}
```

## `connectCacheAdapter(adapter, invalidator?)`

Connects a cache adapter to the invalidation system so tag/path events from
actions reach the cache. Returns an unsubscribe function:

```typescript
import { connectCacheAdapter, defaultInvalidator, createRedisCacheAdapter } from "@elurjs/kit/cache";

const adapter = createRedisCacheAdapter({ client: redisClient });
const unsubscribe = connectCacheAdapter(adapter, defaultInvalidator);
// later: unsubscribe() to disconnect
```

## Low-level middleware utilities

### `loadMiddleware(root?)`

Loads `src/middleware.ts` and returns the loaded middleware with its config:

```typescript
import { loadMiddleware } from "@elurjs/kit";

const loaded = await loadMiddleware(".");
// loaded.handler, loaded.config — root is the project root;
// candidates are `<root>/src/middleware.ts` then `<root>/middleware.ts`
// Returns null if no middleware file exists
```

### `runMiddleware(middleware, request, params?)`

```typescript
import { runMiddleware } from "@elurjs/kit";

const result = await runMiddleware(loaded, request);
if (result.kind === "response") {
  // middleware returned a redirect/error response
  return result.response;
}
// result.kind === "continue"
// result.headers, result.params, result.locals
```

### `matchesMiddleware(pathname, config)`

```typescript
import { matchesMiddleware } from "@elurjs/kit";

matchesMiddleware("/dashboard/users", { matcher: ["/dashboard/:path*"] });
// → true
```
