const require__styles_common_dark = require("../../_styles/common/dark.js");
const require__internal_scrollbar_styles_dark = require("../../_internal/scrollbar/styles/dark.js");
const require_empty_styles_dark = require("../../empty/styles/dark.js");
const require_input_styles_dark = require("../../input/styles/dark.js");
const require_button_styles_dark = require("../../button/styles/dark.js");
const require_checkbox_styles_dark = require("../../checkbox/styles/dark.js");
const require_transfer_styles__common = require("./_common.js");
//#region src/transfer/styles/dark.ts
const transferDark = {
	name: "Transfer",
	common: require__styles_common_dark,
	peers: {
		Checkbox: require_checkbox_styles_dark,
		Scrollbar: require__internal_scrollbar_styles_dark,
		Input: require_input_styles_dark,
		Empty: require_empty_styles_dark,
		Button: require_button_styles_dark
	},
	self(vars) {
		const { fontWeight, fontSizeLarge, fontSizeMedium, fontSizeSmall, heightLarge, heightMedium, borderRadius, inputColor, tableHeaderColor, textColor1, textColorDisabled, textColor2, textColor3, hoverColor, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, dividerColor } = vars;
		return {
			...require_transfer_styles__common,
			itemHeightSmall: heightMedium,
			itemHeightMedium: heightMedium,
			itemHeightLarge: heightLarge,
			fontSizeSmall,
			fontSizeMedium,
			fontSizeLarge,
			borderRadius,
			dividerColor,
			borderColor: "#0000",
			listColor: inputColor,
			headerColor: tableHeaderColor,
			titleTextColor: textColor1,
			titleTextColorDisabled: textColorDisabled,
			extraTextColor: textColor3,
			extraTextColorDisabled: textColorDisabled,
			itemTextColor: textColor2,
			itemTextColorDisabled: textColorDisabled,
			itemColorPending: hoverColor,
			titleFontWeight: fontWeight,
			closeColorHover,
			closeColorPressed,
			closeIconColor,
			closeIconColorHover,
			closeIconColorPressed
		};
	}
};
//#endregion
module.exports = transferDark;
