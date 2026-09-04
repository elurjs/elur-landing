---
title: Stores
description: Organizing reactive state with createStore — actions, getters, plugins, and the $-prefixed API.
section: State
order: 1
---

# Stores

`createStore()` turns a plain state object into a reactive store. Each property
becomes a `Signal`, and you can add actions, computed getters, and plugins
(persistence, logging, guards, bridging) in a single call.

## Creating a store

```typescript
import { createStore } from "@elurjs/core";

const counter = createStore({ count: 0 });

counter.count.value;   // 0 — each key is a Signal
counter.count.value++; // write directly
counter.$snapshot();   // { count: 1 } — passive read, no subscription
```

Every key in the initial state becomes a readable/writable `Signal`. The store
also exposes a set of `$`-prefixed utilities (see [below](#the--api)).

## Actions

Pass an `actions` factory to encapsulate state mutations. It receives the raw
signals and returns methods that are attached to the store:

```typescript
import { createStore } from "@elurjs/core";

const counter = createStore({ count: 0 }, {
  name: "counter",
  actions: (s) => ({
    increment() { s.count.value++; },
    decrement() { s.count.value--; },
    reset() { s.count.value = 0; },
  }),
});

counter.increment();
counter.count.value; // 1
```

## Getters

A `getters` factory returns computed `Signal`s. They're exposed on the store as
read-only signals — writing to them throws:

```typescript
import { createStore, computed } from "@elurjs/core";

const cart = createStore(
  { items: [] as Array<{ price: number }>, discount: 0 },
  {
    getters: (s) => ({
      count: computed(() => s.items.value.length),
      total: computed(() =>
        s.items.value.reduce((sum, i) => sum + i.price, 0) * (1 - s.discount.value)
      ),
    }),
  }
);

cart.count.value;  // 0
cart.total.value;  // 0
```

:::warning
Getters must return a `Signal` (wrap them with `computed()`). Returning a plain
value throws a `TypeError` at store creation time.
:::

## A todo store

```typescript
import { createStore, computed } from "@elurjs/core";

interface Todo { id: number; text: string; done: boolean; }

const todos = createStore(
  {
    items: [] as Todo[],
    filter: "all" as "all" | "active" | "done",
  },
  {
    name: "todos",
    actions: (s) => ({
      add(text: string) {
        s.items.value = [...s.items.value, { id: Date.now(), text, done: false }];
      },
      toggle(id: number) {
        s.items.value = s.items.value.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t
        );
      },
      remove(id: number) {
        s.items.value = s.items.value.filter((t) => t.id !== id);
      },
      setFilter(f: "all" | "active" | "done") {
        s.filter.value = f;
      },
    }),
    getters: (s) => ({
      filtered: computed(() => {
        switch (s.filter.value) {
          case "active": return s.items.value.filter((t) => !t.done);
          case "done": return s.items.value.filter((t) => t.done);
          default: return s.items.value;
        }
      }),
      remaining: computed(() => s.items.value.filter((t) => !t.done).length),
    }),
  }
);
```

## Using a store in a template

```typescript
import { html } from "@elurjs/core";

html`
  <div>
    <p>Count: ${() => counter.count.value}</p>
    <button @click=${counter.increment}>+</button>
    <button @click=${counter.decrement}>−</button>
    <button @click=${counter.reset}>Reset</button>
  </div>
`.mount("#app");
```

## The `$` API

Every store exposes these framework-level utilities:

| Member | Description |
| --- | --- |
| `$id` | The store's display name (from `options.name`). |
| `$state` | Reactive snapshot — reading inside an effect/computed subscribes to the whole state. |
| `$snapshot()` | Passive snapshot — returns current values without subscribing. |
| `$stateSignal` | The read-only computed `Signal` backing `$state`. Plugins use this. |
| `$reset()` | Reset all keys to their initial values (batched). |
| `$patch(partial)` | Apply a partial update (batched). |
| `$watch(cb, opts?)` | Watch state changes. Equivalent to `watch(store.$stateSignal, cb)`. |
| `$dispose()` | Dispose the store and run all plugin cleanups. |

```typescript
counter.$patch({ count: 10 });
counter.$watch((next, prev) => console.log("changed:", next));
counter.$reset(); // back to { count: 0 }
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `name` | — | Display name for devtools and error messages |
| `actions` | — | Factory receiving the state signals, returns methods |
| `getters` | — | Factory receiving the state signals, returns computed Signals |
| `plugins` | `[]` | Array of plugin functions |
| `serialize` | `structuredClone` | Custom serializer for `$reset` baseline (use when state has Map/Set/class instances) |

```typescript
const store = createStore(
  { items: new Map<string, number>() },
  {
    name: "cart",
    serialize: (s) => ({ items: new Map(s.items) }),
  }
);
```

## Plugins

Plugins are functions that receive the assembled store and can extend the
signal graph. Elur ships four built-in plugins:

### `persistPlugin`

Saves state to a storage medium (defaults to `localStorage`) and rehydrates on
init:

```typescript
import { createStore, persistPlugin } from "@elurjs/core";

const settings = createStore(
  { theme: "dark", sidebar: true },
  {
    name: "settings",
    plugins: [persistPlugin("app-settings")],
  }
);
```

Options let you customize the storage adapter, exclude keys, or debounce writes:

```typescript
persistPlugin("app-settings", {
  exclude: ["sidebar"],
  debounce: 500,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
})
```

The `storage` option accepts any object implementing `StorageAdapter`:

```typescript
interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem?(key: string): void | Promise<void>;
}
```

This makes `persistPlugin` compatible with `localStorage`, `sessionStorage`,
`AsyncStorage` (React Native), IndexedDB wrappers, or any custom adapter.

### `loggerPlugin`

Logs state transitions to the console with property-level diffs:

```typescript
import { createStore, loggerPlugin } from "@elurjs/core";

const store = createStore({ count: 0 }, {
  plugins: [loggerPlugin({ collapsed: true })],
});
```

### `guardPlugin`

Intercepts `$patch` and `$reset` to validate or transform state before it's
applied:

```typescript
import { createStore, guardPlugin } from "@elurjs/core";

const store = createStore({ count: 0 }, {
  plugins: [
    guardPlugin([
      (next, current) => {
        if (next.count !== undefined && next.count < 0) {
          return { count: 0 }; // clamp to 0
        }
      },
    ]),
  ],
});
```

### `bridgePlugin`

Synchronizes data between two stores by watching one and patching the other:

```typescript
import { createStore, bridgePlugin } from "@elurjs/core";

const source = createStore({ value: 1 });
const target = createStore({ mirrored: 0 }, {
  plugins: [
    bridgePlugin(source, (src, t) => t.$patch({ mirrored: src.value })),
  ],
});
```

## Writing a custom plugin

A plugin is a function that receives the assembled store and optionally
returns a cleanup function called on `$dispose()`. There are no lifecycle
hooks — plugins extend the signal graph directly using the framework
primitives:

- `watch(store.$stateSignal, cb)` — react to any state change
- `computed(() => store.someSignal.value)` — derive new reactive nodes
- `store.$snapshot()` — passive read for logging/persistence (no subscription)

### `ElurPlugin` type

```typescript
type ElurPlugin<T, A, G> = (store: Store<T, A, G>) => (() => void) | void;
```

The plugin receives the full `Store` with all signals, actions, getters, and
`$`-prefixed utilities. Return a cleanup function if your plugin creates
watchers or external resources.

### Example: analytics plugin

```typescript
import { watch, type ElurPlugin } from "@elurjs/core";

function analyticsPlugin<T extends { user: string | null }>(
  track: (event: string, props: Record<string, unknown>) => void,
): ElurPlugin<T> {
  return (store) => {
    return watch(store.$stateSignal, (next, prev) => {
      if (prev && next.user !== prev.user) {
        track("user_changed", { user: next.user });
      }
    });
  };
}

const auth = createStore(
  { user: null as string | null },
  {
    name: "auth",
    plugins: [analyticsPlugin((event, props) => console.log(event, props))],
  },
);
```

### Example: localStorage with custom key prefix

```typescript
import { watch, untrack, type ElurPlugin } from "@elurjs/core";

function customPersistPlugin<T extends Record<string, unknown>>(
  prefix: string,
): ElurPlugin<T> {
  return (store) => {
    // Hydrate on init (untracked so we don't subscribe)
    untrack(() => {
      const raw = localStorage.getItem(`${prefix}:${store.$id}`);
      if (raw) {
        try {
          store.$patch(JSON.parse(raw));
        } catch { /* ignore corrupt data */ }
      }
    });

    // Save on every change
    return watch(store.$stateSignal, (state) => {
      localStorage.setItem(`${prefix}:${store.$id}`, JSON.stringify(state));
    });
  };
}
```

### Example: derived signal plugin

```typescript
import { computed, type ElurPlugin } from "@elurjs/core";

function withDouble<T extends { count: number }>(): ElurPlugin<T> {
  return (store) => {
    // Attach a new computed signal to the store via $stateSignal
    const doubled = computed(() => store.$state.count * 2);
    // Expose it on the store object
    Object.defineProperty(store, "doubled", {
      get: () => doubled.value,
      enumerable: true,
    });
  };
}
```

:::tip
Plugins run in order after the store is fully assembled (signals, actions,
getters). If a plugin throws during initialization, the error is logged but
does not prevent other plugins from running.
:::

## Singleton stores

For app-wide state, create a store at module scope and import it anywhere:

```typescript
// stores/auth.ts
import { createStore, computed } from "@elurjs/core";

export const authStore = createStore(
  { user: null as { name: string } | null },
  {
    name: "auth",
    actions: (s) => ({
      login(name: string) { s.user.value = { name }; },
      logout() { s.user.value = null; },
    }),
    getters: (s) => ({
      isLoggedIn: computed(() => s.user.value !== null),
    }),
  }
);
```

```typescript
import { authStore } from "../stores/auth";
import { html } from "@elurjs/core";

html`<p>${() => authStore.isLoggedIn.value
  ? `Hello, ${authStore.user.value?.name}`
  : "Please log in"}</p>`;
```

:::tip
`createStore` gives you typed signals, actions, getters, and plugins out of the
box. For very small pieces of state, plain `signal()` calls are fine — reach
for a store when you have related state plus actions that belong together.
:::

## Types

### `Store<T, A, G>`

The full store type returned by `createStore`. Combines reactive state
signals, action methods, computed getters, and the `$`-prefixed API:

```typescript
type Store<T, A, G> = StoreSignals<T> & A & StoreGetters<G> & {
  readonly $id: string;
  readonly $state: T;
  $snapshot(): T;
  readonly $stateSignal: ReadonlySignal<T>;
  $reset(): void;
  $patch(partial: Partial<T>): void;
  $watch(cb: (next: T, prev: T | undefined) => void, options?: WatchOptions): () => void;
  $dispose(): void;
};
```

### `StoreSignals<T>`

```typescript
type StoreSignals<T extends object> = {
  readonly [K in keyof T]: Signal<T[K]>;
};
```

A mapped type that gives each state property its own reactive `Signal`.

### `StoreGetters<G>`

```typescript
type StoreGetters<G> = {
  readonly [K in keyof G]: ReadonlySignal<...>;
};
```

Getters are exposed as `ReadonlySignal` — you can read `.value` but cannot
write. They satisfy `instanceof Signal` so `watch()` works on them.

### `CreateStoreOptions<T, A, G>`

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string?` | Display name (devtools, error messages, `$id`) |
| `actions` | `(signals: StoreSignals<T>) => A` | Factory returning action methods |
| `getters` | `(signals: StoreSignals<T>) => G` | Factory returning computed Signals |
| `plugins` | `ElurPlugin<T, A, G>[]` | Plugins to extend the store |
| `serialize` | `(state: T) => T` | Custom serializer for `$reset` baseline (default: `structuredClone`) |

### `GuardFn<T>`

```typescript
type GuardFn<T extends object> = (
  next: Partial<T>,
  current: T,
) => Partial<T> | void;
```

A guard function used by `guardPlugin`. Return a transformed partial to modify
the patch, or `void` to accept it as-is.

### `ElurPlugin<T, A, G>`

```typescript
type ElurPlugin<T, A, G> = (store: Store<T, A, G>) => (() => void) | void;
```

A function that receives the assembled store and optionally returns a cleanup
function called on `$dispose()`.
