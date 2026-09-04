---
title: Policies & Guards
description: Authorization policies, can/authorize checks, and route guards with Elur Kit middleware.
section: Elur Auth
order: 3
---

# Policies & Guards

Elur Auth provides policy-based authorization for fine-grained access control.

## Creating a policy

Policies evaluate whether a user can perform an action:

```typescript
import { createAuth, createPolicy } from "@elurjs/auth";

const adminPolicy = createPolicy({
  evaluate: (user, action) => {
    if (!user) return { allow: false, redirect: "/login" };
    if (action === "admin") {
      return user.roles?.includes("admin") ?? false;
    }
    return true;
  },
});

auth.attachPolicy(adminPolicy);
```

## `can()` and `authorize()`

### `can(action, ctx?)`

Returns a `Signal<boolean>` for reactive permission checks:

```typescript
// In a template:
html`<button disabled=${() => !auth.can("admin").value}>Admin action</button>`;

// In an effect:
effect(() => {
  if (auth.can("edit", { resource: "post-1" }).value) {
    // enable edit mode
  }
});
```

### `authorize(action, ctx?)`

Returns a `Signal<{ allow: boolean, redirect?: string }>` with the full
policy decision including a redirect URL:

```typescript
effect(() => {
  const decision = auth.authorize("admin").value;
  if (!decision.allow && decision.redirect) {
    router.navigate(decision.redirect);
  }
});
```

## Multiple policies

Attach multiple policies — they're evaluated in order:

```typescript
const rolePolicy = createPolicy({
  evaluate: (user, action) => {
    if (!user) return { allow: false, redirect: "/login" };
    return user.roles?.includes(action) ?? false;
  },
});

const ownershipPolicy = createPolicy({
  evaluate: (user, action, ctx) => {
    if (action === "edit" && ctx?.ownerId !== user?.id) {
      return { allow: false, redirect: "/forbidden" };
    }
    return true;
  },
});

auth.attachPolicy(rolePolicy);
auth.attachPolicy(ownershipPolicy);
```

## Route guards (Elur Kit)

In Elur Kit, use middleware to protect routes:

```typescript
// src/middleware.ts
import { defineMiddleware } from "@elurjs/kit";

export default defineMiddleware(async (ctx, next) => {
  if (ctx.path.startsWith("/login")) return next();

  const session = await getSession(ctx.request);
  if (!session) {
    return Response.redirect(new URL("/login", ctx.request.url));
  }

  return next();
});
```

## Route-level guards with the core router

Use `beforeEnter` guards with the core router:

```typescript
import { createRouter } from "@elurjs/core";
import { auth } from "../stores/auth";

const requireAuth = (to: string) => {
  if (!auth.isAuthenticated.peek()) return "/login";
  return true;
};

const requireAdmin = (to: string) => {
  if (!auth.can("admin").peek()) return "/forbidden";
  return true;
};

const router = createRouter([
  { path: "/", component: () => new Home() },
  { path: "/login", component: () => new Login() },
  { path: "/dashboard", component: () => new Dashboard(), beforeEnter: requireAuth },
  { path: "/admin", component: () => new Admin(), beforeEnter: requireAdmin },
]);
```

:::tip
Use `peek()` instead of `.value` in guards to avoid creating reactive
dependencies. Guards run once per navigation, not reactively.
:::
