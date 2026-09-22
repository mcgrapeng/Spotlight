const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_color_picker_styles_light = require("./light.js");
//#region src/color-picker/styles/dark.ts
const colorPickerDark = {
	name: "ColorPicker",
	common: require__styles_common_dark,
	peers: {
		Input: require_input_styles_dark,
		Button: require_button_styles_dark
	},
	self: require_color_picker_styles_light.self
};
//#endregion
module.exports = colorPickerDark;
