/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#16d527", NEG = "#ef5350";
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
  slug: "cepteteb",
  canvas: [926, 1600],
  locale: "tr-TR",
  battery: 90,

  fields: [
    { id: "saat", label: "Saat", def: "10:43", raw: true },
    { id: "adet", label: "Adet", def: 70000 },
    { id: "fiyat", label: "Fiyat", def: 179.6 },
    { id: "maliyet", label: "Maliyet", def: 168.3 }
  ],

  seed: { deger: 12572000.0, mtop: 11781000.0, kz: 791000.0, kzp: 6.72 },

  derive: function (s) { var m=s.adet*s.maliyet,d=s.adet*s.fiyat;return {deger:d,mtop:m,kz:d-m,kzp:m?(d-m)/m*100:0}; },

  overlays: [
    { id: "deger", cx: 463, top: 604, h: 57, size: 62, weight: 600, color: "#fcffff",
      get: function (s, A) { return BIGDEGER(s.deger,A); } },
    { id: "pct", right: 421, top: 746, h: 24, size: 33, weight: 500, color: "#b4c4d2",
      get: function (s, A) { return '% 100'; } },
    { id: "mtop", right: 41, top: 982, h: 29, size: 37, weight: 500, color: "#f8ffff",
      get: function (s, A) { return A.num(s.mtop,2)+' TL'; } },
    { id: "kz", right: 41, top: 1063, h: 30, size: 35, weight: 500, color: "#f8ffff",
      get: function (s, A) { return A.num(s.kz,2)+' TL'; } },
    { id: "kzp", right: 48, top: 1117, h: 32, size: 38, weight: 500,
      get: function (s, A) { return ARROW(s.kzp,A); } },
    { id: "pct2", right: 52, top: 1218, h: 27, size: 31, weight: 500, color: "#c0d1de",
      get: function (s, A) { return '%100,00'; } },
    { id: "deger2", right: 50, top: 1299, h: 26, size: 31, weight: 500, color: "#f4ffff",
      get: function (s, A) { return A.num(s.deger,2)+' TL'; } },
    { id: "maliyet", right: 50, top: 1350, h: 26, size: 31, weight: 500, color: "#f6ffff",
      get: function (s, A) { return A.num(s.maliyet,2)+' TL'; } },
    { id: "fiyat", right: 50, top: 1400, h: 26, size: 31, weight: 500, color: "#f5ffff",
      get: function (s, A) { return A.num(s.fiyat,2)+' TL'; } },
    { id: "adet", right: 51, top: 1452, h: 23, size: 30, weight: 500, color: "#f4ffff",
      get: function (s, A) { return A.num(s.adet,0); } },
    { id: "kz2", right: 50, top: 1501, h: 26, size: 31, weight: 500, color: "#f4ffff",
      get: function (s, A) { return A.num(s.kz,2)+' TL'; } },
    { id: "kzp2", right: 53, top: 1545, h: 28, size: 35, weight: 500,
      get: function (s, A) { return ARROW(s.kzp,A); } },
    { id: "clock", left: 90, top: 36, h: 28, size: 42, weight: 600, color: "#fbffff",
      get: function (s, A) { return s.saat; } },
    { id: "batt", cx: 839, top: 40, h: 21, size: 30, weight: 700, color: "#041013",
      get: function (s, A) { return String(s.battery); } },
    // The marker strokes are drawn over the ones baked into the plate, nudged a
    // little on each visit so repeated screenshots do not carry an identical
    // scribble. The baked ones stay put, so nothing underneath is uncovered.
    { id: "marker", left: 39, top: 134, h: 75, size: 1, weight: 400,
      get: function () {
        function jitter(n) { return (Math.random() * 2 - 1) * n; }
        return { html: '<img src="marker.png" width="843" height="75" ' +
                 'style="transform:translate(' + jitter(5).toFixed(1) + 'px,' +
                 jitter(4).toFixed(1) + 'px) rotate(' + jitter(2.2).toFixed(2) +
                 'deg) scale(' + (1 + jitter(0.035)).toFixed(3) + ');' +
                 'transform-origin:center center">' };
      } }
  ]
};
