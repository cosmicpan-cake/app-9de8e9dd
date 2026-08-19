/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#38db84", NEG = "#ec5f6e";
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
  slug: "varlik-detay",
  canvas: [1290, 1410],
  locale: "tr-TR",
  battery: 86,

  fields: [
    { id: "saat", label: "Saat", def: "12:30", raw: true },
    { id: "adet", label: "Adet", def: 44600 },
    { id: "fiyat", label: "Fiyat", def: 179.9 },
    { id: "maliyet", label: "Maliyet", def: 168.7 }
  ],

  seed: { deger: 7991400.0, kz: 200820.0, kzp: 2.74 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "fiyat", right: 105, top: 441, h: 43, size: 48, weight: 600, color: "#fcffff",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "adet", right: 106, top: 583, h: 43, size: 48, weight: 600, color: "#fcffff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "maliyet", right: 106, top: 730, h: 43, size: 48, weight: 600, color: "#fdffff",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "deger", right: 106, top: 876, h: 43, size: 48, weight: 600, color: "#fcffff",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "kz", right: 107, top: 1021, h: 45, size: 49, weight: 600,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "kzp", right: 107, top: 1165, h: 44, size: 46, weight: 600,
      get: function (s, A) { return KZP2(s.kzp,A); } },
    { id: "sadet", right: 107, top: 1308, h: 44, size: 49, weight: 600, color: "#fdffff",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "clock", left: 67, top: 36, h: 37, size: 54, weight: 600, color: "#fefeff",
      get: function (s, A) { return s.saat; } },
    { id: "batt", cx: 1193, top: 41, h: 29, size: 40, weight: 700, color: "#030710",
      get: function (s, A) { return String(s.battery); } }
  ]
};
