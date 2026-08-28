import type { PageDataLoad } from "@elurjs/kit";
import { getInlineCss } from "./lib/inline-css";

export const load: PageDataLoad = async () => {
  // All styles in a single inline <style> — zero render-blocking requests.
  const inlineCss = await getInlineCss();
  const safeCss = inlineCss.replace(/<\/style>/gi, "<\\/style>");

  // Marks JS availability so scroll-reveal styles only hide content when JS
  // is actually running (no-JS users see everything, unstyled-hidden).
  const headScripts = ["document.documentElement.classList.add('js')"];

  const headLinks = [
    `<style>${safeCss}</style>`,
    '<link rel="icon" type="image/x-icon" href="/images/ico/favicon.ico" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="/images/ico/apple-icon-180x180.png" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/images/ico/favicon-32x32.png" />',
    '<link rel="icon" type="image/png" sizes="16x16" href="/images/ico/favicon-16x16.png" />',
    '<link rel="manifest" href="/images/ico/manifest.json" />',
    '<meta name="theme-color" content="#3432c8" />',
  ];

  return { headScripts, headLinks };
};
