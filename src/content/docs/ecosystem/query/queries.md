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

### Batched param updates

When multiple param signals change together, wrap them in `batch()` from
`@elurjs/core` to avoid intermediate refetches. The effect tracks all
signal reads and only fires once after the batch completes:

```typescript
import { signal, batch } from "@elurjs/core";

const a = signal(1);
const b = signal(2);

const q = createQuery(
  "calc",
  ({ sum }) => fetch(`/api?sum=${sum}`).then((r) => r.json()),
  { params: () => ({ sum: a.value + b.value }) }
);

// Without batch: two refetches (a=3 triggers one, b=1 triggers another)
// With batch: one refetch with the final combined params
batch(() => {
  a.value = 3;
  b.value = 1;
});
// → single refetch with { sum: 4 }
```

### `staleTime: Infinity`

Pass `staleTime: Infinity` to mark cached data as permanently fresh. This
is useful for data that never changes or for implementing "fetch once,
cache forever" patterns:

```typescript
const q = createQuery("config", fetchConfig, {
  staleTime: Infinity,
  refetchOnMount: "stale", // never refetch on mount since data is always "fresh"
});
```

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

### `refetch()` and data visibility

`refetch()` deletes the cache entry and in-flight promise, then starts a
new fetch. The data signal is **not cleared immediately** — old data
stays visible until the new fetch resolves:

- **From `success`**: data remains visible during the refetch (flicker-free
  by default, no need for `keepPreviousData`).
- **From `error`**: the error remains visible during the refetch until the
  new fetch resolves.
- **From `pending`**: data is cleared (or placeholder/`keepPreviousData`
  applies) since the query is already in a pending state.

### Fetch errors do not clear `data`

When a fetch fails, only `error` and `status` are updated. The `data`
signal retains its previous value:

```typescript
const q = createQuery("users", fetchUsers);
// ... fetch succeeds, q.data.value = [user1, user2]

q.refetch(); // network fails
// q.status.value === "error"
// q.error.value === Error(...)
// q.data.value === [user1, user2]  ← still there
```

This lets you show stale data alongside an error indicator, which is
useful for transient network failures.

### Synchronous cache hits

When a query mounts and cache exists for its key, `status` is set to
`"success"` and `data` is set to the cached value **synchronously** —
there is no `"pending"` state. The freshness check then decides whether
to trigger a background refetch:

```typescript
setQueryData("users", userData); // populate cache
const q = createQuery("users", fetchUsers, { refetchOnMount: false });
// q.status.value === "success" immediately (synchronous)
// q.data.value === userData
```

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

The cache is **global**, not per-instance. Multiple `createQuery` calls
with the same key share the same cache entry. When one query writes data,
all other active queries with the same key receive it via sync notification.

If you forget to call `dispose()`, the query's registry entries are
cleaned up automatically via `FinalizationRegistry` when the query object
is garbage-collected. However, relying on GC is not recommended — the
timing is unpredictable and param signal tracking (via `effect`) will
continue until GC runs. Always call `dispose()` explicitly.
