document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("main-nav");
  const body = document.body;
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  if (!burger || !nav) return;

  let lastFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;
    nav.classList.add("open");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    body.classList.add("no-scroll");
    trapFocus();
  }

  function closeMenu() {
    nav.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    body.classList.remove("no-scroll");
    releaseFocus();
    lastFocusedElement?.focus();
  }

  function toggleMenu() {
    nav.classList.contains("open") ? closeMenu() : openMenu();
  }

  /* --------------------
     Focus trap (WCAG AAA)
  --------------------- */
  function trapFocus() {
    const focusable = nav.querySelectorAll("a");
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    nav.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    first.focus();
  }

  function releaseFocus() {
    nav.removeEventListener("keydown", trapFocus);
  }

  /* --------------------
     Events
  --------------------- */
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  /* Auto-close when resizing to desktop */
  mediaQuery.addEventListener("change", (e) => {
    if (!e.matches) closeMenu();
  });
});
