---
title: Modal Dialog
description: A modal dialog with backdrop, escape-to-close, and open/close animations.
category: ui
order: 6
difficulty: intermediate
---

# Modal Dialog

A modal dialog component with a backdrop overlay, escape key to close, and
conditional rendering. Demonstrates conditional templates, event handling, and
keyboard interaction.

```elur
import { html, signal, effect } from "https://esm.sh/@elurjs/core@3.6.2";

const open = signal(false);
const confirmText = signal("");

const openModal = () => {
  confirmText.value = "";
  open.value = true;
};

const closeModal = () => { open.value = false; };

const confirm = () => {
  closeModal();
};

effect(() => {
  if (!open.value) return;
  const handler = (e) => { if (e.key === "Escape") closeModal(); };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
});

html`
  <div style="text-align:center">
    <button class="btn-primary" @click=${openModal}>Open Modal</button>

    ${() =>
      open.value
        ? html`
          <div class="modal-overlay" @click=${closeModal}>
            <div class="modal" @click=${(e) => e.stopPropagation()}>
              <h2 style="margin-bottom:12px">Confirm Action</h2>
              <p style="color:#a0a0b5;margin-bottom:16px">
                Are you sure you want to proceed? This action cannot be undone.
              </p>
              <input
                class="search-input"
                placeholder="Type 'confirm' to proceed"
                value=${() => confirmText.value}
                @input=${(e) => confirmText.value = e.target.value}
              />
              <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
                <button class="btn-ghost" @click=${closeModal}>Cancel</button>
                <button
                  class="btn-primary"
                  disabled=${() => confirmText.value !== "confirm"}
                  @click=${confirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        `
        : null}
  </div>
`.mount("#app");
```
