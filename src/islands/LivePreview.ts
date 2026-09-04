import { html, effect, type Signal } from "@elurjs/core";

export interface LivePreviewProps {
  code: Signal<string>;
}

/**
 * Renders Elur template code inside a sandboxed iframe using the Elur CDN
 * (esm.sh).
 *
 * The iframe document loads ONCE. Code updates are pushed via postMessage and
 * re-executed in place: the previous mount is unmounted (disposing its effects
 * and bindings) and the new app mounts into the same root — no iframe reload,
 * no flicker, no CDN refetch. The sandboxed iframe is cross-origin, so all
 * communication goes through postMessage.
 */
function LivePreview({ code }: LivePreviewProps) {
  let frame: HTMLIFrameElement | null = null;

  const frameRef = {
    get el(): HTMLIFrameElement | null {
      return frame;
    },
    set el(node: HTMLIFrameElement | null) {
      frame = node;
      if (node) node.srcdoc = buildDoc(code.peek());
    },
  };

  effect(() => {
    const next = code.value;
    if (!frame) return;
    frame.contentWindow?.postMessage({ type: "elur:run", code: next }, "*");
  });

  return html`
    <iframe
      class="preview-frame"
      sandbox="allow-scripts"
      title="Live preview"
      ref=${frameRef}
    ></iframe>
  `;
}

function buildDoc(initialCode: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html,body{margin:0;padding:16px;font-family:Inter,-apple-system,system-ui,sans-serif;background:#fff;color:#111;font-size:15px;line-height:1.6}
  button{font:inherit;padding:6px 14px;border:1px solid #ccc;border-radius:6px;background:#f7f7f9;cursor:pointer}
  button:hover{background:#eee}
  input,select{font:inherit;padding:4px 8px;border:1px solid #ccc;border-radius:6px}
  ul{padding-left:20px}
  .done{text-decoration:line-through;color:#999}
  #err{display:none;white-space:pre-wrap;color:#c00;font-family:monospace;font-size:13px;margin:0 0 8px}
</style>
</head>
<body>
<pre id="err"></pre>
<div id="app"></div>
<script type="importmap">
{
  "imports": {
    "@elurjs/core": "https://esm.sh/@elurjs/core@3.6.2"
  }
}
<\/script>
<script>
  // Queue run requests that arrive before the module (and Elur) is ready.
  window.__elurQueue = [];
  window.__elurReady = false;
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "elur:run") return;
    if (window.__elurReady && window.__elurRun) window.__elurRun(e.data.code);
    else window.__elurQueue.push(e.data.code);
  });
<\/script>
<script type="module">
import { html, signal, effect, computed, ref, repeat } from "@elurjs/core";

const __root = document.getElementById("app");
const __err = document.getElementById("err");
let __handle = null;
let __disposers = [];

// Scoped effect: collects disposers so top-level effects from the previous
// run (e.g. intervals in the clock lesson) are cleaned up on re-run.
function __scopedEffect(fn) {
  const dispose = effect(fn);
  __disposers.push(dispose);
  return dispose;
}

function __cleanup() {
  try { __handle && __handle.unmount(); } catch (_) {}
  __handle = null;
  for (const d of __disposers) { try { d(); } catch (_) {} }
  __disposers = [];
  __root.innerHTML = "";
}

function __showError(err) {
  __err.style.display = "block";
  __err.textContent = String((err && err.message) || err);
}

window.__elurRun = function (userCode) {
  // Compile first: if the code has a syntax error, keep the previous UI.
  let App;
  try {
    const mod = { exports: {} };
    const fn = new Function(
      "html", "signal", "effect", "computed", "ref", "repeat", "module", "exports",
      userCode + "\\n; return typeof App!=='undefined'?App:(module.exports.default||module.exports);"
    );
    App = fn(html, signal, __scopedEffect, computed, ref, repeat, mod, mod.exports);
  } catch (err) {
    __showError(err);
    return;
  }

  __cleanup();
  __err.style.display = "none";
  __err.textContent = "";

  try {
    if (App) {
      const tpl = App();
      if (tpl && typeof tpl.mount === "function") {
        // ElurTemplate — mount() activates bindings and returns a handle.
        __handle = tpl.mount(__root);
      } else if (tpl && tpl.nodeType) {
        __root.appendChild(tpl);
      } else if (typeof tpl === "string") {
        __root.innerHTML = tpl;
      }
    }
  } catch (err) {
    __showError(err);
  }
};

// Initial render + flush any queued updates.
window.__elurReady = true;
window.__elurRun(${JSON.stringify(initialCode)});
const __queued = window.__elurQueue.splice(0);
if (__queued.length) window.__elurRun(__queued[__queued.length - 1]);
<\/script>
</body>
</html>`;
}

export default LivePreview;
