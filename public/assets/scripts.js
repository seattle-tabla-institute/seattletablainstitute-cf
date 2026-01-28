const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const applyCanonical = () => {
  const config = window.SITE_CONFIG;
  if (!config || !config.CANONICAL_ORIGIN) {
    return;
  }

  const origin = config.CANONICAL_ORIGIN.replace(/\/$/, "");
  const path = window.location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
  const canonicalUrl = `${origin}${path || "/"}`;

  document.querySelectorAll("[data-canonical]").forEach((node) => {
    node.setAttribute("href", canonicalUrl);
  });

  document.querySelectorAll("[data-og-url]").forEach((node) => {
    node.setAttribute("content", canonicalUrl);
  });
};

applyCanonical();
