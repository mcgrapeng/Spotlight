import { c } from "../../_utils/cssr/index.mjs";
import _common_default from "../common/_common.mjs";
//#region src/_styles/transitions/slide-in-from-right.ts
const {
  cubicBezierEaseIn,
  cubicBezierEaseOut
} = _common_default;
function slideInFromRightTransition({
  duration = "0.3s",
  leaveDuration = "0.2s",
  name = "slide-in-from-right"
} = {}) {
  return [c(`&.${name}-transition-leave-active`, {
    transition: `transform ${leaveDuration} ${cubicBezierEaseIn}`
  }), c(`&.${name}-transition-enter-active`, {
    transition: `transform ${duration} ${cubicBezierEaseOut}`
  }), c(`&.${name}-transition-enter-to`, {
    transform: "translateX(0)"
  }), c(`&.${name}-transition-enter-from`, {
    transform: "translateX(100%)"
  }), c(`&.${name}-transition-leave-from`, {
    transform: "translateX(0)"
  }), c(`&.${name}-transition-leave-to`, {
    transform: "translateX(100%)"
  })];
}
//#endregion
export { slideInFromRightTransition };