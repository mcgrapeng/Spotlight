const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_popover_styles_dark = require("../../popover/styles/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_popconfirm_styles_light = require("./light.js");
//#region src/popconfirm/styles/dark.ts
const popconfirmDark = {
	name: "Popconfirm",
	common: require__styles_common_dark,
	peers: {
		Button: require_button_styles_dark,
		Popover: require_popover_styles_dark
	},
	self: require_popconfirm_styles_light.self
};
//#endregion
module.exports = popconfirmDark;
