const require__styles_common_light = require("../../_styles/common/light.js");
let seemly = require("seemly");
//#region src/gradient-text/styles/light.ts
function self(vars) {
	const { primaryColor, successColor, warningColor, errorColor, infoColor, fontWeightStrong } = vars;
	return {
		fontWeight: fontWeightStrong,
		rotate: "252deg",
		colorStartPrimary: (0, seemly.changeColor)(primaryColor, { alpha: .6 }),
		colorEndPrimary: primaryColor,
		colorStartInfo: (0, seemly.changeColor)(infoColor, { alpha: .6 }),
		colorEndInfo: infoColor,
		colorStartWarning: (0, seemly.changeColor)(warningColor, { alpha: .6 }),
		colorEndWarning: warningColor,
		colorStartError: (0, seemly.changeColor)(errorColor, { alpha: .6 }),
		colorEndError: errorColor,
		colorStartSuccess: (0, seemly.changeColor)(successColor, { alpha: .6 }),
		colorEndSuccess: successColor
	};
}
const gradientTextLight = {
	name: "GradientText",
	common: require__styles_common_light,
	self
};
//#endregion
module.exports = gradientTextLight;
