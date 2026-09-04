---
title: Router
description: Client-side routing with createRouter — routes, params, guards, RouterView, and Link.
section: State
order: 3
---

# Router

Elur includes a lightweight client-side router. It supports path parameters,
query strings, nested routes, navigation guards, named routes, and history or
hash mode.

## Basic routing

`createRouter()` takes an array of route records and returns a `Router`. Each
record has a `path` and a `component` factory:

```typescript
import { createRouter, RouterView, mount } from "@elurjs/core";
import { ElurComponent, html } from "@elurjs/core";

class Home extends ElurComponent {
  override render() { return html`<h1>Home</h1>`; }
}

class About extends ElurComponent {
  override render() { return html`<h1>About</h1>`; }
}

const router = createRouter([
  { path: "/", component: () => new Home() },
  { path: "/about", component: () => new About() },
]);

class App extends ElurComponent {
  override render() {
    return html`
      <nav>
        <a href="/" @click=${(e: Event) => { e.preventDefault(); router.navigate("/"); }}>Home</a>
        <a href="/about" @click=${(e: Event) => { e.preventDefault(); router.navigate("/about"); }}>About</a>
      </nav>
      <main>${new RouterView()}</main>
    `;
  }
}

mount(new App(), "#app", { router });
```

`RouterView` is a class component. `new RouterView()` renders the matched
route's component and updates automatically when the route changes. You can
pass a depth (for nested routes) and an explicit router as optional
constructor arguments: `new RouterView(0, router)`.

## The `Link` component

`Link` is a class component that renders an anchor tag and navigates via the
router instead of triggering a full page reload. The constructor takes
`(to, label)` as positional arguments:

```typescript
import { Link, ElurComponent, html } from "@elurjs/core";

class App extends ElurComponent {
  override render() {
    return html`
      <nav>
        ${new Link("/", "Home")}
        ${new Link("/about", "About")}
      </nav>
    `;
  }
}
```

## Accessing the router in components

Use `elurRouter()` to grab the active router from within any component. It's a
thin wrapper around `inject(RouterKey)`:

```typescript
import { ElurComponent, elurRouter, html } from "@elurjs/core";

class Nav extends ElurComponent {
  private router = elurRouter();

  override render() {
    return html`
      <button @click=${() => this.router?.navigate("/about")}>Go to About</button>
    `;
  }
}
```

## Path parameters

Route patterns with `:param` segments capture values into `router.params`:

```typescript
const router = createRouter([
  { path: "/users/:id", component: () => new UserPage() },
  { path: "/posts/:category/:slug", component: () => new PostPage() },
]);

// In a component:
class UserPage extends ElurComponent {
  private router = elurRouter();

  override render() {
    return html`<p>User ID: ${() => this.router?.params.value.id}</p>`;
  }
}
```

`router.params` is a `Signal<Record<string, string>>` — read it inside a
reactive interpolation to update when the route changes.

## Query strings

`router.query` is a `Signal<Record<string, string>>`:

```typescript
class SearchPage extends ElurComponent {
  private router = elurRouter();

  override render() {
    return html`<p>Search: ${() => this.router?.query.value.q}</p>`;
  }
}
```

You can pass query params when navigating:

```typescript
router.navigate("/search", { query: { q: "elur", page: 1 } });
// URL: /search?q=elur&page=1
```

## Navigation

```typescript
router.navigate("/about");                          // push
router.navigate("/users/42");                       // with params
router.replace("/login");                           // replace (no history entry)
router.navigate("profile", { query: { tab: "info" } }); // with query
router.back();                                      // history back
router.forward();                                   // history forward
router.go(-2);                                      // go back 2 entries
router.isActive("/about");                          // check active route
```

## Named routes

Give a route a `name` and navigate to it with params:

```typescript
const router = createRouter([
  { path: "/users/:id", name: "user", component: () => new UserPage() },
]);

router.navigate({ name: "user", params: { id: 42 } });
```

## Nested routes

Routes can have `children`. Paths are joined with the parent:

```typescript
const router = createRouter([
  {
    path: "/admin",
    component: () => new AdminLayout(),
    children: [
      { path: "", component: () => new AdminDashboard() },       // /admin
      { path: "users", component: () => new AdminUsers() },      // /admin/users
      { path: "settings", component: () => new AdminSettings() },// /admin/settings
    ],
  },
]);
```

## Navigation guards

Guards run before navigation commits. Return `false` to cancel, a string to
redirect, or `void`/`true` to allow:

```typescript
const router = createRouter([
  { path: "/", component: () => new Home() },
  { path: "/dashboard", component: () => new Dashboard(), beforeEnter: requireAuth },
]);

function requireAuth(to: string, from: string) {
  if (!isLoggedIn()) return "/login"; // redirect
  // returning void or true allows the navigation
}

// Global guards run before every navigation:
router.beforeEach((to, from) => {
  console.log(`Navigating ${from} → ${to}`);
});

// After each navigation commits:
router.afterEach((to, from) => {
  analytics.track(to);
});
```

Guards can be async — return a `Promise` that resolves to the guard result:

```typescript
async function requireAuth(to: string, from: string) {
  const ok = await checkSession();
  if (!ok) return "/login";
}
```

## Route metadata

Each record can carry arbitrary `meta` for guards, layouts, or auth checks:

```typescript
const router = createRouter([
  { path: "/", component: () => new Home(), meta: { public: true } },
  { path: "/admin", component: () => new Admin(), meta: { roles: ["admin"] } },
]);

router.beforeEach((to) => {
  const route = router.resolve(to).route;
  if (route?.meta?.roles && !hasRoles(route.meta.roles)) return "/403";
});
```

## History vs hash mode

By default the router uses the History API. Switch to hash mode for static
hosting without server rewrites:

```typescript
const router = createRouter(routes, { mode: "hash" });
```

You can also set a base path (or via a `<base>` tag in HTML):

```typescript
const router = createRouter(routes, { base: "/app" });
```

## Scroll behavior

Control scroll position on navigation with the `scrollBehavior` option. It
receives the `to` path, `from` path, and `savedPosition` (from
back/forward navigation) and returns a scroll position or `false` to skip:

```typescript
const router = createRouter(routes, {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition; // restore on back/forward
    if (to.startsWith("/docs")) return { left: 0, top: 0 }; // top on new pages
    return false; // don't scroll
  },
});
```

## Using Elur Kit's router

If you're using Elur Kit (the meta-framework), file-based routing is built in.
Create files under `src/app/`:

```text
src/app/
├── page.ts              → /
├── about/page.ts        → /about
├── users/[id]/page.ts   → /users/:id
└── docs/[...slug]/page.ts → /docs/*
```

Each `page.ts` exports a default component and optionally a `load` function
for data fetching and `generateStaticParams` for dynamic routes.

:::note
Elur Kit's router also supports client-side navigation with prefetching and
View Transitions. See the [Kit Overview](/docs/ecosystem/kit/overview/) for
more.
:::

## Types

### `RouteRecord`

```typescript
interface RouteRecord {
  path: string;
  component: () => ElurTemplate | ElurComponent;
  name?: string;
  children?: RouteRecord[];
  meta?: Record<string, unknown>;
  beforeEnter?: NavigationGuard;
}
```

### `NavigateOptions`

```typescript
interface NavigateOptions {
  query?: Record<string, string | number | boolean | null | undefined>;
  direction?: NavigationDirection;
  animation?: unknown;
}
```

### `NavigationAction`

```typescript
type NavigationAction = "push" | "replace" | "pop" | "initial";
```

### `NavigationDirection`

```typescript
type NavigationDirection = "forward" | "back" | "root" | "none";
```

### `NavigationIntent`

```typescript
interface NavigationIntent {
  action: NavigationAction;
  direction: NavigationDirection;
  animation?: unknown;
}
```

### `RouterOptions`

```typescript
interface RouterOptions {
  base?: string;
  mode?: RouterMode;
  scrollBehavior?: ScrollBehavior;
}
```

### `ResolvedRoute`

```typescript
interface ResolvedRoute {
  matched: boolean;
  params: Record<string, string>;
  route: RouteRecord | undefined;
}
```

### `NavigationGuard`

```typescript
type NavigationGuard = (
  to: string,
  from: string,
) => boolean | string | void | { redirect: string };

// Return false to cancel, a path string to redirect, or nothing to continue
```

### `NavigationGuardResult`

```typescript
type NavigationGuardResult = boolean | string | void | { redirect: string };
```

### `AfterEachHook`

```typescript
type AfterEachHook = (to: string, from: string) => void;
```

### `RouterMode`

```typescript
type RouterMode = "history" | "hash";
```

### `ScrollBehavior`

```typescript
type ScrollBehavior = (
  to: string,
  from: string,
  savedPosition: ScrollPosition | null,
) => ScrollPosition | false;
```

### `RouteLocation`

```typescript
type RouteLocation = string | NamedRouteLocation;

interface NamedRouteLocation {
  name: string;
  params?: Record<string, string>;
}
```

### `Router` interface

```typescript
interface Router {
  readonly current: Signal<string>;
  readonly params: Signal<Record<string, string>>;
  readonly query: Signal<Record<string, string>>;
  readonly base: string;
  readonly intent: Signal<NavigationIntent>;
  readonly canGoBack: Signal<boolean>;
  navigate(location: RouteLocation, options?: NavigateOptions): void;
  replace(location: RouteLocation, options?: NavigateOptions): void;
  back(animation?: unknown): void;
  forward(animation?: unknown): void;
  go(delta: number): void;
  isActive(path: string, exact?: boolean): boolean;
  resolve(path: string): ResolvedRoute;
  readonly routes: RouteRecord[];
  beforeEach(guard: NavigationGuard): () => void;
  afterEach(hook: AfterEachHook): () => void;
}
```
