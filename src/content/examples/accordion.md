---
title: Accordion
description: A collapsible accordion component with smooth expand/collapse behavior.
category: ui
order: 8
difficulty: intermediate
---

# Accordion

An accordion component where only one section can be open at a time. Click a
header to expand or collapse its content. Demonstrates conditional rendering
and single-signal state management.

```elur
import { html, signal, repeat } from "https://esm.sh/@elurjs/core@3.6.2";

const openIndex = signal(0);

const sections = [
  {
    title: "What is Elur?",
    body: "Elur is a fine-grained reactive UI framework that uses tagged template literals and signals. It ships a tiny ~15 KB runtime with zero dependencies.",
  },
  {
    title: "How does reactivity work?",
    body: "Elur tracks which signals are read inside reactive contexts (computed, effect, template interpolations). When a signal changes, only the dependent computations are re-run.",
  },
  {
    title: "Do I need a build step?",
    body: "No. Elur works directly in the browser via ESM CDN imports. For production, you can use Vite for bundling, but it's not required.",
  },
  {
    title: "Is Elur fast?",
    body: "Yes. Elur updates only the DOM nodes affected by a signal change — no virtual DOM diffing, no component re-renders. Updates are surgical and fast.",
  },
];

const toggle = (i) => {
  openIndex.value = openIndex.value === i ? -1 : i;
};

html`
  <div style="width:100%;max-width:400px">
    ${repeat(
      sections,
      (s, i) => i,
      (s, i) => html`
        <div class=${() => `accordion-item${openIndex.value === i ? " open" : ""}`}>
          <div class="accordion-header" @click=${() => toggle(i)}>
            <span>${s.title}</span>
            <span style=${() => `transition:transform 0.2s;transform:${openIndex.value === i ? "rotate(180deg)" : "none"}`}>▼</span>
          </div>
          <div class="accordion-body">
            ${s.body}
          </div>
        </div>
      `
    )}
  </div>
`.mount("#app");
```
