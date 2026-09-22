const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_popover_styles_light = require("../../popover/styles/light.js");
const require_tooltip_styles__common = require("./_common.js");
let seemly = require("seemly");
//#region src/tooltip/styles/light.ts
function self(vars) {
	const { borderRadius, boxShadow2, baseColor } = vars;
	return {
		...require_tooltip_styles__common,
		borderRadius,
		boxShadow: boxShadow2,
		color: (0, seemly.composite)(baseColor, "rgba(0, 0, 0, .85)"),
		textColor: baseColor
	};
}
const tooltipLight = require__mixins_use_theme.createTheme({
	name: "Tooltip",
	common: require__styles_common_light,
	peers: { Popover: require_popover_styles_light.default },
	self
});
//#endregion
module.exports = tooltipLight;
