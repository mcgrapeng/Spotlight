Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
//#region src/_styles/transitions/slide-in-from-bottom.ts
const { cubicBezierEaseIn, cubicBezierEaseOut } = require("../common/_common.js");
function slideInFromBottomTransition({ duration = "0.3s", leaveDuration = "0.2s", name = "slide-in-from-bottom" } = {}) {
	return [
		require__utils_cssr_index.c(`&.${name}-transition-leave-active`, { transition: `transform ${leaveDuration} ${cubicBezierEaseIn}` }),
		require__utils_cssr_index.c(`&.${name}-transition-enter-active`, { transition: `transform ${duration} ${cubicBezierEaseOut}` }),
		require__utils_cssr_index.c(`&.${name}-transition-enter-to`, { transform: "translateY(0)" }),
		require__utils_cssr_index.c(`&.${name}-transition-enter-from`, { transform: "translateY(100%)" }),
		require__utils_cssr_index.c(`&.${name}-transition-leave-from`, { transform: "translateY(0)" }),
		require__utils_cssr_index.c(`&.${name}-transition-leave-to`, { transform: "translateY(100%)" })
	];
}
//#endregion
exports.slideInFromBottomTransition = slideInFromBottomTransition;
