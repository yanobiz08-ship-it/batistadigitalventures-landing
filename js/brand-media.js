/* Batista Digital Ventures - Logo, banner, espanol natural y productos en boton desplegable */
(function () {
  const copy = {
    es: {
      eyebrow: "PLATAFORMAS DIGITALES Y APPS MÓVILES",
      h1: "Creamos y escalamos plataformas digitales y apps móviles con visión clara.",
      lead: "Batista Digital Ventures diseña, lanza y hace crecer software desde cero hasta producción—uniendo estrategia de negocio, desarrollo móvil, infraestructura en la nube y ejecución enfocada en resultados.",
      ctaPrimary: "Ver Proyectos Activos",
      ctaSecondary: "Ver Qué Hacemos",
      navCta: "Hablemos",
      kicker: "IDENTIDAD OFICIAL · BATISTA DIGITAL VENTURES",
      caption: "Plataformas digitales, aplicaciones móviles y sistemas listos para crecer",
      altBanner: "Banner oficial de Batista Digital Ventures con emblema hexagonal dorado y nombre de marca",
      altLogo: "Logotipo hexagonal dorado de Batista Digital Ventures",
      toggleOpen: "Ver productos en desarrollo y lanzados (TRIVLO · MERQOX · GY Roadside)",
      toggleClose: "Ocultar productos en desarrollo y lanzados",
      trPill: "EN DESARROLLO · PRÓXIMO A LANZAMIENTO",
      trTitle: "TRIVLO",
      trDesc: "Compañero de viaje con asistente conversacional NARA, mapas sin conexión, itinerarios inteligentes y preparación para tiendas móviles.",
      trT1: "Asistente NARA",
      trT2: "Mapas Offline",
      trT3: "Próximo Lanzamiento",
      trBtn: "Abrir trivlopro.com ↗",
      mqPill: "EN DESARROLLO · PRÓXIMO A LANZAMIENTO",
      mqTitle: "MERQOX",
      mqDesc: "Aplicación móvil de comercio local y ofertas de proximidad con panel para comercios, radar cercano, códigos QR en mostrador y pedidos para recoger.",
      mqT1: "App Móvil",
      mqT2: "Panel Comercio",
      mqT3: "Próximo Lanzamiento",
      mqBtn: "Abrir merqox.com ↗",
      gyPill: "YA LIVE · REVISIÓN PREVIA",
      gyTitle: "GY Roadside Solutions",
      gyDesc: "Sitio ya live con rediseño visual, panel de administración, conexión a Google y seguimiento de llamadas, membresías de 12 meses en vista previa y avisos legales bilingües para Texas.",
      gyT1: "Ya Live",
      gyT2: "Panel Admin",
      gyT3: "Google y Llamadas",
      gyT4: "Membresías (Vista Previa)",
      gyBtn: "Revisar gyroadsidesolutions.com/en ↗"
    },
    en: {
      eyebrow: "B2B & CONSUMER VENTURE ARCHITECTURE",
      h1: "We build and scale digital platforms and mobile apps with conviction.",
      lead: "Batista Digital Ventures designs, builds, and scales software from concept to production—combining disciplined business economics, modern mobile engineering, cloud infrastructure, and market execution.",
      ctaPrimary: "View Active Ventures",
      ctaSecondary: "Explore Full Scope",
      navCta: "Partner With Us",
      kicker: "OFFICIAL IDENTITY · BATISTA DIGITAL VENTURES",
      caption: "Digital platforms, mobile applications & growth systems",
      altBanner: "Official Batista Digital Ventures banner featuring gold hexagonal emblem and wordmark",
      altLogo: "Gold hexagonal logo of Batista Digital Ventures",
      toggleOpen: "View upcoming & live products (TRIVLO · MERQOX · GY Roadside)",
      toggleClose: "Hide upcoming & live products",
      trPill: "IN DEVELOPMENT · LAUNCHING SOON",
      trTitle: "TRIVLO",
      trDesc: "Travel companion featuring conversational assistant NARA, offline maps, tailored itineraries, and mobile store rollout.",
      trT1: "NARA Assistant",
      trT2: "Offline Maps",
      trT3: "Launching Soon",
      trBtn: "Open trivlopro.com ↗",
      mqPill: "IN DEVELOPMENT · LAUNCHING SOON",
      mqTitle: "MERQOX",
      mqDesc: "Hyperlocal marketplace mobile app with merchant dashboard, nearby radar, counter QR codes, and pickup workflows.",
      mqT1: "Mobile App",
      mqT2: "Merchant Portal",
      mqT3: "Launching Soon",
      mqBtn: "Open merqox.com ↗",
      gyPill: "ALREADY LIVE · PREVIEW REVIEW",
      gyTitle: "GY Roadside Solutions",
      gyDesc: "Live site with design updates, admin panel, Google search & call tracking setup, 12-month membership concepts in preview mode, and bilingual Texas privacy & legal disclosures.",
      gyT1: "Already Live",
      gyT2: "Admin Panel",
      gyT3: "Google & Call Tracking",
      gyT4: "Memberships (Preview)",
      gyBtn: "Review gyroadsidesolutions.com/en ↗"
    }
  };

  let isPanelOpen = false;

  function getLang() {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    return lang.startsWith("en") ? "en" : "es";
  }

  function applyLogo(lang) {
    const iconWrap = document.querySelector(".brand-icon-wrap");
    if (!iconWrap) return;

    let img = iconWrap.querySelector("img.bdv-header-logo-img");
    if (!img) {
      img = document.createElement("img");
      img.className = "bdv-header-logo-img";
      img.src = "./assets/BDV Logo.png";
      iconWrap.innerHTML = "";
      iconWrap.appendChild(img);
    }
    img.alt = copy[lang].altLogo;
  }

  function applyBanner(lang) {
    if (document.getElementById("bdv-brand-banner-section")) return;
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

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
            src="./assets/BDV Logo Banner.jpg"
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

  function applyProductsDrawer(lang) {
    if (document.getElementById("bdv-products-drawer")) return;
    const venturesSection = document.getElementById("ventures");
    if (!venturesSection) return;

    const container = venturesSection.querySelector(".container") || venturesSection;
    
    // Oculta y remueve la cuadrícula estática previa si existe
    const oldGrid = container.querySelector(":scope > .ventures-grid");
    if (oldGrid) {
      oldGrid.style.display = "none";
    }

    const t = copy[lang];
    const wrap = document.createElement("div");
    wrap.id = "bdv-products-drawer";
    wrap.className = "bdv-products-drawer-wrap";
    wrap.innerHTML = `
      <button type="button" id="bdv-products-toggle-btn" class="bdv-products-toggle-btn" aria-expanded="false" aria-controls="bdv-products-panel">
        <span data-bdv-toggle-label>${t.toggleOpen}</span>
        <span id="bdv-products-arrow" aria-hidden="true" style="font-size: 1.2rem; font-weight: bold;">+</span>
      </button>
      <div id="bdv-products-panel" class="bdv-products-panel">
        <div class="ventures-grid">
          <article class="venture-card">
            <div>
              <div class="venture-top">
                <span class="venture-pill" data-tr-pill>${t.trPill}</span>
                <span class="venture-domain">trivlopro.com</span>
              </div>
              <h3 data-tr-title>${t.trTitle}</h3>
              <p data-tr-desc>${t.trDesc}</p>
              <div class="spec-tags">
                <span class="spec-tag" data-tr-t1>${t.trT1}</span>
                <span class="spec-tag" data-tr-t2>${t.trT2}</span>
                <span class="spec-tag" data-tr-t3>${t.trT3}</span>
              </div>
            </div>
            <div>
              <a class="btn btn-secondary" href="https://trivlopro.com" target="_blank" rel="noopener noreferrer" data-tr-btn>${t.trBtn}</a>
            </div>
          </article>

          <article class="venture-card">
            <div>
              <div class="venture-top">
                <span class="venture-pill" data-mq-pill>${t.mqPill}</span>
                <span class="venture-domain">merqox.com</span>
              </div>
              <h3 data-mq-title>${t.mqTitle}</h3>
              <p data-mq-desc>${t.mqDesc}</p>
              <div class="spec-tags">
                <span class="spec-tag" data-mq-t1>${t.mqT1}</span>
                <span class="spec-tag" data-mq-t2>${t.mqT2}</span>
                <span class="spec-tag" data-mq-t3>${t.mqT3}</span>
              </div>
            </div>
            <div>
              <a class="btn btn-secondary" href="https://merqox.com" target="_blank" rel="noopener noreferrer" data-mq-btn>${t.mqBtn}</a>
            </div>
          </article>

          <article id="bdv-gy-roadside-card" class="venture-card">
            <div>
              <div class="venture-top">
                <span class="venture-pill" data-gy-pill>${t.gyPill}</span>
                <span class="venture-domain">gyroadsidesolutions.com/en/</span>
              </div>
              <h3 data-gy-title>${t.gyTitle}</h3>
              <p data-gy-desc>${t.gyDesc}</p>
              <div class="spec-tags">
                <span class="spec-tag" data-gy-t1>${t.gyT1}</span>
                <span class="spec-tag" data-gy-t2>${t.gyT2}</span>
                <span class="spec-tag" data-gy-t3>${t.gyT3}</span>
                <span class="spec-tag" data-gy-t4>${t.gyT4}</span>
              </div>
            </div>
            <div>
              <a class="btn btn-secondary" href="https://gyroadsidesolutions.com/en/" target="_blank" rel="noopener noreferrer" data-gy-btn>${t.gyBtn}</a>
            </div>
          </article>
        </div>
      </div>
    `;

    container.appendChild(wrap);

    const btn = document.getElementById("bdv-products-toggle-btn");
    const panel = document.getElementById("bdv-products-panel");
    const arrow = document.getElementById("bdv-products-arrow");

    if (btn && panel && arrow) {
      btn.addEventListener("click", () => {
        isPanelOpen = !isPanelOpen;
        if (isPanelOpen) {
          panel.classList.add("is-open");
          arrow.textContent = "−";
        } else {
          panel.classList.remove("is-open");
          arrow.textContent = "+";
        }
        btn.setAttribute("aria-expanded", String(isPanelOpen));
        syncAll();
      });
    }
  }

  function syncAll() {
    const lang = getLang();
    const t = copy[lang];

    applyLogo(lang);
    applyBanner(lang);
    applyProductsDrawer(lang);

    const eyebrow = document.querySelector(".eyebrow");
    if (eyebrow) eyebrow.textContent = t.eyebrow;

    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = t.h1;

    const heroLead = document.querySelector(".hero-lead");
    if (heroLead) heroLead.textContent = t.lead;

    const navBtn = document.querySelector("header .btn-primary");
    if (navBtn) navBtn.textContent = t.navCta;

    const ctaButtons = document.querySelectorAll(".hero-cta a, .hero-cta button");
    if (ctaButtons[0]) ctaButtons[0].textContent = t.ctaPrimary;
    if (ctaButtons[1]) ctaButtons[1].textContent = t.ctaSecondary;

    const kicker = document.querySelector("[data-bdv-kicker]");
    const caption = document.querySelector("[data-bdv-caption]");
    const banner = document.querySelector("[data-bdv-banner]");
    if (kicker) kicker.textContent = t.kicker;
    if (caption) caption.textContent = t.caption;
    if (banner) banner.alt = t.altBanner;

    const toggleLabel = document.querySelector("[data-bdv-toggle-label]");
    if (toggleLabel) {
      toggleLabel.textContent = isPanelOpen ? t.toggleClose : t.toggleOpen;
    }

    const pairs = [
      ["[data-tr-pill]", t.trPill],
      ["[data-tr-title]", t.trTitle],
      ["[data-tr-desc]", t.trDesc],
      ["[data-tr-t1]", t.trT1],
      ["[data-tr-t2]", t.trT2],
      ["[data-tr-t3]", t.trT3],
      ["[data-tr-btn]", t.trBtn],
      ["[data-mq-pill]", t.mqPill],
      ["[data-mq-title]", t.mqTitle],
      ["[data-mq-desc]", t.mqDesc],
      ["[data-mq-t1]", t.mqT1],
      ["[data-mq-t2]", t.mqT2],
      ["[data-mq-t3]", t.mqT3],
      ["[data-mq-btn]", t.mqBtn],
      ["[data-gy-pill]", t.gyPill],
      ["[data-gy-title]", t.gyTitle],
      ["[data-gy-desc]", t.gyDesc],
      ["[data-gy-t1]", t.gyT1],
      ["[data-gy-t2]", t.gyT2],
      ["[data-gy-t3]", t.gyT3],
      ["[data-gy-t4]", t.gyT4],
      ["[data-gy-btn]", t.gyBtn]
    ];

    pairs.forEach(([sel, val]) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    });
  }

  function init() {
    syncAll();
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(syncAll, 20);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
