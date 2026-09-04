---
title: Auth Overview
description: Driver-based authentication with @elurjs/auth — JWT, session cookies, storage adapters, and AuthInstance API.
section: Elur Auth
order: 1
---

# Auth Overview

`@elurjs/auth` provides a driver-based authentication system for Elur apps.
It supports JWT and session-cookie drivers, credential/OIDC/API-key
providers, token refresh, multi-tab sync, and policy-based authorization.

## Installation

```bash
npm install @elurjs/core @elurjs/auth
```

## Core concepts

- **Driver**: defines how login/logout/refresh work (e.g. `jwtDriver`,
  `sessionCookieDriver`).
- **Provider**: a named driver registered for multi-provider auth (GitHub,
  Google, credentials, etc.).
- **Storage**: where the session is persisted (`localStorageAdapter`,
  `sessionStorageAdapter`, `cookieAdapter`, `memoryAdapter`).
- **Policy**: authorization rules evaluated via `can()` / `authorize()`.

## Basic setup with JWT

```typescript
import { createAuth } from "@elurjs/auth";
import { jwtDriver } from "@elurjs/auth/drivers/jwtDriver";
import { localStorageAdapter } from "@elurjs/auth/storage/localStorageAdapter";

export const auth = createAuth({
  driver: jwtDriver({
    login: async (credentials) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json(); // { token, user }
    },
    logout: async (session) => {
      await fetch("/api/logout", { method: "POST" });
    },
  }),
  storage: localStorageAdapter({ key: "auth-token" }),
  autoRefresh: true,
});
```

## `AuthInstance` members

| Member | Type | Description |
| --- | --- | --- |
| `session` | `Signal<Session \| null>` | Current session |
| `user` | `Signal<User \| null>` | Current user (derived from session) |
| `token` | `Signal<string \| null>` | Current token (from driver) |
| `isAuthenticated` | `Signal<boolean>` | True when a session exists |
| `isAnonymous` | `Signal<boolean>` | True when no session |
| `isReady` | `Signal<boolean>` | True after initial hydration |
| `isLoading` | `Signal<boolean>` | True during login/logout/refresh |
| `error` | `Signal<unknown>` | Last error |
| `activeProvider` | `Signal<string \| null>` | Current provider name |
| `login(credentials)` | `Promise<void>` | Log in with the default driver |
| `login(provider, credentials)` | `Promise<void>` | Log in with a named provider |
| `logout()` | `Promise<void>` | Destroy the session |
| `refresh()` | `Promise<void>` | Refresh the session |
| `ready()` | `Promise<void>` | Wait for initial hydration |
| `setSession(session)` | `void` | Set session programmatically |
| `clearSession()` | `void` | Clear session without calling driver |
| `can(action, ctx?)` | `Signal<boolean>` | Policy-based permission check |
| `authorize(action, ctx?)` | `Signal<{ allow, redirect? }>` | Full policy decision |

## Using in templates

```typescript
import { html, ElurComponent } from "@elurjs/core";
import { auth } from "../stores/auth";

class NavBar extends ElurComponent {
  override render() {
    return html`
      <nav>
        ${() => auth.isAuthenticated.value
          ? html`<button @click=${() => auth.logout()}>Logout</button>`
          : html`<a href="/login">Login</a>`}
      </nav>
    `;
  }
}
```

## Next steps

- [Providers](/docs/ecosystem/auth/providers/) — Multi-provider auth, credentials, OIDC, API keys
- [Policies & Guards](/docs/ecosystem/auth/policies/) — Authorization policies, route guards
