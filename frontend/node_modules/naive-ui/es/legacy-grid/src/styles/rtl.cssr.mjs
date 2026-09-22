import { cB, cM } from "../../../_utils/cssr/index.mjs";
import { repeat } from "seemly";
//#region src/legacy-grid/src/styles/rtl.cssr.ts
const positionStyles = repeat(24, null).map((_, index) => {
  const prefixIndex = index + 1;
  const percent = `calc(100% / 24 * ${prefixIndex})`;
  return [cM(`${prefixIndex}-span`, {
    width: percent
  }), cM(`${prefixIndex}-offset`, {
    marginLeft: percent
  }), cM(`${prefixIndex}-push`, {
    right: percent,
    left: "unset"
  }), cM(`${prefixIndex}-pull`, {
    left: percent,
    right: "unset"
  })];
});
var rtl_cssr_default = cB("row", [cM("rtl", `
 direction: rtl;
 `, [cB("col", positionStyles)])]);
//#endregion
export { rtl_cssr_default as default };