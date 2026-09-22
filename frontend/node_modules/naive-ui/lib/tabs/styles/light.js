Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_tabs_styles__common = require("./_common.js");
//#region src/tabs/styles/light.ts
function self(vars) {
	const { textColor2, primaryColor, textColorDisabled, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, tabColor, baseColor, dividerColor, fontWeight, textColor1, borderRadius, fontSize, fontWeightStrong } = vars;
	return {
		...require_tabs_styles__common,
		colorSegment: tabColor,
		tabFontSizeCard: fontSize,
		tabTextColorLine: textColor1,
		tabTextColorActiveLine: primaryColor,
		tabTextColorHoverLine: primaryColor,
		tabTextColorDisabledLine: textColorDisabled,
		tabTextColorSegment: textColor1,
		tabTextColorActiveSegment: textColor2,
		tabTextColorHoverSegment: textColor2,
		tabTextColorDisabledSegment: textColorDisabled,
		tabTextColorBar: textColor1,
		tabTextColorActiveBar: primaryColor,
		tabTextColorHoverBar: primaryColor,
		tabTextColorDisabledBar: textColorDisabled,
		tabTextColorCard: textColor1,
		tabTextColorHoverCard: textColor1,
		tabTextColorActiveCard: primaryColor,
		tabTextColorDisabledCard: textColorDisabled,
		barColor: primaryColor,
		closeIconColor,
		closeIconColorHover,
		closeIconColorPressed,
		closeColorHover,
		closeColorPressed,
		closeBorderRadius: borderRadius,
		tabColor,
		tabColorSegment: baseColor,
		tabBorderColor: dividerColor,
		tabFontWeightActive: fontWeight,
		tabFontWeight: fontWeight,
		tabBorderRadius: borderRadius,
		paneTextColor: textColor2,
		fontWeightStrong
	};
}
const tabsLight = require__mixins_use_theme.createTheme({
	name: "Tabs",
	common: require__styles_common_light,
	peers: { Button: require_button_styles_light.default },
	self
});
//#endregion
exports.default = tabsLight;
exports.self = self;
