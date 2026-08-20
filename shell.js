/* Shared chrome for every page: corner hit areas, edit-form sizing, and a save
 * button that stays reachable when the keyboard is up.
 *
 * All three depend on the canvas scale, which each page recomputes on resize.
 * Rather than have thirty pages call in here, this reads the scale back off the
 * canvas and re-runs itself whenever anything that could change it happens.
 */
(function () {
  "use strict";

  // Rendered size we want the edit form's base text to end up at, in CSS px.
  // The canvas is scaled, so the design-pixel size has to be the inverse.
  var FORM_TARGET_PX = 15;
  // Never shrink past this to make a form fit — below it the text stops
  // being comfortable to read, and scrolling is the better trade.
  var FORM_MIN_PX = 13;

  function phone() { return document.getElementById("phone"); }

  function scaleOf(el) {
    var m = /scale\(([\d.]+)\)/.exec(el.style.transform);
    return m ? parseFloat(m[1]) : 0;
  }

  function overlays(p) {
    return [p.querySelector(".edit-overlay"), p.querySelector(".settings")]
      .filter(Boolean);
  }

  // ---------------- corner hit areas ----------------
  // Top left goes back, top right opens the edit screen — the same two gestures
  // on every screen, whatever the original app put in its corners.

  function isLauncher() { return !!document.getElementById("btnSettings"); }

  function goBack() {
    if (history.length > 1) history.back();
    else if (!isLauncher()) location.href = "../index.html";
  }

  function openEdit() {
    var b = document.getElementById("btnEdit") || document.getElementById("btnSettings");
    if (b) b.click();
  }

  function addCorners() {
    var p = phone();
    if (!p || p.querySelector(".corner-hit")) return;
    [["left", "Geri", goBack], ["right", "Düzenle", openEdit]].forEach(function (c) {
      var b = document.createElement("button");
      b.className = "corner-hit " + c[0];
      b.type = "button";
      b.setAttribute("aria-label", c[1]);
      b.addEventListener("click", c[2]);
      p.appendChild(b);
    });
  }

  // ---------------- edit form sizing ----------------
  // Canvases range from 526 to 1600 design px tall, so a fixed design font size
  // renders at wildly different sizes once each is scaled to fit. Sizing from
  // the scale instead makes the form read the same on all of them.

  function sizeForms() {
    var p = phone();
    if (!p) return;
    var k = scaleOf(p);
    if (!k) return;
    var target = Math.round(Math.max(14, Math.min(72, FORM_TARGET_PX / k)));

    overlays(p).forEach(function (o) {
      var px = target;
      o.style.fontSize = px + "px";
      // The shortest canvases cannot hold a form at the ideal size. Rather than
      // leave it scrolling, step it down until it fits — twice, because
      // shrinking the text also shrinks the header and bar around it.
      var floor = Math.max(12, Math.round(FORM_MIN_PX / k));
      var body = o.querySelector(".edit-body, .edit-scroll, .settings-body");
      for (var i = 0; body && i < 2; i++) {
        if (body.scrollHeight <= body.clientHeight + 1 || px <= floor) break;
        px = Math.max(floor, Math.floor(px * body.clientHeight / body.scrollHeight));
        o.style.fontSize = px + "px";
      }
    });
  }

  // ---------------- save bar ----------------
  // With the keyboard up the canvas is anchored to the top and keeps its scale,
  // so its bottom — where the save button lives — is behind the keyboard. Float
  // the bar to the bottom of whatever is still visible. position:fixed is no
  // use inside a transformed ancestor, so this works in design pixels.

  function floatBars() {
    var p = phone();
    if (!p) return;
    var k = scaleOf(p);
    if (!k) return;
    var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var visible = vh / k;                       // canvas height actually on screen
    var typing = window.VIEWPORT && window.VIEWPORT.typing();

    overlays(p).forEach(function (o) {
      var bar = o.querySelector(".save-bar, .settings-bar");
      if (!bar) return;
      if (!typing || visible >= o.offsetHeight - 2) {
        bar.style.position = bar.style.left = bar.style.right = bar.style.top = "";
        return;
      }
      // measured while still in flow, so the height is the laid-out one
      var h = bar.offsetHeight;
      bar.style.position = "absolute";
      bar.style.left = bar.style.right = "0";
      bar.style.top = Math.max(0, Math.round(visible - h)) + "px";
    });
  }

  function refresh() { sizeForms(); floatBars(); }

  function start() {
    addCorners();
    refresh();

    ["resize", "orientationchange", "focusin", "focusout"].forEach(function (e) {
      window.addEventListener(e, function () {
        refresh();
        // the viewport settles a moment after the keyboard moves
        setTimeout(refresh, 70);
      });
    });

    // Opening or closing an overlay changes what needs measuring.
    var p = phone();
    if (p && window.MutationObserver) {
      overlays(p).forEach(function (o) {
        new MutationObserver(function () { refresh(); setTimeout(refresh, 70); })
          .observe(o, { attributes: true, attributeFilter: ["class"] });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
