---
title: Signals
description: Create reactive state with signal().
section: Basics
order: 2
starterCode: "function App() {\n  const count = signal(0);\n\n  return html`\n    <p>Count: ${() => count.value}</p>\n    <button @click=${() => count.value++}>+</button>\n  `;\n}\n"
solutionCode: "function App() {\n  const count = signal(0);\n\n  return html`\n    <p>Count: ${() => count.value}</p>\n    <button @click=${() => count.value++}>+</button>\n    <button @click=${() => count.value--}>-</button>\n  `;\n}\n"
hint: "Add a second button with @click=${() => count.value--} to decrement the count."
---

# Signals

A **signal** is a reactive container for a value. When the value changes, anything that depends on it updates automatically.

## Creating a signal

```typescript
const count = signal(0);
```

Read it with `.value` and write to it with `.value =`:

```typescript
count.value;       // 0
count.value = 5;   // update
count.value++;     // shorthand
```

## Reactive text

To make text update when a signal changes, wrap the read in a **function interpolation**:

```typescript
html`<p>Count: ${() => count.value}</p>`;
```

The `() =>` is what makes it reactive. Elur tracks that the function reads `count`, and re-runs it when `count` changes.

## Your task

The starter code has a counter that only goes up. Add a second button that decrements the count.

:::warning
If you write `${count.value}` (without the function), the text is read once and never updates. Always use `${() => count.value}` for reactive values.
:::
