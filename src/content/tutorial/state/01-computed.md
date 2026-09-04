---
title: Computed values
description: Derive state with computed().
section: State
order: 1
starterCode: "function App() {\n  const price = signal(10);\n  const qty = signal(2);\n\n  return html`\n    <p>Price: ${() => price.value}</p>\n    <p>Qty: ${() => qty.value}</p>\n    <p>Total: ${() => price.value * qty.value}</p>\n    <button @click=${() => qty.value++}>Add one</button>\n  `;\n}\n"
solutionCode: "function App() {\n  const price = signal(10);\n  const qty = signal(2);\n  const total = computed(() => price.value * qty.value);\n\n  return html`\n    <p>Price: ${() => price.value}</p>\n    <p>Qty: ${() => qty.value}</p>\n    <p>Total: ${() => total.value}</p>\n    <button @click=${() => qty.value++}>Add one</button>\n  `;\n}\n"
hint: "Create `const total = computed(() => price.value * qty.value)` and use ${() => total.value} in the template."
---

# Computed values

When a value is derived from other signals, use `computed()`. A computed is lazy on first read (it doesn't calculate until someone reads `.value`) and cached — the result is stored and reused until a dependency changes.

## Why computed?

You could compute the total inline in the template:

```typescript
html`<p>Total: ${() => price.value * qty.value}</p>`;
```

That works, but if you use the total in several places, the multiplication runs each time. A `computed` caches the result:

```typescript
const total = computed(() => price.value * qty.value);

html`<p>Total: ${() => total.value}</p>`;
html`<p>Tax: ${() => total.value * 0.2}</p>`;
```

## Your task

Refactor the starter code to use a `computed` for the total instead of multiplying inline.

:::note
`computed` is imported for you in the playground. Just use it directly.
:::
