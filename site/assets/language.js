(() => {
  const storageKey = "dhow.language";
  const languageNav = document.querySelector(".language-nav");
  const englishLink = languageNav.querySelector('a[hreflang="en"]');
  let changedLanguage = false;

  function preference() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "zh-CN" || value === "en" ? value : null;
    } catch {
      return null;
    }
  }

  languageNav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    changedLanguage = true;
    try {
      localStorage.setItem(storageKey, link.hreflang || document.documentElement.lang);
    } catch {
      // The link still works when storage is disabled.
    }
  });

  async function countryFromIp() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    try {
      const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });
      if (!response.ok) return null;
      const country = (await response.text()).match(/^loc=([A-Z]{2})\r?$/m)?.[1];
      return country && country !== "XX" ? country : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function selectLanguage() {
    const saved = preference();
    const country = saved ? null : await countryFromIp();
    if (changedLanguage) return;

    const browserLanguage = /^zh(?:-|$)/i.test(navigator.language) ? "zh-CN" : "en";
    const language = saved ?? (country ? (country === "CN" ? "zh-CN" : "en") : browserLanguage);
    if (language === "en") {
      const target = new URL(englishLink.href);
      target.search = location.search;
      target.hash = location.hash;
      location.replace(target.href);
    }
  }

  // A directory URL is automatic; explicit language and article links stay where they point.
  if (
    document.documentElement.hasAttribute("data-auto-language")
    && location.protocol === "https:"
    && location.pathname.endsWith("/")
  ) {
    void selectLanguage();
  }
})();
