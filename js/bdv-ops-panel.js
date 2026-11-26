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
            '<p style="font-size: 0.8rem; color: #e8c861; margin: 6px 0;"><strong>' + core.escapeHtml(tr("trkPayment")) + "</strong> " + core.escapeHtml(matched.paymentStatus) + "</p>" +
            '<div class="bdv-progress-track" style="margin-top: 8px;"><div class="bdv-progress-fill" style="width: ' + stObj.percentage + '%;"></div></div>';
        })
        .catch(function () {
          msg(tr("trkNetErr"), "#f87171");
        });
    });
  }

  // =====================================================================================
  // Admin / partner panel (#bdv-ops). One guided card per incoming request and per project:
  // each card shows where it stands and only the next valid action. Every action posts once
  // (its button is locked while it runs), then the panel reloads by itself. The key lives only
  // in memory while this page is open; closing the panel does not sign you out, "Salir" does.
  // =====================================================================================
  var ops = {
    key: "",
    role: "",
    data: null,      // last GET ?key= payload, normalised by normaliseData()
    form: null,      // the one inline form that is open: { kind, id }
    payLinks: {},    // project row -> Stripe link created in this session
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
    return "$" + (Number(n) || 0).toLocaleString("en-US") + " USD";
  }
  function stageInfo(n) {
    var list = getCore().workflowStages;
    return list[(Number(n) || 1) - 1] || list[0];
  }
  function isPaidStatus(s) {
    return /PAGADO|PAID/i.test(String(s || ""));
  }
  function paymentLabel(s) {
    if (!s || s === "PENDING") return "Sin pagos todavía";
    if (s === "SOW_SIGNED_DEPOSIT_DUE") return "Depósito pendiente";
    return s;
  }
  function sowUrlOf(sowId) {
    return "https://batistadigitalventures.com/?sow=" + encodeURIComponent(sowId);
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
      otherSows: sows.filter(function (w) { return currentIds.indexOf(w.sowId) === -1; })
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ key: ops.key }, payload))
    }).then(function (r) {
      return r.json().catch(function () { return { ok: false, error: "Respuesta inválida del servidor (" + r.status + ")." }; })
        .then(function (json) {
          if (r.status === 401) signOut("Tu sesión ya no es válida. Vuelve a entrar con tu clave.");
          return json;
        });
    });
  }

  // Runs one panel action: locks its button (no double posts), shows the result and reloads.
  function runAction(btn, payload, onOk) {
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
        ops.form = null;
        toast(out.msg, out.ok !== false);
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
    if (!ops.key) return;
    if (ops.loading) {
      ops.reloadAgain = true; // an action finished while a load was running: load once more afterwards
      return;
    }
    ops.loading = true;
    fetch(core.apiUrl, { headers: { Authorization: "Bearer " + ops.key } })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) {
          signOut("Clave no válida o sin permiso.");
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
    if (!root || root.style.display === "none" || !ops.key || ops.form || ops.inFlight) return false;
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

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { toast("✓ Enlace copiado: " + text, true); },
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
        (o.required ? " required" : "") + (o.type === "number" ? ' min="1" step="any" inputmode="decimal"' : "") +
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
    ops.key = "";
    ops.role = "";
    ops.data = null;
    ops.form = null;
    ops.payLinks = {};
    var pass = document.getElementById("bdv-ops-pass");
    if (pass) pass.value = "";
    var msg = document.getElementById("bdv-ops-auth-msg");
    if (msg) {
      msg.hidden = !message;
      msg.textContent = message || "";
    }
    showView("auth");
  }

  function render() {
    var d = ops.data;
    var body = document.getElementById("bdv-ops-body");
    if (!d || !body) return;
    var isAdmin = ops.role === "admin";
    document.getElementById("bdv-ops-role").textContent = isAdmin ? "Administrador" : "Programador partner";
    document.getElementById("bdv-ops-new-btn").hidden = !isAdmin;
    document.getElementById("bdv-ops-updated").textContent =
      "Actualizado " + ops.loadedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + " · se actualiza solo";

    var html = [];
    if (isAdmin) {
      html.push(renderTodo(d));
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
    }
    body.innerHTML = html.join("");
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
  function bdvSignatureFields() {
    return '<div class="bdv-ops-sign-block"><div class="bdv-ops-sign-title">Tu firma (Batista Digital Ventures LLC firma primero)</div>' +
      field("bdvSignerName", "Tu nombre", OWNER_SIGNER.name, { required: true, half: true }) +
      field("bdvSignerTitle", "Tu cargo", OWNER_SIGNER.title, { required: true, half: true }) +
      '<label class="bdv-ops-check"><input type="checkbox" name="bdvConsent" required /> <span>Firmo electrónicamente este SOW en nombre de Batista Digital Ventures LLC (E-SIGN / UETA). Al enviarlo, el cliente solo tiene que firmar para cerrarlo.</span></label></div>';
  }
  function bdvSignatureOf(v) {
    return { signerName: v.bdvSignerName, signerTitle: v.bdvSignerTitle, consentAccepted: v.bdvConsent === true };
  }
  function bdvSignatureError(v) {
    return v.bdvSignerName && v.bdvSignerTitle && v.bdvConsent ? "" : "Escribe tu nombre y cargo y marca la casilla para firmar el SOW.";
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
      field("code", "PIN del cliente (opcional)", "", { placeholder: "Se genera solo", half: true }) +
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
      "<span>Etapa " + st.stage + "/6 · " + esc(st.name_es) + (isAdmin ? " · " + esc(paymentLabel(p.paymentStatus)) : "") + "</span></div>";
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
    var paid = isPaidStatus(p.paymentStatus) || (w && isPaidStatus(w.paymentStatus));
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
      actions.push(btn("copy", "Copiar enlace del SOW", "is-ghost", dataAttr("url", sowUrlOf(w.sowId))));
      if (form !== "sow") actions.push(btn("open-sow", "Corregir y reenviar SOW", "is-ghost", dataAttr("row", row)));
    } else if (w && !paid && stage <= 2) {
      status = "SOW firmado por ambas partes. Esperando el depósito de " + money(w.depositAmount) + " (el cliente paga desde el enlace del SOW; al pagarlo, el proyecto pasa solo a la Etapa 3).";
      actions.push(btn("copy", "Copiar enlace para pagar", "is-ghost", dataAttr("url", sowUrlOf(w.sowId))));
    } else if (stage < 5) {
      var next = stageInfo(stage + 1);
      status = paid ? "Pago registrado: " + paymentLabel(p.paymentStatus) + "." : "Proyecto en curso.";
      actions.push(btn("advance", "Avanzar a Etapa " + next.stage + ": " + next.name_es, "is-primary", dataAttr("row", row) + dataAttr("stage", next.stage)));
      if (form !== "pay") actions.push(btn("open-pay", "💳 Cobrar un hito", "is-ghost", dataAttr("row", row)));
    } else {
      status = "En revisión del cliente. Para cerrar, cobra la liquidación final (al pagarla, el proyecto pasa solo a la Etapa 6).";
      if (form !== "pay") actions.push(btn("open-pay", "💳 Cobrar liquidación final", "is-primary", dataAttr("row", row)));
      actions.push(btn("advance", "Cerrar sin cobro (Etapa 6)", "is-ghost", dataAttr("row", row) + dataAttr("stage", 6)));
    }

    var formHtml = form === "sow" ? sowForm(p, w) : form === "pay" ? payForm(p) : "";
    var link = ops.payLinks[row];
    var linkHtml = link
      ? '<div class="bdv-ops-link">Enlace de pago: <a href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + esc(link.slice(0, 48)) + "…</a> " +
        btn("copy", "Copiar", "is-ghost is-small", dataAttr("url", link)) + "</div>"
      : "";
    return '<p class="bdv-ops-status">' + esc(status) + "</p>" + formHtml + linkHtml +
      (actions.length ? '<div class="bdv-ops-actions">' + actions.join("") + "</div>" : "") +
      moreOptions(p, w);
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

  function payForm(p) {
    var finalDue = Number(p.stage) >= 5;
    return '<form class="bdv-ops-form is-inline" data-form="pay"' + dataAttr("row", p.row) + ">" +
      field("amountUsd", "Monto a cobrar (USD)", "", { type: "number", required: true, half: true }) +
      '<label class="bdv-ops-field is-half"><span>Tipo de cobro</span><select name="paymentType" class="bdv-tracker-input">' +
      '<option value="milestone"' + (finalDue ? "" : " selected") + ">Hito intermedio</option>" +
      '<option value="final_settlement"' + (finalDue ? " selected" : "") + ">Liquidación final (cierra en Etapa 6)</option></select></label>" +
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
      field("code", "PIN del cliente para ver su avance", p.code, { required: true }) +
      '<div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-ghost">Guardar PIN</button></div></form>' +
      (w && w.status === "SIGNED" ? '<div class="bdv-ops-actions">' + btn("open-sow", "Emitir otro SOW (orden de cambio)", "is-ghost", dataAttr("row", p.row)) + "</div>" : "") +
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
      '<div class="bdv-ops-actions"><a class="bdv-ops-btn is-ghost is-small" href="' + esc(sowUrlOf(w.sowId)) + '" target="_blank" rel="noopener noreferrer">Ver</a></div></div></div>';
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
      if (!window.BDV_SOW || typeof window.BDV_SOW.createCheckoutLink !== "function") return toast("El módulo de pagos no está disponible; recarga la página.", false);
      var w = ops.data.currentSow[p.row];
      var isFinal = v.paymentType === "final_settlement";
      var label = submitBtn.textContent;
      if (submitBtn.disabled) return;
      submitBtn.disabled = true;
      submitBtn.textContent = "Creando enlace…";
      ops.inFlight++;
      window.BDV_SOW.createCheckoutLink({
        authKey: ops.key,
        sowId: w ? w.sowId : "",
        clientEmail: p.email,
        clientName: p.clientName || (w && w.clientName) || "",
        businessName: getCore().getProjectDisplayName(p, "es"),
        amountUsd: amount,
        paymentType: isFinal ? "final_settlement" : "milestone",
        targetStage: isFinal ? 6 : Number(p.stage) || 3,
        itemTitle: (isFinal ? "Liquidación 100%" : "Hito de Proyecto") + " — " + getCore().getProjectDisplayName(p, "es"),
        returnBaseUrl: "https://batistadigitalventures.com/"
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
    stage: function (form, submitBtn) {
      setStage(submitBtn, Number(formValues(form).stage), findProject(form.getAttribute("data-row")));
    },
    pin: function (form, submitBtn) {
      var code = formValues(form).code.toUpperCase();
      if (code.length < 4) return toast("El PIN debe tener al menos 4 caracteres.", false);
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
    },
    key: function (form, submitBtn) {
      var newPass = formValues(form).newPassword;
      if (newPass.length < 6) return toast("La nueva clave debe tener al menos 6 caracteres.", false);
      runAction(submitBtn, { action: "change_my_password", newPassword: newPass }, function () {
        ops.key = newPass;
        form.reset();
        return { msg: "✓ Clave actualizada. Úsala la próxima vez que entres." };
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
      confirmCard(button, "¿Cerrar «" + p.name + "» en la Etapa 6? El cliente ya no podrá consultar su avance con el PIN.", "Sí, cerrar proyecto", go);
    } else {
      go(button);
    }
  }

  var clickHandlers = {
    "open-project-form": function (b) { ops.form = { kind: "project", id: b.getAttribute("data-id") }; render(); },
    "new-project": function () { ops.form = { kind: "project", id: "" }; render(); focusForm(); },
    "open-sow": function (b) { ops.form = { kind: "sow", id: b.getAttribute("data-row") }; render(); focusForm(); },
    "open-pay": function (b) { ops.form = { kind: "pay", id: b.getAttribute("data-row") }; render(); focusForm(); },
    "cancel-form": function () { ops.form = null; render(); },
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
      confirmCard(b, "¿Eliminar el proyecto «" + p.name + "» de forma permanente? No se puede deshacer.", "Sí, eliminar", function (cb) {
        runAction(cb, { action: "delete_project", row: p.row }, function () { return { msg: "✓ Proyecto eliminado." }; });
      });
    },
    "delete-request": function (b) {
      var r = findRequest(b.getAttribute("data-id"));
      if (!r) return;
      confirmCard(b, "¿Descartar la solicitud de " + (r.clientName || r.clientEmail) + "? Se borra de forma permanente.", "Sí, descartar", function (cb) {
        runAction(cb, { action: "delete_request", requestId: r.id }, function () { return { msg: "✓ Solicitud descartada." }; });
      });
    },
    "delete-app": function (b) {
      var id = b.getAttribute("data-id");
      confirmCard(b, "¿Descartar la postulación " + id + "? Se borra de forma permanente.", "Sí, descartar", function (cb) {
        runAction(cb, { action: "delete_partner_application", applicationId: id }, function () { return { msg: "✓ Postulación descartada." }; });
      });
    },
    logout: function () { signOut(""); }
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

  function signIn() {
    var pass = (document.getElementById("bdv-ops-pass").value || "").trim();
    var msg = document.getElementById("bdv-ops-auth-msg");
    if (!pass) {
      msg.hidden = false;
      msg.textContent = "Ingresa tu clave de acceso.";
      return;
    }
    msg.hidden = true;
    ops.key = pass;
    loadData();
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
      '  <form id="bdv-ops-auth" class="bdv-ops-form">',
      '    <label class="bdv-ops-field"><span>Clave de acceso (administrador o programador)</span>',
      '      <input type="password" id="bdv-ops-pass" class="bdv-tracker-input" autocomplete="current-password" required /></label>',
      '    <div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-primary">Entrar</button></div>',
      '    <p id="bdv-ops-auth-msg" class="bdv-ops-error" role="alert" hidden></p>',
      "  </form>",
      '  <div id="bdv-ops-dash" hidden>',
      '    <div class="bdv-ops-toolbar">',
      '      <button type="button" id="bdv-ops-new-btn" class="bdv-ops-btn is-primary" data-act="new-project">+ Nuevo proyecto</button>',
      '      <span id="bdv-ops-updated" class="bdv-ops-muted"></span>',
      '      <details class="bdv-ops-menu"><summary aria-label="Opciones de la cuenta">⋯</summary><div class="bdv-ops-menu-pop">',
      '        <form class="bdv-ops-form is-inline" data-form="key"><label class="bdv-ops-field"><span>Nueva clave para este rol</span>',
      '          <input type="password" name="newPassword" class="bdv-tracker-input" autocomplete="new-password" minlength="6" required /></label>',
      '          <div class="bdv-ops-actions"><button type="submit" class="bdv-ops-btn is-ghost">Cambiar clave</button></div></form>',
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
      var b = e.target.closest ? e.target.closest("[data-act]") : null;
      if (b && clickHandlers[b.getAttribute("data-act")]) {
        e.preventDefault();
        clickHandlers[b.getAttribute("data-act")](b);
      }
    });
    root.addEventListener("change", function (e) {
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
      if (e.target.id === "bdv-ops-auth") return signIn();
      var kind = e.target.getAttribute("data-form");
      if (formHandlers[kind]) formHandlers[kind](e.target, e.target.querySelector('[type="submit"]'));
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
    if (ops.key) {
      showView("dash");
      loadData();
    } else {
      signOut("");
      setTimeout(function () { document.getElementById("bdv-ops-pass").focus(); }, 60);
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
