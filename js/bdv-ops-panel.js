/* Batista Digital Ventures - Operational Dashboard, Partner Workflows & Client Progress Tracker */
(function () {
  function getCore() {
    return window.BDV_CORE || {
      apiUrl: "https://bdv-backend-api.yanobiz08.workers.dev",
      escapeHtml: function (s) {
        return String(s || "")
          .split("&").join("&amp;")
          .split("<").join("&lt;")
          .split(">").join("&gt;")
          .split('"').join("&quot;")
          .split("'").join("&#039;");
      },
      getLang: function () {
        var l = (document.documentElement.getAttribute("lang") || "").toLowerCase();
        return l.indexOf("es") === 0 ? "es" : "en";
      },
      getProjectDisplayName: function (p) {
        return p ? p.name : "";
      },
      workflowStages: [
        { stage: 1, percentage: 10, name_es: "Recepción y Filtro de Alcance", name_en: "Intake & Scope Fit Assessment" },
        { stage: 2, percentage: 25, name_es: "Firma de SOW, Depósito y Activación de Código Secreto", name_en: "SOW Execution, Deposit & Secret Code Issuance" },
        { stage: 3, percentage: 45, name_es: "Arquitectura y Entorno Base", name_en: "System Architecture & Base Setup" },
        { stage: 4, percentage: 75, name_es: "Construcción y Auditoría Técnica Interna", name_en: "Core Engineering & Internal QA" },
        { stage: 5, percentage: 90, name_es: "Inspección de Entrega y Ventana de Revisión", name_en: "Client Inspection & Review Window" },
        { stage: 6, percentage: 100, name_es: "Liquidación Final, Traspaso y Expiración de Acceso", name_en: "Final Settlement, Handoff & Portal Disablement" }
      ]
    };
  }

  window.__bdvStoredRequests = [];

  // Partner-network applications arrive through the same Worker action ("request_services").
  // The current Worker only stores clientName/clientEmail/businessName/services/notes, so we
  // recognise them by the markers the site sends (js/bdv-site.js) and also by requestType, in case
  // the Worker starts storing it.
  function isPartnerApplication(r) {
    if (!r) return false;
    if (String(r.requestType || r.type || "").toLowerCase() === "partner_application") return true;
    var services = Array.isArray(r.services) ? r.services : [];
    if (services.some(function (sv) { return /^partner application$/i.test(String(sv).trim()); })) return true;
    if (/^partner application/i.test(String(r.businessName || "").trim())) return true;
    return /^\[PARTNER APPLICATION/i.test(String(r.notes || "").trim());
  }
  function isValidEmailSimple(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  window.__bdvStoredProjects = [];

  function showAdminToast(message, isSuccess) {
    var banner = document.getElementById("bdv-admin-action-banner");
    if (!banner) {
      var dash = document.getElementById("bdv-admin-dash-view");
      if (!dash) return;
      banner = document.createElement("div");
      banner.id = "bdv-admin-action-banner";
      banner.style.cssText = "margin-top: 10px; padding: 10px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600;";
      dash.insertBefore(banner, dash.firstChild);
    }
    banner.style.display = "block";
    banner.style.background = isSuccess ? "rgba(74, 222, 128, 0.14)" : "rgba(248, 113, 113, 0.14)";
    banner.style.border = isSuccess ? "1px solid rgba(74, 222, 128, 0.45)" : "1px solid rgba(248, 113, 113, 0.45)";
    banner.style.color = isSuccess ? "#4ade80" : "#f87171";
    banner.textContent = message;
    banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function showOpsPromptCard(options) {
    var opts = options || {};
    var core = getCore();
    var dash = document.getElementById("bdv-admin-dash-view") || document.getElementById("bdv-admin-modal-root");
    if (!dash) {
      if (typeof opts.onConfirm === "function") opts.onConfirm();
      return;
    }

    var existingCard = document.getElementById("bdv-ops-inline-prompt");
    if (existingCard) existingCard.remove();

    var card = document.createElement("div");
    card.id = "bdv-ops-inline-prompt";
    card.style.cssText =
      "margin-top: 12px; padding: 14px; border-radius: 10px; background: #0b0f17; border: 1px solid rgba(212, 175, 55, 0.65); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);";

    var titleHtml =
      '<div style="font-size: 0.88rem; font-weight: 700; color: #e8c861; margin-bottom: 6px;">' +
      core.escapeHtml(opts.title || "Confirmación requerida") +
      "</div>";

    var bodyHtml =
      '<div style="font-size: 0.8rem; color: #e2e8f0; line-height: 1.45; white-space: pre-line;">' +
      core.escapeHtml(opts.message || "") +
      "</div>";

    var actionsHtml = '<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">';
    if (opts.confirmLabel) {
      actionsHtml +=
        '<button type="button" id="bdv-prompt-confirm-btn" class="bdv-admin-action-btn" style="background: #e8c861 !important; color: #070a10 !important; font-weight: 700;">' +
        core.escapeHtml(opts.confirmLabel) +
        "</button>";
    }
    if (opts.cancelLabel) {
      actionsHtml +=
        '<button type="button" id="bdv-prompt-cancel-btn" class="bdv-admin-toggle-status">' +
        core.escapeHtml(opts.cancelLabel) +
        "</button>";
    }
    actionsHtml += "</div>";

    card.innerHTML = titleHtml + bodyHtml + actionsHtml;
    dash.insertBefore(card, dash.firstChild);
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });

    var confirmBtn = document.getElementById("bdv-prompt-confirm-btn");
    var cancelBtn = document.getElementById("bdv-prompt-cancel-btn");

    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        card.remove();
        if (typeof opts.onConfirm === "function") opts.onConfirm();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        card.remove();
        if (typeof opts.onCancel === "function") opts.onCancel();
      });
    }
  }

  window.copySowLinkWithNotice = function (sowUrl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(sowUrl).catch(function () { return null; });
    }
    showAdminToast("✓ Enlace SOW copiado al portapapeles: " + sowUrl, true);
  };

  function refreshAdminSessionView(noticeText) {
    var passInput = document.getElementById("bdv-admin-pass");
    if (passInput) passInput.value = "";
    var createBox = document.getElementById("bdv-create-project-box");
    if (createBox) createBox.style.display = "none";
    var createSowBox = document.getElementById("bdv-create-sow-box");
    if (createSowBox) createSowBox.style.display = "none";
    var keyBox = document.getElementById("bdv-key-change-box");
    if (keyBox) keyBox.style.display = "none";
    if (noticeText) {
      showAdminToast(noticeText, true);
    }
    loadAdminProjects();
  }

  function resetAdminPanelState(modalRoot) {
    window.__bdvSessionKey = "";
    window.__bdvIsAdmin = false;

    if (modalRoot) {
      modalRoot.style.setProperty("display", "none", "important");
      modalRoot.scrollTop = 0;
      var card = modalRoot.querySelector(".bdv-admin-card");
      if (card) card.scrollTop = 0;
    }

    var passInput = document.getElementById("bdv-admin-pass");
    if (passInput) passInput.value = "";

    var authMsg = document.getElementById("bdv-admin-auth-msg");
    if (authMsg) authMsg.style.display = "none";

    var authView = document.getElementById("bdv-admin-auth-view");
    if (authView) authView.style.display = "block";

    var dashView = document.getElementById("bdv-admin-dash-view");
    if (dashView) dashView.style.display = "none";

    var createBox = document.getElementById("bdv-create-project-box");
    if (createBox) createBox.style.display = "none";

    var createSowBox = document.getElementById("bdv-create-sow-box");
    if (createSowBox) createSowBox.style.display = "none";

    var keyBox = document.getElementById("bdv-key-change-box");
    if (keyBox) keyBox.style.display = "none";

    var toastBanner = document.getElementById("bdv-admin-action-banner");
    if (toastBanner) toastBanner.style.display = "none";

    var inlinePrompt = document.getElementById("bdv-ops-inline-prompt");
    if (inlinePrompt) inlinePrompt.remove();
  }

  function openAdminModal() {
    applyAdminPanel();
    var m = document.getElementById("bdv-admin-modal-root");
    if (!m) return;
    resetAdminPanelState(m);
    m.style.setProperty("display", "flex", "important");
    setTimeout(function () {
      var passInput = document.getElementById("bdv-admin-pass");
      if (passInput) passInput.focus();
    }, 60);
  }

  function applyClientTrackerModal() {
    if (document.getElementById("bdv-tracker-modal-root")) return;

    var modalRoot = document.createElement("div");
    modalRoot.id = "bdv-tracker-modal-root";
    modalRoot.className = "bdv-modal-overlay";
    modalRoot.style.display = "none";

    modalRoot.innerHTML = [
      '<div class="bdv-tracker-card">',
      '  <div class="bdv-modal-top">',
      '    <h3 style="margin: 0; font-size: 1.05rem; color: #e8c861;">Visor de Progreso · BDV LLC</h3>',
      '    <button type="button" id="bdv-tracker-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>',
      "  </div>",
      '  <p style="font-size: 0.82rem; color: #94a3b8; margin: 8px 0 14px 0;">',
      "    Acceso de solo lectura mediante tu correo y el código secreto temporal asignado al liquidar el depósito.",
      "  </p>",
      '  <form id="bdv-tracker-query-form" class="bdv-tracker-form">',
      '    <input type="email" id="bdv-track-email" class="bdv-tracker-input" placeholder="tu-correo@empresa.com" required />',
      '    <input type="text" id="bdv-track-pin" class="bdv-tracker-input" placeholder="Código secreto (ej. BDV-7492)" required />',
      '    <button type="submit" class="bdv-tracker-btn">Consultar Avance</button>',
      "  </form>",
      '  <div id="bdv-track-result-box" style="display: none;" class="bdv-tracker-result"></div>',
      '  <p class="bdv-tracker-disclaimer">',
      "    Nota: Este portal es de solo lectura y se inhabilita de inmediato al liquidar el 100% y entregarse el proyecto. No incluye soporte post-entrega ni mantenimiento mensual.",
      "  </p>",
      "</div>"
    ].join("");
    document.body.appendChild(modalRoot);

    document.getElementById("bdv-tracker-close-btn").addEventListener("click", function () {
      modalRoot.style.display = "none";
    });

    modalRoot.addEventListener("click", function (e) {
      if (e.target === modalRoot) modalRoot.style.display = "none";
    });

    var form = document.getElementById("bdv-tracker-query-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var core = getCore();
      var email = (document.getElementById("bdv-track-email").value || "").trim().toLowerCase();
      var pin = (document.getElementById("bdv-track-pin").value || "").trim().toUpperCase();
      var resBox = document.getElementById("bdv-track-result-box");
      var lang = core.getLang();

      if (!email || !pin) return;

      resBox.style.display = "block";
      resBox.innerHTML = '<p style="font-size: 0.8rem; color: #94a3b8;">Verificando credenciales...</p>';

      // POST so the client code never ends up in URLs / logs (Worker action "client_lookup", rate-limited).
      fetch(core.apiUrl, {
        method: "POST",
        body: JSON.stringify({ action: "client_lookup", email: email, code: pin })
      })
        .then(function (r) { return r.json().then(function (j) { j.__status = r.status; return j; }); })
        .then(function (res) {
          if (res.__status === 429) {
            resBox.innerHTML =
              '<p style="font-size: 0.82rem; color: #f87171; margin: 0;">' +
              (lang === "en"
                ? "Too many attempts. Please wait a few minutes and try again."
                : "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.") +
              "</p>";
            return;
          }
          if (!res.ok || !res.project) {
            resBox.innerHTML =
              '<p style="font-size: 0.82rem; color: #f87171; margin: 0;">' +
              (lang === "en"
                ? "Credentials not found or expired. Check your welcome email or contact management."
                : "Credenciales no encontradas o expiradas. Revisa tu correo de bienvenida o contacta a soporte.") +
              "</p>";
            return;
          }

          var matched = res.project;
          var stages = core.workflowStages || [];

          if (matched.accessStatus === "DISABLED" || matched.stage === 6) {
            resBox.innerHTML =
              '<span class="bdv-tracker-status-tag bdv-status-disabled">Acceso Expirado / Inhabilitado</span>' +
              '<h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Proyecto Liquidado al 100%</h4>' +
              '<p style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0;">El software fue entregado y las credenciales maestras fueron traspasadas. El visor temporal ha concluido. Para soporte técnico continuo, contacte una póliza mensual.</p>';
          } else {
            var stObj = stages[matched.stage - 1] || stages[0] || { stage: 1, percentage: 10, name_es: "Intake", name_en: "Intake" };
            var stName = lang === "en" ? stObj.name_en : stObj.name_es;
            var projDisplayName = core.getProjectDisplayName(matched, lang);
            resBox.innerHTML =
              '<span class="bdv-tracker-status-tag bdv-status-active">Acceso Activo · Obra en Progreso</span>' +
              '<h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Etapa ' + matched.stage + "/6: " + stName + " (" + stObj.percentage + "%)</h4>" +
              '<p style="font-size: 0.8rem; color: #cbd5e1; margin: 6px 0;"><strong>Proyecto:</strong> ' + core.escapeHtml(projDisplayName) + " (" + core.escapeHtml(matched.id) + ")</p>" +
              '<p style="font-size: 0.8rem; color: #e8c861; margin: 6px 0;"><strong>Estado Financiero:</strong> ' + core.escapeHtml(matched.paymentStatus) + "</p>" +
              '<div class="bdv-progress-track" style="margin-top: 8px;"><div class="bdv-progress-fill" style="width: ' + stObj.percentage + '%;"></div></div>';
          }
        })
        .catch(function () {
          resBox.innerHTML =
            '<p style="font-size: 0.82rem; color: #f87171; margin: 0;">' +
            (lang === "en" ? "Connection error. Please try again." : "Error al conectar con el servidor. Intenta de nuevo.") +
            "</p>";
        });
    });
  }

  // The public "⚙ Panel Admin / Dev" footer button was removed (phase 1).
  // The panel now opens only through the private hash  #bdv-ops  (see ADMIN_HASH below)
  // or by calling window.BDV_OPS.openAdmin() from the browser console.
  function applyAdminPanel() {
    var modalRoot = document.getElementById("bdv-admin-modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "bdv-admin-modal-root";
      modalRoot.className = "bdv-modal-overlay";
      modalRoot.style.cssText = "display: none; position: fixed; inset: 0; z-index: 99999 !important; overflow-y: auto; align-items: flex-start; padding: 18px 10px;";

      modalRoot.innerHTML = [
        '<div class="bdv-admin-card" style="max-height: 88vh; overflow-y: auto; margin: auto;">',
        '  <div class="bdv-modal-top">',
        '    <h3 id="bdv-admin-modal-title" style="margin: 0; color: #e8c861; font-size: 1.1rem;">⚙ Control Operativo · BDV LLC</h3>',
        '    <button type="button" id="bdv-admin-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>',
        "  </div>",
        '  <div id="bdv-admin-auth-view" style="margin-top: 15px;">',
        '    <input type="password" id="bdv-admin-pass" class="bdv-tracker-input" style="width: 100%;" placeholder="Ingresa tu clave (Admin o Programador)" />',
        '    <button type="button" id="bdv-admin-login-btn" class="bdv-tracker-btn" style="width: 100%; margin-top: 10px;">Acceder al Panel</button>',
        '    <div id="bdv-admin-auth-msg" style="display: none; margin-top: 10px; font-size: 0.82rem; color: #f87171;"></div>',
        "  </div>",
        '  <div id="bdv-admin-dash-view" style="display: none; margin-top: 15px;">',
        '    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">',
        '      <h4 id="bdv-admin-role-label" style="margin: 0; font-size: 0.95rem;">Proyectos</h4>',
        '      <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">',
        '        <button type="button" id="bdv-toggle-create-project-btn" class="bdv-admin-action-btn" style="display: none; background: #22c55e !important; color: #052e16 !important; font-weight: 700;">+ Nuevo Proyecto</button>',
        '        <button type="button" id="bdv-toggle-create-sow-btn" class="bdv-admin-action-btn" style="display: none; background: #e8c861 !important; color: #070a10 !important; font-weight: 700;">+ Emitir SOW</button>',
        '        <button type="button" id="bdv-toggle-key-change-btn" class="bdv-admin-toggle-status">🔐 Cambiar Clave</button>',
        '        <button type="button" id="bdv-admin-refresh-btn" class="bdv-admin-action-btn">↻</button>',
        "      </div>",
        "    </div>",
        '    <div id="bdv-create-project-box" style="display: none; margin-top: 12px; padding: 12px; background: rgba(34, 197, 94, 0.06); border: 1px dashed rgba(34, 197, 94, 0.45); border-radius: 8px;">',
        '      <h5 style="margin: 0 0 8px 0; font-size: 0.85rem; color: #4ade80;">Alta de Nuevo Proyecto</h5>',
        '      <div style="display: flex; flex-direction: column; gap: 8px;">',
        '        <input type="text" id="bdv-np-name-en" class="bdv-tracker-input" placeholder="Project Name in English (default)" style="font-size: 0.8rem; padding: 6px 10px;" />',
        '        <input type="text" id="bdv-np-name-es" class="bdv-tracker-input" placeholder="Nombre del Proyecto en Español (opcional)" style="font-size: 0.8rem; padding: 6px 10px;" />',
        '        <div style="display: flex; gap: 8px; flex-wrap: wrap;">',
        '          <input type="email" id="bdv-np-email" class="bdv-tracker-input" placeholder="Correo del Cliente" style="flex: 2; min-width: 180px; font-size: 0.8rem; padding: 6px 10px;" />',
        '          <input type="text" id="bdv-np-code" class="bdv-tracker-input" placeholder="PIN (ej. CL-2026)" style="flex: 1; min-width: 110px; font-size: 0.8rem; padding: 6px 10px;" />',
        "        </div>",
        '        <button type="button" id="bdv-np-submit-btn" class="bdv-tracker-btn" style="padding: 8px; font-size: 0.82rem; margin-top: 2px;" onclick="submitNewProject()">Guardar y Activar Proyecto</button>',
        "      </div>",
        '      <div id="bdv-np-status-msg" style="display: none; margin-top: 8px; font-size: 0.8rem;"></div>',
        "    </div>",
        '    <div id="bdv-create-sow-box" style="display: none; margin-top: 12px; padding: 12px; background: rgba(212, 175, 55, 0.08); border: 1px dashed rgba(212, 175, 55, 0.55); border-radius: 8px;">',
        '      <h5 style="margin: 0 0 8px 0; font-size: 0.85rem; color: #e8c861;">📄 Emitir Statement of Work (SOW) y Generar Enlace de Firma</h5>',
        '      <div style="display: flex; flex-direction: column; gap: 8px;">',
        '        <input type="text" id="bdv-ns-client-name" class="bdv-tracker-input" placeholder="Nombre Completo del Cliente" style="font-size: 0.8rem; padding: 6px 10px;" />',
        '        <input type="email" id="bdv-ns-client-email" class="bdv-tracker-input" placeholder="Correo Oficial del Cliente" style="font-size: 0.8rem; padding: 6px 10px;" />',
        '        <input type="text" id="bdv-ns-biz-name" class="bdv-tracker-input" placeholder="Nombre Comercial o Empresa" style="font-size: 0.8rem; padding: 6px 10px;" />',
        '        <textarea id="bdv-ns-scope" class="bdv-tracker-input" rows="2" placeholder="Resumen del alcance acordado en la entrevista..." style="font-size: 0.8rem; padding: 6px 10px; resize: vertical;"></textarea>',
        '        <div style="display: flex; gap: 8px; flex-wrap: wrap;">',
        '          <input type="number" id="bdv-ns-total" class="bdv-tracker-input" placeholder="Presupuesto Total USD (ej. 850)" style="flex: 1; min-width: 140px; font-size: 0.8rem; padding: 6px 10px;" />',
        '          <input type="number" id="bdv-ns-deposit" class="bdv-tracker-input" placeholder="Depósito Inicial USD (ej. 300)" style="flex: 1; min-width: 140px; font-size: 0.8rem; padding: 6px 10px;" />',
        "        </div>",
        '        <button type="button" id="bdv-ns-submit-btn" class="bdv-tracker-btn" style="padding: 8px; font-size: 0.82rem; background: #e8c861 !important; color: #070a10 !important; font-weight: 700;" onclick="submitNewSowManual()">Generar Folio y Enlace SOW</button>',
        "      </div>",
        '      <div id="bdv-ns-status-msg" style="display: none; margin-top: 8px; font-size: 0.82rem;"></div>',
        "    </div>",
        '    <div id="bdv-admin-requests-section" style="display: none; margin-top: 14px; padding: 10px; background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 8px;">',
        '      <h5 style="margin: 0 0 8px 0; font-size: 0.82rem; color: #e8c861;">📨 Solicitudes de Servicio Entrantes <span id="bdv-admin-requests-count"></span></h5>',
        '      <div id="bdv-admin-requests-list" style="font-size: 0.78rem; display: flex; flex-direction: column; gap: 8px;"></div>',
        "    </div>",
        '    <div id="bdv-admin-partners-section" style="display: none; margin-top: 14px; padding: 10px; background: rgba(52, 211, 153, 0.05); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 8px;">',
        '      <h5 style="margin: 0 0 8px 0; font-size: 0.82rem; color: #34d399;">🤝 Postulaciones a la Red de Partners <span id="bdv-admin-partners-count"></span></h5>',
        '      <div id="bdv-admin-partners-list" style="font-size: 0.78rem; display: flex; flex-direction: column; gap: 8px;"></div>',
        "    </div>",
        '    <div id="bdv-key-change-box" style="display: none; margin-top: 12px; padding: 12px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(212,175,55,0.3); border-radius: 8px;">',
        '      <p style="font-size: 0.8rem; color: #cbd5e1; margin: 0 0 8px 0;">Ingresa tu nueva clave de acceso para este rol:</p>',
        '      <div style="display: flex; gap: 8px;">',
        '        <input type="password" id="bdv-new-role-pass" class="bdv-tracker-input" placeholder="Nueva clave (mín. 6 letras/números)" style="flex: 1; padding: 6px 10px; font-size: 0.82rem;" />',
        '        <button type="button" class="bdv-admin-action-btn" onclick="submitPasswordChange()">Guardar Clave</button>',
        "      </div>",
        '      <div id="bdv-key-status-msg" style="display: none; margin-top: 8px; font-size: 0.82rem;"></div>',
        "    </div>",
        '    <div id="bdv-admin-projects-list" style="margin-top: 14px;">Cargando proyectos...</div>',
        "  </div>",
        "</div>"
      ].join("");
      document.body.appendChild(modalRoot);

      function triggerAdminLogin() {
        var pass = (document.getElementById("bdv-admin-pass").value || "").trim();
        var authMsg = document.getElementById("bdv-admin-auth-msg");
        if (!pass) {
          if (authMsg) {
            authMsg.style.display = "block";
            authMsg.textContent = "Ingresa tu clave de acceso.";
          }
          return;
        }
        if (authMsg) authMsg.style.display = "none";
        window.__bdvSessionKey = pass;
        document.getElementById("bdv-admin-auth-view").style.display = "none";
        document.getElementById("bdv-admin-dash-view").style.display = "block";
        loadAdminProjects();
      }

      document.getElementById("bdv-admin-close-btn").addEventListener("click", function () {
        resetAdminPanelState(modalRoot);
      });

      modalRoot.addEventListener("click", function (e) {
        if (e.target === modalRoot) {
          resetAdminPanelState(modalRoot);
        }
      });

      document.getElementById("bdv-admin-login-btn").addEventListener("click", triggerAdminLogin);

      document.getElementById("bdv-admin-pass").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          triggerAdminLogin();
        }
      });

      document.getElementById("bdv-admin-refresh-btn").addEventListener("click", loadAdminProjects);

      document.getElementById("bdv-toggle-create-project-btn").addEventListener("click", function () {
        var box = document.getElementById("bdv-create-project-box");
        var sowBox = document.getElementById("bdv-create-sow-box");
        if (sowBox) sowBox.style.display = "none";
        if (box) box.style.display = box.style.display === "none" ? "block" : "none";
      });

      document.getElementById("bdv-toggle-create-sow-btn").addEventListener("click", function () {
        var box = document.getElementById("bdv-create-sow-box");
        var pBox = document.getElementById("bdv-create-project-box");
        if (pBox) pBox.style.display = "none";
        if (box) box.style.display = box.style.display === "none" ? "block" : "none";
      });

      document.getElementById("bdv-toggle-key-change-btn").addEventListener("click", function () {
        var box = document.getElementById("bdv-key-change-box");
        if (box) box.style.display = box.style.display === "none" ? "block" : "none";
      });
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest("#bdv-admin-btn") : null;
    if (!btn) return;
    e.preventDefault();
    openAdminModal();
  });

  window.generateSowForProject = function (row, clientName, clientEmail, businessName, scopeSummary) {
    var core = getCore();
    var sessionKey = window.__bdvSessionKey || "";
    var rowStatus = document.getElementById("row-status-" + row);

    if (rowStatus) {
      rowStatus.style.display = "block";
      rowStatus.style.color = "#94a3b8";
      rowStatus.textContent = "Generando SOW y creando enlace en el Worker...";
    }

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "create_sow",
        projectRow: Number(row),
        clientName: clientName || businessName || "Cliente",
        clientEmail: clientEmail || "",
        businessName: businessName || "",
        scopeSummary: scopeSummary || "Desarrollo conforme a diagnóstico inicial.",
        totalAmount: 650,
        depositAmount: 250
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!rowStatus) return;
        if (res.ok && res.sowId) {
          var sowUrl = res.sowUrl || ("https://batistadigitalventures.com/?sow=" + res.sowId);
          rowStatus.style.color = "#4ade80";
          rowStatus.innerHTML =
            '✓ SOW Creado: <strong style="color: #f8fafc;">' + core.escapeHtml(res.sowId) + "</strong><br/>" +
            '<a href="' + core.escapeHtml(sowUrl) + '" target="_blank" rel="noopener noreferrer" style="color: #e8c861; text-decoration: underline; font-weight: bold;">Abrir Enlace SOW ↗</a>' +
            ' · <button type="button" class="bdv-admin-toggle-status" style="padding: 2px 6px; font-size: 0.7rem;" onclick="copySowLinkWithNotice(\'' + core.escapeHtml(sowUrl) + '\')">Copiar Enlace</button>';
        } else {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "No se pudo generar el SOW.";
        }
      })
      .catch(function () {
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al emitir el SOW.";
        }
      });
  };

  window.submitNewSowManual = function () {
    var core = getCore();
    var name = (document.getElementById("bdv-ns-client-name").value || "").trim();
    var email = (document.getElementById("bdv-ns-client-email").value || "").trim().toLowerCase();
    var biz = (document.getElementById("bdv-ns-biz-name").value || "").trim();
    var scope = (document.getElementById("bdv-ns-scope").value || "").trim();
    var total = Number(document.getElementById("bdv-ns-total").value) || 0;
    var deposit = Number(document.getElementById("bdv-ns-deposit").value) || 0;
    var statusMsg = document.getElementById("bdv-ns-status-msg");
    var sessionKey = window.__bdvSessionKey || "";

    if (!name || !email) {
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = "Ingresa el nombre del cliente y su correo electrónico.";
      }
      return;
    }

    if (statusMsg) {
      statusMsg.style.display = "block";
      statusMsg.style.color = "#94a3b8";
      statusMsg.textContent = "Emitiendo SOW...";
    }

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "create_sow",
        clientName: name,
        clientEmail: email,
        businessName: biz,
        scopeSummary: scope || "Desarrollo de plataforma o servicio digital.",
        totalAmount: total,
        depositAmount: deposit
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!statusMsg) return;
        if (res.ok && res.sowId) {
          var sowUrl = res.sowUrl || ("https://batistadigitalventures.com/?sow=" + res.sowId);
          statusMsg.style.color = "#4ade80";
          statusMsg.innerHTML =
            "✓ <strong>" + core.escapeHtml(res.sowId) + "</strong> generado exitosamente.<br/>" +
            '<a href="' + core.escapeHtml(sowUrl) + '" target="_blank" rel="noopener noreferrer" style="color: #e8c861; text-decoration: underline;">Abrir SOW ↗</a>' +
            ' · <button type="button" class="bdv-admin-toggle-status" style="padding: 2px 6px; font-size: 0.72rem;" onclick="copySowLinkWithNotice(\'' + core.escapeHtml(sowUrl) + '\')">Copiar Enlace</button>';
        } else {
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = res.error || "No se pudo generar el SOW.";
        }
      })
      .catch(function () {
        if (statusMsg) {
          statusMsg.style.display = "block";
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = "Error de conexión al emitir el SOW.";
        }
      });
  };

  function fillProjectFormFromRequest(r) {
    var box = document.getElementById("bdv-create-project-box");
    if (box) box.style.display = "block";

    var emailInput = document.getElementById("bdv-np-email");
    var nameEnInput = document.getElementById("bdv-np-name-en");
    var nameEsInput = document.getElementById("bdv-np-name-es");
    var codeInput = document.getElementById("bdv-np-code");

    if (emailInput) emailInput.value = r.clientEmail || "";
    var finalName = r.businessName || (Array.isArray(r.services) && r.services[0]) || r.clientName || "Nuevo Proyecto";
    if (nameEnInput) nameEnInput.value = finalName;
    if (nameEsInput) nameEsInput.value = finalName;

    var randNum = Math.floor(1000 + Math.random() * 9000);
    if (codeInput && !codeInput.value) {
      codeInput.value = "CL-" + randNum;
    }

    if (box) box.scrollIntoView({ behavior: "smooth" });
  }

  window.autofillProjectByIndex = function (idx) {
    var r = window.__bdvStoredRequests[idx];
    if (!r) return;

    var reqEmail = (r.clientEmail || "").trim().toLowerCase();
    var existing = (window.__bdvStoredProjects || []).find(function (p) {
      return (p.email || "").trim().toLowerCase() === reqEmail;
    });

    if (existing) {
      showOpsPromptCard({
        title: "Proyecto ya registrado para este cliente",
        message:
          "El correo " + reqEmail + " ya tiene un proyecto activo:\n" +
          "• Proyecto: " + (existing.name || existing.id) + "\n" +
          "• Etapa actual: Etapa " + (existing.stage || 1) + "/6\n" +
          "• Estado de pago: " + (existing.paymentStatus || "PENDING") + "\n\n" +
          "¿Deseas enfocar el proyecto existente para evitar duplicados o continuar cargando un nuevo proyecto?",
        confirmLabel: "Ver Proyecto Existente",
        cancelLabel: "Cargar de Todos Modos",
        onConfirm: function () {
          var el = document.querySelector('[data-row="' + existing.row + '"]');
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.style.outline = "2px solid #e8c861";
            setTimeout(function () { el.style.outline = "none"; }, 3500);
          }
        },
        onCancel: function () {
          fillProjectFormFromRequest(r);
        }
      });
      return;
    }

    fillProjectFormFromRequest(r);
  };

  window.deletePartnerApplicationByIndex = function (i) {
    var core = getCore();
    var a = (window.__bdvStoredPartnerApps || [])[i];
    if (!a || !a.id) return;
    showOpsPromptCard({
      title: "Eliminar postulación de partner",
      message: "¿Deseas eliminar de forma permanente la postulación " + a.id + " de " + (a.name || a.email) + "?",
      confirmLabel: "Sí, Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: function () {
        fetch(core.apiUrl, {
          method: "POST",
          body: JSON.stringify({ key: window.__bdvSessionKey || "", action: "delete_partner_application", applicationId: a.id })
        })
          .then(function (res) { return res.json(); })
          .then(function (res) {
            if (res.ok) {
              refreshAdminSessionView("✓ Postulación eliminada correctamente.");
            } else {
              showAdminToast(res.error || "No se pudo eliminar la postulación.", false);
            }
          })
          .catch(function () {
            showAdminToast("Error de red al eliminar la postulación.", false);
          });
      }
    });
  };

  window.deleteServiceRequestByIndex = function (idx) {
    var core = getCore();
    var r = window.__bdvStoredRequests[idx];
    if (!r || !r.id) return;

    showOpsPromptCard({
      title: isPartnerApplication(r) ? "Eliminar postulación de partner" : "Eliminar solicitud entrante",
      message: "¿Deseas eliminar de forma permanente la solicitud " + r.id + " de " + (r.clientName || r.clientEmail) + "?",
      confirmLabel: "Sí, Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: function () {
        var sessionKey = window.__bdvSessionKey || "";
        fetch(core.apiUrl, {
          method: "POST",
          body: JSON.stringify({
            key: sessionKey,
            action: "delete_request",
            requestId: r.id
          })
        })
          .then(function (res) { return res.json(); })
          .then(function (res) {
            if (res.ok) {
              refreshAdminSessionView("✓ Solicitud eliminada correctamente.");
            } else {
              showAdminToast(res.error || "No se pudo eliminar la solicitud.", false);
            }
          })
          .catch(function () {
            showAdminToast("Error de red al eliminar la solicitud.", false);
          });
      }
    });
  };

  window.deleteProjectItem = function (row) {
    if (!row) return;
    var core = getCore();

    showOpsPromptCard({
      title: "Eliminar proyecto registrado",
      message: "¿Deseas eliminar este proyecto de forma permanente? Esta acción no se puede deshacer.",
      confirmLabel: "Sí, Eliminar Proyecto",
      cancelLabel: "Cancelar",
      onConfirm: function () {
        var sessionKey = window.__bdvSessionKey || "";
        var rowStatus = document.getElementById("row-status-" + row);

        fetch(core.apiUrl, {
          method: "POST",
          body: JSON.stringify({
            key: sessionKey,
            action: "delete_project",
            row: row
          })
        })
          .then(function (res) { return res.json(); })
          .then(function (res) {
            if (res.ok) {
              refreshAdminSessionView("✓ Proyecto eliminado correctamente.");
            } else if (rowStatus) {
              rowStatus.style.display = "block";
              rowStatus.style.color = "#f87171";
              rowStatus.textContent = res.error || "No se pudo eliminar el proyecto.";
            }
          })
          .catch(function () {
            if (rowStatus) {
              rowStatus.style.display = "block";
              rowStatus.style.color = "#f87171";
              rowStatus.textContent = "Error de red al eliminar el proyecto.";
            }
          });
      }
    });
  };

  window.collectProjectPayment = function (row) {
    var proj = (window.__bdvStoredProjects || []).find(function (p) {
      return Number(p.row) === Number(row);
    });
    if (!proj) {
      showAdminToast("No se encontró la información del proyecto seleccionado.", false);
      return;
    }
    if (window.BDV_SOW && typeof window.BDV_SOW.collectMilestoneOrFinal === "function") {
      window.BDV_SOW.collectMilestoneOrFinal(proj);
    } else {
      showAdminToast("El módulo de pagos BDV_SOW no está disponible.", false);
    }
  };

  function executeCreateProjectRequest(nameEn, nameEs, email, code, primaryName) {
    var core = getCore();
    var nameEnInput = document.getElementById("bdv-np-name-en");
    var nameEsInput = document.getElementById("bdv-np-name-es");
    var emailInput = document.getElementById("bdv-np-email");
    var codeInput = document.getElementById("bdv-np-code");
    var statusMsg = document.getElementById("bdv-np-status-msg");
    var submitBtn = document.getElementById("bdv-np-submit-btn");
    var sessionKey = window.__bdvSessionKey || "";

    if (submitBtn) submitBtn.disabled = true;
    if (statusMsg) {
      statusMsg.style.display = "block";
      statusMsg.style.color = "#94a3b8";
      statusMsg.textContent = "Guardando proyecto en el sistema...";
    }

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "create_project",
        name: primaryName,
        name_en: nameEn || primaryName,
        name_es: nameEs || primaryName,
        email: email,
        code: code,
        stage: 1
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (submitBtn) submitBtn.disabled = false;
        if (statusMsg) statusMsg.style.display = "block";
        if (res.ok) {
          if (statusMsg) {
            statusMsg.style.color = "#4ade80";
            statusMsg.textContent = "✓ Proyecto creado y activado.";
          }
          if (nameEnInput) nameEnInput.value = "";
          if (nameEsInput) nameEsInput.value = "";
          if (emailInput) emailInput.value = "";
          if (codeInput) codeInput.value = "";
          setTimeout(function () {
            if (statusMsg) statusMsg.style.display = "none";
            refreshAdminSessionView("✓ Nuevo proyecto activado en el portafolio.");
          }, 900);
        } else if (statusMsg) {
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = res.error || "No se pudo crear el proyecto.";
        }
      })
      .catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (statusMsg) {
          statusMsg.style.display = "block";
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = "Error de conexión al crear el proyecto.";
        }
      });
  }

  window.submitNewProject = function () {
    var nameEnInput = document.getElementById("bdv-np-name-en");
    var nameEsInput = document.getElementById("bdv-np-name-es");
    var emailInput = document.getElementById("bdv-np-email");
    var codeInput = document.getElementById("bdv-np-code");
    var statusMsg = document.getElementById("bdv-np-status-msg");

    var nameEn = (nameEnInput ? nameEnInput.value : "").trim();
    var nameEs = (nameEsInput ? nameEsInput.value : "").trim();
    var email = (emailInput ? emailInput.value : "").trim().toLowerCase();
    var code = (codeInput ? codeInput.value : "").trim().toUpperCase();

    var primaryName = nameEn || nameEs;

    if (!primaryName || !email || code.length < 4) {
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = "Completa el nombre del proyecto, el correo y un PIN de al menos 4 caracteres.";
      }
      return;
    }

    var duplicate = (window.__bdvStoredProjects || []).find(function (p) {
      return (p.email || "").trim().toLowerCase() === email;
    });

    if (duplicate) {
      showOpsPromptCard({
        title: "Aviso de proyecto existente para este correo",
        message:
          "Ya existe un proyecto con " + email + ":\n" +
          "• Nombre: " + (duplicate.name || duplicate.id) + "\n" +
          "• Etapa actual: Etapa " + (duplicate.stage || 1) + "/6\n\n" +
          "¿Deseas crear un registro adicional de todos modos o cancelar para evitar duplicados?",
        confirmLabel: "Crear de Todos Modos",
        cancelLabel: "Cancelar",
        onConfirm: function () {
          executeCreateProjectRequest(nameEn, nameEs, email, code, primaryName);
        },
        onCancel: function () {
          if (statusMsg) {
            statusMsg.style.display = "block";
            statusMsg.style.color = "#e8c861";
            statusMsg.textContent = "Alta cancelada para proteger el proyecto existente.";
          }
        }
      });
      return;
    }

    executeCreateProjectRequest(nameEn, nameEs, email, code, primaryName);
  };

  window.submitPasswordChange = function () {
    var core = getCore();
    var input = document.getElementById("bdv-new-role-pass");
    var newPass = (input ? input.value : "").trim();
    var statusMsg = document.getElementById("bdv-key-status-msg");

    if (!newPass || newPass.length < 6) {
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = "La nueva clave debe tener al menos 6 caracteres.";
      }
      return;
    }

    var sessionKey = window.__bdvSessionKey || "";
    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "change_my_password",
        newPassword: newPass
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (statusMsg) statusMsg.style.display = "block";
        if (res.ok) {
          window.__bdvSessionKey = newPass;
          input.value = "";
          statusMsg.style.color = "#4ade80";
          statusMsg.textContent = "✓ Clave actualizada exitosamente en el sistema.";
          setTimeout(function () {
            var box = document.getElementById("bdv-key-change-box");
            if (box) box.style.display = "none";
            statusMsg.style.display = "none";
          }, 2500);
        } else {
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = res.error || "No se pudo actualizar la clave.";
        }
      })
      .catch(function () {
        if (statusMsg) {
          statusMsg.style.display = "block";
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = "Error de red al actualizar la clave.";
        }
      });
  };

  function loadAdminProjects() {
    var core = getCore();
    var listEl = document.getElementById("bdv-admin-projects-list");
    var roleLabel = document.getElementById("bdv-admin-role-label");
    var sessionKey = window.__bdvSessionKey || "";

    if (!listEl) return;

    listEl.innerHTML = '<p style="font-size: 0.8rem; color: #94a3b8;">Consultando proyectos...</p>';

    fetch(core.apiUrl + "?key=" + encodeURIComponent(sessionKey))
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) {
          listEl.innerHTML = '<p style="font-size: 0.8rem; color: #f87171;">Clave no válida o sin permiso.</p>';
          return;
        }

        var isAdmin = res.role === "admin";
        window.__bdvIsAdmin = isAdmin;

        var createBtn = document.getElementById("bdv-toggle-create-project-btn");
        if (createBtn) createBtn.style.display = isAdmin ? "inline-block" : "none";

        var createSowBtn = document.getElementById("bdv-toggle-create-sow-btn");
        if (createSowBtn) createSowBtn.style.display = isAdmin ? "inline-block" : "none";

        if (roleLabel) {
          roleLabel.textContent = isAdmin
            ? "Admin · Control de Etapas, SOWs, PINs y Aprobaciones"
            : "Programador Partner · Reporte para Revisión y Confirmación";
        }

        var reqSection = document.getElementById("bdv-admin-requests-section");
        var reqList = document.getElementById("bdv-admin-requests-list");
        var partnerSection = document.getElementById("bdv-admin-partners-section");
        var partnerList = document.getElementById("bdv-admin-partners-list");
        var allRequests = isAdmin && Array.isArray(res.requests) ? res.requests : [];
        // Keep the original array so index-based actions (autofill / delete) still point at the right item.
        window.__bdvStoredRequests = allRequests;
        var clientIdx = [];
        var partnerIdx = [];
        allRequests.forEach(function (r, idx) { (isPartnerApplication(r) ? partnerIdx : clientIdx).push(idx); });
        // New dedicated store (Worker "partnerApplications") first, then legacy ones that came in via request_services.
        var newApps = isAdmin && Array.isArray(res.partnerApplications) ? res.partnerApplications : [];
        window.__bdvStoredPartnerApps = newApps;
        var partnerItems = newApps.map(function (a, i) { return { kind: "app", i: i, a: a }; })
          .concat(partnerIdx.map(function (idx) { return { kind: "legacy", idx: idx }; }));
        var setCount = function (id, n) { var el = document.getElementById(id); if (el) el.textContent = "(" + n + ")"; };

        if (clientIdx.length && reqSection && reqList) {
          reqSection.style.display = "block";
          setCount("bdv-admin-requests-count", clientIdx.length);
          reqList.innerHTML = clientIdx.map(function (idx) {
            var r = allRequests[idx];
            var dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "";
            var srvList = Array.isArray(r.services) ? r.services.join(", ") : "";
            var escapedId = core.escapeHtml(r.id || "");
            var escapedEmail = core.escapeHtml(r.clientEmail || "");
            var escapedBiz = core.escapeHtml(r.businessName || "");
            var escapedClient = core.escapeHtml(r.clientName || "");

            return [
              '<div class="bdv-admin-request-item" style="background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">',
              "  <div>",
              '    <strong style="color: #f8fafc;">' + escapedClient + "</strong>",
              '    <span style="color: #94a3b8;">(' + escapedEmail + ")</span>",
              escapedBiz ? '<div style="color: #e8c861; font-size: 0.75rem;">Negocio: ' + escapedBiz + "</div>" : "",
              srvList ? '<div style="color: #cbd5e1; font-size: 0.72rem;">Servicio: ' + core.escapeHtml(srvList) + "</div>" : "",
              r.notes ? '<div style="color: #94a3b8; font-size: 0.72rem; white-space: pre-wrap; max-width: 520px;">' + core.escapeHtml(String(r.notes).slice(0, 600)) + "</div>" : "",
              '    <div style="color: #94a3b8; font-size: 0.7rem;">' + escapedId + " · " + dateStr + "</div>",
              "  </div>",
              '  <div style="display: flex; gap: 6px; flex-wrap: wrap;">',
              '    <button type="button" class="bdv-admin-action-btn" style="background: #e8c861 !important; color: #000 !important; font-weight: 700; padding: 4px 8px; font-size: 0.75rem;" onclick="autofillProjectByIndex(' + idx + ')">Usar en Nuevo Proyecto</button>',
              '    <button type="button" class="bdv-admin-toggle-status" style="border-color: rgba(248, 113, 113, 0.45) !important; color: #f87171 !important; padding: 4px 8px; font-size: 0.75rem;" onclick="deleteServiceRequestByIndex(' + idx + ')">Eliminar</button>',
              "  </div>",
              "</div>"
            ].join("");
          }).join("");
        } else if (reqSection) {
          reqSection.style.display = "none";
        }

        if (partnerItems.length && partnerSection && partnerList) {
          partnerSection.style.display = "block";
          setCount("bdv-admin-partners-count", partnerItems.length);
          partnerList.innerHTML = partnerItems.map(function (it) {
            var name, email, created, id, lines, delBtn;
            if (it.kind === "app") {
              var a = it.a;
              name = a.name; email = String(a.email || ""); created = a.createdAt; id = a.id;
              lines = [
                a.portfolio ? "GitHub / portafolio: " + a.portfolio : "",
                a.specialty ? "Especialidad: " + a.specialty : "",
                a.timezone ? "Zona horaria: " + a.timezone : "",
                a.lang ? "Idioma: " + a.lang : "",
                a.notes ? "\n" + a.notes : ""
              ].filter(Boolean).join("\n");
              delBtn = "deletePartnerApplicationByIndex(" + it.i + ")";
            } else {
              var r = allRequests[it.idx];
              name = r.clientName; email = String(r.clientEmail || ""); created = r.createdAt; id = r.id;
              lines = String(r.notes || "").replace(/^\[PARTNER APPLICATION[^\]]*\]\s*/i, "");
              delBtn = "deleteServiceRequestByIndex(" + it.idx + ")";
            }
            var dateStr = created ? new Date(created).toLocaleDateString() : "";
            var portfolioLink = it.kind === "app" && /^https?:\/\//i.test(String(it.a.portfolio || ""))
              ? '    <a class="bdv-admin-toggle-status" style="padding: 4px 8px; font-size: 0.75rem; text-decoration: none;" href="' + core.escapeHtml(it.a.portfolio) + '" target="_blank" rel="noopener noreferrer">Ver portafolio</a>'
              : "";
            return [
              '<div class="bdv-admin-partner-item" data-kind="' + it.kind + '" style="background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(52,211,153,0.2); display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap;">',
              "  <div>",
              '    <strong style="color: #f8fafc;">' + core.escapeHtml(name || "") + "</strong>",
              '    <span style="color: #94a3b8;">(' + core.escapeHtml(email) + ")</span>",
              lines ? '<div style="color: #cbd5e1; font-size: 0.72rem; white-space: pre-wrap; max-width: 520px; margin-top: 2px;">' + core.escapeHtml(String(lines).slice(0, 1200)) + "</div>" : "",
              '    <div style="color: #94a3b8; font-size: 0.7rem;">' + core.escapeHtml(id || "") + " · " + dateStr + (it.kind === "legacy" ? " · vía formulario anterior" : "") + "</div>",
              "  </div>",
              '  <div style="display: flex; gap: 6px; flex-wrap: wrap;">',
              portfolioLink,
              isValidEmailSimple(email) ? '    <a class="bdv-admin-action-btn" style="background: rgba(52,211,153,0.15) !important; color: #34d399 !important; border: 1px solid rgba(52,211,153,0.45); padding: 4px 8px; font-size: 0.75rem; text-decoration: none;" href="mailto:' + encodeURIComponent(email) + '">Responder</a>' : "",
              '    <button type="button" class="bdv-admin-toggle-status" style="border-color: rgba(248, 113, 113, 0.45) !important; color: #f87171 !important; padding: 4px 8px; font-size: 0.75rem;" onclick="' + delBtn + '">Eliminar</button>',
              "  </div>",
              "</div>"
            ].join("");
          }).join("");
        } else if (partnerSection) {
          partnerSection.style.display = "none";
        }

        if (!res.projects || !res.projects.length) {
          window.__bdvStoredProjects = [];
          listEl.innerHTML = '<p style="font-size: 0.8rem; color: #94a3b8;">No hay proyectos registrados en la base de datos.</p>';
          return;
        }

        window.__bdvStoredProjects = res.projects;
        var lang = core.getLang();

        listEl.innerHTML = res.projects.map(function (p) {
          var displayName = core.getProjectDisplayName(p, lang);

          var proposalObj = null;
          if (p.pendingProposal) {
            try { proposalObj = JSON.parse(p.pendingProposal); } catch (e) { proposalObj = null; }
          }

          var proposalBanner = proposalObj
            ? '<div style="margin-top: 10px; padding: 10px; border-radius: 8px; background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.45); font-size: 0.78rem;">' +
              '<strong style="color: #e8c861;">Propuesta de ' + core.escapeHtml(proposalObj.devName || "Partner") + ":</strong> Etapa " + proposalObj.stage + "/6" +
              (proposalObj.notes ? '<div style="color: #e2e8f0; margin-top: 4px;">Nota: ' + core.escapeHtml(proposalObj.notes) + "</div>" : "") +
              (isAdmin
                ? '<button type="button" class="bdv-admin-action-btn" style="margin-top: 8px;" onclick="approveProjectProposal(' + p.row + ')">✓ Confirmar Avance y Notificar</button>'
                : '<div style="color: #cbd5e1; margin-top: 4px;">Estado: Enviado a revisión del administrador.</div>') +
              "</div>"
            : "";

          var adminActionButtons = isAdmin
            ? '<div class="bdv-admin-grid-row" style="margin-top: 10px; gap: 6px; flex-wrap: wrap;">' +
              '<input type="text" id="pin-input-' + p.row + '" class="bdv-tracker-input" style="max-width: 130px; padding: 6px 8px; font-size: 0.8rem;" value="' + core.escapeHtml(p.code) + '" placeholder="PIN" />' +
              '<button type="button" class="bdv-admin-toggle-status" onclick="updateProjectPin(' + p.row + ')">Cambiar PIN</button>' +
              '<button type="button" class="bdv-admin-action-btn" style="background: #e8c861 !important; color: #070a10 !important; font-weight: 700;" onclick="generateSowForProject(' + p.row + ", '" + core.escapeHtml(p.name) + "', '" + core.escapeHtml(p.email) + "', '" + core.escapeHtml(displayName) + "', '" + core.escapeHtml(displayName) + "')\">📄 Generar SOW</button>" +
              '<button type="button" class="bdv-admin-action-btn" style="background: rgba(212, 175, 55, 0.2) !important; color: #e8c861 !important; border: 1px solid rgba(212, 175, 55, 0.5); font-weight: 600;" onclick="collectProjectPayment(' + p.row + ')">💳 Cobrar Hito / Saldo</button>' +
              '<button type="button" class="bdv-admin-toggle-status" style="border-color: rgba(248, 113, 113, 0.45) !important; color: #f87171 !important;" onclick="deleteProjectItem(' + p.row + ')">Eliminar</button>' +
              "</div>"
            : "";

          var devNotesInput = !isAdmin
            ? '<input type="text" id="dev-note-' + p.row + '" class="bdv-tracker-input" style="width: 100%; margin-top: 8px; padding: 6px 10px; font-size: 0.8rem;" placeholder="Resumen de lo avanzado para revisión del admin..." />'
            : "";

          var primaryBtnText = isAdmin ? "Guardar y Notificar" : "Enviar a Revisión";

          return [
            '<div class="bdv-admin-project-item" data-row="' + p.row + '">',
            '  <div class="bdv-admin-grid-row">',
            "    <div>",
            '      <strong style="color: #f8fafc; font-size: 0.9rem;">' + core.escapeHtml(displayName) + "</strong>",
            '      <span style="font-size: 0.75rem; color: #94a3b8;">(' + core.escapeHtml(p.id) + ")</span>",
            '      <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 2px;">',
            (isAdmin ? "Email: " + core.escapeHtml(p.email) + " | " : "") + (p.code ? 'PIN: <span style="color: #e8c861; font-weight: 700;">' + core.escapeHtml(p.code) + "</span>" : ""),
            '        <span style="color: #94a3b8; margin-left: 6px;">[' + core.escapeHtml(p.paymentStatus || "PENDING") + "]</span>",
            "      </div>",
            "    </div>",
            '    <span class="bdv-tracker-status-tag ' + (p.accessStatus === "ACTIVE" ? "bdv-status-active" : "bdv-status-disabled") + '">',
            core.escapeHtml(p.accessStatus),
            "    </span>",
            "  </div>",
            adminActionButtons,
            proposalBanner,
            devNotesInput,
            '  <div class="bdv-admin-grid-row" style="margin-top: 10px;">',
            '    <select class="bdv-admin-select" id="stage-select-' + p.row + '">',
            '      <option value="1" ' + (p.stage === 1 ? "selected" : "") + ">1. Intake (10%)</option>",
            '      <option value="2" ' + (p.stage === 2 ? "selected" : "") + ">2. SOW & PIN (25%)</option>",
            '      <option value="3" ' + (p.stage === 3 ? "selected" : "") + ">3. Arquitectura (45%)</option>",
            '      <option value="4" ' + (p.stage === 4 ? "selected" : "") + ">4. Core & QA (75%)</option>",
            '      <option value="5" ' + (p.stage === 5 ? "selected" : "") + ">5. Revisión (90%)</option>",
            '      <option value="6" ' + (p.stage === 6 ? "selected" : "") + ">6. Release 100% (Disable)</option>",
            "    </select>",
            '    <button type="button" class="bdv-admin-action-btn" onclick="updateProjectStage(' + p.row + ')">' + primaryBtnText + "</button>",
            "  </div>",
            '  <div id="row-status-' + p.row + '" style="display: none; margin-top: 6px; font-size: 0.78rem;"></div>',
            "</div>"
          ].join("");
        }).join("");
      })
      .catch(function () {
        listEl.innerHTML = '<p style="font-size: 0.8rem; color: #f87171;">Error al conectar con la API de proyectos.</p>';
      });
  }

  window.updateProjectPin = function (row) {
    var core = getCore();
    var input = document.getElementById("pin-input-" + row);
    var newCode = (input ? input.value : "").trim().toUpperCase();
    var sessionKey = window.__bdvSessionKey || "";
    var rowStatus = document.getElementById("row-status-" + row);

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "update_pin",
        row: row,
        code: newCode
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (rowStatus) rowStatus.style.display = "block";
        if (res.ok) {
          if (rowStatus) {
            rowStatus.style.color = "#4ade80";
            rowStatus.textContent = "✓ PIN actualizado a " + res.code;
          }
          setTimeout(function () { refreshAdminSessionView("✓ PIN actualizado a " + res.code + "."); }, 800);
        } else if (rowStatus) {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "No se pudo cambiar el PIN.";
        }
      })
      .catch(function () {
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al cambiar el PIN.";
        }
      });
  };

  window.approveProjectProposal = function (row) {
    var core = getCore();
    var sessionKey = window.__bdvSessionKey || "";
    var rowStatus = document.getElementById("row-status-" + row);

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "approve_proposal",
        row: row
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (rowStatus) rowStatus.style.display = "block";
        if (res.ok) {
          if (rowStatus) {
            rowStatus.style.color = "#4ade80";
            rowStatus.textContent = "✓ Trabajo aprobado y activado en Etapa " + res.stage + "/6.";
          }
          setTimeout(function () {
            refreshAdminSessionView("✓ Trabajo aprobado en Etapa " + res.stage + "/6. Caso actualizado.");
          }, 900);
        } else if (rowStatus) {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "No se pudo confirmar la propuesta.";
        }
      })
      .catch(function () {
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al confirmar propuesta.";
        }
      });
  };

  window.updateProjectStage = function (row) {
    var core = getCore();
    var sel = document.getElementById("stage-select-" + row);
    var stage = Number(sel.value);
    var accessStatus = stage === 6 ? "DISABLED" : "ACTIVE";
    var sessionKey = window.__bdvSessionKey || "";
    var isAdmin = Boolean(window.__bdvIsAdmin);
    var noteInput = document.getElementById("dev-note-" + row);
    var notes = noteInput ? noteInput.value.trim() : "";
    var rowStatus = document.getElementById("row-status-" + row);

    sel.disabled = true;

    var payload = isAdmin
      ? {
          key: sessionKey,
          action: "update",
          row: row,
          stage: stage,
          accessStatus: accessStatus
        }
      : {
          key: sessionKey,
          action: "propose",
          row: row,
          stage: stage,
          notes: notes
        };

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        sel.disabled = false;
        if (rowStatus) rowStatus.style.display = "block";
        if (res.ok) {
          var msg = isAdmin
            ? "✓ Trabajo aprobado y activado en Etapa " + stage + "/6."
            : "✓ Avance enviado a revisión del administrador.";
          if (rowStatus) {
            rowStatus.style.color = "#4ade80";
            rowStatus.textContent = msg;
          }
          setTimeout(function () {
            refreshAdminSessionView(msg);
          }, 900);
        } else if (rowStatus) {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "Error al procesar la solicitud.";
        }
      })
      .catch(function () {
        sel.disabled = false;
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al actualizar.";
        }
      });
  };

  var ADMIN_HASH = "#bdv-ops";

  function clearAdminHash() {
    if (window.location.hash === ADMIN_HASH && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function openAdminFromHash() {
    if (window.location.hash === ADMIN_HASH) {
      openAdminModal();
      // Drop the hash right away so it is not left in the address bar and the
      // same link can be used again later (hashchange only fires on a change).
      clearAdminHash();
    }
  }

  window.addEventListener("hashchange", openAdminFromHash);

  window.BDV_OPS = {
    openAdmin: function () {
      openAdminModal();
    },
    onLanguageChange: function () {
      if (window.__bdvSessionKey && document.getElementById("bdv-admin-dash-view") && document.getElementById("bdv-admin-dash-view").style.display === "block") {
        loadAdminProjects();
      }
    }
  };

  function initOps() {
    applyClientTrackerModal();
    applyAdminPanel();
    openAdminFromHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOps);
  } else {
    initOps();
  }
})();
