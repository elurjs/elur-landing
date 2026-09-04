---
title: Quick Start
description: Build your first Elur app in five minutes — a reactive counter with computed values.
section: Getting Started
order: 3
---

# Quick Start

In this guide you'll build a small reactive app: a counter with a derived
"doubled" value and a reset button. You'll learn signals, computed values,
event handling, and conditional rendering.

## Step 1: Create the HTML

Create an `index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Elur Quick Start</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./main.ts"></script>
</body>
</html>
```

## Step 2: Write the app

Create `main.ts`:

```typescript
import { html, signal, computed } from "@elurjs/core";

const count = signal(0);
const doubled = computed(() => count.value * 2);
const label = computed(() =>
  count.value === 0 ? "zero" : count.value > 0 ? "positive" : "negative"
);

html`
  <div style="font-family: sans-serif; padding: 40px">
    <h1>Count: ${() => count.value}</h1>
    <p>Doubled: ${() => doubled.value}</p>
    <p>Status: ${() => label.value}</p>

    <button @click=${() => count.value++}>+1</button>
    <button @click=${() => count.value--}>−1</button>
    <button @click=${() => count.value = 0}>Reset</button>
  </div>
`.mount("#app");
```

## Step 3: Run it

If you're using Vite, just run `npm run dev`. If you're using the CDN approach,
open the HTML file in a browser.

You should see:
- The count updates when you click +1 or −1.
- The doubled value updates automatically.
- The status label changes between "zero", "positive", and "negative".

## How it works

1. **`signal(0)`** creates a reactive container holding `0`.
2. **`computed(() => count.value * 2)`** creates a derived value that
   automatically recalculates when `count` changes.
3. **`${() => count.value}`** is a reactive interpolation. The function is
   called once during render, and Elur tracks that it reads `count`. When
   `count` changes, only this text node is updated.
4. **`@click=${handler}`** attaches a DOM event listener.

## Adding a list

Let's extend the app to track a history of values:

```typescript
import { html, signal, computed, repeat } from "@elurjs/core";

const count = signal(0);
const history = signal<number[]>([]);

const increment = () => {
  count.value++;
  history.value = [...history.value, count.value];
};

html`
  <div>
    <h1>${() => count.value}</h1>
    <button @click=${increment}>+1</button>
    <ul>
      ${() => repeat(
        history.value,
        (n, i) => i,
        (n) => html`<li>Step: ${n}</li>`
      )}
    </ul>
  </div>
`.mount("#app");
```

The `repeat()` function efficiently renders lists. It takes the array, a key
function, and a render function. When the array changes, only the added or
removed items are updated in the DOM.

:::tip
Notice that we never call a "render" function manually. Elur's reactivity
system handles all DOM updates automatically. You just change the data, and
the UI follows.
:::

## Next steps

- **[Thinking in Elur](/docs/getting-started/thinking-in-elur/)** — understand
  the mental model.
- **[Templates](/docs/core/templates/)** — full template syntax reference.
- **[Signals](/docs/core/signals/)** — deep dive into reactivity.
- **[Examples](/examples/)** — see more working demos.
