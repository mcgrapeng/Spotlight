const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_switch_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/switch/styles/dark.ts
const switchDark = {
	name: "Switch",
	common: require__styles_common_dark,
	self(vars) {
		const { primaryColorSuppl, opacityDisabled, borderRadius, primaryColor, textColor2, baseColor } = vars;
		const railOverlayColor = "rgba(255, 255, 255, .20)";
		return {
			...require_switch_styles__common,
			iconColor: baseColor,
			textColor: textColor2,
			loadingColor: primaryColorSuppl,
			opacityDisabled,
			railColor: railOverlayColor,
			railColorActive: primaryColorSuppl,
			buttonBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			buttonColor: "#FFF",
			railBorderRadiusSmall: borderRadius,
			railBorderRadiusMedium: borderRadius,
			railBorderRadiusLarge: borderRadius,
			buttonBorderRadiusSmall: borderRadius,
			buttonBorderRadiusMedium: borderRadius,
			buttonBorderRadiusLarge: borderRadius,
			boxShadowFocus: `0 0 8px 0 ${(0, seemly.changeColor)(primaryColor, { alpha: .3 })}`
		};
	}
};
//#endregion
module.exports = switchDark;
