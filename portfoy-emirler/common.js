/* Shared engine for every cloned screen.
 *
 * Each screen ships its own copy of this file plus a `screen.js` that defines
 * window.SCREEN. Nothing here is screen-specific, so a fix made here can be
 * copied out to all of them.
 */
(function () {
  "use strict";

  var C = window.SCREEN;
  var KEY = "clone_" + C.slug + "_v1";
  var LOCALE = C.locale || "tr-TR";

  // ---------- state ----------
  function defaults() {
    var d = {};
    C.fields.forEach(function (f) { d[f.id] = f.def; });
    Object.keys(C.seed || {}).forEach(function (k) { d[k] = C.seed[k]; });
    return d;
  }

  function randomBattery(base) {
    // Vary the shown charge a little on each visit so repeated screenshots
    // don't all carry an identical status bar. Never persisted, and kept to two
    // digits so it still fits inside the battery glyph.
    var v = base + Math.round(Math.random() * 31) - 15;
    return Math.max(5, Math.min(99, v));
  }

  function load() {
    var base = defaults();
    var savedTs = 0;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        savedTs = (saved && saved.ts) || 0;
        // Merge rather than replace: a field added later must not be masked by
        // stale cached data from an earlier version of the page.
        if (saved && typeof saved === "object") {
          Object.keys(base).forEach(function (k) {
            if (k in saved) base[k] = saved[k];
          });
        }
      }
    } catch (e) {}
    // A price set on the launcher applies to every screen, unless this screen
    // was edited more recently than the launcher setting was written.
    if (window.GLOBAL_PRICE && "fiyat" in base) {
      var g = window.GLOBAL_PRICE.priceFor(savedTs);
      if (g !== null) {
        base.fiyat = g;
        if (C.derive) {
          var d = C.derive(base);
          Object.keys(d).forEach(function (k) { base[k] = d[k]; });
        }
      }
    }
    if (C.battery != null) base.battery = randomBattery(C.battery);
    return base;
  }

  var state = load();

  // ---------- formatting ----------
  function num(n, dec) {
    return Number(n || 0).toLocaleString(LOCALE, {
      minimumFractionDigits: dec, maximumFractionDigits: dec
    });
  }
  function signed(n, dec, opts) {
    opts = opts || {};
    var s = n < 0 ? "-" : (opts.plus === false ? "" : "+");
    return s + (opts.space ? " " : "") + num(Math.abs(n), dec);
  }
  function toLocal(v) { return String(v).replace(".", ","); }
  function fromLocal(s) {
    var v = parseFloat(String(s).replace(/\./g, "").replace(",", "."));
    return isNaN(v) ? 0 : v;
  }

  var API = { num: num, signed: signed, state: function () { return state; } };

  // ---------- render ----------
  function render() {
    C.overlays.forEach(function (o) {
      var el = document.getElementById("ov_" + o.id);
      if (!el) return;
      var out = o.get(state, API);
      if (out && typeof out === "object") {           // {html, color}
        if ("html" in out) el.innerHTML = out.html;
        else el.textContent = out.text;
        if (out.color) el.style.color = out.color;
      } else {
        el.textContent = out;
      }
    });
  }

  // ---------- edit overlay ----------
  function buildForm() {
    var wrap = document.getElementById("editFields");
    wrap.innerHTML = "";
    C.fields.forEach(function (f) {
      var row = document.createElement("div");
      row.className = "field-row";
      row.innerHTML =
        '<span class="field-label">' + f.label + "</span>" +
        '<input class="field-input" type="text" inputmode="decimal" id="in_' + f.id + '">';
      wrap.appendChild(row);
    });
  }

  function fillForm() {
    C.fields.forEach(function (f) {
      var v = state[f.id];
      document.getElementById("in_" + f.id).value =
        (f.raw || f.text) ? v : toLocal(v);
    });
  }

  function readForm() {
    C.fields.forEach(function (f) {
      var v = document.getElementById("in_" + f.id).value;
      state[f.id] = f.raw  ? String(v).trim()
                  : f.text ? String(v).trim().toUpperCase().slice(0, f.max || 10)
                           : fromLocal(v);
    });
    // Derived values are seeded from the source screenshot so the first render
    // matches it exactly; once the user edits, they follow the inputs instead.
    if (C.derive) {
      var d = C.derive(state);
      Object.keys(d).forEach(function (k) { state[k] = d[k]; });
    }
  }

  function showEdit(on) {
    document.getElementById("screen-edit").classList.toggle("hidden", !on);
  }

  // ---------- scale the fixed canvas to the viewport ----------
  var W = C.canvas[0], H = C.canvas[1];
  function fit() {
    var vw = (window.visualViewport ? window.visualViewport.width : window.innerWidth);
    var vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
    document.getElementById("phone").style.transform =
      "scale(" + Math.min(vw / W, vh / H) + ")";
  }

  // ---------- wire up ----------
  document.addEventListener("DOMContentLoaded", function () {
    var phone = document.getElementById("phone");
    phone.style.width = W + "px";
    phone.style.height = H + "px";
    document.getElementById("bg").style.width = W + "px";
    document.getElementById("bg").style.height = H + "px";
    var eo = document.getElementById("screen-edit");
    eo.style.width = W + "px";
    eo.style.height = H + "px";

    // Position each overlay from the measured ink band and centre the glyphs in
    // it, so the text sits where the original did without guessing font metrics.
    C.overlays.forEach(function (o) {
      var el = document.createElement("div");
      el.id = "ov_" + o.id;
      el.className = "ov" + (o.cls ? " " + o.cls : "");
      el.style.top = o.top + "px";
      el.style.height = (o.h || 30) + "px";
      if (o.right !== undefined) { el.style.right = o.right + "px"; el.style.justifyContent = "flex-end"; }
      if (o.left !== undefined) { el.style.left = o.left + "px"; el.style.justifyContent = "flex-start"; }
      // cx centres the run on a fixed x, for values the source centres in a
      // table cell rather than aligning to an edge.
      if (o.cx !== undefined) {
        el.style.left = o.cx + "px";
        el.style.transform = "translateX(-50%)";
        el.style.justifyContent = "center";
      }
      el.style.fontSize = o.size + "px";
      el.style.fontWeight = o.weight || 600;
      if (o.color) el.style.color = o.color;
      if (o.ls) el.style.letterSpacing = o.ls;
      if (o.font) el.style.fontFamily = o.font;
      // Some values sit inside a tinted pill. Redrawing the pill (rather than
      // part-erasing it) keeps its rounded corners crisp.
      if (o.w) { el.style.width = o.w + "px"; el.style.justifyContent = o.align || "center"; }
      if (o.bg) el.style.background = o.bg;
      if (o.radius) el.style.borderRadius = o.radius + "px";
      phone.appendChild(el);
    });

    buildForm();
    render();
    fit();

    document.getElementById("btnEdit").addEventListener("click", function () {
      fillForm(); showEdit(true);
    });
    document.getElementById("btnCancel").addEventListener("click", function () {
      showEdit(false);
    });
    document.getElementById("btnSave").addEventListener("click", function () {
      readForm();
      var keep = state.battery;            // randomised per visit, not saved
      delete state.battery;
      // Stamped so a later launcher setting can be told apart from this edit.
      state.ts = window.GLOBAL_PRICE ? window.GLOBAL_PRICE.stamp() : Date.now();
      localStorage.setItem(KEY, JSON.stringify(state));
      if (keep != null) state.battery = keep;
      render();
      showEdit(false);
    });
    var home = document.getElementById("btnHome");
    if (home) home.addEventListener("click", function () { location.href = "../index.html"; });

    ["resize", "orientationchange"].forEach(function (e) { window.addEventListener(e, fit); });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", fit);
  });
})();
