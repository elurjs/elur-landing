---
title: Tabs
description: A tabbed interface with reactive tab switching and content panels.
category: ui
order: 11
difficulty: intermediate
---

# Tabs

A tabbed interface where clicking a tab switches the visible content panel.
Demonstrates reactive class binding for active states and conditional content
rendering.

```elur
import { html, signal } from "https://esm.sh/@elurjs/core@3.6.2";

const active = signal("overview");

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "install", label: "Install" },
];

const panels = {
  overview: html`
    <h3 style="margin-bottom:8px">Elur Overview</h3>
    <p style="color:#a0a0b5">A fine-grained reactive UI framework with signals and tagged templates. ~15 KB runtime, zero dependencies, no virtual DOM.</p>
  `,
  features: html`
    <h3 style="margin-bottom:8px">Key Features</h3>
    <ul style="color:#a0a0b5;padding-left:20px">
      <li>Fine-grained reactivity with signals</li>
      <li>Tagged template literals (no JSX)</li>
      <li>No build step required</li>
      <li>TypeScript first-class</li>
      <li>SSR support</li>
    </ul>
  `,
  install: html`
    <h3 style="margin-bottom:8px">Installation</h3>
    <p style="color:#a0a0b5">npm install @elurjs/core</p>
    <p style="color:#a0a0b5;margin-top:8px">Or via CDN: https://esm.sh/@elurjs/core</p>
  `,
};

const select = (id) => { active.value = id; };

html`
  <div style="width:100%;max-width:400px">
    <div class="tab-bar">
      ${tabs.map((tab) => html`
        <button
          class=${() => `tab-btn${active.value === tab.id ? " active" : ""}`}
          @click=${() => select(tab.id)}
        >
          ${tab.label}
        </button>
      `)}
    </div>

    ${() => html`
      <div class="tab-panel active">
        ${() => panels[active.value]}
      </div>
    `}
  </div>
`.mount("#app");
```
