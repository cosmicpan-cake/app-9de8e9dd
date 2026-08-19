/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#24bc62", NEG = "#e2456a";
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
  slug: "sembol-tablo",
  canvas: [1290, 1343],
  locale: "en-US",

  fields: [
    { id: "adet", label: "Adet", def: 68900 },
    { id: "fiyat", label: "Fiyat", def: 178.9 },
    { id: "maliyet", label: "Maliyet", def: 157.6 }
  ],

  seed: { deger: 12330990.0, kz: 1469210.0, kzp: 11.91 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "adet", right: 51, top: 189, h: 54, size: 56, weight: 600, color: "#fbffff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "fiyat", right: 51, top: 356, h: 43, size: 58, weight: 600, color: "#fbfdff",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "kz", right: 52, top: 509, h: 62, size: 60, weight: 600,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "maliyet", right: 52, top: 709, h: 43, size: 58, weight: 600, color: "#fbfeff",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "deger", right: 51, top: 909, h: 53, size: 58, weight: 600, color: "#fbfeff",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "kzp", right: 60, top: 1073, h: 45, size: 63, weight: 600,
      get: function (s, A) { return KZP0(s.kzp,A); } },
    { id: "sadet", right: 51, top: 1230, h: 57, size: 57, weight: 600, color: "#fcfeff",
      get: function (s, A) { return A.num(s.adet,2); } }
  ]
};
