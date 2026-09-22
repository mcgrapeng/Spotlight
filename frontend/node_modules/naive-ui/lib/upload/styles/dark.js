const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_progress_styles_dark = require("../../progress/styles/dark.js");
const require_upload_styles_light = require("./light.js");
let seemly = require("seemly");
//#region src/upload/styles/dark.ts
const uploadDark = {
	name: "Upload",
	common: require__styles_common_dark,
	peers: {
		Button: require_button_styles_dark,
		Progress: require_progress_styles_dark
	},
	self(vars) {
		const { errorColor } = vars;
		const commonSelf = require_upload_styles_light.self(vars);
		commonSelf.itemColorHoverError = (0, seemly.changeColor)(errorColor, { alpha: .09 });
		return commonSelf;
	}
};
//#endregion
module.exports = uploadDark;
