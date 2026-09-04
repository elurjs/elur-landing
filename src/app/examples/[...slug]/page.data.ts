import type { PageDataLoad } from "@elurjs/kit";
import { getEntry } from "@elurjs/kit/content";
import { getExamples, type ExampleMeta } from "../../lib/docs-nav";
import { extractCodeBlock, highlightCode, renderMarkdown, type TocItem } from "../../lib/markdown";

export interface ExampleDetailData {
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  featured?: boolean;
  slug: string;
  code: string;
  codeHtml: string;
  descHtml: string;
  toc: TocItem[];
  notFound: boolean;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

export const load: PageDataLoad = async ({
  params,
}): Promise<ExampleDetailData> => {
  const slugParts = (params as Record<string, unknown>).slug;
  const slug = Array.isArray(slugParts)
    ? slugParts.join("/")
    : (slugParts as string) || "counter";

  const entry = await getEntry<ExampleMeta>("examples", slug);

  if (!entry) {
    return {
      title: "Not Found",
      description: "",
      category: "",
      slug,
      code: "",
      codeHtml: "",
      descHtml: "",
      toc: [],
      notFound: true,
    };
  }

  const code = extractCodeBlock(entry.body);
  // The highlighted HTML travels inside a data-props JSON attribute, where
  // the HTML parser would decode entities like &lt; back to "<" before
  // JSON.parse runs — corrupting the markup. Base64 keeps it intact.
  const codeHtml = code
    ? Buffer.from(await highlightCode(code, "typescript"), "utf8").toString("base64")
    : "";
  const { html: descHtml, toc } = await renderMarkdown(
    // The page header already shows the title — drop the body's leading H1.
    entry.body.replace(/^#\s+[^\n]*\n+/, ""),
  );

  // Get prev/next from the examples list
  const allExamples = await getExamples();
  const idx = allExamples.findIndex((e) => e.slug === slug);

  return {
    title: entry.data.title,
    description: entry.data.description,
    category: entry.data.category,
    difficulty: entry.data.difficulty,
    featured: entry.data.featured,
    slug,
    code,
    codeHtml,
    descHtml,
    toc,
    notFound: false,
    prev: idx > 0 ? { slug: allExamples[idx - 1].slug, title: allExamples[idx - 1].title } : undefined,
    next: idx < allExamples.length - 1 ? { slug: allExamples[idx + 1].slug, title: allExamples[idx + 1].title } : undefined,
  };
};
