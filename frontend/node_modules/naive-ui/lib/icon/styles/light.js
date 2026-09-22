Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/icon/styles/light.ts
function self(vars) {
	const { textColorBase, opacity1, opacity2, opacity3, opacity4, opacity5 } = vars;
	return {
		color: textColorBase,
		opacity1Depth: opacity1,
		opacity2Depth: opacity2,
		opacity3Depth: opacity3,
		opacity4Depth: opacity4,
		opacity5Depth: opacity5
	};
}
const iconLight = {
	name: "Icon",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = iconLight;
exports.self = self;
