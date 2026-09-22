Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/carousel/styles/light.ts
function self() {
	return {
		dotSize: "8px",
		dotColor: "rgba(255, 255, 255, .3)",
		dotColorActive: "rgba(255, 255, 255, 1)",
		dotColorFocus: "rgba(255, 255, 255, .5)",
		dotLineWidth: "16px",
		dotLineWidthActive: "24px",
		arrowColor: "#eee"
	};
}
const carouselLight = {
	name: "Carousel",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = carouselLight;
exports.self = self;
