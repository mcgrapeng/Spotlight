import { getPadding } from "seemly";
//#region src/_utils/css/rtl-inset.ts
function rtlInset(inset) {
  const {
    left,
    right,
    top,
    bottom
  } = getPadding(inset);
  return `${top} ${left} ${bottom} ${right}`;
}
//#endregion
export { rtlInset };