import { addDuplicateSlides, getDisplayIndex, getDisplayTotalView, getNextIndex, getPrevIndex, getRealIndex } from "./duplicatedLogic.mjs";
import { isTouchEvent } from "./event.mjs";
//#region src/carousel/src/utils/index.ts
function calculateSize(element, innerOnly) {
  let {
    offsetWidth: width,
    offsetHeight: height
  } = element;
  if (innerOnly) {
    const style = getComputedStyle(element);
    width = width - Number.parseFloat(style.getPropertyValue("padding-left")) - Number.parseFloat(style.getPropertyValue("padding-right"));
    height = height - Number.parseFloat(style.getPropertyValue("padding-top")) - Number.parseFloat(style.getPropertyValue("padding-bottom"));
  }
  return {
    width,
    height
  };
}
function clampValue(value, min, max) {
  return value < min ? min : value > max ? max : value;
}
function resolveSpeed(value) {
  if (value === void 0) return 0;
  if (typeof value === "number") return value;
  const match = value.match(/^((\d+)?\.?\d+?)(ms|s)?$/);
  if (match) {
    const [, number,, unit = "ms"] = match;
    return Number(number) * (unit === "ms" ? 1 : 1e3);
  }
  return 0;
}
//#endregion
export { addDuplicateSlides, calculateSize, clampValue, getDisplayIndex, getDisplayTotalView, getNextIndex, getPrevIndex, getRealIndex, isTouchEvent, resolveSpeed };