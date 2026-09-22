Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_avatar_styles_light = require("../../avatar/styles/light.js");
//#region src/avatar-group/styles/light.ts
function self() {
	return { gap: "-12px" };
}
const avatarGroupLight = require__mixins_use_theme.createTheme({
	name: "AvatarGroup",
	common: require__styles_common_light,
	peers: { Avatar: require_avatar_styles_light.default },
	self
});
//#endregion
exports.default = avatarGroupLight;
exports.self = self;
