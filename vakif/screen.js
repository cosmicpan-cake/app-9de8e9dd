/* Kâr/Zarar prints red when the position is down; the red is sampled from the
   source. No screenshot of a winning position was supplied, so the green is a
   choice rather than a measurement. */
var NEG = "#c50520", POS = "#00944a";

window.SCREEN = {
  slug: "vakif",
  canvas: [907, 2048],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "12:22", raw: true },
    { id: "adet", label: "Satılabilir Adet", def: 1 },
    { id: "bloke", label: "Bloke Adet", def: 0 },
    { id: "fiyat", label: "Son İşlem Fiyatı", def: 220.50 },
    { id: "birimMaliyet", label: "Birim Maliyet", def: 221.02 }
  ],

  seed: { tutar: 220.50, maliyetTutar: 221.02, karZarar: -0.52 },

  /* Both totals are struck on the whole holding - blocked shares are still
     owned, they just cannot be sold. The source has no blocked lots, so this
     is the reading of it rather than something the screenshot proves. */
  derive: function (s) {
    var toplam = s.adet + s.bloke;
    var tutar = toplam * s.fiyat;
    var maliyetTutar = toplam * s.birimMaliyet;
    return { tutar: tutar, maliyetTutar: maliyetTutar, karZarar: tutar - maliyetTutar };
  },

  overlays: [
    { id: "clock", left: 53, top: 39, h: 20, size: 34.0, weight: 500, color: "#ffffff",
      get: function (s) { return s.saat; } },

    // the value column shares one right edge, so it stays aligned at any length
    { id: "satAdet", right: 76, top: 855, h: 33, size: 42.0, weight: 400, color: "#242424",
      get: function (s, A) { return A.num(s.adet, 2); } },
    { id: "bloke", right: 76, top: 986, h: 33, size: 40.4, weight: 400, color: "#242424",
      get: function (s, A) { return A.num(s.bloke, 2); } },
    { id: "sonFiyat", right: 76, top: 1117, h: 33, size: 42.0, weight: 400, color: "#212121",
      get: function (s, A) { return A.num(s.fiyat, 2) + " TL"; } },
    { id: "birimMal", right: 76, top: 1248, h: 33, size: 42.0, weight: 400, color: "#212121",
      get: function (s, A) { return A.num(s.birimMaliyet, 2) + " TL"; } },
    { id: "maliyetT", right: 76, top: 1380, h: 32, size: 42.0, weight: 400, color: "#212121",
      get: function (s, A) { return A.num(s.maliyetTutar, 2) + " TL"; } },
    { id: "karZarar", right: 76, top: 1511, h: 33, size: 40.9, weight: 400, color: NEG,
      get: function (s, A) {
        return { color: s.karZarar < 0 ? NEG : POS,
                 text: A.num(s.karZarar, 2) + " TL" };
      } },
    { id: "tutar", right: 76, top: 1642, h: 35, size: 42.4, weight: 600, color: "#222222",
      get: function (s, A) { return A.num(s.tutar, 2) + " TL"; } }
  ]
};
