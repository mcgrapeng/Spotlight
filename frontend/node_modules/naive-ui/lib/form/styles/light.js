Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_form_styles__common = require("./_common.js");
//#region src/form/styles/light.ts
function self(vars) {
	const { heightSmall, heightMedium, heightLarge, textColor1, errorColor, warningColor, lineHeight, textColor3 } = vars;
	return {
		...require_form_styles__common,
		blankHeightSmall: heightSmall,
		blankHeightMedium: heightMedium,
		blankHeightLarge: heightLarge,
		lineHeight,
		labelTextColor: textColor1,
		asteriskColor: errorColor,
		feedbackTextColorError: errorColor,
		feedbackTextColorWarning: warningColor,
		feedbackTextColor: textColor3
	};
}
const formLight = {
	name: "Form",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = formLight;
exports.self = self;
