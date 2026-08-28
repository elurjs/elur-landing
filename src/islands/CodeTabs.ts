import { html, signal } from "@elurjs/core";

const TABS = [
    { id: "reactivity", label: "Reactivity" },
    { id: "component", label: "Component" },
    { id: "router", label: "Router" },
    { id: "store", label: "Store" },
    { id: "forms", label: "Forms" },
];

function CodeTabs() {
    const active = signal("reactivity");

    const select = (id: string) => {
        active.value = id;
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
        document.getElementById(`tab-${id}`)?.classList.add("active");
    };

    return html`
        <div class="code-tabs">
            ${TABS.map((tab) => html`
                <button
                    class=${() => `code-tab${active.value === tab.id ? " active" : ""}`}
                    data-tab=${tab.id}
                    @click=${() => select(tab.id)}
                >
                    ${tab.label}
                </button>
            `)}
        </div>
    `;
}

export default CodeTabs;
