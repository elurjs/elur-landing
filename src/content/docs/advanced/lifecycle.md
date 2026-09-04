---
title: Lifecycle
description: ElurComponent lifecycle hooks — onInit, onMount, onUnmount, onError, and onServerRender.
section: Advanced
order: 3
---

# Lifecycle

Elur components are classes that extend `ElurComponent`. Because components run
once (they are not re-rendered), the lifecycle is simple: there's **init**,
**mount**, and **unmount** — no "update" phase. Reactivity is handled by
signals, not by re-running the component.

## The `ElurComponent` class

Every component extends `ElurComponent` and implements a `render()` method.
Lifecycle hooks are optional overrides:

```typescript
import { ElurComponent, signal, html } from "@elurjs/core";

class Counter extends ElurComponent {
  private count = signal(0);

  override render() {
    return html`
      <button @click=${() => this.count.update((n) => n + 1)}>
        ${() => this.count.value}
      </button>
    `;
  }
}

mount(new Counter(), "#app");
```

## Lifecycle hooks

| Hook | When it runs | DOM available? | Can return |
| --- | --- | --- | --- |
| `onInit()` | Before `render()`, once | No | — |
| `onServerRender()` | During SSR, after `onInit()` (never on client) | No | — |
| `onMount()` | After the template is inserted into the DOM | Yes | A cleanup function |
| `onUnmount()` | Before the component is removed from the DOM | Yes | — |
| `onError(err)` | When `onInit` or `onMount` throws | — | — |

### `onInit()`

Called once before `render()`. This is where you call `provide()` to register
context values and set up any state that `render()` depends on. There is no DOM
yet:

```typescript
class App extends ElurComponent {
  private theme = signal("dark");

  override onInit() {
    provide(ThemeKey, {
      theme: this.theme,
      toggle: () => this.theme.update((t) => t === "dark" ? "light" : "dark"),
    });
  }

  override render() {
    return html`<div>${this.children}</div>`;
  }
}
```

### `onMount()`

Called once after the rendered template is inserted into the DOM. This is where
you access DOM elements (via refs), set up intervals, add event listeners, or
start fetches. If you return a function, it is called as cleanup on unmount:

```typescript
class Timer extends ElurComponent {
  private seconds = signal(0);

  override onMount() {
    const id = setInterval(() => this.seconds.update((n) => n + 1), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }

  override render() {
    return html`<p>Elapsed: ${() => this.seconds.value}s</p>`;
  }
}
```

:::tip
The cleanup function returned from `onMount` is the equivalent of a separate
`onCleanup` hook — there is no standalone `onCleanup`. Return the teardown
logic directly.
:::

### `onUnmount()`

Called right before the component is removed from the DOM. Use it for any
final cleanup that wasn't covered by the `onMount` return value:

```typescript
class Modal extends ElurComponent {
  override onMount() {
    document.body.style.overflow = "hidden";
  }

  override onUnmount() {
    document.body.style.overflow = "";
  }

  override render() {
    return html`<div class="modal">${this.children}</div>`;
  }
}
```

### `onError(err)`

If `onInit()` or `onMount()` throws, `onError(err)` is invoked with the error.
If no `onError` is defined, the error propagates up. Use it to render a fallback
or log to an error service:

```typescript
class RiskyComponent extends ElurComponent {
  override onError(err: unknown) {
    console.error("Component failed:", err);
  }

  override render() {
    return html`<p>Content</p>`;
  }
}
```

### `onServerRender()`

A server-only hook that runs during SSR after `onInit()` and before `render()`.
It never runs on the client. Use it for server-specific setup like seeding
initial data or reading request-scoped values:

```typescript
class ServerOnly extends ElurComponent {
  override onServerRender() {
    // Runs only during renderToString / renderToChunks
  }

  override render() {
    return html`<p>Hello</p>`;
  }
}
```

## Combining with effects

Effects created inside `onMount` are automatically cleaned up when you return
their dispose function:

```typescript
class SearchBox extends ElurComponent {
  private query = signal("");

  override onMount() {
    const stop = effect(() => {
      console.log("Query:", this.query.value);
    });
    return stop; // disposed on unmount
  }

  override render() {
    return html`<input @input=${(e: Event) => this.query.value = (e.target as HTMLInputElement).value} />`;
  }
}
```

:::warning
Don't create effects in `render()`. `render()` runs once and sets up the
template — effects belong in `onMount` so their lifecycle is tied to the
component. Always return the effect's dispose function so it's cleaned up.
:::

## Slots and children

Components receive child content through the `children` property or named slots.
Set them from the parent via `setChildren()` / `setSlot()`:

```typescript
class Card extends ElurComponent {
  override render() {
    return html`
      <div class="card">
        <div class="card-body">${this.children}</div>
      </div>
    `;
  }
}

const card = new Card();
card.setChildren(html`<p>Hello from the parent</p>`);
mount(card, "#app");
```

### `ElurChildren` type

The `children` property and `setChildren()` accept `ElurChildren` — a union
of `ElurTemplate`, `ElurComponent`, `null`, `undefined`, or an array of
those:

```typescript
type ElurChildren =
  | ElurTemplate
  | ElurComponent
  | null
  | undefined
  | ElurChildren[];
```

This lets you pass a single child, multiple children, or nothing:

```typescript
card.setChildren(html`<p>One child</p>`);
card.setChildren([html`<p>First</p>`, html`<p>Second</p>`]);
card.setChildren(null); // no children
```

## Common patterns

### Fetch on mount

```typescript
class UserProfile extends ElurComponent {
  private user = signal<any>(null);
  private loading = signal(true);

  override onMount() {
    fetch("/api/user/1")
      .then((r) => r.json())
      .then((data) => {
        this.user.value = data;
        this.loading.value = false;
      });
  }

  override render() {
    return html`
      <div>
        ${() => this.loading.value
          ? html`<p>Loading…</p>`
          : html`<p>${() => this.user.value.name}</p>`}
      </div>
    `;
  }
}
```

### Event listener cleanup

```typescript
class Draggable extends ElurComponent {
  private pos = signal({ x: 0, y: 0 });

  override onMount() {
    const handleMove = (e: MouseEvent) => {
      this.pos.value = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }

  override render() {
    return html`<div style=${() => `transform: translate(${this.pos.value.x}px, ${this.pos.value.y}px)`}>Drag me</div>`;
  }
}
```

:::tip
Because Elur components run only once, there's no "re-mount" or "update"
lifecycle. Everything is set up in `onInit`/`onMount` and torn down in
`onUnmount` or via the cleanup function returned from `onMount`.
:::
