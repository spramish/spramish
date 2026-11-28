const root = document.documentElement;
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#site-menu");
const themeButton = document.querySelector(".theme-toggle");
const year = document.querySelector("#current-year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

try {
  const savedTheme = localStorage.getItem("pramish-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  }
} catch {
  root.dataset.theme = "dark";
}

function updateThemeButton() {
  const isLight = root.dataset.theme === "light";
  themeButton?.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
  themeButton?.setAttribute("title", `Switch to ${isLight ? "dark" : "light"} theme`);
}

updateThemeButton();

themeButton?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  updateThemeButton();
  try {
    localStorage.setItem("pramish-theme", nextTheme);
  } catch {
    // The theme still works when browser storage is unavailable.
  }
});

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation menu");
  menu?.classList.remove("is-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  menu?.classList.toggle("is-open", !isOpen);
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const sections = document.querySelectorAll("main > section:not(.hero)");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });
}
