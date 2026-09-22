Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/collapse-transition/styles/light.ts
function self(vars) {
	const { cubicBezierEaseInOut } = vars;
	return { bezier: cubicBezierEaseInOut };
}
const collapseTransitionLight = {
	name: "CollapseTransition",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = collapseTransitionLight;
exports.self = self;
