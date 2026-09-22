const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/qr-code/styles/light.ts
function self(vars) {
	return { borderRadius: vars.borderRadius };
}
const themeLight = {
	name: "QrCode",
	common: require__styles_common_light,
	self
};
//#endregion
module.exports = themeLight;
