import type { PageDataLoad } from "@elurjs/kit";
import { getTutorialBySlug, getTutorialPrevNext } from "../../lib/tutorial-nav";
import { renderMarkdown } from "../../lib/markdown";

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
      notFound: true,
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
    notFound: false,
  };
};
