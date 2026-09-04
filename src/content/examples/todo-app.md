---
title: Todo App
description: A todo list with add, toggle, delete, and filter functionality.
category: state
order: 2
difficulty: intermediate
featured: true
---

# Todo App

A classic todo application demonstrating list rendering with `repeat()`,
computed values for filtering, and signal-based state management.

```elur
import { html, signal, computed, repeat } from "https://esm.sh/@elurjs/core@3.6.2";

const todos = signal([
  { id: 1, text: "Learn Elur signals", done: true },
  { id: 2, text: "Build a todo app", done: false },
  { id: 3, text: "Ship to production", done: false },
]);
const filter = signal("all");
const input = signal("");

const filtered = computed(() => {
  if (filter.value === "active") return todos.value.filter((t) => !t.done);
  if (filter.value === "done") return todos.value.filter((t) => t.done);
  return todos.value;
});

const remaining = computed(() => todos.value.filter((t) => !t.done).length);

const add = () => {
  const text = input.value.trim();
  if (!text) return;
  todos.value = [...todos.value, { id: Date.now(), text, done: false }];
  input.value = "";
};

const toggle = (id) => {
  todos.value = todos.value.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t
  );
};

const remove = (id) => {
  todos.value = todos.value.filter((t) => t.id !== id);
};

html`
  <div style="width:100%;max-width:400px">
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <input
        class="search-input"
        placeholder="Add a todo..."
        value=${() => input.value}
        @input=${(e) => input.value = e.target.value}
        @keydown=${(e) => { if (e.key === "Enter") add(); }}
      />
      <button class="btn-primary" @click=${add}>Add</button>
    </div>

    <div style="display:flex;gap:4px;margin-bottom:12px">
      <button class=${() => `filter-chip${filter.value === "all" ? " active" : ""}`} @click=${() => filter.value = "all"}>All</button>
      <button class=${() => `filter-chip${filter.value === "active" ? " active" : ""}`} @click=${() => filter.value = "active"}>Active</button>
      <button class=${() => `filter-chip${filter.value === "done" ? " active" : ""}`} @click=${() => filter.value = "done"}>Done</button>
    </div>

    <ul>
      ${() => repeat(
        filtered.value,
        (t) => t.id,
        (t) => html`
          <li>
            <input
              type="checkbox"
              checked=${() => t.done}
              @change=${() => toggle(t.id)}
            />
            <span style=${() => `flex:1;text-decoration:${t.done ? "line-through" : "none"};color:${t.done ? "#6a6a80" : "#f0f0f5"}`}>
              ${t.text}
            </span>
            <button class="btn-ghost" style="padding:2px 8px;font-size:0.8rem" @click=${() => remove(t.id)}>✕</button>
          </li>
        `
      )}
    </ul>

    <p style="color:#a0a0b5;text-align:center;margin-top:12px">
      ${() => remaining.value} item${() => remaining.value === 1 ? "" : "s"} remaining
    </p>
  </div>
`.mount("#app");
```
