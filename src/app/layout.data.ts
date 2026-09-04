import type { PageDataLoad } from "@elurjs/kit";
import { getDocsNav, type NavSection } from "./lib/docs-nav";
import { getTutorialNav, type TutorialSection } from "./lib/tutorial-nav";
import { getInlineCss } from "./lib/inline-css";

export interface SiteLayoutData {
  headScripts: string[];
  headLinks: string[];
  navSections: NavSection[];
  examplesNav: Array<{ title: string; href: string; desc?: string }>;
  tutorialNav: TutorialSection[];
  docsDropdownSections: Array<{
    title: string;
    items: Array<{ title: string; href: string; desc?: string }>;
  }>;
}

export const load: PageDataLoad = async () => {
  const navSections = await getDocsNav();
  const tutorialNav = await getTutorialNav();

  const headScripts: string[] = [
    "(function(){try{var t=localStorage.getItem('elur-gallery-theme');if(t){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();",
  ];

  const css = await getInlineCss();
  const safeCss = css.inline.replace(/<\/style>/gi, "<\\/style>");

  const headLinks: string[] = [
    `<style>${safeCss}</style>`,
    css.deferredLink,
    '<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />',
    '<link rel="preload" href="/fonts/jetbrains-mono-var.woff2" as="font" type="font/woff2" crossorigin />',
    '<link rel="icon" type="image/x-icon" href="/images/ico/favicon.ico" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/images/ico/favicon-32x32.png" />',
    '<link rel="icon" type="image/png" sizes="16x16" href="/images/ico/favicon-16x16.png" />',
    '<link rel="icon" type="image/png" sizes="96x96" href="/images/ico/favicon-96x96.png" />',
    '<link rel="apple-touch-icon" sizes="57x57" href="/images/ico/apple-icon-57x57.png" />',
    '<link rel="apple-touch-icon" sizes="60x60" href="/images/ico/apple-icon-60x60.png" />',
    '<link rel="apple-touch-icon" sizes="72x72" href="/images/ico/apple-icon-72x72.png" />',
    '<link rel="apple-touch-icon" sizes="76x76" href="/images/ico/apple-icon-76x76.png" />',
    '<link rel="apple-touch-icon" sizes="114x114" href="/images/ico/apple-icon-114x114.png" />',
    '<link rel="apple-touch-icon" sizes="120x120" href="/images/ico/apple-icon-120x120.png" />',
    '<link rel="apple-touch-icon" sizes="144x144" href="/images/ico/apple-icon-144x144.png" />',
    '<link rel="apple-touch-icon" sizes="152x152" href="/images/ico/apple-icon-152x152.png" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="/images/ico/apple-icon-180x180.png" />',
    '<link rel="manifest" href="/images/ico/manifest.json" />',
    '<meta name="theme-color" content="#0a0a0f" media="(prefers-color-scheme: dark)" />',
    '<meta name="theme-color" content="#f7f7fb" media="(prefers-color-scheme: light)" />',
    '<meta name="application-name" content="Elur" />',
    '<meta name="apple-mobile-web-app-title" content="Elur" />',
    '<meta name="apple-mobile-web-app-capable" content="yes" />',
    '<meta name="mobile-web-app-capable" content="yes" />',
    '<meta name="msapplication-TileColor" content="#3432c8" />',
    '<meta name="msapplication-TileImage" content="/images/ico/ms-icon-144x144.png" />',
    '<meta name="msapplication-config" content="/images/ico/browserconfig.xml" />',
    // Warm up the Elur CDN before the preview iframes request it — the
    // modulepreload fills the shared HTTP cache so iframes load instantly.
    '<link rel="preconnect" href="https://esm.sh" crossorigin />',
    '<link rel="modulepreload" href="https://esm.sh/@elurjs/core@3.6.2" crossorigin />',
  ];

  // Build docs dropdown sections (first 2 items per section for the navbar)
  const docsDropdownSections = navSections.map((section) => ({
    title: section.title,
    items: section.items.slice(0, 4).map((item) => ({
      title: item.title,
      href: `/docs/${item.slug}/`,
      desc: item.description,
    })),
  }));

  const examplesNav = [
    { title: "Counter", href: "/examples/counter/", desc: "Simple reactive counter" },
    { title: "Todo App", href: "/examples/todo-app/", desc: "Task list with filters" },
    { title: "Color Picker", href: "/examples/color-picker/", desc: "Interactive color picker" },
    { title: "Markdown Previewer", href: "/examples/markdown-previewer/", desc: "Live markdown rendering" },
  ];

  return {
    headScripts,
    headLinks,
    navSections,
    examplesNav,
    tutorialNav,
    docsDropdownSections,
  };
};
