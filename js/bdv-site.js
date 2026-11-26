/* Batista Digital Ventures - Phase 2 page behavior:
 *  - single quote form (Worker action "request_services") and partner application form
 *    (Worker action "partner_application", stored separately) - same Worker endpoint
 *  - "Cotizar este servicio" buttons preselect the service type
 *  - portfolio galleries (prev / next buttons; swipe / scroll natively)
 *  - "Consultar mi proyecto" opens the read-only client viewer built by bdv-ops-panel.js
 *  - holiday offer prices: shown only before <html data-offer-end> (set by tools/site-src/build.py)
 */
(function () {
  var offerEnd = Date.parse(document.documentElement.getAttribute("data-offer-end") || "");
  document.documentElement.classList.toggle("offer-on", Date.now() < offerEnd);

  // window.BDV_CORE comes from brand-media.js, which is loaded (deferred) before this file.
  function core() {
    return window.BDV_CORE;
  }
  function lang() {
    return document.documentElement.lang === "en" ? "en" : "es";
  }
  function tr(key) {
    return window.BDV_t(key);
  }
  function optionLabel(select) {
    var opt = select && select.options[select.selectedIndex];
    return opt && opt.value ? opt.textContent.trim() : "";
  }

  function setMsg(form, text, kind) {
    var el = form.querySelector(".form-msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "form-msg" + (kind ? " is-" + kind : "");
  }

  function validate(form) {
    var ok = true;
    var first = null;
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      var valid = f.checkValidity() && !(f.required && !String(f.value || "").trim());
      f.setAttribute("aria-invalid", valid ? "false" : "true");
      if (!valid) {
        ok = false;
        if (!first) first = f;
      }
    });
    if (first) first.focus();
    return ok;
  }

  function post(form, payload, clientName, kind) {
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    setMsg(form, tr("formSending"), "pending");
    return fetch(core().apiUrl, {
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (btn) btn.disabled = false;
        if (res && res.ok) {
          setMsg(form, tr("formOk"), "ok");
          form.reset();
          prefillTimezone();
          if (core().showConfirmation) core().showConfirmation(clientName, res.id, kind);
        } else {
          setMsg(form, (res && res.error) || tr("formErr"), "error");
        }
      })
      .catch(function () {
        if (btn) btn.disabled = false;
        setMsg(form, tr("formNetErr"), "error");
      });
  }

  /* ---------- Quote form ---------- */
  var quoteForm = document.getElementById("bdv-quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(quoteForm)) {
        setMsg(quoteForm, tr("formMissing"), "error");
        return;
      }
      var g = function (id) { return (document.getElementById(id).value || "").trim(); };
      var serviceSel = document.getElementById("qf-service");
      var budgetSel = document.getElementById("qf-budget");
      var timelineSel = document.getElementById("qf-timeline");
      var serviceType = serviceSel.value;
      // Keep the exact label the Worker / admin panel already knows for the deck request.
      var serviceLabel = serviceType === "deck" ? "Deck & Venture Brief" : optionLabel(serviceSel);
      var budget = optionLabel(budgetSel);
      var timeline = optionLabel(timelineSel);
      var isEs = lang() === "es";
      var header = [
        (isEs ? "Presupuesto: " : "Budget: ") + (budget || "—"),
        (isEs ? "Plazo: " : "Timeline: ") + (timeline || "—")
      ].join(" · ");
      var notes = g("qf-notes");
      post(quoteForm, {
        action: "request_services",
        lang: lang(),
        requestType: "quote",
        clientName: g("qf-name"),
        clientEmail: g("qf-email").toLowerCase(),
        businessName: g("qf-biz"),
        services: [serviceLabel],
        serviceType: serviceType,
        budget: budgetSel.value,
        timeline: timelineSel.value,
        notes: header + (notes ? "\n\n" + notes : "")
      }, g("qf-name"), "quote");
    });
  }

  /* ---------- Partner application form ---------- */
  var partnerForm = document.getElementById("bdv-partner-form");
  function prefillTimezone() {
    var tz = document.getElementById("pf-tz");
    if (tz && !tz.value) {
      try {
        tz.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch (_) {}
    }
  }
  prefillTimezone();
  if (partnerForm) {
    partnerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(partnerForm)) {
        setMsg(partnerForm, tr("formMissing"), "error");
        return;
      }
      var g = function (id) { return (document.getElementById(id).value || "").trim(); };
      var specSel = document.getElementById("pf-specialty");
      // Dedicated Worker action (since 2026-11-25): stored apart from client requests,
      // with its own admin email and a bilingual confirmation to the applicant.
      post(partnerForm, {
        action: "partner_application",
        lang: lang(),
        name: g("pf-name"),
        email: g("pf-email").toLowerCase(),
        portfolio: g("pf-portfolio"),
        specialty: optionLabel(specSel) || specSel.value,
        timezone: g("pf-tz"),
        notes: g("pf-notes")
      }, g("pf-name"), "partner");
    });
  }

  /* ---------- CTA helpers ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="#cotizar"]');
    if (!a) return;
    var svc = a.getAttribute("data-quote-service");
    var sel = document.getElementById("qf-service");
    if (svc && sel) sel.value = svc;
    setTimeout(function () {
      var first = document.getElementById(svc ? "qf-name" : "qf-name");
      if (first) first.focus({ preventScroll: true });
    }, 450);
  });

  /* ---------- Galleries ---------- */
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    var track = g.querySelector(".gallery-track");
    var prev = g.querySelector("[data-gallery-prev]");
    var next = g.querySelector("[data-gallery-next]");
    if (!track) return;
    function step() {
      return Math.max(200, Math.round(track.clientWidth * 0.8));
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
      g.classList.toggle("is-static", max <= 0);
    }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Client progress viewer (built by bdv-ops-panel.js) ---------- */
  var trackerBtn = document.getElementById("bdv-open-tracker-btn");
  if (trackerBtn) {
    trackerBtn.addEventListener("click", function () {
      if (window.BDV_OPS) window.BDV_OPS.openTracker();
    });
  }
})();
