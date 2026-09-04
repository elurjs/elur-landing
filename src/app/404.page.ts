import { html } from "@elurjs/core";
import type { PageMetadata } from "@elurjs/kit";

export const generateMetadata = (): PageMetadata => ({
  title: "404 — Elur",
  robots: "noindex, follow",
});

export default function NotFoundPage() {
  return html`
    <div style="text-align:center;padding:120px 20px;position:relative;z-index:1">
      <h1 style="font-size:5rem;font-weight:700;background:var(--grad-hero);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:16px">
        404
      </h1>
      <p style="color:var(--c-text-2);font-size:1.25rem;margin-bottom:32px">
        This page doesn't exist.
      </p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <a href="/" class="btn btn-gradient">Back home →</a>
        <a href="/examples/" class="btn btn-ghost">Browse examples</a>
      </div>
    </div>
  `;
}
