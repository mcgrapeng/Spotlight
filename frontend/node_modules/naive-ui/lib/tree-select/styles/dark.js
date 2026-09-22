const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_empty_styles_dark = require("../../empty/styles/dark.js");
const require__internal_selection_styles_dark = require("../../_internal/selection/styles/dark.js");
//#region src/tree-select/styles/dark.ts
const treeSelectDark = {
	name: "TreeSelect",
	common: require__styles_common_dark,
	peers: {
		Tree: require("../../tree/styles/dark.js"),
		Empty: require_empty_styles_dark,
		InternalSelection: require__internal_selection_styles_dark
	}
};
//#endregion
module.exports = treeSelectDark;
