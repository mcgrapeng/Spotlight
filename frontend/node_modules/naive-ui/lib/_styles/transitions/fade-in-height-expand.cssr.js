Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/fade-in-height-expand.cssr.ts
const {
  cubicBezierEaseInOut,
  cubicBezierEaseOut,
  cubicBezierEaseIn
} = require("../common/_common.js");
function fadeInHeightExpandTransition({
  overflow = "hidden",
  duration = ".3s",
  originalTransition = "",
  leavingDelay = "0s",
  foldPadding = false,
  enterToProps = void 0,
  leaveToProps = void 0,
  reverse = false
} = {}) {
  const enterClass = reverse ? "leave" : "enter";
  const leaveClass = reverse ? "enter" : "leave";
  return [require__utils_cssr_index.c(`&.fade-in-height-expand-transition-${leaveClass}-from,
 &.fade-in-height-expand-transition-${enterClass}-to`, {
    ...enterToProps,
    opacity: 1
  }), require__utils_cssr_index.c(`&.fade-in-height-expand-transition-${leaveClass}-to,
 &.fade-in-height-expand-transition-${enterClass}-from`, {
    ...leaveToProps,
    opacity: 0,
    marginTop: "0 !important",
    marginBottom: "0 !important",
    paddingTop: foldPadding ? "0 !important" : void 0,
    paddingBottom: foldPadding ? "0 !important" : void 0
  }), require__utils_cssr_index.c(`&.fade-in-height-expand-transition-${leaveClass}-active`, `
 overflow: ${overflow};
 transition:
 max-height ${duration} ${cubicBezierEaseInOut} ${leavingDelay},
 opacity ${duration} ${cubicBezierEaseOut} ${leavingDelay},
 margin-top ${duration} ${cubicBezierEaseInOut} ${leavingDelay},
 margin-bottom ${duration} ${cubicBezierEaseInOut} ${leavingDelay},
 padding-top ${duration} ${cubicBezierEaseInOut} ${leavingDelay},
 padding-bottom ${duration} ${cubicBezierEaseInOut} ${leavingDelay}
 ${originalTransition ? `,${originalTransition}` : ""}
 `), require__utils_cssr_index.c(`&.fade-in-height-expand-transition-${enterClass}-active`, `
 overflow: ${overflow};
 transition:
 max-height ${duration} ${cubicBezierEaseInOut},
 opacity ${duration} ${cubicBezierEaseIn},
 margin-top ${duration} ${cubicBezierEaseInOut},
 margin-bottom ${duration} ${cubicBezierEaseInOut},
 padding-top ${duration} ${cubicBezierEaseInOut},
 padding-bottom ${duration} ${cubicBezierEaseInOut}
 ${originalTransition ? `,${originalTransition}` : ""}
 `)];
}
//#endregion
exports.fadeInHeightExpandTransition = fadeInHeightExpandTransition;