Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_empty_styles_light = require("../../empty/styles/light.js");
const require_popover_styles_light = require("../../popover/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_checkbox_styles_light = require("../../checkbox/styles/light.js");
const require_pagination_styles_light = require("../../pagination/styles/light.js");
const require_dropdown_styles_light = require("../../dropdown/styles/light.js");
const require_ellipsis_styles_light = require("../../ellipsis/styles/light.js");
const require_radio_styles_light = require("../../radio/styles/light.js");
const require_data_table_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/data-table/styles/light.ts
function self(vars) {
	const { cardColor, modalColor, popoverColor, textColor2, textColor1, tableHeaderColor, tableColorHover, iconColor, primaryColor, fontWeightStrong, borderRadius, lineHeight, fontSizeSmall, fontSizeMedium, fontSizeLarge, dividerColor, heightSmall, opacityDisabled, tableColorStriped } = vars;
	return {
		...require_data_table_styles__common,
		actionDividerColor: dividerColor,
		lineHeight,
		borderRadius,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		borderColor: (0, seemly.composite)(cardColor, dividerColor),
		tdColorHover: (0, seemly.composite)(cardColor, tableColorHover),
		tdColorSorting: (0, seemly.composite)(cardColor, tableColorHover),
		tdColorStriped: (0, seemly.composite)(cardColor, tableColorStriped),
		thColor: (0, seemly.composite)(cardColor, tableHeaderColor),
		thColorHover: (0, seemly.composite)((0, seemly.composite)(cardColor, tableHeaderColor), tableColorHover),
		thColorSorting: (0, seemly.composite)((0, seemly.composite)(cardColor, tableHeaderColor), tableColorHover),
		tdColor: cardColor,
		tdTextColor: textColor2,
		thTextColor: textColor1,
		thFontWeight: fontWeightStrong,
		thButtonColorHover: tableColorHover,
		thIconColor: iconColor,
		thIconColorActive: primaryColor,
		borderColorModal: (0, seemly.composite)(modalColor, dividerColor),
		tdColorHoverModal: (0, seemly.composite)(modalColor, tableColorHover),
		tdColorSortingModal: (0, seemly.composite)(modalColor, tableColorHover),
		tdColorStripedModal: (0, seemly.composite)(modalColor, tableColorStriped),
		thColorModal: (0, seemly.composite)(modalColor, tableHeaderColor),
		thColorHoverModal: (0, seemly.composite)((0, seemly.composite)(modalColor, tableHeaderColor), tableColorHover),
		thColorSortingModal: (0, seemly.composite)((0, seemly.composite)(modalColor, tableHeaderColor), tableColorHover),
		tdColorModal: modalColor,
		borderColorPopover: (0, seemly.composite)(popoverColor, dividerColor),
		tdColorHoverPopover: (0, seemly.composite)(popoverColor, tableColorHover),
		tdColorSortingPopover: (0, seemly.composite)(popoverColor, tableColorHover),
		tdColorStripedPopover: (0, seemly.composite)(popoverColor, tableColorStriped),
		thColorPopover: (0, seemly.composite)(popoverColor, tableHeaderColor),
		thColorHoverPopover: (0, seemly.composite)((0, seemly.composite)(popoverColor, tableHeaderColor), tableColorHover),
		thColorSortingPopover: (0, seemly.composite)((0, seemly.composite)(popoverColor, tableHeaderColor), tableColorHover),
		tdColorPopover: popoverColor,
		boxShadowBefore: "inset -12px 0 8px -12px rgba(0, 0, 0, .18)",
		boxShadowAfter: "inset 12px 0 8px -12px rgba(0, 0, 0, .18)",
		loadingColor: primaryColor,
		loadingSize: heightSmall,
		opacityLoading: opacityDisabled
	};
}
const dataTableLight = require__mixins_use_theme.createTheme({
	name: "DataTable",
	common: require__styles_common_light,
	peers: {
		Button: require_button_styles_light.default,
		Checkbox: require_checkbox_styles_light.default,
		Radio: require_radio_styles_light,
		Pagination: require_pagination_styles_light.default,
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Empty: require_empty_styles_light.default,
		Popover: require_popover_styles_light.default,
		Ellipsis: require_ellipsis_styles_light,
		Dropdown: require_dropdown_styles_light.default
	},
	self
});
//#endregion
exports.default = dataTableLight;
exports.self = self;
