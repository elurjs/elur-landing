import type { PageDataLoad } from "@elurjs/kit";
import { getDocsNav, getPrevNext } from "../../lib/docs-nav";
import { getEntry } from "@elurjs/kit/content";
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
  docHtml: string;
  notFound: boolean;
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
      docHtml: "",
      notFound: true,
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
      docHtml: "",
      notFound: true,
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
    docHtml,
    notFound: false,
  };
};
