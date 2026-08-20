/* IEYHO's price and daily change, shared by every screen.
 *
 * Set on the launcher, these become the values each screen shows when opened. A
 * screen's own edit screen still wins afterwards: both the launcher setting and
 * each screen's saved state carry the time they were written, and whichever is
 * newer is the one that applies. So saving on the launcher pushes the values
 * back out to screens that had been edited individually.
 *
 * Either value may be left unset, in which case screens keep their own.
 */
(function () {
  "use strict";

  var KEY = "clone_global_price_v1";

  function numOrNull(v) {
    return (typeof v === "number" && isFinite(v)) ? v : null;
  }

  function read() {
    try {
      var g = JSON.parse(localStorage.getItem(KEY));
      if (!g) return null;
      return {
        fiyat: numOrNull(g.fiyat),
        degisim: numOrNull(g.degisim),
        ts: g.ts || 0
      };
    } catch (e) {
      return null;
    }
  }

  /* The stored value wins only while it is newer than the screen's own edit.
     `savedTs` is when that screen was last saved (0 or undefined if never). */
  function fresher(field, savedTs) {
    var g = read();
    return (g && g.ts > (savedTs || 0)) ? g[field] : null;
  }

  window.GLOBAL_PRICE = {
    read: read,

    write: function (vals) {
      var fiyat = numOrNull(vals.fiyat), degisim = numOrNull(vals.degisim);
      if (fiyat === null && degisim === null) { localStorage.removeItem(KEY); return; }
      localStorage.setItem(KEY, JSON.stringify({
        fiyat: fiyat, degisim: degisim, ts: Date.now()
      }));
    },

    clear: function () { localStorage.removeItem(KEY); },

    priceFor: function (savedTs) { return fresher("fiyat", savedTs); },
    changeFor: function (savedTs) { return fresher("degisim", savedTs); },

    stamp: function () { return Date.now(); }
  };
})();
