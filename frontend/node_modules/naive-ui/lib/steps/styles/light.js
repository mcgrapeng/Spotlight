Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_steps_styles__common = require("./_common.js");
//#region src/steps/styles/light.ts
function self(vars) {
	const { fontWeightStrong, baseColor, textColorDisabled, primaryColor, errorColor, textColor1, textColor2 } = vars;
	return {
		...require_steps_styles__common,
		stepHeaderFontWeight: fontWeightStrong,
		indicatorTextColorProcess: baseColor,
		indicatorTextColorWait: textColorDisabled,
		indicatorTextColorFinish: primaryColor,
		indicatorTextColorError: errorColor,
		indicatorBorderColorProcess: primaryColor,
		indicatorBorderColorWait: textColorDisabled,
		indicatorBorderColorFinish: primaryColor,
		indicatorBorderColorError: errorColor,
		indicatorColorProcess: primaryColor,
		indicatorColorWait: "#0000",
		indicatorColorFinish: "#0000",
		indicatorColorError: "#0000",
		splitorColorProcess: textColorDisabled,
		splitorColorWait: textColorDisabled,
		splitorColorFinish: primaryColor,
		splitorColorError: textColorDisabled,
		headerTextColorProcess: textColor1,
		headerTextColorWait: textColorDisabled,
		headerTextColorFinish: textColorDisabled,
		headerTextColorError: errorColor,
		descriptionTextColorProcess: textColor2,
		descriptionTextColorWait: textColorDisabled,
		descriptionTextColorFinish: textColorDisabled,
		descriptionTextColorError: errorColor
	};
}
const stepsLight = {
	name: "Steps",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = stepsLight;
exports.self = self;
