window.SCREEN = {
  slug: "blue-card",
  canvas: [1290, 1235],
  locale: "tr-TR",

  battery: 90,

  fields: [
    { id: "saat", label: "Saat", def: "11:48", raw: true },
    { id: "adet",    label: "Toplam Adet",  def: 12501 },
    { id: "fiyat",   label: "Anlık Fiyat",  def: 179.40 },
    { id: "maliyet", label: "Ort. Maliyet", def: 168.83 },
    { id: "degisim", label: "Değişim %",    def: 3.99, signed: true }
  ],

  seed: { deger: 2241587.40, kz: 130586.15 },

  derive: function (s) {
    return {
      deger: s.adet * s.fiyat,
      kz:    s.adet * (s.fiyat - s.maliyet)
    };
  },

  overlays: [
    { id: "clock", left: 68, top: 37, h: 33, size: 48, weight: 600, color: "#000000",
      get: function (s) { return s.saat; } },
    { id: "batt", cx: 1182, top: 40, h: 27, size: 37, weight: 700, color: "#ffffff",
      get: function (s) { return String(s.battery); } },

    { id: "deger", right: 211, top: 179, h: 44, size: 50, weight: 600, color: "#0a0a12",
      get: function (s, A) { return A.num(s.deger, 2) + " TL"; } },

    { id: "caret", left: 1130, top: 179, h: 44, size: 40, weight: 600,
      get: function (s) {
        var up = s.degisim >= 0;
        return { color: up ? "#0b5f27" : "#c0392b", html:
          '<svg width="52" height="34" viewBox="0 0 52 34">' +
          '<path d="' + (up ? "M4 26 L26 8 L48 26" : "M4 8 L26 26 L48 8") +
          '" fill="none" stroke="currentColor" stroke-width="6" ' +
          'stroke-linecap="round" stroke-linejoin="round"/></svg>' };
      } },

    { id: "pct", right: 220, top: 251, h: 35, size: 37, weight: 600,
      get: function (s, A) {
        return { color: s.degisim >= 0 ? "#0b5f27" : "#c0392b",
                 text: (s.degisim < 0 ? "- " : "+ ") + "%" + A.num(Math.abs(s.degisim), 2) };
      } },

    { id: "adet",    right: 97, top: 372, h: 49, size: 51, weight: 700, color: "#0a0a12",
      get: function (s, A) { return A.num(s.adet, 2) + " Adet"; } },
    { id: "fiyat",   right: 97, top: 454, h: 47, size: 49, weight: 700, color: "#0a0a12",
      get: function (s, A) { return A.num(s.fiyat, 2) + " TL"; } },
    { id: "maliyet", right: 97, top: 535, h: 47, size: 50, weight: 700, color: "#0a0a12",
      get: function (s, A) { return A.num(s.maliyet, 2) + " TL"; } },

    { id: "kz", right: 96, top: 614, h: 45, size: 46, weight: 700,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#085b25" : "#c0392b",
                 text: (s.kz < 0 ? "- " : "+ ") + A.num(Math.abs(s.kz), 2) + " TL" };
      } }
  ]
};
