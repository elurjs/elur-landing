import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Cta(): ElurTemplate {
  return raw(`
<section class="home-cta">
    <div class="home-cta-content animate-on-scroll">
      <h2>Three paths.<br><span class="home-gradient-text">Kit, web, or mobile.</span></h2>
      <p>Build full-stack apps with Elur Kit, web apps with Elur + Elur-UI, or ship mobile apps with Elur-Ionic.
        Add Elur Query as the same async/cache layer in any path.</p>
      <div class="home-cta-actions">
        <a href="/docs/ecosystem/kit/overview/" class="home-btn-primary">
          Explore Elur Kit
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
        <a href="/docs/ecosystem/overview/" class="home-btn-secondary">
          Start Web Path
        </a>
        <a href="#elur-ionic" class="home-btn-secondary">
          Start Mobile Path
        </a>
      </div>
    </div>
  </section>
  `);
}
