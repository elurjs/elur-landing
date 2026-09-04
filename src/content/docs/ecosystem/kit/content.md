---
title: Content Collections
description: defineCollection, getEntry, getCollection, renderMarkdown, and frontmatter for typed Markdown content.
section: Elur Kit
order: 5
---

# Content Collections

Content collections provide typed Markdown content with YAML frontmatter.
They are ideal for docs, blogs, and any structured content.

## Defining a collection

Collections are defined in `src/content/config.ts`. Each collection is a
directory under `src/content/<name>/` containing `.md` files:

```typescript
// src/content/config.ts
import { defineCollection } from "@elurjs/kit/content";
import { z } from "zod"; // optional peer dep

export const collections = {
  blog: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()).optional(),
    }),
  }),
  docs: defineCollection({
    // no schema — frontmatter is untyped
  }),
};
```

`defineCollection` accepts `{ schema?: unknown }`. The collection name comes
from the key in the `collections` object, and the directory is
`src/content/<name>/`.

## Frontmatter

Each Markdown file has YAML frontmatter:

```markdown
---
title: Getting Started
description: Learn the basics of Elur.
section: Getting Started
order: 5
---

# Getting Started

Content here...
```

## Querying content

### `getCollection<T>(name)`

Returns all entries in a collection:

```typescript
import { getCollection } from "@elurjs/kit/content";
import type { DocMeta } from "../lib/docs-nav";

const entries = await getCollection<DocMeta>("docs");
```

### `getEntry<T>(name, slug)`

Returns a single entry by slug:

```typescript
import { getEntry } from "@elurjs/kit/content";

const entry = await getEntry<DocMeta>("docs", "getting-started/introduction");
```

### `renderMarkdown(source)`

Renders a Markdown string to HTML using `marked` (optional peer dep):

```typescript
import { renderMarkdown } from "@elurjs/kit/content";

const html = await renderMarkdown(entry.body);
// Returns an HTML string
```

Throws if `marked` is not installed.

### `renderEntryHTML(entry)`

Renders the Markdown body of an entry to HTML (cached on the entry object):

```typescript
import { renderEntryHTML } from "@elurjs/kit/content";

const html = await renderEntryHTML(entry);
// Renders only the markdown body, not the frontmatter
```

### `raw(html)`

Inserts raw HTML into a template without escaping:

```typescript
import { raw } from "@elurjs/kit/content";
import { html } from "@elurjs/core";

html`<article>${raw(await renderEntryHTML(entry))}</article>`;
```

## Using in pages

```typescript
// src/app/docs/[...slug]/page.data.ts
import { getEntry } from "@elurjs/kit/content";

export const load = async ({ params }) => {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  const entry = await getEntry("docs", slug);
  if (!entry) throw new Response("Not Found", { status: 404 });
  return { entry, title: entry.data.title };
};
```

## Slug convention

The slug is derived from the file path relative to the content directory,
without the extension:

```text
content/docs/getting-started/introduction.md  →  slug: "getting-started/introduction"
content/docs/core/signals.md                  →  slug: "core/signals"
```

## `getEntries(collection, slugs)`

Returns multiple entries by slug:

```typescript
import { getEntries } from "@elurjs/kit/content";

const posts = await getEntries("blog", ["hello-world", "second-post"]);
// Array of entries matching the slugs
```

`getCollection(collection)` returns all entries, sorted by frontmatter `date`
descending (if present), otherwise by slug ascending.

## Frontmatter parsing

### `parseFrontmatter(text)`

```typescript
import { parseFrontmatter } from "@elurjs/kit/content";

const { data, body } = parseFrontmatter(`---
title: Hello
---

# Markdown body`);
// data: { title: "Hello" }
// body: "# Markdown body"
```

### `splitFrontmatter(source)`

Splits frontmatter from body without parsing. Returns `{ raw, body }`:

```typescript
import { splitFrontmatter } from "@elurjs/kit/content";

const { raw, body } = splitFrontmatter(text);
// raw: frontmatter string without --- fences
// body: markdown body
```

### `parseDocument(source)`

Parses frontmatter and returns structured document:

```typescript
import { parseDocument } from "@elurjs/kit/content";

const { data, body } = parseDocument(text);
// data: parsed frontmatter object
// body: markdown body (trimStart applied)
```

## Schema validation

### `createValidator(schema)`

Creates a validator function from a schema (zod schema with `.parse()` or a
plain function). Returns `undefined` if no valid schema is provided:

```typescript
import { createValidator } from "@elurjs/kit/content";
import { z } from "zod";

const validator = createValidator(z.object({ title: z.string() }));
if (validator) {
  const parsed = validator({ title: "Hello" }, "/path/to/file.md");
}
```

When `zod` is not installed but a schema is provided, validation is skipped
with a warning.

### `getZod()`

Returns a Promise that resolves to the zod instance. Throws if `zod` is not
installed:

```typescript
import { getZod } from "@elurjs/kit/content";

const z = await getZod();
const schema = z.object({ title: z.string() });
```

## Per-request scope

Content collections use `AsyncLocalStorage` for per-request scope. Set the
content root per request:

```typescript
import { withContentRoot, setContentRoot, clearContentCache } from "@elurjs/kit/content";

// Wrap a request handler
withContentRoot("./src/content", () => {
  // getEntry/getEntries use this root
});

// Or set manually
setContentRoot("./src/content");
// ... queries ...
```

### `clearContentCache()`

Clears the in-memory content cache (useful after file changes in dev):

```typescript
import { clearContentCache } from "@elurjs/kit/content";
clearContentCache();
```

## Types

### `CollectionDefinition`

```typescript
interface CollectionDefinition {
  /** Schema for frontmatter validation (zod schema or plain function). */
  schema?: unknown;
}
```

### `CollectionsConfig`

```typescript
type CollectionsConfig = Record<string, CollectionDefinition>;
```

### `ContentEntry<TData>`

| Field | Type | Description |
| --- | --- | --- |
| `collection` | `string` | Collection name, e.g. `"blog"` |
| `slug` | `string` | Entry slug (filename without `.md`) |
| `data` | `TData` | Parsed and validated frontmatter |
| `body` | `string` | Raw Markdown body |
| `html` | `string?` | Rendered HTML body (lazily computed) |
| `filePath` | `string` | Absolute path to the source `.md` file |

### `SchemaValidator`

```typescript
interface SchemaValidator {
  (data: unknown, filePath: string): Record<string, unknown>;
}
```

A function that validates raw frontmatter data and returns the typed result.
`createValidator(schema)` returns one when `zod` is installed, or `undefined`
when it is not.
