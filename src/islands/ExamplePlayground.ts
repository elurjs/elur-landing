import { html, raw, signal } from "@elurjs/core";

interface PlaygroundProps {
  code: string;
  codeHtml?: string;
  title: string;
}

function ExamplePlayground(props: PlaygroundProps) {
  const activeTab = signal("preview");
  const copied = signal(false);
  const iframeKey = signal(0);
  const loaded = signal(false);

  const code = props.code || "";
  const title = props.title || "Example";

  // codeHtml arrives base64-encoded (see page.data.ts) to survive the
  // data-props attribute round-trip with entity decoding intact.
  const decodeHtml = (b64: string): string => {
    try {
      return new TextDecoder().decode(
        Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
      );
    } catch {
      return "";
    }
  };
  const codeHtml = props.codeHtml ? decodeHtml(props.codeHtml) : "";

  // Build the iframe srcdoc — a self-contained HTML document that
  // loads Elur from esm.sh and mounts the example code.
  // NOTE: <script> is a raw-text element — entities are NOT decoded inside
  // it, so the code must NOT be HTML-escaped (that produced literal "&lt;"
  // and SyntaxErrors). The srcdoc attribute itself is escaped by the
  // serializer when the page HTML is emitted. We only neutralize closing
  // </script> sequences so the code cannot break out of the script tag.
  const buildSrcDoc = (exampleCode: string): string => {
    const safe = exampleCode.replace(/<\/script/gi, "<\\/script");
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a0f;color:#f0f0f5;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px}
  button{font:inherit;cursor:pointer;border:none;border-radius:8px;padding:8px 16px;font-weight:600}
  input,select{font:inherit;padding:6px 10px;border:1px solid #2a2a3a;border-radius:8px;background:#16161f;color:#f0f0f5}
  .counter-display{font-size:3rem;font-weight:700;font-family:'JetBrains Mono',monospace}
  .btn-primary{background:linear-gradient(135deg,#3432c8,#256fe1);color:#fff}
  .btn-ghost{background:#16161f;color:#f0f0f5;border:1px solid #2a2a3a}
  ul{list-style:none;width:100%;max-width:400px}
  li{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#16161f;border:1px solid #2a2a3a;border-radius:8px;margin-bottom:6px}
  .clock-time{font-size:2.5rem;font-family:'JetBrains Mono',monospace;font-weight:700}
  .swatch{width:120px;height:120px;border-radius:16px;border:2px solid #2a2a3a}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center}
  .modal{background:#16161f;border:1px solid #2a2a3a;border-radius:16px;padding:24px;max-width:400px}
  .star{font-size:1.8rem;cursor:pointer;color:#2a2a3a}
  .star.active{color:#fbbf24}
  .tab-bar{display:flex;gap:4px;border-bottom:1px solid #2a2a3a;width:100%;max-width:400px}
  .tab-btn{padding:8px 16px;border-bottom:2px solid transparent;color:#a0a0b5;font-weight:600;background:none}
  .tab-btn.active{color:#2bc7f0;border-bottom-color:#2bc7f0}
  .tab-panel{display:none;width:100%;max-width:400px;padding:16px;background:#16161f;border:1px solid #2a2a3a;border-radius:8px;min-height:100px}
  .tab-panel.active{display:block}
  .accordion-item{border:1px solid #2a2a3a;border-radius:8px;margin-bottom:6px;overflow:hidden;width:100%;max-width:400px}
  .accordion-header{padding:12px 16px;cursor:pointer;font-weight:600;display:flex;justify-content:space-between}
  .accordion-body{padding:12px 16px;color:#a0a0b5;display:none}
  .accordion-item.open .accordion-body{display:block}
  .md-preview{background:#16161f;border:1px solid #2a2a3a;border-radius:8px;padding:16px;width:100%;max-width:400px;min-height:100px}
  .md-preview h1{font-size:1.5rem;margin:8px 0}
  .md-preview h2{font-size:1.25rem;margin:8px 0}
  .md-preview ul{list-style:disc;padding-left:20px}
  .md-preview li{display:list-item;background:none;border:none;padding:2px 0}
  .md-preview code{background:#0d0d14;padding:2px 6px;border-radius:4px;font-family:monospace}
  .md-preview a{color:#2bc7f0}
  .search-input{width:100%;max-width:400px;margin-bottom:12px}
  .filter-chip{display:inline-block;padding:4px 10px;border-radius:9999px;background:#16161f;border:1px solid #2a2a3a;font-size:0.8rem;margin:2px}
  .filter-chip.active{background:linear-gradient(135deg,#3432c8,#256fe1);color:#fff;border-color:transparent}
  .temp-row{display:flex;gap:12px;align-items:center}
  label{font-weight:600;font-size:0.9rem}
</style>
</head>
<body>
<div id="app"></div>
<script type="module">
${safe}
</script>
</body>
</html>`;
  };

  const srcDoc = buildSrcDoc(code);

  const copyCode = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1600);
  };

  const reload = () => {
    loaded.value = false;
    iframeKey.value = iframeKey.value + 1;
  };

  return html`
    <div class="playground-toolbar">
      <div class="playground-tabs">
        <button
          class=${() => `playground-tab${activeTab.value === "preview" ? " active" : ""}`}
          @click=${() => { activeTab.value = "preview"; }}
        >
          Preview
        </button>
        <button
          class=${() => `playground-tab${activeTab.value === "code" ? " active" : ""}`}
          @click=${() => { activeTab.value = "code"; }}
        >
          Code
        </button>
      </div>
      <div class="playground-actions">
        <button
          class=${() => `playground-action-btn${copied.value ? " copied" : ""}`}
          @click=${() => copyCode()}
        >
          ${() => copied.value ? "✓ Copied" : "⧉ Copy"}
        </button>
        <button
          class="playground-action-btn"
          @click=${() => reload()}
        >
          ↻ Reload
        </button>
      </div>
    </div>

    ${() =>
      activeTab.value === "preview"
        ? html`
          <div class="playground-preview-wrap">
            <iframe
              class=${() => (loaded.value ? "loaded" : "")}
              srcdoc=${() => `${srcDoc}<!-- reload:${iframeKey.value} -->`}
              title=${title}
              sandbox="allow-scripts"
              @load=${() => { loaded.value = true; }}
            ></iframe>
          </div>
        `
        : html`
          <div class="playground-code-wrap">
            ${codeHtml
              ? raw(codeHtml)
              : html`<pre><code>${code}</code></pre>`}
          </div>
        `}
  `;
}

export default ExamplePlayground;
