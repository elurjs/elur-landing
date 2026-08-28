/**
 * Wires scrolled state, mobile menu, and smooth-scroll anchor links onto the
 * static navbar markup. Renders nothing.
 */

import { html } from "@elurjs/core";

function Navbar() {
  if (typeof document === "undefined") return null;
  const navbar = document.getElementById("navbar");
  if (!navbar) return null;

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  const closeMenu = () => {
    navLinks?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  };
  menuBtn?.addEventListener("click", () => {
    const open = navLinks?.classList.toggle("open") ?? false;
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navLinks?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  // Smooth scroll for same-page anchors (offsets the fixed navbar).
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  return html``;
}

export default Navbar;
