/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#258d3b", NEG = "#c62828";
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
  slug: "turuncu-varlik",
  canvas: [1058, 1487],
  locale: "en-US",

  fields: [
    { id: "adet", label: "Adet", def: 72400 },
    { id: "fiyat", label: "Fiyat", def: 179.5 },
    { id: "maliyet", label: "Maliyet", def: 161.3 }
  ],

  seed: { deger: 12996800.0, kz: 1316880.0 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat; return {deger:d,kz:d-m}; },

  overlays: [
    { id: "adet", right: 561, top: 64, h: 29, size: 32, weight: 600, color: "#000000",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "deger", right: 297, top: 64, h: 30, size: 33, weight: 600, color: "#000000",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "kz", right: 38, top: 63, h: 29, size: 34, weight: 600,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "fiyat", right: 84, top: 159, h: 25, size: 31, weight: 700, color: "#000000",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "maliyet", right: 84, top: 238, h: 25, size: 30, weight: 700, color: "#000000",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "nakit", right: 341, top: 1150, h: 25, size: 33, weight: 500, color: "#000000",
      get: function (s, A) { return '0.00 TL'; } },
    { id: "nakitp", right: 45, top: 1151, h: 24, size: 31, weight: 500, color: "#000000",
      get: function (s, A) { return '%0.0'; } },
    { id: "deger2", right: 331, top: 1242, h: 30, size: 33, weight: 500, color: "#000000",
      get: function (s, A) { return A.num(s.deger,2)+' TL'; } },
    { id: "hissep", right: 45, top: 1243, h: 25, size: 33, weight: 500, color: "#000000",
      get: function (s, A) { return '%100.0'; } },
    { id: "deger3", right: 44, top: 1337, h: 33, size: 34, weight: 700, color: "#d15f1f",
      get: function (s, A) { return A.num(s.deger,2)+' TL'; } }
  ]
};
