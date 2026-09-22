Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_breadcrumb_styles__common = require("./_common.js");
//#region src/breadcrumb/styles/light.ts
function self(vars) {
	const { fontSize, textColor3, textColor2, borderRadius, buttonColor2Hover, buttonColor2Pressed } = vars;
	return {
		...require_breadcrumb_styles__common,
		fontSize,
		itemLineHeight: "1.25",
		itemTextColor: textColor3,
		itemTextColorHover: textColor2,
		itemTextColorPressed: textColor2,
		itemTextColorActive: textColor2,
		itemBorderRadius: borderRadius,
		itemColorHover: buttonColor2Hover,
		itemColorPressed: buttonColor2Pressed,
		separatorColor: textColor3
	};
}
const breadcrumbLight = {
	name: "Breadcrumb",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = breadcrumbLight;
exports.self = self;
