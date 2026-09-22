//#region src/_utils/naive/prop.ts
const smallerSizeMap = {
  tiny: "mini",
  small: "tiny",
  medium: "small",
  large: "medium",
  huge: "large"
};
const largerSizeMap = {
  tiny: "small",
  small: "medium",
  medium: "large",
  large: "huge"
};
function largerSize(size) {
  const result = largerSizeMap[size];
  if (result === void 0) throw new Error(`${size} has no larger size.`);
  return result;
}
function smallerSize(size) {
  const result = smallerSizeMap[size];
  if (result === void 0) throw new Error(`${size} has no smaller size.`);
  return result;
}
//#endregion
export { largerSize, smallerSize };