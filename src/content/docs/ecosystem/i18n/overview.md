---
title: i18n Overview
description: Internationalization with @elurjs/i18n — reactive translations, locale switching, and basic setup.
section: Elur i18n
order: 1
---

# i18n Overview

`@elurjs/i18n` provides internationalization for Elur apps. It's built on
`@elurjs/core`'s store system, so locale changes propagate reactively through
signals — no re-render needed.

## Installation

```bash
npm install @elurjs/core @elurjs/i18n
```

## Basic setup

```typescript
import { createI18n } from "@elurjs/i18n";

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: {
      greeting: "Hello, {name}!",
      items: "You have {count} items",
    },
    es: {
      greeting: "¡Hola, {name}!",
      items: "Tienes {count} elementos",
    },
  },
});

// Reactive locale (it's a store signal):
i18n.locale.value; // "en"
```

## Using in templates

```typescript
import { html } from "@elurjs/core";

html`
  <div>
    <p>${() => i18n.t("greeting", { name: "Alice" })}</p>
    <p>${() => i18n.t("items", { count: 5 })}</p>
  </div>
`;
```

The `t()` function reads the current locale signal, so when the locale
changes, all `t()` calls in reactive interpolations re-evaluate
automatically.

## Switching locales

Use the `setLocale` action to change the language:

```typescript
html`
  <select
    value=${() => i18n.locale.value}
    @change=${(e: Event) => i18n.setLocale((e.target as HTMLSelectElement).value)}
  >
    <option value="en">English</option>
    <option value="es">Español</option>
  </select>
`;
```

## Injection (Elur Kit)

In Elur Kit, provide the i18n instance via context so any component can
access it:

```typescript
import { useI18n } from "@elurjs/i18n";

// In any component:
const i18n = useI18n();
i18n.t("greeting", { name: "World" });
```

## Next steps

- [Translations](/docs/ecosystem/i18n/translations/) — Pluralization, formatting, async loading, namespaces
- [Configuration](/docs/ecosystem/i18n/configuration/) — Persistence, locale detection, SSR
