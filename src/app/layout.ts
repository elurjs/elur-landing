/**
 * Root layout: announcement bar, navbar, main content, and footer.
 */

import { html } from "@elurjs/core";
import { raw } from "@elurjs/kit/content";
import type { LayoutProps } from "@elurjs/kit";
import { island } from "@elurjs/kit";
import Navbar from "../islands/Navbar.ts";
import ScrollReveal from "../islands/ScrollReveal.ts";

const announcement = `<div class="announcement-bar">
    <span>New:</span>
    <a href="https://kit.elur.dev/" target="_blank" rel="noopener">Elur Kit 2.4.4</a>
    <span class="ab-sep">—</span>
    <span>Client-only islands, optional build-time compiler, and zero client JS by default.</span>
    <a href="https://kit.elur.dev/" target="_blank" rel="noopener">Explore →</a>
  </div>`;

const navbar = `<nav class="navbar" id="navbar">
    <div class="container">
      <a href="/" class="nav-logo">
        <picture><source srcset="/images/elur-logo-112.webp" type="image/webp" /><img src="/images/elur-logo-112.png" height="48px" width="48px" alt="Elur Logo" /></picture>
        Elur
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="#features">Features</a></li>
        <li><a href="#playground">Playground</a></li>
        <li class="nav-dropdown">
          <a class="dropdown-trigger">
            Docs
            <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </a>
          <ul class="dropdown-menu">
            <li><a href="https://docs.elur.dev/" target="_blank" rel="noopener"
                style="font-weight: 700; color: var(--accent-light);">Full API Reference →</a></li>
            <li><a href="#quickstart">Quick Start Guide</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#elur-query">Elur Query</a></li>
            <li><a href="#inspired">Inspired By</a></li>
            <li><a href="#comparison">Comparison</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </li>
        <li class="nav-dropdown">
          <a class="dropdown-trigger">
            Ecosystem
            <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </a>
          <ul class="dropdown-menu">
            <li><a href="https://kit.elur.dev/" target="_blank" rel="noopener">Elur Kit
                <span class="badge-new">New</span></a></li>
            <li><a href="https://www.npmjs.com/package/@elurjs/query" target="_blank" rel="noopener">Elur Query
                <span class="badge-new">New</span></a></li>
            <li><a href="https://www.npmjs.com/package/@elurjs/i18n" target="_blank" rel="noopener">Elur i18n
                <span class="badge-new">New</span></a></li>
            <li><a href="https://www.npmjs.com/package/@elurjs/auth" target="_blank" rel="noopener">Elur Auth
                <span class="badge-new">New</span></a></li>
            <li><a href="https://ui.elur.dev/" target="_blank" rel="noopener">Elur-UI</a></li>
            <li><a href="#elur-ionic" rel="noopener">Elur-Ionic</a></li>
            <li><a href="#showcases">Built with Elur</a></li>
          </ul>
        </li>
        <li>
          <a href="https://github.com/elurjs/elur" class="nav-cta" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </li>
      </ul>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  </nav>`;

const footer = `<footer class="footer">
    <div class="container">
      <div class="footer-left">
        <span class="footer-logo">
          <picture><source srcset="/images/elur-logo-112.webp" type="image/webp" /><img src="/images/elur-logo-112.png" height="28px" width="28px" alt="Elur" style="object-fit:contain" /></picture>
          Elur
        </span>
        <span class="footer-text">MIT License · Built with TypeScript</span>
      </div>
      <ul class="footer-links">
        <li><a href="https://www.npmjs.com/package/@elurjs/core" target="_blank" rel="noopener">npm</a></li>
        <li><a href="https://github.com/elurjs/elur" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="https://github.com/elurjs/elur#readme" target="_blank" rel="noopener">Docs</a></li>
        <li><a href="https://github.com/elurjs/elur-i18n" target="_blank" rel="noopener">Elur i18n</a></li>
        <li><a href="https://github.com/elurjs/elur/blob/main/LICENSE" target="_blank"
            rel="noopener">License</a></li>
      </ul>
    </div>
  </footer>`;

export default function LandingLayout({ children }: LayoutProps) {
  return html`
    ${raw(announcement)}
    ${raw(navbar)}
    <main id="main-content">
      ${children}
    </main>
    ${raw(footer)}
    ${island("Navbar", Navbar, {}, "load")}
    ${island("ScrollReveal", ScrollReveal, {}, "load")}
  `;
}
