(function () {
  "use strict";

  var STORAGE_KEY = "oyakDemoStock_v1";

  var DEFAULT_STOCK = {
    enstruman: "IEYHO",
    maliyet: 168.000000,
    adet: 23000.00,
    fiyat: 179.50
  };

  function loadStock() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          for (var key in DEFAULT_STOCK) {
            if (!(key in parsed)) parsed[key] = DEFAULT_STOCK[key];
          }
          return applyGlobalPrice(parsed);
        }
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

  function fmt(n, decimals) {
    return n.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  function computeDerived(s) {
    var piyasa = s.adet * s.fiyat;
    var karZarar = s.adet * (s.fiyat - s.maliyet);
    return { piyasa: piyasa, karZarar: karZarar };
  }

  function render() {
    var d = computeDerived(stock);
    var karPos = d.karZarar >= 0;

    document.getElementById("enstrumanValue").textContent = stock.enstruman;
    document.getElementById("maliyetValue").textContent = fmt(stock.maliyet, 6);
    document.getElementById("adetValue").textContent = fmt(stock.adet, 2);
    document.getElementById("piyasaValue").textContent = fmt(d.piyasa, 2) + " ₺";
    document.getElementById("fiyatValue").textContent = fmt(stock.fiyat, 2);

    var kz = document.getElementById("karZararValue");
    kz.textContent = (karPos ? "+" : "-") + fmt(Math.abs(d.karZarar), 2) + " ₺";
    kz.style.color = karPos ? "#2ea43a" : "#fe2c45";
  }

  function toCommaStr(value) {
    return String(value).replace(".", ",");
  }
  function fromCommaStr(str) {
    var val = parseFloat(String(str).replace(",", "."));
    return isNaN(val) ? 0 : val;
  }

  function renderEditForm() {
    document.getElementById("inEnstruman").value = stock.enstruman;
    document.getElementById("inMaliyet").value = toCommaStr(stock.maliyet);
    document.getElementById("inAdet").value = toCommaStr(stock.adet);
    document.getElementById("inFiyat").value = toCommaStr(stock.fiyat);
  }

  function collectEditForm() {
    var enstruman = document.getElementById("inEnstruman").value.trim().toUpperCase().slice(0, 5);
    stock.enstruman = enstruman || "IEYHO";
    stock.maliyet = fromCommaStr(document.getElementById("inMaliyet").value);
    stock.adet = fromCommaStr(document.getElementById("inAdet").value);
    stock.fiyat = fromCommaStr(document.getElementById("inFiyat").value);
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

  // Scale the fixed 1021x1505 design canvas to fill whatever the real screen is.
  var DESIGN_W = 1021, DESIGN_H = 1505;
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
