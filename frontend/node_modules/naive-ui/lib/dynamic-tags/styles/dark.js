const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_tag_styles_dark = require("../../tag/styles/dark.js");
//#region src/dynamic-tags/styles/dark.ts
const dynamicTagsDark = {
	name: "DynamicTags",
	common: require__styles_common_dark,
	peers: {
		Input: require("../../input/styles/dark.js"),
		Button: require("../../button/styles/dark.js"),
		Tag: require_tag_styles_dark,
		Space: require("../../space/styles/dark.js")
	},
	self() {
		return { inputWidth: "64px" };
	}
};
//#endregion
module.exports = dynamicTagsDark;
