---
title: Middleware & Cache
description: Request middleware, streamBoundary, cache adapters (Filesystem, Redis, Cloudflare KV), and tag-based invalidation.
section: Elur Kit
order: 8
---

# Middleware & Cache

## Middleware

Create `src/middleware.ts` to run logic before every request:

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
| `locals` | `Record<string, unknown> \| undefined` | Per-request data, passed to actions and loaders |

### `MiddlewareConfig`

| Field | Type | Description |
| --- | --- | --- |
| `matcher` | `string[]` | Path patterns — `*` wildcard, `:param` segments |

### `Middleware` type

```typescript
type Middleware = (
  request: Request,
  context: MiddlewareContext,
) => Response | void | Promise<Response | void>;
```

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

Legacy cache functions (from `@elurjs/kit`):

```typescript
import { getCachedHtml, setCachedHtml, clearCache } from "@elurjs/kit";

// Check cache before rendering
const cached = await getCachedHtml(cacheDir, "/blog/hello-world");
if (cached) return cached;

// Cache after rendering
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
}
```

## Cache adapters

### Filesystem (default)

```typescript
import { createFsCacheAdapter } from "@elurjs/kit";

const adapter = createFsCacheAdapter({
  cacheDir: "./.elur/cache",
  maxEntries: 1000,  // default: 1000
  maxAgeMs: 86_400_000, // default: 24h
});
```

### Redis

```typescript
import { createRedisCacheAdapter } from "@elurjs/kit";

const adapter = createRedisCacheAdapter({
  client: redisClient, // ioredis, node-redis, or Upstash
  prefix: "elur-kit:", // default prefix
});
```

### Cloudflare KV

```typescript
import { createCloudflareKvCacheAdapter } from "@elurjs/kit";

const adapter = createCloudflareKvCacheAdapter({
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

Default policy is `dynamic` (no caching). Requests with `Cookie` or
`Authorization` headers are never cached publicly.

| Mode | Description |
| --- | --- |
| `public` | CDN-cacheable, shared cache |
| `private` | Browser-only cache |
| `dynamic` | Never cache, always render on demand |

## Invalidation

### Tag-based

```typescript
import { defaultInvalidator } from "@elurjs/kit";

await defaultInvalidator.invalidateTags(["posts"]);
```

### Path-based

```typescript
await defaultInvalidator.invalidatePaths(["/blog", "/blog/hello-world"]);
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

## `connectCacheAdapter(adapter, invalidator?)`

Connects a cache adapter to the invalidation system. Returns an unsubscribe
function:

```typescript
import { connectCacheAdapter, defaultInvalidator } from "@elurjs/kit";

const adapter = createRedisCacheAdapter({ client: redisClient });
const unsubscribe = connectCacheAdapter(adapter, defaultInvalidator);
// later: unsubscribe() to disconnect
```

## Low-level middleware utilities

### `loadMiddleware(root?)`

Loads `src/middleware.ts` and returns the loaded middleware with its config:

```typescript
import { loadMiddleware } from "@elurjs/kit";

const loaded = await loadMiddleware("./src");
// loaded.handler, loaded.config
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
