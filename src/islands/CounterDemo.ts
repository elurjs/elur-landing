import { html, signal, computed } from "@elurjs/core";

function CounterDemo() {
    const count = signal(0);
    const doubled = computed(() => count.value * 2);
    const label = computed(() =>
        count.value === 0 ? "zero" : count.value > 0 ? "positive" : "negative",
    );
    const labelColor = computed(() =>
        count.value === 0 ? "var(--yellow)" : count.value > 0 ? "var(--green)" : "var(--red)",
    );

    return html`
        <div class="playground-output">
            <div class="playground-output-label">Output</div>
        <div class="demo-counter-value">${() => count.value}</div>
        <div class="demo-computed-value">
            doubled: <span>${() => doubled.value}</span> ·
            <span style=${() => `color: ${labelColor.value}`}>${() => label.value}</span>
        </div>
        <div class="demo-buttons">
            <button class="demo-btn demo-btn-secondary" @click=${() => (count.value -= 1)}>− 1</button>
            <button class="demo-btn demo-btn-primary" @click=${() => (count.value += 1)}>+ 1</button>
            <button class="demo-btn demo-btn-danger" @click=${() => (count.value = 0)}>Reset</button>
        </div>
        </div>
    `;
}

export default CounterDemo;
