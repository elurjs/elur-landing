import type { PageDataLoad } from "@elurjs/kit";
import { getTutorialBySlug, getTutorialPrevNext } from "../../lib/tutorial-nav";
import { jsonLd } from "@elurjs/kit/seo";
import { renderMarkdown } from "../../lib/markdown";

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
        "name": "Tutorial",
        "item": "https://www.elur.dev/tutorial/basics/01-welcome/",
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
        "item": `https://www.elur.dev/tutorial/${slug}/`,
      },
    ],
  });
}

export const load: PageDataLoad = async ({ params }) => {
  const slugParts = (params as Record<string, unknown>).slug;
  const slug = Array.isArray(slugParts)
    ? slugParts.join("/")
    : (slugParts as string) || "basics/01-welcome";

  const entry = await getTutorialBySlug(slug);

  if (!entry) {
    return {
      lessonHtml: "",
      hint: "",
      starterCode: "",
      solutionCode: "",
      prev: undefined,
      next: undefined,
      currentSlug: slug,
      currentTitle: "Not Found",
      currentSection: "",
      currentDesc: "",
      notFound: true,
      headLinks: [] as string[],
    };
  }

  // The lesson header already renders the title — drop the leading `# Title`
  // from the markdown body so it isn't duplicated.
  const body = entry.body.replace(/^\s*#[^\n]*\n+/, "");
  const { html: lessonHtml } = await renderMarkdown(body);
  const { prev, next } = await getTutorialPrevNext(slug);

  return {
    lessonHtml,
    hint: entry.data.hint,
    starterCode: entry.data.starterCode,
    solutionCode: entry.data.solutionCode,
    prev: prev ? { slug: prev.slug, title: prev.title } : undefined,
    next: next ? { slug: next.slug, title: next.title } : undefined,
    currentSlug: slug,
    currentTitle: entry.data.title,
    currentSection: entry.data.section,
    currentDesc: entry.data.description,
    notFound: false,
    headLinks: [breadcrumbLd(entry.data.section, entry.data.title, slug)],
  };
};
