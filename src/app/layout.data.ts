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

  const inlineCss = await getInlineCss();
  const safeCss = inlineCss.replace(/<\/style>/gi, "<\\/style>");

  const headLinks: string[] = [
    `<style>${safeCss}</style>`,
    '<meta name="theme-color" content="#0a0a0f" />',
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
