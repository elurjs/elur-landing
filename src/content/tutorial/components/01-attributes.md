---
title: Dynamic attributes
description: Reactive class and attribute bindings.
section: Components
order: 1
starterCode: "function App() {\n  const active = signal(false);\n\n  return html`\n    <button class=\"btn\">Click me</button>\n    <button @click=${() => active.value = !active.value}>Toggle</button>\n  `;\n}\n"
solutionCode: "function App() {\n  const active = signal(false);\n\n  return html`\n    <button class=${() => `btn ${active.value ? \"btn-active\" : \"\"}`} @click=${() => active.value = !active.value}>Click me</button>\n    <p>Status: ${() => active.value ? \"ON\" : \"OFF\"}</p>\n  `;\n}\n"
hint: "Use class=${() => `btn ${active.value ? \"btn-active\" : \"\"}`} — the whole value must be one function interpolation."
---

# Dynamic attributes

Reactive attributes work like reactive text, but with one rule: the **entire** attribute value must be a single function interpolation.

## Correct

```typescript
html`<div class=${() => `box ${active.value ? "on" : "off"}`}>...</div>`;
```

The whole string is produced by one function. When `active` changes, the function re-runs and the class is replaced.

## Wrong

```typescript
html`<div class="box ${() => active.value}">...</div>`;
```

Partial interpolation is not reactive. The static part `box` would be fine, but the dynamic part would not update.

## Your task

Make the first button's class reactive: add `btn-active` when `active` is true. Also wire the first button's own click to toggle `active`.

:::tip
Boolean attributes like `disabled` use the same pattern: `disabled=${() => isLocked.value}`. When the value is `null`, `undefined`, or `false`, the attribute is removed. Any other value (including `0` and `""`) sets it as a string.
:::
