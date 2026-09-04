---
title: Grocery List
description: A grocery list organized by category with add, remove, and quantity controls.
category: state
order: 7
difficulty: intermediate
---

# Grocery List

A grocery list app where items are grouped by category. Add items, remove
them, and adjust quantities. Demonstrates nested `repeat()`, computed grouping,
and complex state management.

```elur
import { html, signal, computed, repeat } from "https://esm.sh/@elurjs/core@3.6.2";

const items = signal([
  { id: 1, name: "Milk", category: "Dairy", qty: 2 },
  { id: 2, name: "Cheese", category: "Dairy", qty: 1 },
  { id: 3, name: "Apples", category: "Produce", qty: 6 },
  { id: 4, name: "Bread", category: "Bakery", qty: 1 },
]);

const newName = signal("");
const newCategory = signal("Produce");

const categories = ["Produce", "Dairy", "Bakery", "Meat", "Other"];

const grouped = computed(() => {
  const map = {};
  for (const item of items.value) {
    if (!map[item.category]) map[item.category] = [];
    map[item.category].push(item);
  }
  return categories
    .filter((c) => map[c])
    .map((c) => ({ category: c, items: map[c] }));
});

const totalItems = computed(() =>
  items.value.reduce((sum, i) => sum + i.qty, 0)
);

const addItem = () => {
  const name = newName.value.trim();
  if (!name) return;
  items.value = [...items.value, {
    id: Date.now(),
    name,
    category: newCategory.value,
    qty: 1,
  }];
  newName.value = "";
};

const changeQty = (id, delta) => {
  items.value = items.value.map((i) =>
    i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
  );
};

const remove = (id) => {
  items.value = items.value.filter((i) => i.id !== id);
};

html`
  <div style="width:100%;max-width:400px">
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <input
        class="search-input"
        placeholder="Item name..."
        value=${() => newName.value}
        @input=${(e) => newName.value = e.target.value}
        @keydown=${(e) => { if (e.key === "Enter") addItem(); }}
      />
      <select
        value=${() => newCategory.value}
        @change=${(e) => newCategory.value = e.target.value}
        style="padding:6px 10px;border:1px solid #2a2a3a;border-radius:8px;background:#16161f;color:#f0f0f5"
      >
        ${categories.map((c) => html`<option value=${c}>${c}</option>`)}
      </select>
      <button class="btn-primary" @click=${addItem}>Add</button>
    </div>

    ${() => repeat(
      grouped.value,
      (g) => g.category,
      (g) => html`
        <div style="margin-bottom:16px">
          <div style="font-size:0.8rem;font-weight:600;color:#2bc7f0;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">
            ${g.category}
          </div>
          ${() => repeat(
            g.items,
            (i) => i.id,
            (i) => html`
              <li>
                <span style="flex:1">${i.name}</span>
                <button class="btn-ghost" style="padding:2px 8px;font-size:0.8rem" @click=${() => changeQty(i.id, -1)}>−</button>
                <span style="min-width:24px;text-align:center;font-family:monospace">${() => i.qty}</span>
                <button class="btn-ghost" style="padding:2px 8px;font-size:0.8rem" @click=${() => changeQty(i.id, 1)}>+</button>
                <button class="btn-ghost" style="padding:2px 8px;font-size:0.8rem" @click=${() => remove(i.id)}>✕</button>
              </li>
            `
          )}
        </div>
      `
    )}

    <p style="color:#a0a0b5;text-align:center;margin-top:12px">
      ${() => totalItems.value} total item${() => totalItems.value === 1 ? "" : "s"}
    </p>
  </div>
`.mount("#app");
```
