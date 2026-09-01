/* Colours sampled from the source: the day's return prints green, and the red
   is the one the app uses for its falling candle. */
var POS = "#1e9f70", NEG = "#dd4a29";
var TL = "₺";

window.SCREEN = {
  slug: "midas",
  canvas: [739, 1600],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "18:06", raw: true },
    { id: "haber", label: "Haber zamanı", def: "8 saat önce", raw: true },
    { id: "adet", label: "Adet", def: 6561 },
    { id: "fiyat", label: "Fiyat", def: 190.50 },
    /* The source's %0,32 is a rounded 0,3159: its previous close was exactly
       189,90, which is what makes the day's return come out at 3.936,60.
       Keeping the true figure here reproduces the screenshot; any value the
       user or the live feed supplies flows through the same way. */
    { id: "degisim", label: "Değişim %", def: 0.3159, signed: true },
    { id: "ortFiyat", label: "Ort. fiyat", def: 179.00 },
    { id: "stopFiyat", label: "Zarar durdur fiyatı", def: 185.00 },
    { id: "dagilim", label: "Portföy dağılımı %", def: 30.10 }
  ],

  seed: { toplam: 1249870.50, stopTutar: 1213785.00, getiri: 3936.60 },

  derive: function (s) {
    var d = s.degisim == null ? 0 : s.degisim;
    // the day's return is the position measured against yesterday's close
    var onceki = s.fiyat / (1 + d / 100);
    return {
      toplam: s.adet * s.fiyat,
      stopTutar: s.adet * s.stopFiyat,
      getiri: s.adet * (s.fiyat - onceki)
    };
  },

  overlays: [
    { id: "clock", left: 79, top: 37, h: 23, size: 36.7, weight: 600, color: "#000000",
      get: function (s) { return s.saat; } },

    { id: "hdrPrice", left: 113, top: 142, h: 19, size: 23.8, weight: 500, color: "#4e4e53",
      get: function (s, A) { return TL + A.num(s.fiyat, 2); } },

    { id: "haber", left: 40, top: 457, h: 16, size: 24.6, weight: 400, color: "#908f93",
      get: function (s) { return s.haber; } },

    // the pending stop order covers the whole position
    { id: "stopTutar", right: 69, top: 832, h: 26, size: 31.2, weight: 600, color: "#000000",
      get: function (s, A) { return TL + A.num(s.stopTutar, 2); } },
    { id: "stopAlt", left: 38, top: 856, h: 20, size: 24.0, weight: 400, color: "#47474c",
      get: function (s, A) { return "Bekliyor · " + TL + A.num(s.stopFiyat, 2); } },

    // Pozisyonum
    { id: "adet", left: 40, top: 1150, h: 22, size: 33.0, weight: 500, color: "#000000",
      get: function (s, A) { return A.num(s.adet, 0); } },
    { id: "toplam", left: 401, top: 1147, h: 28, size: 33.8, weight: 500, color: "#000000",
      get: function (s, A) { return TL + A.num(s.toplam, 2); } },
    { id: "ortFiyat", left: 39, top: 1272, h: 28, size: 33.4, weight: 500, color: "#000000",
      get: function (s, A) { return TL + A.num(s.ortFiyat, 2); } },
    { id: "dagilim", left: 402, top: 1272, h: 28, size: 32.6, weight: 500, color: "#000000",
      get: function (s, A) { return "%" + A.num(s.dagilim, 2); } },

    { id: "getiri", right: 40, top: 1345, h: 23, size: 26.5, weight: 500, color: POS,
      get: function (s, A) {
        var neg = s.getiri < 0;
        var d = s.degisim == null ? 0 : s.degisim;
        return {
          color: neg ? NEG : POS,
          text: (neg ? "-" : "") + TL + A.num(Math.abs(s.getiri), 2) +
                " (%" + (neg ? "-" : "") + A.num(Math.abs(d), 2) + ")"
        };
      } }
  ]
};
