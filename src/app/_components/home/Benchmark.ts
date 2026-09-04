import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Benchmark(): ElurTemplate {
  return raw(`
<section class="benchmark-section">
  <div class="home-container animate-on-scroll">
    <div class="section-header">
      <div class="section-label">📊 js-framework-benchmark</div>
      <h2 class="section-title">Faster than the frameworks<br><span class="gradient-text">you already use.</span></h2>
      <p class="section-desc">
        Independent results from the <a href="https://krausest.github.io/js-framework-benchmark/2026/chrome152.html" target="_blank" rel="noopener">js-framework-benchmark</a>
        (Chrome 152, keyed implementations). Elur matches Solid and vanilla JS — and beats Vue, Svelte, and React.
      </p>
    </div>

    <div class="benchmark-card">
      <div class="benchmark-card-header">
        <h3>Weighted geometric mean — slowdown vs fastest</h3>
        <span class="benchmark-source">Lower is better</span>
      </div>
      <div class="benchmark-bars">
        <div class="benchmark-bar-row">
          <span class="benchmark-bar-label">vanillajs</span>
          <div class="benchmark-bar-track">
            <div class="benchmark-bar vanilla" style="width: 65%"></div>
          </div>
          <span class="benchmark-bar-value">1.04×</span>
        </div>
        <div class="benchmark-bar-row">
          <span class="benchmark-bar-label">solid</span>
          <div class="benchmark-bar-track">
            <div class="benchmark-bar solid" style="width: 71%"></div>
          </div>
          <span class="benchmark-bar-value">1.13×</span>
        </div>
        <div class="benchmark-bar-row highlight">
          <span class="benchmark-bar-label">elur</span>
          <div class="benchmark-bar-track">
            <div class="benchmark-bar elur" style="width: 71%"></div>
          </div>
          <span class="benchmark-bar-value">1.13×</span>
        </div>
        <div class="benchmark-bar-row">
          <span class="benchmark-bar-label">svelte</span>
          <div class="benchmark-bar-track">
            <div class="benchmark-bar svelte" style="width: 74%"></div>
          </div>
          <span class="benchmark-bar-value">1.17×</span>
        </div>
        <div class="benchmark-bar-row">
          <span class="benchmark-bar-label">vue</span>
          <div class="benchmark-bar-track">
            <div class="benchmark-bar vue" style="width: 83%"></div>
          </div>
          <span class="benchmark-bar-value">1.31×</span>
        </div>
        <div class="benchmark-bar-row">
          <span class="benchmark-bar-label">react</span>
          <div class="benchmark-bar-track">
            <div class="benchmark-bar react" style="width: 100%"></div>
          </div>
          <span class="benchmark-bar-value">1.58×</span>
        </div>
      </div>
    </div>

    <div class="benchmark-grid">
      <div class="benchmark-card">
        <div class="benchmark-card-header">
          <h3>Create 1,000 rows</h3>
          <span class="benchmark-unit">ms</span>
        </div>
        <div class="benchmark-table">
          <div class="benchmark-table-row">
            <span>vanillajs</span><span>20.6</span><span class="slowdown">1.04×</span>
          </div>
          <div class="benchmark-table-row">
            <span>solid</span><span>21.4</span><span class="slowdown">1.08×</span>
          </div>
          <div class="benchmark-table-row highlight">
            <span>elur</span><span>21.7</span><span class="slowdown">1.09×</span>
          </div>
          <div class="benchmark-table-row">
            <span>svelte</span><span>21.9</span><span class="slowdown">1.10×</span>
          </div>
          <div class="benchmark-table-row">
            <span>vue</span><span>24.5</span><span class="slowdown">1.23×</span>
          </div>
          <div class="benchmark-table-row">
            <span>react</span><span>23.7</span><span class="slowdown">1.19×</span>
          </div>
        </div>
      </div>

      <div class="benchmark-card">
        <div class="benchmark-card-header">
          <h3>Swap 2 rows</h3>
          <span class="benchmark-unit">ms</span>
        </div>
        <div class="benchmark-table">
          <div class="benchmark-table-row">
            <span>vanillajs</span><span>10.9</span><span class="slowdown">1.00×</span>
          </div>
          <div class="benchmark-table-row highlight">
            <span>elur</span><span>12.1</span><span class="slowdown">1.11×</span>
          </div>
          <div class="benchmark-table-row">
            <span>solid</span><span>12.6</span><span class="slowdown">1.16×</span>
          </div>
          <div class="benchmark-table-row">
            <span>svelte</span><span>12.6</span><span class="slowdown">1.16×</span>
          </div>
          <div class="benchmark-table-row">
            <span>vue</span><span>13.4</span><span class="slowdown">1.23×</span>
          </div>
          <div class="benchmark-table-row">
            <span>react</span><span>89.9</span><span class="slowdown">8.25×</span>
          </div>
        </div>
      </div>

      <div class="benchmark-card">
        <div class="benchmark-card-header">
          <h3>Partial update</h3>
          <span class="benchmark-unit">ms</span>
        </div>
        <div class="benchmark-table">
          <div class="benchmark-table-row">
            <span>vanillajs</span><span>9.8</span><span class="slowdown">1.05×</span>
          </div>
          <div class="benchmark-table-row highlight">
            <span>elur</span><span>10.2</span><span class="slowdown">1.10×</span>
          </div>
          <div class="benchmark-table-row">
            <span>solid</span><span>10.3</span><span class="slowdown">1.11×</span>
          </div>
          <div class="benchmark-table-row">
            <span>svelte</span><span>10.8</span><span class="slowdown">1.16×</span>
          </div>
          <div class="benchmark-table-row">
            <span>vue</span><span>12.7</span><span class="slowdown">1.37×</span>
          </div>
          <div class="benchmark-table-row">
            <span>react</span><span>14.0</span><span class="slowdown">1.51×</span>
          </div>
        </div>
      </div>

      <div class="benchmark-card">
        <div class="benchmark-card-header">
          <h3>Create 10,000 rows</h3>
          <span class="benchmark-unit">ms</span>
        </div>
        <div class="benchmark-table">
          <div class="benchmark-table-row">
            <span>vanillajs</span><span>212.2</span><span class="slowdown">1.01×</span>
          </div>
          <div class="benchmark-table-row">
            <span>solid</span><span>227.9</span><span class="slowdown">1.09×</span>
          </div>
          <div class="benchmark-table-row highlight">
            <span>elur</span><span>229.4</span><span class="slowdown">1.10×</span>
          </div>
          <div class="benchmark-table-row">
            <span>svelte</span><span>231.0</span><span class="slowdown">1.10×</span>
          </div>
          <div class="benchmark-table-row">
            <span>vue</span><span>264.0</span><span class="slowdown">1.26×</span>
          </div>
          <div class="benchmark-table-row">
            <span>react</span><span>388.9</span><span class="slowdown">1.86×</span>
          </div>
        </div>
      </div>
    </div>

    <div class="benchmark-footer">
      <p>
        Results from <a href="https://krausest.github.io/js-framework-benchmark/2026/chrome152.html" target="_blank" rel="noopener">krausest/js-framework-benchmark</a>
        — Chrome 152, keyed implementations, September 2026.
        Elur v3.6.2 · Solid v1.9.3 · Svelte v5.42.1 · Vue v3.5.39 · React v19.2.0.
      </p>
    </div>
  </div>
</section>
  `);
}
