---
title: Live Clock
description: A real-time clock that updates every second using effects and lifecycle hooks.
category: basics
order: 3
difficulty: beginner
---

# Live Clock

A real-time digital clock that updates every second. This example demonstrates
`effect()` for side effects (it returns a dispose function for cleanup) and
`computed()` for formatted time. The effect sets up an interval that updates
the `now` signal every second.

```elur
import { html, signal, computed, effect } from "https://esm.sh/@elurjs/core@3.6.2";

const now = signal(new Date());

// effect() returns a dispose function that stops the interval when called.
const stop = effect(() => {
  const id = setInterval(() => {
    now.value = new Date();
  }, 1000);
  return () => clearInterval(id);
});

const time = computed(() =>
  now.value.toLocaleTimeString("en-US", { hour12: true })
);

const date = computed(() =>
  now.value.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
);

const seconds = computed(() => now.value.getSeconds());

html`
  <div style="text-align:center">
    <div class="clock-time">${() => time.value}</div>
    <p style="color:#a0a0b5;margin-top:8px">${() => date.value}</p>
    <div style="margin-top:16px;width:200px;height:6px;background:#16161f;border-radius:3px;overflow:hidden">
      <div style=${() => `height:100%;width:${(seconds.value / 60) * 100}%;background:linear-gradient(90deg,#3432c8,#2bc7f0);transition:width 1s linear`}></div>
    </div>
  </div>
`.mount("#app");
```
