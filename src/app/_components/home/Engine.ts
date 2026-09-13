import { html } from "@elurjs/core";
import { island } from "@elurjs/kit";
import type { ElurTemplate } from "@elurjs/core";
import GlitchDemo from "../../../islands/GlitchDemo.ts";

export function Engine(): ElurTemplate {
  return html`
    <section class="home-section" id="engine">
      <div class="home-container">
        <div class="home-section-header animate-on-scroll">
          <div class="home-section-label">◇ The v4 engine</div>
          <h2 class="home-section-title">Correctness you can see.</h2>
          <p class="home-section-desc">
            Elur 4 ships a redesigned reactive engine — push-pull, versioned, with real ownership.
            Benchmarks show parity; this is what they can't measure.
          </p>
        </div>
        <div class="home-why-grid">
          <div class="home-why-card animate-on-scroll">
            <div class="home-why-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round">
                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
              </svg>
            </div>
            <h3>Glitch-free by construction</h3>
            <p>Diamond-shaped graphs propagate version-consistent snapshots — effects run once per write and never
              observe torn intermediate state. Try it live below.</p>
          </div>
          <div class="home-why-card animate-on-scroll">
            <div class="home-why-icon cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 5v-2M12 21v-2M5 12H3M21 12h-2M7.8 7.8L6.4 6.4M17.6 17.6l-1.4-1.4M7.8 16.2l-1.4 1.4M17.6 6.4l-1.4 1.4" />
              </svg>
            </div>
            <h3>Lazy computeds</h3>
            <p><code>computed()</code> re-evaluates on read, only when a source actually changed. Cold computeds —
              created but never observed — cost nothing.</p>
          </div>
          <div class="home-why-card animate-on-scroll">
            <div class="home-why-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <h3>Real ownership</h3>
            <p><code>createRoot</code>, <code>onCleanup</code>, <code>runWithOwner</code> — deterministic disposal of
              whole reactive subtrees. No leaked effects, no zombie watchers.</p>
          </div>
          <div class="home-why-card animate-on-scroll">
            <div class="home-why-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>Render-priority scheduling</h3>
            <p>Render effects and user effects run in separate queues — DOM writes never yield to expensive
              user-side work. The flush only cedes the main thread when real input is pending, protecting INP.</p>
          </div>
        </div>

        <div class="animate-on-scroll">
          ${island("GlitchDemo", GlitchDemo, {}, "visible")}
        </div>
      </div>
    </section>
  `;
}
