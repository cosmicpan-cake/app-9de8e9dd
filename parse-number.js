/* Reads a number typed with either separator.
 *
 * These screens mix Turkish and US formatting, and people type whichever they
 * are used to, so "179,60" and "179.60" both have to mean the same thing. The
 * last separator in the string is the decimal point unless it looks like a
 * thousands separator:
 *
 *   one separator   -> decimal, unless exactly three digits follow it
 *                      ("1.500" is fifteen hundred, "159,1000" is 159.1)
 *   several         -> the last one is the decimal point only if it differs
 *                      from the others ("1.234.567,89" yes, "1.234.567" no)
 */
(function () {
  "use strict";

  window.parseTypedNumber = function (raw) {
    var s = String(raw == null ? "" : raw).trim().replace(/\s/g, "");
    if (!s) return 0;

    var neg = s.charAt(0) === "-";
    s = s.replace(/^[+-]/, "");
    if (!/^[\d.,]+$/.test(s)) return 0;

    var last = Math.max(s.lastIndexOf("."), s.lastIndexOf(","));
    var v;
    if (last < 0) {
      v = parseFloat(s);
    } else {
      var seps = s.match(/[.,]/g).length;
      var decimal;
      if (seps === 1) {
        decimal = (s.length - last - 1) !== 3;
      } else {
        decimal = s.slice(0, last).indexOf(s.charAt(last)) < 0;
      }
      v = decimal
        ? parseFloat(s.slice(0, last).replace(/[.,]/g, "") + "." + s.slice(last + 1))
        : parseFloat(s.replace(/[.,]/g, ""));
    }
    if (isNaN(v)) return 0;
    return neg ? -v : v;
  };
})();
