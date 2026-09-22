Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/fade-down.cssr.ts
const {
  cubicBezierEaseInOut
} = require("../common/_common.js");
function fadeDownTransition({
  name = "fade-down",
  fromOffset = "-4px",
  enterDuration = ".3s",
  leaveDuration = ".3s",
  enterCubicBezier = cubicBezierEaseInOut,
  leaveCubicBezier = cubicBezierEaseInOut
} = {}) {
  return [require__utils_cssr_index.c(`&.${name}-transition-enter-from, &.${name}-transition-leave-to`, {
    opacity: 0,
    transform: `translateY(${fromOffset})`
  }), require__utils_cssr_index.c(`&.${name}-transition-enter-to, &.${name}-transition-leave-from`, {
    opacity: 1,
    transform: "translateY(0)"
  }), require__utils_cssr_index.c(`&.${name}-transition-leave-active`, {
    transition: `opacity ${leaveDuration} ${leaveCubicBezier}, transform ${leaveDuration} ${leaveCubicBezier}`
  }), require__utils_cssr_index.c(`&.${name}-transition-enter-active`, {
    transition: `opacity ${enterDuration} ${enterCubicBezier}, transform ${enterDuration} ${enterCubicBezier}`
  })];
}
//#endregion
exports.fadeDownTransition = fadeDownTransition;