import { html, signal, computed, repeat } from "@elurjs/core";

interface Todo {
  id: number;
  text: string;
  done: ReturnType<typeof signal<boolean>>;
}

function TodoDemo() {
  const todos = signal<Todo[]>([
    { id: 1, text: "Learn Elur signals", done: signal(true) },
    { id: 2, text: "Build a reactive app", done: signal(false) },
    { id: 3, text: "Deploy to production", done: signal(false) },
  ]);
  const inputValue = signal("");
  let nextId = 4;

  const remaining = computed(
    () => todos.value.filter((t) => !t.done.value).length,
  );

  const addTodo = () => {
    const text = inputValue.value.trim();
    if (!text) return;
    todos.update((arr) => [...arr, { id: nextId++, text, done: signal(false) }]);
    inputValue.value = "";
  };

  const toggleTodo = (id: number) => {
    const item = todos.value.find((t) => t.id === id);
    if (item) item.done.value = !item.done.value;
  };

  const deleteTodo = (id: number) => {
    todos.update((arr) => arr.filter((t) => t.id !== id));
  };

  return html`
        <div class="playground-output">
            <div class="playground-output-label">Output</div>
        <div class="demo-todo-input-row">
            <input
                class="demo-todo-input"
                type="text"
                placeholder="Add a task..."
                maxlength="30"
                value=${() => inputValue.value}
                @input=${(e: Event) => {
      inputValue.value = (e.target as HTMLInputElement).value;
    }}
                @keydown=${(e: KeyboardEvent) => {
      if (e.key === "Enter") addTodo();
    }}
            />
            <button class="demo-btn demo-btn-primary" @click=${addTodo}>Add</button>
        </div>
        <ul class="demo-todo-list">
            ${() => repeat(
      todos.value,
      (t) => t.id,
      (t) => html`
                    <li class=${() => `demo-todo-item${t.done.value ? " done" : ""}`}>
                        <span>${t.text}</span>
                        <div class="demo-todo-item-actions">
                            <button class="demo-todo-btn demo-todo-btn-check" @click=${() => toggleTodo(t.id)}>
                                ${() => (t.done.value ? "↩" : "✓")}
                            </button>
                            <button class="demo-todo-btn demo-todo-btn-del" @click=${() => deleteTodo(t.id)}>✕</button>
                        </div>
                    </li>
                `,
    )}
        </ul>
        <div class="demo-todo-stats">
            <span class="signal-dot active"></span>
            <strong>${() => todos.value.length}</strong> tasks · <strong>${() => remaining.value}</strong> remaining
        </div>
        </div>
    `;
}

export default TodoDemo;
