import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function SizeBench(): ElurTemplate {
  return raw(`
<section class="size-bench-section">
    <div class="container animate-on-scroll">
      <div class="section-header">
        <div class="section-label">📊 Lean by design</div>
        <h2 class="section-title">The Lightweight<br><span class="gradient-text">Framework.</span></h2>
        <p class="section-desc">We include the router, forms, and state management in a bundle smaller than other
          frameworks' core runtimes.</p>
      </div>

      <div class="size-bench-grid">
        <div class="size-bar-container">
          <!-- React -->
          <div class="size-bar-item">
            <div class="size-label">React + DOM</div>
            <div class="size-bar-wrapper">
              <div class="size-bar" style="width: 100%; background: #888;"></div>
            </div>
            <div class="size-value">~42 KB</div>
          </div>
          <!-- Vue -->
          <div class="size-bar-item">
            <div class="size-label">Vue 3</div>
            <div class="size-bar-wrapper">
              <div class="size-bar" style="width: 80%; background: #42b883;"></div>
            </div>
            <div class="size-value">~34 KB</div>
          </div>
          <!-- Elur -->
          <div class="size-bar-item">
            <div class="size-label">Elur (Total)</div>
            <div class="size-bar-wrapper">
              <div class="size-bar"
                style="width: 28%; background: var(--accent); box-shadow: 0 0 15px var(--accent-glow);"></div>
            </div>
            <div class="size-value" style="color: var(--accent-light);">~15 KB</div>
          </div>
        </div>
        <p style="text-align: center; font-size: 0.8rem; color: var(--text-muted); margin-top: 10px;">
          * Gzipped sizes including core + standard internal features.
        </p>
      </div>
    </div>
  </section>
  `);
}
