const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_popover_styles_dark = require("../../popover/styles/dark.js");
const require_tooltip_styles__common = require("./_common.js");
//#region src/tooltip/styles/dark.ts
const tooltipDark = {
	name: "Tooltip",
	common: require__styles_common_dark,
	peers: { Popover: require_popover_styles_dark },
	self(vars) {
		const { borderRadius, boxShadow2, popoverColor, textColor2 } = vars;
		return {
			...require_tooltip_styles__common,
			borderRadius,
			boxShadow: boxShadow2,
			color: popoverColor,
			textColor: textColor2
		};
	}
};
//#endregion
module.exports = tooltipDark;
