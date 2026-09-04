---
title: Refs
description: The ref primitive — direct DOM element references for imperative access.
section: Core
order: 6
---

# Refs

A **ref** is a reference to a DOM element. It allows you to access the element
directly for imperative operations like focusing, measuring, or integrating
with third-party libraries.

## Creating a ref

```typescript
import { html, ref } from "@elurjs/core";

const inputEl = ref<HTMLInputElement>();

html`
  <div>
    <input ref=${inputEl} placeholder="Type here" />
    <button @click=${() => inputEl.el?.focus()}>Focus</button>
  </div>
`.mount("#app");
```

The `ref()` function creates a ref object. Pass it to the `ref` attribute on
any element. After the template is mounted, `inputEl.el` holds the actual
DOM element.

## Accessing the element

The element is available after mount:

```typescript
const canvasEl = ref<HTMLCanvasElement>();

html`<canvas ref=${canvasEl} width="400" height="300"></canvas>`.mount("#app");

// After mount:
const ctx = canvasEl.el?.getContext("2d");
ctx?.fillRect(10, 10, 100, 100);
```

:::warning
The element is `null` until the template is mounted. Always use optional
chaining (`?.`) or null checks.
:::

## Refs in lists

When using `repeat()`, the render function receives each item. You can create
refs per-item:

```typescript
const items = signal(["a", "b", "c"]);

html`
  <ul>
    ${() =>
      repeat(
        items.value,
        (item, i) => i,
        (item) => {
          const liEl = ref<HTMLLIElement>();
          return html`<li ref=${liEl}>${item}</li>`;
        }
      )}
  </ul>
`;
```

## Common use cases

### Auto-focus on mount

```typescript
const inputEl = ref<HTMLInputElement>();

html`<input ref=${inputEl} />`.mount("#app");

// Focus immediately after mount
requestAnimationFrame(() => inputEl.el?.focus());
```

### Measuring element size

```typescript
const boxEl = ref<HTMLDivElement>();
const width = signal(0);

html`<div ref=${boxEl} style="width:50%">Content</div>`.mount("#app");

// Read the rendered width
requestAnimationFrame(() => {
  width.value = boxEl.el?.offsetWidth ?? 0;
});
```

### Integrating with a charting library

```typescript
const chartEl = ref<HTMLDivElement>();

html`<div ref=${chartEl} style="height:300px"></div>`.mount("#app");

// Initialize a third-party chart after mount
requestAnimationFrame(() => {
  if (chartEl.el) {
    // ChartLibrary.create(chartEl.el, { ... });
  }
});
```

## Refs vs signals

| Feature | `ref()` | `signal()` |
| --- | --- | --- |
| Holds | A DOM element | Any value |
| Reactive | No | Yes |
| Use case | Imperative DOM access | Reactive state |

Refs are **not reactive** — they're a simple container for a DOM element
reference. If you need the element's value to trigger updates, wrap it in a
signal and update it in an event handler.
