/* Batista Digital Ventures - Accessibility layer for modals and form fields (phase 1)
 *
 * Works on top of the existing scripts without changing how they open or close things:
 *  - Every .bdv-modal-overlay gets role="dialog", aria-modal="true" and aria-labelledby.
 *  - When a modal becomes visible, focus moves into it; Tab / Shift+Tab stay inside it;
 *    when it closes, focus returns to the element that opened it.
 *  - Escape closes the top-most open modal by clicking its own close button, so each
 *    script's normal close logic runs (e.g. the admin panel still clears its session key).
 *  - Inputs / textareas / selects without a label get a real, visually hidden <label>
 *    whose text follows the field's placeholder.
 */
(function () {
  var OVERLAY_SELECTOR = ".bdv-modal-overlay";
  var CLOSE_SELECTOR = ".bdv-modal-close, #bdv-exec-confirm-close";
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  var openState = new WeakMap(); // overlay -> { opener: Element|null }
  var idCounter = 0;

  function isEs() {
    return (document.documentElement.getAttribute("lang") || "es").toLowerCase().indexOf("en") !== 0;
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    return window.getComputedStyle(el).display !== "none";
  }

  function ensureId(el, prefix) {
    if (!el.id) {
      idCounter += 1;
      el.id = prefix + "-" + idCounter;
    }
    return el.id;
  }

  function focusablesIn(root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function decorateOverlay(overlay) {
    if (overlay.getAttribute("role") !== "dialog") overlay.setAttribute("role", "dialog");
    if (overlay.getAttribute("aria-modal") !== "true") overlay.setAttribute("aria-modal", "true");
    var heading = overlay.querySelector("h1, h2, h3, h4");
    if (heading) {
      var hid = ensureId(heading, "bdv-dialog-title");
      if (overlay.getAttribute("aria-labelledby") !== hid) overlay.setAttribute("aria-labelledby", hid);
    }
    var closeLabel = isEs() ? "Cerrar" : "Close";
    overlay.querySelectorAll(".bdv-modal-close").forEach(function (btn) {
      if (btn.getAttribute("aria-label") !== closeLabel) btn.setAttribute("aria-label", closeLabel);
    });
  }

  function hasLabel(field) {
    if (field.getAttribute("aria-label") || field.getAttribute("aria-labelledby")) return true;
    if (field.closest("label")) return true;
    if (field.id) {
      var lbl = document.querySelector('label[for="' + field.id + '"]');
      if (lbl && !lbl.hasAttribute("data-bdv-auto-label")) return true;
    }
    return false;
  }

  function labelFields(root) {
    var fields = (root || document).querySelectorAll("input, textarea, select");
    fields.forEach(function (field) {
      var type = (field.getAttribute("type") || "").toLowerCase();
      if (type === "hidden" || type === "submit" || type === "button" || type === "checkbox" || type === "radio") return;
      if (hasLabel(field)) return;
      var text = (field.getAttribute("placeholder") || field.getAttribute("name") || "").trim();
      if (!text) return;
      var id = ensureId(field, "bdv-field");
      var auto = document.querySelector('label[for="' + id + '"][data-bdv-auto-label]');
      if (!auto) {
        auto = document.createElement("label");
        auto.className = "bdv-sr-only";
        auto.setAttribute("for", id);
        auto.setAttribute("data-bdv-auto-label", "");
        field.parentNode.insertBefore(auto, field);
      }
      if (auto.textContent !== text) auto.textContent = text;
    });
  }

  function onOpened(overlay) {
    var active = document.activeElement;
    openState.set(overlay, { opener: active && !overlay.contains(active) ? active : null });
    setTimeout(function () {
      if (!isVisible(overlay) || overlay.contains(document.activeElement)) return;
      var items = focusablesIn(overlay);
      var target =
        items.filter(function (el) {
          return /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
        })[0] ||
        items.filter(function (el) {
          return !el.matches(CLOSE_SELECTOR);
        })[0] ||
        items[0];
      if (target) {
        target.focus({ preventScroll: true });
      } else {
        overlay.setAttribute("tabindex", "-1");
        overlay.focus({ preventScroll: true });
      }
    }, 80);
  }

  function onClosed(overlay) {
    var state = openState.get(overlay);
    openState.delete(overlay);
    if (!state) return;
    var stillOpen = topOverlay();
    if (stillOpen) return; // another modal took over (e.g. form -> confirmation)
    var opener = state.opener;
    if (opener && opener.isConnected && typeof opener.focus === "function") {
      opener.focus({ preventScroll: true });
    }
  }

  function allOverlays() {
    return Array.prototype.slice.call(document.querySelectorAll(OVERLAY_SELECTOR));
  }

  function topOverlay() {
    var visible = allOverlays().filter(isVisible);
    if (!visible.length) return null;
    visible.sort(function (a, b) {
      var za = parseInt(window.getComputedStyle(a).zIndex, 10) || 0;
      var zb = parseInt(window.getComputedStyle(b).zIndex, 10) || 0;
      if (za !== zb) return za - zb;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    return visible[visible.length - 1];
  }

  function syncAll() {
    allOverlays().forEach(function (overlay) {
      decorateOverlay(overlay);
      var wasOpen = openState.has(overlay);
      var nowOpen = isVisible(overlay);
      if (nowOpen && !wasOpen) onOpened(overlay);
      if (!nowOpen && wasOpen) onClosed(overlay);
    });
    labelFields(document);
  }

  var scheduled = false;
  function scheduleSync() {
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      scheduled = false;
      syncAll();
    });
  }

  document.addEventListener("keydown", function (e) {
    var overlay = topOverlay();
    if (!overlay) return;

    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      var closeBtn = overlay.querySelector(CLOSE_SELECTOR);
      if (closeBtn) {
        closeBtn.click();
      } else {
        overlay.style.setProperty("display", "none", "important");
      }
      scheduleSync();
      return;
    }

    if (e.key === "Tab") {
      var items = focusablesIn(overlay);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;
      if (!overlay.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  function init() {
    syncAll();
    var observer = new MutationObserver(scheduleSync);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "class", "placeholder"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
