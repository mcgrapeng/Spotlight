//#region src/loading-bar/styles/dark.ts
const loadingBarDark = {
	name: "LoadingBar",
	common: require("../../_styles/common/dark.js"),
	self(vars) {
		const { primaryColor } = vars;
		return {
			colorError: "red",
			colorLoading: primaryColor,
			height: "2px"
		};
	}
};
//#endregion
module.exports = loadingBarDark;
