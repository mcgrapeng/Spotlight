Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_empty_styles__common = require("./_common.js");
//#region src/empty/styles/light.ts
function self(vars) {
	const { textColorDisabled, iconColor, textColor2, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge } = vars;
	return {
		...require_empty_styles__common,
		fontSizeTiny,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		fontSizeHuge,
		textColor: textColorDisabled,
		iconColor,
		extraTextColor: textColor2
	};
}
const emptyLight = {
	name: "Empty",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = emptyLight;
exports.self = self;
