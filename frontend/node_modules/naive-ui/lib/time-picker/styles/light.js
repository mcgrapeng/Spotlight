Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_time_picker_styles__common = require("./_common.js");
//#region src/time-picker/styles/light.ts
function self(vars) {
	const { popoverColor, textColor2, primaryColor, hoverColor, dividerColor, opacityDisabled, boxShadow2, borderRadius, iconColor, iconColorDisabled } = vars;
	return {
		...require_time_picker_styles__common,
		panelColor: popoverColor,
		panelBoxShadow: boxShadow2,
		panelDividerColor: dividerColor,
		itemTextColor: textColor2,
		itemTextColorActive: primaryColor,
		itemColorHover: hoverColor,
		itemOpacityDisabled: opacityDisabled,
		itemBorderRadius: borderRadius,
		borderRadius,
		iconColor,
		iconColorDisabled
	};
}
const timePickerLight = require__mixins_use_theme.createTheme({
	name: "TimePicker",
	common: require__styles_common_light,
	peers: {
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Button: require_button_styles_light.default,
		Input: require_input_styles_light
	},
	self
});
//#endregion
exports.default = timePickerLight;
exports.self = self;
