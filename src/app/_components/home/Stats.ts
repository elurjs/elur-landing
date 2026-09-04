import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Stats(): ElurTemplate {
  return raw(`
<div class="home-stats home-container animate-on-scroll">
    <div class="home-stats-grid">
      <div class="home-stat-item">
        <div class="home-stat-value purple">~15 KB</div>
        <div class="home-stat-label">Gzipped bundle</div>
      </div>
      <div class="home-stat-item">

        <div class="home-stat-value green">-90%</div>
        <div class="home-stat-label">Best-case JS-only gain</div>
      </div>
      <div class="home-stat-item">
        <div class="home-stat-value orange">1054</div>
        <div class="home-stat-label">Tests passing</div>
      </div>
      <div class="home-stat-item">
        <div class="home-stat-value blue">100%</div>
        <div class="home-stat-label">TypeScript typed</div>
      </div>
    </div>
  </div>
  `);
}
