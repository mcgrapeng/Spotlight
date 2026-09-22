//#region src/watermark/styles/dark.ts
const watermarkDark = {
	name: "Watermark",
	common: require("../../_styles/common/dark.js"),
	self(vars) {
		const { fontFamily } = vars;
		return { fontFamily };
	}
};
//#endregion
module.exports = watermarkDark;
