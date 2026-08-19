(function () {
  "use strict";

  var STORAGE_KEY = "isDemoStock_v1";

  var DEFAULT_STOCK = {
    adet: 59401.000,
    fiyat: 179.40,
    maliyet: 168.35
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
    }
    return s;
  }

  var stock = loadStock();

  function fmtTL(n, decimals) {
    return n.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  // Splits "10.656.539,40 TL" into main "10.656.539" + smaller-suffix ",40 TL"
  function splitAmountHtml(fullStr) {
    var idx = fullStr.indexOf(",");
    if (idx === -1) return fullStr;
    var main = fullStr.slice(0, idx);
    var suffix = fullStr.slice(idx);
    return main + '<span class="suffix">' + suffix + "</span>";
  }

  function computeDerived(s) {
    var tutar = s.adet * s.fiyat;
    var karZarar = s.adet * (s.fiyat - s.maliyet);
    return { tutar: tutar, karZarar: karZarar };
  }

  function render() {
    var d = computeDerived(stock);
    var karPos = d.karZarar >= 0;

    var tutarText = fmtTL(d.tutar, 2) + " TL";
    document.getElementById("toplamTutarValue").innerHTML = splitAmountHtml(tutarText);
    document.getElementById("tutarValue").innerHTML = splitAmountHtml(tutarText);

    var kz = document.getElementById("toplamKarZararValue");
    var kzText = (karPos ? "+" : "-") + fmtTL(Math.abs(d.karZarar), 2) + " TL";
    kz.innerHTML = splitAmountHtml(kzText);
    kz.style.color = karPos ? "#29a542" : "#e5484d";

    document.getElementById("adetValue").innerHTML = splitAmountHtml(fmtTL(stock.adet, 3));
    document.getElementById("fiyatValue").innerHTML = splitAmountHtml(fmtTL(stock.fiyat, 2) + " TL");
    document.getElementById("maliyetValue").innerHTML = splitAmountHtml(fmtTL(stock.maliyet, 2) + " TL");
  }

  function toCommaStr(value) {
    return String(value).replace(".", ",");
  }
  function fromCommaStr(str) {
    var val = parseFloat(String(str).replace(",", "."));
    return isNaN(val) ? 0 : val;
  }

  function renderEditForm() {
    document.getElementById("inAdet").value = toCommaStr(stock.adet);
    document.getElementById("inFiyat").value = toCommaStr(stock.fiyat);
    document.getElementById("inMaliyet").value = toCommaStr(stock.maliyet);
  }

  function collectEditForm() {
    stock.adet = fromCommaStr(document.getElementById("inAdet").value);
    stock.fiyat = fromCommaStr(document.getElementById("inFiyat").value);
    stock.maliyet = fromCommaStr(document.getElementById("inMaliyet").value);
  }

  function showEdit(show) {
    document.getElementById("screen-edit").classList.toggle("hidden", !show);
  }

  document.getElementById("btnEdit").addEventListener("click", function () {
    renderEditForm();
    showEdit(true);
  });
  document.getElementById("btnCancelEdit").addEventListener("click", function () { showEdit(false); });
  document.getElementById("btnSave").addEventListener("click", function () {
    collectEditForm();
    saveStock(stock);
    render();
    showEdit(false);
  });
  document.getElementById("btnHome").addEventListener("click", function () {
    window.location.href = "../index.html";
  });

  // Scale the fixed 825x975 design canvas to fill whatever the real screen is.
  var DESIGN_W = 825, DESIGN_H = 975;
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
