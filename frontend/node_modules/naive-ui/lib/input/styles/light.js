const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_input_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/input/styles/light.ts
function self(vars) {
	const { textColor2, textColor3, textColorDisabled, primaryColor, primaryColorHover, inputColor, inputColorDisabled, borderColor, warningColor, warningColorHover, errorColor, errorColorHover, borderRadius, lineHeight, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge, actionColor, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, iconColor, iconColorDisabled, iconColorHover, iconColorPressed, fontWeight } = vars;
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
		groupLabelColor: actionColor,
		groupLabelTextColor: textColor2,
		textColor: textColor2,
		textColorDisabled,
		textDecorationColor: textColor2,
		caretColor: primaryColor,
		placeholderColor,
		placeholderColorDisabled,
		color: inputColor,
		colorHover: inputColor,
		colorDisabled: inputColorDisabled,
		colorFocus: inputColor,
		groupLabelBorder: `1px solid ${borderColor}`,
		border: `1px solid ${borderColor}`,
		borderHover: `1px solid ${primaryColorHover}`,
		borderDisabled: `1px solid ${borderColor}`,
		borderFocus: `1px solid ${primaryColorHover}`,
		boxShadowFocus: `0 0 0 2px ${(0, seemly.changeColor)(primaryColor, { alpha: .2 })}`,
		loadingColor: primaryColor,
		loadingColorWarning: warningColor,
		borderWarning: `1px solid ${warningColor}`,
		borderHoverWarning: `1px solid ${warningColorHover}`,
		colorFocusWarning: inputColor,
		borderFocusWarning: `1px solid ${warningColorHover}`,
		boxShadowFocusWarning: `0 0 0 2px ${(0, seemly.changeColor)(warningColor, { alpha: .2 })}`,
		caretColorWarning: warningColor,
		loadingColorError: errorColor,
		borderError: `1px solid ${errorColor}`,
		borderHoverError: `1px solid ${errorColorHover}`,
		colorFocusError: inputColor,
		borderFocusError: `1px solid ${errorColorHover}`,
		boxShadowFocusError: `0 0 0 2px ${(0, seemly.changeColor)(errorColor, { alpha: .2 })}`,
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
const inputLight = require__mixins_use_theme.createTheme({
	name: "Input",
	common: require__styles_common_light,
	peers: { Scrollbar: require__internal_scrollbar_styles_light.default },
	self
});
//#endregion
module.exports = inputLight;
