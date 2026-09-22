const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_dropdown_styles_dark = require("../../dropdown/styles/dark.js");
const require_tooltip_styles_dark = require("../../tooltip/styles/dark.js");
const require_menu_styles_light = require("./light.js");
let seemly = require("seemly");
//#region src/menu/styles/dark.ts
const menuDark = {
	name: "Menu",
	common: require__styles_common_dark,
	peers: {
		Tooltip: require_tooltip_styles_dark,
		Dropdown: require_dropdown_styles_dark
	},
	self(vars) {
		const { primaryColor, primaryColorSuppl } = vars;
		const commonSelf = require_menu_styles_light.self(vars);
		commonSelf.itemColorActive = (0, seemly.changeColor)(primaryColor, { alpha: .15 });
		commonSelf.itemColorActiveHover = (0, seemly.changeColor)(primaryColor, { alpha: .15 });
		commonSelf.itemColorActiveCollapsed = (0, seemly.changeColor)(primaryColor, { alpha: .15 });
		commonSelf.itemColorActiveInverted = primaryColorSuppl;
		commonSelf.itemColorActiveHoverInverted = primaryColorSuppl;
		commonSelf.itemColorActiveCollapsedInverted = primaryColorSuppl;
		return commonSelf;
	}
};
//#endregion
module.exports = menuDark;
