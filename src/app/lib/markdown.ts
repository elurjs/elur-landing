import { marked } from "marked";
import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
} from "shiki";

let highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter;
  highlighter = await createHighlighter({
    themes: ["github-dark", "github-light"],
    langs: [
      "typescript",
      "javascript",
      "bash",
      "json",
      "html",
      "css",
      "yaml",
      "markdown",
      "diff",
    ],
  });
  return highlighter;
}

export interface TocItem {
  level: number;
  text: string;
  slug: string;
}

export interface RenderResult {
  html: string;
  toc: TocItem[];
}

const renderer = {
  code({ text, lang }: { text: string; lang?: string }): string {
    // "elur" is our docs' alias for Elur-flavored TypeScript — Shiki doesn't
    // know it, so map it to typescript for highlighting.
    const language = !lang || lang === "elur" ? "typescript" : lang;
    return `<!--CODE_BLOCK:${Buffer.from(text).toString("base64")}:${language}-->`;
  },
};

function transformCallouts(source: string): string {
  const calloutTypes: Record<string, { cls: string; label: string; icon: string }> = {
    note: { cls: "callout-info", label: "Note", icon: "ℹ" },
    tip: { cls: "callout-success", label: "Tip", icon: "💡" },
    warning: { cls: "callout-warning", label: "Warning", icon: "⚠" },
    danger: { cls: "callout-danger", label: "Danger", icon: "⛔" },
  };

  const lines = source.split("\n");
  const out: string[] = [];
  let type: string | null = null;
  let title = "";
  let body: string[] = [];

  const flush = () => {
    if (!type) return;
    const c = calloutTypes[type];
    if (!c) return;
    const bodyHtml = marked.parse(body.join("\n"), { async: false }) as string;
    out.push(`<div class="callout ${c.cls}"><div class="callout-title">${c.icon} ${title.trim() || c.label}</div>${bodyHtml}</div>`);
    type = null;
    title = "";
    body = [];
  };

  for (const line of lines) {
    const open = line.match(/^:::(note|tip|warning|danger)(?:\s+(.*))?$/);
    if (open) {
      flush();
      type = open[1] ?? null;
      title = open[2] ?? "";
      continue;
    }
    if (type !== null && line.trim() === ":::") {
      flush();
      continue;
    }
    if (type !== null) body.push(line);
    else out.push(line);
  }
  flush();

  return out.join("\n");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function transformHeadings(html: string, toc: TocItem[]): string {
  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h[23]>/g,
    (_match, levelStr: string, attrs: string, content: string) => {
      const level = parseInt(levelStr, 10);
      const text = content.replace(/<[^>]+>/g, "").trim();
      const slug = slugify(text);
      toc.push({ level, text, slug });
      return `<h${level} id="${slug}"${attrs}><a href="#${slug}" class="anchor-link">#</a> ${content}</h${level}>`;
    },
  );
}

// A few github-light token colors fail WCAG AA (4.5:1) on the light code
// background (#f6f8fa). Darken just those; dark theme colors are untouched.
const LIGHT_THEME_FIXES: Record<string, string> = {
  "#D73A49": "#CF3139", // keywords
  "#6A737D": "#626C76", // comments
  "#E36209": "#B84A00", // constants/numbers
  "#22863A": "#1F7A34", // strings in diffs / inserted
};

function fixLightThemeContrast(highlighted: string): string {
  return highlighted.replace(
    /--shiki-light:(#[0-9A-Fa-f]{6})/g,
    (m, hex: string) => LIGHT_THEME_FIXES[hex.toUpperCase()] ? `--shiki-light:${LIGHT_THEME_FIXES[hex.toUpperCase()]}` : m,
  );
}

async function transformCodeBlocks(html: string): Promise<string> {
  const hl = await getHighlighter();

  return html.replace(
    /<!--CODE_BLOCK:([A-Za-z0-9+/=]+):([a-zA-Z0-9]+)-->/g,
    (_match, b64: string, lang: string) => {
      const code = Buffer.from(b64, "base64").toString("utf8");
      try {
        const highlighted = hl.codeToHtml(code, {
          lang: lang as BundledLanguage,
          themes: {
            dark: "github-dark",
            light: "github-light",
          },
          defaultColor: "dark",
        });
        return fixLightThemeContrast(highlighted);
      } catch {
        const escaped = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<pre><code>${escaped}</code></pre>`;
      }
    },
  );
}

export async function highlightCode(
  code: string,
  lang: string = "typescript",
): Promise<string> {
  const hl = await getHighlighter();
  try {
    return fixLightThemeContrast(
      hl.codeToHtml(code, {
        lang: lang as BundledLanguage,
        themes: { dark: "github-dark", light: "github-light" },
        defaultColor: "dark",
      }),
    );
  } catch {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  }
}

export async function renderMarkdown(source: string): Promise<RenderResult> {
  const toc: TocItem[] = [];

  marked.use({
    breaks: false,
    gfm: true,
    renderer,
  });

  const withCallouts = transformCallouts(source);
  let html = marked.parse(withCallouts, { async: false }) as string;
  html = transformHeadings(html, toc);
  html = await transformCodeBlocks(html);

  return { html, toc };
}

/**
 * Extracts the first fenced code block from a markdown body.
 * Used to pull example source code out of the markdown body
 * (the YAML frontmatter parser does not support multi-line block scalars).
 */
export function extractCodeBlock(body: string): string {
  // The closing fence must be a line containing only ``` — a non-anchored
  // match would stop at inline backticks inside the code (e.g. a regex
  // literal containing ``` in the markdown-previewer example).
  const match = body.match(/^```(?:elur|typescript|javascript|html)?\s*\n([\s\S]*?)^```\s*$/m);
  return match ? match[1].trim() : "";
}
