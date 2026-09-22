Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_notification_styles__common = require("./_common.js");
//#region src/notification/styles/light.ts
function self(vars) {
	const { textColor2, successColor, infoColor, warningColor, errorColor, popoverColor, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, textColor1, textColor3, borderRadius, fontWeightStrong, boxShadow2, lineHeight, fontSize } = vars;
	return {
		...require_notification_styles__common,
		borderRadius,
		lineHeight,
		fontSize,
		headerFontWeight: fontWeightStrong,
		iconColor: textColor2,
		iconColorSuccess: successColor,
		iconColorInfo: infoColor,
		iconColorWarning: warningColor,
		iconColorError: errorColor,
		color: popoverColor,
		textColor: textColor2,
		closeIconColor,
		closeIconColorHover,
		closeIconColorPressed,
		closeBorderRadius: borderRadius,
		closeColorHover,
		closeColorPressed,
		headerTextColor: textColor1,
		descriptionTextColor: textColor3,
		actionTextColor: textColor2,
		boxShadow: boxShadow2
	};
}
const notificationLight = require__mixins_use_theme.createTheme({
	name: "Notification",
	common: require__styles_common_light,
	peers: { Scrollbar: require__internal_scrollbar_styles_light.default },
	self
});
//#endregion
exports.default = notificationLight;
exports.self = self;
