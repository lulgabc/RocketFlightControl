export {};

const root = document.documentElement;
const THEME_KEY = "rfc-theme";

/* ---------- Theme ---------- */
const themeToggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const applyTheme = (theme: "light" | "dark") => {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable */
  }
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "切换到浅色主题" : "切换到深色主题",
  );
};

if (themeToggle) {
  applyTheme(root.dataset.theme === "light" ? "light" : "dark");
  themeToggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
}

/* ---------- Mobile navigation ---------- */
const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const nav = document.getElementById("site-nav");

const closeMenu = () => {
  nav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "打开导航菜单");
};

menuToggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
});

nav?.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

/* ---------- Header scroll state ---------- */
const header = document.querySelector<HTMLElement>("[data-header]");
const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

/* ---------- Reveal on scroll ---------- */
const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
const reduceMotion = root.classList.contains("reduce-motion");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  revealItems.forEach((item) => observer.observe(item));

  /* Fail-open: never leave content hidden if observation does not fire
     (printing, snapshots, very short viewports). */
  window.setTimeout(() => {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }, 3000);
}
