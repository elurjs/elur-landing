import { html, signal } from "@elurjs/core";
import CodeEditor from "./CodeEditor.ts";
import LivePreview from "./LivePreview.ts";

export interface TutorialPlaygroundProps {
  starterCode: string;
  solutionCode: string;
}

function TutorialPlayground({ starterCode, solutionCode }: TutorialPlaygroundProps) {
  const current = signal(starterCode);

  return html`
    <div class="playground-head">
      <h3>Playground</h3>
      <div class="playground-tools">
        <button class="btn btn-ghost btn-sm" @click=${() => (current.value = starterCode)}>
          Reset
        </button>
        <button class="btn btn-primary btn-sm" @click=${() => (current.value = solutionCode)}>
          Solution
        </button>
      </div>
    </div>
    <div class="playground-body">
      <div class="editor-pane">
        <div class="editor-label">Editor</div>
        ${CodeEditor({ code: current })}
      </div>
      <div class="preview-pane">
        <div class="editor-label">Preview</div>
        ${LivePreview({ code: current })}
      </div>
    </div>
  `;
}

export default TutorialPlayground;
