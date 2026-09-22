const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_card_styles_dark = require("../../card/styles/dark.js");
const require_dialog_styles_dark = require("../../dialog/styles/dark.js");
const require_modal_styles_light = require("./light.js");
//#region src/modal/styles/dark.ts
const modalDark = {
	name: "Modal",
	common: require__styles_common_dark,
	peers: {
		Scrollbar: require__internal_scrollbar_styles_dark,
		Dialog: require_dialog_styles_dark,
		Card: require_card_styles_dark
	},
	self: require_modal_styles_light.self
};
//#endregion
module.exports = modalDark;
