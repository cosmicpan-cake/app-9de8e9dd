/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#0a7e47", NEG = "#c0392b";
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
  slug: "ykb-dunyam",
  canvas: [1290, 1499],
  locale: "tr-TR",
  battery: 74,

  fields: [
    { id: "saat", label: "Saat", def: "13:07", raw: true },
    { id: "adet", label: "Adet", def: 23000 },
    { id: "fiyat", label: "Fiyat", def: 180.0 },
    { id: "maliyet", label: "Maliyet", def: 159.1 },
    { id: "net", label: "Net (TL)", def: 165300.0 }
  ],

  seed: { deger: 4132800.0, kz: 472500.0, kzp: 13.12 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "deger", left: 167, top: 514, h: 53, size: 60, weight: 700, color: "#000000",
      get: function (s, A) { return A.num(s.deger,2)+'TL'; } },
    { id: "net", right: 89, top: 517, h: 53, size: 60, weight: 700,
      get: function (s, A) { return KZ(s.net,A,'TL'); } },
    { id: "deger2", left: 310, top: 835, h: 46, size: 50, weight: 700, color: "#000000",
      get: function (s, A) { return A.num(s.deger,2)+'TL'; } },
    { id: "adet", right: 457, top: 1080, h: 28, size: 37, weight: 500, color: "#000000",
      get: function (s, A) { return A.num(s.adet,0); } },
    { id: "deger3", right: 88, top: 1076, h: 34, size: 41, weight: 500, color: "#000000",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "fiyat", right: 96, top: 1208, h: 34, size: 36, weight: 700, color: "#000002",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "maliyet", right: 96, top: 1279, h: 34, size: 36, weight: 700, color: "#000001",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "kz", right: 97, top: 1349, h: 34, size: 37, weight: 700,
      get: function (s, A) { return KZ(s.kz,A,''); } },
    { id: "kzp", right: 97, top: 1420, h: 34, size: 37, weight: 700,
      get: function (s, A) { return KZP(s.kzp,A); } },
    { id: "clock", left: 73, top: 23, h: 29, size: 44, weight: 600, color: "#000000",
      get: function (s, A) { return s.saat; } },
    { id: "batt", cx: 1207, top: 27, h: 23, size: 27, weight: 700, color: "#ffffff",
      get: function (s, A) { return String(s.battery); } }
  ]
};
