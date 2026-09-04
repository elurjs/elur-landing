---
title: Context
description: Dependency injection with provide/inject — sharing state across the component tree without prop drilling.
section: Advanced
order: 2
---

# Context

Elur's dependency injection is built on three primitives:
`createInjectionKey`, `provide`, and `inject`. A parent component registers a
value with `provide()` inside `onInit()`, and any descendant retrieves it with
`inject()` — no prop drilling required.

## Creating an injection key

An `InjectionKey<T>` is a typed symbol. The generic `T` enforces type safety
between the provider and the consumer:

```typescript
import { createInjectionKey, signal, type Signal } from "@elurjs/core";

interface ThemeApi {
  theme: Signal<string>;
  toggle: () => void;
}

const ThemeKey = createInjectionKey<ThemeApi>("theme");
```

The optional description string shows up in devtools and error messages.

## Providing a value

`provide()` must be called inside `onInit()` of an `ElurComponent`. It stores
the value on the current component's context frame so descendants can find it:

```typescript
import { ElurComponent, signal, provide, html } from "@elurjs/core";

class ThemeProvider extends ElurComponent {
  private theme = signal("dark");

  override onInit() {
    provide(ThemeKey, {
      theme: this.theme,
      toggle: () => {
        this.theme.value = this.theme.value === "dark" ? "light" : "dark";
      },
    });
  }

  override render() {
    return html`<div data-theme=${() => this.theme.value}>${this.children}</div>`;
  }
}
```

:::warning
`provide()` throws if called outside `onInit()`. The context stack only exists
while a component is initializing — calling it in `onMount`, `render`, or
module scope will fail.
:::

## Injecting a value

Descendants call `inject()` to read the nearest provided value. The search
walks child-to-parent through the render tree:

```typescript
import { ElurComponent, inject, html } from "@elurjs/core";

class ThemedButton extends ElurComponent {
  private ctx = inject(ThemeKey);

  override render() {
    return html`
      <button
        class=${() => `btn btn-${this.ctx?.theme.value}`}
        @click=${() => this.ctx?.toggle()}
      >
        Toggle theme
      </button>
    `;
  }
}
```

If no ancestor provided the key, `inject()` returns `undefined`. You can pass a
default value as the second argument:

```typescript
const ctx = inject(ThemeKey, { theme: signal("dark"), toggle: () => {} });
```

## Passing signals for reactivity

The pattern above passes a `Signal` through context. The consumer reads
`.value` inside a reactive interpolation, so the UI updates when the signal
changes — without the provider re-rendering.

You can also pass plain (non-reactive) values for configuration that never
changes, like an API base URL or a feature flag:

```typescript
const ApiKey = createInjectionKey<string>("api-base");

class App extends ElurComponent {
  override onInit() {
    provide(ApiKey, "https://api.example.com");
  }
}

class UserList extends ElurComponent {
  private baseUrl = inject(ApiKey);

  override onMount() {
    fetch(`${this.baseUrl}/users`).then(/* ... */);
  }
}
```

## Where to call inject

`inject()` resolves against the context stack, which is live during `onInit()`
and `render()`. Call it in one of those two places — storing the result on the
instance for later use:

```typescript
class Consumer extends ElurComponent {
  private ctx = inject(ThemeKey); // ✅ field initializer runs during onInit

  override render() {
    // const ctx = inject(ThemeKey); // ✅ also valid here
    return html`<div>${() => this.ctx?.theme.value}</div>`;
  }
}
```

:::warning
Calling `inject()` inside `onMount`, event handlers, or async callbacks returns
`undefined` — the context stack has already been popped by then. Always capture
the value during `onInit` or `render`.
:::

## Use cases

- **Theming**: share the current theme signal across all components.
- **Auth**: share the current user and auth state.
- **i18n**: share the current locale and translation function.
- **Router**: the router itself is injected via this mechanism — `elurRouter()`
  is a thin wrapper around `inject(RouterKey)`.

## Context vs stores

| Feature | Context (`provide`/`inject`) | Stores (`createStore`) |
| --- | --- | --- |
| Scope | Component tree (ancestor → descendant) | Module-level singleton |
| Setup | `provide()` in `onInit()` | `createStore()` at module scope |
| Reactivity | Via signals passed as values | Built-in signals + computed |
| Best for | App-wide config set once at the top | Feature state shared broadly |

Context is best for values set once near the root of the tree and read by many
descendants. Stores are better for state that changes frequently and is shared
across unrelated components.

:::note
Context is an advanced pattern. For most apps, module-level singleton stores
(see [Stores](/docs/state/stores/)) are simpler and sufficient.
:::
