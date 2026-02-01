const THEME_STORAGE_KEY = "sti-theme";
const THEMES = ["pacific", "warm", "hybrid", "olive-subtle"];
const THEME_LABELS = {
  pacific: "Pacific Harmony",
  warm: "Warm Community Calm",
  hybrid: "Hybrid",
  "olive-subtle": "Olive",
};

const applyTheme = (theme, { persist } = { persist: true }) => {
  if (!THEMES.includes(theme)) {
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage errors.
    }
  }

  const label = document.querySelector("[data-theme-label]");
  if (label) {
    label.textContent = THEME_LABELS[theme] || theme;
  }

  const select = document.querySelector("[data-theme-select]");
  if (select) {
    select.value = theme;
  }
};

const currentTheme = document.documentElement.getAttribute("data-theme") || "olive-subtle";
applyTheme(currentTheme, { persist: false });

const themeSelect = document.querySelector("[data-theme-select]");
if (themeSelect) {
  themeSelect.addEventListener("change", (event) => {
    applyTheme(event.target.value, { persist: true });
  });
}
