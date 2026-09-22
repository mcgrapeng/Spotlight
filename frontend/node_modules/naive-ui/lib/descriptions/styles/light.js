Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_descriptions_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/descriptions/styles/light.ts
function self(vars) {
	const { tableHeaderColor, textColor2, textColor1, cardColor, modalColor, popoverColor, dividerColor, borderRadius, fontWeightStrong, lineHeight, fontSizeSmall, fontSizeMedium, fontSizeLarge } = vars;
	return {
		...require_descriptions_styles__common,
		lineHeight,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		titleTextColor: textColor1,
		thColor: (0, seemly.composite)(cardColor, tableHeaderColor),
		thColorModal: (0, seemly.composite)(modalColor, tableHeaderColor),
		thColorPopover: (0, seemly.composite)(popoverColor, tableHeaderColor),
		thTextColor: textColor1,
		thFontWeight: fontWeightStrong,
		tdTextColor: textColor2,
		tdColor: cardColor,
		tdColorModal: modalColor,
		tdColorPopover: popoverColor,
		borderColor: (0, seemly.composite)(cardColor, dividerColor),
		borderColorModal: (0, seemly.composite)(modalColor, dividerColor),
		borderColorPopover: (0, seemly.composite)(popoverColor, dividerColor),
		borderRadius
	};
}
const descriptionsLight = {
	name: "Descriptions",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = descriptionsLight;
exports.self = self;
