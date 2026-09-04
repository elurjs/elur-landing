---
title: Conditional rendering
description: Show and hide content with function interpolations.
section: State
order: 2
starterCode: "function App() {\n  const show = signal(false);\n\n  return html`\n    <button @click=${() => show.value = !show.value}>\n      ${() => show.value ? \"Hide\" : \"Show\"}\n    </button>\n    <p>The message goes here.</p>\n  `;\n}\n"
solutionCode: "function App() {\n  const show = signal(false);\n\n  return html`\n    <button @click=${() => show.value = !show.value}>\n      ${() => show.value ? \"Hide\" : \"Show\"}\n    </button>\n    ${() => show.value ? html`<p>Peek-a-boo!</p>` : null}\n  `;\n}\n"
hint: "Replace the static <p> with ${() => show.value ? html`<p>Peek-a-boo!</p>` : null}"
---

# Conditional rendering

A function interpolation can return a template, a string, or `null`. Returning `null` removes the content; returning a template inserts it.

## Toggle pattern

```typescript
${() => (show.value ? html`<p>Visible</p>` : null)}
```

When `show` changes, Elur re-runs the function. If it now returns `null`, the `<p>` is removed. If it returns a template, the `<p>` is inserted.

## Your task

The starter code always shows the message. Make it appear only when `show` is true.

1. Replace the static `<p>` with a function interpolation.
2. Return `html\`<p>Peek-a-boo!</p>\`` when `show.value` is true.
3. Return `null` otherwise.

:::tip
You can also return different templates: `${() => (status.value === "ok" ? html\`<p>Done</p>\` : html\`<p>Loading…</p>\`)}`.
:::
