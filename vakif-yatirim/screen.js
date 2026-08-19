/* These screens mix number formats within a single row — a Turkish-notation
   price beside a US-notation total, and one table with no thousands separator
   at all — so each overlay names the format it needs. */
var POS = "#11257f", NEG = "#a3241b";
function fmt(v, d, loc, grp) {
  return Number(v || 0).toLocaleString(loc, {
    minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: grp !== false });
}
function US(v, d)    { return fmt(v, d, "en-US"); }
function TR(v, d)    { return fmt(v, d, "tr-TR"); }
function PLAIN(v, d) { return fmt(v, d, "tr-TR", false); }
function KZ(v)       { return { color: v >= 0 ? POS : NEG, text: US(v, 2) }; }
/* The profit column carries an explicit sign, and the percentage under it puts
   its sign after the symbol. */
function SIGNED(v)   { return { color: v >= 0 ? POS : NEG, text: (v >= 0 ? "+" : "-") + US(Math.abs(v), 2) }; }
function PCT(v)      { return { color: v >= 0 ? POS : NEG, text: "% " + US(v, 2) }; }

window.SCREEN = {
  slug: "vakif-yatirim",
  canvas: [1263, 526],
  locale: "tr-TR",

  fields: [
    { id: "adet", label: "Adet", def: 29643 },
    { id: "fiyat", label: "Fiyat", def: 180.0 },
    { id: "maliyet", label: "Maliyet", def: 159.1 },
    { id: "toplam", label: "Toplam Miktar", def: 5116275 }
  ],

  seed: {  },

  derive: function (s) { return {}; },

  overlays: [
    { id: "toplam", right: 693, top: 415, h: 30, size: 34, weight: 400, color: "#0e0f11",
      get: function (s, A) { return PLAIN(s.toplam,2); } },
    { id: "adet", right: 701, top: 474, h: 31, size: 35, weight: 400, color: "#11257f",
      get: function (s, A) { return PLAIN(s.adet,2); } },
    { id: "sadet", right: 484, top: 474, h: 31, size: 35, weight: 400, color: "#10237e",
      get: function (s, A) { return PLAIN(s.adet,2); } },
    { id: "maliyet", right: 263, top: 473, h: 31, size: 34, weight: 400, color: "#12267d",
      get: function (s, A) { return PLAIN(s.maliyet,4); } },
    { id: "fiyat", right: 75, top: 472, h: 31, size: 34, weight: 400, color: "#12247b",
      get: function (s, A) { return PLAIN(s.fiyat,2); } }
  ]
};
