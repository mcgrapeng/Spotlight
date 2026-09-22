Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
let seemly = require("seemly");
//#region src/list/styles/light.ts
function self(vars) {
	const { textColor2, cardColor, modalColor, popoverColor, dividerColor, borderRadius, fontSize, hoverColor } = vars;
	return {
		textColor: textColor2,
		color: cardColor,
		colorHover: hoverColor,
		colorModal: modalColor,
		colorHoverModal: (0, seemly.composite)(modalColor, hoverColor),
		colorPopover: popoverColor,
		colorHoverPopover: (0, seemly.composite)(popoverColor, hoverColor),
		borderColor: dividerColor,
		borderColorModal: (0, seemly.composite)(modalColor, dividerColor),
		borderColorPopover: (0, seemly.composite)(popoverColor, dividerColor),
		borderRadius,
		fontSize
	};
}
const listLight = {
	name: "List",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = listLight;
exports.self = self;
