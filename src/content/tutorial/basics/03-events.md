---
title: Events
description: Handle clicks and input with @event handlers.
section: Basics
order: 3
starterCode: "function App() {\n  const name = signal(\"world\");\n\n  return html`\n    <h1>Hello, ${() => name.value}!</h1>\n    <input placeholder=\"Type your name\" @input=${(e) => name.value = e.target.value} />\n  `;\n}\n"
solutionCode: "function App() {\n  const name = signal(\"world\");\n  const upper = signal(false);\n\n  return html`\n    <h1>Hello, ${() => upper.value ? name.value.toUpperCase() : name.value}!</h1>\n    <input placeholder=\"Type your name\" @input=${(e) => name.value = e.target.value} />\n    <button @click=${() => upper.value = !upper.value}>Toggle case</button>\n  `;\n}\n"
hint: "Add a signal `upper` and a button that toggles it. In the heading, use a ternary: upper.value ? name.value.toUpperCase() : name.value"
---

# Events

Elur uses the `@event` syntax to attach DOM listeners. The value is a handler function that receives the DOM event.

## Click

```typescript
html`<button @click=${() => count.value++}>+</button>`;
```

## Input

```typescript
html`<input @input=${(e) => (text.value = e.target.value)} />`;
```

The handler receives the event object. For inputs, `e.target.value` holds the current text.

## Your task

The starter code greets a name you type. Add a button that toggles the name between normal and UPPERCASE.

1. Create a signal `upper` starting at `false`.
2. Add a button that toggles `upper.value`.
3. In the heading, show `name.value.toUpperCase()` when `upper.value` is true, otherwise `name.value`.

:::tip
You can put any expression inside a function interpolation: `${() => (cond ? a : b)}`.
:::
