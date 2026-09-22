const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_card_styles_light = require("./light.js");
//#region src/card/styles/dark.ts
const cardDark = {
	name: "Card",
	common: require__styles_common_dark,
	self(vars) {
		const commonSelf = require_card_styles_light.self(vars);
		const { cardColor, modalColor, popoverColor } = vars;
		commonSelf.colorEmbedded = cardColor;
		commonSelf.colorEmbeddedModal = modalColor;
		commonSelf.colorEmbeddedPopover = popoverColor;
		return commonSelf;
	}
};
//#endregion
module.exports = cardDark;
