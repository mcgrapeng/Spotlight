Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_anchor_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/anchor/styles/light.ts
function self(vars) {
	const { borderRadius, railColor, primaryColor, primaryColorHover, primaryColorPressed, textColor2 } = vars;
	return {
		...require_anchor_styles__common,
		borderRadius,
		railColor,
		railColorActive: primaryColor,
		linkColor: (0, seemly.changeColor)(primaryColor, { alpha: .15 }),
		linkTextColor: textColor2,
		linkTextColorHover: primaryColorHover,
		linkTextColorPressed: primaryColorPressed,
		linkTextColorActive: primaryColor
	};
}
const anchorLight = {
	name: "Anchor",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = anchorLight;
exports.self = self;
