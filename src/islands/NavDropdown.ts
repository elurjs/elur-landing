import { html, signal } from "@elurjs/core";

interface NavDropdownProps {
  label: string;
  sections: Array<{
    title: string;
    items: Array<{ title: string; href: string; desc?: string }>;
  }>;
}

function NavDropdown(props: NavDropdownProps) {
  const open = signal(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const onEnter = () => {
    if (timer) { clearTimeout(timer); timer = null; }
    open.value = true;
  };

  const onLeave = () => {
    timer = setTimeout(() => { open.value = false; }, 150);
  };

  return html`
    <div
      class=${() => `nav-item${open.value ? " open" : ""}`}
      @mouseenter=${() => onEnter()}
      @mouseleave=${() => onLeave()}
    >
      <button
        class=${() => `nav-link${open.value ? " active" : ""}`}
        @click=${() => { open.value = !open.value; }}
      >
        ${props.label}
        <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      ${() =>
        open.value
          ? html`
            <div class="nav-dropdown">
              ${props.sections.map(
                (section) => html`
                  <div class="nav-dropdown-section">${section.title}</div>
                  ${section.items.map(
                    (item) => html`
                      <a class="nav-dropdown-link" href=${item.href}>
                        <span class="nav-dropdown-link-title">${item.title}</span>
                        ${item.desc
                          ? html`<span class="nav-dropdown-link-desc">${item.desc}</span>`
                          : null}
                      </a>
                    `,
                  )}
                `,
              )}
            </div>
          `
          : null}
    </div>
  `;
}

export default NavDropdown;
