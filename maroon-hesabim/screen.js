window.SCREEN = {
  slug: "maroon-hesabim",
  canvas: [1161, 1600],
  locale: "tr-TR",

  battery: 54,

  fields: [
    { id: "saat", label: "Saat", def: "15:48", raw: true },
    { id: "adet",    label: "Adet",      def: 68400 },
    { id: "fiyat",   label: "Fiyat",     def: 178.90 },
    { id: "degisim", label: "Gün Değ. %", def: 2.74 }
  ],

  seed: { toplam: 12312961.00 },

  derive: function (s) { return { toplam: s.adet * s.fiyat }; },

  overlays: [
    { id: "clock", left: 131, top: 55, h: 37, size: 54, weight: 500, color: "#ffffff",
      get: function (s) { return s.saat; } },
    { id: "batt", cx: 1034, top: 57, h: 32, size: 39, weight: 700, color: "#80114f",
      get: function (s) { return String(s.battery); } },

    // The header date follows the real clock, in the source's own wording.
    { id: "tarih", cx: 580, top: 233, h: 24, size: 28, weight: 400, color: "#f3e6f0",
      get: function () {
        var GUN = ["Pazar", "Pazartesi", "Salı", "Çarşamba",
                   "Perşembe", "Cuma", "Cumartesi"];
        var AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        var d = new Date();
        return GUN[d.getDay()] + ", " + d.getDate() + " " + AY[d.getMonth()] +
               " " + d.getFullYear();
      } },

    // The time beside the price is the same clock as the status bar, with seconds.
    { id: "rowSaat", left: 557, top: 1431, h: 19, size: 25, weight: 400, color: "#696969",
      get: function (s) { return s.saat + ":00"; } },

    // Donut centre and the Hisse header both show the total, with the decimals
    // set smaller than the leading digits — matched with a nested span.
    { id: "donut", cx: 243, top: 685, h: 29, size: 40, weight: 700, color: "#1b2546",
      get: function (s, A) {
        var t = A.num(s.toplam, 2), i = t.lastIndexOf(".");
        return { html: t.slice(0, i) + '<span class="small">' + t.slice(i) + " ₺</span>" };
      } },

    { id: "pct100", right: 90, top: 612, h: 26, size: 28, weight: 400, color: "#111111",
      get: function () { return "%100,0"; } },

    // Unlike the donut, the Hisse row prints the whole figure at one size.
    { id: "hisse", right: 147, top: 1151, h: 31, size: 32, weight: 700, color: "#383838",
      get: function (s, A) { return A.num(s.toplam, 2) + " ₺"; } },

    { id: "fiyat",   right: 511, top: 1378, h: 27, size: 30, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.fiyat, 2); } },
    { id: "degisim", right: 319, top: 1378, h: 27, size: 31, weight: 600,
      get: function (s, A) {
        return { color: s.degisim >= 0 ? "#399645" : "#c0392b",
                 text: (s.degisim < 0 ? "-" : "+") + A.num(Math.abs(s.degisim), 2) };
      } },
    { id: "adet", right: 80, top: 1378, h: 27, size: 31, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.adet, 2); } }
  ]
};
