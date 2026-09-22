const require__styles_common_light = require("../../_styles/common/light.js");
const require_switch_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/switch/styles/light.ts
function self(vars) {
	const { primaryColor, opacityDisabled, borderRadius, textColor3 } = vars;
	const railOverlayColor = "rgba(0, 0, 0, .14)";
	return {
		...require_switch_styles__common,
		iconColor: textColor3,
		textColor: "white",
		loadingColor: primaryColor,
		opacityDisabled,
		railColor: railOverlayColor,
		railColorActive: primaryColor,
		buttonBoxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",
		buttonColor: "#FFF",
		railBorderRadiusSmall: borderRadius,
		railBorderRadiusMedium: borderRadius,
		railBorderRadiusLarge: borderRadius,
		buttonBorderRadiusSmall: borderRadius,
		buttonBorderRadiusMedium: borderRadius,
		buttonBorderRadiusLarge: borderRadius,
		boxShadowFocus: `0 0 0 2px ${(0, seemly.changeColor)(primaryColor, { alpha: .2 })}`
	};
}
const switchLight = {
	name: "Switch",
	common: require__styles_common_light,
	self
};
//#endregion
module.exports = switchLight;
