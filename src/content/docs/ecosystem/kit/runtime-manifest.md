---
title: Runtime & Manifest
description: createWebHandler, RequestContext, static file serving, AppManifest, and route type generation.
section: Elur Kit
order: 11
---

# Runtime & Manifest

The runtime module provides the unified Web handler used by every adapter
(Node, Bun, Vercel, Netlify) and the Vite dev server. The manifest module
generates a portable description of the app's routes, actions, and islands.

## `createWebHandler(routes, actions, options)`

Creates a single Web handler function `(Request) => Promise<Response>` from
scanned routes and actions. This is the entry point for all runtimes:

```typescript
import { createWebHandler } from "@elurjs/kit/runtime";
import { scanRoutes } from "@elurjs/kit";
import { scanActions } from "@elurjs/kit";

const routes = await scanRoutes("./src/app");
const actions = await scanActions("./src/app");

const handler = createWebHandler(routes, actions, {
  staticRoot: "./dist",
  lang: "es",
  clientEntry: "/_elur/entry-client.js",
  renderEndpoint: true,
  cacheDir: "./.elur/cache",
  defaultRevalidate: 60,
});

// Use with any Web-standard server
const response = await handler(request);
```

### `WebHandlerOptions`

| Field | Type | Description |
| --- | --- | --- |
| `staticRoot` | `string` | Static file root (absolute path, usually `dist/`) |
| `noCache` | `boolean?` | Bypass ISR cache (dev mode) |
| `cacheDir` | `string?` | ISR cache directory (absolute) |
| `defaultRevalidate` | `number?` | Default ISR revalidate seconds |
| `importer` | `(path) => Promise<unknown>?` | Custom module loader for bundled adapters |
| `lang` | `string?` | HTML lang attribute |
| `clientEntry` | `string?` | Client entry path |
| `renderEndpoint` | `boolean?` | Whether `/__elur-js/render` exists |
| `securityHeaders` | `SecurityHeadersConfig \| false?` | Security response headers |

### `WebHandlerRouteTable`

```typescript
interface WebHandlerRouteTable {
  pages: PageRoute[];
  api: ApiRoute[];
  error404?: PageRoute;
  error500?: PageRoute;
}
```

## `RequestContext`

Per-request state container with cookies, locals, params, and response
accumulators:

```typescript
import { RequestContext } from "@elurjs/kit/runtime";

const ctx = new RequestContext({
  request,
  config: resolvedConfig,
  routes,
  actions,
  publicActions,
});

ctx.pathname;    // URL pathname
ctx.method;      // HTTP method (uppercased)
ctx.wantsJson;   // true if Accept: application/json
ctx.cookies;     // read-only cookie jar
ctx.locals;      // per-request data from middleware
ctx.params;      // route params
ctx.response;    // { status, headers, cookies }
ctx.requestId;   // unique ID for logging
ctx.signal;      // AbortSignal from host disconnect
```

### `RequestContextOptions`

| Field | Type | Description |
| --- | --- | --- |
| `request` | `Request` | The Web Request |
| `config` | `ResolvedElurConfig` | Resolved config |
| `routes` | `RouteTable` | Scanned routes |
| `actions` | `ActionRegistry` | Action registry |
| `publicActions` | `Record<string, string[]>` | Public action names |
| `importer` | `(path) => unknown \| Promise<unknown>?` | Module loader |
| `renderEndpoint` | `boolean?` | Whether render endpoint exists (default `true`) |
| `noCache` | `boolean?` | Bypass ISR cache (default `false`) |
| `cacheDir` | `string?` | ISR cache directory |
| `defaultRevalidate` | `number?` | Default ISR revalidate seconds |
| `params` | `Record<string, string \| string[] \| undefined>?` | Initial route params |
| `locals` | `Record<string, unknown>?` | Initial locals |
| `signal` | `AbortSignal?` | Abort signal |
| `requestId` | `string?` | Custom request ID |
| `platform` | `unknown?` | Platform-specific context |
| `route` | `PageRoute \| ApiRoute?` | Pre-matched route |

### `RouteTable`

```typescript
interface RouteTable {
  pages: PageRoute[];
  api: ApiRoute[];
  error404?: PageRoute;
  error500?: PageRoute;
}
```

## Response helpers

```typescript
import {
  htmlResponse,
  jsonResponse,
  textResponse,
  notFound,
  methodNotAllowed,
  serverError,
} from "@elurjs/kit/runtime";

htmlResponse("<h1>Hi</h1>", 200);
jsonResponse({ ok: true }, 200);
textResponse("Not found", 404);
notFound();              // 404 "Not Found"
methodNotAllowed("PUT"); // 405
serverError("oops");     // 500
```

### `guessContentType(filePath)`

Infers `Content-Type` from file extension:

```typescript
import { guessContentType } from "@elurjs/kit/runtime";

guessContentType("style.css"); // "text/css; charset=utf-8"
```

## Static file serving

```typescript
import { serveStaticFile, resolveStaticFile } from "@elurjs/kit/runtime";

// High-level: returns a Response
const response = await serveStaticFile("./dist", "/images/hero.webp");

// Low-level: returns the file path or undefined
const filePath = await resolveStaticFile("./dist", "/images/hero.webp");
```

## `incomingMessageToRequest(req)`

Converts a Node.js `IncomingMessage` to a Web `Request`:

```typescript
import { incomingMessageToRequest } from "@elurjs/kit/runtime";
import { createServer } from "node:http";

const server = createServer(async (req, res) => {
  const request = incomingMessageToRequest(req);
  const response = await handler(request);
  // ...write response to res...
});
```

## Security headers

```typescript
import {
  buildSecurityHeaders,
  applySecurityHeaders,
  DEFAULT_SECURITY_HEADERS,
} from "@elurjs/kit/runtime";

// Build headers from config
const headers = buildSecurityHeaders(config.security.headers);

// Apply to a response
applySecurityHeaders(response, headers);
```

## App manifest

### `createAppManifest(config)`

Scans routes, actions, and islands in parallel and returns a portable
manifest:

```typescript
import { createAppManifest } from "@elurjs/kit";

const manifest = await createAppManifest(resolvedConfig);
// manifest.routes, manifest.actions, manifest.islands, manifest.base, manifest.output
```

### `AppManifest`

```typescript
interface AppManifest {
  version: 1;
  root: string;
  routes: ScannedRoutes;
  actions: ActionRegistry;
  islands: IslandModule[];
  base: string;
  output: "static" | "server" | "hybrid";
}
```

### `writeAppManifest(manifest, path)`

Writes the manifest as JSON (with portable paths) to disk:

```typescript
import { writeAppManifest } from "@elurjs/kit";

await writeAppManifest(manifest, "./dist/.elur/manifest.json");
```

### `writeRouteTypes(manifest, path)`

Generates TypeScript route types for type-safe navigation:

```typescript
import { writeRouteTypes } from "@elurjs/kit";

await writeRouteTypes(manifest, "./src/types/elur-routes.d.ts");
// Generates:
//   export type ElurRoutePath = "/" | "/blog" | "/blog/:slug" | ...;
//   export type ElurActionName = "submitContact" | "createPost" | ...;
//   export interface ElurRouteParams { [name: string]: string | string[] | undefined }
```

### `validateManifestRoutes(routes)`

Throws on duplicate or invalid route patterns:

```typescript
import { validateManifestRoutes } from "@elurjs/kit";

validateManifestRoutes(routes); // throws if conflicts found
```

### `assertClientImportAllowed(id, importer?)`

Guards against importing server-only modules in client bundles:

```typescript
import { assertClientImportAllowed } from "@elurjs/kit";

assertClientImportAllowed("some-module", importer);
```
