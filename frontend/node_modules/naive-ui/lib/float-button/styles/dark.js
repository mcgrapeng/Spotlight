//#region src/float-button/styles/dark.ts
const floatButtonDark = {
	name: "FloatButton",
	common: require("../../_styles/common/dark.js"),
	self(vars) {
		const { popoverColor, textColor2, buttonColor2Hover, buttonColor2Pressed, primaryColor, primaryColorHover, primaryColorPressed, baseColor, borderRadius } = vars;
		return {
			color: popoverColor,
			textColor: textColor2,
			boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
			boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
			boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)",
			colorHover: buttonColor2Hover,
			colorPressed: buttonColor2Pressed,
			colorPrimary: primaryColor,
			colorPrimaryHover: primaryColorHover,
			colorPrimaryPressed: primaryColorPressed,
			textColorPrimary: baseColor,
			borderRadiusSquare: borderRadius
		};
	}
};
//#endregion
module.exports = floatButtonDark;
