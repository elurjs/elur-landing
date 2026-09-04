---
title: Color Picker
description: An interactive color picker with live preview and hex/RGB display.
category: ui
order: 5
difficulty: intermediate
featured: true
---

# Color Picker

An interactive color picker with hue, saturation, and lightness sliders. Shows
a live preview swatch and the color in hex and RGB formats. Demonstrates
multiple signals feeding into a computed value.

```elur
import { html, signal, computed } from "https://esm.sh/@elurjs/core@3.6.2";

const hue = signal(220);
const sat = signal(80);
const light = signal(55);

const hsl = computed(() => `hsl(${hue.value}, ${sat.value}%, ${light.value}%)`);
const hex = computed(() => {
  const h = hue.value / 360;
  const s = sat.value / 100;
  const l = light.value / 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
});

const presets = ["#3432c8", "#256fe1", "#2bc7f0", "#34d399", "#fbbf24", "#f87171", "#f472b6"];

const setFromHex = (h) => {
  const r = parseInt(h.slice(1, 3), 16) / 255;
  const g = parseInt(h.slice(3, 5), 16) / 255;
  const b = parseInt(h.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  const h_delta = max - min;
  if (h_delta !== 0) {
    s = l > 0.5 ? h_delta / (2 - max - min) : h_delta / (max + min);
  }
  let h_val = 0;
  if (max === r) h_val = ((g - b) / h_delta + (g < b ? 6 : 0)) / 6;
  else if (max === g) h_val = ((b - r) / h_delta + 2) / 6;
  else h_val = ((r - g) / h_delta + 4) / 6;
  hue.value = Math.round(h_val * 360);
  sat.value = Math.round(s * 100);
  light.value = Math.round(l * 100);
};

html`
  <div style="text-align:center">
    <div class="swatch" style=${() => `background:${hsl.value};margin:0 auto 16px`}></div>

    <div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:300px;margin:0 auto">
      <div>
        <label>Hue: ${() => hue.value}°</label>
        <input type="range" min="0" max="360" value=${() => hue.value}
          @input=${(e) => hue.value = parseInt(e.target.value)}
          style="width:100%;accent-color:#2bc7f0" />
      </div>
      <div>
        <label>Saturation: ${() => sat.value}%</label>
        <input type="range" min="0" max="100" value=${() => sat.value}
          @input=${(e) => sat.value = parseInt(e.target.value)}
          style="width:100%;accent-color:#2bc7f0" />
      </div>
      <div>
        <label>Lightness: ${() => light.value}%</label>
        <input type="range" min="0" max="100" value=${() => light.value}
          @input=${(e) => light.value = parseInt(e.target.value)}
          style="width:100%;accent-color:#2bc7f0" />
      </div>
    </div>

    <div style="margin-top:16px">
      <p style="font-family:monospace;font-size:1.1rem">${() => hex.value}</p>
      <p style="font-family:monospace;color:#a0a0b5">${() => hsl.value}</p>
    </div>

    <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap">
      ${presets.map((c) => html`
        <button
          style=${() => `width:32px;height:32px;border-radius:8px;background:${c};border:2px solid ${hex.value === c.toUpperCase() ? "#2bc7f0" : "#2a2a3a"};cursor:pointer`}
          @click=${() => setFromHex(c)}
        ></button>
      `)}
    </div>
  </div>
`.mount("#app");
```
