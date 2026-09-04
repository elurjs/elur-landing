---
title: Server Actions
description: defineAction, elurJsAction, fail, redirect, progressive enhancement, validation, and security.
section: Elur Kit
order: 7
---

# Server Actions

Server actions are typed, validated mutations that run on the server and are
called from the client via reactive handles.

## File-based actions

Create a `page.action.ts` next to `page.ts` and export async functions:

```typescript
// src/app/contact/page.action.ts
export async function submitContact(data: { name: string; email: string }) {
  // validate, write to DB, send email, etc.
  return { ok: true };
}
```

Actions run on the server and are called from the client via
`POST /__elur-js/actions`.

## `defineAction(options, handler)`

Typed action with validation, concurrency control, and cache invalidation:

```typescript
import { defineAction } from "@elurjs/kit";
import { z } from "zod";

export const submitContact = defineAction(
  {
    input: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
    concurrency: "latest",
    idempotent: false,
    invalidateTags: ["contacts"],
    invalidatePaths: ["/contact"],
  },
  async (input, ctx) => {
    // input is validated and typed
    // ctx.request, ctx.signal, ctx.params, ctx.locals
    await db.contacts.create(input);
    return { ok: true };
  }
);
```

### `DefineActionOptions<TInput>`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `ActionInputValidator<TInput>` | — | Zod schema, plain function, or any object with `.parse()` |
| `concurrency` | `"latest" \| "queue" \| "parallel"` | `"latest"` | How concurrent calls are handled |
| `idempotent` | `boolean` | `false` | Safe to retry |
| `invalidateTags` | `string[]` | `[]` | Cache tags to invalidate after success |
| `invalidatePaths` | `string[]` | `[]` | Cache paths to invalidate after success |

### `ActionContext`

| Field | Type | Description |
| --- | --- | --- |
| `request` | `Request` | Original Web Request |
| `signal` | `AbortSignal` | Aborts if client disconnects |
| `idempotencyKey` | `string?` | From request header |
| `params` | `Record<string, string \| string[]>` | Route params |
| `locals` | `Record<string, unknown>` | Per-request locals from middleware |

### Concurrency modes

- `"latest"` — abort previous in-flight call, keep only the latest
- `"queue"` — serialize calls, run in order
- `"parallel"` — run all calls concurrently

## `elurJsAction(name, options?)` — reactive client handle

Returns a reactive handle with signals for `pending`, `error`, and `data`:

```typescript
import { elurJsAction } from "@elurjs/kit/action";
import { html } from "@elurjs/core";

const contact = elurJsAction("submitContact", { page: "/contact" });

html`
  <form @submit=${(e: Event) => {
    e.preventDefault();
    contact.submit({ name: "Ada", email: "ada@example.com" });
  }}>
    <input name="name" />
    <input name="email" />
    <button type="submit" disabled=${() => contact.pending.value}>
      ${() => contact.pending.value ? "Sending..." : "Send"}
    </button>
  </form>
  ${() => contact.error.value ? html`<p>${contact.error.value.message}</p>` : null}
  ${() => contact.data.value ? html`<p>Sent!</p>` : null}
`
```

### `ElurAction<TInput, TOutput>`

| Member | Type | Description |
| --- | --- | --- |
| `submit(input)` | `(input: TInput) => Promise<TOutput \| ActionFailure \| RedirectResponse>` | Calls the action, updates signals |
| `pending` | `Signal<boolean>` | `true` while action is running |
| `error` | `Signal<Error \| null>` | Last error, or `null` |
| `data` | `Signal<TOutput \| ActionFailure \| RedirectResponse \| null>` | Last result (success, failure, redirect, or null) |

### `CallActionOptions`

| Field | Type | Description |
| --- | --- | --- |
| `page` | `string` | Route path to scope the action (avoids name collisions) |

## `callAction(name, args, options?)` — low-level

```typescript
import { callAction } from "@elurjs/kit/action";

const result = await callAction(
  "submitContact",
  { name: "Ada", email: "ada@example.com" },
  { page: "/contact" }
);
// args can be a single value or an array
```

## `fail(data, status?)` — return a failure

```typescript
import { fail } from "@elurjs/kit/action";

export async function submitContact(data: { name: string }) {
  if (!data.name) return fail({ message: "Name required" }, 400);
  return { ok: true };
}
```

`fail()` returns an `ActionFailure` that the client receives in
`contact.data.value` (not `error.value`).

## `redirect(location, status?)` — return a redirect

```typescript
import { redirect } from "@elurjs/kit/action";

export async function login(data: { email: string; password: string }) {
  const user = await auth(data);
  if (user) return redirect("/dashboard", 302);
  return fail({ message: "Invalid credentials" }, 401);
}
```

`redirect()` returns a `RedirectResponse` that the client follows
automatically. Default status is `303`.

## Progressive enhancement

Actions work without JavaScript. Add hidden fields to a plain HTML form:

```html
<form action="/__elur-js/actions" method="POST">
  <input type="hidden" name="__elur_js_action_name" value="submitContact" />
  <input type="hidden" name="__elur_js_action_page" value="/contact" />
  <input name="name" />
  <input name="email" />
  <button type="submit">Send</button>
</form>
```

The server runs the action and redirects back to the referring page. If the
client sends `Accept: application/json`, the result is returned as JSON
instead.

## Security

### Origin verification

```typescript
import { verifyOrigin } from "@elurjs/kit/action";

if (!verifyOrigin(request, { allowedOrigins: ["https://myapp.com"] })) {
  return new Response("Forbidden", { status: 403 });
}
```

### Body limits

Configured in `elur.config.ts`:

```typescript
defineConfig({
  security: { bodyLimit: 1_000_000 }, // 1MB
});
```

### HMAC-signed error cookies

Action errors are stored in HMAC-signed cookies to survive redirects,
preventing tampering.

## Types

### `ActionConcurrencyMode`

```typescript
type ActionConcurrencyMode = "latest" | "queue" | "parallel";
```

- `"latest"` — only the most recent call runs; previous in-flight calls are cancelled
- `"queue"` — calls run sequentially in order
- `"parallel"` — all calls run concurrently

### `ActionContext`

| Field | Type | Description |
| --- | --- | --- |
| `request` | `Request` | The original Web Request |
| `signal` | `AbortSignal` | Aborts if the client disconnects |
| `idempotencyKey` | `string?` | From request header, for safe retries |
| `params` | `Record<string, string \| string[]>` | Route params (page-scoped actions) |
| `locals` | `Record<string, unknown>` | Per-request data from middleware |

### `DefineActionOptions<TInput>`

| Field | Type | Description |
| --- | --- | --- |
| `input` | `ActionInputValidator<TInput>?` | Validator with `.parse()` (Zod-compatible) |
| `concurrency` | `ActionConcurrencyMode?` | Concurrency mode |
| `idempotent` | `boolean?` | Safe to retry |
| `invalidateTags` | `string[]?` | Cache tags to invalidate after success |
| `invalidatePaths` | `string[]?` | Cache paths to invalidate after success |

### `DefinedAction<TInput, TOutput>`

The return type of `defineAction()` — a callable with metadata:

```typescript
interface DefinedAction<TInput, TOutput> {
  (input: TInput, ctx: ActionContext): Promise<TOutput | ActionFailure<TOutput>>;
  __elurAction: {
    name: string;
    concurrency: ActionConcurrencyMode;
    idempotent: boolean;
    invalidateTags: readonly string[];
    invalidatePaths: readonly string[];
  };
}
```

### `DefinedActionFn<TInput, TOutput>`

The function signature inside `defineAction`:

```typescript
type DefinedActionFn<TInput, TOutput> = (
  input: TInput,
  ctx: ActionContext,
) => Promise<TOutput | ActionFailure<TOutput>>;
```

### `OriginCheckOptions`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `allowedOrigins` | `string[]?` | — | Extra origins allowed to call actions |
| `strictOrigin` | `boolean?` | `false` | Reject requests missing both `Origin` and `Referer` |

## Type guards

```typescript
import {
  isActionFailure,
  isRedirectResponse,
  isFirstClassResponse,
} from "@elurjs/kit/action";

if (isActionFailure(result)) {
  console.log(result.data, result.status);
}

if (isRedirectResponse(result)) {
  console.log(result.location, result.status);
}

if (isFirstClassResponse(error)) {
  // thrown Response object (redirect, 404, etc.)
}
```

## `handleActionRequest(request, resolveAction, security?)`

Low-level server handler with CSRF verification, body parsing, and error
handling:

```typescript
import { handleActionRequest } from "@elurjs/kit/action";

const response = await handleActionRequest(
  request,
  async (name, page) => {
    // Return the action function for the given name/page
    return actions[page]?.[name];
  },
  { allowedOrigins: ["https://myapp.com"], bodyLimit: 1_000_000 },
);
```

`ActionResolver` is `(name: string, page?: string) => Promise<((...args: unknown[]) => unknown) | undefined>`.

## `scanActions(appDir)` — build-time discovery

Returns a per-page registry keyed by page URL path:

```typescript
import { scanActions } from "@elurjs/kit";

const registry = await scanActions("./src/app");
// {
//   "/contact": { "submitContact": "/abs/path/to/page.action.ts" },
//   "/blog":    { "createPost": "/abs/path/to/page.action.ts" },
// }
```

### `relativeActions(actions, root)`

Returns a copy with file paths made relative to `root`:

```typescript
import { relativeActions } from "@elurjs/kit";

const safe = relativeActions(registry, process.cwd());
```

### `actionNames(actions)`

Returns only action names per page (safe for HTML shell serialization):

```typescript
import { actionNames } from "@elurjs/kit";

const names = actionNames(registry);
// { "/contact": ["submitContact"], "/blog": ["createPost"] }
```

## `originForbidden(message)`

Builds a `403` text response for a rejected origin check:

```typescript
import { verifyOrigin, originForbidden } from "@elurjs/kit/action";

const reason = verifyOrigin(request, { strictOrigin: true });
if (reason) return originForbidden(reason);
```

## `ActionRequest`

The JSON body sent to `/__elur-js/actions`:

```typescript
interface ActionRequest {
  name: string;
  page?: string;
  args: unknown[];
}
```

## Action error cookies

When an action fails via a plain HTML form submission (progressive
enhancement), the failure data is relayed back via a short-lived signed
cookie (`__elur_js_action_error`, Max-Age=15s, SameSite=Lax, HttpOnly).

The cookie is HMAC-signed with `ELUR_JS_ACTION_SECRET` (env var) or a
per-process key in dev. Small payloads are embedded directly in the cookie;
large payloads overflow to an in-memory store keyed by a signed id.

```typescript
import {
  encodeActionErrorCookie,
  decodeActionErrorCookie,
  clearActionErrorCookieHeader,
  setActionErrorCookieHeader,
  ACTION_ERROR_COOKIE,
} from "@elurjs/kit/action";

// Encode a failure for the redirect cookie
const { value, storeId } = encodeActionErrorCookie(
  { email: "Invalid" },
  400,
);

// Set on the redirect response
headers.set("Set-Cookie", setActionErrorCookieHeader(value));

// On the next render, read and consume
const error = decodeActionErrorCookie(request.headers.get("Cookie"));
// { data: { email: "Invalid" }, status: 400 } | undefined

// Clear after consuming
headers.set("Set-Cookie", clearActionErrorCookieHeader());
```

The `form` prop on `PageProps` is populated from this cookie during SSR.

## Public error helpers

```typescript
import {
  toPublicErrorInfo,
  publicErrorResponse,
  isFirstClassResponse,
} from "@elurjs/kit";

// Production-safe error info (no stacks or internal paths)
const info = toPublicErrorInfo(error, { includeDetail: false });
// { code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error", status: 500 }

// Build a JSON error Response with safe body
const response = publicErrorResponse(error, {
  includeDetail: process.env.NODE_ENV !== "production",
  requestId: ctx.requestId,
});
```

`isFirstClassResponse(error)` returns `true` when a loader or layout threw
a `Response` object (redirect, 404, etc.) — these are re-thrown as control
flow, not treated as 500 errors.
