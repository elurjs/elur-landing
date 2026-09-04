---
title: Comparison
description: How Elur compares to React, Vue, Svelte, and Solid — reactivity, bundle size, and DX.
section: Reference
order: 2
---

# Comparison

How does Elur compare to other frontend frameworks? This page covers the key
differences in reactivity model, bundle size, developer experience, and
ecosystem.

## At a glance

| Feature | Elur | React | Vue | Svelte | Solid |
| --------- | ------ | ------- | ----- | -------- | ------- |
| Reactivity | Signals | VDOM diff | Refs/Reactive | Compile-time | Signals |
| Templating | Tagged templates | JSX | SFC templates | SFC templates | JSX |
| Build step | Optional | Required | Required | Required | Required |
| Runtime size | ~15 KB | ~45 KB | ~35 KB | ~2 KB* | ~8 KB |
| SSR | Yes | Yes | Yes | Yes | Yes |
| TypeScript | First-class | First-class | Good | Good | First-class |

*Svelte's runtime is per-component; total size depends on app complexity.

## Elur vs React

**React** uses a virtual DOM and re-runs component functions on every state
change. **Elur** uses signals and runs component functions once, updating only
the affected DOM nodes.

```tsx
// React: re-renders the entire component
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

```typescript
// Elur: only the text node updates
import { ElurComponent, signal, html } from "@elurjs/core";

class Counter extends ElurComponent {
  private count = signal(0);

  override render() {
    return html`<button @click=${() => this.count.update((n) => n + 1)}>
      ${() => this.count.value}
    </button>`;
  }
}
```

**Key differences:**
- No `useMemo`, `useCallback`, or `useEffect` dependency arrays — reactivity
  is automatic.
- No re-renders — updates are surgical.
- No virtual DOM — direct DOM manipulation.
- Tagged templates instead of JSX (no compiler needed).

## Elur vs Vue

**Vue** uses compiled SFC templates with reactivity based on Proxies/Refs.
**Elur** uses tagged template literals with signals.

Both use fine-grained reactivity, but Elur's templates are plain JavaScript —
no `.vue` files, no compiler. This means:
- Better IDE support out of the box (it's just TypeScript).
- No need for a build step for development.
- Templates are composable with regular JavaScript functions.

## Elur vs Svelte

**Svelte** compiles components to vanilla JS at build time, producing very
small bundles. **Elur** uses a runtime reactivity system.

Svelte's compiler approach produces smaller bundles for simple apps, but
Elur's runtime approach offers:
- No build step required (use from CDN).
- Dynamic component composition without compile-time constraints.
- A consistent runtime model (no "compiled away" reactivity).

## Elur vs Solid

**Solid** is the closest to Elur in philosophy: signals + fine-grained
updates. The main difference is the templating layer:

- **Solid** uses JSX compiled to template strings.
- **Elur** uses tagged template literals directly (no compiler).

Solid requires a build step to compile JSX; Elur works with zero build
configuration.

## When to choose Elur

- You want **fine-grained reactivity** without a virtual DOM.
- You want to work **without a build step** (CDN, no bundler).
- You want **tagged template literals** instead of JSX.
- You want a **tiny runtime** with zero dependencies.
- You want **TypeScript-first** development.

## When to choose something else

- **React**: you need the massive ecosystem, or your team already knows it.
- **Vue**: you prefer SFC templates and a gentler learning curve.
- **Svelte**: you want the smallest possible bundles and don't mind a
  compiler.
- **Solid**: you like signals but prefer JSX over tagged templates.

:::tip
The best framework is the one that fits your team and project. Elur excels at
small-to-medium apps where you want fine-grained reactivity, a tiny runtime,
and no build step.
:::
