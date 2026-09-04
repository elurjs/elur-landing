---
title: Configuration
description: Locale persistence, detection order, SSR integration, and i18n configuration options.
section: Elur i18n
order: 3
---

# Configuration

## Persistence and detection

Automatically persist the locale and detect the user's preferred language:

```typescript
const i18n = createI18n({
  locale: "en",
  persist: { key: "locale", storage: localStorage },
  detect: {
    order: ["localStorage", "navigator", "fallback"],
    storageKey: "locale",
  },
});
```

### Detection order

The `detect.order` option controls the priority of detection methods:

| Method | Source |
| --- | --- |
| `"localStorage"` | Previously saved locale from `localStorage` |
| `"navigator"` | Browser's `navigator.language` |
| `"cookie"` | Locale from a cookie |
| `"fallback"` | Use `fallbackLocale` |

The first method that returns a valid locale wins.

## SSR integration

For server-rendered apps (Elur Kit), detect the locale from the
`Accept-Language` header:

```typescript
// src/app/layout.data.ts
import type { PageDataLoad } from "@elurjs/kit";

export const load: PageDataLoad = async ({ request }) => {
  const acceptLang = request.headers.get("accept-language") ?? "en";
  const locale = acceptLang.split(",")[0].split("-")[0];
  return { initialLocale: locale };
};
```

Then initialize i18n with the detected locale:

```typescript
// src/app/layout.ts
import { createI18n } from "@elurjs/i18n";

const i18n = createI18n({
  locale: data.initialLocale,
  fallbackLocale: "en",
  messages: { /* ... */ },
});
```

## Configuration options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `locale` | `string` | — | Initial locale |
| `fallbackLocale` | `string` | — | Fallback when key is missing in current locale |
| `messages` | `Record<string, Record<string, string>>` | — | Static translations |
| `backend` | `{ load, supportsNamespaces? }` | — | Async translation loader |
| `namespaces` | `string[]` | — | Namespace list for split translations |
| `persist` | `{ key, storage }` | — | Persist locale across sessions |
| `detect` | `{ order, storageKey }` | — | Auto-detect user's preferred locale |
| `autoRefresh` | `boolean` | `false` | Re-load translations when locale changes |

## `useI18n()` in Elur Kit

Provide the i18n instance via context so any component can access it:

```typescript
import { useI18n } from "@elurjs/i18n";

// In any component:
const i18n = useI18n();
i18n.t("greeting", { name: "World" });
```

:::tip
Store the user's preferred locale in `localStorage` and restore it on page
load. Use the `Accept-Language` header on the server for the initial locale
in SSR apps.
:::
