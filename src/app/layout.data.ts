import type { PageDataLoad } from "@elurjs/kit";
import { getInlineCss } from "./lib/inline-css";

export const load: PageDataLoad = async () => {
  // All styles in a single inline <style> — zero render-blocking requests.
  const inlineCss = await getInlineCss();
  const safeCss = inlineCss.replace(/<\/style>/gi, "<\\/style>");

  // Marks JS availability so scroll-reveal styles only hide content when JS
  // is actually running (no-JS users see everything, unstyled-hidden).
  const headScripts = ["document.documentElement.classList.add('js')"];

  // Structured data (JSON-LD) for rich results and semantic understanding.
  const structuredData = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.elur.dev/#website",
        "url": "https://www.elur.dev/",
        "name": "Elur",
        "alternateName": "ElurJS",
        "description": "ElurJS is a lightweight reactive JavaScript framework with fine-grained signals, direct DOM updates, no virtual DOM, and no required build step.",
        "publisher": { "@id": "https://www.elur.dev/#organization" },
        "inLanguage": "en",
      },
      {
        "@type": "Organization",
        "@id": "https://www.elur.dev/#organization",
        "name": "Elur",
        "alternateName": "ElurJS",
        "url": "https://www.elur.dev/",
        "logo": "https://www.elur.dev/images/elur-logo-112.png",
        "sameAs": [
          "https://github.com/elurjs/elur",
          "https://www.npmjs.com/package/@elurjs/core",
        ],
      },
      {
        "@type": ["SoftwareApplication", "SoftwareSourceCode"],
        "@id": "https://www.elur.dev/#software",
        "name": "Elur",
        "alternateName": "ElurJS",
        "description": "A lightweight signal-based reactive JavaScript and TypeScript framework with fine-grained direct DOM updates, no virtual DOM, zero dependencies, and no required compiler.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "codeRepository": "https://github.com/elurjs/elur",
        "programmingLanguage": ["TypeScript", "JavaScript"],
        "runtimePlatform": "Web browser",
        "keywords": "Elur, ElurJS, reactive JavaScript framework, signals, fine-grained reactivity, no virtual DOM, TypeScript framework",
        "license": "https://github.com/elurjs/elur/blob/main/LICENSE",
        "url": "https://www.elur.dev/",
        "author": { "@id": "https://www.elur.dev/#organization" },
      },
    ],
  })}</script>`;

  const headLinks = [
    `<style>${safeCss}</style>`,
    '<link rel="icon" type="image/x-icon" href="/images/ico/favicon.ico" />',
    '<link rel="apple-touch-icon" sizes="57x57" href="/images/ico/apple-icon-57x57.png" />',
    '<link rel="apple-touch-icon" sizes="60x60" href="/images/ico/apple-icon-60x60.png" />',
    '<link rel="apple-touch-icon" sizes="72x72" href="/images/ico/apple-icon-72x72.png" />',
    '<link rel="apple-touch-icon" sizes="76x76" href="/images/ico/apple-icon-76x76.png" />',
    '<link rel="apple-touch-icon" sizes="114x114" href="/images/ico/apple-icon-114x114.png" />',
    '<link rel="apple-touch-icon" sizes="120x120" href="/images/ico/apple-icon-120x120.png" />',
    '<link rel="apple-touch-icon" sizes="144x144" href="/images/ico/apple-icon-144x144.png" />',
    '<link rel="apple-touch-icon" sizes="152x152" href="/images/ico/apple-icon-152x152.png" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="/images/ico/apple-icon-180x180.png" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/images/ico/favicon-32x32.png" />',
    '<link rel="icon" type="image/png" sizes="16x16" href="/images/ico/favicon-16x16.png" />',
    '<link rel="icon" type="image/png" sizes="96x96" href="/images/ico/favicon-96x96.png" />',
    '<link rel="manifest" href="/images/ico/manifest.json" />',
    '<meta name="theme-color" content="#3432c8" />',
    '<meta name="application-name" content="Elur" />',
    '<meta name="apple-mobile-web-app-title" content="Elur" />',
    '<meta name="apple-mobile-web-app-capable" content="yes" />',
    '<meta name="mobile-web-app-capable" content="yes" />',
    '<meta name="msapplication-TileColor" content="#3432c8" />',
    '<meta name="msapplication-TileImage" content="/images/ico/ms-icon-144x144.png" />',
    '<meta name="msapplication-config" content="/images/ico/browserconfig.xml" />',
    structuredData,
  ];

  return { headScripts, headLinks };
};
