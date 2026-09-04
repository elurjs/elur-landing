---
title: Providers
description: Multi-provider authentication — credentials, OIDC (GitHub, Google), API keys, and session cookies.
section: Elur Auth
order: 2
---

# Providers

Elur Auth supports multiple authentication providers. Register them by name
and switch between them at runtime.

## Multi-provider auth

Register multiple providers and switch between them:

```typescript
import { createAuth } from "@elurjs/auth";
import { credentialsProvider } from "@elurjs/auth/providers/credentialsProvider";
import { oidcProvider } from "@elurjs/auth/providers/oidcProvider";

const auth = createAuth({
  providers: {
    credentials: credentialsProvider({
      login: async (creds) => { /* ... */ },
    }),
    github: oidcProvider({
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      redirectUri: "/auth/callback",
      scopes: ["user:email"],
    }),
  },
  defaultProvider: "credentials",
});

// Login with credentials
await auth.login({ email: "a@b.com", password: "secret" });

// Login with GitHub
await auth.login("github", { /* OAuth params */ });
```

## Built-in providers

| Provider | Description |
| --- | --- |
| `credentialsProvider` | Email/password or custom credentials |
| `oidcProvider` | OpenID Connect (GitHub, Google, Auth0, etc.) |
| `apiKeyProvider` | API key authentication |

## Session cookie driver

For server-rendered apps (Elur Kit), use `sessionCookieDriver` to keep
tokens in httpOnly cookies:

```typescript
import { sessionCookieDriver } from "@elurjs/auth/drivers/sessionCookieDriver";

const auth = createAuth({
  driver: sessionCookieDriver({
    login: async (credentials) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(credentials),
      });
      return res.json();
    },
    logout: async () => {
      await fetch("/api/logout", { method: "POST" });
    },
  }),
  storage: cookieAdapter({ key: "session" }),
});
```

## Storage adapters

| Adapter | Description |
| --- | --- |
| `localStorageAdapter` | Browser localStorage |
| `sessionStorageAdapter` | Browser sessionStorage (per-tab) |
| `cookieAdapter` | Browser cookies |
| `memoryAdapter` | In-memory (no persistence) |

## Token refresh

Enable automatic token refresh:

```typescript
const auth = createAuth({
  driver: jwtDriver({
    login: async (creds) => { /* ... */ },
    refresh: async (session) => {
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
      });
      return res.json();
    },
  }),
  autoRefresh: true,
});
```

## Multi-tab sync

Sessions are synced across browser tabs. When you log in on one tab, all
other tabs detect the change via `storage` events.

:::tip
Always keep auth tokens in httpOnly cookies for server-rendered apps. Use
`sessionCookieDriver` with Elur Kit's server-side middleware to verify
sessions on protected routes.
:::
