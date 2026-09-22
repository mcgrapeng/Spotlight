import { c } from "../../_utils/cssr/index.mjs";
import _common_default from "../common/_common.mjs";
//#region src/_styles/transitions/slide-in-from-bottom.ts
const {
  cubicBezierEaseIn,
  cubicBezierEaseOut
} = _common_default;
function slideInFromBottomTransition({
  duration = "0.3s",
  leaveDuration = "0.2s",
  name = "slide-in-from-bottom"
} = {}) {
  return [c(`&.${name}-transition-leave-active`, {
    transition: `transform ${leaveDuration} ${cubicBezierEaseIn}`
  }), c(`&.${name}-transition-enter-active`, {
    transition: `transform ${duration} ${cubicBezierEaseOut}`
  }), c(`&.${name}-transition-enter-to`, {
    transform: "translateY(0)"
  }), c(`&.${name}-transition-enter-from`, {
    transform: "translateY(100%)"
  }), c(`&.${name}-transition-leave-from`, {
    transform: "translateY(0)"
  }), c(`&.${name}-transition-leave-to`, {
    transform: "translateY(100%)"
  })];
}
//#endregion
export { slideInFromBottomTransition };