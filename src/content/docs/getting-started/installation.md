---
title: Installation
description: How to install Elur and set up a new project with Vite or from scratch.
section: Getting Started
order: 2
---

# Installation

Elur can be used with or without a build step. For production apps, we
recommend Vite. For quick experiments, you can load Elur directly from a CDN.

## Using Vite (recommended)

Create a new project with Vite and install Elur:

```bash
npm create vite@latest my-elur-app -- --template vanilla-ts
cd my-elur-app
npm install @elurjs/core
```

Then replace `src/main.ts` with:

```typescript
import { html, signal } from "@elurjs/core";

const count = signal(0);

html`
  <div style="text-align:center;padding:40px">
    <h1>${() => count.value}</h1>
    <button @click=${() => count.value++}>Increment</button>
  </div>
`.mount("#app");
```

Run `npm run dev` and open the browser.

## Using Elur Kit (full-stack)

For SSR, file-based routing, and islands, use the Elur Kit meta-framework:

```bash
npm create elur@latest my-app
cd my-app
npm install
npm run dev
```

Elur Kit gives you:
- File-based routing (`src/app/page.ts`)
- Server-side rendering with hydration
- Islands architecture (partial hydration)
- Content collections (Markdown with typed frontmatter)
- Static generation and incremental regeneration

## From CDN (no build step)

You can use Elur directly in the browser via esm.sh:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>
  <script type="module">
    import { html, signal } from "https://esm.sh/@elurjs/core@3.6.2";

    const count = signal(0);

    html`
      <div>
        <h1>${() => count.value}</h1>
        <button @click=${() => count.value++}>Click me</button>
      </div>
    `.mount("#app");
  </script>
</body>
</html>
```

No bundler, no transpiler — just a single HTML file.

## TypeScript support

Elur is written in TypeScript and ships with type definitions out of the box.
No additional `@types` packages are needed.

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

## Package summary

| Package | Description |
| --------- | ------------- |
| `@elurjs/core` | The core framework: signals, templates, rendering |
| `@elurjs/kit` | Full-stack meta-framework (routing, SSR, islands) |
| `@elurjs/query` | Data fetching and caching |
| `@elurjs/auth` | Authentication primitives |
| `@elurjs/i18n` | Internationalization |

:::note
Elur requires a modern browser that supports ES modules and tagged template
literals. This covers all browsers released after 2020.
:::
