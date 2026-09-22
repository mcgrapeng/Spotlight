Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__styles_common_light = require("../../_styles/common/light.js");
const require_card_styles__common = require("./_common.js");
//#region src/card/styles/light.ts
function self(vars) {
	const { primaryColor, borderRadius, lineHeight, fontSize, cardColor, textColor2, textColor1, dividerColor, fontWeightStrong, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, modalColor, boxShadow1, popoverColor, actionColor } = vars;
	return {
		...require_card_styles__common,
		lineHeight,
		color: cardColor,
		colorModal: modalColor,
		colorPopover: popoverColor,
		colorTarget: primaryColor,
		colorEmbedded: actionColor,
		colorEmbeddedModal: actionColor,
		colorEmbeddedPopover: actionColor,
		textColor: textColor2,
		titleTextColor: textColor1,
		borderColor: dividerColor,
		actionColor,
		titleFontWeight: fontWeightStrong,
		closeColorHover,
		closeColorPressed,
		closeBorderRadius: borderRadius,
		closeIconColor,
		closeIconColorHover,
		closeIconColorPressed,
		fontSizeSmall: fontSize,
		fontSizeMedium: fontSize,
		fontSizeLarge: fontSize,
		fontSizeHuge: fontSize,
		boxShadow: boxShadow1,
		borderRadius
	};
}
const cardLight = {
	name: "Card",
	common: require__styles_common_light,
	self
};
//#endregion
exports.default = cardLight;
exports.self = self;
