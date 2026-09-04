---
title: Patterns
description: Optimistic updates, pagination, infinite scroll, dependent queries, polling, and testing with Elur Query.
section: Elur Query
order: 5
---

# Patterns

Common patterns for using Elur Query in real applications.

## ElurComponent integration

### Query in a component

```typescript
import { html, ElurComponent } from "@elurjs/core";
import { createQuery } from "@elurjs/query";

class PostsPage extends ElurComponent {
  private q = createQuery("posts/list", () => fetch("/api/posts").then((r) => r.json()));

  override render() {
    return html`
      <h1>Posts</h1>
      ${() => this.q.status.value === "pending" && html`<p>Loading...</p>`}
      ${() => this.q.status.value === "error" && html`<p>Error: ${() => String(this.q.error.value)}</p>`}
      ${() => this.q.status.value === "success" && html`
        <ul>
          ${() => this.q.data.value?.map((p) => html`<li>${p.title}</li>`)}
        </ul>
      `}
    `;
  }

  override onUnmount() {
    this.q.dispose();
  }
}
```

### Command in a component

```typescript
class EditProfilePage extends ElurComponent {
  private save = createCommand(
    "profile/save",
    async (data: { name: string }) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    { invalidate: ["profile/current"] }
  );

  override render() {
    return html`
      <form @submit=${(e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        this.save.execute({ name: formData.get("name") as string });
      }}>
        <input name="name" />
        <button type="submit" disabled=${() => this.save.isPending.value}>
          ${() => this.save.isPending.value ? "Saving..." : "Save"}
        </button>
      </form>
      ${() => this.save.isError.value && html`<p>Error: ${() => String(this.save.error.value)}</p>`}
      ${() => this.save.isSuccess.value && html`<p>Saved!</p>`}
    `;
  }

  override onUnmount() {
    this.save.dispose();
  }
}
```

## Optimistic update with rollback

Use `onMutate` to apply optimistic changes and `onError` to roll back:

```typescript
import { createCommand, getQueryData, setQueryData } from "@elurjs/query";

type Todo = { id: number; title: string; done: boolean };

const toggleTodo = createCommand(
  "todos/toggle",
  async (id: number) => {
    const res = await fetch(`/api/todos/${id}/toggle`, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  },
  {
    onMutate: (id) => {
      const previous = getQueryData<Todo[]>("todos/list") ?? [];
      setQueryData("todos/list", previous.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ));
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      setQueryData("todos/list", ctx?.previous ?? []);
    },
    invalidate: ["todos/list"],
  }
);
```

`onMutate` return value becomes the `context` argument of `onSuccess`,
`onError`, and `onSettled`.

## Pagination

### Basic pagination with `params`

```typescript
import { signal } from "@elurjs/core";
import { createQuery } from "@elurjs/query";

const page = signal(1);

const posts = createQuery(
  "posts/list",
  ({ page }) => fetch(`/api/posts?page=${page}`).then((r) => r.json()),
  {
    params: () => ({ page: page.value }),
    keepPreviousData: true,
    staleTime: 60_000,
  }
);

// In template:
// ${() => posts.data.value?.map((p) => html`<li>${p.title}</li>`)}
// <button @click=${() => page.value++}>Next</button>
```

### Search + pagination combined

```typescript
const search = signal("");
const page = signal(1);

const results = createQuery(
  "posts/search",
  ({ q, page }) => fetch(`/api/posts?q=${q}&page=${page}`).then((r) => r.json()),
  {
    params: () => ({ q: search.value, page: page.value }),
    keepPreviousData: true,
    placeholderData: (prev) => prev ?? [],
  }
);

// Reset to page 1 when search changes
// (handled automatically — new params = new cache key)
```

## Infinite scroll pattern

```typescript
import { signal } from "@elurjs/core";
import { createQuery, getQueryData, setQueryData } from "@elurjs/query";

const pages = signal<any[][]>([]);

const infinite = createQuery(
  "posts/infinite",
  async ({ page }) => {
    const res = await fetch(`/api/posts?page=${page}`).then((r) => r.json());
    const current = getQueryData<any[]>("posts/infinite:all") ?? [];
    setQueryData("posts/infinite:all", [...current, ...res.items]);
    return res;
  },
  {
    params: () => ({ page: page.value }),
    keepPreviousData: true,
  }
);
```

## Dependent queries

Query B depends on query A's data:

```typescript
const userQuery = createQuery("user/current", () => fetch("/api/me").then((r) => r.json()));

const ordersQuery = createQuery(
  "orders/list",
  ({ userId }) => fetch(`/api/users/${userId}/orders`).then((r) => r.json()),
  {
    params: () => ({ userId: userQuery.data.value?.id ?? 0 }),
    // Only fetches when userId is non-zero
  }
);
```

## Polling

Use `effect` + `setInterval` for polling:

```typescript
import { effect, signal } from "@elurjs/core";
import { createQuery } from "@elurjs/query";

const notifications = createQuery("notifications", () => fetch("/api/notifications").then((r) => r.json()));

const polling = signal(true);
const dispose = effect(() => {
  if (!polling.value) return;
  const interval = setInterval(() => notifications.refetch(), 10_000);
  return () => clearInterval(interval);
});

// Stop polling: polling.value = false;
```

## Mutation + invalidation flow

```typescript
const createPost = createCommand(
  "posts/create",
  async (data: { title: string; body: string }) => {
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
```

## Offline-first pattern

```typescript
import { createCommand, type CommandQueueAdapter } from "@elurjs/query";

class IndexedDBQueueAdapter implements CommandQueueAdapter<any> {
  // ... implement with IndexedDB
}

const syncCommand = createCommand(
  "data/sync",
  async (payload) => {
    const res = await fetch("/api/sync", { method: "POST", body: JSON.stringify(payload) });
    return res.json();
  },
  {
    mode: "queueOffline",
    offline: {
      adapter: new IndexedDBQueueAdapter(),
      replayOnReconnect: true,
      maxReplayAttempts: 5,
      onEnqueue: (entry) => console.log("Queued:", entry.id),
      onReplaySuccess: (data, entry) => console.log("Replayed:", entry.id),
      onReplayError: (err, entry) => console.error("Replay failed:", entry.id, err),
    },
  }
);

// When online: executes immediately
// When offline: enqueues, replays on reconnect
```

## Testing

```typescript
import { createQuery, clearQueryCache, setQueryData } from "@elurjs/query";

beforeEach(() => {
  clearQueryCache(); // clean slate between tests
});

test("query fetches data", async () => {
  const q = createQuery("test", async () => ({ hello: "world" }));
  await new Promise((resolve) => setTimeout(resolve, 10)); // wait for fetch
  expect(q.data.value).toEqual({ hello: "world" });
  q.dispose();
});

test("setQueryData populates cache", () => {
  setQueryData("test", { hello: "world" });
  const q = createQuery("test", async () => { throw new Error("should not fetch"); }, {
    refetchOnMount: false,
  });
  expect(q.data.value).toEqual({ hello: "world" });
  q.dispose();
});
```
