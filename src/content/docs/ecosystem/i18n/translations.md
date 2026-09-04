---
title: Translations
description: Pluralization, number/currency/date formatting, async loading, and namespaces.
section: Elur i18n
order: 2
---

# Translations

## Pluralization

Use the `n()` function for plural-aware translations. It selects the right
form based on the count and the locale's pluralization rules:

```typescript
i18n.n(0, "items");  // "You have no items"
i18n.n(1, "items");  // "You have 1 item"
i18n.n(5, "items");  // "You have 5 items"
```

In messages, define plural variants with `_one`, `_other`, `_zero` suffixes:

```typescript
const i18n = createI18n({
  locale: "en",
  messages: {
    en: {
      items_zero: "You have no items",
      items_one: "You have {count} item",
      items_other: "You have {count} items",
    },
  },
});
```

## Formatting

`@elurjs/i18n` provides formatters that respect the current locale:

```typescript
// Number formatting
i18n.nFormat(1234.56);                    // "1,234.56" (en) / "1.234,56" (es)

// Currency formatting
i18n.c(1234.56, "USD");                   // "$1,234.56" (en) / "1.234,56 US$" (es)

// Date formatting
i18n.d(new Date(), { dateStyle: "long" }); // "January 15, 2024" (en) / "15 de enero de 2024" (es)

// Relative time
i18n.rt(-1, "day");                       // "yesterday" (en) / "ayer" (es)

// List formatting
i18n.list(["Alice", "Bob", "Charlie"]);   // "Alice, Bob, and Charlie" (en)
```

## Loading translations asynchronously

Use a `backend` to load translations on demand:

```typescript
const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  backend: {
    load: async (locale) => {
      const res = await fetch(`/translations/${locale}.json`);
      return res.json();
    },
  },
});

// Translations for "fr" are loaded when you switch:
i18n.setLocale("fr");
```

## Namespaces

For large apps, split translations into namespaces:

```typescript
const i18n = createI18n({
  locale: "en",
  namespaces: ["common", "dashboard"],
  backend: {
    load: async (locale, ns) => {
      const res = await fetch(`/translations/${locale}/${ns}.json`);
      return res.json();
    },
    supportsNamespaces: true,
  },
});

const t = i18n.useNamespace("dashboard");
t("title"); // reads from the "dashboard" namespace
```

## Interpolation

Use `{name}` placeholders in messages:

```typescript
messages: {
  en: {
    greeting: "Hello, {name}!",
    items: "You have {count} items",
  },
}

i18n.t("greeting", { name: "Alice" }); // "Hello, Alice!"
i18n.t("items", { count: 5 });         // "You have 5 items"
```

## Fallback locale

When a key is missing in the current locale, the fallback locale is used:

```typescript
const i18n = createI18n({
  locale: "fr",
  fallbackLocale: "en",
  messages: {
    en: { greeting: "Hello!" },
    fr: { /* missing "greeting" */ },
  },
});

i18n.t("greeting"); // "Hello!" (falls back to English)
```
