/* Batista Digital Ventures - Landing Core, Folder Cabinet Tabs, Workflow Progress, Ops Compact, Client Tracker & Legal */
(function () {
  const BDV_ADMIN_API_URL = "https://script.google.com/macros/s/AKfycbza_9dJxLPS6zQS8KApE52HLBR_6izMwp2nnG1OlkJlp7lUai5SIRbQmS2nVCBOFwAZdg/exec";
  const BDV_ADMIN_KEY = "BDV_MASTER_2026";

  const copy = {
    es: {
      eyebrow: "PLATAFORMAS DIGITALES Y APPS MÓVILES",
      h1: "Creamos y escalamos plataformas digitales y apps móviles con visión clara.",
      lead: "Batista Digital Ventures diseña, lanza y hace crecer software desde cero hasta producción—uniendo estrategia de negocio, desarrollo móvil, infraestructura en la nube y ejecución enfocada en resultados.",
      ctaPrimary: "Ver Proyectos Activos",
      ctaSecondary: "Ver Qué Hacemos",
      navCta: "Colaborar",
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
            "<strong>Pillars:</strong> Mobile and web architecture, proprietary products, and structured partnerships."
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

  /* Compactación visual: Cómo Operamos (01-04) */
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

  function getLang() {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    return lang.startsWith("en") ? "en" : "es";
  }

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

    const d = opsData[lang] || opsData.es;
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

  /* Visor de solo lectura para el cliente */
  function applyClientTrackerModal() {
    if (document.getElementById("bdv-tracker-modal-root")) return;

    const modalRoot = document.createElement("div");
    modalRoot.id = "bdv-tracker-modal-root";
    modalRoot.className = "bdv-modal-overlay";
    modalRoot.style.display = "none";

    modalRoot.innerHTML = `
      <div class="bdv-tracker-card">
        <div class="bdv-modal-top">
          <h3 style="margin: 0; font-size: 1.05rem; color: #e8c861;">Visor de Progreso · BDV LLC</h3>
          <button type="button" id="bdv-tracker-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>
        </div>
        <p style="font-size: 0.82rem; color: #94a3b8; margin: 8px 0 14px 0;">
          Acceso de solo lectura mediante tu correo y el código secreto temporal asignado al liquidar el depósito.
        </p>
        <form id="bdv-tracker-query-form" class="bdv-tracker-form">
          <input type="email" id="bdv-track-email" class="bdv-tracker-input" placeholder="tu-correo@empresa.com" required />
          <input type="text" id="bdv-track-pin" class="bdv-tracker-input" placeholder="Código secreto (ej. BDV-7492)" required />
          <button type="submit" class="bdv-tracker-btn">Consultar Avance</button>
        </form>
        <div id="bdv-track-result-box" style="display: none;" class="bdv-tracker-result"></div>
        <p class="bdv-tracker-disclaimer">
          * Nota: Este portal es de solo lectura y se inhabilita de inmediato al liquidar el 100% y entregarse el proyecto. No incluye soporte post-entrega ni mantenimiento mensual.
        </p>
      </div>
    `;
    document.body.appendChild(modalRoot);

    document.getElementById("bdv-tracker-close-btn").addEventListener("click", () => {
      modalRoot.style.display = "none";
    });

    modalRoot.addEventListener("click", (e) => {
      if (e.target === modalRoot) modalRoot.style.display = "none";
    });

    const form = document.getElementById("bdv-tracker-query-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (document.getElementById("bdv-track-email").value || "").trim().toLowerCase();
      const pin = (document.getElementById("bdv-track-pin").value || "").trim().toUpperCase();
      const resBox = document.getElementById("bdv-track-result-box");
      const lang = getLang();

      if (!email || !pin) return;

      resBox.style.display = "block";
      resBox.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8;">Verificando credenciales...</p>`;

      fetch(`${BDV_ADMIN_API_URL}?key=${BDV_ADMIN_KEY}`)
        .then(r => r.json())
        .then(res => {
          if (!res.ok || !res.projects) {
            throw new Error("No data");
          }
          const matched = res.projects.find(p => p.email.toLowerCase() === email && p.code.toUpperCase() === pin);
          if (!matched) {
            resBox.innerHTML = `
              <p style="font-size: 0.82rem; color: #f87171; margin: 0;">
                ${lang === "en" ? "Credentials not found or expired. Check your welcome email or contact management." : "Credenciales no encontradas o expiradas. Revisa tu correo de bienvenida o contacta a soporte."}
              </p>
            `;
            return;
          }

          if (matched.accessStatus === "DISABLED" || matched.stage === 6) {
            resBox.innerHTML = `
              <span class="bdv-tracker-status-tag bdv-status-disabled">Acceso Expirado / Inhabilitado</span>
              <h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Proyecto Liquidado al 100%</h4>
              <p style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0;">El software fue entregado y las credenciales maestras fueron traspasadas. El visor temporal ha concluido. Para soporte técnico continuo, contacte una póliza mensual.</p>
            `;
          } else {
            const stObj = workflowStages[matched.stage - 1] || workflowStages[0];
            const stName = lang === "en" ? stObj.name_en : stObj.name_es;
            resBox.innerHTML = `
              <span class="bdv-tracker-status-tag bdv-status-active">Acceso Activo · Obra en Progreso</span>
              <h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Etapa ${matched.stage}/6: ${stName} (${stObj.percentage}%)</h4>
              <p style="font-size: 0.8rem; color: #cbd5e1; margin: 6px 0;"><strong>Proyecto:</strong> ${matched.name} (${matched.id})</p>
              <p style="font-size: 0.8rem; color: #e8c861; margin: 6px 0;"><strong>Estado Financiero:</strong> ${matched.paymentStatus}</p>
              <div class="bdv-progress-track" style="margin-top: 8px;">
                <div class="bdv-progress-fill" style="width: ${stObj.percentage}%;"></div>
              </div>
            `;
          }
        })
        .catch(() => {
          resBox.innerHTML = `
            <p style="font-size: 0.82rem; color: #f87171; margin: 0;">
              ${lang === "en" ? "Connection error. Please try again." : "Error al conectar con el servidor. Intenta de nuevo."}
            </p>
          `;
        });
    });
  }

  /* Admin Panel Web (Gestión Interna de Proyectos) */
  function applyAdminPanel() {
    const footer = document.querySelector("footer");
    if (!footer || document.getElementById("bdv-admin-btn")) return;

    const adminLink = document.createElement("div");
    adminLink.style.textAlign = "center";
    adminLink.style.marginTop = "15px";
    adminLink.innerHTML = `<button type="button" id="bdv-admin-btn" class="bdv-admin-footer-btn">⚙ Panel Admin</button>`;
    (footer.querySelector(".container") || footer).appendChild(adminLink);

    const modalRoot = document.createElement("div");
    modalRoot.id = "bdv-admin-modal-root";
    modalRoot.className = "bdv-modal-overlay";
    modalRoot.style.display = "none";

    modalRoot.innerHTML = `
      <div class="bdv-admin-card">
        <div class="bdv-modal-top">
          <h3 style="margin: 0; color: #e8c861; font-size: 1.1rem;">⚙ Admin Panel · BDV LLC</h3>
          <button type="button" id="bdv-admin-close-btn" class="bdv-modal-close">✕</button>
        </div>

        <div id="bdv-admin-auth-view" style="margin-top: 15px;">
          <input type="password" id="bdv-admin-pass" class="bdv-tracker-input" style="width: 100%;" placeholder="Ingresa clave de administrador" />
          <button type="button" id="bdv-admin-login-btn" class="bdv-tracker-btn" style="width: 100%; margin-top: 10px;">Acceder al Panel</button>
        </div>

        <div id="bdv-admin-dash-view" style="display: none; margin-top: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
            <h4 style="margin: 0; font-size: 0.95rem;">Proyectos en Curso</h4>
            <button type="button" id="bdv-admin-refresh-btn" class="bdv-admin-action-btn">↻ Actualizar</button>
          </div>
          <div id="bdv-admin-projects-list">Cargando proyectos...</div>
        </div>
      </div>
    `;
    document.body.appendChild(modalRoot);

    document.getElementById("bdv-admin-btn").addEventListener("click", () => {
      modalRoot.style.display = "flex";
    });

    document.getElementById("bdv-admin-close-btn").addEventListener("click", () => {
      modalRoot.style.display = "none";
    });

    document.getElementById("bdv-admin-login-btn").addEventListener("click", () => {
      const pass = document.getElementById("bdv-admin-pass").value;
      if (pass === BDV_ADMIN_KEY) {
        document.getElementById("bdv-admin-auth-view").style.display = "none";
        document.getElementById("bdv-admin-dash-view").style.display = "block";
        loadAdminProjects();
      } else {
        alert("Clave de administrador incorrecta.");
      }
    });

    document.getElementById("bdv-admin-refresh-btn").addEventListener("click", loadAdminProjects);
  }

  function loadAdminProjects() {
    const listEl = document.getElementById("bdv-admin-projects-list");
    listEl.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8;">Consultando proyectos...</p>`;

    fetch(`${BDV_ADMIN_API_URL}?key=${BDV_ADMIN_KEY}`)
      .then(r => r.json())
      .then(res => {
        if (!res.ok || !res.projects || !res.projects.length) {
          listEl.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8;">No hay proyectos activos registrados en la hoja Projects.</p>`;
          return;
        }

        listEl.innerHTML = res.projects.map(p => `
          <div class="bdv-admin-project-item" data-row="${p.row}">
            <div class="bdv-admin-grid-row">
              <div>
                <strong style="color: #f8fafc; font-size: 0.9rem;">${p.name}</strong>
                <span style="font-size: 0.75rem; color: #94a3b8;">(${p.id})</span>
                <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 2px;">
                  Email: ${p.email} | PIN: <span style="color: #e8c861; font-weight: 700;">${p.code}</span>
                </div>
              </div>
              <span class="bdv-tracker-status-tag ${p.accessStatus === 'ACTIVE' ? 'bdv-status-active' : 'bdv-status-disabled'}">
                ${p.accessStatus}
              </span>
            </div>

            <div class="bdv-admin-grid-row" style="margin-top: 10px;">
              <select class="bdv-admin-select" id="stage-select-${p.row}">
                <option value="1" ${p.stage === 1 ? 'selected' : ''}>1. Intake (10%)</option>
                <option value="2" ${p.stage === 2 ? 'selected' : ''}>2. SOW & PIN (25%)</option>
                <option value="3" ${p.stage === 3 ? 'selected' : ''}>3. Arquitectura (45%)</option>
                <option value="4" ${p.stage === 4 ? 'selected' : ''}>4. Core & QA (75%)</option>
                <option value="5" ${p.stage === 5 ? 'selected' : ''}>5. Revisión (90%)</option>
                <option value="6" ${p.stage === 6 ? 'selected' : ''}>6. Release 100% (Disable)</option>
              </select>

              <button type="button" class="bdv-admin-action-btn" onclick="updateProjectStage(${p.row})">
                Guardar y Notificar
              </button>
            </div>
          </div>
        `).join("");
      })
      .catch(() => {
        listEl.innerHTML = `<p style="font-size: 0.8rem; color: #f87171;">Error al conectar con la API de proyectos.</p>`;
      });
  }

  window.updateProjectStage = function (row) {
    const sel = document.getElementById(`stage-select-${row}`);
    const stage = Number(sel.value);
    const accessStatus = stage === 6 ? "DISABLED" : "ACTIVE";

    sel.disabled = true;

    fetch(BDV_ADMIN_API_URL, {
      method: "POST",
      body: JSON.stringify({
        key: BDV_ADMIN_KEY,
        action: "update",
        row: row,
        stage: stage,
        accessStatus: accessStatus
      })
    })
      .then(r => r.json())
      .then(res => {
        sel.disabled = false;
        if (res.ok) {
          alert(`Etapa actualizada a ${stage}/6. Correos enviados automáticamente.`);
          loadAdminProjects();
        } else {
          alert("Error al actualizar la etapa.");
        }
      })
      .catch(() => {
        sel.disabled = false;
        alert("Error de red al actualizar.");
      });
  };

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
    applyClientTrackerModal();
    applyAdminPanel();
    cleanFooterLinksAndApplyLegal(lang);

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
