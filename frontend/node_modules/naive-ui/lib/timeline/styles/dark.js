const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_timeline_styles__common = require("./_common.js");
//#region src/timeline/styles/dark.ts
const timelineDark = {
	name: "Timeline",
	common: require__styles_common_dark,
	self(vars) {
		const { textColor3, infoColorSuppl, errorColorSuppl, successColorSuppl, warningColorSuppl, textColor1, textColor2, railColor, fontWeightStrong, fontSize } = vars;
		return {
			...require_timeline_styles__common,
			contentFontSize: fontSize,
			titleFontWeight: fontWeightStrong,
			circleBorder: `2px solid ${textColor3}`,
			circleBorderInfo: `2px solid ${infoColorSuppl}`,
			circleBorderError: `2px solid ${errorColorSuppl}`,
			circleBorderSuccess: `2px solid ${successColorSuppl}`,
			circleBorderWarning: `2px solid ${warningColorSuppl}`,
			iconColor: textColor3,
			iconColorInfo: infoColorSuppl,
			iconColorError: errorColorSuppl,
			iconColorSuccess: successColorSuppl,
			iconColorWarning: warningColorSuppl,
			titleTextColor: textColor1,
			contentTextColor: textColor2,
			metaTextColor: textColor3,
			lineColor: railColor
		};
	}
};
//#endregion
module.exports = timelineDark;
