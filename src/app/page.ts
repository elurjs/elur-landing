import { html } from "@elurjs/core";
import type { PageProps, PageMetadata } from "@elurjs/kit";
import { island } from "@elurjs/kit";
import ExampleCardPreview from "../islands/ExampleCardPreview.ts";
import ScrollReveal from "../islands/ScrollReveal.ts";
import type { load } from "./page.data.ts";
import { Hero } from "./_components/home/Hero";
import { Stats } from "./_components/home/Stats";
import { Benchmark } from "./_components/home/Benchmark";
import { InspiredPreview } from "./_components/home/InspiredPreview";
import { Interop } from "./_components/home/Interop";
import { QuickStart } from "./_components/home/QuickStart";
import { Features } from "./_components/home/Features";
import { Playground } from "./_components/home/Playground";
import { HowItWorks } from "./_components/home/HowItWorks";
import { CodeShowcase } from "./_components/home/CodeShowcase";
import { Ecosystem } from "./_components/home/Ecosystem";
import { DxEcosystem } from "./_components/home/DxEcosystem";
import { ElurKit } from "./_components/home/ElurKit";
import { ElurQuery } from "./_components/home/ElurQuery";
import { ElurI18n } from "./_components/home/ElurI18n";
import { ElurAuth } from "./_components/home/ElurAuth";
import { InspiredDeep } from "./_components/home/InspiredDeep";
import { ElurIonic } from "./_components/home/ElurIonic";
import { IronBikers } from "./_components/home/IronBikers";
import { Showcases } from "./_components/home/Showcases";
import { Faq } from "./_components/home/Faq";
import { Cta } from "./_components/home/Cta";
import { Contribute } from "./_components/home/Contribute";

export const generateMetadata = (): PageMetadata => ({
  title: "Elur — Lightweight Reactive JavaScript Framework | ElurJS",
  description:
    "ElurJS is a lightweight reactive JavaScript framework with fine-grained signals, direct DOM updates, no virtual DOM, zero dependencies, and no build step.",
  canonical: "https://www.elur.dev/",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    type: "website",
    title: "Elur — Lightweight Reactive JavaScript Framework",
    description:
      "Build fast reactive JavaScript interfaces with ElurJS signals, direct DOM updates, zero dependencies, and no required build step.",
    siteName: "ElurJS",
    url: "https://www.elur.dev/",
    image: "https://www.elur.dev/og-image.jpg",
    imageAlt: "ElurJS — lightweight reactive JavaScript framework",
    imageWidth: 1730,
    imageHeight: 909,
    imageType: "image/jpeg",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elur — Lightweight Reactive JavaScript Framework",
    description:
      "Build fast reactive JavaScript interfaces with ElurJS signals, direct DOM updates, zero dependencies, and no required build step.",
    image: "https://www.elur.dev/og-image.jpg",
    imageAlt: "ElurJS — lightweight reactive JavaScript framework",
  },
  other: {
    keywords:
      "Elur, ElurJS, Elur framework, Elur JavaScript, reactive JavaScript framework, lightweight JavaScript framework, signal-based framework, fine-grained reactivity, no virtual DOM, TypeScript framework",
    googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "twitter:site": "@elurjs",
    "twitter:creator": "@elurjs",
  },
});

export default function HomePage({ data }: PageProps<typeof load>) {
  const featured = data?.featuredExamples ?? [];

  return html`
    ${Hero()}
    ${Stats()}
    ${Benchmark()}
    ${InspiredPreview()}
    ${Interop()}
    ${QuickStart()}
    ${Features()}
    ${Playground()}
    ${HowItWorks()}
    ${CodeShowcase()}
    ${Ecosystem()}
    ${DxEcosystem()}
    ${ElurKit()}
    ${ElurQuery()}
    ${ElurI18n()}
    ${ElurAuth()}
    ${InspiredDeep()}
    ${ElurIonic()}
    ${IronBikers()}
    ${Showcases()}

    <!-- Featured examples -->
    <section class="section">
      <div class="section-heading">
        <h2>Featured examples</h2>
        <p>Interactive demos with live previews and source code.</p>
      </div>
      <div class="featured-grid">
        ${featured.map(
    (ex) => html`
            <a class="example-card" href=${`/examples/${ex.slug}/`}>
              <div class="example-card-preview">
                ${ex.previewCode
        ? island(
          "ExampleCardPreview",
          ExampleCardPreview,
          { code: Buffer.from(ex.previewCode, "utf8").toString("base64") },
          "visible",
          { ssr: false },
        )
        : html`<div class="example-card-preview-fallback">Live preview</div>`}
              </div>
              <div class="example-card-body">
                <div class="example-card-title">${ex.title}</div>
                <div class="example-card-desc">${ex.description}</div>
                <div class="example-card-tags">
                  <span class=${() => `example-tag cat-${ex.category}`}>${ex.category}</span>
                  ${ex.difficulty
        ? html`<span class="example-tag">${ex.difficulty}</span>`
        : null}
                </div>
              </div>
            </a>
          `,
  )}
      </div>
      <div style="text-align:center;margin-top:var(--space-10)">
        <a class="btn btn-ghost" href="/examples/">Browse all 12 examples →</a>
      </div>
    </section>

    ${Faq()}
    ${Cta()}
    ${Contribute()}

    ${island("ScrollReveal", ScrollReveal, {}, "load")}
  `;
}
