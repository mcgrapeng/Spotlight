const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/rate/styles/light.ts
function self(vars) {
	const { railColor } = vars;
	return {
		itemColor: railColor,
		itemColorActive: "#FFCC33",
		sizeSmall: "16px",
		sizeMedium: "20px",
		sizeLarge: "24px"
	};
}
const themeLight = {
	name: "Rate",
	common: require__styles_common_light,
	self
};
//#endregion
module.exports = themeLight;
