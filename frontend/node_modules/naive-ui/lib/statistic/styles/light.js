Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/statistic/styles/light.ts
function self(vars) {
	const { textColor2, textColor3, fontSize, fontWeight } = vars;
	return {
		labelFontSize: fontSize,
		labelFontWeight: fontWeight,
		valueFontWeight: fontWeight,
		valueFontSize: "24px",
		labelTextColor: textColor3,
		valuePrefixTextColor: textColor2,
		valueSuffixTextColor: textColor2,
		valueTextColor: textColor2
	};
}
const statisticLight = {
	name: "Statistic",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = statisticLight;
exports.self = self;
