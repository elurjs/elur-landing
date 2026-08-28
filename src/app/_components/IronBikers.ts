import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function IronBikers(): ElurTemplate {
  return raw(`
<section id="iron-bikers" class="section case-study-section">
    <div class="container">
      <div class="case-study-grid">
        <div class="animate-on-scroll">
          <div class="case-kicker">Production Case Study</div>
          <h2 class="case-title">BikerOS: <span class="gradient-text">the OS for motorcycle clubs</span></h2>
          <p class="case-text">
            A full-stack platform for motorcycle clubs — live GPS tracking, SOS emergencies, route management,
            events, and a web admin panel. Built entirely on the Elur ecosystem across 4 apps.
          </p>

          <div class="case-tags">
            <span class="case-tag">Elur-Ionic (Mobile)</span>
            <span class="case-tag">Elur Kit (Landing + Web)</span>
            <span class="case-tag">Elur Query (Data)</span>
            <span class="case-tag">SSG + SSR</span>
            <span class="case-tag">Offline-first</span>
            <span class="case-tag">White-label ready</span>
          </div>

          <div class="case-metrics">
            <div class="case-metric">
              <strong>2</strong>
              <span>Apps shipped</span>
            </div>
            <div class="case-metric">
              <strong>6</strong>
              <span>SOS types</span>
            </div>
            <div class="case-metric">
              <strong>40+</strong>
              <span>Members per club</span>
            </div>
            <div class="case-metric">
              <strong>100%</strong>
              <span>Elur ecosystem</span>
            </div>
          </div>

          <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
            <a href="https://www.bikeros.co/" target="_blank" rel="noopener" class="btn-primary" style="padding:10px 22px;font-size:0.88rem">
              Visit bikeros.co
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        <div class="case-phones animate-on-scroll">
          <div class="case-phone-stack">
            <div class="case-phone-main">
              <div class="case-phone-shell">
                <div class="case-phone-notch"></div>
                <div class="case-phone-screen">
                  <div class="ib-slider">
                    <img src="/images/bikeros-sos.webp" alt="BikerOS App — SOS Emergency" width="300" height="600" loading="lazy"
                      decoding="async">
                    <img src="/images/bikeros-home.webp" alt="BikerOS App — Home Dashboard" width="300" height="600"
                      loading="lazy" decoding="async">
                    <img src="/images/bikeros-eventos.webp" alt="BikerOS App — Events & Rides" width="300" height="600"
                      loading="lazy" decoding="async">
                  </div>
                </div>
              </div>
              <div class="case-phone-home"></div>
            </div>

            <div class="case-phone-secondary" aria-hidden="true">
              <div class="case-phone-shell">
                <div class="case-phone-notch"></div>
                <div class="case-phone-screen">
                  <img src="/images/bikeros-perfil.webp" alt="BikerOS App — Pilot Profile" width="260" height="560" loading="lazy"
                    decoding="async">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Architecture breakdown -->
      <div class="case-architecture animate-on-scroll" style="margin-top:48px">
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;color:var(--text-primary)">Built on the Elur ecosystem</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">
          <div style="padding:20px;border:1px solid var(--border);border-radius:12px;background:var(--card-bg)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Mobile App</div>
            <strong style="display:block;margin-bottom:6px">BikerOS App</strong>
            <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5">Elur-Ionic + Elur Query. SOS emergencies, live GPS tracking, offline routes, ICE medical info, event RSVP.</p>
          </div>
          <div style="padding:20px;border:1px solid var(--border);border-radius:12px;background:var(--card-bg)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--accent-light);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Landing Page</div>
            <strong style="display:block;margin-bottom:6px">bikeros.co</strong>
            <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5">Elur Kit with SSG, islands, SEO, sitemap, and content collections. Pricing, features, FAQ.</p>
          </div>
          <div style="padding:20px;border:1px solid var(--border);border-radius:12px;background:var(--card-bg)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Admin Panel</div>
            <strong style="display:block;margin-bottom:6px">BikerOS Web</strong>
            <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5">Elur + Elur Query. Member management, route builder with map, event dashboard, billing and invoicing.</p>
          </div>
          <div style="padding:20px;border:1px solid var(--border);border-radius:12px;background:var(--card-bg)">
            <div style="font-size:0.75rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">White-label</div>
            <strong style="display:block;margin-bottom:6px">Iron Bikers</strong>
            <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5">BikerOS white-label instance for the Iron Bikers club. Custom branding, domain, and club-specific features.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Showcases -->
  `);
}
