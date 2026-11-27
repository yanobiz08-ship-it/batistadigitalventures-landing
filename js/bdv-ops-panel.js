/* Batista Digital Ventures - Client progress tracker and the private ops panel (#bdv-ops) for the admin and partners */
(function () {
  // window.BDV_CORE comes from brand-media.js, which is loaded (deferred) before this file.
  function getCore() {
    return window.BDV_CORE;
  }
  function tr(key) {
    return window.BDV_t(key);
  }

  function applyClientTrackerModal() {
    if (document.getElementById("bdv-tracker-modal-root")) return;

    var modalRoot = document.createElement("div");
    modalRoot.id = "bdv-tracker-modal-root";
    modalRoot.className = "bdv-modal-overlay";
    modalRoot.style.display = "none";

    var esc = getCore().escapeHtml;
    // Texts come from js/bdv-i18n.js.
    modalRoot.innerHTML = [
      '<div class="bdv-tracker-card">',
      '  <div class="bdv-modal-top">',
      '    <h3 style="margin: 0; font-size: 1.05rem; color: #e8c861;">' + esc(tr("trkTitle")) + "</h3>",
      '    <button type="button" id="bdv-tracker-close-btn" class="bdv-modal-close" aria-label="Cerrar">✕</button>',
      "  </div>",
      '  <p style="font-size: 0.82rem; color: #94a3b8; margin: 8px 0 14px 0;">' + esc(tr("trkDesc")) + "</p>",
      '  <form id="bdv-tracker-query-form" class="bdv-tracker-form">',
      '    <input type="email" id="bdv-track-email" class="bdv-tracker-input" placeholder="' + esc(tr("trkEmailPh")) + '" required />',
      '    <input type="text" id="bdv-track-pin" class="bdv-tracker-input" placeholder="' + esc(tr("trkPinPh")) + '" required />',
      '    <button type="submit" class="bdv-tracker-btn">' + esc(tr("trkSubmit")) + "</button>",
      "  </form>",
      '  <div id="bdv-track-result-box" style="display: none;" class="bdv-tracker-result" role="status"></div>',
      '  <p class="bdv-tracker-disclaimer">' + esc(tr("trkNote")) + "</p>",
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
      var msg = function (text, color) {
        resBox.innerHTML = '<p style="font-size: 0.82rem; color: ' + color + '; margin: 0;">' + core.escapeHtml(text) + "</p>";
      };

      if (!email || !pin) return;

      resBox.style.display = "block";
      msg(tr("trkChecking"), "#94a3b8");

      // POST so the client code never ends up in URLs / logs (Worker action "client_lookup", rate-limited).
      fetch(core.apiUrl, {
        method: "POST",
        body: JSON.stringify({ action: "client_lookup", email: email, code: pin })
      })
        .then(function (r) {
          if (r.status === 429) return { ok: false, tooMany: true };
          return r.json();
        })
        .then(function (res) {
          if (res.tooMany) return msg(tr("trkTooMany"), "#f87171");
          if (!res.ok || !res.project) return msg(tr("trkNotFound"), "#f87171");

          var matched = res.project;
          if (matched.accessStatus === "DISABLED" || matched.stage === 6) {
            resBox.innerHTML =
              '<span class="bdv-tracker-status-tag bdv-status-disabled">' + core.escapeHtml(tr("trkDoneTag")) + "</span>" +
              '<h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">' + core.escapeHtml(tr("trkDoneTitle")) + "</h4>" +
              '<p style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0;">' + core.escapeHtml(tr("trkDoneText")) + "</p>";
            return;
          }
          var stages = core.workflowStages;
          var stObj = stages[matched.stage - 1] || stages[0];
          var stName = lang === "en" ? stObj.name_en : stObj.name_es;
          resBox.innerHTML =
            '<span class="bdv-tracker-status-tag bdv-status-active">' + core.escapeHtml(tr("trkActiveTag")) + "</span>" +
            '<h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">' + core.escapeHtml(tr("trkStage")) + " " + stObj.stage + "/6: " + core.escapeHtml(stName) + " (" + stObj.percentage + "%)</h4>" +
            '<p style="font-size: 0.8rem; color: #cbd5e1; margin: 6px 0;"><strong>' + core.escapeHtml(tr("trkProject")) + "</strong> " + core.escapeHtml(core.getProjectDisplayName(matched, lang)) + " (" + core.escapeHtml(matched.id) + ")</p>" +
            '<div class="bdv-progress-track" style="margin-top: 8px;"><div class="bdv-progress-fill" style="width: ' + stObj.percentage + '%;"></div></div>' +
            clientPaymentsHtml(res.payments, lang);
        })
        .catch(function () {
          msg(tr("trkNetErr"), "#f87171");
        });
    });
  }

  // The client's payments, read-only: total (signed SOW + change orders they approved), paid, pending,
  // the next payment and the history. Change orders waiting for their signature link to their page.
  function clientPaymentsHtml(pay, lang) {
    if (!pay || !(pay.total > 0)) return "";
    var locale = lang === "en" ? "en-US" : "es-US";
    var date = function (iso) { return iso ? new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" }) : ""; };
    var typeName = function (type, coId) {
      return type === "deposit" ? tr("trkTypeDeposit") : type === "final_settlement" ? tr("trkTypeFinal") : type === "change_order" ? tr("trkTypeCo") + " " + coId : tr("trkTypeMilestone");
    };
    var when = { now: tr("trkWhenNow"), before_extra_work: tr("trkWhenExtra"), at_delivery: tr("trkWhenDelivery") };
    var html = '<div class="bdv-trk-pay"><h5>' + esc(tr("trkPayTitle")) + "</h5>" +
      paymentBarHtml(pay, { paid: tr("trkPayPaid"), pending: tr("trkPayPending"), total: tr("trkPayTotal") }) +
      (pay.changeOrdersTotal ? '<p class="bdv-trk-pay-sub">' + esc(tr("trkPayBreakdown").replace("{sow}", money(pay.contractTotal)).replace("{co}", money(pay.changeOrdersTotal))) + "</p>" : "") +
      '<p class="bdv-trk-pay-next">' + (pay.nextDue
        ? "<strong>" + esc(tr("trkPayNext")) + "</strong> " + esc(typeName(pay.nextDue.type, pay.nextDue.changeOrderId)) + " · " + esc(money(pay.nextDue.amountUsd)) + " · " + esc(when[pay.nextDue.timing] || "")
        : "✓ " + esc(tr("trkPayDone"))) + "</p>";
    pay.awaitingApproval.forEach(function (co) {
      html += '<p class="bdv-trk-pay-await">' + esc(tr("trkPayAwaiting")) + " <strong>" + esc(co.coId) + "</strong> · " + esc(money(co.amountUsd)) +
        ' · <a href="' + esc(co.url) + '">' + esc(tr("trkPayReview")) + "</a></p>";
    });
    html += "<h6>" + esc(tr("trkPayHistory")) + "</h6>" + (pay.payments.length
      ? "<ul>" + pay.payments.map(function (pm) {
          return "<li><span>" + esc(date(pm.paidAt)) + " · " + esc(typeName(pm.type, pm.changeOrderId)) + "</span><strong>" + esc(money(pm.amountUsd)) + "</strong></li>";
        }).join("") + "</ul>"
      : '<p class="bdv-trk-pay-sub">' + esc(tr("trkPayNoHistory")) + "</p>");
    if (pay.changeOrders.length) {
      html += "<h6>" + esc(tr("trkPayCos")) + "</h6><ul>" + pay.changeOrders.map(function (co) {
        return "<li><span>" + esc(co.coId) + " · " + esc(co.description) + " · " + esc(co.paid ? tr("trkPayCoPaid") : tr("trkPayCoUnpaid")) + "</span><strong>" + esc(money(co.amountUsd)) + "</strong></li>";
      }).join("") + "</ul>";
    }
    return html + '<p class="bdv-trk-pay-sub">' + esc(tr("trkPayReadOnly")) + "</p></div>";
  }

  // =====================================================================================
  // Admin / partner panel (#bdv-ops). One guided card per incoming request and per project:
  // each card shows where it stands and only the next valid action. Every action posts once
  // (its button is locked while it runs), then the panel reloads by itself. The admin signs in with
  // email + password and a code (Google Authenticator or email); the 8-hour session token is kept in
  // sessionStorage (this tab only). A key (partners, or the ADMIN_KEY emergency key) lives only in
  // memory while this page is open. Closing the panel does not sign you out, "Salir" does.
  // =====================================================================================
  var ops = {
    token: "",       // what goes in the Authorization header: a key, or an admin session token
    via: "",         // "key" or "session"
    role: "",
    auth: { step: "login", challenge: "", emailHint: "", method: "" }, // sign-in steps before the dashboard
    setup: null,     // sign-in setup in progress (secret, QR, recovery codes): memory only
    data: null,      // last GET payload, normalised by normaliseData()
    form: null,      // the one inline form that is open: { kind, id }
    payLinks: {},    // project row -> Stripe link created in this session
    webCheck: null,  // last Web Check run from this page: { report, pdfBase64, filename }
    loading: false,
    reloadAgain: false,
    inFlight: 0,
    loadedAt: null,
    timer: null
  };
  var AUTO_REFRESH_MS = 60000;
  var OWNER_SIGNER = { name: "Yano Batista", title: "Fundador y CEO" };

  function esc(v) {
    return getCore().escapeHtml(v === 0 ? "0" : v);
  }
  function isValidEmailSimple(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
  function money(n) {
    return "$" + (Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";
  }
  function stageInfo(n) {
    var list = getCore().workflowStages;
    return list[(Number(n) || 1) - 1] || list[0];
  }
  function ledgerOf(p) {
    return (ops.data && ops.data.ledgers && ops.data.ledgers[p.row]) || null;
  }
  function dueLabel(d) {
    return d.type === "deposit" ? "Depósito" : d.type === "change_order" ? "Orden de cambio " + d.changeOrderId : "Liquidación final";
  }
  function shortDate(iso) {
    return iso ? new Date(iso).toLocaleDateString("es-US", { year: "numeric", month: "short", day: "numeric" }) : "";
  }

  // Paid vs total (signed SOW + approved change orders) with the pending part highlighted. Shared by the
  // panel and the client's read-only viewer; every number comes from the server's ledger.
  function paymentBarHtml(l, labels) {
    var paidPct = l.total > 0 ? Math.min(100, (l.paid / l.total) * 100) : 0;
    return '<div class="bdv-pay">' +
      '<div class="bdv-pay-bar" role="img" aria-label="' + esc(labels.paid + " " + money(l.paid) + " · " + labels.pending + " " + money(l.pending)) + '">' +
      '<span class="is-paid" style="width: ' + paidPct.toFixed(1) + '%;"></span><span class="is-pending" style="width: ' + (100 - paidPct).toFixed(1) + '%;"></span></div>' +
      '<div class="bdv-pay-legend"><span><strong>' + esc(labels.paid) + ":</strong> " + esc(money(l.paid)) + " (" + esc(l.percentPaid) + "%)</span>" +
      '<span class="bdv-pay-pending"><strong>' + esc(labels.pending) + ":</strong> " + esc(money(l.pending)) + "</span>" +
      "<span><strong>" + esc(labels.total) + ":</strong> " + esc(money(l.total)) + "</span></div></div>";
  }
  // Public links carry the document's access token (t=); SOWs and change orders created before it have none.
  function sowUrlOf(w) {
    return "https://batistadigitalventures.com/?sow=" + encodeURIComponent(w.sowId) + (w.accessToken ? "&t=" + encodeURIComponent(w.accessToken) : "");
  }
  function coUrlOf(co) {
    return "https://batistadigitalventures.com/?co=" + encodeURIComponent(co.coId) + (co.accessToken ? "&t=" + encodeURIComponent(co.accessToken) : "");
  }
  // Same rule as the Worker: by project id, or by row for SOWs issued before ids were stored.
  function sowBelongsTo(w, p) {
    if (w.projectId) return w.projectId === p.id;
    return Boolean(w.projectRow) && Number(w.projectRow) === Number(p.row);
  }
  function byNewest(a, b) {
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  }

  function normaliseData(res) {
    var projects = Array.isArray(res.projects) ? res.projects : [];
    var sows = res.sows && typeof res.sows === "object"
      ? Object.keys(res.sows).map(function (k) { return res.sows[k]; }).sort(byNewest)
      : [];
    var requests = Array.isArray(res.requests) ? res.requests : [];
    var current = {};
    projects.forEach(function (p) {
      current[p.row] = sows.filter(function (w) { return w.status !== "VOID" && sowBelongsTo(w, p); })[0] || null;
    });
    var currentIds = Object.keys(current).map(function (r) { return current[r] && current[r].sowId; });
    return {
      projects: projects,
      requests: requests,
      newRequests: requests.filter(function (r) { return String(r.status || "NEW") === "NEW"; }),
      apps: Array.isArray(res.partnerApplications) ? res.partnerApplications : [],
      currentSow: current,
      ledgers: res.ledgers || {}, // project row -> payment ledger computed by the Worker
      otherSows: sows.filter(function (w) { return currentIds.indexOf(w.sowId) === -1; }),
      webCheck: res.webCheck || null, // summary of the last Web Check (panel, weekly or alert)
      auditLog: Array.isArray(res.auditLog) ? res.auditLog : [], // newest first (admin only)
      lastBackup: res.lastBackup || null,
      adminLogin: res.adminLogin || null // admin sign-in status (admin only)
    };
  }

  function findProject(row) {
    return ((ops.data && ops.data.projects) || []).filter(function (p) { return Number(p.row) === Number(row); })[0] || null;
  }
  function findRequest(id) {
    return ((ops.data && ops.data.requests) || []).filter(function (r) { return r.id === id; })[0] || null;
  }
  function projectForEmail(email) {
    var e = String(email || "").trim().toLowerCase();
    return ((ops.data && ops.data.projects) || []).filter(function (p) { return String(p.email || "").toLowerCase() === e; })[0] || null;
  }
  function requestOfProject(p) {
    return ((ops.data && ops.data.requests) || []).filter(function (r) { return r.projectId === p.id; })[0] || null;
  }

  // ---------- API ----------
  function api(payload) {
    var core = getCore();
    return fetch(core.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + ops.token },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return { ok: false, error: "Respuesta inválida del servidor (" + r.status + ")." }; })
        .then(function (json) {
          if (r.status === 401) signOut(tr(json.errorCode === "session_expired" ? "opsErrSession" : "opsErrKey"));
          return json;
        });
    });
  }

  // Runs one panel action: locks its button (no double posts), shows the result and reloads. With
  // `keepOpen` (a step of a multi-step form) the form stays open and the panel is only redrawn.
  function runAction(btn, payload, onOk, keepOpen) {
    if (btn && btn.disabled) return;
    var label = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Procesando…"; }
    ops.inFlight++;
    api(payload)
      .then(function (res) {
        if (!res.ok) {
          toast(res.error || "No se pudo completar la acción.", false);
          return;
        }
        var out = onOk ? onOk(res) : { msg: "✓ Listo." };
        toast(out.msg, out.ok !== false);
        if (keepOpen) return render();
        ops.form = null;
        loadData();
      })
      .catch(function () {
        toast("Error de conexión. Revisa tu internet y vuelve a intentar.", false);
      })
      .then(function () {
        ops.inFlight--;
        if (btn && document.body.contains(btn)) { btn.disabled = false; btn.textContent = label; }
      });
  }

  function loadData() {
    var core = getCore();
    if (!ops.token) return;
    if (ops.loading) {
      ops.reloadAgain = true; // an action finished while a load was running: load once more afterwards
      return;
    }
    ops.loading = true;
    fetch(core.apiUrl, { headers: { Authorization: "Bearer " + ops.token } })
      .then(function (r) { return r.json().then(function (json) { return { status: r.status, res: json }; }); })
      .then(function (out) {
        var res = out.res;
        if (!res.ok) {
          signOut(tr(out.status === 429 ? "opsErrLocked" : res.errorCode === "session_expired" ? "opsErrSession" : "opsErrKey"));
          return;
        }
        ops.role = res.role === "admin" ? "admin" : "partner";
        ops.data = normaliseData(res);
        ops.loadedAt = new Date();
        showView("dash");
        render();
      })
      .catch(function () {
        toast("No se pudo conectar con el sistema. Reintentando en un momento…", false);
      })
      .then(function () {
        ops.loading = false;
        if (ops.reloadAgain) {
          ops.reloadAgain = false;
          loadData();
        }
      });
  }

  // Auto refresh while the panel is open, never while you are typing in a form or an action runs.
  function canAutoRefresh() {
    var root = document.getElementById("bdv-admin-modal-root");
    if (!root || root.style.display === "none" || !ops.token || ops.form || ops.inFlight) return false;
    var a = document.activeElement;
    return !(a && root.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
  }
  function startAutoRefresh() {
    if (ops.timer) return;
    ops.timer = setInterval(function () { if (canAutoRefresh()) loadData(); }, AUTO_REFRESH_MS);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && canAutoRefresh()) loadData();
  });

  // ---------- small UI helpers ----------
  function toast(message, ok) {
    var el = document.getElementById("bdv-ops-toast");
    if (!el) return;
    el.className = "bdv-ops-toast " + (ok ? "is-ok" : "is-err");
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { el.hidden = true; }, ok ? 6000 : 12000);
  }

  // Inline confirmation, used only for destructive or irreversible steps.
  function confirmCard(anchor, message, confirmLabel, onConfirm) {
    var old = document.getElementById("bdv-ops-confirm");
    if (old) old.remove();
    var card = document.createElement("div");
    card.id = "bdv-ops-confirm";
    card.className = "bdv-ops-confirm";
    card.setAttribute("role", "alertdialog");
    card.innerHTML =
      "<p>" + esc(message) + "</p>" +
      '<div class="bdv-ops-actions"><button type="button" class="bdv-ops-btn is-danger" data-confirm="yes">' + esc(confirmLabel) +
      '</button><button type="button" class="bdv-ops-btn is-ghost" data-confirm="no">Cancelar</button></div>';
    (anchor.closest(".bdv-ops-card") || anchor.parentNode).appendChild(card);
    card.querySelector('[data-confirm="yes"]').addEventListener("click", function (e) {
      card.remove();
      onConfirm(e.currentTarget);
    });
    card.querySelector('[data-confirm="no"]').addEventListener("click", function () { card.remove(); });
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function copyText(text, copiedMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { toast(copiedMsg || "✓ Enlace copiado: " + text, true); },
        function () { toast("Copia este enlace: " + text, true); }
      );
    } else {
      toast("Copia este enlace: " + text, true);
    }
  }

  function field(name, label, value, opts) {
    var o = opts || {};
    var input = o.textarea
      ? '<textarea name="' + name + '" rows="3" class="bdv-tracker-input"' + (o.required ? " required" : "") + ' placeholder="' + esc(o.placeholder || "") + '">' + esc(value || "") + "</textarea>"
      : '<input name="' + name + '" type="' + (o.type || "text") + '" class="bdv-tracker-input" value="' + esc(value || "") + '"' +
        (o.required ? " required" : "") + (o.type === "number" ? ' min="1" step="any" inputmode="decimal"' : "") + (o.attrs || "") +
        ' placeholder="' + esc(o.placeholder || "") + '" />';
    return '<label class="bdv-ops-field' + (o.half ? " is-half" : "") + '"><span>' + esc(label) + "</span>" + input + "</label>";
  }
  function btn(act, label, kind, attrs) {
    return '<button type="button" class="bdv-ops-btn ' + (kind || "") + '" data-act="' + act + '"' + (attrs || "") + ">" + esc(label) + "</button>";
  }
  function dataAttr(name, value) {
    return " data-" + name + '="' + esc(value) + '"';
  }

  // ---------- views ----------
  function showView(name) {
    var auth = document.getElementById("bdv-ops-auth");
    var dash = document.getElementById("bdv-ops-dash");
    if (auth) auth.hidden = name !== "auth";
    if (dash) dash.hidden = name !== "dash";
  }

  function signOut(message) {
    ops.token = "";
    ops.via = "";
    ops.role = "";
    ops.data = null;
    ops.form = null;
    ops.setup = null;
    ops.payLinks = {};
    ops.webCheck = null;
    forgetSession();
    ["bdv-ops-pass", "bdv-ops-password", "bdv-ops-code-input"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    showView("auth");
    showAuthStep(preferredLoginStep());
    authMessage(message, false);
  }

  // ---------- sign-in: email + password, then Google Authenticator or a code by email ----------
  var SESSION_STORE = "bdv-ops-session";  // sessionStorage: { token, expiresAt } of the admin session
  var LOGIN_MODE_STORE = "bdv-ops-login"; // localStorage: "key" when this browser signs in with a key
  var AUTH_ERRORS = {
    bad_credentials: "opsErrCredentials",
    locked: "opsErrLocked",
    challenge_expired: "opsErrExpired",
    bad_code: "opsErrCode",
    too_many_codes: "opsErrTooManyCodes",
    send_wait: "opsErrSendWait",
    send_limit: "opsErrSendLimit",
    send_failed: "opsErrSendFailed"
  };
  function storage(kind) {
    try { return window[kind]; } catch (_) { return null; } // blocked in some private modes
  }
  function rememberSession(token, expiresAt) {
    var st = storage("sessionStorage");
    if (st) st.setItem(SESSION_STORE, JSON.stringify({ token: token, expiresAt: expiresAt }));
  }
  function storedSession() {
    var st = storage("sessionStorage");
    try {
      var s = st && JSON.parse(st.getItem(SESSION_STORE) || "null");
      return s && s.token && Date.parse(s.expiresAt) > Date.now() ? s : null;
    } catch (_) {
      return null;
    }
  }
  function forgetSession() {
    var st = storage("sessionStorage");
    if (st) st.removeItem(SESSION_STORE);
  }
  function preferredLoginStep() {
    var ls = storage("localStorage");
    return ls && ls.getItem(LOGIN_MODE_STORE) === "key" ? "key" : "login";
  }
  function setLoginMode(mode) {
    var ls = storage("localStorage");
    if (!ls) return;
    if (mode === "key") ls.setItem(LOGIN_MODE_STORE, "key"); else ls.removeItem(LOGIN_MODE_STORE);
  }

  function authMessage(text, isInfo) {
    var err = document.getElementById("bdv-ops-auth-msg");
    var info = document.getElementById("bdv-ops-auth-info");
    if (!err || !info) return;
    err.hidden = isInfo || !text;
    err.textContent = isInfo ? "" : text || "";
    info.hidden = !isInfo || !text;
    info.textContent = isInfo ? text : "";
  }

  // Shows one sign-in step ("login", "method", "code" or "key") and focuses its first field.
  function showAuthStep(step) {
    ops.auth.step = step;
    var box = document.getElementById("bdv-ops-auth");
    if (!box) return;
    Array.prototype.forEach.call(box.querySelectorAll("[data-step]"), function (el) {
      el.hidden = el.getAttribute("data-step") !== step;
    });
    if (step === "code") {
      var m = ops.auth.method;
      var input = document.getElementById("bdv-ops-code-input");
      document.getElementById("bdv-ops-code-label").textContent =
        m === "recovery" ? tr("opsCodeRecovery") : m === "email" ? tr("opsCodeEmail").replace("{email}", ops.auth.emailHint) : tr("opsCodeTotp");
      input.value = "";
      input.setAttribute("autocomplete", m === "recovery" ? "off" : "one-time-code");
      input.setAttribute("inputmode", m === "recovery" ? "text" : "numeric");
      input.setAttribute("autocapitalize", m === "recovery" ? "characters" : "off");
      input.setAttribute("maxlength", m === "recovery" ? "11" : "7");
      document.getElementById("bdv-ops-resend").hidden = m !== "email";
    }
    if (step === "method") document.getElementById("bdv-ops-email-hint").textContent = tr("opsMethodEmailSub").replace("{email}", ops.auth.emailHint);
    var first = box.querySelector('[data-step="' + step + '"] input, [data-step="' + step + '"] button');
    if (first && document.getElementById("bdv-admin-modal-root").style.display !== "none") setTimeout(function () { first.focus(); }, 30);
  }

  // One sign-in request (no key): locks `button` while it runs; `done(res)` gets the JSON answer.
  function authRequest(button, payload, done) {
    if (button && button.disabled) return;
    var label = button ? button.textContent : "";
    if (button) { button.disabled = true; button.textContent = tr("opsChecking"); }
    fetch(getCore().apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(done)
      .catch(function () { authMessage(tr("opsErrNet"), false); })
      .then(function () {
        if (button) { button.disabled = false; button.textContent = label; }
      });
  }
  function authError(res) {
    return tr(AUTH_ERRORS[res && res.errorCode] || "opsErrNet");
  }
  // After these the password has to be entered again.
  function backToLoginIfOver(res) {
    if (res.errorCode === "challenge_expired" || res.errorCode === "too_many_codes") {
      ops.auth.challenge = "";
      showAuthStep("login");
    }
  }

  function submitLogin(form, button) {
    var email = (form.email.value || "").trim();
    var password = form.password.value || "";
    if (!email || !password) return authMessage(tr("opsErrMissing"), false);
    authMessage("", false);
    authRequest(button, { action: "admin_login", email: email, password: password }, function (res) {
      if (!res.ok) return authMessage(authError(res), false);
      form.password.value = "";
      ops.auth.challenge = res.challenge;
      ops.auth.emailHint = res.emailHint || "";
      showAuthStep("method");
    });
  }

  function sendEmailCode(button) {
    authMessage("", false);
    authRequest(button, { action: "admin_login_send_code", challenge: ops.auth.challenge }, function (res) {
      if (!res.ok) {
        authMessage(authError(res), false);
        return backToLoginIfOver(res);
      }
      ops.auth.method = "email";
      if (ops.auth.step !== "code") showAuthStep("code");
      authMessage(tr("opsCodeSent").replace("{email}", res.sentTo || ops.auth.emailHint), true);
    });
  }

  function submitCode(form, button) {
    var code = (form.code.value || "").trim();
    if (!code) return authMessage(tr("opsErrMissing"), false);
    authRequest(button, { action: "admin_login_verify", challenge: ops.auth.challenge, method: ops.auth.method, code: code }, function (res) {
      if (!res.ok || !res.token) {
        authMessage(authError(res), false);
        form.code.value = "";
        return backToLoginIfOver(res);
      }
      authMessage("", false);
      ops.auth = { step: "login", challenge: "", emailHint: "", method: "" };
      ops.token = res.token;
      ops.via = "session";
      rememberSession(res.token, res.expiresAt);
      setLoginMode("email");
      loadData();
    });
  }

  function submitKey() {
    var pass = (document.getElementById("bdv-ops-pass").value || "").trim();
    if (!pass) return authMessage(tr("opsErrMissing"), false);
    authMessage("", false);
    ops.token = pass;
    ops.via = "key";
    setLoginMode("key");
    loadData();
  }

  var authHandlers = {
    login: function () { setLoginMode("email"); authMessage("", false); showAuthStep("login"); },
    key: function () { authMessage("", false); showAuthStep("key"); },
    totp: function () { ops.auth.method = "totp"; authMessage("", false); showAuthStep("code"); },
    email: function (b) { sendEmailCode(b); },
    resend: function (b) { sendEmailCode(b); },
    recovery: function () { ops.auth.method = "recovery"; authMessage("", false); showAuthStep("code"); },
    method: function () { authMessage("", false); showAuthStep("method"); },
    restart: function () { ops.auth.challenge = ""; authMessage("", false); showAuthStep("login"); }
  };

  function render() {
    var d = ops.data;
    var body = document.getElementById("bdv-ops-body");
    if (!d || !body) return;
    var isAdmin = ops.role === "admin";
    var login = d.adminLogin;
    document.getElementById("bdv-ops-role").textContent = !isAdmin ? "Programador partner"
      : ops.via === "key" && login && login.enrolled ? "Administrador · clave de emergencia" : "Administrador";
    document.getElementById("bdv-ops-new-btn").hidden = !isAdmin;
    document.getElementById("bdv-ops-access-btn").hidden = !isAdmin;
    document.getElementById("bdv-ops-webcheck-btn").hidden = !isAdmin;
    document.getElementById("bdv-ops-backup-btn").hidden = !isAdmin;
    document.getElementById("bdv-ops-updated").textContent =
      "Actualizado " + ops.loadedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + " · se actualiza solo";

    var html = [];
    if (isAdmin) {
      html.push(renderTodo(d));
      if (ops.form && ops.form.kind === "login-setup") html.push(loginSetupCard(login));
      else if (login && !login.enrolled) html.push(loginSetupPrompt());
      html.push(webCheckCard(d.webCheck));
      if (ops.form && ops.form.kind === "project" && !ops.form.id) html.push('<div class="bdv-ops-card is-focus">' + projectForm(null) + "</div>");
      html.push(section("📨 Solicitudes nuevas", d.newRequests.length, d.newRequests.map(requestCard).join(""), "No hay solicitudes nuevas."));
    }
    var sorted = d.projects.slice().sort(function (a, b) {
      return projectNeedsYou(b) - projectNeedsYou(a) || Number(b.row) - Number(a.row);
    });
    html.push(section(isAdmin ? "📁 Proyectos" : "📁 Proyectos asignados", d.projects.length, sorted.map(projectCard).join(""), "Todavía no hay proyectos."));
    if (isAdmin) {
      if (d.otherSows.length) {
        html.push(collapsible("📄 Otros SOWs (anteriores, reemplazados o sin proyecto)", d.otherSows.length, d.otherSows.map(otherSowCard).join("")));
      }
      if (d.apps.length) {
        html.push(collapsible("🤝 Postulaciones de partners", d.apps.length, d.apps.map(appCard).join("")));
      }
      html.push(collapsible("🧾 Historial de cambios", d.auditLog.length, auditLogHtml(d.auditLog, d.lastBackup)));
    }
    body.innerHTML = html.join("");
  }

  // Every change made from the panel, newest first (kept by the Worker; it cannot be edited or deleted).
  var AUDIT_ACTION = {
    create_project: "Proyecto creado", create_sow: "SOW emitido", create_change_order: "Orden de cambio creada",
    void_change_order: "Orden de cambio anulada", record_payment: "Pago registrado", void_payment: "Pago anulado",
    delete_request: "Solicitud descartada", delete_partner_application: "Postulación descartada", delete_project: "Proyecto eliminado",
    assign_partner: "Partner asignado", update_pin: "PIN cambiado", propose: "Avance propuesto (partner)",
    approve_proposal: "Avance aprobado", update: "Etapa cambiada", backup_now: "Copia de seguridad manual",
    resync_from_kv: "Datos recuperados tras un rollback", admin_login: "Inicio de sesión", admin_logout: "Cierre de sesión",
    admin_login_failed: "Intento de inicio de sesión fallido", admin_2fa_enrolled: "Acceso con verificación activado",
    admin_2fa_changed: "Acceso con verificación cambiado"
  };
  function auditLogHtml(log, lastBackup) {
    var backupLine = '<p class="bdv-ops-sub">' + (lastBackup && lastBackup.at
      ? "Última copia de seguridad: " + esc(shortDate(lastBackup.at) + " " + new Date(lastBackup.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })) + " (se hace sola cada noche; se guardan 35 días)."
      : "Todavía no hay copia de seguridad; se hace sola cada noche.") + "</p>";
    if (!log.length) return backupLine + '<p class="bdv-ops-empty">Todavía no hay cambios registrados.</p>';
    return backupLine + '<ul class="bdv-ops-audit-log">' + log.map(function (e) {
      return "<li>" + esc(shortDate(e.at) + " " + new Date(e.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })) + " · " +
        "<strong>" + esc(AUDIT_ACTION[e.action] || e.action) + "</strong> · " + esc(e.target || "") +
        (e.detail ? " · " + esc(e.detail) : "") + (e.snapshot ? " · copia del registro guardada" : "") +
        ' <span class="bdv-ops-muted">(' + esc(e.role === "partner" ? "partner" : e.role === "system" ? "automático" : e.role === "visitor" ? "sin sesión" : "admin") + ")</span></li>";
    }).join("") + "</ul>";
  }

  function section(title, count, inner, emptyText) {
    return '<section class="bdv-ops-section"><h4>' + esc(title) + ' <span class="bdv-ops-count">' + count + "</span></h4>" +
      (count ? inner : '<p class="bdv-ops-empty">' + esc(emptyText) + "</p>") + "</section>";
  }
  function collapsible(title, count, inner) {
    return '<details class="bdv-ops-section bdv-ops-collapsible"><summary>' + esc(title) + ' <span class="bdv-ops-count">' + count + "</span></summary>" + inner + "</details>";
  }

  // A SOW from the old flow (client first) that Batista Digital Ventures never signed: it cannot be
  // completed any more, so the project needs a new SOW signed by you (which replaces it).
  function needsReissue(w) {
    return Boolean(w) && w.status !== "VOID" && w.status !== "SIGNED" && !w.providerSignature;
  }

  // 1 = waiting for you (partner report / SOW to reissue), 0 = waiting for others.
  function projectNeedsYou(p) {
    var w = ops.data.currentSow[p.row];
    if (p.pendingProposal) return 1;
    return needsReissue(w) ? 1 : 0;
  }

  function renderTodo(d) {
    var reissue = d.projects.filter(function (p) { return needsReissue(d.currentSow[p.row]); }).length;
    var proposals = d.projects.filter(function (p) { return p.pendingProposal; }).length;
    var items = [];
    if (d.newRequests.length) items.push(d.newRequests.length + (d.newRequests.length === 1 ? " solicitud nueva" : " solicitudes nuevas"));
    if (reissue) items.push(reissue + (reissue === 1 ? " SOW por reemitir" : " SOWs por reemitir"));
    if (proposals) items.push(proposals + (proposals === 1 ? " avance por aprobar" : " avances por aprobar"));
    return '<div class="bdv-ops-todo' + (items.length ? "" : " is-clear") + '">' +
      (items.length ? "<strong>Por hacer:</strong> " + esc(items.join(" · ")) : "✓ Todo al día. No hay nada pendiente de tu parte.") + "</div>";
  }

  // ---------- sign-in setup (Acceso y verificación) ----------
  // Only with the ADMIN_KEY emergency key (the Worker refuses it from a session): 1) email + password,
  // 2) scan the QR in Google Authenticator and type its code, 3) save the 10 recovery codes.
  function loginSetupPrompt() {
    return '<div class="bdv-ops-card is-attention"><strong>🔐 Proteja su panel con correo, contraseña y un código de verificación</strong>' +
      '<p class="bdv-ops-sub">Hoy entra con la clave de emergencia. En 2 minutos puede activar la entrada con su correo y contraseña más un código de Google Authenticator o por correo (usted elige cada vez). La clave de emergencia sigue sirviendo si algún día la necesita.</p>' +
      '<div class="bdv-ops-actions">' + btn("open-login-setup", "Configurar ahora", "is-primary") + "</div></div>";
  }

  function loginStatusLine(login) {
    return login && login.enrolled
      ? '<p class="bdv-ops-sub">✓ Acceso activo para <strong>' + esc(login.email) + "</strong> desde el " + esc(shortDate(login.enrolledAt)) +
        " · quedan " + esc(login.recoveryCodesLeft) + " códigos de recuperación.</p>"
      : '<p class="bdv-ops-sub">Todavía no está configurado: hoy solo se entra con clave.</p>';
  }

  function groupSecret(secret) {
    return String(secret || "").replace(/(.{4})/g, "$1 ").trim();
  }

  function loginSetupCard(login) {
    var cancel = btn("cancel-form", "Cancelar", "is-ghost");
    var head = '<div class="bdv-ops-card is-focus bdv-ops-setup"><h5>🔐 Acceso y verificación</h5>';
    if (ops.via !== "key") {
      return head + loginStatusLine(login) +
        '<p class="bdv-ops-note">Para cambiar la contraseña, Google Authenticator o los códigos de recuperación, salga y entre con la clave de emergencia (ADMIN_KEY). Así nadie con una sesión abierta puede quitarle el acceso.</p>' +
        '<div class="bdv-ops-actions">' + btn("cancel-form", "Cerrar", "is-ghost") + "</div></div>";
    }
    var st = ops.setup || { step: 1 };
    if (st.step === 1) {
      return head + loginStatusLine(login) +
        (login && login.enrolled ? '<p class="bdv-ops-warn">Si lo configura otra vez, se reemplazan la contraseña, Google Authenticator y los códigos de recuperación, y se cierran todas las sesiones abiertas.</p>' : "") +
        '<form class="bdv-ops-form" data-form="login-setup-1"><h5>Paso 1 de 3 · Su correo y una contraseña nueva</h5>' +
        field("email", "Correo para entrar", (login && login.email) || "", { type: "email", required: true, attrs: ' autocomplete="username" autocapitalize="off" spellcheck="false"' }) +
        field("password", "Contraseña nueva (mínimo 12 caracteres)", "", { type: "password", required: true, half: true, attrs: ' autocomplete="new-password" minlength="12" maxlength="128"' }) +
        field("password2", "Repita la contraseña", "", { type: "password", required: true, half: true, attrs: ' autocomplete="new-password" minlength="12" maxlength="128"' }) +
        '<p class="bdv-ops-muted">Consejo: deje que Google Passwords o el llavero del iPhone sugiera una contraseña segura y la guarde por usted.</p>' +
        '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Continuar</button>' + cancel + "</div></form></div>";
    }
    if (st.step === 2) {
      return head + '<form class="bdv-ops-form" data-form="login-setup-2"><h5>Paso 2 de 3 · Google Authenticator</h5>' +
        '<div class="bdv-ops-setup-qr"><img src="data:image/svg+xml;base64,' + btoa(st.qrSvg) + '" width="216" height="216" alt="Código QR para Google Authenticator" /></div>' +
        '<ol class="bdv-ops-steps">' +
        "<li>En su iPhone, abra <strong>Google Authenticator</strong> (gratis en la App Store), toque <strong>+</strong> y luego <strong>Escanear un código QR</strong>.</li>" +
        "<li>Apunte la cámara a este código. Si está usando el panel en ese mismo iPhone, toque <strong>Abrir en Google Authenticator</strong> o escriba la clave de configuración.</li>" +
        "<li>Escriba abajo el código de 6 dígitos que muestra la app para <strong>" + esc(st.issuer) + "</strong>.</li></ol>" +
        '<p class="bdv-ops-secret"><span class="bdv-ops-muted">Clave de configuración (' + esc(st.account) + '):</span> <code>' + esc(groupSecret(st.secret)) + "</code></p>" +
        '<div class="bdv-ops-actions">' + btn("copy-secret", "Copiar clave", "is-ghost is-small") +
        '<a class="bdv-ops-btn is-ghost is-small" href="' + esc(st.otpauthUri) + '">Abrir en Google Authenticator</a></div>' +
        field("code", "Código de 6 dígitos", "", { required: true, attrs: ' inputmode="numeric" pattern="[0-9 ]*" maxlength="7" autocomplete="one-time-code"' }) +
        '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Activar</button>' + cancel + "</div></form></div>";
    }
    return head + '<form class="bdv-ops-form" data-form="login-setup-3"><h5>Paso 3 de 3 · Sus códigos de recuperación</h5>' +
      '<p class="bdv-ops-sub">✓ Acceso activado para <strong>' + esc(st.email) + "</strong>. Si pierde el teléfono y no puede recibir correos, cada uno de estos códigos le deja entrar <strong>una sola vez</strong>. Solo se muestran ahora: guárdelos en Google Passwords o en otro lugar seguro.</p>" +
      '<ol class="bdv-ops-codes">' + st.codes.map(function (c) { return "<li><code>" + esc(c) + "</code></li>"; }).join("") + "</ol>" +
      '<div class="bdv-ops-actions">' + btn("copy-recovery", "Copiar códigos", "is-ghost is-small") + btn("download-recovery", "Descargar (.txt)", "is-ghost is-small") + "</div>" +
      '<label class="bdv-ops-check"><input type="checkbox" name="saved" required /> <span>Ya guardé mis códigos en un lugar seguro.</span></label>' +
      '<p class="bdv-ops-muted">Desde ahora entre con su correo y contraseña y elija «Google Authenticator» o «Código por correo». La clave de emergencia (ADMIN_KEY) sigue sirviendo; guárdela también.</p>' +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Listo</button></div></form></div>';
  }

  function downloadRecoveryCodes() {
    var text = ["Batista Digital Ventures · Panel BDV", "Códigos de recuperación de " + ops.setup.email + " (cada uno sirve una sola vez)", ""]
      .concat(ops.setup.codes).concat(["", "Creados: " + new Date().toLocaleString()]).join("\n");
    var url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = "bdv-codigos-de-recuperacion.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  // ---------- Web Check ----------
  var WC_LEVEL = {
    red: { dot: "🔴", label: "Rojo" },
    yellow: { dot: "🟡", label: "Amarillo" },
    green: { dot: "🟢", label: "Verde" },
    info: { dot: "⚪", label: "Info" }
  };

  function webCheckWhen(iso) {
    var d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString("es-US", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  }

  // The fresh result of this page (with its PDF), or one line with the last stored run.
  function webCheckCard(last) {
    var run = ops.webCheck;
    if (!run) {
      if (!last || !WC_LEVEL[last.level]) return "";
      return '<p class="bdv-ops-wc-last">' + WC_LEVEL[last.level].dot + " Último Web Check: " + esc(webCheckWhen(last.at)) + " · " + esc(last.headline) + "</p>";
    }
    var r = run.report;
    var lvl = WC_LEVEL[r.level] || WC_LEVEL.info;
    var issues = [];
    r.sections.forEach(function (s) {
      s.checks.forEach(function (c) { if (c.level === "red" || c.level === "yellow") issues.push(c); });
    });
    issues.sort(function (a, b) { return (b.level === "red") - (a.level === "red"); });
    var canShare = Boolean(navigator.canShare && window.File) && navigator.canShare({ files: [new File([""], run.filename, { type: "application/pdf" })] });
    return '<div class="bdv-ops-card bdv-ops-wc is-' + esc(r.level) + '">' +
      '<div class="bdv-ops-card-head"><div><strong>' + lvl.dot + " Web Check: " + esc(lvl.label) + "</strong>" +
      '<div class="bdv-ops-sub">' + esc(r.headline) + "</div>" +
      '<div class="bdv-ops-muted">' + esc(webCheckWhen(r.generatedAt)) + " · " + r.counts.red + " en rojo · " + r.counts.yellow + " en amarillo · " + r.counts.green + " en verde</div></div>" +
      btn("web-check-close", "✕", "is-ghost is-small", ' aria-label="Cerrar el resultado del Web Check"') + "</div>" +
      '<div class="bdv-ops-actions">' + btn("web-check-pdf", "⬇ Descargar PDF", "is-primary") +
      (canShare ? btn("web-check-share", "Compartir PDF", "is-ghost") : "") + "</div>" +
      (issues.length
        ? '<ul class="bdv-ops-wc-list">' + issues.map(function (c) {
            return "<li>" + WC_LEVEL[c.level].dot + " <strong>" + esc(c.name) + "</strong>" + (c.action ? '<span class="bdv-ops-sub">' + esc(c.action) + "</span>" : "") + "</li>";
          }).join("") + "</ul>"
        : '<p class="bdv-ops-status">Todo lo revisado está en verde.</p>') +
      '<p class="bdv-ops-muted">El PDF no incluye claves ni datos privados de clientes: puedes compartirlo tal cual con BDV Bot.</p></div>';
  }

  function webCheckFile() {
    var bin = atob(ops.webCheck.pdfBase64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new File([bytes], ops.webCheck.filename, { type: "application/pdf" });
  }

  function downloadWebCheck() {
    var url = URL.createObjectURL(webCheckFile());
    var a = document.createElement("a");
    a.href = url;
    a.download = ops.webCheck.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function shareWebCheck() {
    navigator.share({ files: [webCheckFile()], title: "Web Check BDV" }).catch(function (err) {
      if (!err || err.name !== "AbortError") downloadWebCheck();
    });
  }

  // ---------- incoming requests ----------
  function requestCard(r) {
    var existing = projectForEmail(r.clientEmail);
    var open = ops.form && ops.form.kind === "project" && ops.form.id === r.id;
    var services = Array.isArray(r.services) ? r.services.join(", ") : "";
    return '<div class="bdv-ops-card' + (open ? " is-focus" : "") + '">' +
      '<div class="bdv-ops-card-head"><div><strong>' + esc(r.clientName) + "</strong> <span class=\"bdv-ops-muted\">" + esc(r.clientEmail) + "</span>" +
      (r.businessName ? '<div class="bdv-ops-sub">' + esc(r.businessName) + "</div>" : "") + "</div>" +
      '<span class="bdv-ops-muted">' + esc(r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "") + "</span></div>" +
      (services ? '<div class="bdv-ops-sub">Servicio: ' + esc(services) + "</div>" : "") +
      (r.notes ? '<div class="bdv-ops-note">' + esc(String(r.notes).slice(0, 600)) + "</div>" : "") +
      (existing ? '<div class="bdv-ops-warn">Este correo ya tiene el proyecto «' + esc(existing.name) + "» (" + esc(existing.id) + ").</div>" : "") +
      (open
        ? projectForm(r)
        : '<div class="bdv-ops-actions">' +
          btn("open-project-form", "Crear proyecto y SOW →", "is-primary", dataAttr("id", r.id)) +
          '<a class="bdv-ops-btn is-ghost" href="mailto:' + esc(r.clientEmail) + '">Responder</a>' +
          btn("delete-request", "Descartar", "is-ghost is-danger-text", dataAttr("id", r.id)) +
          "</div>") +
      "</div>";
  }

  // Batista Digital Ventures signs the SOW as it is issued; the client's signature then completes it.
  var SOW_CONSENT = "Firmo electrónicamente este SOW en nombre de Batista Digital Ventures LLC (E-SIGN / UETA). Al enviarlo, el cliente solo tiene que firmar para cerrarlo.";
  function bdvSignatureFields(consent) {
    return '<div class="bdv-ops-sign-block"><div class="bdv-ops-sign-title">Tu firma (Batista Digital Ventures LLC firma primero)</div>' +
      field("bdvSignerName", "Tu nombre", OWNER_SIGNER.name, { required: true, half: true }) +
      field("bdvSignerTitle", "Tu cargo", OWNER_SIGNER.title, { required: true, half: true }) +
      '<label class="bdv-ops-check"><input type="checkbox" name="bdvConsent" required /> <span>' + esc(consent || SOW_CONSENT) + "</span></label></div>";
  }
  function bdvSignatureOf(v) {
    return { signerName: v.bdvSignerName, signerTitle: v.bdvSignerTitle, consentAccepted: v.bdvConsent === true };
  }
  function bdvSignatureError(v) {
    return v.bdvSignerName && v.bdvSignerTitle && v.bdvConsent ? "" : "Escribe tu nombre y cargo y marca la casilla para firmar.";
  }

  // One form for every new project: blank (from "+ Nuevo proyecto") or prefilled from a request.
  // The first SOW is signed by you and sent in the same step unless you untick it.
  function projectForm(r) {
    var scope = r ? [Array.isArray(r.services) ? r.services.join(", ") : "", r.businessName || ""].filter(Boolean).join(" · ") : "";
    return '<form class="bdv-ops-form" data-form="project"' + (r ? dataAttr("request", r.id) : "") + ">" +
      "<h5>" + (r ? "Nuevo proyecto para " + esc(r.clientName) : "Nuevo proyecto") + "</h5>" +
      field("clientName", "Nombre del cliente", r ? r.clientName : "", { required: true, half: true }) +
      field("email", "Correo del cliente", r ? r.clientEmail : "", { type: "email", required: true, half: true }) +
      field("name", "Nombre del proyecto", r ? r.businessName || (Array.isArray(r.services) && r.services[0]) || "" : "", { required: true, half: true }) +
      field("code", "PIN del cliente (opcional, 6 o más caracteres)", "", { placeholder: "Se genera solo", half: true, attrs: ' minlength="6" maxlength="32"' }) +
      field("name_en", "Nombre en inglés (opcional)", "", { placeholder: "Si lo dejas vacío se usa el mismo" }) +
      '<label class="bdv-ops-check"><input type="checkbox" name="withSow" checked /> <span>Firmar el SOW ahora y enviarlo al cliente</span></label>' +
      '<div class="bdv-ops-sow-fields">' +
      field("scopeSummary", "Alcance y entregables", scope, { textarea: true, required: true }) +
      field("totalAmount", "Presupuesto total (USD)", "", { type: "number", required: true, half: true }) +
      field("depositAmount", "Depósito inicial (USD)", "", { type: "number", required: true, half: true }) +
      bdvSignatureFields() +
      "</div>" +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Crear proyecto, firmar y enviar SOW</button>' +
      btn("cancel-form", "Cancelar", "is-ghost") + "</div></form>";
  }

  // ---------- projects ----------
  function projectCard(p) {
    var isAdmin = ops.role === "admin";
    var st = stageInfo(p.stage);
    var w = ops.data.currentSow[p.row];
    var displayName = getCore().getProjectDisplayName(p, "es");
    var head =
      '<div class="bdv-ops-card-head"><div><strong>' + esc(displayName) + '</strong> <span class="bdv-ops-muted">' + esc(p.id) + "</span>" +
      (isAdmin ? '<div class="bdv-ops-sub">' + esc([p.clientName, p.email, p.code ? "PIN " + p.code : ""].filter(Boolean).join(" · ")) + "</div>" : "") +
      "</div>" +
      '<span class="bdv-tracker-status-tag ' + (p.accessStatus === "DISABLED" ? "bdv-status-disabled" : "bdv-status-active") + '">' +
      (p.accessStatus === "DISABLED" ? "Cerrado" : "Activo") + "</span></div>" +
      '<div class="bdv-ops-stage"><div class="bdv-progress-track"><div class="bdv-progress-fill" style="width: ' + st.percentage + '%;"></div></div>' +
      "<span>Etapa " + st.stage + "/6 · " + esc(st.name_es) + "</span></div>" +
      (isAdmin ? ledgerSummaryHtml(ledgerOf(p)) : "");
    return '<div class="bdv-ops-card' + (projectNeedsYou(p) ? " is-attention" : "") + '" data-row="' + esc(p.row) + '">' + head +
      (isAdmin ? adminProjectBody(p, w) : partnerProjectBody(p)) + "</div>";
  }

  function proposalOf(p) {
    if (!p.pendingProposal) return null;
    try { return JSON.parse(p.pendingProposal); } catch (_) { return null; }
  }

  function adminProjectBody(p, w) {
    var row = p.row;
    var stage = Number(p.stage) || 1;
    var form = ops.form && ops.form.id === String(row) ? ops.form.kind : "";
    var status = "";
    var actions = [];
    var proposal = proposalOf(p);
    var l = ledgerOf(p);
    var depositDue = Boolean(l && l.nextDue && l.nextDue.type === "deposit");
    var canChangeOrder = Boolean(l && l.anchorSowId) && form !== "co";
    var closed = stage >= 6 || p.accessStatus === "DISABLED";

    if (closed) {
      status = "Proyecto cerrado y entregado.";
    } else if (proposal) {
      status = "El partner reporta avance a la Etapa " + proposal.stage + "/6." + (proposal.notes ? " Nota: " + proposal.notes : "");
      actions.push(btn("approve", "✓ Aprobar avance a Etapa " + proposal.stage, "is-primary", dataAttr("row", row)));
    } else if (!w && stage <= 1) {
      status = "Siguiente paso: emitir el SOW con el alcance y el precio acordados.";
      if (form !== "sow") actions.push(btn("open-sow", "📄 Emitir SOW", "is-primary", dataAttr("row", row)));
    } else if (needsReissue(w)) {
      status = "El SOW " + w.sowId + " es del flujo anterior y no tiene tu firma, así que no se puede completar. Emite uno nuevo firmado por ti; reemplaza al anterior.";
      if (form !== "sow") actions.push(btn("open-sow", "✍ Firmar y reenviar SOW", "is-primary", dataAttr("row", row)));
    } else if (w && !w.signature) {
      status = "Firmaste el SOW " + w.sowId + " (" + money(w.totalAmount) + ") y se envió a " + w.clientEmail + ". Esperando su firma; al firmar, queda cerrado y puede pagar el depósito.";
      actions.push(btn("copy", "Copiar enlace del SOW", "is-ghost", dataAttr("url", sowUrlOf(w))));
      if (form !== "sow") actions.push(btn("open-sow", "Corregir y reenviar SOW", "is-ghost", dataAttr("row", row)));
    } else if (w && depositDue && stage <= 2) {
      status = "SOW firmado por ambas partes. Esperando el depósito de " + money(w.depositAmount) + " (el cliente paga desde el enlace del SOW; al pagarlo, el proyecto pasa solo a la Etapa 3).";
      actions.push(btn("copy", "Copiar enlace para pagar", "is-ghost", dataAttr("url", sowUrlOf(w))));
    } else if (stage < 5) {
      var next = stageInfo(stage + 1);
      status = "Proyecto en curso.";
      actions.push(btn("advance", "Avanzar a Etapa " + next.stage + ": " + next.name_es, "is-primary", dataAttr("row", row) + dataAttr("stage", next.stage)));
      if (form !== "pay") actions.push(btn("open-pay", "💳 Cobrar un hito", "is-ghost", dataAttr("row", row)));
      if (canChangeOrder) actions.push(btn("open-co", "➕ Orden de cambio", "is-ghost", dataAttr("row", row)));
    } else {
      status = "En revisión del cliente. Para cerrar, cobra la liquidación final (al pagarla, el proyecto pasa solo a la Etapa 6).";
      if (form !== "pay") actions.push(btn("open-pay", "💳 Cobrar liquidación final", "is-primary", dataAttr("row", row)));
      if (canChangeOrder) actions.push(btn("open-co", "➕ Orden de cambio", "is-ghost", dataAttr("row", row)));
      actions.push(btn("advance", "Cerrar sin cobro (Etapa 6)", "is-ghost", dataAttr("row", row) + dataAttr("stage", 6)));
    }
    // Change orders waiting on the client (signature or payment) are part of where the project stands.
    if (l && !closed) {
      l.changeOrders.forEach(function (co) {
        if (co.status === "PENDING_CLIENT") status += " La orden de cambio " + co.coId + " (" + money(co.amountUsd) + ") espera la firma del cliente.";
        if (co.status === "APPROVED" && !co.paid) status += " El cliente aprobó la orden de cambio " + co.coId + "; falta su pago de " + money(co.amountUsd) + " antes de empezar ese trabajo.";
      });
    }

    // While a charge or change-order form is open, its own buttons are the only ones (no competing next step).
    if (form === "pay" || form === "co") actions = [];
    var formHtml = form === "sow" ? sowForm(p, w) : form === "pay" ? payForm(p, l) : form === "co" ? changeOrderForm(p, l) : "";
    var link = ops.payLinks[row];
    var linkHtml = link
      ? '<div class="bdv-ops-link">Enlace de pago: <a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + esc(link.slice(0, 48)) + "…</a> " +
        btn("copy", "Copiar", "is-ghost is-small", dataAttr("url", link)) + "</div>"
      : "";
    return '<p class="bdv-ops-status">' + esc(status) + "</p>" + formHtml + linkHtml +
      (actions.length ? '<div class="bdv-ops-actions">' + actions.join("") + "</div>" : "") +
      ledgerDetails(p, l, form) +
      moreOptions(p, w);
  }

  // ---------- payments ledger (admin) ----------
  function ledgerSummaryHtml(l) {
    if (!l || !l.total) return "";
    return '<div class="bdv-ops-ledger">' +
      paymentBarHtml(l, { paid: "Pagado", pending: "Pendiente", total: "Total" }) +
      '<div class="bdv-ops-sub">SOW ' + esc(l.sowIds.join(" + ")) + " " + esc(money(l.contractTotal)) +
      (l.changeOrdersTotal ? " + órdenes de cambio aprobadas " + esc(money(l.changeOrdersTotal)) : "") + "</div>" +
      (l.nextDue
        ? '<div class="bdv-ops-next">Próximo cobro: <strong>' + esc(dueLabel(l.nextDue)) + " · " + esc(money(l.nextDue.amountUsd)) + "</strong> · " + esc(l.nextDue.when) + "</div>"
        : '<div class="bdv-ops-next is-done">✓ Pagado al 100%</div>') +
      (l.overpaid ? '<div class="bdv-ops-warn">⚠ Cobrado de más: ' + esc(money(l.overpaid)) + ". Revisa si corresponde un reembolso.</div>" : "") +
      "</div>";
  }

  var CO_STATUS_LABEL = { PENDING_CLIENT: "Espera la firma del cliente", APPROVED: "Aprobada por el cliente", VOID: "Anulada" };
  var AUDIT_LABEL = { created: "Creada y firmada por BDV", emailed: "Enviada al cliente", email_failed: "El correo no salió", approved: "Aprobada y firmada por el cliente", paid: "Pagada", voided: "Anulada", payment_voided: "Pago anulado" };

  // Every payment and change order of the project, with its audit trail. Nothing is edited: a manual
  // payment or a change order is voided with a reason, and that stays in the history.
  function ledgerDetails(p, l, form) {
    if (!l || (!l.anchorSowId && !l.payments.length)) return "";
    var ref = ops.form && ops.form.ref;
    var payments = l.payments.length
      ? '<ul class="bdv-ops-ledger-list">' + l.payments.map(function (pm) {
          var voided = Boolean(pm.voidedAt);
          return '<li class="' + (voided ? "is-void" : "") + '"><div><strong>' + esc(money(pm.amountUsd)) + "</strong> · " + esc(pm.concept) + " · " + esc(shortDate(pm.paidAt)) +
            '<div class="bdv-ops-sub">' + esc([pm.methodLabel, pm.ref ? "Ref. " + pm.ref : "", "SOW " + pm.sowId, pm.source === "admin" ? "registrado a mano" : "", pm.note].filter(Boolean).join(" · ")) + "</div>" +
            (voided ? '<div class="bdv-ops-sub">Anulado ' + esc(shortDate(pm.voidedAt)) + ": " + esc(pm.voidReason) + "</div>" : "") + "</div>" +
            (!voided && pm.method !== "stripe" && !(form === "void-pay" && ref === pm.id) ? btn("open-void-pay", "Anular", "is-ghost is-small is-danger-text", dataAttr("row", p.row) + dataAttr("ref", pm.id)) : "") +
            (form === "void-pay" && ref === pm.id ? voidForm("void-pay", p.row, pm.id, "Anular este pago de " + money(pm.amountUsd)) : "") +
            "</li>";
        }).join("") + "</ul>"
      : '<p class="bdv-ops-empty">Todavía no hay pagos.</p>';
    var cos = l.changeOrders.length
      ? '<ul class="bdv-ops-ledger-list">' + l.changeOrders.map(function (co) {
          var state = co.status === "APPROVED" ? CO_STATUS_LABEL.APPROVED + (co.paid ? " · pagada" : " · por pagar") : CO_STATUS_LABEL[co.status] || co.status;
          var canVoid = co.status !== "VOID" && !co.paid;
          return '<li class="' + (co.status === "VOID" ? "is-void" : "") + '"><div><strong>' + esc(co.coId) + "</strong> · " + esc(money(co.amountUsd)) + " · " + esc(state) +
            '<div class="bdv-ops-sub">' + esc(co.description) + " · Motivo: " + esc(co.reason) + "</div>" +
            (co.voidReason ? '<div class="bdv-ops-sub">Motivo de anulación: ' + esc(co.voidReason) + "</div>" : "") +
            '<details class="bdv-ops-audit"><summary>Historial</summary><ul>' + (co.audit || []).map(function (a) {
              return "<li>" + esc(shortDate(a.at) + " " + new Date(a.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })) + " · " + esc(AUDIT_LABEL[a.event] || a.event) +
                (a.ip ? " · IP " + esc(a.ip) : "") + (a.detail ? " · " + esc(a.detail) : "") + "</li>";
            }).join("") + "</ul></details></div>" +
            '<div class="bdv-ops-actions">' +
            (co.status !== "VOID" && !co.paid ? btn("copy", "Copiar enlace", "is-ghost is-small", dataAttr("url", coUrlOf(co))) : "") +
            (canVoid && !(form === "void-co" && ref === co.coId) ? btn("open-void-co", "Anular", "is-ghost is-small is-danger-text", dataAttr("row", p.row) + dataAttr("ref", co.coId)) : "") +
            "</div>" +
            (form === "void-co" && ref === co.coId ? voidForm("void-co", p.row, co.coId, "Anular la orden de cambio " + co.coId + (co.status === "APPROVED" ? " (el cliente ya la aprobó; se le avisará por correo)" : "")) : "") +
            "</li>";
        }).join("") + "</ul>"
      : '<p class="bdv-ops-empty">Sin órdenes de cambio.</p>';
    var open = form === "record" || form === "void-pay" || form === "void-co";
    return '<details class="bdv-ops-more bdv-ops-pay-details"' + (open ? " open" : "") + '><summary>💵 Pagos y órdenes de cambio (' + (l.payments.length + l.changeOrders.length) + ")</summary>" +
      "<h6>Pagos</h6>" + payments + "<h6>Órdenes de cambio</h6>" + cos +
      (form === "record" ? recordPaymentForm(p, l) : l.anchorSowId ? '<div class="bdv-ops-actions">' + btn("open-record", "Registrar un pago recibido fuera de Stripe", "is-ghost is-small", dataAttr("row", p.row)) + "</div>" : "") +
      "</details>";
  }

  function voidForm(kind, row, ref, title) {
    return '<form class="bdv-ops-form is-inline bdv-ops-void" data-form="' + kind + '"' + dataAttr("row", row) + dataAttr("ref", ref) + ">" +
      "<h5>" + esc(title) + "</h5>" +
      field("reason", "Motivo (queda registrado)", "", { required: true, attrs: ' minlength="5"' }) +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-danger">Anular</button>' + btn("cancel-form", "Cancelar", "is-ghost") + "</div></form>";
  }

  // Extra work on the signed SOW: you sign it here, the client approves and signs it from the email, and
  // only then it is added to the total and can be charged.
  function changeOrderForm(p, l) {
    return '<form class="bdv-ops-form" data-form="co"' + dataAttr("row", p.row) + ">" +
      "<h5>Orden de cambio (trabajo adicional al SOW " + esc(l.anchorSowId) + ")</h5>" +
      field("description", "Trabajo adicional", "", { textarea: true, required: true, placeholder: "Qué se agrega, con el detalle que el cliente va a firmar" }) +
      field("reason", "Motivo", "", { required: true, half: true, placeholder: "Por qué se agrega (p. ej., lo pidió el cliente)" }) +
      field("amountUsd", "Monto (USD)", "", { type: "number", required: true, half: true }) +
      '<p class="bdv-ops-sub">Total actual ' + esc(money(l.total)) + '. No se suma ni se cobra hasta que el cliente la apruebe y la firme.</p>' +
      bdvSignatureFields("Firmo electrónicamente esta orden de cambio en nombre de Batista Digital Ventures LLC (E-SIGN / UETA). El cliente la recibe por correo para aprobarla y firmarla.") +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">✍ Firmar y enviar al cliente</button>' +
      btn("cancel-form", "Cancelar", "is-ghost") + "</div></form>";
  }

  // A payment received outside Stripe (Zelle, transfer, cash, check). The amount is fixed by the ledger
  // except for a milestone, which can never be more than what can still be charged.
  function recordPaymentForm(p, l) {
    var options = [];
    if (l.nextDue && l.nextDue.type === "deposit") options.push({ value: "deposit", label: "Depósito", amount: l.nextDue.amountUsd, fixed: true });
    l.changeOrders.forEach(function (co) {
      if (co.status === "APPROVED" && !co.paid) options.push({ value: "change_order:" + co.coId, label: "Orden de cambio " + co.coId, amount: co.amountUsd, fixed: true });
    });
    if (!l.limits.blocked && l.limits.milestoneMax > 0) options.push({ value: "milestone", label: "Hito (máximo " + money(l.limits.milestoneMax) + ")", amount: "", fixed: false, max: l.limits.milestoneMax });
    if (!l.limits.blocked && !l.limits.finalBlocked) options.push({ value: "final_settlement", label: "Liquidación final", amount: l.limits.finalAmount, fixed: true });
    if (!options.length) return '<p class="bdv-ops-warn">' + esc(l.limits.blocked || l.limits.finalBlocked || "No hay nada pendiente de cobro.") + "</p>";
    var first = options[0];
    var methods = [["zelle", "Zelle"], ["transfer", "Transferencia bancaria"], ["cash", "Efectivo"], ["check", "Cheque"], ["other", "Otro"]];
    return '<form class="bdv-ops-form is-inline" data-form="record"' + dataAttr("row", p.row) + ">" +
      "<h5>Registrar un pago recibido fuera de Stripe</h5>" +
      '<label class="bdv-ops-field is-half"><span>Concepto</span><select name="type" class="bdv-tracker-input">' + options.map(function (o) {
        return '<option value="' + esc(o.value) + '"' + dataAttr("amount", o.amount) + dataAttr("fixed", o.fixed ? "1" : "") + dataAttr("max", o.max || "") + ">" + esc(o.label) + "</option>";
      }).join("") + "</select></label>" +
      field("amountUsd", "Monto recibido (USD)", first.amount, { type: "number", required: true, half: true, attrs: (first.fixed ? " readonly" : "") + (first.max ? ' max="' + esc(first.max) + '"' : "") }) +
      '<label class="bdv-ops-field is-half"><span>Cómo se recibió</span><select name="method" class="bdv-tracker-input">' + methods.map(function (m) {
        return '<option value="' + m[0] + '">' + esc(m[1]) + "</option>";
      }).join("") + "</select></label>" +
      field("paidAt", "Fecha del pago", new Date().toISOString().slice(0, 10), { type: "date", required: true, half: true }) +
      field("ref", "Referencia o número de confirmación", "", { half: true }) +
      field("note", "Nota (opcional)", "", { half: true }) +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Registrar pago</button>' + btn("cancel-form", "Cancelar", "is-ghost") + "</div></form>";
  }

  function sowForm(p, w) {
    var req = requestOfProject(p);
    var prev = w && w.status !== "SIGNED" ? w : null;
    return '<form class="bdv-ops-form" data-form="sow"' + dataAttr("row", p.row) + ">" +
      "<h5>" + (prev ? "Corregir el SOW " + esc(prev.sowId) + " (el enlace anterior dejará de funcionar)" : "Emitir SOW") + "</h5>" +
      field("clientName", "Nombre del cliente", p.clientName || (req && req.clientName) || (prev && prev.clientName) || "", { required: true, half: true }) +
      field("clientEmail", "Correo del cliente", p.email, { type: "email", required: true, half: true }) +
      field("scopeSummary", "Alcance y entregables", prev ? prev.scopeSummary : "", { textarea: true, required: true }) +
      field("totalAmount", "Presupuesto total (USD)", prev ? prev.totalAmount : "", { type: "number", required: true, half: true }) +
      field("depositAmount", "Depósito inicial (USD)", prev ? prev.depositAmount : "", { type: "number", required: true, half: true }) +
      bdvSignatureFields() +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">✍ Firmar y enviar al cliente</button>' +
      btn("cancel-form", "Cancelar", "is-ghost") + "</div></form>";
  }

  // Stripe link for a milestone or the final settlement. The server caps the milestone at what can still
  // be charged and sets the final amount itself; the form only shows those limits.
  function payForm(p, l) {
    var limits = l ? l.limits : { blocked: "El proyecto no tiene un SOW firmado por ambas partes." };
    if (limits.blocked) return '<p class="bdv-ops-warn">' + esc(limits.blocked) + "</p>";
    var finalOk = !limits.finalBlocked;
    var finalDue = Number(p.stage) >= 5 && finalOk;
    return '<form class="bdv-ops-form is-inline" data-form="pay"' + dataAttr("row", p.row) + ">" +
      '<label class="bdv-ops-field is-half"><span>Tipo de cobro</span><select name="paymentType" class="bdv-tracker-input">' +
      '<option value="milestone"' + dataAttr("amount", "") + dataAttr("max", limits.milestoneMax) + (finalDue ? "" : " selected") + ">Hito intermedio (máximo " + esc(money(limits.milestoneMax)) + ")</option>" +
      (finalOk ? '<option value="final_settlement"' + dataAttr("amount", limits.finalAmount) + dataAttr("fixed", "1") + (finalDue ? " selected" : "") + ">Liquidación final: " + esc(money(limits.finalAmount)) + " (cierra en Etapa 6)</option>" : "") +
      "</select></label>" +
      field("amountUsd", "Monto a cobrar (USD)", finalDue ? limits.finalAmount : "", { type: "number", required: true, half: true, attrs: finalDue ? " readonly" : ' max="' + esc(limits.milestoneMax) + '"' }) +
      (finalOk ? "" : '<p class="bdv-ops-sub">Liquidación final: ' + esc(limits.finalBlocked) + "</p>") +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Crear enlace de pago</button>' +
      btn("cancel-form", "Cancelar", "is-ghost") + "</div></form>";
  }

  function moreOptions(p, w) {
    var req = requestOfProject(p);
    var stageOptions = getCore().workflowStages.map(function (s) {
      return '<option value="' + s.stage + '"' + (Number(p.stage) === s.stage ? " selected" : "") + ">" + s.stage + ". " + esc(s.name_es) + "</option>";
    }).join("");
    return '<details class="bdv-ops-more"><summary>Más opciones</summary>' +
      '<form class="bdv-ops-form is-inline" data-form="stage"' + dataAttr("row", p.row) + '><label class="bdv-ops-field"><span>Cambiar la etapa a mano</span>' +
      '<select name="stage" class="bdv-tracker-input">' + stageOptions + "</select></label>" +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-ghost">Guardar etapa</button></div></form>' +
      '<form class="bdv-ops-form is-inline" data-form="pin"' + dataAttr("row", p.row) + ">" +
      field("code", "PIN del cliente para ver su avance (6 o más caracteres)", p.code, { required: true, attrs: ' minlength="6" maxlength="32"' }) +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-ghost">Guardar PIN</button></div></form>' +
      (req ? '<div class="bdv-ops-note">Solicitud original (' + esc(req.id) + "): " + esc([(req.services || []).join(", "), req.notes].filter(Boolean).join(" · ")) + "</div>" : "") +
      '<div class="bdv-ops-actions">' + btn("delete-project", "Eliminar proyecto", "is-ghost is-danger-text", dataAttr("row", p.row)) + "</div>" +
      "</details>";
  }

  function partnerProjectBody(p) {
    var proposal = proposalOf(p);
    if (proposal) {
      return '<p class="bdv-ops-status">Tu reporte de avance a la Etapa ' + esc(proposal.stage) + "/6 está en revisión del administrador.</p>";
    }
    var options = getCore().workflowStages.map(function (s) {
      return '<option value="' + s.stage + '"' + (Number(p.stage) + 1 === s.stage ? " selected" : "") + ">" + s.stage + ". " + esc(s.name_es) + "</option>";
    }).join("");
    return '<form class="bdv-ops-form is-inline" data-form="propose"' + dataAttr("row", p.row) + ">" +
      '<label class="bdv-ops-field is-half"><span>Etapa alcanzada</span><select name="stage" class="bdv-tracker-input">' + options + "</select></label>" +
      field("notes", "Resumen de lo avanzado", "", { required: true, half: true }) +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Enviar avance a revisión</button></div></form>';
  }

  function otherSowCard(w) {
    var state = w.status === "VOID"
      ? "Reemplazado" + (w.voidedBy ? " por " + w.voidedBy : "")
      : w.status === "SIGNED" ? "Firmado"
        : !w.providerSignature ? "Flujo anterior, sin tu firma (no se puede completar)" : "Firmado por ti · esperando al cliente";
    return '<div class="bdv-ops-card is-compact"><div class="bdv-ops-card-head"><div><strong>' + esc(w.sowId) + "</strong> · " + esc(w.clientName) +
      ' <span class="bdv-ops-muted">' + esc(w.clientEmail) + "</span>" +
      '<div class="bdv-ops-sub">' + esc(money(w.totalAmount)) + " · " + esc(state) + " · " + esc(w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "") + "</div></div>" +
      '<div class="bdv-ops-actions"><a class="bdv-ops-btn is-ghost is-small" href="' + esc(sowUrlOf(w)) + '" target="_blank" rel="noopener noreferrer">Ver</a></div></div></div>';
  }

  function appCard(a) {
    var details = [a.specialty, a.timezone, a.lang ? "Idioma: " + a.lang : ""].filter(Boolean).join(" · ");
    return '<div class="bdv-ops-card is-compact"><div class="bdv-ops-card-head"><div><strong>' + esc(a.name) + '</strong> <span class="bdv-ops-muted">' + esc(a.email) + "</span>" +
      (details ? '<div class="bdv-ops-sub">' + esc(details) + "</div>" : "") + "</div></div>" +
      (a.notes ? '<div class="bdv-ops-note">' + esc(a.notes) + "</div>" : "") +
      '<div class="bdv-ops-actions">' +
      (/^https?:\/\//i.test(String(a.portfolio || "")) ? '<a class="bdv-ops-btn is-ghost is-small" href="' + esc(a.portfolio) + '" target="_blank" rel="noopener noreferrer">Ver portafolio</a>' : "") +
      (isValidEmailSimple(String(a.email || "")) ? '<a class="bdv-ops-btn is-ghost is-small" href="mailto:' + esc(a.email) + '">Responder</a>' : "") +
      btn("delete-app", "Descartar", "is-ghost is-small is-danger-text", dataAttr("id", a.id)) + "</div></div>";
  }

  // ---------- actions ----------
  function formValues(form) {
    var out = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      out[el.name] = el.type === "checkbox" ? el.checked : String(el.value || "").trim();
    });
    return out;
  }

  function amountsError(v) {
    var total = Number(v.totalAmount);
    var deposit = Number(v.depositAmount);
    return total > 0 && deposit > 0 && deposit <= total ? "" : "Indica el presupuesto total y un depósito mayor que 0 y no mayor que el total.";
  }

  var formHandlers = {
    project: function (form, submitBtn) {
      var v = formValues(form);
      var requestId = form.getAttribute("data-request") || "";
      if (!v.clientName || !isValidEmailSimple(v.email) || !v.name) return toast("Completa el nombre del cliente, un correo válido y el nombre del proyecto.", false);
      if (v.code && v.code.length < 6) return toast("El PIN debe tener al menos 6 caracteres (o déjalo vacío para que se genere solo).", false);
      if (v.withSow && (!v.scopeSummary || amountsError(v))) return toast(v.scopeSummary ? amountsError(v) : "Escribe el alcance del SOW.", false);
      if (v.withSow && bdvSignatureError(v)) return toast(bdvSignatureError(v), false);
      var payload = {
        action: "create_project",
        requestId: requestId,
        clientName: v.clientName,
        email: v.email.toLowerCase(),
        name: v.name,
        name_es: v.name,
        name_en: v.name_en || v.name,
        code: v.code.toUpperCase(),
        sow: v.withSow ? { scopeSummary: v.scopeSummary, totalAmount: Number(v.totalAmount), depositAmount: Number(v.depositAmount) } : undefined,
        providerSignature: v.withSow ? bdvSignatureOf(v) : undefined
      };
      var go = function (b) {
        runAction(b, payload, function (res) {
          if (!res.sowId) return { msg: "✓ Proyecto «" + res.project.name + "» creado (PIN " + res.project.code + ")." };
          return res.emailSent
            ? { msg: "✓ Proyecto creado (PIN " + res.project.code + "). Firmaste el SOW " + res.sowId + " y se envió a " + payload.email + " para su firma." }
            : { msg: "⚠ Proyecto y SOW " + res.sowId + " creados, pero el correo al cliente no salió. Usa «Copiar enlace del SOW» y envíaselo tú.", ok: false };
        });
      };
      var dup = projectForEmail(payload.email);
      if (dup) {
        confirmCard(submitBtn, "Ya existe el proyecto «" + dup.name + "» con " + payload.email + ". ¿Crear otro proyecto para este correo?", "Sí, crear otro", go);
      } else {
        go(submitBtn);
      }
    },
    sow: function (form, submitBtn) {
      var v = formValues(form);
      if (!v.clientName || !isValidEmailSimple(v.clientEmail)) return toast("Escribe el nombre del cliente y un correo válido.", false);
      if (!v.scopeSummary) return toast("Escribe el alcance del SOW.", false);
      if (amountsError(v)) return toast(amountsError(v), false);
      if (bdvSignatureError(v)) return toast(bdvSignatureError(v), false);
      var p = findProject(form.getAttribute("data-row"));
      if (!p) return toast("No encontré el proyecto; se actualizará la lista.", false);
      runAction(submitBtn, {
        action: "create_sow",
        projectRow: p.row,
        clientName: v.clientName,
        clientEmail: v.clientEmail.toLowerCase(),
        businessName: getCore().getProjectDisplayName(p, "es"),
        scopeSummary: v.scopeSummary,
        totalAmount: Number(v.totalAmount),
        depositAmount: Number(v.depositAmount),
        providerSignature: bdvSignatureOf(v)
      }, function (res) {
        return res.emailSent
          ? { msg: "✓ Firmaste el SOW " + res.sowId + " y se envió a " + v.clientEmail + " para que lo firme." }
          : { msg: "⚠ SOW " + res.sowId + " creado, pero el correo no salió. Usa «Copiar enlace del SOW» y envíaselo tú.", ok: false };
      });
    },
    pay: function (form, submitBtn) {
      var v = formValues(form);
      var p = findProject(form.getAttribute("data-row"));
      var amount = Number(v.amountUsd);
      if (!p) return;
      if (!(amount >= 0.5)) return toast("Indica un monto válido en USD (mínimo $0.50).", false);
      var l = ledgerOf(p);
      if (v.paymentType === "milestone" && l && amount > l.limits.milestoneMax) return toast("El hito no puede superar lo que falta por cobrar (" + money(l.limits.milestoneMax) + ").", false);
      if (!window.BDV_SOW || typeof window.BDV_SOW.createCheckoutLink !== "function") return toast("El módulo de pagos no está disponible; recarga la página.", false);
      var w = ops.data.currentSow[p.row];
      var isFinal = v.paymentType === "final_settlement";
      var label = submitBtn.textContent;
      if (submitBtn.disabled) return;
      submitBtn.disabled = true;
      submitBtn.textContent = "Creando enlace…";
      ops.inFlight++;
      window.BDV_SOW.createCheckoutLink({
        authKey: ops.token,
        sowId: w ? w.sowId : "",
        amountUsd: amount,
        paymentType: isFinal ? "final_settlement" : "milestone",
        targetStage: isFinal ? 6 : Number(p.stage) || 3
      })
        .then(function (res) {
          if (!res || !res.ok || !res.checkoutUrl) {
            toast("No se pudo crear el enlace de pago: " + ((res && res.error) || "error desconocido"), false);
            return;
          }
          ops.payLinks[p.row] = res.checkoutUrl;
          ops.form = null;
          render();
          copyText(res.checkoutUrl);
        })
        .catch(function () { toast("Error de conexión al crear el enlace de pago.", false); })
        .then(function () {
          ops.inFlight--;
          if (document.body.contains(submitBtn)) { submitBtn.disabled = false; submitBtn.textContent = label; }
        });
    },
    co: function (form, submitBtn) {
      var v = formValues(form);
      var p = findProject(form.getAttribute("data-row"));
      if (!p) return;
      if (v.description.length < 5 || v.reason.length < 5) return toast("Describe el trabajo adicional y el motivo.", false);
      if (!(Number(v.amountUsd) >= 1)) return toast("Indica el monto de la orden de cambio (mínimo $1).", false);
      if (bdvSignatureError(v)) return toast(bdvSignatureError(v), false);
      runAction(submitBtn, {
        action: "create_change_order",
        row: p.row,
        description: v.description,
        reason: v.reason,
        amountUsd: Number(v.amountUsd),
        providerSignature: bdvSignatureOf(v)
      }, function (res) {
        return res.emailSent
          ? { msg: "✓ Firmaste la orden de cambio " + res.coId + " y se envió al cliente para que la apruebe." }
          : { msg: "⚠ Orden de cambio " + res.coId + " creada, pero el correo no salió. Usa «Copiar enlace» y envíaselo tú.", ok: false };
      });
    },
    record: function (form, submitBtn) {
      var v = formValues(form);
      var p = findProject(form.getAttribute("data-row"));
      if (!p) return;
      var type = v.type.split(":")[0];
      if (!(Number(v.amountUsd) > 0)) return toast("Indica el monto recibido.", false);
      runAction(submitBtn, {
        action: "record_payment",
        row: p.row,
        type: type,
        changeOrderId: type === "change_order" ? v.type.split(":")[1] : "",
        amountUsd: Number(v.amountUsd),
        method: v.method,
        paidAt: v.paidAt,
        ref: v.ref,
        note: v.note
      }, function (res) {
        return { msg: "✓ Pago de " + money(res.payment.amountUsd) + " registrado. Pendiente: " + money(res.ledger.pending) + ". El cliente recibió su comprobante." };
      });
    },
    "void-co": function (form, submitBtn) {
      var reason = formValues(form).reason;
      if (reason.length < 5) return toast("Escribe el motivo de la anulación.", false);
      runAction(submitBtn, { action: "void_change_order", coId: form.getAttribute("data-ref"), reason: reason }, function (res) {
        return { msg: "✓ Orden de cambio " + res.coId + " anulada" + (res.clientNotified ? "; se avisó al cliente." : ".") };
      });
    },
    "void-pay": function (form, submitBtn) {
      var reason = formValues(form).reason;
      if (reason.length < 5) return toast("Escribe el motivo de la anulación.", false);
      runAction(submitBtn, { action: "void_payment", row: Number(form.getAttribute("data-row")), paymentId: form.getAttribute("data-ref"), reason: reason }, function (res) {
        return { msg: "✓ Pago anulado (queda en el historial). Pendiente: " + money(res.ledger.pending) + "." };
      });
    },
    "login-setup-1": function (form, submitBtn) {
      var email = formValues(form).email;
      var password = form.password.value; // as typed (no trimming), exactly like the sign-in form sends it
      if (password.length < 12) return toast("La contraseña debe tener al menos 12 caracteres.", false);
      if (password !== form.password2.value) return toast("Las dos contraseñas no coinciden.", false);
      runAction(submitBtn, { action: "admin_auth_setup_start", email: email, password: password }, function (res) {
        ops.setup = { step: 2, secret: res.secret, qrSvg: res.qrSvg, otpauthUri: res.otpauthUri, issuer: res.issuer, account: res.account };
        return { msg: "Paso 2 de 3: escanee el código QR con Google Authenticator." };
      }, true);
    },
    "login-setup-2": function (form, submitBtn) {
      runAction(submitBtn, { action: "admin_auth_setup_confirm", code: formValues(form).code }, function (res) {
        ops.setup = { step: 3, codes: res.recoveryCodes, email: res.email };
        return { msg: "✓ Acceso activado. Guarde sus códigos de recuperación." };
      }, true);
    },
    "login-setup-3": function () {
      setLoginMode("email"); // next time this browser opens the email + password sign-in
      ops.setup = null;
      ops.form = null;
      toast("✓ Listo. La próxima vez entre con su correo y contraseña.", true);
      loadData();
    },
    stage: function (form, submitBtn) {
      setStage(submitBtn, Number(formValues(form).stage), findProject(form.getAttribute("data-row")));
    },
    pin: function (form, submitBtn) {
      var code = formValues(form).code.toUpperCase();
      if (code.length < 6) return toast("El PIN debe tener al menos 6 caracteres.", false);
      runAction(submitBtn, { action: "update_pin", row: Number(form.getAttribute("data-row")), code: code }, function (res) {
        return { msg: "✓ PIN actualizado a " + res.code + "." };
      });
    },
    propose: function (form, submitBtn) {
      var v = formValues(form);
      if (!v.notes) return toast("Escribe un resumen de lo avanzado.", false);
      runAction(submitBtn, { action: "propose", row: Number(form.getAttribute("data-row")), stage: Number(v.stage), notes: v.notes }, function () {
        return { msg: "✓ Avance enviado a revisión del administrador." };
      });
    }
  };

  // Stage 6 closes the client's progress viewer, so it asks first; other stages save directly.
  function setStage(button, stage, p) {
    if (!p || !(stage >= 1 && stage <= 6)) return;
    var go = function (b) {
      runAction(b, { action: "update", row: p.row, stage: stage }, function () {
        return { msg: "✓ «" + p.name + "» ahora está en la Etapa " + stage + "/6." };
      });
    };
    if (stage === 6) {
      var l = ledgerOf(p);
      confirmCard(button, "¿Cerrar «" + p.name + "» en la Etapa 6? El cliente ya no podrá consultar su avance con el PIN." +
        (l && l.pending > 0 ? " Atención: quedan " + money(l.pending) + " sin cobrar." : ""), "Sí, cerrar proyecto", go);
    } else {
      go(button);
    }
  }

  var clickHandlers = {
    "open-project-form": function (b) { ops.form = { kind: "project", id: b.getAttribute("data-id") }; render(); },
    "new-project": function () { ops.form = { kind: "project", id: "" }; render(); focusForm(); },
    "open-sow": function (b) { ops.form = { kind: "sow", id: b.getAttribute("data-row") }; render(); focusForm(); },
    "open-pay": function (b) { ops.form = { kind: "pay", id: b.getAttribute("data-row") }; render(); focusForm(); },
    "open-co": function (b) { ops.form = { kind: "co", id: b.getAttribute("data-row") }; render(); focusForm(); },
    "open-record": function (b) { ops.form = { kind: "record", id: b.getAttribute("data-row") }; render(); },
    "open-void-co": function (b) { ops.form = { kind: "void-co", id: b.getAttribute("data-row"), ref: b.getAttribute("data-ref") }; render(); },
    "open-void-pay": function (b) { ops.form = { kind: "void-pay", id: b.getAttribute("data-row"), ref: b.getAttribute("data-ref") }; render(); },
    "cancel-form": function () { ops.form = null; ops.setup = null; render(); },
    "open-login-setup": function () {
      ops.form = { kind: "login-setup" };
      ops.setup = null;
      render();
      focusForm();
    },
    "copy-secret": function () { copyText(ops.setup.secret, "✓ Clave de configuración copiada."); },
    "copy-recovery": function () { copyText(ops.setup.codes.join("\n"), "✓ Códigos copiados. Péguelos en un lugar seguro."); },
    "download-recovery": function () { downloadRecoveryCodes(); },
    "web-check": function (b) {
      runAction(b, { action: "web_check" }, function (res) {
        ops.webCheck = { report: res.report, pdfBase64: res.pdfBase64, filename: res.filename };
        return { msg: "✓ Web Check listo. El resultado y el PDF están abajo.", ok: true };
      });
    },
    "web-check-pdf": function () { downloadWebCheck(); },
    "web-check-share": function () { shareWebCheck(); },
    "web-check-close": function () { ops.webCheck = null; render(); },
    "backup-now": function (b) {
      var menu = b.closest(".bdv-ops-menu");
      if (menu) menu.open = false;
      runAction(b, { action: "backup_now" }, function () {
        return { msg: "✓ Copia de seguridad guardada (además de la copia automática de cada noche)." };
      });
    },
    copy: function (b) { copyText(b.getAttribute("data-url")); },
    approve: function (b) {
      var p = findProject(b.getAttribute("data-row"));
      runAction(b, { action: "approve_proposal", row: Number(b.getAttribute("data-row")) }, function (res) {
        return { msg: "✓ Avance aprobado: «" + (p ? p.name : "") + "» en la Etapa " + res.stage + "/6." };
      });
    },
    advance: function (b) { setStage(b, Number(b.getAttribute("data-stage")), findProject(b.getAttribute("data-row"))); },
    "delete-project": function (b) {
      var p = findProject(b.getAttribute("data-row"));
      if (!p) return;
      confirmCard(b, "¿Eliminar el proyecto «" + p.name + "»? Desaparece del panel; queda una copia en el historial de cambios.", "Sí, eliminar", function (cb) {
        runAction(cb, { action: "delete_project", row: p.row }, function () { return { msg: "✓ Proyecto eliminado." }; });
      });
    },
    "delete-request": function (b) {
      var r = findRequest(b.getAttribute("data-id"));
      if (!r) return;
      confirmCard(b, "¿Descartar la solicitud de " + (r.clientName || r.clientEmail) + "? Desaparece del panel; queda una copia en el historial de cambios.", "Sí, descartar", function (cb) {
        runAction(cb, { action: "delete_request", requestId: r.id }, function () { return { msg: "✓ Solicitud descartada." }; });
      });
    },
    "delete-app": function (b) {
      var id = b.getAttribute("data-id");
      confirmCard(b, "¿Descartar la postulación " + id + "? Desaparece del panel; queda una copia en el historial de cambios.", "Sí, descartar", function (cb) {
        runAction(cb, { action: "delete_partner_application", applicationId: id }, function () { return { msg: "✓ Postulación descartada." }; });
      });
    },
    logout: function () {
      if (ops.via === "session") api({ action: "admin_logout" }).catch(function () {}); // ends the session on the server too
      signOut("");
    }
  };

  function focusForm() {
    setTimeout(function () {
      var f = document.querySelector("#bdv-ops-body .bdv-ops-form:not(.is-inline)");
      if (!f) return;
      f.scrollIntoView({ behavior: "smooth", block: "center" });
      var first = f.querySelector("input:not([type=checkbox]), textarea");
      if (first) first.focus();
    }, 30);
  }

  function applyAdminPanel() {
    if (document.getElementById("bdv-admin-modal-root")) return;
    var root = document.createElement("div");
    root.id = "bdv-admin-modal-root";
    root.className = "bdv-modal-overlay";
    root.style.display = "none";
    root.innerHTML = [
      '<div class="bdv-ops-card-shell" role="dialog" aria-modal="true" aria-labelledby="bdv-ops-title">',
      '  <div class="bdv-modal-top">',
      '    <h3 id="bdv-ops-title">⚙ Panel BDV <span id="bdv-ops-role" class="bdv-ops-role"></span></h3>',
      '    <button type="button" id="bdv-ops-close" class="bdv-modal-close" aria-label="Cerrar">✕</button>',
      "  </div>",
      '  <div id="bdv-ops-auth" class="bdv-ops-auth">',
      '    <form id="bdv-ops-login" class="bdv-ops-form" data-step="login">',
      '      <label class="bdv-ops-field"><span>' + esc(tr("opsLoginEmail")) + "</span>",
      '        <input type="email" name="email" id="bdv-ops-email" class="bdv-tracker-input" autocomplete="username" autocapitalize="off" spellcheck="false" required /></label>',
      '      <label class="bdv-ops-field"><span>' + esc(tr("opsLoginPassword")) + "</span>",
      '        <input type="password" name="password" id="bdv-ops-password" class="bdv-tracker-input" autocomplete="current-password" required /></label>',
      '      <div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">' + esc(tr("opsLoginSubmit")) + "</button></div>",
      '      <button type="button" class="bdv-link-btn bdv-ops-auth-link" data-auth="key">' + esc(tr("opsLoginUseKey")) + "</button>",
      "    </form>",
      '    <div class="bdv-ops-form" data-step="method" hidden>',
      "      <h5>" + esc(tr("opsMethodTitle")) + "</h5>",
      '      <button type="button" class="bdv-ops-choice" data-auth="totp"><strong>📱 ' + esc(tr("opsMethodTotp")) + "</strong><span>" + esc(tr("opsMethodTotpSub")) + "</span></button>",
      '      <button type="button" class="bdv-ops-choice" data-auth="email"><strong>✉️ ' + esc(tr("opsMethodEmail")) + '</strong><span id="bdv-ops-email-hint"></span></button>',
      '      <button type="button" class="bdv-link-btn bdv-ops-auth-link" data-auth="recovery">' + esc(tr("opsMethodRecovery")) + "</button>",
      '      <button type="button" class="bdv-link-btn bdv-ops-auth-link" data-auth="restart">' + esc(tr("opsStartOver")) + "</button>",
      "    </div>",
      '    <form id="bdv-ops-code" class="bdv-ops-form" data-step="code" hidden>',
      '      <label class="bdv-ops-field"><span id="bdv-ops-code-label"></span>',
      '        <input type="text" name="code" id="bdv-ops-code-input" class="bdv-tracker-input bdv-ops-code-input" spellcheck="false" required /></label>',
      '      <div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">' + esc(tr("opsCodeSubmit")) + "</button>",
      '        <button type="button" id="bdv-ops-resend" class="bdv-ops-btn is-ghost" data-auth="resend">' + esc(tr("opsCodeResend")) + "</button></div>",
      '      <button type="button" class="bdv-link-btn bdv-ops-auth-link" data-auth="method">' + esc(tr("opsCodeOther")) + "</button>",
      "    </form>",
      '    <form id="bdv-ops-keyform" class="bdv-ops-form" data-step="key" hidden>',
      '      <label class="bdv-ops-field"><span>' + esc(tr("opsKeyLabel")) + "</span>",
      '        <input type="password" id="bdv-ops-pass" class="bdv-tracker-input" autocomplete="current-password" required /></label>',
      '      <div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">' + esc(tr("opsLoginSubmit")) + "</button></div>",
      '      <button type="button" class="bdv-link-btn bdv-ops-auth-link" data-auth="login">' + esc(tr("opsLoginUseEmail")) + "</button>",
      "    </form>",
      '    <p id="bdv-ops-auth-msg" class="bdv-ops-error" role="alert" hidden></p>',
      '    <p id="bdv-ops-auth-info" class="bdv-ops-auth-info" role="status" hidden></p>',
      "  </div>",
      '  <div id="bdv-ops-dash" hidden>',
      '    <div class="bdv-ops-toolbar">',
      '      <button type="button" id="bdv-ops-new-btn" class="bdv-ops-btn is-primary" data-act="new-project">+ Nuevo proyecto</button>',
      '      <button type="button" id="bdv-ops-webcheck-btn" class="bdv-ops-btn is-ghost" data-act="web-check" title="Revisa sitio, pagos, correo, datos y seguridad, y genera un PDF">🩺 Web Check</button>',
      '      <span id="bdv-ops-updated" class="bdv-ops-muted"></span>',
      '      <details class="bdv-ops-menu"><summary aria-label="Opciones de la cuenta">⋯</summary><div class="bdv-ops-menu-pop">',
      '        <button type="button" id="bdv-ops-access-btn" class="bdv-ops-btn is-ghost" data-act="open-login-setup" title="Entrar con correo, contraseña y código de verificación">🔐 Acceso y verificación</button>',
      '        <button type="button" id="bdv-ops-backup-btn" class="bdv-ops-btn is-ghost" data-act="backup-now" title="Guarda ahora una copia de todos los datos (también se hace sola cada noche)">💾 Copia de seguridad ahora</button>',
      '        <button type="button" class="bdv-ops-btn is-ghost" data-act="logout">Salir</button>',
      "      </div></details>",
      "    </div>",
      '    <div id="bdv-ops-toast" class="bdv-ops-toast" role="status" aria-live="polite" hidden></div>',
      '    <div id="bdv-ops-body"></div>',
      "  </div>",
      "</div>"
    ].join("");
    document.body.appendChild(root);

    document.getElementById("bdv-ops-close").addEventListener("click", closeAdminModal);
    root.addEventListener("click", function (e) {
      if (e.target === root) return closeAdminModal();
      var a = e.target.closest ? e.target.closest("[data-auth]") : null;
      if (a && authHandlers[a.getAttribute("data-auth")]) {
        e.preventDefault();
        return authHandlers[a.getAttribute("data-auth")](a);
      }
      var b = e.target.closest ? e.target.closest("[data-act]") : null;
      if (b && clickHandlers[b.getAttribute("data-act")]) {
        e.preventDefault();
        var menu = b.closest(".bdv-ops-menu");
        if (menu) menu.open = false; // a choice in the ⋯ menu closes it
        clickHandlers[b.getAttribute("data-act")](b);
      }
    });
    root.addEventListener("change", function (e) {
      if ((e.target.name === "type" || e.target.name === "paymentType") && e.target.form && e.target.form.amountUsd) {
        var opt = e.target.selectedOptions[0];
        var amount = e.target.form.amountUsd;
        amount.value = opt.getAttribute("data-amount") || "";
        amount.readOnly = Boolean(opt.getAttribute("data-fixed"));
        if (opt.getAttribute("data-max")) amount.max = opt.getAttribute("data-max"); else amount.removeAttribute("max");
      }
      if (e.target.name === "withSow") {
        var form = e.target.form;
        form.querySelector(".bdv-ops-sow-fields").hidden = !e.target.checked;
        Array.prototype.forEach.call(form.querySelectorAll(".bdv-ops-sow-fields [required], .bdv-ops-sow-fields [data-required]"), function (el) {
          el.required = e.target.checked;
          el.setAttribute("data-required", "1");
        });
        form.querySelector('[type="submit"]').textContent = e.target.checked ? "Crear proyecto y enviar SOW" : "Crear proyecto";
      }
    });
    root.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = e.target.querySelector('[type="submit"]');
      if (e.target.id === "bdv-ops-login") return submitLogin(e.target, submitBtn);
      if (e.target.id === "bdv-ops-code") return submitCode(e.target, submitBtn);
      if (e.target.id === "bdv-ops-keyform") return submitKey();
      var kind = e.target.getAttribute("data-form");
      if (formHandlers[kind]) formHandlers[kind](e.target, submitBtn);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.style.display !== "none") closeAdminModal();
    });
  }

  function openAdminModal() {
    applyAdminPanel();
    var root = document.getElementById("bdv-admin-modal-root");
    root.style.setProperty("display", "flex", "important");
    startAutoRefresh();
    var saved = ops.token ? null : storedSession(); // a session of this tab survives a reload
    if (saved) {
      ops.token = saved.token;
      ops.via = "session";
    }
    if (ops.token) {
      showView("dash");
      loadData();
    } else if (ops.auth.challenge) {
      showView("auth"); // closed in the middle of a sign-in: continue where it was
      showAuthStep(ops.auth.step);
    } else {
      signOut("");
    }
  }

  // Closing keeps you signed in for this page; open forms are dropped.
  function closeAdminModal() {
    var root = document.getElementById("bdv-admin-modal-root");
    if (!root) return;
    root.style.setProperty("display", "none", "important");
    ops.form = null;
    var c = document.getElementById("bdv-ops-confirm");
    if (c) c.remove();
  }

  var ADMIN_HASH = "#bdv-ops";

  function clearAdminHash() {
    if (window.location.hash === ADMIN_HASH && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.href.split("#")[0]);
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
    openTracker: function () {
      var m = document.getElementById("bdv-tracker-modal-root");
      if (m) m.style.display = "flex";
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
