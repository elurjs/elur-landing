import { html, signal, computed } from "@elurjs/core";

function CounterDemo() {
    const count = signal(0);
    const doubled = computed(() => count.value * 2);
    const label = computed(() =>
        count.value === 0 ? "zero" : count.value > 0 ? "positive" : "negative",
    );
    const labelColor = computed(() =>
        count.value === 0 ? "var(--c-yellow)" : count.value > 0 ? "var(--c-green)" : "var(--c-red)",
    );

    return html`
        <div class="home-playground-output">
            <div class="home-playground-output-label">Output</div>
        <div class="home-demo-counter-value">${() => count.value}</div>
        <div class="home-demo-computed-value">
            doubled: <span>${() => doubled.value}</span> ·
            <span style=${() => `color: ${labelColor.value}`}>${() => label.value}</span>
        </div>
        <div class="home-demo-buttons">
            <button class="home-demo-btn home-demo-btn-secondary" @click=${() => (count.value -= 1)}>− 1</button>
            <button class="home-demo-btn home-demo-btn-primary" @click=${() => (count.value += 1)}>+ 1</button>
            <button class="home-demo-btn home-demo-btn-danger" @click=${() => (count.value = 0)}>Reset</button>
        </div>
        </div>
    `;
}

export default CounterDemo;
