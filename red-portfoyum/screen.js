window.SCREEN = {
  slug: "red-portfoyum",
  canvas: [1249, 1514],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "11:14", raw: true },
    { id: "adet",    label: "Adet",      def: 13390 },
    { id: "fiyat",   label: "Son Fiyat", def: 179.20 },
    { id: "maliyet", label: "Maliyet",   def: 168.80 }
  ],

  seed: { bakiye: 2391963.30, kz: 139697.30, pct: 5.76 },

  derive: function (s) {
    return {
      bakiye: s.adet * s.fiyat,
      kz:     s.adet * (s.fiyat - s.maliyet),
      pct:    s.maliyet ? (s.fiyat - s.maliyet) / s.maliyet * 100 : 0
    };
  },

  overlays: [
    { id: "clock", left: 61, top: 35, h: 29, size: 41, weight: 600, color: "#ffffff",
      get: function (s) { return s.saat; } },

    { id: "kzTop", left: 122, top: 339, h: 54, size: 45, weight: 500,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#1a9362" : "#d0021b",
                 text: A.signed(s.kz, 2) + " TL" };
      } },

    // Toplam bakiye: leading digits large, decimals and unit smaller.
    { id: "bakiye", left: 124, top: 545, h: 60, size: 69, weight: 700, color: "#111111",
      get: function (s, A) {
        var t = A.num(s.bakiye, 2), i = t.indexOf(",");
        return { html: t.slice(0, i) +
                 '<span class="small" style="font-weight:500">' + t.slice(i) + " TL</span>" };
      } },

    // holdings list — right column
    { id: "listVal", right: 64, top: 1246, h: 40, size: 46, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.bakiye, 2) + " TL"; } },
    { id: "listKz",  right: 66, top: 1315, h: 41, size: 46, weight: 500,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#1a9362" : "#d0021b",
                 text: A.signed(s.kz, 2) + " TL" };
      } },
    { id: "listPct", right: 66, top: 1380, h: 42, size: 47, weight: 500,
      get: function (s, A) {
        return { color: s.pct >= 0 ? "#1a9362" : "#d0021b",
                 text: "% " + A.num(s.pct, 2) };
      } },

    // holdings list — left column (the "Adet"/"Son fiyat"/"Maliyet" words stay
    // part of the background image)
    { id: "adetList",    left: 253, top: 1312, h: 29, size: 41, weight: 400, color: "#504f57",
      get: function (s, A) { return A.num(s.adet, 0); } },
    // the word itself, redrawn rather than left in the background so it can sit
    // a little further from the quantity
    { id: "adetWord",    left: 400, top: 1311, h: 31, size: 41, weight: 400, color: "#58575f",
      get: function () { return "Adet"; } },
    { id: "fiyatList",   left: 416, top: 1375, h: 37, size: 40, weight: 400, color: "#4c4b51",
      get: function (s, A) { return A.num(s.fiyat, 3) + " TL"; } },
    { id: "maliyetList", left: 396, top: 1448, h: 38, size: 43, weight: 400, color: "#4e4d56",
      get: function (s, A) { return A.num(s.maliyet, 2) + " TL"; } }
  ]
};
