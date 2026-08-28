import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function InspiredDeep(): ElurTemplate {
  return raw(`
<section class="section inspired-section" id="inspired-deep">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">✦ Technical Inspiration Deep Dive</div>
        <h2 class="section-title">Inspired by the best.<br><span class="gradient-text">Refined into one.</span></h2>
        <p class="section-desc">
          Elur didn't emerge in a vacuum. It distills battle-tested ideas from the frameworks that shaped modern UI
          development — taking what works, discarding the overhead.
        </p>
      </div>

      <div class="inspired-grid">

        <!-- Lit -->
        <div class="inspired-card animate-on-scroll" style="--card-color-a: rgba(32, 120, 244, 0.08)">
          <div class="inspired-card-header">
            <div class="inspired-card-meta">
              <div class="inspired-logo" style="background: rgba(32, 120, 244, 0.12); color: #4d94ff;">L</div>
              <div>
                <div class="inspired-card-title">Lit</div>
                <div class="inspired-card-subtitle">google.github.io/lit</div>
              </div>
            </div>
            <span class="inspired-card-concept"
              style="color: #4d94ff; border-color: rgba(32,120,244,0.25); background: rgba(32,120,244,0.08);">Tagged
              Templates</span>
          </div>
          <p class="inspired-card-desc">
            Lit pioneered the idea of using JavaScript's native <strong>tagged template literals</strong> to define HTML
            templates — no compiler, no JSX, no virtual DOM. Elur adopts this exact approach: the <code
              style="color:var(--accent-light);font-size:0.8em">html\`\`</code> tag parses templates once and wires live
            bindings directly to real DOM nodes.
          </p>
          <div class="inspired-card-code">
            <span style="color:var(--text-muted)">// Lit's html tag (the original idea)</span><br>
            <span style="color:var(--accent-light)">import</span> { html } <span
              style="color:var(--accent-light)">from</span> <span style="color:var(--green)">'lit'</span>;<br>
            html<span style="color:var(--green)">\`&lt;p&gt;Hello \${name}&lt;/p&gt;\`</span>;<br><br>
            <span style="color:var(--text-muted)">// Elur takes the same approach</span><br>
            <span style="color:var(--accent-light)">import</span> { html } <span
              style="color:var(--accent-light)">from</span> <span
              style="color:var(--green)">'@elurjs/core'</span>;<br>
            html<span style="color:var(--green)">\`&lt;p&gt;\${() => name.value}&lt;/p&gt;\`</span>;
          </div>
          <a href="https://lit.dev" target="_blank" rel="noopener" class="inspired-card-link" style="color: #4d94ff;">
            lit.dev
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- Solid.js -->
        <div class="inspired-card animate-on-scroll" style="--card-color-a: rgba(66, 183, 121, 0.08)">
          <div class="inspired-card-header">
            <div class="inspired-card-meta">
              <div class="inspired-logo" style="background: rgba(66, 183, 121, 0.12); color: var(--green);">◆</div>
              <div>
                <div class="inspired-card-title">Solid.js</div>
                <div class="inspired-card-subtitle">solidjs.com</div>
              </div>
            </div>
            <span class="inspired-card-concept"
              style="color: var(--green); border-color: rgba(52,211,153,0.25); background: var(--green-glow);">Fine-Grained
              Signals</span>
          </div>
          <p class="inspired-card-desc">
            Solid.js proved that <strong>signal-based fine-grained reactivity</strong> doesn't need a virtual DOM — just
            wire effects directly to DOM nodes. Elur adopts the same reactive core: <code
              style="color:var(--accent-light);font-size:0.8em">signal()</code>, <code
              style="color:var(--accent-light);font-size:0.8em">computed()</code>, and <code
              style="color:var(--accent-light);font-size:0.8em">effect()</code> are the three primitives that power
            everything.
          </p>
          <div class="inspired-card-code">
            <span style="color:var(--text-muted)">// Solid.js reactive primitives</span><br>
            <span style="color:var(--accent-light)">const</span> [count, setCount] = <span
              style="color:var(--blue)">createSignal</span>(<span style="color:var(--orange)">0</span>);<br>
            <span style="color:var(--blue)">createEffect</span>(() => console.<span
              style="color:var(--blue)">log</span>(count()));<br><br>
            <span style="color:var(--text-muted)">// Elur — same concept, unified API</span><br>
            <span style="color:var(--accent-light)">const</span> count = <span
              style="color:var(--blue)">signal</span>(<span style="color:var(--orange)">0</span>);<br>
            <span style="color:var(--blue)">effect</span>(() => console.<span
              style="color:var(--blue)">log</span>(count.value));
          </div>
          <a href="https://www.solidjs.com" target="_blank" rel="noopener" class="inspired-card-link"
            style="color: var(--green);">
            solidjs.com
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- Vue 3 -->
        <div class="inspired-card animate-on-scroll" style="--card-color-a: rgba(65, 184, 131, 0.06)">
          <div class="inspired-card-header">
            <div class="inspired-card-meta">
              <div class="inspired-logo" style="background: rgba(65, 184, 131, 0.12); color: #42d392;">V</div>
              <div>
                <div class="inspired-card-title">Vue 3</div>
                <div class="inspired-card-subtitle">vuejs.org</div>
              </div>
            </div>
            <span class="inspired-card-concept"
              style="color: #42d392; border-color: rgba(65,184,131,0.25); background: rgba(65,184,131,0.08);">Composition
              API</span>
          </div>
          <p class="inspired-card-desc">
            Vue 3's Composition API introduced <strong>provide/inject</strong>, <code
              style="color:var(--accent-light);font-size:0.8em">watch()</code>, and typed lifecycle hooks as first-class
            citizens. Elur mirrors this exactly: typed injection keys via <code
              style="color:var(--accent-light);font-size:0.8em">createInjectionKey()</code>, <code
              style="color:var(--accent-light);font-size:0.8em">watch()</code> with immediate/once options, and <code
              style="color:var(--accent-light);font-size:0.8em">onMount</code> / <code
              style="color:var(--accent-light);font-size:0.8em">onUnmount</code> hooks.
          </p>
          <div class="inspired-card-code">
            <span style="color:var(--text-muted)">// Vue 3 — provide / inject</span><br>
            <span style="color:var(--blue)">provide</span>(<span style="color:var(--green)">'theme'</span>, <span
              style="color:var(--blue)">ref</span>(<span style="color:var(--green)">'dark'</span>));<br>
            <span style="color:var(--accent-light)">const</span> theme = <span
              style="color:var(--blue)">inject</span>(<span style="color:var(--green)">'theme'</span>);<br><br>
            <span style="color:var(--text-muted)">// Elur — typed keys</span><br>
            <span style="color:var(--accent-light)">const</span> THEME = <span
              style="color:var(--blue)">createInjectionKey</span>&lt;Signal&lt;<span
              style="color:var(--yellow)">string</span>&gt;&gt;(<span style="color:var(--green)">'theme'</span>);<br>
            <span style="color:var(--blue)">provide</span>(THEME, <span style="color:var(--blue)">signal</span>(<span
              style="color:var(--green)">'dark'</span>));
          </div>
          <a href="https://vuejs.org" target="_blank" rel="noopener" class="inspired-card-link" style="color: #42d392;">
            vuejs.org
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- React -->
        <div class="inspired-card animate-on-scroll" style="--card-color-a: rgba(97, 218, 251, 0.06)">
          <div class="inspired-card-header">
            <div class="inspired-card-meta">
              <div class="inspired-logo" style="background: rgba(97,218,251,0.1); color: var(--cyan);">⚛</div>
              <div>
                <div class="inspired-card-title">React</div>
                <div class="inspired-card-subtitle">react.dev</div>
              </div>
            </div>
            <span class="inspired-card-concept"
              style="color: var(--cyan); border-color: rgba(34,211,238,0.25); background: rgba(34,211,238,0.08);">Hooks
              Model</span>
          </div>
          <p class="inspired-card-desc">
            React proved that <strong>function components with colocated state</strong> are more composable than
            class-only patterns. Elur supports both: function components (plain functions + <code
              style="color:var(--accent-light);font-size:0.8em">html\`\`</code>, zero boilerplate) and class components
            (<code style="color:var(--accent-light);font-size:0.8em">ElurComponent</code>) only when lifecycle hooks are
            needed.
          </p>
          <div class="inspired-card-code">
            <span style="color:var(--text-muted)">// React — function component + state</span><br>
            <span style="color:var(--accent-light)">function</span> <span style="color:var(--blue)">Counter</span>()
            {<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">const</span> [n, setN] = <span
              style="color:var(--blue)">useState</span>(<span style="color:var(--orange)">0</span>);<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">return</span> &lt;button onClick={() =>
            setN(n+1)}&gt;{n}&lt;/button&gt;;<br>
            }<br><br>
            <span style="color:var(--text-muted)">// Elur — no JSX, no compiler</span><br>
            <span style="color:var(--accent-light)">function</span> <span style="color:var(--blue)">Counter</span>():
            <span style="color:var(--yellow)">ElurTemplate</span> {<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">const</span> n = <span
              style="color:var(--blue)">signal</span>(<span style="color:var(--orange)">0</span>);<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">return</span> html<span
              style="color:var(--green)">\`&lt;button @click=\${() => n.value++}&gt;\${() =>
              n.value}&lt;/button&gt;\`</span>;<br>
            }
          </div>
          <a href="https://react.dev" target="_blank" rel="noopener" class="inspired-card-link"
            style="color: var(--cyan);">
            react.dev
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- Svelte -->
        <div class="inspired-card animate-on-scroll" style="--card-color-a: rgba(255, 62, 0, 0.06)">
          <div class="inspired-card-header">
            <div class="inspired-card-meta">
              <div class="inspired-logo" style="background: rgba(255,62,0,0.12); color: var(--orange);">S</div>
              <div>
                <div class="inspired-card-title">Svelte</div>
                <div class="inspired-card-subtitle">svelte.dev</div>
              </div>
            </div>
            <span class="inspired-card-concept"
              style="color: var(--orange); border-color: rgba(251,146,60,0.25); background: rgba(251,146,60,0.08);">CSS
              Transitions</span>
          </div>
          <p class="inspired-card-desc">
            Svelte's built-in <code style="color:var(--accent-light);font-size:0.8em">transition:</code> directive made
            animations a first-class concern — without a separate animation library. Elur's <code
              style="color:var(--accent-light);font-size:0.8em">transition()</code> brings the same mental model: CSS
            class-based enter/leave lifecycle with optional JS hooks and <code
              style="color:var(--accent-light);font-size:0.8em">appear</code> on first render.
          </p>
          <div class="inspired-card-code">
            <span style="color:var(--text-muted)">// Svelte — transition directive</span><br>
            &lt;div <span style="color:var(--blue)">transition:fade</span>&gt;Hello!&lt;/div&gt;<br><br>
            <span style="color:var(--text-muted)">// Elur — same idea, no compiler</span><br>
            <span style="color:var(--blue)">transition</span>(<br>
            &nbsp;&nbsp;() => show.value ? html<span style="color:var(--green)">\`&lt;p&gt;Hello!&lt;/p&gt;\`</span> :
            <span style="color:var(--accent-light)">null</span>,<br>
            &nbsp;&nbsp;{ name: <span style="color:var(--green)">'fade'</span>, appear: <span
              style="color:var(--orange)">true</span> }<br>
            );
          </div>
          <a href="https://svelte.dev" target="_blank" rel="noopener" class="inspired-card-link"
            style="color: var(--orange);">
            svelte.dev
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <!-- MobX / Reactivity Pattern -->
        <div class="inspired-card animate-on-scroll" style="--card-color-a: rgba(244, 114, 182, 0.06)">
          <div class="inspired-card-header">
            <div class="inspired-card-meta">
              <div class="inspired-logo" style="background: rgba(244,114,182,0.12); color: var(--pink);">M</div>
              <div>
                <div class="inspired-card-title">MobX &amp; S.js</div>
                <div class="inspired-card-subtitle">Observer pattern</div>
              </div>
            </div>
            <span class="inspired-card-concept"
              style="color: var(--pink); border-color: rgba(244,114,182,0.25); background: rgba(244,114,182,0.08);">Auto-tracking</span>
          </div>
          <p class="inspired-card-desc">
            MobX introduced <strong>transparent reactive tracking</strong> — read a value inside a reaction, and you're
            automatically subscribed, no boilerplate. S.js formalized this into a dependency graph with <code
              style="color:var(--accent-light);font-size:0.8em">batch()</code> and <code
              style="color:var(--accent-light);font-size:0.8em">untrack()</code>. Elur inherits both: effects
            auto-track their dependencies and <code style="color:var(--accent-light);font-size:0.8em">untrack()</code>
            lets you opt out selectively.
          </p>
          <div class="inspired-card-code">
            <span style="color:var(--text-muted)">// Elur batch + untrack — from MobX/S.js</span><br>
            <span style="color:var(--blue)">batch</span>(() => {<br>
            &nbsp;&nbsp;price.value = <span style="color:var(--orange)">20</span>;&nbsp;&nbsp;<span
              style="color:var(--text-muted)">// writes queued</span><br>
            &nbsp;&nbsp;qty.value = <span style="color:var(--orange)">3</span>;&nbsp;&nbsp;&nbsp;&nbsp;<span
              style="color:var(--text-muted)">// effect runs once</span><br>
            });<br><br>
            <span style="color:var(--blue)">effect</span>(() => {<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">const</span> a =
            price.value;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--text-muted)"></span><br>//
            not tracked<br>
            &nbsp;&nbsp;<span style="color:var(--accent-light)">const</span> b = <span
              style="color:var(--blue)">untrack</span>(() => qty.value); <span
              style="color:var(--text-muted)"></span><br>
            });
          </div>
          <a href="https://mobx.js.org" target="_blank" rel="noopener" class="inspired-card-link"
            style="color: var(--pink);">
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
      <div class="inspired-quote animate-on-scroll">
        <p>
          The best frameworks aren't built from scratch — they're built on the shoulders of great ideas.
          Elur studies what works across the ecosystem and brings it together: <strong>tagged templates from
            Lit</strong>,
          <strong>fine-grained signals from Solid</strong>, <strong>provide/inject from Vue</strong>,
          <strong>function components from React</strong>, <strong>CSS transitions from Svelte</strong>,
          and <strong>transparent auto-tracking from MobX</strong> — unified into a single, zero-dependency,
          compiler-free package that respects your time and your bundle size.
        </p>
        <div class="inspired-quote-source">— Design philosophy of Elur</div>
      </div>
    </div>
  </section>

  <!-- Elur-Ionic Section -->
  `);
}
