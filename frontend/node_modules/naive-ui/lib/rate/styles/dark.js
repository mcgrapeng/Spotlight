//#region src/rate/styles/dark.ts
const rateDark = {
	name: "Rate",
	common: require("../../_styles/common/dark.js"),
	self(vars) {
		const { railColor } = vars;
		return {
			itemColor: railColor,
			itemColorActive: "#CCAA33",
			itemSize: "20px",
			sizeSmall: "16px",
			sizeMedium: "20px",
			sizeLarge: "24px"
		};
	}
};
//#endregion
module.exports = rateDark;
