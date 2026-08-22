window.SCREEN = {
  slug: "mobil-borsa",
  canvas: [810, 1599],
  locale: "tr-TR",

  // Editable inputs.
  battery: 74,

  fields: [
    { id: "saat", label: "Saat", def: "15:30", raw: true },
    { id: "adet",    label: "Güncel Adet",   def: 92120 },
    { id: "fiyat",   label: "Son Fiyat",     def: 179.10 },
    { id: "maliyet", label: "Maliyet",       def: 168.12 },
    { id: "degisim", label: "Günlük Değişim %", def: 3.83, signed: true }
  ],

  // Values the screenshot shows that don't reconcile exactly with adet x fiyat
  // (the source was captured while the price was ticking). Seeding them keeps
  // the first render identical to the screenshot; derive() takes over on save.
  seed: { deger: 16877865.20, kz: 1011650.60, getiri: 6.76 },

  derive: function (s) {
    return {
      deger:  s.adet * s.fiyat,
      kz:     s.adet * (s.fiyat - s.maliyet),
      getiri: s.maliyet ? (s.fiyat - s.maliyet) / s.maliyet * 100 : 0
    };
  },

  overlays: [
    { id: "clock", left: 58, top: 31, h: 24, size: 35, weight: 600, color: "#ffffff",
      get: function (s) { return s.saat; } },
    { id: "batt", cx: 754, top: 33, h: 20, size: 26, weight: 700, color: "#0e56e6",
      get: function (s) { return String(s.battery); } },

    { id: "degisim", left: 214, top: 271, h: 34, size: 35, weight: 700,
      get: function (s, A) {
        var up = s.degisim >= 0, col = up ? "#16a645" : "#e5484d";
        var tri = up ? "M12 5 L21 19 L3 19 Z" : "M12 19 L3 5 L21 5 Z";
        return { color: col, html:
          '<svg width="26" height="26" viewBox="0 0 24 24" style="margin-right:10px">' +
          '<path d="' + tri + '" fill="currentColor"/></svg>' +
          "%" + A.num(Math.abs(s.degisim), 2) };
      } },

    { id: "deger", right: 35, top: 423, h: 28, size: 33, weight: 600, color: "#1f1f2d",
      get: function (s, A) { return A.num(s.deger, 2) + " TL"; } },

    { id: "adet", right: 35, top: 496, h: 28, size: 33, weight: 600, color: "#1f1f2d",
      get: function (s, A) { return A.num(s.adet, 2); } },

    { id: "satilabilir", right: 35, top: 569, h: 28, size: 33, weight: 600, color: "#1f1f2d",
      get: function (s, A) { return A.num(s.adet, 2); } },

    { id: "fiyat", right: 35, top: 642, h: 28, size: 33, weight: 600, color: "#1f1f2d",
      get: function (s, A) { return A.num(s.fiyat, 2) + " TL"; } },

    { id: "maliyet", right: 35, top: 715, h: 28, size: 33, weight: 600, color: "#1f1f2d",
      get: function (s, A) { return A.num(s.maliyet, 2) + " TL"; } },

    { id: "kz", right: 34, top: 786, h: 29, size: 33, weight: 600,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#16a645" : "#e5484d",
                 text: A.signed(s.kz, 2) + " TL" };
      } },

    { id: "getiri", right: 35, top: 858, h: 29, size: 33, weight: 600,
      get: function (s, A) {
        return { color: s.getiri >= 0 ? "#16a645" : "#e5484d",
                 text: (s.getiri < 0 ? "-" : "+") + "%" + A.num(Math.abs(s.getiri), 2) };
      } }
  ]
};
