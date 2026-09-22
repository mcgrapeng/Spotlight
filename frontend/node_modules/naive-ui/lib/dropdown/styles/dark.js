const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_popover_styles_dark = require("../../popover/styles/dark.js");
const require_dropdown_styles_light = require("./light.js");
let seemly = require("seemly");
//#region src/dropdown/styles/dark.ts
const dropdownDark = {
	name: "Dropdown",
	common: require__styles_common_dark,
	peers: { Popover: require_popover_styles_dark },
	self(vars) {
		const { primaryColorSuppl, primaryColor, popoverColor } = vars;
		const commonSelf = require_dropdown_styles_light.self(vars);
		commonSelf.colorInverted = popoverColor;
		commonSelf.optionColorActive = (0, seemly.changeColor)(primaryColor, { alpha: .15 });
		commonSelf.optionColorActiveInverted = primaryColorSuppl;
		commonSelf.optionColorHoverInverted = primaryColorSuppl;
		return commonSelf;
	}
};
//#endregion
module.exports = dropdownDark;
