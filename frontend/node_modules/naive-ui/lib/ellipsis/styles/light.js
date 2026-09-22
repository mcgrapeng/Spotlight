const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
const require_tooltip_styles_light = require("../../tooltip/styles/light.js");
//#region src/ellipsis/styles/light.ts
const ellipsisLight = require__mixins_use_theme.createTheme({
	name: "Ellipsis",
	common: require__styles_common_light,
	peers: { Tooltip: require_tooltip_styles_light }
});
//#endregion
module.exports = ellipsisLight;
