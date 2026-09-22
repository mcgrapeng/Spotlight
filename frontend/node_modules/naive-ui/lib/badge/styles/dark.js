//#region src/badge/styles/dark.ts
const badgeDark = {
	name: "Badge",
	common: require("../../_styles/common/dark.js"),
	self(vars) {
		const { errorColorSuppl, infoColorSuppl, successColorSuppl, warningColorSuppl, fontFamily } = vars;
		return {
			color: errorColorSuppl,
			colorInfo: infoColorSuppl,
			colorSuccess: successColorSuppl,
			colorError: errorColorSuppl,
			colorWarning: warningColorSuppl,
			fontSize: "12px",
			fontFamily
		};
	}
};
//#endregion
module.exports = badgeDark;
