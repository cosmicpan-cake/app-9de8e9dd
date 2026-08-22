/* Writes quote.json for the page to read.
 *
 * Runs on a GitHub runner, not in a browser, so Yahoo's missing CORS headers
 * do not matter and no API key is involved. Failure leaves the previous
 * quote.json untouched — a stale price beats a broken one.
 */
const fs = require("fs");

const URL = "https://query1.finance.yahoo.com/v8/finance/chart/IEYHO.IS?interval=1d&range=5d";

async function main() {
  const res = await fetch(URL, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error("HTTP " + res.status);

  const meta = ((await res.json()).chart?.result || [])[0]?.meta;
  if (!meta) throw new Error("no result in response");

  const price = meta.regularMarketPrice;
  const prev = meta.chartPreviousClose ?? meta.previousClose;
  if (!isFinite(price)) throw new Error("no price in response");

  const out = {
    symbol: "IEYHO",
    fiyat: round2(price),
    degisim: isFinite(prev) && prev ? round2(((price - prev) / prev) * 100) : null,
    previousClose: isFinite(prev) ? round2(prev) : null,
    marketTime: meta.regularMarketTime ? meta.regularMarketTime * 1000 : null,
    fetchedAt: Date.now()
  };
  fs.writeFileSync("quote.json", JSON.stringify(out, null, 2) + "\n");
  console.log(out);
}

const round2 = (n) => Math.round(n * 100) / 100;

main().catch((e) => {
  console.error("quote fetch failed:", e.message);
  process.exit(1);
});
