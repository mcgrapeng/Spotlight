Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/fade-in-width-expand.cssr.ts
const {
  cubicBezierEaseInOut
} = require("../common/_common.js");
function fadeInWidthExpandTransition({
  duration = ".2s",
  delay = ".1s"
} = {}) {
  return [require__utils_cssr_index.c("&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to", {
    opacity: 1
  }), require__utils_cssr_index.c("&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from", `
 opacity: 0!important;
 margin-left: 0!important;
 margin-right: 0!important;
 `), require__utils_cssr_index.c("&.fade-in-width-expand-transition-leave-active", `
 overflow: hidden;
 transition:
 opacity ${duration} ${cubicBezierEaseInOut},
 max-width ${duration} ${cubicBezierEaseInOut} ${delay},
 margin-left ${duration} ${cubicBezierEaseInOut} ${delay},
 margin-right ${duration} ${cubicBezierEaseInOut} ${delay};
 `), require__utils_cssr_index.c("&.fade-in-width-expand-transition-enter-active", `
 overflow: hidden;
 transition:
 opacity ${duration} ${cubicBezierEaseInOut} ${delay},
 max-width ${duration} ${cubicBezierEaseInOut},
 margin-left ${duration} ${cubicBezierEaseInOut},
 margin-right ${duration} ${cubicBezierEaseInOut};
 `)];
}
//#endregion
exports.fadeInWidthExpandTransition = fadeInWidthExpandTransition;