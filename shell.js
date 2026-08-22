/* Shared chrome for every page: corner hit areas, and an edit screen that is
 * sized by the device rather than by the screen it belongs to.
 *
 * The cloned screens have canvases anywhere from 251 to 1600 design pixels
 * tall. The edit overlay used to live inside that canvas and be scaled with it,
 * so a short wide screen got a short wide form squeezed into a strip. It is
 * moved out to the document body instead and sized to the viewport, which makes
 * every edit screen the same comfortable size regardless of its screen.
 *
 * Sizing to the *visual* viewport also means the save button lands above the
 * on-screen keyboard on its own, with no repositioning needed.
 */
(function () {
  "use strict";

  function phone() { return document.getElementById("phone"); }

  function panels() {
    return [document.querySelector(".edit-overlay"), document.querySelector(".settings")]
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

  // ---------------- edit screen ----------------

  function detach() {
    panels().forEach(function (o) {
      if (o.parentNode !== document.body) document.body.appendChild(o);
      o.classList.add("sheet");
      // the page sized these to its canvas while they still lived inside it
      o.style.width = "";
      o.style.height = "";
      o.style.fontSize = "";
    });
  }

  function fitPanels() {
    var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    panels().forEach(function (o) { o.style.height = vh + "px"; });
  }


  // ---------------- sign toggle ----------------
  // A phone's decimal keypad has no minus key, so any field that can hold a
  // negative number gets a button that flips the sign of what is typed. The
  // input keeps the sign in its own text, so everything that reads the field
  // carries on working unchanged.

  function signOf(input) { return /^\s*-/.test(input.value) ? "-" : "+"; }

  function paintSign(btn, input) {
    var neg = signOf(input) === "-";
    btn.textContent = neg ? "−" : "+";
    btn.classList.toggle("neg", neg);
    btn.setAttribute("aria-pressed", neg ? "true" : "false");
  }

  function inputFor(btn) {
    return document.getElementById(btn.getAttribute("data-for")) ||
           btn.parentNode.querySelector("input");
  }

  // Delegated, because some screens rebuild their form every time it opens.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".sign-toggle");
    if (!btn) return;
    var input = inputFor(btn);
    if (!input) return;
    input.value = signOf(input) === "-"
      ? input.value.replace(/^\s*-\s*/, "")
      : "-" + input.value.replace(/^\s*\+\s*/, "");
    paintSign(btn, input);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  // Typing a sign by hand (desktop) keeps the button in step.
  document.addEventListener("input", function (e) {
    if (!e.target.matches || !e.target.matches("input")) return;
    var btn = document.querySelector('.sign-toggle[data-for="' + e.target.id + '"]') ||
              (e.target.parentNode.querySelector ? e.target.parentNode.querySelector(".sign-toggle") : null);
    if (btn) paintSign(btn, e.target);
  });

  // Exposed so a form built after load can colour its buttons right away.
  window.SIGN_FIELDS = function () {
    var list = document.querySelectorAll(".sign-toggle");
    for (var i = 0; i < list.length; i++) {
      var input = inputFor(list[i]);
      if (input) paintSign(list[i], input);
    }
  };

  function start() {
    addCorners();
    detach();
    window.SIGN_FIELDS();
    fitPanels();

    ["resize", "orientationchange", "focusin", "focusout"].forEach(function (e) {
      window.addEventListener(e, function () {
        fitPanels();
        // the viewport settles a moment after the keyboard moves
        setTimeout(fitPanels, 70);
      });
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", fitPanels);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
