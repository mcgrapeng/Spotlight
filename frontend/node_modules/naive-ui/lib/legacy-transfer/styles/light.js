const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require__internal_scrollbar_styles_light = require("../../_internal/scrollbar/styles/light.js");
const require_empty_styles_light = require("../../empty/styles/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_checkbox_styles_light = require("../../checkbox/styles/light.js");
const require_legacy_transfer_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/legacy-transfer/styles/light.ts
function self(vars) {
	const { fontWeight, iconColorDisabled, iconColor, fontSizeLarge, fontSizeMedium, fontSizeSmall, heightLarge, heightMedium, heightSmall, borderRadius, cardColor, tableHeaderColor, textColor1, textColorDisabled, textColor2, borderColor, hoverColor } = vars;
	return {
		...require_legacy_transfer_styles__common,
		itemHeightSmall: heightSmall,
		itemHeightMedium: heightMedium,
		itemHeightLarge: heightLarge,
		fontSizeSmall,
		fontSizeMedium,
		fontSizeLarge,
		borderRadius,
		borderColor,
		listColor: cardColor,
		headerColor: (0, seemly.composite)(cardColor, tableHeaderColor),
		titleTextColor: textColor1,
		titleTextColorDisabled: textColorDisabled,
		extraTextColor: textColor2,
		filterDividerColor: borderColor,
		itemTextColor: textColor2,
		itemTextColorDisabled: textColorDisabled,
		itemColorPending: hoverColor,
		titleFontWeight: fontWeight,
		iconColor,
		iconColorDisabled
	};
}
const transferLight = require__mixins_use_theme.createTheme({
	name: "Transfer",
	common: require__styles_common_light,
	peers: {
		Checkbox: require_checkbox_styles_light.default,
		Scrollbar: require__internal_scrollbar_styles_light.default,
		Input: require_input_styles_light,
		Empty: require_empty_styles_light.default,
		Button: require_button_styles_light.default
	},
	self
});
//#endregion
module.exports = transferLight;
