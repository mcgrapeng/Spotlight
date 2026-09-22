const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_input_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/input/styles/dark.ts
function self(vars) {
	const { textColor2, textColor3, textColorDisabled, primaryColor, primaryColorHover, inputColor, inputColorDisabled, warningColor, warningColorHover, errorColor, errorColorHover, borderRadius, lineHeight, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, iconColor, iconColorDisabled, iconColorHover, iconColorPressed, fontWeight } = vars;
	return {
		...require_input_styles__common,
		fontWeight,
		countTextColorDisabled: textColorDisabled,
		countTextColor: textColor3,
		heightTiny,
		heightSmall,
		heightMedium,
		heightLarge,
		fontSizeTiny,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		lineHeight,
		lineHeightTextarea: lineHeight,
		borderRadius,
		iconSize: "16px",
		groupLabelColor: inputColor,
		textColor: textColor2,
		textColorDisabled,
		textDecorationColor: textColor2,
		groupLabelTextColor: textColor2,
		caretColor: primaryColor,
		placeholderColor,
		placeholderColorDisabled,
		color: inputColor,
		colorHover: inputColor,
		colorDisabled: inputColorDisabled,
		colorFocus: (0, seemly.changeColor)(primaryColor, { alpha: .1 }),
		groupLabelBorder: "1px solid #0000",
		border: "1px solid #0000",
		borderHover: `1px solid ${primaryColorHover}`,
		borderDisabled: "1px solid #0000",
		borderFocus: `1px solid ${primaryColorHover}`,
		boxShadowFocus: `0 0 8px 0 ${(0, seemly.changeColor)(primaryColor, { alpha: .3 })}`,
		loadingColor: primaryColor,
		loadingColorWarning: warningColor,
		borderWarning: `1px solid ${warningColor}`,
		borderHoverWarning: `1px solid ${warningColorHover}`,
		colorFocusWarning: (0, seemly.changeColor)(warningColor, { alpha: .1 }),
		borderFocusWarning: `1px solid ${warningColorHover}`,
		boxShadowFocusWarning: `0 0 8px 0 ${(0, seemly.changeColor)(warningColor, { alpha: .3 })}`,
		caretColorWarning: warningColor,
		loadingColorError: errorColor,
		borderError: `1px solid ${errorColor}`,
		borderHoverError: `1px solid ${errorColorHover}`,
		colorFocusError: (0, seemly.changeColor)(errorColor, { alpha: .1 }),
		borderFocusError: `1px solid ${errorColorHover}`,
		boxShadowFocusError: `0 0 8px 0 ${(0, seemly.changeColor)(errorColor, { alpha: .3 })}`,
		caretColorError: errorColor,
		clearColor,
		clearColorHover,
		clearColorPressed,
		iconColor,
		iconColorDisabled,
		iconColorHover,
		iconColorPressed,
		suffixTextColor: textColor2
	};
}
const inputDark = require__mixins_use_theme.createTheme({
	name: "Input",
	common: require__styles_common_dark,
	peers: { Scrollbar: require__internal_scrollbar_styles_dark },
	self
});
//#endregion
module.exports = inputDark;
