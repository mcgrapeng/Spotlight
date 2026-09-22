Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_tooltip_styles_light = require("../../tooltip/styles/light.js");
//#region src/image/styles/light.ts
function self() {
	return {
		toolbarIconColor: "rgba(255, 255, 255, .9)",
		toolbarColor: "rgba(0, 0, 0, .35)",
		toolbarBoxShadow: "none",
		toolbarBorderRadius: "24px"
	};
}
const imageLight = require__mixins_use_theme.createTheme({
	name: "Image",
	common: require__styles_common_light,
	peers: { Tooltip: require_tooltip_styles_light },
	self
});
//#endregion
exports.imageLight = imageLight;
