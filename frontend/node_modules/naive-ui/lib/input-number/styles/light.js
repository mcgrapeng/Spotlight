const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
//#region src/input-number/styles/light.ts
function self(vars) {
	const { textColorDisabled } = vars;
	return { iconColorDisabled: textColorDisabled };
}
const inputNumberLight = require__mixins_use_theme.createTheme({
	name: "InputNumber",
	common: require__styles_common_light,
	peers: {
		Button: require_button_styles_light.default,
		Input: require_input_styles_light
	},
	self
});
//#endregion
module.exports = inputNumberLight;
