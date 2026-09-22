Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_dialog_styles__common = require("./_common.js");
//#region src/dialog/styles/light.ts
function self(vars) {
	const { textColor1, textColor2, modalColor, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, infoColor, successColor, warningColor, errorColor, primaryColor, dividerColor, borderRadius, fontWeightStrong, lineHeight, fontSize } = vars;
	return {
		...require_dialog_styles__common,
		fontSize,
		lineHeight,
		border: `1px solid ${dividerColor}`,
		titleTextColor: textColor1,
		textColor: textColor2,
		color: modalColor,
		closeColorHover,
		closeColorPressed,
		closeIconColor,
		closeIconColorHover,
		closeIconColorPressed,
		closeBorderRadius: borderRadius,
		iconColor: primaryColor,
		iconColorInfo: infoColor,
		iconColorSuccess: successColor,
		iconColorWarning: warningColor,
		iconColorError: errorColor,
		borderRadius,
		titleFontWeight: fontWeightStrong
	};
}
const dialogLight = require__mixins_use_theme.createTheme({
	name: "Dialog",
	common: require__styles_common_light,
	peers: { Button: require_button_styles_light.default },
	self
});
//#endregion
exports.default = dialogLight;
exports.self = self;
