Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_time_picker_styles_light = require("../../time-picker/styles/light.js");
const require_date_picker_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/date-picker/styles/light.ts
function self(vars) {
	const { hoverColor, fontSize, textColor2, textColorDisabled, popoverColor, primaryColor, borderRadiusSmall, iconColor, iconColorDisabled, textColor1, dividerColor, boxShadow2, borderRadius, fontWeightStrong } = vars;
	return {
		...require_date_picker_styles__common,
		itemFontSize: fontSize,
		calendarDaysFontSize: fontSize,
		calendarTitleFontSize: fontSize,
		itemTextColor: textColor2,
		itemTextColorDisabled: textColorDisabled,
		itemTextColorActive: popoverColor,
		itemTextColorCurrent: primaryColor,
		itemColorIncluded: (0, seemly.changeColor)(primaryColor, { alpha: .1 }),
		itemColorHover: hoverColor,
		itemColorDisabled: hoverColor,
		itemColorActive: primaryColor,
		itemBorderRadius: borderRadiusSmall,
		panelColor: popoverColor,
		panelTextColor: textColor2,
		arrowColor: iconColor,
		calendarTitleTextColor: textColor1,
		calendarTitleColorHover: hoverColor,
		calendarDaysTextColor: textColor2,
		panelHeaderDividerColor: dividerColor,
		calendarDaysDividerColor: dividerColor,
		calendarDividerColor: dividerColor,
		panelActionDividerColor: dividerColor,
		panelBoxShadow: boxShadow2,
		panelBorderRadius: borderRadius,
		calendarTitleFontWeight: fontWeightStrong,
		scrollItemBorderRadius: borderRadius,
		iconColor,
		iconColorDisabled
	};
}
const datePickerLight = require__mixins_use_theme.createTheme({
	name: "DatePicker",
	common: require__styles_common_light,
	peers: {
		Input: require_input_styles_light,
		Button: require_button_styles_light.default,
		TimePicker: require_time_picker_styles_light.default,
		Scrollbar: require__internal_scrollbar_styles_light.default
	},
	self
});
//#endregion
exports.default = datePickerLight;
exports.self = self;
