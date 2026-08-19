/* These screens mix number formats within a single row — a Turkish-notation
   price beside a US-notation total, and one table with no thousands separator
   at all — so each overlay names the format it needs. */
var POS = "#427429", NEG = "#a3241b";
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
  slug: "emir-girisi",
  canvas: [1290, 1391],
  locale: "en-US",

  fields: [
    { id: "saat", label: "Saat", def: "12:06", raw: true },
    { id: "adet", label: "Adet", def: 65003 },
    { id: "fiyat", label: "Fiyat", def: 179.6 },
    { id: "maliyet", label: "Maliyet", def: 168.16 },
    { id: "limit", label: "İşlem Limiti", def: 292212 }
  ],

  seed: { tutar: 11677138.8, kz: 739533.25 },

  derive: function (s) { return {tutar:s.adet*s.fiyat, kz:s.adet*(s.fiyat-s.maliyet)}; },

  overlays: [
    { id: "clock", left: 1184, top: 17, h: 36, size: 35, weight: 400, color: "#fffcf2",
      get: function (s, A) { return s.saat; } },
    { id: "stok", left: 151, top: 177, h: 43, size: 44, weight: 400, color: "#000309",
      get: function (s, A) { return US(s.adet,0); } },
    { id: "adet", right: 306, top: 138, h: 37, size: 47, weight: 400, color: "#030304",
      get: function (s, A) { return String(Math.round(s.adet)); } },
    { id: "maliyet", left: 217, top: 333, h: 36, size: 43, weight: 400, color: "#010309",
      get: function (s, A) { return US(s.maliyet,2); } },
    { id: "fiyat", right: 305, top: 295, h: 37, size: 46, weight: 400, color: "#010102",
      get: function (s, A) { return US(s.fiyat,2); } },
    { id: "limit", left: 307, top: 489, h: 43, size: 43, weight: 400, color: "#010208",
      get: function (s, A) { return US(s.limit,0); } },
    { id: "tutar", right: 299, top: 448, h: 43, size: 47, weight: 400, color: "#010103",
      get: function (s, A) { return US(s.tutar,2); } },
    { id: "il", left: 201, top: 898, h: 42, size: 44, weight: 400, color: "#030406",
      get: function (s, A) { return US(s.limit,0); } },
    { id: "kz", left: 830, top: 898, h: 42, size: 44, weight: 400,
      get: function (s, A) { return KZ(s.kz); } }
  ]
};
