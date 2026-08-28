import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Stats(): ElurTemplate {
  return raw(`
<div class="stats container animate-on-scroll">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value purple">~15 KB</div>
        <div class="stat-label">Gzipped bundle</div>
      </div>
      <div class="stat-item">

        <div class="stat-value green">-90%</div>
        <div class="stat-label">Best-case JS-only gain</div>
      </div>
      <div class="stat-item">
        <div class="stat-value orange">1054</div>
        <div class="stat-label">Tests passing</div>
      </div>
      <div class="stat-item">
        <div class="stat-value blue">100%</div>
        <div class="stat-label">TypeScript typed</div>
      </div>
    </div>
  </div>

  <!-- Bundle Size Comparison -->
  `);
}
