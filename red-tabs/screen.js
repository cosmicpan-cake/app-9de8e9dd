window.SCREEN = {
  slug: "red-tabs",
  canvas: [591, 1280],
  locale: "tr-TR",

  battery: 68,

  fields: [
    { id: "saat", label: "Saat", def: "12:33", raw: true },
    { id: "adet",    label: "Adet",       def: 69200 },
    { id: "fiyat",   label: "Son Fiyat",  def: 179.50 },
    { id: "maliyet", label: "Maliyet",    def: 168.70 },
    { id: "nakit",   label: "TRY Bakiye", def: 105223.18 }
  ],

  // Toplam Değer includes the TRY cash line as well as the stock position.
  seed: { kz: 733160.00, toplam: 12526363.18 },

  derive: function (s) {
    return {
      kz:     s.adet * (s.fiyat - s.maliyet),
      toplam: s.adet * s.fiyat + s.nakit
    };
  },

  overlays: [
    { id: "clock", left: 48, top: 29, h: 18, size: 25, weight: 600, color: "#000000",
      get: function (s) { return s.saat; } },
    { id: "batt", cx: 545, top: 32, h: 13, size: 18, weight: 700, color: "#ffffff",
      get: function (s) { return String(s.battery); } },

    { id: "adet",    right: 311, top: 397, h: 41, size: 18, weight: 600, color: "#111111",
      get: function (s, A) { return A.num(s.adet, 2); } },
    { id: "maliyet", right: 174, top: 397, h: 41, size: 20, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.maliyet, 3); } },

    // The K/Z pill is redrawn rather than part-erased, so its corners stay round.
    { id: "kzPill", left: 455, top: 392, w: 105, h: 46, size: 17, weight: 600,
      bg: "#baf3c0", radius: 8,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#268a2a" : "#b3261e", text: A.num(s.kz, 2) };
      } },

    // Hesap Özeti
    { id: "toplam", right: 364, top: 1100, h: 22, size: 23, weight: 700, color: "#111111",
      get: function (s, A) { return A.num(s.toplam, 2); } },
    { id: "toplamKz", right: 99, top: 1095, h: 22, size: 24, weight: 700,
      get: function (s, A) {
        return { color: s.kz >= 0 ? "#3f8a1e" : "#b3261e", text: A.num(s.kz, 2) };
      } }
  ]
};
