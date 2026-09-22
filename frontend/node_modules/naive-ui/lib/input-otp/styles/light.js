Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
//#region src/input-otp/styles/light.ts
function self() {
	return {
		inputWidthSmall: "24px",
		inputWidthMedium: "30px",
		inputWidthLarge: "36px",
		gapSmall: "8px",
		gapMedium: "8px",
		gapLarge: "8px"
	};
}
const inputOtpLight = require__mixins_use_theme.createTheme({
	name: "InputOtp",
	common: require__styles_common_light,
	peers: { Input: require_input_styles_light },
	self
});
//#endregion
exports.default = inputOtpLight;
exports.self = self;
