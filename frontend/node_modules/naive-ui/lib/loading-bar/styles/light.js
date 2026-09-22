const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/loading-bar/styles/light.ts
function self(vars) {
	const { primaryColor, errorColor } = vars;
	return {
		colorError: errorColor,
		colorLoading: primaryColor,
		height: "2px"
	};
}
const loadingBarLight = {
	name: "LoadingBar",
	common: require__styles_common_light,
	self
};
//#endregion
module.exports = loadingBarLight;
