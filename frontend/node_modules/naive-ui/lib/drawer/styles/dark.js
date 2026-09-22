const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_drawer_styles_light = require("./light.js");
//#region src/drawer/styles/dark.ts
const drawerDark = {
	name: "Drawer",
	common: require__styles_common_dark,
	peers: { Scrollbar: require__internal_scrollbar_styles_dark },
	self: require_drawer_styles_light.self
};
//#endregion
module.exports = drawerDark;
