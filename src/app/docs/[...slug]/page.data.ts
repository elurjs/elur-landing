import type { PageDataLoad } from "@elurjs/kit";
import { getDocsNav, getPrevNext } from "../../lib/docs-nav";
import { getEntry } from "@elurjs/kit/content";
import { jsonLd } from "@elurjs/kit/seo";
import { renderMarkdown, type TocItem } from "../../lib/markdown";
import type { DocMeta, NavSection } from "../../lib/docs-nav";

export interface DocPageData {
  sections: NavSection[];
  toc: TocItem[];
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
  currentSlug: string;
  currentSection: string;
  currentTitle: string;
  currentDesc: string;
  docHtml: string;
  notFound: boolean;
  headLinks: string[];
}

function breadcrumbLd(section: string, title: string, slug: string): string {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.elur.dev/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Docs",
        "item": "https://www.elur.dev/docs/getting-started/introduction/",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": section,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": `https://www.elur.dev/docs/${slug}/`,
      },
    ],
  });
}

export const load: PageDataLoad = async ({ params }): Promise<DocPageData> => {
  const sections = await getDocsNav();

  const slugParts = (params as Record<string, unknown>).slug;
  if (!slugParts) {
    return {
      sections,
      toc: [],
      prev: undefined,
      next: undefined,
      currentSlug: "",
      currentSection: "",
      currentTitle: "",
      currentDesc: "",
      docHtml: "",
      notFound: true,
      headLinks: [],
    };
  }

  const slug = Array.isArray(slugParts)
    ? slugParts.join("/")
    : (slugParts as string) || "getting-started/introduction";

  const entry = await getEntry<DocMeta>("docs", slug);

  if (!entry) {
    return {
      sections,
      toc: [],
      prev: undefined,
      next: undefined,
      currentSlug: slug,
      currentSection: "",
      currentTitle: "Not Found",
      currentDesc: "",
      docHtml: "",
      notFound: true,
      headLinks: [],
    };
  }

  const { html: docHtml, toc } = await renderMarkdown(entry.body);
  const { prev, next } = await getPrevNext(slug);

  return {
    sections,
    toc,
    prev: prev ? { slug: prev.slug, title: prev.title } : undefined,
    next: next ? { slug: next.slug, title: next.title } : undefined,
    currentSlug: slug,
    currentSection: entry.data.section,
    currentTitle: entry.data.title,
    currentDesc: entry.data.description,
    docHtml,
    notFound: false,
    headLinks: [breadcrumbLd(entry.data.section, entry.data.title, slug)],
  };
};
