Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../../_mixins/use-theme.js");
const require__styles_common_light = require("../../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../scrollbar/styles/light.js");
const require_empty_styles_light = require("../../../empty/styles/light.js");
const require__internal_select_menu_styles__common = require("./_common.js");
//#region src/_internal/select-menu/styles/light.ts
function self(vars) {
	const { borderRadius, popoverColor, textColor3, dividerColor, textColor2, primaryColorPressed, textColorDisabled, primaryColor, opacityDisabled, hoverColor, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge, heightTiny, heightSmall, heightMedium, heightLarge, heightHuge } = vars;
	return {
		...require__internal_select_menu_styles__common,
		optionFontSizeTiny: fontSizeTiny,
		optionFontSizeSmall: fontSizeSmall,
		optionFontSizeMedium: fontSizeMedium,
		optionFontSizeLarge: fontSizeLarge,
		optionFontSizeHuge: fontSizeHuge,
		optionHeightTiny: heightTiny,
		optionHeightSmall: heightSmall,
		optionHeightMedium: heightMedium,
		optionHeightLarge: heightLarge,
		optionHeightHuge: heightHuge,
		borderRadius,
		color: popoverColor,
		groupHeaderTextColor: textColor3,
		actionDividerColor: dividerColor,
		optionTextColor: textColor2,
		optionTextColorPressed: primaryColorPressed,
		optionTextColorDisabled: textColorDisabled,
		optionTextColorActive: primaryColor,
		optionOpacityDisabled: opacityDisabled,
		optionCheckColor: primaryColor,
		optionColorPending: hoverColor,
		optionColorActive: "rgba(0, 0, 0, 0)",
		optionColorActivePending: hoverColor,
		actionTextColor: textColor2,
		loadingColor: primaryColor
	};
}
const internalSelectMenuLight = require__mixins_use_theme.createTheme({
	name: "InternalSelectMenu",
	common: require__styles_common_light,
	peers: {
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Empty: require_empty_styles_light.default
	},
	self
});
//#endregion
exports.default = internalSelectMenuLight;
exports.self = self;
