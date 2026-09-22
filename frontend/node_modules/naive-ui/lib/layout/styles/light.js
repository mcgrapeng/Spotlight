Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
let seemly = require("seemly");
//#region src/layout/styles/light.ts
function self(vars) {
	const { baseColor, textColor2, bodyColor, cardColor, dividerColor, actionColor, scrollbarColor, scrollbarColorHover, invertedColor } = vars;
	return {
		textColor: textColor2,
		textColorInverted: "#FFF",
		color: bodyColor,
		colorEmbedded: actionColor,
		headerColor: cardColor,
		headerColorInverted: invertedColor,
		footerColor: actionColor,
		footerColorInverted: invertedColor,
		headerBorderColor: dividerColor,
		headerBorderColorInverted: invertedColor,
		footerBorderColor: dividerColor,
		footerBorderColorInverted: invertedColor,
		siderBorderColor: dividerColor,
		siderBorderColorInverted: invertedColor,
		siderColor: cardColor,
		siderColorInverted: invertedColor,
		siderToggleButtonBorder: `1px solid ${dividerColor}`,
		siderToggleButtonColor: baseColor,
		siderToggleButtonIconColor: textColor2,
		siderToggleButtonIconColorInverted: textColor2,
		siderToggleBarColor: (0, seemly.composite)(bodyColor, scrollbarColor),
		siderToggleBarColorHover: (0, seemly.composite)(bodyColor, scrollbarColorHover),
		__invertScrollbar: "true"
	};
}
const layoutLight = require__mixins_use_theme.createTheme({
	name: "Layout",
	common: require__styles_common_light,
	peers: { Scrollbar: require__internal_scrollbar_styles_light.default },
	self
});
//#endregion
exports.default = layoutLight;
exports.self = self;
