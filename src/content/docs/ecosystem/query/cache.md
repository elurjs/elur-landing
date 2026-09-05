---
title: Cache & Invalidation
description: Cache helpers — getQueryData, setQueryData, updateQueryData, invalidateQueries, clearQueryCache, setQueryCacheTime.
section: Elur Query
order: 4
---

# Cache & Invalidation

Elur Query maintains a global in-memory cache shared by all `createQuery`
instances. You can read, write, and invalidate cache entries imperatively
without creating a query.

## Cache helpers

```typescript
import {
  getQueryData, setQueryData, updateQueryData,
  invalidateQueries, clearQueryCache, setQueryCacheTime,
} from "@elurjs/query";
```

### `getQueryData<T>(key, options?)`

Reads cached data without creating a query:

```typescript
const users = getQueryData<User[]>("users/list");
const user = getQueryData<User>("users", { params: { id: "abc" } });
```

### `setQueryData<T>(key, data, options?)`

Writes data directly into cache and updates active query signals:

```typescript
setQueryData("users/list", [...users, { id: 3, name: "Mia" }]);
setQueryData("users", userData, { params: { id: "abc" } });
```

### `updateQueryData<T>(key, updater, options?)`

Atomic cache update from previous value:

```typescript
updateQueryData("users/list", (current = []) =>
  current.map((u) => u.id === 3 ? { ...u, name: "Mia V2" } : u)
);
```

### `invalidateQueries(key)`

Forces all active `createQuery` instances with the given key to refetch.
Clears cached data and in-flight requests so subscribers start a fresh
fetch instead of sharing a stale promise that was started before the
invalidation.

When queries use `params`, invalidating the base key also invalidates every
param variant:

```typescript
invalidateQueries("posts");
// Clears: "posts", "posts::{"page":1}", "posts::{"page":2}", etc.
```

### `clearQueryCache(key?)`

Clears cache entries and in-flight requests. Without argument, clears
everything and stops the GC timer:

```typescript
clearQueryCache();           // clear all + stop GC
clearQueryCache("posts");    // clear "posts" and all param variants
```

### `setQueryCacheTime(ms)`

Sets how long cache entries with zero subscribers are kept alive (default:
5 minutes):

```typescript
setQueryCacheTime(10 * 60 * 1000); // 10 minutes
setQueryCacheTime(Infinity);       // keep forever
```

## `QueryCacheOptions`

Used by `getQueryData`, `setQueryData`, `updateQueryData`:

| Field | Type | Description |
| --- | --- | --- |
| `params` | `unknown` | Params value to build effective key |
| `serializeParams` | `(params: unknown) => string` | Custom serializer (must match query's) |

## `clearQueryCache` vs `invalidateQueries`

These two helpers look similar but behave differently:

| Behavior | `invalidateQueries(key)` | `clearQueryCache(key)` |
| --- | --- | --- |
| Clears cache entries | Yes | Yes |
| Clears in-flight requests | Yes | Yes |
| Triggers refetch on active queries | **Yes** | **No** |
| Notifies active queries | Yes (via sync + run) | Yes (via sync only) |

`invalidateQueries` is the right choice after a mutation — it clears the
cache and forces active queries to refetch immediately.

`clearQueryCache` is for teardown or testing — it clears the cache and
notifies active queries that their data is gone (status → pending, data →
undefined/placeholder), but does **not** trigger a refetch. Active queries
will only refetch on next mount or explicit `refetch()`.

## Invalidation flow

```typescript
const createPost = createCommand(
  "posts/create",
  async (data) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  },
  {
    invalidate: ["posts/list", "feed", "stats"],
    onSuccess: (data) => {
      console.log("Created post:", data.id);
    },
  }
);

// After createPost succeeds, all active queries with keys
// "posts/list", "feed", and "stats" are refetched automatically.
```

## GC behavior

Cache entries with zero subscribers are garbage-collected after
`setQueryCacheTime` ms (default 5 minutes). The GC timer runs every 60
seconds and stops when the cache is empty.

This means:

- If a component unmounts and remounts within the GC window, cached data is
  still available.
- If no component uses a query key for longer than the cache time, the entry
  is evicted.
- Setting `setQueryCacheTime(Infinity)` disables GC entirely.
