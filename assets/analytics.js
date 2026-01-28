const ANALYTICS_ENDPOINT = "/.netlify/functions/analytics";
const ANALYTICS_DEBUG = document.documentElement.dataset.analyticsDebug === "true";

const buildContext = () => ({
  path: window.location.pathname,
  title: document.title,
  referrer: document.referrer || null,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  language: navigator.language || null
});

const sendPayload = (payload) => {
  if (ANALYTICS_DEBUG) {
    console.info("[analytics]", payload);
  }

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
    return;
  }

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
};

const trackEvent = (name, properties = {}) => {
  sendPayload({
    name,
    properties,
    ...buildContext(),
    ts: new Date().toISOString()
  });
};

const classifyLink = (link) => {
  const href = link.getAttribute("href") || "";
  if (!href || href.startsWith("#")) {
    return { type: null };
  }

  const isButton = link.classList.contains("button") || link.classList.contains("nav-cta");
  const isNav = Boolean(link.closest("nav"));
  const isFooter = Boolean(link.closest("footer"));

  const absoluteUrl = link.href || "";
  const isExternal = absoluteUrl && !absoluteUrl.includes(window.location.host);
  const isMail = absoluteUrl.startsWith("mailto:");
  const isTel = absoluteUrl.startsWith("tel:");

  let type = "link";
  if (isButton) type = "cta";
  if (isNav) type = "nav";
  if (isFooter) type = "footer";
  if (isExternal) type = "external";
  if (isMail) type = "email";
  if (isTel) type = "phone";

  return { type, href };
};

document.addEventListener("DOMContentLoaded", () => {
  trackEvent("page_view");

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) {
      return;
    }

    const { type, href } = classifyLink(link);
    if (!type) {
      return;
    }

    const label = (link.textContent || "").trim().slice(0, 120) || "(no text)";
    trackEvent("link_click", {
      type,
      href,
      label
    });
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const name = form.getAttribute("name") || form.getAttribute("id") || "form";
    trackEvent("form_submit", { form: name });
  });
});
