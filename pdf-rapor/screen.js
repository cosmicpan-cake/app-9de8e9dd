/* Value formatters shared by this screen's overlays. */
function TL(v, A) { return A.num(v, 2); }

window.SCREEN = {
  slug: "pdf-rapor",
  canvas: [1312, 251],
  locale: "tr-TR",

  fields: [
    { id: "bas",   label: "Rapor Başlangıcı", def: "04.08.2026", raw: true },
    { id: "bit",   label: "Rapor Bitişi",       def: "11.08.2026", raw: true },
    { id: "tarih", label: "İşlem Tarihi", def: "05.08.2026", raw: true },
    { id: "adet",  label: "Lot",   def: 300000 },
    { id: "fiyat", label: "Fiyat", def: 171.00 }
  ],

  seed: { tutar: 51300000.00 },

  // The report's own arithmetic is exact: lot x price is the buy total, and the
  // net column is that total the other way round.
  derive: function (s) { return { tutar: s.adet * s.fiyat }; },

  overlays: [
    // ---- the report header ----
    // "Tarih Aralığı:" stays in the plate; only the span is editable.
    { id: "aralik", left: 151, top: 22, h: 16, size: 16, weight: 700, color: "#030305",
      get: function (s) { return s.bas + " - " + s.bit; } },

    // ---- the IEYHO trade line ----
    { id: "tarih", left: 65, top: 106, h: 12, size: 16, weight: 400, color: "#0a090c",
      get: function (s) { return s.tarih; } },
    { id: "fiyat", right: 887, top: 106, h: 15, size: 15, weight: 400, color: "#0b0d11",
      get: function (s, A) { return A.num(s.fiyat, 4); } },
    { id: "alisLot", right: 768, top: 104, h: 15, size: 16, weight: 400, color: "#0b0d11",
      get: function (s, A) { return TL(s.adet, A); } },
    { id: "netLot", right: 548, top: 104, h: 15, size: 16, weight: 400, color: "#0b0d11",
      get: function (s, A) { return TL(s.adet, A); } },
    { id: "alisTutar", right: 421, top: 104, h: 15, size: 16, weight: 400, color: "#0b0d11",
      get: function (s, A) { return TL(s.tutar, A); } },
    { id: "netToplam", right: 170, top: 104, h: 15, size: 16, weight: 400, color: "#0b0d11",
      get: function (s, A) { return TL(-s.tutar, A); } },
    { id: "toplam", right: 42, top: 104, h: 15, size: 16, weight: 400, color: "#0b0d11",
      get: function (s, A) { return TL(s.tutar, A); } },

    // ---- the Toplam line ----
    { id: "fiyat2", right: 887, top: 166, h: 15, size: 15, weight: 400, color: "#0f0e0c",
      get: function (s, A) { return A.num(s.fiyat, 4); } },
    { id: "alisLot2", right: 768, top: 163, h: 15, size: 15, weight: 400, color: "#0f0e0c",
      get: function (s, A) { return TL(s.adet, A); } },
    { id: "netLot2", right: 548, top: 163, h: 15, size: 15, weight: 400, color: "#0f0e0c",
      get: function (s, A) { return TL(s.adet, A); } },
    { id: "alisTutar2", right: 421, top: 161, h: 15, size: 16, weight: 400, color: "#0f0e0c",
      get: function (s, A) { return TL(s.tutar, A); } },
    { id: "netToplam2", right: 170, top: 161, h: 15, size: 16, weight: 400, color: "#0f0e0c",
      get: function (s, A) { return TL(-s.tutar, A); } },
    { id: "toplam2", right: 42, top: 161, h: 15, size: 16, weight: 400, color: "#0f0e0c",
      get: function (s, A) { return TL(s.tutar, A); } },

    // ---- the closing line ----
    { id: "alisLot3", right: 768, top: 191, h: 15, size: 15, weight: 400, color: "#0b0d0d",
      get: function (s, A) { return TL(s.adet, A); } },
    { id: "netLot3", right: 548, top: 189, h: 15, size: 16, weight: 400, color: "#0b0d0d",
      get: function (s, A) { return TL(s.adet, A); } },
    { id: "alisTutar3", right: 421, top: 189, h: 15, size: 16, weight: 400, color: "#0b0d0d",
      get: function (s, A) { return TL(s.tutar, A); } },
    { id: "netToplam3", right: 170, top: 189, h: 15, size: 16, weight: 400, color: "#0b0d0d",
      get: function (s, A) { return TL(-s.tutar, A); } },
    { id: "toplam3", right: 42, top: 189, h: 15, size: 16, weight: 400, color: "#0b0d0d",
      get: function (s, A) { return TL(s.tutar, A); } }
  ]
};
