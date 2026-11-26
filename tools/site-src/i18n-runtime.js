/* Batista Digital Ventures - ES / EN dictionary and language switcher.
 * Spanish is the default; the choice is remembered in localStorage ("bdv_lang").
 * Markup hooks:
 *   data-i18n="key"       -> textContent
 *   data-i18n-ph="key"    -> placeholder
 *   data-i18n-aria="key"  -> aria-label
 *   data-i18n-alt="key"   -> alt
 * Other scripts can listen to the "bdv:lang" event on document.
 * NOTE: index.html holds the Spanish text statically (for SEO / no-JS). If you edit a
 * Spanish string here, update the same text in index.html too.
 */
(function () {
  var translations = /*__DICT__*/;
  window.BDV_I18N = translations;

  function t(lang, key) {
    var d = translations[lang] || translations.es;
    return d[key] !== undefined ? d[key] : translations.es[key];
  }

  function applyLanguage(lang) {
    if (lang !== "en") lang = "es";
    var root = document.documentElement;
    root.lang = lang;
    root.setAttribute("data-lang", lang);
    document.title = t(lang, "pageTitle");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(lang, el.getAttribute("data-i18n"));
      if (v !== undefined && el.textContent !== v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = t(lang, el.getAttribute("data-i18n-ph"));
      if (v !== undefined) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = t(lang, el.getAttribute("data-i18n-aria"));
      if (v !== undefined) el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var v = t(lang, el.getAttribute("data-i18n-alt"));
      if (v !== undefined) el.setAttribute("alt", v);
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-set-lang") === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try {
      localStorage.setItem("bdv_lang", lang);
    } catch (_) {}
    document.dispatchEvent(new CustomEvent("bdv:lang", { detail: { lang: lang } }));
  }

  window.BDV_setLanguage = applyLanguage;
  window.BDV_t = function (key) {
    return t(document.documentElement.lang === "en" ? "en" : "es", key);
  };

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLanguage(btn.getAttribute("data-set-lang"));
    });
  });

  var saved = null;
  try {
    saved = localStorage.getItem("bdv_lang");
  } catch (_) {}
  applyLanguage(saved === "en" ? "en" : "es");

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
