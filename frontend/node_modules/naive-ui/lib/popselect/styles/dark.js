const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_select_menu_styles_dark = require("../../_internal/select-menu/styles/dark.js");
//#region src/popselect/styles/dark.ts
const popselect = {
	name: "Popselect",
	common: require__styles_common_dark,
	peers: {
		Popover: require("../../popover/styles/dark.js"),
		InternalSelectMenu: require__internal_select_menu_styles_dark
	}
};
//#endregion
module.exports = popselect;
