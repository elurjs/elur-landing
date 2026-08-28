import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function ElurI18n(): ElurTemplate {
  return raw(`
<section class="section elur-i18n-section" id="elur-i18n">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">🌐 Elur i18n</div>
        <h2 class="section-title">Type-safe internationalization.<br><span class="gradient-text">Reactive by
            default.</span>
        </h2>
        <p class="section-desc">The official i18n library for Elur. Built on signals, zero runtime dependencies, and
          designed for real-world apps.</p>
      </div>

      <div class="elur-i18n-layout">
        <div class="elur-i18n-copy animate-on-scroll">
          <p><strong>@elurjs/i18n</strong> gives your Elur apps first-class internationalization:</p>
          <ul class="elur-i18n-points">
            <li><span class="elur-i18n-check">✓</span> <span><strong>Type-safe keys</strong> and interpolation
                parameters with autocompletion.</span></li>
            <li><span class="elur-i18n-check">✓</span> <span><strong>Reactive translations</strong> powered by Elur
                signals.</span></li>
            <li><span class="elur-i18n-check">✓</span> <span><strong>Plugins</strong> for persistence, locale detection,
                router sync, head tags, forms, ICU pluralization, and dev overlay.</span></li>
            <li><span class="elur-i18n-check">✓</span> <span><strong>Backends</strong> for inline messages, JSON files,
                and custom APIs.</span></li>
          </ul>

          <div class="elur-i18n-callout">
            v1.3.2 fixes 8 critical issues: no caching of failed requests, AST-based CLI
            extraction, and a plugin composition pipeline.
          </div>

          <a href="https://github.com/elurjs/elur-i18n" class="btn-primary" target="_blank" rel="noopener">
            View docs on GitHub
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div class="code-block animate-on-scroll">
          <div class="code-header">
            <div class="code-dots"><span></span><span></span><span></span></div>
            <span class="code-filename">i18n.ts</span>
          </div>
          <div class="code-body">
            <pre><span class="kw">import</span> { createI18n } <span class="kw">from</span> <span class="str">"@elurjs/i18n"</span>;
<span class="kw">import</span> { headPlugin } <span class="kw">from</span> <span class="str">"@elurjs/i18n/plugins/head"</span>;

<span class="kw">const</span> i18n = <span class="fn">createI18n</span>({
  locale: <span class="str">"es"</span>,
  fallbackLocale: <span class="str">"en"</span>,
  nestedFallback: <span class="kw">true</span>,
  messages: {
    es: { hello: <span class="str">"Hola {name}"</span> },
    en: { hello: <span class="str">"Hello {name}"</span> }
  }
});

<span class="fn">headPlugin</span>(i18n);

i18n.<span class="fn">t</span>(<span class="str">"hello"</span>, { name: <span class="str">"Deiver"</span> }); <span class="cmt">// "Hola Deiver"</span></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
  `);
}
