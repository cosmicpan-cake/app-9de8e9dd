/* Value formatters for this screen. Every figure here prints its integer part
   full size and its decimals — plus any unit — smaller, so they share one
   helper rather than repeating the split at each overlay. */
var POS = "#8dc31e", NEG = "#e2456a";

function split(int, dec) {
  return int + '<span class="small">' + dec + "</span>";
}

/* 1.102.541,04 TL -> "1.102.541" large, ",04 TL" small */
function TL(v, A) {
  var t = A.num(v, 2), i = t.lastIndexOf(",");
  return { html: split(t.slice(0, i), t.slice(i) + " TL") };
}

/* three decimals, no unit — the quantity rows */
function LOT(v, A) {
  var t = A.num(v, 3), i = t.lastIndexOf(",");
  return { html: split(t.slice(0, i), t.slice(i)) };
}

function SIGNED_TL(v, A) {
  var t = A.num(Math.abs(v), 2), i = t.lastIndexOf(",");
  return { color: v >= 0 ? POS : NEG,
           html: split((v < 0 ? "-" : "+") + t.slice(0, i), t.slice(i) + " TL") };
}

function PCT(v, A) {
  var t = A.num(Math.abs(v), 2), i = t.lastIndexOf(",");
  return { color: v >= 0 ? POS : NEG,
           html: split((v < 0 ? "- % " : "+ % ") + t.slice(0, i), t.slice(i)) };
}

window.SCREEN = {
  slug: "ykb2",
  canvas: [736, 1600],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "10:02", raw: true },
    { id: "adet", label: "Adet", def: 32581 },
    { id: "fiyat", label: "Son Fiyat", def: 33.84 },
    { id: "maliyet", label: "Maliyet", def: 30.84 }
  ],

  seed: { tutar: 1102541.04, kz: 97743.00, getiri: 9.73 },

  derive: function (s) {
    var t = s.adet * s.fiyat, k = s.adet * (s.fiyat - s.maliyet);
    return { tutar: t, kz: k, getiri: s.maliyet ? (s.fiyat - s.maliyet) / s.maliyet * 100 : 0 };
  },

  overlays: [
    { id: "clock", left: 99, top: 41, h: 21, size: 32, weight: 700, color: "#000000",
      get: function (s) { return s.saat; } },

    // the holding is always IEYHO, whatever the source screenshot showed
    { id: "symbol", left: 35, top: 191, h: 18, size: 23, weight: 700, color: "#212121",
      get: function () { return "IEYHO"; } },

    { id: "guncelAdet", right: 36, top: 237, h: 21, size: 28, weight: 600, color: "#1b1b1b",
      get: function (s, A) { return LOT(s.adet, A); } },
    { id: "satilabilir", right: 36, top: 330, h: 22, size: 27, weight: 600, color: "#1d1d1d",
      get: function (s, A) { return LOT(s.adet, A); } },
    { id: "sonFiyat", right: 35, top: 377, h: 22, size: 28, weight: 600, color: "#1b1b1b",
      get: function (s, A) { return TL(s.fiyat, A); } },
    { id: "tutar", right: 35, top: 424, h: 22, size: 28, weight: 600, color: "#1c1c1c",
      get: function (s, A) { return TL(s.tutar, A); } },
    { id: "maliyet", right: 35, top: 471, h: 21, size: 28, weight: 600, color: "#1b1b1b",
      get: function (s, A) { return TL(s.maliyet, A); } },
    { id: "kz", right: 37, top: 519, h: 20, size: 26, weight: 600,
      get: function (s, A) { return SIGNED_TL(s.kz, A); } },
    { id: "getiri", right: 37, top: 565, h: 21, size: 26, weight: 600,
      get: function (s, A) { return PCT(s.getiri, A); } }
  ]
};
