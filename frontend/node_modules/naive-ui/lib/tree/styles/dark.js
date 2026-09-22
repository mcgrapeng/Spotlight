const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_empty_styles_dark = require("../../empty/styles/dark.js");
const require_checkbox_styles_dark = require("../../checkbox/styles/dark.js");
const require_tree_styles_light = require("./light.js");
let seemly = require("seemly");
//#region src/tree/styles/dark.ts
const treeDark = {
	name: "Tree",
	common: require__styles_common_dark,
	peers: {
		Checkbox: require_checkbox_styles_dark,
		Scrollbar: require__internal_scrollbar_styles_dark,
		Empty: require_empty_styles_dark
	},
	self(vars) {
		const { primaryColor } = vars;
		const commonSelf = require_tree_styles_light.self(vars);
		commonSelf.nodeColorActive = (0, seemly.changeColor)(primaryColor, { alpha: .15 });
		return commonSelf;
	}
};
//#endregion
module.exports = treeDark;
