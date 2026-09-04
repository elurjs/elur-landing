---
title: Islands
description: island() directives — load, idle, visible, only, hydrateIslands, lazyIsland, and isSSR().
section: Elur Kit
order: 4
---

# Islands

Islands are the heart of Elur Kit. They are interactive components that
hydrate on the client while the rest of the page stays static HTML.

## `island()`

```typescript
import { island } from "@elurjs/kit";
import LikeButton from "../islands/LikeButton.ts";

// Hydrate immediately
island("LikeButton", LikeButton, { postId: "123" }, "load")

// Hydrate when idle
island("Comments", Comments, {}, "idle")

// Hydrate when visible (IntersectionObserver)
island("Chart", Chart, { data }, "visible")

// Client-only (no SSR)
island("Map", Map, {}, "only")
```

## Directives

| Directive | Hydration trigger | SSR? | Use for |
| --- | --- | --- | --- |
| `load` | Immediately | Yes | Default — interactive components safe on server |
| `idle` | `requestIdleCallback` | Yes | Below-the-fold, non-critical |
| `visible` | `IntersectionObserver` | Yes | Far below-the-fold, lazy widgets |
| `only` | Immediately | **No** | Browser-only: carousels, charts, third-party widgets |

## Client-only with fallback

```typescript
// Client-only with fallback content
island("Chart", Chart, { data }, "only", {
  fallback: html`<div class="skeleton"></div>`,
})

// Client-only + hydrate when visible (more flexible than "only")
island("Chart", Chart, { data }, "visible", { ssr: false })
```

`fallback` only renders when SSR is skipped. If the component renders
successfully on server, fallback is ignored.

## `hydrateIslands()`

Register islands in the client entry:

```typescript
// src/entry-client.ts
import { hydrateIslands } from "@elurjs/kit/island";
import LikeButton from "./islands/LikeButton";

hydrateIslands({ LikeButton });
```

Or let `build()` auto-generate the entry from `src/islands/`:

```typescript
await build({
  appDir: "./src/app",
  outDir: "./dist",
  islandsDir: "./src/islands",
  generatedEntry: "./.elur/entry-client.ts",
});
```

## `lazyIsland()`

Lazy-load an island on demand:

```typescript
import { lazyIsland } from "@elurjs/kit/island";

const HeavyChart = lazyIsland(() => import("../islands/HeavyChart"));
```

## `isSSR()`

Guard environment reads (`matchMedia`, `localStorage`) during SSR:

```typescript
import { isSSR } from "@elurjs/kit";

if (!isSSR()) {
  // Only runs in the browser
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
}
```

:::warning
`isSSR()` only guards environment reads. It is **not** the same as
`directive: "only"`. DOM queries of own children need `ElurComponent.onMount()`
+ `ref`.
:::

## Auto-generated entry naming

When `build()` auto-generates the entry from `src/islands/`, each `.ts` file
becomes an island whose registry name is its path relative to `islandsDir`:

```text
src/islands/LikeButton.ts      → "LikeButton"
src/islands/nav/MobileMenu.ts  → "nav/MobileMenu"
```

Generated entry:

```typescript
// AUTO-GENERATED — do not edit
import { hydrateIslands } from "@elurjs/kit/island";
import LikeButton_0 from "../src/islands/LikeButton";
import MobileMenu_1 from "../src/islands/nav/MobileMenu";

hydrateIslands({
  "LikeButton": LikeButton_0,
  "nav/MobileMenu": MobileMenu_1,
});
```

## `scanIslands(dir)`

Lower-level helper for scanning islands, exported from `@elurjs/kit`:

```typescript
import { scanIslands } from "@elurjs/kit";

const islands = await scanIslands("./src/islands");
// [{ name: "LikeButton", filePath: "..." }, ...]
```

## Gotchas

1. **Island SSR crash?** Use `directive: "only"` or `options: { ssr: false }`.
   Don't suppress the error — fix it.
2. **`isSSR()` is not `"only"`.** It only guards environment reads. DOM
   queries of own children need `ElurComponent.onMount()` + `ref`.
3. **`fallback` only renders when SSR is skipped.** If the component renders
   successfully on server, fallback is ignored.
4. **`build()` scans `src/app/`.** Files outside the app dir are not routes.
   API routes use `route.ts`, not `page.ts`.

## Types

### `IslandDirective`

```typescript
type IslandDirective = "load" | "idle" | "visible" | "only";
```

### `IslandOptions`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `ssr` | `boolean?` | `true` (or `false` if `directive === "only"`) | Whether to execute the component on the server |
| `fallback` | `ElurTemplate \| string?` | `""` | Content when SSR is skipped or component returns null |

### `IslandComponent<TProps>`

```typescript
interface IslandComponent<TProps = unknown> {
  (props: TProps): ElurTemplate | null | false | undefined;
}
```

### `IslandRegistry`

The registry passed to `hydrateIslands` — maps island names to their
components or lazy loaders:

```typescript
type IslandRegistry = Record<string, IslandComponent | { load: () => Promise<IslandComponent> }>;
```

## `generateClientEntry(options)`

Generates the client entry file that registers all islands and starts the
router. Called automatically by `build()` and the Vite plugin:

```typescript
import { generateClientEntry } from "@elurjs/kit";
import { scanIslands } from "@elurjs/kit";

const islands = await scanIslands("./src/islands");
await generateClientEntry({
  islands,
  outFile: "./.elur/entry-client.ts",
  hydrateImport: "@elurjs/kit/island",
  routerImport: "@elurjs/kit/router",
});
```

### `GenerateEntryOptions`

| Field | Type | Description |
| --- | --- | --- |
| `islands` | `IslandModule[]` | Islands from `scanIslands` |
| `outFile` | `string` | Absolute path for the generated entry |
| `hydrateImport` | `string?` | Import specifier for `hydrateIslands` (default `@elurjs/kit/island`) |
| `routerImport` | `string?` | Import specifier for `startClientRouter` (default `@elurjs/kit/router`) |

## `buildEntrySource(islands, outFile, hydrateImport?, routerImport?)`

Builds the source code of the client entry module as a string (without
writing to disk). Used internally by `generateClientEntry`:

```typescript
import { buildEntrySource } from "@elurjs/kit";

const source = buildEntrySource(islands, "./.elur/entry-client.ts");
```
