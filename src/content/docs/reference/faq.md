---
title: FAQ
description: Frequently asked questions about Elur — performance, migration, and common gotchas.
section: Reference
order: 3
---

# FAQ

## General

### Is Elur production-ready?

Yes. Elur v3 is stable and used in production apps. The core runtime is
well-tested with a comprehensive test suite. The ecosystem packages (Kit,
Query, Auth, i18n) are at various stages of maturity — check each package's
README for status.

### How big is the Elur runtime?

The core `@elurjs/core` package is ~15 KB gzipped with zero dependencies. This
includes signals, computed, effects, and the template renderer.

### Do I need a build step?

No. Elur works directly in the browser via ESM CDN imports. For production,
we recommend Vite for bundling and minification, but it's not required.

### Can I use JSX instead of tagged templates?

Not officially. Elur's templating is built around the `html` tagged template
literal. There are community experiments with JSX, but they're not maintained
by the core team.

## Reactivity

### Why do I need to use `${() => value}` instead of `${value}`?

A plain `${value}` reads the signal once during the initial render and never
updates. A function `${() => value}` is called by Elur's reactivity system,
which tracks the signal read and re-invokes the function when the signal
changes.

### Why can't I do partial attribute interpolation?

`class="btn ${() => active}"` is not supported at runtime because the template
parser treats the entire attribute value as a single string. Instead, use a
full binding:

```typescript
class=${() => `btn ${active.value ? "active" : ""}`}
```

Partial attribute interpolation is supported at compile time by
`@elurjs/vite-plugin-elur`, but without the plugin, only full bindings work.

### How do I debug reactivity issues?

- Install the **Elur DevTools** browser extension (Chrome) for a
  dedicated panel with Components, Signals, and Router tabs. With
  `@elurjs/vite-plugin-elur` >= 2.1, the in-page backend is injected
  automatically during `vite dev`.
- Call `enableDevTools()` from `@elurjs/core` to enable the built-in in-page
  devtools panel (useful when you can't install the browser extension).
- Add `effect(() => console.log(signal.value))` to trace when a signal
  changes.
- Check for signal reads outside tracking contexts (e.g., in event handlers
  — these are fine, but they won't create dependencies).

## Performance

### Is Elur faster than React?

For most update patterns, yes. Elur updates only the DOM nodes affected by a
signal change, while React re-renders the component and diffs the virtual DOM.
For initial render, both are comparable — Elur may be slightly faster due to
no VDOM overhead.

### How does Elur handle large lists?

Use `repeat()` with proper keys. Elur performs key-based reconciliation: only
added, removed, or reordered items are updated. For very large lists
(10,000+ items), consider virtualization.

## Migration

### Can I migrate from React gradually?

Yes, especially with Elur Kit. You can mount Elur components inside a React
app using `template.mount(element)`. For full migration, rewrite components
one at a time — the mental model is different, but the concepts map cleanly.

### Can I use React libraries with Elur?

Not directly. React libraries expect React's component model and hooks. You'll
need to find Elur equivalents or write wrappers. The Elur ecosystem is growing,
with packages for routing, data fetching, auth, and i18n.

## Common gotchas

### Signal mutations don't trigger updates

```typescript
const user = signal({ name: "Alice" });
user.value.name = "Bob"; // ❌ no update
user.value = { ...user.value, name: "Bob" }; // ✅ correct
```

Signals are shallow — you must replace the value, not mutate it.

### Effects that write to their own dependencies

```typescript
const count = signal(0);
effect(() => {
  count.value = count.value + 1; // ❌ infinite loop
});
```

Don't write to a signal inside an effect that reads it. Use `computed`
instead.

:::note
Have a question that's not answered here? Check the
[API Reference](/docs/reference/api/) or open a discussion on
[GitHub](https://github.com/elurjs/elur).
:::
