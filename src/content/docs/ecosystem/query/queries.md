---
title: Queries
description: createQuery — options, reactive params, keepPreviousData, placeholderData, single-flight deduplication.
section: Elur Query
order: 2
---

# Queries

`createQuery` is the read side of Elur Query. It fetches data, caches it,
and exposes reactive signals for status, data, and error.

## `createQuery<T, P>(key, asyncFn, options?)`

```typescript
import { createQuery } from "@elurjs/query";

const q = createQuery(
  "posts/list",
  () => fetch("/api/posts").then((r) => r.json()),
  { staleTime: 30_000 }
);

// Signals
q.status.value; // "pending" | "success" | "error"
q.data.value;   // T | undefined
q.error.value;  // unknown

// Methods
q.refetch();    // force refetch
q.dispose();    // clean up
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | Unique cache key (use bounded context: `"posts/list"`) |
| `asyncFn` | `(params: P) => Promise<T>` | Fetcher function |
| `options` | `QueryOptions<P, T>` | Configuration |

## `QueryResult<T>`

| Member | Type | Description |
| --- | --- | --- |
| `key` | `string` | Effective cache key (includes serialized params) |
| `status` | `Signal<"pending" \| "success" \| "error">` | Current status |
| `data` | `Signal<T \| undefined>` | Cached data |
| `error` | `Signal<unknown>` | Last error |
| `refetch()` | `() => void` | Force refetch — clears cache + in-flight, bypasses single-flight |
| `dispose()` | `() => void` | Remove from registries, stop param tracking |

`dispose()` is idempotent. Call it on component unmount:

```typescript
class PostsPage extends ElurComponent {
  private q = createQuery("posts", fetchPosts);

  override onUnmount() {
    this.q.dispose();
  }
}
```

After `dispose()`, in-flight requests are **ignored** (not cancelled) —
their results are discarded when they resolve. The query stops reacting
to `invalidateQueries`, param signal changes, and `setQueryData` sync
notifications.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `staleTime` | `number` | `0` | Ms while cached data is considered fresh |
| `refetchOnMount` | `"always" \| "stale" \| false` | `"always"` | When to refetch on mount |
| `params` | `() => P` | — | Reactive params source; reads signals to auto-refetch |
| `serializeParams` | `(params: unknown) => string` | built-in | Custom serializer for params to cache key |
| `keepPreviousData` | `boolean` | `false` | Keep old data visible during refetch |
| `placeholderData` | `T \| ((prev: T \| undefined) => T \| undefined)` | — | Fallback data while pending |

### `staleTime` + `refetchOnMount` interaction

| `refetchOnMount` | Cache fresh (`staleTime > 0`) | Cache stale | No cache |
| --- | --- | --- | --- |
| `"always"` | No refetch | Refetch | Fetch |
| `"stale"` | No refetch | Refetch | Fetch |
| `false` | No refetch | No refetch | Fetch |

With `staleTime: 0` (default), data is never considered fresh, so both
`"always"` and `"stale"` refetch on every mount. Use `staleTime > 0` with
`"stale"` to skip refetches while data is fresh.

## Reactive params

Pass `params` to derive the cache key from signals. The query tracks all
signals read inside the function and refetches automatically when they change:

```typescript
import { signal } from "@elurjs/core";
import { createQuery } from "@elurjs/query";

const search = signal("");
const page = signal(1);

const posts = createQuery(
  "posts",
  ({ q, page }) => fetch(`/api/posts?q=${q}&page=${page}`).then((r) => r.json()),
  {
    params: () => ({ q: search.value, page: page.value }),
    staleTime: 30_000,
  }
);

search.value = "elur"; // → refetch with key "posts::{"q":"elur","page":1}"
page.value = 2;        // → refetch with key "posts::{"q":"elur","page":2}"
```

### Effective cache key

The effective key is `"<baseKey>::<serializedParams>"`. The built-in serializer:

- Sorts object keys so `{ a, b }` and `{ b, a }` produce the same key
- Serializes `Date` via `.toISOString()` (timezone-safe)
- Serializes `Map` and `Set` with sorted entries
- Throws `TypeError` on circular references

### Custom serializer

```typescript
const q = createQuery(
  "users",
  ({ id }) => fetch(`/api/users/${id}`).then((r) => r.json()),
  {
    params: () => ({ id: "abc" }),
    serializeParams: (p) => JSON.stringify(p),
  }
);

// Use the same serializer for imperative cache access:
setQueryData("users", data, { params: { id: "abc" }, serializeParams: JSON.stringify });
getQueryData("users", { params: { id: "abc" }, serializeParams: JSON.stringify });
```

### Race condition safety

In-flight responses for stale params are ignored. If `page` changes from 1
to 2 while the page=1 request is still pending, the page=1 response is
discarded.

## `keepPreviousData` and `placeholderData`

### `keepPreviousData: true`

Old data stays visible while a new fetch is in progress. Eliminates UI
flicker during param changes:

```typescript
const q = createQuery(
  "posts",
  ({ page }) => fetch(`/api/posts?page=${page}`).then((r) => r.json()),
  {
    params: () => ({ page: page.value }),
    keepPreviousData: true,
  }
);
```

### `placeholderData`

Shows fallback data while no cached data exists:

```typescript
// Static placeholder
const q = createQuery("posts", fetchPosts, { placeholderData: [] });

// Function placeholder (receives previous data)
const q = createQuery(
  "posts",
  ({ page }) => fetch(`/api/posts?page=${page}`).then((r) => r.json()),
  {
    params: () => ({ page: page.value }),
    placeholderData: (prev) => prev ? [...prev] : [],
  }
);
```

When both are set, `keepPreviousData` takes priority if previous data exists;
otherwise `placeholderData` applies.

## Single-flight deduplication

When two or more components mount the same query key simultaneously with an
empty cache, only one fetch is fired. All subscribers share the same in-flight
promise:

```typescript
const q1 = createQuery("users", () => fetch("/api/users").then((r) => r.json()));
const q2 = createQuery("users", () => fetch("/api/users").then((r) => r.json()));
// → only 1 fetch, both q1.data and q2.data resolve together
```

`refetch()` bypasses single-flight — it deletes the in-flight entry and
starts a new fetch immediately, even if a request for the same key is
already in progress.

## Query keys

Keys are **strings**, not arrays. Use bounded-context naming to avoid
collisions:

```typescript
createQuery("posts/list", ...);      // ✅ descriptive
createQuery("posts/detail:42", ...); // ✅ includes id
createQuery("data", ...);            // ❌ too generic
```

When using `params`, the effective key is `"baseKey::{serializedParams}"`:

```typescript
createQuery("posts", fn, { params: () => ({ page: 1 }) });
// effective key: "posts::{"page":1}"
```

`invalidateQueries("posts")` clears all param variants (`"posts::{"page":1}"`,
`"posts::{"page":2}"`, etc.).

## GC behavior

Cache entries with zero subscribers are garbage-collected after
`setQueryCacheTime` ms (default 5 minutes). The GC timer runs every 60
seconds and stops when the cache is empty.
