import { html } from "@elurjs/core";
import { raw } from "@elurjs/kit/content";
import { island } from "@elurjs/kit";
import type {
  PageProps,
  PageMetadata,
  GenerateStaticParams,
} from "@elurjs/kit";
import { getCollection } from "@elurjs/kit/content";
import type { TutorialData } from "../../lib/tutorial-nav.ts";
import TutorialPlayground from "../../../islands/TutorialPlayground.ts";
import type { load } from "./page.data.ts";

interface LessonPageData {
  lessonHtml: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
  currentSlug: string;
  currentTitle: string;
  currentSection: string;
  currentDesc: string;
  notFound: boolean;
}

const SITE_URL = "https://www.elur.dev";

export const generateMetadata = (ctx: {
  data?: LessonPageData;
}): PageMetadata => {
  const d = ctx.data;
  if (!d || d.notFound) {
    return {
      title: "Not Found — Elur Tutorial",
      canonical: `${SITE_URL}/404`,
      robots: "noindex, follow",
    };
  }
  const url = `${SITE_URL}/tutorial/${d.currentSlug}/`;
  const title = `${d.currentTitle} — Elur Tutorial`;
  const description =
    d.currentDesc || `${d.currentSection} — Elur interactive tutorial`;
  return {
    title,
    description,
    canonical: url,
    openGraph: {
      type: "article",
      title,
      description,
      url,
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
  const entries = await getCollection<TutorialData>("tutorial");
  return entries.map((e) => ({ slug: e.slug.split("/") }));
};

export default function LessonPage({ data }: PageProps<typeof load>) {
  const d = data as LessonPageData | undefined;

  if (!d || d.notFound) {
    return html`
      <div class="tutorial-instructions">
        <div style="text-align:center;padding:80px var(--space-6)">
          <h1 style="font-size:var(--text-5xl);color:var(--c-text-3)">404</h1>
          <p style="color:var(--c-text-2);margin:var(--space-4) 0 var(--space-8)">
            This lesson doesn't exist yet.
          </p>
          <a class="btn btn-gradient" href="/tutorial/basics/01-welcome/">Start the tutorial →</a>
        </div>
      </div>
    `;
  }

  return html`
    <div class="tutorial-instructions">
      <div class="lesson-header">
        <div class="crumb">${d.currentSection}</div>
        <h1>${d.currentTitle}</h1>
      </div>

      <article class="prose">
        ${raw(d.lessonHtml || "")}
      </article>

      ${d.hint
      ? html`
          <details class="lesson-hint">
            <summary>Need a hint?</summary>
            <div class="lesson-hint-body">${d.hint}</div>
          </details>
        `
      : null}

      <nav class="page-nav">
        ${d.prev
      ? html`
            <a class="page-nav-item" href=${`/tutorial/${d.prev.slug}/`}>
              <span class="page-nav-label">← Previous</span>
              <span class="page-nav-title">${d.prev.title}</span>
            </a>
          `
      : html`<span></span>`}
        ${d.next
      ? html`
            <a class="page-nav-item next" href=${`/tutorial/${d.next.slug}/`}>
              <span class="page-nav-label">Next →</span>
              <span class="page-nav-title">${d.next.title}</span>
            </a>
          `
      : html`<span></span>`}
      </nav>
    </div>

    <div class="tutorial-playground">
      ${island(
        "TutorialPlayground",
        TutorialPlayground,
        { starterCode: d.starterCode, solutionCode: d.solutionCode },
        "only",
      )}
    </div>
  `;
}
