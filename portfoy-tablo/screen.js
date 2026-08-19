/* These screens mix number formats within a single row — a Turkish-notation
   price beside a US-notation total, and one table with no thousands separator
   at all — so each overlay names the format it needs. */
var POS = "#214d2a", NEG = "#a3241b";
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
  slug: "portfoy-tablo",
  canvas: [1282, 711],
  locale: "en-US",

  fields: [
    { id: "saat", label: "Saat", def: "12:09", raw: true },
    { id: "adet", label: "Adet", def: 40005 },
    { id: "fiyat", label: "Fiyat", def: 179.4 },
    { id: "maliyet", label: "Maliyet", def: 168.86 }
  ],

  seed: { tutar: 7176198.0, kz: 145350.99, kzp: 2.03 },

  derive: function (s) { var t=s.adet*s.fiyat, m=s.adet*s.maliyet;return {tutar:t, kz:t-m, kzp:t?(t-m)/t*100:0}; },

  overlays: [
    { id: "adet", right: 508, top: 187, h: 19, size: 21, weight: 400, color: "#040509",
      get: function (s, A) { return US(s.adet,0); } },
    { id: "fiyat", right: 401, top: 187, h: 20, size: 20, weight: 400, color: "#020309",
      get: function (s, A) { return TR(s.fiyat,2); } },
    { id: "tutar", right: 247, top: 187, h: 20, size: 21, weight: 400, color: "#06060e",
      get: function (s, A) { return US(s.tutar,2); } },
    { id: "maliyet", right: 141, top: 190, h: 16, size: 20, weight: 400, color: "#070911",
      get: function (s, A) { return US(s.maliyet,2); } },
    { id: "kz", right: 5, top: 176, h: 19, size: 20, weight: 400,
      get: function (s, A) { return SIGNED(s.kz); } },
    { id: "kzp", right: 12, top: 207, h: 16, size: 21, weight: 400,
      get: function (s, A) { return PCT(s.kzp); } },
    { id: "clock", left: 12, top: 677, h: 19, size: 26, weight: 400, color: "#101e36",
      get: function (s, A) { return s.saat; } }
  ]
};
