Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_card_styles_light = require("../../card/styles/light.js");
const require_dialog_styles_light = require("../../dialog/styles/light.js");
//#region src/modal/styles/light.ts
function self(vars) {
	const { modalColor, textColor2, boxShadow3 } = vars;
	return {
		color: modalColor,
		textColor: textColor2,
		boxShadow: boxShadow3
	};
}
const modalLight = require__mixins_use_theme.createTheme({
	name: "Modal",
	common: require__styles_common_light,
	peers: {
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Dialog: require_dialog_styles_light.default,
		Card: require_card_styles_light.default
	},
	self
});
//#endregion
exports.default = modalLight;
exports.self = self;
