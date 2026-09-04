import { html } from "@elurjs/core";
import type { LayoutProps } from "@elurjs/kit";
import { island, image } from "@elurjs/kit";
import type { SiteLayoutData } from "./layout.data.ts";
import NavDropdown from "../islands/NavDropdown.ts";
import MobileMenu from "../islands/MobileMenu.ts";
import ThemeToggle from "../islands/ThemeToggle.ts";
import CodeCopy from "../islands/CodeCopy.ts";

export default function SiteLayout({ children, data }: LayoutProps<SiteLayoutData>) {
  const d = data as SiteLayoutData | undefined;
  const navSections = d?.navSections ?? [];
  const docsDropdownSections = d?.docsDropdownSections ?? [];
  const examplesNav = d?.examplesNav ?? [];
  const tutorialNav = d?.tutorialNav ?? [];

  // Build mobile menu sections from nav data
  const mobileSections = [
    ...navSections.map((s) => ({
      title: s.title,
      items: s.items.map((item) => ({ title: item.title, href: `/docs/${item.slug}/` })),
    })),
    ...tutorialNav.map((s) => ({
      title: `Tutorial: ${s.title}`,
      items: s.items.map((item) => ({ title: item.title, href: `/tutorial/${item.slug}/` })),
    })),
    {
      title: "Examples",
      items: examplesNav.map((e) => ({ title: e.title, href: e.href })),
    },
  ];

  return html`
    <a href="#main-content" class="skip-link">Skip to content</a>
    <div class="page">
      <!-- Navbar -->
      <nav class="site-nav">
        <a href="/" class="nav-brand">
          ${image({
    src: "/images/elur-logo-112.png",
    alt: "Elur",
    width: 112,
    height: 75,
    priority: true,
    class: "nav-brand-logo",
  })}
          <span class="nav-brand-name">Elur</span>
        </a>

        <div class="nav-links">
          ${island("NavDropdown", NavDropdown, {
    label: "Docs",
    sections: docsDropdownSections,
  }, "only")}

          <a class="nav-link" href="/tutorial/basics/01-welcome/">
            Tutorial
          </a>

          <a class="nav-link" href="/examples/">
            Examples
          </a>

          ${island("NavDropdown", NavDropdown, {
    label: "API",
    sections: [
      {
        title: "Reference",
        items: [
          { title: "API Reference", href: "/docs/reference/api/", desc: "Core API surface" },
          { title: "Comparison", href: "/docs/reference/comparison/", desc: "Elur vs other frameworks" },
          { title: "FAQ", href: "/docs/reference/faq/", desc: "Frequently asked questions" },
        ],
      },
    ],
  }, "only")}
        </div>

        <div class="nav-right">
          <button class="nav-search-btn" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Search
            <span class="nav-search-kbd">⌘K</span>
          </button>

          ${island("ThemeToggle", ThemeToggle, {}, "load")}

          <a
            class="nav-icon-btn"
            href="https://github.com/elurjs/elur"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>

          ${island("MobileMenu", MobileMenu, { sections: mobileSections }, "only")}
        </div>
      </nav>

      <!-- Main content -->
      <div class="page-content" id="main-content">
        ${children}
      </div>

      <!-- Footer -->
      <footer class="site-footer">
        <div class="footer-inner">
          <div>
            <div class="footer-brand">
              ${image({
    src: "/images/elur-logo-112.png",
    alt: "Elur",
    width: 112,
    height: 75,
    class: "footer-brand-logo",
  })}
              Elur
            </div>
            <p class="footer-desc">
              A fine-grained reactive UI framework with a tiny runtime. Build fast, interactive web apps with signals and tagged templates.
            </p>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Docs</div>
            <a href="/tutorial/basics/01-welcome/">Tutorial</a>
            <a href="/docs/getting-started/introduction/">Introduction</a>
            <a href="/docs/getting-started/installation/">Installation</a>
            <a href="/docs/core/templates/">Templates</a>
            <a href="/docs/core/reactivity/">Reactivity</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Examples</div>
            <a href="/examples/counter/">Counter</a>
            <a href="/examples/todo-app/">Todo App</a>
            <a href="/examples/color-picker/">Color Picker</a>
            <a href="/examples/">All Examples</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Community</div>
            <a href="https://github.com/elurjs/elur" target="_blank" rel="noopener">GitHub</a>
            <a href="https://www.npmjs.com/package/@elurjs/core" target="_blank" rel="noopener">npm</a>
            <a href="/docs/reference/faq/">FAQ</a>
            <a href="/docs/reference/comparison/">Comparison</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>Released under the MIT License.</span>
          <span>Copyright © 2026 Elur</span>
        </div>
      </footer>
    </div>

    <!-- Code copy event delegation -->
    ${island("CodeCopy", CodeCopy, {}, "load")}
  `;
}
