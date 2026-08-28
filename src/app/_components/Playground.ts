import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Playground(): ElurTemplate {
  return raw(`
<section class="section playground-section" id="playground">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">🎮 Try It Live</div>
        <h2 class="section-title">See the reactivity<br><span class="gradient-text">in action.</span></h2>
        <p class="section-desc">These demos simulate how Elur signals, computed values, and effects work. Interact
          with them to see fine-grained reactivity.</p>
      </div>

      <div class="playground-grid">
        <!-- Demo 1: Counter with Signals -->
        <div class="playground-card animate-on-scroll">
          <div class="playground-card-header">
            <span class="playground-card-title">
              <span class="icon" style="background:rgba(124,92,252,0.15);color:var(--accent-light);">⚡</span>
              signal() + computed()
            </span>
            <span class="playground-card-badge">Live</span>
          </div>
          <div class="playground-code">
            <span style="color:var(--accent-light)">const</span> count = <span
              style="color:var(--blue)">signal</span>(<span style="color:var(--orange)">0</span>);<br>
            <span style="color:var(--accent-light)">const</span> doubled = <span
              style="color:var(--blue)">computed</span>(<br>
            &nbsp;&nbsp;() => count.value * <span style="color:var(--orange)">2</span><br>
            );<br>
            <span style="color:var(--accent-light)">const</span> label = <span
              style="color:var(--blue)">computed</span>(<br>
            &nbsp;&nbsp;() => count.value === <span style="color:var(--orange)">0</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;? <span style="color:var(--green)">"zero"</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;: count.value > <span style="color:var(--orange)">0</span> ? <span
              style="color:var(--green)">"positive"</span> : <span style="color:var(--green)">"negative"</span><br>
            );
          </div>
          <div data-elur-island="CounterDemo" data-directive="load" data-props="{}"></div>
        </div>

        <!-- Demo 2: Reactive Todo List -->
        <div class="playground-card animate-on-scroll">
          <div class="playground-card-header">
            <span class="playground-card-title">
              <span class="icon" style="background:rgba(52,211,153,0.15);color:var(--green);">📋</span>
              repeat() + signal()
            </span>
            <span class="playground-card-badge native">Native ESM Live</span>
          </div>
          <div class="playground-code">
            <span style="color:var(--accent-light)">const</span> todos = <span
              style="color:var(--blue)">signal</span>([]);<br>
            <span style="color:var(--accent-light)">const</span> remaining = <span
              style="color:var(--blue)">computed</span>(<br>
            &nbsp;&nbsp;() => todos.value<br>
            &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:var(--blue)">filter</span>(t => !t.done.value).length<br>
            );<br><br>
            <span style="color:var(--blue)">html</span><span style="color:var(--green)">\`&lt;ul&gt;\${() =></span><br>
            &nbsp;&nbsp;<span style="color:var(--blue)">repeat</span><span style="color:var(--green)">(todos.value,
              ...)</span><br>
            <span style="color:var(--green)">&lt;/ul&gt;\`</span>;
          </div>
          <div data-elur-island="TodoDemo" data-directive="load" data-props="{}"></div>
        </div>

        <!-- Demo 3: Live Clock (effect + onMount) -->
        <div class="playground-card animate-on-scroll">
          <div class="playground-card-header">
            <span class="playground-card-title">
              <span class="icon" style="background:rgba(96,165,250,0.15);color:var(--blue);">🕐</span>
              effect() + lifecycle
            </span>
            <span class="playground-card-badge">Live</span>
          </div>
          <div class="playground-code">
            <span style="color:var(--accent-light)">class</span> <span style="color:var(--blue)">Clock</span> <span
              style="color:var(--accent-light)">extends</span> <span style="color:var(--yellow)">ElurComponent</span>
            {<br>
            &nbsp;&nbsp;time = <span style="color:var(--blue)">signal</span>(<span
              style="color:var(--green)">""</span>);<br><br>
            &nbsp;&nbsp;<span style="color:var(--blue)">onMount</span>() {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--accent-light)">const</span> id = <span
              style="color:var(--blue)">setInterval</span>(() => {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--accent-light)">this</span>.time.value = <span
              style="color:var(--accent-light)">new</span> Date()<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span
              style="color:var(--blue)">toLocaleTimeString</span>();<br>
            &nbsp;&nbsp;&nbsp;&nbsp;}, <span style="color:var(--orange)">1000</span>);<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--accent-light)">return</span> () => <span
              style="color:var(--blue)">clearInterval</span>(id);<br>
            &nbsp;&nbsp;}<br>
            }
          </div>
          <div data-elur-island="ClockDemo" data-directive="load" data-props="{}"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  `);
}
