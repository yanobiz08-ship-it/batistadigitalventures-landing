/* Batista Digital Ventures - Landing Core, Folder Cabinet Tabs, Workflow Progress, Ops Compact, Client Tracker, Dev Flow & Legal */
(function () {
  const BDV_ADMIN_API_URL = "https://bdv-backend-api.yanobiz08.workers.dev";

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;")
      .split("'").join("&#039;");
  }

  function getLang() {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    return lang.startsWith("es") ? "es" : "en";
  }

  // Compartir configuración y utilidades globales con bdv-ops-panel.js
  window.BDV_CORE = {
    apiUrl: BDV_ADMIN_API_URL,
    escapeHtml: escapeHtml,
    getLang: getLang,
    getProjectDisplayName: function (p, lang) {
      if (!p) return "";
      if (lang === "es") {
        return p.name_es || p.name || p.name_en || "";
      }
      return p.name_en || p.name || p.name_es || "";
    }
  };

  const copy = {
    es: {
      eyebrow: "PLATAFORMAS DIGITALES Y APPS MÓVILES",
      h1: "Creamos y escalamos plataformas digitales y apps móviles con visión clara.",
      lead: "Batista Digital Ventures diseña, lanza y hace crecer software desde cero hasta producción—uniendo estrategia de negocio, desarrollo móvil, infraestructura en la nube y ejecución enfocada en resultados.",
      ctaPrimary: "Ver Proyectos Activos",
      ctaSecondary: "Ver Qué Hacemos",
      navCta: "Cotizar Proyecto",
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
      gyBtn: "Revisar gyroadsidesolutions.com/en ↗",

      cabKicker: "ARCHIVO EJECUTIVO · BATISTA DIGITAL VENTURES LLC",
      cabTitle: "Explora por pestaña sin desplazarte de más",
      trackerBtnLabel: "🔑 Consultar Mi Proyecto (Solo Lectura)",
      tabs: [
        {
          id: "trust",
          label: "Confianza y Respaldo",
          headline: "Ejecución real, acuerdos claros y productos con historia.",
          summary: "Operamos bajo Batista Digital Ventures LLC en Lompoc, California, combinando criterio de negocio, desarrollo web y móvil, y procesos por hitos sin promesas infladas.",
          bullets: [
            "<strong>Para clientes:</strong> Alcance por escrito (SOW), hitos claros, entrega limpia y transparencia total en costos.",
            "<strong>Para programadores partners:</strong> Contratos claros, reparto sobre ingreso neto cobrado y protección de código y clientes.",
            "<strong>Ecosistema activo:</strong> Desarrollo y soporte en TRIVLO, MERQOX y GY Roadside Solutions."
          ]
        },
        {
          id: "foundations",
          label: "Visión y Pilares",
          headline: "Visión, Valores y Pilares de Batista Digital Ventures LLC",
          summary: "Una estructura diseñada para construir software útil y duradero sin enredos ni improvisación.",
          bullets: [
            "<strong>Visión:</strong> Consolidar un venture studio ágil, honesto y sólido en arquitectura y ejecución.",
            "<strong>Valores:</strong> Verdad operativa, disciplina de capital y código, y acuerdos transparentes.",
            "<strong>Pilares:</strong> Ingeniería móvil y web, ecosistema propio y alianzas con reglas claras."
          ]
        },
        {
          id: "pricing",
          label: "Proceso y Precios",
          headline: "6 etapas de principio a fin, escalones accesibles y barra de progreso.",
          summary: "Cada encargo avanza en orden lógico (10% → 25% → 45% → 75% → 90% → 100%) con código secreto de seguimiento en Etapa 2 y notificación dual automática.",
          bullets: [
            "<strong>Etapas 1–2 (10%–25%):</strong> Recepción y filtro → SOW, depósito y activación de código secreto temporal.",
            "<strong>Etapas 3–5 (45%–90%):</strong> Arquitectura base → Construcción y pruebas QA → Revisión del cliente (5 días hábiles).",
            "<strong>Etapa 6 y Precios (100%):</strong> Liquidación final y entrega. El código secreto expira (no incluye mantenimiento). Web base/MVP ($450–$850), Web dinámica ($1,200–$2,800+), App por hitos ($2,500–$5,000+), Póliza mensual ($180–$450/mes)."
          ]
        },
        {
          id: "partners",
          label: "Partners y Legal",
          headline: "Colaboración con programadores y respaldo legal bajo la LLC.",
          summary: "Cada colaboración se formaliza por escrito bajo las leyes de California para proteger el trabajo de todos.",
          bullets: [
            "<strong>Reparto sobre neto cobrado:</strong> 50%–60% al partner si la LLC aporta el cliente; 70%–80% al partner si aporta el cliente.",
            "<strong>Reglas clave:</strong> Contratista independiente, pago condicionado a cobro efectivo y cesión de propiedad intelectual al liquidar.",
            "<strong>Documentación:</strong> Términos de Servicio y Política de Privacidad disponibles en todo momento."
          ]
        }
      ],

      legalTermsBtn: "Términos de Servicio",
      legalPrivacyBtn: "Política de Privacidad",
      termsTitle: "Términos de Servicio — Batista Digital Ventures LLC",
      termsContent: "<p><strong>Última actualización:</strong> Noviembre 2026 | Domicilio: Lompoc, California.</p><h4>1. Alcance y Cotizaciones</h4><p>Todo proyecto se rige por un Alcance de Trabajo (SOW) por escrito. Funcionalidades adicionales o modificaciones de diseño no contempladas requerirán una orden de cambio y presupuesto complementario.</p><h4>2. Pagos por Hitos y Reserva</h4><p>Los desarrollos requieren un depósito inicial obligatorio antes de programar o diseñar. Los pagos por hitos liquidan el trabajo técnico entregado y no son reembolsables. El saldo final debe quedar 100% saldado antes del despliegue en dominios de producción o tiendas de aplicaciones.</p><h4>3. Propiedad Intelectual</h4><p>La titularidad de los entregables a medida se transfiere al cliente únicamente tras la liquidación íntegra del contrato. La LLC retiene la propiedad de sus librerías base, plantillas y herramientas de ingeniería internas.</p><h4>4. Criterio de Aceptación Objetiva</h4><p>El cliente dispone de 5 días hábiles tras la entrega de un hito para remitir observaciones fundadas. Vencido dicho plazo sin observaciones formales, el hito se considerará legalmente aceptado.</p><h4>5. Limitación de Responsabilidad</h4><p>La responsabilidad total acumulada de Batista Digital Ventures LLC frente al cliente por cualquier reclamación queda limitada estrictamente al monto efectivamente percibido por el servicio contratado. Jurisdicción sujeta a las leyes de California.</p>",
      privacyTitle: "Política de Privacidad — Batista Digital Ventures LLC",
      privacyContent: "<p><strong>Última actualización:</strong> Noviembre 2026 | Responsable: Batista Digital Ventures LLC.</p><h4>1. Tratamiento de Información</h4><p>Recopilamos exclusivamente datos de contacto comercial (nombre, correo corporativo, especificaciones del proyecto) suministrados voluntariamente mediante formularios o correspondencia directa.</p><h4>2. No Venta de Información</h4><p>Batista Digital Ventures LLC no comercializa, transfiere ni cede datos personales a corredores publicitarios ni terceros. La información se utiliza exclusivamente para responder solicitudes, cotizar y coordinar desarrollos.</p><h4>3. Enlaces y Ecosistema</h4><p>Nuestros portales y aplicaciones vinculadas (como TRIVLO, MERQOX y GY Roadside Solutions) aplican sus respectivas políticas de privacidad particulares conforme a su naturaleza y tratamiento de datos de usuarios finales.</p><h4>4. Derechos del Titular</h4><p>Puede solicitar la rectificación o supresión de sus datos de contacto en cualquier momento escribiendo a nuestros canales oficiales en batistadigitalventures.com.</p>"
    },
    en: {
      eyebrow: "B2B & CONSUMER VENTURE ARCHITECTURE",
      h1: "We build and scale digital platforms and mobile apps with conviction.",
      lead: "Batista Digital Ventures designs, builds, and scales software from concept to production—combining disciplined business economics, modern mobile engineering, cloud infrastructure, and market execution.",
      ctaPrimary: "View Active Ventures",
      ctaSecondary: "Explore Full Scope",
      navCta: "Request a Proposal",
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
      gyBtn: "Review gyroadsidesolutions.com/en ↗",

      cabKicker: "EXECUTIVE CABINET · BATISTA DIGITAL VENTURES LLC",
      cabTitle: "Switch tabs cleanly without endless scrolling",
      trackerBtnLabel: "🔑 Track My Project (Read-Only)",
      tabs: [
        {
          id: "trust",
          label: "Trust & Track Record",
          headline: "Disciplined execution, clear agreements, and real product momentum.",
          summary: "Operating under Batista Digital Ventures LLC in Lompoc, California—uniting practical business economics, web and mobile engineering, and milestone-based delivery.",
          bullets: [
            "<strong>For clients:</strong> Written scope (SOW), clear milestones, clean handoff, and no hidden surprises.",
            "<strong>For partner developers:</strong> Written agreements, revenue share on collected net funds, and clear IP/client protection.",
            "<strong>Active ecosystem:</strong> Ongoing work across TRIVLO, MERQOX, and GY Roadside Solutions."
          ]
        },
        {
          id: "foundations",
          label: "Vision & Pillars",
          headline: "Vision, Values & Pillars of Batista Digital Ventures LLC",
          summary: "Built for clarity, lean engineering, and durable outcomes rather than vanity complexity.",
          bullets: [
            "<strong>Vision:</strong> Build a trusted venture studio known for speed, engineering reliability, and straight talk.",
            "<strong>Values:</strong> Operational truth, capital and code discipline, and transparent agreements.",
            "<strong>Pillars:</strong> Mobile and web architecture, proprietary products, and structured partnerships.",
          ]
        },
        {
          id: "pricing",
          label: "Process & Pricing",
          headline: "6 end-to-end stages, accessible tiers, and automated progress alerts.",
          summary: "Every project follows a sequential path (10% → 25% → 45% → 75% → 90% → 100%) with a Stage 2 secret tracker code and automated dual alerts.",
          bullets: [
            "<strong>Stages 1–2 (10%–25%):</strong> Intake & scope fit → SOW execution, deposit & temporary secret PIN issuance.",
            "<strong>Stages 3–5 (45%–90%):</strong> Architecture setup → Core build & QA → Client review (5 business days).",
            "<strong>Stage 6 & Tiers (100%):</strong> Final settlement & release. Secret PIN expires (maintenance not included). Starter/MVP web ($450–$850), Dynamic web ($1,200–$2,800+), Milestone app ($2,500–$5,000+), Monthly care ($180–$450/mo)."
          ]
        },
        {
          id: "partners",
          label: "Partners & Legal",
          headline: "Partner developer model and LLC legal guardrails.",
          summary: "Every engagement is documented in writing under California law so expectations stay clear from day one.",
          bullets: [
            "<strong>Net collected split:</strong> 50%–60% to partner when LLC brings the client; 70%–80% when partner brings the client.",
            "<strong>Core guardrails:</strong> Independent contractor status, paid-when-paid trigger, and IP transfer upon full settlement.",
            "<strong>Legal policies:</strong> Terms of Service and Privacy Policy accessible anytime."
          ]
        }
      ],

      legalTermsBtn: "Terms of Service",
      legalPrivacyBtn: "Privacy Policy",
      termsTitle: "Terms of Service — Batista Digital Ventures LLC",
      termsContent: "<p><strong>Last Updated:</strong> November 2026 | Principal Office: Lompoc, California.</p><h4>1. Scope and Statements of Work</h4><p>All client engagements are governed by an approved Statement of Work (SOW). Out-of-scope requests or major iterations require written change orders and separate pricing.</p><h4>2. Milestone Payments</h4><p>All projects require an advance deposit before engineering begins. Progress payments cover work completed and are non-refundable. Full settlement is mandatory prior to production release or store publishing.</p><h4>3. Intellectual Property Transfer</h4><p>Final project IP rights transfer exclusively upon 100% full payment. Pre-existing frameworks, design systems, and engineering libraries remain property of the LLC.</p><h4>4. Deemed Acceptance</h4><p>Clients have 5 business days to inspect delivered deliverables. Without substantiated written objections within this window, deliverables are deemed fully accepted.</p><h4>5. Limitation of Liability</h4><p>Total cumulative liability of Batista Digital Ventures LLC is strictly capped at the fees collected for the specific project. Governed under the laws of California.</p>",
      privacyTitle: "Privacy Policy — Batista Digital Ventures LLC",
      privacyContent: "<p><strong>Last Updated:</strong> November 2026 | Controller: Batista Digital Ventures LLC.</p><h4>1. Data Collection</h4><p>We only collect essential business contact information (name, direct email, scope details) submitted voluntarily via contact portals or direct email.</p><h4>2. No Data Brokering</h4><p>Batista Digital Ventures LLC does not sell, rent, or trade personal data to third parties. Information is used strictly to process quotes, service contracts, and platform inquiries.</p><h4>3. Ecosystem Platforms</h4><p>Independent properties (such as TRIVLO, MERQOX, and GY Roadside Solutions) maintain specialized disclosures reflecting their end-user operational workflows.</p><h4>4. Your Rights</h4><p>You may request data deletion or records updates at any time by contacting our official desk at batistadigitalventures.com.</p>"
    }
  };

  let isPanelOpen = false;
  let activeTabIndex = 0;
  let activeStageIndex = 0;
  let workflowStages = [
    { stage: 1, percentage: 10, name_es: "Recepción y Filtro de Alcance", name_en: "Intake & Scope Fit Assessment", financial_trigger_es: "Sin costo · Diagnóstico inicial", financial_trigger_en: "No cost · Intake check" },
    { stage: 2, percentage: 25, name_es: "Firma de SOW, Depósito y Activación de Código Secreto", name_en: "SOW Execution, Deposit & Secret Code Issuance", financial_trigger_es: "Depósito inicial liquidado (25%–50%) → Emisión de PIN temporal", financial_trigger_en: "Deposit cleared (25%–50%) → Temporary access PIN issued" },
    { stage: 3, percentage: 45, name_es: "Arquitectura y Entorno Base", name_en: "System Architecture & Base Setup", financial_trigger_es: "En desarrollo · Cubierto por anticipo", financial_trigger_en: "In progress · Covered by deposit" },
    { stage: 4, percentage: 75, name_es: "Construcción y Auditoría Técnica Interna", name_en: "Core Engineering & Internal QA", financial_trigger_es: "Próximo vencimiento: Saldo final para entrega", financial_trigger_en: "Next due: Final balance prior to release" },
    { stage: 5, percentage: 90, name_es: "Inspección de Entrega y Ventana de Revisión", name_en: "Client Inspection & Review Window", financial_trigger_es: "Ventana de 5 días activa · 100% requerido para despliegue", financial_trigger_en: "5-day window open · 100% required for deployment" },
    { stage: 6, percentage: 100, name_es: "Liquidación Final, Traspaso y Expiración de Acceso", name_en: "Final Settlement, Handoff & Portal Disablement", financial_trigger_es: "100% liquidado · Acceso temporal cerrado (no incluye mantenimiento)", financial_trigger_en: "100% settled · Temporary tracker disabled (maintenance not included)" }
  ];

  window.BDV_CORE.workflowStages = workflowStages;

  const opsData = {
    es: {
      title: "CÓMO OPERAMOS",
      sub: "Rigor institucional aplicado a entregas ágiles.",
      items: [
        { num: "01", short: "Evidencia", desc: "Diagnóstico Basado en Evidencia: causa raíz, revisión exacta de líneas y cambios quirúrgicos sin suposiciones." },
        { num: "02", short: "Costo Eficiente", desc: "Arquitectura de Costo Eficiente: capas gratuitas, herramientas abiertas y servicios escalables para cuidar márgenes." },
        { num: "03", short: "Cumplimiento", desc: "Cumplimiento y Confianza: transparencia de datos, dominios verificados, cifrado HTTPS y fichas alineadas a políticas." },
        { num: "04", short: "Iterar", desc: "Publicar e Iterar: avances incrementales comprobables desde el prototipo hasta producción con retroalimentación real." }
      ]
    },
    en: {
      title: "HOW WE OPERATE",
      sub: "Institutional rigor applied to agile delivery.",
      items: [
        { num: "01", short: "Evidence", desc: "Evidence-Based Diagnostics: root-cause checks, exact line inspection, and surgical changes without guesswork." },
        { num: "02", short: "Lean Cost", desc: "Cost-Efficient Architecture: smart free tiers, open tooling, and scalable services to protect margins." },
        { num: "03", short: "Compliance", desc: "Compliance & Trust: data transparency, verified domains, HTTPS encryption, and policy-aligned store listings." },
        { num: "04", short: "Iterate", desc: "Ship & Iterate: verifiable incremental progress from prototype to production with real feedback." }
      ]
    }
  };

  let activeOpsIndex = 0;

  function applyLogo(lang) {
    const iconWrap = document.querySelector(".brand-icon-wrap");
    if (!iconWrap) return;

    iconWrap.style.width = "44px";
    iconWrap.style.height = "44px";
    iconWrap.style.minWidth = "44px";
    iconWrap.style.minHeight = "44px";
    iconWrap.style.display = "inline-flex";
    iconWrap.style.alignItems = "center";
    iconWrap.style.justifyContent = "center";
    iconWrap.style.overflow = "hidden";
    iconWrap.style.borderRadius = "12px";

    let img = iconWrap.querySelector("img.bdv-header-logo-img");
    if (!img) {
      img = document.createElement("img");
      img.className = "bdv-header-logo-img";
      img.src = "./assets/BDV Logo.png";
      img.style.width = "44px";
      img.style.height = "44px";
      img.style.maxWidth = "44px";
      img.style.maxHeight = "44px";
      img.style.objectFit = "cover";
      img.style.display = "block";
      iconWrap.innerHTML = "";
      iconWrap.appendChild(img);
    }
    img.alt = copy[lang].altLogo;
  }

  function applyBanner(lang) {
    if (document.getElementById("bdv-brand-banner-section")) return;
    const mainEl = document.querySelector("main") || document.body;
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
            loading="eager"
          />
        </div>
      </div>
    `;

    const firstSection = mainEl.querySelector("section");
    if (firstSection && firstSection.nextSibling) {
      mainEl.insertBefore(section, firstSection.nextSibling);
    } else {
      mainEl.appendChild(section);
    }
  }

  function hideStaticVenturesGrid(container) {
    if (!container) return;
    const grids = container.querySelectorAll(":scope > .ventures-grid");
    grids.forEach((grid) => {
      grid.style.setProperty("display", "none", "important");
    });
  }

  function applyProductsDrawer(lang) {
    const venturesSection = document.getElementById("ventures");
    if (!venturesSection) return;

    const container = venturesSection.querySelector(".container") || venturesSection;
    hideStaticVenturesGrid(container);

    if (document.getElementById("bdv-products-drawer")) return;

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

  function renderCabinet(lang) {
    const mainEl = document.querySelector("main") || document.body;
    if (!mainEl) return;

    const oldFoundations = document.getElementById("bdv-foundations-section");
    if (oldFoundations) oldFoundations.remove();

    let cab = document.getElementById("bdv-cabinet-section");
    if (!cab) {
      cab = document.createElement("section");
      cab.id = "bdv-cabinet-section";
      cab.className = "bdv-cabinet-band";
      mainEl.appendChild(cab);
    }

    const t = copy[lang];
    const tabs = Array.isArray(t.tabs) && t.tabs.length ? t.tabs : [];
    if (activeTabIndex >= tabs.length) activeTabIndex = 0;
    const currentTab = tabs[activeTabIndex] || { id: "", label: "", headline: "", summary: "", bullets: [] };
    const folderCode = `FOLDER 0${activeTabIndex + 1} / 0${tabs.length || 1}`;

    const markersHtml = tabs
      .map(
        (tab, idx) => `
          <button
            type="button"
            role="tab"
            aria-selected="${idx === activeTabIndex ? "true" : "false"}"
            class="bdv-tab-marker ${idx === activeTabIndex ? "is-active" : ""}"
            data-bdv-tab-index="${idx}"
          >${tab.label}</button>
        `
      )
      .join("");

    const bulletsHtml = (currentTab.bullets || [])
      .map((item) => `<li>${item}</li>`)
      .join("");

    let progressHtml = "";
    if (currentTab.id === "pricing" && workflowStages.length) {
      if (activeStageIndex >= workflowStages.length) activeStageIndex = 0;
      const st = workflowStages[activeStageIndex];
      const stageName = lang === "en" ? st.name_en : st.name_es;
      const alertLabel =
        lang === "en"
          ? `Auto-alert: Client + contact@batistadigitalventures.com (${st.percentage}%)`
          : `Alerta automática: Cliente + contact@batistadigitalventures.com (${st.percentage}%)`;

      const pillsHtml = workflowStages
        .map(
          (item, idx) => `
            <button
              type="button"
              class="bdv-stage-pill-btn ${idx === activeStageIndex ? "is-active" : ""}"
              data-bdv-stage-index="${idx}"
            >${item.stage}. ${item.percentage}%</button>
          `
        )
        .join("");

      progressHtml = `
        <div class="bdv-progress-box">
          <div class="bdv-progress-top">
            <span>${stageName}</span>
            <span>${alertLabel}</span>
          </div>
          <div class="bdv-progress-track">
            <div class="bdv-progress-fill" style="width: ${st.percentage}%;"></div>
          </div>
          <div class="bdv-stage-pills">${pillsHtml}</div>
          <div style="margin-top: 14px;">
            <button type="button" id="bdv-open-tracker-btn" class="bdv-tracker-launch-btn">
              ${t.trackerBtnLabel || "🔑 Consultar Mi Proyecto (Solo Lectura)"}
            </button>
          </div>
        </div>
      `;
    }

    cab.innerHTML = `
      <div class="container">
        <div class="bdv-cabinet-header">
          <span class="bdv-banner-kicker">${t.cabKicker}</span>
          <h2 class="bdv-cabinet-title">${t.cabTitle}</h2>
        </div>
        <div class="bdv-cabinet-shell">
          <div class="bdv-tabs-bar" role="tablist">${markersHtml}</div>
          <div class="bdv-folder-sheet" role="tabpanel">
            <div class="bdv-folder-top-strip">
              <span class="bdv-folder-badge">${folderCode} · ${currentTab.label}</span>
            </div>
            <h3 class="bdv-folder-headline">${currentTab.headline}</h3>
            <p class="bdv-folder-summary">${currentTab.summary}</p>
            <ul class="bdv-folder-list">${bulletsHtml}</ul>
            ${progressHtml}
          </div>
        </div>
      </div>
    `;

    cab.querySelectorAll("[data-bdv-tab-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTabIndex = Number(btn.getAttribute("data-bdv-tab-index")) || 0;
        renderCabinet(getLang());
      });
    });

    cab.querySelectorAll("[data-bdv-stage-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeStageIndex = Number(btn.getAttribute("data-bdv-stage-index")) || 0;
        renderCabinet(getLang());
      });
    });

    const openTrackerBtn = cab.querySelector("#bdv-open-tracker-btn");
    if (openTrackerBtn) {
      openTrackerBtn.addEventListener("click", () => {
        const modal = document.getElementById("bdv-tracker-modal-root");
        if (modal) modal.style.display = "flex";
      });
    }
  }

  function applyCompactHowWeOperate(lang) {
    const sections = Array.from(document.querySelectorAll("main section"));
    const targetSec = sections.find((sec) => {
      if (sec.id && sec.id.startsWith("bdv-")) return false;
      const txt = (sec.textContent || "");
      return txt.includes("01") && txt.includes("02") && txt.includes("03") && txt.includes("04");
    });
    if (!targetSec) return;

    const d = opsData[lang] || opsData.en;
    if (activeOpsIndex >= d.items.length) activeOpsIndex = 0;
    const current = d.items[activeOpsIndex];

    targetSec.innerHTML = `
      <div class="container">
        <div class="bdv-ops-compact">
          <div class="bdv-ops-head">
            <h2 class="bdv-ops-title">${d.title}</h2>
            <p class="bdv-ops-sub">${d.sub}</p>
          </div>
          <div class="bdv-ops-pills">
            ${d.items
              .map(
                (it, idx) => `
                  <button
                    type="button"
                    class="bdv-ops-pill ${idx === activeOpsIndex ? "is-active" : ""}"
                    data-bdv-ops-idx="${idx}"
                  >
                    <span class="bdv-ops-num">${it.num}</span>
                    <span>${it.short}</span>
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="bdv-ops-detail">${current.desc}</div>
        </div>
      </div>
    `;

    targetSec.querySelectorAll("[data-bdv-ops-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeOpsIndex = Number(btn.getAttribute("data-bdv-ops-idx")) || 0;
        applyCompactHowWeOperate(getLang());
      });
    });
  }

  function cleanFooterLinksAndApplyLegal(lang) {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.querySelectorAll("a, span").forEach((el) => {
      const txt = (el.textContent || "").trim().toUpperCase();
      if (txt === "MERQOX" || txt === "TRIVLO") {
        el.style.display = "none";
        el.remove();
      }
    });

    let legalBar = document.getElementById("bdv-footer-legal-links");
    if (!legalBar) {
      legalBar = document.createElement("div");
      legalBar.id = "bdv-footer-legal-links";
      legalBar.className = "bdv-footer-legal";
      legalBar.innerHTML = `
        <button type="button" id="bdv-btn-terms" class="bdv-link-btn" data-legal-terms-btn>${copy[lang].legalTermsBtn}</button>
        <span class="bdv-legal-dot">•</span>
        <button type="button" id="bdv-btn-privacy" class="bdv-link-btn" data-legal-privacy-btn>${copy[lang].legalPrivacyBtn}</button>
      `;

      const container = footer.querySelector(".container") || footer;
      container.appendChild(legalBar);

      document.getElementById("bdv-btn-terms").addEventListener("click", () => {
        const curLang = getLang();
        document.getElementById("bdv-modal-title").textContent = copy[curLang].termsTitle;
        document.getElementById("bdv-modal-body").innerHTML = copy[curLang].termsContent;
        document.getElementById("bdv-legal-modal-root").style.display = "flex";
      });

      document.getElementById("bdv-btn-privacy").addEventListener("click", () => {
        const curLang = getLang();
        document.getElementById("bdv-modal-title").textContent = copy[curLang].privacyTitle;
        document.getElementById("bdv-modal-body").innerHTML = copy[curLang].privacyContent;
        document.getElementById("bdv-legal-modal-root").style.display = "flex";
      });
    }
  }

  function applyLegalModals() {
    if (document.getElementById("bdv-legal-modal-root")) return;

    const modalRoot = document.createElement("div");
    modalRoot.id = "bdv-legal-modal-root";
    modalRoot.className = "bdv-modal-overlay";
    modalRoot.style.display = "none";
    modalRoot.innerHTML = `
      <div class="bdv-modal-window">
        <div class="bdv-modal-top">
          <h3 id="bdv-modal-title">Legal</h3>
          <button type="button" id="bdv-modal-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>
        </div>
        <div id="bdv-modal-body" class="bdv-modal-content"></div>
      </div>
    `;
    document.body.appendChild(modalRoot);

    document.getElementById("bdv-modal-close-btn").addEventListener("click", () => {
      modalRoot.style.display = "none";
    });

    modalRoot.addEventListener("click", (e) => {
      if (e.target === modalRoot) modalRoot.style.display = "none";
    });
  }

  function openExecutiveConfirmationModal(clientName, reqId, lang) {
    let confirmRoot = document.getElementById("bdv-exec-confirm-root");
    if (!confirmRoot) {
      confirmRoot = document.createElement("div");
      confirmRoot.id = "bdv-exec-confirm-root";
      confirmRoot.className = "bdv-modal-overlay";
      confirmRoot.style.zIndex = "99999";
      confirmRoot.style.overflowY = "auto";
      confirmRoot.style.padding = "16px";
      document.body.appendChild(confirmRoot);
    }

    const isEs = lang === "es";
    const title = isEs
      ? "Solicitud Recibida · Batista Digital Ventures LLC"
      : "Request Confirmed · Batista Digital Ventures LLC";
    const badge = isEs ? "CONFIRMACIÓN OFICIAL" : "OFFICIAL INTAKE";
    const greeting = isEs
      ? `Felicidades, ${escapeHtml(clientName)}. Hemos recibido su solicitud y le enviamos una confirmación a su correo electrónico.`
      : `Congratulations, ${escapeHtml(clientName)}. We have received your request and sent an official confirmation to your email address.`;
    const detail = isEs
      ? `Nuestro equipo directivo y de ingeniería revisará su propuesta a la brevedad para validar el alcance, activar el proyecto y coordinar los siguientes pasos con usted. Folio de referencia: ${escapeHtml(reqId || "BDV")}.`
      : `Our executive and engineering leadership will review your proposal promptly to validate scope, activate your engagement, and coordinate next steps with you. Reference ID: ${escapeHtml(reqId || "BDV")}.`;
    const btnText = isEs ? "Entendido" : "Done";

    confirmRoot.innerHTML = `
      <div class="bdv-tracker-card" style="max-width: 480px; width: 100%; margin: auto; border: 1px solid rgba(212, 175, 55, 0.55); background: #0b0f17; padding: 22px; border-radius: 14px;">
        <div style="font-size: 0.7rem; letter-spacing: 0.08em; color: #e8c861; font-weight: 700; margin-bottom: 6px;">${badge}</div>
        <h3 style="margin: 0 0 10px 0; font-size: 1.15rem; color: #f8fafc;">${title}</h3>
        <p style="font-size: 0.9rem; color: #e2e8f0; line-height: 1.5; margin: 0 0 10px 0;">${greeting}</p>
        <p style="font-size: 0.82rem; color: #94a3b8; line-height: 1.5; margin: 0 0 18px 0;">${detail}</p>
        <button type="button" id="bdv-exec-confirm-close" class="bdv-tracker-btn" style="width: 100%;">${btnText}</button>
      </div>
    `;

    confirmRoot.style.display = "flex";

    document.getElementById("bdv-exec-confirm-close").addEventListener("click", () => {
      confirmRoot.style.display = "none";
    });

    confirmRoot.addEventListener("click", (e) => {
      if (e.target === confirmRoot) confirmRoot.style.display = "none";
    });
  }

  function applyServiceRequestModal() {
    const lang = getLang();

    const serviceCopy = {
      es: {
        btn: "Solicitar nuestros servicios",
        title: "Solicitar nuestros servicios · BDV LLC",
        desc: "Marca lo que necesitas para tu negocio. Enviaremos tu solicitud a dirección y a nuestros programadores partners disponibles.",
        namePh: "Tu nombre completo",
        emailPh: "Tu correo electrónico",
        businessPh: "Nombre de tu negocio o proyecto (opcional)",
        notesPh: "Cuéntanos brevemente qué quieres lograr o cuándo te gustaría iniciar...",
        submit: "Enviar Solicitud",
        selectOne: "Selecciona al menos un servicio de la lista.",
        sending: "Enviando solicitud...",
        success: "✓ Solicitud enviada. Revisa tu correo para la confirmación.",
        fail: "No se pudo enviar la solicitud.",
        netErr: "Error de conexión al enviar la solicitud.",
        items: [
          "Sitio Web Base / MVP ($450–$850)",
          "Plataforma / Web Dinámica ($1,200–$2,800+)",
          "Aplicación Móvil por Hitos ($2,500–$5,000+)",
          "Panel de Administración / Automatización",
          "Póliza Mensual / Soporte ($180–$450/mes)"
        ]
      },
      en: {
        btn: "Request Our Services",
        title: "Request Our Services · BDV LLC",
        desc: "Select what you need for your business. We will send your request to management and available partner developers.",
        namePh: "Your full name",
        emailPh: "Your email address",
        businessPh: "Business or project name (optional)",
        notesPh: "Tell us briefly what you want to build or when you plan to start...",
        submit: "Submit Request",
        selectOne: "Select at least one service from the list.",
        sending: "Sending request...",
        success: "✓ Request sent. Check your email for confirmation.",
        fail: "Could not send the request.",
        netErr: "Connection error while sending the request.",
        items: [
          "Starter Website / MVP ($450–$850)",
          "Dynamic Platform / Web App ($1,200–$2,800+)",
          "Milestone Mobile App ($2,500–$5,000+)",
          "Admin Dashboard / Automation",
          "Monthly Care / Support ($180–$450/mo)"
        ]
      }
    };

    const s = serviceCopy[lang] || serviceCopy.en;

    let reqBtn = document.getElementById("bdv-request-services-btn");
    if (!reqBtn) {
      const heroCta = document.querySelector(".hero-cta");
      if (heroCta) {
        reqBtn = document.createElement("button");
        reqBtn.type = "button";
        reqBtn.id = "bdv-request-services-btn";
        reqBtn.className = "btn btn-primary";
        reqBtn.addEventListener("click", () => {
          const m = document.getElementById("bdv-service-modal-root");
          if (m) {
            m.style.setProperty("display", "block", "important");
            m.scrollTop = 0;
          }
        });
        heroCta.appendChild(reqBtn);
      }
    }
    if (reqBtn) reqBtn.textContent = s.btn;

let modalRoot = document.getElementById("bdv-service-modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "bdv-service-modal-root";
      modalRoot.className = "bdv-modal-overlay";
      modalRoot.style.cssText =
        "display: none; position: fixed; inset: 0; z-index: 9999; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 16px 12px 48px 12px; background: rgba(0, 0, 0, 0.78);";

      modalRoot.innerHTML = `
        <div id="bdv-service-modal-card" class="bdv-tracker-card" style="max-width: 500px; width: 100%; height: auto !important; max-height: none !important; overflow: visible !important; margin: 0 auto !important;">
          <div class="bdv-modal-top">
            <h3 id="bdv-srv-modal-title" style="margin: 0; font-size: 1.05rem; color: #e8c861;"></h3>
            <button type="button" id="bdv-service-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>
          </div>
          <p id="bdv-srv-modal-desc" style="font-size: 0.82rem; color: #94a3b8; margin: 8px 0 12px 0;"></p>
          <form id="bdv-service-request-form" class="bdv-tracker-form">
            <input type="text" id="bdv-srv-client-name" class="bdv-tracker-input" required />
            <input type="email" id="bdv-srv-client-email" class="bdv-tracker-input" required />
            <input type="text" id="bdv-srv-business-name" class="bdv-tracker-input" />
            <div id="bdv-srv-checkboxes" style="display: flex; flex-direction: column; gap: 6px; margin: 4px 0;"></div>
            <textarea id="bdv-srv-notes" class="bdv-tracker-input" rows="3" style="resize: vertical;"></textarea>
            <button type="submit" id="bdv-srv-submit-btn" class="bdv-tracker-btn" style="background: #e8c861 !important; color: #070a10 !important; font-weight: 700; opacity: 1 !important;"></button>
          </form>
          <div id="bdv-srv-status-msg" style="display: none; margin-top: 10px; font-size: 0.82rem;"></div>
        </div>
      `;

      document.body.appendChild(modalRoot);

      document.getElementById("bdv-service-close-btn").addEventListener("click", () => {
        modalRoot.style.setProperty("display", "none", "important");
      });

      modalRoot.addEventListener("click", (e) => {
        if (e.target === modalRoot) {
          modalRoot.style.setProperty("display", "none", "important");
        }
      });

      document.getElementById("bdv-service-request-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const curLang = getLang();
        const curS = serviceCopy[curLang] || serviceCopy.en;

        const clientName = (document.getElementById("bdv-srv-client-name").value || "").trim();
        const clientEmail = (document.getElementById("bdv-srv-client-email").value || "").trim();
        const businessName = (document.getElementById("bdv-srv-business-name").value || "").trim();
        const notes = (document.getElementById("bdv-srv-notes").value || "").trim();
        const selected = Array.from(modalRoot.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const statusEl = document.getElementById("bdv-srv-status-msg");
        const submitBtn = document.getElementById("bdv-srv-submit-btn");

        if (!selected.length) {
          statusEl.style.display = "block";
          statusEl.style.color = "#f87171";
          statusEl.textContent = curS.selectOne;
          return;
        }

        submitBtn.disabled = true;
        statusEl.style.display = "block";
        statusEl.style.color = "#94a3b8";
        statusEl.textContent = curS.sending;

        fetch(BDV_ADMIN_API_URL, {
          method: "POST",
          body: JSON.stringify({
            action: "request_services",
            lang: curLang,
            clientName: clientName,
            clientEmail: clientEmail,
            businessName: businessName,
            services: selected,
            notes: notes
          })
        })
          .then(r => r.json())
          .then(res => {
            submitBtn.disabled = false;
            if (res.ok) {
              statusEl.style.color = "#4ade80";
              statusEl.textContent = curS.success;
              e.target.reset();
              modalRoot.style.display = "none";
              openExecutiveConfirmationModal(clientName, res.id, curLang);
            } else {
              statusEl.style.color = "#f87171";
              statusEl.textContent = res.error || curS.fail;
            }
          })
          .catch(() => {
            submitBtn.disabled = false;
            statusEl.style.color = "#f87171";
            statusEl.textContent = curS.netErr;
          });
      });
    }

    const prevChecked = Array.from(modalRoot.querySelectorAll('input[type="checkbox"]:checked')).map(cb => Number(cb.dataset.idx));
    document.getElementById("bdv-srv-modal-title").textContent = s.title;
    document.getElementById("bdv-srv-modal-desc").textContent = s.desc;
    document.getElementById("bdv-srv-client-name").placeholder = s.namePh;
    document.getElementById("bdv-srv-client-email").placeholder = s.emailPh;
    document.getElementById("bdv-srv-business-name").placeholder = s.businessPh;
    document.getElementById("bdv-srv-notes").placeholder = s.notesPh;
    document.getElementById("bdv-srv-submit-btn").textContent = s.submit;

    const cbContainer = document.getElementById("bdv-srv-checkboxes");
    if (cbContainer) {
      cbContainer.innerHTML = s.items
        .map(
          (srv, idx) => `
            <label style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; font-size: 0.84rem; color: #e2e8f0;">
              <input type="checkbox" id="bdv-srv-${idx}" data-idx="${idx}" value="${escapeHtml(srv)}" ${prevChecked.includes(idx) ? "checked" : ""} style="accent-color: #d4af37;" />
              <span>${escapeHtml(srv)}</span>
            </label>
          `
        )
        .join("");
    }
  }

  function loadCabinetData() {
    Promise.all([
      fetch("./bdv-company/cabinet-tabs.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("./bdv-company/foundations.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("./bdv-company/workflow-progress.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    ]).then(([cabData, foundData, wfData]) => {
      ["es", "en"].forEach((langKey) => {
        if (foundData && foundData[langKey]) {
          copy[langKey] = Object.assign({}, copy[langKey], foundData[langKey]);
        }
        if (cabData && cabData[langKey]) {
          copy[langKey] = Object.assign({}, copy[langKey], cabData[langKey]);
        }
      });
      if (wfData && Array.isArray(wfData.progress_stages) && wfData.progress_stages.length) {
        workflowStages = wfData.progress_stages;
        window.BDV_CORE.workflowStages = workflowStages;
      }
      syncAll();
    });
  }

  function syncAll() {
    const lang = getLang();
    const t = copy[lang];

    applyLogo(lang);
    applyBanner(lang);
    applyProductsDrawer(lang);
    renderCabinet(lang);
    applyCompactHowWeOperate(lang);
    applyLegalModals();
    cleanFooterLinksAndApplyLegal(lang);
    applyServiceRequestModal();

    const eyebrow = document.querySelector(".eyebrow");
    if (eyebrow) eyebrow.textContent = t.eyebrow;

    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = t.h1;

    const heroLead = document.querySelector(".hero-lead");
    if (heroLead) heroLead.textContent = t.lead;

    const navBtn = document.querySelector("header .nav-actions .btn, header .nav-actions a, header .btn-primary");
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

    const termsBtn = document.querySelector("[data-legal-terms-btn]");
    const privBtn = document.querySelector("[data-legal-privacy-btn]");
    if (termsBtn) termsBtn.textContent = t.legalTermsBtn;
    if (privBtn) privBtn.textContent = t.legalPrivacyBtn;

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

    // Si el panel de operaciones está activo, notificarlo
    if (window.BDV_OPS && typeof window.BDV_OPS.onLanguageChange === "function") {
      window.BDV_OPS.onLanguageChange();
    }
  }

  function init() {
    syncAll();
    loadCabinetData();
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
