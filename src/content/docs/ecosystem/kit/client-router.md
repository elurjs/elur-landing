---
title: Client router
description: SPA navigation — lifecycle events, data-elur-persist, network-aware prefetch, idiomorph morphing, Speculation Rules, loading indicator, and per-page JavaScript.
section: Elur Kit
order: 12
---

# Client router

The client router turns a multi-page site into an SPA without a framework
reload cycle: it intercepts internal link clicks, fetches the rendered
payload, swaps the DOM, merges `<head>`, restores scroll, and re-hydrates
islands — all with zero page flicker.

## Setup

The router ships as its own entry (`/_elur/router.js`) when the client
bundle uses split inputs — the default generated config:

```typescript
// vite.client.config.ts
rollupOptions: {
  input: {
    "entry-client": ".elur/entry-client.ts",  // islands hydration
    "router": ".elur/router.ts",              // SPA router
  },
  output: { entryFileNames: "[name].js" },
}
```

`/.elur/router.ts` is auto-generated and just calls
`startClientRouter({...})` with the flags baked in from `elur.config.ts`:

```typescript
export default defineConfig({
  router: {
    enabled: true,
    prefetch: true,
    morph: false,
    loadingIndicator: false,
    speculation: "prefetch",  // static builds only
  },
});
```

A single-input client config keeps working — the router is embedded in
`entry-client.js` (legacy combined mode). `js: "legacy"` forces that mode
explicitly.

## Per-page JavaScript

Pages only pay for what they use — the shell scans the rendered HTML for
`data-elur-island` markers:

| Page contents | `router.enabled` | Scripts emitted |
| --- | --- | --- |
| No islands | `false` | **none — 0 KB of JS** |
| No islands | `true` | `router.js` |
| Islands | `false` | `entry-client.js` |
| Islands | `true` | `entry-client.js` + `router.js` |

Every emitted module entry gets `<link rel="modulepreload">`.

## Navigation lifecycle events

```typescript
document.addEventListener("elur:navigate-start", (e) => {
  const { pathname, search, fromCache, popstate } = e.detail;
});
```

| Event | When | `detail` |
| --- | --- | --- |
| `elur:navigate-start` | Navigation begins | `{ pathname, search, fromCache, popstate }` |
| `elur:before-render` | **Before** `#app` is swapped — the old DOM is still attached | `+ persisted` (old `[data-elur-persist]` nodes) |
| `elur:rendered` | After the swap + head merge + script re-execution | `+ persisted` |
| `elur:navigate-end` | After the view transition finished | `{ pathname, search, fromCache, popstate }` |
| `elur:navigate-error` | Fetch/render failure | `{ pathname, search, fromCache, popstate, error }` |
| `elur:persist-props-changed` | Persisted island received new props | `{ name, oldProps, newProps }` on the marker |

The generated entry uses `elur:before-render` to dispose islands (except
persisted ones) and `elur:rendered` to re-hydrate. Superseded navigations
abort silently — no `navigate-error` is dispatched.

## `data-elur-persist` — surviving navigations

Give an element a persist key and the router moves the **same live DOM
node** into the new page instead of re-rendering it:

```html
<div data-elur-persist="player">
  ${island("AudioPlayer", AudioPlayer, { track }, "load")}
</div>
```

- Matched by attribute **value** (`"player"`); a bare attribute never
  persists.
- Uses `Element.moveBefore()` when available (`replaceWith` fallback).
- Islands inside keep their state — they are not disposed or re-hydrated.
- If the island's serialized props changed, `elur:persist-props-changed`
  fires on the marker.
- Great for media players, sidebars, canvases, scrollable panels.

## Prefetching

```typescript
import { prefetch } from "@elurjs/kit/router";

await prefetch("/docs/islands");
await prefetch("/heavy-page", "", { force: true });  // bypass network guards
```

- Triggers: `pointerenter`, `focus`, `pointerdown` — plus opt-in viewport
  prefetch with `data-prefetch="viewport"` (IntersectionObserver, 200 px
  margin).
- Bounded LRU cache: **32 entries**, 30 s TTL.
- Network-aware: skipped on `Save-Data` or `effectiveType`
  `2g`/`slow-2g`; `data-prefetch="always"` or `{ force: true }` overrides.
- `data-no-prefetch` on a link disables prefetching for it.

## DOM morphing (experimental)

```typescript
defineConfig({ router: { morph: true } })
```

`#app` is morphed with idiomorph instead of replaced — transient state
outside islands survives (form values, open `<details>`, element scroll).
Hydrated islands and persisted nodes are opaque to the morph. If morphing
throws, the router falls back to a normal swap automatically.

:::warning
`morph` is opt-in and experimental. Measure before adopting — it is not
the default yet.
:::

## Loading indicator

```typescript
defineConfig({ router: { loadingIndicator: true } })
```

A thin top progress bar (`#elur-loading-indicator`) appears after ~200 ms
of navigation and completes when the transition ends. Never shown on
cache hits; rendered as a static bar under `prefers-reduced-motion`.

## Speculation Rules

```typescript
defineConfig({ router: { speculation: "prefetch" } })  // or "prerender"
```

Emits `<script type="speculationrules">` with `eagerness: "moderate"` on
static and hybrid-prerendered pages — Chromium prefetches (or prerenders)
internal pages on hover intent. Safe exclusions are baked in:
`/__elur-js/*`, `a[download]`, `a[target]`, `[data-no-router]`,
`[data-no-speculation]`.

## Scroll restoration

`history.scrollRestoration` is set to `"manual"`. Scroll position is saved
per history entry (`{ n, scroll }`) and restored on back/forward; forward
navigations scroll to top and move focus to the main content. Elements
with `data-scroll-preserve` keep their own scroll across navigations.

## What happens on a navigation

1. `elur:navigate-start` dispatched; in-flight navigation is cancelled.
2. `GET /__elur-js/render?page=...` (skipped on static builds — the
   `elur:render-endpoint` meta disables the probe and full HTML is fetched
   instead).
3. `elur:before-render` — islands are disposed while still attached.
4. Persisted nodes are moved into the incoming fragment.
5. `#app` swapped (or morphed with `router.morph`).
6. `<head>` merged (`data-elur-head` tags, title, canonical, `og:url`);
   `#elur-data` / `#elur-actions` JSON refreshed; inline `<script>`s
   re-executed (external `src` deduplicated across navigations,
   `data-elur-no-reload` opts out).
7. `elur:rendered` → islands re-hydrate.
8. `elur:navigate-end` after the view transition settles.
