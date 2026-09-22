Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_page_header_styles__common = require("./_common.js");
//#region src/page-header/styles/light.ts
function self(vars) {
	const { textColor1, textColor2, textColor3, fontSize, fontWeightStrong, primaryColorHover, primaryColorPressed } = vars;
	return {
		...require_page_header_styles__common,
		titleFontWeight: fontWeightStrong,
		fontSize,
		titleTextColor: textColor1,
		backColor: textColor2,
		backColorHover: primaryColorHover,
		backColorPressed: primaryColorPressed,
		subtitleTextColor: textColor3
	};
}
const pageHeaderLight = require__mixins_use_theme.createTheme({
	name: "PageHeader",
	common: require__styles_common_light,
	self
});
//#endregion
exports.pageHeaderLight = pageHeaderLight;
exports.self = self;
