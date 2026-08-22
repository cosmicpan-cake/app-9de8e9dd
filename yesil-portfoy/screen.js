/* Value formatters shared by this screen's overlays. Colour follows the sign,
   so a value the user edits into the red turns red the way the app would. */
var POS = "#1c9b4b", NEG = "#c62828";
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
  slug: "yesil-portfoy",
  canvas: [1242, 1600],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "10:29", raw: true },
    { id: "adet", label: "Adet", def: 93261 },
    { id: "fiyat", label: "Fiyat", def: 179.6 },
    { id: "maliyet", label: "Maliyet", def: 168.8 },
    { id: "degisim", label: "Değişim %", def: 4.12, signed: true }
  ],

  seed: { deger: 16203652.3 },

  derive: function (s) { return {deger:s.adet*s.fiyat}; },

  overlays: [
    { id: "deger", left: 893, top: 259, h: 55, size: 39, weight: 700, color: "#ffffff",
      get: function (s, A) { return A.num(s.deger,2)+' TL'; } },
    { id: "fiyatln", left: 900, top: 1308, h: 32, size: 40, weight: 600,
      get: function (s, A) { return FIYATLN(s,A); } },
    { id: "deger2", left: 909, top: 1375, h: 33, size: 39, weight: 600, color: "#252525",
      get: function (s, A) { return A.num(s.deger,2)+' TL'; } },
    { id: "maliyet", left: 1088, top: 1443, h: 32, size: 39, weight: 600, color: "#292929",
      get: function (s, A) { return A.num(s.maliyet,2); } },
    { id: "adet", left: 1010, top: 1509, h: 32, size: 40, weight: 600, color: "#272727",
      get: function (s, A) { return A.num(s.adet,3); } },
    { id: "clock", left: 73, top: 17, h: 54, size: 52, weight: 600, color: "#ffffff",
      get: function (s, A) { return s.saat; } },
    // The marker strokes are drawn over the ones baked into the plate, nudged a
    // little on each visit so repeated screenshots do not carry an identical
    // scribble. The baked ones stay put, so nothing underneath is uncovered.
    { id: "marker", left: 825, top: 281, h: 387, size: 1, weight: 400,
      get: function () {
        function jitter(n) { return (Math.random() * 2 - 1) * n; }
        return { html: '<img src="marker.png" width="417" height="387" ' +
                 'style="transform:translate(' + jitter(5).toFixed(1) + 'px,' +
                 jitter(4).toFixed(1) + 'px) rotate(' + jitter(2.2).toFixed(2) +
                 'deg) scale(' + (1 + jitter(0.035)).toFixed(3) + ');' +
                 'transform-origin:center center">' };
      } }
  ]
};
