const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_button_styles_light = require("./light.js");
//#region src/button/styles/dark.ts
const buttonDark = {
	name: "Button",
	common: require__styles_common_dark,
	self(vars) {
		const commonSelf = require_button_styles_light.self(vars);
		commonSelf.waveOpacity = "0.8";
		commonSelf.colorOpacitySecondary = "0.16";
		commonSelf.colorOpacitySecondaryHover = "0.2";
		commonSelf.colorOpacitySecondaryPressed = "0.12";
		return commonSelf;
	}
};
//#endregion
module.exports = buttonDark;
