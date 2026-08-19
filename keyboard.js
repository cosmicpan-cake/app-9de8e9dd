/* Keeps the on-screen keyboard from shrinking the screen.
 *
 * Every page scales its fixed design canvas to fit the viewport. On Android the
 * keyboard shrinks the visual viewport, so that rule would rescale the whole
 * screen down to whatever strip is left above the keyboard the moment a field
 * is tapped. Instead, while a field is focused, the height measured before it
 * was focused is held, and the canvas is anchored to the top of the viewport
 * (body.editing) so the fields being typed into stay on screen.
 *
 * The decision is made inside height(), which every page calls on each resize —
 * including the resize the keyboard itself causes. Nothing depends on focus
 * events firing, so it holds up wherever those are unreliable; the listeners
 * below only make the change take effect a beat sooner.
 *
 * Desktop is unaffected: with no on-screen keyboard the viewport never shrinks,
 * so the held height and the live one are the same.
 */
(function () {
  "use strict";

  var rest = null;

  function typing() {
    var a = document.activeElement;
    return !!(a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA"));
  }

  function mark(on) {
    if (document.body) document.body.classList.toggle("editing", on);
  }

  window.VIEWPORT = {
    typing: typing,

    width: function () {
      return window.visualViewport ? window.visualViewport.width : window.innerWidth;
    },

    height: function () {
      var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      var on = typing();
      mark(on);
      if (on) return rest || vh;
      rest = vh;
      return vh;
    }
  };

  ["focusin", "focusout"].forEach(function (e) {
    document.addEventListener(e, function () {
      mark(typing());
      // The viewport settles a moment after focus changes; re-check once it has.
      setTimeout(function () { mark(typing()); }, 60);
    });
  });

  // A rotation invalidates the held height, and never happens mid-keystroke.
  window.addEventListener("orientationchange", function () { rest = null; });
})();
