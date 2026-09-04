import { html } from "@elurjs/core";
import type { LayoutProps } from "@elurjs/kit";
import type { TutorialSection } from "../lib/tutorial-nav";

export interface TutorialLayoutData {
  tutorialNav: TutorialSection[];
  currentSlug: string;
}

export default function TutorialLayout({ children, data }: LayoutProps<TutorialLayoutData>) {
  const d = data as TutorialLayoutData | undefined;
  const nav = d?.tutorialNav ?? [];
  const currentSlug = d?.currentSlug ?? "";

  return html`
    <div class="tutorial-shell">
      <aside class="lesson-rail" id="lesson-rail">
        <div class="side-group-title">Tutorial</div>
        ${nav.map(
          (section) => html`
            <div class="lesson-rail-group-label">${section.title}</div>
            ${section.items.map(
              (item, i) => html`
                <a
                  class=${item.slug === currentSlug ? "lesson-rail-link active" : "lesson-rail-link"}
                  href=${`/tutorial/${item.slug}/`}
                >
                  <span class="lesson-rail-num">${String(i + 1).padStart(2, "0")}</span>
                  <span>${item.title}</span>
                </a>
              `,
            )}
          `,
        )}
      </aside>

      ${children}
    </div>
  `;
}
