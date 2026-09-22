Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../../_styles/common/light.js");
const require__internal_scrollbar_styles_common = require("./common.js");
//#region src/_internal/scrollbar/styles/light.ts
function self(vars) {
	const { scrollbarColor, scrollbarColorHover, scrollbarHeight, scrollbarWidth, scrollbarBorderRadius } = vars;
	return {
		...require__internal_scrollbar_styles_common.commonVars,
		height: scrollbarHeight,
		width: scrollbarWidth,
		borderRadius: scrollbarBorderRadius,
		color: scrollbarColor,
		colorHover: scrollbarColorHover
	};
}
const scrollbarLight = {
	name: "Scrollbar",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = scrollbarLight;
exports.self = self;
