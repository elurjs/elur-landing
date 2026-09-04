import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function InspiredDeep(): ElurTemplate {
  return raw(`
<section class="home-section home-inspired-section" id="inspired-deep">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">✦ Technical Inspiration Deep Dive</div>
        <h2 class="home-section-title">Inspired by the best.<br><span class="home-gradient-text">Refined into one.</span></h2>
        <p class="home-section-desc">
          Elur didn't emerge in a vacuum. It distills battle-tested ideas from the frameworks that shaped modern UI
          development — taking what works, discarding the overhead.
        </p>
      </div>

      <div class="home-inspired-grid">

        <!-- Lit -->
        <div class="home-inspired-card animate-on-scroll" style="--card-color-a: rgba(32, 120, 244, 0.08)">
          <div class="home-inspired-card-header">
            <div class="home-inspired-card-meta">
              <div class="home-inspired-logo" style="background: rgba(32, 120, 244, 0.12); color: #4d94ff;">L</div>
              <div>
                <div class="home-inspired-card-title">Lit</div>
                <div class="home-inspired-card-subtitle">google.github.io/lit</div>
              </div>
            </div>
            <span class="home-inspired-card-concept"
              style="color: #4d94ff; border-color: rgba(32,120,244,0.25); background: rgba(32,120,244,0.08);">Tagged
              Templates</span>
          </div>
          <p class="home-inspired-card-desc">
            Lit pioneered the idea of using JavaScript's native <strong>tagged template literals</strong> to define HTML
            templates — no compiler, no JSX, no virtual DOM. Elur adopts this exact approach: the <code
              style="color:var(--c-accent-3);font-size:0.8em">html\`\`</code> tag parses templates once and wires live
            bindings directly to real DOM nodes.
          </p>
          <div class="home-inspired-card-code">
            <span style="color:var(--c-text-3)">// Lit's html tag (the original idea)</span><br>
            <span style="color:var(--c-accent-3)">import</span> { html } <span
              style="color:var(--c-accent-3)">from</span> <span style="color:var(--c-green)">'lit'</span>;<br>
            html<span style="color:var(--c-green)">\`&lt;p&gt;Hello \${name}&lt;/p&gt;\`</span>;<br><br>
            <span style="color:var(--c-text-3)">// Elur takes the same approach</span><br>
            <span style="color:var(--c-accent-3)">import</span> { html } <span
              style="color:var(--c-accent-3)">from</span> <span
              style="color:var(--c-green)">'@elurjs/core'</span>;<br>
            html<span style="color:var(--c-green)">\`&lt;p&gt;\${() => name.value}&lt;/p&gt;\`</span>;
          </div>
          <a href="https://lit.dev" target="_blank" rel="noopener" class="home-inspired-card-link" style="color: #4d94ff;">
            lit.dev
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- Solid.js -->
        <div class="home-inspired-card animate-on-scroll" style="--card-color-a: rgba(66, 183, 121, 0.08)">
          <div class="home-inspired-card-header">
            <div class="home-inspired-card-meta">
              <div class="home-inspired-logo" style="background: rgba(66, 183, 121, 0.12); color: var(--c-green);">◆</div>
              <div>
                <div class="home-inspired-card-title">Solid.js</div>
                <div class="home-inspired-card-subtitle">solidjs.com</div>
              </div>
            </div>
            <span class="home-inspired-card-concept"
              style="color: var(--c-green); border-color: rgba(52,211,153,0.25); background: rgba(52, 211, 153, 0.15);">Fine-Grained
              Signals</span>
          </div>
          <p class="home-inspired-card-desc">
            Solid.js proved that <strong>signal-based fine-grained reactivity</strong> doesn't need a virtual DOM — just
            wire effects directly to DOM nodes. Elur adopts the same reactive core: <code
              style="color:var(--c-accent-3);font-size:0.8em">signal()</code>, <code
              style="color:var(--c-accent-3);font-size:0.8em">computed()</code>, and <code
              style="color:var(--c-accent-3);font-size:0.8em">effect()</code> are the three primitives that power
            everything.
          </p>
          <div class="home-inspired-card-code">
            <span style="color:var(--c-text-3)">// Solid.js reactive primitives</span><br>
            <span style="color:var(--c-accent-3)">const</span> [count, setCount] = <span
              style="color:var(--c-blue)">createSignal</span>(<span style="color:#fb923c">0</span>);<br>
            <span style="color:var(--c-blue)">createEffect</span>(() => console.<span
              style="color:var(--c-blue)">log</span>(count()));<br><br>
            <span style="color:var(--c-text-3)">// Elur — same concept, unified API</span><br>
            <span style="color:var(--c-accent-3)">const</span> count = <span
              style="color:var(--c-blue)">signal</span>(<span style="color:#fb923c">0</span>);<br>
            <span style="color:var(--c-blue)">effect</span>(() => console.<span
              style="color:var(--c-blue)">log</span>(count.value));
          </div>
          <a href="https://www.solidjs.com" target="_blank" rel="noopener" class="home-inspired-card-link"
            style="color: var(--c-green);">
            solidjs.com
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- Vue 3 -->
        <div class="home-inspired-card animate-on-scroll" style="--card-color-a: rgba(65, 184, 131, 0.06)">
          <div class="home-inspired-card-header">
            <div class="home-inspired-card-meta">
              <div class="home-inspired-logo" style="background: rgba(65, 184, 131, 0.12); color: #42d392;">V</div>
              <div>
                <div class="home-inspired-card-title">Vue 3</div>
                <div class="home-inspired-card-subtitle">vuejs.org</div>
              </div>
            </div>
            <span class="home-inspired-card-concept"
              style="color: #42d392; border-color: rgba(65,184,131,0.25); background: rgba(65,184,131,0.08);">Composition
              API</span>
          </div>
          <p class="home-inspired-card-desc">
            Vue 3's Composition API introduced <strong>provide/inject</strong>, <code
              style="color:var(--c-accent-3);font-size:0.8em">watch()</code>, and typed lifecycle hooks as first-class
            citizens. Elur mirrors this exactly: typed injection keys via <code
              style="color:var(--c-accent-3);font-size:0.8em">createInjectionKey()</code>, <code
              style="color:var(--c-accent-3);font-size:0.8em">watch()</code> with immediate/once options, and <code
              style="color:var(--c-accent-3);font-size:0.8em">onMount</code> / <code
              style="color:var(--c-accent-3);font-size:0.8em">onUnmount</code> hooks.
          </p>
          <div class="home-inspired-card-code">
            <span style="color:var(--c-text-3)">// Vue 3 — provide / inject</span><br>
            <span style="color:var(--c-blue)">provide</span>(<span style="color:var(--c-green)">'theme'</span>, <span
              style="color:var(--c-blue)">ref</span>(<span style="color:var(--c-green)">'dark'</span>));<br>
            <span style="color:var(--c-accent-3)">const</span> theme = <span
              style="color:var(--c-blue)">inject</span>(<span style="color:var(--c-green)">'theme'</span>);<br><br>
            <span style="color:var(--c-text-3)">// Elur — typed keys</span><br>
            <span style="color:var(--c-accent-3)">const</span> THEME = <span
              style="color:var(--c-blue)">createInjectionKey</span>&lt;Signal&lt;<span
              style="color:var(--c-yellow)">string</span>&gt;&gt;(<span style="color:var(--c-green)">'theme'</span>);<br>
            <span style="color:var(--c-blue)">provide</span>(THEME, <span style="color:var(--c-blue)">signal</span>(<span
              style="color:var(--c-green)">'dark'</span>));
          </div>
          <a href="https://vuejs.org" target="_blank" rel="noopener" class="home-inspired-card-link" style="color: #42d392;">
            vuejs.org
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- React -->
        <div class="home-inspired-card animate-on-scroll" style="--card-color-a: rgba(97, 218, 251, 0.06)">
          <div class="home-inspired-card-header">
            <div class="home-inspired-card-meta">
              <div class="home-inspired-logo" style="background: rgba(97,218,251,0.1); color: var(--c-cyan);">⚛</div>
              <div>
                <div class="home-inspired-card-title">React</div>
                <div class="home-inspired-card-subtitle">react.dev</div>
              </div>
            </div>
            <span class="home-inspired-card-concept"
              style="color: var(--c-cyan); border-color: rgba(34,211,238,0.25); background: rgba(34,211,238,0.08);">Hooks
              Model</span>
          </div>
          <p class="home-inspired-card-desc">
            React proved that <strong>function components with colocated state</strong> are more composable than
            class-only patterns. Elur supports both: function components (plain functions + <code
              style="color:var(--c-accent-3);font-size:0.8em">html\`\`</code>, zero boilerplate) and class components
            (<code style="color:var(--c-accent-3);font-size:0.8em">ElurComponent</code>) only when lifecycle hooks are
            needed.
          </p>
          <div class="home-inspired-card-code">
            <span style="color:var(--c-text-3)">// React — function component + state</span><br>
            <span style="color:var(--c-accent-3)">function</span> <span style="color:var(--c-blue)">Counter</span>()
            {<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">const</span> [n, setN] = <span
              style="color:var(--c-blue)">useState</span>(<span style="color:#fb923c">0</span>);<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">return</span> &lt;button onClick={() =>
            setN(n+1)}&gt;{n}&lt;/button&gt;;<br>
            }<br><br>
            <span style="color:var(--c-text-3)">// Elur — no JSX, no compiler</span><br>
            <span style="color:var(--c-accent-3)">function</span> <span style="color:var(--c-blue)">Counter</span>():
            <span style="color:var(--c-yellow)">ElurTemplate</span> {<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">const</span> n = <span
              style="color:var(--c-blue)">signal</span>(<span style="color:#fb923c">0</span>);<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">return</span> html<span
              style="color:var(--c-green)">\`&lt;button @click=\${() => n.value++}&gt;\${() =>
              n.value}&lt;/button&gt;\`</span>;<br>
            }
          </div>
          <a href="https://react.dev" target="_blank" rel="noopener" class="home-inspired-card-link"
            style="color: var(--c-cyan);">
            react.dev
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- Svelte -->
        <div class="home-inspired-card animate-on-scroll" style="--card-color-a: rgba(255, 62, 0, 0.06)">
          <div class="home-inspired-card-header">
            <div class="home-inspired-card-meta">
              <div class="home-inspired-logo" style="background: rgba(255,62,0,0.12); color: #fb923c;">S</div>
              <div>
                <div class="home-inspired-card-title">Svelte</div>
                <div class="home-inspired-card-subtitle">svelte.dev</div>
              </div>
            </div>
            <span class="home-inspired-card-concept"
              style="color: #fb923c; border-color: rgba(251,146,60,0.25); background: rgba(251,146,60,0.08);">CSS
              Transitions</span>
          </div>
          <p class="home-inspired-card-desc">
            Svelte's built-in <code style="color:var(--c-accent-3);font-size:0.8em">transition:</code> directive made
            animations a first-class concern — without a separate animation library. Elur's <code
              style="color:var(--c-accent-3);font-size:0.8em">transition()</code> brings the same mental model: CSS
            class-based enter/leave lifecycle with optional JS hooks and <code
              style="color:var(--c-accent-3);font-size:0.8em">appear</code> on first render.
          </p>
          <div class="home-inspired-card-code">
            <span style="color:var(--c-text-3)">// Svelte — transition directive</span><br>
            &lt;div <span style="color:var(--c-blue)">transition:fade</span>&gt;Hello!&lt;/div&gt;<br><br>
            <span style="color:var(--c-text-3)">// Elur — same idea, no compiler</span><br>
            <span style="color:var(--c-blue)">transition</span>(<br>
            &nbsp;&nbsp;() => show.value ? html<span style="color:var(--c-green)">\`&lt;p&gt;Hello!&lt;/p&gt;\`</span> :
            <span style="color:var(--c-accent-3)">null</span>,<br>
            &nbsp;&nbsp;{ name: <span style="color:var(--c-green)">'fade'</span>, appear: <span
              style="color:#fb923c">true</span> }<br>
            );
          </div>
          <a href="https://svelte.dev" target="_blank" rel="noopener" class="home-inspired-card-link"
            style="color: #fb923c;">
            svelte.dev
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- MobX / Reactivity Pattern -->
        <div class="home-inspired-card animate-on-scroll" style="--card-color-a: rgba(244, 114, 182, 0.06)">
          <div class="home-inspired-card-header">
            <div class="home-inspired-card-meta">
              <div class="home-inspired-logo" style="background: rgba(244,114,182,0.12); color: var(--c-pink);">M</div>
              <div>
                <div class="home-inspired-card-title">MobX &amp; S.js</div>
                <div class="home-inspired-card-subtitle">Observer pattern</div>
              </div>
            </div>
            <span class="home-inspired-card-concept"
              style="color: var(--c-pink); border-color: rgba(244,114,182,0.25); background: rgba(244,114,182,0.08);">Auto-tracking</span>
          </div>
          <p class="home-inspired-card-desc">
            MobX introduced <strong>transparent reactive tracking</strong> — read a value inside a reaction, and you're
            automatically subscribed, no boilerplate. S.js formalized this into a dependency graph with <code
              style="color:var(--c-accent-3);font-size:0.8em">batch()</code> and <code
              style="color:var(--c-accent-3);font-size:0.8em">untrack()</code>. Elur inherits both: effects
            auto-track their dependencies and <code style="color:var(--c-accent-3);font-size:0.8em">untrack()</code>
            lets you opt out selectively.
          </p>
          <div class="home-inspired-card-code">
            <span style="color:var(--c-text-3)">// Elur batch + untrack — from MobX/S.js</span><br>
            <span style="color:var(--c-blue)">batch</span>(() => {<br>
            &nbsp;&nbsp;price.value = <span style="color:#fb923c">20</span>;&nbsp;&nbsp;<span
              style="color:var(--c-text-3)">// writes queued</span><br>
            &nbsp;&nbsp;qty.value = <span style="color:#fb923c">3</span>;&nbsp;&nbsp;&nbsp;&nbsp;<span
              style="color:var(--c-text-3)">// effect runs once</span><br>
            });<br><br>
            <span style="color:var(--c-blue)">effect</span>(() => {<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">const</span> a =
            price.value;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--c-text-3)"></span><br>//
            not tracked<br>
            &nbsp;&nbsp;<span style="color:var(--c-accent-3)">const</span> b = <span
              style="color:var(--c-blue)">untrack</span>(() => qty.value); <span
              style="color:var(--c-text-3)"></span><br>
            });
          </div>
          <a href="https://mobx.js.org" target="_blank" rel="noopener" class="home-inspired-card-link"
            style="color: var(--c-pink);">
            mobx.js.org
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

      </div>

      <!-- Closing quote -->
      <div class="home-inspired-quote animate-on-scroll">
        <p>
          The best frameworks aren't built from scratch — they're built on the shoulders of great ideas.
          Elur studies what works across the ecosystem and brings it together: <strong>tagged templates from
            Lit</strong>,
          <strong>fine-grained signals from Solid</strong>, <strong>provide/inject from Vue</strong>,
          <strong>function components from React</strong>, <strong>CSS transitions from Svelte</strong>,
          and <strong>transparent auto-tracking from MobX</strong> — unified into a single, zero-dependency,
          compiler-free package that respects your time and your bundle size.
        </p>
        <div class="home-inspired-quote-source">— Design philosophy of Elur</div>
      </div>
    </div>
  </section>
  `);
}
