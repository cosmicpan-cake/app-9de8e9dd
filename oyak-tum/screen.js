/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#5f973e", NEG = "#c0392b";
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
  slug: "oyak-tum",
  canvas: [1051, 1600],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "13:21", raw: true },
    { id: "adet", label: "Adet", def: 20478 },
    { id: "fiyat", label: "Fiyat", def: 179.2 },
    { id: "maliyet", label: "Maliyet", def: 157.6 },
    { id: "nakit", label: "Nakit", def: -262.54 }
  ],

  seed: { deger: 3915327.48, kz: 387764.98, kzp: 10.96 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "nakit", right: 35, top: 899, h: 35, size: 36, weight: 600, color: "#000002",
      get: function (s, A) { return A.num(s.nakit,2)+' ₺'; } },
    { id: "nakit2", right: 35, top: 1008, h: 33, size: 35, weight: 500, color: "#020202",
      get: function (s, A) { return A.num(s.nakit,2)+' ₺'; } },
    { id: "kz", left: 419, top: 1133, h: 33, size: 36, weight: 600,
      get: function (s, A) { return KZ(s.kz,A,' ₺'); } },
    { id: "deger", right: 23, top: 1112, h: 30, size: 33, weight: 600, color: "#000004",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "kz2", left: 444, top: 1541, h: 29, size: 30, weight: 700,
      get: function (s, A) { return KZ(s.kz,A,' ₺'); } },
    { id: "kzp", right: 89, top: 1542, h: 29, size: 28, weight: 700,
      get: function (s, A) { return KZP3(s.kzp,A); } },
    { id: "clock", left: 54, top: 19, h: 29, size: 41, weight: 600, color: "#000000",
      get: function (s, A) { return s.saat; } },
    { id: "adet", cx: 477, top: 1372, h: 33, size: 36, weight: 500, color: "#010101",
      get: function (s, A) { return A.num(s.adet,2); } },
    { id: "fiyat", cx: 715, top: 1372, h: 33, size: 36, weight: 500, color: "#010101",
      get: function (s, A) { return A.num(s.fiyat,2); } },
    { id: "deger2", right: 22, top: 1354, h: 32, size: 36, weight: 500, color: "#030303",
      get: function (s, A) { return A.num(s.deger,2); } },
    { id: "maliyet", left: 113, top: 1540, h: 29, size: 32, weight: 500, color: "#080808",
      get: function (s, A) { return A.num(s.maliyet,2)+' ₺'; } }
  ]
};
