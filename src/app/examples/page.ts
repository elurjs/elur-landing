import { html } from "@elurjs/core";
import type { PageProps, PageMetadata } from "@elurjs/kit";
import { island } from "@elurjs/kit";
import ExampleFilter from "../../islands/ExampleFilter.ts";
import ExampleCardPreview from "../../islands/ExampleCardPreview.ts";
import type { load, ExamplesIndexData } from "./page.data.ts";

export const generateMetadata = (): PageMetadata => ({
  title: "Examples — Elur",
  description:
    "Browse interactive Elur examples with live previews and source code. Counter, todo app, clock, color picker, and more.",
  canonical: "https://www.elur.dev/examples/",
  openGraph: {
    type: "website",
    title: "Examples — Elur",
    description: "Interactive Elur examples with live previews and source code.",
    siteName: "Elur",
    url: "https://www.elur.dev/examples/",
  },
});

export default function ExamplesIndexPage({ data }: PageProps<typeof load>) {
  const d = data as ExamplesIndexData | undefined;
  const examples = d?.examples ?? [];
  const categories = d?.categories ?? [];

  return html`
    <div style="position:relative;z-index:1">
      <section class="hero" style="padding-top:80px;padding-bottom:40px">
        <div class="hero-eyebrow">
          <span class="hero-eyebrow-dot"></span>
          ${() => `${examples.length} examples`}
        </div>
        <h1 class="hero-title" style="font-size:var(--text-5xl)">
          <span class="hero-title-grad">Examples gallery</span>
        </h1>
        <p class="hero-subtitle">
          Interactive demos with live previews. Click any card to see the code and play with it.
        </p>
      </section>

      <section class="section" style="padding-top:0">
        ${island("ExampleFilter", ExampleFilter, { categories }, "only")}

        <div class="gallery-grid">
          ${examples.map(
    (ex) => html`
              <a
                class="example-card"
                href=${`/examples/${ex.slug}/`}
                data-category=${ex.category}
              >
                <div class="example-card-preview">
                  ${ex.previewCode
        ? island(
          "ExampleCardPreview",
          ExampleCardPreview,
          { code: Buffer.from(ex.previewCode, "utf8").toString("base64") },
          "visible",
          { ssr: false },
        )
        : html`<div class="example-card-preview-fallback">Preview</div>`}
                </div>
                <div class="example-card-body">
                  <div class="example-card-title">${ex.title}</div>
                  <div class="example-card-desc">${ex.description}</div>
                  <div class="example-card-tags">
                    <span class=${() => `example-tag cat-${ex.category}`}>${ex.category}</span>
                    ${ex.difficulty
        ? html`<span class="example-tag">${ex.difficulty}</span>`
        : null}
                    ${ex.featured
        ? html`<span class="example-tag badge-accent">★ Featured</span>`
        : null}
                  </div>
                </div>
              </a>
            `,
  )}
        </div>
      </section>
    </div>
  `;
}
