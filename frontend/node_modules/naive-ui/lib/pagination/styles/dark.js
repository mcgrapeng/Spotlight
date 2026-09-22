const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_popselect_styles_dark = require("../../popselect/styles/dark.js");
const require_select_styles_dark = require("../../select/styles/dark.js");
const require_pagination_styles_light = require("./light.js");
let seemly = require("seemly");
//#region src/pagination/styles/dark.ts
const paginationDark = {
	name: "Pagination",
	common: require__styles_common_dark,
	peers: {
		Select: require_select_styles_dark,
		Input: require_input_styles_dark,
		Popselect: require_popselect_styles_dark
	},
	self(vars) {
		const { primaryColor, opacity3 } = vars;
		const borderColorActive = (0, seemly.changeColor)(primaryColor, { alpha: Number(opacity3) });
		const commonSelf = require_pagination_styles_light.self(vars);
		commonSelf.itemBorderActive = `1px solid ${borderColorActive}`;
		commonSelf.itemBorderDisabled = "1px solid #0000";
		return commonSelf;
	}
};
//#endregion
module.exports = paginationDark;
