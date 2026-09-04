---
title: Introduction
description: What Elur is, why it exists, and how it differs from other UI frameworks.
section: Getting Started
order: 1
---

# Introduction

**Elur** is a fine-grained reactive UI framework that uses tagged template
literals for rendering and signals for state management. It ships a tiny
runtime (~15 KB gzipped), requires no virtual DOM, and updates the DOM
surgically — only the nodes affected by a state change are touched.

## Why Elur?

Most modern frameworks fall into one of two camps: virtual-DOM diffing (React,
Vue) or compile-time code generation (Svelte, Solid). Elur takes a third path:
**runtime fine-grained reactivity** with **tagged template literals** as the
templating primitive. This means:

- **No build step required** — templates are plain JavaScript tagged templates.
- **No virtual DOM** — the framework tracks which DOM nodes depend on which
  signals and updates them directly.
- **Tiny runtime** — the core is ~15 KB gzipped with zero dependencies.
- **Universal** — the same code runs on the server (SSR) and the client
  (hydration).

## Core primitives

Elur is built on a small set of primitives:

| Primitive | Purpose |
| ----------- | --------- |
| `signal()` | A reactive value container |
| `computed()` | A derived value that updates automatically |
| `effect()` | A side effect that re-runs when dependencies change |
| `html\`\`` | Tagged template literal for declarative rendering |
| `repeat()` | Efficient list rendering with key-based reconciliation |

## A first example

```typescript
import { html, signal } from "@elurjs/core";

function Counter() {
  const count = signal(0);

  return html`
    <div class="counter">
      <button @click=${() => count.value--}>−</button>
      <span>${() => count.value}</span>
      <button @click=${() => count.value++}>+</button>
    </div>
  `;
}

Counter().mount("#app");
```

The `${() => count.value}` interpolation is a **function**. Elur calls it
once during initial render, tracks that it reads `count`, and re-invokes only
that function when `count` changes. No diffing, no re-render of the entire
component.

## Where to go next

- **[Installation](/docs/getting-started/installation/)** — set up a new project.
- **[Quick Start](/docs/getting-started/quick-start/)** — build your first app in 5 minutes.
- **[Thinking in Elur](/docs/getting-started/thinking-in-elur/)** — the mental model.
- **[Templates](/docs/core/templates/)** — learn the `html` tagged template syntax.
- **[Reactivity](/docs/core/reactivity/)** — signals, computed, and effects.

:::tip
The best way to learn is by doing. Check out the [examples gallery](/examples/)
for interactive demos you can edit in the browser.
:::
