Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_empty_styles_light = require("../../empty/styles/light.js");
const require_checkbox_styles_light = require("../../checkbox/styles/light.js");
let seemly = require("seemly");
//#region src/tree/styles/light.ts
function self(vars) {
	const { borderRadiusSmall, dividerColor, hoverColor, pressedColor, primaryColor, textColor3, textColor2, textColorDisabled, fontSize } = vars;
	return {
		fontSize,
		lineHeight: "1.5",
		nodeHeight: "30px",
		nodeWrapperPadding: "3px 0",
		nodeBorderRadius: borderRadiusSmall,
		nodeColorHover: hoverColor,
		nodeColorPressed: pressedColor,
		nodeColorActive: (0, seemly.changeColor)(primaryColor, { alpha: .1 }),
		arrowColor: textColor3,
		nodeTextColor: textColor2,
		nodeTextColorDisabled: textColorDisabled,
		loadingColor: primaryColor,
		dropMarkColor: primaryColor,
		lineColor: dividerColor
	};
}
const treeLight = require__mixins_use_theme.createTheme({
	name: "Tree",
	common: require__styles_common_light,
	peers: {
		Checkbox: require_checkbox_styles_light.default,
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Empty: require_empty_styles_light.default
	},
	self
});
//#endregion
exports.default = treeLight;
exports.self = self;
