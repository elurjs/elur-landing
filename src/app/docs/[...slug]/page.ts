import { html } from "@elurjs/core";
import { raw } from "@elurjs/kit/content";
import type { PageProps, PageMetadata, GenerateStaticParams } from "@elurjs/kit";
import { getCollection } from "@elurjs/kit/content";
import type { DocMeta } from "../../lib/docs-nav";
import { getDocsNav, type NavSection } from "../../lib/docs-nav";
import type { load, DocPageData } from "./page.data";

export const generateMetadata = (ctx: { data?: DocPageData }): PageMetadata => {
  const d = ctx.data;
  if (!d || d.notFound) {
    return {
      title: "Not Found — Elur Docs",
      robots: "noindex, follow",
    };
  }
  const title = `${d.currentTitle} — Elur Docs`;
  const description = d.currentDesc || `${d.currentSection} — Elur documentation`;
  return {
    title,
    description,
    canonical: `https://www.elur.dev/docs/${d.currentSlug}/`,
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://www.elur.dev/docs/${d.currentSlug}/`,
      siteName: "Elur",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
};

export const generateStaticParams: GenerateStaticParams = async () => {
  const entries = await getCollection<DocMeta>("docs");
  return entries
    .filter((e) => !e.data.draft)
    .map((e) => ({
      slug: e.slug.split("/"),
    }));
};

export default function DocPage({ data }: PageProps<typeof load>) {
  const d = data as DocPageData | undefined;

  if (!d || d.notFound) {
    return html`
      <div style="text-align:center;padding:80px 20px;position:relative;z-index:1">
        <h1 style="font-size:3rem;color:var(--c-text-3)">404</h1>
        <p style="color:var(--c-text-2);margin:16px 0">
          This documentation page doesn't exist.
        </p>
        <a href="/docs/getting-started/introduction/" class="btn btn-gradient">Back to docs</a>
      </div>
    `;
  }

  const navSections = d.sections;

  return html`
    <div class="docs-shell">
      <aside class="docs-sidebar" id="docs-sidebar">
        <nav>
          ${navSections.map(
    (section) => html`
              <div class="side-group">
                <div class="side-group-title">${section.title}</div>
                ${section.items.map(
      (item) => html`
                    <a
                      class=${() =>
          `side-link${item.slug === d.currentSlug ? " active" : ""}`}
                      href=${`/docs/${item.slug}/`}
                    >
                      ${item.title}
                    </a>
                  `,
    )}
              </div>
            `,
  )}
        </nav>
      </aside>

      <main class="docs-main">
        <div class="docs-content">
          <article class="prose">
            ${raw(d.docHtml || "")}
          </article>

          <nav class="page-nav">
            ${d.prev
      ? html`
                <a class="page-nav-item" href=${`/docs/${d.prev.slug}/`}>
                  <span class="page-nav-label">← Previous</span>
                  <span class="page-nav-title">${d.prev.title}</span>
                </a>
              `
      : html`<span></span>`}
            ${d.next
      ? html`
                <a class="page-nav-item next" href=${`/docs/${d.next.slug}/`}>
                  <span class="page-nav-label">Next →</span>
                  <span class="page-nav-title">${d.next.title}</span>
                </a>
              `
      : html`<span></span>`}
          </nav>
        </div>
      </main>

      ${d.toc.length > 0
      ? html`
          <aside class="docs-toc">
            <div class="toc-title">On this page</div>
            <ul class="toc-list">
              ${d.toc.map(
        (item) => html`
                  <li>
                    <a
                      class=${() => `toc-link level-${item.level}`}
                      href=${`#${item.slug}`}
                    >
                      ${item.text}
                    </a>
                  </li>
                `,
      )}
            </ul>
          </aside>
        `
      : html`<aside class="docs-toc"></aside>`}
    </div>
  `;
}
