---
title: Function components
description: Compose views from reusable functions.
section: Components
order: 2
starterCode: "function Greeting({ name }) {\n  return html`<h2>Hello, ${name}</h2>`;\n}\n\nfunction App() {\n  return html`\n    <div>\n      <p>Add a Greeting here</p>\n    </div>\n  `;\n}\n"
solutionCode: "function Greeting({ name }) {\n  return html`<h2>Hello, ${name}</h2>`;\n}\n\nfunction App() {\n  return html`\n    <div>\n      ${Greeting({ name: \"Ada\" })}\n      ${Greeting({ name: \"Grace\" })}\n    </div>\n  `;\n}\n"
hint: "Call Greeting({ name: \"Ada\" }) inside the template, just like a function call: ${Greeting({ name: \"Ada\" })}"
---

# Function components

A component is just a function that returns a template. You compose them by calling one inside another's template.

## Defining a component

```typescript
function Greeting({ name }) {
  return html`<h2>Hello, ${name}</h2>`;
}
```

## Using a component

Call it inside a template:

```typescript
function App() {
  return html`
    <div>
      ${Greeting({ name: "Ada" })}
      ${Greeting({ name: "Grace" })}
    </div>
  `;
}
```

## Reactive props

Components run once. If you pass a plain value, it is frozen at that moment. To keep a prop reactive, pass the signal itself and read it with a function in the child:

```typescript
function Counter({ count }) {
  return html`<p>${() => count.value}</p>`;
}

function App() {
  const count = signal(0);
  return html`${Counter({ count })}`; // pass the signal, not count.value
}
```

## Your task

The `Greeting` component is defined but not used. Render two greetings inside `App` with different names.

:::note
Because the playground evaluates your code in order, define `Greeting` before `App` so it is in scope.
:::
