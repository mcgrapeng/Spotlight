const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_empty_styles_light = require("../../empty/styles/light.js");
const require__internal_select_menu_styles_dark = require("../../_internal/select-menu/styles/dark.js");
const require__internal_selection_styles_dark = require("../../_internal/selection/styles/dark.js");
const require_checkbox_styles_dark = require("../../checkbox/styles/dark.js");
const require_cascader_styles_light = require("./light.js");
//#region src/cascader/styles/dark.ts
const cascaderDark = {
	name: "Cascader",
	common: require__styles_common_dark,
	peers: {
		InternalSelectMenu: require__internal_select_menu_styles_dark,
		InternalSelection: require__internal_selection_styles_dark,
		Scrollbar: require__internal_scrollbar_styles_dark,
		Checkbox: require_checkbox_styles_dark,
		Empty: require_empty_styles_light.default
	},
	self: require_cascader_styles_light.self
};
//#endregion
module.exports = cascaderDark;
