import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function HowItWorks(): ElurTemplate {
  return raw(`
<section class="home-section home-how-section" id="how-it-works">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">⚙️ How It Works</div>
        <h2 class="home-section-title">One change. One update.<br><span class="home-gradient-text">Zero overhead.</span></h2>
        <p class="home-section-desc">Under the hood, Elur is a four-layer stack. Each layer does exactly one job — signal,
          compute, bind, render.</p>
      </div>

      <!-- Pipeline -->
      <div class="home-pipeline animate-on-scroll">
        <!-- signal() -->
        <div class="home-pipeline-step">
          <div class="home-pipeline-icon" style="background:rgba(124,92,252,0.12);">
            <span style="font-size:1.5rem">⚡</span>
          </div>
          <div class="home-pipeline-label" style="color:var(--c-accent-3)">signal()</div>
          <div class="home-pipeline-desc">Holds a reactive value. Notifies subscribers on write.</div>
        </div>
        <div class="home-pipeline-arrow">→</div>

        <!-- computed() -->
        <div class="home-pipeline-step">
          <div class="home-pipeline-icon" style="background:rgba(96,165,250,0.12);">
            <span style="font-size:1.5rem">🔗</span>
          </div>
          <div class="home-pipeline-label" style="color:var(--c-blue)">computed()</div>
          <div class="home-pipeline-desc">Derives a value. Re-runs only when its dependencies change.</div>
        </div>
        <div class="home-pipeline-arrow">→</div>

        <!-- effect() -->
        <div class="home-pipeline-step">
          <div class="home-pipeline-icon" style="background:rgba(52,211,153,0.12);">
            <span style="font-size:1.5rem">🔄</span>
          </div>
          <div class="home-pipeline-label" style="color:var(--c-green)">effect()</div>
          <div class="home-pipeline-desc">Auto-tracks reads. Re-runs when any tracked signal changes.</div>
        </div>
        <div class="home-pipeline-arrow">→</div>

        <!-- html\`\` -->
        <div class="home-pipeline-step">
          <div class="home-pipeline-icon" style="background:rgba(251,146,60,0.12);">
            <span style="font-size:1.5rem">🧩</span>
          </div>
          <div class="home-pipeline-label" style="color:#fb923c">html\`\`</div>
          <div class="home-pipeline-desc">Parses once. Each binding is one effect targeting one DOM node.</div>
        </div>
        <div class="home-pipeline-arrow">→</div>

        <!-- DOM -->
        <div class="home-pipeline-step">
          <div class="home-pipeline-icon" style="background:rgba(244,114,182,0.12);">
            <span style="font-size:1.5rem">🖥️</span>
          </div>
          <div class="home-pipeline-label" style="color:var(--c-pink)">DOM Node</div>
          <div class="home-pipeline-desc">Only the exact node that changed gets updated. No diffing.</div>
        </div>
      </div>

      <!-- Key properties -->
      <div class="home-how-features">
        <div class="home-how-feat animate-on-scroll">
          <div class="home-how-feat-title">⚡ <span style="color:var(--c-accent-3)">Subscription is automatic</span></div>
          <p>Reading a signal inside <code>effect()</code> or <code>html\`\`</code> automatically registers a
            subscription. No <code>.subscribe()</code> calls, no decorator, no annotation needed.</p>
        </div>
        <div class="home-how-feat animate-on-scroll">
          <div class="home-how-feat-title">🔁 <span style="color:var(--c-green)">Effect = DOM binding</span></div>
          <p>Each reactive expression inside <code>html\`\`</code> compiles to exactly one <code>effect()</code>. When the
            signal changes, that one effect updates that one text node or attribute — nothing else.</p>
        </div>
        <div class="home-how-feat animate-on-scroll">
          <div class="home-how-feat-title">🧹 <span style="color:var(--c-blue)">Self-cleaning effects</span></div>
          <p>Before each re-run, an effect disposes its previous subscriptions and runs its cleanup function (if any).
            Unmounting a component tears down every effect it owns.</p>
        </div>
        <div class="home-how-feat animate-on-scroll">
          <div class="home-how-feat-title">🎯 <span style="color:#fb923c">Object.is equality</span></div>
          <p>Setting a signal to the same value it already holds is a no-op. No downstream effects are triggered, no DOM
            work happens — not even a microtask.</p>
        </div>
        <div class="home-how-feat animate-on-scroll">
          <div class="home-how-feat-title">📦 <span style="color:var(--c-pink)">batch() flushes once</span></div>
          <p>Multiple signal writes inside <code>batch()</code> queue their effects until the batch ends. All
            subscribers see a consistent snapshot, and the DOM updates exactly once.</p>
        </div>
        <div class="home-how-feat animate-on-scroll">
          <div class="home-how-feat-title">🔒 <span style="color:var(--c-cyan)">untrack() for reads</span></div>
          <p>Read a signal with <code>untrack()</code> to get its value without creating a subscription. Useful for
            reading config or context inside an effect you don't want to re-trigger.</p>
        </div>
      </div>
    </div>
  </section>
  `);
}
