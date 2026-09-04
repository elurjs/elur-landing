---
title: Markdown Previewer
description: A live markdown editor with real-time HTML preview using marked.
category: advanced
order: 12
difficulty: advanced
featured: true
---

# Markdown Previewer

A live markdown editor that renders HTML in real-time as you type. The left
panel is a textarea for markdown input; the right panel shows the rendered
HTML. Demonstrates external library integration and reactive computed values
with side effects.

```elur
import { html, signal, computed, ref, raw } from "https://esm.sh/@elurjs/core@3.6.2";

const markdown = signal(`# Hello Elur

This is a **live markdown** previewer built with Elur signals.

## Features

- **Bold** and *italic* text
- [Links](https://elur.dev)
- \`Inline code\`

### Code block

\`\`\`
const count = signal(0);
\`\`\`

> Blockquotes work too!

1. Ordered lists
2. Are supported

- [x] Write markdown
- [ ] Ship to production
`);

const renderMarkdown = (md) => {
  let html = md
    .replace(/^### (.*$)/gm, '<h2>$1</h2>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^- \[x\] (.*$)/gm, '<li>✓ $1</li>')
    .replace(/^- \[ \] (.*$)/gm, '<li>☐ $1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  return '<p>' + html + '</p>';
};

const rendered = computed(() => renderMarkdown(markdown.value));

const wordCount = computed(() => {
  const text = markdown.value.trim();
  return text ? text.split(/\s+/).length : 0;
});

// NOTE: <textarea> is a raw-text element — a ${...} interpolation inside it
// renders the binding marker as literal text. Set its initial value
// imperatively via ref after mount instead.
const editorRef = ref();

const app = html`
  <div style="width:100%;max-width:400px">
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <span class="filter-chip active">Editor</span>
      <span class="filter-chip">Preview</span>
      <span style="margin-left:auto;font-size:0.75rem;color:#6a6a80;align-self:center">
        ${() => wordCount.value} words
      </span>
    </div>

    <div style="display:flex;gap:8px">
      <textarea
        ref=${editorRef}
        style="flex:1;min-height:200px;padding:12px;border:1px solid #2a2a3a;border-radius:8px;background:#16161f;color:#f0f0f5;font-family:monospace;font-size:0.8rem;resize:vertical"
        placeholder="Type markdown here..."
        @input=${(e) => markdown.value = e.target.value}
      ></textarea>

      <div
        class="md-preview"
        style="flex:1;min-height:200px;overflow-y:auto"
      >${() => raw(rendered.value)}</div>
    </div>
  </div>
`;

app.mount("#app");
editorRef.el.value = markdown.peek();
```
