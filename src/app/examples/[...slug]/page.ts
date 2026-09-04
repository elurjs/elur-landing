import { html } from "@elurjs/core";
import { raw } from "@elurjs/kit/content";
import type { PageProps, PageMetadata, GenerateStaticParams } from "@elurjs/kit";
import { getCollection } from "@elurjs/kit/content";
import { island } from "@elurjs/kit";
import ExamplePlayground from "../../../islands/ExamplePlayground.ts";
import type { load, ExampleDetailData } from "./page.data.ts";

export const generateMetadata = (ctx: {
  data?: ExampleDetailData;
}): PageMetadata => {
  const d = ctx.data;
  if (!d || d.notFound) {
    return {
      title: "Not Found — Elur Examples",
      robots: "noindex, follow",
    };
  }
  const title = `${d.title} — Elur Example`;
  return {
    title,
    description: d.description,
    canonical: `https://www.elur.dev/examples/${d.slug}/`,
    openGraph: {
      type: "article",
      title,
      description: d.description,
      url: `https://www.elur.dev/examples/${d.slug}/`,
      siteName: "Elur",
    },
    twitter: {
      card: "summary",
      title,
      description: d.description,
    },
  };
};

export const generateStaticParams: GenerateStaticParams = async () => {
  const entries = await getCollection("examples");
  return entries.map((e) => ({
    slug: e.slug.split("/"),
  }));
};

export default function ExampleDetailPage({ data }: PageProps<typeof load>) {
  const d = data as ExampleDetailData | undefined;

  if (!d || d.notFound) {
    return html`
      <div style="text-align:center;padding:80px 20px;position:relative;z-index:1">
        <h1 style="font-size:3rem;color:var(--c-text-3)">404</h1>
        <p style="color:var(--c-text-2);margin:16px 0">
          This example doesn't exist.
        </p>
        <a href="/examples/" class="btn btn-gradient">Browse examples</a>
      </div>
    `;
  }

  return html`
    <div style="position:relative;z-index:1">
      <div class="playground">
        <!-- Header -->
        <div class="playground-header">
          <div class="playground-breadcrumb">
            <a href="/examples/">Examples</a>
            <span>/</span>
            <span>${d.title}</span>
          </div>
          <h1 class="playground-title">${d.title}</h1>
          <p class="playground-desc">${d.description}</p>
          <div class="playground-tags">
            <span class=${() => `example-tag cat-${d.category}`}>${d.category}</span>
            ${d.difficulty
      ? html`<span class="example-tag">${d.difficulty}</span>`
      : null}
            ${d.featured
      ? html`<span class="example-tag badge-accent">★ Featured</span>`
      : null}
          </div>
        </div>

        <!-- Playground (client-only island) -->
        ${island(
        "ExamplePlayground",
        ExamplePlayground,
        { code: d.code, codeHtml: d.codeHtml, title: d.title },
        "only",
        {
          fallback: html`
              <div class="playground-preview-wrap">
                <div class="playground-preview-fallback">Loading preview…</div>
              </div>
            `,
        },
      )}

        <!-- Description -->
        <div class="docs-content" style="padding:0;max-width:760px;margin-top:48px">
          <article class="prose">
            ${raw(d.descHtml || "")}
          </article>

          <!-- Prev/Next -->
          <nav class="page-nav">
            ${d.prev
      ? html`
                <a class="page-nav-item" href=${`/examples/${d.prev.slug}/`}>
                  <span class="page-nav-label">← Previous</span>
                  <span class="page-nav-title">${d.prev.title}</span>
                </a>
              `
      : html`<span></span>`}
            ${d.next
      ? html`
                <a class="page-nav-item next" href=${`/examples/${d.next.slug}/`}>
                  <span class="page-nav-label">Next →</span>
                  <span class="page-nav-title">${d.next.title}</span>
                </a>
              `
      : html`<span></span>`}
          </nav>
        </div>
      </div>
    </div>
  `;
}
