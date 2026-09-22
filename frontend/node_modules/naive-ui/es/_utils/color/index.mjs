import { composite } from "seemly";
//#region src/_utils/color/index.ts
function createHoverColor(rgb) {
  return composite(rgb, [255, 255, 255, .16]);
}
function createPressedColor(rgb) {
  return composite(rgb, [0, 0, 0, .12]);
}
//#endregion
export { createHoverColor, createPressedColor };