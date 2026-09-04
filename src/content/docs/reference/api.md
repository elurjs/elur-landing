---
title: API Reference
description: Complete API reference for @elurjs/core — reactivity, templates, components, stores, router, forms, async, context, and SSR.
section: Reference
order: 1
---

# API Reference

This is the complete API reference for `@elurjs/core` v3.6.2. All exports are
also available via subpath imports (e.g. `@elurjs/core/signals`).

## Reactivity

### `signal(initialValue)`

Creates a reactive signal. Returns a `Signal<T>` with `.value`, `.update()`,
`.peek()`, and `.dispose()`.

```typescript
const count = signal(0);
count.value;              // read: 0
count.value = 1;          // write
count.update((n) => n + 1); // update with function
count.peek();             // read without tracking
count.dispose();          // sever all subscriptions
```

Signals use `Object.is` equality — same value means no notification. Objects
require immutable updates. `signal()` does **not** accept an options argument.

### `computed(fn, equals?)`

Creates a cached derived signal. Lazy on first read (the calculation doesn't
run until someone reads `.value`), then eager (re-runs automatically when a
dependency changes, keeping the cache up to date). The optional `equals`
(second positional argument, defaults to `Object.is`) controls when the cache
is considered unchanged:

```typescript
const doubled = computed(() => count.value * 2);
const rounded = computed(() => Math.floor(price.value), (a, b) => a === b);
doubled.value; // read (cached)
```

### `effect(fn)`

Runs `fn` immediately and re-runs it whenever a read signal changes. Returns a
dispose function. If `fn` returns a function, it's called as cleanup before
each re-run and on disposal:

```typescript
const stop = effect(() => console.log(count.value));
stop(); // dispose
```

### `batch(fn)`

Groups signal writes so dependents are notified once after the batch completes:

```typescript
batch(() => {
  a.value = 1;
  b.value = 2;
}); // effects run once
```

### `watch(source, callback, options?)`

Observes a signal or getter and calls `callback(newValue, oldValue)` on each
change. Returns a dispose function.

```typescript
watch(count, (next, prev) => console.log(next, prev));
watch(() => count.value * 2, (next) => console.log(next), { immediate: true, once: false });
```

**`WatchOptions`:** `immediate?: boolean`, `once?: boolean`.

### `untrack(fn)`

Runs `fn` without subscribing to any signals read inside it:

```typescript
const value = untrack(() => someSignal.value);
```

### `nextTick(fn?)`

Returns a promise that resolves on the next microtask. Accepts an optional
callback:

```typescript
await nextTick();
nextTick(() => console.log("DOM updated"));
```

## Templates

### `html\`...\``

Tagged template literal for creating DOM templates. Returns an `ElurTemplate`
with a `.mount(selectorOrElement)` method.

```typescript
const tpl = html`<div>${() => count.value}</div>`;
tpl.mount("#app");
```

**Interpolation:**

- `${value}` — static value (string, number, template).
- `${() => value}` — reactive function (re-evaluated on dependency change).
- `${array}` — array of values/templates.

**Attributes:**

- `attr=${value}` — static attribute (set once).
- `attr=${() => value}` — reactive attribute (must cover entire value).
- `@event=${handler}` — event listener.
- `@event.stop.prevent=${handler}` — event with modifiers.
- `ref=${refObj}` — assigns the DOM element to `refObj.el`.
- `show=${() => cond}` — toggles `display: none` based on truthiness.
- `hide=${() => cond}` — opposite of `show`.

### `repeat(items, keyFn, renderFn)`

Efficient keyed list rendering with reconciliation:

```typescript
repeat(
  items.value,
  (item, index) => item.id,
  (item, index) => html`<li>${item.text}</li>`
)
```

### `ref()`

Creates a DOM element reference. The element is stored in `.el` (not `.value`):

```typescript
const el = ref<HTMLInputElement>();
html`<input ref=${el} />`;
el.el; // HTMLInputElement | null
```

### `showWhen(el, condition)`

Toggles `display` on an element without unmounting it. Used internally by
template directives.

### `raw(htmlString)`

Inserts a raw HTML string without escaping. Use only with trusted content.

### `portal(content, target?)`

Renders content into a DOM node outside the current tree (modals, tooltips).
`target` can be a CSS selector, Element, `PortalOutlet`, or `ElurRef`.
Defaults to `document.body`.

```typescript
portal(html`<div class="modal">…</div>`, "#modal-root")
```

### `createPortalOutlet()` / `portalOutlet(outlet)` / `provideOutlet(outlet)` / `injectOutlet()`

Portal outlet management. `createPortalOutlet()` creates a named outlet;
`portalOutlet()` renders its content; `provideOutlet`/`injectOutlet` share
outlets via context.

### `createErrorBoundary(content, fallback)`

Wraps `content` in an error boundary. If rendering or a reactive update throws,
the boundary tears down the broken subtree and renders `fallback`.

```typescript
createErrorBoundary(html`<${MyComponent}>`, (err) => html`<p>Error: ${err}</p>`)
```

### `transition(content, options?)`

Animated transitions for entering/leaving elements. `content` can be static
or a reactive function returning a template or `null`.

```typescript
transition(
  () => visible.value ? html`<div>…</div>` : null,
  { name: "fade", appear: true }
)
```

`TransitionOptions`: `name?` (prefix, default `"elur"`), `enterFrom?`,
`enterActive?`, `enterTo?`, `leaveFrom?`, `leaveActive?`, `leaveTo?`,
`appear?`, `duration?` (fallback ms), `onBeforeEnter?`, `onAfterEnter?`,
`onBeforeLeave?`, `onAfterLeave?`.

## Components

### `ElurComponent`

Base class for components with lifecycle hooks:

```typescript
class MyComponent extends ElurComponent {
  override onInit() { /* before render, no DOM */ }
  override onMount() { /* after DOM insertion; return cleanup fn */ }
  override onUnmount() { /* before removal */ }
  override onError(err) { /* catch onInit/onMount errors */ }
  override onServerRender() { /* SSR only */ }
  override render() { return html`...`; }
}
```

Methods: `setChildren(content)`, `setSlot(name, content)`, `slot(name)`.

### `mount(component, container, options?)`

Mounts an `ElurTemplate` or `ElurComponent` into the DOM. Returns
`{ unmount() }`.

```typescript
mount(new App(), "#app", { router });
mount(html`<h1>Hello</h1>`, document.body);
```

**`MountOptions`:** `router?: Router`.

### `isElurComponent(value)`

Type guard that returns `true` if the value is an `ElurComponent` instance:

```typescript
import { isElurComponent } from "@elurjs/core";

if (isElurComponent(value)) {
  value.onMount(); // TypeScript narrows to ElurComponent
}
```

### `ElurMountHandle`

The return type of `mount()`:

```typescript
interface ElurMountHandle {
  unmount(): void;
}
```

## Stores

### `createStore(initialState, options?)`

Creates a reactive store. Each state key becomes a `Signal`.

```typescript
const store = createStore({ count: 0 }, {
  name: "counter",
  actions: (s) => ({ increment: () => s.count.value++ }),
  getters: (s) => ({ doubled: computed(() => s.count.value * 2) }),
  plugins: [persistPlugin("counter")],
});
```

**`CreateStoreOptions`:** `name?`, `actions?`, `getters?`, `plugins?`, `serialize?`.

Store `$` API: `$id`, `$state`, `$snapshot()`, `$stateSignal`, `$reset()`,
`$patch(partial)`, `$watch(cb, opts?)`, `$dispose()`.

### `StoreSignals<T>`

The type that the `actions` and `getters` factories receive — a record of
`Signal<T[K]>` for each key `K` in the state:

```typescript
type StoreSignals<T> = {
  readonly [K in keyof T]: Signal<T[K]>;
};
```

### `ElurPlugin<T, A, G>`

```typescript
type ElurPlugin<T, A, G> = (store: Store<T, A, G>) => (() => void) | void;
```

See [Stores > Writing a custom plugin](/docs/state/stores/#writing-a-custom-plugin)
for examples.

### Plugins

- `persistPlugin(storageKey, opts?)` — sync to localStorage (or custom adapter).
- `loggerPlugin(opts?)` — log state transitions with diffs.
- `guardPlugin(guards)` — validate/transform state before `$patch`/`$reset`.
- `bridgePlugin(sourceStore, sync)` — sync data between two stores.

## Router

### `createRouter(routes, options?)`

Creates a client-side router from an array of route records:

```typescript
const router = createRouter([
  { path: "/", component: () => new Home() },
  { path: "/users/:id", name: "user", component: () => new UserPage(), beforeEnter: guard },
]);
```

**`RouteRecord`:** `path`, `component?`, `name?`, `meta?`, `children?`, `beforeEnter?`.
**`RouterOptions`:** `base?`, `mode?` (`"history" | "hash"`), `scrollBehavior?`.

`Router` members: `current` (Signal), `params` (Signal), `query` (Signal),
`intent` (Signal), `canGoBack` (Signal), `navigate()`, `replace()`, `back()`,
`forward()`, `go()`, `isActive()`, `resolve()`, `beforeEach()`, `afterEach()`.

### `RouterView`

Class component that renders the matched route's component. Updates
automatically on navigation. Constructor: `new RouterView(depth?, router?)`.

```typescript
html`<main>${new RouterView()}</main>`;
```

### `Link`

Class component that renders an anchor tag and navigates via the router
instead of a full page reload. Constructor: `new Link(to, label, router?)`.

```typescript
html`<nav>${new Link("/about", "About")}</nav>`;
```

### `elurRouter()`

Retrieves the active router from within a component (via context injection).

## Forms

### `createForm(initialValues, options?)`

Creates a managed form with reactive fields, validation, and submit handling.

```typescript
const form = createForm({ email: "", password: "" }, {
  validators: { email: [required(), email()], password: [minLength(8)] },
  validateOn: "blur",
});
```

**`FormOptions`:** `validators?`, `validateOn?` (`"blur" | "input" | "submit"`),
`validate?` (schema-level, e.g. Zod).

`FormState` members: `fields`, `values`, `errors`, `valid`, `canSubmit`,
`dirty`, `touched`, `isSubmitting`, `submitCount`, `handleSubmit()`, `reset()`,
`setValue()`, `setValues()`, `setErrors()`, `dispose()`.

### `elurField(initialValue, validators?, validateOn?, getAllValues?)`

Creates a standalone reactive field. Returns a `FieldState<T>`.

### `elurFieldArray(initialItems, validators?, validateOn?)`

Creates a dynamic list of field groups. Returns a `FieldArrayState<T>`.

### Validators

`required(message?)`, `minLength(n, message?)`, `maxLength(n, message?)`,
`email(message?)`, `pattern(regex, message?)`, `min(n, message?)`,
`max(n, message?)`, `createValidator(fn)`, `extendValidators(base, ext)`.

## Async

### `suspend(asyncFn, renderFn, options?)`

Runs an async function and renders based on its state (pending/resolved/error).
Returns an `ElurComponent`.

```typescript
suspend(
  () => fetch("/api/data").then((r) => r.json()),
  (data) => html`<pre>${JSON.stringify(data)}</pre>`,
  { fallback: html`<p>Loading…</p>`, cacheKey: "data", staleTime: 60_000 }
);
```

**`SuspenseOptions`:** `fallback?`, `errorFallback?`, `resetOnRefresh?`,
`invalidate?`, `cacheKey?`, `staleTime?`.

### `lazy(importFn, options?)`

Wraps a dynamic `import()` for lazy-loading components. Returns a factory
function that produces an `ElurComponent`. The second argument accepts either
an `ElurTemplate` (used as fallback) or a `LazyOptions` object.

```typescript
const Admin = lazy(() => import("./Admin"), html`<p>Loading…</p>`);
html`<main>${Admin()}</main>`;
```

**`LazyOptions`:** `selector?: (mod) => Constructor`, `fallback?: ElurTemplate`.

## Context (Dependency Injection)

### `createInjectionKey(description?)`

Creates a typed `InjectionKey<T>` (a symbol with an optional description).

### `provide(key, value)`

Registers a value for descendant components. Must be called inside `onInit()`
of an `ElurComponent`.

### `inject(key, defaultValue?)`

Retrieves a value provided by an ancestor. Call during `onInit` or `render`.

## SSR & Hydration

### `renderToString(value, options?)`

Renders a template or `ElurComponent` to an HTML string. Returns a `Promise<string>`.

```typescript
import { renderToString } from "@elurjs/core/server";

const html = await renderToString(template, {
  markers: "hydration", // include hydration markers
  onError: (err, info) => console.error(info.context, err),
});
```

**`ServerRenderOptions`:** `markers?: "none" | "hydration"`, `signal?: AbortSignal`,
`context?: unknown`, `onError?: (error, info: RenderErrorInfo) => void`.

### `renderToChunks(value, options?)`

Streams a template or component as incremental `RenderChunk` objects (for
streaming SSR). Returns an `AsyncIterable<RenderChunk>`.

### `createServerRenderScope(options?)`

Creates an isolated render scope with its own `AbortController` and context
isolation. Concurrent renders from the same scope never share
`provide`/`inject` state. The scope exposes `render()`, `renderToChunks()`,
and `abort()`.

```typescript
import { createServerRenderScope } from "@elurjs/core/server";

const scope = createServerRenderScope({
  markers: "hydration",
  onError: (error, info) => console.error(info.context, error),
});

const html = await scope.render(template);
const stream = scope.renderToChunks(template);
scope.abort(); // cancel all renders in this scope
```

### `ServerRenderScope`

```typescript
interface ServerRenderScope {
  readonly signal: AbortSignal;
  render(value: unknown, options?: { markers?: boolean }): Promise<string>;
  renderToChunks(value: unknown, options?: { markers?: boolean }): AsyncIterable<RenderChunk>;
  abort(reason?: unknown): void;
}
```

### `RenderChunk`

```typescript
interface RenderChunk {
  type: "markup" | "boundary-start" | "boundary-end" | "error" | "done";
  value: string;
  index: number;
}
```

### `hydrate(value, container, options?)`

Hydrates server-rendered HTML on the client, attaching event listeners and
reactive subscriptions without re-rendering.

```typescript
import { hydrate } from "@elurjs/core/hydrate";

hydrate(template, document.getElementById("app")!, {
  mismatch: "remount", // "throw" | "warn-remount" | "remount"
});
```

**`HydrateOptions`:** `mismatch?: "throw" | "warn-remount" | "remount"`,
`onMismatch?: (error: HydrationMismatch) => void`, `context?: unknown`.

## Devtools

### `enableDevTools(options?)`

Enables Elur's devtools panel (signal/component/router inspection). Returns
`{ disable: () => void }`.

**`DevToolsOptions`:** `refreshMs?: number`, `historyLimit?: number`,
`initiallyOpen?: boolean`, `position?: "bottom-right" | "bottom-left"`.

### `disableDevTools()`

Disables the devtools panel and cleans up.

## Template utilities

### `isElurTemplate(value)`

Type guard: returns `true` if `value` is an Elur template (has the
`__isElurTemplate` marker). Useful when building abstractions over template
values:

```typescript
import { isElurTemplate } from "@elurjs/core";

if (isElurTemplate(result)) {
  result.mount("#app");
}
```

### `isKeyedList(value)`

Type guard: returns `true` if `value` is a `KeyedList` produced by `repeat()`.

### `sanitizeUrl(raw)`

Sanitizes a URL for safe use in `href`, `src`, `action` and other URL
attributes. Strips control characters, checks the scheme, and returns `""`
for dangerous schemes (`javascript:`, `vbscript:`, `data:text/html`, …).
Safe raster image data URIs (`data:image/png`, …) are allowed through.

```typescript
import { sanitizeUrl } from "@elurjs/core";

sanitizeUrl("https://example.com"); // → "https://example.com"
sanitizeUrl("javascript:alert(1)"); // → "" (warns)
sanitizeUrl("data:image/png;base64,..."); // → unchanged
```

### `isUrlAttrName(name)`

Returns `true` if `name` is a URL-carrying attribute (`href`, `src`, `action`,
`formaction`, `xlink:href`, …). Used internally to decide whether to run
`sanitizeUrl` on a bound attribute value.

### `isExecutableAttrName(name)`

Returns `true` if `name` is an attribute that turns its value into executable
code (`on*` handlers, `srcdoc`). In idiomatic Elur, events use `@click`
syntax (handled as event bindings, never as attributes), so an `on*`
attribute binding is almost always a mistake. Used only to emit a warning.

## Internal symbols

These are exported for tooling and advanced integrations. You normally never
use them directly in application code.

### `ELUR_TEMPLATE_DESCRIPTOR`

```typescript
const ELUR_TEMPLATE_DESCRIPTOR: unique symbol = Symbol.for("@elurjs/core/template-descriptor");
```

Symbol key under which a template stores its render descriptor. Used by the
SSR and hydration protocols to inspect template structure.

### `ELUR_RENDER_PROTOCOL`

```typescript
const ELUR_RENDER_PROTOCOL: unique symbol = Symbol.for("@elurjs/core/render-protocol");
```

Symbol key for the render protocol object attached to values that implement
a custom render path (DOM, SSR, hydration). The protocol exposes
`renderDom`, `renderServer`, and `hydrateDom` methods.

## Subpath exports

| Path | Key exports |
| --- | --- |
| `@elurjs/core` | Everything |
| `/signals` | `signal`, `effect`, `computed`, `batch`, `watch`, `untrack`, `nextTick` |
| `/template` | `html`, `repeat`, `raw`, `ref`, `portal`, `createErrorBoundary`, `transition`, `showWhen`, `templateFeatures` |
| `/component` | `ElurComponent`, `mount` |
| `/lifecycle` | `ElurComponent`, `ElurChildren` |
| `/store` | `createStore`, `Store`, `ElurPlugin` |
| `/plugins` | `persistPlugin`, `loggerPlugin`, `guardPlugin`, `bridgePlugin` |
| `/router` | `createRouter`, `RouterView`, `Link`, `elurRouter`, `RouterKey` |
| `/async` | `suspend`, `lazy` |
| `/context` | `provide`, `inject`, `createInjectionKey` |
| `/form` | `elurField`, `elurFieldArray`, `createForm`, validators, `createValidator`, `extendValidators` |
| `/hydrate` | `hydrate` |
| `/server` | `renderToString`, `renderToChunks`, `createServerRenderScope` |
| `/devtools` | `enableDevTools`, `disableDevTools` |
