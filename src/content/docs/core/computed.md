---
title: Computed Values
description: The computed primitive — derived reactive values that cache and update automatically.
section: Core
order: 5
---

# Computed Values

A **computed** is a derived value that automatically recalculates when its
dependencies change. It is **lazy on first read** and **cached**: the
calculation doesn't run until someone first reads `.value`, and the result is
cached. After that first read, the computed is **eager** — it re-runs
automatically whenever a dependency changes, keeping the cache up to date.

## Creating a computed

```typescript
import { signal, computed } from "@elurjs/core";

const radius = signal(5);
const area = computed(() => Math.PI * radius.value ** 2);

console.log(area.value); // 78.54
radius.value = 10;
console.log(area.value); // 314.16
```

## Laziness (first read only)

A computed does not calculate until its `.value` is read for the first time:

```typescript
const a = signal(1);
const b = computed(() => {
  console.log("calculating");
  return a.value * 2;
});

// "calculating" is NOT printed yet — b hasn't been read
console.log(b.value); // "calculating" printed, returns 2
console.log(b.value); // no print — cached, returns 2
a.value = 5;          // "calculating" printed — effect re-runs eagerly
console.log(b.value); // no print — cached, returns 10
```

After the first read, the computed is **eager**: when a dependency changes,
the internal effect re-runs immediately and updates the cached value — even
if nobody reads `.value`. This is different from Vue's lazy `computed` and
closer to Solid's `createMemo`.

## Chaining computeds

Computeds can depend on other computeds:

```typescript
const price = signal(100);
const tax = computed(() => price.value * 0.2);
const total = computed(() => price.value + tax.value);

console.log(total.value); // 120
price.value = 200;
console.log(total.value); // 240
```

The dependency graph is tracked automatically — `total` depends on both
`price` (directly) and `tax` (which depends on `price`).

## Conditional dependencies

A computed only depends on the signals it actually reads during execution:

```typescript
const mode = signal("add");
const a = signal(10);
const b = signal(5);

const result = computed(() => {
  if (mode.value === "add") return a.value + b.value;
  return a.value - b.value;
});

// result depends on: mode, a, b (all read)
// After mode.value = "subtract", it still depends on all three
```

## Equality check

`computed()` accepts an optional equality function as its **second positional
argument** (not an options object). It defaults to `Object.is`. When the
function returns `true`, the cached value is kept and dependents are not
notified:

```typescript
const items = signal([1, 2, 3]);
const count = computed(
  () => items.value.length,
  (a, b) => a === b, // equals — second positional argument
);
```

This is useful when the computed produces a new object on every run but you
only want to notify dependents when the meaningful content changes:

```typescript
const filtered = computed(
  () => todos.value.filter((t) => !t.done),
  (a, b) => a.length === b.length && a.every((x, i) => x.id === b[i].id),
);
```

## When to use computed vs effect

- **`computed`**: you need a value that others can read. It's cached and lazy.
- **`effect`**: you need to perform a side effect. It's eager (runs
  immediately) and has no return value.

## Common patterns

### Filtered list

```typescript
const todos = signal([
  { text: "Learn Elur", done: false },
  { text: "Build app", done: true },
]);

const remaining = computed(() =>
  todos.value.filter((t) => !t.done).length
);

const completed = computed(() =>
  todos.value.filter((t) => t.done).length
);
```

### Formatting

```typescript
const price = signal(99.99);
const formatted = computed(() =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price.value)
);
```

### State machine

```typescript
const status = signal("idle");
const label = computed(() => ({
  idle: "Click to start",
  loading: "Loading…",
  success: "Done!",
  error: "Something went wrong",
}[status.value] ?? "Unknown"));
```

:::tip
Always prefer `computed` over `effect` when you need a derived value. Computeds
are lazy on first read (they don't calculate until someone reads `.value`) and
cached (the result is stored and reused), making them more efficient than
re-running logic in an effect.
:::
