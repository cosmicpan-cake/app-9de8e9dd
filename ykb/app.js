(function () {
  "use strict";

  var STORAGE_KEY = "ieyhoDemoStock_v1";

  var DEFAULT_STOCK = {
    saat: "18:14",
    adet: 66000,
    fiyat: 179.3,
    degisim: 0.56,
    ortMaliyet: 168.0
  };

  function loadStock() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return applyGlobalPrice(parsed);
      }
    } catch (e) {}
    return applyGlobalPrice(JSON.parse(JSON.stringify(DEFAULT_STOCK)));
  }

  function saveStock(s) {
    // Stamped so a later launcher setting can be told apart from this edit.
    s.ts = window.GLOBAL_PRICE ? window.GLOBAL_PRICE.stamp() : Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  /* A price set on the launcher applies here too, unless this screen was
     edited more recently than that setting was written. */
  function applyGlobalPrice(s) {
    if (window.GLOBAL_PRICE) {
      var g = window.GLOBAL_PRICE.priceFor(s.ts);
      if (g !== null) s.fiyat = g;
      var gd = window.GLOBAL_PRICE.changeFor(s.ts);
      if (gd !== null) s.degisim = gd;
    }
    return s;
  }

  var stock = loadStock();

  function fmtTL(n, decimals) {
    return n.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function fmtInt(n) {
    return Math.round(n).toLocaleString("tr-TR");
  }
  function fmtPrice(n) {
    return n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
  function fmtSignedPct(n) {
    var sign = n > 0 ? "" : (n < 0 ? "-" : "");
    return "%" + sign + Math.abs(n).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function computeDerived(s) {
    var guncelDeger = s.adet * s.fiyat;
    var gainAmount = s.adet * (s.fiyat - s.ortMaliyet);
    var gainPct = s.ortMaliyet !== 0 ? ((s.fiyat - s.ortMaliyet) / s.ortMaliyet) * 100 : 0;
    return { guncelDeger: guncelDeger, gainAmount: gainAmount, gainPct: gainPct };
  }

  function render() {
    var d = computeDerived(stock);
    var degisimPos = stock.degisim >= 0;
    var gainPos = d.gainAmount >= 0;

    document.getElementById("priceValue").textContent = fmtPrice(stock.fiyat) + " TL";

    var arrow = document.getElementById("changeArrow");
    var pct = document.getElementById("changePct");
    var arrowPath = degisimPos
      ? "M5 19 L19 5 M19 5 H9 M19 5 V15"   // up-right
      : "M5 5 L19 19 M19 19 H9 M19 19 V9"; // down-right
    arrow.querySelector("path").setAttribute("d", arrowPath);
    arrow.querySelector("path").setAttribute("stroke", degisimPos ? "#29a542" : "#e5484d");
    pct.textContent = fmtSignedPct(stock.degisim).replace("-", "");
    pct.className = "change-pct " + (degisimPos ? "pos-color" : "neg-color");

    document.getElementById("guncelDegerValue").textContent = fmtTL(d.guncelDeger, 2) + " TL";

    var gainLine = document.getElementById("gainLine");
    gainLine.textContent = (gainPos ? "+" : "-") + fmtTL(Math.abs(d.gainAmount), 2) + " TL · " + fmtSignedPct(d.gainPct);
    gainLine.className = "gain-line " + (gainPos ? "pos-color" : "neg-color");

    document.getElementById("row1Value").textContent = fmtInt(stock.adet);
    document.getElementById("row2Value").textContent = fmtInt(stock.adet); // Satılabilir Adet mirrors Güncel Adet
    document.getElementById("row3Value").textContent = fmtTL(stock.ortMaliyet, 6) + " TL";
    document.getElementById("clockValue").textContent = stock.saat || DEFAULT_STOCK.saat;
  }

  function toCommaStr(value) {
    return String(value).replace(".", ",");
  }
  // Either separator may be typed; parse-number.js works out which is the
  // decimal point.
  function fromCommaStr(str) { return window.parseTypedNumber(str); }

  function renderEditForm() {
    document.getElementById("inSaat").value = stock.saat || DEFAULT_STOCK.saat;
    document.getElementById("inFiyat").value = toCommaStr(stock.fiyat);
    document.getElementById("inDegisim").value = toCommaStr(stock.degisim);
    if (window.SIGN_FIELDS) window.SIGN_FIELDS();
    document.getElementById("inAdet").value = toCommaStr(stock.adet);
    document.getElementById("inMaliyet").value = toCommaStr(stock.ortMaliyet);
  }

  function collectEditForm() {
    stock.saat = String(document.getElementById("inSaat").value).trim();
    stock.fiyat = fromCommaStr(document.getElementById("inFiyat").value);
    stock.degisim = fromCommaStr(document.getElementById("inDegisim").value);
    stock.adet = fromCommaStr(document.getElementById("inAdet").value);
    stock.ortMaliyet = fromCommaStr(document.getElementById("inMaliyet").value);
  }

  function showEdit(show) {
    document.getElementById("screen-edit").classList.toggle("hidden", !show);
  }

  document.getElementById("btnEdit").addEventListener("click", function () {
    renderEditForm();
    showEdit(true);
  });
  document.getElementById("btnCancelEdit").addEventListener("click", function () { showEdit(false); });
  document.getElementById("btnHome").addEventListener("click", function () {
    window.location.href = "../index.html";
  });
  document.getElementById("btnSave").addEventListener("click", function () {
    collectEditForm();
    saveStock(stock);
    render();
    showEdit(false);
  });

  // Scale the fixed 945x990 design canvas to fill whatever the real screen is.
  var DESIGN_W = 945, DESIGN_H = 2048;
  function fitPhoneToViewport() {
    var vw = window.VIEWPORT.width();
    var vh = window.VIEWPORT.height();
    var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
    document.getElementById("phone").style.transform = "scale(" + scale + ")";
  }
  fitPhoneToViewport();
  window.addEventListener("resize", fitPhoneToViewport);
  window.addEventListener("orientationchange", fitPhoneToViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitPhoneToViewport);
  }

  render();
})();
