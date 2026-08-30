import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function QuickStart(): ElurTemplate {
  return raw(`
<section class="section quickstart-section" id="quickstart">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">🚀 Quick Start</div>
        <h2 class="section-title">From zero to reactive<br><span class="gradient-text">in three steps.</span></h2>
        <p class="section-desc">No compiler, no config files, no boilerplate. Just install, write, and go.</p>
      </div>

      <div class="steps-grid animate-on-scroll">
        <!-- Step 1 -->
        <div class="step-card">
          <div class="step-number">Install</div>
          <h3>Add to your project</h3>
          <p>One package, zero runtime dependencies. Works with Vite, Webpack, or directly via ESM CDN.</p>
          <div class="step-code">
            <span style="color:var(--text-muted)"># npm</span><br>
            <span style="color:var(--green)">$</span> npm install <span
              style="color:var(--accent-light)">@elurjs/core</span><br><br>
            <span style="color:var(--text-muted)"># or scaffold a full project</span><br>
            <span style="color:var(--green)">$</span> npx create-elur-app <span
              style="color:var(--accent-light)">my-app</span><br><br>
            <span style="color:var(--text-muted)"># or via ESM CDN (no install)</span><br>
            <span style="color:var(--accent-light)">import</span> { signal } <span
              style="color:var(--accent-light)">from</span><br>
            &nbsp;&nbsp;<span style="color:var(--green)">"https://esm.sh/@elurjs/core@3.6.0"</span>;
          </div>
        </div>

        <!-- Step 2 -->
        <div class="step-card">
          <div class="step-number">Create</div>
          <h3>Write your component</h3>
          <p>A plain function returning <code
              style="color:var(--accent-light);background:var(--accent-subtle);padding:2px 6px;border-radius:4px;font-size:0.82em">html\`\`</code>
            is all you need. No class, no decorator, no JSX transform.</p>
          <div class="step-code">
            <span style="color:var(--accent-light)">import</span> { signal, html } <span
              style="color:var(--accent-light)">from</span> <span
              style="color:var(--green)">"@elurjs/core"</span>;<br><br>
            <span style="color:var(--accent-light)">function</span> <span style="color:var(--blue)">App</span>() {<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">const</span> count = <span
              style="color:var(--blue)">signal</span>(<span style="color:var(--orange)">0</span>);<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">return</span> <span
              style="color:var(--blue)">html</span><span style="color:var(--green)">\`<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;\${() => count.value}&lt;/p&gt;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;button @click=\${() => count.value++}&gt;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Click me<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;/button&gt;<br>
              &nbsp;&nbsp;\`</span>;<br>
            }
          </div>
        </div>

        <!-- Step 3 -->
        <div class="step-card">
          <div class="step-number">Mount</div>
          <h3>Render to the DOM</h3>
          <p>Call <code
              style="color:var(--accent-light);background:var(--accent-subtle);padding:2px 6px;border-radius:4px;font-size:0.82em">mount()</code>
            once. Every signal update after this happens automatically — no re-render calls, no manual DOM updates.</p>
          <div class="step-code">
            <span style="color:var(--accent-light)">import</span> { mount } <span
              style="color:var(--accent-light)">from</span> <span
              style="color:var(--green)">"@elurjs/core"</span>;<br><br>
            <span style="color:var(--text-muted)">// index.html: &lt;div id="app"&gt;&lt;/div&gt;</span><br><br>
            <span style="color:var(--blue)">mount</span>(<span style="color:var(--blue)">App</span>(), <span
              style="color:var(--green)">"#app"</span>);<br><br>
            <span style="color:var(--text-muted)">// That's it. The app is live. ✓</span>
          </div>
        </div>
      </div>

      <div class="quickstart-note animate-on-scroll">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" style="flex-shrink:0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>No <code
            style="color:var(--accent-light);background:rgba(124,92,252,0.12);padding:2px 8px;border-radius:4px">tsconfig.json</code>,
          no <code
            style="color:var(--accent-light);background:rgba(124,92,252,0.12);padding:2px 8px;border-radius:4px">vite.config.ts</code>,
          no <code
            style="color:var(--accent-light);background:rgba(124,92,252,0.12);padding:2px 8px;border-radius:4px">babel.config.js</code>
          required — run it straight from the browser with an import map.</span>
      </div>

      <!-- Comparison: No Build Step -->
      <div class="flow-comparison animate-on-scroll">
        <div class="flow-card">
          <h4>Traditional Frameworks</h4>
          <ul class="flow-steps">
            <li class="flow-step-item"><span class="flow-dot"></span> Configure build tool (Vite/Webpack)</li>
            <li class="flow-step-item"><span class="flow-dot"></span> Set up Babel/SWC transpilation</li>
            <li class="flow-step-item"><span class="flow-dot"></span> Bundle compilation (Heavy artifacts)</li>
            <li class="flow-step-item"><span class="flow-dot"></span> Debug compiled/minified code</li>
          </ul>
        </div>
        <div class="flow-card elur">
          <h4>The Elur Way</h4>
          <ul class="flow-steps">
            <li class="flow-step-item"><span class="flow-dot"></span> Create <code>index.html</code></li>
            <li class="flow-step-item"><span class="flow-dot"></span> Import via CDN or local ESM</li>
            <li class="flow-step-item"><span class="flow-dot"></span> Write pure JS templates</li>
            <li class="flow-step-item"><span class="flow-dot"></span> Debug exactly what you wrote</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Elur -->
  `);
}
