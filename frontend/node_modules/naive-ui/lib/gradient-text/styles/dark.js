//#region src/gradient-text/styles/dark.ts
const gradientTextDark = {
	name: "GradientText",
	common: require("../../_styles/common/dark.js"),
	self(vars) {
		const { primaryColor, successColor, warningColor, errorColor, infoColor, primaryColorSuppl, successColorSuppl, warningColorSuppl, errorColorSuppl, infoColorSuppl, fontWeightStrong } = vars;
		return {
			fontWeight: fontWeightStrong,
			rotate: "252deg",
			colorStartPrimary: primaryColor,
			colorEndPrimary: primaryColorSuppl,
			colorStartInfo: infoColor,
			colorEndInfo: infoColorSuppl,
			colorStartWarning: warningColor,
			colorEndWarning: warningColorSuppl,
			colorStartError: errorColor,
			colorEndError: errorColorSuppl,
			colorStartSuccess: successColor,
			colorEndSuccess: successColorSuppl
		};
	}
};
//#endregion
module.exports = gradientTextDark;
