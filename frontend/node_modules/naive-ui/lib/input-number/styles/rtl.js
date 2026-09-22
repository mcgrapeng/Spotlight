Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_input_styles_rtl = require("../../input/styles/rtl.js");
const require_button_styles_rtl = require("../../button/styles/rtl.js");
//#region src/input-number/styles/rtl.ts
const inputNumberRtl = {
	name: "InputNumber",
	style: require("../src/styles/rtl.cssr.js"),
	peers: [require_input_styles_rtl.inputRtl, require_button_styles_rtl.buttonRtl]
};
//#endregion
exports.inputNumberRtl = inputNumberRtl;
