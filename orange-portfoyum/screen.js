window.SCREEN = {
  slug: "orange-portfoyum",
  canvas: [1290, 657],
  locale: "tr-TR",

  battery: 76,

  fields: [
    { id: "saat", label: "Saat", def: "12:54", raw: true },
    { id: "adet",    label: "Adet",    def: 62140 },
    { id: "fiyat",   label: "Fiyat",   def: 180.10 },
    { id: "maliyet", label: "Maliyet", def: 157.50 }
  ],

  seed: { kz: 1401106.00 },

  derive: function (s) {
    return { kz: s.adet * (s.fiyat - s.maliyet) };
  },

  overlays: [
    { id: "clock", left: 70, top: 31, h: 30, size: 43, weight: 600, color: "#ffffff",
      get: function (s) { return s.saat; } },
    { id: "batt", cx: 1196, top: 30, h: 29, size: 38, weight: 700, color: "#c16d17",
      get: function (s) { return String(s.battery); } },

    { id: "fiyat",   cx: 542, top: 501, h: 38, size: 35, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.fiyat, 2); } },
    { id: "maliyet", cx: 800, top: 501, h: 38, size: 35, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.maliyet, 2); } },
    { id: "kz", right: 47, top: 501, h: 38, size: 39, weight: 700,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#1a8f1a" : "#cc2b2b", text: A.num(s.kz, 2) };
      } },

    // sub-row: the "Adet:" / "T2:" / "S.Adet:" labels stay part of the background
    { id: "adetSub", left: 499,  top: 593, h: 26, size: 30, weight: 400, color: "#434343",
      get: function (s, A) { return A.num(s.adet, 2); } },
    { id: "t2Sub",   left: 763,  top: 593, h: 26, size: 30, weight: 400, color: "#434343",
      get: function (s, A) { return A.num(s.adet, 2); } },
    { id: "sadetSub", left: 1086, top: 593, h: 26, size: 30, weight: 400, color: "#434343",
      get: function (s, A) { return A.num(s.adet, 2); } }
  ]
};
