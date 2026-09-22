Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let seemly = require("seemly");
//#region src/_utils/color/index.ts
function createHoverColor(rgb) {
	return (0, seemly.composite)(rgb, [
		255,
		255,
		255,
		.16
	]);
}
function createPressedColor(rgb) {
	return (0, seemly.composite)(rgb, [
		0,
		0,
		0,
		.12
	]);
}
//#endregion
exports.createHoverColor = createHoverColor;
exports.createPressedColor = createPressedColor;
