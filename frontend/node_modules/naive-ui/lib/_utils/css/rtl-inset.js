Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let seemly = require("seemly");
//#region src/_utils/css/rtl-inset.ts
function rtlInset(inset) {
	const { left, right, top, bottom } = (0, seemly.getPadding)(inset);
	return `${top} ${left} ${bottom} ${right}`;
}
//#endregion
exports.rtlInset = rtlInset;
