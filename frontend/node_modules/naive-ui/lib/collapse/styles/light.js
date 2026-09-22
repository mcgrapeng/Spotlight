Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/collapse/styles/light.ts
function self(vars) {
	const { fontWeight, textColor1, textColor2, textColorDisabled, dividerColor, fontSize } = vars;
	return {
		titleFontSize: fontSize,
		titleFontWeight: fontWeight,
		dividerColor,
		titleTextColor: textColor1,
		titleTextColorDisabled: textColorDisabled,
		fontSize,
		textColor: textColor2,
		arrowColor: textColor2,
		arrowColorDisabled: textColorDisabled,
		itemMargin: "16px 0 0 0",
		titlePadding: "16px 0 0 0"
	};
}
const collapseLight = {
	name: "Collapse",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = collapseLight;
exports.self = self;
