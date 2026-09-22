Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_tag_styles_light = require("../../tag/styles/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_space_styles_light = require("../../space/styles/light.js");
//#region src/dynamic-tags/styles/light.ts
function self() {
	return { inputWidth: "64px" };
}
const dynamicTagsLight = require__mixins_use_theme.createTheme({
	name: "DynamicTags",
	common: require__styles_common_light,
	peers: {
		Input: require_input_styles_light,
		Button: require_button_styles_light.default,
		Tag: require_tag_styles_light,
		Space: require_space_styles_light
	},
	self
});
//#endregion
exports.default = dynamicTagsLight;
exports.self = self;
