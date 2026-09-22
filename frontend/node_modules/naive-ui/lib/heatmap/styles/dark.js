const require__styles_common_dark = require("../../_styles/common/dark.js");
const require_heatmap_styles_light = require("./light.js");
//#region src/heatmap/styles/dark.ts
const HeatmapDark = {
	name: "Heatmap",
	common: require__styles_common_dark,
	self(vars) {
		return {
			...require_heatmap_styles_light.self(vars),
			activeColors: [
				"#0d4429",
				"#006d32",
				"#26a641",
				"#39d353"
			],
			mininumColor: "rgba(255, 255, 255, 0.1)",
			loadingColorStart: "rgba(255, 255, 255, 0.12)",
			loadingColorEnd: "rgba(255, 255, 255, 0.18)"
		};
	}
};
//#endregion
module.exports = HeatmapDark;
