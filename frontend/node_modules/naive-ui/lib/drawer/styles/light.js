Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
//#region src/drawer/styles/light.ts
function self(vars) {
	const { modalColor, textColor1, textColor2, boxShadow3, lineHeight, fontWeightStrong, dividerColor, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, borderRadius, primaryColorHover } = vars;
	return {
		bodyPadding: "16px 24px",
		borderRadius,
		headerPadding: "16px 24px",
		footerPadding: "16px 24px",
		color: modalColor,
		textColor: textColor2,
		titleTextColor: textColor1,
		titleFontSize: "18px",
		titleFontWeight: fontWeightStrong,
		boxShadow: boxShadow3,
		lineHeight,
		headerBorderBottom: `1px solid ${dividerColor}`,
		footerBorderTop: `1px solid ${dividerColor}`,
		closeIconColor,
		closeIconColorHover,
		closeIconColorPressed,
		closeSize: "22px",
		closeIconSize: "18px",
		closeColorHover,
		closeColorPressed,
		closeBorderRadius: borderRadius,
		resizableTriggerColorHover: primaryColorHover
	};
}
const drawerLight = require__mixins_use_theme.createTheme({
	name: "Drawer",
	common: require__styles_common_light,
	peers: { Scrollbar: require__internal_scrollbar_styles_light.default },
	self
});
//#endregion
exports.default = drawerLight;
exports.self = self;
