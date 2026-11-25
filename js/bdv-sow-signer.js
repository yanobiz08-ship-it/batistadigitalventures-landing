/* Batista Digital Ventures LLC - Digital SOW Viewer, E-Signature & Download */
(function () {
  function getCore() {
    return window.BDV_CORE || {
      apiUrl: "https://bdv-backend-api.yanobiz08.workers.dev",
      escapeHtml: (s) =>
        String(s || "")
          .split("&").join("&amp;")
          .split("<").join("&lt;")
          .split(">").join("&gt;")
          .split('"').join("&quot;")
          .split("'").join("&#039;"),
      getLang: () => {
        const l = (document.documentElement.getAttribute("lang") || "").toLowerCase();
        return l.startsWith("es") ? "es" : "en";
      }
    };
  }

  let currentSowData = null;

  function buildPrintableOrTextDocument(sow) {
    const sig = sow.signature || null;
    const lines = [
      "=================================================================",
      "STATEMENT OF WORK (SOW) / ACUERDO DE ALCANCE DE TRABAJO",
      "Batista Digital Ventures LLC · Lompoc, California",
      "Web: https://batistadigitalventures.com | Email: contact@batistadigitalventures.com",
      "=================================================================",
      `Folio SOW: ${sow.sowId || ""}`,
      `Fecha de Emisión: ${sow.createdAt || ""}`,
      `Estado: ${sow.status || "DRAFT"}`,
      "",
      "1. PARTES",
      `Proveedor: Batista Digital Ventures LLC (Lompoc, California)`,
      `Cliente: ${sow.clientName || ""}`,
      `Empresa / Proyecto: ${sow.businessName || "N/A"}`,
      `Correo del Cliente: ${sow.clientEmail || ""}`,
      "",
      "2. ALCANCE Y ENTREGABLES",
      sow.scopeSummary || "Conforme a la ficha de diagnóstico y entrevista inicial.",
      "",
      "3. ESTRUCTURA POR 6 ETAPAS Y PAGOS",
      `- Presupuesto Total Acordado: $${sow.totalAmount || 0} USD`,
      `- Depósito Inicial (Etapa 2): $${sow.depositAmount || 0} USD`,
      "- Etapas: 1. Intake (10%) -> 2. SOW & PIN (25%) -> 3. Arquitectura (45%) -> 4. Core & QA (75%) -> 5. Revisión 5 días hábiles (90%) -> 6. Liquidación 100% y entrega (PIN expira; no incluye mantenimiento mensual).",
      "",
      "4. TÉRMINOS CLAVE (LEY DE CALIFORNIA)",
      "- Ventana de revisión: 5 días hábiles tras la entrega de un hito.",
      "- Propiedad intelectual: Se transfiere al liquidar el 100% del proyecto. Librerías y herramientas base siguen siendo de Batista Digital Ventures LLC.",
      "- Órdenes de cambio: Trabajos extra fuera del alcance requieren Orden de Cambio firmada y pagada antes de ejecutarse.",
      "- Jurisdicción: Leyes del Estado de California, EE. UU. (UETA / ESIGN).",
      "",
      "5. CONSTANCIA DE FIRMA DIGITAL",
      sig
        ? [
            `Firmado por: ${sig.signerName}`,
            `Cargo / Rol: ${sig.signerTitle || "Client"}`,
            `Fecha y Hora (UTC): ${sig.timestamp}`,
            `IP Registrada: ${sig.ip || "N/A"}`,
            `Consentimiento Legal: Aceptado`
          ].join("\n")
        : "Pendiente de firma digital del cliente."
    ];
    return lines.join("\n");
  }

  function downloadSowTextFile(sow) {
    if (!sow) return;
    const content = buildPrintableOrTextDocument(sow);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sow.sowId || "BDV-SOW"}-${sow.status || "DOCUMENTO"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function printSowAsPdf(sow) {
    if (!sow) return;
    const core = getCore();
    const esc = core.escapeHtml;
    const sig = sow.signature || null;
    const win = window.open("", "_blank", "width=820,height=900");
    if (!win) {
      downloadSowTextFile(sow);
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${esc(sow.sowId)} — Batista Digital Ventures LLC</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 32px; line-height: 1.55; max-width: 780px; margin: 0 auto; }
          h1 { margin: 0 0 4px; font-size: 20px; }
          .meta { color: #4b5563; font-size: 13px; margin-bottom: 20px; border-bottom: 2px solid #d4af37; padding-bottom: 12px; }
          h2 { font-size: 15px; margin: 18px 0 6px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
          .box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; margin: 8px 0; font-size: 13px; }
          .sig-box { background: #fffbeb; border: 1px solid #d4af37; border-radius: 8px; padding: 14px; margin-top: 16px; font-size: 13px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px;">
          <button onclick="window.print()" style="padding: 8px 14px; background: #111827; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Guardar como PDF / Imprimir</button>
        </div>
        <h1>STATEMENT OF WORK (SOW) — BATISTA DIGITAL VENTURES LLC</h1>
        <div class="meta">
          <strong>Folio:</strong> ${esc(sow.sowId)} · <strong>Estado:</strong> ${esc(sow.status)} · <strong>Ubicación:</strong> Lompoc, California
        </div>

        <h2>1. Partes</h2>
        <div class="box">
          <strong>Proveedor:</strong> Batista Digital Ventures LLC (contact@batistadigitalventures.com)<br/>
          <strong>Cliente:</strong> ${esc(sow.clientName)}<br/>
          <strong>Empresa / Proyecto:</strong> ${esc(sow.businessName || "N/A")}<br/>
          <strong>Correo del Cliente:</strong> ${esc(sow.clientEmail)}
        </div>

        <h2>2. Alcance y Entregables</h2>
        <div class="box">${esc(sow.scopeSummary || "Conforme a entrevista inicial y diagnóstico.")}</div>

        <h2>3. Etapas y Condiciones Económicas</h2>
        <div class="box">
          <strong>Presupuesto Total:</strong> $${esc(sow.totalAmount || 0)} USD · <strong>Depósito Inicial (Etapa 2):</strong> $${esc(sow.depositAmount || 0)} USD<br/>
          Etapas: 1. Intake (10%) → 2. SOW & PIN (25%) → 3. Arquitectura (45%) → 4. Core & QA (75%) → 5. Revisión 5 días hábiles (90%) → 6. Liquidación 100% y entrega (PIN expira; sin mantenimiento mensual incluido).
        </div>

        <h2>4. Términos Legales (California)</h2>
        <div class="box">
          • <strong>Ventana de revisión:</strong> 5 días hábiles tras la notificación de entrega de un hito.<br/>
          • <strong>Propiedad intelectual:</strong> Se transfiere al liquidar el 100% del proyecto. Librerías y herramientas base siguen siendo propiedad de Batista Digital Ventures LLC.<br/>
          • <strong>Órdenes de cambio:</strong> Trabajos fuera del alcance requieren Orden de Cambio firmada y pagada antes de ejecutarse.<br/>
          • <strong>Ley aplicable:</strong> Estado de California, EE. UU. (UETA / ESIGN).
        </div>

        <h2>5. Firma Digital</h2>
        <div class="sig-box">
          ${
            sig
              ? `<strong>Firmado electrónicamente por:</strong> ${esc(sig.signerName)} (${esc(sig.signerTitle || "Client")})<br/>
                 <strong>Fecha y Hora (UTC):</strong> ${esc(sig.timestamp)}<br/>
                 <strong>IP Registrada:</strong> ${esc(sig.ip || "N/A")}<br/>
                 <strong>Consentimiento:</strong> Aceptado bajo ESIGN / UETA`
              : `<em>Documento pendiente de firma digital del cliente.</em>`
          }
        </div>
      </body>
      </html>
    `);
    win.document.close();
  }

  function ensureSowModal() {
    let modal = document.getElementById("bdv-sow-modal-root");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "bdv-sow-modal-root";
    modal.className = "bdv-modal-overlay";
    modal.style.cssText =
      "display: none; position: fixed; inset: 0; z-index: 99999; overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; padding: 16px 12px 70px 12px !important; background: rgba(0, 0, 0, 0.85) !important;";

    modal.innerHTML = `
      <div class="bdv-tracker-card" style="max-width: 620px; width: 100%; margin: 8px auto 24px auto !important; height: auto !important; max-height: none !important; overflow: visible !important;">
        <div class="bdv-modal-top">
          <h3 id="bdv-sow-title" style="margin: 0; font-size: 1.05rem; color: #e8c861;">Statement of Work · BDV LLC</h3>
          <button type="button" id="bdv-sow-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>
        </div>
        <div id="bdv-sow-body" style="margin-top: 12px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.5;"></div>
        <div id="bdv-sow-sign-form-wrap" style="margin-top: 14px; border-top: 1px dashed rgba(212, 175, 55, 0.35); padding-top: 14px;">
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <input type="text" id="bdv-sow-signer-name" class="bdv-tracker-input" placeholder="Escribe tu nombre completo como firma digital" />
            <input type="text" id="bdv-sow-signer-title" class="bdv-tracker-input" placeholder="Tu cargo o relación (ej. Dueño / Director)" value="Owner / Client" />
            <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.78rem; color: #e2e8f0; cursor: pointer;">
              <input type="checkbox" id="bdv-sow-consent-check" style="margin-top: 3px; accent-color: #d4af37;" />
              <span>He leído y acepto los términos de este Statement of Work (6 etapas, ventana de revisión de 5 días hábiles, transferencia de propiedad intelectual al liquidar el 100%, expiración del código secreto sin mantenimiento incluido y ley de California).</span>
            </label>
            <button type="button" id="bdv-sow-sign-btn" class="bdv-tracker-btn" style="background: #e8c861 !important; color: #070a10 !important; font-weight: 700;">Firmar Acuerdo Digitalmente</button>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
          <button type="button" id="bdv-sow-print-btn" class="bdv-admin-toggle-status" style="flex: 1;">Descargar / Guardar PDF</button>
          <button type="button" id="bdv-sow-txt-btn" class="bdv-admin-toggle-status" style="flex: 1;">Descargar Comprobante (.txt)</button>
        </div>
        <div id="bdv-sow-status-msg" style="display: none; margin-top: 10px; font-size: 0.82rem;"></div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("bdv-sow-close-btn").addEventListener("click", () => {
      modal.style.setProperty("display", "none", "important");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.setProperty("display", "none", "important");
      }
    });

    document.getElementById("bdv-sow-print-btn").addEventListener("click", () => {
      if (currentSowData) printSowAsPdf(currentSowData);
    });

    document.getElementById("bdv-sow-txt-btn").addEventListener("click", () => {
      if (currentSowData) downloadSowTextFile(currentSowData);
    });

    document.getElementById("bdv-sow-sign-btn").addEventListener("click", () => {
      const core = getCore();
      const statusEl = document.getElementById("bdv-sow-status-msg");
      const signerName = (document.getElementById("bdv-sow-signer-name").value || "").trim();
      const signerTitle = (document.getElementById("bdv-sow-signer-title").value || "Owner / Client").trim();
      const consentAccepted = Boolean(document.getElementById("bdv-sow-consent-check").checked);

      if (!currentSowData || !currentSowData.sowId) return;

      if (!signerName || !consentAccepted) {
        statusEl.style.display = "block";
        statusEl.style.color = "#f87171";
        statusEl.textContent = "Escribe tu nombre completo como firma y marca la casilla de aceptación.";
        return;
      }

      const btn = document.getElementById("bdv-sow-sign-btn");
      btn.disabled = true;
      statusEl.style.display = "block";
      statusEl.style.color = "#94a3b8";
      statusEl.textContent = "Registrando firma y enviando copia por correo...";

      fetch(core.apiUrl, {
        method: "POST",
        body: JSON.stringify({
          action: "sign_sow",
          sowId: currentSowData.sowId,
          signerName,
          signerTitle,
          consentAccepted
        })
      })
        .then((r) => r.json())
        .then((res) => {
          btn.disabled = false;
          if (!res.ok) {
            statusEl.style.color = "#f87171";
            statusEl.textContent = res.error || "No se pudo registrar la firma.";
            return;
          }

          currentSowData.status = "SIGNED";
          currentSowData.signature = res.signature;
          renderSowContent(currentSowData);

          statusEl.style.color = "#4ade80";
          statusEl.textContent =
            "✓ Acuerdo firmado. Se envió copia a Batista Digital Ventures LLC y a tu correo. Ya puedes descargarlo.";
        })
        .catch(() => {
          btn.disabled = false;
          statusEl.style.color = "#f87171";
          statusEl.textContent = "Error de conexión al firmar el documento.";
        });
    });

    return modal;
  }

  function renderSowContent(sow) {
    const core = getCore();
    const esc = core.escapeHtml;
    const titleEl = document.getElementById("bdv-sow-title");
    const bodyEl = document.getElementById("bdv-sow-body");
    const formWrap = document.getElementById("bdv-sow-sign-form-wrap");

    if (titleEl) {
      titleEl.textContent = `Statement of Work · ${sow.sowId || "BDV"} (${sow.status || "DRAFT"})`;
    }

    const sigHtml = sow.signature
      ? `<div style="margin-top: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.4); color: #dcfce7;">
           <strong>Firmado electrónicamente por:</strong> ${esc(sow.signature.signerName)} (${esc(sow.signature.signerTitle || "Client")})<br/>
           <strong>Fecha y Hora (UTC):</strong> ${esc(sow.signature.timestamp)}<br/>
           <strong>IP Registrada:</strong> ${esc(sow.signature.ip || "N/A")}
         </div>`
      : `<div style="margin-top: 10px; color: #e8c861; font-size: 0.78rem;">Estado actual: Pendiente de firma digital.</div>`;

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;">
          <div><strong>Proveedor:</strong> Batista Digital Ventures LLC (Lompoc, California)</div>
          <div><strong>Cliente:</strong> ${esc(sow.clientName)} ${sow.businessName ? `· <strong>Empresa:</strong> ${esc(sow.businessName)}` : ""}</div>
          <div><strong>Correo:</strong> ${esc(sow.clientEmail)}</div>
          <div style="margin-top: 8px;"><strong>Alcance y Entregables:</strong><br/>${esc(sow.scopeSummary || "Conforme a la ficha de diagnóstico y entrevista inicial.")}</div>
          <div style="margin-top: 8px; color: #e8c861;">
            <strong>Presupuesto Total:</strong> $${esc(sow.totalAmount || 0)} USD · <strong>Depósito Inicial (Etapa 2):</strong> $${esc(sow.depositAmount || 0)} USD
          </div>
          <div style="margin-top: 8px; font-size: 0.76rem; color: #94a3b8;">
            <strong>Condiciones clave:</strong> 6 etapas (10% → 25% → 45% → 75% → 90% → 100%), ventana de revisión de 5 días hábiles, transferencia de propiedad intelectual al liquidar el 100%, código secreto temporal que expira al cerrar (sin mantenimiento mensual incluido) y ley de California.
          </div>
          ${sigHtml}
        </div>
      `;
    }

    if (formWrap) {
      formWrap.style.display = sow.status === "SIGNED" ? "none" : "block";
    }
  }

  window.BDV_SOW = {
    openById: function (sowId) {
      const core = getCore();
      const cleanId = String(sowId || "").trim().toUpperCase();
      if (!cleanId) return;

      const modal = ensureSowModal();
      const bodyEl = document.getElementById("bdv-sow-body");
      const statusEl = document.getElementById("bdv-sow-status-msg");
      if (statusEl) statusEl.style.display = "none";
      if (bodyEl) bodyEl.innerHTML = `<p style="color: #94a3b8;">Cargando documento ${core.escapeHtml(cleanId)}...</p>`;
      modal.style.setProperty("display", "block", "important");

      fetch(`${core.apiUrl}?sow=${encodeURIComponent(cleanId)}`)
        .then((r) => r.json())
        .then((res) => {
          if (!res.ok || !res.sow) {
            if (bodyEl) {
              bodyEl.innerHTML = `<p style="color: #f87171;">${core.escapeHtml(res.error || "No se encontró el documento SOW.")}</p>`;
            }
            const formWrap = document.getElementById("bdv-sow-sign-form-wrap");
            if (formWrap) formWrap.style.display = "none";
            return;
          }
          currentSowData = res.sow;
          renderSowContent(currentSowData);
        })
        .catch(() => {
          if (bodyEl) {
            bodyEl.innerHTML = `<p style="color: #f87171;">Error al consultar el documento SOW.</p>`;
          }
        });
    },

    createFromAdmin: function (payload) {
      const core = getCore();
      const sessionKey = window.__bdvSessionKey || "";
      return fetch(core.apiUrl, {
        method: "POST",
        body: JSON.stringify(Object.assign({ key: sessionKey, action: "create_sow" }, payload))
      }).then((r) => r.json());
    }
  };

  function checkQueryParamOnLoad() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const sowParam = (params.get("sow") || "").trim().toUpperCase();
      if (sowParam) {
        window.BDV_SOW.openById(sowParam);
      }
    } catch (_) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkQueryParamOnLoad);
  } else {
    checkQueryParamOnLoad();
  }
})();
