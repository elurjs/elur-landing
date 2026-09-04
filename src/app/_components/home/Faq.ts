/**
 * FAQ section: sidebar + static accordion list. Open/close behavior is
 * wired by the Faq island.
 */

import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Faq(): ElurTemplate {
  return raw(`
<section class="home-section home-faq-section" id="faq">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">❓ FAQ</div>
        <h2 class="home-section-title">Common questions,<br><span class="home-gradient-text">straight answers.</span></h2>
      </div>
      <div class="home-faq-layout">
        <div class="home-faq-sidebar animate-on-scroll">
          <h3>Still have questions?</h3>
          <p>Browse the full documentation or open an issue on GitHub. The community is small but growing fast.</p>
          <a href="https://github.com/elurjs/elur" target="_blank" rel="noopener" class="home-faq-contact">
            Open an issue on GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div class="home-faq-list animate-on-scroll">

          <div class="home-faq-item">
            <button class="home-faq-question">
              What's new in Elur 3.6.2?
              <span class="home-faq-chevron">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div class="home-faq-answer">
              <div class="home-faq-answer-inner">
                Elur 3.6.2 adds multi-subscriber signal and component debug hooks so the in-page overlay,
                browser extension backend, and test tooling can coexist without replacing one another.
                Component debug hooks now use shared global reactivity state, remaining reliable even when
                <code>@elurjs/core</code> is duplicated in a bundle.
                Elur Kit 2.4.8 aligns its SSR state with <code>@elurjs/core</code> 3.6.2 so <code>isSSR()</code>
                reports the correct value during server rendering.
                The latest ecosystem packages are <code>@elurjs/core-compiler</code> 1.0.0,
                <code>@elurjs/vite-plugin-elur</code> 2.1.0, <code>@elurjs/query</code> 1.6.0,
                <code>@elurjs/ionic</code> 2.1.0, <code>@elurjs/auth</code> 1.3.0,
                and <code>@elurjs/i18n</code> 1.4.0.
              </div>
            </div>
          </div>

          <div class="home-faq-item">
            <button class="home-faq-question">
              Do I need a compiler or build step?
              <span class="home-faq-chevron">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div class="home-faq-answer">
              <div class="home-faq-answer-inner">
                No. Elur works with zero build step — templates are standard JavaScript tagged template literals
                that run natively via ESM/import maps. The build-time compiler (<code>@elurjs/core-compiler</code>)
                is <strong>optional</strong> and only improves performance by -28% on average (up to -44%) on rendering benchmarks.
                The Vite plugin enables it automatically when installed, but you can use Elur without any
                bundler at all.
              </div>
            </div>
          </div>

          <div class="home-faq-item">
            <button class="home-faq-question">
              Is Elur production-ready?
              <span class="home-faq-chevron">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div class="home-faq-answer">
              <div class="home-faq-answer-inner">
                Yes. It is designed for production with zero runtime dependencies in the core, strong TypeScript
                support, and a practical ecosystem for web and mobile workflows.
              </div>
            </div>
          </div>

          <div class="home-faq-item">
            <button class="home-faq-question">
              Can I use JS libraries that touch the DOM directly?
              <span class="home-faq-chevron">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div class="home-faq-answer">
              <div class="home-faq-answer-inner">
                Yes. Elur works directly with DOM-first libraries like <code>Chart.js</code>, <code>Leaflet</code>,
                and <code>AG Grid</code> without wrappers. If it runs in browser JavaScript, you can integrate it.
              </div>
            </div>
          </div>

          <div class="home-faq-item">
            <button class="home-faq-question">
              How do I handle async requests and caching in web or mobile apps?
              <span class="home-faq-chevron">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div class="home-faq-answer">
              <div class="home-faq-answer-inner">
                Use <code>@elurjs/query</code> for async requests, query cache, retries, and invalidation.
                It is platform-agnostic and works in both web and mobile stacks. Start with:
                <code>npm install @elurjs/core @elurjs/query</code>.
              </div>
            </div>
          </div>

          <div class="home-faq-item">
            <button class="home-faq-question">
              Can I build mobile apps with Elur?
              <span class="home-faq-chevron">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div class="home-faq-answer">
              <div class="home-faq-answer-inner">
                Yes. Use <code>@elurjs/ionic@2.1.0</code> with Ionic Core for routing + native-style UI, then wrap
                with Capacitor for Android/iOS deployment using the same codebase.
              </div>
            </div>
          </div>

          <div class="home-faq-item">
            <button class="home-faq-question">
              Do I need migration changes from Elur 1.x?
              <span class="home-faq-chevron">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div class="home-faq-answer">
              <div class="home-faq-answer-inner">
                Usually minimal. Most upgrades are dependency updates plus a quick validation pass over routes,
                reactive effects, and tooling integrations.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
    <div data-elur-island="Faq" data-directive="load" data-props="{}"></div>
  `);
}
