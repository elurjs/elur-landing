---
title: Thinking in Elur
description: The mental model behind Elur — fine-grained reactivity, signals, and how the DOM stays in sync.
section: Getting Started
order: 4
---

# Thinking in Elur

Elur's mental model is different from React's. In React, you think in terms of
"re-renders": when state changes, the component function runs again and the
virtual DOM is diffed. In Elur, **components run once** and the framework
tracks which pieces of the DOM depend on which signals. When a signal changes,
only the dependent DOM nodes are updated.

## The signal graph

At the heart of Elur is a **dependency graph** of signals, computed values,
and effects:

```text
signal(0) ──┬── computed(() => count * 2)
            ├── effect(() => console.log(count))
            └── DOM text node "Count: ${() => count}"
```

When you write `count.value = 5`, Elur walks the graph and notifies every
dependent: the computed recalculates, the effect re-runs, and the text node
updates its content. Nothing else is touched.

## Rules of reactivity

1. **Read inside a tracking context.** A signal is only tracked when read
   inside a reactive function — a computed, an effect, or a template
   interpolation (`${() => ...}`).

2. **Write outside of tracking.** You should not write to a signal from inside
   a computed (it would create a loop). Write from event handlers, effects
   with guards, or external code.

3. **Functions are reactive.** `${() => count.value}` is called once during
   the initial render (setting up the dependency tracking), and again only
   when `count` changes.

## What runs when?

| Action | What runs |
| -------- | ----------- |
| Initial render | All interpolation functions, all `effect` (eager). `computed` only if its `.value` is read. |
| `signal.value = x` | Only dependents: `computed` (eager after first read), `effect`, DOM nodes |
| Component re-render | **Never** — components run once |

This is why Elur is fast: there is no re-render. The component function
executes exactly once, setting up the reactive graph. After that, all updates
are surgical.

## Comparing to React

```typescript
// React: the entire component re-runs on every state change
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

```typescript
// Elur: the component runs once; only the text node updates
function Counter() {
  const count = signal(0);
  return html`<button @click=${() => count.value++}>${() => count.value}</button>`;
}
```

In React, clicking the button calls `setCount`, which re-runs `Counter`,
re-creates the JSX, and diffs it against the previous tree. In Elur, clicking
the button increments the signal, and Elur directly updates the text node's
`textContent`. No diffing, no re-execution.

## Comparing to Vue

Vue's `ref()` and `computed()` are conceptually similar to Elur's `signal()`
and `computed()`. The key difference is the templating layer: Vue uses a
compiled template DSL, while Elur uses JavaScript tagged template literals.
This means Elur templates are just JavaScript — no compiler, no special syntax
to learn beyond the `html` tag.

## When to use what

- Use **`signal()`** for independent reactive values.
- Use **`computed()`** for values derived from other signals.
- Use **`effect()`** for side effects that should re-run when dependencies
  change (e.g., syncing to `localStorage`).
- Use **`html\`\`** for declarative DOM rendering.
- Use **`repeat()`** for keyed list rendering.

:::tip
If you're coming from React, the biggest shift is: **don't think about
re-renders**. Think about which signals your UI depends on, and let the
reactivity system handle the rest.
:::
