import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Interop(): ElurTemplate {
  return raw(`
<section class="section interop-section" id="interop">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">🔌 JavaScript Interop</div>
        <h2 class="section-title">Use DOM-first libraries<br><span class="gradient-text">without wrappers.</span></h2>
        <p class="section-desc">Real integration pattern: use refs, lifecycle hooks, and cleanup exactly as you would
          in production code.</p>
      </div>

      <div class="interop-grid">
        <div class="interop-text animate-on-scroll">
          <h3>Bring your existing stack as-is</h3>
          <p>
            Teams often reject frameworks when integration with existing JS libraries is painful.
            Elur keeps the native DOM model, so you can plug in charting, maps, grids, editors, and media players
            directly.
          </p>
          <div class="interop-libs">
            <div class="interop-lib">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
              <span><strong>Chart.js</strong> Visualizations</span>
            </div>
            <div class="interop-lib">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              <span><strong>MapLibre</strong> Dynamic Maps</span>
            </div>
            <div class="interop-lib">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              <span><strong>AG Grid</strong> Enterprise Grids</span>
            </div>
            <div class="interop-lib">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="m18 16 4-4-4-4"></path>
                <path d="m6 8-4 4 4 4"></path>
                <path d="m14.5 4-5 16"></path>
              </svg>
              <span><strong>Any JS</strong> native DOM plugin</span>
            </div>
          </div>
        </div>

        <div class="interop-code animate-on-scroll">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">chart-integration.ts</span>
          </div>
          <div class="code-body">
            <pre><span class="kw">import</span> { ElurComponent, html, signal, effect, ref } <span class="kw">from</span> <span class="str">"@elurjs/core"</span>;
<span class="kw">import</span> { Chart } <span class="kw">from</span> <span class="str">"chart.js/auto"</span>;

<span class="kw">class</span> <span class="fn">SalesChart</span> <span class="kw">extends</span> <span class="fn">ElurComponent</span> {
  <span class="kw">private</span> canvasRef = <span class="fn">ref</span>&lt;HTMLCanvasElement&gt;();
  <span class="kw">private</span> points = <span class="fn">signal</span>([12, 19, 7]);
  <span class="kw">private</span> chart = <span class="kw">null</span>;

  <span class="fn">render</span>() {
    <span class="kw">return</span> html<span class="str">\`&lt;canvas ref=\${this.canvasRef}&gt;&lt;/canvas&gt;\`</span>;
  }

  <span class="fn">onMount</span>() {
    <span class="kw">const</span> ctx = this.canvasRef.el?.<span class="fn">getContext</span>(<span class="str">"2d"</span>);
    <span class="kw">if</span> (!ctx) <span class="kw">return</span>;

    this.chart = <span class="kw">new</span> <span class="fn">Chart</span>(ctx, { type: <span class="str">"line"</span>, data: { datasets: [{ data: this.points.value }] } });

    <span class="fn">effect</span>(() => {
      this.chart.data.datasets[0].data = this.points.value;
      this.chart.<span class="fn">update</span>();
    });

    <span class="kw">return</span> () => this.chart?.<span class="fn">destroy</span>();
  }
}</pre>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Quick Start -->
  `);
}
