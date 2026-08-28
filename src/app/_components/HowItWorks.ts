import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function HowItWorks(): ElurTemplate {
  return raw(`
<section class="section how-section" id="how-it-works">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">⚙️ How It Works</div>
        <h2 class="section-title">One change. One update.<br><span class="gradient-text">Zero overhead.</span></h2>
        <p class="section-desc">Under the hood, Elur is a four-layer stack. Each layer does exactly one job — signal,
          compute, bind, render.</p>
      </div>

      <!-- Pipeline -->
      <div class="pipeline animate-on-scroll">
        <!-- signal() -->
        <div class="pipeline-step">
          <div class="pipeline-icon" style="background:rgba(124,92,252,0.12);">
            <span style="font-size:1.5rem">⚡</span>
          </div>
          <div class="pipeline-label" style="color:var(--accent-light)">signal()</div>
          <div class="pipeline-desc">Holds a reactive value. Notifies subscribers on write.</div>
        </div>
        <div class="pipeline-arrow">→</div>

        <!-- computed() -->
        <div class="pipeline-step">
          <div class="pipeline-icon" style="background:rgba(96,165,250,0.12);">
            <span style="font-size:1.5rem">🔗</span>
          </div>
          <div class="pipeline-label" style="color:var(--blue)">computed()</div>
          <div class="pipeline-desc">Derives a value. Re-runs only when its dependencies change.</div>
        </div>
        <div class="pipeline-arrow">→</div>

        <!-- effect() -->
        <div class="pipeline-step">
          <div class="pipeline-icon" style="background:rgba(52,211,153,0.12);">
            <span style="font-size:1.5rem">🔄</span>
          </div>
          <div class="pipeline-label" style="color:var(--green)">effect()</div>
          <div class="pipeline-desc">Auto-tracks reads. Re-runs when any tracked signal changes.</div>
        </div>
        <div class="pipeline-arrow">→</div>

        <!-- html\`\` -->
        <div class="pipeline-step">
          <div class="pipeline-icon" style="background:rgba(251,146,60,0.12);">
            <span style="font-size:1.5rem">🧩</span>
          </div>
          <div class="pipeline-label" style="color:var(--orange)">html\`\`</div>
          <div class="pipeline-desc">Parses once. Each binding is one effect targeting one DOM node.</div>
        </div>
        <div class="pipeline-arrow">→</div>

        <!-- DOM -->
        <div class="pipeline-step">
          <div class="pipeline-icon" style="background:rgba(244,114,182,0.12);">
            <span style="font-size:1.5rem">🖥️</span>
          </div>
          <div class="pipeline-label" style="color:var(--pink)">DOM Node</div>
          <div class="pipeline-desc">Only the exact node that changed gets updated. No diffing.</div>
        </div>
      </div>

      <!-- Key properties -->
      <div class="how-features">
        <div class="how-feat animate-on-scroll">
          <div class="how-feat-title">⚡ <span style="color:var(--accent-light)">Subscription is automatic</span></div>
          <p>Reading a signal inside <code>effect()</code> or <code>html\`\`</code> automatically registers a
            subscription. No <code>.subscribe()</code> calls, no decorator, no annotation needed.</p>
        </div>
        <div class="how-feat animate-on-scroll">
          <div class="how-feat-title">🔁 <span style="color:var(--green)">Effect = DOM binding</span></div>
          <p>Each reactive expression inside <code>html\`\`</code> compiles to exactly one <code>effect()</code>. When the
            signal changes, that one effect updates that one text node or attribute — nothing else.</p>
        </div>
        <div class="how-feat animate-on-scroll">
          <div class="how-feat-title">🧹 <span style="color:var(--blue)">Self-cleaning effects</span></div>
          <p>Before each re-run, an effect disposes its previous subscriptions and runs its cleanup function (if any).
            Unmounting a component tears down every effect it owns.</p>
        </div>
        <div class="how-feat animate-on-scroll">
          <div class="how-feat-title">🎯 <span style="color:var(--orange)">Object.is equality</span></div>
          <p>Setting a signal to the same value it already holds is a no-op. No downstream effects are triggered, no DOM
            work happens — not even a microtask.</p>
        </div>
        <div class="how-feat animate-on-scroll">
          <div class="how-feat-title">📦 <span style="color:var(--pink)">batch() flushes once</span></div>
          <p>Multiple signal writes inside <code>batch()</code> queue their effects until the batch ends. All
            subscribers see a consistent snapshot, and the DOM updates exactly once.</p>
        </div>
        <div class="how-feat animate-on-scroll">
          <div class="how-feat-title">🔒 <span style="color:var(--cyan)">untrack() for reads</span></div>
          <p>Read a signal with <code>untrack()</code> to get its value without creating a subscription. Useful for
            reading config or context inside an effect you don't want to re-trigger.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Code Showcase -->
  `);
}
