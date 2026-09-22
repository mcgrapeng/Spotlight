const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_time_picker_styles_dark = require("../../time-picker/styles/dark.js");
const require_date_picker_styles_light = require("./light.js");
let seemly = require("seemly");
//#region src/date-picker/styles/dark.ts
const datePickerDark = {
	name: "DatePicker",
	common: require__styles_common_dark,
	peers: {
		Input: require_input_styles_dark,
		Button: require_button_styles_dark,
		TimePicker: require_time_picker_styles_dark,
		Scrollbar: require__internal_scrollbar_styles_dark
	},
	self(vars) {
		const { popoverColor, hoverColor, primaryColor } = vars;
		const commonSelf = require_date_picker_styles_light.self(vars);
		commonSelf.itemColorDisabled = (0, seemly.composite)(popoverColor, hoverColor);
		commonSelf.itemColorIncluded = (0, seemly.changeColor)(primaryColor, { alpha: .15 });
		commonSelf.itemColorHover = (0, seemly.composite)(popoverColor, hoverColor);
		return commonSelf;
	}
};
//#endregion
module.exports = datePickerDark;
