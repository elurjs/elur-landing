import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function Showcases(): ElurTemplate {
  return raw(`
<section class="section showcases-section" id="showcases">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">🌟 Showcases</div>
        <h2 class="section-title">Built with <span class="gradient-text">Elur</span></h2>
        <p class="section-desc">Real production apps powered by the Elur ecosystem — from mobile to web to full-stack platforms.</p>
      </div>

      <div class="showcases-grid">
        <!-- BikerOS Landing -->
        <a href="https://www.bikeros.co/" target="_blank" rel="noopener"
          class="showcase-card animate-on-scroll">
          <div class="showcase-image">
            <picture>
            <source srcset="/images/showcases/bikeros-landing.webp" type="image/webp" />
            <img loading="lazy" src="/images/showcases/bikeros-landing.webp"
              alt="BikerOS landing page — built with Elur Kit (SSG, islands, SEO)"
              onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\'>
          </picture><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%2316161f\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23a0a0b5\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' font-family=\\'sans-serif\\' font-weight=\\'bold\\' font-size=\\'1.5rem\\'>BikerOS Landing</text></svg>'">
          </div>
          <div class="showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--accent-light);background:var(--accent-subtle);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur Kit</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--text-muted)">SSG + Islands</span>
            </div>
            <h3>BikerOS Landing</h3>
            <p>Marketing site for a motorcycle club platform. SSG with islands for interactive pricing,
              FAQ accordion, and scroll reveal. SEO, sitemap, and content collections out of the box.</p>
            <span class="showcase-link">Visit bikeros.co
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </a>

        <!-- BikerOS App -->
        <div class="showcase-card animate-on-scroll" style="cursor:default">
          <div class="showcase-image">
            <picture>
            <source srcset="/images/showcases/sos.webp" type="image/webp" />
            <img loading="lazy" src="/images/showcases/sos.webp"
              alt="BikerOS mobile app — built with Elur-Ionic and Elur Query"
              onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\'>
          </picture><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%2316161f\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23a0a0b5\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' font-family=\\'sans-serif\\' font-weight=\\'bold\\' font-size=\\'1.5rem\\'>BikerOS App</text></svg>'">
          </div>
          <div class="showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--orange);background:rgba(251,146,60,0.1);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur-Ionic</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--text-muted)">Mobile + Offline</span>
            </div>
            <h3>BikerOS Mobile App</h3>
            <p>Motorcycle club management app with SOS emergencies, live GPS tracking, offline routes,
              ICE medical info, and event RSVP. Elur-Ionic components, Elur Query for server state,
              and Capacitor for native deployment.</p>
            <span class="showcase-link" style="color:var(--text-muted)">Android &amp; iOS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <!-- BikerOS Web Admin -->
        <div class="showcase-card animate-on-scroll" style="cursor:default">
          <div class="showcase-image">
            <picture>
            <source srcset="/images/showcases/panel_admin.webp" type="image/webp" />
            <img loading="lazy" src="/images/showcases/panel_admin.webp"
              alt="BikerOS admin panel — built with Elur and Elur Query"
              onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\'>
          </picture><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%2316161f\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23a0a0b5\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' font-family=\\'sans-serif\\' font-weight=\\'bold\\' font-size=\\'1.5rem\\'>BikerOS Admin</text></svg>'">
          </div>
          <div class="showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--blue);background:rgba(96,165,250,0.1);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur + Query</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--text-muted)">Dashboard</span>
            </div>
            <h3>BikerOS Admin Panel</h3>
            <p>Web dashboard for club administrators. Member management, route builder with interactive maps,
              event dashboard, billing and invoicing. Elur for UI, Elur Query for data fetching and cache.</p>
            <span class="showcase-link" style="color:var(--text-muted)">Web app
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <!-- Elur Kit Docs -->
        <a href="https://kit.elur.dev/" target="_blank" rel="noopener" class="showcase-card animate-on-scroll">
          <div class="showcase-image">
            <picture>
            <source srcset="/images/showcases/elur-kit-docs.webp" type="image/webp" />
            <img loading="lazy" src="/images/showcases/elur-kit-docs.png"
              alt="Elur Kit documentation site — built with Elur Kit itself (dogfooding)"
              onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\'>
          </picture><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%2316161f\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23a0a0b5\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' font-family=\\'sans-serif\\' font-weight=\\'bold\\' font-size=\\'1.5rem\\'>Elur Kit Docs</text></svg>'">
          </div>
          <div class="showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--accent-light);background:var(--accent-subtle);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur Kit</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--text-muted)">Dogfooding</span>
            </div>
            <h3>Elur Kit Docs</h3>
            <p>The official Elur Kit documentation — built with Elur Kit itself. File-based routing, SSG, islands,
              Shiki code highlighting, full-text search, and SEO out of the box.</p>
            <span class="showcase-link">Visit project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </a>

        <!-- Unicolombo Academic System -->
        <a href="https://parcial-1-analisis-2-unicolombo.vercel.app/home" target="_blank" rel="noopener"
          class="showcase-card animate-on-scroll">
          <div class="showcase-image">
            <picture>
            <source srcset="/images/showcases/elur-student-library.webp" type="image/webp" />
            <img loading="lazy" src="/images/showcases/elur-student-library.png"
              alt="Academic Management System built using Elur and Elur-UI components"
              onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\'>
          </picture><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%2316161f\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23a0a0b5\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' font-family=\\'sans-serif\\' font-weight=\\'bold\\' font-size=\\'1.5rem\\'>Academic System</text></svg>'">
          </div>
          <div class="showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--blue);background:rgba(96,165,250,0.1);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--text-muted)">SPA</span>
            </div>
            <h3>University Academic System</h3>
            <p>An academic tracking platform showcasing client-side routing, global state management, and nested layouts
              powered by Elur.</p>
            <span class="showcase-link">Visit project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  `);
}
