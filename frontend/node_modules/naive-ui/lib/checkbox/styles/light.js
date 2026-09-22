Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_checkbox_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/checkbox/styles/light.ts
function self(vars) {
	const { baseColor, inputColorDisabled, cardColor, modalColor, popoverColor, textColorDisabled, borderColor, primaryColor, textColor2, fontSizeSmall, fontSizeMedium, fontSizeLarge, borderRadiusSmall, lineHeight } = vars;
	return {
		...require_checkbox_styles__common,
		labelLineHeight: lineHeight,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		borderRadius: borderRadiusSmall,
		color: baseColor,
		colorChecked: primaryColor,
		colorDisabled: inputColorDisabled,
		colorDisabledChecked: inputColorDisabled,
		colorTableHeader: cardColor,
		colorTableHeaderModal: modalColor,
		colorTableHeaderPopover: popoverColor,
		checkMarkColor: baseColor,
		checkMarkColorDisabled: textColorDisabled,
		checkMarkColorDisabledChecked: textColorDisabled,
		border: `1px solid ${borderColor}`,
		borderDisabled: `1px solid ${borderColor}`,
		borderDisabledChecked: `1px solid ${borderColor}`,
		borderChecked: `1px solid ${primaryColor}`,
		borderFocus: `1px solid ${primaryColor}`,
		boxShadowFocus: `0 0 0 2px ${(0, seemly.changeColor)(primaryColor, { alpha: .3 })}`,
		textColor: textColor2,
		textColorDisabled
	};
}
const checkboxLight = {
	name: "Checkbox",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = checkboxLight;
exports.self = self;
