import { html, signal, effect, type Signal } from "@elurjs/core";

export interface CodeEditorProps {
  code: Signal<string>;
}

function CodeEditor({ code }: CodeEditorProps) {
  const lineCount = signal(0);
  let textarea: HTMLTextAreaElement | null = null;

  // NOTE: `<textarea>` is a raw-text (RCDATA) element, so a `${...}`
  // interpolation inside it would be parsed as literal text (the template
  // marker comment would show up verbatim). Sync the value imperatively
  // through a `ref` + effect instead.
  const taRef = {
    get el(): HTMLTextAreaElement | null {
      return textarea;
    },
    set el(node: HTMLTextAreaElement | null) {
      textarea = node;
      if (node) node.value = code.peek();
    },
  };

  effect(() => {
    const value = code.value;
    lineCount.value = value.split("\n").length;
    // Skip writes that originated from the textarea itself (avoids cursor
    // jumps while typing); only sync external changes (Reset / Solution).
    if (textarea && textarea.value !== value) textarea.value = value;
  });

  const handleKey = (e: KeyboardEvent) => {
    const ta = e.target as HTMLTextAreaElement;
    if (e.key === "Tab") {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      code.value = ta.value.slice(0, start) + "  " + ta.value.slice(end);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  const gutter = () => {
    const n = lineCount.value;
    let out = "";
    for (let i = 1; i <= n; i++) out += i + "\n";
    return out;
  };

  return html`
    <div class="editor-wrap">
      <div class="editor-gutter">${() => gutter()}</div>
      <textarea
        class="editor-input"
        aria-label="Code editor"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        ref=${taRef}
        @input=${(e: InputEvent) => (code.value = (e.target as HTMLTextAreaElement).value)}
        @keydown=${handleKey}
      ></textarea>
    </div>
  `;
}

export default CodeEditor;
