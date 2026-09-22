const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/watermark/styles/light.ts
const watermarkLight = require__mixins_use_theme.createTheme({
	name: "Watermark",
	common: require__styles_common_light,
	self(vars) {
		const { fontFamily } = vars;
		return { fontFamily };
	}
});
//#endregion
module.exports = watermarkLight;
