---
title: Routing
description: File-based routing conventions — pages, layouts, dynamic routes, catch-all, route groups, SPA router, layout slots, redirects and rewrites.
section: Elur Kit
order: 2
---

# Routing

Elur Kit uses file-based routing. Files in `src/app/` automatically become
routes based on their path. For data loading, API routes, actions,
middleware, and server-side patterns, see
[Data & Backend](/docs/ecosystem/kit/data-backend/).

## File conventions

| File | Purpose |
| --- | --- |
| `page.ts` | Page component for the route |
| `page.data.ts` | Data loader (runs on server) |
| `page.action.ts` | Server actions |
| `layout.ts` | Layout wrapping child pages |
| `layout.data.ts` | Layout data loader |
| `loading.ts` | Streaming fallback during load |
| `route.ts` | API endpoint (no HTML) |
| `404.page.ts` | Custom 404 page |
| `500.page.ts` | Custom 500 page |
| `middleware.ts` | Root middleware |
| `*.slot.ts` | Named layout slot |

See [Data & Backend](/docs/ecosystem/kit/data-backend/) for details on
loaders, actions, API routes, middleware, and error pages.

## Pages

Each `page.ts` exports a default component:

```typescript
import { html } from "@elurjs/core";
import type { PageProps } from "@elurjs/kit";

export default function AboutPage({ data }: PageProps<unknown>) {
  return html`<h1>About</h1>`;
}
```

## Layouts

Layouts wrap pages and receive `children`:

```typescript
import { html } from "@elurjs/core";
import type { LayoutProps } from "@elurjs/kit";

export default function RootLayout({ children }: LayoutProps) {
  return html`
    <html>
      <body>
        <nav>...</nav>
        ${children}
      </body>
    </html>
  `;
}
```

Nested layouts stack — a `blog/layout.ts` wraps all pages under `/blog/`.

## Dynamic routes

Use `[param]` for dynamic segments:

```text
src/app/blog/[slug]/page.ts  →  /blog/:slug
src/app/users/[id]/page.ts   →  /users/:id
```

Dynamic routes require `generateStaticParams` for SSG:

```typescript
// src/app/blog/[slug]/page.ts
import type { GenerateStaticParams } from "@elurjs/kit";

export const generateStaticParams: GenerateStaticParams = async () => {
  return [{ slug: "hello-world" }, { slug: "elur-kit" }];
};
```

## Catch-all routes

Use `[...slug]` for catch-all segments:

```text
src/app/docs/[...slug]/page.ts  →  /docs/*
```

## Optional catch-all

Optional catch-all uses `[[...slug]]` — matches the parent path too:

```text
src/app/blog/[[...slug]]/page.ts  → /blog, /blog/a, /blog/a/b
```

## Route groups

Route groups `(name)` are URL-invisible. They only affect layout nesting,
not the path:

```text
src/app/(marketing)/pricing/page.ts  →  /pricing
src/app/(marketing)/layout.ts        →  wraps /pricing but not in URL
```

## Layout slots

Named slot files (`*.slot.ts`) in the same directory as a page are discovered
by the route scanner and made available to the layout:

```text
src/app/blog/
├── layout.ts          # wraps /blog/*
├── [slug]/page.ts     # → /blog/:slug
├── [slug]/sidebar.slot.ts  # named slot "sidebar"
└── [slug]/comments.slot.ts # named slot "comments"
```

## SPA router

The client router provides prefetch and view transitions:

- Links are prefetched on viewport entry (IntersectionObserver) and hover/focus
- Prefetched pages cache for 30 seconds
- Add `data-no-prefetch` to any link to opt out
- View Transitions API used when supported (disabled with `prefers-reduced-motion`)
- Add `data-no-router` to any link to opt out of client-side navigation

### Programmatic navigation

```typescript
import { navigateTo, prefetch } from "@elurjs/kit/router";

// Navigate to a new page (pushes to history by default)
await navigateTo("/blog/hello-world");

// Replace history entry instead of pushing
await navigateTo("/login", "", false);

// Prefetch a page without navigating
await prefetch("/blog/hello-world");
```

`navigateTo(pathname, search?, push?)` returns `Promise<boolean>` — `true` if
navigation succeeded, `false` if it was cancelled by a newer navigation.

`prefetch(pathname, search?)` fetches the page payload and caches it for 30
seconds. Subsequent navigations to the same path use the cache instantly.

### `startClientRouter()`

Initializes the client router automatically. This is called by the generated
client entry — you normally don't call it directly:

```typescript
import { startClientRouter } from "@elurjs/kit/router";
startClientRouter();
```

## Redirects and rewrites

Redirect and rewrite rules are internal utilities that match path patterns
with `:param` and `*` wildcards. They are used by the framework during build
and request handling:

```typescript
// Internal API (not exported via @elurjs/kit/router)
// RedirectRule: { from, to, status? } — default status 308
// RewriteRule: { from, to }
// RouteHeadersRule: { path, headers }
```

### `RedirectRule`

| Field | Type | Description |
| --- | --- | --- |
| `from` | `string` | Source path pattern (`:param`, `*` wildcards) |
| `to` | `string` | Destination path (supports `:param` interpolation) |
| `status` | `301 \| 302 \| 307 \| 308` | Default: `308` |

### `RewriteRule`

| Field | Type | Description |
| --- | --- | --- |
| `from` | `string` | Source path pattern |
| `to` | `string` | Destination path (internal rewrite, URL doesn't change) |

### `RouteHeadersRule`

| Field | Type | Description |
| --- | --- | --- |
| `path` | `string` | Path pattern to match |
| `headers` | `Record<string, string>` | Headers to apply |

```typescript
const headers = [
  { path: "/api/*", headers: { "Cache-Control": "no-store" } },
];
```

## Types

### `PageRoute`

The route object returned by `scanRoutes` for each page:

| Field | Type | Description |
| --- | --- | --- |
| `path` | `string` | URL path, e.g. `"/blog/:slug"` |
| `pagePath` | `string` | Filesystem path to `page.ts` |
| `dataPath` | `string?` | Filesystem path to `page.data.ts` |
| `actionPath` | `string?` | Filesystem path to `page.action.ts` |
| `layouts` | `string[]` | Ordered layout.ts paths (root → leaf) |
| `loadingPath` | `string?` | Filesystem path to `loading.ts` |
| `params` | `string[]` | Dynamic parameter names |
| `optionalCatchAll` | `boolean?` | Has `[[...slug]]` segment |
| `slots` | `Record<string, string>?` | Named slot modules (name → path) |

### `ApiRoute`

| Field | Type | Description |
| --- | --- | --- |
| `path` | `string` | URL path, e.g. `"/api/posts"` |
| `routePath` | `string` | Filesystem path to `route.ts` |
| `params` | `string[]` | Dynamic parameter names |

### `ScannedRoutes`

```typescript
interface ScannedRoutes {
  pages: PageRoute[];
  api: ApiRoute[];
  error404?: PageRoute;
  error500?: PageRoute;
}
```

### `RouteRecord`

```typescript
interface RouteRecord {
  path: string;
  component: () => ElurTemplate | ElurComponent;
  name?: string;
  children?: RouteRecord[];
  meta?: Record<string, unknown>;
  beforeEnter?: NavigationGuard;
}
```

### `NavigateOptions`

```typescript
interface NavigateOptions {
  replace?: boolean;  // replace history entry instead of pushing
}
```

### `NavigationGuard`

```typescript
type NavigationGuard = (
  to: string,
  from: string,
) => boolean | string | void | { redirect: string };

// Return false to cancel, a path string to redirect, or nothing to continue
```

### `NavigationGuardResult`

```typescript
type NavigationGuardResult = boolean | string | void | { redirect: string };
```

### `AfterEachHook`

```typescript
type AfterEachHook = (to: string, from: string) => void;
```

### `RouterMode`

```typescript
type RouterMode = "history" | "hash";
```

### `ScrollBehavior`

```typescript
type ScrollBehavior = (
  to: string,
  from: string,
  savedPosition: ScrollPosition | null,
) => ScrollPosition | false;
```

### `RouteLocation`

```typescript
type RouteLocation = string | NamedRouteLocation;

interface NamedRouteLocation {
  name: string;
  params?: Record<string, string>;
}
```

### `Router` interface

```typescript
interface Router {
  readonly current: Signal<string>;
  readonly params: Signal<Record<string, string>>;
  readonly query: Signal<Record<string, string>>;
  readonly base: string;
  readonly intent: Signal<NavigationIntent>;
  readonly canGoBack: Signal<boolean>;
  navigate(location: RouteLocation, options?: NavigateOptions): void;
  replace(location: RouteLocation, options?: NavigateOptions): void;
  back(animation?: unknown): void;
  forward(animation?: unknown): void;
  go(delta: number): void;
  isActive(path: string, exact?: boolean): boolean;
  resolve(path: string): ResolvedRoute;
  readonly routes: RouteRecord[];
  beforeEach(guard: NavigationGuard): () => void;
  afterEach(hook: AfterEachHook): () => void;
}
```
