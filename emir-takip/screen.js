/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#51d448", NEG = "#e05a52";
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
  slug: "emir-takip",
  canvas: [1290, 1120],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "10:59", raw: true },
    { id: "adet", label: "Adet", def: 17685 },
    { id: "fiyat", label: "Fiyat", def: 179.3 },
    { id: "maliyet", label: "Maliyet", def: 168.7 }
  ],

  seed: { mtop: 2982970.5, deger: 3179224.5, kz: 196254.0, kzp: 6.57 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {mtop:m,deger:d,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "mtop", cx: 245, top: 474, h: 38, size: 44, weight: 600, color: "#fbfbfb",
      get: function (s, A) { return A.num(s.mtop,2)+' TL'; } },
    { id: "deger", cx: 645, top: 475, h: 38, size: 43, weight: 600, color: "#fcfcfc",
      get: function (s, A) { return A.num(s.deger,2)+' TL'; } },
    { id: "kz", cx: 1045, top: 474, h: 38, size: 44, weight: 600,
      get: function (s, A) { return KZ(s.kz,A,' TL'); } },
    { id: "kzp", cx: 241, top: 674, h: 38, size: 42, weight: 600,
      get: function (s, A) { return KZP(s.kzp,A); } },
    { id: "adet", cx: 644, top: 676, h: 32, size: 42, weight: 600, color: "#f8f8f8",
      get: function (s, A) { return A.num(s.adet,0); } },
    { id: "maliyet", cx: 1036, top: 673, h: 39, size: 44, weight: 600, color: "#f8f8f8",
      get: function (s, A) { return A.num(s.maliyet,2)+' TL'; } },
    { id: "maliyet2", cx: 333, top: 986, h: 35, size: 40, weight: 500, color: "#f6f6f6",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "fiyat", cx: 618, top: 986, h: 35, size: 40, weight: 500, color: "#f7f7f7",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "kz2", cx: 918, top: 988, h: 33, size: 38, weight: 500,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "kzp2", cx: 1171, top: 988, h: 33, size: 38, weight: 500,
      get: function (s, A) { return KZP(s.kzp,A); } },
    { id: "adet2", cx: 336, top: 1047, h: 22, size: 30, weight: 400, color: "#eaeaea",
      get: function (s, A) { return A.num(s.adet,0)+' Adet'; } },
    { id: "clock", left: 35, top: 15, h: 36, size: 38, weight: 600, color: "#f3ffff",
      get: function (s, A) { return s.saat; } }
  ]
};
