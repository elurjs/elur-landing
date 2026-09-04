---
title: Search Filter
description: A searchable, filterable list with real-time text matching.
category: state
order: 9
difficulty: intermediate
---

# Search Filter

A list of programming languages that can be filtered by typing in a search
box. The results update in real-time as you type. Demonstrates `computed()`
for derived filtered state and reactive input binding.

```elur
import { html, signal, computed, repeat } from "https://esm.sh/@elurjs/core@3.6.2";

const query = signal("");

const languages = [
  { name: "JavaScript", type: "Dynamic", year: 1995 },
  { name: "TypeScript", type: "Static", year: 2012 },
  { name: "Python", type: "Dynamic", year: 1991 },
  { name: "Rust", type: "Static", year: 2010 },
  { name: "Go", type: "Static", year: 2009 },
  { name: "Java", type: "Static", year: 1995 },
  { name: "C++", type: "Static", year: 1985 },
  { name: "Ruby", type: "Dynamic", year: 1995 },
  { name: "Swift", type: "Static", year: 2014 },
  { name: "Kotlin", type: "Static", year: 2011 },
  { name: "Elixir", type: "Dynamic", year: 2011 },
  { name: "Zig", type: "Static", year: 2016 },
];

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return languages;
  return languages.filter((l) =>
    l.name.toLowerCase().includes(q) ||
    l.type.toLowerCase().includes(q)
  );
});

html`
  <div style="width:100%;max-width:400px">
    <input
      class="search-input"
      placeholder="Search languages..."
      value=${() => query.value}
      @input=${(e) => query.value = e.target.value}
    />

    <p style="color:#6a6a80;font-size:0.8rem;margin-bottom:8px">
      ${() => filtered.value.length} of ${languages.length} languages
    </p>

    <ul>
      ${() => repeat(
        filtered.value,
        (l) => l.name,
        (l) => html`
          <li>
            <div style="flex:1">
              <div style="font-weight:600">${l.name}</div>
              <div style="font-size:0.75rem;color:#6a6a80">${l.type} · ${l.year}</div>
            </div>
            <span class="filter-chip" style=${() => `background:${l.type === "Static" ? "rgba(52,211,153,0.15)" : "rgba(96,165,250,0.15)"};color:${l.type === "Static" ? "#34d399" : "#60a5fa"}`}>
              ${l.type}
            </span>
          </li>
        `
      )}
    </ul>

    ${() => filtered.value.length === 0
      ? html`<p style="text-align:center;color:#6a6a80;padding:20px">No languages found</p>`
      : null}
  </div>
`.mount("#app");
```
