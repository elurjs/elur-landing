---
title: Welcome to Elur
description: Write your first Elur template.
section: Basics
order: 1
starterCode: "function App() {\n  return html`\n    <h1>Hello, Elur!</h1>\n    <p>Edit me and see the preview update.</p>\n  `;\n}\n"
solutionCode: "function App() {\n  return html`\n    <h1>Hello, Elur!</h1>\n    <p>This is my first Elur component.</p>\n  `;\n}\n"
hint: "Change the text inside the <p> tag. The preview updates live as you type."
---

# Welcome to Elur

This is the first lesson of the Elur interactive tutorial. You will learn by editing real Elur code and seeing the result instantly in the preview panel on the right.

## Your first template

Elur views are written with the `html` tagged template literal. The code in the editor defines a function `App` that returns a template. The preview renders whatever `App` returns.

```typescript
function App() {
  return html`
    <h1>Hello, Elur!</h1>
    <p>Edit me.</p>
  `;
}
```

## Try it

1. Change the text inside the `<p>` tag.
2. Watch the preview update on the right.
3. Hit **Solution** to see a suggested answer, or **Reset** to start over.

## What is happening

The `html` tag compiles the template into real DOM nodes. The preview iframe loads Elur from a CDN, evaluates your code, and appends the result to the page. No build step, no bundler — just ESM and an import map.

:::tip
The editor supports Tab for indentation. Try adding a second `<p>` element below the first one.
:::

When you are ready, click **Next** to learn about signals.
