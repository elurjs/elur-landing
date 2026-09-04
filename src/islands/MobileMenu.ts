import { html, signal } from "@elurjs/core";

interface MobileMenuProps {
  sections: Array<{
    title: string;
    items: Array<{ title: string; href: string }>;
  }>;
}

function MobileMenu(props: MobileMenuProps) {
  const open = signal(false);

  const toggle = () => {
    open.value = !open.value;
    document.body.classList.toggle("drawer-open", open.value);
  };

  const close = () => {
    open.value = false;
    document.body.classList.remove("drawer-open");
  };

  return html`
    <button
      class="nav-icon-btn nav-mobile-toggle"
      aria-label="Toggle menu"
      aria-expanded=${() => String(open.value)}
      @click=${() => toggle()}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    ${() =>
      open.value
        ? html`
          <div class="drawer-backdrop open" @click=${() => close()}></div>
          <div class="mobile-drawer open">
            ${props.sections.map(
              (section) => html`
                <div class="mobile-drawer-section">
                  <div class="mobile-drawer-title">${section.title}</div>
                  ${section.items.map(
                    (item) => html`
                      <a class="mobile-drawer-link" href=${item.href} @click=${() => close()}>
                        ${item.title}
                      </a>
                    `,
                  )}
                </div>
              `,
            )}
          </div>
        `
        : null}
  `;
}

export default MobileMenu;
