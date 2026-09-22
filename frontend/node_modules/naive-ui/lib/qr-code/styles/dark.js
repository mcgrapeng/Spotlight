//#region src/qr-code/styles/dark.ts
const qrcodeDark = {
	name: "QrCode",
	common: require("../../_styles/common/dark.js"),
	self: (vars) => {
		return { borderRadius: vars.borderRadius };
	}
};
//#endregion
module.exports = qrcodeDark;
