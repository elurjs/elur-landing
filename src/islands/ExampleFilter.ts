import { html, signal } from "@elurjs/core";

interface ExampleFilterProps {
  categories: string[];
}

function ExampleFilter(props: ExampleFilterProps) {
  const active = signal("all");

  const filter = (cat: string) => {
    active.value = cat;
    const cards = document.querySelectorAll(".gallery-grid .example-card");
    cards.forEach((card) => {
      const cardCat = card.getAttribute("data-category") || "";
      if (cat === "all" || cardCat === cat) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  const allCats = ["all", ...props.categories];

  return html`
    <div class="filter-bar">
      ${allCats.map(
        (cat) => html`
          <button
            class=${() => `filter-btn${active.value === cat ? " active" : ""}`}
            @click=${() => filter(cat)}
          >
            ${cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        `,
      )}
    </div>
  `;
}

export default ExampleFilter;
