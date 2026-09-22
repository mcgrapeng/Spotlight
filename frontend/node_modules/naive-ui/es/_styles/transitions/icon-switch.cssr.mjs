import { c } from "../../_utils/cssr/index.mjs";
import _common_default from "../common/_common.mjs";
//#region src/_styles/transitions/icon-switch.cssr.ts
const {
  cubicBezierEaseInOut
} = _common_default;
function iconSwitchTransition({
  originalTransform = "",
  left = 0,
  top = 0,
  transition = `all .3s ${cubicBezierEaseInOut} !important`
} = {}) {
  return [c("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to", {
    transform: `${originalTransform} scale(0.75)`,
    left,
    top,
    opacity: 0
  }), c("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from", {
    transform: `scale(1) ${originalTransform}`,
    left,
    top,
    opacity: 1
  }), c("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active", {
    transformOrigin: "center",
    position: "absolute",
    left,
    top,
    transition
  })];
}
//#endregion
export { iconSwitchTransition };