Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/split/styles/light.ts
function self(vars) {
	const { primaryColorHover, borderColor } = vars;
	return {
		resizableTriggerColorHover: primaryColorHover,
		resizableTriggerColor: borderColor
	};
}
const themeLight = {
	name: "Split",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = themeLight;
exports.self = self;
