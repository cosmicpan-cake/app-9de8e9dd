window.SCREEN = {
  slug: "portfoy-emirler",
  canvas: [1290, 595],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "11:31", raw: true },
    { id: "adet",    label: "Adet",      def: 33500 },
    { id: "fiyat",   label: "Son Fiyat", def: 179.40 },
    { id: "maliyet", label: "Maliyet",   def: 159.10 }
  ],

  seed: { tutar: 6001590.00, kz: 672640.00, pct: 11.20 },

  derive: function (s) {
    return {
      tutar: s.adet * s.fiyat,
      kz:    s.adet * (s.fiyat - s.maliyet),
      pct:   s.maliyet ? (s.fiyat - s.maliyet) / s.maliyet * 100 : 0
    };
  },

  overlays: [
    { id: "clock", left: 55, top: 18, h: 30, size: 43, weight: 600, color: "#000000",
      get: function (s) { return s.saat; } },

    // summary card
    { id: "topDeger", right: 81, top: 231, h: 28, size: 32, weight: 500, color: "#1c1c1e",
      get: function (s, A) { return A.num(s.tutar, 2) + " TL"; } },
    { id: "topKz", right: 82, top: 292, h: 30, size: 32, weight: 500,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#1f8a52" : "#d93a3a",
                 text: A.signed(s.kz, 2) + " TL (%" + A.num(s.pct, 2) + ")" };
      } },

    // table row
    { id: "adet",    right: 925, top: 508, h: 24, size: 27, weight: 500, color: "#1c1c1e",
      get: function (s, A) { return A.num(s.adet, 0); } },
    { id: "fiyat",   right: 765, top: 508, h: 24, size: 27, weight: 500, color: "#1c1c1e",
      get: function (s, A) { return A.num(s.fiyat, 2); } },
    { id: "maliyet", right: 586, top: 508, h: 24, size: 27, weight: 500, color: "#1c1c1e",
      get: function (s, A) { return A.num(s.maliyet, 2); } },
    { id: "tutar",   right: 338, top: 508, h: 24, size: 27, weight: 700, color: "#1c1c1e",
      get: function (s, A) { return A.num(s.tutar, 2); } },

    // K/Z cell wraps onto two centred lines
    { id: "kz1", cx: 1091, top: 487, h: 25, size: 27, weight: 500,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#1f8a52" : "#d93a3a", text: A.signed(s.kz, 2) };
      } },
    { id: "kz2", cx: 1095, top: 527, h: 25, size: 27, weight: 500,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#1f8a52" : "#d93a3a",
                 text: "(%" + A.num(s.pct, 2) + ")" };
      } }
  ]
};
