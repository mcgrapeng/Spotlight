const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_select_menu_styles_dark = require("../../_internal/select-menu/styles/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_auto_complete_styles_light = require("./light.js");
//#region src/auto-complete/styles/dark.ts
const autoCompleteDark = {
	name: "AutoComplete",
	common: require__styles_common_dark,
	peers: {
		InternalSelectMenu: require__internal_select_menu_styles_dark,
		Input: require_input_styles_dark
	},
	self: require_auto_complete_styles_light.self
};
//#endregion
module.exports = autoCompleteDark;
