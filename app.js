(function () {
  "use strict";

  // Scale the fixed 945x1500 design canvas to fill whatever the real screen is.
  var DESIGN_W = 945, DESIGN_H = 1500;
  function fitPhoneToViewport() {
    var vw = window.VIEWPORT.width();
    var vh = window.VIEWPORT.height();
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
  var inPrice = document.getElementById("inPrice");
  var inChange = document.getElementById("inChange");
  var note = document.getElementById("priceNote");

  function toLocal(v) { return v === null ? "" : String(v).replace(".", ","); }
  // Either separator may be typed; parse-number.js works out which is the
  // decimal point. Blank means "leave the screens alone", so it stays null.
  function fromLocal(s) {
    s = String(s).trim();
    return s ? window.parseTypedNumber(s) : null;
  }

  function refreshNote() {
    var g = window.GLOBAL_PRICE.read();
    var set = g && (g.fiyat !== null || g.degisim !== null);
    note.textContent = set
      ? "Bu değerler tüm ekranlarda kullanılıyor. Bir ekranı kendi "
        + "düzenleme sayfasından değiştirirseniz o ekran kendi değerini kullanır."
      : "Boş bırakılan alan için her ekran kendi değerini kullanır.";
  }


  // ---------------- live quote ----------------
  // With an API key set, IEYHO's price and daily change are fetched when the
  // app opens and pre-filled here. Saving is still a deliberate tap, so a
  // fetch never quietly overrides a screen that was edited by hand.
  var inKey = document.getElementById("inApiKey");
  var liveStatus = document.getElementById("liveStatus");
  var btnLive = document.getElementById("btnLive");
  var live = null;

  function fmtTime(ms) {
    var d = new Date(ms);
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  function showLive(q) {
    liveStatus.className = "live-status";
    if (!window.LIVE_QUOTE.hasKey()) { liveStatus.textContent = "Canlı veri kapalı"; return; }
    if (!q) { liveStatus.textContent = "Canlı veri alınıyor…"; return; }
    if (q.error) {
      liveStatus.classList.add("err");
      // providers can return an essay; one line is enough to act on
      liveStatus.textContent = "Alınamadı: " +
        (q.error.length > 70 ? q.error.slice(0, 70) + "…" : q.error);
      return;
    }
    liveStatus.classList.add("ok");
    liveStatus.textContent = "BIST " + q.fiyat.toLocaleString("tr-TR", {minimumFractionDigits: 2, maximumFractionDigits: 2}) +
      (q.degisim == null ? "" : "  %" + q.degisim.toLocaleString("tr-TR", {minimumFractionDigits: 2, maximumFractionDigits: 2})) +
      "  (" + fmtTime(q.at) + ")";
  }

  function applyLiveToInputs(q) {
    if (!q || q.error) return;
    inPrice.value = toLocal(Math.round(q.fiyat * 100) / 100);
    if (q.degisim != null) inChange.value = toLocal(Math.round(q.degisim * 100) / 100);
    if (window.SIGN_FIELDS) window.SIGN_FIELDS();
  }

  function refreshLive(useCache) {
    if (!window.LIVE_QUOTE.hasKey()) { live = null; showLive(null); return; }
    showLive(null);
    btnLive.disabled = true;
    (useCache ? window.LIVE_QUOTE.get() : window.LIVE_QUOTE.fetchNow())
      .then(function (q) { live = q; showLive(q); btnLive.disabled = false; });
  }

  btnLive.addEventListener("click", function () {
    window.LIVE_QUOTE.setKey(inKey.value);
    refreshLive(false);
  });

  // fetched once as the app opens, so the values are ready when settings open
  if (window.LIVE_QUOTE.hasKey()) {
    window.LIVE_QUOTE.get().then(function (q) { live = q; });
  }

  function showSettings(on) {
    panel.classList.toggle("hidden", !on);
    if (on) {
      var g = window.GLOBAL_PRICE.read();
      inPrice.value = toLocal(g && g.fiyat);
      inChange.value = toLocal(g && g.degisim);
      inKey.value = window.LIVE_QUOTE.getKey();
      applyLiveToInputs(live);            // a live quote wins over the stored one
      if (window.SIGN_FIELDS) window.SIGN_FIELDS();
      showLive(live);
      refreshNote();
      if (window.LIVE_QUOTE.hasKey() && !live) refreshLive(true);
    }
  }

  document.getElementById("btnSettings").addEventListener("click", function () { showSettings(true); });
  document.getElementById("btnBack").addEventListener("click", function () { showSettings(false); });
  document.getElementById("btnSavePrice").addEventListener("click", function () {
    window.LIVE_QUOTE.setKey(inKey.value);
    var f = fromLocal(inPrice.value);
    window.GLOBAL_PRICE.write({
      fiyat: (f !== null && f > 0) ? f : null,
      degisim: fromLocal(inChange.value)          // a fall is a legitimate value
    });
    showSettings(false);
  });
  document.getElementById("btnClear").addEventListener("click", function () {
    window.GLOBAL_PRICE.clear();
    inPrice.value = "";
    inChange.value = "";
    if (window.SIGN_FIELDS) window.SIGN_FIELDS();
    refreshNote();
  });

  go(0);
})();
