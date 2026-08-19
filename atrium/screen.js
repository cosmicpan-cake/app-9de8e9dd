/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#5ab246", NEG = "#e05252";
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
  slug: "atrium",
  canvas: [1185, 1600],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "13:41", raw: true },
    { id: "adet", label: "Adet", def: 26200 },
    { id: "fiyat", label: "Fiyat", def: 179.9 },
    { id: "maliyet", label: "Maliyet", def: 159.1 }
  ],

  seed: { deger: 4712380.0, mtop: 4169420.0, kz: 542960.0, kzp: 13.02 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,mtop:m,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "adet", right: 56, top: 357, h: 36, size: 39, weight: 700, color: "#fbfeff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "sadet", right: 56, top: 449, h: 36, size: 39, weight: 700, color: "#fbfeff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "fiyat", right: 55, top: 541, h: 36, size: 38, weight: 700, color: "#fbfeff",
      get: function (s, A) { return A.num(s.fiyat,2)+' TL'; } },
    { id: "deger", right: 55, top: 634, h: 35, size: 39, weight: 700, color: "#fbfeff",
      get: function (s, A) { return A.num(s.deger,2)+' TL'; } },
    { id: "mtop", right: 55, top: 726, h: 35, size: 39, weight: 700, color: "#fbfeff",
      get: function (s, A) { return A.num(s.mtop,2)+' TL'; } },
    { id: "kz", right: 56, top: 816, h: 39, size: 39, weight: 700,
      get: function (s, A) { return KZ(s.kz,A,' TL'); } },
    { id: "maliyet", cx: 327, top: 1048, h: 35, size: 42, weight: 600, color: "#fbfeff",
      get: function (s, A) { return A.num(s.maliyet,2)+' TL'; } },
    { id: "fiyat2", cx: 833, top: 1047, h: 35, size: 41, weight: 600, color: "#fbfeff",
      get: function (s, A) { return A.num(s.fiyat,2)+' TL'; } },
    { id: "kz2", cx: 326, top: 1255, h: 36, size: 40, weight: 600,
      get: function (s, A) { return KZ(s.kz,A,' TL'); } },
    { id: "kzp", cx: 822, top: 1256, h: 35, size: 40, weight: 600,
      get: function (s, A) { return KZP3(s.kzp,A); } },
    { id: "clock", left: 51, top: 15, h: 34, size: 46, weight: 600, color: "#fbfeff",
      get: function (s, A) { return s.saat; } }
  ]
};
