const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/float-button-group/styles/light.ts
function self(vars) {
	const { popoverColor, dividerColor, borderRadius } = vars;
	return {
		color: popoverColor,
		buttonBorderColor: dividerColor,
		borderRadiusSquare: borderRadius,
		boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)"
	};
}
const themeLight = {
	name: "FloatButtonGroup",
	common: require__styles_common_light,
	self
};
//#endregion
module.exports = themeLight;
