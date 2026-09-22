Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/fade-in.cssr.ts
const {
  cubicBezierEaseInOut
} = require("../common/_common.js");
function fadeInTransition({
  name = "fade-in",
  enterDuration = "0.2s",
  leaveDuration = "0.2s",
  enterCubicBezier = cubicBezierEaseInOut,
  leaveCubicBezier = cubicBezierEaseInOut
} = {}) {
  return [require__utils_cssr_index.c(`&.${name}-transition-enter-active`, {
    transition: `all ${enterDuration} ${enterCubicBezier}!important`
  }), require__utils_cssr_index.c(`&.${name}-transition-leave-active`, {
    transition: `all ${leaveDuration} ${leaveCubicBezier}!important`
  }), require__utils_cssr_index.c(`&.${name}-transition-enter-from, &.${name}-transition-leave-to`, {
    opacity: 0
  }), require__utils_cssr_index.c(`&.${name}-transition-leave-from, &.${name}-transition-enter-to`, {
    opacity: 1
  })];
}
//#endregion
exports.fadeInTransition = fadeInTransition;