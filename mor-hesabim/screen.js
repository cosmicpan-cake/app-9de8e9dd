/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#31b84f", NEG = "#e04b4b";
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
  slug: "mor-hesabim",
  canvas: [1290, 1356],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "13:07", raw: true },
    { id: "adet", label: "Adet", def: 40650 },
    { id: "fiyat", label: "Fiyat", def: 179.6 },
    { id: "maliyet", label: "Maliyet", def: 159.1 }
  ],

  seed: { deger: 7284181.25, kz: 564831.25, kzp: 9.01 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "deger", cx: 300, top: 537, h: 33, size: 40, weight: 600, color: "#fafbfe",
      get: function (s, A) { return A.num(s.deger,2)+' ₺'; } },
    { id: "pct", right: 124, top: 409, h: 29, size: 34, weight: 500, color: "#f7f8fb",
      get: function (s, A) { return '%100,0'; } },
    { id: "deger2", right: 236, top: 981, h: 38, size: 42, weight: 700, color: "#f5f7f9",
      get: function (s, A) { return A.num(s.deger,2)+' ₺'; } },
    { id: "clock", left: 65, top: 24, h: 49, size: 43, weight: 600, color: "#f9f4ff",
      get: function (s, A) { return s.saat; } },
    { id: "adet", cx: 357, top: 1186, h: 28, size: 33, weight: 500, color: "#fafbfe",
      get: function (s, A) { return A.num(s.adet,3); } },
    { id: "maliyet", cx: 545, top: 1186, h: 29, size: 36, weight: 500, color: "#fcfeff",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "kzp", cx: 722, top: 1186, h: 29, size: 33, weight: 500,
      get: function (s, A) { return KZP0(s.kzp,A); } },
    { id: "kz", cx: 916, top: 1186, h: 28, size: 33, weight: 500,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "deger3", cx: 1120, top: 1185, h: 29, size: 33, weight: 500, color: "#f8fafc",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "fiyat", left: 673, top: 1289, h: 29, size: 33, weight: 500,
      get: function (s, A) { return KZ(s.fiyat,A,''); } },
    { id: "maliyet2", left: 1112, top: 1290, h: 28, size: 34, weight: 500, color: "#c7cbce",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "saat2", left: 148, top: 1291, h: 23, size: 32, weight: 500, color: "#cfd2d5",
      get: function (s, A) { return s.saat; } }
  ]
};
