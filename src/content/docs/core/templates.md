---
title: Templates
description: The html tagged template literal — syntax, interpolation, attributes, events, and conditionals.
section: Core
order: 1
---

# Templates

Elur uses JavaScript **tagged template literals** as its templating primitive.
The `html` tag function parses the template string at runtime, creates the DOM
nodes, and wires up reactivity. No compiler, no JSX, no special file format.

## Basic syntax

```typescript
import { html } from "@elurjs/core";

html`<h1>Hello, world!</h1>`.mount("#app");
```

The `html` tag returns an `ElurTemplate` object. Call `.mount(target)` to
insert it into the DOM.

## Text interpolation

Use `${...}` to insert dynamic values. For **reactive** values, pass a
function:

```typescript
const name = signal("Alice");

html`<p>Hello, ${() => name.value}!</p>`.mount("#app");
```

When `name` changes, only the text node updates. Static values can be
interpolated directly:

```typescript
html`<p>2 + 2 = ${2 + 2}</p>`;
```

## Attribute interpolation

For reactive attributes, the interpolation **must cover the entire attribute
value** at runtime:

```typescript
// ✅ Correct — entire value is a single interpolation
html`<div class=${() => `card ${active.value ? "active" : ""}`}>Content</div>`;

// ❌ Not supported at runtime — partial interpolation
html`<div class="card ${() => active.value}">Content</div>`;
```

Partial attribute interpolation (`class="btn ${size}"`) is handled at compile
time by `@elurjs/vite-plugin-elur`. Without the plugin, only full bindings
(`class=${value}`) are supported. This keeps the runtime parser simple and fast.

### Boolean attributes

For boolean attributes like `disabled`, `checked`, `hidden`:

```typescript
html`<button disabled=${() => loading.value}>Submit</button>`;
```

When the value is `null`, `undefined`, or `false`, the attribute is removed
entirely. Any other value (including `0` and `""`) is set as a string.

### DOM properties

For `value`, `checked`, and `selected` on form elements, Elur sets the DOM
**property** directly (not the HTML attribute). This ensures form state stays
in sync with the signal:

```typescript
html`<input value=${() => text.value} @input=${(e) => text.value = e.target.value} />`;
html`<input type="checkbox" checked=${() => done.value} />`;
```

### URL sanitization

URL attributes (`href`, `src`, `action`, `formaction`, etc.) are sanitized to
prevent `javascript:` and other dangerous protocols. This runs automatically —
no configuration needed.

## Event handling

Use the `@` prefix for event listeners:

```typescript
html`<button @click=${() => count.value++}>Increment</button>`;
```

You can use any DOM event name: `@input`, `@change`, `@submit`, `@keydown`,
`@mouseenter`, etc.

```typescript
html`<input
  @input=${(e: Event) => text.value = (e.target as HTMLInputElement).value}
/>`;
```

### Event modifiers

Append `.` modifiers to an event name to add behavior without wrapper
functions:

```typescript
// Prevent default and stop propagation
html`<form @submit.prevent=${() => save()}></form>`;

// Only fire on Enter
html`<input @keydown.enter=${() => submit()} />`;
```

Supported modifiers:

| Modifier | Effect |
| --- | --- |
| `.prevent` | Calls `e.preventDefault()` before the handler |
| `.stop` | Calls `e.stopPropagation()` before the handler |
| `.self` | Only fires if `e.target` is the element itself |
| `.enter`, `.escape`, `.space`, `.tab`, `.delete`, `.backspace`, `.up`, `.down`, `.left`, `.right` | Keyboard key filters (only fires if the matching key was pressed) |
| Single character (`.a`, `.b`, ...) | Fires only if `e.key` matches that character |

Modifiers can be combined: `@keydown.prevent.enter=${handler}`.

## Conditional rendering

Use a ternary inside a reactive interpolation. Returning `null` or `false`
removes the content; returning a template inserts it:

```typescript
html`
  ${() =>
    loading.value
      ? html`<p>Loading…</p>`
      : html`<p>Data: ${() => data.value}</p>`}
`;
```

### `show` / `hide` attributes

For showing/hiding an element **without unmounting it**, use the `show` or
`hide` attribute. These toggle `display: none` and preserve the element's
original display value:

```typescript
// Element stays in the DOM; only display is toggled
html`<div show=${() => visible.value}>Content</div>`;
html`<div hide=${() => loading.value}>Content</div>`;
```

`show` displays the element when the value is truthy; `hide` displays it when
the value is falsy. Both accept a static value or a reactive function.

## List rendering

Use `repeat()` for keyed list rendering:

```typescript
import { html, signal, repeat } from "@elurjs/core";

const items = signal([
  { id: 1, text: "Learn Elur" },
  { id: 2, text: "Build an app" },
]);

html`
  <ul>
    ${() =>
      repeat(
        items.value,
        (item) => item.id,           // key function
        (item) => html`<li>${item.text}</li>`  // render function
      )}
  </ul>
`;
```

`repeat()` performs key-based reconciliation: items that are added, removed,
or reordered are handled efficiently without re-rendering the entire list.

## Nested templates

Templates compose naturally:

```typescript
function Button(label: string, onClick: () => void) {
  return html`<button @click=${onClick}>${label}</button>`;
}

html`
  <div>
    ${Button("Save", () => save())}
    ${Button("Cancel", () => cancel())}
  </div>
`;
```

## Refs

Use `ref()` to get a direct reference to a DOM element:

```typescript
import { html, ref } from "@elurjs/core";

const inputEl = ref<HTMLInputElement>();

html`<input ref=${inputEl} placeholder="Type here" />`.mount("#app");

// Access the element after mount:
inputEl.el?.focus();
```

:::warning
Always use a function for reactive interpolations: `${() => value.value}`,
not `${value.value}`. The latter reads the signal once and never updates.
:::
