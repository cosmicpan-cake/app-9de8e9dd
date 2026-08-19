(function () {
  "use strict";

  // Scale the fixed 945x1500 design canvas to fill whatever the real screen is.
  var DESIGN_W = 945, DESIGN_H = 1500;
  function fitPhoneToViewport() {
    var vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
    document.getElementById("phone").style.transform = "scale(" + scale + ")";
    return scale;
  }
  var scale = fitPhoneToViewport();
  ["resize", "orientationchange"].forEach(function (e) {
    window.addEventListener(e, function () { scale = fitPhoneToViewport(); });
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () { scale = fitPhoneToViewport(); });
  }

  // ---------------- pager ----------------
  var strip = document.getElementById("pages");
  var pages = strip.children.length;
  var dots = document.getElementById("dots");
  var prev = document.getElementById("prev");
  var next = document.getElementById("next");
  var at = 0;

  for (var i = 0; i < pages; i++) {
    var b = document.createElement("button");
    b.className = "dot";
    b.setAttribute("aria-label", "Sayfa " + (i + 1));
    b.addEventListener("click", (function (n) { return function () { go(n); }; })(i));
    dots.appendChild(b);
  }

  function go(n) {
    at = Math.max(0, Math.min(pages - 1, n));
    strip.style.transform = "translateX(" + (-at * DESIGN_W) + "px)";
    prev.disabled = at === 0;
    next.disabled = at === pages - 1;
    for (var i = 0; i < dots.children.length; i++) {
      dots.children[i].classList.toggle("on", i === at);
    }
  }
  prev.addEventListener("click", function () { go(at - 1); });
  next.addEventListener("click", function () { go(at + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") go(at - 1);
    if (e.key === "ArrowRight") go(at + 1);
  });

  // Swipe. The canvas is scaled, so raw touch distances are divided back into
  // design pixels before being compared with the threshold.
  var x0 = null, y0 = null, moved = false;
  strip.addEventListener("touchstart", function (e) {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; moved = false;
  }, { passive: true });
  strip.addEventListener("touchmove", function (e) {
    if (x0 === null) return;
    var dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
    if (Math.abs(dx) > Math.abs(dy) + 6) moved = true;
  }, { passive: true });
  strip.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = (e.changedTouches[0].clientX - x0) / (scale || 1);
    if (moved && Math.abs(dx) > 80) go(at + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
  // A swipe must not also count as a tap on the tile underneath.
  strip.addEventListener("click", function (e) {
    if (moved) { e.preventDefault(); moved = false; }
  }, true);


  // ---------------- settings ----------------
  // One IEYHO price shared by every screen. Saving it here makes each screen
  // open with that price; editing a screen afterwards overrides it for that
  // screen only, until the price is saved here again.
  var panel = document.getElementById("settings");
  var input = document.getElementById("inPrice");
  var note = document.getElementById("priceNote");

  function toLocal(v) { return String(v).replace(".", ","); }
  function fromLocal(s) {
    var v = parseFloat(String(s).replace(/\./g, "").replace(",", "."));
    return isNaN(v) ? null : v;
  }

  function refreshNote() {
    var g = window.GLOBAL_PRICE.read();
    note.textContent = g
      ? "Bu fiyat tüm ekranlarda kullanılıyor. Bir ekranı kendi düzenleme "
        + "sayfasından değiştirirseniz o ekran kendi değerini kullanır."
      : "Boş bırakılırsa her ekran kendi fiyatını kullanır.";
  }

  function showSettings(on) {
    panel.classList.toggle("hidden", !on);
    if (on) {
      var g = window.GLOBAL_PRICE.read();
      input.value = g ? toLocal(g.fiyat) : "";
      refreshNote();
    }
  }

  document.getElementById("btnSettings").addEventListener("click", function () { showSettings(true); });
  document.getElementById("btnBack").addEventListener("click", function () { showSettings(false); });
  document.getElementById("btnSavePrice").addEventListener("click", function () {
    var v = fromLocal(input.value);
    if (v === null || v <= 0) { window.GLOBAL_PRICE.clear(); }
    else { window.GLOBAL_PRICE.write(v); }
    showSettings(false);
  });
  document.getElementById("btnClear").addEventListener("click", function () {
    window.GLOBAL_PRICE.clear();
    input.value = "";
    refreshNote();
  });

  go(0);
})();
