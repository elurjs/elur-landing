---
title: Reactivity
description: How Elur's fine-grained reactivity system works — tracking, notifications, and the dependency graph.
section: Core
order: 2
---

# Reactivity

Elur's reactivity system is **fine-grained**: when a signal changes, only the
specific DOM nodes, computed values, and effects that depend on it are
notified and updated. There is no virtual DOM diffing and no component
re-rendering.

## The dependency graph

Every reactive primitive in Elur participates in a dependency graph:

```text
signal ──tracked by──> computed / effect / DOM interpolation
```

When a signal is read inside a tracking context (a computed, an effect, or a
template interpolation function), the framework records the dependency. When
the signal is written to, the framework notifies all dependents.

## Tracking contexts

A "tracking context" is any function that Elur monitors for signal reads:

1. **`computed(() => ...)`** — the function is tracked; its return value is
   cached and recalculated when dependencies change.
2. **`effect(() => ...)`** — the function is tracked and re-run when
   dependencies change.
3. **`${() => expr}`** — the interpolation function is tracked; its return
   value is written to the DOM when dependencies change.

Reading a signal **outside** a tracking context (e.g., in an event handler)
does not create a dependency — it simply returns the current value.

## Batching

Use `batch()` to group multiple signal writes so dependents are notified once,
after all writes are complete:

```typescript
import { signal, effect, batch } from "@elurjs/core";

const x = signal(1);
const y = signal(2);

effect(() => console.log(`x + y = ${x.value + y.value}`));

// Without batch(), each write triggers the effect separately:
x.value = 10; // Console: "x + y = 12"
y.value = 20; // Console: "x + y = 30"

// With batch(), the effect runs once after both writes:
batch(() => {
  x.value = 100;
  y.value = 200;
});
// Console: "x + y = 300" — single notification
```

## Untracking

If you need to read a signal without creating a dependency, use `untrack()`:

```typescript
import { signal, effect, untrack } from "@elurjs/core";

const a = signal(1);
const b = signal(2);

effect(() => {
  console.log("a =", a.value);
  console.log("b =", untrack(() => b.value)); // not tracked
});

a.value = 10; // effect re-runs
b.value = 20; // effect does NOT re-run
```

## `watch()` — reacting to a single source

`watch()` is a convenience over `effect()` for observing a single signal or
getter. It calls `callback(newValue, oldValue)` on each change:

```typescript
import { signal, watch } from "@elurjs/core";

const count = signal(0);

watch(count, (next, prev) => {
  console.log(`Changed from ${prev} to ${next}`);
});

// Or with a getter:
watch(() => count.value * 2, (next) => {
  console.log(`Doubled: ${next}`);
});
```

Options:

- `immediate: true` — fire the callback immediately with the current value.
- `once: true` — automatically dispose after the first callback invocation.

```typescript
watch(count, (next) => saveToServer(next), { immediate: true });
```

## Building custom reactive primitives

Elur's reactivity primitives compose. You can build helpers on top of `signal`,
`computed`, and `effect` without any special API:

```typescript
import { signal, effect } from "@elurjs/core";

function localStorageSignal(key: string, initial: string) {
  const s = signal(localStorage.getItem(key) ?? initial);

  // Sync to localStorage whenever the signal changes
  effect(() => {
    localStorage.setItem(key, s.value);
  });

  return s; // returns a standard Signal — use .value to read/write
}

const theme = localStorageSignal("theme", "dark");
theme.value = "light"; // updates localStorage and any dependents
```

## When reactivity doesn't apply

Reactivity is **shallow**: replacing a property on an object inside a signal
does not trigger updates. You must replace the signal's value:

```typescript
const user = signal({ name: "Alice", age: 30 });

// ❌ Won't trigger updates — mutating the object
user.value.name = "Bob";

// ✅ Correct — replace the value
user.value = { ...user.value, name: "Bob" };
```

:::tip
If you need deep reactivity, consider using a store (see [Stores](/docs/state/stores/))
or wrap your objects in individual signals.
:::
