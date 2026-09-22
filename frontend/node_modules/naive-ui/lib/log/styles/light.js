const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_code_styles_light = require("../../code/styles/light.js");
//#region src/log/styles/light.ts
function self(vars) {
	const { textColor2, modalColor, borderColor, fontSize, primaryColor } = vars;
	return {
		loaderFontSize: fontSize,
		loaderTextColor: textColor2,
		loaderColor: modalColor,
		loaderBorder: `1px solid ${borderColor}`,
		loadingColor: primaryColor
	};
}
const logLight = require__mixins_use_theme.createTheme({
	name: "Log",
	common: require__styles_common_light,
	peers: {
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Code: require_code_styles_light
	},
	self
});
//#endregion
module.exports = logLight;
