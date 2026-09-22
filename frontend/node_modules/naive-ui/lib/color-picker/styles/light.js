Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
//#region src/color-picker/styles/light.ts
function self(vars) {
	const { fontSize, boxShadow2, popoverColor, textColor2, borderRadius, borderColor, heightSmall, heightMedium, heightLarge, fontSizeSmall, fontSizeMedium, fontSizeLarge, dividerColor } = vars;
	return {
		panelFontSize: fontSize,
		boxShadow: boxShadow2,
		color: popoverColor,
		textColor: textColor2,
		borderRadius,
		border: `1px solid ${borderColor}`,
		heightSmall,
		heightMedium,
		heightLarge,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		dividerColor
	};
}
const colorPickerLight = require__mixins_use_theme.createTheme({
	name: "ColorPicker",
	common: require__styles_common_light,
	peers: {
		Input: require_input_styles_light,
		Button: require_button_styles_light.default
	},
	self
});
//#endregion
exports.default = colorPickerLight;
exports.self = self;
