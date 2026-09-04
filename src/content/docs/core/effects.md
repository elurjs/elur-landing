---
title: Effects
description: The effect primitive — reactive side effects that re-run when dependencies change.
section: Core
order: 4
---

# Effects

An **effect** is a function that re-runs whenever any signal it reads changes.
Effects are for **side effects**: logging, syncing to storage, fetching data,
manipulating the DOM directly, etc.

## Creating an effect

```typescript
import { signal, effect } from "@elurjs/core";

const count = signal(0);

effect(() => {
  console.log(`Count is now ${count.value}`);
});

count.value = 1; // Console: "Count is now 1"
count.value = 2; // Console: "Count is now 2"
```

The effect function runs immediately once, and then again whenever `count`
changes.

## Cleanup

If your effect creates resources (event listeners, intervals, subscriptions),
return a cleanup function:

```typescript
effect(() => {
  const id = setInterval(() => {
    console.log("Tick", count.value);
  }, 1000);

  return () => clearInterval(id);
});
```

The cleanup function runs before the effect re-runs and when the effect is
disposed.

## Disposing effects

Use `dispose()` to stop an effect permanently:

```typescript
const stop = effect(() => {
  console.log(count.value);
});

// Later:
stop(); // The effect will no longer run
```

## Effects vs computed

| Feature | `computed()` | `effect()` |
| --------- | ------------- | ------------ |
| Returns a value | Yes | No |
| Cached | Yes | No |
| Re-runs on dep change | Yes | Yes |
| Use case | Derived state | Side effects |

Use `computed` when you need a value derived from signals. Use `effect` when
you need to do something (side effect) in response to signal changes.

## Common use cases

### Syncing to localStorage

```typescript
const theme = signal("dark");

effect(() => {
  localStorage.setItem("theme", theme.value);
  document.documentElement.setAttribute("data-theme", theme.value);
});
```

### Debounced search

```typescript
const query = signal("");

effect(() => {
  const q = query.value;
  const timer = setTimeout(() => {
    if (q) fetchResults(q);
  }, 300);

  return () => clearTimeout(timer);
});
```

### DOM measurement

```typescript
const isOpen = signal(false);

effect(() => {
  if (isOpen.value) {
    const el = document.querySelector(".panel");
    const height = el?.scrollHeight;
    el?.setAttribute("style", `max-height: ${height}px`);
  }
});
```

:::warning
Avoid writing to signals inside an effect that the same effect reads — this
creates an infinite loop. If you need to update a signal based on another, use
`computed` instead.
:::
