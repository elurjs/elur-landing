---
title: Ecosystem
description: Official Elur packages — Kit, Query, Ionic, Auth, and i18n.
section: Ecosystem
order: 0
---

# Ecosystem

Elur is a modular framework. The core package (`@elurjs/core`) provides
signals, templates, components, router, forms, and stores. The ecosystem
packages build on top of the core for specific use cases.

## Official packages

### [@elurjs/kit](/docs/ecosystem/kit/overview/)

Full-stack meta-framework — file-based routing, SSG/SSR, islands, content
collections, server actions, and deployment adapters.

- [Overview](/docs/ecosystem/kit/overview/)
- [Routing](/docs/ecosystem/kit/routing/)
- [SSR & Hydration](/docs/ecosystem/kit/ssr/)
- [Islands](/docs/ecosystem/kit/islands/)
- [Content Collections](/docs/ecosystem/kit/content/)
- [Deployment](/docs/ecosystem/kit/deployment/)

### [@elurjs/query](/docs/ecosystem/query/overview/)

CQRS-style data library — `createQuery` for reads, `createCommand` for
writes, caching, deduplication, optimistic updates, and offline queue.

- [Overview](/docs/ecosystem/query/overview/)
- [Queries](/docs/ecosystem/query/queries/)
- [Commands](/docs/ecosystem/query/commands/)
- [Cache & Invalidation](/docs/ecosystem/query/cache/)
- [Patterns](/docs/ecosystem/query/patterns/)

### [@elurjs/ionic](/docs/ecosystem/ionic/overview/)

Ionic bridge for Elur — native mobile components, IonRouterOutlet, page
lifecycle hooks, and Capacitor builds for iOS/Android.

- [Overview](/docs/ecosystem/ionic/overview/)
- [Navigation](/docs/ecosystem/ionic/navigation/)
- [Page Lifecycle](/docs/ecosystem/ionic/lifecycle/)
- [Capacitor Build](/docs/ecosystem/ionic/build/)

### [@elurjs/auth](/docs/ecosystem/auth/overview/)

Authentication utilities — JWT and session-cookie drivers, multi-provider
auth (credentials, OIDC, API keys), token refresh, and policy-based
authorization.

- [Overview](/docs/ecosystem/auth/overview/)
- [Providers](/docs/ecosystem/auth/providers/)
- [Policies & Guards](/docs/ecosystem/auth/policies/)

### [@elurjs/i18n](/docs/ecosystem/i18n/overview/)

Internationalization — reactive translations, pluralization, number/currency/
date formatting, async loading, namespaces, and locale detection.

- [Overview](/docs/ecosystem/i18n/overview/)
- [Translations](/docs/ecosystem/i18n/translations/)
- [Configuration](/docs/ecosystem/i18n/configuration/)

## Installation

Each package can be installed independently:

```bash
npm install @elurjs/core @elurjs/query
npm install @elurjs/core @elurjs/kit
```

All ecosystem packages depend on `@elurjs/core` as a peer dependency.

## When to use what

- **Just `@elurjs/core`** — SPAs, simple apps, components, when you don't need SSR or a build step
- **`@elurjs/kit`** — full-stack apps, SSR/SSG, file-based routing, content sites, production deployments
- **`@elurjs/query`** — apps that fetch data from APIs and need caching, deduplication, or optimistic updates
- **`@elurjs/ionic`** — hybrid mobile apps targeting iOS and Android with native UI components
- **`@elurjs/auth`** — apps that need authentication, session management, or route protection
- **`@elurjs/i18n`** — apps that need multi-language support with reactive translations
