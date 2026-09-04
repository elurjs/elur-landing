/**
 * Accordion behavior for the static FAQ list. Renders nothing: it wires
 * click handling onto the server-rendered markup.
 */

import { html } from "@elurjs/core";

function Faq() {
  if (typeof document === "undefined") return null;
  const items = Array.from(document.querySelectorAll(".home-faq-item"));

  const toggle = (btn: HTMLElement) => {
    const item = btn.closest(".home-faq-item");
    if (!item) return;
    const isOpen = item.classList.contains("open");
    items.forEach((other) => other.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  };

  items.forEach((item) => {
    item.querySelector(".home-faq-question")?.addEventListener("click", (e) => {
      toggle(e.currentTarget as HTMLElement);
    });
  });

  return html``;
}

export default Faq;
