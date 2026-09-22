const require__mixins_use_theme = require("../../../_mixins/use-theme.js");
const require__styles_common_light = require("../../../_styles/common/light.js");
const require_popover_styles_light = require("../../../popover/styles/light.js");
const require__internal_selection_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/_internal/selection/styles/light.ts
function self(vars) {
	const { borderRadius, textColor2, textColorDisabled, inputColor, inputColorDisabled, primaryColor, primaryColorHover, warningColor, warningColorHover, errorColor, errorColorHover, borderColor, iconColor, iconColorDisabled, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge, fontWeight } = vars;
	return {
		...require__internal_selection_styles__common,
		fontSizeTiny,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		heightTiny,
		heightSmall,
		heightMedium,
		heightLarge,
		borderRadius,
		fontWeight,
		textColor: textColor2,
		textColorDisabled,
		placeholderColor,
		placeholderColorDisabled,
		color: inputColor,
		colorDisabled: inputColorDisabled,
		colorActive: inputColor,
		border: `1px solid ${borderColor}`,
		borderHover: `1px solid ${primaryColorHover}`,
		borderActive: `1px solid ${primaryColor}`,
		borderFocus: `1px solid ${primaryColorHover}`,
		boxShadowHover: "none",
		boxShadowActive: `0 0 0 2px ${(0, seemly.changeColor)(primaryColor, { alpha: .2 })}`,
		boxShadowFocus: `0 0 0 2px ${(0, seemly.changeColor)(primaryColor, { alpha: .2 })}`,
		caretColor: primaryColor,
		arrowColor: iconColor,
		arrowColorDisabled: iconColorDisabled,
		loadingColor: primaryColor,
		borderWarning: `1px solid ${warningColor}`,
		borderHoverWarning: `1px solid ${warningColorHover}`,
		borderActiveWarning: `1px solid ${warningColor}`,
		borderFocusWarning: `1px solid ${warningColorHover}`,
		boxShadowHoverWarning: "none",
		boxShadowActiveWarning: `0 0 0 2px ${(0, seemly.changeColor)(warningColor, { alpha: .2 })}`,
		boxShadowFocusWarning: `0 0 0 2px ${(0, seemly.changeColor)(warningColor, { alpha: .2 })}`,
		colorActiveWarning: inputColor,
		caretColorWarning: warningColor,
		borderError: `1px solid ${errorColor}`,
		borderHoverError: `1px solid ${errorColorHover}`,
		borderActiveError: `1px solid ${errorColor}`,
		borderFocusError: `1px solid ${errorColorHover}`,
		boxShadowHoverError: "none",
		boxShadowActiveError: `0 0 0 2px ${(0, seemly.changeColor)(errorColor, { alpha: .2 })}`,
		boxShadowFocusError: `0 0 0 2px ${(0, seemly.changeColor)(errorColor, { alpha: .2 })}`,
		colorActiveError: inputColor,
		caretColorError: errorColor,
		clearColor,
		clearColorHover,
		clearColorPressed
	};
}
const internalSelectionLight = require__mixins_use_theme.createTheme({
	name: "InternalSelection",
	common: require__styles_common_light,
	peers: { Popover: require_popover_styles_light.default },
	self
});
//#endregion
module.exports = internalSelectionLight;
