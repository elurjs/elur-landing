import { html, signal } from "@elurjs/core";

const COMMAND = "npm create elur-app@latest";

function CopyInstall() {
  const tooltip = signal(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = COMMAND;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    tooltip.value = true;
    setTimeout(() => (tooltip.value = false), 1500);
  };

  return html`
        <div class="home-install-cmd" title="Click to copy" @click=${copy}>
            <span><span class="dollar">$</span> npm create <span class="pkg">elur-app@latest</span></span>
            <span class="home-copy-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
            </span>
        </div>
        ${() =>
      tooltip.value
        ? html`<div class="home-tooltip show">Copied!</div>`
        : null}
    `;
}

export default CopyInstall;
