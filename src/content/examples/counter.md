---
title: Counter
description: A simple reactive counter with increment, decrement, and reset.
category: basics
order: 1
difficulty: beginner
featured: true
---

# Counter

The classic "Hello World" of reactive UI frameworks. A counter with increment,
decrement, and reset buttons. This example demonstrates signals, reactive text
interpolation, and event handling.

```elur
import { html, signal, computed } from "https://esm.sh/@elurjs/core@3.6.2";

const count = signal(0);
const doubled = computed(() => count.value * 2);
const parity = computed(() =>
  count.value % 2 === 0 ? "even" : "odd"
);

html`
  <div style="text-align:center">
    <div class="counter-display">${() => count.value}</div>
    <p style="color:#a0a0b5">Doubled: ${() => doubled.value} · ${() => parity.value}</p>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
      <button class="btn-primary" @click=${() => count.value--}>−</button>
      <button class="btn-ghost" @click=${() => count.value = 0}>Reset</button>
      <button class="btn-primary" @click=${() => count.value++}>+</button>
    </div>
  </div>
`.mount("#app");
```
