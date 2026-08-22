/* Live IEYHO quote from Borsa İstanbul.
 *
 * A page served from GitHub Pages can only call an endpoint that sends CORS
 * headers, which rules out Yahoo and Stooq — both refuse browser requests
 * outright. Twelve Data does allow them, and covers BIST on its free tier, but
 * wants an API key.
 *
 * The key is not in this repository, because the repository is public. It is
 * entered once on the settings screen and kept in this browser's localStorage.
 * With no key nothing here runs and every screen keeps its own values.
 */
(function () {
  "use strict";

  var KEY_STORE = "clone_quote_key_v1";
  var CACHE = "clone_quote_cache_v1";
  var SYMBOL = "IEYHO";
  var EXCHANGE = "Borsa Istanbul";
  var FRESH_MS = 60 * 1000;

  function readKey() {
    try { return localStorage.getItem(KEY_STORE) || ""; } catch (e) { return ""; }
  }

  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE));
      return (c && typeof c.fiyat === "number") ? c : null;
    } catch (e) { return null; }
  }

  function writeCache(q) {
    try { localStorage.setItem(CACHE, JSON.stringify(q)); } catch (e) {}
  }

  var pending = null;

  function fetchNow() {
    var key = readKey();
    if (!key) return Promise.resolve({ error: "no-key" });
    if (pending) return pending;

    var url = "https://api.twelvedata.com/quote?symbol=" + encodeURIComponent(SYMBOL) +
              "&exchange=" + encodeURIComponent(EXCHANGE) +
              "&apikey=" + encodeURIComponent(key);

    pending = fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        // The free tier reports its own errors in the body with a 200.
        if (!j || j.status === "error" || j.code) {
          return { error: (j && j.message) || "unknown" };
        }
        var price = parseFloat(j.close != null ? j.close : j.price);
        var pct = parseFloat(j.percent_change);
        if (!isFinite(price)) return { error: "no price in response" };
        var q = {
          fiyat: price,
          degisim: isFinite(pct) ? pct : null,
          at: Date.now()
        };
        writeCache(q);
        return q;
      })
      .catch(function (e) { return { error: e.message || "network" }; })
      .then(function (r) { pending = null; return r; });

    return pending;
  }

  window.LIVE_QUOTE = {
    hasKey: function () { return !!readKey(); },
    getKey: readKey,
    setKey: function (k) {
      try {
        k = String(k || "").trim();
        if (k) localStorage.setItem(KEY_STORE, k);
        else { localStorage.removeItem(KEY_STORE); localStorage.removeItem(CACHE); }
      } catch (e) {}
    },
    cached: readCache,
    fetchNow: fetchNow,

    /* Cached value if it is recent, otherwise a fresh fetch. */
    get: function () {
      var c = readCache();
      if (c && Date.now() - c.at < FRESH_MS) return Promise.resolve(c);
      return fetchNow().then(function (r) { return r.error ? (c || r) : r; });
    }
  };
})();
