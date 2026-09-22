const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_select_menu_styles_light = require("../../_internal/select-menu/styles/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
//#region src/mention/styles/light.ts
function self(vars) {
	const { boxShadow2 } = vars;
	return { menuBoxShadow: boxShadow2 };
}
const mentionLight = require__mixins_use_theme.createTheme({
	name: "Mention",
	common: require__styles_common_light,
	peers: {
		InternalSelectMenu: require__internal_select_menu_styles_light.default,
		Input: require_input_styles_light
	},
	self
});
//#endregion
module.exports = mentionLight;
