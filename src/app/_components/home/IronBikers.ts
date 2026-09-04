import { html } from "@elurjs/core";
import { image } from "@elurjs/kit";
import type { ElurTemplate } from "@elurjs/core";

export function IronBikers(): ElurTemplate {
  return html`
<section id="iron-bikers" class="home-section home-case-study-section">
    <div class="home-container">
      <div class="home-case-study-grid">
        <div class="animate-on-scroll">
          <div class="home-case-kicker">Production Case Study</div>
          <h2 class="home-case-title">BikerOS: <span class="home-gradient-text">the OS for motorcycle clubs</span></h2>
          <p class="home-case-text">
            A full-stack platform for motorcycle clubs — live GPS tracking, SOS emergencies, route management,
            events, and a web admin panel. Built entirely on the Elur ecosystem across 4 apps.
          </p>

          <div class="home-case-tags">
            <span class="home-case-tag">Elur-Ionic (Mobile)</span>
            <span class="home-case-tag">Elur Kit (Landing + Web)</span>
            <span class="home-case-tag">Elur Query (Data)</span>
            <span class="home-case-tag">SSG + SSR</span>
            <span class="home-case-tag">Offline-first</span>
            <span class="home-case-tag">White-label ready</span>
          </div>

          <div class="home-case-metrics">
            <div class="home-case-metric">
              <strong>2</strong>
              <span>Apps shipped</span>
            </div>
            <div class="home-case-metric">
              <strong>6</strong>
              <span>SOS types</span>
            </div>
            <div class="home-case-metric">
              <strong>40+</strong>
              <span>Members per club</span>
            </div>
            <div class="home-case-metric">
              <strong>100%</strong>
              <span>Elur ecosystem</span>
            </div>
          </div>

          <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
            <a href="https://www.bikeros.co/" target="_blank" rel="noopener" class="home-btn-primary" style="padding:10px 22px;font-size:0.88rem">
              Visit bikeros.co
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        <div class="home-case-phones animate-on-scroll">
          <div class="home-case-phone-stack">
            <div class="home-case-phone-main">
              <div class="home-case-phone-shell">
                <div class="home-case-phone-notch"></div>
                <div class="home-case-phone-screen">
                  <div class="home-ib-slider">
                    ${image({
    src: "/images/bikeros-sos.webp",
    alt: "BikerOS App — SOS Emergency",
    width: 300,
    height: 600,
    widths: [300],
    class: "home-ib-slide-img",
  })}
                    ${image({
    src: "/images/bikeros-home.webp",
    alt: "BikerOS App — Home Dashboard",
    width: 300,
    height: 600,
    widths: [300],
    class: "home-ib-slide-img",
  })}
                    ${image({
    src: "/images/bikeros-eventos.webp",
    alt: "BikerOS App — Events & Rides",
    width: 300,
    height: 600,
    widths: [300],
    class: "home-ib-slide-img",
  })}
                  </div>
                </div>
              </div>
              <div class="home-case-phone-home"></div>
            </div>

            <div class="home-case-phone-secondary" aria-hidden="true">
              <div class="home-case-phone-shell">
                <div class="home-case-phone-notch"></div>
                <div class="home-case-phone-screen">
                  ${image({
    src: "/images/bikeros-perfil.webp",
    alt: "BikerOS App — Pilot Profile",
    width: 260,
    height: 560,
    widths: [260],
    class: "home-ib-slide-img",
  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Architecture breakdown -->
      <div class="home-case-architecture animate-on-scroll" style="margin-top:48px">
        <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;color:var(--c-text)">Built on the Elur ecosystem</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">
          <div style="padding:20px;border:1px solid var(--c-border);border-radius:12px;background:var(--c-surface)">
            <div style="font-size:0.75rem;font-weight:700;color:#fb923c;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Mobile App</div>
            <strong style="display:block;margin-bottom:6px">BikerOS App</strong>
            <p style="font-size:0.82rem;color:var(--c-text-3);line-height:1.5">Elur-Ionic + Elur Query. SOS emergencies, live GPS tracking, offline routes, ICE medical info, event RSVP.</p>
          </div>
          <div style="padding:20px;border:1px solid var(--c-border);border-radius:12px;background:var(--c-surface)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--c-accent-3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Landing Page</div>
            <strong style="display:block;margin-bottom:6px">bikeros.co</strong>
            <p style="font-size:0.82rem;color:var(--c-text-3);line-height:1.5">Elur Kit with SSG, islands, SEO, sitemap, and content collections. Pricing, features, FAQ.</p>
          </div>
          <div style="padding:20px;border:1px solid var(--c-border);border-radius:12px;background:var(--c-surface)">
            <div style="font-size:0.75rem;font-weight:700;color:var(--c-blue);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Admin Panel</div>
            <strong style="display:block;margin-bottom:6px">BikerOS Web</strong>
            <p style="font-size:0.82rem;color:var(--c-text-3);line-height:1.5">Elur + Elur Query. Member management, route builder with map, event dashboard, billing and invoicing.</p>
          </div>
          <div style="padding:20px;border:1px solid var(--c-border);border-radius:12px;background:var(--c-surface)">
            <div style="font-size:0.75rem;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">White-label</div>
            <strong style="display:block;margin-bottom:6px">Iron Bikers</strong>
            <p style="font-size:0.82rem;color:var(--c-text-3);line-height:1.5">BikerOS white-label instance for the Iron Bikers club. Custom branding, domain, and club-specific features.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
