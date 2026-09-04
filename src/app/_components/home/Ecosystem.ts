import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Ecosystem(): ElurTemplate {
  return raw(`
<section class="home-section" id="ecosystem">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">📦 Built-In Ecosystem</div>
        <h2 class="home-section-title">One core.<br>Official packages.</h2>
        <p class="home-section-desc">Build with a minimal reactive core and scale with first-party tools like Elur Query,
          Elur Ionic, and Elur UI without dependency roulette.</p>
      </div>
      <div class="home-features-grid">
        <div class="home-feature-card animate-on-scroll">
          <div class="home-feature-card-header">
            <span class="home-feature-card-icon">📋</span>
            <h3>Form Management</h3>
          </div>
          <p>Built-in field validation, dynamic arrays, and Zod/Valibot interop. Now includes <code>elurFieldArray</code>
            for dynamic lists.
          </p>
          <code><span style="color:var(--c-accent-3)">const</span> form = <span
              style="color:var(--c-blue)">createForm</span>(
            { name: <span style="color:var(--c-green)">""</span>, email: <span style="color:var(--c-green)">""</span> },
            { validators: {
            name: [<span style="color:var(--c-blue)">required</span>(), <span
              style="color:var(--c-blue)">minLength</span>(<span style="color:#fb923c">2</span>)],
            email: [<span style="color:var(--c-blue)">required</span>(), <span style="color:var(--c-blue)">email</span>()],
            }}
            );</code>
        </div>
        <div class="home-feature-card animate-on-scroll">
          <div class="home-feature-card-header">
            <span class="home-feature-card-icon">🔀</span>
            <h3>Portals</h3>
          </div>
          <p>Render modals, tooltips, and toasts outside the component tree. Supports outlet tokens, refs, and
            provide/inject.</p>
          <code><span style="color:var(--c-accent-3)">const</span> modal = <span
              style="color:var(--c-blue)">portal</span>(
            <span style="color:var(--c-blue)">html</span><span style="color:var(--c-green)">\`&lt;div class="modal"&gt;
              &lt;h2&gt;Confirm action&lt;/h2&gt;
              &lt;button @click=\${close}&gt;OK&lt;/button&gt;
              &lt;/div&gt;\`</span>
            );</code>
        </div>
        <div class="home-feature-card animate-on-scroll">
          <div class="home-feature-card-header">
            <span class="home-feature-card-icon">🛡️</span>
            <h3>Error Boundaries</h3>
          </div>
          <p>Catch render and reactive errors gracefully. Show fallback UIs without crashing the entire application.</p>
          <code><span style="color:var(--c-blue)">createErrorBoundary</span>(
            <span style="color:var(--c-accent-3)">new</span> <span style="color:var(--c-blue)">DataWidget</span>(),
            (err) => <span style="color:var(--c-blue)">html</span><span style="color:var(--c-green)">\`
              &lt;p class="error"&gt;
              Failed: \${String(err)}
              &lt;/p&gt;\`</span>
            );</code>
        </div>
        <div class="home-feature-card animate-on-scroll">
          <div class="home-feature-card-header">
            <span class="home-feature-card-icon">✨</span>
            <h3>Transitions</h3>
          </div>
          <p>CSS class-based enter/leave animations. No wrapper elements, JS hooks for full control, appear on first
            render.</p>
          <code><span style="color:var(--c-blue)">transition</span>(
            () => show.value
            ? <span style="color:var(--c-blue)">html</span><span
              style="color:var(--c-green)">\`&lt;p&gt;Hello!&lt;/p&gt;\`</span>
            : <span style="color:var(--c-accent-3)">null</span>,
            { name: <span style="color:var(--c-green)">"fade"</span>, appear: <span
              style="color:#fb923c">true</span> }
            );</code>
        </div>
        <div class="home-feature-card animate-on-scroll">
          <div class="home-feature-card-header">
            <span class="home-feature-card-icon">⏳</span>
            <h3>Async & Suspense</h3>
          </div>
          <p>suspend() for async views, lazy() for code-splitting, and Elur Query for robust async requests, retries,
            and query cache invalidation.</p>
          <code><span style="color:var(--c-blue)">suspend</span>(
            () => <span style="color:var(--c-blue)">fetch</span>(<span
              style="color:var(--c-green)">"/api/users"</span>).then(r => r.json()),
            (users) => <span style="color:var(--c-blue)">html</span><span style="color:var(--c-green)">\`
              &lt;ul&gt;\${users.map(u =>
              html\\\`&lt;li&gt;\${u.name}&lt;/li&gt;\\\`
              )}&lt;/ul&gt;\`</span>,
            { invalidate: refreshKey }
            );</code>
        </div>
        <div class="home-feature-card animate-on-scroll">
          <div class="home-feature-card-header">
            <span class="home-feature-card-icon">💉</span>
            <h3>Dependency Injection</h3>
          </div>
          <p>Vue-style provide/inject with typed keys. Pass data down the tree without prop drilling. Nearest ancestor
            wins.</p>
          <code><span style="color:var(--c-accent-3)">const</span> THEME = <span
              style="color:var(--c-blue)">createInjectionKey</span>&lt;
            Signal&lt;<span style="color:var(--c-yellow)">string</span>&gt;
            &gt;(<span style="color:var(--c-green)">"theme"</span>);

            <span style="color:var(--c-blue)">provide</span>(THEME, <span style="color:var(--c-blue)">signal</span>(<span
              style="color:var(--c-green)">"dark"</span>));
            <span style="color:var(--c-accent-3)">const</span> theme = <span
              style="color:var(--c-blue)">inject</span>(THEME);</code>
        </div>
      </div>
    </div>
  </section>
  `);
}
