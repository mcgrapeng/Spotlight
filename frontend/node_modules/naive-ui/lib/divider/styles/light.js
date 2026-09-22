Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/divider/styles/light.ts
function self(vars) {
	const { textColor1, dividerColor, fontWeightStrong } = vars;
	return {
		textColor: textColor1,
		color: dividerColor,
		fontWeight: fontWeightStrong
	};
}
const dividerLight = {
	name: "Divider",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = dividerLight;
exports.self = self;
