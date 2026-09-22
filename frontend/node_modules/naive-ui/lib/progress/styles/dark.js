const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_progress_styles_light = require("./light.js");
//#region src/progress/styles/dark.ts
const progressDark = {
	name: "Progress",
	common: require__styles_common_dark,
	self(vars) {
		const commonSelf = require_progress_styles_light.self(vars);
		commonSelf.textColorLineInner = "rgb(0, 0, 0)";
		commonSelf.lineBgProcessing = "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)";
		return commonSelf;
	}
};
//#endregion
module.exports = progressDark;
