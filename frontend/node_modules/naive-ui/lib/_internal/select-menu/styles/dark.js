const require__styles_common_dark = require("../../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../scrollbar/styles/dark.js");
const require_empty_styles_dark = require("../../../empty/styles/dark.js");
const require__internal_select_menu_styles_light = require("./light.js");
//#region src/_internal/select-menu/styles/dark.ts
const internalSelectMenuDark = {
	name: "InternalSelectMenu",
	common: require__styles_common_dark,
	peers: {
		Scrollbar: require__internal_scrollbar_styles_dark,
		Empty: require_empty_styles_dark
	},
	self: require__internal_select_menu_styles_light.self
};
//#endregion
module.exports = internalSelectMenuDark;
