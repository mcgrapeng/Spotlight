Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_button_styles_light = require("../../button/styles/light.js");
const require_progress_styles_light = require("../../progress/styles/light.js");
let seemly = require("seemly");
//#region src/upload/styles/light.ts
function self(vars) {
	const { iconColor, primaryColor, errorColor, textColor2, successColor, opacityDisabled, actionColor, borderColor, hoverColor, lineHeight, borderRadius, fontSize } = vars;
	return {
		fontSize,
		lineHeight,
		borderRadius,
		draggerColor: actionColor,
		draggerBorder: `1px dashed ${borderColor}`,
		draggerBorderHover: `1px dashed ${primaryColor}`,
		itemColorHover: hoverColor,
		itemColorHoverError: (0, seemly.changeColor)(errorColor, { alpha: .06 }),
		itemTextColor: textColor2,
		itemTextColorError: errorColor,
		itemTextColorSuccess: successColor,
		itemIconColor: iconColor,
		itemDisabledOpacity: opacityDisabled,
		itemBorderImageCardError: `1px solid ${errorColor}`,
		itemBorderImageCard: `1px solid ${borderColor}`
	};
}
const uploadLight = require__mixins_use_theme.createTheme({
	name: "Upload",
	common: require__styles_common_light,
	peers: {
		Button: require_button_styles_light.default,
		Progress: require_progress_styles_light.default
	},
	self
});
//#endregion
exports.default = uploadLight;
exports.self = self;
