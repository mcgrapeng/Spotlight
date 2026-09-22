const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_slider_styles__common = require("./_common.js");
//#region src/slider/styles/dark.ts
const sliderDark = {
	name: "Slider",
	common: require__styles_common_dark,
	self(vars) {
		const boxShadow = "0 2px 8px 0 rgba(0, 0, 0, 0.12)";
		const { railColor, modalColor, primaryColorSuppl, popoverColor, textColor2, cardColor, borderRadius, fontSize, opacityDisabled } = vars;
		return {
			...require_slider_styles__common,
			fontSize,
			markFontSize: fontSize,
			railColor,
			railColorHover: railColor,
			fillColor: primaryColorSuppl,
			fillColorHover: primaryColorSuppl,
			opacityDisabled,
			handleColor: "#FFF",
			dotColor: cardColor,
			dotColorModal: modalColor,
			dotColorPopover: popoverColor,
			handleBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowHover: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowActive: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowFocus: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			indicatorColor: popoverColor,
			indicatorBoxShadow: boxShadow,
			indicatorTextColor: textColor2,
			indicatorBorderRadius: borderRadius,
			dotBorder: `2px solid ${railColor}`,
			dotBorderActive: `2px solid ${primaryColorSuppl}`,
			dotBoxShadow: ""
		};
	}
};
//#endregion
module.exports = sliderDark;
