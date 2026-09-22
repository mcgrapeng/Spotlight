Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_carousel_src_utils_duplicatedLogic = require("./duplicatedLogic.js");
const require_carousel_src_utils_event = require("./event.js");
//#region src/carousel/src/utils/index.ts
function calculateSize(element, innerOnly) {
	let { offsetWidth: width, offsetHeight: height } = element;
	if (innerOnly) {
		const style = getComputedStyle(element);
		width = width - Number.parseFloat(style.getPropertyValue("padding-left")) - Number.parseFloat(style.getPropertyValue("padding-right"));
		height = height - Number.parseFloat(style.getPropertyValue("padding-top")) - Number.parseFloat(style.getPropertyValue("padding-bottom"));
	}
	return {
		width,
		height
	};
}
function clampValue(value, min, max) {
	return value < min ? min : value > max ? max : value;
}
function resolveSpeed(value) {
	if (value === void 0) return 0;
	if (typeof value === "number") return value;
	const match = value.match(/^((\d+)?\.?\d+?)(ms|s)?$/);
	if (match) {
		const [, number, , unit = "ms"] = match;
		return Number(number) * (unit === "ms" ? 1 : 1e3);
	}
	return 0;
}
//#endregion
exports.addDuplicateSlides = require_carousel_src_utils_duplicatedLogic.addDuplicateSlides;
exports.calculateSize = calculateSize;
exports.clampValue = clampValue;
exports.getDisplayIndex = require_carousel_src_utils_duplicatedLogic.getDisplayIndex;
exports.getDisplayTotalView = require_carousel_src_utils_duplicatedLogic.getDisplayTotalView;
exports.getNextIndex = require_carousel_src_utils_duplicatedLogic.getNextIndex;
exports.getPrevIndex = require_carousel_src_utils_duplicatedLogic.getPrevIndex;
exports.getRealIndex = require_carousel_src_utils_duplicatedLogic.getRealIndex;
exports.isTouchEvent = require_carousel_src_utils_event.isTouchEvent;
exports.resolveSpeed = resolveSpeed;
