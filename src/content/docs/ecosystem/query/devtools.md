---
title: DevTools
description: "@elurjs/query/devtools — inspect query cache, in-flight requests, and command queues during development."
section: Elur Query
order: 6
---

# DevTools

`@elurjs/query` ships a dev-only DevTools plugin (`@elurjs/query/devtools`)
that integrates with the Elur DevTools backend hook
(`window.__ELUR_DEVTOOLS_HOOK__`). It exposes a JSON-safe snapshot of the
query cache, in-flight requests, and command queues so you can inspect
data freshness, subscriber counts, and queued commands from the browser
DevTools panel.

## How it loads

The DevTools module is **never bundled into production**. It is a separate
subpath (`@elurjs/query/devtools`) that `@elurjs/vite-plugin-elur` injects
automatically in dev mode when `devtools: "auto"` (the default). No manual
import is needed.

If you are not using the Vite plugin, you can import it manually in your
dev entry point:

```typescript
// dev-only — guard with an env check if importing manually
import "@elurjs/query/devtools";
```

## What it exposes

The plugin registers with `id: "@elurjs/query"` and `label: "Query"`. The
DevTools panel calls `getSnapshot()` to read state and `onCommand()` to
trigger actions.

### Snapshot shape

```typescript
interface QueryDevtoolsSnapshot {
  cacheTime: number;
  activeQueryCount: number;
  inflight: string[];
  cache: QueryCacheEntrySnapshot[];
  commands: CommandSnapshot[];
}
```

| Field | Type | Description |
| --- | --- | --- |
| `cacheTime` | `number` | Current GC interval (ms) |
| `activeQueryCount` | `number` | Active query keys in the registry |
| `inflight` | `string[]` | In-flight request keys |
| `cache` | `QueryCacheEntrySnapshot[]` | One entry per cached key |
| `commands` | `CommandSnapshot[]` | One entry per known command key |

### `QueryCacheEntrySnapshot`

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Effective cache key (includes serialized params) |
| `fetchedAt` | `number` | Timestamp of last successful fetch |
| `ageMs` | `number` | Milliseconds since `fetchedAt` |
| `subscribers` | `number` | Active subscriber count |
| `dataPreview` | `string` | Truncated JSON preview (max 200 chars) |
| `data` | `unknown` | JSON-safe, depth-limited (8 levels) representation |

### `CommandSnapshot`

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Command key |
| `hasQueue` | `boolean` | Has a queued promise chain |
| `hasInflightLatest` | `boolean` | Has an active `latest`-mode controller |
| `replayLocked` | `boolean` | Replay is currently running |

## DevTools commands

The panel can send commands back to the plugin:

| Command | Effect |
| --- | --- |
| `{ type: "refetch", key }` | Invalidate the key and wait for in-flight to settle |
| `{ type: "invalidate", key }` | Same as refetch — clears cache + triggers refetch |
| `{ type: "clear", key }` | Clear one key and all its param variants |
| `{ type: "clear-all" }` | Clear the entire query cache |

These map to the public `invalidateQueries` and `clearQueryCache` helpers.

## Safety

- Data is serialized through a depth-limited (8 levels), circular-safe
  inspector before being sent to the panel.
- Arrays and objects are truncated to 50 entries/keys to avoid oversized
  payloads.
- Unserializable values are replaced with `"[unserializable]"` or
  `"[Circular]"` markers.
- The plugin has no hot-path impact and adds zero overhead in production
  because it is never loaded.

## Manual API

If you need to build a custom inspector or test harness, the snapshot and
command handlers are also exported directly:

```typescript
import {
  getQueryDevtoolsSnapshot,
  handleQueryDevtoolsCommand,
  type QueryDevtoolsSnapshot,
  type QueryDevtoolsCommand,
} from "@elurjs/query/devtools";

const snapshot: QueryDevtoolsSnapshot = getQueryDevtoolsSnapshot();
console.log(snapshot.cache.length, "cached entries");
console.log(snapshot.inflight, "in-flight requests");

// Trigger an invalidation from code
await handleQueryDevtoolsCommand({ type: "invalidate", key: "posts/list" });
```

These exports are dev-only and should not be used in production code.
