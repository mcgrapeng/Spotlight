Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_empty_styles_light = require("../../empty/styles/light.js");
const require__internal_select_menu_styles_light = require("../../_internal/select-menu/styles/light.js");
const require__internal_selection_styles_light = require("../../_internal/selection/styles/light.js");
const require_checkbox_styles_light = require("../../checkbox/styles/light.js");
//#region src/cascader/styles/light.ts
function self(vars) {
	const { borderRadius, boxShadow2, popoverColor, textColor2, textColor3, primaryColor, textColorDisabled, dividerColor, hoverColor, fontSizeMedium, heightMedium } = vars;
	return {
		menuBorderRadius: borderRadius,
		menuColor: popoverColor,
		menuBoxShadow: boxShadow2,
		menuDividerColor: dividerColor,
		menuHeight: "calc(var(--n-option-height) * 6.6)",
		optionArrowColor: textColor3,
		optionHeight: heightMedium,
		optionFontSize: fontSizeMedium,
		optionColorHover: hoverColor,
		optionTextColor: textColor2,
		optionTextColorActive: primaryColor,
		optionTextColorDisabled: textColorDisabled,
		optionCheckMarkColor: primaryColor,
		loadingColor: primaryColor,
		columnWidth: "180px"
	};
}
const cascaderLight = require__mixins_use_theme.createTheme({
	name: "Cascader",
	common: require__styles_common_light,
	peers: {
		InternalSelectMenu: require__internal_select_menu_styles_light.default,
		InternalSelection: require__internal_selection_styles_light,
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Checkbox: require_checkbox_styles_light.default,
		Empty: require_empty_styles_light.default
	},
	self
});
//#endregion
exports.default = cascaderLight;
exports.self = self;
