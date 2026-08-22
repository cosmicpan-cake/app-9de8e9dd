/* Writes quote.json for the page to read.
 *
 * Runs on a GitHub runner, not in a browser, so Yahoo's missing CORS headers
 * do not matter and no API key is involved. Failure leaves the previous
 * quote.json untouched — a stale price beats a broken one.
 *
 * The daily change is worked out from the daily bars rather than from
 * meta.chartPreviousClose, which is the close before the *requested range* and
 * so moves with it: the same symbol reports 181.9 at range=5d and 178.3 at
 * range=10d. meta.previousClose is often absent. The last bar before the
 * current session is the only dependable prior close.
 */
const fs = require("fs");

const URL = "https://query1.finance.yahoo.com/v8/finance/chart/IEYHO.IS" +
            "?interval=1d&range=1mo";

const round2 = (n) => Math.round(n * 100) / 100;

/* Calendar day at the exchange, so bars are grouped the way the market sees them. */
const dayAt = (epochSec, gmtOffsetSec) =>
  Math.floor((epochSec + (gmtOffsetSec || 0)) / 86400);

function previousClose(result, nowSec) {
  const offset = result.meta.gmtoffset || 0;
  const stamps = result.timestamp || [];
  const closes = (result.indicators?.quote?.[0]?.close) || [];
  const today = dayAt(nowSec, offset);

  // Walk back for the newest finalised close from an earlier session. The
  // current session's own bar is skipped whether it is present or still null.
  for (let i = closes.length - 1; i >= 0; i--) {
    if (closes[i] == null) continue;
    if (dayAt(stamps[i], offset) >= today) continue;
    return closes[i];
  }
  return null;
}

async function main() {
  const res = await fetch(URL, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error("HTTP " + res.status);

  const result = ((await res.json()).chart?.result || [])[0];
  if (!result) throw new Error("no result in response");

  const meta = result.meta;
  const price = meta.regularMarketPrice;
  if (!isFinite(price)) throw new Error("no price in response");

  const marketSec = meta.regularMarketTime || Math.floor(Date.now() / 1000);
  const prev = previousClose(result, marketSec);

  let degisim = null;
  if (isFinite(prev) && prev) {
    const pct = ((price - prev) / prev) * 100;
    // A day's move this large means the data is wrong, not the market.
    if (Math.abs(pct) <= 50) degisim = round2(pct);
    else console.error("implausible change ignored:", pct);
  }

  const out = {
    symbol: "IEYHO",
    fiyat: round2(price),
    degisim: degisim,
    previousClose: isFinite(prev) ? round2(prev) : null,
    marketTime: marketSec * 1000,
    fetchedAt: Date.now()
  };
  fs.writeFileSync("quote.json", JSON.stringify(out, null, 2) + "\n");
  console.log(out);
}

main().catch((e) => {
  console.error("quote fetch failed:", e.message);
  process.exit(1);
});
