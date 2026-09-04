---
title: Lists with repeat
description: Render arrays with the repeat() helper.
section: State
order: 3
starterCode: "function App() {\n  const fruits = signal([\"apple\", \"banana\", \"cherry\"]);\n\n  return html`\n    <ul>\n      <li>item</li>\n    </ul>\n    <button @click=${() => fruits.value = [...fruits.value, \"date\"]}>Add date</button>\n  `;\n}\n"
solutionCode: "function App() {\n  const fruits = signal([\"apple\", \"banana\", \"cherry\"]);\n\n  return html`\n    <ul>\n      ${() => repeat(fruits.value, (item) => item, (item) => html`<li>${item}</li>`)}\n    </ul>\n    <button @click=${() => fruits.value = [...fruits.value, \"date\"]}>Add date</button>\n  `;\n}\n"
hint: "Use ${() => repeat(fruits.value, (item) => item, (item) => html`<li>${item}</li>`)} inside the <ul>."
---

# Lists with repeat

To render an array, use the `repeat()` helper. It takes three arguments: the items array, a key function, and a render function. Wrap the call in a reactive interpolation `${() => ...}` so it re-runs when the array changes.

## Signature

```typescript
repeat(items, keyFn, renderFn)
```

- `items` — an array (read the signal inside a `${() => ...}` interpolation).
- `keyFn` — returns a unique key for each item (used for efficient updates).
- `renderFn` — returns a template for each item.

## Example

```typescript
${() => repeat(
  fruits.value,
  (fruit) => fruit,
  (fruit) => html`<li>${fruit}</li>`
)}
```

## Your task

Replace the static `<li>item</li>` with a `repeat()` call that renders each fruit. Then click "Add date" to see the list update.

:::warning
The key function must return a stable, unique value per item. Using the index as a key works for static lists but can cause issues with reordering. Prefer a real id.
:::
