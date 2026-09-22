const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_avatar_styles_dark = require("../../avatar/styles/dark.js");
const require_avatar_group_styles_light = require("./light.js");
//#region src/avatar-group/styles/dark.ts
const avatarGroupDark = {
	name: "AvatarGroup",
	common: require__styles_common_dark,
	peers: { Avatar: require_avatar_styles_dark },
	self: require_avatar_group_styles_light.self
};
//#endregion
module.exports = avatarGroupDark;
