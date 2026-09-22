Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_popover_styles__common = require("./_common.js");
//#region src/popover/styles/light.ts
function self(vars) {
	const { boxShadow2, popoverColor, textColor2, borderRadius, fontSize, dividerColor } = vars;
	return {
		...require_popover_styles__common,
		fontSize,
		borderRadius,
		color: popoverColor,
		dividerColor,
		textColor: textColor2,
		boxShadow: boxShadow2
	};
}
const popoverLight = require__mixins_use_theme.createTheme({
	name: "Popover",
	common: require__styles_common_light,
	peers: { Scrollbar: require__internal_scrollbar_styles_light.default },
	self
});
//#endregion
exports.default = popoverLight;
exports.self = self;
