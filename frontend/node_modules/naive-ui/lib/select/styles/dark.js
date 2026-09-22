const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_select_menu_styles_dark = require("../../_internal/select-menu/styles/dark.js");
const require__internal_selection_styles_dark = require("../../_internal/selection/styles/dark.js");
const require_select_styles_light = require("./light.js");
//#region src/select/styles/dark.ts
const selectDark = {
	name: "Select",
	common: require__styles_common_dark,
	peers: {
		InternalSelection: require__internal_selection_styles_dark,
		InternalSelectMenu: require__internal_select_menu_styles_dark
	},
	self: require_select_styles_light.self
};
//#endregion
module.exports = selectDark;
