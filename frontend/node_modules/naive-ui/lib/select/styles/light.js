Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_select_menu_styles_light = require("../../_internal/select-menu/styles/light.js");
const require__internal_selection_styles_light = require("../../_internal/selection/styles/light.js");
//#region src/select/styles/light.ts
function self(vars) {
	const { boxShadow2 } = vars;
	return { menuBoxShadow: boxShadow2 };
}
const selectLight = require__mixins_use_theme.createTheme({
	name: "Select",
	common: require__styles_common_light,
	peers: {
		InternalSelection: require__internal_selection_styles_light,
		InternalSelectMenu: require__internal_select_menu_styles_light.default
	},
	self
});
//#endregion
exports.default = selectLight;
exports.self = self;
