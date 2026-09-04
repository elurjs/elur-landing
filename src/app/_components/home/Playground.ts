import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Playground(): ElurTemplate {
  return raw(`
<section class="home-section home-playground-section" id="playground">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">🎮 Try It Live</div>
        <h2 class="home-section-title">See the reactivity<br><span class="home-gradient-text">in action.</span></h2>
        <p class="home-section-desc">These demos simulate how Elur signals, computed values, and effects work. Interact
          with them to see fine-grained reactivity.</p>
      </div>

      <div class="home-playground-grid">
        <!-- Demo 1: Counter with Signals -->
        <div class="home-playground-card animate-on-scroll">
          <div class="home-playground-card-header">
            <span class="home-playground-card-title">
              <span class="icon" style="background:rgba(124,92,252,0.15);color:var(--c-accent-3);">⚡</span>
              signal() + computed()
            </span>
            <span class="home-playground-card-badge">Live</span>
          </div>
          <div class="home-playground-code">
            <span style="color:var(--c-accent-3)">const</span> count = <span
              style="color:var(--c-blue)">signal</span>(<span style="color:#fb923c">0</span>);<br>
            <span style="color:var(--c-accent-3)">const</span> doubled = <span
              style="color:var(--c-blue)">computed</span>(<br>
            &nbsp;&nbsp;() => count.value * <span style="color:#fb923c">2</span><br>
            );<br>
            <span style="color:var(--c-accent-3)">const</span> label = <span
              style="color:var(--c-blue)">computed</span>(<br>
            &nbsp;&nbsp;() => count.value === <span style="color:#fb923c">0</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;? <span style="color:var(--c-green)">"zero"</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;: count.value > <span style="color:#fb923c">0</span> ? <span
              style="color:var(--c-green)">"positive"</span> : <span style="color:var(--c-green)">"negative"</span><br>
            );
          </div>
          <div data-elur-island="CounterDemo" data-directive="load" data-props="{}"></div>
        </div>

        <!-- Demo 2: Reactive Todo List -->
        <div class="home-playground-card animate-on-scroll">
          <div class="home-playground-card-header">
            <span class="home-playground-card-title">
              <span class="icon" style="background:rgba(52,211,153,0.15);color:var(--c-green);">📋</span>
              repeat() + signal()
            </span>
            <span class="home-playground-card-badge native">Native ESM Live</span>
          </div>
          <div class="home-playground-code">
            <span style="color:var(--c-accent-3)">const</span> todos = <span
              style="color:var(--c-blue)">signal</span>([]);<br>
            <span style="color:var(--c-accent-3)">const</span> remaining = <span
              style="color:var(--c-blue)">computed</span>(<br>
            &nbsp;&nbsp;() => todos.value<br>
            &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:var(--c-blue)">filter</span>(t => !t.done.value).length<br>
            );<br><br>
            <span style="color:var(--c-blue)">html</span><span style="color:var(--c-green)">\`&lt;ul&gt;\${() =></span><br>
            &nbsp;&nbsp;<span style="color:var(--c-blue)">repeat</span><span style="color:var(--c-green)">(todos.value,
              ...)</span><br>
            <span style="color:var(--c-green)">&lt;/ul&gt;\`</span>;
          </div>
          <div data-elur-island="TodoDemo" data-directive="load" data-props="{}"></div>
        </div>

        <!-- Demo 3: Live Clock (effect + onMount) -->
        <div class="home-playground-card animate-on-scroll">
          <div class="home-playground-card-header">
            <span class="home-playground-card-title">
              <span class="icon" style="background:rgba(96,165,250,0.15);color:var(--c-blue);">🕐</span>
              effect() + lifecycle
            </span>
            <span class="home-playground-card-badge">Live</span>
          </div>
          <div class="home-playground-code">
            <span style="color:var(--c-accent-3)">class</span> <span style="color:var(--c-blue)">Clock</span> <span
              style="color:var(--c-accent-3)">extends</span> <span style="color:var(--c-yellow)">ElurComponent</span>
            {<br>
            &nbsp;&nbsp;time = <span style="color:var(--c-blue)">signal</span>(<span
              style="color:var(--c-green)">""</span>);<br><br>
            &nbsp;&nbsp;<span style="color:var(--c-blue)">onMount</span>() {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--c-accent-3)">const</span> id = <span
              style="color:var(--c-blue)">setInterval</span>(() => {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--c-accent-3)">this</span>.time.value = <span
              style="color:var(--c-accent-3)">new</span> Date()<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span
              style="color:var(--c-blue)">toLocaleTimeString</span>();<br>
            &nbsp;&nbsp;&nbsp;&nbsp;}, <span style="color:#fb923c">1000</span>);<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--c-accent-3)">return</span> () => <span
              style="color:var(--c-blue)">clearInterval</span>(id);<br>
            &nbsp;&nbsp;}<br>
            }
          </div>
          <div data-elur-island="ClockDemo" data-directive="load" data-props="{}"></div>
        </div>
      </div>
    </div>
  </section>
  `);
}
