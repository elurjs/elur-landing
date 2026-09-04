---
title: Data & Backend
description: Data loading, API routes, server actions, middleware, error pages, metadata, and first-class HTTP responses.
section: Elur Kit
order: 3
---

# Data & Backend

Elur Kit provides a complete server-side story: data loaders, API routes,
server actions, middleware, error handling, and metadata — all file-based
and type-safe. This page covers the backend features that live alongside
your routes. For route file conventions and path patterns, see
[Routing](/docs/ecosystem/kit/routing/).

## Data loading

Data loading lives in a separate `page.data.ts` file. This keeps server-only
data fetching code out of the client bundle:

```typescript
// src/app/blog/[slug]/page.data.ts
import type { PageDataLoad } from "@elurjs/kit";

export const load: PageDataLoad = async ({ params, searchParams, request }) => {
  const post = await getPost(params.slug as string);
  return { post };
};
```

The page component receives the data via the `data` prop:

```typescript
// src/app/blog/[slug]/page.ts
import { html } from "@elurjs/core";
import type { PageProps } from "@elurjs/kit";

export default function BlogPost({ data }: PageProps<{ post: Post }>) {
  return html`<article><h1>${data.post.title}</h1>${data.post.body}</article>`;
}
```

### `LoadContext`

The loader receives a `LoadContext` with route information:

| Field | Type | Description |
| --- | --- | --- |
| `params` | `RouteParams` | Route parameters (e.g. `{ slug: "hello-world" }`) |
| `searchParams` | `URLSearchParams` | Query string parameters |
| `request` | `Request?` | The original request (server mode only) |

### Layout data

Layouts can also have data loaders via `layout.data.ts`. Layout data is
available to the layout component via `layoutData` on child pages:

```typescript
// src/app/blog/layout.data.ts
import type { PageDataLoad } from "@elurjs/kit";

export const load: PageDataLoad = async () => {
  const categories = await getCategories();
  return { categories };
};
```

```typescript
// src/app/blog/layout.ts
import { html, ElurComponent } from "@elurjs/core";
import type { LayoutProps } from "@elurjs/kit";

export default class BlogLayout extends ElurComponent {
  override render({ children, data }: LayoutProps<{ categories: string[] }>) {
    return html`
      <nav>${data?.categories.map(c => html`<a href="/blog/${c}">${c}</a>`)}</nav>
      ${children}
    `;
  }
}
```

### `PageProps`

| Field | Type | Description |
| --- | --- | --- |
| `data` | `T` | Loader data (typed from `load` return) |
| `layoutData` | `T?` | Parent layout loader data |
| `params` | `RouteParams` | Route parameters |
| `searchParams` | `URLSearchParams` | Query string |
| `form` | `unknown?` | Last action result (from form submissions) |

### `LayoutProps`

| Field | Type | Description |
| --- | --- | --- |
| `children` | `ElurChildren` | Page content to render |
| `data` | `T?` | Layout loader data |

### Static params

Dynamic routes require `generateStaticParams` for SSG:

```typescript
// src/app/blog/[slug]/page.ts
import type { GenerateStaticParams } from "@elurjs/kit";

export const generateStaticParams: GenerateStaticParams = async () => {
  return [{ slug: "hello-world" }, { slug: "elur-kit" }];
};
```

The framework calls `generateStaticParams` at build time and generates one
HTML file per returned param combination.

## API routes

API routes use `route.ts` instead of `page.ts`. They handle requests
directly and return `Response` objects:

```typescript
// src/app/api/posts/route.ts
export async function GET(request: Request): Promise<Response> {
  const posts = await listPosts();
  return Response.json({ posts });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const post = await createPost(body);
  return Response.json({ created: post }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  await deletePost(id);
  return new Response(null, { status: 204 });
}
```

Supported methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Unmatched
methods return `405 Method Not Allowed`.

### Programmatic route matching

```typescript
import { matchRoute, matchApiRoute } from "@elurjs/kit";

// Match a page route
const pageMatch = matchRoute("/blog/hello-world", routes.pages);
// { route: PageRoute, params: { slug: "hello-world" }, searchParams: URLSearchParams }

// Match an API route
const apiMatch = matchApiRoute("/api/posts/123", routes.api);
// { route: ApiRoute, params: { id: "123" } }
```

Routes are sorted by specificity (static > dynamic > catch-all) before
matching, so `/about` wins over `/:slug` even if the catch-all appears first.

### `MatchResult`

```typescript
interface MatchResult {
  route: PageRoute;
  params: Record<string, string | string[]>;
  searchParams: URLSearchParams;
}
```

### `ApiMatchResult`

```typescript
interface ApiMatchResult<T = ApiRoute> {
  route: T;
  params: Record<string, string | string[]>;
}
```

### Dynamic API routes

```text
src/app/api/posts/[id]/route.ts  → /api/posts/:id
```

```typescript
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return new Response("Not Found", { status: 404 });
  return Response.json(post);
}
```

## Server actions

Server actions are mutations defined in `page.action.ts`. They run on the
server and can be called from the client with progressive enhancement:

```typescript
// src/app/contact/page.action.ts
export async function submitContact(data: { name: string; email: string }) {
  await sendEmail(data);
  return { ok: true };
}
```

```typescript
import { elurJsAction } from "@elurjs/kit/action";

const contact = elurJsAction("submitContact", { page: "/contact" });

html`
  <form @submit=${(e: Event) => { e.preventDefault(); contact.submit({ name: "Ada" }); }}>
    <input name="name" />
    <button disabled=${() => contact.pending.value}>
      ${() => contact.pending.value ? "Sending..." : "Send"}
    </button>
  </form>
`
```

See the [Server Actions](/docs/ecosystem/kit/actions/) page for the full API:
`defineAction`, validators, concurrency modes, `fail()`, `redirect()`,
progressive enhancement, and CSRF security.

## `loading.ts` — streaming boundary

A `loading.ts` file wraps children in a streaming boundary, showing fallback
content while the page's data loads:

```text
src/app/blog/loading.ts  → wraps /blog/* during loading
```

```typescript
// src/app/blog/loading.ts
import { html } from "@elurjs/core";

export default function BlogLoading() {
  return html`<div class="skeleton">Loading…</div>`;
}
```

During SSR, the fallback renders immediately and the real content streams in
when the loader resolves. During SSG, the build waits for all loaders.

## Error pages

- `404.page.ts` — custom not found page
- `500.page.ts` — custom server error page

Error pages render during:

- `elur-kit build` → `dist/404.html`, `dist/500.html`
- `elur-kit start` and Vite plugin → unmatched routes and render errors
- All deployment adapters → unmatched routes and SSR failures

Error pages can export their own `404.page.data.ts` / `500.page.data.ts`
loaders.

## `generateMetadata`

Pages can export `generateMetadata` for dynamic SEO. It receives
`MetadataContext`, which extends `LoadContext` with the resolved loader
`data`:

```typescript
import type { GenerateMetadata, PageMetadata } from "@elurjs/kit";

export const generateMetadata: GenerateMetadata = async ({ params, data }) => {
  return {
    title: data?.title ?? "Blog",
    description: "A blog post",
    canonical: `https://example.com/blog/${params.slug}`,
    openGraph: { type: "article", image: "/og/blog.jpg" },
    twitter: { card: "summary_large_image" },
  };
};
```

### `PageMetadata`

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string?` | Page title |
| `description` | `string?` | Meta description |
| `canonical` | `string?` | Canonical URL |
| `robots` | `string?` | Robots meta (e.g. `"index, follow"` or `"noindex"`) |
| `openGraph` | `OpenGraphMetadata?` | Open Graph tags |
| `twitter` | `TwitterMetadata?` | Twitter Card tags |
| `other` | `Record<string, string>?` | Additional `<meta>` tags as key/value pairs |

### `OpenGraphMetadata`

| Field | Type |
| --- | --- |
| `type` | `string?` |
| `title` | `string?` |
| `description` | `string?` |
| `url` | `string?` |
| `image` | `string?` |
| `imageAlt` | `string?` |
| `imageWidth` | `number?` |
| `imageHeight` | `number?` |
| `imageType` | `string?` |
| `siteName` | `string?` |
| `locale` | `string?` |

### `TwitterMetadata`

| Field | Type | Description |
| --- | --- | --- |
| `card` | `"summary" \| "summary_large_image" \| "player" \| "app"?` | Card type |
| `title` | `string?` | Title (falls back to page title) |
| `description` | `string?` | Description (falls back to page description) |
| `image` | `string?` | Image URL |
| `imageAlt` | `string?` | Image alt text (`twitter:image:alt`) |

Tags are marked with `data-elur-head` so the SPA router swaps them on
navigation. See also [Image & SEO](/docs/ecosystem/kit/image-seo/) for
`generateSitemap`, `generateRobots`, and `jsonLd`.

## `throw new Response()` — first-class HTTP control flow

Loaders and layout loaders can throw `Response` objects for redirects, 404s,
or any HTTP status. The framework catches these and returns them directly
instead of rendering a 500:

```typescript
export const load = async ({ params }) => {
  const post = await getEntry("blog", params.slug);
  if (!post) throw new Response("Not Found", { status: 404 });
  return { post };
};
```

```typescript
// Redirect from a loader
export const load = async ({ params }) => {
  const post = await getEntry("blog", params.slug);
  if (post && post.data.oldSlug) {
    throw new Response(null, {
      status: 301,
      headers: { Location: `/blog/${post.data.newSlug}` },
    });
  }
  return { post };
};
```

Use `isFirstClassResponse(error)` to detect these in error boundaries:

```typescript
import { isFirstClassResponse } from "@elurjs/kit";

try {
  // ...
} catch (error) {
  if (isFirstClassResponse(error)) throw error; // re-throw as control flow
  // handle real errors
}
```

## Middleware

Middleware runs before route matching and rendering. Define it at the root:

```text
src/middleware.ts   or   middleware.ts
```

```typescript
import type { MiddlewareContext } from "@elurjs/kit";

export async function middleware({ request, next, locals }: MiddlewareContext) {
  // Add per-request data
  locals.user = await getUser(request);

  // Continue to the route handler
  const result = await next();

  // Add response headers
  result.headers?.set("X-Frame-Options", "DENY");
  return result;
}
```

See the [Middleware & Cache](/docs/ecosystem/kit/middleware-cache/) page for
the full API: `MiddlewareContext`, `next()`, tagged invalidation, cache
adapters, and `streamBoundary`.

## Cache control

Route modules can export a `cache` object to control ISR behavior:

```typescript
// src/app/blog/[slug]/page.ts
export const cache = {
  mode: "public",       // "public" | "private" | "dynamic"
  revalidate: 60,       // seconds
  tags: ["posts"],      // for tag-based invalidation
};
```

| Mode | Behavior |
| --- | --- |
| `"public"` | Cached globally; served from cache until revalidate |
| `"private"` | Cached per-user (Cookie/Authorization present) |
| `"dynamic"` | Always rendered fresh (default, `revalidate: 0`) |

Public cache is automatically disabled for requests with `Cookie` or
`Authorization` headers. See
[Middleware & Cache](/docs/ecosystem/kit/middleware-cache/) for cache
adapters (filesystem, Redis, Cloudflare KV) and invalidation.

## Server-side data access patterns

### Reading request headers

```typescript
export const load: PageDataLoad = async ({ request }) => {
  const auth = request?.headers.get("Authorization");
  const user = await verifyToken(auth);
  return { user };
};
```

### Cookies

```typescript
export const load: PageDataLoad = async ({ request }) => {
  const cookies = request?.headers.get("Cookie");
  // Parse cookies manually or use a cookie library
  return { theme: parseTheme(cookies) };
};
```

### Streaming data with `streamBoundary`

For slow data sources, stream partial HTML while loading:

```typescript
import { streamBoundary } from "@elurjs/kit";
import { html } from "@elurjs/core";

export default function Page({ data }: PageProps<{ comments: Promise<Comment[]> }>) {
  return html`
    <h1>Post</h1>
    ${streamBoundary({
      fallback: html`<p>Loading comments…</p>`,
      promise: data.comments,
      children: (comments) => html`
        <ul>${comments.map(c => html`<li>${c.text}</li>`)}</ul>
      `,
    })}
  `;
}
```

## Summary of file conventions

| File | Purpose |
| --- | --- |
| `page.ts` | Page component (default export) |
| `page.data.ts` | Data loader (server-only) |
| `page.action.ts` | Server actions |
| `layout.ts` | Layout component wrapping children |
| `layout.data.ts` | Layout data loader |
| `loading.ts` | Streaming fallback during load |
| `route.ts` | API endpoint (GET, POST, etc.) |
| `404.page.ts` | Custom not found page |
| `500.page.ts` | Custom server error page |
| `middleware.ts` | Root middleware |
| `*.slot.ts` | Named layout slot |
