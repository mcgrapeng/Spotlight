const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_tabs_styles_light = require("./light.js");
//#region src/tabs/styles/dark.ts
const tabsDark = {
	name: "Tabs",
	common: require__styles_common_dark,
	peers: { Button: require_button_styles_dark },
	self(vars) {
		const commonSelf = require_tabs_styles_light.self(vars);
		const { inputColor } = vars;
		commonSelf.colorSegment = inputColor;
		commonSelf.tabColorSegment = inputColor;
		return commonSelf;
	}
};
//#endregion
module.exports = tabsDark;
