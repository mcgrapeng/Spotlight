const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_time_picker_styles_light = require("./light.js");
//#region src/time-picker/styles/dark.ts
const timePickerDark = {
	name: "TimePicker",
	common: require__styles_common_dark,
	peers: {
		Scrollbar: require__internal_scrollbar_styles_dark,
		Button: require_button_styles_dark,
		Input: require_input_styles_dark
	},
	self: require_time_picker_styles_light.self
};
//#endregion
module.exports = timePickerDark;
