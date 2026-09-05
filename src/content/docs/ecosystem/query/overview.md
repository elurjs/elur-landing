---
title: Query Overview
description: CQRS-style data fetching with @elurjs/query — createQuery, createCommand, caching, and offline support.
section: Elur Query
order: 1
---

# Query Overview

`@elurjs/query` is a CQRS-style data library for Elur. It splits reads
(`createQuery`) from writes (`createCommand`) and builds on `@elurjs/core`
signals. Features include a global cache, single-flight deduplication,
stale-while-revalidate, reactive params, retry policies, optimistic rollback
via `onMutate`/`onError` hooks, an offline queue, and a DevTools plugin.

## Installation

```bash
npm install @elurjs/core @elurjs/query
```

## Quick start

```typescript
import { html, ElurComponent } from "@elurjs/core";
import { createQuery } from "@elurjs/query";

class UserPage extends ElurComponent {
  private q = createQuery(
    "user/1",
    () => fetch("/api/users/1").then((r) => r.json())
  );

  override render() {
    return html`
      ${() => this.q.status.value === "pending" && html`<p>Loading…</p>`}
      ${() => this.q.status.value === "error" && html`<p>Error</p>`}
      ${() => this.q.status.value === "success"
        && html`<p>${() => this.q.data.value?.name}</p>`}
    `;
  }
}
```

## CQRS architecture

Elur Query separates reads from writes:

| Concern | API | Key convention |
| --- | --- | --- |
| Read (query) | `createQuery` | `"context/resource"` — `"posts/list"`, `"profile/current"` |
| Write (command) | `createCommand` | `"context/action"` — `"posts/create"`, `"profile/save"` |

This separation means:

- **Queries** are cached, deduplicated, and can be invalidated.
- **Commands** have retry, concurrency control, and optimistic rollback hooks.
- **Commands invalidate queries** on success to refresh cached data.

## Key concepts

- **Global cache** — all queries share a single in-memory cache keyed by string
- **Single-flight** — multiple components mounting the same key share one fetch
- **Stale-while-revalidate** — `staleTime` controls when data is considered fresh
- **Reactive params** — pass a function reading signals; the query auto-refetches
- **Invalidation** — commands can auto-invalidate query keys on success
- **Optimistic rollback** — `onMutate` applies changes upfront; `onError` reverts
- **Offline queue** — `queueOffline` mode persists commands for replay on reconnect
- **DevTools** — inspect cache, in-flight requests, and command queues in dev

## Next steps

- [Queries](/docs/ecosystem/query/queries/) — `createQuery` options, params, caching
- [Commands](/docs/ecosystem/query/commands/) — `createCommand`, concurrency, retry, offline
- [Cache & Invalidation](/docs/ecosystem/query/cache/) — cache helpers, GC, invalidation
- [Patterns](/docs/ecosystem/query/patterns/) — optimistic rollback, pagination, polling, testing
- [DevTools](/docs/ecosystem/query/devtools/) — inspect cache and commands during development
