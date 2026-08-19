/* This app formats numbers US-style (comma thousands, dot decimals) — read off
   the source rather than assuming the Turkish convention the other screens use. */
window.SCREEN = {
  slug: "dark-liste",
  canvas: [1290, 676],
  locale: "en-US",

  fields: [
    { id: "saat", label: "Saat", def: "11:05", raw: true },
    { id: "adet",    label: "T2 Miktar",  def: 76500 },
    { id: "fiyat",   label: "Son Fiyat",  def: 179.40 },
    { id: "maliyet", label: "Maliyet",    def: 169.00 }
  ],

  seed: { tutar: 13722600.00, kz: 794250.00, pct: 6.13 },

  derive: function (s) {
    return {
      tutar: s.adet * s.fiyat,
      kz:    s.adet * (s.fiyat - s.maliyet),
      pct:   s.maliyet ? (s.fiyat - s.maliyet) / s.maliyet * 100 : 0
    };
  },

  overlays: [
    { id: "clock", left: 47, top: 102, h: 25, size: 36, weight: 600, color: "#ffffff",
      get: function (s) { return s.saat; } },

    { id: "adet",  right: 918, top: 445, h: 30, size: 29, weight: 400, color: "#ffffff",
      get: function (s, A) { return A.num(s.adet, 2); } },
    { id: "fiyat", right: 692, top: 445, h: 30, size: 29, weight: 400, color: "#ffffff",
      get: function (s, A) { return A.num(s.fiyat, 2); } },
    { id: "tutar", right: 437, top: 445, h: 30, size: 29, weight: 400, color: "#ffffff",
      get: function (s, A) { return A.num(s.tutar, 2); } },
    { id: "kz", right: 236, top: 445, h: 30, size: 29, weight: 400,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#5cc95c" : "#ff5b52",
                 text: A.num(s.kz, 2) };
      } },
    { id: "pct", right: 66, top: 445, h: 30, size: 29, weight: 400,
      get: function (s, A) {
        return { color: s.pct >= 0 ? "#5cc95c" : "#ff5b52",
                 text: "%" + A.num(s.pct, 2) };
      } }
  ]
};
