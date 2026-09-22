Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/spin/styles/light.ts
function self(vars) {
	const { opacityDisabled, heightTiny, heightSmall, heightMedium, heightLarge, heightHuge, primaryColor, fontSize } = vars;
	return {
		fontSize,
		textColor: primaryColor,
		sizeTiny: heightTiny,
		sizeSmall: heightSmall,
		sizeMedium: heightMedium,
		sizeLarge: heightLarge,
		sizeHuge: heightHuge,
		color: primaryColor,
		opacitySpinning: opacityDisabled
	};
}
const spinLight = {
	name: "Spin",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = spinLight;
exports.self = self;
