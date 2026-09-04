---
title: Navigation
description: IonRouterOutlet, back button, bottom tabs, and stack-based navigation.
section: Elur Ionic
order: 2
---

# Navigation

Elur Ionic v2 uses the **core router** from `@elurjs/core` — there is no
separate `elurIonicRouter()`. Use `elurRouter()` to access the active router
inside components.

## `IonRouterOutlet`

`IonRouterOutlet` mounts the router and renders the matched page inside an
`ion-router-outlet` element with native page transitions:

```typescript
import { createRouter, mount, ElurComponent, html } from "@elurjs/core";
import { IonRouterOutlet, setupElurIonic } from "@elurjs/ionic";

setupElurIonic({ components: ["ion-app", "ion-router-outlet", "ion-page", "ion-content"] });

class HomePage extends ElurComponent {
  override render() {
    return html`<ion-page><ion-content><h1>Home</h1></ion-content></ion-page>`;
  }
}

class DetailPage extends ElurComponent {
  private router = elurRouter();
  override render() {
    return html`<ion-page><ion-content>
      <h1>Detail: ${() => this.router?.params.value.id}</h1>
    </ion-content></ion-page>`;
  }
}

const router = createRouter([
  { path: "/", component: () => new HomePage() },
  { path: "/detail/:id", component: () => new DetailPage() },
]);

class App extends ElurComponent {
  override render() {
    return html`<ion-app>${IonRouterOutlet(router)}</ion-app>`;
  }
}

mount(new App(), "#app", { router });
```

## Back button

```typescript
import { IonBackButton, ElurComponent, html } from "@elurjs/core";

class DetailPage extends ElurComponent {
  override render() {
    return html`
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              ${IonBackButton({ text: "Home", defaultHref: "/" })}
            </ion-buttons>
            <ion-title>Detail</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content><h1>Detail</h1></ion-content>
      </ion-page>
    `;
  }
}
```

## Bottom tabs

Use `createBottomTabBar` for tab-based navigation with per-tab navigation
stacks:

```typescript
import { createBottomTabBar } from "@elurjs/ionic";

const tabs = createBottomTabBar([
  { name: "home", label: "Home", icon: "home", path: "/home" },
  { name: "search", label: "Search", icon: "search", path: "/search" },
  { name: "profile", label: "Profile", icon: "person", path: "/profile" },
]);

// Render in your layout:
html`<ion-tab-bar slot="bottom">${tabs.render()}</ion-tab-bar>`;
```

For per-tab navigation stacks, pass `tabs` to `IonRouterOutlet`:

```typescript
IonRouterOutlet(router, { tabs: ["/home", "/search", "/profile"] })
```

:::note
Elur Ionic v2 uses the core router from `@elurjs/core`. If you're migrating
from v1, replace `elurIonicRouter()` with `elurRouter()`, and `r.path.value`
with `r.current.value`.
:::
