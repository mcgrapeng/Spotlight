Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_popover_styles_light = require("../../popover/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_popconfirm_styles__common = require("./_common.js");
//#region src/popconfirm/styles/light.ts
function self(vars) {
	const { fontSize, warningColor } = vars;
	return {
		...require_popconfirm_styles__common,
		fontSize,
		iconColor: warningColor
	};
}
const popconfirmLight = require__mixins_use_theme.createTheme({
	name: "Popconfirm",
	common: require__styles_common_light,
	peers: {
		Button: require_button_styles_light.default,
		Popover: require_popover_styles_light.default
	},
	self
});
//#endregion
exports.default = popconfirmLight;
exports.self = self;
