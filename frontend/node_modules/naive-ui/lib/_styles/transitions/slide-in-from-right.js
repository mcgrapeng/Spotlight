Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/slide-in-from-right.ts
const { cubicBezierEaseIn, cubicBezierEaseOut } = require("../common/_common.js");
function slideInFromRightTransition({ duration = "0.3s", leaveDuration = "0.2s", name = "slide-in-from-right" } = {}) {
	return [
		require__utils_cssr_index.c(`&.${name}-transition-leave-active`, { transition: `transform ${leaveDuration} ${cubicBezierEaseIn}` }),
		require__utils_cssr_index.c(`&.${name}-transition-enter-active`, { transition: `transform ${duration} ${cubicBezierEaseOut}` }),
		require__utils_cssr_index.c(`&.${name}-transition-enter-to`, { transform: "translateX(0)" }),
		require__utils_cssr_index.c(`&.${name}-transition-enter-from`, { transform: "translateX(100%)" }),
		require__utils_cssr_index.c(`&.${name}-transition-leave-from`, { transform: "translateX(0)" }),
		require__utils_cssr_index.c(`&.${name}-transition-leave-to`, { transform: "translateX(100%)" })
	];
}
//#endregion
exports.slideInFromRightTransition = slideInFromRightTransition;
