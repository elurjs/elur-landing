import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function InspiredPreview(): ElurTemplate {
  return raw(`
<section class="section inspired-preview-section" id="inspired">
    <div class="container">
      <div class="inspired-preview-card animate-on-scroll">
        <h3>Why trust this approach?</h3>
        <p>
          Elur is not reinventing UI from scratch. It combines proven ideas from frameworks developers already trust:
          tagged templates, fine-grained signals, provide/inject, function components, and auto-tracking.
        </p>
        <div class="inspired-preview-chips">
          <div class="inspired-preview-chip">
            <strong>Lit</strong>
            <span>Templates like Lit, without Web Components overhead.</span>
          </div>
          <div class="inspired-preview-chip">
            <strong>Solid.js</strong>
            <span>Fine-grained reactivity for pure ESM projects.</span>
          </div>
          <div class="inspired-preview-chip">
            <strong>Vue 3</strong>
            <span>The provide/inject pattern you love, zero-dep.</span>
          </div>
          <div class="inspired-preview-chip">
            <strong>React</strong>
            <span>Functional components without hook-rule headaches.</span>
          </div>
          <div class="inspired-preview-chip">
            <strong>Svelte</strong>
            <span>Reactive DX without needing a .svelte compiler.</span>
          </div>
          <div class="inspired-preview-chip">
            <strong>MobX</strong>
            <span>Transparent state tracking for any JS object.</span>
          </div>
        </div>
        <a class="inspired-preview-actions" href="#inspired-deep">
          View technical inspiration breakdown
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  </section>
  `);
}
