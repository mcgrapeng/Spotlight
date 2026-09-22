Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/icon-switch.cssr.ts
const {
  cubicBezierEaseInOut
} = require("../common/_common.js");
function iconSwitchTransition({
  originalTransform = "",
  left = 0,
  top = 0,
  transition = `all .3s ${cubicBezierEaseInOut} !important`
} = {}) {
  return [require__utils_cssr_index.c("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to", {
    transform: `${originalTransform} scale(0.75)`,
    left,
    top,
    opacity: 0
  }), require__utils_cssr_index.c("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from", {
    transform: `scale(1) ${originalTransform}`,
    left,
    top,
    opacity: 1
  }), require__utils_cssr_index.c("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active", {
    transformOrigin: "center",
    position: "absolute",
    left,
    top,
    transition
  })];
}
//#endregion
exports.iconSwitchTransition = iconSwitchTransition;