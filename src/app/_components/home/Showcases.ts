import { html } from "@elurjs/core";
import { image } from "@elurjs/kit";
import type { ElurTemplate } from "@elurjs/core";

export function Showcases(): ElurTemplate {
  return html`
<section class="home-section home-showcases-section" id="showcases">
    <div class="home-container">
      <div class="home-section-header animate-on-scroll">
        <div class="home-section-label">🌟 Showcases</div>
        <h2 class="home-section-title">Built with <span class="home-gradient-text">Elur</span></h2>
        <p class="home-section-desc">Real production apps powered by the Elur ecosystem — from mobile to web to full-stack platforms.</p>
      </div>

      <div class="home-showcases-grid">
        <!-- BikerOS Landing -->
        <a href="https://www.bikeros.co/" target="_blank" rel="noopener"
          class="home-showcase-card animate-on-scroll">
          <div class="home-showcase-image">
            ${image({
    src: "/images/showcases/bikeros-landing.webp",
    alt: "BikerOS landing page — built with Elur Kit (SSG, islands, SEO)",
    width: 1280,
    height: 800,
    widths: [640, 1280],
    sizes: "(min-width: 768px) 50vw, 100vw",
    class: "home-showcase-img",
  })}
          </div>
          <div class="home-showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--c-accent-3);background:var(--c-accent-subtle);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur Kit</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--c-text-3)">SSG + Islands</span>
            </div>
            <h3>BikerOS Landing</h3>
            <p>Marketing site for a motorcycle club platform. SSG with islands for interactive pricing,
              FAQ accordion, and scroll reveal. SEO, sitemap, and content collections out of the box.</p>
            <span class="home-showcase-link">Visit bikeros.co
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </a>

        <!-- BikerOS App -->
        <div class="home-showcase-card animate-on-scroll" style="cursor:default">
          <div class="home-showcase-image">
            ${image({
    src: "/images/showcases/sos.webp",
    alt: "BikerOS mobile app — built with Elur-Ionic and Elur Query",
    width: 1080,
    height: 2400,
    widths: [540, 1080],
    sizes: "(min-width: 768px) 25vw, 50vw",
    class: "home-showcase-img",
  })}
          </div>
          <div class="home-showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:#fb923c;background:rgba(251,146,60,0.1);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur-Ionic</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--c-text-3)">Mobile + Offline</span>
            </div>
            <h3>BikerOS Mobile App</h3>
            <p>Motorcycle club management app with SOS emergencies, live GPS tracking, offline routes,
              ICE medical info, and event RSVP. Elur-Ionic components, Elur Query for server state,
              and Capacitor for native deployment.</p>
            <span class="home-showcase-link" style="color:var(--c-text-3)">Android &amp; iOS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <!-- BikerOS Web Admin -->
        <div class="home-showcase-card animate-on-scroll" style="cursor:default">
          <div class="home-showcase-image">
            ${image({
    src: "/images/showcases/panel_admin.webp",
    alt: "BikerOS admin panel — built with Elur and Elur Query",
    width: 1080,
    height: 2400,
    widths: [540, 1080],
    sizes: "(min-width: 768px) 25vw, 50vw",
    class: "home-showcase-img",
  })}
          </div>
          <div class="home-showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--c-blue);background:rgba(96,165,250,0.1);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur + Query</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--c-text-3)">Dashboard</span>
            </div>
            <h3>BikerOS Admin Panel</h3>
            <p>Web dashboard for club administrators. Member management, route builder with interactive maps,
              event dashboard, billing and invoicing. Elur for UI, Elur Query for data fetching and cache.</p>
            <span class="home-showcase-link" style="color:var(--c-text-3)">Web app
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <!-- Elur Kit Docs -->
        <a href="/docs/ecosystem/kit/overview/" class="home-showcase-card animate-on-scroll">
          <div class="home-showcase-image">
            ${image({
    src: "/images/showcases/elur-kit-docs.png",
    alt: "Elur Kit documentation site — built with Elur Kit itself (dogfooding)",
    width: 2560,
    height: 1600,
    widths: [640, 1280, 2560],
    sizes: "(min-width: 768px) 50vw, 100vw",
    class: "home-showcase-img",
  })}
          </div>
          <div class="home-showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--c-accent-3);background:var(--c-accent-subtle);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur Kit</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--c-text-3)">Dogfooding</span>
            </div>
            <h3>Elur Kit Docs</h3>
            <p>The official Elur Kit documentation — built with Elur Kit itself. File-based routing, SSG, islands,
              Shiki code highlighting, full-text search, and SEO out of the box.</p>
            <span class="home-showcase-link">Read the Kit docs
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
          class="home-showcase-card animate-on-scroll">
          <div class="home-showcase-image">
            ${image({
    src: "/images/showcases/elur-student-library.png",
    alt: "Academic Management System built using Elur and Elur-UI components",
    width: 1918,
    height: 972,
    widths: [640, 1280, 1918],
    sizes: "(min-width: 768px) 50vw, 100vw",
    class: "home-showcase-img",
  })}
          </div>
          <div class="home-showcase-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:0.7rem;font-weight:700;color:var(--c-blue);background:rgba(96,165,250,0.1);padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px">Elur</span>
              <span style="font-size:0.7rem;font-weight:600;color:var(--c-text-3)">SPA</span>
            </div>
            <h3>University Academic System</h3>
            <p>An academic tracking platform showcasing client-side routing, global state management, and nested layouts
              powered by Elur.</p>
            <span class="home-showcase-link">Visit project
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
  `;
}
