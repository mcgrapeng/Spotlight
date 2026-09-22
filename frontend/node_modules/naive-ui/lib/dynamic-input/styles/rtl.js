Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_input_styles_rtl = require("../../input/styles/rtl.js");
const require_button_styles_rtl = require("../../button/styles/rtl.js");
const require_checkbox_styles_rtl = require("../../checkbox/styles/rtl.js");
const require_button_group_styles_rtl = require("../../button-group/styles/rtl.js");
const require_input_number_styles_rtl = require("../../input-number/styles/rtl.js");
//#region src/dynamic-input/styles/rtl.ts
const dynamicInputRtl = {
	name: "DynamicInput",
	style: require("../src/styles/rtl.cssr.js"),
	peers: [
		require_input_styles_rtl.inputRtl,
		require_button_styles_rtl.buttonRtl,
		require_button_group_styles_rtl.buttonGroupRtl,
		require_checkbox_styles_rtl.checkboxRtl,
		require_input_number_styles_rtl.inputNumberRtl
	]
};
//#endregion
exports.dynamicInputRtl = dynamicInputRtl;
