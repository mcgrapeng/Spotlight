const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
//#region src/input-number/styles/dark.ts
const inputNumberDark = {
	name: "InputNumber",
	common: require__styles_common_dark,
	peers: {
		Button: require("../../button/styles/dark.js"),
		Input: require_input_styles_dark
	},
	self(vars) {
		const { textColorDisabled } = vars;
		return { iconColorDisabled: textColorDisabled };
	}
};
//#endregion
module.exports = inputNumberDark;
