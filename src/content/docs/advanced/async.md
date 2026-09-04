---
title: Async
description: Handling asynchronous operations — suspend, lazy loading, data fetching with signals, and Elur Query.
section: Advanced
order: 1
---

# Async

Elur provides two first-class primitives for async work in the core package:
`suspend()` for declarative data fetching with loading/error states, and
`lazy()` for code-splitting components. For anything more involved, signals
compose naturally with promises, and `@elurjs/query` adds caching and
deduplication on top.

## `suspend()` — declarative async rendering

`suspend()` runs an async function and renders based on its state: a fallback
while pending, an error template on failure, or your render function with the
resolved data. It returns an `ElurComponent`, so you can drop it straight into a
template.

```typescript
import { html, suspend } from "@elurjs/core";

const userProfile = suspend(
  () => fetch("/api/user").then((r) => r.json()),
  (user) => html`<h1>Hello, ${user.name}</h1>`,
  { fallback: html`<p>Loading…</p>` }
);

html`<div>${userProfile}</div>`.mount("#app");
```

### Options

| Option | Type | Description |
| --- | --- | --- |
| `fallback` | `ElurTemplate` | Shown while the promise is pending. A default spinner is used if omitted. |
| `errorFallback` | `(err) => ElurTemplate` | Shown when the promise rejects. A default error template is used if omitted. |
| `invalidate` | `Signal<unknown>` | Increment this signal to re-run the fetch. |
| `cacheKey` | `string` | Cache the result under this key so multiple suspenders share one fetch. |
| `staleTime` | `number` | Milliseconds before a cached entry is considered stale and re-fetched. |
| `resetOnRefresh` | `boolean` | Show the fallback again on each refresh (default `false`). |

### Refreshing data

Pass a signal to `invalidate` and update it to trigger a re-fetch:

```typescript
import { html, signal, suspend } from "@elurjs/core";

const refresh = signal(0);

const posts = suspend(
  () => fetch("/api/posts").then((r) => r.json()),
  (data) => html`<ul>${data.map((p: any) => html`<li>${p.title}</li>`)}</ul>`,
  { fallback: html`<p>Loading…</p>`, invalidate: refresh }
);

html`
  <div>
    <button @click=${() => refresh.update((n) => n + 1)}>Refresh</button>
    ${posts}
  </div>
`.mount("#app");
```

### Sharing a fetch with `cacheKey`

When two components suspend the same resource, a `cacheKey` avoids duplicate
requests. The first suspender fetches; the second reads from cache:

```typescript
const user = suspend(
  () => fetch("/api/user/1").then((r) => r.json()),
  (u) => html`<span>${u.name}</span>`,
  { cacheKey: "user:1", staleTime: 60_000 }
);
```

### Error handling

Provide an `errorFallback` to customize how errors appear:

```typescript
const risky = suspend(
  () => fetch("/api/flaky").then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }),
  (data) => html`<pre>${JSON.stringify(data, null, 2)}</pre>`,
  {
    fallback: html`<p>Loading…</p>`,
    errorFallback: (err) => html`<p style="color:red">⚠ ${err instanceof Error ? err.message : String(err)}</p>`,
  }
);
```

## `lazy()` — code-splitting components

`lazy()` wraps a dynamic `import()` and returns a component factory. The module
is loaded once and cached. While loading, the fallback template is shown:

```typescript
import { html, lazy } from "@elurjs/core";

const AdminPanel = lazy(
  () => import("./AdminPanel"),
  html`<p>Loading admin…</p>`
);

// Use it like any component:
html`<main>${AdminPanel()}</main>`.mount("#app");
```

The second argument accepts either an `ElurTemplate` (used as fallback) or a
`LazyOptions` object. By default `lazy` uses the module's `default` export. If
your component is a named export, pass a `selector`:

```typescript
const Settings = lazy(
  () => import("./Settings"),
  { selector: (mod) => mod.Settings, fallback: html`<p>Loading…</p>` }
);
```

`lazy()` is ideal for route components — pair it with the router to load pages
on demand.

## Manual data fetching with signals

For simple one-off fetches where `suspend` is overkill, store loading state,
data, and errors in signals and update them from an async function:

```typescript
import { signal, html } from "@elurjs/core";

const data = signal<string | null>(null);
const loading = signal(false);
const error = signal<string | null>(null);

async function fetchGreeting() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch("/api/greeting");
    data.value = await res.text();
  } catch (err) {
    error.value = String(err);
  } finally {
    loading.value = false;
  }
}

html`
  <div>
    <button @click=${fetchGreeting}>Fetch</button>
    ${() => loading.value ? html`<p>Loading…</p>` : null}
    ${() => error.value ? html`<p style="color:red">${() => error.value}</p>` : null}
    ${() => data.value ? html`<p>${() => data.value}</p>` : null}
  </div>
`.mount("#app");
```

## Async in effects

Effects can kick off async work, but guard against race conditions by tracking
a cancellation flag in the cleanup function:

```typescript
import { signal, effect } from "@elurjs/core";

const selectedId = signal(0);
const item = signal(null);

effect(() => {
  const id = selectedId.value;
  if (!id) return;

  let cancelled = false;
  fetch(`/api/items/${id}`)
    .then((r) => r.json())
    .then((data) => {
      if (!cancelled) item.value = data;
    });

  return () => { cancelled = true; };
});
```

The cleanup function sets `cancelled = true`, so if the effect re-runs (because
`selectedId` changed) before the previous fetch completes, the stale result is
discarded.

## Using Elur Query

For production apps, `@elurjs/query` provides caching, deduplication,
stale-while-revalidate, and reactive params on top of signals:

```typescript
import { html, ElurComponent } from "@elurjs/core";
import { createQuery } from "@elurjs/query";

class PostsPage extends ElurComponent {
  private q = createQuery(
    "posts",
    () => fetch("/api/posts").then((r) => r.json()),
    { staleTime: 60_000 }
  );

  override render() {
    return html`
      ${() => this.q.status.value === "pending" && html`<p>Loading…</p>`}
      ${() => this.q.status.value === "error" && html`<p>Error</p>`}
      ${() => this.q.status.value === "success"
        && html`<ul>${() => this.q.data.value.map((p: any) => html`<li>${p.title}</li>`)}</ul>`}
    `;
  }
}
```

`createQuery` returns a `QueryResult` with reactive `status`, `data`, and
`error` signals. Pass a `params` function that reads signals to auto-refetch
when inputs change:

```typescript
import { signal } from "@elurjs/core";
import { createQuery } from "@elurjs/query";

const search = signal("");
const posts = createQuery(
  "posts",
  ({ q }) => fetch(`/api/posts?q=${encodeURIComponent(q)}`).then((r) => r.json()),
  { params: () => ({ q: search.value }), keepPreviousData: true }
);

search.value = "elur"; // triggers automatic refetch under a new cache key
```

:::tip
For anything beyond simple one-off fetches, use `@elurjs/query`. It handles
caching, deduplication, retries, and stale-while-revalidate patterns out of
the box. See the [Query docs](/docs/ecosystem/query/) for the full API.
:::
