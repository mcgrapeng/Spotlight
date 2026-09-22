Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require__styles_common_light = require("../../_styles/common/light.js");
//#region src/heatmap/styles/light.ts
function self(vars) {
	const { borderRadius, fontSizeMini, fontSizeTiny, fontSizeSmall, fontWeight, textColor2, cardColor, buttonColor2Hover } = vars;
	return {
		activeColors: [
			"#9be9a8",
			"#40c463",
			"#30a14e",
			"#216e39"
		],
		borderRadius,
		borderColor: cardColor,
		textColor: textColor2,
		mininumColor: buttonColor2Hover,
		fontWeight,
		loadingColorStart: "rgba(0, 0, 0, 0.06)",
		loadingColorEnd: "rgba(0, 0, 0, 0.12)",
		rectSizeSmall: "10px",
		rectSizeMedium: "11px",
		rectSizeLarge: "12px",
		borderRadiusSmall: "2px",
		borderRadiusMedium: "2px",
		borderRadiusLarge: "2px",
		xGapSmall: "2px",
		xGapMedium: "3px",
		xGapLarge: "3px",
		yGapSmall: "2px",
		yGapMedium: "3px",
		yGapLarge: "3px",
		fontSizeSmall: fontSizeTiny,
		fontSizeMedium: fontSizeMini,
		fontSizeLarge: fontSizeSmall
	};
}
const heatmapLight = require__mixins_use_theme.createTheme({
	name: "Heatmap",
	common: require__styles_common_light,
	self
});
//#endregion
exports.default = heatmapLight;
exports.self = self;
