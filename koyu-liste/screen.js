/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#1c8a28", NEG = "#c62828";
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
  slug: "koyu-liste",
  canvas: [1184, 1600],
  locale: "en-US",

  fields: [
    { id: "saat", label: "Saat", def: "13:18", raw: true },
    { id: "adet", label: "Adet", def: 48500 },
    { id: "fiyat", label: "Fiyat", def: 179.4 },
    { id: "maliyet", label: "Maliyet", def: 157.6 }
  ],

  seed: { deger: 8878520.0, kz: 787920.0, kzp: 10.07 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "adet", right: 42, top: 381, h: 50, size: 56, weight: 600, color: "#fcfeff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "fiyat", right: 45, top: 535, h: 44, size: 55, weight: 600, color: "#fcfeff",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "kz", right: 45, top: 686, h: 54, size: 54, weight: 600,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "maliyet", right: 44, top: 842, h: 43, size: 57, weight: 600, color: "#fdffff",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "deger", right: 42, top: 1068, h: 50, size: 55, weight: 600, color: "#fcfeff",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "kzp", right: 45, top: 1221, h: 43, size: 55, weight: 600,
      get: function (s, A) { return KZP0(s.kzp,A); } },
    { id: "sadet", right: 45, top: 1367, h: 50, size: 56, weight: 600, color: "#fcfeff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "clock", left: 48, top: 4, h: 37, size: 53, weight: 600, color: "#fcfeff",
      get: function (s, A) { return s.saat; } }
  ]
};
