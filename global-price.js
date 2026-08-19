/* One IEYHO price shared by every screen.
 *
 * Set on the launcher, it becomes the price each screen shows when opened. A
 * screen's own edit screen still wins afterwards: both the global setting and
 * each screen's saved state carry the time they were written, and whichever is
 * newer is the one that applies. So setting the price again on the launcher
 * pushes it back out to screens that had been edited individually.
 */
(function () {
  "use strict";

  var KEY = "clone_global_price_v1";

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var g = JSON.parse(raw);
      if (!g || typeof g.fiyat !== "number" || !isFinite(g.fiyat)) return null;
      return { fiyat: g.fiyat, ts: g.ts || 0 };
    } catch (e) {
      return null;
    }
  }

  window.GLOBAL_PRICE = {
    read: read,

    write: function (v) {
      localStorage.setItem(KEY, JSON.stringify({ fiyat: v, ts: Date.now() }));
    },

    clear: function () {
      localStorage.removeItem(KEY);
    },

    /* The price a screen should open with, or null to keep its own.
       `savedTs` is when that screen was last edited (0 if never). */
    priceFor: function (savedTs) {
      var g = read();
      return (g && g.ts > (savedTs || 0)) ? g.fiyat : null;
    },

    stamp: function () { return Date.now(); }
  };
})();
