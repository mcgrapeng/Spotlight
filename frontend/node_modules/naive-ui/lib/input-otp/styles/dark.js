const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_input_otp_styles_light = require("./light.js");
//#region src/input-otp/styles/dark.ts
const inputOtpDark = {
	name: "InputOtp",
	common: require__styles_common_dark,
	peers: { Input: require_input_styles_dark },
	self: require_input_otp_styles_light.self
};
//#endregion
module.exports = inputOtpDark;
