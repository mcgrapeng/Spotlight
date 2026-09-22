const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
let seemly = require("seemly");
//#region src/layout/styles/dark.ts
const layoutDark = {
	name: "Layout",
	common: require__styles_common_dark,
	peers: { Scrollbar: require__internal_scrollbar_styles_dark },
	self(vars) {
		const { textColor2, bodyColor, popoverColor, cardColor, dividerColor, scrollbarColor, scrollbarColorHover } = vars;
		return {
			textColor: textColor2,
			textColorInverted: textColor2,
			color: bodyColor,
			colorEmbedded: bodyColor,
			headerColor: cardColor,
			headerColorInverted: cardColor,
			footerColor: cardColor,
			footerColorInverted: cardColor,
			headerBorderColor: dividerColor,
			headerBorderColorInverted: dividerColor,
			footerBorderColor: dividerColor,
			footerBorderColorInverted: dividerColor,
			siderBorderColor: dividerColor,
			siderBorderColorInverted: dividerColor,
			siderColor: cardColor,
			siderColorInverted: cardColor,
			siderToggleButtonBorder: "1px solid transparent",
			siderToggleButtonColor: popoverColor,
			siderToggleButtonIconColor: textColor2,
			siderToggleButtonIconColorInverted: textColor2,
			siderToggleBarColor: (0, seemly.composite)(bodyColor, scrollbarColor),
			siderToggleBarColorHover: (0, seemly.composite)(bodyColor, scrollbarColorHover),
			__invertScrollbar: "false"
		};
	}
};
//#endregion
module.exports = layoutDark;
