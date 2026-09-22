Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_button_styles_rtl = require("../../button/styles/rtl.js");
const require_space_styles_rtl = require("../../space/styles/rtl.js");
//#region src/thing/styles/rtl.ts
const thingRtl = {
	name: "Thing",
	style: require("../src/styles/rtl.cssr.js"),
	peers: [require_button_styles_rtl.buttonRtl, require_space_styles_rtl.spaceRtl]
};
//#endregion
exports.thingRtl = thingRtl;
