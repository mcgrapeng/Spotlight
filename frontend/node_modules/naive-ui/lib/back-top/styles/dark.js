const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_back_top_styles__common = require("./_common.js");
//#region src/back-top/styles/dark.ts
const backTopDark = {
	name: "BackTop",
	common: require__styles_common_dark,
	self(vars) {
		const { popoverColor, textColor2, primaryColorHover, primaryColorPressed } = vars;
		return {
			...require_back_top_styles__common,
			color: popoverColor,
			textColor: textColor2,
			iconColor: textColor2,
			iconColorHover: primaryColorHover,
			iconColorPressed: primaryColorPressed,
			boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
			boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
			boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)"
		};
	}
};
//#endregion
module.exports = backTopDark;
