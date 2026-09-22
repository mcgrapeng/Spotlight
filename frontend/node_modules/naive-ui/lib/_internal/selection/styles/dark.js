const require__styles_common_dark = require("../../../_styles/common/dark.js");
const require_popover_styles_dark = require("../../../popover/styles/dark.js");
const require__internal_selection_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/_internal/selection/styles/dark.ts
const internalSelectionDark = {
	name: "InternalSelection",
	common: require__styles_common_dark,
	peers: { Popover: require_popover_styles_dark },
	self(vars) {
		const { borderRadius, textColor2, textColorDisabled, inputColor, inputColorDisabled, primaryColor, primaryColorHover, warningColor, warningColorHover, errorColor, errorColorHover, iconColor, iconColorDisabled, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge, fontWeight } = vars;
		return {
			...require__internal_selection_styles__common,
			fontWeight,
			fontSizeTiny,
			fontSizeSmall,
			fontSizeMedium,
			fontSizeLarge,
			heightTiny,
			heightSmall,
			heightMedium,
			heightLarge,
			borderRadius,
			textColor: textColor2,
			textColorDisabled,
			placeholderColor,
			placeholderColorDisabled,
			color: inputColor,
			colorDisabled: inputColorDisabled,
			colorActive: (0, seemly.changeColor)(primaryColor, { alpha: .1 }),
			border: "1px solid #0000",
			borderHover: `1px solid ${primaryColorHover}`,
			borderActive: `1px solid ${primaryColor}`,
			borderFocus: `1px solid ${primaryColorHover}`,
			boxShadowHover: "none",
			boxShadowActive: `0 0 8px 0 ${(0, seemly.changeColor)(primaryColor, { alpha: .4 })}`,
			boxShadowFocus: `0 0 8px 0 ${(0, seemly.changeColor)(primaryColor, { alpha: .4 })}`,
			caretColor: primaryColor,
			arrowColor: iconColor,
			arrowColorDisabled: iconColorDisabled,
			loadingColor: primaryColor,
			borderWarning: `1px solid ${warningColor}`,
			borderHoverWarning: `1px solid ${warningColorHover}`,
			borderActiveWarning: `1px solid ${warningColor}`,
			borderFocusWarning: `1px solid ${warningColorHover}`,
			boxShadowHoverWarning: "none",
			boxShadowActiveWarning: `0 0 8px 0 ${(0, seemly.changeColor)(warningColor, { alpha: .4 })}`,
			boxShadowFocusWarning: `0 0 8px 0 ${(0, seemly.changeColor)(warningColor, { alpha: .4 })}`,
			colorActiveWarning: (0, seemly.changeColor)(warningColor, { alpha: .1 }),
			caretColorWarning: warningColor,
			borderError: `1px solid ${errorColor}`,
			borderHoverError: `1px solid ${errorColorHover}`,
			borderActiveError: `1px solid ${errorColor}`,
			borderFocusError: `1px solid ${errorColorHover}`,
			boxShadowHoverError: "none",
			boxShadowActiveError: `0 0 8px 0 ${(0, seemly.changeColor)(errorColor, { alpha: .4 })}`,
			boxShadowFocusError: `0 0 8px 0 ${(0, seemly.changeColor)(errorColor, { alpha: .4 })}`,
			colorActiveError: (0, seemly.changeColor)(errorColor, { alpha: .1 }),
			caretColorError: errorColor,
			clearColor,
			clearColorHover,
			clearColorPressed
		};
	}
};
//#endregion
module.exports = internalSelectionDark;
