---
title: Build a todo app
description: Put it all together with a complete todo list.
section: Advanced
order: 2
starterCode: "function App() {\n  const todos = signal([\n    { id: 1, text: \"Learn signals\", done: true },\n    { id: 2, text: \"Build a todo app\", done: false }\n  ]);\n  const text = signal(\"\");\n\n  const add = () => {\n    if (!text.value.trim()) return;\n    todos.value = [...todos.value, { id: Date.now(), text: text.value, done: false }];\n    text.value = \"\";\n  };\n\n  return html`\n    <h1>Todos</h1>\n    <p>Finish the app: list todos, toggle done, and delete.</p>\n  `;\n}\n"
solutionCode: "function App() {\n  const todos = signal([\n    { id: 1, text: \"Learn signals\", done: true },\n    { id: 2, text: \"Build a todo app\", done: false }\n  ]);\n  const text = signal(\"\");\n\n  const add = () => {\n    if (!text.value.trim()) return;\n    todos.value = [...todos.value, { id: Date.now(), text: text.value, done: false }];\n    text.value = \"\";\n  };\n\n  const toggle = (id) => {\n    todos.value = todos.value.map(t => t.id === id ? { ...t, done: !t.done } : t);\n  };\n\n  const remove = (id) => {\n    todos.value = todos.value.filter(t => t.id !== id);\n  };\n\n  return html`\n    <h1>Todos</h1>\n    <input value=${() => text.value} @input=${(e) => text.value = e.target.value} placeholder=\"What to do?\" />\n    <button @click=${add}>Add</button>\n    <ul>\n      ${() => repeat(todos.value, (t) => t.id, (t) => html`\n        <li>\n          <span class=${() => t.done ? \"done\" : \"\"} @click=${() => toggle(t.id)}>${t.text}</span>\n          <button @click=${() => remove(t.id)}>x</button>\n        </li>\n      `)}\n    </ul>\n    <p>${() => todos.value.filter(t => !t.done).length} left</p>\n  `;\n}\n"
hint: "Use ${() => repeat(todos.value, ...)} to list todos. Each item: a span (toggle done on click) and a delete button. Show a count of incomplete items at the bottom."
---

# Build a todo app

Time to combine everything: signals, events, lists, and conditional classes. You will build a working todo list.

## The features

- **Add** a todo from the input.
- **Toggle** a todo's done state by clicking its text.
- **Delete** a todo with a button.
- **Count** how many todos are incomplete.

## Hints

- Use `${() => repeat(todos.value, (t) => t.id, (t) => html\`...\`)}` for the list.
- Toggle: `todos.value = todos.value.map(t => t.id === id ? { ...t, done: !t.done } : t)`.
- Delete: `todos.value = todos.value.filter(t => t.id !== id)`.
- Strike-through done items with a `done` class (the preview CSS already styles `.done`).

## Your task

Complete the `App` function. The `add` helper is already written — wire up the input and add button, then implement toggle, delete, and the remaining count.

:::tip
This is the final lesson. If you got here, you understand signals, templates, events, lists, and effects — the core of Elur. Congratulations!
:::
