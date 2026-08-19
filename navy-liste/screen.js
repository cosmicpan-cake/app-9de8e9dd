/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#16b36f", NEG = "#e2456a";
function KZ(v, A, suf) { return { color: v >= 0 ? POS : NEG, text: A.num(v, 2) + suf }; }
function KZP(v, A)     { return { color: v >= 0 ? POS : NEG, text: "%" + A.num(Math.abs(v), 2) }; }
function KZP0(v, A)    { return { color: v >= 0 ? POS : NEG, text: A.num(v, 2) }; }
function KZP2(v, A)    { return { color: v >= 0 ? POS : NEG, text: A.num(v, 2) + " %" }; }
function KZP3(v, A)    { return { color: v >= 0 ? POS : NEG, text: A.num(v, 2) + "%" }; }
function ARROW(v, A) {
  return { color: v >= 0 ? POS : NEG,
           html: "%" + A.num(Math.abs(v), 2) +
                 ' <span style="font-size:0.8em">' + (v >= 0 ? "\u25b2" : "\u25bc") + "</span>" };
}
/* Price and daily change share one line, and only the change is coloured. */
function FIYATLN(s, A) {
  return { color: "#282828",
           html: A.num(s.fiyat, 2) + " TL / " +
                 '<span style="color:' + (s.degisim < 0 ? NEG : POS) + '">%' +
                 A.num(Math.abs(s.degisim), 2) + "</span>" };
}
/* The donut total prints its kurus and currency small and raised. */
function BIGDEGER(v, A) {
  return { html: A.num(Math.trunc(v), 0) +
                 ',<span class="small" style="align-self:flex-start">' +
                 A.num(v, 2).slice(-2) + " TL</span>" };
}

window.SCREEN = {
  slug: "navy-liste",
  canvas: [1290, 1430],
  locale: "en-US",

  fields: [
    { id: "saat", label: "Saat", def: "11:55", raw: true },
    { id: "adet", label: "Adet", def: 63000 },
    { id: "fiyat", label: "Fiyat", def: 179.5 },
    { id: "maliyet", label: "Maliyet", def: 157.6 }
  ],

  seed: { kz: 1379700.0 },

  derive: function (s) { return {kz:s.adet*(s.fiyat-s.maliyet)}; },

  overlays: [
    { id: "adet", cx: 492, top: 610, h: 64, size: 49, weight: 700, color: "#f5f7ff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "fiyat", cx: 798, top: 609, h: 64, size: 47, weight: 700, color: "#f2f4fd",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "kz", right: 41, top: 610, h: 64, size: 45, weight: 700,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "kz2", right: 39, top: 858, h: 60, size: 45, weight: 700,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "kz3", right: 40, top: 1155, h: 59, size: 45, weight: 700,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "sadet", left: 156, top: 614, h: 54, size: 36, weight: 600, color: "#e9f0ff",
      get: function (s, A) { return A.num(s.adet,0); } },
    { id: "maliyet", left: 157, top: 665, h: 54, size: 38, weight: 600, color: "#e3ebfc",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "adet2", left: 117, top: 719, h: 50, size: 37, weight: 600, color: "#ebf4ff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "clock", left: 97, top: 24, h: 58, size: 57, weight: 600, color: "#f4f6ff",
      get: function (s, A) { return s.saat; } }
  ]
};
