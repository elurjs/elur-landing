---
title: Advanced Templates
description: Raw HTML, portals, transitions, and error boundaries.
section: Advanced
order: 4
---

# Advanced Templates

Beyond basic `html` templates, Elur core ships four specialized helpers for
common UI patterns: raw HTML insertion, portals, transitions, and error
boundaries.

## Raw HTML

`raw()` marks a string as trusted HTML. The markup is inserted verbatim —
no escaping. This is the only explicit trusted path for raw HTML:

```typescript
import { html, raw } from "@elurjs/core";

const trusted = "<strong>Hello</strong>";

html`<div>${raw(trusted)}</div>`;
```

:::warning
Only use `raw()` with sanitized or trusted content. Passing user input
through `raw()` creates an XSS vector. For user-generated content, sanitize
before calling `raw()`.
:::

`raw()` works in both SSR and client rendering. On the server the string is
emitted directly; on the client it is parsed via `template.innerHTML` and
the resulting nodes are inserted into the DOM.

## Portals

`portal()` renders content into a DOM node **outside** the current tree
position. Useful for modals, tooltips, and overlays that must escape
`overflow: hidden` or `z-index` stacking contexts:

```typescript
import { html, portal } from "@elurjs/core";

html`
  <div class="card">
    <button @click=${() => open.value = true}>Open modal</button>
    ${() => open.value
      ? portal(html`<div class="modal-overlay">…</div>`, "#modal-root")
      : null}
  </div>
`;
```

The `target` argument can be:

| Type | Behavior |
| --- | --- |
| CSS selector string | `document.querySelector(target)`, falls back to `body` |
| `Element` | Renders directly into that element |
| `PortalOutlet` | Renders into the outlet's container |
| `ElurRef` | Renders into `ref.el` |

Defaults to `document.body` if no target is provided.

### Named outlets

For decoupled portal targeting, use `createPortalOutlet()` with
`portalOutlet()`:

```typescript
import { html, createPortalOutlet, portalOutlet, portal } from "@elurjs/core";

const modalRoot = createPortalOutlet();

// In your layout:
html`<div>${portalOutlet(modalRoot)}</div>`;

// Anywhere in the tree:
portal(html`<div class="modal">…</div>`, modalRoot);
```

For cross-component outlet sharing, use `provideOutlet()` and
`injectOutlet()`:

```typescript
import { provideOutlet, injectOutlet, createPortalOutlet } from "@elurjs/core";

// Parent component (in onInit):
const outlet = createPortalOutlet();
provideOutlet(outlet);

// Descendant component:
const outlet = injectOutlet();
if (outlet) portal(html`<div>…</div>`, outlet);
```

## Transitions

`transition()` wraps content with CSS class-based enter/leave animations,
similar to Vue's `<Transition>`:

```typescript
import { html, signal, transition } from "@elurjs/core";

const visible = signal(true);

html`
  <button @click=${() => visible.value = !visible.value}>Toggle</button>
  ${transition(
    () => visible.value ? html`<p>Hello!</p>` : null,
    { name: "fade", appear: true },
  )}
`;
```

CSS classes are derived from the `name` option (default `"elur"`):

| Phase | From class | Active class | To class |
| --- | --- | --- | --- |
| Enter | `{n}-enter-from` | `{n}-enter-active` | `{n}-enter-to` |
| Leave | `{n}-leave-from` | `{n}-leave-active` | `{n}-leave-to` |

Example CSS:

```css
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-to, .fade-leave-from { opacity: 1; }
```

### Options

| Option | Default | Description |
| --- | --- | --- |
| `name` | `"elur"` | Prefix for all generated CSS classes |
| `enterFrom` | `{n}-enter-from` | Override the enter-from class |
| `enterActive` | `{n}-enter-active` | Override the enter-active class |
| `enterTo` | `{n}-enter-to` | Override the enter-to class |
| `leaveFrom` | `{n}-leave-from` | Override the leave-from class |
| `leaveActive` | `{n}-leave-active` | Override the leave-active class |
| `leaveTo` | `{n}-leave-to` | Override the leave-to class |
| `appear` | `false` | Play enter transition on first render |
| `duration` | `0` | Fallback duration in ms when CSS duration can't be detected |
| `onBeforeEnter(el)` | — | Called before enter animation starts |
| `onAfterEnter(el)` | — | Called after enter animation ends |
| `onBeforeLeave(el)` | — | Called before leave animation starts |
| `onAfterLeave(el)` | — | Called after leave animation ends |

### Static content

Static content (not a function) plays the enter animation on mount only when
`appear: true` is set:

```typescript
transition(html`<div>Appears with animation</div>`, { name: "slide", appear: true });
```

### Reactive content

A reactive function (`() => Template | null`) auto-animates: enter when the
value goes from `null` to a template, leave when it goes back to `null`:

```typescript
transition(
  () => show.value ? html`<div class="panel">Content</div>` : null,
  { name: "slide" },
);
```

## Error boundaries

`createErrorBoundary()` wraps content in an error boundary. If rendering or
a reactive update throws, the boundary tears down the broken subtree and
renders the fallback:

```typescript
import { html, createErrorBoundary } from "@elurjs/core";

const boundary = createErrorBoundary(
  html`<${RiskyComponent}>`,
  (err) => html`<div class="error">Something went wrong: ${String(err)}</div>`,
);

html`<div>${boundary}</div>`;
```

The `fallback` can be:

- A static template:

```typescript
html`<p>Error</p>`
```

- A function receiving the error:

```typescript
(err) => html`<p>${String(err)}</p>`
```

The boundary catches:

- Errors thrown during initial render of the wrapped content.
- Errors thrown in effects or reactive updates inside the wrapped content.

If the fallback itself throws, a minimal broken-state message is rendered
and the error is logged to the console.

## `showWhen(el, condition)`

`showWhen()` is a low-level helper that toggles `display: none` on an
element without unmounting it. It is used internally by the `show`/`hide`
template attributes, but you can call it directly:

```typescript
import { showWhen } from "@elurjs/core";

const el = document.getElementById("panel")!;
showWhen(el, true);  // visible
showWhen(el, false); // display: none
```

For declarative usage, prefer the `show` and `hide` template attributes
instead of calling `showWhen()` directly.

## `templateFeatures`

A read-only object that describes which template features are supported by
the currently loaded Elur core version. Used by tooling (Vite plugin, Kit)
to decide whether to apply build-time transforms or fall back to runtime
handling:

```typescript
import { templateFeatures } from "@elurjs/core";

if (templateFeatures.partialAttributeInterpolation) {
  // Core supports `class="btn ${size}"` natively — no plugin needed
} else {
  // Use @elurjs/vite-plugin-elur for partial attribute interpolation
}
```

| Feature | Default | Description |
| --- | --- | --- |
| `partialAttributeInterpolation` | `false` | Whether `class="btn ${size}"` works without a build-time compiler |

When using `@elurjs/vite-plugin-elur` (recommended), partial attribute
interpolation is handled at build time regardless of this flag.

## Types

### `KeyedList<T>`

The object returned by `repeat()`. It carries the items, the key function,
and the render function in a single opaque value:

```typescript
interface KeyedList<T = unknown> {
  readonly __isKeyedList: true;
  readonly items: T[];
  readonly keyFn: (item: T, index: number) => string | number;
  readonly renderFn: (item: T, index: number) => ElurTemplate | ElurComponent;
}
```

You rarely construct this directly — `repeat()` builds it for you.

### `ErrorFallback`

Content shown by `createErrorBoundary` when a child throws:

```typescript
type ErrorFallback =
  | ElurTemplate
  | ElurComponent
  | ((err: unknown) => ElurTemplate | ElurComponent);
```

### `TransitionContent`

Content that can be wrapped with `transition()`:

```typescript
type TransitionContent =
  | ElurTemplate
  | ElurComponent
  | (() => ElurTemplate | ElurComponent | null);
```
