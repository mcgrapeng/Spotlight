Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_calendar_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/calendar/styles/light.ts
function self(vars) {
	const { borderRadius, fontSize, lineHeight, textColor2, textColor1, textColorDisabled, dividerColor, fontWeightStrong, primaryColor, baseColor, hoverColor, cardColor, modalColor, popoverColor } = vars;
	return {
		...require_calendar_styles__common,
		borderRadius,
		borderColor: (0, seemly.composite)(cardColor, dividerColor),
		borderColorModal: (0, seemly.composite)(modalColor, dividerColor),
		borderColorPopover: (0, seemly.composite)(popoverColor, dividerColor),
		textColor: textColor2,
		titleFontWeight: fontWeightStrong,
		titleTextColor: textColor1,
		dayTextColor: textColorDisabled,
		fontSize,
		lineHeight,
		dateColorCurrent: primaryColor,
		dateTextColorCurrent: baseColor,
		cellColorHover: (0, seemly.composite)(cardColor, hoverColor),
		cellColorHoverModal: (0, seemly.composite)(modalColor, hoverColor),
		cellColorHoverPopover: (0, seemly.composite)(popoverColor, hoverColor),
		cellColor: cardColor,
		cellColorModal: modalColor,
		cellColorPopover: popoverColor,
		barColor: primaryColor
	};
}
const calendarLight = require__mixins_use_theme.createTheme({
	name: "Calendar",
	common: require__styles_common_light,
	peers: { Button: require_button_styles_light.default },
	self
});
//#endregion
exports.default = calendarLight;
exports.self = self;
