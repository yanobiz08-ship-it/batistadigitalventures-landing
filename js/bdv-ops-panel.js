/* Batista Digital Ventures - Operational Dashboard, Partner Workflows & Client Progress Tracker */
(function () {
  function getCore() {
    return window.BDV_CORE || {
      apiUrl: "https://bdv-backend-api.yanobiz08.workers.dev",
      escapeHtml: (s) =>
        String(s || "")
          .split("&").join("&")
          .split("<").join("<")
          .split(">").join(">")
          .split('"').join(""")
          .split("'").join("'"),
      getLang: () => "en",
      getProjectDisplayName: (p) => (p ? p.name : ""),
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

  function showAdminToast(message, isSuccess) {
    let banner = document.getElementById("bdv-admin-action-banner");
    if (!banner) {
      const dash = document.getElementById("bdv-admin-dash-view");
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
  }

  function refreshAdminSessionView(noticeText) {
    const passInput = document.getElementById("bdv-admin-pass");
    if (passInput) passInput.value = "";
    const createBox = document.getElementById("bdv-create-project-box");
    if (createBox) createBox.style.display = "none";
    const createSowBox = document.getElementById("bdv-create-sow-box");
    if (createSowBox) createSowBox.style.display = "none";
    const keyBox = document.getElementById("bdv-key-change-box");
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
      modalRoot.style.display = "none";
      modalRoot.scrollTop = 0;
      const card = modalRoot.querySelector(".bdv-admin-card");
      if (card) card.scrollTop = 0;
    }

    const passInput = document.getElementById("bdv-admin-pass");
    if (passInput) passInput.value = "";

    const authMsg = document.getElementById("bdv-admin-auth-msg");
    if (authMsg) authMsg.style.display = "none";

    const authView = document.getElementById("bdv-admin-auth-view");
    if (authView) authView.style.display = "block";

    const dashView = document.getElementById("bdv-admin-dash-view");
    if (dashView) dashView.style.display = "none";

    const createBox = document.getElementById("bdv-create-project-box");
    if (createBox) createBox.style.display = "none";

    const createSowBox = document.getElementById("bdv-create-sow-box");
    if (createSowBox) createSowBox.style.display = "none";

    const keyBox = document.getElementById("bdv-key-change-box");
    if (keyBox) keyBox.style.display = "none";

    const toastBanner = document.getElementById("bdv-admin-action-banner");
    if (toastBanner) toastBanner.style.display = "none";
  }

  /* Visor de solo lectura para el cliente (email + PIN) */
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
- Nota: Este portal es de solo lectura y se inhabilita de inmediato al liquidar el 100% y entregarse el proyecto. No incluye soporte post-entrega ni mantenimiento mensual.
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
      const core = getCore();
      const email = (document.getElementById("bdv-track-email").value || "").trim().toLowerCase();
      const pin = (document.getElementById("bdv-track-pin").value || "").trim().toUpperCase();
      const resBox = document.getElementById("bdv-track-result-box");
      const lang = core.getLang();

      if (!email || !pin) return;

      resBox.style.display = "block";
      resBox.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8;">Verificando credenciales...</p>`;

      fetch(`${core.apiUrl}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(pin)}`)
        .then(r => r.json())
        .then(res => {
          if (!res.ok || !res.project) {
            resBox.innerHTML = `
              <p style="font-size: 0.82rem; color: #f87171; margin: 0;">
                ${lang === "en" ? "Credentials not found or expired. Check your welcome email or contact management." : "Credenciales no encontradas o expiradas. Revisa tu correo de bienvenida o contacta a soporte."}
              </p>
            `;
            return;
          }

          const matched = res.project;
          const stages = core.workflowStages || [];

          if (matched.accessStatus === "DISABLED" || matched.stage === 6) {
            resBox.innerHTML = `
              <span class="bdv-tracker-status-tag bdv-status-disabled">Acceso Expirado / Inhabilitado</span>
              <h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Proyecto Liquidado al 100%</h4>
              <p style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0;">El software fue entregado y las credenciales maestras fueron traspasadas. El visor temporal ha concluido. Para soporte técnico continuo, contacte una póliza mensual.</p>
            `;
          } else {
            const stObj = stages[matched.stage - 1] || stages[0] || { stage: 1, percentage: 10, name_es: "Intake", name_en: "Intake" };
            const stName = lang === "en" ? stObj.name_en : stObj.name_es;
            const projDisplayName = core.getProjectDisplayName(matched, lang);
            resBox.innerHTML = `
              <span class="bdv-tracker-status-tag bdv-status-active">Acceso Activo · Obra en Progreso</span>
              <h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Etapa ${matched.stage}/6: ${stName} (${stObj.percentage}%)</h4>
              <p style="font-size: 0.8rem; color: #cbd5e1; margin: 6px 0;"><strong>Proyecto:</strong> ${core.escapeHtml(projDisplayName)} (${core.escapeHtml(matched.id)})</p>
              <p style="font-size: 0.8rem; color: #e8c861; margin: 6px 0;"><strong>Estado Financiero:</strong> ${core.escapeHtml(matched.paymentStatus)}</p>
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

  /* Panel Operativo de Control */
  function applyAdminPanel() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const container = footer.querySelector(".container") || footer;

    let adminBtnWrap = document.getElementById("bdv-admin-btn-wrap");
    if (!adminBtnWrap) {
      adminBtnWrap = document.createElement("div");
      adminBtnWrap.id = "bdv-admin-btn-wrap";
      adminBtnWrap.style.cssText = "width: 100%; display: flex; justify-content: center; margin-top: 12px;";
      adminBtnWrap.innerHTML = `<button type="button" id="bdv-admin-btn" class="bdv-admin-footer-btn" style="cursor: pointer; opacity: 0.5; padding: 4px 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.14) !important; background: transparent !important; color: #94a3b8 !important; font-size: 0.75rem;">⚙ Panel Admin / Dev</button>`;
      container.appendChild(adminBtnWrap);
    } else if (!container.contains(adminBtnWrap)) {
      container.appendChild(adminBtnWrap);
    }

    let modalRoot = document.getElementById("bdv-admin-modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "bdv-admin-modal-root";
      modalRoot.className = "bdv-modal-overlay";
      modalRoot.style.display = "none";
      modalRoot.style.overflowY = "auto";
      modalRoot.style.alignItems = "flex-start";
      modalRoot.style.padding = "18px 10px";

      modalRoot.innerHTML = `
        <div class="bdv-admin-card" style="max-height: 88vh; overflow-y: auto; margin: auto;">
          <div class="bdv-modal-top">
            <h3 id="bdv-admin-modal-title" style="margin: 0; color: #e8c861; font-size: 1.1rem;">⚙ Control Operativo · BDV LLC</h3>
            <button type="button" id="bdv-admin-close-btn" class="bdv-modal-close">✕</button>
          </div>

          <div id="bdv-admin-auth-view" style="margin-top: 15px;">
            <input type="password" id="bdv-admin-pass" class="bdv-tracker-input" style="width: 100%;" placeholder="Ingresa tu clave (Admin o Programador)" />
            <button type="button" id="bdv-admin-login-btn" class="bdv-tracker-btn" style="width: 100%; margin-top: 10px;">Acceder al Panel</button>
            <div id="bdv-admin-auth-msg" style="display: none; margin-top: 10px; font-size: 0.82rem; color: #f87171;"></div>
          </div>

          <div id="bdv-admin-dash-view" style="display: none; margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
              <h4 id="bdv-admin-role-label" style="margin: 0; font-size: 0.95rem;">Proyectos</h4>
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <button type="button" id="bdv-toggle-create-project-btn" class="bdv-admin-action-btn" style="display: none; background: #22c55e !important; color: #052e16 !important; font-weight: 700;">+ Nuevo Proyecto</button>
                <button type="button" id="bdv-toggle-create-sow-btn" class="bdv-admin-action-btn" style="display: none; background: #e8c861 !important; color: #070a10 !important; font-weight: 700;">+ Emitir SOW</button>
                <button type="button" id="bdv-toggle-key-change-btn" class="bdv-admin-toggle-status">🔐 Cambiar Clave</button>
                <button type="button" id="bdv-admin-refresh-btn" class="bdv-admin-action-btn">↻</button>
              </div>
            </div>

            <!-- Caja: Crear Nuevo Proyecto -->
            <div id="bdv-create-project-box" style="display: none; margin-top: 12px; padding: 12px; background: rgba(34, 197, 94, 0.06); border: 1px dashed rgba(34, 197, 94, 0.45); border-radius: 8px;">
              <h5 style="margin: 0 0 8px 0; font-size: 0.85rem; color: #4ade80;">Alta de Nuevo Proyecto</h5>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <input type="text" id="bdv-np-name-en" class="bdv-tracker-input" placeholder="Project Name in English (default)" style="font-size: 0.8rem; padding: 6px 10px;" />
                <input type="text" id="bdv-np-name-es" class="bdv-tracker-input" placeholder="Nombre del Proyecto en Español (opcional)" style="font-size: 0.8rem; padding: 6px 10px;" />
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <input type="email" id="bdv-np-email" class="bdv-tracker-input" placeholder="Correo del Cliente" style="flex: 2; min-width: 180px; font-size: 0.8rem; padding: 6px 10px;" />
                  <input type="text" id="bdv-np-code" class="bdv-tracker-input" placeholder="PIN (ej. CL-2026)" style="flex: 1; min-width: 110px; font-size: 0.8rem; padding: 6px 10px;" />
                </div>
                <button type="button" id="bdv-np-submit-btn" class="bdv-tracker-btn" style="padding: 8px; font-size: 0.82rem; margin-top: 2px;" onclick="submitNewProject()">Guardar y Activar Proyecto</button>
              </div>
              <div id="bdv-np-status-msg" style="display: none; margin-top: 8px; font-size: 0.8rem;"></div>
            </div>

            <!-- Caja: Emitir Nuevo SOW con Folio -->
            <div id="bdv-create-sow-box" style="display: none; margin-top: 12px; padding: 12px; background: rgba(212, 175, 55, 0.08); border: 1px dashed rgba(212, 175, 55, 0.55); border-radius: 8px;">
              <h5 style="margin: 0 0 8px 0; font-size: 0.85rem; color: #e8c861;">📄 Emitir Statement of Work (SOW) y Generar Enlace de Firma</h5>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <input type="text" id="bdv-ns-client-name" class="bdv-tracker-input" placeholder="Nombre Completo del Cliente" style="font-size: 0.8rem; padding: 6px 10px;" />
                <input type="email" id="bdv-ns-client-email" class="bdv-tracker-input" placeholder="Correo Oficial del Cliente" style="font-size: 0.8rem; padding: 6px 10px;" />
                <input type="text" id="bdv-ns-biz-name" class="bdv-tracker-input" placeholder="Nombre Comercial o Empresa" style="font-size: 0.8rem; padding: 6px 10px;" />
                <textarea id="bdv-ns-scope" class="bdv-tracker-input" rows="2" placeholder="Resumen del alcance acordado en la entrevista..." style="font-size: 0.8rem; padding: 6px 10px; resize: vertical;"></textarea>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <input type="number" id="bdv-ns-total" class="bdv-tracker-input" placeholder="Presupuesto Total USD (ej. 850)" style="flex: 1; min-width: 140px; font-size: 0.8rem; padding: 6px 10px;" />
                  <input type="number" id="bdv-ns-deposit" class="bdv-tracker-input" placeholder="Depósito Inicial USD (ej. 300)" style="flex: 1; min-width: 140px; font-size: 0.8rem; padding: 6px 10px;" />
                </div>
                <button type="button" id="bdv-ns-submit-btn" class="bdv-tracker-btn" style="padding: 8px; font-size: 0.82rem; background: #e8c861 !important; color: #070a10 !important; font-weight: 700;" onclick="submitNewSowManual()">Generar Folio y Enlace SOW</button>
              </div>
              <div id="bdv-ns-status-msg" style="display: none; margin-top: 8px; font-size: 0.82rem;"></div>
            </div>

            <div id="bdv-admin-requests-section" style="display: none; margin-top: 14px; padding: 10px; background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 8px;">
              <h5 style="margin: 0 0 8px 0; font-size: 0.82rem; color: #e8c861;">📨 Solicitudes de Servicio Entrantes</h5>
              <div id="bdv-admin-requests-list" style="font-size: 0.78rem; display: flex; flex-direction: column; gap: 8px;"></div>
            </div>

            <div id="bdv-key-change-box" style="display: none; margin-top: 12px; padding: 12px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(212,175,55,0.3); border-radius: 8px;">
              <p style="font-size: 0.8rem; color: #cbd5e1; margin: 0 0 8px 0;">Ingresa tu nueva clave de acceso para este rol:</p>
              <div style="display: flex; gap: 8px;">
                <input type="password" id="bdv-new-role-pass" class="bdv-tracker-input" placeholder="Nueva clave (mín. 6 letras/números)" style="flex: 1; padding: 6px 10px; font-size: 0.82rem;" />
                <button type="button" class="bdv-admin-action-btn" onclick="submitPasswordChange()">Guardar Clave</button>
              </div>
              <div id="bdv-key-status-msg" style="display: none; margin-top: 8px; font-size: 0.82rem;"></div>
            </div>

            <div id="bdv-admin-projects-list" style="margin-top: 14px;">Cargando proyectos...</div>
          </div>
        </div>
      `;
      document.body.appendChild(modalRoot);

      function triggerAdminLogin() {
        const pass = (document.getElementById("bdv-admin-pass").value || "").trim();
        const authMsg = document.getElementById("bdv-admin-auth-msg");
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

      document.getElementById("bdv-admin-close-btn").addEventListener("click", () => {
        resetAdminPanelState(modalRoot);
      });

      modalRoot.addEventListener("click", (e) => {
        if (e.target === modalRoot) {
          resetAdminPanelState(modalRoot);
        }
      });

      document.getElementById("bdv-admin-login-btn").addEventListener("click", triggerAdminLogin);

      document.getElementById("bdv-admin-pass").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          triggerAdminLogin();
        }
      });

      document.getElementById("bdv-admin-refresh-btn").addEventListener("click", loadAdminProjects);

      document.getElementById("bdv-toggle-create-project-btn").addEventListener("click", () => {
        const box = document.getElementById("bdv-create-project-box");
        const sowBox = document.getElementById("bdv-create-sow-box");
        if (sowBox) sowBox.style.display = "none";
        if (box) box.style.display = box.style.display === "none" ? "block" : "none";
      });

      document.getElementById("bdv-toggle-create-sow-btn").addEventListener("click", () => {
        const box = document.getElementById("bdv-create-sow-box");
        const pBox = document.getElementById("bdv-create-project-box");
        if (pBox) pBox.style.display = "none";
        if (box) box.style.display = box.style.display === "none" ? "block" : "none";
      });

      document.getElementById("bdv-toggle-key-change-btn").addEventListener("click", () => {
        const box = document.getElementById("bdv-key-change-box");
        if (box) box.style.display = box.style.display === "none" ? "block" : "none";
      });
    }

    const btn = document.getElementById("bdv-admin-btn");
    if (btn) {
      btn.onclick = () => {
        const m = document.getElementById("bdv-admin-modal-root");
        if (m) {
          resetAdminPanelState(m);
          m.style.display = "flex";
          setTimeout(() => {
            const passInput = document.getElementById("bdv-admin-pass");
            if (passInput) {
              passInput.focus();
            }
          }, 60);
        }
      };
    }
  }

  window.generateSowForProject = function (row, clientName, clientEmail, businessName, scopeSummary) {
    const core = getCore();
    const sessionKey = window.__bdvSessionKey || "";
    const rowStatus = document.getElementById("row-status-" + row);

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
      .then((r) => r.json())
      .then((res) => {
        if (!rowStatus) return;
        if (res.ok && res.sowId) {
          const sowUrl = res.sowUrl || `https://batistadigitalventures.com/?sow=${res.sowId}`;
          rowStatus.style.color = "#4ade80";
          rowStatus.innerHTML = `
            ✓ SOW Creado: <strong style="color: #f8fafc;">${core.escapeHtml(res.sowId)}</strong><br/>
            <a href="${core.escapeHtml(sowUrl)}" target="_blank" rel="noopener noreferrer" style="color: #e8c861; text-decoration: underline; font-weight: bold;">Abrir Enlace SOW ↗</a>
            · <button type="button" class="bdv-admin-toggle-status" style="padding: 2px 6px; font-size: 0.7rem;" onclick="navigator.clipboard.writeText('${core.escapeHtml(sowUrl)}'); alert('Enlace copiado al portapapeles');">Copiar Enlace</button>
          `;
        } else {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "No se pudo generar el SOW.";
        }
      })
      .catch(() => {
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al emitir el SOW.";
        }
      });
  };

  window.submitNewSowManual = function () {
    const core = getCore();
    const name = (document.getElementById("bdv-ns-client-name").value || "").trim();
    const email = (document.getElementById("bdv-ns-client-email").value || "").trim().toLowerCase();
    const biz = (document.getElementById("bdv-ns-biz-name").value || "").trim();
    const scope = (document.getElementById("bdv-ns-scope").value || "").trim();
    const total = Number(document.getElementById("bdv-ns-total").value) || 0;
    const deposit = Number(document.getElementById("bdv-ns-deposit").value) || 0;
    const statusMsg = document.getElementById("bdv-ns-status-msg");
    const sessionKey = window.__bdvSessionKey || "";

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
      .then((r) => r.json())
      .then((res) => {
        if (!statusMsg) return;
        if (res.ok && res.sowId) {
          const sowUrl = res.sowUrl || `https://batistadigitalventures.com/?sow=${res.sowId}`;
          statusMsg.style.color = "#4ade80";
          statusMsg.innerHTML = `
            ✓ <strong>${core.escapeHtml(res.sowId)}</strong> generado exitosamente.<br/>
            <a href="${core.escapeHtml(sowUrl)}" target="_blank" rel="noopener noreferrer" style="color: #e8c861; text-decoration: underline;">Abrir SOW ↗</a>
            · <button type="button" class="bdv-admin-toggle-status" style="padding: 2px 6px; font-size: 0.72rem;" onclick="navigator.clipboard.writeText('${core.escapeHtml(sowUrl)}'); alert('Enlace SOW copiado');">Copiar Enlace</button>
          `;
        } else {
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = res.error || "No se pudo generar el SOW.";
        }
      })
      .catch(() => {
        if (statusMsg) {
          statusMsg.style.display = "block";
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = "Error de conexión al emitir el SOW.";
        }
      });
  };

  window.autofillProjectByIndex = function (idx) {
    const r = window.__bdvStoredRequests[idx];
    if (!r) return;

    const box = document.getElementById("bdv-create-project-box");
    if (box) box.style.display = "block";

    const emailInput = document.getElementById("bdv-np-email");
    const nameEnInput = document.getElementById("bdv-np-name-en");
    const nameEsInput = document.getElementById("bdv-np-name-es");
    const codeInput = document.getElementById("bdv-np-code");

    if (emailInput) emailInput.value = r.clientEmail || "";
    const finalName = r.businessName || (Array.isArray(r.services) && r.services[0]) || r.clientName || "Nuevo Proyecto";
    if (nameEnInput) nameEnInput.value = finalName;
    if (nameEsInput) nameEsInput.value = finalName;

    const randNum = Math.floor(1000 + Math.random() * 9000);
    if (codeInput && !codeInput.value) {
      codeInput.value = "CL-" + randNum;
    }

    box.scrollIntoView({ behavior: "smooth" });
  };

  window.deleteServiceRequestByIndex = function (idx) {
    const core = getCore();
    const r = window.__bdvStoredRequests[idx];
    if (!r || !r.id) return;
    if (!window.confirm("¿Eliminar esta solicitud de forma permanente?")) return;

    const sessionKey = window.__bdvSessionKey || "";
    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "delete_request",
        requestId: r.id
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          refreshAdminSessionView("✓ Solicitud eliminada correctamente.");
        } else {
          window.alert(res.error || "No se pudo eliminar la solicitud.");
        }
      })
      .catch(() => {
        window.alert("Error de red al eliminar la solicitud.");
      });
  };

  window.deleteProjectItem = function (row) {
    if (!row) return;
    if (!window.confirm("¿Eliminar este proyecto de forma permanente?")) return;

    const core = getCore();
    const sessionKey = window.__bdvSessionKey || "";
    const rowStatus = document.getElementById("row-status-" + row);

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "delete_project",
        row: row
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          refreshAdminSessionView("✓ Proyecto eliminado correctamente.");
        } else if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "No se pudo eliminar el proyecto.";
        }
      })
      .catch(() => {
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al eliminar el proyecto.";
        }
      });
  };

  window.submitNewProject = function () {
    const core = getCore();
    const nameEnInput = document.getElementById("bdv-np-name-en");
    const nameEsInput = document.getElementById("bdv-np-name-es");
    const emailInput = document.getElementById("bdv-np-email");
    const codeInput = document.getElementById("bdv-np-code");
    const statusMsg = document.getElementById("bdv-np-status-msg");
    const submitBtn = document.getElementById("bdv-np-submit-btn");

    const nameEn = (nameEnInput ? nameEnInput.value : "").trim();
    const nameEs = (nameEsInput ? nameEsInput.value : "").trim();
    const email = (emailInput ? emailInput.value : "").trim().toLowerCase();
    const code = (codeInput ? codeInput.value : "").trim().toUpperCase();
    const sessionKey = window.__bdvSessionKey || "";

    const primaryName = nameEn || nameEs;

    if (!primaryName || !email || code.length < 4) {
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = "Completa el nombre del proyecto, el correo y un PIN de al menos 4 caracteres.";
      }
      return;
    }

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
      .then(r => r.json())
      .then(res => {
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
          setTimeout(() => {
            if (statusMsg) statusMsg.style.display = "none";
            refreshAdminSessionView("✓ Nuevo proyecto activado en el portafolio.");
          }, 900);
        } else if (statusMsg) {
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = res.error || "No se pudo crear el proyecto.";
        }
      })
      .catch(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (statusMsg) {
          statusMsg.style.display = "block";
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = "Error de conexión al crear el proyecto.";
        }
      });
  };

  window.submitPasswordChange = function () {
    const core = getCore();
    const input = document.getElementById("bdv-new-role-pass");
    const newPass = (input ? input.value : "").trim();
    const statusMsg = document.getElementById("bdv-key-status-msg");

    if (!newPass || newPass.length < 6) {
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = "La nueva clave debe tener al menos 6 caracteres.";
      }
      return;
    }

    const sessionKey = window.__bdvSessionKey || "";
    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "change_my_password",
        newPassword: newPass
      })
    })
      .then(r => r.json())
      .then(res => {
        if (statusMsg) statusMsg.style.display = "block";
        if (res.ok) {
          window.__bdvSessionKey = newPass;
          input.value = "";
          statusMsg.style.color = "#4ade80";
          statusMsg.textContent = "✓ Clave actualizada exitosamente en el sistema.";
          setTimeout(() => {
            const box = document.getElementById("bdv-key-change-box");
            if (box) box.style.display = "none";
            statusMsg.style.display = "none";
          }, 2500);
        } else {
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = res.error || "No se pudo actualizar la clave.";
        }
      })
      .catch(() => {
        if (statusMsg) {
          statusMsg.style.display = "block";
          statusMsg.style.color = "#f87171";
          statusMsg.textContent = "Error de red al actualizar la clave.";
        }
      });
  };

  function loadAdminProjects() {
    const core = getCore();
    const listEl = document.getElementById("bdv-admin-projects-list");
    const roleLabel = document.getElementById("bdv-admin-role-label");
    const sessionKey = window.__bdvSessionKey || "";

    if (!listEl) return;

    listEl.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8;">Consultando proyectos...</p>`;

    fetch(`${core.apiUrl}?key=${encodeURIComponent(sessionKey)}`)
      .then(r => r.json())
      .then(res => {
        if (!res.ok) {
          listEl.innerHTML = `<p style="font-size: 0.8rem; color: #f87171;">Clave no válida o sin permiso.</p>`;
          return;
        }

        const isAdmin = res.role === "admin";
        window.__bdvIsAdmin = isAdmin;

        const createBtn = document.getElementById("bdv-toggle-create-project-btn");
        if (createBtn) createBtn.style.display = isAdmin ? "inline-block" : "none";

        const createSowBtn = document.getElementById("bdv-toggle-create-sow-btn");
        if (createSowBtn) createSowBtn.style.display = isAdmin ? "inline-block" : "none";

        if (roleLabel) {
          roleLabel.textContent = isAdmin
            ? "Admin · Control de Etapas, SOWs, PINs y Aprobaciones"
            : "Programador Partner · Reporte para Revisión y Confirmación";
        }

        const reqSection = document.getElementById("bdv-admin-requests-section");
        const reqList = document.getElementById("bdv-admin-requests-list");

        if (isAdmin && Array.isArray(res.requests) && res.requests.length && reqSection && reqList) {
          window.__bdvStoredRequests = res.requests;
          reqSection.style.display = "block";
          reqList.innerHTML = res.requests.map((r, idx) => {
            const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "";
            const srvList = Array.isArray(r.services) ? r.services.join(", ") : "";
            const escapedId = core.escapeHtml(r.id || "");
            const escapedEmail = core.escapeHtml(r.clientEmail || "");
            const escapedBiz = core.escapeHtml(r.businessName || "");
            const escapedClient = core.escapeHtml(r.clientName || "");

            return `
              <div style="background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
                <div>
                  <strong style="color: #f8fafc;">${escapedClient}</strong>
                  <span style="color: #94a3b8;">(${escapedEmail})</span>
                  ${escapedBiz ? `<div style="color: #e8c861; font-size: 0.75rem;">Negocio: ${escapedBiz}</div>` : ""}
                  ${srvList ? `<div style="color: #cbd5e1; font-size: 0.72rem;">Servicio: ${core.escapeHtml(srvList)}</div>` : ""}
                  <div style="color: #64748b; font-size: 0.7rem;">${escapedId} · ${dateStr}</div>
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="bdv-admin-action-btn" style="background: #e8c861 !important; color: #000 !important; font-weight: 700; padding: 4px 8px; font-size: 0.75rem;" onclick="autofillProjectByIndex(${idx})">
                    Usar en Nuevo Proyecto
                  </button>
                  <button type="button" class="bdv-admin-toggle-status" style="border-color: rgba(248, 113, 113, 0.45) !important; color: #f87171 !important; padding: 4px 8px; font-size: 0.75rem;" onclick="deleteServiceRequestByIndex(${idx})">
                    Eliminar
                  </button>
                </div>
              </div>
            `;
          }).join("");
        } else if (reqSection) {
          reqSection.style.display = "none";
        }

        if (!res.projects || !res.projects.length) {
          listEl.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8;">No hay proyectos registrados en la base de datos.</p>`;
          return;
        }

        const lang = core.getLang();

        listEl.innerHTML = res.projects.map(p => {
          const displayName = core.getProjectDisplayName(p, lang);

          let proposalObj = null;
          if (p.pendingProposal) {
            try { proposalObj = JSON.parse(p.pendingProposal); } catch (e) { proposalObj = null; }
          }

          const proposalBanner = proposalObj
            ? `<div style="margin-top: 10px; padding: 10px; border-radius: 8px; background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.45); font-size: 0.78rem;">
                 <strong style="color: #e8c861;">Propuesta de ${core.escapeHtml(proposalObj.devName || "Partner")}:</strong> Etapa ${proposalObj.stage}/6
                 ${proposalObj.notes ? `<div style="color: #e2e8f0; margin-top: 4px;">Nota: ${core.escapeHtml(proposalObj.notes)}</div>` : ""}
                 ${isAdmin
                   ? `<button type="button" class="bdv-admin-action-btn" style="margin-top: 8px;" onclick="approveProjectProposal(${p.row})">✓ Confirmar Avance y Notificar</button>`
                   : `<div style="color: #cbd5e1; margin-top: 4px;">Estado: Enviado a revisión del administrador.</div>`
                 }
               </div>`
            : "";

          const adminActionButtons = isAdmin
            ? `<div class="bdv-admin-grid-row" style="margin-top: 10px; gap: 6px;">
                 <input type="text" id="pin-input-${p.row}" class="bdv-tracker-input" style="max-width: 140px; padding: 6px 8px; font-size: 0.8rem;" value="${core.escapeHtml(p.code)}" placeholder="PIN" />
                 <button type="button" class="bdv-admin-toggle-status" onclick="updateProjectPin(${p.row})">Cambiar PIN</button>
                 <button type="button" class="bdv-admin-action-btn" style="background: #e8c861 !important; color: #070a10 !important; font-weight: 700;" onclick="generateSowForProject(${p.row}, '${core.escapeHtml(p.name)}', '${core.escapeHtml(p.email)}', '${core.escapeHtml(displayName)}', '${core.escapeHtml(displayName)}')">📄 Generar SOW</button>
                 <button type="button" class="bdv-admin-toggle-status" style="border-color: rgba(248, 113, 113, 0.45) !important; color: #f87171 !important;" onclick="deleteProjectItem(${p.row})">Eliminar</button>
               </div>`
            : "";

          const devNotesInput = !isAdmin
            ? `<input type="text" id="dev-note-${p.row}" class="bdv-tracker-input" style="width: 100%; margin-top: 8px; padding: 6px 10px; font-size: 0.8rem;" placeholder="Resumen de lo avanzado para revisión del admin..." />`
            : "";

          const primaryBtnText = isAdmin ? "Guardar y Notificar" : "Enviar a Revisión";

          return `
            <div class="bdv-admin-project-item" data-row="${p.row}">
              <div class="bdv-admin-grid-row">
                <div>
                  <strong style="color: #f8fafc; font-size: 0.9rem;">${core.escapeHtml(displayName)}</strong>
                  <span style="font-size: 0.75rem; color: #94a3b8;">(${core.escapeHtml(p.id)})</span>
                  <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 2px;">
                    ${isAdmin ? `Email: ${core.escapeHtml(p.email)} | ` : ""}PIN: <span style="color: #e8c861; font-weight: 700;">${core.escapeHtml(p.code)}</span>
                  </div>
                </div>
                <span class="bdv-tracker-status-tag ${p.accessStatus === 'ACTIVE' ? 'bdv-status-active' : 'bdv-status-disabled'}">
                  ${core.escapeHtml(p.accessStatus)}
                </span>
              </div>

              ${adminActionButtons}
              ${proposalBanner}
              ${devNotesInput}

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
                  ${primaryBtnText}
                </button>
              </div>
              <div id="row-status-${p.row}" style="display: none; margin-top: 6px; font-size: 0.78rem;"></div>
            </div>
          `;
        }).join("");
      })
      .catch(() => {
        listEl.innerHTML = `<p style="font-size: 0.8rem; color: #f87171;">Error al conectar con la API de proyectos.</p>`;
      });
  }

  window.updateProjectPin = function (row) {
    const core = getCore();
    const input = document.getElementById("pin-input-" + row);
    const newCode = (input ? input.value : "").trim().toUpperCase();
    const sessionKey = window.__bdvSessionKey || "";
    const rowStatus = document.getElementById("row-status-" + row);

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "update_pin",
        row: row,
        code: newCode
      })
    })
      .then(r => r.json())
      .then(res => {
        if (rowStatus) rowStatus.style.display = "block";
        if (res.ok) {
          if (rowStatus) {
            rowStatus.style.color = "#4ade80";
            rowStatus.textContent = `✓ PIN actualizado a ${res.code}`;
          }
          setTimeout(() => refreshAdminSessionView(`✓ PIN actualizado a ${res.code}.`), 800);
        } else if (rowStatus) {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "No se pudo cambiar el PIN.";
        }
      })
      .catch(() => {
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al cambiar el PIN.";
        }
      });
  };

  window.approveProjectProposal = function (row) {
    const core = getCore();
    const sessionKey = window.__bdvSessionKey || "";
    const rowStatus = document.getElementById("row-status-" + row);

    fetch(core.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        key: sessionKey,
        action: "approve_proposal",
        row: row
      })
    })
      .then(r => r.json())
      .then(res => {
        if (rowStatus) rowStatus.style.display = "block";
        if (res.ok) {
          if (rowStatus) {
            rowStatus.style.color = "#4ade80";
            rowStatus.textContent = `✓ Trabajo aprobado y activado en Etapa ${res.stage}/6.`;
          }
          setTimeout(() => {
            refreshAdminSessionView(`✓ Trabajo aprobado en Etapa ${res.stage}/6. Caso actualizado.`);
          }, 900);
        } else if (rowStatus) {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "No se pudo confirmar la propuesta.";
        }
      })
      .catch(() => {
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al confirmar propuesta.";
        }
      });
  };

  window.updateProjectStage = function (row) {
    const core = getCore();
    const sel = document.getElementById("stage-select-" + row);
    const stage = Number(sel.value);
    const accessStatus = stage === 6 ? "DISABLED" : "ACTIVE";
    const sessionKey = window.__bdvSessionKey || "";
    const isAdmin = Boolean(window.__bdvIsAdmin);
    const noteInput = document.getElementById("dev-note-" + row);
    const notes = noteInput ? noteInput.value.trim() : "";
    const rowStatus = document.getElementById("row-status-" + row);

    sel.disabled = true;

    const payload = isAdmin
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
      .then(r => r.json())
      .then(res => {
        sel.disabled = false;
        if (rowStatus) rowStatus.style.display = "block";
        if (res.ok) {
          const msg = isAdmin
            ? `✓ Trabajo aprobado y activado en Etapa ${stage}/6.`
            : `✓ Avance enviado a revisión del administrador.`;
          if (rowStatus) {
            rowStatus.style.color = "#4ade80";
            rowStatus.textContent = msg;
          }
          setTimeout(() => {
            refreshAdminSessionView(msg);
          }, 900);
        } else if (rowStatus) {
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = res.error || "Error al procesar la solicitud.";
        }
      })
      .catch(() => {
        sel.disabled = false;
        if (rowStatus) {
          rowStatus.style.display = "block";
          rowStatus.style.color = "#f87171";
          rowStatus.textContent = "Error de red al actualizar.";
        }
      });
  };

  window.BDV_OPS = {
    onLanguageChange: function () {
      if (window.__bdvSessionKey && document.getElementById("bdv-admin-dash-view")?.style.display === "block") {
        loadAdminProjects();
      }
    }
  };

  function initOps() {
    applyClientTrackerModal();
    applyAdminPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOps);
  } else {
    initOps();
  }
})();
