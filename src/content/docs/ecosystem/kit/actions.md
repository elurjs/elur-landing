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
| `params` | `Record<string, string \| string[]>` | Route params — currently `{}` through the built-in endpoint (actions resolve by page path, so params are not known there) |
| `locals` | `Record<string, unknown>` | Per-request locals — currently `{}` through the built-in endpoint (middleware `locals` reach API routes, not actions yet) |

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

### `ElurJsAction<TInput, TOutput>`

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
import { fail } from "@elurjs/kit";

export async function submitContact(data: { name: string }) {
  if (!data.name) return fail({ message: "Name required" }, 400);
  return { ok: true };
}
```

`fail()` returns an `ActionFailure` that the client receives in
`contact.data.value` (not `error.value`).

## `redirect(location, status?)` — return a redirect

```typescript
import { redirect } from "@elurjs/kit";

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

The action endpoint accepts `application/json`,
`application/x-www-form-urlencoded`, and `multipart/form-data` bodies —
forms post `urlencoded`, `callAction`/fetch post JSON. Redirects go out as
`303` for form posts and as a JSON payload for API calls.

:::note
`elurJsAction`/`callAction` are fetch-based — use the plain HTML form
above when the action must work without JavaScript.
:::

## Security

### Origin verification

`verifyOrigin` returns an error **message** when the request must be
rejected, or `undefined` when it is allowed — combine it with
`originForbidden` to build the `403` response:

```typescript
import { verifyOrigin, originForbidden } from "@elurjs/kit";

const reason = verifyOrigin(request, {
  allowedOrigins: ["https://myapp.com"],
  strictOrigin: true, // reject requests missing both Origin and Referer
});
if (reason) return originForbidden(reason);
```

### Body limits

Configured in `elur.config.ts`:

```typescript
defineConfig({
  security: { bodyLimit: 1_000_000 }, // 1MB
});
```

Requests exceeding the limit get a `413` response. The limit is global to
the action handler — there is no per-action body limit.

### HMAC-signed error cookies

Action errors are stored in HMAC-signed cookies to survive redirects,
preventing tampering.

## Types

### `ActionConcurrencyMode`

```typescript
type ActionConcurrencyMode = "latest" | "queue" | "parallel";
```

- `"latest"` — only the most recent call runs; previous in-flight calls
  are cancelled
- `"queue"` — calls run sequentially in order
- `"parallel"` — all calls run concurrently

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

## Distinguishing results

`fail()` and `redirect()` return instances of the `ActionFailure` /
`RedirectResponse` classes exported from the package root — check them
with `instanceof`:

```typescript
import { ActionFailure, RedirectResponse } from "@elurjs/kit";

const result = await contact.submit({ name: "Ada" });

if (result instanceof ActionFailure) {
  console.log(result.data, result.status);
} else if (result instanceof RedirectResponse) {
  console.log(result.location, result.status);
}
```

## `handleActionRequest(request, resolveAction, security?)`

Low-level server handler with CSRF verification, body parsing, and error
handling:

```typescript
import { handleActionRequest } from "@elurjs/kit";

const response = await handleActionRequest(
  request,
  async (name, page) => {
    // Return the action function for the given name/page
    return actions[page]?.[name];
  },
  { allowedOrigins: ["https://myapp.com"], bodyLimit: 1_000_000 },
);
```

`ActionResolver`:

```typescript
type ActionResolver = (
  name: string,
  page?: string,
) => Promise<((...args: unknown[]) => unknown) | undefined>;
```

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

## `originForbidden(message)`

Builds a `403` text response for a rejected origin check:

```typescript
import { verifyOrigin, originForbidden } from "@elurjs/kit";

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
per-process key in dev. Small payloads (~3.5 KB) are embedded directly in
the cookie; large payloads overflow to an in-memory store keyed by a
signed id with a 15 s TTL.

:::warning
In multi-instance deployments set a shared `ELUR_JS_ACTION_SECRET` — the
in-memory overflow store is per-process, so a redirect that lands on a
different instance loses the error payload without it.
:::

```typescript
import {
  encodeActionErrorCookie,
  decodeActionErrorCookie,
  clearActionErrorCookieHeader,
  setActionErrorCookieHeader,
  ACTION_ERROR_COOKIE,
} from "@elurjs/kit";

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

:::note
The runtime sanitizes server errors automatically in production — no
stacks or internal paths leak into responses. If a loader or layout throws
a `Response` object (redirect, 404, etc.), the runtime re-throws it as
control flow instead of treating it as a 500.
:::
