import { c } from "../../_utils/cssr/index.mjs";
import _common_default from "../common/_common.mjs";
//#region src/_styles/transitions/fade-up-width-expand.cssr.ts
const {
  cubicBezierEaseOut
} = _common_default;
function fadeUpWidthExpandTransition({
  duration = ".2s"
} = {}) {
  return [c("&.fade-up-width-expand-transition-leave-active", {
    transition: `
 opacity ${duration} ${cubicBezierEaseOut},
 max-width ${duration} ${cubicBezierEaseOut},
 transform ${duration} ${cubicBezierEaseOut}
 `
  }), c("&.fade-up-width-expand-transition-enter-active", {
    transition: `
 opacity ${duration} ${cubicBezierEaseOut},
 max-width ${duration} ${cubicBezierEaseOut},
 transform ${duration} ${cubicBezierEaseOut}
 `
  }), c("&.fade-up-width-expand-transition-enter-to", {
    opacity: 1,
    transform: "translateX(0) translateY(0)"
  }), c("&.fade-up-width-expand-transition-enter-from", {
    maxWidth: "0 !important",
    opacity: 0,
    transform: "translateY(60%)"
  }), c("&.fade-up-width-expand-transition-leave-from", {
    opacity: 1,
    transform: "translateY(0)"
  }), c("&.fade-up-width-expand-transition-leave-to", {
    maxWidth: "0 !important",
    opacity: 0,
    transform: "translateY(60%)"
  })];
}
//#endregion
export { fadeUpWidthExpandTransition };