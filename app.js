(function () {
  "use strict";

  // Scale the fixed 945x1200 design canvas to fill whatever the real screen is.
  var DESIGN_W = 945, DESIGN_H = 1200;
  function fitPhoneToViewport() {
    var vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
    document.getElementById("phone").style.transform = "scale(" + scale + ")";
  }
  fitPhoneToViewport();
  window.addEventListener("resize", fitPhoneToViewport);
  window.addEventListener("orientationchange", fitPhoneToViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitPhoneToViewport);
  }
})();
