/* Colours sampled from the source. The change is green when the stock is up,
   red when it falls, matching how the header prints it. */
var POS = "#29772d", NEG = "#d0021b";

function PCT(v, A) {
  return { color: v >= 0 ? POS : NEG, text: "% " + A.num(v, 1) };
}

window.SCREEN = {
  slug: "ziraat",
  canvas: [736, 1600],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "09:51", raw: true },
    { id: "adet", label: "Adet", def: 15500 },
    { id: "fiyat", label: "Fiyat", def: 62.70 },
    { id: "degisim", label: "Değişim %", def: 0.0, signed: true },
    { id: "bakiye", label: "Kullanılabilir TL", def: 7102.00 }
  ],

  // an order ticket, so the total is simply quantity times price
  seed: { tutar: 971850.00 },

  derive: function (s) {
    return { tutar: s.adet * s.fiyat };
  },

  overlays: [
    { id: "clock", left: 85, top: 44, h: 17, size: 33, weight: 600, color: "#ffffff",
      get: function (s) { return s.saat; } },

    // the holding is always IEYHO, whatever the source screenshot showed
    { id: "symbol", left: 52, top: 200, h: 19, size: 24, weight: 700, color: "#131314",
      get: function () { return "IEYHO"; } },
    { id: "company", left: 138, top: 202, h: 17, size: 23, weight: 400, color: "#3b3b3b",
      get: function () { return "IŞIKLAR E.Y.H. A.Ş."; } },

    // The quote header prints the price and the change side by side. They are
    // one overlay so the change flows after the price and cannot collide with
    // it — IEYHO's price is far wider than the source's was, and a fixed x for
    // the change overlapped. Inline flow also baseline-aligns them, which is
    // how the source sits.
    { id: "hdrFiyat", left: 52, top: 240, h: 31, size: 44, weight: 700, color: "#141416",
      get: function (s, A) {
        var d = s.degisim == null ? 0 : s.degisim;
        return { html: A.num(s.fiyat, 3) +
          '<span style="font-size:0.5em;font-weight:500;margin-left:14px;color:' +
          (d >= 0 ? POS : NEG) + '">% ' + A.num(d, 1) + "</span>" };
      } },

    // the order form
    { id: "fiyat", left: 52, top: 389, h: 23, size: 27, weight: 600, color: "#0e0e0e",
      get: function (s, A) { return A.num(s.fiyat, 3); } },
    { id: "satAdet", right: 27, top: 465, h: 20, size: 25, weight: 400, color: "#0e0e0e",
      get: function (s, A) { return A.num(s.adet, 0); } },
    { id: "adet", left: 51, top: 528, h: 20, size: 27, weight: 600, color: "#000000",
      get: function (s, A) { return A.num(s.adet, 0); } },
    { id: "kullanTL", right: 63, top: 598, h: 22, size: 25, weight: 400, color: "#0e0e0e",
      get: function (s, A) { return A.num(s.bakiye, 2); } },
    { id: "tutar", left: 51, top: 662, h: 21, size: 27, weight: 600, color: "#0e0e0f",
      get: function (s, A) { return A.num(s.tutar, 2); } }
  ]
};
