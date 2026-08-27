/* Arrow colours sampled from the source: profit rises green, loss falls in the
   same orange the app uses for a down day. */
var UP = "#a0eb1d", DOWN = "#ff6d27";

/* The two percentage rows print the magnitude only — the arrow beside them
   carries the sign, and it sits at a fixed x whatever the number's width. So
   the arrow is its own overlay rather than part of the percentage's run. */
function arrow(kz, h) {
  var up = kz >= 0;
  var d = up ? "M14 1 L27 " + h + " L1 " + h + " Z"
             : "M14 " + h + " L27 1 L1 1 Z";
  return { html: '<svg width="28" height="' + h + '" viewBox="0 0 28 ' + h + '">' +
                 '<path d="' + d + '" fill="' + (up ? UP : DOWN) + '"/></svg>' };
}

window.SCREEN = {
  slug: "etiler",
  canvas: [946, 2048],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "11:56", raw: true },
    { id: "adet", label: "Stok (adet)", def: 3 },
    { id: "fiyat", label: "Fiyat", def: 191.90 },
    { id: "maliyet", label: "Ortalama Maliyet", def: 192.00 }
  ],

  seed: { deger: 575.70, maliyetTop: 576.00, kz: -0.30, kzp: -0.05 },

  /* One holding, so the portfolio totals and the row totals are the same
     numbers — the screen prints each of them twice. */
  derive: function (s) {
    var deger = s.adet * s.fiyat;
    var maliyetTop = s.adet * s.maliyet;
    var kz = deger - maliyetTop;
    return {
      deger: deger,
      maliyetTop: maliyetTop,
      kz: kz,
      kzp: maliyetTop ? (kz / maliyetTop) * 100 : 0
    };
  },

  overlays: [
    { id: "clock", left: 79, top: 48, h: 31, size: 50, weight: 600, color: "#ffffff",
      get: function (s) { return s.saat; } },

    /* The donut figure is centred on the ring (inner span x190-755, centre 472)
       rather than anchored left: IEYHO's totals run far wider than the source's
       three-lot holding did, and a left anchor pushed them out over the ring. */
    { id: "deger", cx: 472, top: 667, h: 33, size: 62, weight: 600, color: "#ffffff",
      get: function (s, A) {
        var v = A.num(s.deger, 2).split(",");
        return { html: v[0] + "," +
          '<span style="font-size:.6em;align-self:flex-start;margin-left:3px">' +
          v[1] + " TL</span>" };
      } },

    // portfolio summary
    { id: "topCost", right: 40, top: 1102, h: 34, size: 39, weight: 500, color: "#feffff",
      get: function (s, A) { return A.num(s.maliyetTop, 2) + " TL"; } },
    { id: "topKz", right: 40, top: 1190, h: 35, size: 39, weight: 500, color: "#feffff",
      get: function (s, A) { return A.num(s.kz, 2) + " TL"; } },
    { id: "topPct", right: 104, top: 1257, h: 30, size: 38, weight: 500, color: "#feffff",
      get: function (s, A) { return "%" + A.num(Math.abs(s.kzp), 2); } },
    { id: "topArrow", left: 869, top: 1270, h: 18,
      get: function (s) { return arrow(s.kz, 18); } },

    // the IEYHO row
    { id: "rowDeger", right: 40, top: 1500, h: 30, size: 33, weight: 500, color: "#c9d5df",
      get: function (s, A) { return A.num(s.deger, 2) + " TL"; } },
    { id: "rowCost", right: 40, top: 1560, h: 29, size: 34, weight: 500, color: "#cad6df",
      get: function (s, A) { return A.num(s.maliyet, 2) + " TL"; } },
    { id: "rowStok", right: 40, top: 1620, h: 25, size: 34, weight: 500, color: "#c4d0d9",
      get: function (s, A) { return A.num(s.adet, 0); } },
    { id: "rowKz", right: 40, top: 1675, h: 30, size: 34, weight: 500, color: "#c9d4de",
      get: function (s, A) { return A.num(s.kz, 2) + " TL"; } },
    { id: "rowPct", right: 90, top: 1733, h: 30, size: 33, weight: 500, color: "#c9d5df",
      get: function (s, A) { return "%" + A.num(Math.abs(s.kzp), 2); } },
    { id: "rowArrow", left: 869, top: 1742, h: 19,
      get: function (s) { return arrow(s.kz, 19); } }
  ]
};
