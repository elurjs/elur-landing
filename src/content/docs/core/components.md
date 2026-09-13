---
title: Components
description: Functional components with defineComponent — live props, slots, lifecycle, context, and reconciliation — plus the ElurComponent class.
section: Core
order: 7
---

# Components

Elur has two ways to write a component, both built on the same instance,
lifecycle, SSR and hydration machinery:

- **`defineComponent(setup)`** — functional components with typed, *live*
  props and slots. Recommended for new code.
- **`ElurComponent`** — class-based components with lifecycle overrides.

In both models the component body runs **once per instance** — there is no
re-render. Updates flow through signals, not through re-invoking the
component.

## `defineComponent(setup)`

`defineComponent` takes a setup function that receives live `props` and a
`ctx`, and returns a template. Calling the resulting definition creates an
**invocation** — the setup itself doesn't run until the invocation is
mounted:

```typescript
import { defineComponent, signal, html, mount } from "@elurjs/core";

const Counter = defineComponent<{ initial: number }>((props, ctx) => {
  const count = signal(props?.initial ?? 0);

  return html`
    <button @click=${() => count.update((n) => n + 1)}>
      Count: ${() => count.value}
    </button>
  `;
});

mount(Counter({ initial: 10 }), "#app");
```

`Counter({ initial: 10 })` doesn't render anything — it creates a marked
invocation object. The runtime runs `setup` when the invocation mounts,
which is what gives every instance its own owner, lifecycle and cleanup
tree.

Invocations are valid anywhere a template is: inside `html` bindings, in
`repeat`, in `showWhen`, in slots, in SSR and in hydration.

## Live props

Props are *live*: every prop getter is backed by a signal. When the parent
re-evaluates a binding and produces a new invocation for the same
component, Elur **patches the props in place** — bindings that read
`props.x` update, and `setup` never re-runs:

```typescript
const Badge = defineComponent<{ label: string }>((props) => {
  // props.label is a getter backed by a signal
  return html`<span class="badge">${() => props!.label}</span>`;
});

const App = defineComponent(() => {
  const name = signal("Ana");
  // each evaluation creates a new invocation — same definition,
  // so the existing instance keeps its state and only props update
  return html`
    <div>${() => Badge({ label: name.value })}</div>
    <input @input=${(e: Event) =>
      (name.value = (e.target as HTMLInputElement).value)} />
  `;
});
```

:::warning
Because props are getters, destructure only what you read eagerly — values
captured in a local (`const l = props.label`) lose reactivity. Read
`props.x` inside bindings (`${() => props.x}`) or computeds so updates
propagate.
:::

For explicit reactive access, `ctx.propSignal("label")` returns the
underlying `Signal`.

### The `key` prop

`key` is identity, not a reactive prop. When a binding produces a new
invocation, Elur reconciles by **definition + key**:

- Same definition, same key → `updateProps` in place (state preserved).
- Same definition, different key → the instance is remounted.
- Different definition → remounted.

```typescript
// switching keys forces a fresh instance — the old one unmounts cleanly
${() => UserCard({ id: userId.value, key: userId.value })}
```

## Lifecycle

Functional components register lifecycle through `ctx` instead of class
overrides:

| `ctx` hook | When it runs | DOM available? |
| --- | --- | --- |
| `ctx.onMount(fn)` | After the template is inserted into the DOM | Yes |
| `ctx.onUnmount(fn)` | Before removal; also runs `onMount`'s cleanup | Yes |
| `ctx.onError(fn)` | When setup or `onMount` throws | — |
| `ctx.onServerRender(fn)` | During SSR only, never on the client | No |

`ctx.onMount` runs **after the DOM commit** and may return a cleanup
function, which fires on unmount:

```typescript
const Timer = defineComponent((_props, ctx) => {
  const seconds = signal(0);

  ctx.onMount(() => {
    const id = setInterval(() => seconds.update((n) => n + 1), 1000);
    return () => clearInterval(id); // cleanup on unmount
  });

  ctx.onUnmount(() => console.log("Timer removed"));

  return html`<p>Elapsed: ${() => seconds.value}s</p>`;
});
```

Everything created inside setup — signals, effects, computeds — is owned by
the component instance and disposed on unmount. Manual cleanup is only
needed for resources *outside* the reactive graph (timers, listeners,
sockets).

## Slots

A consumer passes slot content as the **second argument** of the
invocation: a record of `slot(() => ...)` markers. Inside the component,
`ctx.slot(name)` returns the marked `Slot`, and the template renderer
unwraps it:

```typescript
import { defineComponent, slot, html } from "@elurjs/core";

const Card = defineComponent((_props, ctx) => {
  return html`
    <div class="card">
      <div class="card-body">${() => ctx.slot()}</div>
      <div class="card-actions">${() => ctx.slot("actions")}</div>
    </div>
  `;
});

mount(
  Card({}, {
    default: slot(() => html`<p>Card body</p>`),
    actions: slot(() => html`<button>Save</button>`),
  }),
  "#app",
);
```

### Lexical owner

Slots render under the **owner of the parent that declared them**, not the
component that mounts them. That means `inject()` inside slot content
resolves the *declaring* parent's context — the behavior you'd expect from
nested JSX:

```typescript
const Wrapper = defineComponent((_p, ctx) => {
  provide(ThemeKey, "from-wrapper");
  return html`<div class="wrap">${() => ctx.slot()}</div>`;
});

const Root = defineComponent(() => {
  provide(ThemeKey, "from-root");
  return html`
    <main>
      ${Wrapper({}, {
        // resolves "from-root", not "from-wrapper"
        default: slot(() => Child({})),
      })}
    </main>
  `;
});
```

`ctx.slots` exposes the declared record if you need to inspect or forward
slots. `ctx.slot()` with no argument reads the `"default"` slot.

## Context and DI

`provide()` / `inject()` work inside setup — the instance is the owner, so
injected values resolve against the component's ancestors:

```typescript
const UserMenu = defineComponent((_props, ctx) => {
  const session = inject(SessionKey); // from an ancestor
  return html`<span>${() => session.user.name}</span>`;
});
```

`ctx.owner` exposes the instance owner for advanced cases
(`runWithOwner`, `getOwner`).

## Mounting

An invocation mounts anywhere a template does. For a root mount, `mount()`
accepts invocations directly, and `mountComponent()` additionally returns
the instance:

```typescript
import { mount, mountComponent } from "@elurjs/core";

mount(App({}), "#app");

const { unmount, instance } = mountComponent(App({}), container);
unmount(); // disposes the whole reactive tree
```

Unmounting is idempotent and tears down the instance's entire owner tree —
effects, computeds, cleanups and child components.

## SSR and hydration

Functional components render on the server and hydrate on the client with
no extra wiring — the invocation knows how to serialize itself and how to
adopt SSR'd DOM:

```typescript
const Clock = defineComponent((_p, ctx) => {
  ctx.onServerRender(() => {
    // server-only: seed data, read request scope
  });
  return html`<time>${() => new Date().toLocaleTimeString()}</time>`;
});
```

`ctx.onServerRender` runs during SSR (after setup, before serialization)
and never on the client — the server-side equivalent of `onMount`.

## Class components

The class model is still fully supported and shares the same machinery.
See [Lifecycle](/docs/advanced/lifecycle) for the full hook table:

```typescript
class Counter extends ElurComponent {
  private count = signal(0);

  override onMount() {
    const id = setInterval(() => this.count.update((n) => n + 1), 1000);
    return () => clearInterval(id);
  }

  override render() {
    return html`<button>${() => this.count.value}</button>`;
  }
}

mount(new Counter(), "#app");
```

## Which model should I use?

| | `defineComponent` | `ElurComponent` |
| --- | --- | --- |
| Props | Typed, live (signal-backed) | Constructor arguments |
| Slots | `slot()` markers + `ctx.slot()` | `setChildren` / `setSlot` |
| Lifecycle | `ctx.onMount` / `onUnmount` / `onError` | Method overrides |
| Reconciliation | By definition + key, props patch in place | Remount on re-eval |
| Best for | New code, reusable UI, lists, libraries | Existing codebases |

:::tip
Template factories — plain functions that return `html\`\`` — still work
and are fine for static composition. Reach for `defineComponent` when you
need props, lifecycle, context, slots or stable identity in lists.
:::
