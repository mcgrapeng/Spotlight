Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_empty_styles_light = require("../../empty/styles/light.js");
const require__internal_selection_styles_light = require("../../_internal/selection/styles/light.js");
const require_tree_styles_light = require("../../tree/styles/light.js");
//#region src/tree-select/styles/light.ts
function self(vars) {
	const { popoverColor, boxShadow2, borderRadius, heightMedium, dividerColor, textColor2 } = vars;
	return {
		menuPadding: "4px",
		menuColor: popoverColor,
		menuBoxShadow: boxShadow2,
		menuBorderRadius: borderRadius,
		menuHeight: `calc(${heightMedium} * 7.6)`,
		actionDividerColor: dividerColor,
		actionTextColor: textColor2,
		actionPadding: "8px 12px",
		headerDividerColor: dividerColor,
		headerTextColor: textColor2,
		headerPadding: "8px 12px"
	};
}
const treeSelectLight = require__mixins_use_theme.createTheme({
	name: "TreeSelect",
	common: require__styles_common_light,
	peers: {
		Tree: require_tree_styles_light.default,
		Empty: require_empty_styles_light.default,
		InternalSelection: require__internal_selection_styles_light
	},
	self
});
//#endregion
exports.default = treeSelectLight;
exports.self = self;
