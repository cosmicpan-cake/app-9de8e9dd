window.SCREEN = {
  slug: "navy-portfoy",
  canvas: [1290, 1226],
  locale: "tr-TR",

  battery: 21,

  fields: [
    { id: "saat", label: "Saat", def: "12:24", raw: true },
    { id: "adet",    label: "Miktar",         def: 16500 },
    { id: "fiyat",   label: "Anlık Fiyat",    def: 179.50 },
    { id: "maliyet", label: "Ortalama Maliyet", def: 168.71 }
  ],

  seed: { kz: 113215.00, pct: 4.06 },

  derive: function (s) {
    return {
      kz:  s.adet * (s.fiyat - s.maliyet),
      pct: s.maliyet ? (s.fiyat - s.maliyet) / s.maliyet * 100 : 0
    };
  },

  overlays: [
    { id: "clock", left: 99, top: 38, h: 37, size: 51, weight: 600, color: "#ffffff",
      get: function (s) { return s.saat; } },
    { id: "batt", cx: 1141, top: 38, h: 33, size: 45, weight: 700, color: "#000000",
      get: function (s) { return String(s.battery); } },

    // table row
    { id: "pct",   right: 859, top: 448, h: 52, size: 52, weight: 400,
      get: function (s, A) {
        return { color: s.pct >= 0 ? "#46cd82" : "#ff6b6b", text: A.num(s.pct, 2) };
      } },
    { id: "kzRow", right: 523, top: 448, h: 52, size: 47, weight: 400,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#46cd82" : "#ff6b6b", text: A.num(s.kz, 2) };
      } },
    { id: "adet",    right: 314, top: 448, h: 52, size: 44, weight: 400, color: "#acb3bf",
      get: function (s, A) { return A.num(s.adet, 0); } },
    { id: "malRow",  right: 83,  top: 448, h: 52, size: 41, weight: 400, color: "#adb1be",
      get: function (s, A) { return A.num(s.maliyet, 2); } },

    // "Toplam" line
    { id: "toplam", right: 523, top: 592, h: 48, size: 47, weight: 400,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#46cd82" : "#ff6b6b", text: A.num(s.kz, 2) };
      } },

    // detail rows
    { id: "fiyat", right: 75, top: 768, h: 48, size: 47, weight: 400,
      get: function (s, A) {
        return { color: "#49d483", text: A.num(s.fiyat, 2) + " TL" };
      } },
    { id: "maliyet", right: 82, top: 929, h: 50, size: 44, weight: 400, color: "#c4c7d3",
      get: function (s, A) { return A.num(s.maliyet, 2) + " TL"; } },
    { id: "kzTotal", right: 80, top: 1104, h: 48, size: 43, weight: 400,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#46cd82" : "#ff6b6b",
                 text: (s.kz < 0 ? "- " : "+ ") + A.num(Math.abs(s.kz), 2) + " TL" };
      } }
  ]
};
