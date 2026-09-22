Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/thing/styles/light.ts
function self(vars) {
	const { textColor1, textColor2, fontWeightStrong, fontSize } = vars;
	return {
		fontSize,
		titleTextColor: textColor1,
		textColor: textColor2,
		titleFontWeight: fontWeightStrong
	};
}
const thingLight = {
	name: "Thing",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = thingLight;
exports.self = self;
