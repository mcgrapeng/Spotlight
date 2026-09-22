Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/css/color-to-class.ts
function color2Class(color) {
	return color.replace(/#|\(|\)|,|\s|\./g, "_");
}
//#endregion
exports.color2Class = color2Class;
