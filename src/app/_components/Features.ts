import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Features(): ElurTemplate {
  return raw(`
<section class="section" id="features">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">⚡ Why Elur</div>
        <h2 class="section-title">Everything you need,<br>nothing you don't.</h2>
        <p class="section-desc">
          A complete UI framework that fits in a single import. No virtual DOM overhead,
          no compiler step, no configuration files.
        </p>
      </div>
      <div class="why-grid">
        <div class="why-card animate-on-scroll">
          <div class="why-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h3>Fine-Grained Reactivity</h3>
          <p>Signals update only the exact DOM nodes that depend on changed data. No diffing, no reconciliation, no
            wasted renders.</p>
        </div>
        <div class="why-card animate-on-scroll">
          <div class="why-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            </svg>
          </div>
          <h3>No Compiler Required</h3>
          <p>Templates are standard JavaScript tagged template literals. No JSX transform, no SFC compiler, no
            build-time magic needed. An optional build-time compiler (<code>@elurjs/core-compiler</code>) is available for up to -44% faster renders when you want maximum performance.</p>
        </div>
        <div class="why-card animate-on-scroll">
          <div class="why-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <path
                d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3>Batteries Included</h3>
          <p>Router, forms, stores, dependency injection, portals, error boundaries, transitions — all built-in. One
            import, zero config.</p>
        </div>
        <div class="why-card animate-on-scroll">
          <div class="why-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <h3>TypeScript Native</h3>
          <p>Every API is fully typed from the ground up. Typed injection keys, typed store signals, typed route params
            — real type safety.</p>
        </div>
        <div class="why-card animate-on-scroll">
          <div class="why-icon pink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <h3>Familiar Patterns</h3>
          <p>If you know Vue's provide/inject, React's hooks, or Solid's signals — you'll feel right at home. The best
            ideas, unified.</p>
        </div>
        <div class="why-card animate-on-scroll">
          <div class="why-icon cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3>XSS Hardened</h3>
          <p>Interpolated values are inserted as text nodes, never parsed as HTML. URL attributes like
            <code>href</code>/<code>src</code> are sanitized — <code>javascript:</code>, <code>data:text/html</code> and
            other dangerous schemes are blocked automatically.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Playground -->
  `);
}
