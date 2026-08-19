(function () {
  "use strict";

  var STORAGE_KEY = "portfoyDemoStocks_v3";
  var CLOCK_SETTINGS_KEY = "portfoyDemoClockSettings_v1";

  // Layout constants measured from org.jpeg (see crops/measure*.py)
  // FIRST_ICON_TOP is absolute canvas Y; CARD_GROUP_TOP is where #cardGroup itself
  // is positioned (see .card-group top in style.css), so block offsets must
  // be relative to that, not the raw canvas coordinate. Visible cards are stacked
  // using CARD_STEP so hiding a stock compacts the list (no gaps).
  var CARD_GROUP_TOP = 321;
  var FIRST_ICON_TOP = 346;
  var CARD_STEP = 551;     // vertical spacing between consecutive card icon-tops
  var ROW1_OFFSET = 113;   // icon-top -> row1 top
  var ROW_PITCH = 51;      // row-to-row
  var KZ_OFFSET = 204;     // icon-top+row1offset+this = kz row top
  var PCT_OFFSET = 247;
  var BUTTON_OFFSET = 308;
  var CHEVRON_OFFSET = 71;

  var DEFAULT_STOCKS = [
    {
      id: "IEYHO",
      name: "IEYHO - IŞIKLAR ENERJİ VE YAPI HOLDİNG A.Ş.",
      nameLines: ["IEYHO - IŞIKLAR ENERJİ VE YAPI", "HOLDİNG A.Ş."],
      iconKind: "ieyho",
      adet: 155000,
      fiyat: 178.300,
      degisim: 2.35,
      ortMaliyet: 171.00,
      visible: true
    },
    {
      id: "QUAGR",
      name: "QUAGR - QUA GRANITE HAYAL YAPI VE ÜRÜNLERİ SANAYI TICARET A.Ş.",
      nameLines: ["QUAGR - QUA GRANITE HAYAL YAPI VE", "ÜRÜNLERİ SANAYI TICARET A.Ş."],
      iconKind: "quagr",
      adet: 5000000,
      fiyat: 3.270,
      degisim: -2.39,
      ortMaliyet: 3.68,
      visible: false
    },
    {
      id: "KUYAS",
      name: "KUYAS - KUYUMCUKENT GAYRİMENKUL YATIRIM A.Ş.",
      nameLines: ["KUYAS - KUYUMCUKENT", "GAYRİMENKUL YATIRIM A.Ş."],
      iconKind: "kuyas",
      adet: 230000,
      fiyat: 66.900,
      degisim: -4.43,
      ortMaliyet: 68.00,
      visible: false
    }
  ];

  /* A price set on the launcher applies to the IEYHO row, unless this screen
     was edited more recently than that setting was written. The other two
     holdings are unaffected. */
  function applyGlobalPrice(stocks) {
    if (!window.GLOBAL_PRICE) return stocks;
    stocks.forEach(function (s) {
      if (s.id !== "IEYHO") return;
      var g = window.GLOBAL_PRICE.priceFor(s.ts);
      if (g !== null) s.fiyat = g;
    });
    return stocks;
  }

  function loadStocks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_STOCKS.length) {
          return applyGlobalPrice(parsed);
        }
      }
    } catch (e) {}
    return applyGlobalPrice(JSON.parse(JSON.stringify(DEFAULT_STOCKS)));
  }

  function saveStocks(stocks) {
    // Stamped so a later launcher setting can be told apart from this edit.
    var now = window.GLOBAL_PRICE ? window.GLOBAL_PRICE.stamp() : Date.now();
    stocks.forEach(function (s) { if (s.id === "IEYHO") s.ts = now; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }

  function loadClockSettings() {
    try {
      var raw = localStorage.getItem(CLOCK_SETTINGS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return {
            useRealTime: parsed.useRealTime !== false,
            hour: typeof parsed.hour === "number" ? parsed.hour : 19,
            minute: typeof parsed.minute === "number" ? parsed.minute : 1
          };
        }
      }
    } catch (e) {}
    return { useRealTime: true, hour: 19, minute: 1 };
  }

  function saveClockSettings(settings) {
    localStorage.setItem(CLOCK_SETTINGS_KEY, JSON.stringify(settings));
  }

  var stocks = loadStocks();
  var clockSettings = loadClockSettings();

  function fmtTL(n, decimals) {
    return n.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function fmtInt(n) {
    return Math.round(n).toLocaleString("tr-TR");
  }
  function fmtSignedPct(n) {
    var sign = n > 0 ? "" : (n < 0 ? "-" : "");
    return "%" + sign + Math.abs(n).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function computeDerived(s) {
    var kullanilabilirTutar = s.adet * s.fiyat;
    var karZarar = s.adet * (s.fiyat - s.ortMaliyet);
    var karZararPct = s.ortMaliyet !== 0 ? ((s.fiyat - s.ortMaliyet) / s.ortMaliyet) * 100 : 0;
    return { kullanilabilirTutar: kullanilabilirTutar, karZarar: karZarar, karZararPct: karZararPct };
  }

  var arrowUp = '<svg viewBox="0 0 12 12"><path d="M6 1 L11 9 L1 9 Z" fill="currentColor"/></svg>';
  var arrowDown = '<svg viewBox="0 0 12 12"><path d="M6 11 L1 3 L11 3 Z" fill="currentColor"/></svg>';

  var ICON_FILES = {
    ieyho: "IEYHO.png",
    quagr: "QUAGR.png",
    kuyas: "KUYAS.png"
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderPortfolio() {
    var group = document.getElementById("cardGroup");
    group.innerHTML = "";

    var visibleStocks = stocks.filter(function (s) { return s.visible !== false; });

    visibleStocks.forEach(function (s, i) {
      var d = computeDerived(s);
      var kzPos = d.karZarar >= 0;
      var iconTop = FIRST_ICON_TOP + i * CARD_STEP;
      var row1 = ROW1_OFFSET;
      var rowTops = [row1, row1 + ROW_PITCH, row1 + ROW_PITCH * 2, row1 + ROW_PITCH * 3];
      var kzTop = row1 + KZ_OFFSET;
      var pctTop = row1 + PCT_OFFSET;
      var btnTop = row1 + BUTTON_OFFSET;
      var chevronTop = row1 + CHEVRON_OFFSET;

      var block = document.createElement("div");
      block.className = "card-block";
      block.style.top = (iconTop - CARD_GROUP_TOP) + "px";

      var iconFile = ICON_FILES[s.iconKind] || "";

      block.innerHTML =
        '<div class="icon-circle" style="top:0px;"><img src="' + iconFile + '" alt="" class="icon-img"></div>' +
        '<div class="stock-name" style="top:1px;">' + (s.nameLines || [s.name]).map(escapeHtml).join('<br>') + '</div>' +

        '<div class="row-label" style="top:' + rowTops[0] + 'px;">Kullanılabilir Tutar</div>' +
        '<div class="row-value" style="top:' + rowTops[0] + 'px;">' + fmtTL(d.kullanilabilirTutar, 2) + ' TL</div>' +

        '<div class="row-label" style="top:' + rowTops[1] + 'px;">Adet</div>' +
        '<div class="row-value" style="top:' + rowTops[1] + 'px;">' + fmtInt(s.adet) + '</div>' +

        '<div class="row-label" style="top:' + rowTops[2] + 'px;">Fiyat / Değişim</div>' +
        '<div class="row-value" style="top:' + rowTops[2] + 'px;">' + fmtTL(s.fiyat, 3) + ' TL / ' + fmtSignedPct(s.degisim) + '</div>' +

        '<div class="row-label" style="top:' + rowTops[3] + 'px;">Ortalama Maliyet</div>' +
        '<div class="row-value" style="top:' + rowTops[3] + 'px;">' + fmtTL(s.ortMaliyet, 2) + ' TL</div>' +

        '<div class="row-label" style="top:' + kzTop + 'px;">Olası Kar/Zarar</div>' +
        '<div class="row-value kz ' + (kzPos ? "pos" : "neg") + '" style="top:' + kzTop + 'px;">' + (kzPos ? "" : "-") + fmtTL(Math.abs(d.karZarar), 2) + ' TL</div>' +

        '<div class="pct-value ' + (kzPos ? "pos" : "neg") + '" style="top:' + pctTop + 'px;">' + fmtSignedPct(d.karZararPct) + (kzPos ? arrowUp : arrowDown) + '</div>' +

        '<div class="chevron" style="top:' + chevronTop + 'px;"><svg viewBox="0 0 20 34"><path d="M2 2 L17 17 L2 32" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +

        '<button class="btn-pill btn-al" style="left:137px;top:' + btnTop + 'px;">Al</button>' +
        '<button class="btn-pill btn-sat" style="left:311px;top:' + btnTop + 'px;">Sat</button>';

      if (i < visibleStocks.length - 1) {
        var dividerY = CARD_STEP - 27;
        var divider = document.createElement("div");
        divider.className = "divider-line";
        divider.style.top = dividerY + "px";
        block.appendChild(divider);
      }

      group.appendChild(block);
    });

    var groupHeight = visibleStocks.length === 0
      ? 0
      : (FIRST_ICON_TOP - CARD_GROUP_TOP) + (visibleStocks.length - 1) * CARD_STEP + ROW1_OFFSET + BUTTON_OFFSET + 75 + 27;
    group.style.height = groupHeight + "px";
  }

  function renderEditForm() {
    var container = document.getElementById("editForm");
    container.innerHTML = "";

    var now = new Date();
    var displayHour = clockSettings.useRealTime ? now.getHours() : clockSettings.hour;
    var displayMinute = clockSettings.useRealTime ? now.getMinutes() : clockSettings.minute;

    var timeGroup = document.createElement("div");
    timeGroup.className = "edit-group";
    timeGroup.innerHTML =
      '<h3 style="margin-bottom:20px;">Saat</h3>' +
      '<div class="field-row time-row">' +
        '<input class="field-input time-input" id="clockHourInput" type="text" inputmode="numeric" maxlength="2" value="' + String(displayHour).padStart(2, "0") + '">' +
        '<span class="time-colon">:</span>' +
        '<input class="field-input time-input" id="clockMinuteInput" type="text" inputmode="numeric" maxlength="2" value="' + String(displayMinute).padStart(2, "0") + '">' +
      '</div>' +
      '<div class="edit-group-header" style="margin-bottom:0;">' +
        '<input type="checkbox" class="visible-checkbox" id="realTimeCheckbox" ' + (clockSettings.useRealTime ? "checked" : "") + '>' +
        '<span class="checkbox-label">Gerçek saat</span>' +
      '</div>';
    container.appendChild(timeGroup);

    var uncheckRealTime = function () {
      document.getElementById("realTimeCheckbox").checked = false;
    };
    document.getElementById("clockHourInput").addEventListener("input", uncheckRealTime);
    document.getElementById("clockMinuteInput").addEventListener("input", uncheckRealTime);

    stocks.forEach(function (s, idx) {
      var group = document.createElement("div");
      group.className = "edit-group";
      var checked = s.visible !== false ? "checked" : "";
      group.innerHTML =
        '<div class="edit-group-header">' +
          '<input type="checkbox" class="visible-checkbox" data-idx="' + idx + '" ' + checked + '>' +
          '<h3>' + escapeHtml(s.name) + '</h3>' +
        '</div>' +
        field("Adet", idx, "adet", s.adet) +
        fieldPair("Fiyat / Değişim", idx, "fiyat", s.fiyat, "Fiyat TL", "degisim", s.degisim, "Değişim %") +
        field("Ortalama Maliyet (TL)", idx, "ortMaliyet", s.ortMaliyet);
      container.appendChild(group);
    });
  }

  function toCommaStr(value) {
    return String(value).replace(".", ",");
  }
  function fromCommaStr(str) {
    var val = parseFloat(String(str).replace(",", "."));
    return isNaN(val) ? 0 : val;
  }

  function field(labelText, idx, key, value) {
    return (
      '<div class="field-row">' +
        '<span class="field-label">' + labelText + '</span>' +
        '<input class="field-input" type="text" inputmode="decimal" data-idx="' + idx + '" data-key="' + key + '" value="' + toCommaStr(value) + '">' +
      '</div>'
    );
  }

  function fieldPair(labelText, idx, key1, value1, title1, key2, value2, title2) {
    return (
      '<div class="field-row">' +
        '<span class="field-label">' + labelText + '</span>' +
        '<input class="field-input" type="text" inputmode="decimal" title="' + title1 + '" data-idx="' + idx + '" data-key="' + key1 + '" value="' + toCommaStr(value1) + '">' +
        '<input class="field-input" type="text" inputmode="decimal" title="' + title2 + '" data-idx="' + idx + '" data-key="' + key2 + '" value="' + toCommaStr(value2) + '">' +
      '</div>'
    );
  }

  function collectEditForm() {
    var inputs = document.querySelectorAll("#editForm .field-input[data-key]");
    inputs.forEach(function (inp) {
      var idx = parseInt(inp.getAttribute("data-idx"), 10);
      var key = inp.getAttribute("data-key");
      stocks[idx][key] = fromCommaStr(inp.value);
    });
    var checkboxes = document.querySelectorAll("#editForm .visible-checkbox[data-idx]");
    checkboxes.forEach(function (cb) {
      var idx = parseInt(cb.getAttribute("data-idx"), 10);
      stocks[idx].visible = cb.checked;
    });

    var realTime = document.getElementById("realTimeCheckbox").checked;
    var hourVal = parseInt(document.getElementById("clockHourInput").value, 10);
    var minuteVal = parseInt(document.getElementById("clockMinuteInput").value, 10);
    if (isNaN(hourVal)) hourVal = 0;
    if (isNaN(minuteVal)) minuteVal = 0;
    hourVal = Math.min(23, Math.max(0, hourVal));
    minuteVal = Math.min(59, Math.max(0, minuteVal));
    clockSettings = { useRealTime: realTime, hour: hourVal, minute: minuteVal };
    saveClockSettings(clockSettings);
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
    saveStocks(stocks);
    renderPortfolio();
    updateClock();
    showEdit(false);
  });
  document.getElementById("btnHome").addEventListener("click", function () {
    window.location.href = "../index.html";
  });

  function updateClock() {
    var hh, mm;
    if (clockSettings.useRealTime) {
      var now = new Date();
      hh = String(now.getHours()).padStart(2, "0");
      mm = String(now.getMinutes()).padStart(2, "0");
    } else {
      hh = String(clockSettings.hour).padStart(2, "0");
      mm = String(clockSettings.minute).padStart(2, "0");
    }
    document.getElementById("clockPill").textContent = hh + ":" + mm;
  }
  updateClock();
  setInterval(updateClock, 1000 * 15);

  // Scale the fixed 943x2048 design canvas to fill whatever the real screen
  // is, without distorting the pixel-exact internal layout.
  var DESIGN_W = 943, DESIGN_H = 2048;
  function fitPhoneToViewport() {
    var vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
    document.getElementById("phone").style.transform = "scale(" + scale + ")";
  }
  fitPhoneToViewport();
  window.addEventListener("resize", fitPhoneToViewport);
  window.addEventListener("orientationchange", fitPhoneToViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitPhoneToViewport);
  }

  // Fullscreen toggle (mainly for Android Chrome): "Add to Home Screen" alone
  // doesn't reliably hide the address bar when the page is served over plain
  // HTTP (no secure context), so this gives a direct, working alternative.
  // Tapping "Ana Sayfa" (invisible overlay, #fsToggle) toggles fullscreen —
  // no visible UI added. iOS Safari doesn't support the Fullscreen API on
  // iPhone, so the listener is only wired up where it will actually work.
  var docEl = document.documentElement;
  var requestFS = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
  var exitFS = document.exitFullscreen || document.webkitExitFullscreen;
  var fsToggle = document.getElementById("fsToggle");

  if (requestFS) {
    fsToggle.addEventListener("click", function () {
      var isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
      if (isFullscreen) {
        exitFS.call(document);
      } else {
        requestFS.call(docEl);
      }
    });
    document.addEventListener("fullscreenchange", fitPhoneToViewport);
    document.addEventListener("webkitfullscreenchange", fitPhoneToViewport);
  }

  renderPortfolio();
})();
