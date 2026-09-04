---
title: Configuration
description: ElurConfig, output modes, trailing slash, security headers, router, integrations, and Vite plugin.
section: Elur Kit
order: 10
---

# Configuration

## `defineConfig(config)`

```typescript
// elur.config.ts
import { defineConfig } from "@elurjs/kit";

export default defineConfig({
  root: ".",
  appDir: "src/app",
  islandsDir: "src/islands",
  contentDir: "src/content",
  publicDir: "public",
  outDir: "dist",
  site: "https://example.com",
  base: "/",
  trailingSlash: "always",
  output: "static",
  images: { formats: ["avif", "webp"], quality: 80, strict: true },
  cache: { dir: ".elur/cache", defaultRevalidate: 60 },
  security: {
    allowedOrigins: ["https://example.com"],
    strictOrigin: true,
    bodyLimit: 1_000_000,
    headers: {
      noSniff: true,
      referrerPolicy: "strict-origin-when-cross-origin",
    },
  },
  router: { enabled: true, prefetch: true },
  integrations: [],
});
```

## `ElurConfig`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `root` | `string` | `.` | Project root |
| `appDir` | `string` | `src/app` | Pages directory |
| `islandsDir` | `string` | `src/islands` | Islands directory |
| `contentDir` | `string` | `src/content` | Content collections directory |
| `publicDir` | `string` | `public` | Static assets directory |
| `outDir` | `string` | `dist` | Build output directory |
| `site` | `string` | — | Base site URL |
| `base` | `string` | `/` | Base path prefix |
| `trailingSlash` | `TrailingSlashMode` | `ignore` | `"always"` \| `"never"` \| `"ignore"` |
| `output` | `ElurOutputMode` | `static` | `"static"` \| `"server"` \| `"hybrid"` |
| `adapter` | `Adapter` | — | Deployment adapter |
| `images` | `object` | — | Image optimization config |
| `cache` | `object` | — | Cache config |
| `security` | `object` | — | Security config |
| `router` | `object` | — | Router config |
| `integrations` | `ElurKitIntegration[]` | `[]` | Integration hooks |

## Output modes

| Mode | Description | Use for |
| --- | --- | --- |
| `static` | SSG — all pages at build time | Blogs, marketing sites, docs |
| `server` | SSR — all pages on demand | Apps with dynamic data, auth |
| `hybrid` | Per-page policy — SSG default, SSR/ISR opt-in | Mixed sites |

## Trailing slash

| Mode | Behavior |
| --- | --- |
| `always` | Appends `/` to paths without one (`/about` → `/about/`) |
| `never` | Removes trailing `/` (`/about/` → `/about`) |
| `ignore` | No normalization (default) |

## Image config

```typescript
images: {
  formats: ["avif", "webp"],  // output formats
  quality: 80,                 // 1-100
  strict: true,                // fail build on missing source
}
```

## Cache config

```typescript
cache: {
  dir: ".elur/cache",        // filesystem cache directory (default)
  defaultRevalidate: 60,     // default revalidation seconds
}
```

## Security config

```typescript
security: {
  allowedOrigins: ["https://example.com", "https://staging.example.com"],
  strictOrigin: true,         // enforce origin check on actions
  bodyLimit: 1_000_000,       // max request body size in bytes
  headers: {                  // security response headers (set false to disable)
    noSniff: true,
    referrerPolicy: "strict-origin-when-cross-origin",
    // ... CSP, HSTS, X-Frame-Options, etc.
  },
}
```

### `SecurityHeadersConfig`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `noSniff` | `boolean` | `true` | `X-Content-Type-Options: nosniff` |
| `referrerPolicy` | `string` | `strict-origin-when-cross-origin` | `Referrer-Policy` header |
| `contentSecurityPolicy` | `string?` | — | `Content-Security-Policy` header (use `"nonce"` placeholder for per-request nonces) |
| `hsts` | `string \| true` | — | `Strict-Transport-Security` header (only under HTTPS) |
| `frameAncestors` | `string` | `SAMEORIGIN` | `X-Frame-Options` or CSP `frame-ancestors` |
| `permissionsPolicy` | `string?` | — | `Permissions-Policy` header |

Set `headers: false` to disable all default security headers.

## Router config

```typescript
router: {
  enabled: true,    // enable SPA client router
  prefetch: true,   // prefetch links on viewport entry and hover
}
```

## `loadElurConfig(options?)`

Loads config from `elur.config.ts` with defaults:

```typescript
import { loadElurConfig } from "@elurjs/kit";

const config = await loadElurConfig({ cwd: process.cwd() });
// ResolvedElurConfig with all defaults filled in
```

## Integrations

Integrations are typed hooks that optional ecosystem packages (i18n, auth,
query, testing) or custom plugins can use to hook into the Kit lifecycle
without being a dependency:

```typescript
import type { ElurKitIntegration } from "@elurjs/kit";

const myIntegration: ElurKitIntegration = {
  name: "analytics",
  config: async (config, ctx) => {
    if (ctx.command === "build") console.log("Building with analytics");
  },
  request: async (request, ctx) => {
    // Intercept or observe requests
  },
  build: async (result, ctx) => {
    // Post-build hook
  },
  error: async (error, ctx) => {
    console.error("Build error:", error);
  },
};

// In elur.config.ts
export default defineConfig({
  integrations: [myIntegration],
});
```

### `ElurKitIntegration`

Hooks are defined directly on the integration object (not nested under a
`hooks` key):

| Hook | Signature | Description |
| --- | --- | --- |
| `name` | `string` | Integration name (required) |
| `config?` | `(config, ctx) => void \| Promise<void>` | Config resolution hook |
| `routes?` | `(manifest, ctx) => void \| Promise<void>` | After route scanning |
| `request?` | `(request, ctx) => void \| Response \| Promise<void \| Response>` | Request interception |
| `render?` | `({ html }, ctx) => void \| Promise<void>` | After page render |
| `build?` | `(result, ctx) => void \| Promise<void>` | After build completes |
| `clientEntry?` | `(source, ctx) => string \| void \| Promise<string \| void>` | Transform client entry source |
| `error?` | `(error, ctx) => void \| Promise<void>` | Error hook |

### `ElurKitIntegrationContext`

```typescript
interface ElurKitIntegrationContext {
  root: string;
  command: "dev" | "build" | "preview" | "start" | "check" | "routes" | "doctor";
}
```

### `runIntegrationHook(integrations, hook, args)`

Runs a named hook across all registered integrations:

```typescript
import { runIntegrationHook } from "@elurjs/kit";

await runIntegrationHook(config.integrations, "build", [buildResult, ctx]);
```

### Typed integration registry

For optional packages that register themselves without being in the config
file, Kit provides a typed registry:

```typescript
import {
  registerIntegration,
  getI18nIntegration,
  getAuthIntegration,
  getQueryIntegration,
  getTestingIntegration,
  getCustomIntegrations,
  clearIntegrations,
} from "@elurjs/kit";

// Optional packages call this on import
registerIntegration("i18n", {
  getLocale: (request) => "es",
  getAlternates: (url, locale) => [],
  translate: (key, locale) => key,
});

// The Kit runtime retrieves the integration if registered
const i18n = getI18nIntegration();
if (i18n) {
  const locale = await i18n.getLocale(request);
}
```

Available registry types: `"i18n"`, `"auth"`, `"query"`, `"testing"`, `"custom"`.

Each has a typed interface:
- `I18nIntegration`: `getLocale`, `getAlternates`, `translate`
- `AuthIntegration`: `getSession`, `seedSSR`
- `QueryIntegration`: `dehydrate`, `rehydrate`, `invalidate`
- `TestingIntegration`: `createRequest`, `createRenderFixture`, `reset`

## `loadElurConfig(options)`

Programmatically loads and resolves the Elur config file:

```typescript
import { loadElurConfig } from "@elurjs/kit";

const config = await loadElurConfig({
  root: process.cwd(),
  configFile: "elur.config.ts",
  command: "build",
});
```

### `LoadElurConfigOptions`

| Field | Type | Description |
| --- | --- | --- |
| `root` | `string?` | Project root (default: `process.cwd()`) |
| `configFile` | `string?` | Config file path (default: `elur.config.ts/js/mjs`) |
| `command` | `string?` | Current command (`"dev"`, `"build"`, `"start"`, etc.) |
| `mode` | `string?` | Mode string |
| `overrides` | `ElurConfig?` | Partial config to override file values |

### Type aliases

```typescript
type ElurOutputMode = "static" | "server" | "hybrid";
type TrailingSlashMode = "always" | "never" | "ignore";
```

## Vite plugin

The Vite plugin provides a dev server with SSR, HMR, and automatic island
entry generation:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { elurJsKit } from "@elurjs/kit/vite";

export default defineConfig({
  plugins: [elurJsKit()],
});
```

### `ElurJsKitViteOptions`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `appDir` | `string` | `src/app` | Pages directory |
| `islandsDir` | `string` | `src/islands` | Islands directory |
| `contentDir` | `string` | `src/content` | Content directory |
| `generatedEntry` | `string` | `.elur/entry-client.ts` | Generated client entry path |
| `clientEntry` | `string` | `/_elur/entry-client.js` | Client bundle URL |
| `lang` | `string` | `es` | HTML lang attribute |
| `hydrateImport` | `string?` | `@elurjs/kit/island` | Import specifier for `hydrateIslands` |
| `routerImport` | `string?` | `@elurjs/kit/router` | Import specifier for `startClientRouter` |
| `actionSecurity` | `ActionSecurityOptions?` | — | CSRF/origin policy for actions in dev |
| `interpolation` | `InterpolationMode` | `auto` | `"auto"` \| `"legacy"` \| `"off"` |

### Partial attribute interpolation

Three priority levels when `interpolation: "auto"` (default):

1. **Vite plugin** (`@elurjs/vite-plugin-elur` >= 1.1.0) — state-machine lexer rewrites at build time
2. **Core native** — when `templateFeatures.partialAttributeInterpolation` is available (core >= 3.3)
3. **Kit legacy transform** — heuristic HTML tag walker fallback

```typescript
elurJsKit({ interpolation: "auto" })    // default — plugin > core > legacy
elurJsKit({ interpolation: "legacy" })  // force legacy (deprecated)
elurJsKit({ interpolation: "off" })     // never transform
```

### With the build-time compiler (recommended)

```typescript
import { defineConfig } from "vite";
import { elurJsKit } from "@elurjs/kit/vite";
import elurPlugin from "@elurjs/vite-plugin-elur";

export default defineConfig({
  plugins: [
    elurJsKit(),
    elurPlugin(),  // compiler: true by default
  ],
});
```

The compiler activates:

- Build-time `html\`\`` lowering to imperative DOM code
- Partial attribute interpolation via state-machine lexer
- HMR with state preservation (signals, stores, forms, routers survive hot updates)
- Scroll/focus preservation after re-mount
