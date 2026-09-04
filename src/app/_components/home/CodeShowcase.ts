import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function CodeShowcase(): ElurTemplate {
  return raw(`
<section class="home-section home-code-section" id="code">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">{ } Developer Experience</div>
        <h2 class="home-section-title">Write less, do more.</h2>
        <p class="home-section-desc">Clean, readable code that does exactly what you'd expect. No magic, no surprises.</p>
      </div>

      <div data-elur-island="CodeTabs" data-directive="load" data-props="{}"></div>

      <!-- Reactivity Tab -->
      <div class="home-tab-panel active" id="tab-reactivity">
        <div class="home-code-layout">
          <div class="home-code-text animate-on-scroll">
            <h3>Signals that just work.</h3>
            <p>
              Create reactive values with <code
                style="color:var(--c-accent-3);background:var(--c-accent-subtle);padding:2px 8px;border-radius:4px;">signal()</code>,
              derive with <code
                style="color:var(--c-accent-3);background:var(--c-accent-subtle);padding:2px 8px;border-radius:4px;">computed()</code>,
              and watch with <code
                style="color:var(--c-accent-3);background:var(--c-accent-subtle);padding:2px 8px;border-radius:4px;">effect()</code>.
              Three primitives power the entire framework.
            </p>
            <ul class="home-code-features">
              <li><span class="check">✓</span> Automatic dependency tracking</li>
              <li><span class="check">✓</span> Object.is equality — no wasted updates</li>
              <li><span class="check">✓</span> Batch multiple writes into one flush</li>
              <li><span class="check">✓</span> Self-cleaning effects with auto-disposal</li>
              <li><span class="check">✓</span> untrack() for reading without subscribing</li>
            </ul>
          </div>
          <div class="home-code-block animate-on-scroll">
            <div class="home-code-header">
              <div class="home-code-dots"><span></span><span></span><span></span></div>
              <span class="home-code-filename">counter.ts</span>
            </div>
            <div class="home-code-body">
              <pre><span class="kw">import</span> { signal, computed, effect } <span class="kw">from</span> <span class="str">"@elurjs/core"</span>;

<span class="cmt">// Reactive state</span>
<span class="kw">const</span> <span class="fn">count</span> = <span class="fn">signal</span>(<span class="num">0</span>);
<span class="kw">const</span> <span class="fn">doubled</span> = <span class="fn">computed</span>(() => <span class="fn">count</span>.value * <span class="num">2</span>);

<span class="cmt">// Auto-runs when count changes</span>
<span class="fn">effect</span>(() => {
  console.<span class="fn">log</span>(<span class="str">\`Count: \${</span><span class="fn">count</span>.value<span class="str">}\`</span>);
  console.<span class="fn">log</span>(<span class="str">\`Doubled: \${</span><span class="fn">doubled</span>.value<span class="str">}\`</span>);
});

<span class="fn">count</span>.value = <span class="num">5</span>;  <span class="cmt">// logs: Count: 5, Doubled: 10</span>

<span class="cmt">// Batch multiple writes — effect runs once</span>
<span class="fn">batch</span>(() => {
  <span class="fn">count</span>.value = <span class="num">10</span>;
  <span class="fn">count</span>.<span class="fn">update</span>(n => n + <span class="num">1</span>);
});</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Component Tab -->
      <div class="home-tab-panel" id="tab-component">
        <div class="home-code-layout">
          <div class="home-code-text animate-on-scroll">
            <h3>Two styles. Your choice.</h3>
            <p>
              Function components for pages and display. Class components when you need lifecycle hooks.
              Both work seamlessly together.
            </p>
            <ul class="home-code-features">
              <li><span class="check">✓</span> Function components — zero boilerplate</li>
              <li><span class="check">✓</span> Class components — lifecycle hooks</li>
              <li><span class="check">✓</span> Children & named slots</li>
              <li><span class="check">✓</span> DOM refs with ref()</li>
              <li><span class="check">✓</span> Auto-cleanup on unmount</li>
            </ul>
          </div>
          <div class="home-code-block animate-on-scroll">
            <div class="home-code-header">
              <div class="home-code-dots"><span></span><span></span><span></span></div>
              <span class="home-code-filename">components.ts</span>
            </div>
            <div class="home-code-body">
              <pre><span class="cmt">// Function component — simple & clean</span>
<span class="kw">function</span> <span class="fn">Counter</span>(): <span class="type">ElurTemplate</span> {
  <span class="kw">const</span> count = <span class="fn">signal</span>(<span class="num">0</span>);
  <span class="kw">return</span> <span class="fn">html</span><span class="str">\`
    &lt;<span class="tag">p</span>&gt;\${() => count.value}&lt;/<span class="tag">p</span>&gt;
    &lt;<span class="tag">button</span> <span class="attr">@click</span>=\${() => count.value++}&gt;
      +1
    &lt;/<span class="tag">button</span>&gt;
  \`</span>;
}

<span class="cmt">// Class component — with lifecycle</span>
<span class="kw">class</span> <span class="fn">Clock</span> <span class="kw">extends</span> <span class="type">ElurComponent</span> {
  time = <span class="fn">signal</span>(<span class="kw">new</span> Date().<span class="fn">toLocaleTimeString</span>());

  <span class="fn">onMount</span>() {
    <span class="kw">const</span> id = <span class="fn">setInterval</span>(() => {
      <span class="kw">this</span>.time.value = <span class="kw">new</span> Date()
        .<span class="fn">toLocaleTimeString</span>();
    }, <span class="num">1000</span>);
    <span class="kw">return</span> () => <span class="fn">clearInterval</span>(id);
  }

  <span class="fn">render</span>() {
    <span class="kw">return</span> <span class="fn">html</span><span class="str">\`&lt;<span class="tag">span</span>&gt;\${() => <span class="kw">this</span>.time.value}&lt;/<span class="tag">span</span>&gt;\`</span>;
  }
}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Router Tab -->
      <div class="home-tab-panel" id="tab-router">
        <div class="home-code-layout">
          <div class="home-code-text animate-on-scroll">
            <h3>Client-side routing, built in.</h3>
            <p>
              No extra package. Switch between history or hash mode, attach typed route meta,
              restore scroll automatically, and keep dynamic params, guards, and lazy loading.
            </p>
            <ul class="home-code-features">
              <li><span class="check">✓</span> History + hash routing modes</li>
              <li><span class="check">✓</span> Route meta available through resolve()</li>
              <li><span class="check">✓</span> Custom scrollBehavior restoration</li>
              <li><span class="check">✓</span> Nested routes with RouterView depth</li>
              <li><span class="check">✓</span> Navigation guards and lazy loading</li>
            </ul>
          </div>
          <div class="home-code-block animate-on-scroll">
            <div class="home-code-header">
              <div class="home-code-dots"><span></span><span></span><span></span></div>
              <span class="home-code-filename">router.ts</span>
            </div>
            <div class="home-code-body">
              <pre><span class="kw">import</span> { createRouter, RouterView, Link, lazy }
  <span class="kw">from</span> <span class="str">"@elurjs/core"</span>;

<span class="kw">const</span> router = <span class="fn">createRouter</span>([
  { path: <span class="str">"/"</span>,     component: () => <span class="fn">HomePage</span>() },
  { path: <span class="str">"/about"</span>, component: () => <span class="fn">AboutPage</span>() },
  {
    path: <span class="str">"/dashboard"</span>,
    component: () => <span class="kw">new</span> <span class="fn">DashboardLayout</span>(),
    meta: { requiresAuth: <span class="kw">true</span> },
    children: [
      { path: <span class="str">"/home-stats"</span>,    component: <span class="fn">lazy</span>(
        () => <span class="kw">import</span>(<span class="str">"./pages/Stats"</span>)) },
      { path: <span class="str">"/settings"</span>, component: <span class="fn">lazy</span>(
        () => <span class="kw">import</span>(<span class="str">"./pages/Settings"</span>)) },
    ],
  },
  { path: <span class="str">"*"</span>, component: () => <span class="fn">NotFound</span>() },
], {
  mode: <span class="str">"hash"</span>,
  scrollBehavior: (_to, _from, saved) =>
    saved ?? { left: <span class="num">0</span>, top: <span class="num">0</span> }
});

<span class="cmt">// Auth guard using route meta from resolve()</span>
router.<span class="fn">beforeEach</span>((to) => {
  <span class="kw">const</span> match = router.<span class="fn">resolve</span>(to);
  <span class="kw">if</span> (match?.meta?.requiresAuth && !<span class="fn">isAuth</span>())
    <span class="kw">return</span> <span class="str">"/login"</span>;
});</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Store Tab -->
      <div class="home-tab-panel" id="tab-store">
        <div class="home-code-layout">
          <div class="home-code-text animate-on-scroll">
            <h3>Global state in 5 lines.</h3>
            <p>
              Every property becomes a signal automatically. Add typed actions and
              derived getters, subscribe globally to changes, and reset with $reset().
            </p>
            <ul class="home-code-features">
              <li><span class="check">✓</span> Auto-signalized properties</li>
              <li><span class="check">✓</span> Typed actions with full inference</li>
              <li><span class="check">✓</span> Optional gettersFactory for derived signals</li>
              <li><span class="check">✓</span> Global $subscribe(key, next, prev)</li>
              <li><span class="check">✓</span> $reset() to restore initial state</li>
              <li><span class="check">✓</span> Works in any component or module</li>
            </ul>
          </div>
          <div class="home-code-block animate-on-scroll">
            <div class="home-code-header">
              <div class="home-code-dots"><span></span><span></span><span></span></div>
              <span class="home-code-filename">store.ts</span>
            </div>
            <div class="home-code-body">
              <pre><span class="kw">import</span> { createStore, computed } <span class="kw">from</span> <span class="str">"@elurjs/core"</span>;

<span class="kw">const</span> cart = <span class="fn">createStore</span>(
  {
    items: [] <span class="kw">as</span> <span class="type">string</span>[],
    total: <span class="num">0</span>,
  },
  (s) => ({
    <span class="fn">add</span>(item: <span class="type">string</span>) {
      s.items.<span class="fn">update</span>(arr => [...arr, item]);
      s.total.<span class="fn">update</span>(n => n + <span class="num">1</span>);
    },
    <span class="fn">remove</span>(item: <span class="type">string</span>) {
      s.items.<span class="fn">update</span>(arr =>
        arr.<span class="fn">filter</span>(i => i !== item));
      s.total.<span class="fn">update</span>(n => n - <span class="num">1</span>);
    },
    <span class="fn">clear</span>() { cart.<span class="fn">$reset</span>(); },
  }),
  (s) => ({
    itemCount: <span class="fn">computed</span>(() => s.items.value.length),
    hasItems: <span class="fn">computed</span>(() => s.items.value.length &gt; <span class="num">0</span>),
  })
);

cart.<span class="fn">$subscribe</span>((key, next, prev) => {
  console.<span class="fn">log</span>(<span class="str">"Store change:"</span>, key, prev, <span class="str">"→"</span>, next);
});

cart.<span class="fn">add</span>(<span class="str">"Milk"</span>);
cart.itemCount.value; <span class="cmt">// 1</span>
cart.hasItems.value;  <span class="cmt">// true</span></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Forms Tab -->
      <div class="home-tab-panel" id="tab-forms">
        <div class="home-code-layout">
          <div class="home-code-text animate-on-scroll">
            <h3>Typed Forms, Dot Paths & Cross-Field Rules.</h3>
            <p>
              Manage complex forms with nested objects, cross-field rules, and dynamic arrays.
              Validation is fully typed and works with built-ins, custom validators, or schemas.
            </p>
            <ul class="home-code-features">
              <li><span class="check">✓</span> Typed field validation (Zod/Valibot)</li>
              <li><span class="check">✓</span> Dot-path validators for nested fields</li>
              <li><span class="check">✓</span> Cross-field validators with allValues</li>
              <li><span class="check">✓</span> elurFieldArray for dynamic lists</li>
              <li><span class="check">✓</span> validateOn: 'blur' | 'input' | 'submit'</li>
              <li><span class="check">✓</span> isSubmitting & submitCount tracking</li>
            </ul>
          </div>
          <div class="home-code-block animate-on-scroll">
            <div class="home-code-header">
              <div class="home-code-dots"><span></span><span></span><span></span></div>
              <span class="home-code-filename">forms.ts</span>
            </div>
            <div class="home-code-body">
              <pre><span class="kw">import</span> { createForm, elurFieldArray, required, email, minLength } 
  <span class="kw">from</span> <span class="str">"@elurjs/core"</span>;

<span class="kw">const</span> form = <span class="fn">createForm</span>({
  profile: { email: <span class="str">""</span> },
  password: <span class="str">""</span>,
  confirmPassword: <span class="str">""</span>
}, {
  validateOn: <span class="str">'blur'</span>,
  validators: {
    <span class="str">"profile.email"</span>: [<span class="fn">required</span>(), <span class="fn">email</span>()],
    password: [<span class="fn">required</span>(), <span class="fn">minLength</span>(<span class="num">8</span>)],
    confirmPassword: [
      <span class="fn">required</span>(),
      (value, allValues) =>
        value !== allValues?.password ? <span class="str">"Passwords do not match"</span> : <span class="kw">null</span>
    ]
  }
});

<span class="cmt">// Dynamic field array</span>
<span class="kw">const</span> { fields, append, remove } = <span class="fn">elurFieldArray</span>(
  [{ value: <span class="str">""</span> }],
  { value: [<span class="fn">required</span>(), <span class="fn">email</span>()] }
);

<span class="kw">const</span> onSubmit = form.<span class="fn">handleSubmit</span>(values => {
  console.<span class="fn">log</span>(<span class="str">"Form submit:"</span>, values, fields.value.length);
});</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `);
}
