//#region src/_utils/css/color-to-class.ts
function color2Class(color) {
  return color.replace(/#|\(|\)|,|\s|\./g, "_");
}
//#endregion
export { color2Class };