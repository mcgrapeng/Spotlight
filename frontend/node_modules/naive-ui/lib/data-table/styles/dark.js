const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_empty_styles_dark = require("../../empty/styles/dark.js");
const require_popover_styles_dark = require("../../popover/styles/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_checkbox_styles_dark = require("../../checkbox/styles/dark.js");
const require_pagination_styles_dark = require("../../pagination/styles/dark.js");
const require_dropdown_styles_dark = require("../../dropdown/styles/dark.js");
const require_ellipsis_styles_dark = require("../../ellipsis/styles/dark.js");
const require_radio_styles_dark = require("../../radio/styles/dark.js");
const require_data_table_styles_light = require("./light.js");
//#region src/data-table/styles/dark.ts
const dataTableDark = {
	name: "DataTable",
	common: require__styles_common_dark,
	peers: {
		Button: require_button_styles_dark,
		Checkbox: require_checkbox_styles_dark,
		Radio: require_radio_styles_dark,
		Pagination: require_pagination_styles_dark,
		Scrollbar: require__internal_scrollbar_styles_dark,
		Empty: require_empty_styles_dark,
		Popover: require_popover_styles_dark,
		Ellipsis: require_ellipsis_styles_dark,
		Dropdown: require_dropdown_styles_dark
	},
	self(vars) {
		const commonSelf = require_data_table_styles_light.self(vars);
		commonSelf.boxShadowAfter = "inset 12px 0 8px -12px rgba(0, 0, 0, .36)";
		commonSelf.boxShadowBefore = "inset -12px 0 8px -12px rgba(0, 0, 0, .36)";
		return commonSelf;
	}
};
//#endregion
module.exports = dataTableDark;
