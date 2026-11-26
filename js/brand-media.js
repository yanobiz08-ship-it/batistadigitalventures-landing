/* Batista Digital Ventures - Core helpers shared by every script (BDV_CORE), legal modals and
 * the request confirmation modal.
 * Phase 2: the old injected banner, products drawer, cabinet tabs, "Cómo operamos" pills and the
 * duplicate services modal were removed; that content now lives as static, bilingual sections in
 * index.html (texts in js/bdv-i18n.js).
 */
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
    return lang.startsWith("en") ? "en" : "es";
  }

  let workflowStages = [
    { stage: 1, percentage: 10, name_es: "Recepción y Filtro de Alcance", name_en: "Intake & Scope Fit Assessment", financial_trigger_es: "Sin costo · Diagnóstico inicial", financial_trigger_en: "No cost · Intake check" },
    { stage: 2, percentage: 25, name_es: "Firma de SOW, Depósito y Activación de Código Secreto", name_en: "SOW Execution, Deposit & Secret Code Issuance", financial_trigger_es: "Depósito inicial liquidado (25%–50%) → Emisión de PIN temporal", financial_trigger_en: "Deposit cleared (25%–50%) → Temporary access PIN issued" },
    { stage: 3, percentage: 45, name_es: "Arquitectura y Entorno Base", name_en: "System Architecture & Base Setup", financial_trigger_es: "En desarrollo · Cubierto por anticipo", financial_trigger_en: "In progress · Covered by deposit" },
    { stage: 4, percentage: 75, name_es: "Construcción y Auditoría Técnica Interna", name_en: "Core Engineering & Internal QA", financial_trigger_es: "Próximo vencimiento: Saldo final para entrega", financial_trigger_en: "Next due: Final balance prior to release" },
    { stage: 5, percentage: 90, name_es: "Inspección de Entrega y Ventana de Revisión", name_en: "Client Inspection & Review Window", financial_trigger_es: "Ventana de 5 días activa · 100% requerido para despliegue", financial_trigger_en: "5-day window open · 100% required for deployment" },
    { stage: 6, percentage: 100, name_es: "Liquidación Final, Traspaso y Expiración de Acceso", name_en: "Final Settlement, Handoff & Portal Disablement", financial_trigger_es: "100% liquidado · Acceso temporal cerrado (no incluye mantenimiento)", financial_trigger_en: "100% settled · Temporary tracker disabled (maintenance not included)" }
  ];

  window.BDV_CORE = {
    apiUrl: BDV_ADMIN_API_URL,
    escapeHtml: escapeHtml,
    getLang: getLang,
    workflowStages: workflowStages,
    getProjectDisplayName: function (p, lang) {
      if (!p) return "";
      if (lang === "es") {
        return p.name_es || p.name || p.name_en || "";
      }
      return p.name_en || p.name || p.name_es || "";
    },
    showConfirmation: function (clientName, reqId, kind) {
      openConfirmationModal(clientName, reqId, getLang(), kind || "quote");
    }
  };

  const copy = {
    es: {
      legalTermsBtn: "Términos de Servicio",
      legalPrivacyBtn: "Política de Privacidad",
      termsTitle: "Términos de Servicio — Batista Digital Ventures LLC",
      termsContent: "<p><strong>Última actualización:</strong> Noviembre 2026 | Domicilio: Lompoc, California.</p><h4>1. Alcance y Cotizaciones</h4><p>Todo proyecto se rige por un Alcance de Trabajo (SOW) por escrito. Funcionalidades adicionales o modificaciones de diseño no contempladas requerirán una orden de cambio y presupuesto complementario.</p><h4>2. Pagos por Hitos y Reserva</h4><p>Los desarrollos requieren un depósito inicial obligatorio antes de programar o diseñar. Los pagos por hitos liquidan el trabajo técnico entregado y no son reembolsables. El saldo final debe quedar 100% saldado antes del despliegue en dominios de producción o tiendas de aplicaciones.</p><h4>3. Propiedad Intelectual</h4><p>La titularidad de los entregables a medida se transfiere al cliente únicamente tras la liquidación íntegra del contrato. La LLC retiene la propiedad de sus librerías base, plantillas y herramientas de ingeniería internas.</p><h4>4. Criterio de Aceptación Objetiva</h4><p>El cliente dispone de 5 días hábiles tras la entrega de un hito para remitir observaciones fundadas. Vencido dicho plazo sin observaciones formales, el hito se considerará legalmente aceptado.</p><h4>5. Limitación de Responsabilidad</h4><p>La responsabilidad total acumulada de Batista Digital Ventures LLC frente al cliente por cualquier reclamación queda limitada estrictamente al monto efectivamente percibido por el servicio contratado. Jurisdicción sujeta a las leyes de California.</p>",
      privacyTitle: "Política de Privacidad — Batista Digital Ventures LLC",
      privacyContent: "<p><strong>Última actualización:</strong> Noviembre 2026 | Responsable: Batista Digital Ventures LLC.</p><h4>1. Tratamiento de Información</h4><p>Recopilamos exclusivamente datos de contacto comercial (nombre, correo corporativo, especificaciones del proyecto) suministrados voluntariamente mediante formularios o correspondencia directa.</p><h4>2. No Venta de Información</h4><p>Batista Digital Ventures LLC no comercializa, transfiere ni cede datos personales a corredores publicitarios ni terceros. La información se utiliza exclusivamente para responder solicitudes, cotizar y coordinar desarrollos.</p><h4>3. Enlaces y Ecosistema</h4><p>Nuestros portales y aplicaciones vinculadas (como TRIVLO, MERQOX y GY Roadside Solutions) aplican sus respectivas políticas de privacidad particulares conforme a su naturaleza y tratamiento de datos de usuarios finales.</p><h4>4. Derechos del Titular</h4><p>Puede solicitar la rectificación o supresión de sus datos de contacto en cualquier momento escribiendo a nuestros canales oficiales en batistadigitalventures.com.</p>"
    },
    en: {
      legalTermsBtn: "Terms of Service",
      legalPrivacyBtn: "Privacy Policy",
      termsTitle: "Terms of Service — Batista Digital Ventures LLC",
      termsContent: "<p><strong>Last Updated:</strong> November 2026 | Principal Office: Lompoc, California.</p><h4>1. Scope and Statements of Work</h4><p>All client engagements are governed by an approved Statement of Work (SOW). Out-of-scope requests or major iterations require written change orders and separate pricing.</p><h4>2. Milestone Payments</h4><p>All projects require an advance deposit before engineering begins. Progress payments cover work completed and are non-refundable. Full settlement is mandatory prior to production release or store publishing.</p><h4>3. Intellectual Property Transfer</h4><p>Final project IP rights transfer exclusively upon 100% full payment. Pre-existing frameworks, design systems, and engineering libraries remain property of the LLC.</p><h4>4. Deemed Acceptance</h4><p>Clients have 5 business days to inspect delivered deliverables. Without substantiated written objections within this window, deliverables are deemed fully accepted.</p><h4>5. Limitation of Liability</h4><p>Total cumulative liability of Batista Digital Ventures LLC is strictly capped at the fees collected for the specific project. Governed under the laws of California.</p>",
      privacyTitle: "Privacy Policy — Batista Digital Ventures LLC",
      privacyContent: "<p><strong>Last Updated:</strong> November 2026 | Controller: Batista Digital Ventures LLC.</p><h4>1. Data Collection</h4><p>We only collect essential business contact information (name, direct email, scope details) submitted voluntarily via contact portals or direct email.</p><h4>2. No Data Brokering</h4><p>Batista Digital Ventures LLC does not sell, rent, or trade personal data to third parties. Information is used strictly to process quotes, service contracts, and platform inquiries.</p><h4>3. Ecosystem Platforms</h4><p>Independent properties (such as TRIVLO, MERQOX, and GY Roadside Solutions) maintain specialized disclosures reflecting their end-user operational workflows.</p><h4>4. Your Rights</h4><p>You may request data deletion or records updates at any time by contacting our official desk at batistadigitalventures.com.</p>"
    }
  };

  function openLegal(kind) {
    const t = copy[getLang()];
    document.getElementById("bdv-modal-title").textContent = kind === "terms" ? t.termsTitle : t.privacyTitle;
    document.getElementById("bdv-modal-body").innerHTML = kind === "terms" ? t.termsContent : t.privacyContent;
    document.getElementById("bdv-legal-modal-root").style.display = "flex";
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

  function applyFooterLegal(lang) {
    const footer = document.querySelector("footer");
    if (!footer) return;
    let legalBar = document.getElementById("bdv-footer-legal-links");
    if (!legalBar) {
      legalBar = document.createElement("div");
      legalBar.id = "bdv-footer-legal-links";
      legalBar.className = "bdv-footer-legal";
      legalBar.innerHTML = `
        <button type="button" id="bdv-btn-terms" class="bdv-link-btn" data-legal-terms-btn></button>
        <span class="bdv-legal-dot" aria-hidden="true">•</span>
        <button type="button" id="bdv-btn-privacy" class="bdv-link-btn" data-legal-privacy-btn></button>
      `;
      const bottom = footer.querySelector(".footer-bottom") || footer.querySelector(".container") || footer;
      bottom.appendChild(legalBar);
      document.getElementById("bdv-btn-terms").addEventListener("click", () => openLegal("terms"));
      document.getElementById("bdv-btn-privacy").addEventListener("click", () => openLegal("privacy"));
    }
    legalBar.querySelector("[data-legal-terms-btn]").textContent = copy[lang].legalTermsBtn;
    legalBar.querySelector("[data-legal-privacy-btn]").textContent = copy[lang].legalPrivacyBtn;
  }

  function openConfirmationModal(clientName, reqId, lang, kind) {
    let confirmRoot = document.getElementById("bdv-exec-confirm-root");
    if (!confirmRoot) {
      confirmRoot = document.createElement("div");
      confirmRoot.id = "bdv-exec-confirm-root";
      confirmRoot.className = "bdv-modal-overlay";
      confirmRoot.style.zIndex = "100000";
      confirmRoot.style.overflowY = "auto";
      confirmRoot.style.padding = "16px";
      document.body.appendChild(confirmRoot);
    }

    const isEs = lang === "es";
    const isPartner = kind === "partner";
    const name = escapeHtml(clientName);
    const ref = escapeHtml(reqId || "BDV");
    const title = isPartner
      ? (isEs ? "Postulación recibida" : "Application received")
      : (isEs ? "Solicitud recibida" : "Request received");
    const badge = "BATISTA DIGITAL VENTURES LLC";
    const greeting = isPartner
      ? (isEs ? `Gracias, ${name}. Recibimos tu postulación a la red de partners de BDV.` : `Thanks, ${name}. We received your application to the BDV partner network.`)
      : (isEs ? `Gracias, ${name}. Recibimos tu solicitud y te enviamos una confirmación a tu correo.` : `Thanks, ${name}. We received your request and sent a confirmation to your email.`);
    const detail = isPartner
      ? (isEs ? `Revisaremos tu perfil y te escribiremos cuando haya un proyecto que encaje contigo. Referencia: ${ref}.` : `We'll review your profile and reach out when there's a project that fits you. Reference: ${ref}.`)
      : (isEs ? `Revisaremos tu proyecto y te responderemos por correo con los siguientes pasos. Referencia: ${ref}.` : `We'll review your project and reply by email with the next steps. Reference: ${ref}.`);
    const btnText = isEs ? "Entendido" : "Got it";

    confirmRoot.innerHTML = `
      <div class="bdv-tracker-card" style="max-width: 480px; width: 100%; margin: 20px auto; border: 1px solid rgba(212, 175, 55, 0.55); background: #0b0f17; padding: 22px; border-radius: 14px;">
        <div style="font-size: 0.7rem; letter-spacing: 0.08em; color: #e8c861; font-weight: 700; margin-bottom: 6px;">${badge}</div>
        <h3 style="margin: 0 0 10px 0; font-size: 1.15rem; color: #f8fafc;">${title}</h3>
        <p style="font-size: 0.9rem; color: #e2e8f0; line-height: 1.5; margin: 0 0 10px 0;">${greeting}</p>
        <p style="font-size: 0.82rem; color: #94a3b8; line-height: 1.5; margin: 0 0 18px 0;">${detail}</p>
        <button type="button" id="bdv-exec-confirm-close" class="bdv-tracker-btn" style="width: 100%; background: #e8c861 !important; color: #070a10 !important; font-weight: 700;">${btnText}</button>
      </div>
    `;
    confirmRoot.style.setProperty("display", "block", "important");
    document.getElementById("bdv-exec-confirm-close").onclick = () => {
      confirmRoot.style.setProperty("display", "none", "important");
    };
    confirmRoot.onclick = (e) => {
      if (e.target === confirmRoot) confirmRoot.style.setProperty("display", "none", "important");
    };
  }

  function loadCompanyData() {
    Promise.all([
      fetch("./bdv-company/foundations.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("./bdv-company/workflow-progress.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    ]).then(([foundData, wfData]) => {
      ["es", "en"].forEach((langKey) => {
        if (foundData && foundData[langKey]) {
          keysFrom(foundData[langKey]).forEach((k) => {
            if (k in copy[langKey]) copy[langKey][k] = foundData[langKey][k];
          });
        }
      });
      if (wfData && Array.isArray(wfData.progress_stages) && wfData.progress_stages.length) {
        workflowStages = wfData.progress_stages;
        window.BDV_CORE.workflowStages = workflowStages;
      }
      syncAll();
    });
  }

  function keysFrom(o) {
    return o && typeof o === "object" ? Object.keys(o) : [];
  }

  function syncAll() {
    const lang = getLang();
    applyLegalModals();
    applyFooterLegal(lang);
    if (window.BDV_OPS && typeof window.BDV_OPS.onLanguageChange === "function") {
      window.BDV_OPS.onLanguageChange();
    }
  }

  function init() {
    syncAll();
    loadCompanyData();
    document.addEventListener("bdv:lang", syncAll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
