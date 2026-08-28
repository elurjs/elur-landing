import { raw } from "@elurjs/kit/content";
import type { ElurTemplate } from "@elurjs/core";

export function DxEcosystem(): ElurTemplate {
  return raw(`
<section class="section" id="dx-ecosystem">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <div class="section-label">🛠️ Developer Tools</div>
        <h2 class="section-title">Everything you need<br><span class="gradient-text">to build, test, and ship.</span></h2>
        <p class="section-desc">First-party tooling that fits the framework — a build-time compiler, editor extensions with LSP,
          a test harness, a Vite plugin, and two CLIs for scaffolding and code generation.</p>
      </div>
      <div class="dx-ecosystem-grid">
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">🧪</span>
            <h3>Elur Testing</h3>
            <span class="badge-new" style="margin-left:auto">New</span>
          </div>
          <p>Render components, interact with signals, and assert against the real DOM with helpers designed for Elur.
            No synthetic wrappers required.</p>
          <code><span style="color:var(--accent-light)">const</span> { getByText } = <span
              style="color:var(--blue)">render</span>(<span style="color:var(--blue)">Counter</span>());

            <span style="color:var(--blue)">expect</span>(<span style="color:var(--blue)">getByText</span>(<span
              style="color:var(--green)">"0"</span>)).<span style="color:var(--blue)">toBeTruthy</span>();
            count.value++;
            <span style="color:var(--blue)">await</span> <span style="color:var(--blue)">waitFor</span>(() =>
            <span style="color:var(--blue)">expect</span>(<span style="color:var(--blue)">getByText</span>(<span
              style="color:var(--green)">"1"</span>)).<span style="color:var(--blue)">toBeTruthy</span>()
            );</code>
          <a href="https://www.npmjs.com/package/@elurjs/core-testing" class="feature-card-link" target="_blank"
            rel="noopener">Read docs →</a>
        </div>
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">⚡</span>
            <h3>Vite Plugin for Elur</h3>
            <span class="badge-new" style="margin-left:auto">New</span>
          </div>
          <p>Drop the plugin into your Vite config and get optimized Elur handling, better HMR, and template-aware
            transforms out of the box. Includes the optional build-time compiler for up to -44% faster renders.</p>
          <code><span style="color:var(--accent-light)">import</span> elur <span
              style="color:var(--accent-light)">from</span> <span
              style="color:var(--green)">"@elurjs/vite-plugin-elur"</span>;

            <span style="color:var(--accent-light)">export default</span> <span
              style="color:var(--blue)">defineConfig</span>({
            plugins: [<span style="color:var(--blue)">elur</span>()],
            });</code>
          <a href="https://www.npmjs.com/package/@elurjs/vite-plugin-elur" class="feature-card-link" target="_blank"
            rel="noopener">Read docs →</a>
        </div>
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">🔧</span>
            <h3>Build-Time Compiler</h3>
            <span class="badge-new" style="margin-left:auto">Optional</span>
          </div>
          <p>Optional compile-time compiler that parses <code>html\`\`</code> templates and generates direct DOM
            manipulation code. Eliminates runtime TreeWalker and detectContext overhead. -28% average (-44% peak) faster renders, matches Solid on 6/9 CPU benchmarks.</p>
          <code><span style="color:var(--accent-light)">import</span> { compileTemplate } <span
              style="color:var(--accent-light)">from</span> <span
              style="color:var(--green)">"@elurjs/core-compiler"</span>;

            <span style="color:var(--cmt)">// Used internally by the Vite plugin</span>
            <span style="color:var(--cmt)">// — no manual setup needed</span></code>
          <a href="https://www.npmjs.com/package/@elurjs/core-compiler" class="feature-card-link" target="_blank"
            rel="noopener">Read docs →</a>
        </div>
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">🎨</span>
            <h3>VS Code Extension</h3>
            <span class="badge-new" style="margin-left:auto">New</span>
          </div>
          <p>Syntax highlighting for <code>html\`\`</code> templates and <code>raw()</code>, event binding autocomplete,
            diagnostics, quick fixes, formatting, and snippets. Powered by a language server that also works in Neovim, Helix, Zed, and Emacs.</p>
          <code><span style="color:var(--cmt)"># Install from the VS Code Marketplace</span>
            <span style="color:var(--green)">$</span> code --install-extension elurjs.vscode-elur

            <span style="color:var(--cmt)"># Or search "Elur" in the Extensions panel</span></code>
          <a href="https://marketplace.visualstudio.com/items?itemName=elurjs.vscode-elur" class="feature-card-link" target="_blank"
            rel="noopener">Install →</a>
        </div>
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">�</span>
            <h3>Prettier Plugin</h3>
          </div>
          <p>Format <code>html\`\`</code> tagged template literals with Prettier. Indentation, attribute wrapping, and
            expression alignment that match the framework's style conventions.</p>
          <code><span style="color:var(--green)">$</span> npm install -D prettier-plugin-elur

            <span style="color:var(--cmt)">// .prettierrc</span>
            { <span style="color:var(--green)">"plugins"</span>: [<span style="color:var(--green)">"prettier-plugin-elur"</span>] }</code>
          <a href="https://www.npmjs.com/package/prettier-plugin-elur" class="feature-card-link" target="_blank"
            rel="noopener">Read docs →</a>
        </div>
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">💬</span>
            <h3>Language Server</h3>
          </div>
          <p>The same LSP that powers the VS Code extension works in any editor with LSP support. Diagnostics,
            completion, hover, code actions, and formatting — all editor-agnostic.</p>
          <code><span style="color:var(--cmt)"># Neovim</span>
            :MasonInstall elur-language-server

            <span style="color:var(--cmt)"># Helix / Zed / Emacs</span>
            <span style="color:var(--cmt)"># configure via LSP settings</span></code>
          <a href="https://www.npmjs.com/package/@elurjs/core-language-server" class="feature-card-link" target="_blank"
            rel="noopener">Read docs →</a>
        </div>
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">�🚀</span>
            <h3>create-elur-app CLI</h3>
            <span class="badge-new" style="margin-left:auto">New</span>
          </div>
          <p>Scaffold a Elur project in seconds. Vanilla JS, TypeScript, or Ionic mobile templates with Vite, tests,
            and
            HMR pre-configured.</p>
          <code><span style="color:var(--accent-light)">npx</span> <span style="color:var(--blue)">create-elur-app</span>
            <span style="color:var(--blue)">my-app</span>

            <span style="color:var(--accent-light)">cd</span> <span style="color:var(--blue)">my-app</span>
            <span style="color:var(--accent-light)">npm run</span> <span style="color:var(--blue)">dev</span></code>
          <a href="https://www.npmjs.com/package/create-elur-app" class="feature-card-link" target="_blank"
            rel="noopener">Read docs →</a>
        </div>
        <div class="feature-card animate-on-scroll">
          <div class="feature-card-header">
            <span class="feature-card-icon">⌨️</span>
            <h3>Elur CLI</h3>
            <span class="badge-new" style="margin-left:auto">New</span>
          </div>
          <p>Generate components, pages, stores, and services inside an existing project. Auto-detects Elur or
            Elur Ionic and picks the right template.</p>
          <code><span style="color:var(--accent-light)">npx</span> <span style="color:var(--blue)">elur</span> <span
              style="color:var(--blue)">add component Button</span>

            <span style="color:var(--accent-light)">npx</span> <span style="color:var(--blue)">elur</span> <span
              style="color:var(--blue)">dev</span>

            <span style="color:var(--accent-light)">npx</span> <span style="color:var(--blue)">elur</span> <span
              style="color:var(--blue)">build</span></code>
          <a href="https://www.npmjs.com/package/@elurjs/elur-cli" class="feature-card-link" target="_blank"
            rel="noopener">Read docs →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Elur Kit Section -->
  `);
}
