window.SCREEN = {
  slug: "navy-tab",
  canvas: [1290, 831],
  locale: "tr-TR",

  battery: 88,

  fields: [
    { id: "saat", label: "Saat", def: "14:11", raw: true },
    { id: "adet",    label: "Satılabilir Adet", def: 74360 },
    { id: "fiyat",   label: "Fiyat",            def: 178.90 },
    { id: "maliyet", label: "Maliyet",          def: 159.10 }
  ],

  seed: { tutar: 2664374.00, kz: 1213108.40 },

  derive: function (s) {
    return {
      tutar: s.adet * s.fiyat,
      kz:    s.adet * (s.fiyat - s.maliyet)
    };
  },

  overlays: [
    { id: "clock", left: 64, top: 14, h: 29, size: 35, weight: 700, color: "#000000",
      get: function (s) { return s.saat; } },
    { id: "batt", cx: 1210, top: 16, h: 25, size: 33, weight: 700, color: "#ffffff",
      get: function (s) { return String(s.battery); } },

    { id: "maliyet", cx: 529, top: 530, h: 44, size: 42, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.maliyet, 2); } },
    { id: "tutar",   cx: 809, top: 530, h: 44, size: 40, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.tutar, 2); } },
    { id: "kz", right: 54, top: 530, h: 44, size: 42, weight: 700,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#12a05a" : "#d93a3a", text: A.num(s.kz, 2) };
      } },

    // sub-row: "Fiyat:" and "Satılabilir Adet:" labels remain part of the background
    { id: "fiyatSub", left: 156,  top: 673, h: 42, size: 40, weight: 400, color: "#444444",
      get: function (s, A) { return A.num(s.fiyat, 2); } },
    { id: "adetSub",  left: 1034, top: 673, h: 42, size: 41, weight: 400, color: "#444444",
      get: function (s, A) { return A.num(s.adet, 3); } }
  ]
};
