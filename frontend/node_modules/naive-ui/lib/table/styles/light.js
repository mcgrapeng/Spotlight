Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_table_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/table/styles/light.ts
function self(vars) {
	const { dividerColor, cardColor, modalColor, popoverColor, tableHeaderColor, tableColorStriped, textColor1, textColor2, borderRadius, fontWeightStrong, lineHeight, fontSizeSmall, fontSizeMedium, fontSizeLarge } = vars;
	return {
		...require_table_styles__common,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		lineHeight,
		borderRadius,
		borderColor: (0, seemly.composite)(cardColor, dividerColor),
		borderColorModal: (0, seemly.composite)(modalColor, dividerColor),
		borderColorPopover: (0, seemly.composite)(popoverColor, dividerColor),
		tdColor: cardColor,
		tdColorModal: modalColor,
		tdColorPopover: popoverColor,
		tdColorStriped: (0, seemly.composite)(cardColor, tableColorStriped),
		tdColorStripedModal: (0, seemly.composite)(modalColor, tableColorStriped),
		tdColorStripedPopover: (0, seemly.composite)(popoverColor, tableColorStriped),
		thColor: (0, seemly.composite)(cardColor, tableHeaderColor),
		thColorModal: (0, seemly.composite)(modalColor, tableHeaderColor),
		thColorPopover: (0, seemly.composite)(popoverColor, tableHeaderColor),
		thTextColor: textColor1,
		tdTextColor: textColor2,
		thFontWeight: fontWeightStrong
	};
}
const tableLight = {
	name: "Table",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = tableLight;
exports.self = self;
