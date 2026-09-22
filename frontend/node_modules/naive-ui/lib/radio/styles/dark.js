const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_radio_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/radio/styles/dark.ts
const radioDark = {
	name: "Radio",
	common: require__styles_common_dark,
	self(vars) {
		const { borderColor, primaryColor, baseColor, textColorDisabled, inputColorDisabled, textColor2, opacityDisabled, borderRadius, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightSmall, heightMedium, heightLarge, lineHeight } = vars;
		return {
			...require_radio_styles__common,
			labelLineHeight: lineHeight,
			buttonHeightSmall: heightSmall,
			buttonHeightMedium: heightMedium,
			buttonHeightLarge: heightLarge,
			fontSizeSmall,
			fontSizeMedium,
			fontSizeLarge,
			boxShadow: `inset 0 0 0 1px ${borderColor}`,
			boxShadowActive: `inset 0 0 0 1px ${primaryColor}`,
			boxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${(0, seemly.changeColor)(primaryColor, { alpha: .3 })}`,
			boxShadowHover: `inset 0 0 0 1px ${primaryColor}`,
			boxShadowDisabled: `inset 0 0 0 1px ${borderColor}`,
			color: "#0000",
			colorDisabled: inputColorDisabled,
			colorActive: "#0000",
			textColor: textColor2,
			textColorDisabled,
			dotColorActive: primaryColor,
			dotColorDisabled: borderColor,
			buttonBorderColor: borderColor,
			buttonBorderColorActive: primaryColor,
			buttonBorderColorHover: primaryColor,
			buttonColor: "#0000",
			buttonColorActive: primaryColor,
			buttonTextColor: textColor2,
			buttonTextColorActive: baseColor,
			buttonTextColorHover: primaryColor,
			opacityDisabled,
			buttonBoxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${(0, seemly.changeColor)(primaryColor, { alpha: .3 })}`,
			buttonBoxShadowHover: `inset 0 0 0 1px ${primaryColor}`,
			buttonBoxShadow: "inset 0 0 0 1px #0000",
			buttonBorderRadius: borderRadius
		};
	}
};
//#endregion
module.exports = radioDark;
