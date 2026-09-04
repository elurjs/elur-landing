---
title: Temperature Converter
description: A bidirectional Celsius/Fahrenheit converter with reactive two-way binding.
category: state
order: 4
difficulty: beginner
---

# Temperature Converter

A bidirectional temperature converter between Celsius and Fahrenheit. Typing in
either input updates the other automatically. Demonstrates two-way binding
with signals and computed values.

```elur
import { html, signal, computed } from "https://esm.sh/@elurjs/core@3.6.2";

const celsius = signal(25);

const fahrenheit = computed(() => (celsius.value * 9/5) + 32);

const setFahrenheit = (f) => {
  celsius.value = (f - 32) * 5/9;
};

const setCelsius = (c) => {
  celsius.value = c;
};

const description = computed(() => {
  const c = celsius.value;
  if (c <= 0) return "❄️ Freezing";
  if (c < 15) return "🧥 Cold";
  if (c < 25) return "🌤️ Cool";
  if (c < 35) return "☀️ Warm";
  return "🔥 Hot";
});

html`
  <div style="text-align:center">
    <div class="temp-row" style="justify-content:center;margin-bottom:16px">
      <div>
        <label>Celsius</label><br/>
        <input
          type="number"
          value=${() => Math.round(celsius.value * 10) / 10}
          @input=${(e) => setCelsius(parseFloat(e.target.value) || 0)}
        />
      </div>
      <span style="font-size:1.5rem;color:#2bc7f0">⇄</span>
      <div>
        <label>Fahrenheit</label><br/>
        <input
          type="number"
          value=${() => Math.round(fahrenheit.value * 10) / 10}
          @input=${(e) => setFahrenheit(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
    <p style="font-size:1.5rem">${() => description.value}</p>
  </div>
`.mount("#app");
```
