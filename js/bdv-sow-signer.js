/* Batista Digital Ventures LLC - Digital SOW Viewer, E-Signature, Stripe Checkout & Download */
(function () {
  // window.BDV_CORE comes from brand-media.js, which is loaded (deferred) before this file.
  function getCore() {
    return window.BDV_CORE;
  }

  let currentSowData = null;

  // Key legal terms of every SOW (Spanish, like the rest of the SOW document), shared by the .txt
  // receipt and the printable / PDF version.
  const SOW_KEY_TERMS = [
    ["Ventana de revisión", "5 días hábiles tras la notificación de entrega de un hito."],
    ["Pagos y reembolsos", "Los pagos por etapa no son reembolsables; el depósito solo se reembolsa si el cliente cancela antes de iniciar la Etapa 3, según los Términos de Servicio."],
    ["Propiedad intelectual", "Se transfiere al liquidar el 100% del proyecto. Librerías y herramientas base siguen siendo propiedad de Batista Digital Ventures LLC; los componentes de terceros y de código abierto se rigen por sus licencias."],
    ["Órdenes de cambio", "Trabajos extra fuera del alcance requieren Orden de Cambio firmada y pagada antes de ejecutarse."],
    ["Términos de Servicio", "Los Términos de Servicio publicados en batistadigitalventures.com, vigentes a la fecha de firma, forman parte de este SOW; si se contradicen, prevalece este SOW."],
    ["Ley aplicable y firma", "Estado de California, EE. UU. Firma y registros electrónicos válidos conforme a E-SIGN y UETA."]
  ];

  function isSowPaid(sow) {
    if (!sow) return false;
    const statusText = String(sow.paymentStatus || "").toUpperCase();
    return Boolean(sow.lastPaidAt) || statusText.includes("PAGADO") || statusText.includes("PAID");
  }

  function buildPrintableOrTextDocument(sow) {
    const sig = sow.signature || null;
    const paidInfo = isSowPaid(sow)
      ? `${sow.paymentStatus || "PAGADO"} | Monto: $${sow.lastPaidAmountUsd || sow.depositAmount || 0} USD | Fecha: ${sow.lastPaidAt || "N/A"}`
      : `Pendiente de pago (${sow.paymentStatus || "PENDING"})`;

    const lines = [
      "=================================================================",
      "STATEMENT OF WORK (SOW) / ACUERDO DE ALCANCE DE TRABAJO",
      "Batista Digital Ventures LLC · Lompoc, California",
      "Web: https://batistadigitalventures.com | Email: contact@batistadigitalventures.com",
      "=================================================================",
      `Folio SOW: ${sow.sowId || ""}`,
      `Fecha de Emisión: ${sow.createdAt || ""}`,
      `Estado del Acuerdo: ${sow.status || "DRAFT"}`,
      `Estado de Pago: ${paidInfo}`,
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
      ...SOW_KEY_TERMS.map(([label, text]) => `- ${label}: ${text}`),
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

    const paymentSummaryHtml = isSowPaid(sow)
      ? `<br/><strong>Estado de Pago:</strong> ${esc(sow.paymentStatus || "PAGADO")} ($${esc(sow.lastPaidAmountUsd || sow.depositAmount || 0)} USD)`
      : `<br/><strong>Estado de Pago:</strong> ${esc(sow.paymentStatus || "Pendiente")}`;

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
          <strong>Folio:</strong> ${esc(sow.sowId)} · <strong>Estado:</strong> ${esc(sow.status)} · <strong>Ubicación:</strong> Lompoc, California${paymentSummaryHtml}
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
          ${SOW_KEY_TERMS.map(([label, text]) => `- <strong>${label}:</strong> ${text}`).join("<br/>")}
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

  async function requestStripeCheckoutSession(opts) {
    const core = getCore();
    const options = opts || {};
    const amountUsd = Number(options.amountUsd || 0);

    if (!amountUsd || amountUsd < 0.5) {
      return { ok: false, error: "Monto inválido para Stripe Checkout (mínimo $0.50 USD)." };
    }

    const sowIdClean = String(options.sowId || (currentSowData && currentSowData.sowId) || "")
      .trim()
      .toUpperCase();
    const paymentType = String(options.paymentType || "deposit").trim();
    const targetStage = Number(options.targetStage || 2);
    const clientEmail = String(
      options.clientEmail || (currentSowData && currentSowData.clientEmail) || ""
    )
      .trim()
      .toLowerCase();

    const labelType =
      paymentType === "final_settlement"
        ? "Liquidación Final (100%)"
        : paymentType === "milestone"
          ? "Hito de Proyecto"
          : "Depósito Inicial";

    const itemTitle =
      options.itemTitle ||
      `${labelType}${sowIdClean ? ` (${sowIdClean})` : ""} — ${
        options.businessName || options.clientName || (currentSowData && (currentSowData.businessName || currentSowData.clientName)) || "Batista Digital Ventures LLC"
      }`;

    const returnBaseUrl =
      options.returnBaseUrl || `${window.location.origin}${window.location.pathname}`;

    const resp = await fetch(core.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_checkout",
        sowId: sowIdClean,
        clientEmail,
        amountUsd,
        paymentType,
        targetStage,
        itemTitle,
        returnBaseUrl
      })
    });

    return resp.json();
  }

  async function startStripeCheckoutForSow(sow) {
    const statusEl = document.getElementById("bdv-sow-status-msg");
    const payBtn = document.getElementById("bdv-sow-stripe-pay-btn");

    if (!sow || !sow.sowId) return;

    const depositAmount = Number(sow.depositAmount || 0);
    if (!depositAmount || depositAmount < 0.5) {
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "#f87171";
        statusEl.textContent = "Este SOW no tiene un monto de depósito válido configurado para pago con tarjeta.";
      }
      return;
    }

    if (payBtn) {
      payBtn.disabled = true;
      payBtn.textContent = "Conectando con Stripe...";
    }
    if (statusEl) {
      statusEl.style.display = "block";
      statusEl.style.color = "#94a3b8";
      statusEl.textContent = "Generando sesión segura de pago con Stripe...";
    }

    try {
      const res = await requestStripeCheckoutSession({
        sowId: sow.sowId,
        clientEmail: sow.clientEmail || "",
        businessName: sow.businessName || "",
        clientName: sow.clientName || "",
        amountUsd: depositAmount,
        paymentType: "deposit",
        targetStage: 2,
        itemTitle: `Depósito Inicial (${sow.sowId}) — ${sow.businessName || sow.clientName || "Batista Digital Ventures LLC"}`,
        returnBaseUrl: `${window.location.origin}${window.location.pathname}`
      });

      if (!res.ok || !res.checkoutUrl) {
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.textContent = `Pagar Depósito ($${depositAmount} USD) con Stripe`;
        }
        if (statusEl) {
          statusEl.style.display = "block";
          statusEl.style.color = "#f87171";
          statusEl.textContent = res.error || "No se pudo iniciar la sesión de pago en Stripe.";
        }
        return;
      }

      window.location.href = res.checkoutUrl;
    } catch (_) {
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.textContent = `Pagar Depósito ($${depositAmount} USD) con Stripe`;
      }
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "#f87171";
        statusEl.textContent = "Error de conexión al iniciar el pago con Stripe.";
      }
    }
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
              <span data-i18n="sowConsent">${getCore().escapeHtml(window.BDV_t("sowConsent"))}</span>
            </label>
            <button type="button" class="bdv-link-btn" style="align-self: flex-start;" data-legal="terms" data-i18n="legalTermsBtn">${getCore().escapeHtml(window.BDV_t("legalTermsBtn"))}</button>
            <button type="button" id="bdv-sow-sign-btn" class="bdv-tracker-btn" style="background: #e8c861 !important; color: #070a10 !important; font-weight: 700;">Firmar Acuerdo Digitalmente</button>
          </div>
        </div>
        <div id="bdv-sow-payment-wrap" style="display: none; margin-top: 14px; border-top: 1px dashed rgba(212, 175, 55, 0.35); padding-top: 14px;"></div>
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
        headers: { "Content-Type": "application/json" },
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
            "✓ Acuerdo firmado. Se envió copia a Batista Digital Ventures LLC y a tu correo. Ahora puedes completar el pago con tarjeta.";
        })
        .catch(() => {
          btn.disabled = false;
          statusEl.style.color = "#f87171";
          statusEl.textContent = "Error de conexión al firmar el documento.";
        });
    });

    return modal;
  }

  function renderPaymentSection(sow) {
    const core = getCore();
    const esc = core.escapeHtml;
    const payWrap = document.getElementById("bdv-sow-payment-wrap");
    if (!payWrap) return;

    const isSigned = sow && sow.status === "SIGNED";
    if (!isSigned) {
      payWrap.style.display = "none";
      payWrap.innerHTML = "";
      return;
    }

    payWrap.style.display = "block";

    if (isSowPaid(sow)) {
      payWrap.innerHTML = `
        <div style="padding: 12px 14px; border-radius: 10px; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(74, 222, 128, 0.45); color: #dcfce7;">
          <strong>✓ Pago Registrado:</strong> ${esc(sow.paymentStatus || "PAGADO")}
          ${sow.lastPaidAt ? `<div style="font-size: 0.74rem; color: #bbf7d0; margin-top: 4px;">Confirmado: ${esc(sow.lastPaidAt)}</div>` : ""}
        </div>
      `;
      return;
    }

    const depositUsd = Number(sow.depositAmount || 0);
    payWrap.innerHTML = `
      <div style="padding: 14px; border-radius: 10px; background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.4);">
        <div style="font-weight: 700; color: #e8c861; margin-bottom: 6px;">Liquidación de Depósito Inicial (Stripe Checkout)</div>
        <div style="font-size: 0.78rem; color: #cbd5e1; margin-bottom: 12px;">
          Acuerdo firmado. Completa el depósito acordado de <strong>$${esc(depositUsd)} USD</strong> a favor de <strong>Batista Digital Ventures LLC</strong> para activar la fase de ejecución.
        </div>
        <button type="button" id="bdv-sow-stripe-pay-btn" class="bdv-tracker-btn" style="background: #e8c861 !important; color: #070a10 !important; font-weight: 700; width: 100%;">
          Pagar Depósito ($${esc(depositUsd)} USD) con Stripe
        </button>
      </div>
    `;

    const payBtn = document.getElementById("bdv-sow-stripe-pay-btn");
    if (payBtn) {
      payBtn.addEventListener("click", () => {
        startStripeCheckoutForSow(sow);
      });
    }
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

    const payBadgeHtml = isSowPaid(sow)
      ? `<div style="margin-top: 8px; color: #4ade80; font-size: 0.78rem;"><strong>Estado de Pago:</strong> ${esc(sow.paymentStatus || "PAGADO")}</div>`
      : `<div style="margin-top: 8px; color: #94a3b8; font-size: 0.76rem;"><strong>Estado de Pago:</strong> ${esc(sow.paymentStatus || "Pendiente")}</div>`;

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
          ${payBadgeHtml}
          <div style="margin-top: 8px; font-size: 0.76rem; color: #94a3b8;">
            <strong>Condiciones clave:</strong> 6 etapas (10% → 25% → 45% → 75% → 90% → 100%), ventana de revisión de 5 días hábiles, pagos y reembolsos según los Términos de Servicio, transferencia de propiedad intelectual al liquidar el 100%, código secreto temporal que expira al cerrar (sin mantenimiento mensual incluido) y ley de California.
          </div>
          ${sigHtml}
        </div>
      `;
    }

    if (formWrap) {
      formWrap.style.display = sow.status === "SIGNED" ? "none" : "block";
    }

    renderPaymentSection(sow);
  }

  window.BDV_SOW = {
    openById: function (sowId, postCheckoutStatus) {
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
            const payWrap = document.getElementById("bdv-sow-payment-wrap");
            if (formWrap) formWrap.style.display = "none";
            if (payWrap) payWrap.style.display = "none";
            return;
          }
          currentSowData = res.sow;
          renderSowContent(currentSowData);

          if (statusEl && postCheckoutStatus === "success") {
            statusEl.style.display = "block";
            statusEl.style.color = "#4ade80";
            statusEl.textContent =
              "✓ Pago recibido en Stripe. Si el estado aún dice pendiente, se actualizará en unos segundos vía webhook.";
          } else if (statusEl && postCheckoutStatus === "cancel") {
            statusEl.style.display = "block";
            statusEl.style.color = "#e8c861";
            statusEl.textContent = "El pago fue cancelado. Puedes intentar nuevamente cuando estés listo.";
          }
        })
        .catch(() => {
          if (bodyEl) {
            bodyEl.innerHTML = `<p style="color: #f87171;">Error al consultar el documento SOW.</p>`;
          }
        });
    },

    payDeposit: function (sowObj) {
      const target = sowObj || currentSowData;
      if (!target) return;
      currentSowData = target;
      ensureSowModal();
      startStripeCheckoutForSow(target);
    },

    createCheckoutLink: function (opts) {
      return requestStripeCheckoutSession(opts);
    },

    collectMilestoneOrFinal: async function (proyecto) {
      const target = proyecto || currentSowData || {};
      const labelTarget = target.name || target.sowId || target.businessName || "el proyecto";
      const montoInput = prompt(`Monto en USD a cobrar para ${labelTarget}:`);
      if (montoInput === null) return { ok: false, cancelled: true };

      const amountUsd = Number(montoInput);
      if (!amountUsd || amountUsd < 0.5) {
        alert("Ingresa un monto válido en USD (mínimo $0.50).");
        return { ok: false, error: "Monto inválido" };
      }

      const isFinal = confirm(
        "¿Es la LIQUIDACIÓN FINAL (100%) del proyecto?\n\nAceptar = Liquidación Final (Etapa 6)\nCancelar = Hito intermedio"
      );
      const paymentType = isFinal ? "final_settlement" : "milestone";
      const targetStage = isFinal ? 6 : Number(target.stage || 4);

      const res = await requestStripeCheckoutSession({
        sowId: target.sowId || "",
        clientEmail: target.email || target.clientEmail || "",
        businessName: target.businessName || "",
        clientName: target.clientName || target.name || "",
        amountUsd,
        paymentType,
        targetStage,
        itemTitle: `${isFinal ? "Liquidación 100%" : "Hito de Proyecto"} — ${labelTarget}`
      });

      if (res && res.ok && res.checkoutUrl) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(res.checkoutUrl).catch(() => null);
        }
        const openNow = confirm(
          `Enlace de Stripe generado y copiado al portapapeles:\n\n${res.checkoutUrl}\n\n¿Deseas abrirlo ahora?`
        );
        if (openNow) {
          window.open(res.checkoutUrl, "_blank", "noopener,noreferrer");
        }
      } else {
        alert("No se pudo generar el enlace de cobro: " + ((res && res.error) || "Error desconocido"));
      }

      return res;
    },

    createFromAdmin: function (payload) {
      const core = getCore();
      const sessionKey = window.__bdvSessionKey || "";
      return fetch(core.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ key: sessionKey, action: "create_sow" }, payload))
      }).then((r) => r.json());
    }
  };

  function checkQueryParamOnLoad() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const sowParam = (params.get("sow") || "").trim().toUpperCase();
      const checkoutParam = (params.get("checkout") || "").trim().toLowerCase();
      if (sowParam) {
        window.BDV_SOW.openById(sowParam, checkoutParam);
      }
    } catch (_) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkQueryParamOnLoad);
  } else {
    checkQueryParamOnLoad();
  }
})();
