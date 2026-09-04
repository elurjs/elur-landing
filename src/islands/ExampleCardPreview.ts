import {
  html,
  signal,
  effect,
  computed,
  ref,
  repeat,
  raw,
} from "@elurjs/core";

export interface ExampleCardPreviewProps {
  /** Example source code, base64-encoded (survives the data-props round-trip). */
  code: string;
}

function decode(b64: string): string {
  try {
    return new TextDecoder().decode(
      Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
    );
  } catch {
    return "";
  }
}

/**
 * Mounts an example app directly into the card — no iframe, no CDN fetch.
 * The page already runs the Elur runtime, so card previews render instantly
 * and keep working across SPA navigations (unlike srcdoc iframes).
 *
 * Example sources are written as standalone scripts: they import Elur from
 * esm.sh and end with `.mount("#app")`. To run them in-page we strip the
 * import lines and intercept `.mount("#app")` so the template mounts into
 * the card container instead — the rest of the source runs untouched.
 */
function ExampleCardPreview({ code }: ExampleCardPreviewProps) {
  let handle: { unmount(): void } | null = null;
  let disposers: Array<() => void> = [];
  const failed = signal(false);

  // Scoped effect: collects disposers so top-level effects from the example
  // (e.g. the clock interval) are cleaned up when the card unmounts.
  const scopedEffect = (fn: () => unknown) => {
    const dispose = effect(fn);
    disposers.push(dispose);
    return dispose;
  };

  const containerRef = {
    get el(): HTMLDivElement | null {
      return null;
    },
    set el(node: HTMLDivElement | null) {
      if (!node) return;
      const source = decode(code).replace(/^import\s[^;]*?;?\s*$/gm, "");
      if (!source.trim()) {
        failed.value = true;
        return;
      }
      try {
        const captureHtml = (strings: TemplateStringsArray, ...vals: unknown[]) => {
          const tpl = html(strings, ...vals);
          const origMount = tpl.mount.bind(tpl);
          tpl.mount = (target: unknown) => {
            handle = origMount(target === "#app" ? node : (target as string));
            return handle;
          };
          return tpl;
        };
        const run = new Function(
          "html",
          "signal",
          "effect",
          "computed",
          "ref",
          "repeat",
          "raw",
          source,
        );
        run(captureHtml, signal, scopedEffect, computed, ref, repeat, raw);
      } catch (err) {
        failed.value = true;
        console.warn("[example-card-preview]", err);
      }
    },
  };

  // Dispose the mounted example and its top-level effects with the island.
  effect(() => {
    return () => {
      try {
        handle?.unmount();
      } catch {
        /* already detached */
      }
      handle = null;
      for (const d of disposers) {
        try {
          d();
        } catch {
          /* noop */
        }
      }
      disposers = [];
    };
  });

  return html`
    ${() =>
      failed.value
        ? html`<div class="example-card-preview-fallback">Preview unavailable</div>`
        : html`<div class="example-card-live" ref=${containerRef}></div>`}
  `;
}

export default ExampleCardPreview;
