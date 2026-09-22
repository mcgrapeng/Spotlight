Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_typography_styles__common = require("./_common.js");
//#region src/typography/styles/light.ts
function self(vars) {
	const { primaryColor, textColor2, borderColor, lineHeight, fontSize, borderRadiusSmall, dividerColor, fontWeightStrong, textColor1, textColor3, infoColor, warningColor, errorColor, successColor, codeColor } = vars;
	return {
		...require_typography_styles__common,
		aTextColor: primaryColor,
		blockquoteTextColor: textColor2,
		blockquotePrefixColor: borderColor,
		blockquoteLineHeight: lineHeight,
		blockquoteFontSize: fontSize,
		codeBorderRadius: borderRadiusSmall,
		liTextColor: textColor2,
		liLineHeight: lineHeight,
		liFontSize: fontSize,
		hrColor: dividerColor,
		headerFontWeight: fontWeightStrong,
		headerTextColor: textColor1,
		pTextColor: textColor2,
		pTextColor1Depth: textColor1,
		pTextColor2Depth: textColor2,
		pTextColor3Depth: textColor3,
		pLineHeight: lineHeight,
		pFontSize: fontSize,
		headerBarColor: primaryColor,
		headerBarColorPrimary: primaryColor,
		headerBarColorInfo: infoColor,
		headerBarColorError: errorColor,
		headerBarColorWarning: warningColor,
		headerBarColorSuccess: successColor,
		textColor: textColor2,
		textColor1Depth: textColor1,
		textColor2Depth: textColor2,
		textColor3Depth: textColor3,
		textColorPrimary: primaryColor,
		textColorInfo: infoColor,
		textColorSuccess: successColor,
		textColorWarning: warningColor,
		textColorError: errorColor,
		codeTextColor: textColor2,
		codeColor,
		codeBorder: "1px solid #0000"
	};
}
const typographyLight = {
	name: "Typography",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = typographyLight;
exports.self = self;
