//#region src/log/styles/dark.ts
const logDark = {
	name: "Log",
	common: require("../../_styles/common/dark.js"),
	peers: {
		Scrollbar: require("../../_internal/scrollbar/styles/dark.js"),
		Code: require("../../code/styles/dark.js")
	},
	self(vars) {
		const { textColor2, inputColor, fontSize, primaryColor } = vars;
		return {
			loaderFontSize: fontSize,
			loaderTextColor: textColor2,
			loaderColor: inputColor,
			loaderBorder: "1px solid #0000",
			loadingColor: primaryColor
		};
	}
};
//#endregion
module.exports = logDark;
