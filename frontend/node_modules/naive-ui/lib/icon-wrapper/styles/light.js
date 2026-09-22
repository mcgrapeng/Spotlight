Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/icon-wrapper/styles/light.ts
function self(vars) {
	const { primaryColor, baseColor } = vars;
	return {
		color: primaryColor,
		iconColor: baseColor
	};
}
const iconWrapperLight = {
	name: "IconWrapper",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = iconWrapperLight;
exports.self = self;
