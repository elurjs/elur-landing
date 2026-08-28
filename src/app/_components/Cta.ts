import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Cta(): ElurTemplate {
  return raw(`
<section class="cta">
    <div class="cta-content animate-on-scroll">
      <h2>Three paths.<br><span class="gradient-text">Kit, web, or mobile.</span></h2>
      <p>Build full-stack apps with Elur Kit, web apps with Elur + Elur-UI, or ship mobile apps with Elur-Ionic.
        Add Elur Query as the same async/cache layer in any path.</p>
      <div class="cta-actions">
        <a href="https://kit.elur.dev/" class="btn-primary" target="_blank" rel="noopener">
          Explore Elur Kit
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
        <a href="https://ui.elur.dev/" class="btn-secondary" target="_blank" rel="noopener">
          Start Web Path
        </a>
        <a href="#elur-ionic" class="btn-secondary" rel="noopener">
          Start Mobile Path
        </a>
      </div>
    </div>
  </section>

  <!-- Contribute Section -->
  `);
}
