Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/skeleton/styles/light.ts
function self(vars) {
	const { heightSmall, heightMedium, heightLarge, borderRadius } = vars;
	return {
		color: "#eee",
		colorEnd: "#ddd",
		borderRadius,
		heightSmall,
		heightMedium,
		heightLarge
	};
}
const skeletonLight = {
	name: "Skeleton",
	common: require__styles_common_light,
	self
};
//#endregion
exports.skeletonLight = skeletonLight;
