const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/badge/styles/light.ts
function self(vars) {
	const { errorColor, infoColor, successColor, warningColor, fontFamily } = vars;
	return {
		color: errorColor,
		colorInfo: infoColor,
		colorSuccess: successColor,
		colorError: errorColor,
		colorWarning: warningColor,
		fontSize: "12px",
		fontFamily
	};
}
const badgeLight = {
	name: "Badge",
	common: require__styles_common_light,
	self
};
//#endregion
module.exports = badgeLight;
