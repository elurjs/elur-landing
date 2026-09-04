---
title: Star Rating
description: An interactive star rating widget with hover preview and click-to-select.
category: ui
order: 10
difficulty: beginner
---

# Star Rating

An interactive star rating widget. Hover over stars to preview, click to set
the rating. Demonstrates reactive state for hover and selected values, and
dynamic class binding.

```elur
import { html, signal, repeat } from "https://esm.sh/@elurjs/core@3.6.2";

const rating = signal(3);
const hover = signal(0);

const stars = [1, 2, 3, 4, 5];

const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const setRating = (n) => { rating.value = n; };
const setHover = (n) => { hover.value = n; };
const clearHover = () => { hover.value = 0; };

const displayValue = () => hover.value || rating.value;

html`
  <div style="text-align:center">
    <div style="display:flex;gap:4px;justify-content:center">
      ${stars.map((n) => html`
        <span
          class=${() => `star${n <= displayValue() ? " active" : ""}`}
          @mouseenter=${() => setHover(n)}
          @mouseleave=${() => clearHover()}
          @click=${() => setRating(n)}
        >
          ${() => n <= displayValue() ? "★" : "☆"}
        </span>
      `)}
    </div>

    <p style="margin-top:12px;font-size:1.1rem;font-weight:600">
      ${() => labels[displayValue()]}
    </p>
    <p style="color:#6a6a80;font-size:0.85rem">
      ${() => rating.value} / 5 stars
    </p>

    <button
      class="btn-ghost"
      style="margin-top:12px"
      @click=${() => rating.value = 0}
    >
      Clear rating
    </button>
  </div>
`.mount("#app");
```
