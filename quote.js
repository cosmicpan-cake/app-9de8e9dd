/* Live IEYHO quote from Borsa İstanbul.
 *
 * Yahoo sends no CORS headers, so a browser cannot call it — and every proxy
 * and free provider either refuses the request too or wants an API key, which
 * a public page cannot keep secret. So the fetching happens elsewhere: a
 * scheduled GitHub Action pulls the quote and commits it as quote.json beside
 * this file. The page just reads its own origin, which always works, needs no
 * key, and is already there on first load.
 *
 * See .github/workflows/quote.yml.
 */
(function () {
  "use strict";

  var URL = "quote.json";
  var CACHE = "clone_quote_cache_v1";

  function base() {
    // screens sit one folder down; the launcher is at the root
    return document.getElementById("btnSettings") ? "" : "../";
  }

  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE));
      return (c && typeof c.fiyat === "number") ? c : null;
    } catch (e) { return null; }
  }

  var pending = null;

  function fetchNow() {
    if (pending) return pending;
    // the file is rewritten by a scheduled job, so ask past the http cache
    pending = fetch(base() + URL + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (q) {
        if (!q || typeof q.fiyat !== "number") throw new Error("bozuk veri");
        try { localStorage.setItem(CACHE, JSON.stringify(q)); } catch (e) {}
        return q;
      })
      .catch(function (e) { return { error: e.message || "ağ hatası" }; })
      .then(function (r) { pending = null; return r; });
    return pending;
  }

  window.LIVE_QUOTE = {
    cached: readCache,
    fetchNow: fetchNow,

    /* Whatever arrives first: the fresh copy, or the last one seen. */
    get: function () {
      return fetchNow().then(function (r) { return r.error ? (readCache() || r) : r; });
    }
  };
})();
