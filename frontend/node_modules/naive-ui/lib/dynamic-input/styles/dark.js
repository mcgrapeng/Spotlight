const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_dynamic_input_styles__common = require("./_common.js");
//#region src/dynamic-input/styles/dark.ts
const dynamicInputDark = {
	name: "DynamicInput",
	common: require__styles_common_dark,
	peers: {
		Input: require_input_styles_dark,
		Button: require_button_styles_dark
	},
	self() {
		return require_dynamic_input_styles__common;
	}
};
//#endregion
module.exports = dynamicInputDark;
