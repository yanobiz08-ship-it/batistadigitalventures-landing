/* Batista Digital Ventures - Logo y Banner bilingues en archivo separado */
(function () {
  const copy = {
    es: {
      kicker: "IDENTIDAD OFICIAL · BATISTA DIGITAL VENTURES",
      caption: "Plataformas digitales, aplicaciones móviles y arquitectura de crecimiento",
      altBanner: "Banner oficial de Batista Digital Ventures con emblema hexagonal dorado y tipografía corporativa",
      altLogo: "Logotipo hexagonal dorado de Batista Digital Ventures"
    },
    en: {
      kicker: "OFFICIAL IDENTITY · BATISTA DIGITAL VENTURES",
      caption: "Digital platforms, mobile applications & growth architecture",
      altBanner: "Official Batista Digital Ventures banner featuring gold hexagonal emblem and wordmark",
      altLogo: "Gold hexagonal logo of Batista Digital Ventures"
    }
  };

  function getLang() {
    const lang = document.documentElement.getAttribute("lang") || document.documentElement.getAttribute("data-lang");
    return lang === "en" ? "en" : "es";
  }

  function applyLogo() {
    const iconWrap = document.querySelector(".brand-icon-wrap");
    if (!iconWrap) return;

    const lang = getLang();
    let img = iconWrap.querySelector("img.bdv-header-logo-img");
    if (!img) {
      img = document.createElement("img");
      img.className = "bdv-header-logo-img";
      img.src = "./BDV Logo.png";
      iconWrap.innerHTML = "";
      iconWrap.appendChild(img);
    }
    img.alt = copy[lang].altLogo;
  }

  function applyBanner() {
    if (document.getElementById("bdv-brand-banner-section")) return;
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    const lang = getLang();
    const t = copy[lang];

    const section = document.createElement("section");
    section.id = "bdv-brand-banner-section";
    section.className = "bdv-showcase-band";
    section.innerHTML = `
      <div class="container">
        <div class="bdv-banner-frame">
          <div class="bdv-banner-top">
            <span class="bdv-banner-kicker" data-bdv-kicker>${t.kicker}</span>
            <span class="bdv-banner-caption" data-bdv-caption>${t.caption}</span>
          </div>
          <img
            class="bdv-banner-img"
            src="./BDV Logo Banner.jpg"
            alt="${t.altBanner}"
            data-bdv-banner
            loading="lazy"
          />
        </div>
      </div>
    `;

    const firstBand = mainEl.querySelector("section.band");
    if (firstBand && firstBand.nextSibling) {
      mainEl.insertBefore(section, firstBand.nextSibling);
    } else {
      mainEl.appendChild(section);
    }
  }

  function syncLang() {
    const lang = getLang();
    const t = copy[lang];
    applyLogo();

    const kicker = document.querySelector("[data-bdv-kicker]");
    const caption = document.querySelector("[data-bdv-caption]");
    const banner = document.querySelector("[data-bdv-banner]");

    if (kicker) kicker.textContent = t.kicker;
    if (caption) caption.textContent = t.caption;
    if (banner) banner.alt = t.altBanner;
  }

  function init() {
    applyLogo();
    applyBanner();
    syncLang();

    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(syncLang, 0);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
