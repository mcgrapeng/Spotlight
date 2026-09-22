const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_alert_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/alert/styles/dark.ts
const alertDark = {
	name: "Alert",
	common: require__styles_common_dark,
	self(vars) {
		const { lineHeight, borderRadius, fontWeightStrong, dividerColor, inputColor, textColor1, textColor2, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, infoColorSuppl, successColorSuppl, warningColorSuppl, errorColorSuppl, fontSize } = vars;
		return {
			...require_alert_styles__common,
			fontSize,
			lineHeight,
			titleFontWeight: fontWeightStrong,
			borderRadius,
			border: `1px solid ${dividerColor}`,
			color: inputColor,
			titleTextColor: textColor1,
			iconColor: textColor2,
			contentTextColor: textColor2,
			closeBorderRadius: borderRadius,
			closeColorHover,
			closeColorPressed,
			closeIconColor,
			closeIconColorHover,
			closeIconColorPressed,
			borderInfo: `1px solid ${(0, seemly.changeColor)(infoColorSuppl, { alpha: .35 })}`,
			colorInfo: (0, seemly.changeColor)(infoColorSuppl, { alpha: .25 }),
			titleTextColorInfo: textColor1,
			iconColorInfo: infoColorSuppl,
			contentTextColorInfo: textColor2,
			closeColorHoverInfo: closeColorHover,
			closeColorPressedInfo: closeColorPressed,
			closeIconColorInfo: closeIconColor,
			closeIconColorHoverInfo: closeIconColorHover,
			closeIconColorPressedInfo: closeIconColorPressed,
			borderSuccess: `1px solid ${(0, seemly.changeColor)(successColorSuppl, { alpha: .35 })}`,
			colorSuccess: (0, seemly.changeColor)(successColorSuppl, { alpha: .25 }),
			titleTextColorSuccess: textColor1,
			iconColorSuccess: successColorSuppl,
			contentTextColorSuccess: textColor2,
			closeColorHoverSuccess: closeColorHover,
			closeColorPressedSuccess: closeColorPressed,
			closeIconColorSuccess: closeIconColor,
			closeIconColorHoverSuccess: closeIconColorHover,
			closeIconColorPressedSuccess: closeIconColorPressed,
			borderWarning: `1px solid ${(0, seemly.changeColor)(warningColorSuppl, { alpha: .35 })}`,
			colorWarning: (0, seemly.changeColor)(warningColorSuppl, { alpha: .25 }),
			titleTextColorWarning: textColor1,
			iconColorWarning: warningColorSuppl,
			contentTextColorWarning: textColor2,
			closeColorHoverWarning: closeColorHover,
			closeColorPressedWarning: closeColorPressed,
			closeIconColorWarning: closeIconColor,
			closeIconColorHoverWarning: closeIconColorHover,
			closeIconColorPressedWarning: closeIconColorPressed,
			borderError: `1px solid ${(0, seemly.changeColor)(errorColorSuppl, { alpha: .35 })}`,
			colorError: (0, seemly.changeColor)(errorColorSuppl, { alpha: .25 }),
			titleTextColorError: textColor1,
			iconColorError: errorColorSuppl,
			contentTextColorError: textColor2,
			closeColorHoverError: closeColorHover,
			closeColorPressedError: closeColorPressed,
			closeIconColorError: closeIconColor,
			closeIconColorHoverError: closeIconColorHover,
			closeIconColorPressedError: closeIconColorPressed
		};
	}
};
//#endregion
module.exports = alertDark;
