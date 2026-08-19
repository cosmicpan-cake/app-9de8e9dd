/* These screens mix number formats within a single row — a Turkish-notation
   price beside a US-notation total, and one table with no thousands separator
   at all — so each overlay names the format it needs. */
var POS = "#0f4d0f", NEG = "#a3241b";
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
  slug: "toplu-emir",
  canvas: [1290, 605],
  locale: "tr-TR",

  fields: [
    { id: "saat", label: "Saat", def: "15:07:00", raw: true },
    { id: "adet", label: "Adet", def: 57000 },
    { id: "fiyat", label: "Fiyat", def: 179.1 }
  ],

  seed: { tutar: 10206870.0 },

  derive: function (s) { return {tutar:s.adet*s.fiyat}; },

  overlays: [
    { id: "miktar", right: 1027, top: 241, h: 29, size: 29, weight: 400, color: "#010202",
      get: function (s, A) { return TR(s.adet,2); } },
    { id: "miktarT", right: 866, top: 241, h: 29, size: 28, weight: 400, color: "#030404",
      get: function (s, A) { return TR(s.adet,2); } },
    { id: "miktarT2", right: 694, top: 241, h: 29, size: 29, weight: 400, color: "#030405",
      get: function (s, A) { return TR(s.adet,2); } },
    { id: "fiyat", right: 535, top: 241, h: 29, size: 28, weight: 400, color: "#001400",
      get: function (s, A) { return TR(s.fiyat,2); } },
    { id: "tutar", right: 291, top: 241, h: 29, size: 29, weight: 400, color: "#040506",
      get: function (s, A) { return TR(s.tutar,2); } },
    { id: "sadet", right: 92, top: 241, h: 29, size: 29, weight: 400, color: "#000305",
      get: function (s, A) { return TR(s.adet,2); } },
    { id: "clock", cx: 696, top: 508, h: 31, size: 46, weight: 400, color: "#fafeff",
      get: function (s, A) { return s.saat; } }
  ]
};
