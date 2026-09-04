import { html } from "@elurjs/core";

function CodeCopy() {
  if (typeof document !== "undefined") {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains("code-snippet-copy")) return;

      const block = target.closest(".code-snippet");
      if (!block) return;
      const pre = block.querySelector("pre");
      if (!pre) return;

      const code = pre.textContent || "";
      navigator.clipboard?.writeText(code).catch(() => {});
      target.classList.add("copied");
      const orig = target.textContent;
      target.textContent = "✓ Copied";
      setTimeout(() => {
        target.classList.remove("copied");
        target.textContent = orig;
      }, 1600);
    });
  }

  return html`<!-- CodeCopy: event delegation only -->`;
}

export default CodeCopy;
