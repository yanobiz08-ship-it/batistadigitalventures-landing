/* Batista Digital Ventures - Tarjeta modular de GY Roadside Solutions en ES / EN */
(function () {
  const copy = {
    es: {
      pill: "PLATAFORMA COMERCIAL · REVISIÓN PREVIA",
      title: "GY Roadside Solutions",
      desc: "Llevada a producción (Live) con rediseño visual, panel de administración, conexión a Google y seguimiento de llamadas, estructura de membresías de 12 meses en vista previa y avisos legales bilingües para Texas.",
      t1: "Live & Rediseño",
      t2: "Panel Admin",
      t3: "Google & Llamadas",
      t4: "Membresías (Vista Previa)",
      btn: "Revisar gyroadsidesolutions.com/en ↗"
    },
    en: {
      pill: "COMMERCIAL PLATFORM · PREVIEW REVIEW",
      title: "GY Roadside Solutions",
      desc: "Taken live with design updates, admin panel, Google search & call tracking setup, 12-month membership concepts in preview mode, and bilingual Texas privacy & legal disclosures.",
      t1: "Live & Redesign",
      t2: "Admin Panel",
      t3: "Google & Call Tracking",
      t4: "Memberships (Preview)",
      btn: "Review gyroadsidesolutions.com/en ↗"
    }
  };

  function getLang() {
    const lang = document.documentElement.getAttribute("lang") || document.documentElement.getAttribute("data-lang");
    return lang === "en" ? "en" : "es";
  }

  function buildCard() {
    if (document.getElementById("bdv-gy-roadside-card")) return;

    const venturesGrid = document.querySelector("#ventures .ventures-grid");
    if (!venturesGrid) return;

    const lang = getLang();
    const t = copy[lang];

    const article = document.createElement("article");
    article.id = "bdv-gy-roadside-card";
    article.className = "venture-card";
    article.innerHTML = `
      <div>
        <div class="venture-top">
          <span class="venture-pill" data-gy-pill>${t.pill}</span>
          <span class="venture-domain">gyroadsidesolutions.com/en/</span>
        </div>
        <h3 data-gy-title>${t.title}</h3>
        <p data-gy-desc>${t.desc}</p>
        <div class="spec-tags">
          <span class="spec-tag" data-gy-t1>${t.t1}</span>
          <span class="spec-tag" data-gy-t2>${t.t2}</span>
          <span class="spec-tag" data-gy-t3>${t.t3}</span>
          <span class="spec-tag" data-gy-t4>${t.t4}</span>
        </div>
      </div>
      <div>
        <a class="btn btn-secondary" href="https://gyroadsidesolutions.com/en/" target="_blank" rel="noopener noreferrer" data-gy-btn>
          ${t.btn}
        </a>
      </div>
    `;

    venturesGrid.appendChild(article);
  }

  function syncLang() {
    const lang = getLang();
    const t = copy[lang];
    const map = [
      ["[data-gy-pill]", t.pill],
      ["[data-gy-title]", t.title],
      ["[data-gy-desc]", t.desc],
      ["[data-gy-t1]", t.t1],
      ["[data-gy-t2]", t.t2],
      ["[data-gy-t3]", t.t3],
      ["[data-gy-t4]", t.t4],
      ["[data-gy-btn]", t.btn]
    ];

    map.forEach(([sel, val]) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    });
  }

  function init() {
    buildCard();
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
