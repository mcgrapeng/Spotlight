Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_popover_styles_light = require("../../popover/styles/light.js");
const require_dropdown_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/dropdown/styles/light.ts
function self(vars) {
	const { primaryColor, textColor2, dividerColor, hoverColor, popoverColor, invertedColor, borderRadius, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge, heightSmall, heightMedium, heightLarge, heightHuge, textColor3, opacityDisabled } = vars;
	return {
		...require_dropdown_styles__common,
		optionHeightSmall: heightSmall,
		optionHeightMedium: heightMedium,
		optionHeightLarge: heightLarge,
		optionHeightHuge: heightHuge,
		borderRadius,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		fontSizeHuge,
		optionTextColor: textColor2,
		optionTextColorHover: textColor2,
		optionTextColorActive: primaryColor,
		optionTextColorChildActive: primaryColor,
		color: popoverColor,
		dividerColor,
		suffixColor: textColor2,
		prefixColor: textColor2,
		optionColorHover: hoverColor,
		optionColorActive: (0, seemly.changeColor)(primaryColor, { alpha: .1 }),
		groupHeaderTextColor: textColor3,
		optionTextColorInverted: "#BBB",
		optionTextColorHoverInverted: "#FFF",
		optionTextColorActiveInverted: "#FFF",
		optionTextColorChildActiveInverted: "#FFF",
		colorInverted: invertedColor,
		dividerColorInverted: "#BBB",
		suffixColorInverted: "#BBB",
		prefixColorInverted: "#BBB",
		optionColorHoverInverted: primaryColor,
		optionColorActiveInverted: primaryColor,
		groupHeaderTextColorInverted: "#AAA",
		optionOpacityDisabled: opacityDisabled
	};
}
const dropdownLight = require__mixins_use_theme.createTheme({
	name: "Dropdown",
	common: require__styles_common_light,
	peers: { Popover: require_popover_styles_light.default },
	self
});
//#endregion
exports.default = dropdownLight;
exports.self = self;
