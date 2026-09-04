---
title: Effects
description: Run side effects when signals change.
section: Advanced
order: 1
starterCode: "function App() {\n  const count = signal(0);\n\n  return html`\n    <p>Count: ${() => count.value}</p>\n    <button @click=${() => count.value++}>+</button>\n  `;\n}\n"
solutionCode: "function App() {\n  const count = signal(0);\n  const log = signal(\"\");\n\n  effect(() => {\n    log.value = \"count changed to \" + count.value;\n  });\n\n  return html`\n    <p>Count: ${() => count.value}</p>\n    <p>Log: ${() => log.value}</p>\n    <button @click=${() => count.value++}>+</button>\n  `;\n}\n"
hint: "Create a signal `log` and an effect that sets log.value = \"count changed to \" + count.value. Then display log.value in the template."
---

# Effects

An `effect()` runs a function immediately and re-runs it whenever a signal it reads changes. Use it for side effects — logging, syncing state, or touching non-reactive APIs.

## Basic effect

```typescript
effect(() => {
  console.log("count is", count.value);
});
```

This runs once right away, then again every time `count` changes.

## Your task

Add an effect that records a message every time `count` changes, and display that message in the template.

1. Create a signal `log` (a string).
2. Add an `effect` that sets `log.value` to `"count changed to " + count.value`.
3. Display `log.value` in a `<p>` below the count.

:::warning
Effects that read and write the same signal create an infinite loop. The solution writes to `log` (a different signal) while reading `count`, which is safe.
:::
