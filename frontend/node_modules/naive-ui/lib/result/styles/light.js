Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_result_styles__common = require("./_common.js");
//#region src/result/styles/light.ts
function self(vars) {
	const { textColor2, textColor1, errorColor, successColor, infoColor, warningColor, lineHeight, fontWeightStrong } = vars;
	return {
		...require_result_styles__common,
		lineHeight,
		titleFontWeight: fontWeightStrong,
		titleTextColor: textColor1,
		textColor: textColor2,
		iconColorError: errorColor,
		iconColorSuccess: successColor,
		iconColorInfo: infoColor,
		iconColorWarning: warningColor
	};
}
const resultLight = {
	name: "Result",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = resultLight;
exports.self = self;
