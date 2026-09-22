const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_checkbox_styles_light = require("./light.js");
//#region src/checkbox/styles/dark.ts
const checkboxDark = {
	name: "Checkbox",
	common: require__styles_common_dark,
	self(vars) {
		const { cardColor } = vars;
		const commonSelf = require_checkbox_styles_light.self(vars);
		commonSelf.color = "#0000";
		commonSelf.checkMarkColor = cardColor;
		return commonSelf;
	}
};
//#endregion
module.exports = checkboxDark;
