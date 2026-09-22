Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_input_styles_light = require("../../input/styles/light.js");
const require_popselect_styles_light = require("../../popselect/styles/light.js");
const require_select_styles_light = require("../../select/styles/light.js");
const require_pagination_styles__common = require("./_common.js");
//#region src/pagination/styles/light.ts
function self(vars) {
	const { textColor2, primaryColor, primaryColorHover, primaryColorPressed, inputColorDisabled, textColorDisabled, borderColor, borderRadius, fontSizeTiny, fontSizeSmall, fontSizeMedium, heightTiny, heightSmall, heightMedium } = vars;
	return {
		...require_pagination_styles__common,
		buttonColor: "#0000",
		buttonColorHover: "#0000",
		buttonColorPressed: "#0000",
		buttonBorder: `1px solid ${borderColor}`,
		buttonBorderHover: `1px solid ${borderColor}`,
		buttonBorderPressed: `1px solid ${borderColor}`,
		buttonIconColor: textColor2,
		buttonIconColorHover: textColor2,
		buttonIconColorPressed: textColor2,
		itemTextColor: textColor2,
		itemTextColorHover: primaryColorHover,
		itemTextColorPressed: primaryColorPressed,
		itemTextColorActive: primaryColor,
		itemTextColorDisabled: textColorDisabled,
		itemColor: "#0000",
		itemColorHover: "#0000",
		itemColorPressed: "#0000",
		itemColorActive: "#0000",
		itemColorActiveHover: "#0000",
		itemColorDisabled: inputColorDisabled,
		itemBorder: "1px solid #0000",
		itemBorderHover: "1px solid #0000",
		itemBorderPressed: "1px solid #0000",
		itemBorderActive: `1px solid ${primaryColor}`,
		itemBorderDisabled: `1px solid ${borderColor}`,
		itemBorderRadius: borderRadius,
		itemSizeSmall: heightTiny,
		itemSizeMedium: heightSmall,
		itemSizeLarge: heightMedium,
		itemFontSizeSmall: fontSizeTiny,
		itemFontSizeMedium: fontSizeSmall,
		itemFontSizeLarge: fontSizeMedium,
		jumperFontSizeSmall: fontSizeTiny,
		jumperFontSizeMedium: fontSizeSmall,
		jumperFontSizeLarge: fontSizeMedium,
		jumperTextColor: textColor2,
		jumperTextColorDisabled: textColorDisabled
	};
}
const paginationLight = require__mixins_use_theme.createTheme({
	name: "Pagination",
	common: require__styles_common_light,
	peers: {
		Select: require_select_styles_light.default,
		Input: require_input_styles_light,
		Popselect: require_popselect_styles_light.default
	},
	self
});
//#endregion
exports.default = paginationLight;
exports.self = self;
