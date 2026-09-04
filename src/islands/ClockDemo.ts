import { html, signal, effect } from "@elurjs/core";

function ClockDemo() {
  const currentDate = new Date();
  const time = signal(currentDate.toLocaleTimeString());
  const running = signal(true);
  const ticks = signal(0);
  let interval: ReturnType<typeof setInterval> | null = null;

  const start = () => {
    if (interval) return;
    interval = setInterval(() => {
      currentDate.setSeconds(currentDate.getSeconds() + 1);
      time.value = currentDate.toLocaleTimeString();
    }, 1000);
  };

  const stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const toggle = () => {
    running.value = !running.value;
    if (running.value) start();
    else stop();
  };

  // Start immediately; the island dispose cleans up the interval.
  start();
  const dispose = effect(() => {
    time.value;
    ticks.update((n) => n + 1);
  });

  return html`
        <div class="home-playground-output">
            <div class="home-playground-output-label">Output</div>
        <div class="home-demo-timer-display">${() => time.value}</div>
        <div class="home-demo-timer-label">
            <span class="home-signal-dot active"></span>
            signal updates every second
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
            <div style="font-size:0.78rem;color:var(--c-text-3);">effect() runs:</div>
            <div style="font-family:var(--font-mono);font-size:0.85rem;font-weight:700;color:var(--c-accent-3);">
                ${() => ticks.value}
            </div>
        </div>
        <div class="home-demo-buttons">
            <button class="home-demo-btn home-demo-btn-primary" @click=${toggle}>
                ${() => (running.value ? "⏸ Pause" : "▶ Resume")}
            </button>
        </div>
        </div>
    `;
}

export default ClockDemo;
