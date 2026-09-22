const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_dynamic_input_styles__common = require("./_common.js");
//#region src/dynamic-input/styles/light.ts
function self() {
	return require_dynamic_input_styles__common;
}
const dynamicInputLight = require__mixins_use_theme.createTheme({
	name: "DynamicInput",
	common: require__styles_common_light,
	peers: {
		Input: require_input_styles_light,
		Button: require_button_styles_light.default
	},
	self
});
//#endregion
module.exports = dynamicInputLight;
