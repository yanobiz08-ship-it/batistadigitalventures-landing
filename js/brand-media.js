/* Batista Digital Ventures - core helpers shared by every script (window.BDV_CORE), the legal
 * modals opened from the footer buttons, and the request confirmation modal.
 * Page texts live in js/bdv-i18n.js; the long legal texts live here.
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

  // The 6 project stages shown by the client progress viewer (bdv-ops-panel.js).
  const workflowStages = [
    { stage: 1, percentage: 10, name_es: "Recepción y Filtro de Alcance", name_en: "Intake & Scope Fit Assessment" },
    { stage: 2, percentage: 25, name_es: "Firma de SOW, Depósito y Activación de Código Secreto", name_en: "SOW Execution, Deposit & Secret Code Issuance" },
    { stage: 3, percentage: 45, name_es: "Arquitectura y Entorno Base", name_en: "System Architecture & Base Setup" },
    { stage: 4, percentage: 75, name_es: "Construcción y Auditoría Técnica Interna", name_en: "Core Engineering & Internal QA" },
    { stage: 5, percentage: 90, name_es: "Inspección de Entrega y Ventana de Revisión", name_en: "Client Inspection & Review Window" },
    { stage: 6, percentage: 100, name_es: "Liquidación Final, Traspaso y Expiración de Acceso", name_en: "Final Settlement, Handoff & Portal Disablement" }
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
      openConfirmationModal(clientName, reqId, kind || "quote");
    }
  };

  const copy = {
    es: {
      termsTitle: "Términos de Servicio — Batista Digital Ventures LLC",
      termsContent: "<p><strong>Última actualización:</strong> Noviembre 2026 | Domicilio: Lompoc, California.</p><h4>1. Alcance y Cotizaciones</h4><p>Todo proyecto se rige por un Alcance de Trabajo (SOW) por escrito. Funcionalidades adicionales o modificaciones de diseño no contempladas requerirán una orden de cambio y presupuesto complementario.</p><h4>2. Pagos por Hitos y Reserva</h4><p>Los desarrollos requieren un depósito inicial obligatorio antes de programar o diseñar. Los pagos por hitos liquidan el trabajo técnico entregado y no son reembolsables. El saldo final debe quedar 100% saldado antes del despliegue en dominios de producción o tiendas de aplicaciones.</p><h4>3. Propiedad Intelectual</h4><p>La titularidad de los entregables a medida se transfiere al cliente únicamente tras la liquidación íntegra del contrato. La LLC retiene la propiedad de sus librerías base, plantillas y herramientas de ingeniería internas.</p><h4>4. Criterio de Aceptación Objetiva</h4><p>El cliente dispone de 5 días hábiles tras la entrega de un hito para remitir observaciones fundadas. Vencido dicho plazo sin observaciones formales, el hito se considerará legalmente aceptado.</p><h4>5. Limitación de Responsabilidad</h4><p>La responsabilidad total acumulada de Batista Digital Ventures LLC frente al cliente por cualquier reclamación queda limitada estrictamente al monto efectivamente percibido por el servicio contratado. Jurisdicción sujeta a las leyes de California.</p>",
      privacyTitle: "Política de Privacidad — Batista Digital Ventures LLC",
      privacyContent: "<p><strong>Última actualización:</strong> Noviembre 2026 | Responsable: Batista Digital Ventures LLC.</p><h4>1. Tratamiento de Información</h4><p>Recopilamos exclusivamente datos de contacto comercial (nombre, correo corporativo, especificaciones del proyecto) suministrados voluntariamente mediante formularios o correspondencia directa.</p><h4>2. No Venta de Información</h4><p>Batista Digital Ventures LLC no comercializa, transfiere ni cede datos personales a corredores publicitarios ni terceros. La información se utiliza exclusivamente para responder solicitudes, cotizar y coordinar desarrollos.</p><h4>3. Enlaces y Ecosistema</h4><p>Nuestros portales y aplicaciones vinculadas (como TRIVLO, MERQOX y GY Roadside Solutions) aplican sus respectivas políticas de privacidad particulares conforme a su naturaleza y tratamiento de datos de usuarios finales.</p><h4>4. Derechos del Titular</h4><p>Puede solicitar la rectificación o supresión de sus datos de contacto en cualquier momento escribiendo a nuestros canales oficiales en batistadigitalventures.com.</p>"
    },
    en: {
      termsTitle: "Terms of Service — Batista Digital Ventures LLC",
      termsContent: "<p><strong>Last Updated:</strong> November 2026 | Principal Office: Lompoc, California.</p><h4>1. Scope and Statements of Work</h4><p>All client engagements are governed by an approved Statement of Work (SOW). Out-of-scope requests or major iterations require written change orders and separate pricing.</p><h4>2. Milestone Payments</h4><p>All projects require an advance deposit before engineering begins. Progress payments cover work completed and are non-refundable. Full settlement is mandatory prior to production release or store publishing.</p><h4>3. Intellectual Property Transfer</h4><p>Final project IP rights transfer exclusively upon 100% full payment. Pre-existing frameworks, design systems, and engineering libraries remain property of the LLC.</p><h4>4. Deemed Acceptance</h4><p>Clients have 5 business days to inspect delivered deliverables. Without substantiated written objections within this window, deliverables are deemed fully accepted.</p><h4>5. Limitation of Liability</h4><p>Total cumulative liability of Batista Digital Ventures LLC is strictly capped at the fees collected for the specific project. Governed under the laws of California.</p>",
      privacyTitle: "Privacy Policy — Batista Digital Ventures LLC",
      privacyContent: "<p><strong>Last Updated:</strong> November 2026 | Controller: Batista Digital Ventures LLC.</p><h4>1. Data Collection</h4><p>We only collect essential business contact information (name, direct email, scope details) submitted voluntarily via contact portals or direct email.</p><h4>2. No Data Brokering</h4><p>Batista Digital Ventures LLC does not sell, rent, or trade personal data to third parties. Information is used strictly to process quotes, service contracts, and platform inquiries.</p><h4>3. Ecosystem Platforms</h4><p>Independent properties (such as TRIVLO, MERQOX, and GY Roadside Solutions) maintain specialized disclosures reflecting their end-user operational workflows.</p><h4>4. Your Rights</h4><p>You may request data deletion or records updates at any time by contacting our official desk at batistadigitalventures.com.</p>"
    }
  };

  let openLegalKind = null;

  function openLegal(kind) {
    openLegalKind = kind;
    const t = copy[getLang()];
    document.getElementById("bdv-modal-title").textContent = kind === "terms" ? t.termsTitle : t.privacyTitle;
    document.getElementById("bdv-modal-body").innerHTML = kind === "terms" ? t.termsContent : t.privacyContent;
    document.getElementById("bdv-legal-modal-root").style.display = "flex";
  }

  function applyLegalModals() {

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

  function bindFooterLegal() {
    const terms = document.getElementById("bdv-btn-terms");
    const privacy = document.getElementById("bdv-btn-privacy");
    if (terms) terms.addEventListener("click", () => openLegal("terms"));
    if (privacy) privacy.addEventListener("click", () => openLegal("privacy"));
  }

  function openConfirmationModal(clientName, reqId, kind) {
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

    const isPartner = kind === "partner";
    const fill = (key) =>
      escapeHtml(window.BDV_t(key)).split("{name}").join(escapeHtml(clientName)).split("{ref}").join(escapeHtml(reqId || "BDV"));
    const title = fill(isPartner ? "cfTitlePartner" : "cfTitleQuote");
    const badge = "BATISTA DIGITAL VENTURES LLC";
    const greeting = fill(isPartner ? "cfGreetPartner" : "cfGreetQuote");
    const detail = fill(isPartner ? "cfDetailPartner" : "cfDetailQuote");
    const btnText = fill("cfOk");

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

  function init() {
    applyLegalModals();
    bindFooterLegal();
    // Keep an open legal modal in the selected language.
    document.addEventListener("bdv:lang", () => {
      const root = document.getElementById("bdv-legal-modal-root");
      if (openLegalKind && root && root.style.display !== "none") openLegal(openLegalKind);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
