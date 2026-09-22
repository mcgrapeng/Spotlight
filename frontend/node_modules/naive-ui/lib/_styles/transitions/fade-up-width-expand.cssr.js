Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/fade-up-width-expand.cssr.ts
const {
  cubicBezierEaseOut
} = require("../common/_common.js");
function fadeUpWidthExpandTransition({
  duration = ".2s"
} = {}) {
  return [require__utils_cssr_index.c("&.fade-up-width-expand-transition-leave-active", {
    transition: `
 opacity ${duration} ${cubicBezierEaseOut},
 max-width ${duration} ${cubicBezierEaseOut},
 transform ${duration} ${cubicBezierEaseOut}
 `
  }), require__utils_cssr_index.c("&.fade-up-width-expand-transition-enter-active", {
    transition: `
 opacity ${duration} ${cubicBezierEaseOut},
 max-width ${duration} ${cubicBezierEaseOut},
 transform ${duration} ${cubicBezierEaseOut}
 `
  }), require__utils_cssr_index.c("&.fade-up-width-expand-transition-enter-to", {
    opacity: 1,
    transform: "translateX(0) translateY(0)"
  }), require__utils_cssr_index.c("&.fade-up-width-expand-transition-enter-from", {
    maxWidth: "0 !important",
    opacity: 0,
    transform: "translateY(60%)"
  }), require__utils_cssr_index.c("&.fade-up-width-expand-transition-leave-from", {
    opacity: 1,
    transform: "translateY(0)"
  }), require__utils_cssr_index.c("&.fade-up-width-expand-transition-leave-to", {
    maxWidth: "0 !important",
    opacity: 0,
    transform: "translateY(60%)"
  })];
}
//#endregion
exports.fadeUpWidthExpandTransition = fadeUpWidthExpandTransition;