import type { PageDataLoad } from "@elurjs/kit";
import { getEntry } from "@elurjs/kit/content";
import { jsonLd } from "@elurjs/kit/seo";
import { getExamples, type ExampleMeta } from "./lib/docs-nav";
import { extractCodeBlock } from "./lib/markdown";

interface HomeData {
  featuredExamples: Array<ExampleMeta & { previewCode: string }>;
  headScripts: string[];
  headLinks: string[];
}

const structuredData = jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.elur.dev/#website",
      "url": "https://www.elur.dev/",
      "name": "Elur",
      "alternateName": "ElurJS",
      "description":
        "ElurJS is a lightweight reactive JavaScript framework with fine-grained signals, direct DOM updates, no virtual DOM, and no required build step.",
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
      "description":
        "A lightweight signal-based reactive JavaScript and TypeScript framework with fine-grained direct DOM updates, no virtual DOM, zero dependencies, and no required compiler.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "codeRepository": "https://github.com/elurjs/elur",
      "programmingLanguage": ["TypeScript", "JavaScript"],
      "runtimePlatform": "Web browser",
      "keywords":
        "Elur, ElurJS, reactive JavaScript framework, signals, fine-grained reactivity, no virtual DOM, TypeScript framework",
      "license": "https://github.com/elurjs/elur/blob/main/LICENSE",
      "url": "https://www.elur.dev/",
      "author": { "@id": "https://www.elur.dev/#organization" },
    },
  ],
});

export const load: PageDataLoad = async (): Promise<HomeData> => {
  const allExamples = await getExamples();
  const featured = allExamples.filter((e) => e.featured).slice(0, 3);
  const featuredExamples = await Promise.all(
    featured.map(async (ex) => {
      const entry = await getEntry<ExampleMeta>("examples", ex.slug);
      const previewCode = entry ? extractCodeBlock(entry.body) : "";
      return { ...ex, previewCode };
    }),
  );

  return {
    featuredExamples,
    // Marks JS availability so scroll-reveal styles only hide content when JS
    // is actually running (no-JS users see everything).
    headScripts: ["document.documentElement.classList.add('js')"],
    headLinks: [structuredData],
  };
};
