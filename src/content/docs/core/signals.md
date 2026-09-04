---
title: Signals
description: The signal primitive — creating reactive values, reading, writing, and composing.
section: Core
order: 3
---

# Signals

A **signal** is the fundamental reactive primitive in Elur. It holds a value
and notifies dependents when that value changes.

## Creating a signal

```typescript
import { signal } from "@elurjs/core";

const count = signal(0);
const name = signal("Alice");
const items = signal<number[]>([]);
```

`signal(initialValue)` returns a `Signal` object with a `.value` property.

## Reading and writing

```typescript
// Read
console.log(count.value); // 0

// Write
count.value = 1;
count.value = count.value + 1;

// Shorthand
count.value++;
```

Reading a signal inside a tracking context (computed, effect, template
interpolation) creates a dependency. Reading outside a tracking context just
returns the current value.

## The `.value` getter/setter

The `value` property uses JavaScript getters and setters:

- **Getter**: if inside a tracking context, registers the dependency. Returns
  the current value.
- **Setter**: updates the value and notifies all dependents (batched within
  the current tick).

## Peeking without tracking

Use `peek()` to read a signal's value without creating a dependency:

```typescript
const a = signal(1);
const b = signal(2);

const sum = computed(() => {
  // Only depends on `a`, not `b`
  return a.value + b.peek();
});

a.value = 10; // sum recalculates
b.value = 20; // sum does NOT recalculate
```

## Updating with a function

You can update a signal using a function of its current value:

```typescript
count.update((n) => n + 1);
```

This is equivalent to `count.value = count.value + 1` but reads and writes in
a single call.

### `dispose()`

Clears all subscriber subscriptions on the signal. After disposing, no
effect or computed will be notified of further changes:

```typescript
const count = signal(0);
const stop = effect(() => console.log(count.value)); // 0

count.value = 1; // logs 1
count.dispose(); // subscribers cleared
count.value = 2; // no log — effect still runs but is no longer subscribed
```

:::tip
`dispose()` is mainly useful for long-lived signals that you want to tear down
explicitly (e.g. in tests or when unmounting a component). Effects returned by
`effect()` already clean up their own subscriptions when you call the returned
dispose function.
:::

## Equality check

Signals use `Object.is` to compare the old and new value. If they're equal, no
notification is fired — dependents are not re-run:

```typescript
const count = signal(0);
count.value = 0; // no notification — Object.is(0, 0) is true
count.value = 1; // notification — value changed
```

This means objects and arrays need **immutable updates** to trigger
notifications. Replacing the value with a new reference works; mutating a
property in place does not:

```typescript
const user = signal({ name: "Alice" });

// ❌ No notification — same object reference, Object.is is true
user.value.name = "Bob";

// ✅ Notification — new object reference
user.value = { ...user.value, name: "Bob" };
```

:::note
`signal()` only accepts the initial value — there is no options argument. For
custom equality on derived values, use `computed(fn, equals)` where `equals`
is the second positional argument. See [Computed Values](/docs/core/computed/).
:::

## Signals vs refs

Elur also has `ref()` for DOM element references. Don't confuse them:

- `signal()` — a reactive value container.
- `ref()` — a reference to a DOM element (not reactive by itself).

## Common patterns

### Toggle

```typescript
const open = signal(false);
const toggle = () => open.value = !open.value;
```

### Form input

```typescript
const text = signal("");

html`<input
  value=${() => text.value}
  @input=${(e: Event) => text.value = (e.target as HTMLInputElement).value}
/>`;
```

### Counter with bounds

```typescript
const count = signal(0);

const increment = () => {
  count.value = Math.min(count.value + 1, 10);
};
```

:::note
Signals are the foundation of all reactivity in Elur. Every reactive
primitive (computed, effect, template interpolation) is built on top of
signals.
:::
