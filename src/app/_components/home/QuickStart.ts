import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function QuickStart(): ElurTemplate {
  return raw(`
<section class="home-section home-quickstart-section" id="quickstart">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">🚀 Quick Start</div>
        <h2 class="home-section-title">From zero to reactive<br><span class="home-gradient-text">in three steps.</span></h2>
        <p class="home-section-desc">No compiler, no config files, no boilerplate. Just install, write, and go.</p>
      </div>

      <div class="home-steps-grid animate-on-scroll">
        <!-- Step 1 -->
        <div class="home-step-card">
          <div class="home-step-number">Install</div>
          <h3>Add to your project</h3>
          <p>One package, zero runtime dependencies. Works with Vite, Webpack, or directly via ESM CDN.</p>
          <div class="home-step-code">
            <span style="color:var(--c-text-3)"># npm</span><br>
            <span style="color:var(--c-green)">$</span> npm install <span
              style="color:var(--c-accent-3)">@elurjs/core</span><br><br>
            <span style="color:var(--c-text-3)"># or scaffold a full project</span><br>
            <span style="color:var(--c-green)">$</span> npx create-elur-app <span
              style="color:var(--c-accent-3)">my-app</span><br><br>
            <span style="color:var(--c-text-3)"># or via ESM CDN (no install)</span><br>
            <span style="color:var(--c-accent-3)">import</span> { signal } <span
              style="color:var(--c-accent-3)">from</span><br>
            &nbsp;&nbsp;<span style="color:var(--c-green)">"https://esm.sh/@elurjs/core@3.6.2"</span>;
          </div>
        </div>

        <!-- Step 2 -->
        <div class="home-step-card">
          <div class="home-step-number">Create</div>
          <h3>Write your component</h3>
          <p>A plain function returning <code
              style="color:var(--c-accent-3);background:var(--c-accent-subtle);padding:2px 6px;border-radius:4px;font-size:0.82em">html\`\`</code>
            is all you need. No class, no decorator, no JSX transform.</p>
          <div class="home-step-code">
            <span style="color:var(--c-accent-3)">import</span> { signal, html } <span
              style="color:var(--c-accent-3)">from</span> <span
              style="color:var(--c-green)">"@elurjs/core"</span>;<br><br>
            <span style="color:var(--c-accent-3)">function</span> <span style="color:var(--c-blue)">App</span>() {<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">const</span> count = <span
              style="color:var(--c-blue)">signal</span>(<span style="color:#fb923c">0</span>);<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">return</span> <span
              style="color:var(--c-blue)">html</span><span style="color:var(--c-green)">\`<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;\${() => count.value}&lt;/p&gt;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;button @click=\${() => count.value++}&gt;<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Click me<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;/button&gt;<br>
              &nbsp;&nbsp;\`</span>;<br>
            }
          </div>
        </div>

        <!-- Step 3 -->
        <div class="home-step-card">
          <div class="home-step-number">Mount</div>
          <h3>Render to the DOM</h3>
          <p>Call <code
              style="color:var(--c-accent-3);background:var(--c-accent-subtle);padding:2px 6px;border-radius:4px;font-size:0.82em">mount()</code>
            once. Every signal update after this happens automatically — no re-render calls, no manual DOM updates.</p>
          <div class="home-step-code">
            <span style="color:var(--c-accent-3)">import</span> { mount } <span
              style="color:var(--c-accent-3)">from</span> <span
              style="color:var(--c-green)">"@elurjs/core"</span>;<br><br>
            <span style="color:var(--c-text-3)">// index.html: &lt;div id="app"&gt;&lt;/div&gt;</span><br><br>
            <span style="color:var(--c-blue)">mount</span>(<span style="color:var(--c-blue)">App</span>(), <span
              style="color:var(--c-green)">"#app"</span>);<br><br>
            <span style="color:var(--c-text-3)">// That's it. The app is live. ✓</span>
          </div>
        </div>
      </div>

      <div class="home-quickstart-note animate-on-scroll">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" style="flex-shrink:0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>No <code
            style="color:var(--c-accent-3);background:rgba(124,92,252,0.12);padding:2px 8px;border-radius:4px">tsconfig.json</code>,
          no <code
            style="color:var(--c-accent-3);background:rgba(124,92,252,0.12);padding:2px 8px;border-radius:4px">vite.config.ts</code>,
          no <code
            style="color:var(--c-accent-3);background:rgba(124,92,252,0.12);padding:2px 8px;border-radius:4px">babel.config.js</code>
          required — run it straight from the browser with an import map.</span>
      </div>

      <!-- Comparison: No Build Step -->
      <div class="home-flow-comparison animate-on-scroll">
        <div class="home-flow-card">
          <h4>Traditional Frameworks</h4>
          <ul class="home-flow-steps">
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Configure build tool (Vite/Webpack)</li>
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Set up Babel/SWC transpilation</li>
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Bundle compilation (Heavy artifacts)</li>
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Debug compiled/minified code</li>
          </ul>
        </div>
        <div class="home-flow-card elur">
          <h4>The Elur Way</h4>
          <ul class="home-flow-steps">
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Create <code>index.html</code></li>
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Import via CDN or local ESM</li>
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Write pure JS templates</li>
            <li class="home-flow-step-item"><span class="home-flow-dot"></span> Debug exactly what you wrote</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  `);
}
